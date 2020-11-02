<template>
  <div>
    <el-form :model="inMeters" :rules="rules" ref="inMeters" label-width="90px" class="detailsAccountsInfo">
      <el-col :span="12">
        <el-form-item label="检斤序号" prop="weighingNo">
          <el-input v-model="inMeters.weighingNo" readonly disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="车号" prop="truckNo">
          <el-input v-model="inMeters.truckNo" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="供应商" prop="supplier">
          <el-input v-model="inMeters.supplier" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="货物名称" prop="goodsName">
          <el-input v-model="inMeters.goodsName" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="毛重" prop="gross">
          <el-input
            v-model="inMeters.gross"
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
            v-model="inMeters.tare"
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
            v-model="inMeters.net"
            :disabled="disabled"
            type="number"
            min="0"
            oninput="javascript:this.value=this.value.replace(/[^\d.]/g,'')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="司磅员" prop="createdBy">
          <el-input v-model="inMeters.createdBy" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="创建时间" prop="createdOn">
          <el-date-picker v-model="inMeters.createdOn" type="datetime" readonly disabled></el-date-picker>
        </el-form-item>
      </el-col>
      <!--            <el-col :span="12">-->
      <!--                <el-form-item label="备注" prop="remarks" >-->
      <!--                    <el-input v-model="inMeters.remarks" :disabled="disabled"/>-->
      <!--                </el-form-item>-->
      <!--            </el-col>-->
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

const { mapState, mapActions } = createNamespacedHelpers("inMeter");
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
        ],
        supplier: [
          {
            required: true,
            message: "请输入或选择正确信息",
            trigger: ["blur", "change", "input"]
          }
        ]
      }
    };
  },
  name: "InMeterMisUd",
  computed: {
    ...mapState(["selectedRowId", "inMeters", "disabled"])
  },
  mounted() {
    this.inMeters.createdOn = simpleDateFormat(
      this.inMeters.createdOn,
      "yyyy-MM-dd HH:mm:ss"
    );
    this.getInMeterDtl(this.selectedRowId);
  },
  watch: {
    selectedRowId() {
      this.getInMeterDtl(this.selectedRowId);
    }
  },
  methods: {
    ...mapActions(["updateInMeterData", "getInMeterDtl"]),
    saveInfo: function() {
      this.$refs["inMeters"].validate(valid => {
        if (valid) {
          this.updateInMeterData(this.inMeters).then(() => {
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

<style  type="text/css">
.detailsAccountsInfo .el-dialog {
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
<style lang="scss" scoped>
 .el-col {
  height: 70px;
}
</style>
