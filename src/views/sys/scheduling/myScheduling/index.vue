<template>
  <!-- 我的排班 -->
  <div class="myScheduling">
    <!-- 表单 -->
    <el-form ref="queryForm" :model="queryForm" style="margin-left:20px" inline>
      <el-row>
        <el-form-item label="员工工号">
          <el-input v-model="queryForm.userCode"></el-input>
        </el-form-item>
        <el-form-item label="排班日期">
          <el-date-picker
            v-model="queryForm.time"
            type="datetimerange"
            range-separator="~"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="getData(1)">查询</el-button>
          <el-button
            href="javascript:void(0)"
            @click="clearSearchBox"
            type="primary"
            icon="el-icon-refresh-left"
          >重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <!-- 表格 -->
    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column prop="userCode" label="员工工号"></el-table-column>
      <el-table-column prop="userName" label="员工姓名"></el-table-column>
      <el-table-column prop="schedulDate" label="日期"></el-table-column>
      <el-table-column label="星期">
        <template v-slot="{row}">
          <span>{{new Date(row.schedulDate).getDay()|day}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="shiftName" label="班次名称"></el-table-column>
      <el-table-column prop="shiftTime" label="班次时间"></el-table-column>
      <el-table-column prop="parentOrgName" label="上级组织"></el-table-column>
      <el-table-column prop="teamName" label="所在班组"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { simpleDateFormat } from "@/utils/index";
import { getUserSchedule } from "@/api/sys/scheduling";
export default {
  data() {
    return {
      queryForm: {
        userCode: this.$store.getters.userCode
      },
      tableData: []
    };
  },
  methods: {
    getData() {
      let startDate = "";
      let endDate = "";
      let params = "";
      if (this.queryForm.time) {
        startDate = simpleDateFormat(this.queryForm.time[0], "yyyy-MM-dd");
        endDate = simpleDateFormat(this.queryForm.time[1], "yyyy-MM-dd");
        params = {
          ...this.queryForm,
          startDate,
          endDate
        };
        delete params.time;
      } else {
        params = {
          ...this.queryForm
        };
      }
      getUserSchedule(params).then(res => {
        console.log(res);
        if (res.data.success) {
          this.tableData = res.data.data;
        }
      });
    },
    clearSearchBox() {
      this.$refs["queryForm"].resetFields();
      this.getData();
    }
  },
  filters: {
    day(val) {
      switch (val) {
        case 0:
          return "星期天";
        case 1:
          return "星期一";
        case 2:
          return "星期二";
        case 3:
          return "星期三";
        case 4:
          return "星期四";
        case 5:
          return "星期五";
        case 6:
          return "星期六";
      }
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style>
</style>
