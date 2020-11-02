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
        <el-select v-model="workshopIds" @change="getData" filterable multiple collapse-tags placeholder="请选择">
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
    <div id="materialEcharts" style="width:100%;height:calc(50% - 60px)"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import { resetQueryForm } from "@/utils/common";
import {
  queryWorkShop,
  workShoRate,
  materialBadRate
} from "@/api/productionPlanning";

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
      dataMain: [],
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
      workShoRate(this.queryForm).then(response => {
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
          shopName: workshopName,
          workshopCode: this.workshopName2Code(workshopName),
          dateType: xValue,
          date: this.queryForm.date,
          type: this.queryForm.type
        };
        materialBadRate(params).then(response => {
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
    workshopName2Code(name) {
      for (let i = 0; i < this.shopMap.length; i++) {
        if (this.shopMap[i].name == name) {
          return this.shopMap[i].proccode;
        }
      }
      return null;
    },
    //渲染
    applyBarEchart(result) {
      this.chartDetail = echarts.init(
        document.getElementById("materialEcharts")
      );
      let option = {
        title: {
          text: "物料废品数Top5",
          textStyle: {
            color: "#FAAD14"
          }
        },
        color: ["#7CDBBC"],
        // tooltip : {
        //     trigger: 'axis',
        //     axisPointer : {            // 坐标轴指示器，坐标轴触发有效
        //         type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        //     }
        // },
        grid: {
          left: "5%",
          right: "5%",
          bottom: "5%",
          containLabel: false
        },
        tooltip: {
          trigger: "axis",
          backgroundColor: "#428bca", //鼠标移动到图上面时，背景色
          padding: 15, //定义内边距
          formatter: function(szlb) {
            //szlb存的是对应的y轴数据
            for (var j = 0; j < szlb.length; j++) {
              //szlb[j].dataIndex为光标移入树状图下标
              return result.yName[szlb[j].dataIndex];
            }
          }
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
          name: "废品数量",
          nameTextStyle: {
            color: "#1890FF",
            fontSize: 16
          }
        },
        series: [
          {
            name: result.yName,
            barWidth: "40%",
            data: result.yList,
            barMaxWidth: 100,
            type: "bar"
          }
        ]
      };
      this.chartDetail.setOption(option, true);
    },
    getXName() {
      let xName = "";
      if (this.queryForm.type == "day") {
        xName = "日";
      } else if (this.queryForm.type == "month") {
        xName = "月";
      } else {
        xName = "年";
      }
      return xName;
    },
    //渲染Echart
    applyEcharts(result) {
      let option = this.getOptionMain();

      option.xAxis.name = this.getXName();
      option.xAxis.data = result.xList;
      option.legend.data = result.legend;
      option.series = result.yList;
      this.chartMain.setOption(option, true);
    },
    queryWorkShop() {
      queryWorkShop().then(response => {
        let data = response.data.data.WORKSHOP_ALL;
        this.shopMap = data;
      });
    },
    getOptionMain() {
      let option = {
        title: {
          text: "车间产出成品率(%)",
          textStyle: {
            color: "#FAAD14"
          }
        },
        tooltip: {
          trigger: "axis",
          backgroundColor: "#428bca", //鼠标移动到图上面时，背景色
          padding: 15 //定义内边距
        },
        legend: {
          data: []
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
          data: [],
          name: "",
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
          name: "成品率",
          nameTextStyle: {
            color: "#1890FF",
            fontSize: 16
          }
        },
        series: []
      };
      return option;
    },
    initChartMain() {
      this.chartMain = echarts.init(document.getElementById("shopEcharts"));
      //单击事件
      this.chartMain.on("click", param => {
        const params = {
          shopName: param.seriesName,
          workshopCode: this.workshopName2Code(param.seriesName),
          dateType: param.name,
          date: this.queryForm.date,
          type: this.queryForm.type
        };
        materialBadRate(params).then(response => {
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
    init() {
      this.queryWorkShop();
      this.initChartMain();
    },
    reset() {
      this.workshopIds = [];
      resetQueryForm(this, "queryForm", "init");
    }
  },
  mounted() {
    this.init();
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
<style lang="scss" scoped>
.el-select {
  width: 230px;
}
.el-form-item__content .el-radio {
  margin-right: 10px;
}
</style>
