<template>
  <!-- 订单综合查询 -->
  <div class="orderSaleReport" style="height:100%">
    <div class="top">
      <!-- 查询表单 -->
      <el-form
        inline
        :model="queryForm"
        ref="queryForm"
        class="demo-form-inline"
        style="margin-left:20px"
      >
        <el-form-item label="订单号:" prop="soNo">
          <el-input v-model="queryForm.soNo" clearable></el-input>
        </el-form-item>
        <el-form-item label="子订单号:" prop="sdNo">
          <el-input v-model="queryForm.sdNo" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="getData">查询</el-button>
          <el-button
            href="javascript:void(0)"
            @click="clearSearchBox"
            type="primary"
            icon="el-icon-refresh-left"
          >重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 表格 -->
      <el-table
        :data="tableData"
        style="width: 100%"
        stripe
        border
        height="calc(100% - 52px)"
        @row-click="rowClick"
        highlight-current-row
        ref="multipleTable"
      >
        <el-table-column prop="soNo" label="销售单号"></el-table-column>
        <el-table-column prop="sdNo" label="子销售单号"></el-table-column>
        <el-table-column prop="materialCode" label="物料编码"></el-table-column>
        <el-table-column prop="saleQty" label="订单数量"></el-table-column>
        <el-table-column prop="planQty" label="计划数量"></el-table-column>
        <el-table-column prop="finishQty" label="完成数量"></el-table-column>
        <el-table-column prop="frate" label="完成率"></el-table-column>
        <el-table-column prop="goodQty" label="合格数量"></el-table-column>
        <el-table-column prop="grate" label="合格率"></el-table-column>
        <el-table-column prop="bQty" label="废品数量"></el-table-column>
        <el-table-column prop="brate" label="废品率"></el-table-column>
      </el-table>
    </div>
    <div class="bottom">
      <chart :chartItem="chartItem"></chart>
    </div>
  </div>
</template>

<script>
import { saleReport } from "@/api/ppc/report";
import chart from "./chart";
export default {
  components: {
    chart
  },
  data() {
    return {
      queryForm: {
        soNo: "",
        sdNo: ""
      },
      tableData: [],
      chartItem: {}
    };
  },
  methods: {
    async getData() {
      let params = {
        ...this.queryForm
      };
      console.log(params);
      let res = await saleReport(params);
      if (res.data.success) {
        this.tableData = res.data.data;
        console.log(this.tableData);
        if (this.tableData.length > 0) {
          this.$refs.multipleTable.setCurrentRow(this.tableData[0], true);
          this.chartItem = this.tableData[0];
        }
      } else {
        this.$message.error(res.data.message + ":" + res.data.data);
      }
    },
    rowClick(row) {
      this.chartItem = row;
    },
    clearSearchBox() {
      this.$refs.queryForm.resetFields();
      this.getData();
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style lang='scss' scoped>
.top {
  height: 50%;
}
.bottom {
  height: 50%;
}
</style>
