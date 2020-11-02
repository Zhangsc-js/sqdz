<template>
  <div class="index clearfix">
    <!-- <div class="title">能源看板</div> -->
    <div class="chart chart1">
      <div class="watertitle">
        <strong>统计在线计量表( 在线 / 总计 )</strong>
      </div>
      <div id="main" style="width:33.3%;height:100%;float:left"></div>
      <div id="water2" style="width:33.3%;height:100%;float:left"></div>
      <div id="water3" style="width:33.3%;height:100%;float:left"></div>
    </div>

    <!--    //=============中 1 ：=水电气(年月日)累计用电=====================================================-->
    <div class="chart chart2">
      <!-- <div id="main2" style="width:100%;height:100%"></div> -->
      <div class="text">
        <Strong>各能源(年/月/日)累计用量</Strong>
      </div>
      <table cellpadding="0" cellspacing="0" style="border: none">
        <tr style="border: none">
          <td></td>
          <td>年</td>
          <td>月</td>
          <td>日</td>
        </tr>
        <tr>
          <td>电 / kW·h</td>
          <td v-for="(item,index) in middleTopElect" v-bind:key="index">{{item.dataValue}}</td>
        </tr>
        <tr>
          <td>水 / m³</td>
          <td v-for="(item,index) in middleTopWater" v-bind:key="index">{{item.dataValue}}</td>
        </tr>
        <tr>
          <td>气 / m³</td>
          <td v-for="(item,index) in middleTopGas" v-bind:key="index">{{item.dataValue}}</td>
        </tr>
      </table>
    </div>

    <!--    //=============左 2 ：=用电排名TOP5=====================================================-->
    <div class="chart chart3">
      <div id="main3" style="width:100%;height:100%"></div>
    </div>

    <!--    //===========中 2 ：===用水排名TOP5=====================================================-->
    <div class="chart chart4">
      <div id="main4" style="width:100%;height:100%"></div>
    </div>

    <!--    //===========左 3 ：===用电趋势=====================================================-->
    <div class="chart chart5">
      <div id="main5" style="width:100%;height:100%"></div>
    </div>

    <!--    //===========中 2 ：===用水趋势=====================================================-->
    <div class="chart chart6">
      <div id="main6" style="width:100%;height:100%"></div>
    </div>

    <!--    //===========右 1 2 3 ：===用水趋势=====================================================-->
    <div class="chart chart7">
      <div id="main7" style="width:100%;height:33.3%"></div>
      <!--      <hr>-->
      <div id="main8" style="width:100%;height:33.3%"></div>
      <!--      <hr>-->
      <div id="main9" style="width:100%;height:33.3%"></div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import liquidfill from "echarts-liquidfill";
import {
  getConsumerData,
  getWorkShopConsume,
  getYearConsumeWorkshopOrder,
  getFifthMonthConsumeWorkshopOrder,
  getMeteringData
} from "@/api/energy";

