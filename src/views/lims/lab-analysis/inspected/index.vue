<template>
  <div>
    <el-form
      ref="queryForm"
      :model="queryForm"
      :inline="true"
      label-width="100px"
      class="margin20 mb0"
    >
      <el-form-item label="审核完成时间" prop>
        <el-date-picker
          v-model="okTimeRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change=" val => {changeDate(val, 'okTime');}"
        ></el-date-picker>
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
      <el-form-item label="计划单号" prop="planCode">
        <el-input plain="true" v-model="queryForm.planCode" placeholder="请输入计划单号" />
      </el-form-item>
      <el-form-item label="任务单号" prop="scheduleCode">
        <el-input plain="true" v-model="queryForm.scheduleCode" placeholder="请输入任务单号" />
      </el-form-item>
      <el-form-item label="化验物料" prop="labProname">
        <el-input
          :maxlength="12"
          plain="true"
          v-model="queryForm.labProname"
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
      <el-form-item>
        <el-button
          icon="el-icon-search"
          href="javascript:void(0)"
          type="primary"
          class="btn-b"
          @click="getData(1)"
        >查询</el-button>
        <el-button href="javascript:void(0)" class="btn-w" @click="clearSearchBox">清空</el-button>
        <!-- <el-button type="primary" @click="addInput()" icon="el-icon-plus">新增</el-button> -->
      </el-form-item>
    </el-form>
    <div class="tableshadow margin20" style="width:calc(100% - 40px);padding:20px 0;">
      <el-table :data="tableData" ref="refTable">
        <el-table-column prop="planCode" width="170" align="center" label="计划单号"></el-table-column>
        <el-table-column prop="scheduleCode" width="170" align="center" label="任务单号"></el-table-column>
        <el-table-column prop="planType" :formatter="typeFormat" label="任务类型"></el-table-column>
        <el-table-column prop="labProname" label="化验物料"></el-table-column>
        <el-table-column prop="workShop" label="车间"></el-table-column>
        <el-table-column prop="sampPlace" label="取样地点"></el-table-column>
        <el-table-column prop="receivePlace" label="收样地点"></el-table-column>
        <el-table-column prop="sendTime" width="180" :formatter="dateFormat" label="送达时间"></el-table-column>
        <el-table-column prop="receiveTime" width="180" :formatter="dateFormat" label="接收时间"></el-table-column>
        <el-table-column
          prop="okTime"
          width="180"
          :formatter="dateFormat"
          label="审核完成时间"
        ></el-table-column>
        <el-table-column label="操作" width="100" fixed="right" align="center">
          <template v-slot="scope">
            <el-button type="text" size="small" @click="popDetail(scope.row)">化验详情</el-button>
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
    <el-dialog title="化验详情" :visible.sync="dialogVisible" width="80%" v-if="dialogVisible">
      <review-detail
        :selItem="selItem"
        @close="hiddenDialog"
        @getData="getData"
        :detailType="'recheck'"
      />
    </el-dialog>
    <!-- <el-dialog
      title="选择实验室"
      :visible.sync="dialogLabVisible"
      width="300px"
      v-if="dialogLabVisible"
      @close="hidenDialog"
    >
      <el-select v-model="selLab" placeholder="请选择">
        <el-option v-for="item in labList" :key="item.proId" :label="item.labName" :value="item"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hidenDialog">取 消</el-button>
        <el-button type="primary" @click="recheck">确 定</el-button>
      </span>
    </el-dialog>-->
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import Result from "./result";
import { getInspected, applyRecheck } from "@/api/lims";
import { simpleDateFormat } from "@/utils/index";
import refuseHistory from "@/views/lims/lab-analysis/data-review/refuse-history";
import { hasBtn } from "@/utils/index";
import ReviewDetail from "../data-review/review-detail";

