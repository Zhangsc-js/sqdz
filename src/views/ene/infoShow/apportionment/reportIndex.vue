<template>
  <div class="tableshadow reportIndex" style="height:100%" :key="appKey">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="电" name="elect"></el-tab-pane>
      <el-tab-pane label="水" name="water"></el-tab-pane>
      <el-tab-pane label="气" name="gas"></el-tab-pane>
    </el-tabs>
    <div class="mainBox">
      <el-aside width="250px" style="height: 100%">
        <el-tree
          :data="treeData"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          accordion
          highlight-current
          @node-click="handleNodeClick"
          style="height:100%"
          ref="tree"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <i
              class="el-icon-stopwatch"
              v-if="data.isElect==1"
              :class="{red:data.isReal!=1}"
              style="font-size:14px"
            ></i>
            <i
              class="el-icon-timer"
              v-else-if="data.isWater==1"
              :class="{red:data.isReal!=1}"
              style="font-size:14px"
            ></i>
            <i
              class="el-icon-odometer"
              v-else-if="data.isGas==1"
              :class="{red:data.isReal!=1}"
              style="font-size:14px"
            ></i>
            <i class="el-icon-folder" v-else style="font-size:14px"></i>
            <span style="font-size:14px">{{ node.label }}</span>
            <!-- <span>
              <el-button type="text" size="mini" @click="() => append(data)">Append</el-button>
              <el-button type="text" size="mini" @click="() => remove(node, data)">Delete</el-button>
            </span>-->
          </span>
        </el-tree>
      </el-aside>
      <el-main style="height: 100%">
        <!-- 表单 -->
        <el-form inline>
          <el-row>
            <el-form-item>
              <el-radio-group
                size="medium"
                v-model="dateType"
                class="date-radio"
                @change="changDate"
              >
                <el-radio-button label="day">日</el-radio-button>
                <el-radio-button label="month">月</el-radio-button>
                <el-radio-button label="year">年</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <!--//=========================================日================================-->
            <el-form-item>
              <el-date-picker
                v-show="flagDay"
                class="dataSelect"
                :clearable="false"
                v-model="date"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="日期"
              ></el-date-picker>
            </el-form-item>
            <!--//=========================================月================================-->
            <el-form-item>
              <el-date-picker
                :clearable="false"
                v-show="flagMonth"
                v-model="date"
                type="month"
                value-format="yyyy-MM-dd"
                placeholder="选择月"
              ></el-date-picker>
            </el-form-item>
            <!--//=========================================年================================-->
            <el-form-item>
              <el-date-picker
                :clearable="false"
                v-show="flagYear"
                type="year"
                value-format="yyyy"
                placeholder="选择年"
                v-model="date"
              ></el-date-picker>
            </el-form-item>
            <!--//=========================================================================-->
            <!-- <el-form-item label="能源类型:">
              <el-select v-model="energyType" value="selectValue" placeholder="能源类型">
                <el-option
                  v-for="item in eneType"
                  :key="item.code"
                  :label="item.label"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>-->
            <!-- <el-form-item>
              <el-button
                class="queryInfo"
                type="primary"
                icon="el-icon-search"
                @click="findReportInfo"
              >查询</el-button>
            </el-form-item>-->
          </el-row>
        </el-form>

        <!-- 信息列表 -->
        <!--                <el-table-->
        <!--                    class="infoTable"-->
        <!--                    :data="tableData"-->
        <!--                    border-->
        <!--                    :summary-method="getSummaries"-->
        <!--                    :row-class-name="tableRowClassName"-->
        <!--                    show-summary-->
        <!--                    style="width:100%;"-->
        <!--                >-->
        <!--                    <el-table-column width="120" type="index" label="ID"></el-table-column>-->
        <!--                    <el-table-column width="130" label="查询时间">-->
        <!--                        <template>{{showDate}}</template>-->
        <!--                    </el-table-column>-->
        <!--                    <el-table-column min-width="200" prop="name" label="计量名称"></el-table-column>-->
        <!--                    <el-table-column min-width="200" prop="value" :label="tableColumn"></el-table-column>-->
        <!--                </el-table>-->
        <div :id="electChart" style="width:100%;height:550px"></div>
      </el-main>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import {
  getEneDevTree,
  getReportByPproccodeInDay,
  getReportByPproccodeInMonth,
  getReportByPproccodeInYear,
  getReportByPproccodeInClass,
  getAllEneType
} from "@/api/energy";
// import {simpleDateFormat} from "@/utils/index";

