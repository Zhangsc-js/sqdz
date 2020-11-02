<template>
  <div class="index" id="index">
    <!-- 第一行 -->
    <div class="row1" id="row1">
      <!--生产计划 -->
      <div class="title plan">生产计划：生产单号的完成比例</div>
      <el-card class="productionPlan" id="productionPlan"></el-card>
      <!-- 装备 -->
      <el-card class="equipment">
        <div class="title">设备</div>
        <div class="box move">
          <div class="icon">
            <div class="logo"></div>
          </div>
          <div class="num">{{equipment.move}}台</div>
          <div class="type">运行</div>
        </div>
        <div class="box stop">
          <svg-icon icon-class="index_danger" class="icon_svg" />
          <div class="num">{{equipment.stop}}台</div>
          <div class="type">故障</div>
        </div>
        <div class="box off">
          <svg-icon icon-class="index_off" class="icon_svg" />
          <div class="num">{{equipment.off}}台</div>
          <div class="type">关机</div>
        </div>
        <div class="box await">
          <svg-icon icon-class="index_pause" class="icon_svg" />
          <div class="num">{{equipment.pause}}台</div>
          <div class="type">待机</div>
        </div>
      </el-card>
      <!-- 快捷访问 -->
      <el-card class="fast">
        <div class="title">快速入口</div>
        <el-button
          class="box-quick"
          type="primary"
          v-for="(item ,i) in quickAccess"
          :key="i"
          @click="$router.push(item.path)"
        >{{item.meta.title}}</el-button>
      </el-card>
    </div>
    <!-- 第二行 -->
    <div class="row2">
      <div class="title">能源</div>
      <!-- 2.1 -->
      <div class="ene">
        <div class="broken first" id="ene1"></div>
        <div class="broken" id="ene2"></div>
        <div class="broken" id="ene3"></div>
      </div>
      <div class="lims">
        <div class="title lims-title">LIMS-化验项统计</div>
        <el-card class="lims-card" id="columnar"></el-card>
      </div>
    </div>
    <!-- 第三行 -->
    <div class="row3">
      <div class="wei">
        <div class="title">检斤-出入厂货物重量</div>
        <el-card class="wei-card" id="wei"></el-card>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
