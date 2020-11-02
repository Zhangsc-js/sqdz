<template>
  <div style="height: 100%">
    <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
      <el-form-item label="日期" prop="date">
        <el-date-picker
          type="date"
          v-model="queryForm.date"
          format="yyyy-MM"
          value-format="yyyy-MM-dd"
          style="width: 140px"
          clearable
          :format="formatDate"
        />
      </el-form-item>
      <el-form-item prop="type">
        <!--                <el-radio v-model="queryForm.type" label="day">日</el-radio>-->
        <el-radio v-model="queryForm.type" label="month">月</el-radio>
        <el-radio v-model="queryForm.type" label="year">年</el-radio>
      </el-form-item>
      <el-form-item label="车间" prop="workshopIds">
        <el-select clearable v-model="workshopIds" @change="getData" multiple collapse-tags filterable placeholder="请选择">
          <el-option
            v-for="item in shopMap"
            :key="item.proccode"
            :label="item.name"
            :value="item.proccode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getData">查询</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div id="shopEcharts" style="width:100%;height:50%"></div>
    <div id="materialEcharts" style="width:100%;height:calc(50% - 60px)"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import {
  queryWorkShop,
  producePlanFinish,
  materialDelay
} from "@/api/productionPlanning";
import { resetQueryForm } from "@/utils/common";

export default {
  name: "producePlanFinish",
  components: {
    echarts
  },
  data() {
    return {
      queryForm: {
        date: new Date(),
        type: "month"
      },
      shopMap: [], //车间下拉数据
      workshopIds: [],
      chartMain: {},
      chartDetail: {}
    };
  },
  methods: {
    getData() {
      if (!this.queryForm.date) {
        this.$message.warning("请选择日期");
        return;
      }
      let ids = "";
      for (let i = 0; i < this.workshopIds.length; i++) {
        ids += this.workshopIds[i];
        if (i < this.workshopIds.length - 1) {
          ids += ",";
        }
      }
      this.queryForm.ids = ids;
      producePlanFinish(this.queryForm).then(response => {
        let data = response.data;
        if (data.success) {
          let result = data.data;
          this.applyEcharts(result);
          this.workshopIds = result.workshopCodes;

          this.triggerClick(result);
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
    },
    workshopName2Code(name) {
      for (let i = 0; i < this.shopMap.length; i++) {
        if (this.shopMap[i].name == name) {
          return this.shopMap[i].proccode;
        }
      }
      return null;
    },
    triggerClick(result) {
      let workshopName = "";
      let xValue = "";
      for (let i = 0; i < result.legend.length; i++) {
        //车间
        for (let j = result.xList.length - 1; j >= 0; j--) {
          //x轴
          let yDatas = result.yList[i].data;
          if (yDatas[j] > 0) {
            workshopName = result.legend[i];
            xValue = result.xList[j];
            break;
          }
        }
        if (xValue == "") {
          continue;
        }
        const params = {
          shopCode: this.workshopName2Code(workshopName),
          dateType: xValue,
          date: this.queryForm.date,
          type: this.queryForm.type
        };
        materialDelay(params).then(response => {
          let data = response.data;
          if (data.success) {
            this.applyBarEchart(data.data);
          } else {
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
          }
        });
        break;
      }
      if (xValue == "") {
        this.chartDetail.clear();
      }
    },
    //渲染
    applyBarEchart(result) {
      this.chartDetail = echarts.init(
        document.getElementById("materialEcharts")
      );
      let option = {
        title: {
          text: result.title,
          textStyle: {
            color: "#FAAD14"
          }
        },
        color: ["#7CDBBC"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function(szlb) {
            //szlb存的是对应的y轴数据
            for (var j = 0; j < szlb.length; j++) {
              //szlb[j].dataIndex为光标移入树状图下标
              return result.yName[szlb[j].dataIndex];
            }
          }
        },
        grid: {
          left: "5%",
          right: "5%",
          bottom: "5%",
          containLabel: false
        },
        xAxis: {
          type: "category",
          data: result.xList,
          name: "物料",
          nameTextStyle: {
            color: "#1890FF",
            fontSize: 16
          }
        },
        yAxis: {
          type: "value",
          name: "拖期量",
          nameTextStyle: {
            color: "#1890FF",
            fontSize: 16
          }
        },
        series: [
          {
            name: "月拖期量",
            barWidth: "40%",
            data: result.yList,
            barMaxWidth: 100,
            type: "bar"
          }
        ]
      };
      this.chartDetail.setOption(option, true);
    },
    //渲染Echart
    applyEcharts(result) {
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
          text: "计划按期完成率(%)",
          textStyle: {
            color: "#FAAD14"
          }
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: result.legend
        },
        grid: {
          left: "5%",
          right: "5%",
          bottom: "5%",
          containLabel: false
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: result.xList,
          name: xName,
          nameTextStyle: {
            color: "#1890FF",
            fontSize: 16
          }
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value} %"
          },
          name: "完成率",
          nameTextStyle: {
            color: "#1890FF",
            fontSize: 16
          }
        },
        series: result.yList
      };
      this.chartMain.setOption(option, true);
    },
    queryWorkShop() {
      queryWorkShop().then(response => {
        let data = response.data.data.WORKSHOP_ALL;
        this.shopMap = data;
      });
    },
    initChartMain() {
      this.chartMain = echarts.init(document.getElementById("shopEcharts"));
      //单击事件
      this.chartMain.on("click", param => {
        const params = {
          shopCode: this.workshopName2Code(param.seriesName),
          dateType: param.name,
          date: this.queryForm.date,
          type: this.queryForm.type
        };
        materialDelay(params).then(response => {
          let data = response.data;
          if (data.success) {
            this.applyBarEchart(data.data);
          } else {
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
          }
        });
      });
      this.getData();
    },
    reset() {
      this.workshopIds = [];
      resetQueryForm(this, "queryForm", "");
      this.queryWorkShop();
      this.initChartMain();
    }
  },

  mounted() {
    this.queryWorkShop();
    this.initChartMain();
  },
    computed: {
        formatDate() {
            if (this.queryForm.type == "month") {
                return "yyyy-MM";
            } else if (this.queryForm.type == "year") {
                return "yyyy";
            } else {
                return "yyyy-MM-dd";
            }
        }
    },
};
</script>
<style scoped>
.el-form-item__content .el-radio {
  margin-right: 10px;
}
</style>
