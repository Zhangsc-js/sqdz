<template>
  <div> 
    <el-table :data="tableData" style="min-height:200px;" :cell-class-name="setColor">
      <el-table-column prop="labOperatorName" label="化验人员"></el-table-column>
      <el-table-column prop="labTime" width="180" label="化验时间"></el-table-column>
      <el-table-column prop="nowOperatorName" label="录入人员"></el-table-column>
      <el-table-column prop="typeTime" width="180" label="录入时间"></el-table-column>
      <el-table-column prop="reviewOperatorName" label="审核人员"></el-table-column>
      <el-table-column prop="reviewTime" width="180" label="审核时间"></el-table-column>
      <el-table-column prop="outindicData" label="计算结果"></el-table-column>
      <el-table-column prop="reachStandard" :formatter="statusFormat" label="达标情况"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { refuseRec } from "@/api/lims";

export default {
  name: "refuse-history",
  data() {
    return {
      tableData: [],
      total: 0,
      page: {
        pageNum: 1,
        pageSize: 10
      },
      setColor({ row, column, rowIndex, columnIndex }) {
        let className = "";
        const color = ["", "c-danger", "c-warning", "c-primary", "c-success"];
        if (column.property == "reachStandard") {
          className = color[row.reachStandard];
        }
        return className;
      }
    };
  },
  props: {
    selItem: {
      type: Object,
      required: true
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      refuseRec({ labSubId: this.selItem.labSubId }).then(res => {
        this.tableData = res.data.data;
      });
    },

    statusFormat(row, column) {
      let standards = ["", "不合格", "不合格", "合格", "合格"];
      return standards[row.reachStandard];
    }
  }
};
</script>

<style scoped>
.btn-b {
  margin-top: -15px;
}
</style>
