<template>
  <div style=" padding-left: 20px;">
    <el-form ref="mainInfo" :model="staff" label-width="100px">
      <el-row>
        <el-col :span="9">
          <el-form-item label="员工工号：" prop="userCode">
            <el-input v-model="staff.userCode" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="员工名称：" prop="userName">
            <el-input v-model="staff.userName" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary " icon="el-icon-search" @click="findStaffData(1)">查询</el-button>
          <el-button
            type="primary"
            icon="el-icon-refresh-left"
            @click="resetQuery('userQueryForm')"
          >重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      ref="dialogTable"
      stripe
      :data="dialogTableData"
      style="width: 100%;"
      height="300px"
      @selection-change="selectionChangeDialog"
    >
      <el-table-column fixed type="selection" width="55px"></el-table-column>
      <el-table-column prop="userCode" align="center" label="工号"></el-table-column>
      <el-table-column prop="userName" align="center" label="姓名"></el-table-column>
      <el-table-column prop="department" align="center" label="部门名称"></el-table-column>
    </el-table>
    <Pagination
      :total="dialogTableTotal"
      :page.sync="dialogTablePage.pageNum"
      :limit.sync="dialogTablePage.pageSize"
      @pagination="findStaffData"
      class="page"
    />
    <div slot="footer" class="dialog-footer" style="text-align:center;padding:15px">
      <el-button type="primary " icon="el-icon-plus" @click="confirmSelect">确定</el-button>
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { getStaffData } from "@/api/productionPlanning";
import { resetQueryForm } from "@/utils/common";
export default {
  name: "staffInfo",
  components: {
    Pagination
  },
  data() {
    return {
      staff: {
        userCode: "",
        userName: ""
      },
      selectedStaffCodeDialog: [],
      selectedStaffNameDialog: [],
      dialogTableData: [],
      dialogTableTotal: 0,
      dialogTablePage: {
        pageNum: 1,
        pageSize: 10
      },
      tableData: {}
    };
  },
  props: {
    trigger: {
      type: Number,
      required: false
    }
  },
  watch: {
    personId() {
      this.getData();
    },
    trigger() {
      this.$refs.dialogTable.clearSelection();
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      var params = {
        ...this.dialogTablePage,
        ...this.staff
      };
      getStaffData(params)
        .then(response => {
          this.dialogTableData = response.data.data.list;
          this.dialogTableTotal = response.data.data.total;
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    findStaffData(pageNum) {
      if (pageNum === 1) this.dialogTablePage.pageNum = 1;
      let param = {
        ...this.dialogTablePage,
        ...this.staff
      };
      getStaffData(param)
        .then(response => {
          this.dialogTableData = response.data.data.list;
          this.dialogTableTotal = response.data.data.total;
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    selectionChangeDialog(obj) {
      this.selectedStaffCodeDialog = [];
      this.selectedStaffNameDialog = [];
      for (let i = 0; i < obj.length; i++) {
        this.selectedStaffCodeDialog.push(obj[i].userCode);
        this.selectedStaffNameDialog.push(obj[i].userName);
      }
    },
    confirmSelect() {
      if (this.selectedStaffCodeDialog.length == 0) {
        return;
      }
      this.$emit(
        "save",
        this.selectedStaffCodeDialog.join(","),
        this.selectedStaffNameDialog.join(",")
      );
    },
    resetQuery(form) {
      resetQueryForm(this, "mainInfo");
    }
    // clearSelection   his.$refs.multipleTable.clearSelection();
  }
};
</script>

<style >
.page .el-select {
  width: auto;
}
</style>
