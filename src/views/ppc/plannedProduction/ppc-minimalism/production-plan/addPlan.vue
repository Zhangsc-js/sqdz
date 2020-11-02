<template>
  <div style="height: calc(100% - 25px)">
    <el-form :model="inpu" label-width="180px" ref="inpu" :rules="rule">
      <el-row>
        <el-col :span="10">
          <el-form-item label="生产车间" prop="workshopCode">
            <el-select
              v-model="inpu.workshopCode"
              clearable
              placeholder="请选择生产车间"
              filterable
              style="width: 100%"
            >
              <el-option
                v-for="item in shop"
                :key="item.proccode"
                :label="item.name"
                :value="item.proccode"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="生产物料" prop="materialCode">
            <el-input
              v-model="inpu.materialCode"
              v-on:click.native="sltMaterial"
              autocomplete="off"
              :disabled="false"
            />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="物料名称" prop="materialName">
            <el-input v-model="inpu.materialName" autocomplete="off" :disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="数量" prop="produceQty">
            <el-input v-model="inpu.produceQty" type="Number" autocomplete="off" :disabled="false" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="单位" prop="unit">
            <el-input v-model="inpu.unit" autocomplete="off" :disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="计划开始" prop="planStartDate">
            <el-date-picker
              v-model="inpu.planStartDate"
              type="date"
              placeholder="开始日期"
              style="width: 100%"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="计划完成" prop="planEndDate">
            <el-date-picker
              v-model="inpu.planEndDate"
              type="date"
              placeholder="截止日期"
              style="width: 100%"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="子销售订单号" prop="saleDetailNo">
            <el-input  v-model="inpu.saleDetailNo" v-on:click.native="saleDetailInfo" autocomplete="off" :disabled="false" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="状态" prop="status">
            <el-select v-model="inpu.status" clearable filterable :disabled="true">
              <el-option
                v-for="item in PP_STATUS"
                :key="item.code"
                :label="item.label"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button icon="el-icon-close" @click="cancel()">取 消</el-button>
      <el-button type="primary" icon="el-icon-check" @click="save()">保存</el-button>
    </div>
    <el-dialog title="选择物料" :visible.sync="sltMaterialDialogVisible" width="65%" append-to-body>
      <sltMaterial
        @save="confirmMaterial"
        :category="category"
        @cancel="hidenDialogCancel"
        :id="objId"
      />
    </el-dialog>
    <el-dialog title="选择销售子订单" :visible.sync="saleDetailInfoDialogVisible" width="65%" append-to-body>
      <saleDetailInfo 
        @save="confirmSaleDetail" 
        @cancel="hidenDialogSale"
        />
    </el-dialog>
  </div>
</template>
<script>
import {
  getSaleMainAll,
  selectDepart,
  getSaleStatus,
  getBomVerStatusList,
  getBomEffect,
  addPpcSaleDetail,
  updatePpcSaleDetail,
  findPpcSaleDetailById,
  initDataPlanOrder,
  saveProducePlan,
  getPpcProducePlanById,
  updateProducePlan
} from "@/api/productionPlanning";
import sltMaterial from "../../ppc-bom/materialInfo";
import { resetQueryForm } from "@/utils/common";
import saleDetailInfo from "./saleDetailInfo"

