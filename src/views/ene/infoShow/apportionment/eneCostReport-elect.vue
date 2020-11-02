<template>
  <el-main id="elect" class="tableshadow">
    <el-form :inline="true" :model="dayForm" class="demo-form-inline" ref="dayForm">
      <el-form-item>
        <el-radio-group size="medium" v-model="dateType" class="date-radio" @change="changDate">
          <el-radio-button label="day">日</el-radio-button>
          <el-radio-button label="month">月</el-radio-button>
          <el-radio-button label="year">年</el-radio-button>
        </el-radio-group>
      </el-form-item>
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

      <el-form-item>
        <el-date-picker
          :clearable="false"
          v-show="flagMonth"
          v-model="date"
          type="month"
          value-format="yyyy-MM"
          placeholder="选择月"
        ></el-date-picker>
      </el-form-item>

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
      <el-form-item label="能源类型">
        <el-select v-model="dayForm.energyType" style="height:auto;margin-bottom:0px;" filterable>
          <el-option
            v-for="item in energyTypeData"
            :key="item.value"
            :label="item.label"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="车间/产线">
        <el-input v-model="pprocName" readonly @click.native="selectPProccode"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          :disabled="dayDisabled"
          icon="el-icon-search"
          type="primary"
          @click="submitSearch()"
        >查询</el-button>
      </el-form-item>
    </el-form>
    <div :id="chartName" class="chartBox"></div>
    <el-table
      class="elect"
      :data="tableDataDay"
      style="width: 100%"
      row-key="uuid"
      show-summary
      height="calc(40%)"
    >
      <el-table-column prop="dateInfo" label="日期" align="center"></el-table-column>
      <el-table-column prop="procname" :label="name" align="center">
        <el-table-column prop="kwhQty" :label="unit1" align="center"></el-table-column>
        <el-table-column prop="sumCost" label="费用(元)" align="center"></el-table-column>
      </el-table-column>
    </el-table>
    <!-- 车间/产线 选择 -->
    <el-dialog title="选择车间/产线" :visible.sync="dialogVisible" width="30%">
      <!-- <el-cascader
        ref="cascader"
        :props="{ checkStrictly: true,value:'code' }"
        :options="options"
        :show-all-levels="false"
      ></el-cascader>-->
      <el-tree
        :data="treeData"
        show-checkbox
        default-expand-all
        node-key="code"
        ref="tree"
        highlight-current
        check-strictly
        @check="checkNode"
      ></el-tree>
      <el-button type="primary" icon="el-icon-check" style="margin-left:10px" @click="check">确定</el-button>
    </el-dialog>
  </el-main>
</template>

<script>
import echarts from "echarts";
import {
  getDayCostSumReport,
  getMonthCostSumReport,
  getYearCostSumReport,
  getAllEneType,
  getEneEquipTree
} from "@/api/energy";
import { simpleDateFormat } from "@/utils/index";

