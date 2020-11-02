<template>
  <div style="height: 100%;">
    <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
      <el-form-item label="采购订单编号">
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
      height="calc(100% - 52px - 50px - 12px - 12px)"
      style=" width: 100%"
    >
        <el-table-column prop="poNo" label="采购订单编码"></el-table-column>
        <el-table-column prop="poName" label="采购订单名称"></el-table-column>
        <el-table-column prop="supplierCode" label="供应商"></el-table-column>
        <el-table-column prop="purchaseDate" label="采购日期"></el-table-column>
        <el-table-column prop="deliveryDate" label="预计到货日期"></el-table-column>
        <el-table-column prop="departCode" label="申请采购部门"></el-table-column>
        <el-table-column prop="pcPersonCode" label="采购申请人"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <template slot-scope="scope">
          <el-button type="text" size="small" >更新</el-button>
          <el-button type="text" size="small" >删除</el-button>
        </template>
    </el-table>
    <div>
      <el-button type="primary"  icon="el-icon-plus" >新增</el-button>
    </div>
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
import {
    findSysPurchaseOrderAll,
    deleteSysPurchaseOrder
} from "@/api/sys/purchase" 
export default {
    components:{
        Pagination
    },
    data(){
        return{
            queryForm:{
                poNo:"",
                status:""
            },
            tableData:[],
            page:{
                pageNum:1,
                pageSize:10
            },
            total:0,
        }
    },
    methods:{
        getData(){
            const params={
                ...this.page,
                ...this.queryForm
            };
            findSysPurchaseOrderAll(params)
            .then(response =>{
                if(response.data.success){
                    this.tableData=response.data.data.list;
                    this.total=response.data.data.total;
                }
            });
        }
    },
    mounted(){
        this.getData();
    }
};
</script>