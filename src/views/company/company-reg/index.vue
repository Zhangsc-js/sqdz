<template>
  <div style="padding-top:45px" class="reg">
    <el-form
      :model="companyForm"
      :rules="rules"
      ref="companyForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-col :span="12">
        <el-form-item label="公司名称" prop="name">
          <el-input v-model="companyForm.name"></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="公司区域" prop="companyAddress">
          <el-cascader :options="options" v-model="companyForm.companyAddress" :separator="' '"></el-cascader>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="法人代表" prop="legalRepresentative">
          <el-input v-model="companyForm.legalRepresentative"></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="公司电话" prop="companyPhone">
          <el-input v-model="companyForm.companyPhone"></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="邮箱" prop="mailbox">
          <el-input v-model="companyForm.mailbox"></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="公司规模" prop="companySize">
          <el-input v-model="companyForm.companySize"></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="所属行业" prop="industry">
          <el-input v-model="companyForm.industry"></el-input>
        </el-form-item>
      </el-col>

    <el-col :span='24'>
        <el-form-item>
        <el-button type="primary" @click="submitForm()">立即创建</el-button>
        <el-button type="primary" icon="el-icon-refresh-left" @click="resetForm('companyForm')">重置</el-button>
      </el-form-item>
    </el-col>
    </el-form>
  </div>
</template>


<script>
import options from "@/utils/country-data.js";
import { addCompany } from "@/api/company";
export default {
  name: "cpanyAdd",
  data() {
    return {
      companyForm: {
        name: "",
        companyAddress: "",
        legalRepresentative: "",
        companyPhone: "",
        mailbox: "",
        companySize: "",
        industry: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 100, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        companyAddress: [
          { required: true, message: "请选择公司地址", trigger: "blur" }
        ],
        legalRepresentative: [
          { required: true, message: "请输入法人代表", trigger: "blur" }
        ],
        companyPhone: [
          { required: true, message: "请输入电话号码", trigger: "blur" }
        ],
        mailbox: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        companySize: [
          { required: true, message: "请选择公司规模", trigger: "blur" }
        ],
        industry: [{ required: true, message: "请选择行业", trigger: "blur" }]
      },
      companyAddress: [], //存放默认值
      options: options //存放城市数据
    };
  },
  methods: {
    submitForm() {
      this.$refs["companyForm"].validate(valid => {
        if (valid) {
          (this.companyForm.companyAddress =
            this.companyForm.companyAddress[0].valueOf() +
            "-" +
            this.companyForm.companyAddress[1].valueOf() +
            "-" +
            this.companyForm.companyAddress[2].valueOf() +
            "-" +
            this.companyForm.companyAddress[3].valueOf()),
            addCompany(this.companyForm)
              .then(response => {
                const result = response.data;
                if (result.success) {
                  this.$message({
                    type: "success",
                    message: "新增成功"
                  });
                  this.$refs["companyForm"].resetFields();
                } else {
                  this.$message({
                    type: "error",
                    message: result.message
                  });
                }
              })
              .catch(e => {
                this.$message({
                  type: "error",
                  message: e.message
                });
              })
              .finally(() => {
                this.$emit("hidenDialog");
              });
        } else {
          //alert("请填写必要的栏位");
          return false;
        }
      });

      /* addCompany(this.companyForm).then(response => {
                    alert("1")
                    const result = response.data
                    alert("2")
                    alert(result.name)
                    if (result.success) {
                        this.$message({
                            type: 'success',
                            message: '新增成功'
                        })
                        this.$refs['companyForm'].resetFields()
                    } else {
                        this.$message({
                            type: 'error',
                            message: result.message
                        })
                    }
                }).catch(e => {
                    this.$message({
                        type: 'error',
                        message: e.message
                    })
                }).finally(() => {
                    this.$emit("hidenDialog")
                })*/
    },
    resetForm(companyForm) {
      this.$refs[companyForm].resetFields();
    }
  }
};
</script>
<style lang="scss" scoped>
  .el-col{
    padding-right: 50px;
  }
  .reg{
    margin-top: 20px;
    .el-input{
        width: 100%;
    }
  }
</style>

