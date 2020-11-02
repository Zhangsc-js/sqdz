<template>
  <!-- 首页 -->
  <div class="firstPage" style="height:100%">
    <div class="aside">
      <div class="bgc" style="height:100%">
        <div class="aside_first aside_son">
          <div id="aside_first" style="width:100%;height:100%"></div>
        </div>
        <div class="aside_second aside_son">
          <div id="aside_second" style="width:100%;height:100%"></div>
        </div>
        <div class="aside_third aside_son">
          <div id="aside_third" style="width:100%;height:100%"></div>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="main_top">能耗总量累计</div>
      <div class="main_data">
        <div class="son date">
          <div class="bgc bgc_data">
            <div class="water flexBox">
              <span class="one" style="color:#EEE;font-size:14px;">水：</span>
              <span class="two" style="color:#F7B207;font-size:24px">{{ this.dayWater }}</span>
              <span class="three" style="color:#EEE;font-size:14px">&nbsp;&nbsp;m³</span>
            </div>
            <div class="elect flexBox">
              <span class="one" style="color:#EEE;font-size:14px;">电：</span>
              <span class="two" style="color:#F7B207;font-size:24px">{{ this.dayElect }}</span>
              <span class="three" style="color:#EEE;font-size:14px">&nbsp;&nbsp;kWh</span>
            </div>
            <div class="gas flexBox">
              <span class="one" style="color:#EEE;font-size:14px">气：</span>
              <span class="two" style="color:#F7B207;font-size:24px">{{ this.dayGas }}</span>
              <span class="three" style="color:#EEE;font-size:14px">&nbsp;&nbsp;m³</span>
            </div>
            <p class="unit">日</p>
          </div>
        </div>
        <div class="son month">
          <div class="bgc bgc_data">
            <div class="water flexBox">
              <span class="one" style="color:#EEE;font-size:14px">水：</span>
              <span class="two" style="color:#F7B207;font-size:24px">{{ this.monthWater }}</span>
              <span class="three" style="color:#EEE;font-size:14px">&nbsp;&nbsp;m³</span>
            </div>
            <div class="elect flexBox">
              <span class="one" style="color:#EEE;font-size:14px">电：</span>
              <span class="two" style="color:#F7B207;font-size:24px">{{ this.monthElect }}</span>
              <span class="three" style="color:#EEE;font-size:14px">&nbsp;&nbsp;kWh</span>
            </div>
            <div class="gas flexBox">
              <span class="one" style="color:#EEE;font-size:14px">气：</span>
              <span class="two" style="color:#F7B207;font-size:24px">{{ this.monthGas }}</span>
              <span class="three" style="color:#EEE;font-size:14px">&nbsp;&nbsp;m³</span>
            </div>
            <p class="unit">月</p>
          </div>
        </div>
        <div class="son year">
          <div class="bgc bgc_data">
            <div class="water flexBox">
              <span class="one" style="color:#EEE;font-size:14px">水：</span>
              <span class="two" style="color:#F7B207;font-size:24px">{{ this.yearWater }}</span>
              <span class="three" style="color:#EEE;font-size:14px">&nbsp;&nbsp;m³</span>
            </div>
            <div class="elect flexBox">
              <span class="one" style="color:#EEE;font-size:14px">电：</span>
              <span class="two" style="color:#F7B207;font-size:24px">{{ this.yearElect }}</span>
              <span class="three" style="color:#EEE;font-size:14px">&nbsp;&nbsp;kWh</span>
            </div>
            <div class="gas flexBox">
              <span class="one" style="color:#EEE;font-size:14px">气：</span>
              <span class="two" style="color:#F7B207;font-size:24px">{{ this.yearGas }}</span>
              <span class="three" style="color:#EEE;font-size:14px">&nbsp;&nbsp;m³</span>
            </div>
            <p class="unit">年</p>
          </div>
        </div>
      </div>
      <div class="main_mid">车间能耗占比</div>
      <div class="bottom">
        <div class="son" id="bottom-echart"></div>
        <div class="son" id="bottom-echart1"></div>
        <div class="son" id="bottom-echart2"></div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import {
  getWaterCash,
  getElectCash,
  getGasCash,
  getDayAllEnergy,
  getMonthAllEnergy,
  getYearAllEnergy,
  getWaterShare,
  getElectShare,
  getGasShare
} from "@/api/energy.js";

