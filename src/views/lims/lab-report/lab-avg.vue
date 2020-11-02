<template>
  <div>
    <el-form :model="queryForm" ref="queryForm" :inline="true"  label-width="100px" class="margin20 mb0">
      <el-form-item label="化验日期" prop="labDate">
        <el-date-picker
          v-model="queryForm.labDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
        <el-form-item label="化验物料" prop="labProgram">
            <el-input
                v-model="queryForm.labProgram"
                :maxlength="12"
                plain="true"
                placeholder="化验物料"
            />
        </el-form-item>
        <el-form-item label="分析项目" prop="indicatorName">
            <el-input
                v-model="queryForm.indicatorName"
                :maxlength="12"
                plain="true"
                placeholder="分析项目"
            />
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
      </el-form-item>
    </el-form>
    <div class="tableshadow margin20" style="width:calc(100% - 40px);">

    <el-table :data="tableData" ref="refTable" :cell-class-name="setColor">
      <el-table-column prop="labProgram" align="center" label="化验物料" min-width="150px"></el-table-column>
      <el-table-column prop="indicator" align="center" label="分析项目" min-width="220px"></el-table-column>
      <el-table-column prop="avg" align="center" label="化验结果平均值" min-width="150px"></el-table-column>
      <el-table-column align="center" label="标准范围" min-width="200px">
          <template v-slot="scope">
              <span v-if="scope.row.standardType === 1">
                    value>={{scope.row.standardRegion.split('<=')[1]}}
                </span>
                <span v-else-if="scope.row.standardType === 2">
                    value<={{scope.row.standardRegion.split('<=')[3]}}
                </span>
              <span v-else-if="scope.row.standardType === 3">
                    {{scope.row.standardRegion.split('<=')[1]}}<=value<={{scope.row.standardRegion.split('<=')[3]}}
                </span>
                <span v-else>{{scope.row.standardRegion}}</span>
          </template>
      </el-table-column>
      <el-table-column prop="resultCount" align="center" label="化验总量" min-width="100px"></el-table-column>
      <el-table-column align="center" label="化验结果详情" width="120" fixed="right">
        <template slot-scope="scope">
          <button type="button" class="el-button el-button--text el-button--small" @click="getResultDetail(scope.row)">
            <i class="el-icon-info">化验结果详情</i>
          </button>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <Pagination
      :total="total"
      :page.sync="page.pageNum"
      :limit.sync="page.pageSize"
      @pagination="getData"
    />
    <el-dialog title="化验结果详情" :visible.sync="itemDialogVisible" width="60%">
      <avg-more @hidenDialog="hidenDialog" :rowObject="rowObject"/>
    </el-dialog>
  </div>

</template>

<script>

  import {getLabAvg} from "@/api/lims";
  import {simpleDateFormat} from "@/utils/index";
  import Pagination from "@/components/Pagination";
  import AvgMore from './avg-more'

  export default {
    name: 'labAvg',
    components: {
      Pagination,
      AvgMore
    },
    data() {
      return {
        queryForm: {
          labDate: [],
          labProgram: "",
          indicatorName: ""
        },
        page: {
          pageNum: 1,
          pageSize: 10
        },
        total: 0,
        tableData: [],
        itemDialogVisible:false,
        rowObject:{}
      }
    },
    mounted() {
      this.getData();
    },
    methods: {
      getData(page) {
        let startTime = !!this.queryForm.labDate && this.queryForm.labDate.length === 2 ? simpleDateFormat(this.queryForm.labDate[0], "yyyy-MM-dd") : "";
        let endTime = !!this.queryForm.labDate && this.queryForm.labDate.length === 2 ? simpleDateFormat(this.queryForm.labDate[1], "yyyy-MM-dd") : "";
        const params = {
          labDateStart: startTime,
          labDateEnd: endTime,
          labProgram: this.queryForm.labProgram,
          indicatorName: this.queryForm.indicatorName,
          type: "随机"
        };
        if(page === 1) this.page.pageNum = 1;
        getLabAvg(this.page,params).then(res => {
          this.tableData = res.data.data.rows;
          this.total = res.data.data.total;
        }).catch(e => {
          this.$message.error(e.message);
        });
      },
      hidenDialog() {
        this.itemDialogVisible = false;
        this.getData(1)
      },
      getResultDetail(row){
        let _this = this;
        let startTime = !!this.queryForm.labDate && this.queryForm.labDate.length === 2 ? simpleDateFormat(this.queryForm.labDate[0], "yyyy-MM-dd") : "";
        let endTime = !!this.queryForm.labDate && this.queryForm.labDate.length === 2 ? simpleDateFormat(this.queryForm.labDate[1], "yyyy-MM-dd") : "";
        _this.rowObject = {
          labDateStart:startTime,
          labDateEnd:endTime,
          labProgram:row.labProgram,
          labIndicator:row.indicatorId,
          type:"随机"
        };
        _this.itemDialogVisible = true;
      },
      clearSearchBox() {
        this.queryForm = {
          labDate: [],
          labProgram: "",
          indicatorName: ""
        };
        this.getData(1);
      },
        setStandard(row){
          let standardArr = row.standardRegion.split('<=');
          let value = row.avg;
          switch (row.standardType) {
              case 1:
                  if(Number(value) >= Number(standardArr[1])) return 4;
                  else return 1;
              case 2:
                  if(Number(value) <= Number(standardArr[3])) return 4;
                  else return 1;
              case 3:
                  if(Number(value) >= Number(standardArr[1]) && Number(value) <= Number(standardArr[3])) return 4;
                  else return 1;
              case 4:
                  if(Number(value) <= Number(standardArr[1]) || Number(value) >= Number(standardArr[4])) return 1;
                  else if(Number(value) <= Number(standardArr[0]) || Number(value) >= Number(standardArr[3]))
                      return 2;
                  else return 4;
              default: return 0;
          }
        },
        setColor({ row, column, rowIndex, columnIndex }) {
            let className = "";
            const color = ["", "c-danger", "c-warning", "c-primary", "c-success"];
            if (column.property == "avg") {
                className = color[this.setStandard(row)];
            }
            return className;
        },
    }
  }
</script>

<style scoped>

</style>
