<template>
  <div style="height: 100%;" class="produceOutput">
    <el-form inline :model="queryForm" :rules="rules" ref="queryForm" style="margin-left:20px">
      <el-row>
        <el-form-item label="日期：" prop="queryDate">
          <el-date-picker
            v-model="queryForm.queryDate"
            type="month"
            value-format="yyyy-MM"
            placeholder="选择月"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="员工" prop="workerCode">
          <el-input v-model="queryForm.workerCode" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary " icon="el-icon-search" @click="getData('queryForm')">查询</el-button>
          <el-button type="primary " icon="el-icon-refresh-left" @click="reset">重置</el-button>
          <el-button
            type="primary"
            icon="el-icon-printer"
            @click="exportData"
            v-has="'PPC-USMOPT-EXPORT'"
          >导出</el-button>
        </el-form-item>
      </el-row>
    </el-form>

    <el-table
      highlight-current-row
      show-summary
      :summary-method="getSummaries"
      :data="tableData"
      border
      height="calc(100% - 52px - 150px - 12px - 12px)"
      style=" width: 100%"
    >
      <el-table-column prop="date" label="日期"></el-table-column>
      <el-table-column prop="materialName" label="物料编码-名称"></el-table-column>
      <el-table-column prop="processName" label="工序"></el-table-column>
      <el-table-column prop="price" label="工序单价"></el-table-column>
      <el-table-column prop="jsQty" label="计价数量"></el-table-column>
      <el-table-column prop="money" label="金额"></el-table-column>
      <el-table-column prop="unitCode" label="单位"></el-table-column>
      <el-table-column prop="workerName" label="员工"></el-table-column>
      <el-table-column prop="teamName" label="班组"></el-table-column>
      <el-table-column prop="njsPrice" label="不计价数量"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { monthPriceOfEmployess } from "@/api/productionPlanning";
import EditTable from "@/components/EditTable";
import Pagination from "@/components/Pagination";
import { exportExcel, resetQueryForm } from "@/utils/common";
import { isEmptyArray } from '@/utils/index'

export default {
  components: {
    EditTable,
    Pagination
  },
  data() {
    return {
      queryForm: {
        queryDate: null,
        workerCode: ""
      },
      tableData: [],
      rules: {
        queryDate: [
          { required: true, message: "请选择月份", trigger: "change" }
        ],
        workerCode: [
          { required: true, message: "请输入员工编号", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    getData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          monthPriceOfEmployess(this.queryForm).then(response => {
            let data = response.data;
            if (data.success) {
              this.tableData = data.data;
            } else {
              this.$message.error(
                response.data.message + ":" + response.data.data
              );
            }
          });
        } else {
          return false;
        }
      });
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (index === 3 || index === 4 || index === 9) {
          sums[index] = "";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += " 元";
        } else {
          sums[index] = "";
        }
      });

      return sums;
    },
    exportData() {
      let exportData = [];
      const fields = {
        date: "日期",
        materialName: "物料编码-名称",
        processName: "工序",
        price: "工序单价",
        jsQty: "计价数量",
        money: "金额",
        unitCode: "单位",
        teamName: "所在班组",
        workerName: "员工",
        njsQty: "不计价数量"
      };
      const fileName = "员工月计件汇总";
      monthPriceOfEmployess(this.queryForm)
        .then(response => {
          exportData = response.data.data;
            if (isEmptyArray(exportData)) {
                this.$message.error("列表数据为空,无法导出！！")
                return
            }
          exportExcel(fileName, fields, exportData);
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    reset() {
      resetQueryForm(this, "queryForm", "");
      this.getData("queryForm");
    }
  }
};
</script>
<style scoped>
</style>
<style>
.el-table {
  overflow: visible !important;
}
</style>
