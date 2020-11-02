<template>
  <div style="height: 100%;">
    <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
      <el-form-item label="日期：" prop="startDate">
          <el-date-picker
            v-model="queryForm.startDate"
            type="date"
            placeholder="开始日期"
            style="width: 100%"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="~" prop="endDate">
          <el-date-picker
            v-model="queryForm.endDate"
            type="date"
            placeholder="截止日期"
            style="width: 100%"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
      <el-form-item label="状态:">
        <el-checkbox-group v-model="list">
          <el-checkbox
            v-for="item in this.status"
            :key="item.code"
            :label="item.code"
            :value="item.code"
            name="type"
          >{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="入库单号:">
        <el-input v-model="queryForm.storageInCode"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="getData()" type="primary">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-printer" @click="exportData()" type="primary">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table
      highlight-current-row
      :data="tableData"
      stripe
      border
      height="calc(100% - 52px - 96px - 12px - 12px)"
      style=" width: 100%"
    >
      <el-table-column prop="storageInCode" label="采购入库单号"></el-table-column>
      <el-table-column prop="source" label="单据来源">
        <template v-slot="scope">
          <span style="width: 200px;">{{ formatSource(scope.row.source) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="receiptType" label="入库类型">
        <template v-slot="scope">
          <span style="width: 200px;">{{formatStorageTypes(scope.row.receiptType)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column prop="createBy" label="创建人"></el-table-column>
      <el-table-column prop="createOn" label="创建时间"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template v-slot="scope">
          <span style="width: 200px;">{{ formatStatus(scope.row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="120" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="update(scope.row)" size="small">更新</el-button>
          <el-button type="text" @click="deleteRow(scope.row.id)" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding:10px 0 0 0">
      <el-button type="primary" @click="showFrontDocuments" icon="el-icon-plus">前置单据新增</el-button>
      <el-button type="primary" @click="addProcurementAndStorageDetail" icon="el-icon-plus">手工新增</el-button>
    </div>
    <Pagination
      :total="total"
      :page.sync="page.pageNum"
      :limit.sync="page.pageSize"
      @pagination="getData"
    />
    <el-dialog
      title="查询前置单据"
      :visible.sync="frontDocumentsDialogVisible"
      width="65%"
      height="980px"
      append-to-body
    >
      <frontDocuments @save="confirmFront" @cancel="hidenDialogFron" />
    </el-dialog>
    <el-dialog :title="title" :visible.sync="addDialogVisible" width="65%" append-to-body>
      <procurementAndStorageDetail
        @save="hidenDialog"
        @cancel="hidenDialogCancel"
        @changeType="changeType"
        :data="data"
        :type="type"
        :id="id"
        :trigger="addDialogVisible"
      />
    </el-dialog>
  </div>
</template>
<script>
import {
  findWmsStorageInBillAll,
  findWmsStorageInBillById,
  deleteWmsStorageInBill,
  findIncomingOrdersStatus,
  findStorageTypes,
  findWmsStorageInBillAndItemVo,
  findWhAll,
  findAreaAll,
  findFactory,
} from "@/api/sys/wms/warehouse";
import { selectPartment } from "@/api/sys";
import { findPullSupplier } from "@/api/sys/suppler";
import { simpleDateFormat } from "@/utils/index";
import { exportExcel, resetQueryForm } from "@/utils/common";
import {
  findDictDetails
} from "@/api/wms.js";
import frontDocuments from "./frontDocuments";
import Pagination from "@/components/Pagination";
import procurementAndStorageDetail from "./procurementAndStorageDetail";
import { saveAs } from "file-saver";
export default {
  data() {
    return {
      tableData: [],
      frontDocumentsDialogVisible: false,
      queryForm: {
        list: "",
        storageInCode: "",
        startDate:simpleDateFormat(new Date(new Date().setMonth(new Date().getMonth()-2)),"yyyy-MM-dd"),
        endDate: simpleDateFormat(new Date(), "yyyy-MM-dd")
      },
      list: [],
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      status: [],
      areaList:[],
      whList:[],

      addDialogVisible: false,
      type: "",
      data: {},
      title: "",
      id: "",
      sourceArr:[],
      storageTypes:[],
      ftyArr:[],
      supplierArr:[],
      departArr:[]
    };
  },
  components: {
    Pagination,
    frontDocuments,
    procurementAndStorageDetail
  },
  methods: {
    changeType(data){
      this.type="2";
      this.id=data;
      console.log("this.id"+this.id);
    },
    addProcurementAndStorageDetail() {
      this.type = "3";
      this.addDialogVisible = true;
    },
    update(row) {
      this.addDialogVisible = true;
      this.id = row.id;
      this.type = "2";
      this.title = "更新";
    },
    deleteRow(id) {
      console.log(id);
      deleteWmsStorageInBill(id).then(response => {
        if (response.data.success) {
          this.$message.success("删除成功！");
          this.getData();
        }else {
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
          }
      });
    },
    showFrontDocuments() {
      this.frontDocumentsDialogVisible = true;
    },
    hidenDialogFron() {
      this.frontDocumentsDialogVisible = false;
    },
    exportData(){
      // const fields = {
      //   createOn: "日期",
      //   storageInCode:"入库单号",
      //   source:"单据来源",
      //   receiptType:"入库类型",
      //   receiptCode:"关联单据号",
      //   postingDate:"过账日期",
      //   status:"单据状态",
      //   batch:"批次号",
      //   storageInItemCode:"入库明细单号",
      //   materialCode: "物料编码",
      //   materialName: "物料名称",
      //   departName:"采购部门",
      //   supplierName:"供应商",
      //   orderQty:"订单数量",
      //   inventoryQty:"已入库数量",
      //   ftyCode:"工厂",
      //   whCode:"仓库",
      //   areaCode:"存储区",
      //   binCode:"仓位"
      // };
      // const fileName = "入库单汇总";
      // let exportData=[];
      findWmsStorageInBillAndItemVo(this.queryForm)
      .then(response =>{
         const result = response.data;
         console.log(result);
        if (result) {
          let data = new File([result], { type: "application/octet-stream" });
          saveAs(data, "入库单信息.xls");
        } else {
          this.$message.error(result.message);
        }
      });
    },
    getData() {
      this.queryForm.list = "";
      this.list.forEach(element => {
        this.queryForm.list += element + ",";
      });
      
      const params = {
        ...this.page,
        ...this.queryForm
      };
      console.log(this.queryForm.list);
      findStorageTypes()
      .then(response => {
        if(response.data.success){
          this.storageTypes=response.data.data.STORAGE_TYPE.data;
        }else {
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
      findFactory().then(response => {
        if (response.data.success) {
          this.ftyArr = response.data.data.list;
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
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
      findIncomingOrdersStatus().then(response => {
        if (response.data.success) {
          this.status = response.data.data.INCOMING_ORDERS_STATUS.data;
        }else {
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
          }
      });
      findDictDetails("STORAGE_SOURCE").then(response => {
        if (response.data.success) {
          this.sourceArr = response.data.data;
        }else{
          this.$message.error(response.data.message);
        }
      });
      findWmsStorageInBillAll(params).then(response => {
        if (response.data.success) {
          this.tableData = response.data.data.list;
          this.total = response.data.data.total;
        }else {
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
          }
      });
    },
    confirmFront(data) {
      this.title = "新增入库单";
      this.data = data;
      this.addDialogVisible = true;
      this.type = "1";
      this.hidenDialogFron();
    },
    hidenDialog() {
      this.addDialogVisible=false;
      this.getData();
    },
    hidenDialogCancel() {
      this.addDialogVisible = false;
      this.getData();
    }
  },
  mounted() {
    this.getData();
  },
  computed: {
    formatSource() {
      return function(data) {
        for (let index = 0; index < this.sourceArr.length; index++) {
          const element = this.sourceArr[index];
          if (element.code == data) {
            return element.label;
          }
        }
      };
    },
    formatStatus() {
      return function(data) {
        for (let index = 0; index < this.status.length; index++) {
          const element = this.status[index];
          if (element.code == data) {
            return element.label;
          }
        }
      };
    },
    formatStorageTypes() {
      return function(data) {
        for (let index = 0; index < this.storageTypes.length; index++) {
          const element = this.storageTypes[index];
          if (element.code == data) {
            return element.label;
          }
        }
      };
    },
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
      return function(data) {
        for (let index = 0; index < this.whList.length; index++) {
          const element = this.whList[index];
          if (element.warehouseCode == data) {
            return element.warehouseName;
          }
        }
      };
    },
    formatFactory() {
      return function(data) {
        for (let index = 0; index < this.ftyArr.length; index++) {
          const element = this.ftyArr[index];
          if (element.depart_code == data) {
            return element.depart_name;
          }
        }
      };
    },
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
};
</script>
<style scoped>

</style>