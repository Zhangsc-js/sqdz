<template>
  <div class="warnMessageInfo" style="height:100%">
    <!-- 查询表单 -->
    <el-form inline ref="queryForm" :model="queryForm" style="margin-left:20px">
      <el-row>
        <el-form-item label="警报名称" prop="warningCode">
          <el-select v-model="queryForm.warningCode" clearable placeholder="请选择">
            <el-option
              v-for="item in warnNameOps"
              :key="item.id"
              :label="item.warningName"
              :value="item.warningCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="警报时间" prop="warningTime">
          <el-date-picker
            v-model="queryForm.warningTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="init(1)">查询</el-button>
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
        <el-form-item label="关闭状态" prop="isClose">
          <el-select v-model="queryForm.isClose" clearable placeholder="请选择">
            <el-option label="未关闭" value="0"></el-option>
            <el-option label="已关闭" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="警报分类" prop="warningType">
          <el-select v-model="queryForm.warningType" clearable placeholder="请选择">
            <el-option
              v-for="item in warningCategoryOps"
              :key="item.value"
              :label="item.label"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="警报级别" prop="warningLevel">
          <el-select v-model="queryForm.warningLevel" clearable placeholder="请选择">
            <el-option label="初级" value="1"></el-option>
            <el-option label="升级" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="警报号" prop="warningNo">
          <el-input v-model="queryForm.warningNo" prop="warningNo"></el-input>
        </el-form-item>
      </el-row>
    </el-form>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      stripe
      border
      style="width: 100%"
      highlight-current-row
      :height="showMore ? 'calc(100% - 104px - 52px)':'calc(100% - 104px )'"
      @row-click="rowClick"
    >
      <el-table-column prop="warningNo" label="警报号"></el-table-column>
      <el-table-column prop="warningCode" label="警报编码"></el-table-column>
      <el-table-column prop="warningName" label="警报名称"></el-table-column>
      <el-table-column prop="warningTime" label="警报时间"></el-table-column>
      <el-table-column prop="businessCode" label="业务编码"></el-table-column>
      <el-table-column prop="warningContent" label="警报内容" width="200px"></el-table-column>
      <el-table-column prop="exceptionReasonType" :formatter="cellFormat" label="异常原因类型"></el-table-column>
      <el-table-column prop="warningLevel" label="警报级别">
        <template v-slot="{row}">
          <span>{{row.warningLevel==="1"?'初级警报':'升级警报'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="warningType" label="警报分类" :formatter="formatWarningCategory"></el-table-column>
      <el-table-column prop="responseType" label="响应方式">
        <template v-slot="{row}">
          <span>{{responseType(row.responseType)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="isConfirm" label="确认状态">
        <template v-slot="{row}">
          <span>{{row.isConfirm === "1" ? '已确认' : '未确认'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="isClose" label="关闭状态">
        <template v-slot="{row}">
          <span>{{row.isClose === "1" ? '已关闭' : '未关闭'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="linkWarningNo" label="关联警报号"></el-table-column>
    </el-table>
    <Pagination
      :total="total"
      :page.sync="page.pageNum"
      :limit.sync="page.pageSize"
      @pagination="init()"
    />
  </div>
</template>

<script>
import {
  getData,
  getWarnName,
  getWarningCategory
} from "@/api/sys/warnMessage";

import { getDictDetailList } from "@/api/sys/dict";
import Pagination from "@/components/Pagination";
import { simpleDateFormat, isEmptyArray, isEmpty } from "@/utils/index";

export default {
  components: {
    Pagination
  },
  props: {},
  data() {
    return {
      queryForm: {
        warningCode: "",
        warningTime: ["", ""],
        warningCategory: "",
        isClose: null,
        warningLevel: "",
        warningNo: "",
        warningType: null
      },
      showMore: false,
      tableData: [],
      total: 0,
      page: {
        pageNum: 1,
        pageSize: 10
      },
      warnNameOps: [],
      warningCategoryOps: [],
      reasonType: []
    };
  },
  computed: {
    responseType() {
      return function(type) {
        if (type === "1") {
          return "无需响应";
        } else if (type === "2") {
          return "任一人响应后关闭警报";
        } else if (type === "3") {
          return "任一主响应人响应关闭警报";
        } else if (type === "4") {
          return "需所有人员响应";
        }
      };
    }
  },
  methods: {
    init(type) {
      if (type == "1") {
        this.page.pageNum = 1;
      }
      if (!this.queryForm.warningTime) {
        this.queryForm.warningTime = ["", ""];
      }
      let beforeTime = this.queryForm.warningTime[0]
        ? simpleDateFormat(this.queryForm.warningTime[0], "yyyy-MM-dd HH:mm:ss")
        : "";
      let afterTime = this.queryForm.warningTime[1]
        ? simpleDateFormat(this.queryForm.warningTime[1], "yyyy-MM-dd HH:mm:ss")
        : "";
      let { warningTime, ...other } = this.queryForm;
      let params = {
        ...this.page,
        ...other,
        beforeTime: beforeTime,
        afterTime: afterTime
      };
      getData(params).then(res => {
        this.tableData = res.data.data.rows;
        this.total = res.data.data.total;
      });
      getDictDetailList("DEV_WARNING_REASON_TYPE").then(res => {
        const result = res.data;
        if (result.success) {
          this.reasonType = result.data;
        } else {
          this.$message.error(result.message);
        }
      });
    },
    getWarningCategory() {
      getWarningCategory().then(res => {
        const result = res.data;
        if (result.success) {
          this.warningCategoryOps = result.data;
        } else {
          this.$message.errot(result.message);
        }
      });
    },
    getWarnName() {
      getWarnName().then(res => {
        this.warnNameOps = res.data.data;
      });
    },
    // 点击行
    rowClick(row) {
      this.$emit("row_clcik", row);
    },
    formatWarningCategory(r, c, v) {
      for (let e of this.warningCategoryOps) {
        if (e.code == v) {
          return e.label;
        }
      }
    },
    cellFormat(r, c, v) {
      if (isEmptyArray(this.reasonType) || isEmpty(v)) {
        return v;
      }
      const el = this.reasonType.find(e => e.code == v);
      return el == undefined ? v : el.label;
    },
    clearSearchBox() {
      this.$refs["queryForm"].resetFields();
      this.init();
    }
  },
  created() {
    this.$nextTick(() => {
      this.init();
      this.getWarnName();
      this.getWarningCategory();
    });
  }
};
</script>

<style>
</style>
