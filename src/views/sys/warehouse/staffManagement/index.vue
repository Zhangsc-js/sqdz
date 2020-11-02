<template>
  <div class="staffManagement" style="height:100%">
    <!-- 表单主体 -->
    <el-form
      inline
      :model="queryForm"
      class="demo-form-inline"
      style="margin-left:15px"
      ref="queryForm"
    >
      <el-row>
        <el-form-item label="员工工号" prop="userCode">
          <el-input v-model="queryForm.userCode" placeholder="请输入员工工号"></el-input>
        </el-form-item>
        <el-form-item label="员工姓名" prop="userName">
          <el-input v-model="queryForm.userName" placeholder="请输入员工姓名"></el-input>
        </el-form-item>
        <el-form-item label="所属部门">
          <el-select v-model="queryForm.department" clearable filterable placeholder="请选择">
            <el-option
              v-for="item in departmentList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分配账号">
          <el-select v-model="queryForm.isHaveAccount" clearable placeholder="请选择">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getData('query')" icon="el-icon-search">查询</el-button>
          <el-button type="primary" @click="resetForm('queryForm')" icon="el-icon-refresh-left">重置</el-button>
        </el-form-item>
      </el-row>
      <!-- 新增行 -->
      <el-row style="margin:10px 0 ">
        <el-button type="primary" @click="add" v-has="'SYS-USER-ADD'" icon="el-icon-plus">新增</el-button>
        <el-button
          type="primary"
          @click="dltempyes"
          plain
          :disabled="hasDelObj"
          v-has="'SYS-USER-DELETE'"
          icon="el-icon-delete"
        >删除</el-button>
        <el-upload
          class="upload"
          action="/api/sys/empyes/importFlowOutput"
          :show-file-list="false"
          :headers="token"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :on-progress="progress"
        >
          <el-button type="primary" plain v-has="'SYS-USER-IMPORT'">导入</el-button>
        </el-upload>
        <el-button type="primary" @click="reset" plain v-has="'SYS-USER-PASSWORD'">重置密码</el-button>
        <el-button type="primary" plain @click="downloadTemplate()" v-has="'SYS-USER-EXPORT'">导入模板下载</el-button>
        <span class="defaultPass">(默认初始密码:123456)</span>
      </el-row>
    </el-form>
    <!-- 表格主体 -->
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      style="height:calc(100% - 102px - 74px)"
    >
      <el-table
        :data="ruleForm.tableData"
        stripe
        @selection-change="handleSelectionChange"
        height="100%"
        ref="tab"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="userCode" label="员工工号">
          <template v-slot="scope">
            <el-form-item
              :prop="'tableData.' + scope.$index + '.userCode'"
              :rules="rules.userCode"
              v-if="scope.row.isAdd"
            >
              <el-input v-model="scope.row.userCode"></el-input>
            </el-form-item>
            <span v-else>{{ scope.row.userCode }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="员工姓名">
          <template v-slot="scope">
            <el-form-item
              :prop="'tableData.' + scope.$index + '.userName'"
              :rules="rules.userName"
              v-if="scope.row.seen"
            >
              <el-input v-model="scope.row.userName"></el-input>
            </el-form-item>
            <span v-else>{{ scope.row.userName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="telephone" label="联系方式">
          <template v-slot="scope">
            <el-form-item
              :prop="'tableData.' + scope.$index + '.telephone'"
              :rules="rules.telephone"
              v-if="scope.row.seen"
            >
              <el-input v-model="scope.row.telephone"></el-input>
            </el-form-item>
            <span v-else>{{ scope.row.telephone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="企业微信号">
          <template v-slot="scope">
            <el-input v-model="scope.row.wechatNo" v-if="scope.row.seen"></el-input>
            <span v-else>{{ scope.row.wechatNo }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="department" label="所属部门">
          <template v-slot="scope">
            <span
              v-if="scope.row.seen"
              style="cursor: pointer;color:#409EFF"
              @click="selectDepart(scope.row,scope.$index)"
            >{{ scope.row.department?scope.row.department:'请选择部门' }}</span>
            <span v-else>{{ scope.row.department }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否在职">
          <template v-slot="scope">
            <el-form-item
              :prop="'tableData.' + scope.$index + '.isWorker'"
              :rules="rules.isWorker"
              v-if="scope.row.seen"
            >
              <el-select v-model="scope.row.isWorker">
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="2"></el-option>
              </el-select>
            </el-form-item>
            <span v-else>{{ scope.row.isWorker==1?"是":(scope.row.isWorker==2?"否":'') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="分配账号">
          <template v-slot="scope">
            <el-form-item
              :prop="'tableData.' + scope.$index + '.isHaveAccount'"
              :rules="rules.isWorker"
              v-if="scope.row.seen && scope.row.isAdd"
            >
              <el-select v-model="scope.row.isHaveAccount">
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
            <span
              v-else
            >{{ scope.row.isHaveAccount=='1'?"是":(scope.row.isHaveAccount=='0'?"否":'') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="220px"
          v-if="hasBtn(['SYS-USER-UPDATE','SYS-USER-ROLE'])"
        >
          <template v-slot="scope">
            <el-button
              type="text"
              v-show="!scope.row.visibleCancel"
              size="small"
              @click.stop="edit(scope.row)"
              v-has="'SYS-USER-UPDATE'"
            >更新</el-button>
            <el-button
              type="text"
              v-show="!scope.row.visibleCancel"
              size="small"
              @click.stop="changeAccount(scope.row)"
            >{{scope.row.isHaveAccount=='1'?'收回账号':'分配账号'}}</el-button>
            <el-button
              type="text"
              v-show="scope.row.visibleCancel"
              size="small"
              @click.stop="save(scope.row)"
            >保存</el-button>
            <el-button
              type="text"
              v-show="scope.row.visibleCancel"
              size="small"
              @click.stop="cancel(scope.row)"
            >取消</el-button>
            <el-button
              type="text"
              v-show="scope.row.id && !scope.row.visibleCancel && scope.row.isHaveAccount=='1'"
              size="small"
              @click.stop="assignRoles(scope.row.id)"
              v-has="'SYS-USER-ROLE'"
            >分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <!-- 对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogVisible" width="50%">
      <assignRoles @close="close" :id="id" :count="count"></assignRoles>
    </el-dialog>
    <!-- 分页 -->
    <pagination
      :total="total"
      :page.sync="page.current"
      :limit.sync="page.size"
      @pagination="getData"
    />

    <!-- 部门选择 -->
    <el-dialog @close="closeDialogDepart" title="部门选择" :visible.sync="dialogDepart" width="60%">
      <addDepart :labels="departIds" @saveDepart="saveDepart" :count="count"></addDepart>
    </el-dialog>
  </div>
</template>

<script>
import addDepart from "./addDepart";
import { hasBtn } from "@/utils/index";
import { getToken } from "@/utils/auth";
import { IMPORT_FECTORY } from "@/api/sys/dev";
import { saveAs } from "file-saver";
import assignRoles from "./assignRoles";
import Pagination from "@/components/Pagination";
import { resetQueryForm } from "@/utils/common";

import {
  getEmpyes,
  saveEmpyes,
  dltempyes,
  reset,
  downlowdEmpyesModelTemp,
  selectPartment,
  changeAccount
} from "@/api/sys";

export default {
  components: {
    assignRoles,
    Pagination,
    addDepart
  },
  data() {
    return {
      departIds: [],
      departmentList: [],
      dialogDepart: false,
      hasDelObj: true,
      count: 0,
      tableData: [],
      loading: null,
      queryForm: {
        userCode: "",
        userName: "",
        department: "",
        isHaveAccount: ""
      },
      page: {
        current: 1,
        size: 10
      },
      total: 0,
      fileUploadUrl: IMPORT_FECTORY,
      token: {
        Authorization: `Bearer ${getToken()}`
      },
      dialogVisible: false,
      ids: [],
      id: "",
      rules: {
        userCode: [
          {
            required: true,
            message: "请输入员工工号",
            trigger: ["blur", "change"]
          }
        ],
        userName: [
          {
            required: true,
            message: "请输入员工姓名",
            trigger: ["blur", "change"]
          }
        ],
        isWorker: [
          {
            required: true,
            message: "请选择是否在职",
            trigger: ["blur", "change"]
          }
        ],
        telephone: [
          {
            required: true,
            message: "请输入联系方式",
            trigger: ["blur", "change"]
          }
        ]
      },
      count: 0,
      index: null,
      flag: false
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    hasBtn,
    getData(code) {
      //查询重置当前页
      if (code === "query") {
        this.page.current = 1;
      }
      //获取部门下拉
      selectPartment().then(response => {
        let data = response.data;
        if (data.success) {
          this.departmentList = data.data;
        } else {
          this.$message.error(data.message + ":" + data.data);
        }
      });

      this.loading = true;
      const params = {
        ...this.page,
        ...this.queryForm
      };
      getEmpyes(params).then(response => {
        this.loading = false;
        let data = response.data;
        if (data.success) {
          this.tableData = data.data.rows.map(v => {
            this.$set(v, "visibleCancel", this.firstLoadEdit);
            this.$set(v, "seen", this.firstLoadEdit);
            if (v.isWorker) {
              v.isWorker = v.isWorker.toString();
            }
            return v;
          });
          this.total = data.data.total;
        }
      });
    },
    //   选择项发送变化触发
    handleSelectionChange(val) {
      this.ids.length = 0;
      const _this = this;
      if (val.length > 0) {
        this.hasDelObj = false;
      } else {
        this.hasDelObj = true;
      }
      val.forEach(element => {
        _this.ids.push(element.id);
      });
    },
    // 更新
    edit(row) {
      this.flag = false;
      row.seen = true;
      row.visibleCancel = true;
    },
    // 取消
    cancel() {
      // 初始化数据
      this.getData();
    },
    // 保存
    save(row) {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          (row.visibleCancel = false), (row.seen = false);
          //   表示 没有点开对话框
          let params = {};
          if (!this.flag) {
            params = { ...row };
          } else {
            params = {
              ...row,
              ids: this.departIds.join(",")
            };
          }
          saveEmpyes(params).then(response => {
            let data = response.data;
            if (data.success) {
              this.$message.success("保存成功！！！");
              this.getData();
            } else {
              this.getData();
              this.$message.error(
                response.data.message + ":" + response.data.data
              );
            }
          });
        } else {
          this.$message.error("请输入正确的信息");
        }
      });
    },
    // 分配角色
    assignRoles(id) {
      this.id = id;
      this.dialogVisible = true;
      this.count++;
    },
    // 新增
    add() {
      this.tableData.unshift({
        seen: true,
        isAdd: true,
        visibleCancel: true,
        isAdd: true,
        department: "请选择"
      });
    },
    // 导入成功
    uploadSuccess(response) {
      this.loading.close();
      if (response.success) {
        this.$message.success("导入成功");
        this.getData();
      } else {
        this.$message.error(response.data);
      }
    },
    saveDepart(ids, labels) {
      this.flag = true;
      this.tableData[this.index].department = labels.join(",");
      this.departIds = ids;
      this.dialogDepart = false;
    },
    // 导入失败
    uploadError(err) {
      this.loading.close();
      this.$message.error(err.message);
    },
    // 开始上传
    progress() {
      this.loading = this.$loading({
        lock: true,
        text: "上传中",
        background: "rgba(0, 0, 0, 0.7)"
      });
    },
    // 导出模板
    downloadTemplate() {
      downlowdEmpyesModelTemp()
        .then(response => {
          const result = response.data;
          if (result) {
            let data = new File([result], { type: "application/octet-stream" });
            saveAs(data, "员工管理.xlsx");
            // this.getData();
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    reset() {
      if (this.ids.length === 0) {
        this.$message.error("请选择用户");
        return;
      }
      this.$confirm("此操作将重置该选记录密码, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          reset(this.ids).then(response => {
            if (response.data.success) {
              this.$alert("", "密码重置成功", {
                message: "您的密码为:" + response.data.data,
                customClass: "alert"
              });
            } else
              this.$message.error(
                response.data.message + ":" + response.data.data
              );
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消重置"
          });
        });
    },
    // 对话框关闭
    close() {
      this.dialogVisible = false;
    },
    dltempyes() {
      if (this.ids.length === 0) {
        this.$message.error("请选择要删除的员工");
        return;
      }
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          dltempyes(this.ids).then(response => {
            if (response.data.success) {
              this.getData();
              this.$message.success("删除成功!");
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
    resetForm(form) {
      this.queryForm = {
        userCode: "",
        userName: "",
        department: "",
        isHaveAccount: ""
      };
      this.getData();
    },
    //部门选择
    selectDepart(row, index) {
      this.index = index;
      this.departIds = row.department ? row.department.split(",") : [];
      this.dialogDepart = true;
    },
    closeDialogDepart() {
      this.count++;
    },
    // 改变账号
    changeAccount(row) {
      changeAccount(row.id).then(resposnse => {
        let data = resposnse.data;
        if (data.success) {
          this.$message.success("操作成功");
          this.getData();
        } else {
          this.$message.error(data.message + ":" + data.data);
        }
      });
    }
  },
  computed: {
    ruleForm() {
      return { tableData: this.tableData };
    }
  }
};
</script>

<style scoped>
.upload {
  display: inline-block;
  margin: 0 5px;
}

.defaultPass {
  color: red;
  margin-left: 20px;
}
</style>
<style>
.staffManagement .el-dialog {
  /* height: 100%; */
}

.staffManagement .el-form-item {
  /* margin: 0; */
  margin-bottom: 12px;
}

.alert .el-message-box__content {
  font-size: 18px;
  font-weight: 700;
}
</style>

