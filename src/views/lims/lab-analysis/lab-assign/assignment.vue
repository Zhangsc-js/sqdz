<template>
  <div>
    <el-form :model="addInput" ref="addInput" :rules="addRules" label-width="100px">
      <el-col :span="12">
        <el-form-item label="化验指标" prop="indic">
          <el-select multiple v-model="addInput.indic" placeholder="请选择化验指标" width="100%">
            <el-option v-for="item in proList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="化验小组" prop="group">
          <el-select multiple v-model="addInput.group" placeholder="请选择化验小组" width="100%">
            <el-option v-for="item in proList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="分配份数" prop="num">
          <el-input v-model="addInput.num" />
        </el-form-item>
      </el-col>
    </el-form>
    <div slot="footer" class="dialog-footer" style="clear:left;">
      <el-button @click="cancel()">取 消</el-button>
      <el-button type="primary" @click="save()">保存</el-button>
    </div>
  </div>
</template>

<script>
import { simpleDateFormat } from "@/utils/index";

export default {
  name: "assignment",
  data() {
    return {
      addInput: {
        remark: "",
        indic: []
      },
      proList: [{ id: 1, name: "化验项目1" }, { id: 2, name: "化验项目2" }],
      indicList: [{ id: 1, name: "指标1" }, { id: 2, name: "指标2" }],
      addRules: {
        indic: [{ required: true, message: "请输选择化验指标", trigger: "blur" }],
        group: [{ required: true, message: "请输选择化验小组", trigger: "blur" }],
        num: [{ required: true, message: "请输输入分配份数", trigger: "blur" }],
      }
    };
  },
  methods: {
    save() {},
    cancel() {
      this.$emit("hidenDialog");
    }
  }
};
</script>

<style scoped>
</style>