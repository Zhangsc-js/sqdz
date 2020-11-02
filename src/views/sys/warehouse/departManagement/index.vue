<template>
  <!-- 部门管理 -->
  <div class="departmentManagement prod-config" style="height: 100%;">
    <el-container style="height: 100%">
      <el-aside width="250px" style="height: 100%" @click.right.native="clickAside">
        <el-tree
          :data="treeData"
          node-key="id"
          highlight-current
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
          style="height: 100%;"
          :default-expanded-keys="defaultExpanded"
          ref="tree"
        >
          <template v-slot="{data}">
            <span class="el-icon-folder" style="font-size:14px">{{data.label}}</span>
          </template>
        </el-tree>
      </el-aside>
      <div class style="flex:1;height: 100%;overflow:auto">
        <el-divider content-position="left">部门列表</el-divider>
        <!-- 部门列表表单 -->
        <el-form
          :inline="true"
          :model="listForm"
          class="demo-form-inline listForm"
          style="margin-left:30px"
          :rules="rules"
          ref="listForm"
        >
          <el-row>
            <el-form-item label="部门编码：" prop="departCode">
              <el-input
                :disabled="isAddDepart"
                :value="listForm.departCode"
                @input="e => listForm.departCode = validForbid(e)"
                placeholder="请输入部门编码"
              ></el-input>
            </el-form-item>
            <el-form-item label="部门名称：" prop="departName">
              <el-input v-model="listForm.departName" placeholder="请输入部门名称"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="上级部门：" prop="parentName">
              <el-input v-model="listForm.parentName" readonly @click.native="selectParent"></el-input>
            </el-form-item>
            <el-form-item label="　部门分类：" prop="departType">
              <el-select
                v-model="listForm.departType"
                placeholder="请选择"
                multiple
                collapse-tags
                filterable
                style="width:200px"
              >
                <el-option
                  v-for="item in deparment"
                  :key="item.code"
                  :label="item.label"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row style="margin:15px 0">
            <el-button
              type="primary"
              :disabled="isSave"
              @click="save"
              icon="el-icon-check"
              v-has="'SYS-ROLE-MUSAVE'"
            >保存</el-button>
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="addDepart"
              v-has="'SYS-DEPART-ADD'"
            >新增</el-button>
            <el-button
              @click="dltDepart"
              :disabled="!nodeId"
              v-has="'SYS-DEPART-DELETE'"
              icon="el-icon-delete"
              type="danger"
            >删除</el-button>
          </el-row>
        </el-form>
        <el-tabs v-model="activeName" type="card" style="height:calc(100% - 50px - 34px - 166px)">
          <el-tab-pane label="员工列表" name="1" style="height:100%">
            <!-- 人员列表 -->
            <el-table
              :data="tableData"
              stripe
              border
              style="width:auto;margin-left:1px;overflow:auto"
              ref="tableData"
              max-height="55vh"
              @selection-change="handleSelectionChange"
              height="calc(100% - 62px)"
            >
              <el-table-column type="selection" width="55" fixed></el-table-column>
              <el-table-column prop="userCode" label="员工工号" :key="random+'1'">
                <template v-slot="scope">
                  <span>{{ scope.row.userCode }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="userName" label="员工姓名">
                <template v-slot="scope">
                  <span>{{ scope.row.userName }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="telephone" label="联系方式">
                <template v-slot="scope">
                  <span>{{ scope.row.telephone }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="wechatNo" label="微信号">
                <template v-slot="scope">
                  <span>{{ scope.row.wechatNo }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="isMainLeader" label="主要负责人">
                <template v-slot="scope">
                  <el-select v-model="scope.row.isMainLeader" v-if="scope.row.seen">
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="0"></el-option>
                  </el-select>
                  <span v-else>{{ scope.row.isMainLeader==='0'?'否':"是" }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="isSecondLeader" label="次要负责人">
                <template v-slot="scope">
                  <el-select v-model="scope.row.isSecondLeader" v-if="scope.row.seen">
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="0"></el-option>
                  </el-select>
                  <span v-else>{{ scope.row.isSecondLeader==='0'?'否':"是" }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="220" fixed="right" align="center" :key="random">
                <template v-slot="scope">
                  <el-button type="text" v-if="!scope.row.seen" @click="edit(scope.row)">更新</el-button>
                  <el-button type="text" v-if="scope.row.seen" @click="rowSave(scope.row)">保存</el-button>
                  <el-button type="text" v-if="scope.row.seen" @click="cancel">取消</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 新增删除 -->
            <el-row style="padding:15px 30px;">
              <el-button
                :disabled="!nodeId"
                type="primary"
                @click="addTable"
                v-has="'SYS-DUSE-ADD'"
                icon="el-icon-plus"
              >新增</el-button>
              <el-button
                :disabled="!nodeId || tableData.length===0"
                type="danger"
                @click="delRow"
                v-has="'SYS-DUSE-DELETE'"
                icon="el-icon-delete"
              >删除</el-button>
            </el-row>
          </el-tab-pane>
          <!-- <el-tab-pane label="生产工序" name="2" style="height: 100%;" v-if="isWorkshop">
                        <proProcess :departId="nodeId" :activeName="activeName"></proProcess>
          </el-tab-pane>-->
          <el-tab-pane label="产线配置" name="2" style="height: 100%;" v-if="isWorkshop">
            <prod-line-config :departCode="nodeCode" :activeName="activeName"></prod-line-config>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 上级部门树形对话框 -->
      <el-dialog title="选择车间/产线" :visible.sync="dialogVisible" width="40%">
        <parent-tree
          ref="treeDialog"
          :treeData="treeData"
          :parentCode="listForm.parentCode"
          :nodeCode="nodeCode"
          @checkSelect="checkSelect"
        ></parent-tree>
      </el-dialog>
    </el-container>

    <el-dialog title="新增人员" @close="handleClose" :visible.sync="dialogFormVisible" width="65%">
      <staff-info @save="success" @flu="fresh()" :trigger="trigger" />
    </el-dialog>
  </div>
</template>

<script>
import StaffInfo from "@/views/ppc/workshop/staffInfo";
// import proProcess from "./productionProcess";
import prodLineConfig from "./prodLineConfig";
import parentTree from "./parentDialog";
import {
  departmentTree,
  queryDepartById,
  getEmpyesByDepartCode,
  addDepartUser,
  addDepartment,
  dltDepartment,
  dltDepartUser,
  uptDepartUser,
  getByDepartmentCode
} from "@/api/sys/";
import { getDictDetailList } from "@/api/sys/dict";
import { setDefaultExpanded } from "@/utils/common";

export default {
  components: {
    StaffInfo,
    // proProcess
    prodLineConfig,
    parentTree
  },
  data() {
    return {
      activeName: "1",
      deps: [],
      treeData: [],
      sltUser: [],
      sltDepartment: [],
      defaultExpanded: [],
      listForm: {
        departCode: "",
        departName: "",
        departType: [],
        parentCode: "",
        managerUserCode: ""
      },
      dialogVisible: false,
      //   表格数据
      tableData: [],
      rules: {
        departCode: [
          {
            required: true,
            message: "请输入部门编码",
            trigger: ["blur", "change"]
          }
        ],
        departName: [
          {
            required: true,
            message: "请输入部门名称",
            trigger: ["blur", "change"]
          }
        ],
        parentName: [
          {
            required: true,
            message: "请输入上级部门",
            trigger: ["blur", "change"]
          }
        ]
      },
      nodeId: "", //左侧被点击的树节点的id,
      nodeCode: "",
      isAddDepart: true, //判断部门编码是否禁用
      dialogFormVisible: false,
      deparment: null,
      empyesIds: [],
      trigger: 1,
      isWorkshop: false,
      random: Math.random().toFixed(2),
      childs: []
    };
  },
  created() {
    //部门分类
    getDictDetailList("DEPARTMENT_TYPE").then(res => {
      this.deparment = res.data.data;
    });

    this.init();
  },
  activated() {
    this.random = Math.random().toFixed(2);
  },
  methods: {
    init() {
      departmentTree().then(response => {
        let data = response.data;
        if (data.success) {
          this.treeData = data.data.treeData;
          this.sltDepartment = data.data.sltDepartment;
          // 默认展开第一个
          setDefaultExpanded(this);
        }
      });
    },
    handleNodeClick(val) {
      this.deps = [];
      this.listForm = {
        departCode: "",
        departName: "",
        departType: [],
        parentCode: "",
        managerUserCode: ""
      };
      this.isWorkshop = val.isWorkshop;
      this.nodeId = val.id;
      this.nodeCode = val.code;
      this.childs = [val.code];
      //部门详情
      queryDepartById(this.nodeId).then(response => {
        let data = response.data;
        if (data.success) {
          this.listForm = data.data;
          this.listForm.departType = this.listForm.departType
            .split(",")
            .filter(item => {
              return item != "";
            });
          getByDepartmentCode({
            departmentCode: this.listForm.parentCode
          }).then(res => {
            console.log(res);
            if (res.data.success) {
              this.$set(this.listForm, "parentName", res.data.data.departName);
            }
          });
        } else {
          this.$message.error(res.data.message + ":" + res.data.data);
        }
      });
      //   //部门下员工
      //   getEmpyesByDepartCode(this.nodeId).then(response => {
      //     let data = response.data;
      //     if (data.success) {
      //       this.tableData = data.data;
      //     }
      //   });
    },
    handleSelectionChange(val) {
      this.empyesIds = [];
      const _this = this;
      val.forEach(element => {
        element.flag = true;
        _this.empyesIds.push(element.id);
      });
    },
    delRow() {
      if (this.empyesIds.length === 0) {
        this.$message.error("请选择需要删除的员工");
        return;
      }
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          dltDepartUser(this.empyesIds).then(response => {
            let data = response.data;
            if (data.success) {
              this.$message.success("删除成功");
              //部门下员工
              getEmpyesByDepartCode(this.nodeId).then(response => {
                let data = response.data;
                if (data.success) {
                  this.tableData = data.data;
                }
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 部门新增
    addDepart() {
      this.isAddDepart = false;
      this.$refs["listForm"].resetFields();
      this.$refs["listForm"].validate(function() {});
      this.listForm = {
        departCode: "",
        departName: "",
        departType: [],
        parentCode: "",
        managerUserCode: ""
      };
      this.tableData = [];
      this.nodeId = "";
      this.nodeCode = "";
      // this.$refs.tree.setCurrentNode();
      console.log(this.$refs.tree);
      //   this.deps = this.sltDepartment;
    },
    dltDepart() {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          dltDepartment(this.nodeId).then(response => {
            let data = response.data;
            if (data.success) {
              this.$message.success("删除成功");
              this.init();
              //   this.handleNodeClick("");
              //清空人员列表数据
              this.tableData = [];
              //   清空列表
              this.listForm = {};
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    // 获取下级部门的code
    setDeps() {
      let flag = false;
      this.childs.forEach(item => {
        this.deps = this.deps.filter(v => {
          if (v.parentCode && v.parentCode.indexOf(item) != -1) {
            this.childs.push(v.code);
            flag = true;
          }
          return !v.parentCode || v.parentCode.indexOf(item) == -1;
        });
      });
      if (flag) {
        this.setDeps();
      }
    },
    // 保存
    save() {
      this.$refs["listForm"].validate(val => {
        if (val) {
          this.listForm.departType = this.listForm.departType.join(",");
          addDepartment(this.listForm).then(response => {
            let data = response.data;
            if (data.success) {
              this.$message.success("保存成功");
              this.init();
              this.listForm.departType = this.listForm.departType.split(",");
            } else {
              this.$message.error(data.message + ":" + data.data);
              this.listForm.departType = this.listForm.departType.split(",");
            }
          });
        } else {
          this.$message.error("请输入或选择正确信息");
        }
      });
    },
    // 表格的新增
    addTable() {
      this.dialogFormVisible = true;

      //部门下员工
      getEmpyesByDepartCode(this.nodeId).then(response => {
        let data = response.data;
        if (data.success) {
          this.tableData = data.data;
        }
      });
    },
    //新增员工
    success(userCodes) {
      let params = {
        departId: this.nodeId,
        userCodes: userCodes
      };
      addDepartUser(params).then(response => {
        let data = response.data;
        if (data.success) {
          const row = {
            id: this.nodeId
          };
          this.handleNodeClick(row);
          this.dialogFormVisible = false;
          this.cancel();
          this.$message.success("新增成功！！！");
        } else {
          this.$message.error(data.message + ":" + data.data);
        }
      });
    },
    fresh() {},
    handleClose() {
      this.trigger++;
    },
    edit(row) {
      this.$set(row, "seen", true);
    },
    rowSave(row) {
      uptDepartUser(row).then(response => {
        let data = response.data;
        if (data.success) {
          this.$message.success("修改成功！！");
          this.$set(row, "seen", false);
        } else {
          this.$message.error(data.message + ":" + data.data);
        }
      });
    },
    cancel() {
      //部门下员工
      getEmpyesByDepartCode(this.nodeId).then(response => {
        let data = response.data;
        if (data.success) {
          this.tableData = data.data;
        }
      });
    },
    // 上级部门选择
    selectParent() {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["treeDialog"].init();
      });
    },
    // 修改上级部门 确定
    checkSelect(checked) {
      this.dialogVisible = false;
      this.$set(this.listForm, "parentName", checked.label);
      this.$set(this.listForm, "parentCode", checked.code);
    }
  },
  computed: {
    isSave() {
      if (this.nodeId || !this.isAddDepart) {
        return false;
      } else {
        return true;
      }
    }
  },
  watch: {
    nodeId() {
      this.activeName = "1";
      if (this.nodeId) {
        //部门下员工
        getEmpyesByDepartCode(this.nodeId).then(response => {
          let data = response.data;
          if (data.success) {
            this.tableData = data.data;
          }
        });
      }
    },
    activeName() {
      if (this.nodeId && this.activeName === "1") {
        //部门下员工
        getEmpyesByDepartCode(this.nodeId).then(response => {
          let data = response.data;
          if (data.success) {
            this.tableData = data.data;
          }
        });
      }
    }
  }
};
</script>

<style scoped>
.listForm .el-form-item {
  margin: 10px;
}
</style>
<style>
.departmentManagement .el-tabs__content {
  height: calc(100% - 42px);
}
.departmentManagement .el-select {
  width: 250px;
}
.prod-config .el-tabs__content {
  overflow: auto;
}
</style>
