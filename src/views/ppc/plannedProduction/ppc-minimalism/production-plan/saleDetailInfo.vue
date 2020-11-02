<template>
  <div style=" padding-left: 20px">
    <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
      <el-form-item label="子订单号">
        <el-input v-model="queryForm.sdNo" placeholder="请输入子订单号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getData(1)">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button href="javascript:void(0)" class="btn-w" @click="clearSearchBox">清空</el-button>
      </el-form-item>
      <!--            <el-form-item>-->
      <!--                <el-button :disabled="batchBtn" type="danger " @click="batchDelmaterial">批量删除</el-button>-->
      <!--            </el-form-item>-->
    </el-form>

    <template>
      <el-table
        highlight-current-row
        :data="tableData"
        height="300px"
        @row-click="openDetails"
        border
        stripe
        style="width: 100%"
      >
        <!--                <el-table-column type="selection" width="60" center></el-table-column>-->
        <el-table-column prop="sdNo" label="子订单号" width="150"></el-table-column>
        <el-table-column prop="materialCode" label="物料编码" width="120"></el-table-column>
        <el-table-column prop="materialName" label="物料编码" width="120"></el-table-column>
        <el-table-column prop="specification" label="规格"></el-table-column>
        <el-table-column prop="quality" label="材质" width="180"></el-table-column>
        <el-table-column prop="color" label="颜色" width="180"></el-table-column>
        <el-table-column prop="status" :formatter="formatStatus" label="订单状态" width="180"></el-table-column>
        <el-table-column prop="soNo" label="总订单号" width="180"></el-table-column>
        <el-table-column prop="soName" label="订单名称" width="180"></el-table-column>
        <el-table-column prop="customerCode" label="采购商" width="180"></el-table-column>
      </el-table>
    </template>
    <Pagination
      :total="total"
      :page.sync="page.pageNum"
      :limit.sync="page.pageSize"
      @pagination="getData"
    />
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import { getSaleStatus, findPpcSaleDetail } from "@/api/productionPlanning";
export default {
  data() {
    return {
      tableData: [],
      SALE_STATUS: [],
      total:"",
      queryForm: {
        sdNo: ""
      },
      page: {
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  components: {
    Pagination
  },
  methods: {
    getData() {
      let params = {
        ...this.queryForm,
        ...this.page
      };
      getSaleStatus().then(response => {
        if (response.data.success) {
          this.SALE_STATUS = response.data.data.SALE_STATUS;
        }
      });
      findPpcSaleDetail(params).then(response => {
        if (response.data.success) {
            this.tableData=response.data.data.list;
            this.total=response.data.data.total;
        }
      });
    },
    formatStatus:function(row,column){
        for (let index = 0; index < this.SALE_STATUS.length; index++) {
            const element = this.SALE_STATUS[index];
            if(row.status==element.code){
                return element.label;
            }
        }
    },
    openDetails(row) {
      const param = Object.assign({ materialId: row.id }, row);
      // delete param.id
      this.$emit("save", param);
    }
  },
  mounted() {
    this.getData();
  }
};
</script>