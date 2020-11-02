<template>
  <div style="height: 100%;">
    <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
      <el-form-item label="状态:">
        <el-checkbox-group v-model="list">
          <el-checkbox 
            v-for="item in this.status"
            :key="item.code"
            :label="item.code"
            :value="item.code"
            
            name="type">{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="出库单号:">
        <el-input v-model="queryForm.storageOutCode"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getData">查询</el-button>
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

      <el-table-column prop="storageOutCode" label="出库单号"></el-table-column>
      <el-table-column prop="source" label="单据来源">
        <template v-slot="scope">
          <span style="width: 200px;">{{ formatSource(scope.row.source) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="receiptType" label="出库类型">
        <template v-slot="scope">
          <span style="width: 200px;">{{ formatReceiptType(scope.row.receiptType) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template v-slot="scope">
          <span style="width: 200px;">{{ formatStatus(scope.row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createBy" label="创建人"></el-table-column>
      <el-table-column prop="createOn" label="创建时间"></el-table-column>
      <el-table-column label="操作" min-width="120">
        <template slot-scope="scope">
          <el-button type="text" @click="update(scope.row)" size="small">更新</el-button>
          <el-button type="text" @click="deleteOut(scope.row)" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-button type="primary" icon="el-icon-plus" @click="selectPick()">查询前置单据</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="addOutBill()">新建出库单</el-button>
    </div>
    <Pagination
      :total="total"
      :page.sync="page.pageNum"
      :limit.sync="page.pageSize"
      @pagination="getData"
    />
    <el-dialog title="查询前置单据" :visible.sync="pickListDialogVisible" width="80%" append-to-body>
      <pickList 
        @save="confirmFront($event)" 
        @cancel="frontDialogCancel" 
        :trigger="pickListDialogVisible" 
        :pickRptCode="pickRptCode"
        :pickMateCodes="pickMateCodes"
        :isDetailSkip="isDetailSkip"
        />
    </el-dialog>
    <el-dialog title="出库单明细" :visible.sync="addDialogVisible" width="80%" @close="closeAddDialog" append-to-body>
      <outStorageDetail 
        @save="addDialogHiden"
        @cancel="addDialogCancel"
        :data="data"
        :type="type"
        :id="id"
        :picks="picks"
        :receiptCode="receiptCode"
        :billType="billType"
        :source="source"
        :trigger="addDialogVisible"
       />
    </el-dialog>
  </div>
</template>
<script>
import {
  findOutList,
  findOutById,
  deleteOutStorage,
  findDictDetails
} from "@/api/wms.js";
import pickList from "./pickList";
import outStorageDetail from "./outStorageDetail";
import Pagination from "@/components/Pagination";
export default {
  data() {
    return {
      tableData: [],
      pickListDialogVisible: false,
      addDialogVisible: false,
      queryForm: {
        checkedStatus: "",
        storageOutCode: ""
      },
      list:[],
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      status: [],
      picks:[],
      sourceArr:[],
      receiptTypeArr:[],
      type:"",
      data:{

      },
      pickRptCode:"",
      pickMateCodes:"",
      isDetailSkip:false,
      id:"",
      receiptCode:"",
      billType:"",
      source:"1"//单据来源
    };
  },
  components: {
    Pagination,
    pickList,
    outStorageDetail
  },
  methods: {
    getData() {
      this.queryForm.checkedStatus="";

      /**
       * 初始化单据类型下拉列表数据
       */
      this.receiptTypeArr = [];
      this.receiptTypeArr.push({"code":"1","name":"基于领料出库"});
      this.receiptTypeArr.push({"code":"2","name":"基于补料出库"});
      this.receiptTypeArr.push({"code":"3","name":"基于换料出库"});
      this.receiptTypeArr.push({"code":"4","name":"基于退料出库"});
      this.receiptTypeArr.push({"code":"5","name":"基于零星领料出库"});

      this.list.forEach(element => {
          this.queryForm.checkedStatus+=element+",";
      });
      const params = {
        ...this.page,
        ...this.queryForm
      };
      //获取出库单状态字典
      findDictDetails("INCOMING_ORDERS_STATUS").then(response => {
        if (response.data.success) {
          this.status = response.data.data;
        }else{
          this.$message.error(response.data.message);
        }
      });
      //获取出库单来源字典
      findDictDetails("STORAGE_SOURCE").then(response => {
        if (response.data.success) {
          this.sourceArr = response.data.data;
        }else{
          this.$message.error(response.data.message);
        }
      });
      findOutList(params).then(response => {
        if (response.data.success) {
          this.tableData = response.data.data.list;
          this.total = response.data.data.total;
        }else{
          this.$message.error(response.data.message);
        }
      });
    },
    selectPick() {
      this.pickListDialogVisible = true;
    },
    addOutBill(){
      this.addDialogVisible = true;
      this.type="3";
    },
    confirmFront(data){
        this.pickListDialogVisible = false;
        this.addDialogVisible=true;
        this.receiptCode = data[0].receiptCode;
        this.billType = data[0].receiptType;
        this.picks = data;
        this.type = "1";
        this.source = "2";
        //this.getData();
    },
    frontDialogCancel() {
      this.pickListDialogVisible = false;
      this.getData();
    },
    addDialogHiden() {
      this.addDialogVisible = false;
      this.getData();
    },
    addDialogCancel() {
      this.addDialogVisible = false;
      this.getData();
    },
    closeAddDialog(){//关闭弹框的事件
      this.getData();
    },
    update(row){
      this.addDialogVisible=true;
      this.id=row.id;
      this.type="2";
    },
    deleteOut(row){
      deleteOutStorage(row.id).then(response => {
        if(response.data.success){
          this.$message.success("删除成功！");
          this.getData();
        }else{
          this.$message.error(response.data.message);
        }
      })
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
    formatReceiptType() {
      return function(data) {
        for (let index = 0; index < this.receiptTypeArr.length; index++) {
          const element = this.receiptTypeArr[index];
          if (element.code == data) {
            return element.name;
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
  }
};
</script>