export default {
  name: "reportIndex",
  components: {},
  data() {
    let date1 = new Date();
    let year1 = date1.getFullYear();
    let month1 =
      year1 +
      (date1.getMonth() < 10
        ? "-0" + (date1.getMonth() + 1)
        : "-" + date1.getMonth());
    let day1 =
      month1 +
      (date1.getDate() < 10 ? "-0" + date1.getDate() : "-" + date1.getDate());
    let end = new Date(
      new Date(new Date().toLocaleDateString()).getTime() +
        24 * 60 * 60 * 1000 -
        1
    );
    let start = new Date(new Date(new Date().toLocaleDateString()).getTime());
    return {
      defaultExpanded: [],
      isShowfixed: false,
      appKey: "",
      treeData: [],
      eneType: [],
      isElect: 1,
      isWater: "",
      isGas: "",
      isMeter: "",
      energyType: "elect",
      tableData: [],
      date: day1,
      endDate: day1,
      classDate: [start, end],
      showDate: year1,
      flagDay: false,
      flagMonth: true,
      flagClass: false,
      flagYear: false,
      electChart: "elect",
      treeOne: {},
      dateType: "month",
      tableColumn: "消耗数据",
      selectDate: "",
      xTitleElect: [],
      yDataElect: [],
      nTitle: [],
      xText: "",
      mountedData: {
        pcode: "021"
      },
      activeName: "elect"
    };
  },
  mounted() {
    this.initMounted();
    // this.drawLine();
    getAllEneType()
      .then(response => {
        if (response.data.success) {
          this.eneType = response.data.data;
        } else {
          this.$message.error(response.data.message);
        }
      })
      .catch(e => {
        this.$message.error(e.message);
      });
    // this.handleNodeClick(this.mountedData);
    // this.findReportInfo();
  },
  methods: {
    drawLine() {
      console.log(9);
      let elect = echarts.init(document.getElementById(this.electChart));
      elect.setOption({
        title: {
          text: this.xText
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: this.nTitle
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            dataView: { readOnly: false },
            magicType: { show: true, type: ["bar", "line"] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.xTitleElect
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: this.nTitle[0],
            type: "line",
            data: this.yDataElect,
            smooth: true
          }
        ]
      });
    },
    // 切换tab页
    handleClick() {
      this.initMounted();
    },
    //加载树型结构
    getEneDevTree() {
      const params = {
        isElect: this.isElect,
        isWater: this.isWater,
        isGas: this.isGas,
        isMeter: this.isMeter
      };
      getEneDevTree(params)
        .then(res => {
          if (res.data.success) {
            this.treeData = res.data.data;
            this.treeOne = this.treeData[0];
            this.$nextTick(() => {
              this.$refs.tree.setCurrentKey(this.treeData[0].id);
              //   this.drawLine();
              this.findReportInfoByCode(this.treeOne.label, this.treeOne.code);
            });
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    //点击树，调用该方法,参数为节点对象
    handleNodeClick(data) {
      this.treeOne = data;
      if (this.date !== "") {
        //设置好时间展示时间
        this.showDate = this.date;
        // if (this.flagDay) {
        //   this.showDate = simpleDateFormat(
        //     new Date(this.showDate),
        //     "yyyy-MM-dd"
        //   );
        // } else if (this.flagMonth) {
        //   this.showDate = simpleDateFormat(new Date(this.showDate), "yyyy-MM");
        // } else if (this.flagYear) {
        //   this.showDate = simpleDateFormat(new Date(this.showDate), "yyyy");
        // }
      }
      this.findReportInfoByCode(data.label, data.code);
    },
    //点击查询
    findReportInfo() {
      if (this.treeOne.id === undefined) {
        this.$message.warning("请先选择一项左侧设备");
        return;
      }
      if (this.energyType === "elect") {
        this.isElect = 1;
        this.isWater = "";
        this.isGas = "";
        this.energyType = "elect";
        this.tableColumn = "用电量(kWh)";
        // this.tableColumn2 = "分摊用电量(kWh)";
      } else if (this.energyType === "water") {
        this.isElect = "";
        this.isWater = 1;
        this.isGas = "";
        this.energyType = "water";
        this.tableColumn = "用水量(m³)";
        // this.tableColumn2 = "分摊用水量(m³)";
      } else if (this.energyType === "gas") {
        this.isElect = "";
        this.isWater = "";
        this.isGas = 1;
        this.energyType = "gas";
        this.tableColumn = "用气量(m³)";
        // this.tableColumn2 = "分摊用气量(m³)";
      }
      this.handleNodeClick(this.treeOne);
    },
    //查询该树的某一报表信息
    findReportInfoByCode(name, code) {
      if (this.energyType === "") {
        this.$message.error("请选择能源类型");
        return;
      }
      let params = {};
      //日
      if (this.flagDay) {
        params = {
          proccode: code,
          hourInfo: this.date,
          energyType: this.energyType
        };
        if (this.energyType === "elect") {
          this.xText = "电(kWh)";
        } else if (this.energyType === "water") {
          this.xText = "水(m³)";
        } else if (this.energyType === "gas") {
          this.xText = "气(m³)";
        }
        this.xTitleElect = [
          "00时",
          "01时",
          "02时",
          "03时",
          "04时",
          "05时",
          "06时",
          "07时",
          "08时",
          "09时",
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
        ];
        this.nTitle[0] = name;
        getReportByPproccodeInDay(params)
          .then(res => {
            if (res.data.success) {
              this.yDataElect = res.data.data;
              return;
            }
            this.$message.error(res.data.message);
          })
          .catch(e => {
            this.$message.error(e.message);
          });
        this.drawLine();
      }
      //月
      else if (this.flagMonth) {
        params = {
          proccode: code,
          energyType: this.energyType,
          hourInfo: this.date.split("-")[0] + "-" + this.date.split("-")[1]
        };
        if (this.energyType === "elect") {
          this.xText = "电(kWh)";
        } else if (this.energyType === "water") {
          this.xText = "水(m³)";
        } else if (this.energyType === "gas") {
          this.xText = "气(m³)";
        }
        this.xTitleElect = [];
        let now = new Date();
        let days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        console.log(days);
        for (let i = 1; i <= days; i++) {
          let day = "";
          if (i < 10) {
            day = "0" + i + "日";
          } else {
            day = i + "日";
          }
          this.xTitleElect.push(day);
        }
        this.nTitle[0] = name;
        getReportByPproccodeInMonth(params)
          .then(res => {
            if (res.data.success) {
              this.yDataElect = res.data.data;
              return;
            }
            this.$message.error(res.data.message);
          })
          .catch(e => {
            this.$message.error(e.message);
          });
        this.drawLine();
      }
      //年
      else if (this.flagYear) {
        params = {
          proccode: code,
          energyType: this.energyType,
          hourInfo: this.date.split("-")[0]
        };
        if (this.energyType === "elect") {
          this.xText = "电(kWh)";
        } else if (this.energyType === "water") {
          this.xText = "水(m³)";
        } else if (this.energyType === "gas") {
          this.xText = "气(m³)";
        }
        this.xTitleElect = [];
        for (let i = 1; i <= 12; i++) {
          this.xTitleElect.push(i + "月");
        }
        this.nTitle[0] = name;
        getReportByPproccodeInYear(params)
          .then(res => {
            if (res.data.success) {
              this.yDataElect = res.data.data;
              return;
            }
            this.$message.error(res.data.message);
          })
          .catch(e => {
            this.$message.error(e.message);
          });
        this.drawLine();
      }
      //班
      else if (this.flagClass) {
        if (this.classDate === null) {
          this.$message.error("请先选择时间选项");
          return;
        }
        params = {
          name: name,
          proccode: code,
          energyType: this.energyType,
          //   start: simpleDateFormat(this.classDate[0], "yyyy-MM-dd HH:mm:ss"),
          //   end: simpleDateFormat(this.classDate[1], "yyyy-MM-dd HH:mm:ss"),
          code: this.shiftCode
        };

        getReportByPproccodeInClass(params)
          .then(res => {
            if (res.data.success) {
              this.tableData = res.data.data;
              return;
            }
            this.$message.error(res.data.message);
          })
          .catch(e => {
            this.$message.error(e.message);
          });
      }
    },
    //最后一行求和
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "子设备总计";
          return;
        }
        // 从第二个开始
        let data2 = data.slice(1, data.length);
        const values = data2.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] = sums[index].toFixed(2);
        } else {
          sums[index] = "";
        }
      });
      return sums;
    },
    //更改样式
    // tableRowClassName({row, rowIndex}) {
    //     if (rowIndex === 0) {
    //         return "warning-row";
    //     }
    //     return "";
    // },
    //mounted初始化方法
    initMounted() {
      if (this.activeName === "elect") {
        this.isElect = 1;
        this.isWater = "";
        this.isGas = "";
        this.energyType = "elect";
        this.tableColumn = "用电量(kWh)";
        // this.tableColumn2 = "分摊用电量(kWh)";
      } else if (this.activeName === "water") {
        this.isElect = "";
        this.isWater = 1;
        this.isGas = "";
        this.energyType = "water";
        this.tableColumn = "用水量(m³)";
        // this.tableColumn2 = "分摊用水量(m³)";
      } else if (this.activeName === "gas") {
        this.isElect = "";
        this.isWater = "";
        this.isGas = 1;
        this.energyType = "gas";
        this.tableColumn = "用气量(m³)";
        // this.tableColumn2 = "分摊用气量(m³)";
      }
      this.treeData = [];
      this.tableData = [];
      this.getEneDevTree();
    },
    //单击选择年月日班
    changDate(date) {
      this.tableData = [];
      // this.clearDate();
      let date1 = new Date();
      let year1 = date1.getFullYear();
      let month1 = year1 + "-" + (date1.getMonth() + 1);
      let day1 = month1 + "-" + date1.getDate();
      if (date === "day") {
        this.flagDay = true;
        this.flagMonth = false;
        this.flagYear = false;
        this.flagClass = false;
        this.showDate = day1;
      } else if (date === "month") {
        this.flagDay = false;
        this.flagMonth = true;
        this.flagYear = false;
        this.flagClass = false;
        this.showDate = month1;
      } else if (date === "year") {
        this.flagDay = false;
        this.flagMonth = false;
        this.flagYear = true;
        this.flagClass = false;
        this.showDate = year1;
      } else if (date === "classes") {
        this.flagDay = false;
        this.flagMonth = false;
        this.flagYear = false;
        this.flagClass = true;
      }
      this.findReportInfo();
    },
    //查询班次
    /*  findSchedulList() {
                  getSchedulList().then(res => {
                    if (res.data.success) {
                      this.schedulData = res.data.data.result;
                      return;
                    }
                    this.$message.error(res.data.message);
                  }).catch(e => {
                    this.$message.error(e.message);
                  });
                },*/
    formatter(row) {
      if (typeof row.proRataShare === "number")
        return (row.proRataShare * 100).toFixed(2) + "%";
      return row.proRataShare;
    }
  },
  // watch: {
  //   // 利用watch方法检测路由变化：
  //   $route: function (to) {
  //     if (to.meta.report) {
  //       //查看report是否是展示页面
  //       // 拿到目标参数 to.path 去再次请求数据接口
  //       this.appKey = new Date().getTime();
  //       this.energyType = to.path.split("/")[2];
  //       this.initMounted();
  //     }
  //   }
  // }
  watch: {
    yDataElect: {
      deep: true,
      handler() {
        this.drawLine();
      }
    },
    xTitleElect: {
      deep: true,
      handler() {
        this.drawLine();
      }
    },
    nTitle: {
      deep: true,
      handler() {
        this.drawLine();
      }
    },
    xText: {
      deep: true,
      handler() {
        this.drawLine();
      }
    },
    date: {
      immediate: false,
      handler() {
        this.initMounted();
      }
    }
  }
};
</script>

<style scoped lang='scss'>
.red {
  color: red;
}
.span {
  display: inline-block;
  width: 120px;
}
.date {
  position: relative;
  width: 100%;
  height: 1px;
  background-color: #ccc;
  margin: 20px 0;

  .showDate {
    width: 100px;
    height: 30px;
    background-color: #fff;
    position: absolute;
    top: -9px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    color: #333;
    font-size: 14px;
  }
}

.tip {
  font-size: 14px;
  color: #333;
  margin-left: 12px;
}

.infoTable {
  padding-bottom: 50px;
  overflow: auto;
}

.queryInfo {
  margin: 0;
  margin-left: 20px;
}
.mainBox {
  display: flex;
  height: calc(100% - 2px);
  padding-top: 39px;
}
</style>
<style>
.tableshadow .el-table__footer-wrapper {
  display: block;
  position: fixed;
  bottom: 0px;
  height: 35px;
  z-index: 999;
}

.tableshadow .el-table .warning-row {
  background: WhiteSmoke;
}

.tableshadow .data-v-1b00f289 {
  height: 20%;
}

.reportIndex .el-date-editor.el-range-editor.el-input__inner {
  width: auto;
}
.reportIndex .el-tabs {
  height: 0;
}
</style>
