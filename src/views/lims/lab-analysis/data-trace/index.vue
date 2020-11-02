<template>
  <div>
    <el-form
      ref="queryForm"
      :model="queryForm"
      :inline="true"
      label-width="100px"
      class="margin20 mb0"
    >
      <el-form-item label="送达时间" prop>
        <el-date-picker
          v-model="sendTimeRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="
                        val => {
                            changeDate(val, 'sendTime');
                        }
                    "
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="接收时间" prop>
        <el-date-picker
          v-model="receiveTimeRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="
                        val => {
                            changeDate(val, 'receiveTime');
                        }
                    "
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="审核时间" prop>
        <el-date-picker
          v-model="okTimeRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="
                        val => {
                            changeDate(val, 'okTime');
                        }
                    "
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="计划单号" prop="planCode">
        <el-input plain="true" v-model="queryForm.planCode" placeholder="请输入计划单号" />
      </el-form-item>
      <el-form-item label="任务单号" prop="scheduleCode">
        <el-input plain="true" v-model="queryForm.scheduleCode" placeholder="请输入任务单号" />
      </el-form-item>
      <el-form-item label="化验物料" prop="labProname">
        <el-input
          :maxlength="12"
          v-model="queryForm.labProname"
          plain="true"
          placeholder="请输入化验物料"
        />
      </el-form-item>
      <el-form-item label="车间" prop="workShop">
        <el-input :maxlength="12" v-model="queryForm.workShop" plain="true" placeholder="请输入车间" />
      </el-form-item>
      <el-form-item label="取样地点" prop="sampPlace">
        <el-input :maxlength="12" v-model="queryForm.sampPlace" plain="true" placeholder="请输入取样地点" />
      </el-form-item>
      <el-form-item label="收样地点" prop="receivePlace">
        <el-input
          :maxlength="12"
          v-model="queryForm.receivePlace"
          plain="true"
          placeholder="请输入收样地点"
        />
      </el-form-item>
      <el-form-item label="任务类型" prop="planType">
        <el-select
          v-model="queryForm.planType"
          maxlength="20"
          @change="getData(1)"
          placeholder="请选择任务类型"
        >
          <el-option label="来料" value="0"></el-option>
          <el-option label="定点" value="1"></el-option>
          <el-option label="临时" value="2"></el-option>
          <el-option label="复验" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="planType">
        <el-select
          v-model="queryForm.status"
          maxlength="20"
          @change="getData(1)"
          placeholder="请选择状态类型"
        >
          <el-option label="待取样" value="待取样"></el-option>
          <el-option label="待送达" value="待送达"></el-option>
          <el-option label="缺样" value="缺样"></el-option>
          <el-option label="确认缺样" value="确认缺样"></el-option>
          <el-option label="待确认" value="待确认"></el-option>
          <el-option label="化验中" value="化验中"></el-option>
          <el-option label="退审中" value="退审中"></el-option>
          <el-option label="审核中" value="审核中"></el-option>
          <el-option label="已完成" value="已完成"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          icon="el-icon-search"
          href="javascript:void(0)"
          type="primary"
          class="btn-b"
          @click="getData(1)"
        >查询</el-button>
        <el-button href="javascript:void(0)" class="btn-w" @click="clearSearchBox">清空</el-button>
      </el-form-item>
    </el-form>
    <div class="tableshadow margin20" style="width:calc(100% - 40px);padding-bottom:20px;">
      <el-table :data="tableData">
        <!-- <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-table
                            :data="scope.row.labSub"
                            @selection-change="selectChange"
                            :cell-class-name="setColor"
                        >
                            <el-table-column
                                type="selection"
                                width="55"
                            ></el-table-column>
                            <el-table-column
                                prop="labIndicName"
                                label="指标名"
                            ></el-table-column>
                            <el-table-column
                                prop="labTime"
                                label="化验时间"
                            ></el-table-column>
                            <el-table-column
                                prop="labOperatorName"
                                label="化验人员"
                            ></el-table-column>
                            <el-table-column
                                prop="typeTime"
                                label="录入时间"
                            ></el-table-column>
                            <el-table-column
                                prop="outindicData"
                                label="计算结果"
                            ></el-table-column>
                            <el-table-column
                                prop="reachStandard"
                                :formatter="statusFormat"
                                label="达标情况"
                            ></el-table-column>
                            <el-table-column
                                prop="remark"
                                label="备注"
                            ></el-table-column>
                            <el-table-column
                                label="操作"
                                width="180"
                                fixed="right"
                                align="center"
                                v-if="
                                    hasBtn([
                                        'LIMS-LAB-REVIEW-HISTORY',
                                        'LIMS-LAB-REVIEW-FAIL'
                                    ])
                                "
                            >
                                <template v-slot="scope">
                                    <el-button
                                        type="text"
                                        size="small"
                                        @click="popHistory(scope.row)"
                                        v-has="'LIMS-LAB-REVIEW-HISTORY'"
                                        >历史记录</el-button
                                    >
                                    <el-button
                                        type="text"
                                        size="small"
                                        @click="popRecheckHis(scope.row)"
                                        v-if="!!scope.row.anewCheck"
                                        v-has="'LIMS-LAB-REVIEW-FAIL'"
                                        >退审记录</el-button
                                    >
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
        </el-table-column>-->
        <el-table-column prop="planCode" label="计划单号" width="180"></el-table-column>
        <el-table-column prop="scheduleCode" label="任务单号" width="180"></el-table-column>
        <el-table-column prop="planType" :formatter="typeFormat" label="任务类型"></el-table-column>
        <el-table-column prop="labProname" show-overflow-tooltip label="化验物料"></el-table-column>
        <el-table-column prop="labIndicName" show-overflow-tooltip label="化验指标"></el-table-column>
        <el-table-column prop="workShop" label="车间"></el-table-column>
        <el-table-column prop="sampPlace" width="150" label="取样地点"></el-table-column>
        <el-table-column prop="actualTime" width="180" label="取样时间"></el-table-column>
        <el-table-column prop="receivePlace" width="180" label="收样地点"></el-table-column>
        <el-table-column prop="status" label="化验状态"></el-table-column>
        <el-table-column prop="sendTime" :formatter="dateFormat" width="180" label="送达时间"></el-table-column>
        <el-table-column prop="receiveTime" :formatter="dateFormat" width="180" label="接收时间"></el-table-column>
        <el-table-column prop="okTime" :formatter="dateFormat" width="180" label="审核时间"></el-table-column>
        <el-table-column label="是否到样" align="center">
          <template v-slot="scope">
            <el-tooltip placement="right" v-if="scope.row.ifSend">
              <div slot="content">
                取样小组：{{ scope.row.sampGroup }}
                <br />
                取样人员：{{ scope.row.sendPer }}
                <br />
              </div>
              <el-button class="color-green" type="text">是</el-button>
            </el-tooltip>
            <span class="color-red" v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column label="是否留存" align="center">
          <template v-slot="scope">
            <div v-if="scope.row.ifRestain">
              <el-tooltip placement="right" v-if="!!scope.row.actualTime">
                <div slot="content">
                  留存过期时间：{{
                  scope.row.restainExpiration
                  }}
                  <br />
                </div>
                <el-button class="color-green" type="text">是</el-button>
              </el-tooltip>
              <span v-else>是</span>
            </div>
            <span class="color-red" v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template v-slot="scope">
            <el-button type="text" v-if="scope.row.receiveTime" @click="popDetail(scope.row)">化验详情</el-button>
            <span v-else>/</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="height:32px;">
        <Pagination
          :total="total"
          :page.sync="page.pageNum"
          :limit.sync="page.pageSize"
          @pagination="getData"
        />
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" width="80%" title="化验详情">
      <el-table :data="tableDetail" :cell-class-name="setColor" style="margin-bottom:20px;">
        <el-table-column width="220" prop="labIndicName" label="指标名"></el-table-column>
        <el-table-column width="180" prop="labTime" label="化验时间"></el-table-column>
        <el-table-column prop="labOperatorName" label="化验人员"></el-table-column>
        <el-table-column width="180" prop="typeTime" label="录入时间"></el-table-column>
        <el-table-column prop="outindicData" label="计算结果"></el-table-column>
        <el-table-column prop="reachStandard" :formatter="statusFormat" label="达标情况"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column
          label="操作"
          width="180"
          fixed="right"
          align="center"
          v-if="
                        hasBtn([
                            'LIMS-LAB-REVIEW-HISTORY',
                            'LIMS-LAB-REVIEW-FAIL'
                        ])
                    "
        >
          <template v-slot="scope">
            <el-button
              type="text"
              size="small"
              @click="popHistory(scope.row)"
              v-has="'LIMS-LAB-REVIEW-HISTORY'"
            >历史记录</el-button>
            <el-button
              type="text"
              size="small"
              @click="popRecheckHis(scope.row)"
              v-if="!!scope.row.anewCheckLog"
              v-has="'LIMS-LAB-REVIEW-FAIL'"
            >退审记录</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      title="指标历史记录"
      :visible.sync="indicDialogVisible"
      width="80%"
      v-if="indicDialogVisible"
    >
      <indic-history @hidenDialog="hidenDialogHistory" :selItem="selIndic" />
    </el-dialog>
    <el-dialog title="退审记录" :visible.sync="recDialogVisible" width="80%" v-if="recDialogVisible">
      <refuse-history @hidenDialog="hidenDialogHistory" :selItem="selItem"></refuse-history>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
