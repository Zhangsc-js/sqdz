<template>
  <div>
    <div style="text-align:right;">
      <template v-if="detailType=='review'">
        <el-button
          type="primary"
          size="small"
          @click="check(1)"
          v-has="'LIMS-LAB-REVIEW-AGREE'"
        >一键通过</el-button>
        <el-button
          type="danger"
          size="small"
          @click="check(2)"
          v-has="'LIMS-LAB-REVIEW-REFUSE'"
          :disabled="!refuseId.length"
        >批量拒绝</el-button>
      </template>
      <el-button
        type="primary"
        size="small"
        @click="beforeRecheck()"
        v-has="'LIMS-LAB-RECHECK-APPLY'"
        v-if="detailType=='recheck'&&selItem.planType!=3"
        :disabled="!refuseId.length"
      >复验</el-button>
    </div>
    <el-table
      ref="tableData"
      :data="tableData"
      @selection-change="selectChange"
      :cell-class-name="setColor"
      empty-text="/"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="labIndicCode" label="指标"></el-table-column>
      <el-table-column prop="labIndicName" width="180" show-overflow-tooltip label="指标名"></el-table-column>
      <el-table-column prop="labTime" width="180" label="化验时间"></el-table-column>
      <el-table-column prop="labOperatorName" label="化验人员"></el-table-column>
      <el-table-column prop="typeTime" width="180" label="录入时间"></el-table-column>
        <el-table-column prop="reviewTime" width="180" label="审核时间"></el-table-column>
      <el-table-column
        prop="ifReexamination"
        :formatter="recheckFormat"
        label="复验状态"
        v-if="detailType=='recheck'"
      ></el-table-column>
      <el-table-column
        prop="reexaminationTime"
        width="180"
        label="复验申请时间"
        v-if="detailType=='recheck'"
      ></el-table-column>
      <el-table-column prop="outindicData" label="计算结果"></el-table-column>
      <el-table-column prop="reachStandard" :formatter="statusFormat" label="达标情况"></el-table-column>
      <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
      <el-table-column
        label="操作"
        width="180"
        fixed="right"
        align="center"
        v-if=" hasBtn([ 'LIMS-LAB-REVIEW-HISTORY','LIMS-LAB-REVIEW-FAIL' ])"
      >
        <template v-slot="scope">
          <el-button
            type="text"
            size="small"
            @click="popHistory(scope.row.labMain,scope.row.labIndic)"
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
    <el-dialog
      title="指标历史记录"
      append-to-body
      :visible.sync="dialogVisible"
      width="80%"
      v-if="dialogVisible"
    >
      <indic-history @hidenDialog="hidenDialog" :selItem="selIndic" />
    </el-dialog>
    <el-dialog
      title="退审记录"
      append-to-body
      :visible.sync="recDialogVisible"
      width="80%"
      v-if="recDialogVisible"
    >
      <refuse-history @hidenDialog="hidenDialog" :selItem="selIndic"></refuse-history>
    </el-dialog>
    <el-dialog title="提示" append-to-body :visible.sync="dialogVisible2" width="420px">
      <p>此次操作为审核拒绝所有指标结果，确认审核拒绝，请选择或输入审核意见</p>
      <el-select
        v-model="remark"
        placeholder="请选择或输入审核意见"
        filterable
        clearable
        allow-create
        default-first-option
        style="width:100%;"
      >
        <el-option
          v-for="item in remarkList"
          :key="item.id"
          :value="item.label"
          :label="item.label"
        ></el-option>
      </el-select>
      <div style="text-align:center;margin-top:20px;">
        <el-button type="primary" @click="refuse">确认</el-button>
        <el-button @click="hidenDialog">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import {
  getScheduleDetailList,
  dataReviewAct,
  remarkList,
  applyRecheck
} from "@/api/lims";
import { getActDataList } from "@/api/sys/activiti";
import { simpleDateFormat, getDate } from "@/utils/index";
import IndicHistory from "./indic-history";
import RefuseHistory from "./refuse-history";
import { hasBtn } from "@/utils/index";

