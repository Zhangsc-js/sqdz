<template>
  <div class="primaryWarn">
    <!-- 表单 -->
    <el-form :inline="true" ref="warningForm" :model="warningForm" class="demo-form-inline">
      <el-row>
        <el-form-item label="报警方式">
          <el-select v-model="warningForm.warningType" placeholder="请选择报警方式" disabled>
            <el-option label="企业微信" value="1"></el-option>
            <el-option label="手机短信" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="响应方式" style="margin-left:20px" v-if="level=='2'?false:true">
          <el-select v-model="warningForm.responseType" placeholder="请选择响应方式">
            <el-option label="任一人响应后确认警报" value="2"></el-option>
            <el-option label="任一主响应人响应确认警报" value="3"></el-option>
            <el-option label="需全员响应" value="4"></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="报警保持" v-if="level=='2'?false:true">
          <el-col :span="6">
            <el-input type="number" v-model="warningForm.intervalTime"></el-input>
          </el-col>
          <el-col :span="18">
            <span class="text">*设定时间内持续异常报警，单位分钟，0立即报警</span>
          </el-col>
        </el-form-item>
        <el-form-item label="及时响应时间" v-if="level=='2'?true:false">
          <el-row>
            <el-col :span="6">
              <el-input type="number" min="0" v-model="warningForm.responseTime"></el-input>
            </el-col>
            <el-col :span="18">
              <span class="text">*设定时间内未完成响应则触发警报，单位分钟，0不触发</span>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="按时完成时间" v-if="level=='2'?true:false">
          <el-row>
            <el-col :span="6">
              <el-input type="number" min="0" v-model="warningForm.finishTime"></el-input>
            </el-col>
            <el-col :span="18">
              <span class="text">*设定时间内未处理完异常触发警报，单位小时，0不触发</span>
            </el-col>
          </el-row>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button type="primary" @click="detailSave">保存</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <!-- 分割线 -->
    <el-divider content-position="left">人员配置</el-divider>
    <!-- 表格 -->
    <el-table highlight-current-row :data="tableData" stripe height="50vh" ref="multipleTable">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="userCode" label="员工工号">
        <template v-slot="{row}">
          <el-input v-if="row.isAdd" v-model="row.userCode"></el-input>
          <span v-else>{{ row.userCode }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="员工姓名">
        <template v-slot="{row}">
          <el-input v-if="row.isAdd" v-model="row.userName"></el-input>
          <span v-else>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="userWx" label="微信号">
        <template v-slot="{row}">
          <el-input v-if="row.isAdd" v-model="row.userWx"></el-input>
          <span v-else>{{ row.userWx }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="isMainResponse" label="主响应人">
        <template v-slot="{row}">
          <!-- <el-input v-if="row.isAdd" v-model="scope.row.warningCode"></el-input> -->
          <el-select v-if="row.isAdd||row.seen" v-model="row.isMainResponse" placeholder="请选择">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="2"></el-option>
          </el-select>
          <span v-else>{{ row.isMainResponse==='1'?'是':'否' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" fixed="right" width="120">
        <template v-slot="scope">
          <el-button type="text" v-if="!scope.row.seen" size="small" @click="edit(scope.row)">更新</el-button>
          <el-button type="text" v-if="scope.row.seen" size="small" @click="save(scope.row)">保存</el-button>
          <el-button type="text" v-if="scope.row.seen" size="small" @click="cancel(scope.row)">取消</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :total="total"
      :page.sync="page.pageNum"
      :limit.sync="page.pageSize"
      @pagination="getPerson()"
    />
    <!-- 新增删除行 -->
    <el-row style="padding:20px">
      <el-button type="primary" icon="el-icon-plus" @click="personAdd" :disabled="isShow">新增</el-button>
      <el-button type="primary" plain icon="el-icon-delete" @click="personDel" :disabled="isShow">删除</el-button>
    </el-row>

    <el-dialog title="新增员工" :visible.sync="dialogVisible" width="65%" @close="doalogClose">
      <userInfo :count="count" @save="userSave"></userInfo>
    </el-dialog>
  </div>
</template>

<script>
import {
  detail,
  insertDetail,
  updateDetail,
  getWarningPerson,
  insertWarningPerson,
  updateWarningPerson,
  delWarningPersonById
} from "@/api/sys/warning";
import { isEmptyArray } from "@/utils";
import Pagination from "@/components/Pagination";
import userInfo from "./userInfo";

export default {
  components: {
    Pagination,
    userInfo
  },
  props: {
    code: {
      type: String,
      required: false
    },
    level: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      total: 0,
      page: {
        pageNum: 1,
        pageSize: 10
      },
      warningForm: {
        warningType: "1",
        responseType: null,
        intervalTime: null,
        warningLevel: null
      },
      tableData: [],
      dialogVisible: false,
      count: 0,
      isShow: true
    };
  },
  watch: {
    code() {
      if (this.code) {
        this.getDetail();
        this.getPerson();
      }
    },
    level() {
      if (this.level) {
        this.getDetail();
        this.getPerson();
      }
    }
  },
  methods: {
    getDetail() {
      const param = {
        warningCode: this.code,
        warningLevel: this.level
      };
      detail(param).then(res => {
        if (!isEmptyArray(res.data.data.rows)) {
          this.warningForm = res.data.data.rows[0];
          if (this.warningForm.id) {
            this.isShow = false;
          }
        } else {
          this.warningForm = {
            warningType: "1",
            responseType: null,
            intervalTime: null,
            warningLevel: this.level
          };
        }
      });
    },
    // 获取人员表格数据
    getPerson() {
      const param = {
        ...this.page,
        warningLevel: this.level,
        warningCode: this.code
      };
      getWarningPerson(param)
        .then(response => {
          const result = response.data;
          if (result.success) {
            this.total = result.data.total;
            this.tableData = result.data.rows;
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    // 详细信息修改保存
    detailSave() {
      this.warningForm.warningCode = this.code;
      if (this.warningForm.id) {
        updateDetail(this.warningForm)
          .then(response => {
            const result = response.data;
            if (result.success) {
              this.$message.success("保存成功");
            } else {
              this.$message.error(result.message);
            }
          })
          .catch(e => {
            this.$message.error(e.message);
          });
      } else {
        insertDetail(this.warningForm)
          .then(response => {
            const result = response.data;
            if (result.success) {
              this.$message.success("保存成功");
              this.getDetail();
            } else {
              this.$message.error(result.message);
            }
          })
          .catch(e => {
            this.$message.error(e.message);
          });
      }
    },
    // 人员新增
    personAdd() {
      this.dialogVisible = true;
    },
    // 人员删除
    personDel() {
      // 勾选人员的code
      if (this.$refs.multipleTable.selection.length > 0) {
        let arr = this.$refs.multipleTable.selection.map(item => item.id);
        this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            delWarningPersonById(arr).then(response => {
              const result = response.data;
              if (result.success) {
                this.$message.success("删除成功");
                // this.page.pageNum = 1;
                this.getPerson();
              } else {
                this.$message.error(result.message);
              }
            });
          })
          .catch(() => {
            this.$message.info("已取消删除");
          });
      }
    },
    // 更新
    edit(row) {
      this.$set(row, "seen", true);
    },
    // 保存
    save(row) {
      row.warningCode = this.code;
      row.warningLevel = this.level;
      if (row.id) {
        updateWarningPerson(row)
          .then(res => {
            const result = res.data;
            if (result.success) {
              this.$message.success("保存成功");
              this.getPerson();
            } else {
              this.$message.error(result.message);
            }
          })
          .catch(e => {
            this.$message.error(e.message);
          });
      }
    },
    // 取消
    cancel(row) {
      row.seen = false;
      // 初始化数据
    },
    // 关闭对话框
    doalogClose() {
      this.count++;
    },
    // 人员新增成功
    userSave(data) {
      let records = [];
      if (isEmptyArray(data)) {
        return;
      }
      for (const e of data) {
        records.push({
          warningCode: this.code,
          warningLevel: this.level,
          userCode: e.userCode
        });
      }
      insertWarningPerson(records)
        .then(res => {
          const result = res.data;
          if (result.success) {
            this.$message.success("保存成功");
            this.dialogVisible = false;
            this.getPerson();
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    }
  }
};
</script>

<style>
.primaryWarn .text {
  margin-left: 5px;
  color: red;
  font-size: 14px;
}
</style>
