<template>
  <div style="height: 100%;">
    <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
      <el-form-item label="物料编码" prop="materialCode">
        <el-input v-model="queryForm.materialCode"></el-input>
      </el-form-item>
      <el-form-item label="物料名称" prop="materialName">
        <el-input v-model="queryForm.materialName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="getData()" type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      highlight-current-row
      :data="tableData"
      stripe
      border
      height="calc(100% - 52px - 96px - 12px - 12px)"
      style=" width: 100%"
    >
      <el-table-column prop="materialCode" label="物料编码"></el-table-column>
      <el-table-column prop="materialName" label="物料名称"></el-table-column>
      <el-table-column prop="category" label="物料类型">
        <template v-slot="scope">
          <span style="width: 200px;">{{formaterType(scope.row.category)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="safeInventory" label="物料安全库存"></el-table-column>
      <el-table-column prop="onhandQty" label="在库库存"></el-table-column>
      <el-table-column prop="differencesQty" label="低于安全库存数量"></el-table-column>
    </el-table>
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
  findWmsSafetyMaterial,
  getMaterialType
} from "@/api/sys/wms/warehouse";
export default {
  data() {
    return {
      queryForm: {
        materialCode: "",
        materialName: ""
      },
      tableData: [],
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      materialTypeArr: []
    };
  },
  components: {
    Pagination
  },
  methods: {
    getData() {
      const params = {
        ...this.queryForm,
        ...this.page
      };
      getMaterialType().then(response => {
        if (response.data.success) {
          this.materialTypeArr = response.data.data.list.data;
          console.log(this.materialTypeArr);
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
      findWmsSafetyMaterial(params).then(response => {
        if (response.data.success) {
          this.tableData = response.data.data.list;
          this.total = response.data.data.total;
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
    }
  },
  mounted() {
    this.getData();
  },
  computed: {
    formaterType() {
      return function(data) {
        for (let index = 0; index < this.materialTypeArr.length; index++) {
          const element = this.materialTypeArr[index];
          if (element.code == data) {
            return element.label;
          }
        }
      };
    }
  }
};
</script>