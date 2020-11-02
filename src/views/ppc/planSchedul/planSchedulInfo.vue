<template>
  <div style="height: 100%;" class="planSchedulInfo">
    <edit-table
      :tableData="tableData"
      height="40%"
      :opts.sync="tableColumn"
      :page="page"
      :total="total"
      :pageSizes="pageSizes"
      highlight-current-row
      @getData="getData"
      @savaData="add"
      @deleteRow="delectplan"
      @jc-row-click="planInfo"
      pageName="SYS-PLTEAM"
    ></edit-table>

    <div class="twoButton">
      <el-button class="right" icon="el-icon-date" type="primary" @click="calendar" v-has="'SYS-PLTEAM-DATE'">日历</el-button>
<!--      <el-button class="right" icon="el-icon-tickets" type="primary" @click="daily">排班</el-button>-->
    </div>

    <el-tabs style="margin-top:40px;height:calc(60% - 78px)" type="border-card" class="clearfix" >
      <el-tab-pane label="班次方案" lazy style="height:100%" class="clearfix">
        <shift :planCode="planCode" style="height:100%" class="clearfix" />
      </el-tab-pane>
      <el-tab-pane label="班组方案" lazy style="height:100%" class="clearfix">
        <planTeam :planCode="planCode" style="height:100%" class="clearfix" />
      </el-tab-pane>
    </el-tabs>

<!--    <el-dialog-->
<!--      title="排班"-->
<!--      :visible.sync="dailyDialogVisible"-->
<!--      width="65%"-->
<!--      style="height: 100%"-->
<!--      top="50px"-->
<!--      append-to-body-->
<!--    >-->
<!--      <plan-daily @save="categoryDialog" @cancel="hidenDialogCancel" />-->
<!--    </el-dialog>-->

    <el-dialog title="日历及例外日" :visible.sync="calendarDialogVisible" width="60%">
      <calendar @save="categoryDialog" @cancel="hidenDialogCancel" :planCode="planCode" />
    </el-dialog>
  </div>
</template>
<script>
import EditTable from "@/components/EditTable";
import {
  getScheduInfo,
  dltSchedulInfo,
  addSchedulPlan
} from "@/api/productionPlanning";
import UptScheduInfo from "./uptPlanSchedul";
import saveScheduInfo from "./saveScheduInfo";
import calendar from "./calendar";
import shift from "./shift";
import planTeam from "./planTeam";
import PlanDaily from "./planDaily";

export default {
  name: "planScheduInfo",
  components: {
    PlanDaily,
    EditTable,
    shift,
    calendar,
    planTeam
  },
  data() {
    return {
      page: {
        pageNum: 1,
        pageSize: 5
      },
      pageSizes: [5, 10, 50, 100],
      total: 0,
      tableColumn: [
        {
          label: "排班编码",
          prop: "planCode"
        },
        {
          type: "input",
          label: "排班名称",
          prop: "planName"
        },
        {
          type: "input",
          label: "排班方案",
          prop: "planCase"
        },
        {
          label: "备注",
          prop: "workShopList"
        }
      ],
      tableData: [],
      DialogVisible: false,
      SaveDialogVisible: false,
      calendarDialogVisible: false,
      // dailyDialogVisible: false,
      row: {},
      planCode: ""
    };
  },
  methods: {
    getData() {
      getScheduInfo(this.page).then(response => {
        if (response.data.success) {
          this.tableData = response.data.data.result;
          this.total = response.data.data.total;
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
    },
    add(row, done) {
      done();
      addSchedulPlan(row).then(response => {
        if (response.data.success) {
          this.$message.success("新增成功！！");
          this.$emit("save");
          this.getData();
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
          this.getData();
        }
      });
    },
    saveSchedul() {
      this.SaveDialogVisible = true;
    },
    updateplan(row) {
      this.DialogVisible = true;
      this.row = row;
    },
    // daily() {
    //   this.dailyDialogVisible = true;
    // },
    calendar() {
      if (this.planCode) {
        this.calendarDialogVisible = true;
      } else {
        this.$message.warning("请选择一个排班方案");
      }
    },
    delectplan(id) {
      dltSchedulInfo(id).then(response => {
        if (response.data.success) {
          this.$message.success("删除成功");
          this.getData();
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
    },
    planInfo(row) {
      this.planCode = row.planCode;
    },
    categoryDialog() {
      this.DialogVisible = false;
      this.SaveDialogVisible = false;
      this.calendarDialogVisible = false;
      this.getData();
    },
    hidenDialogCancel() {
      this.DialogVisible = false;
      this.SaveDialogVisible = false;
      this.calendarDialogVisible = false;
    }
  },
  mounted() {
    this.getData();
  }
};
</script>

<style >
.app-main > div {
  height: 100%;
}
.planSchedulInfo .el-tabs__content{
    height: calc(100% - 40px);
}
</style>
<style lang="scss" scoped>
  .twoButton{
    position: relative;
    top:20px;
    left:10px;
  }

</style>

