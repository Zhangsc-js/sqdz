<template>
  <!--  <div height="100%">-->
  <!--    <el-table :data="tableData" stripe border style="width: 100%;" height="100%">-->
  <!--      <el-table-column prop="checkingRecordNo" label="停机时间" align="center"></el-table-column>-->
  <!--      <el-table-column prop="plan.planName" label="开机时间" align="center" ></el-table-column>-->
  <!--      <el-table-column prop="planStartTime" label="停机持续时间（分钟）" align="center"></el-table-column>-->
  <!--      <el-table-column prop="planEndTime" label="监控点位" align="center" ></el-table-column>-->
  <!--      <el-table-column prop="startTime" label="停机原因" align="center" ></el-table-column>-->
  <!--    </el-table>-->
  <!--  </div>-->
  <el-container class="devHmi" style="height: 100%;">
    <edit-table
      :tableData="tableData"
      :opts.sync="tableColumnMain"
      highlight-current-row
      :page="page"
      :total="total"
      :pageSizes="pageSizes"
      :showAddBtn="false"
      @getData="getData"
      style="width: 100%;"
      height="95%"
    ></edit-table>
  </el-container>
</template>

<script>
import EditTable from "@/components/EditTable";
import { getDevOnOffRecord, initOnOffData } from "@/api/sys/dev";

export default {
  components: {
    EditTable
  },
  name: "DevOnOff",
  data() {
    return {
      tableColumnMain: [
        {
          type: "input",
          label: "停机时间",
          prop: "offTime",
          width: 200
        },
        {
          type: "input",
          label: "开机时间",
          prop: "onTime"
        },
        {
          type: "input",
          label: "停机持续时间（分钟）",
          prop: "continuedTime"
        },
        {
          type: "input",
          label: "监控点位",
          prop: "monitorTag"
        },
        {
          type: "select",
          label: "停机原因",
          prop: "offReasonCode",
          options: []
        }
      ],
      showAddBtn: true,
      page: {
        pageNum: 1,
        pageSize: 10
      },
      tableData: [],
      total: 0,
      pageSizes: [10, 50, 100],
      selectMainInfo: {},
      tableDataPart: [],
      currActiveName: "devOnOff"
    };
  },
  props: {
    activeName: {
      required: true,
      default: ""
    }
  },
  computed: {
    selectNodeNO() {
      return this.$store.state.sysDev.selectNodeNO;
    }
  },
  watch: {
    selectNodeNO() {
      if (this.activeName == this.currActiveName) {
        this.getData();
      }
    },
    activeName() {
      if (this.activeName == this.currActiveName) {
        this.getData();
      }
    }
  },
  created() {
    initOnOffData().then(response => {
      this.offReasonCodes = response.data.data.DEV_ON_OFF_REASON.map(item => {
        return {
          label: item.label,
          value: item.code
        };
      });
      this.tableColumnMain[
        this.tableColumnMain.length - 1
      ].options = this.offReasonCodes;
    });
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      const qfrom = {
        reason: "",
        devCode: this.selectNodeNO,
        devName: "",
        monitorTag: "",
        offReasonCode: ""
      };
      const params = {
        ...this.page,
        ...qfrom
      };
      getDevOnOffRecord(params).then(response => {
        let data = response.data;
        if (data.success) {
          this.total = data.data.total;
          this.tableData = data.data.rows;
          this.tableData.forEach(item => {
            let onTime = item.onTime == null ? new Date() : item.onTime;
            let offTime = item.offTime;
            item.continuedTime = (
              (new Date(onTime).getTime() - new Date(offTime).getTime()) /
              1000 /
              60
            ).toFixed(1);
          });
        } else {
          this.$message.error(data.message + ":" + data.data);
        }
      });
    },

    GetDateStr(AddDayCount) {
      let dd = new Date();
      dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
      let y = dd.getFullYear();
      let m =
        dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1; //获取当前月份的日期，不足10补0
      let d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0
      return y + "-" + m + "-" + d;
    }
  }
};
</script>
