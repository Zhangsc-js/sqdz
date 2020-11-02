<template>
  <div>
    <el-form :model="tableData" label-width="180px" ref="tableData" :rules="rule">
      <el-row>
        <el-col :span="10">
          <el-form-item label="物料编号：" prop="materialCode">
            <el-input v-model="tableData.materialCode" autocomplete="off" :disabled="isDisable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="物料名称：" prop="materialName">
            <el-input v-model="tableData.materialName" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="物料规格：" prop="specification">
            <el-input v-model="tableData.specification" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="物料材质：" prop="quality">
            <el-input v-model="tableData.quality" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="物料类别：" prop="category">
            <el-select
              v-model="tableData.category"
              filterable
              placeholder="请选择"
              style="width: 100%;height: 100%"
            >
              <el-option
                v-for="(item,index) in this.category"
                :key="index"
                :label="item.label"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="物料型号：" prop="modelNumber" style="width: 100%;height: 100%">
            <el-input v-model="tableData.modelNumber" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="供应方式：" prop="supplyMode">
            <el-select
              v-model="tableData.supplyMode"
              filterable
              placeholder="请选择"
              style="width: 100%;height: 100%"
            >
              <el-option
                v-for="(item,index) in this.supplyMode"
                :key="index"
                :label="item.label"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="单位：" prop="primaryUnit">
            <el-select
              v-model="tableData.primaryUnit"
              filterable
              placeholder="请选择"
              style="width: 100%;height: 100%"
            >
              <el-option
                v-for="(item,index) in this.UNIT_ALL"
                :key="index"
                :label="item.label"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="安全库存：" prop="safeInventory">
            <el-input v-model="tableData.safeInventory" type="number" min="0" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="最大库存：" prop="maxInventory">
            <el-input v-model="tableData.maxInventory" type="number" min="0" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="最小库存：" prop="minInventory">
            <el-input v-model="tableData.minInventory" type="number" min="0" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="再订货点：" prop="reorderPoint">
            <el-input v-model="tableData.reorderPoint" type="number" min="0" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="最大订购量：" prop="maxOrderQuantity">
            <el-input v-model="tableData.maxOrderQuantity" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="采购周期(天)：" prop="purchaseCycle">
            <el-input v-model="tableData.purchaseCycle" type="number" min="0" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button icon="el-icon-close" @click="cancel()">取 消</el-button>
      <el-button type="primary" icon="el-icon-check" @click="save()">保存</el-button>
    </div>
  </div>
</template>

<script>
import {
  addMaterial,
  getMaterialById,
  initDataMaterial
} from "@/api/productionPlanning";

export default {
  name: "ppcAddMaterial",
  data() {
    return {
      tableData: {
        materialCode: "",
        materialName: "",
        specification: "",
        quality: "",
        category: "",
        modelNumber: "",
        supplyMode: "",
        materialTypeId: "",
        dwgNo: "",
        primaryUnit: "",
        safeInventory: 999,
        maxInventory: 9999,
        minInventory: 0,
        reorderPoint: 9999,
        maxOrderQuantity: 9999,
        purchaseCycle: 0
      },
      isDisable: false,
      category: [],
      supplyMode: [],
      UNIT_ALL: [],
      rule: {
        materialCode: [{ required: true, message: "请输入物料编码" }],
        materialName: [
          { required: true, message: "请输入物料名称", trigger: "blur" }
        ],
        specification: [
          { required: true, message: "请输入物料规格", trigger: "blur" }
        ],
        category: [
          { required: true, message: "请输选择物料类型", trigger: "blur" }
        ],
        primaryUnit: [
          { required: true, message: "请输选择单位", trigger: "blur" }
        ],
        safeInventory: [
          { required: true, message: "请输入安全库存", trigger: "blur" }
        ],
        maxInventory: [
          { required: true, message: "请输入最大库存", trigger: "blur" }
        ],
        minInventory: [
          { required: true, message: "请输入最小库存", trigger: "blur" }
        ],
        reorderPoint: [
          { required: true, message: "请输入再订货点", trigger: "blur" }
        ],
        maxOrderQuantity: [
          { required: true, message: "请输入最大订购量", trigger: "blur" }
        ],
        purchaseCycle: [
          { required: true, message: "请输入采购周期", trigger: "blur" }
        ]
      }
    };
  },
  props: {
    id: {
      type: String,
      required: true
    },
    trigger: {
      type: Boolean,
      required: false
    },
    type: {
      type: String,
      required: true
    }
  },
  watch: {
    trigger() {
      if (this.trigger) this.getData();
    }
  },

  mounted() {
    this.initDataMaterial();
    this.getData();
  },
  methods: {
    initDataMaterial() {
      initDataMaterial()
        .then(response => {
          if (response.data.success) {
            let data = response.data.data;
            this.category = data.MATERIAL_CATEGORY;
            // for (let i = 0; i < data.UNIT_ALL.length; i++) {
            //     data.UNIT_ALL[i].label=data.UNIT_ALL[i].code+"-"+data.UNIT_ALL[i].name;
            // }
            this.UNIT_ALL = data.UNIT_ALL;
            this.supplyMode = data.SUPPLIER_MODE;
          } else {
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    save() {
      this.$refs["tableData"].validate((valid, object) => {
        if (valid) {
          addMaterial(this.tableData)
            .then(response => {
              const result = response.data;
              if (result.success) {
                this.$message.success(
                  this.type == "1" ? "新增成功" : "更新成功"
                );
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
          this.$message.error(Object.values(object)[0][0].message);
        }
      });
    },
    reSet() {
      this.tableData = {
        materialCode: "",
        materialName: "",
        specification: "",
        quality: "",
        category: "",
        modelNumber: "",
        supplyMode: "",
        materialTypeId: "",
        dwgNo: "",
        primaryUnit: "",
        safeInventory: 999,
        maxInventory: 9999,
        minInventory: 0,
        reorderPoint: 9999,
        maxOrderQuantity: 9999,
        purchaseCycle: 0
      };
    },
    getData() {
      if (this.type == "1") {
        this.isDisable = false;
        this.reSet();
        this.$refs["tableData"].resetFields();
      } else {
        this.isDisable = true;
        getMaterialById(this.id)
          .then(response => {
            this.tableData = response.data.data;
          })
          .catch(e => {
            this.$message({
              type: "error",
              message: e.message
            });
          });
      }
    },
    cancel() {
      this.$emit("cancel");
    }
  }
};
</script>

<style lang="css" scoped>
.el-select {
  width: 265.1px;
}
</style>
