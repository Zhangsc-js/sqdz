<template>
  <div style="height: 100%" class="shopIPAD">
    <el-table
      highlight-current-row
      :data="tableData"
      @row-click="workOderInfo"
      height="45%"
      border
      stripe
    >
      <el-table-column align="center" prop="woNo" label="派工单号" width="120px"></el-table-column>
      <el-table-column align="center" prop="materialCode" label="物料编码"></el-table-column>
      <el-table-column align="center" prop="materialName" label="物料名称"></el-table-column>
      <el-table-column align="center" prop="specification" label="规格"></el-table-column>
      <el-table-column align="center" prop="produceQty" label="加工数量" width="80px"></el-table-column>
      <el-table-column align="center" prop="workType" label="工单类型" width="130px">
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
      <el-table-column align="center" prop="planStartDate" label="计划开始" width="120px"></el-table-column>
      <el-table-column align="center" prop="planEndDate" label="计划结束" width="120px"></el-table-column>
      <el-table-column align="center" prop="status" label="状态" width="80px">
        <template v-slot="scope">
          <span v-if="scope.row.status == 20">
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
      <el-table-column align="center" prop="unitCode" label="单位" width="60px"></el-table-column>
      <el-table-column align="center" prop="processName" label="工序"></el-table-column>
      <el-table-column align="center" prop="devName" label="加工设备"></el-table-column>
    </el-table>
    <Pagination
      :total="total"
      :page.sync="page.current"
      :limit.sync="page.size"
      @pagination="getData"
      :pageSizes="pageSizes"
    />
<!--    <el-button-->
<!--      type="primary"-->
<!--      icon="el-icon-check"-->
<!--      :disabled="!row || row.status!=20"-->
<!--      @click="startWork"-->
<!--      v-has="'PPC-SPIPAD-STARTWORK'"-->
<!--    >开工</el-button>-->
    <el-button
      type="primary"
      icon="el-icon-goods"
      :disabled="!row"
      @click="pickInfo"
      v-has="'PPC-SPIPAD-PICKINFO'"
    >领料</el-button>
    <el-button
      type="primary"
      icon="el-icon-s-flag"
      :disabled="!row"
      @click="finishInfo"
      v-has="'PPC-SPIPAD-FINISH'"
    >报工</el-button>
<!--    <el-button-->
<!--      type="primary"-->
<!--      icon="el-icon-search"-->
<!--      @click="queryByStatus('20')"-->
<!--      style="margin-left: 100px"-->
<!--    >未开工</el-button>-->
<!--    <el-button type="primary" icon="el-icon-search" @click="queryByStatus('30')">已开工</el-button>-->
<!--    <el-button type="primary" icon="el-icon-search" @click="queryByStatus('40,90')">已完工</el-button>-->
    <el-tabs
      class="tabWorkShift"
      style="height: calc(100% - 45% - 50px - 32px);"
      type="border-card"
      @tab-click="tabClick"
    >
      <el-tab-pane label="详细信息" lazy style="height: 100%;">
        <order-detail :row="row" style="height: 350px;" />
      </el-tab-pane>
      <el-tab-pane label="报工信息" lazy style="height: 100%">
        <order-finish :workOrderId="workOrderId" :trigger="random" style="height: 100%" />
      </el-tab-pane>
      <el-tab-pane label="领料记录" lazy style="height: 100%">
        <order-pick
          :workOrderId="workOrderId"
          :woStatus="row.status"
          :trigger="random"
          :id="id"
          style="height: 100%"
        />
      </el-tab-pane>
      <el-tab-pane label="投料信息" lazy style="height: 100%">
        <ppc-material :id="id" :trigger="random" :cmdUnable="true" style="height: 100%" />
      </el-tab-pane>
      <el-tab-pane label="流程卡" lazy style="height: 100%">
        <order-process :row="row" style="height: 100%" />
      </el-tab-pane>
    </el-tabs>

    <el-dialog title="领料" :visible.sync="InputDialogVisible" width="55%">
      <pick-info
        @save="categoryDialog"
        @cancel="hidenDialogCancel"
        :index="index"
        :workOrderId="workOrderId"
        :id="id"
      />
    </el-dialog>

    <el-dialog title="报工" :visible.sync="finishDialogVisible" width="55%">
      <finish-info
        @save="categoryDialog"
        @cancel="hidenDialogCancel"
        :workOrderId="workOrderId"
        :index="index"
      />
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import orderDetail from "./ipadInfo/orderdetail";
import orderPick from "./ipadInfo/orderPick";
import orderProcess from "./ipadInfo/orderProcess";
import orderFinish from "./ipadInfo/Finish";
import ppcMaterial from "../../plannedProduction/ppc-order/productPlan/planInfo/planMaterial";
import { getWorkOrderList, startWork } from "@/api/productionPlanning";
import { initData } from "@/api/ppc/workshopDispatch";
import PickInfo from "./pickInfo";
import finishInfo from "./finishInfo";
import JtBadge from "@/components/JtBadge";
import reworkPng from "@/assets/images/rework.png";

