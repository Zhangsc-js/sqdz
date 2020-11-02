<template>
  <!-- 头部 -->
  <div class="index" id="index">
    <div class="title">
      <div class="workshop">管件车间</div>
      <div class="Kanban">生产管理看板</div>
      <div class="time">{{currentTime}}</div>
    </div>
    <!-- 主体部分 -->
    <div class="main">
      <!-- 左侧列表 -->
      <ul class="left clearfix">
        <li>
          <span data-name="persons">车间人员:</span>
          <span>{{list.persons}}</span>
        </li>
        <li>
          <span data-name="shiftName">当前班次:</span>
          <span>{{list.shiftName}}</span>
        </li>
        <li>
          <span data-name="shiftTime">班次时间:</span>
          <span>{{list.shiftTime}}</span>
        </li>
        <li>
          <span data-name="qty">本月产量:</span>
          <span>{{list.qty}}</span>
        </li>
        <li>
          <span data-name="rate">成品率:</span>
          <span>{{list.rate}}</span>
        </li>
        <li>
          <span data-name="leader">车间组长:</span>
          <span>{{list.leader}}</span>
        </li>
        <li>
          <span data-name="tel">联系电话:</span>
          <span>{{list.tel}}</span>
        </li>
      </ul>
      <!-- 右侧主体 -->
      <div class="right clearfix">
        <tempSwiper></tempSwiper>
      </div>
    </div>
  </div>
</template>

<script>
import { setRem } from "@/api/ppc/Kanban.js";
import tempSwiper from "./temp-swiper";
import { produceKanban } from "@/api/productionPlanning";
import common from "@/utils/common";
export default {
  name: "kanBan",
  data() {
    return {
      list: {},
      chart: [],
      currentTime: "",
      code: "",
      timer1: ""
    };
  },
  created() {
    produceKanban("A1").then(res => {
      if (res.status === 200) {
        this.list = res.data.data;
        this.chart = JSON.parse(JSON.stringify(res.data.data.list));
        sessionStorage.setItem("list", JSON.stringify(this.chart));
      }
    });
    setInterval(() => {
      this.currentTime = common.timestampToTime(+new Date() / 1000);
    }, 1000);
    this.timer1 = setInterval(() => {
      produceKanban("A1").then(res => {
        if (res.status === 200) {
          this.list = res.data.data;
          this.chart = JSON.parse(JSON.stringify(res.data.data.list));
          sessionStorage.setItem("list", JSON.stringify(this.chart));
        }
      });
    }, 5000 * 60);
  },
  mounted() {
    setRem();
  },
  components: {
    tempSwiper
  },
  beforeDestroy() {
    if (this.timer1) {
      clearInterval(this.timer1);
    }
  }
};
</script>

<style scoped lang='scss'>
.index {
  // padding: .2rem;
  margin: 2% 2% 0 2%;
  height: 95%;
  overflow: hidden;
  .title {
    width: 100%;
    height: 10%;
    border: 1px solid #ccc;
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 0.625rem;
    .workshop,
    .Kanban,
    .time {
      font-size: 1.5rem;
      font-weight: 700;
      padding: 1.25rem;
    }
    .Kanban {
      flex: 1;
      text-align: center;
    }
  }
  .main {
    width: 100%;
    height: 83%;
    margin-top: 2%;
    display: flex;
    ul.left {
      width: 25%;
      border: 1px solid #ccc;
      height: 100%;
      border-radius: 0.625rem;
      li {
        display: flex;
        height: 12.5%;
        span {
          font-size: 1.125rem;
          margin: 0 1.25rem;
        }
        span:nth-child(1) {
          flex: 1;
          text-align: right;
          color: #333;
          font-weight: 700;
        }
        span:nth-child(2) {
          flex: 2;
          text-align: left;
          color: #000;
        }
      }
      li:nth-child(1) {
        margin-top: 16%;
      }
    }
    .right {
      flex: 1;
      height: 100%;
      margin-left: 1.875rem;
      border: 1px solid #ccc;
      box-sizing: border-box;
      margin-bottom: 1.875rem;
      overflow: hidden;
      border-radius: 0.625rem;
    }
  }
  ul,
  li {
    margin: 0;
    padding: 0;
    list-style: none;
  }
}
</style>
