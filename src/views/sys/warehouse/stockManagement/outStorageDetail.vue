<template>
  <div style="height: 100%;">
    <el-form :inline="true" :model="inpu" class="demo-form-inline" ref="inpu">
      <el-row>
        <el-col :span="10" v-show="true">
          <el-form-item label="领料单">
            <span>{{ inpu.receiptCode }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10" v-show="true">
          <el-form-item label="出库单号">
            <span style="width: 200px;">{{inpu.storageOutCode}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="出库类型 " prop="receiptType">
            <el-select
              v-model="inpu.receiptType"
              v-if="!editBill&&isComplent"
              filterable
              placeholder="请选择"
              style="width: 200px;height: 100%"
            >
            <!--<el-option label="基于领料出库" value="1"></el-option>
            <el-option label="基于补料出库" value="2"></el-option>
            <el-option label="基于换料出库" value="3"></el-option>
            <el-option label="基于退料出库" value="4"></el-option>
            <el-option label="基于零星领料出库" value="5"></el-option>-->
            <el-option
              v-for="item in billTypeArr"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
            </el-select>
            <span v-else style="width: 200px;">{{ formatBillType(inpu.receiptType) }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="过账日期">
            <el-date-picker
              v-model="inpu.postingDate"
              v-if="isComplent"
              type="date"
              placeholder="截止日期"
              style="width: 200px;"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
            <span v-else style="width: 200px;">{{ inpu.postingDate }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-show="showable">
        <el-col :span="10">
          <el-form-item label="创建人">
            <span style="width: 200px;">{{inpu.createBy}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="创建时间">
            <span style="width: 200px;">{{inpu.createOn}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-button class="addRow" type="primary" @click="addRow" icon="el-icon-plus">新增明细</el-button>
      <el-table :data="details" :row-class-name="tableRowClassName" stripe style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column :key="Math.random()" type="selection"></el-table-column>
      <el-table-column :key="Math.random()" prop="storageOutItemCode" label="出库单明细编号">
        <template v-slot="scope">
          <span style="width: 200px;">{{scope.row.storageOutItemCode}}</span>
        </template>
      </el-table-column>

      <el-table-column :key="Math.random()" prop="materialCode" label="物料编码">
        <template v-slot="scope">
          <el-input v-model="scope.row.materialCode" v-on:click.native="showMaterialInfo" 
            v-if="scope.row.editable"></el-input>
          <span v-else>{{ scope.row.materialCode }}</span>
        </template>
      </el-table-column>
      <el-table-column :key="Math.random()" prop="materialName" label="物料名称">
        <template v-slot="scope">
          <el-input v-model="scope.row.materialName" v-if="scope.row.editable"></el-input>
          <span v-else>{{ scope.row.materialName }}</span>
        </template>
      </el-table-column>
      <el-table-column :key="Math.random()" prop="whCode" label="仓库" v-if="editBill">
        <template v-slot="scope">
          <el-select
            v-model="scope.row.whCode"
            filterable
            placeholder="请选择"
            :disabled="false"
            v-if="true"
          >
            <el-option
              v-for="item in whArr"
              :key="item.warehouseCode"
              :label="item.warehouseName"
              :value="item.warehouseCode"
            ></el-option>
          </el-select>
          <span v-else>{{ formatWh(scope.row.whCode) }}</span>
        </template>
      </el-table-column>
      <el-table-column :key="Math.random()" prop="orderQty" label="出库单数量">
        <template v-slot="scope">
          <el-input v-model="scope.row.orderQty" v-if="isComplent" type="number"></el-input>
          <span v-else style="width: 200px;">{{scope.row.orderQty}}</span>
        </template>
      </el-table-column>
      <el-table-column :key="Math.random()" prop="pickedQty" label="已出库数量">
        <template v-slot="scope">
          <span style="width: 200px;">{{scope.row.pickedQty}}</span>
        </template>
      </el-table-column>
      <el-table-column :key="Math.random()" v-if="editBill" align="center" label="操作" fixed="right" width="120px">
        <template v-slot="scope">
          <el-button
            v-if="!scope.row.editable"
            type="text"
            size="small"
            @click.stop="distribution(scope.row)"
          >配货</el-button>
        </template>
      </el-table-column>
    </el-table>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" v-if="isDelete" @click="deleteSelRows(tableChecked)" icon="el-icon-check">批量删除</el-button>
      <el-button type="primary" v-if="isSave" @click="save" icon="el-icon-check">保存</el-button>
      <el-button type="primary" v-if="isSubmit" @click="submitOut" icon="el-icon-check">提交</el-button>
    </div>

    <el-dialog title="配货信息" :visible.sync="disDialogVisible" width="60%" append-to-body>
      <outStorageDistribution
        @save="disDialogHiden"
        @cancel="disDialogCancel"
        :disData="disData"
        :id="id"
        :trigger="disDialogVisible"
       />
    </el-dialog>
    <el-dialog title="选择物料" :visible.sync="sltMaterialDialogVisible" width="60%" append-to-body>
      <outSelMaterialInfo 
        @save="selMaterailDialog" 
        @cancel="materailCancel" 
      />
    </el-dialog>
    <el-dialog title="选择前置单据" :visible.sync="sltReceiptDialogVisible" width="70%" append-to-body>
      <pickList 
        @save="selReceiptDialog($event)" 
        @cancel="receiptCancel" 
        :pickRptCode="pickRptCode"
        :pickMateCodes="pickMateCodes"
        :isDetailSkip="isDetailSkip"
      />
    </el-dialog>
  </div>
</template>
<script>
import EditTable from "@/components/EditTable";
import { selectPartment } from "@/api/sys";
import {
  saveOutStorage,
  findWhAll,
  findWmsOutStorageById,
  deleteOutStorageDetails,
  submitOutStorage,
  findMaterials,
  findOutBillType
} from "@/api/wms.js";
import outStorageDistribution from "./outStorageDistribution";
import outSelMaterialInfo from "./outSelMaterialInfo";
import pickList from "./pickList";
export default {
  components: {
    EditTable,
    outStorageDistribution,
    outSelMaterialInfo,
    pickList
  },
  data() {
    return {
      disDialogVisible: false,
      sltMaterialDialogVisible:false,
      sltReceiptDialogVisible:false,
      inpu: {
        id: "",
        source: "",//单据来源
        storageOutCode: "",//出库单号
        createBy:"",
        createOn:"",
        receiptType: 1,
        postingDate: "",
        receiptCode: "",
        status: "",
        remark: ""
      },
      details: [],
      disData: {},
      pickRptCode:"",
      pickMateCodes:"",
      isDetailSkip:true,
      whArr: [],
      materialArr: [],
      billTypeArr: [],
      pageTable: {
        pageNum: 1,
        pageSize: 10
      },
      tableChecked: [],
      totalTable: 0,
      showable: false,//用于控制元素是否显示
      //editable: false,//用于输入框是否可编辑、
      editBill: false,//用于标识是否为编辑出库单
      pickBill: false,//用于标识是否为前置单据跳转
      isSubmit: false,//用户控制提交按钮是否显示
      isSave: true,//用户控制保存按钮是否显示
      isDelete: true,//用户控制批量删除按钮是否显示
      isComplent: true
    };
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    trigger: {
      type: Boolean,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    picks: {
      type: Array,
      required: true
    },
    receiptCode: {
      type: String,
      required: true
    },
    source: {
      type: String,
      required: true
    },
    billType: {
      type: String,
      required: true
    }
  },
  watch: {
    trigger() {
      if (this.trigger) this.getData();
    }
  },
  methods: {
    save() {//保存按钮
      
      let that = this;

      //处理提交数据
      for (let index = 0; index < this.details.length; index++) {
        const element = this.details[index];
        element.inventoryQty = Number(element.inventoryQty) + Number(element.theInventoryQty);
      }

      if (this.type == "1" || this.type == '3') {//新增
        let params = this.inpu;
        params.details = this.details;
        saveOutStorage(params).then(response => {
          if (response.data.success) {
            that.$message.success("新增成功!");
            //this.inpu.id = response.data.data.id;
            //this.editable = false;
            that.$emit("save");
          }else{
            that.$message.error("新增失败!");
          }
        });
      }else{//修改
        let params = this.inpu;
        params.details = this.details;
        saveOutStorage(params).then(response => {
          if (response.data.success) {
            that.$message.success("修改成功!");
            //this.inpu.id = response.data.data.id;
            //this.editable = false;
            that.$emit("save");
          }else{
            that.$message.error("修改失败!");
          }
        });
      }
    },
    distribution(row){//配货按钮
        if(!row.whCode){
          this.$message.error("请先选择仓库!");
          return;
        }

        this.disData = row;
        this.disDialogVisible = true;
    },
    getData() {//初始化页面数据

      //置空数组
      this.tableChecked = [];
      this.disData = {};

      findWhAll().then(response => {
        if (response.data.success) {
          this.whArr = [];
          this.whArr = response.data.data.list;
        }else{
          this.$message.error(response.data.message);
        }
      });
      findMaterials().then(response => {
        if (response.data.success) {
          this.materialArr = [];
          this.materialArr = response.data.data;
        }else{
          this.$message.error(response.data.message);
        }
      });
      
      /**
       * 初始化单据类型下拉列表数据
       */
      this.billTypeArr = [];
      this.billTypeArr = findOutBillType();

      //this.editable = true;
      
      if (this.type == "1") {//领料单转出库单
        this.inpu = {}
        this.details = [];
        this.details = this.picks;
        this.totalTable = this.details.length;
        this.inpu.receiptCode = this.receiptCode;
        this.inpu.status = this.status;
        this.inpu.receiptType = Number(this.billType);
        if(!this.inpu.receiptType || this.inpu.receiptType==''){
          this.inpu.receiptType = this.billTypeArr[0].code;
        }
        this.inpu.source = this.source;
        this.showable = false;
        this.editBill = false;
        this.pickBill = true;

        //控制提交按钮是否显示
         this.showSubmitBut();
      } else if(this.type == '3'){//新增出库单
        this.inpu = {};
        this.inpu.receiptType = 1;
        this.details = [];
        this.inpu.source = 1;
        this.showable = false;
        this.editBill = false;
        this.pickBill = true;

        //控制提交按钮是否显示
        this.showSubmitBut();
      } else if(this.type == '2') {//点击更新按钮跳转过来
        findWmsOutStorageById(this.id).then(response => {
          if (response.data.success) {
            this.inpu = {}
            this.inpu = response.data.data;
            this.details = [];
            this.details = response.data.data.details;
            this.editBill = true;
            this.showable = true;
            this.pickBill = true;
            this.showSubmitBut();
          }else{
            this.$message.error(response.data.message);
          }
        });
      }else{
        console.log("elseelse");
      }

    },
    deleteSelRows(rows) {//勾选删除明细单
      let params = {};
      if(!rows || rows.length<1){
        this.$message.error("至少选择一条明细单数据！");
        return;
      }
      params.outId = this.inpu.id;

      let detailIds = "";
      let mateIndex = [];
      rows.forEach(element => {
        detailIds += element.id + ",";
        mateIndex.unshift(element.index);
      });
      params.detailIds = detailIds;
      if(this.inpu.id){
        deleteOutStorageDetails(params).then(response => {
          if (response.data.success) {
            this.$message.success("删除成功!");
            this.getData();
          }else{
            this.$message.error(response.data.message);
          }
        });
      }else{
        let num = 0;
        this.details.forEach(element => {
          element.index = num;
          num++;
        });
        this.details = this.details.filter(t => (mateIndex.indexOf(t.index)< 0));
      }
      
    },
    submitOut() {//点击提交按钮
      this.inpu.status = "3";
      let params = this.inpu;
      submitOutStorage(params).then(response => {
        if (response.data.success) {
          this.$message.success("提交成功!");
          this.$emit("save");
        }else{
          this.$message.error(response.data.message);
        }
      });
    },
    addRow() {//新增一条出库明细
      if (typeof this.details === 'undefined') {
        this.details = [];
      }

      const row = {
        editable: true,
        storageOutItemCode: "",
        materialCode: "",
        materialName: "",
        ftyCode: "",
        whCode: "",
        orderQty: 0,
        pickedQty: 0
      };
      this.details.unshift(row);
    },
    disDialogHiden() {
      this.disDialogVisible = false;
      this.getData();
    },
    disDialogCancel() {
      this.disDialogVisible = false;
    },
    handleSelectionChange(val) {
      this.tableChecked = val;
    },
    showSubmitBut() {

      if(this.inpu.status=="1"){//草稿状态
        this.isSubmit = false;
        this.isSave = true;
        this.isDelete = true;
        this.isComplent = true;
      }else if(this.inpu.status=="2"){//未完成
        this.isSubmit = true;
        this.isSave = true;
        this.isDelete = false;
        this.isComplent = true;
      }else if(this.inpu.status=="3"){//已完成
        this.isSubmit = false;
        this.isSave = false;
        this.isDelete = false;
        this.showable = false;
        this.editBill = false;
        this.pickBill = true;
        this.isComplent = false;
      }else{
        this.isSubmit = false;
        this.isSave = true;
        this.isDelete = true;
        this.isComplent = true;
      }
    },
    showMaterialInfo(){//显示选择物料弹框
      if(this.inpu.source==1){//手工建单
        this.sltMaterialDialogVisible=true;
      }else if(this.inpu.source==2){//MOM
        this.sltReceiptDialogVisible=true;
        this.pickRptCode = this.inpu.receiptCode;
        let pickMateCodes = "";
        this.details.forEach(element => {
          pickMateCodes += element.materialCode + ",";
        });
        this.pickMateCodes = pickMateCodes;
        this.isDetailSkip = true;
      }
      
    },
    selMaterailDialog(data){//materail
      //let index = data.index;
      //判断物料是否已存在
      let flag = true;
      this.details.forEach(element => {
        if(element.materialCode == data.materialCode){
          this.$message.error("物料："+data.materialName+"("+data.materialCode+") 已存在");
          flag = false;
          return;
        }
      });
      if(flag){
        this.details[0].materialCode=data.materialCode;
        this.details[0].materialName=data.materialName;
        this.sltMaterialDialogVisible=false;
      }
    },
    materailCancel(){
      this.sltMaterialDialogVisible = false;
    },
    selReceiptDialog(data){//materail
      //let index = data.index;
      let flag = true;
      this.details.forEach(element => {
        if(element.materialCode == data.materialCode){
          this.$message.error("物料："+data.materialName+"("+data.materialCode+") 已存在");
          flag = false;
          return;
        }
      });
      if(flag){
        this.details[0].materialCode=data.materialCode;
        this.details[0].materialName=data.materialName;
        this.sltReceiptDialogVisible=false;
      }
    },
    receiptCancel(){
      this.sltReceiptDialogVisible = false;
    },
    tableRowClassName ({row, rowIndex}) {
        //把每一行的索引放进row
      row.index = rowIndex;
    },
  },
  mounted() {
    this.getData();
  },
  filters: {},
  computed: {
    formatWh() {
      return function(data) {
        for (let index = 0; index < this.whArr.length; index++) {
          const element = this.whArr[index];
          if (element.warehouseCode == data) {
            return element.warehouseName;
          }
        }
      };
    },
    formatBillType() {
      return function(data) {
        for (let index = 0; index < this.billTypeArr.length; index++) {
          const element = this.billTypeArr[index];
          if (element.code == data) {
            return element.name;
          }
        }
      };
    },
    formatMaterial() {
      return function(data) {
        for (let index = 0; index < this.materialArr.length; index++) {
          const element = this.materialArr[index];
          if (element.materialCode == data) {
            return element.materialName;
          }
        }
      };
    },
  }
};
</script>