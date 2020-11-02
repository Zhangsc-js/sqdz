<template>
  <div class="Dialog" style="height:100%;overflow:auto">
    <!-- 查询 -->
    <el-form
      :rules="rules"
      :inline="true"
      :model="queryForm"
      class="demo-form-inline"
      ref="queryForm"
      style="padding-left:20px"
    >
      <el-form-item
        v-for="(item,index) in query"
        :key="index"
        :prop="item.prop"
        :rules="item.rule?{ required: true, message: '请选择或输入正确信息', trigger: ['blur','change'] }:[]"
        :label="item.label"
      >
        <el-input
          v-if="!item.type||item.type.toLowerCase()==='input'"
          v-model="queryForm[item.prop]"
        ></el-input>
        <el-select
          v-if="item.type&&item.type.toLowerCase()==='select'"
          v-model="queryForm[item.prop]"
          placeholder="请选择"
        >
          <el-option
            v-for="(opt,index) in item.options"
            :key="index"
            :label="opt.label"
            :value="opt.value"
          ></el-option>
        </el-select>
        <span v-if="item.type&&item.type.toLowerCase()==='date'">
          <el-date-picker
            type="date"
            placeholder="选择开始日期"
            v-model="queryForm.startDate"
            format="yyyy-MM-dd"
          ></el-date-picker>-
          <el-date-picker
            type="date"
            placeholder="选择结束日期"
            v-model="queryForm.endDate"
            format="yyyy-MM-dd"
          ></el-date-picker>
        </span>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="getDate" icon="el-icon-search">查询</el-button>
        <el-button type="primary" icon="el-icon-refresh-left" @click="resetQuery('queryForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 确定按钮 -->
    <el-row style="padding:5px 20px">
      <el-button type="primary" icon="el-icon-check" @click="checked">确定</el-button>
    </el-row>
    <!-- 表格主体 -->
    <el-table
      :data="tableData"
      stripe
      border
      style="width: 100%"
      height="calc(100% - 166px)"
      ref="multipleTable"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
        v-for="(column,index) in opts"
        :key="index"
        :prop="column.prop"
        :label="column.label"
      ></el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      v-if="hasPage"
      :total="total"
      :page.sync="page.pageNum"
      :limit.sync="page.pageSize"
      :pageSizes="pageSizes"
      @pagination="getDate"
    />
  </div>
</template>

<script>
import { resetQueryForm } from "@/utils/common";
import Pagination from "@/components/Pagination";
import { simpleDateFormat } from "@/utils/index";
export default {
  components: {
    Pagination
  },
  props: {
    query: {
      type: Array,
      required: false
    },
    requestUrl: {
      type: Function,
      required: true
    },
    opts: {
      type: Array,
      required: true
    },
    multiple: {
      type: Boolean,
      required: false,
      default: false
    },
    hasPage: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data() {
    return {
      rules: {
        common: [
          {
            required: true,
            message: "请输入或选择正确信息",
            trigger: ["blur", "change"]
          }
        ]
      },
      queryForm: {},
      tableData: [],
      total: 0,
      page: {
        pageNum: 1,
        pageSize: 10
      },
      pageSizes: [10, 20, 50],
      startDate: "",
      endDate: ""
    };
  },
  methods: {
    getDate() {
      this.$refs["queryForm"].validate(val => {
        if (val) {
          if (this.queryForm.startDate) {
            this.queryForm.startDate = simpleDateFormat(
              this.queryForm.startDate,
              "yyyy-MM-dd"
            );
          }
          if (this.queryForm.endDate) {
            this.queryForm.endDate = simpleDateFormat(
              this.queryForm.endDate,
              "yyyy-MM-dd"
            );
          }
          let params = {
            ...this.queryForm,
            ...this.page
          };
          this.requestUrl(params).then(res => {
            if (res.data.success) {
              this.tableData = res.data.data.rows;
              this.total = res.data.data.total;
            } else {
              this.$message.error(res.data.message);
            }
          });
        }
      });
    },
    resetQuery() {
      resetQueryForm(this, "queryForm", "getDate");
    },
    checked() {
      let arr = this.$refs.multipleTable.store.states.selection;
      if (!this.multiple && arr.length > 1) {
        this.$message.error("只能选择一项");
        return;
      }
      if (arr.length == 1) {
        this.$emit("getChecked", arr[0]);
      } else {
        this.$emit("getChecked", arr);
      }
    }
  },
  mounted() {
    this.getDate();
  }
};
</script>

<style>
</style>
