<template>
  <div>
    <el-form ref="queryForm" :inline="true" label-width="100px" class="margin20 mb0">
      <el-form-item label="排班计划日期" prop>
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
        选择班组人员
        <el-cascader v-model="selDep" :options="optsList" @change="changeDep" :props="props"></el-cascader>
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
    <div class="tableshadow margin20" style="width:calc(100% - 40px);padding:20px 0;">
      <el-table :data="tableData" ref="refTable">
        <el-table-column prop="staffName" label="员工姓名" min-width="120" fixed="left"></el-table-column>
        <el-table-column prop="staffCode" label="员工工号" min-width="120" fixed="left"></el-table-column>
        <el-table-column prop="officeName" label="科室" min-width="120" fixed="left"></el-table-column>
        <el-table-column prop="teamName" label="班组" min-width="120" fixed="left"></el-table-column>
        <el-table-column
          prop
          :label="item"
          v-for="(item,i) in dateLabel"
          :key="i"
          min-width="220"
          align="center"
        >
          <template slot-scope="scope">{{scope.row.dateWeek[item]}}</template>
        </el-table-column>
      </el-table>

      <!-- <div style="height:32px;">
        <Pagination
          :total="total"
          :page.sync="page.pageNum"
          :limit.sync="page.pageSize"
          @pagination="getData"
        />
      </div>-->
    </div>
  </div>
</template>

<script>
import { shiftPlan, getLabDepartment, getLabGroupInfoByLabId, getTeam } from "@/api/lims";
import { getDate, simpleDateFormat } from "@/utils/index";
import Pagination from "@/components/Pagination";
let id = 1;
export default {
  name: "workSchedule",
  components: {
    Pagination,
  },
  data() {
    return {
      createTimeRange: [],
      queryForm: {
        officeId: "",
        teamId: "",
        startDate: simpleDateFormat(getDate(0), "yyyy-MM-dd"),
        endDate: simpleDateFormat(getDate(6), "yyyy-MM-dd"),
        staffName: "",
        staffCode: ""
      },
      selDep: null,
      dateLabel: [],
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      department: [],
      group: [],
      staff: [],
      tableData: [],
      optsList: [],
      dialogVisible: false,

      props: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node;
          const levelRes = [getLabDepartment, getLabGroupInfoByLabId, getTeam];
          let nodes = [];
          let levelParams = level == 0 ? "" : node.data.value.split("-")[0];
          levelRes[level](levelParams).then(res => {
            if (res.data.success) {
              const data =
                level == 0 ? res.data.data.selectData : res.data.data;
              let values = ["id", "teamCode", "personName"];
              let labels = ["departName", "teamName", "personName"];
              let codes = ["departCode", "id", "personCode"];
              data.map(item => {
                nodes.push({
                  value: item[values[level]] + "-" + item[codes[level]],
                  label: item[labels[level]],
                  leaf: level >= 2
                });
              });
              resolve(nodes);
            }
          });
        }
      }
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      let params = { ...this.queryForm, ...this.page };
      shiftPlan(params).then(res => {
        if (res.data.success) {
          const data = res.data.data;
          this.tableData = data;
          const dateWeek = Object.keys(data[0].dateWeek).sort();
          this.dateLabel = dateWeek;
        }
      });
    },
    clearSearchBox() {
      this.queryForm = {
        officeId: "",
        teamId: "",
        startDate: simpleDateFormat(getDate(0), "yyyy-MM-dd"),
        endDate: simpleDateFormat(getDate(6), "yyyy-MM-dd"),
        staffName: "",
        staffCode: ""
      };
      this.getData();
    },
    changeDate(val, type) {
      this.queryForm.startDate = val[0];
      this.queryForm.endDate = val[1];
    },
    changeDep(val) {
      this.queryForm.officeId = val[0].split("-")[0];
      this.queryForm.teamId = val[1].split("-")[1];
      this.queryForm.staffName = val[2].split("0")[0];
      this.queryForm.staffCode = val[2].split("0")[1];
    },
    hidenDialog() {
      this.dialogVisible = false;
      this.getData();
    }
  }
};
</script>
<style lang="scss">
.shift-dialog {
  .el-dialog__body {
    width: 100%;
    padding: 20px;
  }
}
</style>
<style scoped>
</style>