export default {
  name: "workShopIpad",
  components: {
    Pagination,
    orderFinish,
    PickInfo,
    orderDetail,
    orderPick,
    orderProcess,
    finishInfo,
    ppcMaterial,
    JtBadge
  },
  data() {
    return {
      queryForm: {},
      activeName: {},
      page: {
        current: 1,
        size: 10
      },
      pageSizes: [10, 20, 50, 100],
      total: 0,
      tableData: [],
      batchBtn: true,
      row: {},
      status: ["30"],
      InputDialogVisible: false,
      finishDialogVisible: false,
      id: "", //计划id
      workOrderId: "", //派工id
      index: 0,
      finishId: "",
      random: Math.random(),
      woStatusList: [],
      WO_TYPE: [],
      reworkPng: reworkPng
    };
  },
  methods: {
    startWork() {
      if (this.row.planId == undefined) {
        this.$message.warning("请选中行数据！！！");
        return;
      }
      if (this.row.status > 30) {
        this.$message.info("当前派工单已开工！！");
        return;
      }
      startWork(this.row.workOrderId)
        .then(response => {
          let data = response.data;
          if (data.success) {
            this.$message.success("操作成功");
            this.status = ["20", "30"];
            //this.row = {};
            //this.getData();
            this.row.status = "30";
            this.workOderInfo(this.row);
          } else {
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
          }
        })
        .catch(e => {
          this.$message({
            type: "error",
            message: e.message,
            duration: 3 * 1000
          });
        });
    },
    pickInfo() {
      if (this.row.planId == undefined) {
        this.$message.warning("请选中行数据！！！");
        return;
      }
      if (this.row.status == 20) {
        this.$message.warning("当前状态为未开工,无法领料！！！");
        return;
      }

      this.InputDialogVisible = true;
      this.index++;
    },
    finishInfo() {
      if (this.row.planId == undefined) {
        this.$message.warning("请选中行数据！！！");
        return;
      }

      if (this.row.status == 20) {
        this.$message.warning("当前状态为未开工,无法报工！！！");
        return;
      }
      this.finishDialogVisible = true;
    },
    tabClick() {
      this.random = Math.random();
    },
    categoryDialog() {
      this.InputDialogVisible = false;
      this.finishDialogVisible = false;
      this.index++;
    },
    hidenDialogCancel() {
      this.InputDialogVisible = false;
      this.finishDialogVisible = false;
    },
    queryByStatus(status) {
      this.status = [];
      if (status && status.indexOf(",") != -1) {
        let arr = status.split(",");
        for (let i = 0; i < arr.length; i++) {
          this.status.push(arr[i]);
        }
      } else {
        this.status.push(status);
      }
      this.getData();
    },
    workOderInfo(row) {
      this.row = row;
      this.id = this.row.planId;
      this.workOrderId = this.row.workOrderId;
      this.index++;
      this.random = Math.random();
    },
    getData() {
      const params = {
        ...this.page,
        finishId: this.finishId
      };
      getWorkOrderList(this.status, params)
        .then(response => {
          let data = response.data.data;
          if(response.data.success){
              for (let i = 0; i < data.result.length; i++) {
                  for (let j = 0; j < this.woStatusList.length; j++) {
                      if (data.result[i].status == this.woStatusList[j].code) {
                          data.result[i].statusName = this.woStatusList[j].label;
                      }
                  }
                  for (let j = 0; j < this.WO_TYPE.length; j++) {
                      if (data.result[i].workType == this.WO_TYPE[j].code) {
                          data.result[i].workTypeName = this.WO_TYPE[j].label;
                      }
                  }
              }
              this.tableData = data.result;
              this.total = data.total;
          } else {
            this.$message.error(response.data.message + ":" + response.data.data)
          }
        })
        .catch(e => {
          this.$message({
            type: "error",
            message: e.message,
            duration: 3 * 1000
          });
        });
    },
    initData() {
      initData().then(response => {
        let data = response.data;
        this.woStatusList = data.data.WO_STATUS;
        this.WO_TYPE = data.data.WO_TYPE;
        this.getData();
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$route.params.finishId) {
        this.finishId = this.$route.params.finishId;
      }
      this.initData();
    });
  }
};
</script>

<style lang="css" scoped>
.right {
  margin-left: 0px;
}
div .el-table {
  margin: 0;
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

<style>
.shopIPAD .el-tabs--border-card > .el-tabs__content {
  padding: 0;
}
.shopIPAD .el-tabs__content {
  height: calc(100% - 38px);
  overflow-y: scroll;
}
</style>
