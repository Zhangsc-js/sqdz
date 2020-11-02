<template>
  <div style="height: 100%">
    <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
      <el-form-item label="日期" prop="date">
        <el-date-picker
          v-model="queryForm.date"
          style="width: 140px"
          value-format="yyyy-MM"
          type="month"
          placeholder="选择日期"
          :clearable="false"
        />
      </el-form-item>
      <el-form-item>
        <el-radio v-model="queryForm.type" label="month">月</el-radio>
        <el-radio v-model="queryForm.type" label="year">年</el-radio>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getData">查询</el-button>
      </el-form-item>
    </el-form>
    <div id="shopEcharts" style="width:100%;height:calc(100% - 60px)"></div>
  </div>
</template>
<script>
import echarts from "echarts";
import { selectByException } from "@/api/sys/warning";
import { simpleDateFormat } from "@/utils/index";

export default {
  components: {
    echarts
  },
  data() {
    return {
      queryForm: {
        date: new Date(),
        type: "month"
      },
      date: "",
      dateUp: {
        year: "0",
        month: "0"
      }
    };
  },
  methods: {
    getData() {
      if (this.queryForm.date) {
        this.queryForm.date = simpleDateFormat(this.queryForm.date, "yyyy-MM");
      }
      selectByException(this.queryForm).then(response => {
        if (response.data.success) {
          this.applyEcharts(response.data.data);
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
    },
    //渲染Echart
    applyEcharts(result) {
      let caTemplate = echarts.init(document.getElementById("shopEcharts"));
      caTemplate.setOption({
        title: {
          text: "设备运行参数异常统计",
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a}<br/>{b}:{c} ({d}%)"
        },
        legend: {
          bottom: 10,
          left: "center",
          data: result.opinion
        },
        series: [
          {
            name: "参数异常问题",
            type: "pie",
            radius: "65%",
            center: ["50%", "50%"],
            avoidLabelOverlap: false,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            },
            data: result.datas
          }
        ]
      });
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
