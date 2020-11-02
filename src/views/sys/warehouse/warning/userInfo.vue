<template>
  <div class="userinfo">
    <el-form
      inline
      :model="userQueryForm"
      class="demo-form-inline"
      style="margin-left:15px"
      ref="userQueryForm"
    >
      <el-row>
        <el-form-item laPel="员工工号" prop="userCode">
          <el-input v-model="userQueryForm.userCode" placeholder="请输入员工工号"></el-input>
        </el-form-item>
        <el-form-item label="员工姓名" prop="userName">
          <el-input v-model="userQueryForm.userName" placeholder="请输入员工姓名"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" prop="department">
          <el-select v-model="userQueryForm.department" placeholder="请选择">
            <el-option label="区域一" value="shanghai"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="userAdd">查询</el-button>
          <el-button type="primary" @click="resetQuery('userQueryForm')">重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-table :data="userData" @selection-change="handleSelectionChange" ref="multipleTable">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="userCode" label="工号"></el-table-column>
      <el-table-column prop="userName" label="姓名"></el-table-column>
    </el-table>
    <el-button :disabled="hasSelect" type="primary" @click="savePru">新增</el-button>
    <pagination
      :total="total"
      :page.sync="page.current"
      :limit.sync="page.size"
      @pagination="userAdd"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { getEmpyes } from "@/api/sys";
import { resetQueryForm } from "@/utils/common";

export default {
  props: {
    count: {
      type: Number,
      required: true
    }
  },
  components: {
    Pagination
  },
  data() {
    return {
      userQueryForm: {
        userCode: "",
        userName: "",
        department: ""
      },
      page: {
        current: 1,
        size: 10
      },
      total: 0,
      userData: [],
      hasSelect: false,
      userids: []
    };
  },
  mounted() {
    this.userAdd();
  },
  methods: {
    userAdd() {
      this.dialogVisible = true;
      const params = {
        ...this.page,
          isHaveAccount:"1",
        ...this.userQueryForm
      };
      getEmpyes(params).then(response => {
        let data = response.data;
        if (data.success) {
          this.userData = data.data.rows;
          this.total = data.data.total;
        }
      });
    },
    resetQuery(form) {
      let fun = form == "queryForm" ? "init" : "userAdd";
      resetQueryForm(this, form, fun);
    },
    handleSelectionChange(val) {
      this.userids.length = 0;
      const _this = this;
      if (val.length > 0) {
        this.hasSelect = false;
      } else {
        this.hasSelect = true;
      }
      val.forEach(element => {
        _this.userids.push(element);
      });
    },
    savePru() {
      if (this.userids.length == 0) {
        this.$message.error("请选择员工");
        return;
      }
      this.$emit("save", this.userids);
    }
  },
  watch: {
    count() {
      this.$refs.multipleTable.clearSelection();
    }
  }
};
</script>

<style>
</style>
