<template>
  <div style="height: 100%">
    <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
      <el-form-item label="日期" prop="date">
        <el-date-picker
          type="date"
          v-model="queryForm.date"
          value-format="yyyy-MM-dd"
          style="width: 140px"
          :format="formatDate"
        />
      </el-form-item>
      <el-form-item prop="type">
        <el-radio v-model="queryForm.type" label="day">日</el-radio>
        <el-radio v-model="queryForm.type" label="month">月</el-radio>
        <el-radio v-model="queryForm.type" label="year">年</el-radio>
      </el-form-item>
      <el-form-item label="工序" prop="processIds">
        <el-select
          v-model="processIds"
          @change="getData"
          multiple
          filterable
          collapse-tags
          placeholder="请选择"
        >
          <el-option
            v-for="item in processMap"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="维度" prop="dimension">
        <el-select v-model="queryForm.dimension" @change="getData" placeholder="请选择">
          <el-option
            v-for="item in types"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getData">查询</el-button>
        <el-button type="primary" icon="el-icon-refresh-left" @click="reset('queryForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <div id="shopEcharts" style="width:100%;height:calc(100% - 60px)"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import { selectProcess, produceProcessRate } from "@/api/productionPlanning";

export default {
  name: "producePlanFinish",
  components: {
    echarts
  },
  data() {
    return {
      queryForm: {
        date: "",
        type: "month",
        dimension: "passRate" //工序一次检验合格率
      },
      types: [
        {
          value: "passRate",
          label: "工序一次检验合格率"
        },
        {
          value: "rejectRate",
          label: "工序一次检验废品率"
        },
        {
          value: "reworkRate",
          label: "返修合格率"
        }
      ],
      processMap: [], //车间下拉数据
      processIds: []
    };
  },
  methods: {
    getData() {
      if (!this.queryForm.date) {
        this.$message.warning("请选择日期");
        return;
      }
      let ids = "";
      for (let i = 0; i < this.processIds.length; i++) {
        ids += this.processIds[i];
        if (i < this.processIds.length - 1) {
          ids += ",";
        }
      }
      this.queryForm.ids = ids;
      produceProcessRate(this.queryForm).then(response => {
        let data = response.data;
        if (data.success) {
          let result = data.data;
          this.applyEcharts(result);
          this.processIds = result.legend;
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
    },
    //渲染Echart
    applyEcharts(result) {
      let caTemplate = echarts.init(document.getElementById("shopEcharts"));
      let xName = "";
      if (this.queryForm.type == "day") {
        xName = "日";
      } else if (this.queryForm.type == "month") {
        xName = "月";
      } else {
        xName = "年";
      }
      let yName = "";
      if (this.queryForm.dimension == "passRate") {
        yName = "合格率";
      } else if (this.queryForm.dimension == "rejectRate") {
        yName = "废品率";
      } else {
        yName = "合格率";
      }
      let title = "";
      for (let i = 0; i < this.types.length; i++) {
        if (this.types[i].value == this.queryForm.dimension) {
          title = this.types[i].label;
        }
      }
      let option = {
        title: {
          text: title,
          textStyle: {
            color: "#FAAD14"
          }
        },
        tooltip: {
          trigger: "axis"
          //   formatter(params) {
          //     // 假设此轴的 type 为 'time'。
          //     return `${params[0].seriesName}：${params[0].data}`;
          //   }
        },
        legend: {
          data: result.legend
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: result.xList,
          name: xName,
          nameTextStyle: {
            color: "#1890FF",
            fontSize: 16
          }
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value} %"
          },
          name: yName,
          nameTextStyle: {
            color: "#1890FF",
            fontSize: 16
          }
        },
        series: result.yList
      };
      caTemplate.setOption(option, true);
    },
    selectProcess() {
      selectProcess().then(response => {
        let data = response.data.data;
        this.processMap = data;
        // this.ids.push(processMap[0])
      });
    },
    // 重置按钮
    reset() {
      //   this.queryForm.date = this.timeDefault;
      //   console.log(this.queryForm.date)
      //   resetQueryForm(this);
      this.$refs["queryForm"].resetFields();
      this.queryForm.date = this.timeDefault;
      this.getData();
    }
  },
  computed: {
    timeDefault() {
      let date = new Date();
      let s1 =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      return s1;
    },
    formatDate() {
      if (this.queryForm.type == "month") {
        return "yyyy-MM";
      } else if (this.queryForm.type == "year") {
        return "yyyy";
      } else {
        return "yyyy-MM-dd";
      }
    }
  },

  mounted() {
    this.selectProcess();
    this.queryForm.date = this.timeDefault;
    this.getData();
  }
};
</script>

<style lang="scss" scoped>
.el-select {
  width: 230px;
}
</style>
<style scoped>
.el-form-item__content .el-radio {
  margin-right: 10px;
}
</style>
