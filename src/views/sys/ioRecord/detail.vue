<template>
  <!-- 明细数据 -->
  <div class="ioRecordDetail">
    <!-- 查询行 -->
    <el-form :inline="true" :model="queryForm" class="demo-form-inline" style="margin-left:20px">
      <el-form-item label="处理结果">
        <el-select v-model="queryForm.businessResult" clearable>
          <el-option value="1" label="成功"></el-option>
          <el-option value="2" label="不成功"></el-option>
          <el-option value="3" label="不处理"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="getData(1)">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="tableData" height="calc(100% - 124px)" border stripe style="width: 100%">
      <el-table-column prop="ioInput" min-width="300" label="数据内容" show-overflow-tooltip></el-table-column>
      <el-table-column
        prop="businessResult"
        min-width="120"
        :formatter="formatterData2"
        label="处理结果"
      ></el-table-column>
      <el-table-column
        align="center"
        min-width="250"
        show-overflow-tooltip
        prop="callResultException"
        label="异常描述"
      ></el-table-column>
      <el-table-column prop="callTime" width="150" label="处理时间"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryForm: {
        businessResult: ""
      },
      tableData: []
    };
  },
  methods: {
    getData() {},
    formatterData2(row) {
      switch (row.businessResult) {
        case "1":
          return "成功";
        case "2":
          return "异常";
        case "3":
          return "不处理";
      }
    }
  }
};
</script>

<style>
</style>
