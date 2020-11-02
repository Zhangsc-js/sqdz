<template>
  <!-- 出库单列表 -->
  <div style="height: 100%;">
    <!-- 查询行 -->
    <el-row>
      <el-form :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="领料单号">
            <el-input v-model="queryForm.pkNo" placeholder></el-input>
        </el-form-item>
        <el-form-item label="单据类型">
          <el-select
              v-model="queryForm.billType"
              filterable
              placeholder="请选择"
              style="width: 200px;height: 100%"
          >
            <el-option
              v-for="item in billTypeArr"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="getData">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <el-table
      highlight-current-row
      :data="tableData"
      stripe
      style=" width: 100%"
      @row-click="checkRow"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="pkNo" label="领料单号"></el-table-column>
      <el-table-column prop="materialCode" label="物料编码"></el-table-column>
      <el-table-column prop="materialName" label="物料名称"></el-table-column>
      <el-table-column prop="specification" label="规格型号"></el-table-column>
      <el-table-column prop="quality" label="材质"></el-table-column>
      <el-table-column prop="pickQty" label="领料量"></el-table-column>
      <el-table-column prop="primaryUnit" label="基本单位"></el-table-column>
      <el-table-column prop="billType" label="单据类型">
        <template v-slot="scope">
         <span>{{ formatBillType(scope.row.billType) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer" v-show="!isSelElm">
      <el-button type="primary" @click="saveData(tableChecked)" icon="el-icon-check">确定</el-button>
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
  findPickList,
  findOutBillType
} from "@/api/wms.js";

export default {
  components: {
    Pagination
  },
  data() {
    return {
      total: 0,
      page: {
        pageNum: 1,
        pageSize: 10
      },
      queryForm: {
        pkNo: "",
        billType: ""
      },
      billTypeArr: [],
      tableData: [],
      tableChecked: [],
      selects: [],
      isSelElm: false
    };
  },
  props: {
    pickRptCode: {
      type: String,
      required: true
    },
    pickMateCodes: {
      type: String,
      required: true
    },
    isDetailSkip: {//是否为出库单明细页面跳转过来的
      type: Boolean,
      required: true
    }
  },
  methods: {
    getData() {
      //初始化清空数据
      this.tableData=[];
      this.tableChecked=[];
      //this.queryForm.pkNo="";
      //this.queryForm.billType="";

      /**
       * 初始化单据类型下拉列表数据
       */
      this.billTypeArr = [];
      this.billTypeArr = findOutBillType();

      if(this.isDetailSkip){
        this.queryForm.pkNo = this.pickRptCode;
        this.queryForm.materialCodes = this.pickMateCodes;
        this.isSelElm = this.isDetailSkip;
      }
      const params = {
        ...this.page,
        ...this.queryForm
      };
      findPickList(params).then(response => {
        let data = response.data;
        if (data.success) {
          this.tableData = data.data.list;
          this.total = data.data.total;
        } else {
          this.$message.error(data.message + ":" + data.data);
        }
      });
    },
    saveData(rows) {
      if(!rows || rows.length<1){
        this.$message.error("至少选择一条单据！");
        return;
      }
      let arr = [];
      let selOrderId = "";
      let flag = true;
      
      rows.forEach(element => {
        if(selOrderId!=''&& selOrderId!=element.workOrderId){
            flag = false;
            return;
        }
        selOrderId = element.workOrderId;
        let obj = {
          editable: true,
          pickedQty: 0,//已出库库数量
          receiptCode: element.pkNo,//领料单编码
          receiptItemCode: element.pkNo,//领料单详情编码
          materialCode: element.materialCode,//物料编码
          materialName: element.materialName,//物料名称
          specification: element.specification,//规格
          orderQty: element.pickQty,//领料量
          quality: element.quality,//材质 
          unit: element.primaryUnit,//基本单位
          ftyCode: "",//工厂编码
          receiptType: element.billType//单据类型
        };
        arr.push(obj);
      });

      if(flag){
        this.getData();
        this.$emit("save", arr);
      }else{
        this.$message.error("请选择领料单号相同的单据！");
        return;
      }
      
    },
    handleSelectionChange(val) {
      this.tableChecked = val;
    },
    checkRow(row) {
      if(this.isSelElm){
        this.$emit("save", row);
      }
    }
    
  },
  mounted() {
    this.getData();
  },
  computed: {
    formatBillType() {
      return function(data) {
        for (let index = 0; index < this.billTypeArr.length; index++) {
          const element = this.billTypeArr[index];
          if (element.code == data) {
            return element.name;
          }
        }
      };
    }
  }
};
</script>