export default {
  name: "ReviewDetail",
  components: {
    IndicHistory,
    RefuseHistory
  },
  props: {
    selItem: {
      type: Object,
      required: true,
      default: {}
    },
    detailType: {
      type: String,
      required: false,
      default: "detail"
    }
  },
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      recDialogVisible: false,
      dialogVisible2: false,
      remark: "",
      remarkList: [],
      refuseId: [],
      outCode: [],
      labIndic: [],
      selId: []
    };
  },
  created() {
    this.getData();
  },
  methods: {
    hasBtn,
    getData() {
      getScheduleDetailList({ scheduleId: this.selItem.scheduleId }).then(
        res => {
          if (res.data.success) {
            this.tableData = res.data.data;
          } else {
            this.$message.error(res.data.message);
          }
        }
      );
    },
    popHistory(item, labIndic) {
      this.selIndic = { ...item };
      this.selIndic.labIndic = labIndic;
      this.selIndic.planType =
        this.selItem.planType == 3
          ? this.selItem.reviewType == null
            ? ""
            : this.selItem.reviewType
          : this.selItem.planType;
      this.dialogVisible = true;
    },
    getRemarkList() {
      remarkList({ type: "SHJJ" }).then(res => {
        if (res.data.success) {
          this.remarkList = res.data.data;
        }
      });
    },
    check(type) {
      const tips = ["", "审核通过", "审核拒绝"];
      if (type == 2 && this.refuseId.length == 0 && this.tableData.length > 1) {
        this.$message.error("请选择要拒绝的指标结果");
        return false;
      }
      let params = {
        result: tips[type],
        activitiId: this.selItem.activitiId,
        activitiProcessInstanceId: this.selItem.activitiProcessInstanceId,
        // labSubId: item.labSubId,
        reviewOperatorName: this.$store.getters.userName,
        reviewOperatorWork: this.$store.getters.workCode
      };
      if (type == 1) {
        this.$prompt(
          "此次操作为审核通过所有指标结果，确认审核通过，请输入审核意见",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消"
          }
        )
          .then(({ value }) => {
            params.remark = value;
            dataReviewAct(params).then(res => {
              if (!res.data.success) {
                this.$message.error(res.data.message);
              } else {
                this.$message.success(res.data.message);
                this.$emit("getData");
                this.$emit("close");
                this.refuseId = [];
              }
            });
          }).catch((res) => {
            this.$message.info("已取消");
          });
      } else if (type == 2) {
        params.refuseId =
          this.tableData.length > 1
            ? this.refuseId.join(",")
            : this.tableData[0].labSubId;
        this.reviewParams = params;
        this.dialogVisible2 = true;
        if (this.remarkList.length == 0) this.getRemarkList();
      }
    },

    refuse() {
      let params = { ...this.reviewParams };
      if (this.remark.trim() === "") {
        this.$message.error("请选择或输入审核意见");
      } else {
        params.remark = this.remark;
        dataReviewAct(params).then(res => {
          if (!res.data.success) {
            this.$message.error(res.data.message);
          } else {
            this.$message.success(res.data.message);
            this.$emit("getData");
            this.refuseId = [];
            this.remark = "";
            this.$emit("close");
          }
        });
      }
    },
    statusFormat(row, column) {
      let standards = ["", "不合格", "不合格", "合格", "合格"];
      return standards[row.reachStandard];
    },
    setColor({ row, column, rowIndex, columnIndex }) {
      let className = "";
      const color = ["", "c-danger", "c-warning", "c-primary", "c-success"];
      if (column.property == "reachStandard") {
        className = color[row.reachStandard];
      }
      return className;
    },
    selectChange(selection) {
      if (this.detailType == "review") {
        let refuseId = selection.map(item => {
          return item.labSubId;
        });
        this.refuseId = refuseId;
      } else if (this.detailType == "recheck") {
        let refuseId = [];
        let outCode = [];
        let labIndic = [];
        let selId = [];
        let self = this;
        selection.map((item, index) => {
          if (!!item.ifReexamination) {
            self.$message.error("该条化验结果已申请复验");
            self.$refs.tableData.toggleRowSelection(item);
            selection.splice(index, 1);
          } else {
            refuseId.push(item.labIndic);
            outCode.push(item.labIndicCode + "<:-:>" + item.labIndicName);
            labIndic.push(item.labIndic);
            selId.push(item.labSubId);
          }
        });
        self.refuseId = refuseId;
        self.outCode = outCode;
        self.labIndic = labIndic;
        self.selId = selId;
      }
    },
    hidenDialog() {
      this.selIndic = null;
      this.dialogVisible = false;
      this.recDialogVisible = false;
      this.dialogVisible2 = false;
    },
    popRecheckHis(item) {
      this.selIndic = item;
      this.recDialogVisible = true;
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
    beforeRecheck() {
      if (this.refuseId.length == 0) {
        this.$message.error("请选择要复验的指标结果");
        return false;
      }
      this.$confirm("确认复验？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.recheck();
      }).catch((res) => {
            this.$message.info("已取消");
          });;
    },
    recheck() {
      let params = {
        labSubId: this.selId.join(","),
        labIndicName: this.outCode.join("@,,,@"),
        labIndic: this.labIndic.join(","),
        userName: this.$store.getters.userName
      };
      applyRecheck(params)
        .then(res => {
          if (!res.data.success) {
            this.$message.error(res.data.message);
          } else {
            this.$message.success(res.data.message);
            this.getData(0);
            // this.$emit("close");
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
