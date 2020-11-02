<template>
  <div style="height: 100%;">
    <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
      <el-form-item label="仓库号">
        <el-select
          v-model="queryForm.whCode"
          filterable
          placeholder="请选择"
          style="width: 150px;height: 100%"
          @change="selectWh"
        >
          <el-option
            v-for="item in this.whArr"
            :key="item.warehouseCode"
            :label="item.warehouseName"
            :value="item.warehouseCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="存储区">
        <el-select
          v-model="queryForm.areaCode"
          filterable
          placeholder="请选择"
          style="width: 150px;height: 100%"
          @change="selectArea"
        >
          <el-option
            v-for="item in this.areaArr"
            :key="item.areaCode"
            :label="item.areaName"
            :value="item.areaCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="仓位">
        <el-select
          v-model="queryForm.binCode"
          filterable
          placeholder="请选择"
          style="width: 150px;height: 100%"
        >
          <el-option
            v-for="item in this.binArr"
            :key="item.binCode"
            :label="item.binCode"
            :value="item.binCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="存储单元">
        <el-input v-model="queryForm.cellCode"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="initData()" type="primary">查询</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="addStorge()">新增</el-button>
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
      <el-table-column prop="whCode" :formatter="formatWh" label="仓库" min-width="12%"></el-table-column>
      <el-table-column prop="areaCode" :formatter="formatArea" label="存储区" min-width="12%"></el-table-column>
      <el-table-column prop="binCode" label="仓位" min-width="12%"></el-table-column>
      <el-table-column prop="cellCode" label="存储单元" min-width="12%"></el-table-column>
      <el-table-column prop="cellCode" label="存储单元" min-width="12%"></el-table-column>
      <el-table-column prop="freeze" :formatter="formatFreeze" label="是否冻结" min-width="12%"></el-table-column>
      <el-table-column prop="weightMax" label="最大承重" min-width="12%"></el-table-column>
      <el-table-column prop="weightUnitCode" label="承重单位" min-width="12%"></el-table-column>
      <el-table-column label="操作" min-width="20%">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="updataCell(scope.row)">更新</el-button>
          <el-button type="text" size="small" @click="deleteCell(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :total="totalTable"
      :page.sync="pageTable.pageNum"
      :limit.sync="pageTable.pageSize"
      @pagination="initData"
    />
    <el-dialog :title="title" :visible.sync="addDialogVisible" width="65%">
      <addStorgeLocationList
        @save="hidenDialog"
        @cancel="hidenDialogCancel"
        :id="id"
        :type="type"
        :trigger="addDialogVisible"/>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import {
  findAreaAll,
  findSysWmsCellAll,
  saveSysWmsCell,
  updateSysWmsCell,
  deleteSysWmsCell,
  findSysWmsWarehousePullDownAll,
  findDropUnit,
  findSysWmsCell,
  findSysWmsAreaPullDownAll,
    findPullWmsBin,
} from "@/api/sys/wms/warehouse";
import addStorgeLocationList from "./addStorageLocationList";
export default {
  components: {
    addStorgeLocationList,
    Pagination
  },
  data() {
    return {
      tableData: [],
      title:"",
      id:"",
      type:"",

      addDialogVisible:false,
      queryForm: {
        whCode: "",
        areaCode:"",
        binCode:"",
        cellCode: ""
      },
      whArr: [],
      areaArr:[],
      binArr:[],
      areaList:[],
      pageTable: {
        pageNum: 1,
        pageSize: 10
      },
      Unit:[],
      totalTable: 0,
    };
  },
  methods: {
    selectArea(){
        findPullWmsBin(this.queryForm.areaCode)
        .then(response => {
          if(response.data.success){
            this.binArr=response.data.data.list;
          }
        })
      },
      selectWh(){
        findSysWmsAreaPullDownAll(this.queryForm.whCode)
        .then(response => {
          if(response.data.success){
            this.areaArr=response.data.data.list;
          }
        });
      },
    initData() {
      findAreaAll()
      .then(response => {
        if(response.data.success){
          this.areaList=response.data.data.list;
        }
      })
      findSysWmsWarehousePullDownAll().then(response => {
        if (response.data.success) {
          this.whArr = response.data.data.list;
          
        }
      });
      findDropUnit().then(response => {
        if (response.data.success) {
          this.Unit = response.data.data.UNIT_ALL;
        }
      });
      let params={
        ...this.pageTable,
        ...this.queryForm
      };
      findSysWmsCellAll(params)
      .then(response => {
        if(response.data.success){
          this.tableData=response.data.data.list;
          this.totalTable=response.data.data.total;
        }
      })
    },
    
    updataCell(row){
      this.id=row.id;
      this.type="2";
      this.title="修改存储单元";
      this.addDialogVisible=true;
    },
    deleteCell(row){
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          
          deleteSysWmsCell(row.id).then(response => {
            console.log(response);
            if (response.data.success) {
              this.initData();
              this.$message.success("删除成功!");
            } else
              this.$message.error(
                response.data.message + ":" + response.data.data
              );
          });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    addStorge(){
      this.title="新增存储单元";
      this.type="1";
      this.addDialogVisible=true;
      this.id="";
    },
    hidenDialog(){
      this.addDialogVisible=false;
      this.initData();
    },
    hidenDialogCancel(){
      this.addDialogVisible=false;
      this.initData();
    },
    formatFreeze(row,column){
      if(row.freeze){
        return "是";
      }else{
        return "否";
      }
    },
    formatWh(row,column){
      for (let index = 0; index < this.whArr.length; index++) {
        const element = this.whArr[index];
        if(row.whCode==element.warehouseCode){
          return element.warehouseName;  
        }
      }
    },
    formatArea(row,column){
      for (let index = 0; index < this.areaList.length; index++) {
        const element = this.areaList[index];
        if(row.areaCode==element.areaCode){
          return element.areaName;
        }
      }
    }
  },
  mounted() {
    this.initData();
  }
};
</script>
<style scoped>
</style>