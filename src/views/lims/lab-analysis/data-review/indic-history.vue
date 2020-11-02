<template>
  <div>
    <el-form ref="queryForm"  :model="queryForm" :inline="true" label-width="100px">
      <el-form-item label="化验时间">
        <el-date-picker
          v-model="timeArea"
          type="daterange"
          align="right"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="changeTime"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
          :clearable="false"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          icon="el-icon-search"
          href="javascript:void(0)"
          type="primary"
          class="btn-b"
          @click="getData()"
        >查询</el-button>
      </el-form-item>
    </el-form>
    <div id="chartCont" style="height: calc(100vh - 350px);width :100%;"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import { getIndicHistory } from "@/api/lims";
import { simpleDateFormat, getDate } from "@/utils/index";

export default {
  name: "indic-history",
  data() {
    return {
      timeArea: [],
      queryForm: {
        startTime: "",
        endTime: ""
      },
      outindicData: [],
      reachStandard: [],
      xAxisValue: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  props: {
    selItem: {
      type: Object,
      required: true
    }
  },
  mounted() {
    let item = this.selItem;
    this.queryForm = {
      labIndic: item.labIndic,
      workShop: item.workShop,
      labProName:item.proName,
      sampPlace:item.sampPlace,
      planType:item.planType,
      startTime: simpleDateFormat(getDate(-7), "yyyy-MM-dd")+" 00:00:00",
      endTime: simpleDateFormat(getDate(), "yyyy-MM-dd")+" 23:59:59"
    };
    this.timeArea.push(this.queryForm.startTime, this.queryForm.endTime);
    this.getData();
  },
  methods: {
    getData() {
      if (!this.timeArea) {
        this.$message.error("请选择时间");
        return false;
      }
      getIndicHistory({...this.queryForm}).then(res => {
        if (res.data.success) {
          let data = res.data.data;
          this.outindicData = [];
          this.reachStandard = [];
          this.xAxisValue = [];
          const standards = ["", "不合格", "不合格", "合格", "合格"];
          data.map((item, i) => {
            this.outindicData.push(item.outindicData);
            // this.reachStandard.push(item.reachStandard);
            this.xAxisValue.push(item.labTime);
          });
          this.drawLine();
        }
      });
    },
    drawLine() {
      let historyLineChart = echarts.init(document.getElementById("chartCont"));
      historyLineChart.setOption({
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["计算结果"]
        },
        grid: {
          left: "3%",
          right: "6%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.xAxisValue
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "计算结果",
            type: "line",
            smooth: true,
            data: this.outindicData
          },
          // {
          //   name: "达标情况",
          //   type: "line",
          //   data: this.reachStandard
          // }
        ]
      });
    },
    changeTime(val) {
      if (!!val) {
        this.queryForm.startTime = val[0]+" 00:00:00";
        this.queryForm.endTime = val[1] +" 23:59:59";
      }
    }
  }
};
</script>

<style scoped>
.btn-b {
  margin-top: -15px;
}
</style>