var elementResizeDetectorMaker = require("element-resize-detector");
export default {
  name: "EmployeesTree",
  data() {
    return {
      quickAccess: [
        {
          path: "/dev/v3",
          name: "Device3",
          component: () =>
            import("@/views/dev/dev-tree/fectory-model/FactoryModel"),
          meta: {
            title: "工厂模型",
            icon: "dev_factory_model",
            requiresAuth: false
          }
        },
        {
          path: "/dev/v14",
          name: "CheckingPlane",
          component: () =>
            import(
              "@/views/dev/dev-ops/dev-maintain/spot-check/checking-plan/index"
            ),
          meta: { title: "点检计划", icon: "dev_sc_plan", requiresAuth: false }
        },
        {
          path: "/wei/inMetering/inQuery/inWeiDetails",
          name: "inWeiDetails",
          component: () =>
            import(
              "@/views/wei/wei-metering/inMetering/details/inMeter-details"
            ),
          meta: { title: "入厂检斤明细", icon: "dashboard", requiresArg: false }
        },
        {
          path: "/ene/dev",
          name: "devTree",
          component: () => import("@/views/ene/infoManager/dev-tree/devTree"),
          hidden: false,
          meta: {
            title: "能源设备管理",
            icon: "ene_divece",
            requiresArg: false
          }
        },
        {
          path: "/ppc/progressTracking/producePlan",
          name: "producePlanProgress",
          component: () => import("@/views/ppc/progressTracking/producePlan"),
          meta: {
            title: "生产计划进度跟踪",
            icon: "ppc_producePlan_progress",
            requiresArg: false
          }
        }
      ],
      mychat1: "",
      mychat2: "",
      mychat3: "",
      mychat4: "",
      //   第三行表数据
      lims: {
        outNets: [
          2.6,
          5.9,
          9.0,
          26.4,
          28.7,
          70.7,
          175.6,
          182.2,
          48.7,
          18.8,
          6.0,
          2.3
        ],
        inNets: [
          3.9,
          5.9,
          11.1,
          18.7,
          48.3,
          69.2,
          231.6,
          46.6,
          55.4,
          18.4,
          10.3,
          0.7
        ]
      },
      //   1.1生产计划数据
      plan: [
        { name: "pp18790055563", progress: 38 },
        { name: "pp18635055633", progress: 50 },
        { name: "pp13590053567", progress: 77 }
      ],
      //   1.2 设备
      equipment: {
        move: 29,
        stop: 0,
        off: 5,
        pause: 9
      },
      // 2.1 水电气趋势
      trend: {
        water: [500, 820, 1290, 920, 1150, 1360],
        elect: [524, 420, 890, 1120, 750, 1320],
        gas: [500, 820, 1290, 1320, 1150, 760]
      },
      // 2.2 lims
      lim: {
        noPass: [5, 4, 6, 3, 5, 7, 7, 4, 3, 5, 9, 4],
        pass: [60, 51, 55, 46, 57, 59, 48, 49, 57, 66, 57, 40]
      }
    };
  },
  created() {},
  methods: {
    // 1.1进度条
    productionPlan() {
      this.$nextTick(() => {
        this.mychat1 = echarts.init(document.getElementById("productionPlan"));
        // 绘制图表
        this.mychat1.setOption({
          grid: {
            // 直角坐标系内绘图网格
            left: "10%", //grid 组件离容器左侧的距离,
            //left的值可以是80这样具体像素值，
            //也可以是'80%'这样相对于容器高度的百分比
            top: "10%",
            right: "10%",
            bottom: "10%",
            containLabel: true //gid区域是否包含坐标轴的刻度标签。为true的时候，
            // left/right/top/bottom/width/height决定的是包括了坐标轴标签在内的
            //所有内容所形成的矩形的位置.常用于【防止标签溢出】的场景
          },
          xAxis: {
            //直角坐标系grid中的x轴,
            //一般情况下单个grid组件最多只能放上下两个x轴,
            //多于两个x轴需要通过配置offset属性防止同个位置多个x轴的重叠。
            type: "value", //坐标轴类型,分别有：
            //'value'-数值轴；'category'-类目轴;
            //'time'-时间轴;'log'-对数轴
            splitLine: { show: false }, //坐标轴在 grid 区域中的分隔线
            axisLabel: { show: false }, //坐标轴刻度标签
            axisTick: { show: false }, //坐标轴刻度
            axisLine: { show: false } //坐标轴轴线
          },
          yAxis: {
            type: "category",
            axisTick: { show: false },
            axisLine: { show: false },
            axisLabel: {
              color: "#333",
              fontSize: 13,
              fontWeight: 700
            },
            data: [this.plan[0].name, this.plan[1].name, this.plan[2].name] //类目数据，在类目轴（type: 'category'）中有效。
            //如果没有设置 type，但是设置了axis.data,则认为type 是 'category'。
          },
          series: [
            //系列列表。每个系列通过 type 决定自己的图表类型
            {
              name: "%", //系列名称
              type: "bar", //柱状、条形图
              barWidth: 19, //柱条的宽度,默认自适应
              data: [
                this.plan[0].progress,
                this.plan[1].progress,
                this.plan[2].progress
              ], //系列中数据内容数组
              label: {
                //图形上的文本标签
                show: true,
                position: "right", //标签的位置
                offset: [0, 0], //标签文字的偏移，此处表示向上偏移40
                formatter: "{c}{a}", //标签内容格式器 {a}-系列名,{b}-数据名,{c}-数据值
                color: "red", //标签字体颜色
                fontSize: 16 //标签字号
              },
              itemStyle: {
                //图形样式
                normal: {
                  //normal 图形在默认状态下的样式;
                  //emphasis图形在高亮状态下的样式
                  barBorderRadius: 10, //柱条圆角半径,单位px.
                  //此处统一设置4个角的圆角大小;
                  //也可以分开设置[10,10,10,10]顺时针左上、右上、右下、左下
                  color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    {
                      offset: 0,
                      color: "#22B6ED"
                    },
                    {
                      offset: 1,
                      color: "#3FE279"
                    }
                  ])
                }
              },
              zlevel: 1 //柱状图所有图形的 zlevel 值,
              //zlevel 大的 Canvas 会放在 zlevel 小的 Canvas 的上面
            },
            {
              name: "进度条背景",
              type: "bar",
              barGap: "-100%", //不同系列的柱间距离，为百分比。
              // 在同一坐标系上，此属性会被多个 'bar' 系列共享。
              // 此属性应设置于此坐标系中最后一个 'bar' 系列上才会生效，
              //并且是对此坐标系中所有 'bar' 系列生效。
              barWidth: 19,
              data: [100, 100, 100],
              color: "#ccc", //柱条颜色
              itemStyle: {
                normal: {
                  barBorderRadius: 10
                }
              }
            }
          ]
        });
      });
    },
    // 2.1水电气折线
    getBroken() {
      this.$nextTick(() => {
        this.mychat2 = echarts.init(document.getElementById("ene1"));
        this.mychat5 = echarts.init(document.getElementById("ene2"));
        this.mychat6 = echarts.init(document.getElementById("ene3"));
        // 绘制图表
        this.mychat2.setOption({
          title: {
            show: true,
            text: `水消耗趋势`,
            textStyle: {
              fontWeight: 400,
              fontSize: 14
            },
            left: "center"
          },
          grid: {
            top: "30%",
            left: "10%",
            right: "5%",
            bottom: "5%",
            containLabe: false
          },
          xAxis: {
            type: "category"
          },
          yAxis: {
            type: "value",
            name: "（单位：m³）",
            nameTextStyle: {
              fontSize: 12,
              align: "center"
            }
          },
          series: [
            {
              data: this.trend.water,
              type: "line",
              color: "orange"
            }
          ]
        });
        this.mychat5.setOption({
          title: {
            show: true,
            text: `电消耗趋势`,
            textStyle: {
              fontWeight: 400,
              fontSize: 14
            },
            left: "center"
          },
          grid: {
            top: "30%",
            left: "10%",
            right: "5%",
            bottom: "5%",
            containLabe: false
          },
          xAxis: {
            type: "category"
          },
          yAxis: {
            type: "value",
            name: "（单位：KW·h）",
            nameTextStyle: {
              fontSize: 12,
              align: "center"
            }
          },
          series: [
            {
              data: this.trend.elect,
              type: "line",
              color: "cyan"
            }
          ]
        });
        this.mychat6.setOption({
          title: {
            show: true,
            text: `气消耗趋势`,
            textStyle: {
              fontWeight: 400,
              fontSize: 14
            },
            left: "center"
          },
          grid: {
            top: "30%",
            left: "10%",
            right: "5%",
            bottom: "5%",
            containLabe: false
          },
          xAxis: {
            type: "category"
          },
          yAxis: {
            type: "value",
            name: "（单位：m³）",
            nameTextStyle: {
              fontSize: 12,
              align: "center"
            }
          },
          series: [
            {
              data: this.trend.gas,
              type: "line",
              color: "pink"
            }
          ]
        });
      });
    },
    // 2.2
    columnar(id) {
      this.$nextTick(() => {
        this.mychat3 = echarts.init(document.getElementById(id));
        // 绘制图表
        this.mychat3.setOption({
          tooltip: {
            trigger: "axis",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data: ["不合格", "合格"],
            top: "20px"
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          xAxis: {
            type: "value"
          },
          yAxis: {
            type: "category",
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
          series: [
            {
              name: "不合格",
              type: "bar",
              stack: "总量",
              color: "#FFD75B",
              label: {
                show: true,
                position: "insideRight"
              },
              data: this.lim.noPass
            },
            {
              name: "合格",
              type: "bar",
              stack: "总量",
              color: "#35A2DA",
              label: {
                show: true,
                position: "insideRight"
              },
              data: this.lim.pass
            }
          ]
        });
      });
    },
    // 3
    wei() {
      this.$nextTick(() => {
        this.mychat4 = echarts.init(document.getElementById("wei"));
        // 绘制图表
        var colors = ["#5793f3", "#d14a61", "#675bba"];

        this.mychat4.setOption({
          color: colors,

          tooltip: {
            trigger: "none",
            axisPointer: {
              type: "cross"
            }
          },
          legend: {
            data: ["出厂货物重量", "入厂货物重量"],
            top: "20px"
          },
          grid: {
            top: 70,
            bottom: 50
          },
          xAxis: [
            {
              type: "category",
              axisTick: {
                alignWithLabel: true
              },
              axisLine: {
                onZero: false,
                lineStyle: {
                  color: colors[1]
                }
              },
              axisPointer: {
                label: {
                  formatter: function(params) {
                    return (
                      "出厂货物重量  " +
                      params.value +
                      (params.seriesData.length
                        ? "：" + params.seriesData[0].data
                        : "")
                    );
                  }
                }
              },
              data: [
                "2019-1",
                "2019-2",
                "2019-3",
                "2019-4",
                "2019-5",
                "2019-6",
                "2019-7",
                "2019-8",
                "2019-9",
                "2019-10",
                "2019-11",
                "2019-12"
              ]
            },
            {
              type: "category",
              axisTick: {
                alignWithLabel: true
              },
              axisPointer: {
                label: {
                  formatter: function(params) {
                    return (
                      "入厂货物重量  " +
                      params.value +
                      (params.seriesData.length
                        ? "：" + params.seriesData[0].data
                        : "")
                    );
                  }
                }
              }
            }
          ],
          yAxis: [
            {
              type: "value",
              name: "（单位：吨）",
              nameTextStyle: {
                fontSize: 14,
                align: "center"
              }
            }
          ],
          series: [
            {
              name: "出厂货物重量",
              type: "line",
              xAxisIndex: 1,
              data: this.lims.outNets
            },
            {
              name: "入厂货物重量",
              type: "line",
              smooth: true,
              data: this.lims.inNets
            }
          ]
        });
      });
    },
    resizeHandle() {
      // 1.1进度条
      this.productionPlan();
      // 渲染折线图
      this.getBroken();
      // 2.2纵向柱状图
      this.columnar("columnar");
      // 第三行
      this.wei();
    }
  },
  mounted() {
    var erd = elementResizeDetectorMaker();
    erd.listenTo(document.getElementById("index"), () => {
      this.$nextTick(() => {
        //使echarts尺寸重置
        // that.$echarts.init(document.getElementById("productionPlan")).resize()
        this.mychat1.resize();
        this.mychat2.resize();
        this.mychat3.resize();
        this.mychat4.resize();
        this.mychat5.resize();
        this.mychat6.resize();
      });
    });
    // window.onresize = () => {
    //   this.mychat.resize();
    // };
    this.resizeHandle();
  }
};
</script>
<style lang='scss' scoped>
.box-quick {
  margin-bottom: 10px;
  margin-left: 10px;
}
.box-quick:hover {
  cursor: pointer;
}
.index {
  padding: 20px !important;
  width: 100%;
  background-color: #eff0f3;
  // background-color: #ccc;
  .row1 {
    display: flex;
    height: 220px;
    .productionPlan,
    .equipment {
      width: 40%;
      border: 1px solid #ccc;
      height: 100%;
      position: relative;
      .box {
        width: 50%;
        box-sizing: border-box;
        border: 10px solid #fff;
        height: 100px;
        float: left;
        .icon_svg {
          width: 35px;
          height: 35px;
          color: #fff;
        }
        .icon {
          height: 50%;
          padding-left: 10px;
          padding-top: 5px;
          .logo {
            height: 0;
            width: 0;
            border-top: 17px solid transparent;
            border-left: 28px solid #fff;
            border-bottom: 17px solid transparent;
          }
        }
        .num {
          height: 25%;
          text-align: right;
          color: #fff;
          padding-right: 10px;
        }
        .type {
          height: 25%;
          text-align: right;
          color: #fff;
          padding-right: 10px;
        }
      }
    }
    .move {
      background-color: #0c991e;
    }
    .stop {
      background-color: #e92e62;
    }
    .off {
      background-color: #520281;
    }
    .await {
      background-color: #ffcd00;
    }
  }
  .productionPlan {
    .bar {
      height: 33.3%;
      padding: 5px 0;
      display: flex;
      .name {
        padding: 0 10px;
      }
      .echart {
        flex: 1;
      }
    }
  }
  .equipment {
    margin: 0 20px;
  }
  .fast {
    position: relative;
    flex: 1;
    border: 1px solid #ccc;
    height: 100%;
    padding-top: 5px;
    .box-quick {
      display: block;
      height: 30px;
      line-height: 30px;
      text-indent: 10px;
      text-align: center;
    }
  }
}
.title {
  height: 20px;
  background: linear-gradient(to bottom, #eff0f3 0%, #ffffff 100%);
  padding: 0 5px;
  position: absolute;
  top: -9px;
  left: 5px;
  z-index: 1;
  // left: -2px;
}
.el-card {
  position: relative;
  overflow: inherit;
  font-size: 14px;
}
.row2 {
  height: 390px;
  display: flex;
  margin-top: 2%;
  position: relative;
  .ene {
    background-color: #fff;
    position: relative;
    flex: 3.4;
    height: 100%;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-sizing: border-box;
    overflow: hidden;
    // overflow: hidden;
    .broken {
      height: 32%;
    }
    .first {
      margin-top: 2%;
    }
  }
  .lims {
    flex: 5;
    height: 100%;
    border: 1px solid #ccc;
    margin-left: 20px;
    position: relative;
    .lims-card {
      height: 100%;
    }
  }
}
.row3 {
  height: 350px;
  margin-top: 2%;
  display: flex;
  .wei {
    flex: 1;
    height: 100%;
    position: relative;
    border: 1px solid #ccc;
    .wei-card {
      height: 100%;
    }
  }
}
.plan {
  top: 14px;
  left: 30px;
  z-index: 1;
}
</style>
<style lang="scss">
.index .el-card__body {
  padding-top: 10px !important;
}
</style>
