<template>
  <div>
    <el-form :model="outMeters" :rules="rules" ref="outMeters" label-width="90px">
      <el-col :span="12">
        <el-form-item label="检斤序号" prop="weighingNo">
          <el-input v-model="outMeters.weighingNo" readonly disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="车号" prop="truckNo">
          <el-input v-model="outMeters.truckNo" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="客户" prop="clientele">
          <el-input v-model="outMeters.clientele" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="货物名称" prop="goodsName">
          <el-input v-model="outMeters.goodsName" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="毛重" prop="gross">
          <el-input
            v-model="outMeters.gross"
            :disabled="disabled"
            type="number"
            min="0"
            oninput="javascript:this.value=this.value.replace(/[^\d.]/g,'')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="皮重" prop="tare">
          <el-input
            v-model="outMeters.tare"
            :disabled="disabled"
            type="number"
            min="0"
            oninput="javascript:this.value=this.value.replace(/[^\d.]/g,'')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="净重" prop="net">
          <el-input
            v-model="outMeters.net"
            :disabled="disabled"
            type="number"
            min="0"
            oninput="javascript:this.value=this.value.replace(/[^\d.]/g,'')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="司磅员" prop="createdBy">
          <el-input v-model="outMeters.createdBy" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="创建时间" prop="createdOn">
          <el-date-picker
            v-model="outMeters.createdOn"
            type="datetime"
            align="right"
            readonly
            disabled
          ></el-date-picker>
        </el-form-item>
      </el-col>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel()">取 消</el-button>
      <el-button v-if="!disabled" type="primary" @click="saveInfo()">保存</el-button>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import { simpleDateFormat } from "@/utils/index";
const { mapState, mapActions } = createNamespacedHelpers("outMeter");
export default {
  data() {
    return {
      rules: {
        weighingNo: [
          {
            required: true,
            message: "请输入或选择正确信息",
            trigger: ["blur", "change", "input"]
          }
        ],
        createdOn: [
          {
            required: true,
            message: "请输入或选择正确信息",
            trigger: ["blur", "change", "input"]
          }
        ],
        truckNo: [
          {
            required: true,
            message: "请输入或选择正确信息",
            trigger: ["blur", "change", "input"]
          }
        ],
        clientele: [
          {
            required: true,
            message: "请输入或选择正确信息",
            trigger: ["blur", "change", "input"]
          }
        ],
        goodsName: [
          {
            required: true,
            message: "请输入或选择正确信息",
            trigger: ["blur", "change", "input"]
          }
        ],
        gross: [
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
        net: [
          {
            required: true,
            message: "请输入或选择正确信息",
            trigger: ["blur", "change", "input"]
          }
        ],
        createdBy: [
          {
            required: true,
            message: "请输入或选择正确信息",
            trigger: ["blur", "change", "input"]
          }
        ]
      }
    };
  },
  name: "OutMeterMisUd",
  computed: {
    ...mapState(["selectedRowId", "outMeters", "disabled"])
  },
  mounted() {
    this.getOutMeterDtl(this.selectedRowId);
    this.outMeters.createdOn = simpleDateFormat(
      this.outMeters.createdOn,
      "yyyy-MM-dd HH:mm:ss"
    );
  },
  watch: {
    selectedRowId() {
      this.getOutMeterDtl(this.selectedRowId);
    }
  },
  methods: {
    ...mapActions(["updateOutMeterData", "getOutMeterDtl"]),
    saveInfo: function() {
      this.$refs["outMeters"].validate(valid => {
        if (valid) {
          this.updateOutMeterData(this.outMeters).then(() => {
            this.$emit("hidenDialog");
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

<style scoped>
.el-col {
  height: 70px;
}
</style>
<style lang="scss" type="text/css">
.el-dialog {
  min-height: 60%;
  max-height: 80%;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
