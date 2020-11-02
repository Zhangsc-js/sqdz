<template>
  <div style=" padding-left: 20px">
    <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
      <el-form-item label="物料编码">
        <el-input v-model="queryForm.materialCode" placeholder="请输入物料编码"></el-input>
      </el-form-item>
      <el-form-item label="物料名称">
        <el-input v-model="queryForm.materialName" placeholder="请输入物料名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getData">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button href="javascript:void(0)" class="btn-w" @click="clearSearchBox">清空</el-button>
      </el-form-item>
    </el-form>

    <template>
      <el-table
        highlight-current-row
        :data="tableData"
        height="300px"
        @row-click="openDetails"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column prop="materialCode" label="编码" width="150"></el-table-column>
        <el-table-column prop="materialName" label="名称" width="120"></el-table-column>
        <el-table-column prop="unit" label="单位" width="120"></el-table-column>
        <el-table-column prop="onhandQty" label="在库库存" width="180"></el-table-column>
        <el-table-column prop="availableQty" label="可用库存" width="120"></el-table-column>
      </el-table>
    </template>
    <Pagination
      :total="total"
      :page.sync="page.pageNum"
      :limit.sync="page.pageSize"
      @pagination="getData"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import {
  findMaterials
} from "@/api/wms.js";
export default {
  components: {
    Pagination
  },
  data() {
    return {
      page: {
        current: 1,
        size: 5
      },
      pageSizes: [5, 10, 50, 100],
      total: 0,
      queryForm: {
        materialCode: "",
        materialName: ""
      },
      tableData: [] // 选择行数据
    };
  },
  methods: {
    clearSearchBox() {
      this.queryForm = {
        materialCode: "",
        materialName: ""
      };
    },
    openDetails(row) {
      const param = Object.assign({ materialId: row.id }, row);
      this.$emit("save", param);
    },
    getData() {
      const params = {
        ...this.page,
        ...this.queryForm
      };
      findMaterials(params)
        .then(response => {
          let data = response.data;
          this.tableData = data.data.result;
          this.total = data.data.total;
        })
        .catch(e => {
          this.$message({
            type: "error",
            message: e.message,
            duration: 3 * 1000
          });
        });
    }
  },

  mounted() {
    this.getData();
  }
};
</script>

<style scoped>
</style>
