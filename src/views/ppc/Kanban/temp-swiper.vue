<template>
  <swiper
    :options="swiperOption"
    style="width:100%;height:100%"
  >
    <!-- slides -->
    <swiper-slide v-for="(item,index) in res" :key="index" style="height:100%">
      <div class="section" v-for="item in res[index]" :key="item.ppno">
        <!-- 小按钮 -->
        <div class="smallbtn">{{item.statusName}}</div>
        <p>{{item.ppNo}}</p>
        <div class="data">
          <span>日期：</span>
          <span>{{item.startDate}}~{{item.endDate}}</span>
        </div>
        <div class="matter">
          <span>物料：</span>
          <span>{{item.materialName}}</span>
        </div>
        <div :id="item.ppNo" class="chart"></div>
      </div>
    </swiper-slide>
    <div class="swiper-pagination" slot="pagination"></div>
  </swiper>
</template>

<script>
import "swiper/dist/css/swiper.css";
import { swiper, swiperSide } from "vue-awesome-swiper";
import { produceKanban } from "@/api/productionPlanning";
import echarts from "echarts";
import { log } from "util";
export default {
  components: {
    swiper,
    swiperSide
  },
  props: ["chart"],
  data() {
    return {
      swiperOption: {
        pagination: {
          el: ".swiper-pagination",
          clickable: true // 允许点击小圆点跳转,
        },
        autoplay: {
          delay: 60000,
          stopOnLastSlide: false,
          disableOnInteraction: true
        }
      },
      list: [],
      // 二维数组
      res: []
    };
  },
  async created() {
    this.list = JSON.parse(sessionStorage.getItem("list"));
    if (!this.list) {
      const res = await produceKanban("A1");
      this.list = res.data.data.list;
      sessionStorage.setItem("list", JSON.stringify(res.data.data.list));
    }
  },
  methods: {
    getcharts(id, index) {
      this.$nextTick(() => {
        let goodQty = this.list[index].goodQty;
        let planQty = this.list[index].planQty;
        let chart1 = echarts.init(document.getElementById(id));
        // 绘制图表
        chart1.setOption({
          dataset: {
            source: [
              ["score", "amount", "product"],
              [100, goodQty, "合格:"],
              [1, planQty, "计划:"]
            ]
          },
          textStyle: {
            color: "#000"
          },
          backgroundColor: "white",
          height: this.fontSize(6),
          width: this.fontSize(25),
          grid: {
            containLabel: true,
            top: 0,
            bottom: 0,
            left: this.fontSize(4.5)
          },
          xAxis: {
            name: "",
            axisLine: {
              lineStyle: {
                color: "#ccc"
              }
            }
          },
          yAxis: {
            type: "category",
            axisLine: {
              lineStyle: {
                color: "#ccc"
              }
            },
            axisLabel: {
              fontSize: this.fontSize(1.05)
            }
          },
          visualMap: {
            show: false,
            orient: "horizontal",
            left: "center",
            min: 1,
            max: this.fontSize(6.25),
            text: ["High Score", "Low Score"],
            // Map the score column to color
            dimension: 0,
            inRange: {
              color: ["#1890FF", "#FAAD14"]
            }
          },
          series: [
            {
              type: "bar",
              encode: {
                // Map the "amount" column to X axis.
                x: "amount",
                // Map the "product" column to Y axis
                y: "product"
              }
            }
          ]
        });
      });
      this.$nextTick(() => {
        // 决定颜色
        let box = document.getElementsByClassName("smallbtn");
        for (var i = 0; i < box.length; i++) {
          if (box[i].innerText === "派工中") {
            box[i].style.backgroundColor = "#1890FF";
          } else if (box[i].innerText === "已开工") {
            box[i].style.backgroundColor = "#52C41A";
          } else {
            box[i].style.backgroundColor = "#E1E120";
          }
        }
      });
    },
    fontSize(res) {
      let docEl = document.documentElement,
        clientWidth =
          window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth;
      if (!clientWidth) return;
      let fontSize = 16 * (clientWidth / 1920);
      return res * fontSize;
    },
    // slideNextTransitionEnd() {
    //   this.list.forEach(item => {
    //     // 渲染echarts图
    //     this.getcharts(item.ppNo);
    //   });
    //   // this.getcharts('pp128');
    // }
  },
  watch: {
    list: {
      deep: true,
      handler(newVal) {
        if (newVal) {
          let len = this.list.length;
          let lineNum = len % 4 === 0 ? len / 4 : Math.ceil(len / 4);
          for (let i = 0; i < lineNum; i++) {
            let temp = this.list.slice(i * 4, i * 4 + 4);
            this.res.push(temp);
          }
          this.res = JSON.parse(JSON.stringify(this.res));

          this.list.forEach((item, index) => {
            // 渲染echarts图
            this.getcharts(item.ppNo, index);
          });
          // 决定颜色
        }
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.section {
  width: 50%;
  float: left;
  box-sizing: border-box;
  height: 50%;
  position: relative;
  .smallbtn {
    position: absolute;
    padding: 5px;
    // border: 1px solid #000;
    top: 19px;
    left: 85%;
    color: #fff;
    font-weight: 700;
  }
  p {
    margin: 1.2rem 0;
    padding: 0;
    width: 100%;
    text-align: center;
    font-weight: 700;
    font-size: 1.5rem;
  }
  .data,
  .matter {
    line-height: 2.5rem;
    display: flex;
    font-size: 1.125rem;
    span:nth-child(1) {
      color: #333;
      width: 20%;
      text-align: right;
    }
    span:nth-child(2) {
      color: #000;
      flex: 1;
    }
  }
  .chart,
  .chart,
  .chart,
  .chart {
    height: 50%;
    overflow: hidden;
  }
}
.section:nth-child(1) {
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}
.section:nth-child(2) {
  border-bottom: 1px solid #ccc;
}
.section:nth-child(3) {
  border-right: 1px solid #ccc;
}
</style>
