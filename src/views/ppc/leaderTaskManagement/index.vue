<template>
  <!-- 班组长任务管理  -->
  <div class="leaderTaskManagement" style="height:100%">
    <!-- 查询表单 -->
    <el-form :model="queryForm" inline ref="queryForm" style="margin-left:20px">
      <el-row>
        <el-form-item label="任务开工时间" prop="time">
          <el-date-picker
            end-placeholder="结束时间"
            range-separator="~"
            start-placeholder="开始时间"
            type="datetimerange"
            v-model="queryForm.time"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="车间">
          <el-select placeholder="请选择" style="width: 100%" v-model="queryForm.workshopCode">
            <el-option
              :key="item.proccode"
              :label="item.name"
              :value="item.proccode"
              v-for="item in shopMap"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班组" prop="teamCode">
          <el-select filterable placeholder="请选择" style="width: 100%" v-model="queryForm.teamCode">
            <el-option
              :key="item.departCode"
              :label="item.departName"
              :value="item.departCode"
              v-for="item in dispatchTeamList"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getData(1)" icon="el-icon-search" type="primary">查询</el-button>
          <el-button
            @click="clearSearchBox"
            href="javascript:void(0)"
            icon="el-icon-refresh-left"
            type="primary"
          >重置</el-button>
          <el-button @click="showMore=!showMore" type="text">
            {{ showMore ? '收起' : '展开' }}
            <i class="el-icon-arrow-down" />
          </el-button>
        </el-form-item>
      </el-row>
      <el-row v-show="showMore">
        <el-form-item label="派工任务单号" prop="woNo">
          <el-input v-model="queryForm.woNo"></el-input>
        </el-form-item>
        <el-form-item label="生产计划单号" prop="ppNo">
          <el-input v-model="queryForm.ppNo"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select clearable multiple v-model="statusIn">
            <el-option label="未开工" value="20"></el-option>
            <el-option label="已开工" value="30"></el-option>
            <el-option label="完工" value="40"></el-option>
            <el-option label="强制完工" value="90"></el-option>
          </el-select>
        </el-form-item>
      </el-row>
    </el-form>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      :height="showMore?'calc(100% - 230px)':'calc(100% - 230px + 52px)'"
      border
      ref="multipleTable"
      stripe
      style="width: 100%"
    >
      <el-table-column fixed type="selection" width="55"></el-table-column>
      <el-table-column label="生产计划单号" prop="ppNo" width="150"></el-table-column>
      <el-table-column label="派工任务单号" prop="woNo" show-overflow-tooltip width="150"></el-table-column>
      <el-table-column label="生产物料" prop="materialCode" show-overflow-tooltip width="150"></el-table-column>
      <el-table-column label="状态" prop="status" show-overflow-tooltip width="100">
        <template v-slot="{row}">
          <jt-badge status="warning" textValue="未开工" v-if="row.status==20" />
          <jt-badge status="processing" textValue="已开工" v-if="row.status==30" />
          <jt-badge status="success" textValue="完工" v-if="row.status==40" />
          <jt-badge status="success" textValue="强制完工" v-if="row.status==90" />
        </template>
      </el-table-column>
      <el-table-column label="车间" prop="workshopName" show-overflow-tooltip width="150"></el-table-column>
      <el-table-column label="产线" prop="lineName" show-overflow-tooltip></el-table-column>
      <el-table-column label="工序" prop="processName" show-overflow-tooltip></el-table-column>
      <el-table-column label="计划开始" prop="planStartDate" show-overflow-tooltip width="150"></el-table-column>
      <el-table-column label="计划结束" prop="planEndDate" show-overflow-tooltip width="150"></el-table-column>
      <el-table-column label="加工数量" prop="produceQty" show-overflow-tooltip></el-table-column>
      <el-table-column label="已完工数量" prop="finishedQty" show-overflow-tooltip width="150"></el-table-column>
      <el-table-column label="当班班组" prop="teamName" show-overflow-tooltip></el-table-column>
      <el-table-column label="当班组长" prop="teamLeaderName" show-overflow-tooltip></el-table-column>

      <el-table-column label="单位" prop="unitCode" show-overflow-tooltip></el-table-column>
      <el-table-column label="备注" prop="remark" show-overflow-tooltip width="200"></el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="100px">
        <template v-slot="{row}">
          <el-button @click="reportWork(row.id)" type="text">查看报工</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 按钮行 -->
    <el-row style="padding:20px 0 0 20px">
      <el-button @click="start" icon="el-icon-video-play" type="primary">开工</el-button>
      <el-button @click="other('1')" icon="el-icon-refresh">交班</el-button>
      <el-button @click="other('40')" icon="el-icon-check" type="success">完工</el-button>
      <el-button @click="other('3')" icon="el-icon-video-pause" type="warning">暂停</el-button>
    </el-row>

    <Pagination
      :limit.sync="page.pageSize"
      :page.sync="page.pageNum"
      :total="total"
      @pagination="getData"
    />
    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible" title="选择班组" width="20%">
      <el-form label-width="100px">
        <el-row>
          <el-form-item label="交接班组：" prop="dialogTeamCode">
            <el-select
              ref="select"
              filterable
              placeholder="请选择班组"
              style="width: 100%"
              v-model="dialogTeamCode"
            >
              <el-option
                :key="item.departCode"
                :label="item.departName"
                :value="item.departCode"
                v-for="item in dispatchTeamList"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row style="margin-top:20px;text-align:center">
          <el-button @click="handover" icon="el-icon-check" type="primary">确定</el-button>
        </el-row>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="finishDialogVisible" title="报工查看" width="60%">
      <report-work :woId="woId" @close="close"></report-work>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryWorkShop,
  queryWorkOrderByUser,
  uptOrderStatus
} from "@/api/productionPlanning";
import { simpleDateFormat } from "@/utils/index";
import { workShopByLeaderUser } from "@/api/sys";
import { queryTeamByWorksho } from "@/api/ppc/workshopDispatch";
import Pagination from "@/components/Pagination";
import ReportWork from "./reportWork";
import JtBadge from "@/components/JtBadge";