export default {
  name: "inspected",
  components: {
    Pagination,
    Result,
    refuseHistory,
    ReviewDetail
  },
  data() {
    return {
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      loading: false,
      tableData: [],
      queryForm: {
        okTimeStart: "",
        okTimeEnd: "",
        planType: "",
        workShop: "",
        receivePlace: "",
        sampPlace: "",
        planCode: "",
        scheduleCode: ""
      },
      dialogVisible: false,
      dialogLabVisible: false,
      selId: [],
      result: ["", "严重不合格", "不合格", "合格", "优秀"],
      labList: [],
      selLab: null,
      outCode: null,
      labIndic: null,
      getRowKeys(row) {
        return row.scheduleId;
      },
      expands: [],
      refuseId: [],
      outCode: [],
      labIndic: [],
      setColor({ row, column, rowIndex, columnIndex }) {
        let className = "";
        const color = ["", "c-danger", "c-warning", "c-primary", "c-success"];
        if (column.property == "reachStandard") {
          className = color[row.reachStandard];
        }
        return className;
      },
      okTimeRange: [],
      selItem: null,
      recDialogVisible: false,
      selItem: null,
      tableDetail: [],
      selIndic:null
    };
  },
  activated() {
    this.getData();
  },
  methods: {
    hasBtn,
    getData(page) {
      if (page === 1) this.page.pageNum = 1;
      let params = {
        ...this.page,
        ...this.queryForm
      };
      let labProname = params.labProname;
      !!labProname && (params.labProname = labProname);
      getInspected(params)
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
        okTimeStart: "",
        okTimeEnd: "",
        planType: "",
        workShop: "",
        receivePlace: "",
        sampPlace: "",
        planCode: "",
        scheduleCode: ""
      };
      this.getData(1);
      this.okTimeRange = [];
    },
    beforeRecheck(item) {
      if (this.expands.indexOf(item.scheduleId) == -1) return false;
      if (this.refuseId.length == 0) {
        this.$message.error("请选择要复验的指标结果");
        return false;
      }
      // getLabList({
      //   labIndic: this.refuseId.join(","),
      //   labProgram: item.labProname
      // })
      //   .then(res => {
      //     this.labList = res.data.data;
      //     this.dialogLabVisible = true;
      //   })
      //   .catch(e => {
      //     this.$message.error(e.message);
      //   });
      this.$confirm("确认复验？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.recheck();
      });
    },
    recheck() {
      // let selLab = this.selLab;
      let params = {
        // labId: selLab.labId,
        // labName: selLab.labName,
        labSubId: this.selId.join(","),
        labIndicName: this.outCode.join("@,,,@"),
        labIndic: this.labIndic.join(","),
        userName: this.$store.getters.userName
      };
      applyRecheck(params)
        .then(res => {
          if (res.data.code !== 10000) {
            this.$message.error(res.data.message);
          } else {
            this.$message.success(res.data.message);
            this.hiddenDialog();
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    resultDetail(id) {
      this.selId = id;
      this.dialogVisible = true;
    },
    selectChange(selection) {
      let refuseId = [];
      let outCode = [];
      let labIndic = [];
      let selId = [];
      let self = this;
      selection.map((item, index) => {
        if (item.ifReexamination == 1) {
          self.$message.error("该条化验结果已申请复验");
          self.$refs.labsubTable.toggleRowSelection(item);
          selection.splice(index, 1);
        } else {
          refuseId.push(item.labIndic);
          outCode.push(item.outCode + "--" + item.outName);
          labIndic.push(item.labIndic);
          selId.push(item.labSubId);
        }
      });
      self.refuseId = refuseId;
      self.outCode = outCode;
      self.labIndic = labIndic;
      self.selId = selId;
    },
    statusFormat(row, column) {
      let standards = ["", "不合格", "不合格", "合格", "合格"];
      return standards[row.reachStandard];
    },
    dateFormat(row, column, cellValue, index) {
      let res = "/";
      if (!!cellValue) {
        res = simpleDateFormat(new Date(cellValue), "yyyy-MM-dd HH:mm:ss");
      }
      return res;
    },
    recheckFormat(row, column, cellValue, index) {
      let res = "/";
      if (cellValue == 1) {
        res = "复验申请中";
      } else if (cellValue == 2) {
        res = "复验化验中";
      }
      return res;
    },
    popRecheckHis(item) {
      this.selItem = item;
      this.recDialogVisible = true;
    },

    changeDate(val, type) {
      this.queryForm[type + "Start"] = val[0] + " 00:00:00";
      this.queryForm[type + "End"] = val[1] + " 23:59:59";
    },
    selectable(row, index, length) {
      if (index >= length) {
        return false;
      } else {
        return true;
      }
    },
    typeFormat(row, column, cellValue, index) {
      let typeList = ["来料", "定点", "临时", "复验"];
      return typeList[cellValue];
    },
    popDetail(item) {
      this.selItem = {
        scheduleId: item.scheduleId,
        planType: item.planType,
        reviewType: item.reviewType
      };
      this.dialogVisible = true;
    },
    hiddenDialog() {
      this.dialogVisible = false;
    }
  }
};
</script>
