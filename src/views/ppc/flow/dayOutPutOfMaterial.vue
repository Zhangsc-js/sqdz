<template>
  <div style="height: 100%;" class="produceOutput">
    <el-form inline :model="queryForm" :rules="rules" ref="queryForm">
      <el-row>
        <el-form-item label="日期：" prop="startDate">
          <el-date-picker
            v-model="queryForm.startDate"
            type="date"
            placeholder="开始日期"
            style="width: 100%"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="~" prop="endDate">
          <el-date-picker
            v-model="queryForm.endDate"
            type="date"
            placeholder="截止日期"
            style="width: 100%"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="车间名称：" prop="workshopCode">
          <el-select
            v-model="queryForm.workshopCode"
            placeholder="请选择"
            filterable
            style="width: 100%"
            clearable
            @change="getData('queryForm')"
          >
            <el-option
              v-for="item in shopMap"
              :key="item.proccode"
              :label="item.name"
              :value="item.proccode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物料编码：" prop="materialCode">
          <el-input
            v-model="queryForm.materialCode"
            @focus="sltMaterialDialogVisible=true"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary " icon="el-icon-search" @click="getData('queryForm')">查询</el-button>
          <el-button type="primary " icon="el-icon-refresh-left" @click="reset()">重置</el-button>
          <el-button
            type="primary"
            icon="el-icon-printer"
            @click="exportData"
            v-has="'PPC-MAOUPU-EXPORT'"
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
      height="calc(100% - 52px - 90px - 12px - 12px)"
      style=" width: 100%"
    >
      <el-table-column prop="date" label="日期"></el-table-column>
      <el-table-column prop="materialCode" label="物料编码"></el-table-column>
      <el-table-column prop="materialName" label="物料名称"></el-table-column>
      <el-table-column prop="workshopName" label="车间名称"></el-table-column>
      <el-table-column prop="goodQty" label="合格量"></el-table-column>
      <el-table-column prop="badQty" label="废品量"></el-table-column>
      <el-table-column prop="gooRate" label="合格率"></el-table-column>
      <el-table-column prop="unitCode" label="单位"></el-table-column>
    </el-table>

    <div style="padding-top:40px">
      <Pagination
        :total="total"
        :page.sync="page.pageNum"
        :limit.sync="page.pageSize"
        :pageSizes="pageSizes"
        @pagination="getData('queryForm')"
      />
    </div>

    <el-dialog title="选择物料" :visible.sync="sltMaterialDialogVisible" width="65%">
      <sltMaterial @save="confirmMaterial" @cancel="sltMaterialDialogVisible=false" :id="objId" />
    </el-dialog>
  </div>
</template>

<script>
import { queryWorkShop, dayOutPutOfMaterial } from "@/api/productionPlanning";
import Pagination from "@/components/Pagination";
import { simpleDateFormat } from "@/utils/index";
import sltMaterial from "../plannedProduction/ppc-bom/materialInfo";
import EditTable from "@/components/EditTable";
import { exportExcel, resetQueryForm } from "@/utils/common";

export default {
  components: {
    Pagination,
    sltMaterial,
    EditTable
  },
  data() {
    return {
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      pageSizes: [10, 50, 100],
      queryForm: {
        startDate: simpleDateFormat(new Date(), "yyyy-MM-dd"),
        endDate: simpleDateFormat(new Date(), "yyyy-MM-dd"),
        workshopCode: "",
        materialCode: ""
      },
      shopMap: [],
      objId: "",
      sltMaterialDialogVisible: false,
      tableData: [],
      rules: {
        startDate: [
          { required: true, message: "请选择开始日期", trigger: "change" }
        ],
        endDate: [
          { required: true, message: "请选择结束日期", trigger: "change" }
        ]
      }
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      queryWorkShop().then(response => {
        let data = response.data.data.WORKSHOP_ALL;
        this.shopMap = data;
      });
      this.getData("queryForm");
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (index === 6) {
          sums[index] =
            ((sums[4] / (sums[5] + sums[4])) * 100).toFixed(2) + "%";
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
          // sums[index] += ' 元';
        } else {
          sums[index] = "";
        }
      });

      return sums;
    },
    getData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {
            ...this.page,
            ...this.queryForm
          };
          dayOutPutOfMaterial(params).then(response => {
            let data = response.data;
            if (data.success) {
              this.tableData = data.data.list;
              this.total = data.data.total;
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
    exportData() {
      let exportData = [];
      const params = {
        ...this.queryForm,
        pageNum: 1,
        pageSize: this.total
      };
      const fields = {
        date: "日期",
        materialCode: "物料编码",
        materialName: "物料名称",
        workshopName: "车间名称",
        goodQty: "合格量",
        badQty: "废品量",
        gooRate: "合格率",
        unitCode: "单位"
      };
      const fileName = "物料日产出汇总";
      dayOutPutOfMaterial(params)
        .then(response => {
          exportData = response.data.data.list;
          if(exportData.length == 0){
              this.$message.info("列表数据为空,无法导出！！")
          } else {
              exportExcel(fileName, fields, exportData);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    confirmMaterial(data) {
      this.queryForm.materialCode = data.materialCode;
      this.sltMaterialDialogVisible = false;
    },
    reset() {
      resetQueryForm(this, "queryForm", "initData");
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
