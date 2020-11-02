<template>
  <div style="height: 100%;" class="procurementAndStorageDetail"  >
    <div ref=print>
    <el-form :inline="true" :rules="rules" :model="inpu" class="demo-form-inline" ref="inpu">
      <el-row>
        <el-form-item label="入库单号" prop="storageInCode">
          <el-input v-model="inpu.storageInCode" :disabled="true" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="入库类型" prop="receiptType">
          <el-select
            v-model="inpu.receiptType"
            filterable
            :disabled="showType"
            placeholder="请选择"
            style="width: 200px;height: 100%"
          >
            <el-option
              v-for="item in storageTypes"
              :key="item.code"
              :label="item.label"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="过账日期" prop="postingDate">
          <el-date-picker
            v-model="inpu.postingDate"
            type="date"
            placeholder="截止日期"
            style="width: 200px;"
            value-format="yyyy-MM-dd"
            :disabled="inpu.status==3"
          ></el-date-picker>
        </el-form-item>
        <el-form-item v-if="!showMainAdd" label="来源单据号" prop="receiptCode">
          <el-input v-model="inpu.receiptCode" :disabled="edits" style="width: 200px;"></el-input>
        </el-form-item>
      </el-row>
      <el-row style="padding:10px;">
        <el-button class="no-print" v-if="show&&inpu.status!=3" type="primary" @click="save" icon="el-icon-check">保存</el-button>
      </el-row>
    </el-form>
    <!-- 表格主体 -->
    <el-divider content-position="left">明细列表</el-divider>
    <el-button
      v-if="showMainAdd&&inpu.status==1"
      class="addRow no-print"
      type="primary"
      @click="addRow"
      icon="el-icon-plus"
      :disabled="clickAdd"
    >新增</el-button>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
      <el-table :data="ruleForm.tableData" stripe style="width: 100%">
        <el-table-column prop="receiptItemCode" label="关联单据明细单号" width="140">
          <template v-slot="scope">
            <el-form-item
              :prop="'tableData.' + scope.$index + '.'+'receiptItemCode'"
              v-if="scope.row.flag"
            >
              <el-input v-model="scope.row.receiptItemCode" :disabled="true"></el-input>
            </el-form-item>
            <span v-else>{{ scope.row.receiptItemCode }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="materialCode" label="物料编码" min-width="100">
          <template v-slot="scope">
            <el-form-item
              :prop="'tableData.' + scope.$index + '.'+'materialCode'"
              :rules="rules.common"
              v-if="scope.row.flag"
            >
              <el-input
                v-model="scope.row.materialCode"
                v-on:click.native="showMaterialInfo"
                :disabled="edits"
              ></el-input>
            </el-form-item>
            <span v-else>{{ scope.row.materialCode }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="materialName" label="物料名称" min-width="100">
          <template v-slot="scope">
            <el-form-item
              :prop="'tableData.' + scope.$index + '.'+'materialName'"
              :rules="rules.common"
              v-if="scope.row.flag"
            >
              <el-input v-model="scope.row.materialName" :disabled="true"></el-input>
            </el-form-item>
            <span v-else>{{ scope.row.materialName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderQty" label="订单数量">
          <template v-slot="scope">
            <el-form-item
              :prop="'tableData.' + scope.$index + '.'+'orderQty'"
              :rules="rules.common"
              v-if="scope.row.flag"
            >
              <el-input v-model="scope.row.orderQty" :disabled="inpu.source==2"></el-input>
            </el-form-item>
            <span v-else>{{ scope.row.orderQty }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="inventoryQty" label="已入库数量" show-overflow-tooltip min-width="100">
          <template v-slot="scope">
            <el-form-item
              :prop="'tableData.' + scope.$index + '.'+'inventoryQty'"
              v-if="scope.row.flag"
            >
              <el-input v-model="scope.row.inventoryQty" :disabled="true"></el-input>
            </el-form-item>
            <span v-else>{{ scope.row.inventoryQty }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="qty" label="本次需要入库数量" show-overflow-tooltip min-width="100">
          <template v-slot="scope">
            <el-form-item
              :prop="'tableData.' + scope.$index + '.'+'qty'"
              :rules="rules.qty"
              v-if="scope.row.flag"
            >
              <el-input
                v-model="scope.row.qty"
                type="number"
                :disabled="false"
                :max="scope.row.orderQty-scope.row.inventoryQty"
                :min="0"
                @input="numberChange($event,scope.row)"
              ></el-input>
            </el-form-item>
            <span v-else>{{ scope.row.qty }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="departCode" label="采购部门" min-width="120">
          <template v-slot="scope">
            <el-form-item
              :prop="'tableData.' + scope.$index + '.'+'departCode'"
              :rules="rules.common"
              v-if="scope.row.flag"
            >
              <el-select
                v-model="scope.row.departCode"
                filterable
                placeholder="请选择"
                :disabled="false"
              >
                <el-option
                  v-for="item in departArr"
                  :key="item.code"
                  :label="item.label"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <span v-else>{{formatDepart(scope.row.departCode) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="supplierCode" label="供货商" min-width="120">
          <template v-slot="scope">
            <el-form-item
              :prop="'tableData.' + scope.$index + '.'+'supplierCode'"
              :rules="rules.common"
              v-if="scope.row.flag"
            >
              <el-select
                v-model="scope.row.supplierCode"
                filterable
                placeholder="请选择"
                :disabled="false"
              >
                <el-option
                  v-for="item in supplierArr"
                  :key="item.supplierCode"
                  :label="item.supplierName"
                  :value="item.supplierCode"
                ></el-option>
              </el-select>
            </el-form-item>
            <span v-else>{{ formatSupplier(scope.row.supplierCode) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ftyCode" label="工厂" min-width="120">
          <template v-slot="scope">
            <el-form-item
              :prop="'tableData.' + scope.$index + '.'+'ftyCode'"
              :rules="rules.common"
              v-if="scope.row.flag"
            >
              <el-select
                v-model="scope.row.ftyCode"
                filterable
                placeholder="请选择"
                :disabled="false"
                @change="selectFty(scope.row)"
              >
                <el-option
                  v-for="item in ftyArr"
                  :key="item.depart_code"
                  :label="item.depart_name"
                  :value="item.depart_code"
                ></el-option>
              </el-select>
            </el-form-item>
            <span v-else>{{ formatFactory(scope.row.ftyCode) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="whCode" label="仓库号" min-width="120">
          <template v-slot="scope">
            <el-form-item
              :prop="'tableData.' + scope.$index + '.'+'whCode'"
              :rules="rules.common"
              v-if="scope.row.flag"
            >
              <el-select
                v-model="scope.row.whCode"
                filterable
                placeholder="请选择"
                :disabled="false"
                @change="selectWh(scope.row)"
              >
                <el-option
                  v-for="item in scope.row.whArr"
                  :key="item.warehouseCode"
                  :label="item.warehouseName"
                  :value="item.warehouseCode"
                ></el-option>
              </el-select>
            </el-form-item>
            <span v-else>{{ formatWh(scope.row.whCode) }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="locationCode" label="库存地点">
        <template v-slot="scope">
          <el-input v-model="scope.row.locationCode" v-if="scope.row.flag" :disabled="true"></el-input>
          <span v-else>{{ scope.row.locationCode }}</span>
        </template>
        </el-table-column>-->
        <el-table-column prop="areaCode" label="存储区" min-width="120">
          <template v-slot="scope">
            <el-form-item
              :prop="'tableData.' + scope.$index + '.'+'areaCode'"
              :rules="rules.common"
              v-if="scope.row.flag"
            >
              <el-select
                v-model="scope.row.areaCode"
                filterable
                placeholder="请选择"
                :disabled="false"
                @change="selectArea(scope.row)"
              >
                <el-option
                  v-for="item in scope.row.areaArr"
                  :key="item.areaCode"
                  :label="item.areaName"
                  :value="item.areaCode"
                ></el-option>
              </el-select>
            </el-form-item>
            <span v-else>{{ formatArea(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="binCode" label="仓位" min-width="120">
          <template v-slot="scope">
            <el-form-item
              :prop="'tableData.' + scope.$index + '.'+'binCode'"
              :rules="rules.common"
              v-if="scope.row.flag"
            >
              <el-select v-model="scope.row.binCode" filterable placeholder="请选择" :disabled="false">
                <el-option
                  v-for="item in scope.row.binArr"
                  :key="item.binCode"
                  :label="item.binCode"
                  :value="item.binCode"
                ></el-option>
              </el-select>
            </el-form-item>

            <span v-else>{{ scope.row.binCode }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="batch" label="批次号" width="180">
          <template v-slot="scope">
            <el-form-item :prop="'tableData.' + scope.$index + '.'+'batch'" v-if="scope.row.flag">
              <el-input v-model="scope.row.batch" :disabled="true"></el-input>
            </el-form-item>
            <span v-else>{{ scope.row.batch }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="show&&+inpu.status!=3"
          align="center"
          label="操作"
          fixed="right"
          width="120px"
          
        >
        
          <template v-slot="scope">
           
            <el-button
              type="text"
              v-if="!scope.row.visibleCancel"
              size="small"
              @click.stop="editRow(scope.row)"
            >更新</el-button>
            <el-button
              type="text"
              v-if="scope.row.visibleCancel"
              size="small"
              @click.stop="saveMain(scope.row)"
            >保存</el-button>
            <el-button
              type="text"
              v-if="scope.row.visibleCancel"
              size="small"
              @click.stop="cancelMain(scope.row)"
            >取消</el-button>
            <el-button
              type="text"
              v-if="scope.row.id && !scope.row.visibleCancel"
              size="small"
              @click.stop="deleteRow(scope.row)"
            >删除</el-button>
            
          </template>
        
        </el-table-column>
      </el-table>
    </el-form>
    <div class="no-print">
    <Pagination
      :total="totalTable"
      :page.sync="pageTable.pageNum"
      :limit.sync="pageTable.pageSize"
      @pagination="getTableData"
      
    /></div>
    <el-dialog title="选择物料" :visible.sync="sltMaterialDialogVisible" width="55%" append-to-body>
      <materialInfo @save="categoryDialog" :category="category" @cancel="hidenDialogCancel" />
    </el-dialog>
    <div slot="footer" class="dialog-footer no-print" >
      <el-button type="primary" @click="cancel" icon="el-icon-close">取消</el-button>
      <el-button type="primary" v-if="show&&inpu.status==1" @click="commit" icon="el-icon-check">提交</el-button>
      <el-button type="primary" @click="save" v-if="!show" icon="el-icon-check">保存</el-button>
      <el-button type="primary" @click="printpage" icon="el-icon-check">打印</el-button>
    </div>
    
    </div>
  </div>
</template>
<script>
import EditTable from "@/components/EditTable";
import Pagination from "@/components/Pagination";
import materialInfo from "../../../ppc/plannedProduction/ppc-bom/materialInfo";
import { selectPartment } from "@/api/sys";
import {
  findSysPurchaseOrderDetailByMainNo,
  updateSysPurchaseOrderDetail
} from "@/api/sys/purchase";
import { findPullSupplier } from "@/api/sys/suppler";
import {
  findSysWmsWarehousePullDownAll,
  findSysWmsAreaPullDownAll,
  findSysWmsBinAll,
  saveWmsStorageInBill,
  findWmsStorageInBillItemByStorageInCode,
  findWmsStorageInBillItemById,
  saveWmsStorageInBillItem,
  updateWmsStorageInBillItem,
  updateWmsStorageInBill,
  findFactory,
  findPullSysWhWarehouseByDepartCode,
  findPullWmsBin,
  findWmsStorageInBillById,
  findAreaAll,
  findWhAll,
  findBinAll,
  deleteWmsStorageInBillItem,
  findStorageTypes
} from "@/api/sys/wms/warehouse";
export default {
  components: {
    EditTable,
    Pagination,
    materialInfo
  },
  data() {
    return {
      codeType: true,
      edits: false,
      category: "1,2,3,4",
      sltMaterialDialogVisible: false,
      inpu: {
        id: "",
        storageInCode: "",
        source: 0,
        receiptType: "1",
        postingDate: "",
        batch: "",
        receiptCode: "",
        status: 0
      },
      showAdd: false,
      clickAdd: false,
      whList: [],
      showMainAdd: false,
      showType: false,
      areaList: [],
      binList: [],
      tableData: [],
      podArr: [],
      departArr: [],
      supplierArr: [],
      ftyArr: [],
      whArr: [],
      areaArr: [],
      binArr: [],
      show: true,
      storageTypes: [],
      pageTable: {
        pageNum: 1,
        pageSize: 10
      },
      totalTable: 0,
      authority: true,
      rules: {
        // storageInCode: [
        //   {
        //     required: true,
        //     message: "请输入入库单号",
        //     trigger: ["blur", "change"]
        //   }
        // ],
        receiptType: [
          {
            required: true,
            message: "请输入入库类型",
            trigger: ["blur", "change"]
          }
        ],
        postingDate: [
          {
            required: true,
            message: "请选择过账日期",
            trigger: ["blur", "change"]
          }
        ],
        receiptCode: [
          {
            required: true,
            message: "请输入来源单据号",
            trigger: ["blur", "change"]
          }
        ],
        common: [
          {
            required: true,
            message: "请输入或选择正确信息",
            trigger: ["blur", "change"]
          }
        ],
        qty: [
          {
            required: true,
            message: "请输入数量",
            trigger: ["blur", "change"]
          }
        ]
      }
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
    }
  },
  watch: {
    trigger() {
      if (this.trigger) this.getData();
    },
    type(val){
      console.log(val);
    },
    id(val){
      console.log(val);
    }
  },
  methods: {
    showMaterialInfo() {
      this.sltMaterialDialogVisible = true;
    },
    numberChange(val, row) {
      if (+val > row.orderQty - row.inventoryQty) {
        row.qty = row.orderQty - row.inventoryQty;
      }
    },
    categoryDialog(data) {
      this.tableData[0].materialCode = data.materialCode;
      this.tableData[0].materialName = data.materialName;
      this.tableData[0].specification = data.specification;
      this.tableData[0].quality = data.quality;
      this.tableData[0].color = data.color;
      this.tableData[0].unit = data.primaryUnit;
      this.sltMaterialDialogVisible = false;
    },
    hidenDialogCancel() {},
    printpage() {
      //  let bdhtml=window.document.body.innerHTML;
      //  console.log(bdhtml);
      //  let sprnstr="<!--startprint-->";
      //  let  eprnstr="<!--endprint-->";
      //  let  prnhtml=bdhtml.substr(bdhtml.indexOf(sprnstr)+17);
      //   prnhtml=prnhtml.substring(0,prnhtml.indexOf(eprnstr));
      //   window.document.body.innerHTML=prnhtml;
      // window.print();
      
      this.$print(this.$refs.print);
      
    },
    addRow() {
      const row = {
        flag: true,
        visibleCancel: true,
        storagekInCode: "",
        materialCode: "",
        materialName: "",
        orderQty: "",
        inventoryQty: "",
        theInventoryQty: "",
        departCode: "",
        supplierCode: "",
        specification: "",
        quality: "",
        unit: "",
        color: "",
        ftyCode: "",
        whCode: "",
        areaCode: "",
        binCode: "",
        locationCode: "",
        batch: "",
        qty: "",
        whArr: [],
        areaArr: [],
        binArr: []
      };
      this.tableData.unshift(row);
      this.edits = false;
    },
    commit() {
      this.inpu.status = "2";
      updateWmsStorageInBill(this.inpu).then(response => {
        if (response.data.success) {
          this.$message.success("提交成功！");
          this.$emit("save");
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
    },
    save() {
      if (this.type == "1") {
        this.$refs["ruleForm"].validate(val => {
          if (!val) {
            return this.$message.error("请正确填写信息！");
          } else {
            this.inpu.status = 1;
            let params = {
              ...this.inpu
            };
            this.tableData.forEach(element => {
              if (+element.qty + element.inventoryQty == element.orderQty) {
                element.status = 2;
              } else {
                element.status = 1;
              }
            });
            params.wmsStorageInBillItemVos = this.tableData;
            saveWmsStorageInBill(params).then(response => {
              if (response.data.success) {
                this.$message.success("新增成功!");
                
                // this.inpu.batch=response.data.data.data.batch;
                this.$emit("save");
              } else {
                this.$message.error(
                  response.data.message + ":" + response.data.data
                );
              }
            });
          }
        });
      } else if (this.type == "2") {
        updateWmsStorageInBill(this.inpu).then(response => {
          if (response.data.success) {
            this.$message.success("修改成功!");
          } else {
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
          }
        });
      } else {
        this.$refs["inpu"].validate(val => {
          if (!val) {
            return this.$message.error("请填写完整！");
          } else {
            this.inpu.status = 1;
            saveWmsStorageInBill(this.inpu).then(response => {
              if (response.data.success) {
                this.clickAdd = false;
                this.$message.success("新增成功!");
                this.inpu.id = response.data.data.data.id;
                this.inpu.storageInCode = response.data.data.data.storageInCode;
                this.inpu.batch = response.data.data.data.batch;
                this.$emit("changeType",response.data.data.data.id);
                console.log(this.type+"          "+this.id);
              } else {
                this.$message.error(
                  response.data.message + ":" + response.data.data
                );
              }
            });
          }
        });
      }
    },
    selectPodNo(row) {
      this.podArr.forEach(element => {
        if (element.podNo == row.podNo) {
          row.materialCode = element.materialCode;
          row.materialName = element.materialName;
          row.qty = element.qty;
          row.inventoryQty = element.inventoryQty;
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
    },
    selectFty(row) {
      // row.whArr = [];
      this.$set(row, "whArr", "");
      this.$set(row, "whCode", "");
      let map = {
        departCode: row.ftyCode
      };
      console.log(row.ftyCode);
      findPullSysWhWarehouseByDepartCode(map).then(response => {
        if (response.data.success) {
          // row.whArr = response.data.data.list;
          this.$set(row, "whArr", response.data.data.list);
          console.log(row);
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
    },
    selectWh(row) {
      this.$set(row, "areaArr", "");
      this.$set(row, "areaCode", "");
      row.whArr.forEach(element => {
        if (element.warehouseCode == row.whCode) {
          row.locationCode = element.address;
        }
      });
      findSysWmsAreaPullDownAll(row.whCode).then(response => {
        row.areaArr = response.data.data.list;
      });
    },
    selectArea(row) {
      this.$set(row, "binArr", "");
      this.$set(row, "binCode", "");
      let map = {
        whCode: row.whCode,
        areaCode: row.areaCode
      };
      findPullWmsBin(map).then(response => {
        if (response.data.success) {
          row.binArr = response.data.data.list;
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
    },
    cancelMain(row) {
      //   this.$set(row, "visibleCancel", false);
      //   this.$set(row, "flag", false);
      console.log(this.id);
      this.getData();
    },
    editRow(row) {
      this.$set(row, "visibleCancel", true);
      this.$set(row, "flag", true);
      //   row.visibleCancel = true;
      //   row.flag = true;
    },
    cancel() {
      this.$emit("cancel");
    },
    emptyInpu() {
      this.inpu = {
        id: "",
        storageInCode: "",
        source: 0,
        receiptType: "1",
        postingDate: "",
        batch: "",
        receiptCode: "",
        status: 0
      };
    },
    getData() {
      console.log(this.type);
      this.showType = false;
      this.codeType = true;
      this.edits = false;
      this.show = true;
      this.showAdd = false;
      this.clickAdd = false;
      findWhAll().then(response => {
        if (response.data.success) {
          this.whList = response.data.data.list;
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
      findStorageTypes().then(response => {
        if (response.data.success) {
          this.storageTypes = response.data.data.STORAGE_TYPE.data;
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
      findBinAll().then(response => {
        if (response.data.success) {
          this.binList = response.data.data.list;
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
      this.showMainAdd = true;
      if (this.type == "1") {
        this.showMainAdd = false;
        this.codeType = false;
        this.show = false;
        this.$refs["inpu"].resetFields();
        this.edits = true;
        this.tableData = [];
        this.inpu.status = 1;
        this.inpu.receiptCode = this.data.poNo;
        this.inpu.source = 2;

        findSysPurchaseOrderDetailByMainNo(this.data.poNo).then(response => {
          if (response.data.success) {
            for (
              let index = 0;
              index < response.data.data.list.length;
              index++
            ) {
              let element = response.data.data.list[index];
              let arr = {
                id: "",
                batch: "",
                storagekInCode: this.inpu.storageInCode,
                receiptItemCode: element.podNo,
                materialCode: element.materialCode,
                materialName: element.materialName,
                orderQty: element.qty,
                inventoryQty: element.sendedQty,
                specification: element.specification,
                quality: element.quality,
                unit: element.unit,
                color: element.color,
                visibleCancel: true,
                flag: true
              };
              this.tableData.push(arr);
            }
          } else {
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
          }
        });
      } else if (this.type == "2") {
        this.showType = true;
        this.$refs["inpu"].resetFields();
        this.edits = true;
        findWmsStorageInBillById(this.id).then(response => {
          if (response.data.success) {
            this.inpu.id = response.data.data.data.id;
            this.inpu.storageInCode = response.data.data.data.storageInCode;
            this.inpu.receiptType = response.data.data.data.receiptType + "";
            this.inpu.receiptCode = response.data.data.data.receiptCode;
            this.inpu.postingDate = response.data.data.data.postingDate;
            this.inpu.batch = response.data.data.data.batch;
            this.inpu.status = response.data.data.data.status;
            this.inpu.source = response.data.data.data.source;
            if (response.data.data.data.source == "2") {
              this.showMainAdd = false;
            } else if (response.data.data.data.source == "1") {
              this.showMainAdd = true;
            }
            this.getTableData();
          } else {
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
          }
        });
      } else if (this.type == "3") {
        this.clickAdd = true;
        this.codeType = false;
        this.showAdd = true;
        this.edit = false;
        this.$refs["inpu"].resetFields();
        this.tableData = [];
        this.inpu.status = 1;
        this.inpu.source = 1;
      }
    },
    changeStatus() {
      let num = 0;
      this.tableData.forEach(element => {
        num = num + element.status;
        if (num == this.tableData.length * 2) {
          this.inpu.status = 3;
          updateWmsStorageInBill(this.inpu).then(response => {
            if (response.data.success) {
            } else {
              this.$message.error(
                response.data.message + ":" + response.data.data
              );
            }
          });
        }
      });
    },
    getTableData() {
      let params = {
        ...this.pageTable
      };
      params.storageInCode = this.inpu.storageInCode;
      findWmsStorageInBillItemByStorageInCode(params).then(response => {
        if (response.data.success) {
          this.tableData = response.data.data.list;
          this.totalTable = response.data.data.total;
        }
      });
    },
    saveMain(row) {
      this.$refs["ruleForm"].validate(val => {
        if (!val) {
          return this.$message.error("请填写完整！");
        } else {
          if (+row.qty < 0) {
            return this.$message.error("请输入大于0的数字");
          } else {
            console.log(+row.qty);
          }
          row.storagekInCode = this.inpu.storageInCode;
          row.batch = this.inpu.batch;
          if (row.id == null) {
            row.inventoryQty = 0;
            if (+row.qty + row.inventoryQty == row.orderQty) {
              row.status = 2;
            } else {
              row.status = 1;
            }

            this.changeStatus();
            saveWmsStorageInBillItem(row).then(response => {
              if (response.data.success) {
                this.$message.success("新增成功!");
                this.getTableData();
              } else {
                this.$message.error(
                  response.data.message + ":" + response.data.data
                );
              }
            });
          } else {
            if (+row.qty + row.inventoryQty == row.orderQty) {
              row.status = 2;
            } else {
              row.status = 1;
            }
            this.changeStatus();
            row.receiptCode=this.inpu.receiptCode;
            row.source=this.inpu.source;
            updateWmsStorageInBillItem(row).then(response => {
              if (response.data.success) {
                this.$message.success("修改成功!");
                this.getTableData();
              }
            });
          }
        }
      });
    },
    deleteRow(row) {
      deleteWmsStorageInBillItem(row.id).then(response => {
        if (response.data.success) {
          this.$message.success("删除成功!");
          this.getTableData();
        }
      });
    }
  },
  mounted() {
    this.getData();
  },
  filters: {},
  computed: {
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
    },
    formatQuantityStorage() {
      return function(row) {
        return row.qty - row.inventoryQty;
      };
    },
    ruleForm() {
      return {
        tableData: this.tableData
      };
    }
  }
};
</script>
<style lang="scss">
.procurementAndStorageDetail .el-form-item.is-error.is-required {
  margin: 12px;
}
</style>
