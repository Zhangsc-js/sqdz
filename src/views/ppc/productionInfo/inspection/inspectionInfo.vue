<template>
  <div style="height: calc(100% - 26px);">
    <div style="width: 100%;height: 100%;">
      <el-divider content-position="left">报工审核</el-divider>
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
        <el-form-item label="报工单号" prop="wfNo">
          <el-input v-model="queryForm.wfNo" placeholder="请输入报工单号" clearable></el-input>
        </el-form-item>
        <!-- 折叠板中的内容 -->
        <span v-show="showMore">
          <el-form-item label="报工日期" prop="finishedDate">
            <el-date-picker
              type="date"
              v-model="queryForm.finishedDate"
              value-format="yyyy-MM-dd"
              :disabled="disabled"
              clearable
            />
          </el-form-item>
          <el-form-item label="生产车间" prop="workshopCode">
            <el-select v-model="queryForm.workshopCode" @change="getFinishList(1)" clearable filterable placeholder="请选择">
              <el-option
                v-for="(item,index) in workshopMap"
                :key="index"
                :label="item.name"
                :value="item.proccode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工序" prop="processCode">
            <el-select v-model="queryForm.processCode" @change="getFinishList(1)" clearable filterable placeholder="请选择">
              <el-option
                v-for="(item,index) in processMap"
                :key="index.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="质检状态" prop="status">
            <el-select v-model="queryForm.status" @change="getFinishList(1)" clearable>
              <el-option
                v-for="(item,index) in statusMap"
                :key="index.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </span>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getFinishList(1)">查询</el-button>
          <el-button type="primary" icon="el-icon-search" @click="reset">重置</el-button>
          <el-button type="text" @click="showMore=!showMore">
            {{ showMore ? '收起' : '展开' }}
            <i v-if="showMore" class="el-icon-arrow-up" />
            <i v-else class="el-icon-arrow-down" />
          </el-button>
        </el-form-item>
      </el-form>
      <el-table
        highlight-current-row
        :data="tableData"
        @row-click="rowclick"
        border
        :height="showMore?'calc(100% - 52px - 49px - 50px - 32px - 52px )':'calc(100% - 52px - 49px - 50px - 32px )'"
        style="width: 100%;"
      >
        <el-table-column prop="wfNo" label="报工单号" width="140px"></el-table-column>
        <el-table-column prop="finishedDate" label="报工时间" width="110px"></el-table-column>
<!--        <el-table-column prop="shift" label="班次"></el-table-column>-->
        <el-table-column prop="workshopName" label="生产车间" width="120px"></el-table-column>
        <el-table-column prop="lineCode" label="产线"></el-table-column>
        <el-table-column prop="processName" label="工序"></el-table-column>
        <el-table-column prop="materialCode" label="物料编号" width="140px"></el-table-column>
        <el-table-column prop="materialName" label="物料名称" width="140px"></el-table-column>
        <el-table-column prop="finishedQty" label="报工数"></el-table-column>
        <el-table-column prop="goodQty" label="合格数"></el-table-column>
        <el-table-column prop="badQty" label="废品数"></el-table-column>
<!--        <el-table-column prop="reworkQty" label="返修数">-->
<!--          <template v-slot="scope">-->
<!--            <a style="color:blue" @click="cellClick(scope.row)">{{ scope.row.reworkQty }}</a>-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column prop="status" label="状态" width="140px">
          <template v-slot="scope">
            <span v-if="scope.row.status == 30">
              <jt-badge status="warning" :textValue="scope.row.statusName" />
            </span>
            <span v-else>
              <jt-badge status="success" :textValue="scope.row.statusName" />
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="workerName" label="报工人"></el-table-column>
        <el-table-column prop="inspecterName" label="审核人"></el-table-column>
        <el-table-column prop="inspectTime" label="审核时间" width="110px"></el-table-column>
      </el-table>
      <Pagination
        :total="total"
        :page.sync="page.current"
        :limit.sync="page.size"
        :pageSizes="pageSizes"
        @pagination="getFinishList"
      />
      <el-button
        type="primary"
        icon="el-icon-check"
        @click="addInspection"
        v-has="'PPC-INSPEC-FINISH'"
      >审核</el-button>

      <el-dialog title="质检审核" :visible.sync="DialogVisible" width="45%">
        <inspection-detail @save="hidenDialog" @cancel="hidenDialogCancel" :row="row" />
      </el-dialog>
    </div>
  </div>
</template>


<script>
import { resetQueryForm } from "@/utils/common";
import Pagination from "@/components/Pagination";
import inspectionDetail from "./inspectionDetail";
import {
  getFinish,
  selectProcess,
  queryWorkShop,
  statusAndType
} from "@/api/productionPlanning";
import JtBadge from "@/components/JtBadge";
import reworkPng from "@/assets/images/rework.png";

export default {
  name: "inspectionInfo",
  components: {
    Pagination,
    inspectionDetail,
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
      queryForm: {
        wfNo: null,
        finishedDate: null,
        workshopId: null,
        processId: null,
        status: "30"
      },
      statusMap: [
        {
          value: "30",
          label: "质检审核中"
        },
        {
          value: "40",
          label: "质检完成"
        }
      ],
      showMore: false,
      disabled: false,
      workshopMap: [],
      processMap: [],
      tableData: [],
      DialogVisible: false,
      row: {},
      typeList: [],
      statusList: [],
      reworkPng: reworkPng
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      //获取工序下拉数据
      selectProcess().then(response => {
        let data = response.data;
        this.processMap = data.data;
      });

      //获取车间下拉数据
      queryWorkShop().then(response => {
        let data = response.data;
        this.workshopMap = data.data.WORKSHOP_ALL;
      });

      statusAndType().then(response => {
        let data = response.data;
        this.typeList = data.data.WO_TYPE;
        this.statusList = data.data.WF_STATUS;
        this.getFinishList();
      });
    },
    rowclick(row) {
      this.row = row;
    },
    addInspection() {
      if (this.row.id == undefined) {
        this.$message.warning("请选择报工行数据！");
        return;
      }
      if (this.row.status == "40") {
        this.$message.warning("当前数据已质检,请勿重复操作！！");
        return;
      }
      this.DialogVisible = true;
    },
    test() {
      this.tableData.unshift({});
    },
    getFinishList(current) {
      if (current === 1) {
        this.page.current = current;
      }
      const params = {
        ...this.page,
        ...this.queryForm
      };
      getFinish(params)
        .then(response => {
          let data = response.data.data;
          for (let i = 0; i < data.list.length; i++) {
            for (let j = 0; j < this.statusList.length; j++) {
              if (data.list[i].status == this.statusList[j].code) {
                data.list[i].statusName = this.statusList[j].label;
              }
            }
          }
          this.tableData = data.list;
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
    // cellClick(row) {
    //   if (row.reworkQty <= 0) {
    //     return;
    //   }
    //   //跳转到工单界面
    //   this.$router.push({
    //     name: "workOrder",
    //     path: "/ppc/productionInfo/workShopIpad",
    //     params: { finishId: row.id }
    //   });
    // },
    hidenDialog() {
      this.DialogVisible = false;
      this.getFinishList();
    },
    hidenDialogCancel() {
      this.DialogVisible = false;
    },
    reset() {
      resetQueryForm(this, "queryForm", "initData");
    }
  }
};
</script>

<style lang="css" scoped>
td .cell {
  text-align: center;
}
th .cell {
  text-align: center;
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
