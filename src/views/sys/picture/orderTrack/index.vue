<template>
  <!--  采购订单状态跟踪 -->
  <div class="orderTrack">
    <!-- 查询表单 -->
    <el-form :inline="true" :model="queryForm" class="demo-form-inline" style="margin-left:30px">
      <el-form-item label="订单号：">
        <el-input v-model="queryForm.orderNo" placeholder="请输入订单号"></el-input>
      </el-form-item>
      <el-form-item label="订单日期：">
        <el-date-picker
          style="padding:0 5px"
          v-model="queryForm.date"
          type="daterange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryForm.state" placeholder="请选择状态">
          <el-option label="未完成" value="0"></el-option>
          <el-option label="完成" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
        <el-button type="primary" plain>清空</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      style="width: 100%"
      stripe
      border
      :summary-method="getSummaries"
      show-summary
    >
      <el-table-column prop="orderNo" label="采购订单号" align="center"></el-table-column>
      <el-table-column prop="supplierName" label="供应商名称" align="center"></el-table-column>
      <el-table-column prop="orderNum" label="采购单总数量" align="center"></el-table-column>
      <el-table-column prop="warehouseNum" label="入库数量" align="center"></el-table-column>
      <el-table-column prop="returnGoodsNum" label="退货数量" align="center"></el-table-column>
      <el-table-column prop="deliveryDate" label="交货日期" align="center"></el-table-column>
      <el-table-column label="状态" align="center">
        <template v-slot="{row}">
          <span :class="{red:row.state==='未完成'}">{{row.state}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="extensionDays" label="延期天数" align="center"></el-table-column>
      <el-table-column label="操作" width="100" align="center" fixed="right">
        <el-button type="text">查看</el-button>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          orderNo: "C20200202-1",
          supplierName: "深圳市鹏达电子有限公司",
          orderNum: "548",
          warehouseNum: "300",
          returnGoodsNum: "0",
          deliveryDate: "2020-02-18",
          state: "未完成",
          extensionDays: "5"
        },
        {
          orderNo: "C20200202-2",
          supplierName: "上海洁森有限公司",
          orderNum: "352",
          warehouseNum: "232",
          returnGoodsNum: "0",
          deliveryDate: "2020-02-23",
          state: "未完成",
          extensionDays: "2"
        },
        {
          orderNo: "C20200204-1",
          supplierName: "上海维路有限公司",
          orderNum: "320",
          warehouseNum: "120",
          returnGoodsNum: "0",
          deliveryDate: "2020-02-21",
          state: "未完成",
          extensionDays: "3"
        },

        {
          orderNo: "C20200204-2",
          supplierName: "杭州电子制品厂",
          orderNum: "520",
          warehouseNum: "520",
          returnGoodsNum: "20",
          deliveryDate: "2020-02-10",
          state: "未完成",
          extensionDays: "10"
        },
        {
          orderNo: "C20200206-1",
          supplierName: "光电股份有限公司",
          orderNum: "380",
          warehouseNum: "380",
          returnGoodsNum: "0",
          deliveryDate: "2020-02-18",
          state: "已完成",
          extensionDays: "2"
        },
        {
          orderNo: "C20200206-2",
          supplierName: "乌达电子科技有限公司",
          orderNum: "400",
          warehouseNum: "400",
          returnGoodsNum: "0",
          deliveryDate: "2020-02-18",
          state: "已完成",
          extensionDays: "0"
        },
        {
          orderNo: "C20200206-3",
          supplierName: "三安电子",
          orderNum: "1180",
          warehouseNum: "180",
          returnGoodsNum: "0",
          deliveryDate: "2020-02-18",
          state: "已完成",
          extensionDays: "0"
        }
      ],
      queryForm: {
        orderNo: "",
        date: "",
        state: "未完成"
      }
    };
  },
  methods: {
    getSummaries() {
      let sum1 = 0;
      let sum2 = 0;
      let sum3 = 0;
      this.tableData.forEach(item => {
        sum1 += +item.orderNum;
      });
      this.tableData.forEach(item => {
        sum2 += +item.warehouseNum;
      });
      this.tableData.forEach(item => {
        sum3 += +item.returnGoodsNum;
      });
      const sums = ["", "合计", sum1, sum2, sum3];
      return sums;
    }
  }
};
</script>

<style scoped>
.red {
  color: #ff5e5e;
}
</style>
