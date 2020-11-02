<template>
  <el-container class="autocode" style="height: 100%;">
    <el-aside width="30%" style="height: 100%;">
      <el-form ref="inqu" :model="inqu" inline>
        <el-divider content-position="left">主体信息</el-divider>
        <el-row>
          <el-form-item label="物料名称" prop="materialName">
            <el-input v-model="inqu.materialName" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary " icon="el-icon-search" @click="getTableData">查询</el-button>
            <el-button type="primary " icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <el-table @row-click="getBachTableData" :data="tableData" stripe style="width: 100%;"  height="calc(100% - 173px)">
        
        <el-table-column prop="materialCode" label="物料编码" width="100"></el-table-column>
        <el-table-column prop="materialName" label="物料名称" width="100"></el-table-column>
        <el-table-column prop="onhandQty" label="在库库存" width="100"></el-table-column>
        <el-table-column prop="availableQty" label="可用库存" width="100"></el-table-column>
        <el-table-column prop="lockQty" label="锁定库存" width="100"></el-table-column>
        <el-table-column prop="ftyCode"  label="工厂" width="100">
            <template v-slot="scope">
          <span style="width: 100;">{{ formatFactory(scope.row) }}</span>
        </template>
        </el-table-column>
        <el-table-column prop="unit" label="单位" width="100"></el-table-column>
        <el-table-column prop="lockStatus" label="锁定状态" width="100"></el-table-column>
      </el-table>
      <Pagination
        :total="totalTable"
        :page.sync="pageTable.pageNum"
        :limit.sync="pageTable.pageSize"
        @pagination="getTableData"
      />
    </el-aside>
    <el-main style="height: 100%;">
      <el-divider content-position="left">批次库存</el-divider>
      <el-table :data="bachTableData" stripe style="width: 100%" height="calc(100% - 100px)">
        <el-table-column prop="materialCode"  label="物料编码" width="100"></el-table-column>
        <el-table-column prop="materialName"  label="物料名称" width="100"></el-table-column>
         <el-table-column prop="onhandQty" label="在库库存数量" width="100"></el-table-column>
        <el-table-column prop="availableQty" label="可用库存" width="100"></el-table-column>
        
        <el-table-column prop="batch" label="批次号" width="100"></el-table-column>
        <el-table-column prop="ftyCode"  label="工厂" width="100">
            <template v-slot="scope">
          <span style="width: 100;">{{ formatFactory(scope.row) }}</span>
        </template>
        </el-table-column>
        <el-table-column prop="whCode"  label="仓库" width="100">
            <template v-slot="scope">
          <span style="width: 100;">{{ formatWh(scope.row) }}</span>
        </template>
        </el-table-column>
        <el-table-column prop="areaCode"  label="存储区" width="100">
            <template v-slot="scope">
          <span style="width: 100;">{{ formatArea(scope.row) }}</span>
        </template>
        </el-table-column>
        <el-table-column prop="binCode" label="仓位" width="100"></el-table-column>
       
        <el-table-column prop="lockQty" label="锁定库存" width="100"></el-table-column>
        <el-table-column prop="unit" label="单位" width="100"></el-table-column>
        <el-table-column prop="lockStatus" label="锁定状态" width="100"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right" width="120px">
          <template v-slot="scope">
            <el-button type="text" size="small" @click="seeDetails(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <Pagination
        :total="total"
        :page.sync="page.pageNum"
        :limit.sync="page.pageSize"
        @pagination="getBachTableData"
      /> -->
    </el-main>
    <div>
        <el-dialog :title="title" :visible.sync="addDialogVisible" width="65%" height="99%" append-to-body>
      <stockFlow
        @save="hidenDialog"
        @cancel="hidenDialogCancel"
        :id="batch"
        :trigger="addDialogVisible"
      />
    </el-dialog>
    </div>
  </el-container>
  
</template>
<script>
import Pagination from "@/components/Pagination";
import stockFlow from "./stockFlow";
import {
  findMaterials,
  findByStockCode,
  findFactory,
  findWhAll,
  findAreaAll
} from "@/api/sys/wms/warehouse";
export default {
  data() {
    return {
      inqu: {
        materialName: ""
      },
      addDialogVisible:false,
      title:"",
      batch:"",
      tableData: [],
      bachTableData: [],
      whList:[],
      areaList:[],
      ftyArr:[],
      pageTable: {
        pageSize: 10,
        pageNum: 1
      },
      totalTable: 0,
      page: {
        pageSize: 10,
        pageNum: 1
      },
      total: 0
    };
  },
  components: {
    Pagination,
    stockFlow
  },
  methods: {
    getTableData() {
        findFactory().then(response => {
        if (response.data.success) {
          this.ftyArr = response.data.data.list;
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
      findWhAll().then(response => {
        if (response.data.success) {
          this.whList = response.data.data.list;
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
      findAreaAll().then(response => {
        if (response.data.success) {
          this.areaList = response.data.data.list;
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
      const params = {
        ...this.pageTable,
        ...this.inqu
      };
      findMaterials(params).then(response => {
        if (response.data.success) {
          this.tableData = response.data.data.list;
          this.totalTable = response.data.data.total;
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
    },
    reset() {
      this.inqu.materialName = "";
      this.bachTableData=[];
      this.getTableData();
    },
    getBachTableData(row){
    //     let params = {
    //     ...this.page
    //   };
    //   params.stockCode=row.id;
        findByStockCode(row.id)
        .then(response => {
            if(response.data.success){
                this.bachTableData=response.data.data.list;
                // this.totalTable=response.data.data.total;
            }else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
        });
    },
    hidenDialog(){
        this.addDialogVisible=false;
    },
    hidenDialogCancel(){
        this.addDialogVisible=false;
    },
    seeDetails(row){
        this.addDialogVisible=true;
        this.title="出入库流出";
        this.batch=row.batch;
    }
  },
  mounted(){
      this.getTableData();
  },
  computed:{
      formatArea() {
      return function(row) {
        for (let index = 0; index < this.areaList.length; index++) {
          const element = this.areaList[index];
          if (
            row.whCode == element.whCode &&
            row.areaCode == element.areaCode
          ) {
            return element.areaName;
          }
        }
      };
    },
    formatWh() {
      return function(row) {
        for (let index = 0; index < this.whList.length; index++) {
          const element = this.whList[index];
          if (element.warehouseCode == row.whCode) {
            return element.warehouseName;
          }
        }
      };
    },
    formatFactory() {
      return function(row) {
        for (let index = 0; index < this.ftyArr.length; index++) {
          const element = this.ftyArr[index];
          if (element.depart_code == row.ftyCode) {
            return element.depart_name;
          }
        }
      };
    }
  }
};
</script>
<style scoped>
</style>