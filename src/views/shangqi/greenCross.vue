<template>
  <!-- 安全绿十字 -->
  <div class="greenCross">
    <!-- 标题 -->
    <div class="title">
      <div class="bigTxt">
        <span>安</span>
        <span>全</span>
        <span>看</span>
        <span>板</span>
      </div>
    </div>
    <!-- 主体盒子 -->
    <div class="mainBox">
      <div class="nine none"></div>
      <div class="nine">
        <div
          class="smallBox"
          v-for="(item,index) in dayArr1"
          :key="index"
          :class="{bgc:hasBgc(item.num)}"
          :style="{backgroundColor:item.color}"
        >{{item.num}}</div>
      </div>
      <div class="nine none"></div>
      <div class="nine">
        <div
          class="smallBox"
          v-for="(item,index) in dayArr2"
          :key="index"
          :class="{bgc:hasBgc(item.num)}"
          :style="{backgroundColor:item.color}"
        >{{item.num}}</div>
      </div>
      <div class="nine">
        <div
          class="smallBox"
          v-for="(item,index) in dayArr3"
          :key="index"
          :class="{bgc:hasBgc(item.num)}"
          :style="{backgroundColor:item.color}"
        >{{item.num}}</div>
      </div>
      <div class="nine">
        <div
          class="smallBox"
          v-for="(item,index) in dayArr4"
          :key="index"
          :class="{bgc:hasBgc(item.num)}"
          :style="{backgroundColor:item.color}"
        >{{item.num}}</div>
      </div>
      <div class="nine none"></div>
      <div class="nine">
        <div
          class="smallBox"
          :class="{bgc:hasBgc(item.num)}"
          v-for="(item,index) in dayArr5"
          :key="index"
          v-show="item.num<=29"
        >{{item.num}}</div>
        <div class="smallBox flex">
          <div
            class="smallBox1"
            v-for="(item,index) in dayArr5"
            :key="index"
            v-show="item.num>29"
            :class="{bgc:hasBgc(item.num)}"
          >{{item.num}}</div>
        </div>
      </div>
      <div class="nine none"></div>
    </div>
    <!-- 标签 -->
    <div class="tip" style="top:20%">
      <div class="left" style="backgroundColor:#0B7257"></div>
      <div class="right" style="color:#0B7257;borderColor:#0B7257">无事故</div>
    </div>
    <div class="tip" style="top:30%">
      <div class="left" style="backgroundColor:red"></div>
      <div class="right" style="color:red;borderColor:red">事故{{sgNum}}起</div>
    </div>

    <div class="tipTxt" style="top:73%">连续安全生产天数:{{consecutiveSafetyOutputDays}}天</div>
    <div class="tipTxt" style="top:80%">投产天数:{{outputDays}}天</div>
    <!-- 年份 -->
    <div class="year" style="left:23%;top:70%">
      <div style="fontSize:20px">年份</div>
      <div class="yearSon">{{year}}</div>
    </div>
    <div class="year" style="left:13%;top:70%">
      <div style="fontSize:20px">月份</div>
      <div class="yearSon">{{month}}</div>
    </div>
    <!-- 左右箭头 -->
    <i class="el-icon-arrow-right changeIcon" style="right:5%" @click="iconRight"></i>
    <i class="el-icon-arrow-left changeIcon" style="left:5%" @click="iconLeft"></i>
  </div>
</template>

