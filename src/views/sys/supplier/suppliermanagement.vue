<template>
  <div style="height: 100%;" class="suppliermanagement">
    <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
      <el-form-item label="供应商品名称">
        <el-input v-model="queryForm.supplierName" placeholder="请输入供应商名称"></el-input>
      </el-form-item>
      <el-form-item label="信用等级">
        <el-select
          v-model="queryForm.creditLevel"
          filterable
          placeholder="请选择"
          style="width: 100%;height: 100%"
        >
          <el-option
            v-for="item in this.creditLevels"
            :key="item.code"
            :label="item.label"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getData()">查询</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="addsupplier()">新增</el-button>
        <el-button type="primary" icon="el-icon-refresh-left" @click="clearSupplier()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      highlight-current-row
      :data="tableData"
      stripe
      border
      height="calc(100% - 128px)"
      style=" width: 100%"
    >
      <el-table-column prop="supplierName" label="供应商名称"></el-table-column>
      <el-table-column prop="supplierCode" label="统一社会信用代码"></el-table-column>
      <el-table-column prop="companyAddr" label="公司地址"></el-table-column>
      <el-table-column prop="fax" label="传真"></el-table-column>
      <el-table-column prop="email" label="电子邮箱"></el-table-column>
      <el-table-column prop="telephone" label="固定电话"></el-table-column>
      <el-table-column prop="creditLevel" label="信用等级"></el-table-column>
      <el-table-column prop="linkMan" label="业务联系人"></el-table-column>
      <el-table-column prop="linkTelephone" label="联系方式"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="updateSupplier(scope.row)">更新</el-button>
          <el-button type="text" @click="deleteSupplier(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :total="total"
      :page.sync="page.current"
      :limit.sync="page.pageSize"
      @pagination="getData"
    />
    <el-dialog :title="title" :visible.sync="addDialogVisible" width="55%">
      <Supplierdetails
        @save="hidenDialog"
        @cancel="hidenDialogCancel"
        :id="supplierId"
        :type="type"
        :trigger="addDialogVisible"
      />
    </el-dialog>
  </div>
</template>

<script>
import { hasBtn } from "@/utils/index";
import { getToken } from "@/utils/auth";
import Supplierdetails from "./supplierdetails";
import Pagination from "@/components/Pagination";
import {
  getSupplerList,
  deleteSuppler,
  addSuppler,
  updateSuppler,
  queryStatus
} from "@/api/sys/suppler";
export default {
  name: "supplermanagement",
  components: {
    Pagination,
    Supplierdetails
  },
  data() {
    return {
      tableData: [],
      options: [],
      queryForm: {
        supplierName: "",
        creditLevel: "",
        date: ""
      },
      creditLevels: [],
      title: "",
      type: "",
      total: 0,
      addDialogVisible: false,
      upDialogVisible: false,
      page: {
        current: 1,
        pageSize: 10
      },
      supplierId: ""
    };
  },
  methods: {
    clearSupplier() {
      this.queryForm.supplierName = "";
      this.queryForm.creditLevel = "";
    },
    addsupplier() {
      this.type = "1";
      this.addDialogVisible = true;
      this.title = "新增";
    },

    hidenDialog() {
      this.addDialogVisible = false;
      this.getData();
    },
    hidenDialogCancel() {
      this.addDialogVisible = false;
    },
    getData(current) {
      if (current === 1) {
        this.page.current = current;
      }
      const params = {
        ...this.page,
        ...this.queryForm
      };

      getSupplerList(params).then(response => {
        let data = response.data;
        if (data.success) {
          this.tableData = data.data.list;
          this.total = data.data.size;
        }
      });
      queryStatus().then(response => {
        let data = response.data;
        if (data.success) {
          this.creditLevels = data.data.CREDIT_LEVEL;
        }
      });
    },
    deleteSupplier(row) {
      let that = this;
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          deleteSuppler(row.id).then(response => {
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
    updateSupplier(row) {
      this.type = "2";
      this.addDialogVisible = true;
      this.title = "修改";
      this.supplierId = row.id;
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
<style lang="scss" >
// .suppliermanagement .el-table__body-wrapper {
//   height: auto !important;
// }
</style>