export default {
  components: {
    ReportWork,
    Pagination,
    JtBadge
  },
  data() {
    return {
      queryForm: {
        ppNo: "",
        woNo: "",
        workshopCode: "",
        teamCode: "",
        time: "",
        status: ""
      },
      statusIn: ["20", "30"],
      shopMap: [],
      dispatchTeamList: [],
      showMore: false,
      tableData: [],
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      dialogTeamCode: "",
      dialogTeamName: "",
      dialogVisible: false,
      woId: "",
      finishDialogVisible: false,
      boo: false
    };
  },
  methods: {
    getData() {
      this.$set(this.queryForm, "startDate", "");
      this.$set(this.queryForm, "endDate", "");
      if (this.queryForm.time) {
        this.queryForm.startDate = simpleDateFormat(
          this.queryForm.time[0],
          "yyyy-MM-dd HH:mm:ss"
        );
        this.queryForm.endDate = simpleDateFormat(
          this.queryForm.time[1],
          "yyyy-MM-dd HH:mm:ss"
        );
      }
      this.queryForm.statusIn = this.statusIn.join();
      const params = {
        ...this.page,
        ...this.queryForm
      };
      delete params.time;
      queryWorkOrderByUser(params).then(response => {
        let data = response.data;
        if (data.success) {
          this.tableData = data.data.list;
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i].planStartDate = this.tableData[
              i
            ].planStartDate.substr(0, 16);
            this.tableData[i].planEndDate = this.tableData[
              i
            ].planEndDate.substr(0, 16);
          }
          this.total = data.data.total;
        } else {
          this.$message.error(data.message + ":" + data.data);
        }
      });
    },
    workShopByLeaderUser() {
      return new Promise(resolve => {
        const params = {
          userCode: this.$store.getters.userCode,
          departType: "001" //生产班组
        };
        workShopByLeaderUser(params).then(response => {
          let data = response.data;
          let detWorkshop = data.data;
          if (detWorkshop.length != 0) {
            this.queryForm.teamCode = detWorkshop[0].departCode;
            this.queryForm.workshopCode = detWorkshop[0].parentCode;
          }
          resolve();
        });
      });
    },
    reportWork(id) {
      this.woId = id;
      this.finishDialogVisible = true;
    },
    close() {
      this.finishDialogVisible = false;
    },
    workshopSelect() {
      return new Promise((resolve, reject) => {
        queryWorkShop().then(response => {
          let data = response.data;
          if (data.success) {
            this.shopMap = response.data.data.WORKSHOP_ALL;
            resolve();
          } else {
            reject();
          }
        });
      });
    },
    // 重置
    clearSearchBox() {
      this.$refs.queryForm.resetFields();
      this.getData();
    },
    // 开工
    start() {
      let arr = this.$refs.multipleTable.store.states.selection.map(
        item => item.status
      );
      //   判断勾选的是否符合
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] != "10" && arr[i] != "20") {
          this.$message.error("请选择录入或者未开工状态的数据");
          return;
        }
      }
      //   已选择的
      let selects = this.$refs.multipleTable.store.states.selection.map(
        item => {
          return item.id;
        }
      );
      const param = {
        ids: selects.join(","),
        status: "30"
      };
      this.uptOrderByStatus(param);
    },
    //其他
    other(type) {
      let arr = this.$refs.multipleTable.store.states.selection.map(
        item => item.status
      );
      //   判断勾选的是否符合
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] != "30") {
          this.$message.error("请选择已开工状态的数据");
          return;
        }
      }
      //   如果是交班 ==> 对话框
      if (type == "1") {
        this.dialogVisible = true;
      } else if (type == "40") {
        //完工
        //   已选择的数据
        let selects = this.$refs.multipleTable.store.states.selection.map(
          item => {
            return item.id;
          }
        );

        const param = {
          ids: selects.join(","),
          status: type
        };
        this.uptOrderByStatus(param);
      }
    },
    //交班
    handover() {
      if (!this.dialogTeamCode) {
        this.$message.error("请选择交接班组");
        return;
      }
      //   已选择的数据
      let selects = this.$refs.multipleTable.store.states.selection.map(
        item => {
          return item.id;
        }
      );
      const param = {
        ids: selects.join(","),
        teamCode: this.dialogTeamCode,
        teamName: this.$refs["select"].selected.label
      };
      this.uptOrderByStatus(param);
      this.dialogVisible = false;
    },
    queryTeamByWorksho() {
      let map = {
        workshopCode: this.queryForm.workshopCode
      };
      queryTeamByWorksho(map)
        .then(response => {
          if (response.data.success) {
            let teamList = response.data.data;
            this.dispatchTeamList = teamList;
          } else {
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    uptOrderByStatus(param) {
      uptOrderStatus(param).then(response => {
        let data = response.data;
        if (data.success) {
          this.$message.success("操作成功");
          this.getData();
        } else {
          this.$message.error(data.message + ":" + data.data);
        }
      });
    }
  },
  async created() {
    await this.workshopSelect();
    await this.workShopByLeaderUser();
    this.getData();
  },
  watch: {
    "queryForm.workshopCode"(val) {
      if (this.boo) {
        this.$set(this.queryForm, "teamCode", "");
      }
      if (val) {
        this.queryTeamByWorksho();
        this.boo = true;
      }
    }
  }
};
</script>

<style >
.leaderTaskManagement .el-dialog {
  height: 60%;
}
</style>
