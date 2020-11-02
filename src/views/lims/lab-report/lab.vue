<template>
  <div>
    <el-form :model="exportForm" ref="exportForm" :inline="true" label-width="100px" class="margin20 mb0">
        <el-form-item label="化验日期" prop="labDate">
            <el-date-picker
                v-model="exportForm.labDate"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
        </el-form-item>
        <br/>
      <el-form-item label="车间" prop="workshop">
        <el-select v-model="exportForm.workshop"
                   placeholder="请选择" clearable>
          <el-option
            v-for="item in selectWorkshop"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="化验物料" prop="program">
        <el-select v-model="exportForm.program"
                   placeholder="请选择" clearable>
          <el-option
            v-for="item in selectProgram"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          icon="el-icon-search"
          href="javascript:void(0)"
          type="primary"
          class="btn-b"
          @click="getData(1)"
        >查询
        </el-button>
        <el-button href="javascript:void(0)" class="btn-w" @click="clearSearchBox">清空</el-button>
        <el-button :loading="downloadLoading" type="primary" @click="exportItem()">
          <i class="el-icon-download"></i> 导出
        </el-button>
      </el-form-item>
    </el-form>
    <div class="tableshadow margin20" style="width:calc(100% - 40px);">

    <el-table :data="tableData" ref="refTable">
      <el-table-column prop="planCode" align="center" label="计划单号" width="180px"></el-table-column>
      <el-table-column prop="scheduleCode" align="center" label="任务单号" width="180px"></el-table-column>
      <el-table-column prop="programName" align="center" label="化验物料"></el-table-column>
      <el-table-column prop="receivePlace" align="center" label="收样地点" width="150px"></el-table-column>
      <el-table-column prop="sampTime" align="center" width="180px" label="取样时间"></el-table-column>
      <el-table-column prop="actualSampTime" align="center" width="180px" label="实际取样时间"></el-table-column>
      <el-table-column prop="workShop" align="center" label="取样车间" width="150px"></el-table-column>
      <el-table-column prop="sampPlace" align="center" label="取样地点" width="150px"></el-table-column>
      <el-table-column prop="labIndicator" align="center" label="分析项目" min-width="180px">
          <template v-slot="scope">
              {{ scope.row.labIndicator }}
              <span
                  v-if="scope.row.isReexamination === '1'"
                  class="reinspect-stamp"
              >复</span
              >
          </template>
      </el-table-column>
      <el-table-column prop="labTime" align="center" width="180"  label="化验时间"></el-table-column>
      <el-table-column align="center" label="化验结果">
        <template slot-scope="scope">
          <span v-if="scope.row.reachStandard<=2" style="color:red">{{ scope.row.labResult }}</span>
          <span v-else style="color: #37B328">{{ scope.row.labResult }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="labOperator" align="center" label="化验人员" width="150px"></el-table-column>
      <el-table-column prop="type" align="center" label="化验状态" width="150px"></el-table-column>
    </el-table>
    <Pagination
      :total="total"
      :page.sync="page.pageNum"
      :limit.sync="page.pageSize"
      @pagination="getData"
    />
    </div>
  </div>
</template>

<script>

  import {getReportWorkshopAll, getReportProgramAll, getReportExportAll} from "@/api/lims";
  import {simpleDateFormat} from "@/utils/index";
  import Pagination from "@/components/Pagination";

  export default {
    name: 'lab',
    components: {
      Pagination
    },
    data() {
      return {
        exportForm: {
          workshop: '',
          program: '',
          labDate: []
        },
        page: {
          pageNum: 1,
          pageSize: 10
        },
        total: 0,
        downloadLoading: false,
        exportData: [],
        selectWorkshop: [],
        tableData: [],
        selectProgram: []
      }
    },
    mounted() {
      this.getWorkshops();
      this.getPrograms();
      this.getData();
    },
    methods: {
      getData(page) {
        let startTime = !!this.exportForm.labDate && this.exportForm.labDate.length === 2 ? simpleDateFormat(this.exportForm.labDate[0], "yyyy-MM-dd") : "";
        let endTime = !!this.exportForm.labDate && this.exportForm.labDate.length === 2 ? simpleDateFormat(this.exportForm.labDate[1], "yyyy-MM-dd") : "";
        const params = {
          labProgram: this.exportForm.program,
          workshop: this.exportForm.workshop,
          labDateStart: startTime,
          labDateEnd: endTime
        };
        if(page === 1)this.page.pageNum = 1;
        getReportExportAll(this.page, params).then(res => {
          this.tableData = res.data.data.rows;
          this.total = res.data.data.total;
        }).catch(e => {
          this.$message.error(e.message);
        });
      },
      getWorkshops() {
        getReportWorkshopAll().then(res => {
          if (res.data.success) {
            this.selectWorkshop = res.data.data;
          }
        }).catch(e => {
          this.$message.error(e.message);
        });
      },
      getPrograms() {
        getReportProgramAll().then(res => {
          if (res.data.success) {
            this.selectProgram = res.data.data;
          }
        }).catch(e => {
          this.$message.error(e.message);
        });
      },
      exportItem() {
        let startTime = !!this.exportForm.labDate && this.exportForm.labDate.length === 2 ? simpleDateFormat(this.exportForm.labDate[0], "yyyy-MM-dd") : "";
        let endTime = !!this.exportForm.labDate && this.exportForm.labDate.length === 2 ? simpleDateFormat(this.exportForm.labDate[1], "yyyy-MM-dd") : "";
        const param = {
          workshop: this.exportForm.workshop,
          labProgram: this.exportForm.program,
          labDateStart: startTime,
          labDateEnd: endTime,
        };
        const pageItem = {
          pageNum: 0,
          pageSize: 0
        };
        getReportExportAll(pageItem, param).then(res => {
          this.exportData = res.data.data.rows;
          this.downloadLoading = true;
          import('@/api/Export2Excel').then(excel => {
            let tHeader = ['取样时间', '实际取样时间', '取样地点', '分析项目', '化验时间', '化验结果', '化验人员', '化验状态'];
            let filterVal = ['sampTime', 'actualSampTime', 'sampPlace', 'labIndicator',
              'labTime', 'labResult', 'labOperator', 'type'];
            if (this.exportForm.workshop.trim() === '') {
              tHeader.unshift('取样车间');
              filterVal.unshift('workShop');
            }
            if (this.exportForm.program.trim() === '') {
              tHeader.unshift('化验物料');
              filterVal.unshift('programName');
            }
            tHeader.unshift('任务单号');
            filterVal.unshift('scheduleCode');
            tHeader.unshift('计划单号');
            filterVal.unshift('planCode');
            const selExport = this.exportData;
            const data = this.formatJson(filterVal, selExport);
            const name = this.exportForm.workshop + this.exportForm.program + startTime + '---' + endTime + '化验报表';
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: name
            });
            this.downloadLoading = false
          })
        }).catch(e => {
          this.$message.error(e.message);
        });
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },
      clearSearchBox() {
        this.exportForm = {
          workshop: '',
          program: '',
          labDate: []
        };
        this.getData(1)
      }
    }
  }
</script>

<style scoped>

</style>
