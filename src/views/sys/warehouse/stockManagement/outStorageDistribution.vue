<template>
  <div style="height: 100%;">
    <el-form :inline="true" :model="inpu" class="demo-form-inline" ref="inpu">
      <!--<el-row>
        <el-col :span="10">
          <el-form-item label="客户编码">
            <span style="width: 200px;">{{inpu.customerCode}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="客户描述">
            <span style="width: 200px;">{{inpu.customerName}}</span>
          </el-form-item>
        </el-col>
      </el-row>-->
      <el-row>
        <el-col :span="10">
          <el-form-item label="物料编码">
            <span style="width: 200px;">{{inpu.materialCode}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="物料描述">
            <span style="width: 200px;">{{inpu.materialName}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="仓库号">
            <span style="width: 200px;">{{inpu.whCode}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="出库单数量">
            <span style="width: 200px;">{{inpu.orderQty}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="需出库数量">
            <span style="width: 200px;">{{inpu.ableQty}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="已操作数量">
            <span style="width: 200px;">{{inpu.pickedQty}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 配货明细表格 -->
      <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="batch" label="批次">
        <template v-slot="scope">
          <el-input v-model="scope.row.batch" :disabled="true"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="areaCode" label="存储区">
        <template v-slot="scope">
          <el-input v-model="scope.row.areaCode" :disabled="true"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="binCode" label="仓位">
        <template v-slot="scope">
          <el-input v-model="scope.row.binCode" :disabled="true"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="availableQty" label="库存数量">
        <template v-slot="scope">
          <el-input v-model="scope.row.availableQty" :disabled="true"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="计量单位">
        <template v-slot="scope">
          <el-input v-model="scope.row.unit" :disabled="true"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="theInventoryQty" label="本次出库数量">
        <template v-slot="scope">
          <el-input
            v-model="scope.row.theInventoryQty"
            type="number"
            :disabled="false"
            @keyup.native="handleKeyUp(scope.row)"
          ></el-input>
        </template>
      </el-table-column>
    </el-table>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="cancel" icon="el-icon-check">取消</el-button>
      <el-button type="primary" @click="save" icon="el-icon-check">确定</el-button>
    </div>
  </div>
</template>
<script>
import EditTable from "@/components/EditTable";
import {
  findStockBinList,
  saveStockBins
} from "@/api/wms.js";
export default {
  components: {
    EditTable
  },
  data() {
    return {
      inpu: {
        outBillItemId: "",
        customerCode: "",
        customerName:"",
        materialCode:"",
        materialName: "",
        whCode: "",
        orderQty: "",
        ableQty: "",
        inventoryQty: ""
      },
      tableData: [],
      authority: true
    };
  },
  props: {
    disData: {
      type: Object,
      required: true
    },
    trigger: {
      type: Boolean,
      required: true
    },
    id: {
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
    save() {
        let params = [];
        let totalQty = 0;
        let totalStock = 0;
        for (let index = 0; index < this.tableData.length; index++) {
          const element = this.tableData[index];
          if(element.theInventoryQty){
            totalQty += Number(element.theInventoryQty);
            totalStock += Number(element.availableQty);
            element.outBillItemId = this.inpu.outBillItemId;
            params.push(element);
          }
        }
        if(Number(totalQty)>Number(this.inpu.ableQty)){
          this.$message.error("本次出库数量总和不能大于需出库数量");
          return;
        }
        if(Number(totalQty)>Number(totalStock)){
          this.$message.error("本次出库数量总和不能大于库存数量");
          return;
        }

        saveStockBins(params).then(response => {
          if (response.data.success) {
            //TODO
            this.$message.success("新增成功!");
            this.$emit("save");
          }else{
            this.$message.error("新增失败!");
          }
        });
    },
    cancel() {
      this.$emit("cancel");
    },
    handleKeyUp(row){
        if(Number(row.theInventoryQty)>Number(this.inpu.ableQty)){
          this.$message.error("本次出库数量不能大于需出库数量");
        }
        if(Number(row.theInventoryQty)>Number(row.availableQty)){
          this.$message.error("本次出库数量不能大于库存数量");
        }
        if(Number(row.theInventoryQty)<0){
          this.$message.error("本次出库数量不能小于0");
        }
    },
    getData() {
      let elm = this.disData;
      this.inpu.customerCode = "";
      this.inpu.customerName = "";
      this.inpu.outBillItemId = elm.id;
      this.inpu.materialCode = elm.materialCode;
      this.inpu.materialName = elm.materialName;
      this.inpu.whCode = elm.whCode;
      this.inpu.orderQty = elm.orderQty;//出库单数量
      this.inpu.pickedQty = elm.pickedQty;//已经出库数量
      this.inpu.ableQty = Number(elm.orderQty)-Number(elm.pickedQty);//可出库数量

      let params = {};
      params.whCode = elm.whCode;
      params.materialCode = elm.materialCode;
      findStockBinList(params).then(response => {
        if (response.data.success) {
          this.tableData = response.data.data;
          this.getTableData();
        }
      });

    },

    getTableData() {
      let params = {
        ...this.pageTable
      };
    },
    deleteRow(row) {

    }
  },
  mounted() {
    this.getData();
  },
  filters: {},
  computed: {
    
  }
};
</script>