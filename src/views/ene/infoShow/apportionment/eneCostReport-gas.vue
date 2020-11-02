<template>
  <el-tabs id="gas" type="border-card" v-model="activeName">
    <el-tab-pane label="班分摊费用明细" name="zero">
      <el-form :inline="true" class="demo-form-inline" ref="schedulForm">
        <el-form-item label="请选择日期" prop="costTime" style="padding-left: 2%">
          <el-date-picker
                  v-model="schedulForm.costTime"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  style="width:200px;padding-left:4% "
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="请选择班次">
          <el-select
                  v-model="schedulForm.shiftCode"
                  style="height:auto;margin-bottom:0px"
                  filterable
                  id="shiftCode"
          >
            <el-option
                    v-for="item in schedulData"
                    :key="item.value"
                    :label="item.shiftName"
                    :value="item.shiftCode"
            >
              <span style="float: left; color: #8492a6; font-size: 13px">{{ item.shiftName }}</span>
              <span style="float: right">{{ item.startTime }} - {{ item.endTime }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="dayDisabled" icon="el-icon-search" type="primary" @click="submitSearchSchedul()">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
              class="elect"
              :data="tableDataSchedul"
              style="width: 99%;padding-left: 2%"
              row-key="uuid"
              show-summary
              lazy
              :load="loadDay"
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
              ref="testOne"
      >
        <el-table-column prop="procname" label="设备名称" align="left"></el-table-column>
        <el-table-column prop="kwhQty" label="用水量(m³)" align="center"></el-table-column>
        <el-table-column prop="sumCost" label="金额(￥)" align="center"></el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="日分摊费用明细" name="first">
      <el-form :inline="true" class="demo-form-inline" ref="dayForm">
        <el-form-item label="请选择日期" prop="costTime" style="padding-left: 2%">
          <el-date-picker
            v-model="dayForm.costTime"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            style="width:200px;padding-left:4% "
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="dayDisabled" icon="el-icon-search" type="primary" @click="submitSearch()">查询</el-button>
        </el-form-item>
<!--        <el-form-item>-->
<!--          <el-button href="javascript:void(0)" class="btn-w" @click="clearSearchBox()">清空</el-button>-->
<!--        </el-form-item>-->
      </el-form>
      <el-table
        class="gas"
        :data="tableDataDay"
        style="width: 99%;padding-left: 2%"
        row-key="uuid"
        show-summary
        lazy
        :load="loadDay"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column prop="procname" label="设备名称" align="left"></el-table-column>
        <el-table-column prop="kwhQty" label="用气量(m³)" align="center"></el-table-column>
        <el-table-column prop="sumCost" label="金额(￥)" align="center"></el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="月分摊费用明细" name="second">
      <el-form :inline="true" class="demo-form-inline" ref="monthForm">
        <el-form-item label="请选择日期" prop="costTime" style="padding-left: 2%">
          <el-date-picker
            v-model="monthForm.costTime"
            type="month"
            placeholder="选择日期"
            value-format="yyyy-MM"
            style="width:200px;padding-left:4% "
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="monthDisabled" icon="el-icon-search" type="primary" @click="submitSearchMonth()">查询</el-button>
        </el-form-item>
<!--        <el-form-item>-->
<!--          <el-button href="javascript:void(0)" class="btn-w" @click="clearSearchBox()">清空</el-button>-->
<!--        </el-form-item>-->
      </el-form>
      <el-table
        class="gas"
        :data="tableDataMonth"
        style="width: 99%;padding-left: 2%"
        row-key="uuid"
        show-summary
        lazy
        :load="loadMonth"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column prop="procname" label="设备名称" align="left"></el-table-column>
        <el-table-column prop="kwhQty" label="用气量(m³)" align="center"></el-table-column>
        <el-table-column prop="sumCost" label="金额(￥)" align="center"></el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="年分摊费用明细" name="third">
      <el-form :inline="true" class="demo-form-inline" ref="yearForm">
        <el-form-item label="请选择日期" prop="costTime" style="padding-left: 2%">
          <el-date-picker
            v-model="yearForm.costTime"
            type="year"
            placeholder="选择日期"
            value-format="yyyy"
            style="width:200px;padding-left:4% "
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="yearDisabled" icon="el-icon-search" type="primary" @click="submitSearchYear()">查询</el-button>
        </el-form-item>

      </el-form>
      <el-table
        class="gas"
        :data="tableDataYear"
        style="width: 99%;padding-left: 2%"
        row-key="uuid"
        show-summary
        lazy
        :load="loadYear"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column prop="procname" label="设备名称" align="left"></el-table-column>
        <el-table-column prop="kwhQty" label="用气量(m³)" align="center"></el-table-column>
        <el-table-column prop="sumCost" label="金额(￥)" align="center"></el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import {
  getDayCostSumReport,
  getMonthCostSumReport,
  getYearCostSumReport,
  getCostChildrenReport,
  getCostChildrenYearReport,
  getSchedulCostSumReport,
  getSchedulList
} from "@/api/energy";
import { simpleDateFormat } from "@/utils/index";
export default {
  name: "eneCostReportGas",
  data() {
    return {
      yearDisabled: false,
      dayDisabled: false,
      monthDisabled: false,
      tableDataDay: [],
      tableDataMonth: [],
      tableDataYear: [],
      schedulData:[],
      tableDataSchedul:[],
      dayForm: {
        costTime: null
      },
      monthForm: {
        costTime: null
      },
      yearForm: {
        costTime: null
      },
      schedulForm:{
        costTime:null,
        shiftCode:''
      },
      dayParams: {
        energyType: "gas",
        pproccode: "021",
        hourInfo: null,
        canUseOn: null
      },
      monthParams: {
        energyType: "gas",
        pproccode: "021",
        hourInfo: null,
        canUseOn: null
      },
      yearParams: {
        energyType: "gas",
        pproccode: "021",
        hourInfo: null,
        canUseOn: null
      },
      schedulParams:{
        energyType:"gas",
        shiftCode: '',
        hourInfo:null,
        pproccode:"021",

      },
      cParams:{
        pageNum:1,
        pageSize:100,
        planCode:null
      },
      activeName: "zero"
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.dayParams.hourInfo = simpleDateFormat(new Date(), "yyyy-MM-dd"); //天
      this.monthParams.hourInfo = simpleDateFormat(new Date(), "yyyy-MM"); //月
      this.yearParams.hourInfo = simpleDateFormat(new Date(), "yyyy"); //年

      this.dayForm.costTime = simpleDateFormat(new Date(), "yyyy-MM-dd"); //天
      this.monthForm.costTime = simpleDateFormat(new Date(), "yyyy-MM"); //月
      this.yearForm.costTime = simpleDateFormat(new Date(), "yyyy"); //年
      this.schedulForm.costTime = simpleDateFormat(new Date(), "yyyy-MM-dd"); //年

      this.dayParams.canUseOn = simpleDateFormat(new Date(), "yyyy-MM"); //年
      this.monthParams.canUseOn = simpleDateFormat(new Date(), "yyyy-MM"); //年
      this.yearParams.canUseOn = simpleDateFormat(new Date(), "yyyy"); //年

      this.schedulParams.hourInfo =simpleDateFormat(new Date(), "yyyy-MM-dd");//班
      this.schedulParams.shiftCode ="S01";
      this.schedulForm.shiftCode ='S01';

      getSchedulList(this.cParams).then(res =>{
        this.schedulData = res.data.data.result
      }).catch(e =>{
        this.$message.error(e.message);
      });
      getDayCostSumReport(this.dayParams)
        .then(res => {
          this.tableDataDay = res.data.data;
        })
        .catch(e => {
          this.$message.error(e.message);
        });

      getMonthCostSumReport(this.monthParams)
        .then(res => {
          this.tableDataMonth = res.data.data;
        })
        .catch(e => {
          this.$message.error(e.message);
        });

      getYearCostSumReport(this.yearParams)
        .then(res => {
          this.tableDataYear = res.data.data;
        })
        .catch(e => {
          this.$message.error(e.message);
        });
      getSchedulCostSumReport(this.schedulParams).then(res =>{
        this.tableDataSchedul = res.data.data;
      }).catch(e =>{
        this.$message.error(e.message);
      })
    },

    submitSearchSchedul(){
      this.schedulParams.hourInfo = this.schedulForm.costTime;
      this.schedulParams.shiftCode = this.schedulForm.shiftCode;
      getSchedulCostSumReport(this.schedulParams).then(res =>{
        this.tableDataSchedul = res.data.data;
      }).catch(e =>{
        this.$message.error(e.message);
      })
    },

    //日
    submitSearch() {
      this.dayParams.hourInfo = this.dayForm.costTime;
      this.dayParams.canUseOn = simpleDateFormat(
        this.dayForm.costTime,
        "yyyy-MM"
      );
      getDayCostSumReport(this.dayParams)
        .then(res => {
          this.tableDataDay = res.data.data;
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    //月
    submitSearchMonth() {
      this.monthParams.hourInfo = this.monthForm.costTime;
      this.monthParams.canUseOn = simpleDateFormat(
        this.monthForm.costTime,
        "yyyy-MM"
      );
      getMonthCostSumReport(this.monthParams)
        .then(res => {
          this.tableDataMonth = res.data.data;
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    //年
    submitSearchYear() {
      this.yearParams.hourInfo = this.yearForm.costTime;

      if(simpleDateFormat(new Date(),"yyyy") === this.yearForm.costTime){
        this.yearParams.canUseOn = this.yearForm.costTime;
      }else{
        this.yearParams.canUseOn = this.yearForm.costTime;
      }
      getYearCostSumReport(this.yearParams)
        .then(res => {
          this.tableDataYear = res.data.data;
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    // clearSearchBox() {
    //   this.dayForm = {
    //     costTime: ""
    //   };
    //   this.monthForm = {
    //     costTime: ""
    //   };
    //   this.yearForm = {
    //     costTime: ""
    //   };
    // },
    loadDay(tree, treeNode, resolve) {
      // eslint-disable-next-line no-empty
      if (this.dayForm.costTime === "" || this.dayForm.costTime === null) {
        this.dayParams.canUseOn = simpleDateFormat(new Date(), "yyyy-MM");
      } else {
        this.dayParams.canUseOn = this.dayForm.costTime.substring(0, 7);
      }
      const param = {
        energyType: "gas",
        pproccode: tree.proccode,
        canUseOn: this.dayParams.canUseOn,
        sumEnergy: tree.kwhQty,
        sumCost: tree.sumCost
      };
      getCostChildrenReport(param)
        .then(response => {
          setTimeout(() => {
            resolve(response.data.data);
          }, 500);
        })
        .catch(e => {
          this.$message({
            type: "error",
            message: e.message,
            duration: 3 * 1000
          });
        });
    },
    loadMonth(tree, treeNode, resolve) {
      // eslint-disable-next-line no-empty
      if (this.monthForm.costTime === "" || this.monthForm.costTime === null) {
        this.monthParams.canUseOn = simpleDateFormat(new Date(), "yyyy-MM");
      } else {
        this.monthParams.canUseOn = this.monthForm.costTime.substring(0, 7);
      }
      const param = {
        energyType: "gas",
        pproccode: tree.proccode,
        canUseOn: this.monthParams.canUseOn,
        sumEnergy: tree.kwhQty,
        sumCost: tree.sumCost
      };
      getCostChildrenReport(param)
              .then(response => {
                setTimeout(() => {
                  resolve(response.data.data);
                }, 500);
              })
              .catch(e => {
                this.$message({
                  type: "error",
                  message: e.message,
                  duration: 3 * 1000
                });
              });
    },
    loadYear(tree, treeNode, resolve) {
      if(simpleDateFormat(new Date(),"yyyy") === this.yearForm.costTime){
        this.yearParams.canUseOn = this.yearForm.costTime;
      }else{
        this.yearParams.canUseOn = this.yearForm.costTime;
      }
        // this.yearParams.canUseOn = this.yearForm.costTime+"-"+simpleDateFormat(new Date(),"MM");

      const param = {
        energyType: "gas",
        pproccode: tree.proccode,
        canUseOn: this.yearParams.canUseOn,
        sumEnergy: tree.kwhQty,
        sumCost: tree.sumCost
      };
      getCostChildrenYearReport(param)
              .then(response => {
                setTimeout(() => {
                  resolve(response.data.data);
                }, 500);
              })
              .catch(e => {
                this.$message({
                  type: "error",
                  message: e.message,
                  duration: 3 * 1000
                });
              });
    }
  },
  watch: {
    dayForm: {
      deep: true,
      immediate: true,
      handler(newVal) {
        if (newVal.costTime) {
          this.dayDisabled = false;
        } else {
          this.dayDisabled = true;
        }
      }
    },
    monthForm: {
      deep: true,
      immediate: true,
      handler(newVal) {
        if (newVal.costTime) {
          this.monthDisabled = false;
        } else {
          this.monthDisabled = true;
        }
      }
    },
    yearForm: {
      deep: true,
      immediate: true,
      handler(newVal) {
        if (newVal.costTime) {
          this.yearDisabled = false;
        } else {
          this.yearDisabled = true;
        }
      }
    }
  }
};
</script>

<style lang='scss' >
#gas .el-table::before {
  height: 0px;
}
#gas .el-table__body-wrapper::-webkit-scrollbar {
  /*width: 0;宽度为0隐藏*/
  width: 0px;

}
#gas .el-table__body-wrapper.is-scrolling-none {
  /*min-height: 200px;*/
  height: 59.5vh;
  overflow: auto;
#gas  .el-table__empty-block {
    min-height: 200px;

  }
}
.gas .el-table__footer-wrapper {
  display: block !important;
  position: relative ;
}
#gas .el-tabs__content{
  padding: 15px !important;
}
</style>