export default {
  name: "eneCostReport",
  data() {
    let date1 = new Date();
    let year1 = date1.getFullYear();
    let month1 =
      year1 +
      (date1.getMonth() < 10
        ? "-0" + (date1.getMonth() + 1)
        : "-" + date1.getMonth());
    return {
      date: "",
      showDate: year1,
      dialogVisible: false,
      options: [],
      dateType: "month",
      flagDay: false,
      flagMonth: true,
      flagYear: false,
      yearDisabled: false,
      dayDisabled: false,
      monthDisabled: false,
      tableDataDay: [],
      schedulData: [],
      workShopData: [],
      yTitle: "kWh",
      energyTypeData: [],
      costData: [],
      moneyData: [],
      xTitle: [],
      chartName: "chart",
      dayForm: {
        date: null,
        energyType: "",
        pproccode: ""
      },
      dayParams: {
        energyType: "",
        pproccode: "",
        hourInfo: null
      },
      cParams: {
        pageNum: 1,
        pageSize: 100,
        planCode: null
      },

      activeName: "zero",
      commonProcode: "",
      commonSumEnergy: 0.0,
      commonCost: 0.0,
      // unit: "用电量(kWh)",
      unit1: "用量(kWh)",
      pprocName: "",
      treeData: []
      // unit2: "用电量(kWh)",
      // unit3: "用电量(kWh)"
    };
  },
  async created() {
    // getSchedulList(this.cParams)
    //     .then(res => {
    //         this.schedulData = res.data.data.result;
    //         this.schedulForm.shiftCode = this.schedulData[0].shiftCode;
    //     })
    //     .catch(e => {
    //         this.$message.error(e.message);
    //     });
    let res = await getAllEneType();
    this.energyTypeData = res.data.data;
    this.dayForm.energyType = this.energyTypeData[0].code;
    this.dayParams.energyType = this.dayForm.energyType;
    let res1 = await getEneEquipTree(this.dayParams.energyType);
    let arr = res1.data.data;
    console.log(arr);
    this.dayForm.pproccode = arr[0].code;
    this.pprocName = arr[0].label;
    this.submitSearch();
  },
  mounted() {
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
    this.date = day1;
    this.dayParams.hourInfo = simpleDateFormat(new Date(), "yyyy-MM-dd"); //天
    this.dayForm.date = simpleDateFormat(new Date(), "yyyy-MM-dd"); //天
    this.drawLine();
  },
  methods: {
    drawLine() {
      let chart = echarts.init(document.getElementById(this.chartName));
      chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999"
            }
          }
        },
        grid: {
          top: "10%",
          bottom: "7%"
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true }
            // saveAsImage: {show: true}
          }
        },
        legend: {
          data: ["用量", "费用"]
        },
        xAxis: [
          {
            type: "category",
            data: this.xTitle,
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "用量",
            axisLabel: {
              formatter: "{value} " + this.yTitle
            }
          },
          {
            type: "value",
            name: "费用",
            axisLabel: {
              formatter: "{value} 元"
            }
          }
        ],
        series: [
          {
            name: "用量",
            type: "bar",
            data: this.costData,
            smooth: true
          },
          {
            name: "费用",
            type: "line",
            yAxisIndex: 1,
            data: this.moneyData,
            smooth: true
          }
        ]
      });
    },
    getData() {
      // if (this.flagDay) {
      getDayCostSumReport(this.dayParams)
        .then(res => {
          this.tableDataDay = res.data.data;
          this.costData = [];
          this.moneyData = [];
          this.xTitle = [];
          for (let i = 0; i < res.data.data.length; i++) {
            this.xTitle.push(res.data.data[i].dateInfo);
            this.moneyData.push(res.data.data[i].sumCost);
            this.costData.push(res.data.data[i].kwhQty);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
      // } else if (this.flagMonth) {
      //     getMonthCostSumReport(this.monthParams)
      //         .then(res => {
      //             this.tableDataMonth = res.data.data;
      //         })
      //         .catch(e => {
      //             this.$message.error(e.message);
      //         });
      // } else if (this.flagYear) {
      //     getYearCostSumReport(this.yearParams)
      //         .then(res => {
      //             this.tableDataYear = res.data.data;
      //         })
      //         .catch(e => {
      //             this.$message.error(e.message);
      //         });
      // }
    },
    getEneEquipTree(energyType) {
      getEneEquipTree(energyType).then(res => {
        if (res.data.success) {
          this.treeData = res.data.data;
        } else {
          this.$message.error(res.data.message + ":" + res.data.data);
        }
        // this.workShopData = res.data.data;
        // this.schedulForm.pproccode = this.workShopData[0].proccode;
        // this.dayForm.pproccode = this.workShopData[0].proccode;
        // this.name = this.workShopData[0].name;
        // this.getData();
      });
    },
    submitSearch() {
      if (!this.pprocName) {
        this.$message.error("请先选择车间/产线");
        return;
      }
      this.dayParams.pproccode = this.dayForm.pproccode;
      this.dayParams.energyType = this.dayForm.energyType;
      this.name = "";
      if (this.dayForm.energyType === "elect") {
        this.unit1 = "用量(kWh)";
        this.yTitle = "kWh";
      } else if (this.dayForm.energyType === "gas") {
        this.unit1 = "用量(m³)";
        this.yTitle = "m³";
      } else {
        this.unit1 = "用量(m³)";
        this.yTitle = "m³";
      }
      if (this.flagDay) {
        this.dayParams.hourInfo = this.date;
        getDayCostSumReport(this.dayParams)
          .then(res => {
            this.tableDataDay = res.data.data;
            this.costData = [];
            this.moneyData = [];
            this.xTitle = [];

            for (let i = 0; i < res.data.data.length; i++) {
              this.xTitle.push(res.data.data[i].dateInfo);
              this.moneyData.push(res.data.data[i].sumCost);
              this.costData.push(res.data.data[i].kwhQty);
            }
          })
          .catch(e => {
            this.$message.error(e.message);
          });
      } else if (this.flagMonth) {
        this.dayParams.hourInfo = this.date.substring(0, 7);
        getMonthCostSumReport(this.dayParams)
          .then(res => {
            this.tableDataDay = res.data.data;
            this.costData = [];
            this.moneyData = [];
            this.xTitle = [];

            for (let i = 0; i < res.data.data.length; i++) {
              this.xTitle.push(res.data.data[i].dateInfo);
              this.moneyData.push(res.data.data[i].sumCost);
              this.costData.push(res.data.data[i].kwhQty);
            }
          })
          .catch(e => {
            this.$message.error(e.message);
          });
      } else if (this.flagYear) {
        this.dayParams.hourInfo = this.date.substring(0, 4);
        getYearCostSumReport(this.dayParams)
          .then(res => {
            this.tableDataDay = res.data.data;
            this.costData = [];
            this.moneyData = [];
            this.xTitle = [];

            for (let i = 0; i < res.data.data.length; i++) {
              this.xTitle.push(res.data.data[i].dateInfo);
              this.moneyData.push(res.data.data[i].sumCost);
              this.costData.push(res.data.data[i].kwhQty);
            }
          })
          .catch(e => {
            this.$message.error(e.message);
          });
      }
    },
    changDate(date) {
      let date1 = new Date();
      let year1 = date1.getFullYear();
      let month1 = year1 + "-0" + (date1.getMonth() + 1);
      let day1 = month1 + "-0" + date1.getDate();
      if (date === "day") {
        this.flagDay = true;
        this.flagMonth = false;
        this.flagYear = false;
        this.showDate = day1;
      } else if (date === "month") {
        this.flagDay = false;
        this.flagMonth = true;
        this.flagYear = false;
        this.showDate = month1;
      } else if (date === "year") {
        this.flagDay = false;
        this.flagMonth = false;
        this.flagYear = true;
        this.showDate = year1;
      }
      this.submitSearch();
    },
    clearSearchBox() {
      this.dayForm = {
        date: ""
      };
    },
    selectPProccode() {
      this.treeData = [];
      this.dialogVisible = true;
      this.getEneEquipTree(this.dayForm.energyType);
    },
    check() {
      let arr = this.$refs.tree.getCheckedNodes();
      this.dayForm.pproccode = arr[0].code;
      this.pprocName = arr[0].label;
      this.dialogVisible = false;
    },
    // 点击树节点 ==> 排他 只能选择一个
    checkNode(current, checks) {
      let checked = checks.checkedNodes.filter(
        item => item.code == current.code
      );
      this.$refs.tree.setCheckedKeys([checked[0].code]);
    }
  },
  watch: {
    dayForm: {
      deep: true,
      immediate: true,
      handler(newVal) {
        if (newVal.date) {
          this.dayDisabled = false;
        } else {
          this.dayDisabled = true;
        }
      }
    },
    xTitle: {
      deep: true,
      handler() {
        this.drawLine();
      }
    },
    costData: {
      deep: true,
      handler() {
        this.drawLine();
      }
    },
    montyData: {
      deep: true,
      handler() {
        this.drawLine();
      }
    }
    //     "dayForm.energyType"() {
    //       this.getEneEquipTree(this.dayForm.energyType);
    //     }
  },
  computed: {
    name: {
      get() {
        // let arr = this.workShopData.filter(item=>{
        //     item.proccode == this.dayForm.pproccode
        // })
        // return  '11'
        let str = "";
        this.workShopData.forEach(item => {
          if (+item.proccode === +this.dayForm.pproccode) {
            str = item.name;
          }
        });
        return str;
      },
      set() {}
    }
  }
};
</script>

<style lang='scss'>
#elect.el-table::before {
  height: 0px;
}

#elect .el-table__body-wrapper::-webkit-scrollbar {
  /*width: 0;宽度为0隐藏*/
  width: 0px;
}

#elect .el-table__body-wrapper.is-scrolling-none {
  /*min-height: 410px;*/
  /*height: calc((100% - 52px - 60px - 34px) / 2);*/
  /*overflow: auto;*/

  .el-table__empty-block {
    min-height: 200px;
  }
}

.elect .el-table__footer-wrapper {
  display: block !important;
  position: relative;
}

#elect .el-tabs__content {
  /*padding: 15px !important;*/
}
#elect .el-dialog {
  height: 60%;
}

#elect {
  padding: 0;
}
</style>
<style scoped>
.chartBox {
  height: calc(50%);
}
</style>
