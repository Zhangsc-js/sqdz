<template>
    <div style="height:100%;">
        <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
        <el-form-item label="单号">
            <el-input v-model="queryForm.poNo"></el-input>
        </el-form-item>
         <el-form-item>
        <el-button icon="el-icon-search" type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      highlight-current-row
      :data="tableData"
      stripe
      border
      @row-click="openDetails"
      height="calc(100%)"
      style=" width: 100%"
    >
        <el-table-column prop="poNo" label="采购订单编码"></el-table-column>
        <el-table-column prop="poName" label="采购订单名称"></el-table-column>
        <el-table-column prop="supplierCode"  label="供应商">
            <template v-slot="scope">
          <span style="width: 200px;">{{formatSupplier(scope.row.supplierCode)}}</span>
        </template>
        </el-table-column>
        <el-table-column prop="purchaseDate" label="采购日期"></el-table-column>
        <el-table-column prop="deliveryDate" label="预计到货日期"></el-table-column>
        <el-table-column prop="departCode" label="申请采购部门">
            <template v-slot="scope">
          <span style="width: 200px;">{{formatDepart(scope.row.departCode)}}</span>
        </template>
        </el-table-column>
        <el-table-column prop="pcPersonNaem" label="采购申请人"></el-table-column>
    </el-table>
    <Pagination
      :total="total"
      :page.sync="page.pageNum"
      :limit.sync="page.pageSize"
      @pagination="getData"
    />
    </div>
    
</template>
<script>
import { selectPartment } from "@/api/sys";
import { findPullSupplier } from "@/api/sys/suppler";
import Pagination from "@/components/Pagination";
import {
    findSysPurchaseOrderAll
} from "@/api/sys/purchase"
export default {
    components:{
        Pagination
    },
    data(){
        return{
            tableData:[],
            page:{
                pageNum:1,
                pageSize:10
            },
            total:0,
            queryForm:{
                poNo:""
            },
            supplierArr:[],
            departArr:[]
        }
    },
    methods:{
        getData(){
            findPullSupplier().then(response => {
        if (response.data.success) {
          this.supplierArr = response.data.data.list;
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
      selectPartment().then(response => {
        if (response.data.success) {
          this.departArr = response.data.data;
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
            const params={
                ...this.queryForm,
                ...this.page
            };
            findSysPurchaseOrderAll(params)
            .then(response => {
                if(response.data.success){
                    this.tableData=response.data.data.list;
                    this.total=response.data.data.total;
                }
            });
        },
        openDetails(row){
            const param = Object.assign({ materialId: row.id }, row);
            // console.log(param);
            this.$emit("save", param);
        }
    },
    mounted(){
        this.getData();
    },
    computed:{
        formatSupplier() {
      return function(data) {
        for (let index = 0; index < this.supplierArr.length; index++) {
          const element = this.supplierArr[index];
          if (element.supplierCode == data) {
            return element.supplierName;
          }
        }
      };
    },
    formatDepart() {
      return function(data) {
        //   this.departArr.forEach(element => {
        //   if(element.code==data){
        //     return element.label;
        //   }
        // });
        for (let index = 0; index < this.departArr.length; index++) {
          const element = this.departArr[index];
          if (element.code == data) {
            return element.label;
          }
        }
      };
    }
    }
}
</script>