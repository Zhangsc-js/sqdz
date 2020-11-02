<template>
  <div>
    <el-form
      ref="queryForm"
      :model="queryForm"
      :inline="true"
      label-width="100px"
      class="margin20 mb0"
    >
      <!-- <el-form-item label="化验物料">
        <el-input v-model="queryForm.proName" plain="true" placeholder="请输入化验物料" />
      </el-form-item>
      <el-form-item label="化验人员">
        <el-input v-model="queryForm.LaboratoryPersonnelName" plain="true" placeholder="请输入化验人员" />
      </el-form-item>-->
      <!-- TODO  权限完善后去掉 -->
      <!--<el-form-item label="审核人员">
        <el-select v-model="queryForm.assignee">
          <el-option
            v-for="item in assigneeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item label="接收时间" prop>
        <el-date-picker
          v-model="createTimeRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change=" val => { changeDate(val, 'create');}"
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
    <div class="tableshadow margin20" style="width:calc(100% - 40px);padding:0 0 20px 0;">
      <el-table :data="tableData" ref="refTable">
        <el-table-column prop="labSubList.scheduleCode" label="任务单号" width="180"></el-table-column>
        <el-table-column prop="labSubList.labProname" label="化验物料">
          <template v-slot="scope">
            {{ scope.row.labSubList.labProname }}
            <span
              v-if="scope.row.labSubList.planType == 3"
              class="reinspect-stamp"
            >复</span>
          </template>
        </el-table-column>
        <el-table-column prop="labSubList.workShop" label="车间"></el-table-column>
        <el-table-column prop="labSubList.sampPlace" label="取样地点"></el-table-column>
        <el-table-column prop="labSubList.receivePlace" label="收样地点"></el-table-column>
        <el-table-column prop="activiti.activitiName" label="签核环节"></el-table-column>
        <el-table-column prop="activiti.createTime" width="180" label="签核发起时间"></el-table-column>
        <el-table-column prop="remark" label="上一级签核备注" show-overflow-tooltip width="180" align="center"></el-table-column>
        <el-table-column
          label="操作"
          width="140"
          fixed="right"
          align="center"
          v-if="hasBtn(['LIMS-LAB-REVIEW-AGREE','LIMS-LAB-REVIEW-REFUSE' ])"
        >
          <template v-slot="scope">
            <el-button type="text" size="small" @click="popDetail(scope.row)">化验详情</el-button>
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
    <el-dialog title="化验详情" :visible.sync="dialogVisible" width="80%" v-if="dialogVisible">
    <review-detail :selItem="selItem" @close="hiddenDialog" @getData="getData" :detailType="'review'"/>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import { dataReviewAct, remarkList } from "@/api/lims";
import { getActDataList } from "@/api/sys/activiti";
import { simpleDateFormat, getDate } from "@/utils/index";
import ReviewDetail from "./review-detail";
import { hasBtn } from "@/utils/index";
const startTime = simpleDateFormat(getDate(-7), "yyyy-MM-dd") + " 00:00:00",
  endTime = simpleDateFormat(getDate(), "yyyy-MM-dd") + " 23:59:59";
export default {
  name: "dataReview",
  components: {
    Pagination,
    ReviewDetail
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
        assignee: this.$store.getters.workCode,
        createStart: startTime,
        createEnd: endTime,
        paramMap: {
          化验审核数据: "labSubList",
          化验审核上级意见备注: "remark"
        }
      },
      getRowKeys(row) {
        return row.activiti.activitiId;
      },
      expands: [],
      refuseId: [],
      assigneeList: [
        { id: 2011, name: "化验主任" },
        { id: 2010, name: "化验技术员" },
        { id: 1001, name: "化验班长" }
      ],

      selIndic: null,
      selItem: null,
      dialogVisible: false,
      createTimeRange: [],
      remark: "",
      remarkList: [],
      selItem: {
        activitiId: "",
        scheduleId: "",
        planType:"",
        reviewType:""
      }
    };
  },
  activated() {
    this.getData();
  },
  methods: {
    hasBtn,
    getData(page) {
      if (page === 1) this.page.pageNum = 1;
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
        assignee: this.$store.getters.workCode,
        paramMap: {
          化验审核数据: "labSubList",
          化验审核上级意见备注: "remark"
        },
        createStart: startTime,
        createEnd: endTime,
        reviewParams: {}
      };
      this.createTimeRange = [];
      this.getData(1);
    },

    dateFormat(row, column, cellValue, index) {
      let res = "/";
      if (!!cellValue) {
        res = simpleDateFormat(new Date(cellValue), "yyyy-MM-dd HH:mm:ss");
      }
      return res;
    },
    expandChange(row, expandedRows) {
      if (this.expands.indexOf(row.activiti.activitiId) >= 0) {
        //收起当前行
        this.expands.shift();
        return;
      } else {
        this.refuseId = [];
      }
      this.expands.shift();
      this.expands.push(row.activiti.activitiId);
      if (expandedRows.length > 1) {
        expandedRows.shift();
      }
    },

    changeDate(val, type) {
      this.queryForm[type + "Start"] = val[0] + " 00:00:00";
      this.queryForm[type + "End"] = val[1] + " 23:59:59";
    },
    getRemarkList() {
      remarkList({ type: "SHJJ" }).then(res => {
        if (res.data.success) {
          this.remarkList = res.data.data;
        }
      });
    },
    popDetail(item) {
      this.selItem = {
          scheduleId:item.labSubList.scheduleId,
          planType:item.labSubList.planType,
          activitiProcessInstanceId:item.activiti.activitiProcessInstanceId,
          activitiId:item.activiti.activitiId,
          reviewType:item.labSubList.reviewType
      }
      this.dialogVisible = true;
    },
    hiddenDialog(){
        this.dialogVisible = false;
    }
  }
};
</script>
