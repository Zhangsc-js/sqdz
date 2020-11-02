<template>
  <div>
    <el-form
      ref="queryForm"
      :model="queryForm"
      :inline="true"
      label-width="100px"
      class="margin20 mb0"
    >
      <el-form-item label="接收时间" prop>
        <el-date-picker
          v-model="createTimeRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="
                        val => {
                            changeDate(val, 'createTime');
                        }
                    "
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="录入时间" prop>
        <el-date-picker
          v-model="typeTimeRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="
                        val => {
                            changeDate(val, 'typeTime');
                        }
                    "
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="审核时间" prop>
        <el-date-picker
          v-model="reviewTimeRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="
                        val => {
                            changeDate(val, 'reviewTime');
                        }
                    "
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="化验物料" prop="proName">
        <el-input v-model="queryForm.proName" plain="true" placeholder="请输入化验物料" />
      </el-form-item>
      <el-form-item label="化验指标" prop="labIndicName">
        <el-input v-model="queryForm.labIndicName" plain="true" placeholder="请输入化验指标" />
      </el-form-item>
      <!-- <el-form-item label="任务ID" prop="scheduleId">
        <el-input v-model="queryForm.scheduleId" plain="true" placeholder="请输入任务ID" />
      </el-form-item>-->
      <el-form-item label="化验人员" prop="labOperatorName">
        <el-input v-model="queryForm.labOperatorName" plain="true" placeholder="请输入化验人员" />
      </el-form-item>
      <el-form-item label="状态" prop="type">
        <el-select v-model="queryForm.type" maxlength="20" @change="getData(1)" placeholder="请选择状态">
          <el-option label="化验中" value="化验中"></el-option>
          <el-option label="退审待化验中" value="退审待化验中"></el-option>
          <el-option label="审核中" value="审核中"></el-option>
          <el-option label="已完成" value="已完成"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="审核人员" prop="reviewOperatorName">
        <el-input v-model="queryForm.reviewOperatorName" plain="true" placeholder="请输入审核人员名称" />
      </el-form-item>-->
      <el-form-item>
        <el-button
          icon="el-icon-search"
          href="javascript:void(0)"
          type="primary"
          class="btn-b"
          @click="getData(1)"
        >查询</el-button>
        <el-button href="javascript:void(0)" class="btn-w" @click="clearSearchBox">清空</el-button>
      </el-form-item>
    </el-form>
    <div class="tableshadow margin20" style="width:calc(100% - 40px);padding-bottom:20px;">
      <el-table :data="tableData" :cell-class-name="setColor">
        <!--<el-table-column prop="labMain.scheduleId" label="任务ID" width="180"></el-table-column>-->
        <el-table-column prop="labMain.scheduleCode" label="任务单号" width="180"></el-table-column>
        <el-table-column prop="labMain.proName" label="化验物料" width="120">
          <template v-slot="scope">
            {{ scope.row.labMain.proName }}
            <span
              v-if="scope.row.isReexamination == 1"
              class="reinspect-stamp"
            >复</span>
          </template>
        </el-table-column>
        <el-table-column prop="labIndicName" label="化验指标" width="120"></el-table-column>
        <el-table-column prop="type" label="状态" width="120"></el-table-column>
        <el-table-column prop="labMain.receivePlace" label="收样地点"></el-table-column>
        <el-table-column prop="labMain.workShop" label="车间"></el-table-column>
        <el-table-column prop="labMain.sampPlace" label="取样地点"></el-table-column>
        <el-table-column prop="labMain.receiveUserName" :formatter="dataFormat" label="接收人"></el-table-column>
        <el-table-column prop="labGroup" label="化验小组"></el-table-column>
        <el-table-column prop="labOperatorName" label="化验人员"></el-table-column>
        <!-- <el-table-column prop="reviewOperatorName" label="审核人员"></el-table-column> -->
        <el-table-column prop="inindicData" label="计算参数"></el-table-column>
        <el-table-column prop="outindicData" label="计算结果"></el-table-column>
        <el-table-column :formatter="statusFormat" prop="reachStandard" label="达标情况" width="120"></el-table-column>
        <el-table-column prop="createTime" label="接收时间" align="center" width="180"></el-table-column>
        <el-table-column prop="typeTime" label="录入时间" align="center" width="180"></el-table-column>
        <el-table-column prop="reviewTime" label="审核时间" align="center" width="180"></el-table-column>
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
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { getProlist } from "@/api/lims";
import { simpleDateFormat } from "@/utils/index";

export default {
  name: "lab-prolist",
  components: {
    Pagination
  },
  data() {
    return {
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      tableData: [],
      queryForm: {
        createTimeStart: "",
        createTimeEnd: "",
        typeTimeStart: "",
        typeTimeEnd: "",
        labOperatorName: "",
        reviewTimeStart: "",
        reviewTimeEnd: "",
          proName: "",
        // reviewOperatorName: "",
        // scheduleId: ""
        labIndicName: "",
      },
        str:['\\','%','_'],
      createTimeRange: [],
      typeTimeRange: [],
      reviewTimeRange: []
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData(page) {
      if (page === 1) this.page.pageNum = 1;
        let queryParam = JSON.parse(JSON.stringify(this.queryForm));
        this.str.forEach(i=> {
            if (queryParam.proName.indexOf(i) > -1) {
                queryParam.proName = queryParam.proName.replace(new RegExp('\\'+i, 'g'), '\\' + i);
            }
            if (queryParam.labIndicName.indexOf(i) > -1) {
                queryParam.labIndicName = queryParam.labIndicName.replace(new RegExp('\\'+i, 'g'), '\\' + i);
            }
        });
      let params = { ...this.page, ...queryParam };
      getProlist(params)
        .then(res => {
          this.tableData = res.data.data.rows;
          this.total = res.data.data.total;
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    clearSearchBox() {
      this.queryForm = {
        createTimeStart: "",
        createTimeEnd: "",
        typeTimeStart: "",
        typeTimeEnd: "",
        labOperatorName: "",
        reviewTimeStart: "",
        reviewTimeEnd: "",
          proName: "",
        // reviewOperatorName: "",
        // scheduleId: ""
        labIndicName: ""
      };
      this.createTimeRange = [];
      this.typeTimeRange = [];
      this.reviewTimeRange = [];
      this.getData(1);
    },
    statusFormat(row, column) {
      let standards = ["", "不合格", "不合格", "合格", "合格"];
      return standards[row.reachStandard];
    },
    setColor({ row, column, rowIndex, columnIndex }) {
      let className = "";
      const color = ["", "c-danger", "c-warning", "c-primary", "c-success"];
      if (column.property == "reachStandard") {
        className = color[row.reachStandard];
      }
      return className;
    },
    formatTime(row, column, cellValue, index) {
      let res = "/";
      if (!!cellValue) {
        res = simpleDateFormat(new Date(cellValue), "yyyy-MM-dd");
      }
      return res;
    },
    changeDate(val, type) {
      if (!!val) {
        this.queryForm[type + "Start"] = val[0] + " 00:00:00";
        this.queryForm[type + "End"] = val[1] + " 23:59:59";
      } else {
        this.queryForm[type + "Start"] = "";
        this.queryForm[type + "End"] = "";
      }
    },
    dataFormat(row, column, cellValue, index) {
      let value = "/";
      ["", null, undefined].indexOf(cellValue) == -1 && (value = cellValue);
      return value;
    }
  }
};
</script>

<style scoped></style>
