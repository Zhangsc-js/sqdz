<template>
  <div>
    <el-form :model="addWeiCars" :rules="rules" ref="addWeiCars" label-width="80px">
      <el-col :span="12">
        <el-form-item label="车号" prop="truckNo">
          <el-input v-model="addWeiCars.truckNo" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="型号" prop="truckType">
          <el-input v-model="addWeiCars.truckType" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="皮重" prop="tare">
          <el-input
            v-model="addWeiCars.tare"
            style="width: 91%"
            type="number"
            min="0"
            oninput="javascript:this.value=this.value.replace(/[^\d.]/g,'')"
          />&nbsp;&nbsp;
          <span>
            <strong>KG</strong>
          </span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="允差比" prop="toleranceRatio">
          <el-input
            v-model="addWeiCars.toleranceRatio"
            style="width: 91%"
            type="number"
            min="0"
            oninput="javascript:this.value=this.value.replace(/[^\d.]/g,'')"
          />&nbsp;&nbsp;
          <span>
            <strong>%</strong>
          </span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="驾驶员" prop="driver">
          <el-input v-model="addWeiCars.driver" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="addWeiCars.createdOn"
            type="datetime"
            align="right"
            style="width: 100%"
            readonly
            disabled
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="addWeiCars.remarks" />
        </el-form-item>
      </el-col>
    </el-form>
    <br />
    <br />
    <div slot="footer" style="padding-left: 45%">
      <el-button @click="cancel()">取 消</el-button>
      <el-button type="primary" @click="save()">保存</el-button>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import { simpleDateFormat } from "@/utils/index";

const { mapState, mapActions } = createNamespacedHelpers("weiCars");
export default {
  data() {
    return {
      rules: {
        truckNo: [
          {
            required: true,
            message: "请输入或选择正确信息",
            trigger: ["blur", "change", "input"]
          }
        ],
        truckType: [
          {
            required: true,
            message: "请输入或选择正确信息",
            trigger: ["blur", "change", "input"]
          }
        ],
        tare: [
          {
            required: true,
            message: "请输入或选择正确信息",
            trigger: ["blur", "change", "input"]
          }
        ],
        toleranceRatio: [
          {
            required: true,
            message: "请输入或选择正确信息",
            trigger: ["blur", "change", "input"]
          }
        ],
        driver: [
          {
            required: true,
            message: "请输入或选择正确信息",
            trigger: ["blur", "change", "input"]
          }
        ]
      }
    };
  },
  name: "WeiCarsAdd",
  computed: {
    ...mapState(["addWeiCars"])
  },
  mounted() {
    this.addWeiCars.createdOn = simpleDateFormat(
      new Date(),
      "yyyy-MM-dd HH:mm:ss"
    );
  },
  methods: {
    ...mapActions(["addWeiCarsData"]),
    save: function() {
      this.$refs["addWeiCars"].validate(valid => {
        if (valid) {
          this.addWeiCarsData(this.addWeiCars).then(() => {
            this.$emit("hidenDialog");
            this.$refs["addWeiCars"].resetFields();
            this.addWeiCars.createdOn = simpleDateFormat(
                    new Date(),
                    "yyyy-MM-dd HH:mm:ss"
            );
          });
        } else {
          this.$message.error("请输入正确信息");
          return false;
        }
      });
    },
    cancel: function() {
      this.$emit("hidenDialog");
    }
  }
};
</script>
<style lang="scss" scoped  >
.el-col-12 {
  height: 60px;
}
</style>
<style type="text/css">
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