<script>
import { safe_production_days } from '@/api/abcd'
export default {
  props: {
    dayArr: {
      type: Array
    },
    requestOption: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      day: [],
      dayArr1: [],
      dayArr2: [],
      dayArr3: [],
      dayArr4: [],
      dayArr5: [],
      year: '',
      month: "",
      day: '',
      sgNum: 0,
      nowMonth: '',
      nowYear: '',
      todayProductionStatus: '',
      outputDays: '', //投产
      consecutiveSafetyOutputDays: ''
    }
  },
  created() {
    this.year = (new Date).getFullYear()
    this.month = (new Date).getMonth() + 1
    this.day = (new Date).getDate()
    this.nowMonth = (new Date).getMonth() + 1
    this.nowYear = (new Date).getFullYear()

    this.init()
  },
  methods: {
    async init() {
      for (let i = 1; i <= 31; i++) {
        if (i <= 6) {
          this.dayArr1.push({
            num: i,
            // color: 'red'
          })
        } else if (i == 7 || i == 8 || i == 13 || i == 14 || i == 19 || i == 20) {
          this.dayArr2.push({
            num: i,
          })
        } else if (i == 9 || i == 10 || i == 15 || i == 16 || i == 21 || i == 22) {
          this.dayArr3.push({
            num: i
          })
        } else if (i == 11 || i == 12 || i == 17 || i == 18 || i == 23 || i == 24) {
          this.dayArr4.push({
            num: i
          })
        } else if (i >= 25) {
          this.dayArr5.push({
            num: i
          })
        }
      }
      let res = await safe_production_days({ ...this.requestOption })
      //   console.log(res)
      if (res.data.success) {
        this.todayProductionStatus = res.data.data.todayProductionStatus
        this.outputDays = res.data.data.outputDays
        this.consecutiveSafetyOutputDays = res.data.data.consecutiveSafetyOutputDays
      }
    },
    iconLeft() {
      if (this.month > 1) {
        this.month--
      } else {
        this.month = 12
        this.year--
      }
      if (this.year == '2019' && this.month < 11) {
        this.month = 11
      }
      if (this.month < 10) this.month = '0' + this.month
      this.$listeners.anquan(this.year + '-' + this.month)
    },
    iconRight() {
      if (this.month < 12) {
        this.month++
      } else {
        this.month = 1
        this.year++
      }
      if (this.month > this.nowMonth && this.nowYear == this.year) this.month = this.nowMonth
      if (this.month < 10) this.month = '0' + this.month
      this.$listeners.anquan(this.year + '-' + this.month)
    }
  },
  computed: {
    hasBgc(num) {
      return function (num) {
        if (this.year == this.nowYear && this.month == this.nowMonth && num < this.day) {
          return true
        }
        if (this.year == '2019' && this.month == '11' && num < 8) {
          return false
        }
        if (this.year == this.nowYear && this.month < this.nowMonth) {
          return true
        }
        if (this.year < this.nowYear) {
          return true
        }

        return false
      }
    }
  },
  watch: {
    dayArr: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val.length > 0) {
          this.$nextTick(() => {
            let newArr = JSON.parse(JSON.stringify(this.dayArr))
            newArr = newArr.map(item => {
              return item.split('-')[2]
            })
            this.sgNum = newArr.length
            newArr.forEach(item => {
              this.dayArr1.forEach(v => {
                if (v.num == item) {
                  this.$set(v, 'color', 'red')
                }
              })
              this.dayArr2.forEach(v => {
                if (v.num == item) {
                  this.$set(v, 'color', 'red')
                }
              })
              this.dayArr3.forEach(v => {
                if (v.num == item) {
                  this.$set(v, 'color', 'red')
                }
              })
              this.dayArr4.forEach(v => {
                if (v.num == item) {
                  this.$set(v, 'color', 'red')
                }
              })
              this.dayArr5.forEach(v => {
                if (v.num == item) {
                  this.$set(v, 'color', 'red')
                }
              })
            })
          })
        }
      }
    },
  }
}
</script>

<style scoped lang='scss'>
.greenCross {
  padding: 20px;
  background-color: #0c3b4e;
}
.title {
  display: flex;
  color: #fff;
  justify-content: center;
  align-items: baseline;
  font-size: 20px;
  position: relative;
  top: -30px;
  .bigTxt {
    margin-right: 30px;
    font-weight: 700;
    font-size: 40px;
    span {
      margin: 0 10px;
    }
  }
}
.engTit {
  color: #0b7257;
  text-align: center;
  font-size: 30px;
  position: relative;
  top: -10px;
}
.mainBox {
  width: 80%;
  height: 600px;
  margin: 20px auto;
  display: flex;
  flex-wrap: wrap;
  .nine {
    width: 33.3%;
    height: 33.3%;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    background-color: #000a14;

    .smallBox {
      box-sizing: border-box;
      border: 1px solid #fff;
      //   width: 120px;
      width: 50%;
      height: 33.3%;
      //   background-color: pink;
      font-size: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #ffff;
      font-weight: 700;
    }
    .smallBox.flex {
      display: flex;
      border: 0;
    }
    .smallBox1 {
      width: 50%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #ffff;
      font-weight: 700;
      border: 1px solid #fff;
    }
  }
  .none {
    opacity: 0;
  }
}
.tip {
  width: 155px;
  height: 50px;
  display: flex;
  position: absolute;
  left: 12%;
  .left {
    width: 35px;
    height: 50px;
    background-color: pink;
  }
  .right {
    width: 120px;
    height: 50px;
    box-sizing: border-box;
    border: 1px solid pink;
    font-size: 20px;
    text-align: center;
    line-height: 48px;
  }
}
.tipTxt {
  position: absolute;
  color: #fff;
  font-size: 24px;
  right: 5%;
  width: 30%;
  text-align: left;
}
.year {
  position: absolute;
  top: 0;
  left: 0;
  color: #fff;
  font-size: 30px;
  line-height: 50px;
  text-align: center;
  .yearSon {
    background-color: #000;
    padding: 0 10px;
  }
}
.bgc {
  background-color: #0b7257;
}
.changeIcon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 40px;
  cursor: pointer;
}
</style>
