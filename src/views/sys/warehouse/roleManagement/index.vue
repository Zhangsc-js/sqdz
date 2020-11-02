<template>
  <!-- 角色管理 -->
  <div class="roleManagement" style="height:99%">
    <el-main class="firstMain">
      <!-- 表单 -->
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
        <el-row style="padding-left:30px">
          <el-form-item label="角色编码" prop="name">
            <el-input v-model="queryForm.name" placeholder></el-input>
          </el-form-item>
          <el-form-item label="角色说明" prop="description">
            <el-input v-model="queryForm.description" placeholder></el-input>
          </el-form-item>
          <el-form-item label="角色类型" prop="roleLevel">
            <el-select v-model="queryForm.roleLevel" placeholder>
              <el-option label="系统级" value="1"></el-option>
              <el-option label="用户级" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="init">查询</el-button>
            <el-button
              type="primary"
              icon="el-icon-refresh-left"
              @click="resetQuery('queryForm')"
            >重置</el-button>
          </el-form-item>
        </el-row>
        <!-- 新增 -->
        <el-row style="padding-left:15px">
          <el-button type="primary" icon="el-icon-plus" @click="add" v-has="'SYS-ROLE-ADD'">新增</el-button>
        </el-row>
      </el-form>
      <!-- 表格 -->
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" style="height:70%">
        <el-table
          :data="tableData"
          stripe
          style="width: 100%"
          @row-click="userList"
          height="100%"
          highlight-current-row
        >
          <el-table-column label="角色编码">
            <template v-slot="{row,$index}">
              <el-form-item
                :prop="'tableData.' + $index + '.name'"
                :rules="rules.name"
                v-if="row.seen"
              >
                <el-input v-model="row.name"></el-input>
              </el-form-item>
              <span v-else>{{row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="角色说明">
            <template v-slot="{row,$index}">
              <el-form-item
                :prop="'tableData.' + $index + '.description'"
                :rules="rules.name"
                v-if="row.seen"
              >
                <el-input v-model="row.description"></el-input>
              </el-form-item>
              <span v-else>{{row.description}}</span>
            </template>
          </el-table-column>
          <el-table-column label="角色类型">
            <template v-slot="{row,$index}">
              <el-form-item
                :prop="'tableData.' + $index + '.roleLevel'"
                :rules="rules.name"
                v-if="row.seen"
              >
                <el-select v-model="row.roleLevel" placeholder="请选择用户类型">
                  <el-option label="系统级" value="1"></el-option>
                  <el-option label="用户级" value="2"></el-option>
                </el-select>
              </el-form-item>
              <span v-else>{{row.roleLevel=="1"?'系统级':'用户级'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            fixed="right"
            width="120px"
            v-if="hasBtn(['SYS-ROLE-UPDATE','SYS-ROLE-DELETE'])"
          >
            <template v-slot="scope">
              <el-button
                type="text"
                v-if="!scope.row.visibleCancel"
                size="small"
                @click.stop="edit(scope.row)"
                v-has="'SYS-ROLE-UPDATE'"
              >更新</el-button>
              <el-button
                type="text"
                v-if="scope.row.visibleCancel"
                size="small"
                @click.stop="save(scope.row)"
              >保存</el-button>
              <el-button
                type="text"
                v-if="scope.row.visibleCancel"
                size="small"
                @click.stop="cancel(scope.row)"
              >取消</el-button>
              <el-button
                type="text"
                v-if="scope.row.roleLevel=='2' && !scope.row.visibleCancel"
                size="small"
                @click.stop="deleteRow(scope.row.id)"
                v-has="'SYS-ROLE-DELETE'"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </el-main>
    <el-main class="secondMain">
      <el-tabs @tab-click="tabClick" type="border-card" style="height:100%">
        <el-tab-pane label="用户列表" ids="user" style="height:100%">
          <el-row>
            <el-button
              type="primary"
              @click="userAdd"
              :disabled="hasRole"
              icon="el-icon-plus"
              v-has="'SYS-ROLE-UADD'"
            >新增</el-button>
            <el-button
              @click="dltempyes"
              :disabled="hasRoleDel"
              v-has="'SYS-ROLE-UERDLT'"
              icon="el-icon-delete"
              type="danger"
            >删除</el-button>
          </el-row>
          <!-- 表格 -->
          <el-table
            :data="userListData"
            stripe
            style="width: 100%"
            height="85%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="userCode" label="员工工号">
              <template v-slot="scope">
                <el-input v-model="scope.row.userCode" v-if="scope.row.seen"></el-input>
                <span v-else>{{ scope.row.userCode }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="userName" label="员工姓名">
              <template v-slot="scope">
                <el-input v-model="scope.row.userName" v-if="scope.row.seen"></el-input>
                <span v-else>{{ scope.row.userName }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="department" label="所属部门">
              <template v-slot="scope">
                <span v-if="scope.row.seen" style="cursor: pointer;">请选择</span>
                <span v-else>{{ scope.row.department }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="菜单列表--PC端" ids="pc" style="height:100%">
          <menuList
            :roleId="roleId"
            :label="label"
            :loginUserCode="loginUserCode"
            style="height:100%"
          ></menuList>
        </el-tab-pane>
        <el-tab-pane label="菜单列表--移动端" ids="mobile" style="height:100%">
          <mobileMenu
            :roleId="roleId"
            :label="label"
            :loginUserCode="loginUserCode"
            style="height:100%"
          ></mobileMenu>
        </el-tab-pane>
      </el-tabs>
    </el-main>
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="65%">
      <el-form
        inline
        :model="userQueryForm"
        class="demo-form-inline"
        style="margin-left:15px"
        ref="userQueryForm"
      >
        <el-row>
          <el-form-item label="员工工号" prop="userCode">
            <el-input v-model="userQueryForm.userCode" placeholder="请输入员工工号"></el-input>
          </el-form-item>
          <el-form-item label="员工姓名" prop="userName">
            <el-input v-model="userQueryForm.userName" placeholder="请输入员工姓名"></el-input>
          </el-form-item>
          <el-form-item label="所属部门" prop="department">
            <el-select v-model="userQueryForm.department" placeholder="请选择">
              <el-option
                v-for="item in departmentList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="userAdd('1')">查询</el-button>
            <el-button
              type="primary"
              icon="el-icon-refresh-left"
              @click="resetQuery('userQueryForm')"
            >重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <el-table :data="userData" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="userCode" label="工号"></el-table-column>
        <el-table-column prop="userName" label="姓名"></el-table-column>
      </el-table>
      <el-button :disabled="hasSelect" type="primary" @click="savePru">新增</el-button>
      <pagination
        :total="total"
        :page.sync="page.current"
        :limit.sync="page.size"
        @pagination="userAdd"
      />
    </el-dialog>
  </div>
</template>

<script>
import { hasBtn } from "@/utils/index";
import { getRole, dltRole, save, userList, savePru, dltPru } from "@/api/role";
import { getEmpyes, selectPartment } from "@/api/sys";
import Pagination from "@/components/Pagination";
import menuList from "./menuList";
import { resetQueryForm } from "@/utils/common";
import mobileMenu from "./mobileMenu";

export default {
  components: {
    Pagination,
    menuList,
    mobileMenu
  },
  data() {
    return {
      departmentList: [],
      tableData: [],
      queryForm: {
        name: "",
        description: "",
        roleLevel: ""
      },
      userQueryForm: {
        userCode: "",
        userName: "",
        department: "",
        isHaveAccount: "1"
      },
      userListData: [],
      dialogVisible: false,
      userData: [],
      roleId: "",
      userids: [],
      page: {
        current: 1,
        size: 10
      },
      loginUserCode: "",
      total: 0,
      rules: {
        name: [
          {
            required: true,
            message: "请输入活动名称",
            trigger: ["blur", "change"]
          }
        ]
      },
      label: "",
      hasSelect: true,
      hasRoleDel: true,
      sonList: []
    };
  },
  mounted() {
    this.loginUserCode = this.$store.getters.userCode;
    this.init();
    this.getDepartList();
  },

  methods: {
    hasBtn,
    init() {
      getRole(this.loginUserCode, this.queryForm).then(response => {
        let data = response.data;
        if (data.success) {
          this.tableData = data.data.map(v => {
            this.$set(v, "visibleCancel", this.firstLoadEdit);
            this.$set(v, "seen", this.firstLoadEdit);
            return v;
          });
        }
      });
    },
    getDepartList() {
      selectPartment().then(response => {
        let data = response.data;
        if (data.success) {
          this.departmentList = data.data;
        } else {
          this.$message.error(data.message + ":" + data.data);
        }
      });
    },
    tabClick(e) {
      //   this.label = e.label;
      this.label = e.$attrs.ids;
    },
    userList(row) {
      this.roleId = row.id;
      this.userListData = [];
      userList(row.id).then(response => {
        let data = response.data;
        if (data.success) {
          this.userListData = data.data;
        }
      });
    },
    //   更新
    edit(row) {
      (row.visibleCancel = true), (row.seen = true);
    },
    // 删除
    deleteRow(id) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          dltRole(id).then(response => {
            this.$message.success("删除成功！！");
            this.init();
          });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    // 取消
    cancel() {
      this.init();
    },
    save(row) {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          (row.seen = false), (row.visibleCancel = false);
          save(this.loginUserCode, row).then(response => {
            let data = response.data;
            if (data.success) {
              this.$message.success("保存成功！！");
              this.init();
            }
          });
        } else {
          this.$message.error("请输入正确的信息");
        }
      });
    },
    // 新增
    add() {
      this.tableData.unshift({
        seen: true,
        visibleCancel: true,
        name: "",
        description: "",
        roleLevel: ""
      });
    },
    // 勾选变化
    handleSelectionChange(val) {
      this.userids.length = 0;
      const _this = this;
      if (val.length > 0) {
        this.hasSelect = false;
      } else {
        this.hasSelect = true;
      }
      if (this.roleId && val.length > 0) {
        this.hasRoleDel = false;
      } else {
        this.hasRoleDel = true;
      }
      val.forEach(element => {
        _this.userids.push(element.userCode);
      });
    },
    dltempyes() {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          dltPru(this.userids, this.roleId).then(response => {
            if (response.data.success) {
              this.$message.success("删除成功!");
              const row = {};
              row.id = this.roleId;
              this.userList(row);
            } else
              this.$message.error(
                response.data.message + ":" + response.data.data
              );
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 用户列表新增
    userAdd(num) {
      if (num == 1) {
        this.page.current = 1;
      }
      this.dialogVisible = true;
      this.getUserListData();
    },
    getUserListData() {
      const params = {
        ...this.page,
        ...this.userQueryForm
      };
      getEmpyes(params).then(response => {
        let data = response.data;
        if (data.success) {
          this.userData = data.data.rows;
          this.total = data.data.total;
        }
      });
    },
    savePru() {
      if (this.userids.length == 0) {
        this.$message.error("请选择员工");
        return;
      }
      savePru(this.roleId, this.userids).then(response => {
        let data = response.data;
        if (data.success) {
          this.$message.success("新增成功");
          this.dialogVisible = false;
          const row = {};
          row.id = this.roleId;
          this.userList(row);
        }
      });
    },
    userListSave(row) {
      row.seen = false;
    },
    resetQuery(form) {
      let fun = form == "queryForm" ? "init" : "userAdd";
      resetQueryForm(this, form, fun);
    }
  },
  computed: {
    ruleForm() {
      return { tableData: this.tableData };
    },
    hasRole() {
      if (this.roleId) {
        return false;
      } else {
        return true;
      }
    }
  }
};
</script>

<style scoped lang='scss'>
.el-main {
  height: 48%;
}

.firstMain {
  margin-bottom: 2%;
}
</style>
<style lang="scss">
.secondMain .el-tabs__content {
  height: 89%;
}
.secondMain #pane-1 {
  height: 100%;
}

// .el-form-item__error{
//     position: relative;
// }
.roleManagement .el-form-item {
  /* margin: 0; */
  margin-bottom: 12px;
}
</style>
