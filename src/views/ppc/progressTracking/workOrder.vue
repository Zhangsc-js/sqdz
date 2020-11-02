<template>
  <div style="height: 100%" class="woFollow">
    <el-form inline :model="queryForm" ref="queryForm" class="demo-form-inline">
      <el-row>
        <el-form-item label="派工单号" prop="woNo">
          <el-input clearable v-model="queryForm.woNo" placeholder="请输入派工单号"></el-input>
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

        <el-form-item label="~" prop="planEnd" >
          <el-date-picker
            v-model="queryForm.planEnd"
            type="date"
            style="width: 100%"
            value-format="yyyy-MM-dd"
            clearable
          ></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary " icon="el-icon-search" @click="getData(1)">查询</el-button>
          <el-button
            href="javascript:void(0)"
            icon="el-icon-refresh-left"
            class="btn-w"
            @click="clearSearchBox"
            type="primary"
          >重置</el-button>
          <el-button type="text" @click="showMore=!showMore">
            {{ showMore ? '收起' : '展开' }}
            <i v-if="showMore" class="el-icon-arrow-up" />
            <i v-else class="el-icon-arrow-down" />
          </el-button>
        </el-form-item>
      </el-row>
      <el-row>
        <span v-show="showMore">
          <el-form-item label="计划单号" prop="ppNo">
            <el-input clearable v-model="queryForm.ppNo" placeholder="请输入计划单号"></el-input>
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryForm.status"
              clearable
              style="width:100%"
              filterable
              placeholder="请选择"
              @change="getData(1)"
            >
              <el-option
                v-for="item in WO_STATUS"
                :key="item.code"
                :label="item.label"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="工单类型" prop="workType">
            <el-select clearable v-model="queryForm.workType" @change="getData(1)" style="width:100%" placeholder="请选择">
              <el-option
                v-for="item in WO_TYPE"
                :key="item.code"
                :label="item.label"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="物料编码" prop="materialCode">
            <el-input clearable v-model="queryForm.materialCode" placeholder="请输入物料编码"></el-input>
          </el-form-item>
        </span>
      </el-row>
    </el-form>
    <el-table
      highlight-current-row
      :data="tableDate"
      height="50%"
      @row-click="planinfo"
      border
      style="width: 100%;"
    >
      <el-table-column prop="woNo" label="派工单号" width="130px;"></el-table-column>
      <el-table-column prop="workshopName" label="所属车间" width="120px;"></el-table-column>
      <el-table-column prop="materialCode" label="物料编号" width="160px;"></el-table-column>
      <el-table-column prop="materialName" label="物料名称" width="180px;"></el-table-column>
      <el-table-column prop="status" label="工单状态" width="90px;">
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
      <el-table-column prop="produceQty" label="计划数量" width="80px;"></el-table-column>
      <el-table-column prop="finishQty" label="已完成数量" width="90px;"></el-table-column>
      <el-table-column prop="unitCode" label="单位" width="60px;"></el-table-column>
      <el-table-column prop="planStartDate" :formatter="formatter" label="计划开工日期" width="120px;"></el-table-column>
      <el-table-column prop="actualStartDate" :formatter="formatter" label="实际开工日期" width="120px;"></el-table-column>
      <el-table-column prop="startDate" label="开工拖期" width="60px;">
        <template v-slot="scope">
          <span v-if="scope.row.startDate >0">
            <b style="color: red">{{scope.row.startDate}}</b>
          </span>
          <span v-else>{{scope.row.startDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="planEndDate" :formatter="formatter" label="计划完工日期" width="120px;"></el-table-column>
      <el-table-column prop="actualEndDate" :formatter="formatter" label="实际完工日期" width="120px;"></el-table-column>
      <el-table-column prop="endDate" label="完工拖期" width="60px;">
        <template v-slot="scope">
          <span v-if="scope.row.endDate >0">
            <b style="color: red">{{scope.row.endDate}}</b>
          </span>
          <span v-else>{{scope.row.endDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ppNo" label="计划单号" width="130px;">
        <template v-slot="scope">
          <a style="color:blue" @click="cellClickPP(scope.row)">{{scope.row.ppNo}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="workType" label="工单类型" width="90px;">
        <template v-slot="scope">
          <span v-if="scope.row.workType == 0">
            <div class="reworkDiv"></div>
            {{scope.row.workTypeName}}
          </span>
          <span v-else>
            <div class="reworkDiv" :style="{backgroundImage: 'url(' + reworkPng + ')' }"></div>
            {{scope.row.workTypeName}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="teamName" label="班组" width="90px;"></el-table-column>
    </el-table>
    <Pagination
      :total="total"
      :page.sync="page.current"
      :limit.sync="page.size"
      @pagination="getData"
    />
    <el-divider content-position="left">报工情况</el-divider>
    <el-table
      highlight-current-row
      :data="InfotableDate"
      border
      style="width: 100%;"
      height="calc(100% - 52px - 50% - 50px - 49px)"
    >
      <el-table-column prop="wfNo" label="报工单号"></el-table-column>
      <el-table-column prop="finishedDate" label="报工日期"></el-table-column>
      <el-table-column prop="goodQty" label="合格数量"></el-table-column>
      <el-table-column prop="badQty" label="废品数量"></el-table-column>
      <el-table-column prop="reworkQty" label="返修数量"></el-table-column>
      <el-table-column prop="workerName" label="报工人"></el-table-column>
      <el-table-column prop="inspecterName" label="审核人"></el-table-column>
    </el-table>
  </div>
</template>


<script>
import { simpleDateFormat, getDate } from "@/utils";
import { initData } from "@/api/ppc/workshopDispatch";
import Pagination from "@/components/Pagination";
import {
  getorderProgress,
  queryFinishByWorkOrderId
} from "@/api/productionPlanning";
import JtBadge from "@/components/JtBadge";
import reworkPng from "@/assets/images/rework.png";

export default {
  name: "producePlan",
  components: {
    Pagination,
    JtBadge
  },
  data() {
    return {
      page: {
        current: 1,
        size: 10
      },
      total: 0,
      tableDate: [],
      InfotableDate: [],
      typeMap: [
        {
          value: "0",
          label: "正常"
        },
        {
          value: "1",
          label: "返工"
        }
      ],
      showMore: false,
      disabled: false,
      WO_STATUS: [],
      WO_TYPE: [],
      queryForm: {
        woNo: "",
        ppNo: "",
        planStart:"",
        planEnd: "",
        status: "",
        workType: "",
        materialCode: ""
      },
      reworkPng: reworkPng
    };
  },
  methods: {
    clearSearchBox() {
      this.queryForm = {
        woNo: "",
        ppNo: "",
        planStart: getDate(-15),
        planEnd: getDate(15),
        status: "",
        workType: "",
        materialCode: ""
      };
    },
    initData() {
      initData().then(response => {
        let data = response.data;
        if (data.success) {
          this.WO_STATUS = data.data.WO_STATUS;
          this.WO_TYPE = response.data.data.WO_TYPE;
          this.getData();
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
    },
    planinfo(row) {
      queryFinishByWorkOrderId(row.id).then(response => {
        let data = response.data;
        if (data.success) {
          this.InfotableDate = data.data;
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
      getorderProgress(params)
        .then(response => {
          let data = response.data.data;
          for (let i = 0; i < data.result.length; i++) {
            for (let j = 0; j < this.WO_STATUS.length; j++) {
              if (data.result[i].status == this.WO_STATUS[j].code) {
                data.result[i].statusName = this.WO_STATUS[j].label;
              }
            }
            for (let j = 0; j < this.WO_TYPE.length; j++) {
              if (data.result[i].workType == this.WO_TYPE[j].code) {
                data.result[i].workTypeName = this.WO_TYPE[j].label;
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
    formatter(row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === null) {
        return "";
      }
      return simpleDateFormat(new Date(cellValue), "yyyy-MM-dd");
    },
    cellClickPP(data) {
      this.$router.push({
        name: "progressTracking-producePlan",
        params: { ppNo: data.ppNo }
      });
    }
  },
  activated() {
    if (this.$route.params.ppNo) {
      this.queryForm.ppNo = this.$route.params.ppNo;
        this.queryForm.planStart = ""
        this.queryForm.planEnd = ""
    } else {
        this.queryForm.planStart = getDate(-15)
        this.queryForm.planEnd = getDate(15)
    }
    this.getData();
  },
  mounted() {
    this.initData();
  }
};
</script>
<style scoped>
.woFollow .el-tabs__content {
  height: calc(100% - 38px);
}

.woFollow .el-tabs--border-card > .el-tabs__content {
  padding: 0;
}

.woFollow div.el-table {
  margin-top: 0;
}
.reworkDiv {
  width: 20px;
  height: 20px;
  display: inline-block;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  vertical-align: bottom;
}
</style>
