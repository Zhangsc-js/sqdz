<template>
  <div style="height: 100%">
    <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
      <el-form-item label="日期" prop="date">
        <el-date-picker
          clearable
          type="date"
          v-model="queryForm.date"
          value-format="yyyy-MM-dd"
          style="width: 140px"
          :format="formatDate"
        />
      </el-form-item>
      <el-form-item prop="type">
        <el-radio v-model="queryForm.type" label="day">日</el-radio>
        <el-radio v-model="queryForm.type" label="month">月</el-radio>
        <el-radio v-model="queryForm.type" label="year">年</el-radio>
      </el-form-item>
      <el-form-item label="车间" prop="workshopIds">
        <el-select
          clearable
          v-model="workshopIds"
          @change="getData"
          filterable
          multiple
          collapse-tags
          placeholder="请选择"
        >
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
        <el-button type="primary" icon="el-icon-refresh-left" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div id="shopEcharts" style="width:100%;height:50%"></div>
    <!-- <div id="materialEcharts" style="width:100%;height:calc(50% - 60px)"></div> -->
    <div class="barBox">
      <div id="materialEcharts" style="width:50%;height:100%"></div>
      <div id="materialEchartsRight" style="width:50%;height:100%"></div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import {
  queryWorkShop,
  workShopOutput,
  queryMaterilToDay,
  stationOutPut,
  processOutPut
} from "@/api/productionPlanning";
import { resetQueryForm } from "@/utils/common";
import { simpleDateFormat } from "@/utils";

export default {
  name: "workShopOutput",
  components: {
    echarts
  },
  data() {
    return {
      queryForm: {
        date: new Date(),
        type: "day"
      },
      shopMap: [], //车间下拉数据
      workshopIds: [],
      chartMain: {},
      chartDeatail: {},
      bottomTitle: "",
      bottomTitleRight: ""
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
      workShopOutput(this.queryForm).then(response => {
        let data = response.data;
        if (data.success) {
          let result = data.data;
          this.applyEcharts(result);
          if (this.workshopIds.length == 0) {
            this.workshopIds = result.shops;
          }
          this.triggerClick(result);
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
    },
    triggerClick(result) {
      console.log(result);
      let workshopCode = "";
      let xValue = "";
      //   for (let i = 0; i < result.legend.length; i++) {
      //车间
      // for (let j = result.xList.length - 1; j >= 0; j--) {
      //   //x轴
      //   let yDatas = result.yList[i].data;
      //   if (yDatas[j] > 0) {
      //     workshopCode = result.legend[i];
      //     xValue = result.xList[j];
      //     break;
      //   }
      // }
      // if (xValue == "") {
      //   continue;
      // }
      if (result.legend.length == 0) return;
      let day;
      for (let i = 0; i < result.yList[0].data.length; i++) {
        if (result.yList[0].data[i] > 0) {
          day = i + 1;
          break;
        }
      }
      const params = {
        lineName: result.legend[0],
        day: day,
        date: this.queryForm.date,
        type: this.queryForm.type
      };
      console.log(result.legend[0]);

      let type = this.queryForm.type;
      let time;
      if (type == "day") {
        time = simpleDateFormat(this.queryForm.date, "yyyy/MM");
      } else if (type == "month") {
        time = simpleDateFormat(this.queryForm.date, "yyyy");
      } else {
        time = "";
      }
      let formatTime = day.length > 1 ? day : `0${day}`;
      this.bottomTitle =
        result.legend[0] +
        "--" +
        `${time}/${formatTime}` +
        "--" +
        "工位产量统计";
      this.bottomTitleRight =
        result.legend[0] +
        "--" +
        `${time}/${formatTime}` +
        "--" +
        "工序产量统计";
      stationOutPut(params).then(response => {
        let data = response.data;
        if (data.success) {
          this.applyBarEchart(
            data.data,
            this.bottomTitle,
            "materialEcharts",
            "工位名称"
          );
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
      processOutPut(params).then(response => {
        let data = response.data;
        if (data.success) {
          this.applyBarEchart(
            data.data,
            this.bottomTitleRight,
            "materialEchartsRight",
            "工序名称"
          );
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
      //     break;
      //   }
      //   if (xValue == "") {
      //     this.chartDetail.clear();
      //   }
    },
    //渲染 -->  下
    applyBarEchart(result, title, id, name) {
      this.$nextTick(() => {
        this.chartDetail = echarts.init(document.getElementById(id));
        let option = {
          title: {
            text: title,
            textStyle: {
              color: "#FAAD14",
              align: "center"
            },
            left: "center"
          },
          color: ["#7CDBBC"],
          tooltip: {
            trigger: "axis",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: "5%",
            right: "100",
            bottom: "5%",
            containLabel: true
          },
          xAxis: {
            type: "category",
            data: result.xList,
            name: name,
            nameTextStyle: {
              color: "#1890FF",
              fontSize: 16,
              align: "left"
            }
          },
          yAxis: {
            type: "value",
            name: "数量",
            nameTextStyle: {
              color: "#1890FF",
              fontSize: 16
            }
          },
          series: [
            {
              name: "数量",
              barWidth: "40%",
              data: result.yList,
              barMaxWidth: 100,
              type: "bar"
            }
          ]
        };
        this.chartDetail.setOption(option, true);
      });
    },
    //渲染Echart --> 上
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
          text: "产线统计",
          textStyle: {
            color: "#FAAD14"
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: result.legend
        },
        grid: {
          left: "5%",
          right: "5%",
          bottom: "5%",
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
          data: result.xList,
          name: xName,
          nameTextStyle: {
            color: "#1890FF",
            fontSize: 16
          }
        },
        yAxis: {
          type: "value",
          name: "数量",
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
    workshopName2Code(name) {
      for (let i = 0; i < this.shopMap.length; i++) {
        if (this.shopMap[i].name == name) {
          return this.shopMap[i].proccode;
        }
      }
      return null;
    },
    initChartMain() {
      this.chartMain = echarts.init(document.getElementById("shopEcharts"));
      //单击事件
      this.chartMain.on("click", param => {
        const params = {
          lineName: param.seriesName,
          day: param.name,
          date: this.queryForm.date,
          type: this.queryForm.type
        };
        let type = this.queryForm.type;
        let time;
        if (type == "day") {
          time = simpleDateFormat(this.queryForm.date, "yyyy/MM");
        } else if (type == "month") {
          time = simpleDateFormat(this.queryForm.date, "yyyy");
        } else {
          time = "";
        }
        let formatTime = param.name.length > 1 ? param.name : `0${param.name}`;
        this.bottomTitle =
          param.seriesName +
          "--" +
          `${time}/${formatTime}` +
          "--" +
          "工位产量统计";
        this.bottomTitleRight =
          param.seriesName +
          "--" +
          `${time}/${formatTime}` +
          "--" +
          "工序产量统计";
        stationOutPut(params).then(response => {
          let data = response.data;
          if (data.success) {
            this.applyBarEchart(
              data.data,
              this.bottomTitle,
              "materialEcharts",
              "工位名称"
            );
          } else {
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
          }
        });
        processOutPut(params).then(response => {
          let data = response.data;
          if (data.success) {
            this.applyBarEchart(
              data.data,
              this.bottomTitleRight,
              "materialEchartsRight",
              "工序名称"
            );
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
<style scoped lang='scss'>
.el-form-item__content .el-radio {
  margin-right: 10px;
}
.barBox {
  display: flex;
  height: calc(50% - 60px);
  div {
    width: 50%;
    height: 100%;
  }
}
</style>
