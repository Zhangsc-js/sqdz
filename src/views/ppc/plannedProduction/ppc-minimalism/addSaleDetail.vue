<template>
  <div style="height: calc(100% - 25px)">
    <el-form :model="inpu" label-width="180px" ref="inpu">
      <el-row>
        <el-col :span="10">
          <el-form-item label="子订单号" prop="sdNo">
            <el-input v-model="inpu.sdNo" autocomplete="off" :disabled="isDisable || detype=='2'" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="物料编码" prop="materialCode">
            <el-input
              v-model="inpu.materialCode"
              autocomplete="off"
              readonly
              v-on:click.native="sltMaterial"
              :disabled="isDisable"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="物料名称" prop="materialName">
            <el-input v-model="inpu.materialName" autocomplete="off" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="规格" prop="specification">
            <el-input v-model="inpu.specification" autocomplete="off" :disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="材质" prop="quality">
            <el-input v-model="inpu.quality" autocomplete="off" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="颜色" prop="color">
            <el-input v-model="inpu.color" autocomplete="off" :disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="订单数量" prop="qty">
            <el-input v-model="inpu.qty" type="number" min="1" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="已发货数量" prop="sendedQty">
            <el-input v-model="inpu.sendedQty" type="number" min="0" autocomplete="off" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="单位" prop="unit">
            <el-input v-model="inpu.unit" autocomplete="off" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="状态" prop="status">
            <el-select v-model="inpu.status" clearable filterable :disabled="true">
              <el-option
                v-for="item in SALE_STATUS"
                :key="item.code"
                :label="item.label"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="remarks">
        <el-input type="textarea" v-model="inpu.remarks"></el-input>
      </el-form-item>
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
  findPpcSaleDetailById
} from "@/api/productionPlanning";
import sltMaterial from "../ppc-bom/materialInfo";
import { resetQueryForm } from "@/utils/common";
export default {
  components: {
    sltMaterial
  },
  data() {
    return {
      SALE_STATUS: [],
      isDisable: false,
      category: "1,2,3,5,6,99",
      addDialogVisible: false,
      sltMaterialDialogVisible: false,
      objId: "",
      inpu: {
        id: "",
        mainId: "",
        sdNo: "",
        materialCode: "",
        materialName: "",
        specification: "",
        quality: "",
        color: "",
        qty: "",
        sendedQty: "",
        unit: "",
        status: "",
        createBy: "",
        updateBy: "",
        bomCode: "",
        bomVer: ""
      },
      bomMap: []
    };
  },
  props: {
    trigger: {
      type: Boolean,
      required: true
    },
    detype: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    sId: {
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
    confirmMaterial(data) {
      this.inpu.materialCode = data.materialCode;
      this.inpu.materialName = data.materialName;
      this.inpu.specification = data.specification;
      this.inpu.quality = data.quality;
      this.inpu.unit = data.primaryUnit;
      this.getBomInfo(data.materialCode);
      this.getBomVerStatusList(data.materialCode);
      this.sltMaterialDialogVisible = false;
    },
    sltMaterial() {
      this.sltMaterialDialogVisible = true;
    },
    getBomInfo(materialCode) {
      console.log(materialCode);
      getBomEffect(materialCode)
        .then(response => {
          if (response.data.success) {
            this.inpu.bomCode = response.data.data.bomCode;
            this.inpu.bomVer = response.data.data.bomVer;
          } else {
            // this.tableData.materialCode = "";
            this.inpu.materialCode = "";
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
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
    },
    cancel() {
      this.$emit("cancel");
    },
    hidenDialogCancel() {
      this.sltMaterialDialogVisible = false;
    },
    reSet() {
      this.inpu = {
        id: "",
        mainId: "",
        sdNo: "",
        materialCode: "",
        materialName: "",
        specification: "",
        quality: "",
        color: "",
        qty: "1",
        sendedQty: "",
        unit: "",
        status: "",
        createBy: "",
        updateBy: "",
        bomCode: "",
        bomVer: ""
      };
    },
    getData() {
      this.isDisable = false;
      if (this.detype == 1) {
        this.reSet();
        this.inpu.mainId = this.id;
        getSaleStatus().then(response => {
          if (response.data.success) {
            this.SALE_STATUS = response.data.data.SALE_STATUS;
            this.inpu.status = this.SALE_STATUS[0].code;
          }
        });
      } else {
        findPpcSaleDetailById(this.sId).then(response => {
          if (response.data.success) {
            this.inpu = response.data.data.data;
          }
        });
        getSaleStatus().then(response => {
          if (response.data.success) {
            this.SALE_STATUS = response.data.data.SALE_STATUS;
          }
        });
        if (this.inpu.status >= 25) {
          this.isDisable = true;
        } else {
          this.isDisable = false;
        }
      }
    },
    save() {
      console.log(this.detype);
      this.$refs["inpu"].validate((valid, object) => {
        if (valid) {
          console.log(this.detype);
          if (this.detype == 1) {
            addPpcSaleDetail(this.inpu)
              .then(response => {
                const result = response.data;
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
            updatePpcSaleDetail(this.inpu)
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
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
