<template>
  <!-- 接口调用记录 -->
  <div class="ioRecord" style="height:100%">
    <!-- 查询表单 -->
    <el-form ref="queryForm" :model="queryForm" style="margin-left:20px" inline>
      <el-row>
        <el-form-item label="计划时间" prop="planTime">
          <el-date-picker
            v-model="queryForm.planTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="计划开始"
            end-placeholder="计划结束"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="巡检计划" prop="planId">
          <el-select v-model="queryForm.planId" clearable></el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="getData(1)">查询</el-button>
          <el-button
            href="javascript:void(0)"
            @click="clearSearchBox"
            type="primary"
            icon="el-icon-refresh-left"
          >重置</el-button>
          <el-button type="text" @click="showMore=!showMore">
            {{ showMore ? '收起' : '展开' }}
            <i class="el-icon-arrow-down" />
          </el-button>
        </el-form-item>
      </el-row>
      <el-row v-show="showMore">
        <el-form-item label="巡检状态" prop="status">
          <el-select v-model="queryForm.status" prop="status" clearable></el-select>
        </el-form-item>
        <el-form-item label="巡检结果" prop="result">
          <el-select v-model="queryForm.result" prop="result" clearable></el-select>
        </el-form-item>
        <el-form-item label="报修状态" prop="isReport">
          <el-select v-model="queryForm.isReport" prop="isReport" clearable></el-select>
        </el-form-item>
        <el-form-item label="确认状态" prop="confirmed">
          <el-select v-model="queryForm.confirmed" prop="confirmed" clearable></el-select>
        </el-form-item>
      </el-row>
    </el-form>
    <!-- 表格 -->
    <el-table :data="tableData" height="calc(100% - 124px)" border stripe style="width: 100%">
      <el-table-column prop="ioCode" label="接口编码"></el-table-column>
      <el-table-column prop="ioName" label="接口名称"></el-table-column>
      <el-table-column prop="ioNo" width="120" label="流水"></el-table-column>
      <el-table-column prop="callTime" width="150" label="调用时间"></el-table-column>
      <el-table-column prop="caller" width="150" label="调用方"></el-table-column>
      <el-table-column prop="called" width="150" label="被调方"></el-table-column>
      <el-table-column prop="ioInput" width="300" label="接口传参" show-overflow-tooltip></el-table-column>
      <el-table-column prop="callResult" :formatter="formatterData1" label="调用结果"></el-table-column>
      <el-table-column
        align="center"
        width="250"
        show-overflow-tooltip
        prop="callResultException"
        label="异常描述"
      ></el-table-column>
      <el-table-column prop="businessResult" width="120" :formatter="formatterData2" label="业务处理结果"></el-table-column>
      <el-table-column
        prop="called"
        label="操作"
        align="center"
        width="100"
        fixed="right"
        :key="random"
      >
        <template v-slot="{row}">
          <el-button type="text" @click="getDetail(row)">明细数据</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      :page.sync="page.pageNum"
      :limit.sync="page.pageSize"
      @pagination="getData"
    />
    <!-- 对话框 -->
    <el-dialog title="接口明细数据" :visible.sync="dialogVisible" fullscreen>
      <detail></detail>
    </el-dialog>
  </div>
</template>

<script>
import detail from "./detail";
import Pagination from "@/components/Pagination";
export default {
  components: {
    Pagination,
    detail
  },
  data() {
    return {
      queryForm: {},
      showMore: false,
      tableData: [
        {
          ioCode: "IO001",
          ioName: "获取接口",
          ioNo: "200622130123",
          callTime: "2020-06-20 08:00",
          caller: "MOM系统管理员",
          called: "辉煌SPA系统",
          ioInput: "{startTime:2020-06-19 00:00:01 endTime:2020-02-02}",
          callResult: "1",
          callResultException: "无",
          businessResult: "3"
        }
      ],
      random: Math.random(),
      total: 0,
      page: {
        pageNum: 1,
        pageSize: 10
      },
      dialogVisible: false
    };
  },
  methods: {
    getData() {},
    clearSearchBox() {},
    formatterData1(row) {
      switch (row.callResult) {
        case "1":
          return "成功";
        case "2":
          return "异常";
        case "3":
          return "不处理";
      }
    },
    formatterData2(row) {
      switch (row.businessResult) {
        case "1":
          return "成功";
        case "2":
          return "异常";
        case "3":
          return "不处理";
      }
    },
    getDetail(row) {
      this.dialogVisible = true;
    }
  },
  activated() {
    this.random = Math.random();
  }
};
</script>

<style>
</style>
