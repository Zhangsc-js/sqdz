<template>
  <div class="treeNodeAdd">
    <el-form ref="addForm" label-width="120px" :model="addForm" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备名称" prop="name">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="序号" prop="xh">
            <el-input v-model="addForm.xh"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="是否计量设备" prop="isjl">
            <el-radio v-model="addForm.isjl" :label="1">是</el-radio>
            <el-radio v-model="addForm.isjl" :label="0">否</el-radio>
          </el-form-item>
        </el-col>
        <el-col v-if="show === 'water'" :span="10">
          <el-form-item label="是否水" prop="isWater">
            <el-radio v-model="addForm.isWater" :label="1">是</el-radio>
            <el-radio v-model="addForm.isWater" :label="0">否</el-radio>
          </el-form-item>
        </el-col>
        <el-col v-if="show === 'elect'" :span="10">
          <el-form-item label="是否电" prop="isElect">
            <el-radio v-model="addForm.isElect" :label="1">是</el-radio>
            <el-radio v-model="addForm.isElect" :label="0">否</el-radio>
          </el-form-item>
        </el-col>
        <el-col v-if="show === 'gas'" :span="10">
          <el-form-item label="是否气" prop="isGas">
            <el-radio v-model="addForm.isGas" :label="1">是</el-radio>
            <el-radio v-model="addForm.isGas" :label="0">否</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <!--<el-row>
      </el-row>-->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel()">取 消</el-button>
      <el-button type="primary" @click="save()">保存</el-button>
    </div>
  </div>
</template>

<script>
import { addEneDevTreeNode } from "@/api/energy";

export default {
  name: "TreeNodeAdd",
  props: {
    pproCode: {
      type: String,
      required: true
    },
    lableName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      addForm: {
        name: "",
        pproCode: "",
        xh: null,
        isjl: null, // 是否为计量
        isWater: null,
        isElect: null,
        isGas: null, //是否是气
        sele: "elect"
      },
      options: [
        {
          label: "是",
          value: 1
        },
        {
          label: "否",
          value: 0
        }
      ],
      rules: {
        name: [{ required: true, message: "请输入设备名称", trigger: "blur" }]
      },
      show: "elect"
    };
  },
  methods: {
    save() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          this.addForm.pproccode = this.pproCode;
          addEneDevTreeNode(this.addForm)
            .then(response => {
              const result = response.data;
              if (result.success) {
                this.$message.success("保存成功");
                this.$refs["addForm"].resetFields();
              } else {
                this.$message.error(result.message);
              }
            })
            .catch(e => {
              this.$message.error(e.message);
            })
            .finally(() => {
              this.$emit("treeHidenDialog");
            });
        } else {
          this.$message.error("保存失败，请检查必填项是否都正确填写");
          return false;
        }
      });
    },
    cancel() {
      this.$emit("treeHidenDialog");
    }
  },
  watch: {
    lableName() {
      if (this.lableName === "water") {
        this.show = "water";
      }
      if (this.lableName === "elect") {
        this.show = "elect";
      }
      if (this.lableName === "gas") {
        this.show = "gas";
      }
      //this.show=newVal
    }
  }
};
</script>

<style scoped>
</style>