export default {
  methods: {
    aside(id, type, unit, data, color) {
      this.$nextTick(() => {
        let chart3 = echarts.init(document.getElementById(id));
        // 绘制图表
        chart3.setOption({
          title: {
            text: type + "-日消耗趋势",
            fontFamily: "微软雅黑",
            textStyle: {
              color: "#EEE"
            },
            left: "center",
            top: "10px"
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: [
              "0时",
              "1时",
              "2时",
              "3时",
              "4时",
              "5时",
              "6时",
              "7时",
              "8时",
              "9时",
              "10时",
              "11时",
              "12时",
              "13时",
              "14时",
              "15时",
              "16时",
              "17时",
              "18时",
              "19时",
              "20时",
              "21时",
              "22时",
              "23时"
            ],
            axisLabel: {
              color: "#EEE"
            }
          },
          grid: {
            left: "18%",
            top: "20%",
            bottom: "20%"
          },
          yAxis: {
            type: "value",
            axisLabel: {
              color: "#EEE"
            },
            name: unit,
            nameTextStyle: {
              color: "#EEE"
            }
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              label: {
                backgroundColor: "#6a7985"
              }
            }
          },
          series: [
            {
              data: data,
              type: "line",
              areaStyle: {},
              itemStyle: {
                color: color
              }
            }
          ]
        });
      });
    },
    mainBottom() {
      this.$nextTick(() => {
        let chart7 = echarts.init(document.getElementById("bottom-echart"));
        let chart8 = echarts.init(document.getElementById("bottom-echart1"));
        let chart9 = echarts.init(document.getElementById("bottom-echart2"));
        chart7.setOption({
          title: {
            text: "水",
            left: "center",
            textStyle: {
              color: "#FFF",
              fontSize: 24,
              fontWeight: 700,
              lineHeight: 56
            },
            top: 30
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series: [
            {
              name: "用量/占比",
              type: "pie",
              radius: "55%",
              center: ["50%", "60%"],
              data: this.waterPro,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              },
              itemStyle: {
                color: params => {
                  let colorList = ["#CA8622", "#91C7AE"];
                  return colorList[params.dataIndex];
                }
              }
            }
          ]
        });
        chart8.setOption({
          title: {
            text: "电",
            left: "center",
            textStyle: {
              color: "#FFF",
              fontSize: 24,
              fontWeight: 700,
              lineHeight: 56
            },
            top: 30
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series: [
            {
              name: "用量/占比",
              type: "pie",
              radius: "55%",
              center: ["50%", "60%"],
              data: this.electPro,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              },
              itemStyle: {
                color: params => {
                  let colorList = ["#CA8622", "#91C7AE"];
                  return colorList[params.dataIndex];
                }
              }
            }
          ]
        });
        chart9.setOption({
          title: {
            text: "气",
            left: "center",
            textStyle: {
              color: "#FFF",
              fontSize: 24,
              fontWeight: 700,
              lineHeight: 56
            },
            top: 30
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series: [
            {
              name: "用量/占比",
              type: "pie",
              radius: "55%",
              center: ["50%", "60%"],
              data: this.gasPro,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              },
              itemStyle: {
                color: params => {
                  let colorList = ["#CA8622", "#91C7AE"];
                  return colorList[params.dataIndex];
                }
              }
            }
          ]
        });
      });
    }
  },
  mounted() {
    this.aside("aside_first", "水", "m³", this.waterData, "#E98F6F");
    this.aside("aside_second", "电", "kWh", this.electData, "#91C7AE");
    this.aside("aside_third", "气", "m³", this.gasData, "#CA8622");
    this.mainBottom();
  },
  data() {
    return {
      electData: "",
      gasData: "",
      waterData: "",
      dayElect: 0.0,
      dayWater: 0.0,
      dayGas: 0.0,
      monthElect: 0.0,
      monthWater: 0.0,
      monthGas: 0.0,
      yearElect: 0.0,
      yearWater: 0.0,
      yearGas: 0.0,
      waterPro: [],
      electPro: [],
      gasPro: []
    };
  },
  created() {
    let color = ["#50AEDF", "#FFE182"];
    let params = {
      hourInfo: "",
      energyType: "elect"
    };
    let params1 = {
      hourInfo: "",
      energyType: "gas"
    };
    let params2 = {
      hourInfo: "",
      energyType: "water"
    };
    getElectCash(params).then(res => {
      this.electData = res.data.data;
    });
    getGasCash(params1).then(res => {
      this.gasData = res.data.data;
    });
    getWaterCash(params2).then(res => {
      this.waterData = res.data.data;
    });

    getDayAllEnergy(params).then(res => {
      this.dayElect = res.data.data;
    });
    getDayAllEnergy(params1).then(res => {
      this.dayGas = res.data.data;
    });
    getDayAllEnergy(params2).then(res => {
      this.dayWater = res.data.data;
    });

    getMonthAllEnergy(params).then(res => {
      this.monthElect = res.data.data;
    });
    getMonthAllEnergy(params1).then(res => {
      this.monthGas = res.data.data;
    });
    getMonthAllEnergy(params2).then(res => {
      this.monthWater = res.data.data;
    });

    getYearAllEnergy(params).then(res => {
      this.yearElect = res.data.data;
    });
    getYearAllEnergy(params1).then(res => {
      this.yearGas = res.data.data;
    });
    getYearAllEnergy(params2).then(res => {
      this.yearWater = res.data.data;
    });
    let param = {
      energyType: "water"
    };
    getWaterShare(param).then(res => {
      this.waterPro = res.data.data;
      this.waterPro = this.waterPro.map((item, index) => {
        return {
          ...item,
          color: color[index]
        };
      });
      console.log(this.waterPro);
    });
    param.energyType = "elect";
    getWaterShare(param).then(res => {
      this.electPro = res.data.data;
    });
    param.energyType = "gas";
    getWaterShare(param).then(res => {
      this.gasPro = res.data.data;
    });
  },
  watch: {
    electData: {
      deep: true,
      handler() {
        this.aside("aside_second", "电", "kWh", this.electData, "#E98F6F");
      }
    },
    waterData: {
      deep: true,
      handler() {
        this.aside("aside_first", "水", "m³", this.waterData, "#91C7AE");
      }
    },
    gasData: {
      deep: true,
      handler() {
        this.aside("aside_third", "气", "m³", this.gasData, "#CA8622");
      }
    },
    waterPro: {
      deep: true,
      handler() {
        this.mainBottom();
      }
    },
    electPro: {
      deep: true,
      handler() {
        this.mainBottom();
      }
    },
    gasPro: {
      deep: true,
      handler() {
        this.mainBottom();
      }
    }
  }
};
</script>

