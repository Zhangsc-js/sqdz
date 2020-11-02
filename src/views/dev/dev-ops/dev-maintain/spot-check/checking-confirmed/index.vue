<template>
  <el-container style="padding-top:24px;height: 100%">
    <div style="width: 100%;">
      <el-form inline ref="queryForm" :model="queryForm" style="margin-left:20px">
        <el-row>
          <el-form-item label="计划时间" prop="planTime">
            <el-date-picker
              prop="planId"
              v-model="queryForm.planTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="计划开始"
              end-placeholder="计划结束"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="点检计划" prop="planId">
            <el-select v-model="queryForm.planId" clearable>
              <el-option
                v-for="item in options4"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="getData(1)">查询</el-button>
            <el-button
              href="javascript:void(0)"
              @click="clearSearchBox"
              type="primary"
              icon="el-icon-refresh-left"
            >重置</el-button>
            <el-button type="text" @click="showMore=!showMore">
              {{ showMore ? '收起' : '展开' }}
              <i class="el-icon-arrow-down" />
            </el-button>
          </el-form-item>
      </el-row>
        <el-row v-show="showMore">
        <el-form-item label="点检状态" prop="status">
          <el-select v-model="queryForm.status" prop="status" clearable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="点检结果" prop="result">
          <el-select v-model="queryForm.result" prop="result" clearable>
            <el-option
              v-for="item in options3"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报修状态" prop="isReport">
            <el-select v-model="queryForm.isReport" prop="isReport" clearable>
                <el-option
                    v-for="item in reportOpt"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="确认状态" prop="confirmed">
          <el-select v-model="queryForm.confirmed" prop="confirmed" clearable>
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        </el-row>
      </el-form>
      <el-table stripe border :data="tableData" style="width: 100%" height="calc(100% - 48px - 60px - 60px)">
        <el-table-column prop="checkingRecordNo" label="点检单号" align="center" width="120"></el-table-column>
        <el-table-column prop="plan.planName" label="任务名称" align="center" width="200"></el-table-column>
        <el-table-column prop="executor" :formatter="cellFormat" label="任务执行人" align="center" width="100"></el-table-column>
        <el-table-column prop="startTime" :formatter="formatter" label="实际开始" align="center" width="180"></el-table-column>
        <el-table-column prop="endTime" :formatter="formatter" label="实际完成" align="center" width="180"></el-table-column>
        <el-table-column prop="status" label="点检状态" align="center" width="100">
          <template v-slot="scope">
            <span v-if="scope.row.status == 1">
              <jt-badge status="success" textValue="已完成" />
            </span>
            <span v-else-if="scope.row.status == 2">
              <jt-badge status="error" textValue="已过期" />
            </span>
            <span v-else-if="scope.row.status == 0">
              <jt-badge status="processing" textValue="执行中" />
            </span>
            <span v-else-if="scope.row.status == 3">
              <jt-badge status="warning" textValue="超期完成" />
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="result" label="点检结果" align="center" width="100">
          <template v-slot="scope">
            <span v-if="scope.row.result == 1">
              <jt-badge status="success" textValue="无异常" />
            </span>
            <span v-else-if="scope.row.result == 2">
              <jt-badge status="error" textValue="有异常" />
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="isReport" label="报修状态" align="center" width="100">
          <template v-slot="scope">
            <span v-if="scope.row.isReport == 0">{{'未全部报修'}}</span>
            <span v-else-if="scope.row.isReport == 1">{{'已全部报修'}}</span>
          </template>
        </el-table-column>
          <el-table-column prop="planStartTime" :formatter="formatter" label="计划开始" align="center" width="180"></el-table-column>
          <el-table-column prop="planEndTime" :formatter="formatter" label="计划截止" align="center" width="180"></el-table-column>
        <el-table-column prop="confirmed" label="确认状态" align="center" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.confirmed == 1">已确认</span>
            <span v-if="scope.row.confirmed == 0">未确认</span>
          </template>
        </el-table-column>
        <el-table-column prop="confirmUsername" label="确认人" align="center" width="100"></el-table-column>
        <el-table-column prop="confirmTime" :formatter="formatter" label="确认时间" align="center"></el-table-column>
        <el-table-column
          v-if="hasBtn([
            'DEV-OPS-CHECK-COMFIRMED-MODIFY',
            'DEV-OPS-CHECK-PLAN-TEMP-DELETE'
            ])"
          fixed="right"
          align="center"
          label="操作"
          width="170px">
          <template v-slot="scope">
            <el-button type="text" size="small" @click="detailsRecord(scope.row)">详情</el-button>
            <el-button
              v-has="'DEV-OPS-CHECK-COMFIRMED-MODIFY'"
              v-if="scope.row.status == 0"
              type="text"
              size="small"
              @click="modifyExecutor(scope.row)"
            >变更</el-button>
            <el-button
              v-has="'DEV-OPS-CHECK-COMFIRMED-REPORT'"
              v-if="scope.row.isReport == 0"
              type="text"
              size="small"
              @click="reportToOps(scope.row)"
            >报修</el-button>
            <el-button
              v-has="'DEV-OPS-CHECK-COMFIRMED-COMFIRM'"
              v-if="scope.row.confirmed == 0 && scope.row.status"
              type="text"
              size="small"
              @click="confirmRecord(scope.row)"
            >确认</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="fr batch-btn-padding">
        <Pagination
          :total="total"
          :page.sync="page.pageNum"
          :limit.sync="page.pageSize"
          @pagination="getData"
        />
      </div>
    </div>
    <el-dialog title="详情" :visible.sync="dialogVisible" width="65%">
      <record-item :recordNo="checkingRecordNo" style="height: 60vh;overflow: auto;" />
    </el-dialog>
    <el-dialog title="报修维修部" :visible.sync="reportDialogVisible" width="65%">
      <repair-report
        :recordNo="checkingRecordNo"
        @hidenDialog="hidenDialog"
        style="height: 60vh;overflow: auto;"
      />
    </el-dialog>
    <el-dialog title="变更执行人" :visible.sync="modifyDialogVisible" width="25%">
      <el-form
        ref="selectRow"
        :model="selectRow"
        label-width="90px"
        style="height: 10vh;overflow: auto;"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="任务执行人" prop="executor">
              <el-select v-model="selectRow.executor" prop="executor" placeholder="请选择任务执行人">
                <el-option
                  v-for="item in userMaps"
                  :key="item.code"
                  :label="item.label"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button icon="el-icon-check" type="primary" @click="saveModify()">保存</el-button>
        <el-button href="javascript:void(0)" @click="modifyDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>
