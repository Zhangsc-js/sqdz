<template>
  <div>
    <el-form ref="tableData" :rules="rules" :model="tableData" label-width="160px" class="eneAppAdd">
      <el-divider content-position="center">分摊配比</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="分摊比(%)" prop="proRataShare">
            <el-input
              v-model="tableData.proRataShare"
              placeholder="请输入数字或小数"
              type="number"
              min="0"
              oninput="javascript:this.value=this.value.replace(/[^\d.]/g,'')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="适用日期" prop="canUseOn">
            <el-date-picker
              v-model="tableData.canUseOn"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="month"
              placeholder="选择月"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel()">取 消</el-button>
      <el-button type="primary" @click="save()">保存</el-button>
    </div>
  </div>
</template>

<script>
import { addEneApp } from "@/api/energy";

export default {
  name: "eneAppAdd",
  data() {
    return {
      tableData: {
        proRataShare: 0,
        canUseOn: ""
      },
      rules: {
        proRataShare: [
          {
            required: true,
            message: "请输入或选择正确信息",
            trigger: ["blur", "change", "input"]
          }
        ],
        canUseOn: [
          {
            required: true,
            message: "请输入或选择正确信息",
            trigger: ["blur", "change", "input"]
          }
        ]
      }
    };
  },
  props: ["selectNo", "selectProcName", "energyType"],
  // computed: {},
  // mounted() {},
  methods: {
    save() {
      this.$refs["tableData"].validate(valid => {
        if (valid) {
          this.tableData.proRataShare /= 100;
          const params = {
            ...this.tableData,
            procName: this.selectProcName,
            proccode: this.selectNo,
            energyType: this.energyType
          };
          if (this.selectNo === "021") {
            alert("根节点无需分配");
            this.$emit("hidenDialog");
            this.$refs["tableData"].resetFields();
          } else {
            addEneApp(params)
              .then(res => {
                if (res.data.success) {
                  this.$message({
                    type: "success",
                    message: "添加成功"
                  });
                } else {
                  this.$message({
                    type: "error",
                    message: res.data.message
                  });
                }
              })
              .catch(e => {
                this.$message.error(e.message);
              })
              .finally(() => {
                this.$emit("hidenDialog");
                this.$refs["tableData"].resetFields();
              });
          }
        } else {
          this.$message.error("请输入正确信息");
          return false;
        }
      });
    },
    cancel() {
      this.$emit("hidenDialog");
      this.$refs["tableData"].resetFields();
    }
  }
};
</script>

<style scoped>
</style>
<style  type="text/css">
.eneAppAdd .el-dialog {
  min-height: 40%;
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