// import { getTaskListByInst } from "@/api/sys/activiti";
import indicHistory from "../data-review/indic-history";
import refuseHistory from "../data-review/refuse-history";
import { getAssignList, getScheduleDetailList } from "@/api/lims";
import { simpleDateFormat } from "@/utils/index";
import { hasBtn } from "@/utils/index";
export default {
  name: "data-trace",
  components: {
    Pagination,
    refuseHistory,
    indicHistory
  },
  data() {
    return {
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      tableData: [],
      getRowKeys(row) {
        return row.activiti.ID_;
      },
      expands: [],
      instList: [],
      historyList: [],
      queryForm: {
        labProname: "",
        planType: "",
        workShop: "",
        receivePlace: "",
        sampPlace: "",
        status: "",
        sendTimeStart: "",
        sendTimeEnd: "",
        receiveTimeStart: "",
        receiveTimeEnd: "",
        okTimeStart: "",
        okTimeEnd: "",
        planCode: "",
        scheduleCode: ""
      },
      sendTimeRange: [],
      receiveTimeRange: [],
      okTimeRange: [],
      dialogVisible: false,
      tableDetail: [],
      indicDialogVisible: false,
      recDialogVisible: false,
      selLab: {},
      selItem: {},
      setColor({ row, column, rowIndex, columnIndex }) {
        let className = "";
        const color = ["", "c-danger", "c-warning", "c-primary", "c-success"];
        if (column.property == "reachStandard") {
          className = color[row.reachStandard];
        }
        return className;
      }
      // assigneeList: [
      //     { id: 2011, name: "化验主任" },
      //     { id: 2010, name: "化验技术员" },
      //     { id: 1001, name: "化验班长" },
      //     { id: 8006, name: "复审班长" },
      //     { id: 8035, name: "复验主任" },
      //     { id: 2016, name: "复验技术员" }
      // ]
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    hasBtn,
    getData(page) {
      if (page === 1) this.page.pageNum = 1;
      let params = { ...this.page, ...this.queryForm };
      getAssignList(params)
        .then(res => {
          this.tableData = res.data.data.rows;
          this.total = res.data.data.total;
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    clearSearchBox() {
      this.queryForm = {
        labProname: "",
        planType: "",
        workShop: "",
        receivePlace: "",
        sampPlace: "",
        status: "",
        sendTimeStart: "",
        sendTimeEnd: "",
        receiveTimeStart: "",
        receiveTimeEnd: "",
        okTimeStart: "",
        okTimeEnd: "",
        planCode: "",
        scheduleCode: ""
      };
      this.sendTimeRange = [];
      this.receiveTimeRange = [];
      this.okTimeRange = [];
      this.getData(1);
    },
    selectChange(selection) {
      let refuseId = selection.map(item => {
        return item.labSubId;
      });
      this.refuseId = refuseId;
    },
    dateFormat(row, column, cellValue, index) {
      let res = "/";
      if (!!cellValue) {
        res = simpleDateFormat(new Date(cellValue), "yyyy-MM-dd  HH:mm:ss");
      }
      return res;
    },
    statusFormat(row, column) {
      let standards = ["", "不合格", "不合格", "合格", "合格"];
      return standards[row.reachStandard];
    },
    durationFormat(row, column, cellValue, index) {
      let time = "未结束";
      if (!!cellValue) {
        let duration = cellValue;
        time = "";
        let days = duration / 1000 / 60 / 60 / 24;
        let daysRound = Math.floor(days);
        let hours = duration / 1000 / 60 / 60 - 24 * daysRound;
        let hoursRound = Math.floor(hours);
        let minutes =
          duration / 1000 / 60 - 24 * 60 * daysRound - 60 * hoursRound;
        let minutesRound = Math.floor(minutes);
        let seconds =
          duration / 1000 -
          24 * 60 * 60 * daysRound -
          60 * 60 * hoursRound -
          60 * minutesRound;
        daysRound > 0 && (time += parseInt(daysRound) + "天");
        hoursRound > 0 && (time += parseInt(hoursRound) + "小时");
        minutesRound > 0 && (time += parseInt(minutesRound) + "分钟");
        seconds > 0 && (time += parseInt(seconds) + "秒");
      }
      return time;
    },
    expandChange(row, expandedRows) {
      if (this.expands.indexOf(row.schedule.scheduleId) >= 0) {
        //收起当前行
        this.expands.shift();
        return;
      } else {
        this.instList = [];
        this.historyList = [];
      }
      let self = this;
      getTaskListByInst({ PROCINSTID: row.schedule.scheduleId }).then(res => {
        self.instList = res.data.historicActivityInstances;
        self.historyList = res.data.HistoricVariableInstance;
        self.historyList.unshift({});
        self.historyList.push({});
        self.expands.shift();
        self.expands.push(row.activiti.ID_);
      });

      if (expandedRows.length > 1) {
        expandedRows.shift();
      }
    },
    popHistory(item) {
      this.selIndic = { ...item };
      this.selIndic.proName = this.selLab.labProname;
      this.selIndic.sampPlace = this.selLab.sampPlace;
      this.selIndic.planType = this.selLab.planType;
      this.selIndic.workShop = this.selLab.workShop;
      this.indicDialogVisible = true;
    },
    popRecheckHis(item) {
      this.selItem = item;
      this.recDialogVisible = true;
    },
    hidenDialogHistory() {
      this.selItem = [];
      this.recDialogVisible = false;
      this.indicDialogVisible = false;
    },
    typeFormat(row, column, cellValue, index) {
      let typeList = ["来料", "定点", "临时", "复验"];
      return typeList[cellValue];
    },
    changeDate(val, type) {
      if (!!val) {
        this.queryForm[type + "Start"] = val[0] + " 00:00:00";
        this.queryForm[type + "End"] = val[1] + " 23:59:59";
      } else {
        this.queryForm[type + "Start"] = "";
        this.queryForm[type + "End"] = "";
      }
    },
    popDetail(item) {
      this.selLab = item;
      getScheduleDetailList({ scheduleId: item.scheduleId }).then(res => {
        if (res.data.success) {
          this.tableDetail = res.data.data;
          this.dialogVisible = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  }
};
</script>

<style scoped></style>
