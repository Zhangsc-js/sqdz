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
          :picker-options="pickerOptions"
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
      <el-table-column prop="workDate" label="日期" min-width="120" fixed="left"></el-table-column>
      <el-table-column prop="workWeek" label="星期" min-width="120"></el-table-column>
      <el-table-column prop="officeName" label="科室" min-width="120"></el-table-column>
      <el-table-column prop="teamName" label="班组" min-width="120"></el-table-column>
      <el-table-column prop="shiftName" label="班制" min-width="120"></el-table-column>
      <el-table-column prop="className" label="班次" min-width="120"></el-table-column>
      <el-table-column prop="startTime" label="上班时间" min-width="120"></el-table-column>
      <el-table-column prop="endTime" label="下班时间" min-width="120"></el-table-column>
      <el-table-column prop="isCrossDay" :formatter="stateFormat" label="是否跨天" width="80"></el-table-column>
      <el-table-column prop="isLeader" :formatter="stateFormat" label="是否班长" width="80"></el-table-column>
      <el-table-column prop="askForLeave" :formatter="stateFormat" label="是否请假" width="80"></el-table-column>
      <el-table-column prop="changeShift" :formatter="stateFormat" label="是否换班" width="80"></el-table-column>
      <el-table-column prop="coverName" :formatter="valueFormat" label="代班人" min-width="120"></el-table-column>
      <el-table-column prop="coverCode" :formatter="valueFormat" label="代班人工号" min-width="120"></el-table-column>
      <el-table-column align="center" label="操作" width="80" fixed="right">
        <template v-slot="scope">
          <el-button type="text" size="small" @click="popChange(scope.row)">换班</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="height:32px;">
      <Pagination
        :total="total"
        :page.sync="page.pageNum"
        :limit.sync="page.pageSize"
        @pagination="getData"
      />
    </div>
    <el-dialog class="shift-dialog" title="换班选择" :visible.sync="dialogVisible" width="80%">
      <shifts @hidenDialog="hidenDialog" :selItem="selItem" />
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import { myShiftPlan } from "@/api/lims";
import { getDate, simpleDateFormat } from "@/utils/index";
import Shifts from "./shifts";
export default {
  name: "changeshift",
  components: {
    Pagination,
    Shifts
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
      queryForm: {
        staffCode: 8011, //this.$store.getters.workCode,
        startDate: simpleDateFormat(getDate(0), "yyyy-MM-dd"),
        endDate: simpleDateFormat(getDate(6), "yyyy-MM-dd")
      },
      dialogVisible: false,
      selItem: null,
      pickerOptions: {
        disabledDate(val) {
          let today = new Date(
            new Date(new Date().toLocaleDateString()).getTime() +
              24 * 60 * 60 * 1000 -
              1
          ).getTime();
          return val.getTime() - today <= 0;
        }
      }
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      const params = { ...this.queryForm, ...this.page };
      myShiftPlan(params).then(res => {
        this.tableData = res.data.data.rows;
        this.total = res.data.data.total;
      });
    },
    changeDate(val, type) {
      this.queryForm.startDate = val[0];
      this.queryForm.endDate = val[1];
    },
    clearSearchBox() {
      this.queryForm = {
        LaboratoryPersonnelName: "",
        proName: "",
        assignee: 2010, //this.$store.getters.workCode,
        paramMap: {
          化验审核数据: "labSubList",
          化验审核上级意见备注: "remark"
        },
        createStart: "",
        createEnd: ""
      };
    },
    stateFormat(row, column, cellValue, index) {
      const state = ["否", "是"];
      return state[cellValue];
    },
    valueFormat(row, column, cellValue) {
      return !!cellValue ? cellValue : "/";
    },
    popChange(item) {
      this.selItem = item;
      this.dialogVisible = true;
    },
    hidenDialog() {
      this.dialogVisible = false;
      this.selItem = null;
    }
  }
};
</script>
<style></style>