export default {
  name: "index",
  data() {
    return {
      leftTopElect: [],
      leftTopWater: [],
      leftTopGas: [],
      middleTopElect: [],
      middleTopWater: [],
      middleTopGas: [],
      rightTop: [],
      rightMiddle: [],
      rightBottom: [],
      leftMiddle: [],
      midlleMiddle: [],
      leftBottom: [],
      middleBottom: []
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      //水滴图 -- LeftTop
      this.getElectYearConsumeData();
      this.getWaterYearConsumeData();
      this.getGasYearConsumeData();
      // this.drawingLeftTopElect();
      // this.drawingLeftTopGas();
      // this.drawingLeftTopWater();

      //水电气年电总消耗 -- MiddleTop
      this.getElectConsumerData();
      this.getWaterConsumerData();
      this.getGasConsumerData();
      //本年各车间用电
      this.getElectWorkShopConsume();
      this.getWaterWorkShopConsume();
      this.getGasWorkShopConsume();
      //本年用电排名  TOP5
      this.getElectWorkShopConsumeTop5();
      this.getWaterWorkShopConsumeTop5();
      //各个月用电趋势
      this.getElectFifthMonthConsumeWorkshopOrder();
      this.getWaterFifthMonthConsumeWorkshopOrder();
    },
    getElectYearConsumeData() {
      getMeteringData("elect")
        .then(res => {
          if (res.data.success) {
            this.leftTopElect = res.data.data;
              this.leftTopElect[0] = 14;
            this.drawingLeftTopElect();
          } else this.$message.error(res.data.message);
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    getWaterYearConsumeData() {
      getMeteringData("water")
        .then(res => {
          if (res.data.success) {
            this.leftTopWater = res.data.data;
              this.leftTopWater[0]= 8;
              this.drawingLeftTopWater();
          } else this.$message.error(res.data.message);
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    getGasYearConsumeData() {
      getMeteringData("gas")
        .then(res => {
          if (res.data.success) {
            this.leftTopGas = res.data.data;
            this.drawingLeftTopGas();
          } else this.$message.error(res.data.message);
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },

    getElectWorkShopConsume() {
      getWorkShopConsume("elect")
        .then(res => {
          if (res.data.success) {
            this.rightTop = res.data.data;
            this.drawingRightTop();
          } else this.$message.error(res.data.message);
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    getWaterWorkShopConsume() {
      getWorkShopConsume("water")
        .then(res => {
          if (res.data.success) {
            this.rightMiddle = res.data.data;
            this.drawingRightMiddle();
          } else this.$message.error(res.data.message);
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    getGasWorkShopConsume() {
      getWorkShopConsume("gas")
        .then(res => {
          if (res.data.success) {
            this.rightBottom = res.data.data;
            this.drawingRightBottom();
          } else this.$message.error(res.data.message);
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },

    getElectConsumerData() {
      getConsumerData("elect")
        .then(res => {
          if (res.data.success) {
            this.middleTopElect = res.data.data;
          } else this.$message.error(res.data.message);
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    getWaterConsumerData() {
      getConsumerData("water")
        .then(res => {
          if (res.data.success) {
            this.middleTopWater = res.data.data;
          } else this.$message.error(res.data.message);
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    getGasConsumerData() {
      getConsumerData("gas")
        .then(res => {
          if (res.data.success) {
            this.middleTopGas = res.data.data;
          } else this.$message.error(res.data.message);
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },

    getElectWorkShopConsumeTop5() {
      getYearConsumeWorkshopOrder("elect")
        .then(res => {
          if (res.data.success) {
            this.leftMiddle = res.data.data;
            this.drawingLeftMiddle();
          } else this.$message.error(res.data.message);
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    getWaterWorkShopConsumeTop5() {
      getYearConsumeWorkshopOrder("water")
        .then(res => {
          if (res.data.success) {
            this.midlleMiddle = res.data.data;
            this.drawingMiddleMiddle();
          } else this.$message.error(res.data.message);
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },

    getElectFifthMonthConsumeWorkshopOrder() {
      getFifthMonthConsumeWorkshopOrder("elect")
        .then(res => {
          if (res.data.success) {
            this.leftBottom = res.data.data;
            this.drawingLeftBottom();
          } else this.$message.error(res.data.message);
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    getWaterFifthMonthConsumeWorkshopOrder() {
      getFifthMonthConsumeWorkshopOrder("water")
        .then(res => {
          if (res.data.success) {
            this.middleBottom = res.data.data;
            this.drawingMiddleBottom();
          } else this.$message.error(res.data.message);
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },

    formatter(number) {
      return number[0] + " / " + number[1];
    },
    checkPieValueIsZeroAndSelected(opt) {
      let data = opt.data;
      let selected = {};
      for (let i = 0; i < data.length; i++) {
        if (data[i].value === 0) {
          data[i].value = null;
          selected[data[i].name] = false;
        } else {
          selected[data[i].name] = true;
        }
      }
      return selected;
    },
    //开始绘图
    drawingLeftTopWater() {
      //==========左 1 ： 统计在线计量表(含总计、在线)==========================================
      let chart1 = echarts.init(document.getElementById("main"));
      // 绘制图表
      chart1.setOption({
        graphic: [
          {
            type: "group",
            left: "center",
            bottom: 10,
            children: [
              {
                type: "text",
                z: 100,
                left: "120",
                top: "middle",
                style: {
                  fill: "#000",
                  text: "水",
                  font: "24px Microsoft YaHei"
                }
              }
            ]
          }
        ],
        series: [
          {
            type: "liquidFill",
            data: [0.3, 0.2, 0.1],
            radius: "75%",
            itemStyle: {
              shadowBlur: 0 //图形阴影的模糊大小
            },
            outline: {
              borderDistance: 0,
              itemStyle: {
                borderWidth: 5,
                borderColor: "#CFE2FE"
              }
            },
            label: {
              normal: {
                formatter: this.formatter(this.leftTopWater), //显示在水球图中间的文字，可以是字符串，可以是占位符，也可以是一个函数。
                //如果使用{a}\n{b}\nValue: {c} ，a代表系列名称，b代表数据名称，c代表数据值。
                fontSize: 20,
                textStyle: {
                  color: "#3C81FC", //默认背景下的文字颜色
                  insideColor: "#3C81FC", //水波背景下的文字颜色
                  fontsize: 20 //字体大小
                }
              }
            }
          }
        ]
      });
    },
    drawingLeftTopElect() {
      let water2 = echarts.init(document.getElementById("water2"));
      // 绘制图表
      water2.setOption({
        graphic: [
          {
            type: "group",
            left: "center",
            bottom: 10,
            children: [
              {
                type: "text",
                z: 100,
                left: "120",
                top: "middle",
                style: {
                  fill: "#000",
                  text: "电",
                  font: "24px Microsoft YaHei"
                }
              }
            ]
          }
        ],
        series: [
          {
            type: "liquidFill",
            data: [0.3, 0.2, 0.1],
            radius: "95%",
            itemStyle: {
              shadowBlur: 0
            },
            outline: {
              borderDistance: 0,
              itemStyle: {
                borderWidth: 5,
                borderColor: "#CFE2FE"
              }
            },
            label: {
              normal: {
                formatter: this.formatter(this.leftTopElect), //显示在水球图中间的文字，可以是字符串，可以是占位符，也可以是一个函数。
                fontSize: 20,
                //如果使用{a}\n{b}\nValue: {c} ，a代表系列名称，b代表数据名称，c代表数据值。
                textStyle: {
                  color: "#3C81FC", //默认背景下的文字颜色
                  insideColor: "#3C81FC", //水波背景下的文字颜色
                  fontsize: 16 //字体大小
                }
              }
            }
          }
        ]
      });
    },
    drawingLeftTopGas() {
      let water3 = echarts.init(document.getElementById("water3"));
      // 绘制图表
      water3.setOption({
        graphic: [
          {
            type: "group",
            left: "center",
            bottom: 10,
            children: [
              {
                type: "text",
                z: 100,
                left: "120",
                top: "middle",
                style: {
                  fill: "#000",
                  text: "气",
                  font: "24px Microsoft YaHei"
                }
              }
            ]
          }
        ],
        series: [
          {
            type: "liquidFill",
            data: [0.3, 0.2, 0.1],
            radius: "75%",
            itemStyle: {
              shadowBlur: 0
            },
            outline: {
              borderDistance: 0,
              itemStyle: {
                borderWidth: 5,
                borderColor: "#CFE2FE"
              }
            },
            label: {
              normal: {
                formatter: this.formatter(this.leftTopGas), //显示在水球图中间的文字，可以是字符串，可以是占位符，也可以是一个函数。
                fontSize: 20,
                //如果使用{a}\n{b}\nValue: {c} ，a代表系列名称，b代表数据名称，c代表数据值。
                textStyle: {
                  color: "#3C81FC", //默认背景下的文字颜色
                  insideColor: "#3C81FC", //水波背景下的文字颜色
                  fontsize: 1 //字体大小
                }
              }
            }
          }
        ]
      });
    },
    drawingLeftMiddle() {
      let ts = this.leftMiddle.slice(0, 5);
      // let s = new Date().getFullYear()+"";
      //=============左 2 ：=用电排名TOP5=====================================================
      let chart3 = echarts.init(document.getElementById("main3"));
      // 绘制图表
      chart3.setOption({
        title: { text: "车间用电排名TOP5", fontFamily: "微软雅黑" },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999"
            }
          }
        },
        dataset: {
          dimensions: ["name", "value"],
          source: ts
        },
        grid: {
          left: "2%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          axisLabel: {
            //坐标轴刻度标签的相关设置。
            formatter: function(params) {
              var newParamsName = ""; // 最终拼接成的字符串
              var paramsNameNumber = params.length; // 实际标签的个数
              var provideNumber = 4; // 每行能显示的字的个数
              var rowNumber = Math.ceil(paramsNameNumber / provideNumber); // 换行的话，需要显示几行，向上取整
              /**
               * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
               */
              // 条件等同于rowNumber>1
              if (paramsNameNumber > provideNumber) {
                /** 循环每一行,p表示行 */
                for (var p = 0; p < rowNumber; p++) {
                  var tempStr = ""; // 表示每一次截取的字符串
                  var start = p * provideNumber; // 开始截取的位置
                  var end = start + provideNumber; // 结束截取的位置
                  // 此处特殊处理最后一行的索引值
                  if (p == rowNumber - 1) {
                    // 最后一次不换行
                    tempStr = params.substring(start, paramsNameNumber);
                  } else {
                    // 每一次拼接字符串并换行
                    tempStr = params.substring(start, end) + "\n";
                  }
                  newParamsName += tempStr; // 最终拼成的字符串
                }
              } else {
                // 将旧标签的值赋给新标签
                newParamsName = params;
              }
              //将最终的字符串返回
              return newParamsName;
            }
          }
        },
        yAxis: {
          name: "kWh（千瓦时）"
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          {
            type: "bar",
            itemStyle: {
              normal: {
                //好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
                color: function(params) {
                  // build a color map as your need.
                  var colorList = [
                    "#C1232B",
                    "#B5C334",
                    "#FCCE10",
                    "#E87C25",
                    "#27727B",
                    "#FE8463",
                    "#9BCA63",
                    "#FAD860",
                    "#F3A43B",
                    "#60C0DD",
                    "#D7504B",
                    "#C6E579",
                    "#F4E001",
                    "#F0805A",
                    "#26C0C0"
                  ];
                  return colorList[params.dataIndex];
                }, //以下为是否显示，显示位置和显示格式的设置了
                label: {
                  show: false,
                  //                             formatter: '{c}'
                  formatter: "{b}\n{c}"
                }
              }
            }
          }
        ]
      });
    },
    drawingLeftBottom() {
      this.leftBottom.reverse(); //该方法会改变原数组。
      let legendData = [];
      let seriesData = [];
      let length = this.leftBottom.length;
      for (let i = 0; i < length; i++) {
        seriesData.push(this.leftBottom[i].value);
        legendData.push(this.leftBottom[i].name);
      }
      let series = [];
      for (let i = 0; i < length; i++) {
        let item = {
          name: legendData[i],
          type: "line",
          stack: "总量",
          areaStyle: {},
          data: seriesData[i]
        };
        series.push(item);
      }
      //===========左 3 ：===用电趋势=====================================================
      let chart5 = echarts.init(document.getElementById("main5"));
      // 绘制图表
      chart5.setOption({
        title: {
          text: "TOP5车间用电趋势"
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
        legend: {
          data: legendData,
          top: 20
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月"
          ]
        },
        yAxis: {type: "value"},
        series: series
      });
    },
    //===========中
    drawingMiddleMiddle() {
      let ts = this.midlleMiddle.slice(0, 5);
      //===========中 2 ：===用水排名TOP5=====================================================
      let chart4 = echarts.init(document.getElementById("main4"));
      // 绘制图表
      chart4.setOption({
        title: { text: "车间用水排名TOP5" },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999"
            }
          }
        },
        dataset: {
          dimensions: ["name", "value"],
          source: ts
        },
        grid: {
          left: "2%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          axisLabel: {
            //坐标轴刻度标签的相关设置。
            formatter: function(params) {
              var newParamsName = ""; // 最终拼接成的字符串
              var paramsNameNumber = params.length; // 实际标签的个数
              var provideNumber = 4; // 每行能显示的字的个数
              var rowNumber = Math.ceil(paramsNameNumber / provideNumber); // 换行的话，需要显示几行，向上取整
              /**
               * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
               */
              // 条件等同于rowNumber>1
              if (paramsNameNumber > provideNumber) {
                /** 循环每一行,p表示行 */
                for (var p = 0; p < rowNumber; p++) {
                  var tempStr = ""; // 表示每一次截取的字符串
                  var start = p * provideNumber; // 开始截取的位置
                  var end = start + provideNumber; // 结束截取的位置
                  // 此处特殊处理最后一行的索引值
                  if (p == rowNumber - 1) {
                    // 最后一次不换行
                    tempStr = params.substring(start, paramsNameNumber);
                  } else {
                    // 每一次拼接字符串并换行
                    tempStr = params.substring(start, end) + "\n";
                  }
                  newParamsName += tempStr; // 最终拼成的字符串
                }
              } else {
                // 将旧标签的值赋给新标签
                newParamsName = params;
              }
              //将最终的字符串返回
              return newParamsName;
            }
          }
        },
        yAxis: { name: "m³（立方米）" },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          {
            type: "bar",
            itemStyle: {
              normal: {
                //好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
                color: function(params) {
                  // build a color map as your need.
                  var colorList = [
                    "#C1232B",
                    "#B5C334",
                    "#FCCE10",
                    "#E87C25",
                    "#27727B",
                    "#FE8463",
                    "#9BCA63",
                    "#FAD860",
                    "#F3A43B",
                    "#60C0DD",
                    "#D7504B",
                    "#C6E579",
                    "#F4E001",
                    "#F0805A",
                    "#26C0C0"
                  ];
                  return colorList[params.dataIndex];
                }, //以下为是否显示，显示位置和显示格式的设置了
                label: {
                  show: false,
                  //                             formatter: '{c}'
                  formatter: "{b}\n{c}"
                }
              }
            }
          }
        ]
      });
    },
    drawingMiddleBottom() {
      this.middleBottom.reverse(); //该方法会改变原数组。
      let legendData = [];
      let seriesData = [];
      let length = this.middleBottom.length;
      for (let i = 0; i < length; i++) {
        seriesData.push(this.middleBottom[i].value);
        legendData.push(this.middleBottom[i].name);
      }
      let series = [];
      for (let i = 0; i < length; i++) {
        let item = {
          name: legendData[i],
          type: "line",
          stack: "总量",
          areaStyle: {},
          data: seriesData[i]
        };
        series.push(item);
      }
      //===========中 3 ：===用水趋势=====================================================
      let chart6 = echarts.init(document.getElementById("main6"));
      // 绘制图表
      chart6.setOption({
        title: {
          text: "TOP5车间用水趋势"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: legendData,
          top: 20
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月"
          ]
        },
        yAxis: {
          type: "value"
        },
        series: series
      });
    },
    //===========右
    drawingRightTop() {
      let chart7 = echarts.init(document.getElementById("main7"));
      var option = {
        title: {
          text: "各车间用电量占比"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: <br/>{c} kWh ({d}%)"
        },
        series: [
          {
            name: "用电信息",
            type: "pie",
            // radius: '60%',  // 设置饼状图大小，100%时，最大直径=整个图形的min(宽，高)
            radius: ["35%", "60%"], // 设置环形饼状图， 第一个百分数设置内圈大小，第二个百分数设置外圈大小
            center: ["50%", "50%"], // 设置饼状图位置，第一个百分数调水平位置，第二个百分数调垂直位置
            data: this.rightTop,
            // itemStyle 设置饼状图扇形区域样式
            itemStyle: {
              // emphasis：英文意思是 强调;着重;（轮廓、图形等的）鲜明;突出，重读
              // emphasis：设置鼠标放到哪一块扇形上面的时候，扇形样式、阴影
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(30, 144, 255，0.5)"
              }
            },
            // 设置值域的那指向线
            labelLine: {
              normal: {
                show: true // show设置线是否显示，默认为true，可选值：true ¦ false
              }
            },
            // 设置值域的标签
            label: {
              normal: {
                show: true,
                position: "outside",
                // formatter: '{a} {b} : {c}个 ({d}%)'   设置标签显示内容 ，默认显示{b}
                // {a}指series.name  {b}指series.data的name
                // {c}指series.data的value  {d}%指这一部分占总数的百分比
                // formatter: '{b}: \n{c} ({d}%)'
                formatter: function(v) {
                  let text = v.name;
                  // text = text.length < 4 ? text : `${text.slice(0,4)}\n${text.slice(4)}`;
                  // let value = v.value;
                  let percent = v.percent;
                  // return text + '\n' + value + "kWh\n" + percent + "%"
                  return (text =
                    text.length < 5
                      ? text
                      : `${text.slice(0, 5)}\n${text.slice(5)}` +
                        "\n" +
                        percent +
                        "%");
                }
              }
              /*emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '20',
                                        fontWeight: 'bold'
                                    }
                                }*/
            }
          }
        ],
        legend: {
          show: false,
          type: "scroll",
          // orient 设置布局方式，默认水平布局，可选值：'horizontal'（水平） ¦ 'vertical'（垂直）
          orient: "vertical",
          // x 设置水平安放位置，默认全图居中，可选值：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）
          x: "right",
          // y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
          y: "top",
          textStyle: {
            color: "#666" // 图例文字颜色
          },
          selected: {}
        }
      };
      let selected = this.checkPieValueIsZeroAndSelected(option.series[0]);
      option.legend.selected = selected;
      // 绘制图表
      chart7.setOption(option);
    },
    drawingRightMiddle() {
      let chart8 = echarts.init(document.getElementById("main8"));
      let option = {
        title: {
          text: "各车间用水量占比"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: <br/>{c} m³ ({d}%)"
        },
        series: [
          {
            name: "用水信息",
            type: "pie",
            // radius: '50%',  // 设置饼状图大小，100%时，最大直径=整个图形的min(宽，高)
            radius: ["35%", "60%"], // 设置环形饼状图， 第一个百分数设置内圈大小，第二个百分数设置外圈大小
            center: ["50%", "50%"], // 设置饼状图位置，第一个百分数调水平位置，第二个百分数调垂直位置
            data: this.rightMiddle,
            // itemStyle 设置饼状图扇形区域样式
            itemStyle: {
              // emphasis：英文意思是 强调;着重;（轮廓、图形等的）鲜明;突出，重读
              // emphasis：设置鼠标放到哪一块扇形上面的时候，扇形样式、阴影
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(30, 144, 255，0.5)"
              }
            },
            // 设置值域的那指向线
            labelLine: {
              normal: {
                show: true // show设置线是否显示，默认为true，可选值：true ¦ false
              }
            },
            // 设置值域的标签
            label: {
              normal: {
                show: true,
                position: "outside", // 设置标签位置，默认在饼状图外 可选值：'outer' ¦ 'inner（饼状图上）'
                // formatter: '{a} {b} : {c}个 ({d}%)'   设置标签显示内容 ，默认显示{b}
                // {a}指series.name  {b}指series.data的name
                // {c}指series.data的value  {d}%指这一部分占总数的百分比
                // formatter: '{b}: \n{c} ({d}%)'
                formatter: function(v) {
                  let text = v.name;
                  // text = text.length < 4 ? text : `${text.slice(0,4)}\n${text.slice(4)}`;
                  // let value = v.value;
                  let percent = v.percent;
                  // return text + '\n' + value + "kWh\n" + percent + "%"
                  return (text =
                    text.length < 5
                      ? text
                      : `${text.slice(0, 5)}\n${text.slice(5)}` +
                        "\n" +
                        percent +
                        "%");
                }
              }
              // 点击触发
              /*emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '20',
                                        fontWeight: 'bold'
                                    }
                                }*/
            }
          }
        ],
        legend: {
          show: false,
          type: "scroll",
          // orient 设置布局方式，默认水平布局，可选值：'horizontal'（水平） ¦ 'vertical'（垂直）
          orient: "vertical",
          // x 设置水平安放位置，默认全图居中，可选值：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）
          x: "right",
          // y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
          y: "top",
          textStyle: {
            color: "#666" // 图例文字颜色
          },
          selected: {}
        }
      };
      let selected = this.checkPieValueIsZeroAndSelected(option.series[0]);
      option.legend.selected = selected;
      // 绘制图表
      chart8.setOption(option);
    },
    drawingRightBottom() {
      let chart9 = echarts.init(document.getElementById("main9"));
      let option = {
        title: {
          text: "各车间用气量占比"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: <br/>{c} m³ ({d}%)"
        },
        series: [
          {
            name: "用气信息",
            type: "pie",
            // radius: '50%',  // 设置饼状图大小，100%时，最大直径=整个图形的min(宽，高)
            radius: ["35%", "60%"], // 设置环形饼状图， 第一个百分数设置内圈大小，第二个百分数设置外圈大小
            center: ["50%", "50%"], // 设置饼状图位置，第一个百分数调水平位置，第二个百分数调垂直位置
            data: this.rightBottom,
            // itemStyle 设置饼状图扇形区域样式
            itemStyle: {
              // emphasis：英文意思是 强调;着重;（轮廓、图形等的）鲜明;突出，重读
              // emphasis：设置鼠标放到哪一块扇形上面的时候，扇形样式、阴影
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(30, 144, 255，0.5)"
              }
            },
            // 设置值域的那指向线
            labelLine: {
              normal: {
                show: true // show设置线是否显示，默认为true，可选值：true ¦ false
              }
            },
            // 设置值域的标签
            label: {
              normal: {
                show: true,
                position: "outside", // 设置标签位置，默认在饼状图外 可选值：'outer' ¦ 'inner（饼状图上）'
                // formatter: '{a} {b} : {c}个 ({d}%)'   设置标签显示内容 ，默认显示{b}
                // {a}指series.name  {b}指series.data的name
                // {c}指series.data的value  {d}%指这一部分占总数的百分比
                formatter: function(v) {
                  let text = v.name;
                  // text = text.length < 4 ? text : `${text.slice(0,4)}\n${text.slice(4)}`;
                  // let value = v.value;
                  let percent = v.percent;
                  // return text + '\n' + value + "kWh\n" + percent + "%"
                  return (text =
                    text.length < 5
                      ? text
                      : `${text.slice(0, 5)}\n${text.slice(5)}` +
                        "\n" +
                        percent +
                        "%");
                }
              }
              // 点击触发
              /* emphasis: {
                                     show: true,
                                     textStyle: {
                                         fontSize: '20',
                                         fontWeight: 'bold'
                                     }
                                 }*/
            }
          }
        ],
        legend: {
          show: false,
          type: "scroll",
          // orient 设置布局方式，默认水平布局，可选值：'horizontal'（水平） ¦ 'vertical'（垂直）
          orient: "vertical",
          // x 设置水平安放位置，默认全图居中，可选值：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）
          x: "right",
          // y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
          y: "top",
          textStyle: {
            color: "#666" // 图例文字颜色
          }
        }
      };
      let selected = this.checkPieValueIsZeroAndSelected(option.series[0]);
      option.legend.selected = selected;
      // 绘制图表
      chart9.setOption(option);
    }
  },
  components: {}
};
</script>

<style scoped lang='scss'>
.title {
  width: 100%;
  height: 50px;
  font-size: 24px;
  color: #fff;
  text-align: center;
  line-height: 50px;
  background-image: linear-gradient(to right, #4f6dfa, #5aa5f9);
}

.index {
  background-color: #eff0f3;
  width: 100%;
  // height: 1000px;
}

.chart {
  width: 33%;
  height: 310px;
  margin: 7px 0.5%;
  background-color: #fff;
  float: left;
  border-radius: 20px;
  padding-top: 10px;
}

.chart7 {
  // height: 1000px;
  height: 954px;
  width: 32%;
  float: left;
  position: absolute;
  // top: -640px;
  left: 67.5%;
  // padding-right: 10px;
  margin: 10px 0.9%;
}

.chart2 {
  padding: 10px;

  table {
    /*background-color: #d0e3fe;*/
    width: 100%;
    height: 260px;
    border-radius: 20px;
    text-align: center;
    border-collapse: collapse;

    td {
      border: 1px solid #f0f0f0;
      width: 25%;
    }
  }

  .text {
    height: 20px;
    line-height: 20px;
    font-size: 18px;
    font-family: Arial, "微软雅黑";
    font-style: normal;
  }
}

.chart1 {
  position: relative;

  .watertitle {
    position: absolute;
    top: 10px;
    left: 5px;
    font-size: 18px;
    font-family: Arial, "微软雅黑";
  }
}

/*.app-main {*/
/*    height: 100%;*/
/*    overflow-y: scroll;*/
/*}*/
</style>
<style>
.app-main {
  height: 97%;
}
</style>
