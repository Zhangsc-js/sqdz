<template>
  <!-- 菜单管理 -->
  <div class="menuManagement" style="height:calc(100% - 32px)">
    <!-- 表单 -->
    <el-row style="margin:20px">
      <el-button type="primary" @click="refresh">刷新</el-button>
      <el-button type="primary" @click="saveRow">保存</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="addCatalog">新增目录</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="addPage">新增页面</el-button>
    </el-row>
    <!-- 表格 -->
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" style="height:calc(100% - 50px)">
      <el-table
        :data="ruleForm.tableData"
        style="width: 100%;"
        row-key="id"
        border
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        highlight-current-row
        @row-click="rowClick"
        ref="singleTable"
        height="calc(100%)"
      >
        <el-table-column label="菜单名称" fixed width="300" class="left">
          <template slot-scope="scope">
            <i v-if="!scope.row.urlType" class="el-icon-folder"></i>
            <i v-else class="el-icon-reading"></i>
            <el-form-item
              :prop="'arr.' + scope.$index + '.name'"
              :rules="{ required: true, message: '请输入菜单名称', trigger: ['blur','change'] }"
              v-if="scope.row.isAdd||scope.row.seen"
              style="display:inline-block;width:70%"
            >
              <el-input
                style="display:inline-blcok"
                v-model="scope.row.name"
                @click.native="click(scope.row,scope.$index)"
              ></el-input>
            </el-form-item>
            <span v-else style="margin-left: 10px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="菜单编码" width="180" class="left">
          <template v-slot="{row,$index}">
            <el-form-item
              v-if="row.isAdd"
              :prop="'arr.' + $index + '.code'"
              :rules="{ required: true, message: '请输入菜单编码', trigger: ['blur','change'] }"
            >
              <el-input v-model="row.code" @click.native="click(row,$index)"></el-input>
            </el-form-item>
            <span v-else>{{row.code}}</span>
          </template>
        </el-table-column>
        <el-table-column label="文件路径" width="450" class="left">
          <template v-slot="{row,$index}">
            <el-form-item
              v-if="((row.isAdd&&row.isCatalog)||(row.seen&&row.isCatalog))"
              :prop="'arr.' + $index + '.component'"
              :rules="{ required: true, message: '请输入文件路径', trigger: ['blur','change'] }"
            >
              <el-input v-model="row.component" @click.native="click(row,$index)"></el-input>
            </el-form-item>
            <span v-else>{{row.component}}</span>
          </template>
        </el-table-column>
        <el-table-column label="访问类型" width="150" align="center" class="left">
          <template v-slot="{row,$index}">
            <el-form-item
              :prop="'arr.' + $index + '.urlType'"
              :rules="{ required: true, message: '请选择', trigger: ['blur','change'] }"
              v-if="row.seen&&row.urlType||row.isAdd&&row.urlType"
            >
              <el-select
                v-model="row.urlType"
                placeholder="请选择"
                @visible-change="click(row,$index)"
              >
                <el-option label="平台页面" value="1"></el-option>
                <el-option label="外部链接" value="2"></el-option>
              </el-select>
            </el-form-item>
            <span v-else>{{row.urlType=="1"?"平台页面":(row.urlType=="2"?"外部链接":'')}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="菜单路径" width="230" align="center">
                  <template v-slot="{row,$index}">
                    <el-form-item
                      :prop="'arr.' + $index + '.path'"
                      :rules="{ required: true, message: '请输入菜单路径', trigger: ['blur','change'] }"
                      v-if="row.seen||row.isAdd"
                    >
                      <el-input v-model="row.path" @click.native="click(row,$index)"></el-input>
                    </el-form-item>
                    <span v-else>{{row.path}}</span>
                  </template>
        </el-table-column>-->
        <el-table-column label="菜单图标" width="200" align="center">
          <template v-slot="{row,$index}">
            <el-form-item v-if="row.seen||row.isAdd">
              <el-select
                v-model="row.iconCode"
                placeholder="请选择图标"
                @visible-change="click(row,$index)"
              >
                <!-- <template v-slot='row'>
                                    <svg-icon :icon-class="row" class="icon_svg" />
                </template>-->
                <el-option v-for="(item,index) in icon" :key="index" :value="item.code">
                  <template>
                    <svg-icon :icon-class="item.code" class="icon_svg" />
                  </template>
                </el-option>
              </el-select>
            </el-form-item>
            <span v-else class="spanIcon">
              <svg-icon :icon-class="row.iconCode" class="icon_svg" />
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="450">
          <template v-slot="scope">
            <div v-if="scope.row.isShowbutton">
              <el-button type="text" @click="edit(scope.row)" v-show="!scope.row.seen">更新</el-button>
              <el-button type="text" @click="save(scope.row)" v-show="scope.row.seen">保存</el-button>
              <el-button type="text" @click="editCancel" v-if="scope.row.seen">取消</el-button>
              <el-button type="text" @click="dltPermission(scope.row.id)">删除</el-button>
              <el-button type="text" @click="move(scope.row.id)">移动</el-button>
              <el-button type="text" @click="moveUp(scope.row)">上移</el-button>
              <el-button type="text" @click="moveDown(scope.row)">下移</el-button>
              <el-button type="text" v-if="scope.row.urlType" @click="powerDialog(scope.row)">按钮权限</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-form>

    <el-dialog title="移动" :visible.sync="dialogVisible" width="40%">
      <el-row>
        <el-button type="primary" @click="saveParent">保存</el-button>
        <el-button icon="el-icon-close" @click="close">取消</el-button>
      </el-row>
      <el-tree
        :data="demo"
        :props="defaultProps"
        show-checkbox
        ref="treeForm"
        node-key="id"
        @check="handleCheckChange"
        check-strictly
        style="margin-top:20px"
        :expand-on-click-node="false"
      >
        <template v-slot="row">
          <span
            class="el-icon-folder"
            style="font-size:16px;margin-left:5px;color:#333"
          >{{row.data.label}}</span>
        </template>
      </el-tree>
    </el-dialog>

    <el-dialog title="按钮权限" :visible.sync="pointDialogVisible" width="60%" style="height:100%">
      <el-row>
        <el-button type="primary" icon="el-icon-plus" @click="powerDialogAdd">新增</el-button>
        <el-button
          type="danger"
          icon="el-icon-delete"
          @click="powerDialogDel"
          :disabled="disabled"
        >删除</el-button>
        <el-button :disabled="disabled" icon="el-icon-copy-document" type="primary" @click="copy">复制</el-button>
      </el-row>

      <el-table
        ref="multipleTable"
        :data="powerDialogData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="按钮编码">
          <template slot-scope="{row}">
            <el-input v-model="row.code" v-if="row.seen"></el-input>
            <span v-else>{{row.code}}</span>
          </template>
        </el-table-column>
        <el-table-column label="按钮名称">
          <template slot-scope="{row}">
            <el-input v-model="row.pointDesc" v-if="row.seen"></el-input>
            <span v-else>{{row.pointDesc}}</span>
          </template>
        </el-table-column>
        <el-table-column label="请求方法">
          <template slot-scope="{row}">
            <el-input v-model="row.apiMethod" v-if="row.seen"></el-input>
            <span v-else>{{row.apiMethod}}</span>
          </template>
        </el-table-column>
        <el-table-column label="请求路径">
          <template slot-scope="{row}">
            <el-input v-model="row.apiUrl" v-if="row.seen"></el-input>
            <span v-else>{{row.apiUrl}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="{row}">
            <el-button type="text" @click="powerDialogEdit(row)" v-if="!row.seen">更新</el-button>
            <el-button type="text" @click="powerDialogSave(row)" v-else>保存</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="复制权限" :visible.sync="buttonDialogVisible" width="40%">
      <el-row>
        <el-button type="primary" @click="saveCopy">保存</el-button>
        <el-button icon="el-icon-close" @click="close">取消</el-button>
      </el-row>
      <el-tree
        :data="demo"
        :props="defaultProps"
        show-checkbox
        ref="buttonTree"
        node-key="id"
        @check="buttonTreeChange"
        check-strictly
        style="margin-top:20px"
        :expand-on-click-node="false"
      >
        <template v-slot="row">
          <span
            class="el-icon-folder"
            style="font-size:16px;margin-left:5px;color:#333"
          >{{row.data.label}}</span>
        </template>
      </el-tree>
    </el-dialog>
  </div>
</template>

<script>
import {
  PermissonTree,
  uptPermission,
  dltPermission,
  addPermission,
  moveUp,
  moveDown,
  move,
  saveParent,
  buttonList,
  addButton,
  dltButton,
  copyList,
  dltPermissionDecide,
  copyButton
} from "@/api/sys";
import { getDictDetailList } from "@/api/sys/dict";
import store from "@/store";
import router, { resetRouter } from "@/router";

export default {
  data() {
    return {
      tableData: [],
      isCatalog: true,
      //   是否禁用
      isDisabled: true,
      //   当前行
      currentRow: [],
      //   新增的行
      rows: [],
      //父id
      pid: 0,
      dialogVisible: false,
      options: [],
      value: "", //父菜单编码值
      rowId: "", //菜单Id 跟换父菜单时有效
      pointDialogVisible: false,
      //   权限按钮对话框表格
      powerDialogData: [],
      //   当前选择的
      currentChecked: [],
      //菜单id,按钮权限时有效
      id: "",
      buttonDialogVisible: false,
      //   校验规则
      rules: {
        name: [
          {
            required: true,
            message: "请输入菜单名称",
            trigger: ["blur", "change"]
          }
        ]
      },
      demo: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      arr: [],
      selectId: "",
      icon: [],
      count: 0
    };
  },
  mounted() {
    this.init();

    getDictDetailList("ICON").then(res => {
      this.icon = res.data.data;
    });
  },
  methods: {
    init() {
      PermissonTree().then(response => {
        let data = response.data;
        if (data.success) {
          this.tableData = data.data.map(v => {
            this.$set(v, "seen", false);
            return v;
          });
        }
        this.arr = [];
        // this.handleObj(this.tableData);
        this.tableData.forEach(item => {
          this.handleObj(item);
        });
        if (this.count > 0) {
          resetRouter();
          // 更新左侧
          store.dispatch("GenerateRoutes").then(() => {
            router.addRoutes(store.getters.addRouters);
          });
        }
        this.count++;
      });
    },
    //   更新
    edit(row) {
      this.$set(row, "seen", true);
      if (row.urlType) {
        row.isCatalog = true;
      }
    },
    //
    save(row) {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          row.seen = false;
          uptPermission(row).then(response => {
            let data = response.data;
            if (data.success) {
              this.$message.success("保存成功！！");
              this.init();
            }
          });
        } else {
          this.$message.error("请输入正确信息");
        }
      });
    },
    // 点击某一行 变色
    rowClick(row) {
      this.currentRow = row;
      if (row.id != "") {
        this.pid = row.id;
      }
      if (!row.urlType && row.id) {
        this.isDisabled = false;
      } else {
        this.isDisabled = true;
      }
      this.selectId = row.id;
    },
    dltPermission(id) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //删除验证
          dltPermissionDecide(id).then(response => {
            let result = response.data.data;
            if (result) {
              this.$confirm("此菜单已分配给角色,是否继续删除？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              })
                .then(() => {
                  dltPermission(id).then(response => {
                    let result = response.data;
                    if (result) {
                      this.$message.success("删除成功！！");
                      this.init();
                    }
                  });
                })
                .catch(() => {
                  this.$message.info("已取消删除");
                });
            } else {
              dltPermission(id).then(response => {
                let result = response.data;
                if (result) {
                  this.$message.success("删除成功！！");
                  this.init();
                }
              });
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    // 新增目录
    addCatalog() {
      this.isCatalog = false;
      if (!this.currentRow.children) {
        this.$set(this.currentRow, "children", []);
      }
      this.currentRow.children.push({
        id: "",
        seen: false,
        isAdd: true,
        name: "",
        code: "",
        urlType: "",
        path: "",
        iconCode: "",
        isShowbutton: false,
        pid: this.pid,
        isCatalog: false
      });
      this.rows.push(
        this.currentRow.children[this.currentRow.children.length - 1]
      );
      let i = this.arr.findIndex(value => value.id == this.selectId);
      let obj = this.arr.find(value => value.id == this.selectId);
      if (obj.children) {
        i = i + obj.children.length;
      }
      this.arr.splice(i, 0, {
        id: +new Date(),
        seen: false,
        isAdd: true,
        name: "",
        code: "",
        type: "1",
        urlType: "1",
        path: "",
        iconCode: "",
        isShowbutton: false
      });
    },
    // 新增页面
    addPage() {
      if (!this.currentRow.children) {
        this.$set(this.currentRow, "children", []);
      }
      this.currentRow.children.push({
        id: "",
        seen: false,
        isAdd: true,
        name: "",
        code: "",
        type: "1",
        urlType: "1",
        path: "",
        iconCode: "",
        isShowbutton: false,
        pid: this.pid,
        isCatalog: true
      });
      this.rows.push(
        this.currentRow.children[this.currentRow.children.length - 1]
      );
      let i = this.arr.findIndex(value => value.id == this.selectId);
      let obj = this.arr.find(value => value.id == this.selectId);
      if (obj.children) {
        i = i + obj.children.length;
      }
      this.arr.splice(i, 0, {
        id: +new Date(),
        seen: false,
        isAdd: true,
        name: "",
        code: "",
        type: "1",
        urlType: "1",
        path: "",
        iconCode: "",
        isShowbutton: false
      });
    },
    // 保存新增
    saveRow() {
      this.isCatalog = true;
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.rows.forEach(item => {
            item.isAdd = false;
            item.isShowbutton = true;
          });
          // 把rows 传给后台
          addPermission(this.rows).then(response => {
            let data = response.data;
            if (data.success) {
              this.$message.success("新增成功");
              this.init();
            } else {
              this.$message.error(data.message);
            }
          });
          this.rows = [];
        } else {
          this.$message.error("请输入正确信息");
        }
      });
    },
    //上移
    moveUp(row) {
      let id = row.id;
      //   this.up(id, this.tableData);
      moveUp(id).then(response => {
        let data = response.data;
        if (data.success) {
          this.$message.success("上移成功！");
          this.init();
        }
      });
    },
    up(id, data) {
      data.forEach((item, index) => {
        if (item.id == id) {
          if (!item.sort) {
            this.$message.error("无法移动");
            return;
          }
          if (item.sort == 1) {
            this.$message.error("已在最上层");
            return;
          }
          data.splice(index - 1, 0, item);
          data.splice(index + 1, 1);
          data[index].sort++; //+
          data[index - 1].sort--;
          return;
        }
        if (item.children) {
          this.up(id, item.children);
        }
      });
    },
    down(id, data) {
      let flag = true;
      data.forEach((item, index) => {
        if (item.id == id && flag) {
          if (!item.sort) {
            this.$message.error("无法移动");
            flag = false;
            return;
          }
          if (!data[index + 1]) {
            this.$message.error("已在最下层");
            flag = false;
            return;
          }
          //   data.splice(index - 1, 0, item);
          //   data.splice(index + 1, 1);
          //   下移;
          data.splice(index + 2, 0, item);
          data.splice(index, 1);
          data[index].sort--; //--
          data[index + 1].sort++;
          flag = false;
          return false;
        } else {
          if (item.children) {
            this.down(id, item.children);
          }
        }
      });
    },
    //下移
    moveDown(row) {
      moveDown(row.id).then(response => {
        let data = response.data;
        if (data.success) {
          this.$message.success("下移成功！");
          this.init();
        }
      });
      //   let id = row.id;
      //   this.down(id, this.tableData);
    },
    move(id) {
      this.rowId = id;
      this.dialogVisible = true;
      move("1").then(response => {
        let data = response.data;
        if (data.success) {
          this.demo = data.data.options;
        }
      });
    },
    saveParent() {
      saveParent(this.rowId, this.value).then(response => {
        let data = response.data;
        if (data.success) {
          this.dialogVisible = false;
          this.init();
        }
      });
    },
    close() {
      this.dialogVisible = false;
      this.buttonDialogVisible = false;
    },
    // 权限按钮
    powerDialog(row) {
      this.id = row.id;
      this.pointDialogVisible = true;
      buttonList(row.id).then(response => {
        let data = response.data;
        if (data.success) {
          this.powerDialogData = data.data.map(v => {
            this.$set(v, "pid", row.id);
            this.$set(v, "seen", false);
            return v;
          });
        }
      });
    },
    handleSelectionChange(val) {
      this.currentChecked = [];
      const _this = this;
      val.forEach(element => {
        element.flag = true;
        _this.currentChecked.push(element.id);
      });
    },
    // 点击更新
    powerDialogEdit(row) {
      row.seen = !row.seen;
    },
    powerDialogSave(row) {
      row.seen = !row.seen;
      //, 发请求保存
      addButton(row).then(response => {
        let data = response.data;
        if (data.success) {
          this.$message.success("保存成功！！");
          const rows = {};
          rows.id = this.id;
          this.powerDialog(rows);
        } else {
          this.$message.error(data.message + ":" + data.data);
        }
      });
    },
    // 新增
    powerDialogAdd() {
      this.powerDialogData.unshift({
        seen: true,
        code: "",
        component: "",
        pointDesc: "",
        apiMethod: "",
        apiUrl: "",
        pid: this.id
      });
    },
    // 删除
    powerDialogDel() {
      dltButton(this.currentChecked).then(response => {
        let data = response.data;
        if (data.success) {
          this.$message.success("删除成功");
          const rows = {};
          rows.id = this.id;
          this.powerDialog(rows);
          this.init();
        }
      });
    },
    copy() {
      this.buttonDialogVisible = true;
      this.pointDialogVisible = false;
      move("2").then(response => {
        let data = response.data;
        if (data.success) {
          this.demo = data.data.options;
        }
      });
    },
    saveCopy() {
      copyButton(this.currentChecked, this.value).then(response => {
        let data = response.data;
        if (data.success) {
          this.$message.success("复制成功");
          this.buttonDialogVisible = false;
        }
      });
    },
    // 更新取消
    editCancel() {
      this.init();
    },
    handleCheckChange() {
      let parentArr = this.$refs.treeForm.getHalfCheckedKeys();
      let childeArr = this.$refs.treeForm.getCheckedKeys();
      let arr = childeArr.concat(parentArr);
      if (arr.length > 1) {
        this.$message.error("只能移动到一个目录下！！！");
        return;
      } else {
        this.value = arr[0];
      }
    },
    buttonTreeChange() {
      let parentArr = this.$refs.buttonTree.getHalfCheckedKeys();
      let childeArr = this.$refs.buttonTree.getCheckedKeys();
      let arr = childeArr.concat(parentArr);
      if (arr.length > 1) {
        this.$message.error("只能复制到一个页面下！！！");
        return;
      } else {
        this.value = arr[0];
        // this.copyDisabled =
      }
    },
    handleObj(data) {
      this.arr.push(data);
      for (let key in data) {
        if (key === "children") {
          for (var i = 0; i < data[key].length; i++) {
            this.arr.push(data[key][i]);
            this.handleObj(data[key][i]);
          }
        }
      }
    },
    click(row, index) {
      this.$set(this.arr, index, row);
    },
    // 刷新
    refresh() {
      this.init();
    }
  },
  computed: {
    ruleForm() {
      return {
        tableData: this.tableData,
        arr: this.arr
      };
    },
    disabled() {
      return this.currentChecked.length > 0 ? false : true;
    }
  }
};
</script>

<style>
/* 用来设置当前页面element全局table的内间距 */
.menuManagement .el-table__row td {
  padding: 0;
}

/* 用来设置当前页面element全局table 选中某行时的背景色*/
.menuManagement .el-table__body tr.current-row > td {
  background-color: #ccc !important;
  /* color: #f19944; */ /* 设置文字颜色，可以选择不设置 */
}

.menuManagement .el-dialog {
  height: 100%;
}

/* .el-select-dropdown__item{
        background-color: #41485B;
    }
     .el-select-dropdown__item:hover{
        background-color: #409EFF;
    } */
</style>
<style lang="scss" scoped>
.icon_svg {
  fill: #000000;
}
</style>

<style lang="scss">
.menuManagement .el-form-item {
  /* margin: 0; */
  margin-bottom: 12px;
}

.left .cell {
  text-align: left !important;
}
</style>


