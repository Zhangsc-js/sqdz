<template>
  <div style="height: 100%" class="planFollow">
    <el-form inline :model="queryForm" ref="queryForm" class="demo-form-inline">
      <el-row>
        <el-form-item label="子销售单号" prop="saleDetailNo">
          <el-input v-model="queryForm.saleDetailNo" placeholder="请输入销售单号" clearable></el-input>
        </el-form-item>

        <el-form-item label="计划完工" prop="planStart">
          <el-date-picker
            type="date"
            v-model="queryForm.planStart"
            value-format="yyyy-MM-dd"
            style="width: 100%"
            clearable
          />
        </el-form-item>
        <el-form-item label="~" prop="planEnd">
          <el-date-picker
            v-model="queryForm.planEnd"
            type="date"
            style="width: 100%"
            value-format="yyyy-MM-dd"
            clearable
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="完工拖期" prop="endDelay">
          <el-input
            v-model="queryForm.endDelay"
            type="number"
            clearable
            min="0"
            placeholder="请输入拖期天数"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary " icon="el-icon-search" @click="getData(1)">查询</el-button>
          <el-button
            href="javascript:void(0)"
            class="btn-w"
            type="primary"
            icon="el-icon-refresh-left"
            @click="clearSearchBox"
          >重置</el-button>
          <el-button type="text" @click="showMore=!showMore">
            {{ showMore ? '收起' : '展开' }}
            <i v-if="showMore" class="el-icon-arrow-up" />
            <i v-else class="el-icon-arrow-down" />
          </el-button>
        </el-form-item>
      </el-row>
      <span v-show="showMore">
        <el-row>
          <el-form-item label="计划单号" prop="ppNo">
            <el-input clearable v-model="queryForm.ppNo" placeholder="请输入生产单号"></el-input>
          </el-form-item>
          <el-form-item label="物料编码" prop="materialCode">
            <el-input clearable v-model="queryForm.materialCode" placeholder="请输入物料编码"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select clearable v-model="queryForm.status" @change="getData(1)" filterable placeholder="请选择">
              <el-option
                v-for="item in PP_STATUS"
                :key="item.code"
                :label="item.label"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="业务员" prop="salesPersonName">
            <el-input clearable v-model="queryForm.salesPersonName" placeholder="请输入物理代码"></el-input>
          </el-form-item>
        </el-row>
      </span>
    </el-form>
    <el-table
      highlight-current-row
      :data="tableDate"
      height="50%"
      @row-click="rowClick"
      border
      style="width: 100%;"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      row-key="id"
      default-expand-all
    >
      <el-table-column prop="ppLevel" label="层级码" width="120px;" align="left"></el-table-column>
      <el-table-column prop="ppNo" label="计划单号" width="130px;"></el-table-column>
      <el-table-column prop="materialCode" label="物料编码" width="160px;"></el-table-column>
      <el-table-column prop="materialName" label="物料名称" width="160px;"></el-table-column>
      <el-table-column prop="progress" label="综合进度" width="120px;">
        <template v-slot="scope">
          <el-progress
            :show-text="false"
            status="success"
            :text-inside="true"
            :stroke-width="20"
            :percentage="scope.row.progress"
          ></el-progress>
        </template>
      </el-table-column>
      <el-table-column prop="produceQty" label="计划数量"></el-table-column>
      <el-table-column prop="finishQty" label="成品数量" width="120px;"></el-table-column>
      <el-table-column prop="badQty" label="废品数量" width="120px;"></el-table-column>
      <el-table-column prop="goodPercent" label="成品率" width="120px;">
        <template v-slot="scope">
          {{scope.row.goodPercent}}
          <span>%</span>
        </template>
      </el-table-column>
      <el-table-column prop="planEndDate" label="计划完工日期" :formatter="dateFormat" width="120px;"></el-table-column>
      <el-table-column prop="actualEndDate" label="实际完工日期" :formatter="dateFormat" width="120px;"></el-table-column>
      <el-table-column prop="endDelay" label="完工拖期">
        <template v-slot="scope">
          <span v-if="scope.row.endDelay>0">
            <b style="color: red">{{scope.row.endDelay}}</b>
          </span>
          <span v-else>{{scope.row.endDelay}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="planerName" label="计划员"></el-table-column>
      <el-table-column prop="status" label="状态" width="120px">
        <template v-slot="scope">
          <span v-if="scope.row.status == 10 || scope.row.status == 20">
            <jt-badge status="warning" :textValue="scope.row.statusName" />
          </span>
          <span v-else-if="scope.row.status == 40 || scope.row.status == 90 ">
            <jt-badge status="success" :textValue="scope.row.statusName" />
          </span>
          <span v-else>
            <jt-badge status="processing" :textValue="scope.row.statusName" />
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="planStartDate" label="计划开工日期" :formatter="dateFormat" width="120px;"></el-table-column>
      <el-table-column prop="actualStartDate" label="实际开工日期" :formatter="dateFormat" width="120px;"></el-table-column>
      <el-table-column prop="startDelay" label="开工拖期">
        <template v-slot="scope">
          <span v-if="scope.row.startDelay>0">
            <b style="color: red">{{scope.row.startDelay}}</b>
          </span>
          <span v-else>{{scope.row.startDelay}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="saleDetailNo" label="子销售单号" width="180px;"></el-table-column>
      <el-table-column prop="unitCode" label="单位"></el-table-column>
      <el-table-column
        fixed="right"
        align="center"
        label="操作"
        width="90px"
        v-if="hasBtn('PPC-PRPLAN-WKORDER')"
      >
        <template v-slot="work">
          <el-button
            style="margin: 0"
            type="text"
            size="small"
            @click="viewWorkOrder(work.row)"
          >派工情况</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :total="total"
      :page.sync="page.current"
      :limit.sync="page.size"
      :pageSizes="pageSizes"
      @pagination="getData"
    />
    <el-tabs
      v-model="activeName"
      @tab-click="tabClick"
      type="border-card"
      style="height: calc(100% - 52px - 50% - 50px)"
    >
      <el-tab-pane name="process" label="工序跟踪" lazy style="height: 100%">
        <el-table
          highlight-current-row
          :data="InfotableDate"
          border
          style="width: 100%;height: 100%"
        >
          <el-table-column prop="processNo" label="工序号"></el-table-column>
          <el-table-column prop="processCode" label="工序编码"></el-table-column>
          <el-table-column prop="processName" label="工序名称"></el-table-column>
          <el-table-column prop="planStartDate" :formatter="dateFormat" label="计划开工"></el-table-column>
          <el-table-column prop="planEndDate" :formatter="dateFormat" label="计划完工"></el-table-column>
          <el-table-column prop="actualStartDate" :formatter="dateFormat" label="最早开工"></el-table-column>
          <el-table-column prop="actualEndDate" :formatter="dateFormat" label="最晚报工"></el-table-column>
          <el-table-column prop="qty" label="合格数量"></el-table-column>
          <el-table-column prop="dispatchQty" label="已派工数量"></el-table-column>
          <el-table-column prop="uncompleteQty" label="待完工数量"></el-table-column>
          <el-table-column prop="reworkQty" label="待返修数量"></el-table-column>
          <el-table-column prop="badQty" label="废品数量"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane name="gantt" label="计划协同" lazy style="height: 100%">
        <producePlanGantt
          :ppId="rowPpId"
          :ppNo="rowPpNo"
          :trigger="trigger"
          style="width: 100%;height: 100%"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>


<script>
import { simpleDateFormat, getDate, hasBtn } from "@/utils";
import Pagination from "@/components/Pagination";
import producePlanGantt from "./producePlanGantt";
import {
  getPlanProgress,
  progressPlanInfo,
  initDataPlanOrder
} from "@/api/productionPlanning";
import JtBadge from "@/components/JtBadge";

export default {
  name: "producePlan",
  components: {
    Pagination,
    producePlanGantt,
    JtBadge
  },
  data() {
    return {
      page: {
        current: 1,
        size: 10
      },
      pageSizes: [10, 50, 100],
      total: 0,
      tableDate: [],
      InfotableDate: [],
      PP_STATUS: [],
      showMore: false,
      disabled: false,
      queryForm: {
        saleDetailNo: "",
        ppNo: "",
        endDelay: 0,
        planStart: getDate(-15),
        planEnd: getDate(15),
        status: "",
        salesPersonName: "",
        materialCode: ""
      },
      rowPpId: "",
      rowPpNo: "",
      activeName: "process",
      trigger: Math.random()
    };
  },
  methods: {
    hasBtn,
    clearSearchBox() {
      this.queryForm = {
        saleDetailNo: "",
        ppNo: "",
        endDelay: 0,
        planStart: getDate(-15),
        planEnd: getDate(15),
        status: "",
        salesPersonName: "",
        materialCode: ""
      };
    },
    tabClick() {
      this.rowClick();
    },
    rowClick(data) {
      if (data) {
        this.rowPpId = data.id;
        this.rowPpNo = data.ppNo;
      }
      if (this.activeName == "process") {
        if (!this.rowPpId) return false;
        progressPlanInfo(this.rowPpId).then(response => {
          let data = response.data;
          if (data.success) {
            this.InfotableDate = data.data;
          } else {
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
          }
        });
        document.getElementsByClassName("el-tabs__content")[0].style.height =
          "calc(100% - 38px)";
      } else {
        this.trigger = Math.random();
        document.getElementsByClassName("el-tabs__content")[0].style.height =
          "200%";
      }
    },
    initData() {
      initDataPlanOrder().then(response => {
        let data = response.data;
        if (data.success) {
          this.PP_STATUS = data.data.PP_STATUS;
          this.getData();
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
    },
    getData(current) {
      if (current === 1) {
        this.page.current = current;
      }
      const params = {
        ...this.page,
        ...this.queryForm
      };
      getPlanProgress(params)
        .then(response => {
          let data = response.data.data;
          for (let i = 0; i < data.result.length; i++) {
            for (let j = 0; j < this.PP_STATUS.length; j++) {
              if (data.result[i].status == this.PP_STATUS[j].code) {
                data.result[i].statusName = this.PP_STATUS[j].label;
              }
            }
          }
          this.tableDate = data.result;
          this.total = data.total;
        })
        .catch(e => {
          this.$message({
            type: "error",
            message: e.message,
            duration: 3 * 1000
          });
        });
    },
    dateFormat(row, column) {
      if (row[column.property]) {
        return row[column.property].substr(0, 10);
      }
    },
    formatter(row, column, cellValue, index) {
      if (cellValue === undefined) {
        return "";
      }
      return simpleDateFormat(new Date(cellValue), "yyyy-MM-dd");
    },
    viewWorkOrder(data) {
      this.$router.push({
        name: "progressTracking-workOrder",
        params: { ppNo: data.ppNo }
      });
    },
    callBack() {},
    cancel() {}
  },
  activated() {
    if (this.$route.params.ppNo) {
      this.queryForm.ppNo = this.$route.params.ppNo;
    }
    this.getData();
  },
  mounted() {
    this.initData();
  }
};
</script>
<style >
.planFollow .el-tabs__content {
  height: calc(100% - 38px);
}
.planFollow .el-tabs--border-card > .el-tabs__content {
  padding: 0;
}
.planFollow div.el-table {
  margin-top: 0;
}
</style>
