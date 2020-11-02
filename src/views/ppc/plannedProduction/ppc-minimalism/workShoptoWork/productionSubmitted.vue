<template>
  <div style="height: calc(100% - 25px)">
    <el-form :model="inpu" label-width="180px" ref="inpu" :rules="rule">
      <el-row>
        <el-col :span="7">
          <el-form-item label="生产单号" prop="producePlanNo">
            <el-input v-model="inpu.producePlanNo" autocomplete="off" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="生产物料" prop="materialCode">
            <el-input v-model="inpu.materialCode" autocomplete="off" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="物料名称" prop="materialName">
            <el-input v-model="inpu.materialName" autocomplete="off" :disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7">
          <el-form-item label="合格数量" prop="goodQty">
            <el-input
              v-model="inpu.goodQty"
              type="Number"
              :min="1"
              autocomplete="off"
              :disabled="false"
              @keyup.native="proving('goodQty')"
              @blur="checkData('goodQty',1)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="废品数量" prop="badQty">
            <el-input
              v-model="inpu.badQty"
              type="Number"
              :min="0"
              autocomplete="off"
              :disabled="false"
              @keyup.native="proving('badQty',0)"
              @blur="checkData('goodQty',0)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="单位" prop="unitCode">
            <el-input v-model="inpu.unitCode" autocomplete="off" :disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="报工日期" prop="reportDate">
            <el-date-picker
              v-model="inpu.reportDate"
              type="date"
              placeholder="开始日期"
              style="width: 90%"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="更新进度" prop="progressValue">
            <el-input
              style="width: 90%;"
              v-model="inpu.progressValue"
              autocomplete="off"
              type="Number"
              :disabled="false"
              :min="0"
              :max="100"
              @keyup.native="proving('progressValue')"
              @blur="checkProgress('progressValue')"
            ></el-input>%
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
  getPpcProducePlanById,
  savePpcProducePlanFinish
} from "@/api/productionPlanning";
export default {
  data() {
    return {
      inpu: {
        id: "",
        producePlanId: "",
        producePlanNo: "",
        reportDate: "",
        goodQty: "",
        badQty: "",
        materialCode: "",
        materialName: "",
        workshopCode: "",
        workshopName: "",
        progressValue: ""
      },
      rule: {
        goodQty: {
          required: true,
          message: "请填写合格数量",
          trigger: ["change", "blur"]
        },
        badQty: {
          required: true,
          message: "请填写废品数量",
          trigger: ["change", "blur"]
        },
        reportDate: {
          required: true,
          message: "请选择日期",
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
    trigger: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    reSet() {
      this.inpu = {
        id: "",
        producePlanId: "",
        producePlanNo: "",
        reportDate: "",
        goodQty: "",
        badQty: "",
        materialCode: "",
        materialName: "",
        workshopCode: "",
        workshopName: "",
        progressValue: ""
      };
    },
    getData() {
      // this.reSet();

      getPpcProducePlanById(this.id).then(response => {
        if (response.data.success) {
          console.log(response);
          this.inpu = response.data.data.data;
          this.inpu.producePlanNo = this.inpu.ppNo;
          this.$set(this.inpu, "reportDate", new Date());
          console.log(this.inpu);
          this.$refs["inpu"].resetFields();
        }
      });
    },
    save() {
      this.$refs["inpu"].validate((valid, object) => {
        if (valid) {
          this.inpu.producePlanId = this.id;
          savePpcProducePlanFinish(this.inpu)
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
          this.$message.error(Object.values(object)[0][0].message);
        }
      });
    },
    cancel() {
      this.$emit("cancel");
    },
    proving(target, min) {
      this.inpu[target] = this.inpu[target].replace(/[^\.\d]/g, "");
      this.inpu[target] = this.inpu[target].replace(".", "");
    },
    checkData(target, min) {
      if (this.inpu[target] < min) this.inpu[target] = min;
    },
    checkProgress(target) {
      if (this.inpu[target] > 100) this.inpu[target] = 100;
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
