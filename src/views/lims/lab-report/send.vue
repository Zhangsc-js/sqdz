<template>
  <div>
    <el-form
      ref="queryForm"
      :inline="true"
      :model="queryForm"
      label-width="100px"
      class="margin20 mb0"
    >
      <el-form-item label="样品名称" prop="labProgram">
        <el-input
          v-model="queryForm.labProgram"
          :maxlength="12"
          plain="true"
          placeholder="请输入样品名称"
        />
      </el-form-item>
      <el-form-item label="取样车间" prop="workShop">
        <el-input v-model="queryForm.workShop" :maxlength="12" plain="true" placeholder="取样车间" />
      </el-form-item>
      <el-form-item label="送样日期" prop="sendDate">
        <el-date-picker
          v-model="queryForm.sendDate"
          type="daterange"
          range-separator="至"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          @change="changeDate"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="任务单号" prop="scheduleCode">
        <el-input
          v-model="queryForm.scheduleCode"
          :maxlength="20"
          plain="true"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          placeholder="请输入任务单号"
        />
      </el-form-item>
      <el-form-item label="审核状态" prop="ifOk">
        <el-select v-model="queryForm.ifOk" @change="getData(1)" placeholder="请选择审核状态" clearable>
          <el-option label="审核完成" value="审核完成"></el-option>
          <el-option label="未完成" value="未完成"></el-option>
        </el-select>
      </el-form-item>
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
    <div class="tableshadow margin20" style="width:calc(100% - 40px);">
      <el-table :data="tableData" ref="refTable">
        <el-table-column prop="speciName" align="center" label="样品名称">
            <template v-slot="scope">
                {{ scope.row.speciName }}
                <span
                    v-if="!!scope.row.planType && scope.row.planType === 3"
                    class="reinspect-stamp"
                >复</span
                >
            </template>
        </el-table-column>
        <el-table-column prop="speciCode" align="center" label="样品编号" min-width="150px"></el-table-column>
        <el-table-column prop="scheduleCode" align="center" label="任务单号" min-width="150px"></el-table-column>
        <el-table-column prop="sendPerson" align="center" min-width="150px" label="送样人">
          <template v-slot="scope">
            <span v-if="!!scope.row.sendPerson">{{scope.row.sendPerson}}</span>
            <span v-else>暂未送样</span>
          </template>
        </el-table-column>
        <el-table-column prop="workShop" align="center" label="取样车间" width="150px"></el-table-column>
        <el-table-column prop="sampPlace" align="center" label="取样地点" width="150px"></el-table-column>
        <el-table-column prop="sendTime" align="center" label="送样时间" width="180px">
          <template v-slot="scope">
            <span v-if="!!scope.row.sendTime">{{scope.row.sendTime}}</span>
            <span v-else>暂未送样</span>
          </template>
        </el-table-column>
        <el-table-column prop="okTime" align="center" label="审核完成时间" width="180px">
          <template v-slot="scope">
            <span v-if="!!scope.row.okTime">{{scope.row.okTime}}</span>
            <span v-else>未完成</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="indicatorName"
          align="center"
          label="分析项目"
          show-overflow-tooltip
          min-width="150px"
        ></el-table-column>
        <el-table-column align="center" width="120" fixed="right" label="分析项目详情">
          <template slot-scope="scope">
            <button
              type="button"
              class="el-button el-button--text el-button--small"
              @click="getIndicatorDetail(scope.row)"
            >
              <i class="el-icon-info">项目详情</i>
            </button>
          </template>
        </el-table-column>
      </el-table>
      <!--<el-table-column label="操作">
        <template v-slot="scope">
          <el-button type="text" size="small" @click="getDetail(scope.row )">查看详情</el-button>
        </template>
      </el-table-column>-->
      <Pagination
        :total="total"
        :page.sync="page.pageNum"
        :limit.sync="page.pageSize"
        @pagination="getData"
      />
    </div>
    <el-dialog title="分析项目详情" :visible.sync="itemDialogVisible" width="60%">
      <indicator-more @hidenDialog="hidenDialog" :rowSpecimen="rowSpecimen" />
    </el-dialog>
  </div>
</template>
<script>
import { getSendAlySituation } from "@/api/lims";
import Pagination from "@/components/Pagination";
import { simpleDateFormat } from "@/utils/index";
import IndicatorMore from "./indicator-more";
export default {
  name: "send",
  components: {
    Pagination,
    IndicatorMore
  },
  data() {
    return {
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      loading: false,
      tableData: [],
      queryForm: {
        // 查询表单
        labProgram: "",
        sendDate: "",
        workShop: "",
        scheduleCode: "",
        ifOk: "",
        timeStart: "",
        timeEnd: ""
      },
      itemDialogVisible: false,
      rowSpecimen: {}
    };
  },
  methods: {
    getData(page) {
      if (page == 1) this.page.pageNum = 1;
      getSendAlySituation(this.page, this.queryForm)
        .then(res => {
          this.tableData = res.data.data.rows.map(v => {
            v.indicatorName = v.indicator.split("@,,,@").join(",");
            return v;
          });
          this.total = res.data.data.total;
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    clearSearchBox() {
      this.queryForm = {
        labProgram: "",
        sendDate: "",
        workShop: "",
        scheduleCode: "",
        ifOk: "",
        timeStart: "",
        timeEnd: ""
      };
      this.getData(1);
    },
    hidenDialog() {
      this.itemDialogVisible = false;
      this.getData();
    },
    getIndicatorDetail(row) {
      let _this = this;
      _this.rowSpecimen = row;
      _this.itemDialogVisible = true;
    },
    changeDate(val) {
      if (!!val) {
        this.$set(this.queryForm, "timeStart", `${val[0]} 00:00:00`);
        this.$set(this.queryForm, "timeEnd", `${val[1]} 23:59:59`);
      } else {
        this.$set(this.queryForm, "timeStart", ``);
        this.$set(this.queryForm, "timeEnd", ``);
      }
    }
  },
  mounted() {
    this.getData();
  }
};
</script>

<style scoped>
.el-form .el-col button {
  margin: -1px 4px 0px 4px;
}
</style>