<script>
import Pagination from "@/components/Pagination";
import RecordItem from "./record-item";
import RepairReport from "./repairReport";
import JtBadge from "@/components/JtBadge";

import {
  getCheckingRecords,
  updateCheckingRecord,
  getCheckingUserMap,
  getCheckingPlanMap
 } from "@/api/device";

import {
  isEmptyArray,
  isEmpty,
  simpleDateFormat,
  hasBtn } from "@/utils/index";

export default {
  name: "CheckingConfirmed",
  components: {
    Pagination,
    RecordItem,
    JtBadge,
    RepairReport
  },
  data() {
    return {
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      queryForm: {
        planId: null,
        status: -1,
        confirmed: null,
        planTime: [],
        result: null,
        isReport: ""
      },
      batchBtnVisibles: true,
      tableData: [],
      dialogVisible: false,
      checkingRecordNo: null,
      userMaps: [],
      selectRow: {},
      modifyDialogVisible: false,
      reportDialogVisible: false,
      options: [
        {
          label: "全部",
          value: -1
        },
        {
          label: "执行中",
          value: 0
        },
        {
          label: "已完成",
          value: 1
        },
        {
          label: "已过期",
          value: 2
        },
        {
          label: "超期完成",
          value: 3
        }
      ],
      options2: [
        {
          label: "未确认",
          value: 0
        },
        {
          label: "已确认",
          value: 1
        }
      ],
      options3: [
        {
          label: "有异常",
          value: 2
        },
        {
          label: "无异常",
          value: 1
        }
      ],
    reportOpt: [
        {
            label: "未全部报修",
            value: 0
        },
        {
            label: "已全部报修",
            value: 1
        }
    ],
      options4: [],
      showMore: false
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getUserMap();
      this.getData();
      this.getPlanMap()
    });
  },
  methods: {
    hasBtn,
    getData(pageNum) {
      if (pageNum === 1) {
        this.page.pageNum = pageNum;
      }
      if (!this.queryForm.planTime) {
        this.queryForm.planTime = ["", ""];
      }
      let planStartTime = this.queryForm.planTime[0]
        ? simpleDateFormat(this.queryForm.planTime[0], "yyyy-MM-dd HH:mm:ss")
        : "";
      let planEndTime = this.queryForm.planTime[1]
        ? simpleDateFormat(this.queryForm.planTime[1], "yyyy-MM-dd HH:mm:ss")
        : "";
      let param = Object.assign({}, this.queryForm);
      if (this.queryForm.status == -1) {
        delete param.status;
      }
      delete param.planTime
      const params = {
        ...param,
        ...this.page,
        planStartTime: planStartTime,
        planEndTime: planEndTime
      };
      getCheckingRecords(params)
        .then(response => {
          const result = response.data;
          if (result.success && result.data) {
            this.tableData = response.data.data.rows;
            this.total = response.data.data.total;
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    getPlanMap() {
      getCheckingPlanMap().then(res => {
        const result = res.data
        if (result.success) {
          this.options4 = result.data
        } else {
          this.$message.error(result.message)
        }
      })
    },
    getUserMap() {
      getCheckingUserMap()
        .then(response => {
          const result = response.data;
          if (result.success) {
            this.userMaps = result.data;
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    detailsRecord(row) {
      this.dialogVisible = true;
      this.checkingRecordNo = row.checkingRecordNo;
    },
    reportToOps(row) {
      this.reportDialogVisible = true;
      this.checkingRecordNo = row.checkingRecordNo;
    },
    confirmRecord(row) {
      if (row) {
        const form = Object.assign(row, { confirmed: 1 });
        updateCheckingRecord(form)
          .then(response => {
            const result = response.data;
            if (result.success) {
              this.$message.success("已确认");
              this.getData();
            } else {
              this.$message.error(result.message);
            }
          })
          .catch(e => {
            this.$message.error(e.message);
          });
      }
    },
    modifyExecutor(row) {
      this.modifyDialogVisible = true;
      this.selectRow = Object.assign({}, row);
    },
    saveModify() {
      updateCheckingRecord(this.selectRow)
        .then(response => {
          const result = response.data;
          if (result.success) {
            this.modifyDialogVisible = false;
            this.$message.success("保存成功");
            this.getData();
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    hidenDialog() {
      this.dialogVisible = false;
      this.reportDialogVisible = false;
      this.getData();
    },
    clearSearchBox() {
      this.$refs["queryForm"].resetFields();
      this.getUserMap();
      this.getData();
    },
    cellFormat(r, c, v) {
      if (isEmptyArray(this.userMaps) || isEmpty(v)) {
        return v;
      }
      const el = this.userMaps.find(e => e.code == v);
      return el == undefined ? v : el.label;
    },
    formatter(r, c, v) {
      return simpleDateFormat(v, 'yyyy-MM-dd HH:mm')
    }
  }
};
</script>
<style lang="scss" scoped>
.el-form .el-col .el-button {
  margin: 12px 4px 0px 4px;
}
</style>
