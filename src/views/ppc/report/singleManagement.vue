<template>
  <!-- 产量统计-单件管理 -->
  <div class="singleManagement" style="height:100%" id="test">
    <el-form
      :inline="true"
      :model="queryForm"
      class="demo-form-inline"
      ref="queryForm"
      style="padding-left:20px"
    >
      <el-row>
        <el-form-item label="日期" prop="stationPassTime">
          <el-date-picker
            type="date"
            v-model="queryForm.stationPassTime"
            value-format="yyyy-MM-dd"
            style="width: 140px"
            :format="format"
            :disabled="isYear"
            :clearable="false"
          />
        </el-form-item>
        <el-form-item prop="type">
          <el-radio v-model="queryForm.type" label="day">日</el-radio>
          <el-radio v-model="queryForm.type" label="month">月</el-radio>
          <el-radio v-model="queryForm.type" label="year">年</el-radio>
        </el-form-item>
        <el-form-item label="车间" prop="workshopCode">
          <el-select v-model="queryForm.workshopCode">
            <el-option
              v-for="item in workshopOpts"
              :key="item.proccode"
              :label="item.name"
              :value="item.proccode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产线" prop="lineCode">
          <el-select v-model="queryForm.lineCode" clearable>
            <el-option
              v-for="item in lineOpts"
              :key="item.lineCode"
              :label="item.lineName"
              :value="item.lineCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工序" prop="processCode">
          <el-select v-model="queryForm.processCode" clearable>
            <el-option
              v-for="item in processOpts"
              :key="item.processCode"
              :label="item.processName"
              :value="item.processCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
          <el-button type="primary" icon="el-icon-refresh-left" @click="reset('queryForm')">重置</el-button>
          <el-button type="text" @click="isShowMore">
            {{ showMore ? '收起' : '展开' }}
            <i class="el-icon-arrow-down" />
          </el-button>
        </el-form-item>
      </el-row>
      <el-row v-show="showMore">
        <el-form-item label="设备" prop="deviceCode">
          <el-select v-model="queryForm.deviceCode" clearable>
            <el-option
              v-for="item in deviceOpts"
              :key="item.deviceCode"
              :label="item.deviceName"
              :value="item.deviceCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工位" prop="stationCode">
          <el-select v-model="queryForm.stationCode" clearable>
            <el-option
              v-for="item in stationOpts"
              :key="item.stationCode"
              :label="item.stationName"
              :value="item.stationCode"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-row>
    </el-form>
    <div
      id="echarts"
      style="width:100%"
      :style="{'height':showMore?'calc(100% - 52px - 52px)':'calc(100% - 52px)'}"
    ></div>
  </div>
</template>

<script>
import { selectProcess, produceProcessRate } from "@/api/productionPlanning";
import {
  getDepartmentLine,
  getLineProcess,
  getProcessStation,
  getProcessDevice
} from "@/api/sys/departMentProcess";
import { getAllWorkshop } from "@/api/ppc/genealogyProd";
import echarts from "echarts";
import { unitOutput } from "@/api/ppc/report";
import { simpleDateFormat } from "@/utils/index";