<style scoped lang="scss">
.firstPage {
  width: 100%;
  height: 100%;
  background-color: rgba(242, 242, 242, 0.8);
  background-image: url("~@/assets/images/bag_4.png");
  background-size: cover;
  color: #eee;
  display: flex;
}
.aside {
  width: 30%;
  height: calc(100% - 20px);
  padding: 10px;
  .aside_son {
    width: 100%;
    height: 33.3%;
    box-sizing: border-box;
  }
}
.main {
  width: 70%;
  height: 100%;
  .main_top {
    font-size: 24px;
    line-height: 24px;
    color: #eee;
    text-align: center;
    margin: 15px;
  }
  .main_mid {
    font-size: 24px;
    line-height: 24px;
    color: #eee;
    text-align: center;
    margin: 30px;
    padding-top: 30px;
  }
  .main_data {
    height: 150px;
    width: 100%;
    display: flex;
    .son {
      width: 33.3%;
      text-align: center;
      p {
        font-size: 24px;
        padding: 0;
        margin: 10px;
      }
    }
  }
  .bottom {
    height: calc(50%);
    display: flex;
    background-color: rgba(200, 200, 200, 0.1);
    border-radius: 20px;
    margin: 10px;
    box-sizing: border-box;
    .son {
      width: 100%;
      height: 100%;
      float: left;
    }
  }
}
.bgc {
  background-color: rgba(200, 200, 200, 0.1);
  border-radius: 20px;
  margin: 10px;
  box-sizing: border-box;
}
.bgc_data {
  padding: 20px;
}
.flexBox {
  display: flex;
  justify-content: center;
  align-items: center;
  .one {
    width: 30%;
  }
  .three {
    width: 30%;
  }
}
</style>
