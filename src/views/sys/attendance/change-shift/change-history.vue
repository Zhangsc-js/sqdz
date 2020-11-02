<template>
  <div>
    <el-form ref="queryForm" :inline="true" label-width="100px" class="mb0">
      <el-form-item label="查询日期" prop>
        <el-date-picker
          v-model="createTimeRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="((val)=>{changeDate(val)})"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          icon="el-icon-search"
          href="javascript:void(0)"
          type="primary"
          class="btn-b"
          @click="getData"
        >查询</el-button>
        <el-button href="javascript:void(0)" class="btn-w" @click="clearSearchBox">清空</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" ref="refTable">
      <el-table-column prop="" label="日期" min-width="120" fixed="left"></el-table-column>
      <el-table-column prop="" label="星期" min-width="120"></el-table-column>
      <el-table-column prop="" label="科室" min-width="120"></el-table-column>
      <el-table-column prop="" label="班组" min-width="120"></el-table-column>
      <el-table-column prop="" label="班制" min-width="120"></el-table-column>
      <el-table-column prop="" label="班次" min-width="120"></el-table-column>
      <el-table-column prop="" label="上班时间" min-width="120"></el-table-column>
      <el-table-column prop="" label="下班时间" min-width="120"></el-table-column>
      <el-table-column prop="" label="是否跨天" min-width="120"></el-table-column>
      <el-table-column prop="" label="是否班长" min-width="120"></el-table-column>
      <el-table-column prop="" label="是否请假" min-width="120"></el-table-column>
      <el-table-column prop="" label="是否换班" min-width="120"></el-table-column>
      <el-table-column prop="" label="代班人" min-width="120"></el-table-column>
      <el-table-column prop="" label="代班人工号" min-width="120"></el-table-column>
    </el-table>
    <div style="height:32px;">
      <Pagination
        :total="total"
        :page.sync="page.pageNum"
        :limit.sync="page.pageSize"
        @pagination="getData"
      />
    </div>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
export default {
  name: "changehistory",
  components: {
    Pagination
  },
  data() {
    return {
      createTimeRange: [],
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      tableData: [],
      queryForm: {}
    };
  },
  methods: {
    getData() {},
    changeDate(val, type) {
      this.queryForm.startDate = val[0];
      this.queryForm.endDate = val[1];
    },
    clearSearchBox() {
    }
  }
};
</script>
<style></style>