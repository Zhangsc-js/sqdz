<template>
  <!-- 展示页 -->
  <div class="face" style="height:100%">
    <el-container style="height:100%">
      <el-container style="height:100%">
        <el-aside width="250px" class="aside">
          <el-menu
            class="el-menu-vertical-demo"
            background-color="#298ED1"
            text-color="#fff"
            active-text-color="#3CB7C7"
            style="height:100%"
          >
            <el-menu-item index="11">
              <p class="font" slot="title">吴先生--捷创技术(调度)</p>
            </el-menu-item>
            <el-menu-item index="12">
              <i class="el-icon-message-solid icon"></i>
              <i class="el-icon-user-solid icon"></i>
              <i class="el-icon-s-tools icon"></i>
              <i class="el-icon-s-unfold icon"></i>
            </el-menu-item>
            <el-menu-item index="1">
              <i
                class="el-icon-warning-outline"
                style="width: 50px;height: 50px;font-size: 50px;color:#fff"
              ></i>
              <span slot="title" style="font-size:18px">陕A00582即将超时</span>
            </el-menu-item>
            <el-menu-item index="2">
              <i
                class="el-icon-menu"
                style="width: 20px;height: 20px;font-size: 20px;color:#fff;margin:5px 10px 0 30px"
              ></i>
              <span slot="title" style="font-size:18px;font-weight:700">工作台</span>
            </el-menu-item>
            <el-menu-item index="3">
              <i
                class="el-icon-document"
                style="width: 20px;height: 20px;font-size: 20px;color:#fff;margin:5px 10px 0 30px"
              ></i>
              <span slot="title" style="font-size:18px;font-weight:700">在途管理</span>
            </el-menu-item>
            <el-menu-item index="4">
              <i
                class="el-icon-setting"
                style="width: 20px;height: 20px;font-size: 20px;color:#fff;margin:5px 10px 0 30px"
              ></i>
              <span slot="title" style="font-size:18px;font-weight:700">全部派单</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <div class="row1">
            <div class="wei">
              <div class="title">运力与需求概览</div>
              <ul>
                <li>在途：512</li>
                <li>装车：112</li>
                <li>排队：1125</li>
                <li>空闲：1511</li>
              </ul>
              <el-card class="wei-card" id="wei"></el-card>
            </div>
          </div>
          <div class="row1">
            <div class="wei" style="padding:20px">
              <div class="title">在途车辆监控</div>
              <el-card class="wei-card map" id="map">
                <div style="display:flex;justify-content:space-between">
                  <div>
                    <span>在途车辆监控</span>
                    <el-checkbox style="margin-left:20px">只看异常</el-checkbox>
                  </div>
                  <div style="display:flex">
                    <div>
                      <span class="circle"></span>
                      <span>上报</span>
                    </div>
                    <div>
                      <span class="circle orange"></span>
                      <span>即将超时</span>
                    </div>
                    <div>
                      <span class="circle hui"></span>
                      <span>超时</span>
                    </div>
                    <div>
                      <span class="circle lime"></span>
                      <span>认可</span>
                    </div>
                  </div>
                </div>
                <div class="input">
                  <el-input></el-input>
                  <div class="position">
                    <i class="el-icon-arrow-down"></i>
                    <span>当前全部项目与线路</span>
                  </div>
                </div>
                <!-- <i class="el-icon-truck car"></i> -->
                <svg-icon icon-class="face_car" class="icon_svg car" />
              </el-card>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  created() {
    this.wei();
  },
  methods: {
    wei() {
      this.$nextTick(() => {
        this.mychat3 = echarts.init(document.getElementById("wei"));
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
            data: ["在途", "装车", "排队", "空闲"],
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
            data: ["17.5米", "9.5米", "6.5米"],
            name: "车辆类型"
          },
          series: [
            {
              name: "在途",
              type: "bar",
              stack: "总量",
              color: "#61A0A8",
              label: {
                show: true,
                position: "insideRight"
              },
              data: [150, 168, 194]
            },
            {
              name: "装车",
              type: "bar",
              stack: "总量",
              color: "#D48265",
              label: {
                show: true,
                position: "insideRight"
              },
              data: [36, 31, 45]
            },
            {
              name: "排队",
              type: "bar",
              stack: "总量",
              color: "#C23531",
              label: {
                show: true,
                position: "insideRight"
              },
              data: [346, 435, 344]
            },
            {
              name: "空闲",
              type: "bar",
              stack: "总量",
              color: "#7CD9DB",
              label: {
                show: true,
                position: "insideRight"
              },
              data: [511, 467, 533]
            }
          ]
        });
      });
    }
  }
};
</script>

<style lang='scss' scoped>
.face {
  .aside {
    height: 100%;
    margin: 0 !important;
    background-color: #eff0f3;
  }
}
.el-menu-item {
  height: 12%;
  font-size: 18px;
  border-bottom: 1px solid #269aff;
}
.el-menu-item:first-child {
  height: 15%;
}
.icon {
  color: #fff;
  display: inline-block;
  width: 25%;
  text-align: center;
  font-size: 18;
}
.font {
  font-size: 18px;
}
.el-main {
  height: 100%;
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
.row1 {
  height: 48%;
  margin-top: 2%;
  display: flex;
  margin: 1% 0;
  .wei {
    flex: 1;
    height: 100%;
    display: flex;
    position: relative;
    border: 1px solid #ccc;
    ul {
      width: 25%;
      height: 100%;
      li {
        height: 20%;
        line-height: 20%;
        list-style: none;
        color: #333;
        font-weight: 700;
        font-size: 20px;
      }
      li:first-child {
        margin-top: 13%;
      }
    }
    .wei-card {
      height: 100%;
      flex: 1;
    }
  }
}
.map {
  background: url("./map.png") center no-repeat no-repeat;
  position: relative;
}
.circle {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid red;
  background-color: red;
  margin-left: 15px;
}
.orange {
  border: 2px solid orange;
  background-color: orange;
}
.hui {
  border: 2px solid rgb(128, 128, 128);
  background-color: rgb(128, 128, 128);
}
.lime {
  border: 2px solid lime;
  background-color: lime;
}
.input {
  margin-top: 20px;
  height: 50px;
  position: relative;
  .el-input {
    height: 100%;
  }
  .position {
    position: absolute;
    top: 17px;
    left: 10px;
  }
}
.car {
  font-size: 35px;
  color: blue;
  position: absolute;
  top: 180px;
  left: 390px;
}
</style>
<style lang="scss">
.face li {
  padding-top: 10px;
}
.face .el-checkbox__label {
  font-size: 16px;
  color: #333;
}
.face .el-input__inner {
  height: 100%;
  line-height: 100%;
}
</style>