export default {
  name: "singleManagement",
  data() {
    return {
      queryForm: {
        stationPassTime: new Date(),
        type: "day",
        workshopCode: "",
        lineCode: "",
        processCode: "",
        deviceCode: "",
        stationCode: ""
      },
      showMore: false,
      processMap: [],
      result: [],
      chart: "",
      workshopOpts: [],
      lineOpts: [],
      processOpts: [],
      deviceOpts: [],
      stationOpts: [],
      isYear: false,
      timer: ""
    };
  },
  methods: {
    init() {
      // 获取车间
      getAllWorkshop().then(res => {
        const result = res.data;
        if (result.success) {
          this.workshopOpts = result.data;
          this.queryForm.workshopCode ||
            (this.queryForm.workshopCode = this.workshopOpts[0].proccode);
          // 设置20s刷新一次
          this.getData();
        } else {
          this.$message.error(result.message);
        }
      });
    },
    //产线
    getDepartmentLine() {
      getDepartmentLine({ departCode: this.queryForm.workshopCode }).then(
        res => {
          const result = res.data;
          if (result.success) {
            this.lineOpts = result.data;
          } else {
            this.$message.error(result.message);
          }
        }
      );
    },
    // 工序
    getLineProcess() {
      const param = {
        departCode: this.queryForm.workshopCode,
        lineCode: this.queryForm.lineCode
      };
      getLineProcess(param).then(res => {
        const result = res.data;
        if (result.success) {
          this.processOpts = result.data;
          console.log(this.processOpts, result);
        } else {
          this.$message.error(result.message);
        }
      });
    },
    //设备和工位
    getProcessDevice() {
      const param = {
        lineCode: this.queryForm.lineCode,
        processCode: this.queryForm.productProcessCode
      };
      getProcessStation(param).then(res => {
        const result = res.data;
        if (result.success) {
          this.stationOpts = result.data;
        } else {
          this.$message.error(result.message);
        }
      });
      getProcessDevice(param).then(res => {
        const result = res.data;
        if (result.success) {
          this.deviceOpts = result.data;
        } else {
          this.$message.error(result.message);
        }
      });
    },
    getData() {
      console.log(1);
      let params = {
        ...this.queryForm
      };
      (params.stationPassTime = simpleDateFormat(
        params.stationPassTime,
        this.format
      )),
        unitOutput(params).then(response => {
          let data = response.data;
          if (data.success) {
            let result = data.data;
            this.result = result;
            this.drawing(result);
            this.processIds = result.legend;
          } else {
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
            this.result = [];
            this.drawing(this.result);
          }
        });
    },
    //绘图
    drawing(result) {
      this.chart = echarts.init(document.getElementById("echarts"));
      let xName = "";
      if (this.queryForm.type == "day") {
        xName = "日";
      } else if (this.queryForm.type == "month") {
        xName = "月";
      } else {
        xName = "年";
      }
      let option = {
        title: {
          text: "物料产量",
          left: "center",
          top: "20",
          textStyle: {
            color: "#FAAD14"
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        tooltip: {
          trigger: "axis"
        },
        xAxis: {
          type: "category",
          data: result.xList,
          name: xName,
          nameTextStyle: {
            color: "#1890FF",
            fontSize: 16
          }
        },
        yAxis: {
          type: "value",
          name: "产量",
          axisLabel: {},
          nameTextStyle: {
            // color: "#1890FF",
            fontSize: 16
          }
        },
        series: [
          {
            data: result.yList,
            type: "line",
            showBackground: false,
            itemStyle: {
              color: "#E6A23C"
            },
            smooth:true,
          }
        ],
        animationDuration: 10000,
        animationDurationUpdate: 10000
      };
      var option1 = this.chart.getOption();
      this.chart.clear();
      this.chart.setOption(option, true);
    },
    isShowMore() {
      this.showMore = !this.showMore;
      this.$nextTick(() => {
        this.chart.resize();
      });
    },
    query() {
      clearInterval(this.timer);
      this.getData();
      this.timer = setInterval(() => {
        this.getData();
      }, 20000);
    }
  },
  mounted() {
    this.init();
    this.timer = setInterval(() => {
      this.getData();
    }, 40000);
  },
  destroyed() {
    clearInterval(this.timer);
  },
  watch: {
    //   监听车间
    "queryForm.workshopCode"(val) {
      //清空产线
      this.$set(this.queryForm, "lineCode", "");
      if (val) {
        //请求产线
        this.getDepartmentLine();
      }
    },
    // 监听产线
    "queryForm.lineCode"(val) {
      // 清空工序
      this.$set(this.queryForm, "inspectProcessCode", "");
      if (val) {
        //请求工序
        this.getLineProcess();
      }
    },
    // 监听工序
    "queryForm.inspectProcessCode"(val) {
      // 清空设备和工位
      this.$set(this.queryForm, "stationCode", "");
      this.$set(this.queryForm, "deviceCode", "");
      if (val) {
        //请求设备和工位
        this.getProcessDevice();
      }
    },
    "queryForm.type"(val) {
      if (val == "year") {
        this.queryForm.stationPassTime = "";
        this.isYear = true;
      } else {
        this.isYear = false;
        this.queryForm.stationPassTime = new Date();
      }
      this.getData();
    }
  },
  computed: {
    format() {
      if (this.queryForm.type == "month") {
        return "yyyy";
      } else if (this.queryForm.type == "year") {
        return "yyyy";
      } else {
        return "yyyy-MM";
      }
    }
  }
};
</script>

<style>
</style>
