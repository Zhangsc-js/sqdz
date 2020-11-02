<template>
  <div style="height: 100%;">
    <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
      <el-form-item label="客户编码" prop="customerCode">
        <el-input v-model="queryForm.customerCode" placeholder="请输入客户编码"></el-input>
      </el-form-item>
      <el-form-item label="客户名称" prop="customerName">
        <el-input v-model="queryForm.customerName" placeholder="请输入客户名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getData()">查询</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="addCustomer()">新增</el-button>
        <el-button type="primary" icon="el-icon-refresh-left" @click="clearCustomer()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      highlight-current-row
      :data="tableData"
      stripe
      border
      height="calc(100% - 52px - 50px - 12px - 12px)"
      style=" width: 100%"
    >
      <el-table-column prop="customerCode" label="客户代码" min-width="12%"></el-table-column>
      <el-table-column prop="customerName" label="客户名称" min-width="12%"></el-table-column>
      <el-table-column prop="customerAddr" label="客户地址" min-width="12%"></el-table-column>
      <el-table-column prop="telephone" label="固定电话" min-width="12%"></el-table-column>
      <el-table-column prop="sacle" :formatter="formatSacle" label="客户规模" min-width="12%"></el-table-column>
      <el-table-column prop="creditLevel" label="信用等级" min-width="12%"></el-table-column>
      <el-table-column prop="linkName" label="默认联系人" min-width="12%"></el-table-column>
      <el-table-column prop="linkTelephone" label="联系方式" min-width="12%"></el-table-column>
      <el-table-column align="center" fixed="right" label="操作" min-width="12%">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="updateCustomer(scope.row)">更新</el-button>
          <el-button type="text" size="small" @click="deleteCustomer(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :total="total"
      :page.sync="page.current"
      :limit.sync="page.pageSize"
      @pagination="getData"
    />
    <el-dialog @close="getData" :title="title" :visible.sync="addDialogVisible" width="65%">
      <addCustomer
        @save="hidenDialog"
        @cancel="hidenDialogCancel"
        :trigger="addDialogVisible"
        @getIdAndType="getIdAndType"
        :type="type"
        :id="id"
      />
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import addCustomer from "./addCustomer";
import {
  findSysCustomerAll,
  deleteSysCustomer,
  querySacles
} from "@/api/sys/customer";
export default {
  data() {
    return {
      sacles: [],
      page: {
        current: 1,
        pageSize: 10
      },
      queryForm: {
        customerCode: "",
        customerName: ""
      },
      tableData: [],
      addDialogVisible: false,
      id: "",
      type: "",
      id: "",
      title: "",
      total: 0
    };
  },
  components: {
    Pagination,
    addCustomer
  },
  methods: {
    clearCustomer() {
      this.queryForm.customerCode = "";
      this.queryForm.customerName = "";
    },
    getData() {
      const params = {
        ...this.page,
        ...this.queryForm
      };
      findSysCustomerAll(params).then(response => {
        if (response.data.success) {
          this.tableData = response.data.data.list;
          this.total = response.data.data.total;
        }
      });
      querySacles().then(response => {
        if (response.data.success) {
          this.sacles = response.data.data.CUSTOMER_SCALE;
        }
      });
    },
    updateCustomer(row) {
      this.title = "客户修改";
      this.type = "2";
      this.addDialogVisible = true;
      this.id = row.id;
    },
    deleteCustomer(row) {
      let that = this;
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          deleteSysCustomer(row.id).then(response => {
            console.log(response);
            if (response.data.success) {
              that.getData();
              that.$message.success("删除成功!");
            } else
              that.$message.error(
                response.data.message + ":" + response.data.data
              );
          });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },

    hidenDialog() {
      this.addDialogVisible = false;
      this.getData();
    },
    hidenDialogCancel() {
      this.addDialogVisible = false;
    },
    addCustomer() {
      this.title = "新增";
      this.addDialogVisible = true;
      this.type = "1";
      this.id = "";
    },
    getIdAndType(id, type) {
      console.log("id    " + id + " type  " + type);
      this.id = id;
      this.type = type;
    },
    formatSacle(row, column) {
      for (let index = 0; index < this.sacles.length; index++) {
        const element = this.sacles[index];
        if (row.sacle == element.code) {
          return element.label;
        }
      }
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
