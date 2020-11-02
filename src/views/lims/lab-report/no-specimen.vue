<template>
  <div>
    <el-form
      :model="queryForm"
      ref="queryForm"
      :inline="true"
      label-width="100px"
      class="margin20 mb0"
    >
      <el-form-item label="取样日期" prop="sampleDate">
        <el-date-picker
          v-model="queryForm.sampleDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="样品名称" prop="speciName">
        <el-input v-model="queryForm.speciName" :maxlength="12" plain="true" placeholder="样品名称" />
      </el-form-item>
      <el-form-item label="取样车间" prop="workshop">
        <el-input v-model="queryForm.workshop" :maxlength="12" plain="true" placeholder="取样车间" />
      </el-form-item>
      <el-form-item label="取样地点" prop="sampPlace">
        <el-input v-model="queryForm.sampPlace" :maxlength="12" plain="true" placeholder="取样地点" />
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
        <el-table-column prop="speciName" align="center" label="样品名称" min-width="150px"></el-table-column>
        <el-table-column prop="speciCode" align="center" label="样品编号" min-width="180px"></el-table-column>
        <el-table-column prop="scheduleCode" align="center" label="任务单号" min-width="150px"></el-table-column>
        <el-table-column align="center" label="任务类型" min-width="80px">
          <template v-slot="scope">
            <span v-if="scope.row.speciType === '定点样'">定点</span>
            <span
              v-else-if="scope.row.speciType === '随机样' && !!scope.row.ifIncoming && scope.row.ifIncoming === 1"
            >来料</span>
            <span v-else>临时</span>
          </template>
        </el-table-column>
        <el-table-column prop="workshop" align="center" label="取样车间" min-width="180px"></el-table-column>
        <el-table-column prop="sampPlace" align="center" label="取样地点" min-width="180px"></el-table-column>
        <el-table-column prop="actualTime" align="center" label="实际取样时间" min-width="180px"></el-table-column>
        <el-table-column prop="recieveTime" align="center" label="收样时间" min-width="180px"></el-table-column>
        <el-table-column prop="num" align="center" label="不合格化验项量" width="150px"></el-table-column>
        <el-table-column align="center" label="不合格详情" min-width="180px" fixed="right">
          <template slot-scope="scope">
            <button
              type="button"
              class="el-button el-button--text el-button--small"
              @click="getDetail(scope.row)"
            >
              <i class="el-icon-info">不合格详情</i>
            </button>
          </template>
        </el-table-column>
      </el-table>
    <Pagination
      :total="total"
      :page.sync="page.pageNum"
      :limit.sync="page.pageSize"
      @pagination="getData"
    />
    </div>
    <el-dialog title="不合格详情" :visible.sync="itemDialogVisible" width="65%">
      <no-more @hidenDialog="hidenDialog" :rowId="rowId" />
    </el-dialog>
  </div>
</template>

<script>
import { getNoPassSpecimen } from "@/api/lims";
import { simpleDateFormat } from "@/utils/index";
import Pagination from "@/components/Pagination";
import noMore from "./no-more";

export default {
  name: "noSpecimen",
  components: {
    Pagination,
    noMore
  },
  data() {
    return {
      queryForm: {
        sampleDate: [],
        speciName: "",
        workshop: "",
        sampPlace: ""
      },
      page: {
        pageNum: 1,
        pageSize: 10
      },
      itemDialogVisible: false,
      total: 0,
      tableData: [],
      rowId: ""
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData(page) {
      let startTime =
        !!this.queryForm.sampleDate && this.queryForm.sampleDate.length === 2
          ? simpleDateFormat(this.queryForm.sampleDate[0], "yyyy-MM-dd")
          : "";
      let endTime =
        !!this.queryForm.sampleDate && this.queryForm.sampleDate.length === 2
          ? simpleDateFormat(this.queryForm.sampleDate[1], "yyyy-MM-dd")
          : "";
      let param = {
        startDate: startTime,
        endDate: endTime,
        speciName: this.queryForm.speciName,
        workshop: this.queryForm.workshop,
        sampPlace: this.queryForm.sampPlace
      };
      if (page === 1) this.page.pageNum = 1;
      getNoPassSpecimen(this.page, param)
        .then(response => {
          this.tableData = response.data.data.rows;
          this.total = response.data.data.total;
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    hidenDialog() {
      this.itemDialogVisible = false;
      this.getData();
    },
    getDetail(row) {
      let _this = this;
      _this.rowId = row.mainId;
      _this.itemDialogVisible = true;
    },
    clearSearchBox() {
      this.queryForm = {
        sampleDate: [],
        speciName: "",
        workshop: "",
        sampPlace: ""
      };
      this.getData(1);
    }
  }
};
</script>

<style scoped>
</style>
