<template>
  <!-- 领取订单 -->
  <div class="receiveOrd" style="height:100%">
    <!-- 查询表单 -->
    <el-form ref="queryForm" :model="queryForm" style="margin-left:20px" inline>
      <el-row>
        <el-form-item label="交货日期" prop="time">
          <el-date-picker
            v-model="queryForm.time"
            type="datetimerange"
            range-separator="~"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="物料编码" prop="materialCode">
          <el-input v-model="queryForm.materialCode" clearable></el-input>
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
        <el-form-item label="下单日期" prop="receiveDate">
          <el-date-picker
            v-model="queryForm.receiveDate"
            type="datetimerange"
            range-separator="~"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="主订单号" prop="soNo">
          <el-input v-model="queryForm.soNo"></el-input>
        </el-form-item>
        <el-form-item label="子订单号" prop="sdNo">
          <el-input v-model="queryForm.sdNo" clearable></el-input>
        </el-form-item>
      </el-row>
    </el-form>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      stripe
      border
      style="width:100%"
      ref="multipleTable"
      :height="showMore?'calc(100% - 142px - 52px)':'calc(100% - 142px)'"
    >
      <el-table-column type="selection" width="55" fixed :key="random"></el-table-column>
      <el-table-column prop="materialCode" label="物料编码"></el-table-column>
      <el-table-column prop="materialName" label="物料名称" width="150"></el-table-column>
      <el-table-column prop="specification" label="规格" width="100"></el-table-column>
      <el-table-column prop="modelNumber" label="型号"></el-table-column>
      <el-table-column prop="color" label="颜色"></el-table-column>
      <el-table-column prop="qty" label="加工数量"></el-table-column>
      <el-table-column prop="unit" label="单位"></el-table-column>
      <el-table-column prop="receiveDate" label="下单日期" width="120"></el-table-column>
      <el-table-column prop="deliveryDate" label="交货日期" width="120"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column prop="status" label="订单状态" width="120" :formatter="formatterStatus"></el-table-column>
      <el-table-column prop="sdNo" width="120" label="子订单号"></el-table-column>
      <el-table-column prop="soNo" width="120" label="主订单号"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      :page.sync="page.pageNum"
      :limit.sync="page.pageSize"
      @pagination="getData"
    />
    <!-- 领取订单--取消领取订单 -->
    <el-row style="padding-left:20px">
      <el-button type="primary" @click="ckeck">领取</el-button>
    </el-row>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { simpleDateFormat } from "@/utils/index";
import { queryDetailByMap, receiveDetail } from "@/api/productionPlanning";
export default {
  components: {
    Pagination
  },
  props: {
    random: {
      required: true
    }
  },
  data() {
    return {
      queryForm: {
        time: ["", ""],
        materialCode: "",
        receiveDate: ["", ""],
        soNo: "",
        sdNo: ""
      },
      showMore: false,
      tableData: [],
      total: 0,
      page: {
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  methods: {
    getData(page) {
      if (page == 1) {
        this.page.pageNum = 1;
      }
      let params = {
        ...this.queryForm,
        ...this.page,
        status: "20",
        boo: true
      };
      if (this.queryForm.time) {
        params.deliveryStartDate = simpleDateFormat(
          this.queryForm.time[0],
          "yyyy-MM-dd"
        );
        params.deliveryEndDate = simpleDateFormat(
          this.queryForm.time[1],
          "yyyy-MM-dd"
        );
        delete params.time;
      }
      if (this.queryForm.receiveDate) {
        params.receiveStartDate = simpleDateFormat(
          this.queryForm.receiveDate[0],
          "yyyy-MM-dd"
        );
        params.receiveEndDate = simpleDateFormat(
          this.queryForm.receiveDate[1],
          "yyyy-MM-dd"
        );
        delete params.receiveDate;
      }
      queryDetailByMap(params).then(res => {
        if (res.data.success) {
          this.total = res.data.data.total;
          this.tableData = res.data.data.list;
        } else {
          this.$message.error(res.message + ":" + res.data);
        }
      });
    },
    clearSearchBox() {
      this.$refs["queryForm"].resetFields();
      this.getData();
    },
    formatterStatus(row) {
      switch (row.status) {
        case "10":
          return "录入";
        case "20":
          return "下达";
        case "30":
          return "完工";
        case "90":
          return "终止";
      }
    },
    // 领取
    ckeck() {
      let ids = this.$refs.multipleTable.store.states.selection.map(
        item => item.id
      );
      if (ids.length == 0) {
        this.$message.error("请先选择需要领取的订单");
        return;
      }
      receiveDetail(ids).then(res => {
        console.log(res);
        if (res.data.success) {
          this.$message.success("领取成功");
          this.$emit("closeDialog");
        } else {
          this.$message.error(res.data.message + ":" + res.data.data);
        }
      });
    }
  }
};
</script>

<style>
</style>
