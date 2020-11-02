<template>
  <div class="lab-recheck">
    <el-form ref="queryForm" :model="queryForm" :inline="true" style="margin-left:20px">
      <!-- <el-form-item label="化验项目">
        <el-input v-model="queryForm.proName" plain="true" placeholder="请输入化验项目" />
      </el-form-item>
      <el-form-item label="化验人员">
        <el-input v-model="queryForm.LaboratoryPersonnelName" plain="true" placeholder="请输入化验人员" />
      </el-form-item>-->
      <!-- TODO  权限完善后去掉 -->
      <el-form-item label="审核人员">
        <el-select v-model="queryForm.assignee">
          <el-option
            v-for="item in assigneeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申请时间" prop>
        <el-date-picker
          v-model="createTimeRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="((val)=>{changeDate(val, 'create')})"
        ></el-date-picker>
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
    <div class="tableshadow margin20" style="width:calc(100% - 40px);padding:20px 0;">
      <el-table
        :data="tableData"
        ref="refTable"
        @expand-change="expandChange"
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        @row-click="expandChange"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-table :data="scope.row.reExaminationCheckList.labSub" :cell-class-name="setColor">
              <el-table-column prop="labIndicName" label="指标名"></el-table-column>
              <el-table-column prop="updatelabName" label="复验实验室"></el-table-column>
              <el-table-column prop="labOperatorName" label="化验人员"></el-table-column>
              <el-table-column prop="outindicData" label="计算结果"></el-table-column>
              <el-table-column prop="reachStandard" :formatter="statusFormat" label="达标情况"></el-table-column>
              <el-table-column prop="remark" label="备注"></el-table-column>
              <el-table-column label="操作" width="100" fixed="right" align="center" v-if="hasBtn(['LIMS-RECHECK-FAIL-HISTORY'])">
                <template v-slot="scope">
                  <el-button
                    type="text"
                    size="small"
                    @click="popRecheckHis(scope.row)"
                    v-if="!!scope.row.anewCheckLog"
                    v-has="'LIMS-RECHECK-FAIL-HISTORY'"
                  >退审记录</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="reExaminationCheckList.schedule.scheduleId" label="任务ID"></el-table-column>
        <el-table-column prop="reExaminationCheckList.schedule.labProname" label="化验物料"></el-table-column>
        <el-table-column prop="activiti.activitiName" label="签核角色"></el-table-column>
        <el-table-column prop="reExaminationCheckList.schedule.receivePlace" label="原收样地点"></el-table-column>
        <el-table-column prop="activiti.createTime" label="签核发起时间"></el-table-column>
        <el-table-column label="操作" width="140" fixed="right" align="center" v-if="hasBtn(['LIMS-LAB-RECHECK-AGREE','LIMS-LAB-RECHECK-REFUSE'])">
          <template v-slot="scope">
            <el-button type="text" size="small" @click="check(scope.row, 1)" v-has="'LIMS-LAB-RECHECK-AGREE'">通过</el-button>
            <el-button type="text" size="small" @click="check(scope.row, 2)" v-has="'LIMS-LAB-RECHECK-REFUSE'">拒绝</el-button>
          </template>
        </el-table-column>
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
    <el-dialog title="退审记录" :visible.sync="recDialogVisible" width="80%" v-if="recDialogVisible">
      <refuse-history @hidenDialog="hidenDialogRec" :selItem="selItem"></refuse-history>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { getRecheckList, dataRecheckAct } from "@/api/lims";
import { getActDataList } from "@/api/sys/activiti";
import { simpleDateFormat } from "@/utils/index";
import refuseHistory from "@/views/lims/lab-analysis/data-review/refuse-history";
import { hasBtn } from "@/utils/index";
export default {
  name: "lab-recheck",
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
      loading: false,
      tableData: [],
      queryForm: {
        LaboratoryPersonnelName: "",
        proName: "",
        assignee: "",
        paramMap: {
          复验申请数据: "reExaminationCheckList",
          复验审核上级意见备注: "remark"
        },
        createStart: "",
        createEnd: ""
      },
      getRowKeys(row) {
        return row.activiti.activitiId;
      },
      expands: [],
      refuseId: [],
      assigneeList: [
        { id: 8006, name: "复审班长" },
        { id: 8035, name: "复验主任" },
        { id: 2016, name: "复验技术员" }
      ],
      setColor({ row, column, rowIndex, columnIndex }) {
        let className = "";
        const color = ["", "c-danger", "c-warning", "c-primary", "c-success"];
        if (column.property == "reachStandard") {
          className = color[row.reachStandard];
        }
        return className;
      },
      createTimeRange: [],
      selItem: null,
      recDialogVisible: false
    };
  },
  mounted() {
    this.getData();
  },
  activated() {
    this.getData();
  },
  methods: {
    hasBtn,
    getData(page) {
      if(page === 1)this.page.pageNum = 1;
      let params = {
        ...this.page,
        ...this.queryForm
      };
      if (!params.assignee) params.assignee = this.$store.getters.workCode;
      let labPerName = params.LaboratoryPersonnelName;
      let proName = params.proName;
      !!proName && (params.proName = "%" + proName + "%");
      !!labPerName && (params.LaboratoryPersonnelName = "%" + labPerName + "%");
      getActDataList(params)
        .then(res => {
          this.tableData = res.data.data;
          this.total = res.data.count;
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    clearSearchBox() {
      this.queryForm = {
        LaboratoryPersonnelName: "",
        proName: "",
        assignee: "",
        paramMap: {
          复验申请数据: "reExaminationCheckList",
          复验审核上级意见备注: "remark"
        },
        createStart: "",
        createEnd: ""
      };
      this.getData(1);
    },
    check(item, type) {
      const tips = ["", "审核通过", "审核拒绝"];
      this.$confirm("确认" + tips[type], "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            result: tips[type],
            activitiId: item.activiti.activitiId,
            activitiProcessInstanceId: item.activiti.activitiProcessInstanceId,
            reviewOperatorName: this.$store.getters.userName
          };
          dataRecheckAct(params).then(res => {
            if (res.data.code != 10000) {
              this.$message.error(res.data.message);
            } else {
              this.$message.success(res.data.message);
              this.getData();
              this.refuseId = [];
            }
          });
        })
        .catch(res => {
          this.$message.info("已取消");
        });
    },
    statusFormat(row, column) {
      let standards = ["", "不合格", "不合格", "合格", "合格"];
      return standards[row.reachStandard];
    },
    dateFormat(row, column, cellValue, index) {
      let res = "/";
      if (cellValue) {
        res = simpleDateFormat(new Date(cellValue), "yyyy-MM-dd HH:mm:ss");
      }
      return res;
    },
    expandChange(row, expandedRows) {
      if (
        this.expands.indexOf(row.reExaminationCheckList.schedule.scheduleId) >=
        0
      ) {
        // //收起当前行
        // this.expands.shift();
        // return;
      } else {
        this.refuseId = [];
      }
      this.expands.shift();
      this.expands.push(row.reExaminationCheckList.schedule.scheduleId);
      if (expandedRows.length > 1) {
        expandedRows.shift();
      }
    },
    changeDate(val, type) {
      this.queryForm[type + "Start"] = val[0];
      this.queryForm[type + "End"] = val[1];
    },
    popRecheckHis(item) {
      this.selItem = item;
      this.recDialogVisible = true;
    },
    hidenDialogRec() {
      this.selItem = null;
      this.recDialogVisible = false;
    }
  }
};
</script>
<style lang="scss">
.lab-recheck .el-range-editor.el-input__inner {
  padding: 0;
}
</style>