export default {
  components: {
    sltMaterial,
    saleDetailInfo
  },
  data() {
    return {
      objId: "",
      sltMaterialDialogVisible: false,
      saleDetailInfoDialogVisible:false,
      category: "1,2,3,5,6,99",
      PP_STATUS: [],
      shop: [],
      inpu: {
        id: "",
        unit: "",
        workshopCode: "",
        saleDetailId: "",
        saleDetailNo: "",
        ppNo: "",
        workshopCode: "",
        workshopName: "",
        materialCode: "",
        materialName: "",
        bomCode: "",
        bomName: "",
        bomVer: "",
        produceQty: "",
        unitCode: "",
        unitName: "",
        status: "",
        planStartDate: "",
        planEndDate: ""
      },
      rule: {
        workshopCode: {
          required: true,
          message: "请选择生产车间",
          trigger: ["change", "blur"]
        },
        materialCode: {
          required: true,
          message: "请选择生产物料",
          trigger: ["change", "blur"]
        },
        produceQty: {
          required: true,
          message: "请输入数量",
          trigger: ["change", "blur"]
        },
        planStartDate: {
          required: true,
          message: "请选择计划开始时间",
          trigger: ["change", "blur"]
        },
        planEndDate: {
          required: true,
          message: "请选择计划完成时间",
          trigger: ["change", "blur"]
        }
      }
    };
  },
  props: {
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    trigger: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    cancel(){
      this.$emit("cancel");
    },
    hidenDialogCancel() {
      this.sltMaterialDialogVisible = false;
      
    },
    confirmSaleDetail(data){
      this.inpu.saleDetailId=data.id;
      this.inpu.saleDetailNo=data.sdNo;
      this.saleDetailInfoDialogVisible=false;
    },
    hidenDialogSale(){
      this.saleDetailInfoDialogVisible=false;
    },
    saleDetailInfo(){
      this.saleDetailInfoDialogVisible=true;
    },
    confirmMaterial(data) {
      this.inpu.materialCode = data.materialCode;
      this.inpu.materialName = data.materialName;
      this.inpu.specification = data.specification;
      this.inpu.quality = data.quality;
      this.inpu.unit = data.primaryUnit;
      this.getBomInfo(data.materialCode);
      this.getBomVerStatusList(data.materialCode);
      this.sltMaterialDialogVisible = false;
      this.inpu.unitCode=this.inpu.unit;
    },
    sltMaterial() {
      this.sltMaterialDialogVisible = true;
    },
    getBomInfo(materialCode) {
      getBomEffect(materialCode)
        .then(response => {
          if (response.data.success) {
            this.inpu.bomCode = response.data.data.bomCode;
            this.inpu.bomVer = response.data.data.bomVer;
          } else {
            this.tableData.materialCode = "";
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    getBomVerStatusList(materialCode) {
      getBomVerStatusList(materialCode).then(response => {
        let data = response.data;
        if (data.success) {
          this.bomMap = data.data.list;
        }
      });
    },
    getData() {
      this.reSet();
      this.inpu.unit=this.inpu.unitCode;
      if (this.type == 1) {
        this.$refs["inpu"].resetFields();
        initDataPlanOrder()
          .then(response => {
            if (response.data.success) {
              let shop = response.data.data.WORKSHOP_ALL;
              this.PP_STATUS = response.data.data.PP_STATUS;
              for (let index = 0; index < this.PP_STATUS.length; index++) {
                const element = this.PP_STATUS[index];
                if (element.code == 10) {
                  console.log(element);
                  this.inpu.status = element.code;
                  break;
                }
              }
              for (let i = 0; i < shop.length; i++) {
                shop[i].label = shop[i].name;
                shop[i].value = shop[i].proccode;
              }
              this.shop = shop;
              // this.tableColumn[2].options = shop
            } else {
              this.$message.error(
                response.data.message + ":" + response.data.data
              );
              
            }
          })
          .catch(e => {
            this.$message.error(e.message);
          });
      }else if(this.type==2) {
        getPpcProducePlanById(this.id)
        .then(response => {
          if(response.data.success){
            this.inpu=response.data.data.data;
          }
        });
        initDataPlanOrder()
          .then(response => {
            if (response.data.success) {
              let shop = response.data.data.WORKSHOP_ALL;
              this.PP_STATUS = response.data.data.PP_STATUS;
              for (let i = 0; i < shop.length; i++) {
                shop[i].label = shop[i].name;
                shop[i].value = shop[i].proccode;
              }
              this.shop = shop;
              // this.tableColumn[2].options = shop
            } else {
              this.$message.error(
                response.data.message + ":" + response.data.data
              );
              
            }
          })
          .catch(e => {
            this.$message.error(e.message);
          });
      }
    },
    save() {
      this.$refs["inpu"].validate((valid, object) => {
        if (valid) {
          if (this.inpu.planEndDate < this.inpu.planStartDate) {
            this.$message.error("计划日期不能早于结束日期");
            return;
          }
          for (let index = 0; index < this.shop.length; index++) {
              const element = this.shop[index];
              if(this.inpu.workshopCode==element.proccode){
                this.inpu.workshopName=element.name;
              }
            }
          if (this.type == 1) 
          {
            
            saveProducePlan(this.inpu)
              .then(response => {
                const result = response.data;
                // console.log(result.data.id);
                if (result.success) {
                  this.$message.success("新增成功!");
                  this.$emit("save");
                } else {
                  this.$message.error(result.message + ":" + result.data);
                }
              })
              .catch(e => {
                this.$message({
                  type: "error",
                  message: e.message
                });
              });
          } else {
            updateProducePlan(this.inpu)
              .then(response => {
                const result = response.data;
                if (result.success) {
                  this.$message.success("修改成功!");
                  this.$emit("save");
                } else {
                  this.$message.error(result.message + ":" + result.data);
                }
              })
              .catch(e => {
                this.$message({
                  type: "error",
                  message: e.message
                });
              });
          }
        } else {
          this.$message.error(Object.values(object)[0][0].message);
        }
      });
    },
    reSet(){
      this.inpu={
        id: "",
        unit: "",
        workshopCode: "",
        saleDetailId: "",
        saleDetailNo: "",
        ppNo: "",
        workshopCode: "",
        workshopName: "",
        materialCode: "",
        materialName: "",
        bomCode: "",
        bomName: "",
        bomVer: "",
        produceQty: "",
        unitCode: "",
        unitName: "",
        status: "",
        planStartDate: "",
        planEndDate: ""
      }
    }
  },
  mounted() {
    this.getData();
  },
  watch: {
    trigger() {
      if (this.trigger) this.getData();
    }
  }
};
</script>