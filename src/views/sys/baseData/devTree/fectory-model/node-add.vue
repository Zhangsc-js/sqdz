<template>
  <div>
    <el-form ref="addForm" label-width="200px" :model="addForm" :rules="rules">
      <el-row>
        <el-col :span="10">
          <el-form-item label="设备名称" prop="name">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="设备编码" prop="proccode">
            <el-input v-model="addForm.proccode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-divider content-position="left">节点类型</el-divider>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="是否车间" prop="isWorkshop">
            <el-radio v-model="addForm.isWorkshop" :label="1">是</el-radio>
            <el-radio v-model="addForm.isWorkshop" :label="0">否</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="是否工序" prop="isProcess">
            <el-radio v-model="addForm.isProcess" :label="1">是</el-radio>
            <el-radio v-model="addForm.isProcess" :label="0">否</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-divider content-position="left">设备类型</el-divider>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="是否生产设备" prop="issproduction">
            <el-radio v-model="addForm.issproduction" :label="1">是</el-radio>
            <el-radio v-model="addForm.issproduction" :label="0">否</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="是否检斤设备" prop="isjj">
            <el-radio v-model="addForm.isjj" :label="1">是</el-radio>
            <el-radio v-model="addForm.isjj" :label="0">否</el-radio>
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
        <el-col :span="10">
          <el-form-item label="是否槽罐" prop="iscg">
            <el-radio v-model="addForm.iscg" :label="1">是</el-radio>
            <el-radio v-model="addForm.iscg" :label="0">否</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="是否水表" prop="isWater">
            <el-radio v-model="addForm.isWater" :label="1">是</el-radio>
            <el-radio v-model="addForm.isWater" :label="0">否</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="是否电表" prop="isElect">
            <el-radio v-model="addForm.isElect" :label="1">是</el-radio>
            <el-radio v-model="addForm.isElect" :label="0">否</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="是否气表" prop="isGas">
            <el-radio v-model="addForm.isGas" :label="1">是</el-radio>
            <el-radio v-model="addForm.isGas" :label="0">否</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="是否真实设备" prop="isReal">
            <el-radio v-model="addForm.isReal" :label="1">是</el-radio>
            <el-radio v-model="addForm.isReal" :label="0">否</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-divider content-position="left">设备维护</el-divider>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="是否需要巡检" prop="isChecking">
            <el-radio v-model="addForm.isChecking" :label="1">是</el-radio>
            <el-radio v-model="addForm.isChecking" :label="0">否</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="是否需要点检" prop="isInspection">
            <el-radio v-model="addForm.isInspection" :label="1">是</el-radio>
            <el-radio v-model="addForm.isInspection" :label="0">否</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="是否需要润滑" prop="isLubrication">
            <el-radio v-model="addForm.isLubrication" :label="1">是</el-radio>
            <el-radio v-model="addForm.isLubrication" :label="0">否</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="是否需要保养" prop="isMaintain">
            <el-radio v-model="addForm.isMaintain" :label="1">是</el-radio>
            <el-radio v-model="addForm.isMaintain" :label="0">否</el-radio>
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
import { createNamespacedHelpers } from "vuex";
import { addDevTreeNode } from "@/api/sys/dev";
const { mapState, mapActions, mapMutations } = createNamespacedHelpers(
  "sysDev"
);

export default {
  name: "NodeAdd",
  props: {
    pproCode: {
      type: String,
      required: true
    },
    devMap: {
      required: true
    },
    type: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      devTypeMaps: [],
      addForm: {
        name: "",
        proccode: "",
        pproCode: "",
        xh: null,
        issproduction: null, // 是否生产设备
        iscg: null, // 是否槽罐
        isjj: null, // 是否检斤设备
        isjl: null, // 是否计量设备
        isWorkshop: null,
        isProcess: null,
        isWater: null,
        isElect: null,
        isGas: null,
        isChecking: null,
        isLubrication: null,
        devType: "",
        isEquip: null,
        isMeter: null,
        isReal: null
      },
      rules: {
        name: [{ required: true, message: "请输入设备名称", trigger: "blur" }],
        proccode: [
          { required: true, message: "请输入设备编码", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    ...mapActions(["getTreeData", "SET_NODE_ID"]),
    save() {
      if (this.type) {
        this.addForm = Object.assign(this.addForm, this.type);
      }
      if (this.computedIsEquip() == 1) {
        this.addForm.isEquip = 1;
      }
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          this.addForm.pproccode = this.pproCode;
          addDevTreeNode(this.addForm)
            .then(response => {
              const result = response.data;
              if (result.success) {
                this.$message.success("保存成功");
                this.$refs["addForm"].resetFields();
                this.getTreeData();
                this.$emit("hidenDialog");
              } else {
                this.$message.error(result.message);
              }
            })
            .catch(e => {
              this.$message.error(e.message);
            });
          // .finally(() => {
          //   this.$emit("hidenDialog");
          // });
        } else {
          this.$message.error("保存失败，请检查必填项是否都正确填写");
          return false;
        }
      });
    },
    computedIsEquip() {
      return (
        this.addForm.issproduction ||
        this.addForm.iscg ||
        this.addForm.isjj ||
        this.addForm.isjl ||
        this.addForm.isWater ||
        this.addForm.isElect ||
        this.addForm.isGas ||
        this.addForm.isChecking ||
        this.addForm.isLubrication ||
        this.addForm.isReal ||
        this.addForm.isInspection ||
        this.addForm.isMaintain
      );
    },
    cancel() {
      this.$emit("hidenDialog");
    }
  }
};
</script>
