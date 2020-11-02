<template>
  <div class="chart" style="height:100%">
    <div id="chart1"></div>
    <div id="chart2"></div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  props: {
    chartItem: {
      type: Object
    }
  },
  methods: {
    //渲染Echart
    applyBarEcharts() {
      let leftChart = echarts.init(document.getElementById("chart1"));
      let option = {
        xAxis: {
          type: "category",
          data: ["订单数量", "计划数量", "完成数量", "合格数量", "废品数量"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [
              this.chartItem.saleQty,
              this.chartItem.planQty,
              this.chartItem.finishQty,
              this.chartItem.goodQty,
              this.chartItem.bQty
            ],
            type: "bar",
            showBackground: true,
            barWidth: 50,
            backgroundStyle: {
              color: "rgba(220, 220, 220, 0.8)"
            }
          }
        ],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "line" // 默认为直线，可选为：'line' | 'shadow'
          }
        }
      };
      leftChart.setOption(option, true);
    },
    applyPeiEcharts() {
      let rightChart = echarts.init(document.getElementById("chart2"));
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: 10,
          data: ["合格率", "废品率"],
          top: 20
        },
        series: [
          {
            name: "订单综合查询",
            type: "pie",
            radius: ["0%", "70%"],
            // avoidLabelOverlap: false,
            label: {
              show: false,
              position: "outside"
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "26",
                fontWeight: "bold"
              }
            },
            labelLine: {
              show: false
            },
            data: [
              {
                value: this.chartItem.goodQty,
                name: "合格率"
              },
              {
                value: this.chartItem.bQty,
                name: "废品率"
              }
            ]
          }
        ]
      };
      rightChart.setOption(option, true);
    }
  },
  watch: {
    chartItem: {
      deep: true,
      handler(val) {
        console.log(val);
        this.applyBarEcharts();
        this.applyPeiEcharts();
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.chart {
  display: flex;
  height: 100%;
  #chart1 {
    height: 100%;
    flex: 5;
  }
  #chart2 {
    height: 100%;
    flex: 3;
  }
}
</style>
