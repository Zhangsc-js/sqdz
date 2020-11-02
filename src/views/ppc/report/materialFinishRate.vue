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
        <el-radio v-model="queryForm.type" label="day" @change="getData()">日</el-radio>
        <el-radio v-model="queryForm.type" label="month" @change="getData()">月</el-radio>
        <el-radio v-model="queryForm.type" label="year" @change="getData()">年</el-radio>
      </el-form-item>
      <el-form-item label="物料" prop="materialName">
        <el-input
          v-on:click.native="sltMaterial"
          v-model="materialName"
          autocomplete="off"
          clearable
          @clear="materialClear"
          style="width: 400px"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getData">查询</el-button>
        <el-button type="primary" icon="el-icon-refresh-left" @click="reset()">重置</el-button>
      </el-form-item>
    </el-form>
    <div id="shopEcharts" style="width:100%;height:calc(100% - 60px)"></div>
    <el-dialog title="选择物料" :visible.sync="sltMaterialDialogVisible" width="65%" append-to-body>
      <material @save="categoryDialog" @cancel="hidenDialogCancel" :trigger="Math.random()" />
    </el-dialog>
  </div>
</template>

<script>
import echarts from "echarts";
import material from "./material";
import { materialRate } from "@/api/productionPlanning";
import { concatAndUniqueArr } from "@/utils/common";
import { resetQueryForm } from "@/utils/common";

export default {
  name: "producePlanFinish",
  components: {
    echarts,
    material
  },
  data() {
    return {
      queryForm: {
        date: new Date(),
        type: "month"
      },
      sltMaterialDialogVisible: false,
      materialCodes: [],
      materialNames: [],
      materialName: ""
    };
  },
  methods: {
    materialClear() {
      this.materialName = "";
      this.materialNames = [];
      this.materialCodes = [];
    },
    getData() {
      if (!this.queryForm.date) {
        this.$message.warning("请选择日期");
        return;
      }
      this.queryForm.codes = this.materialCodes.join(",");
      materialRate(this.queryForm).then(response => {
        let data = response.data;
        if (data.success) {
          let result = data.data;
          this.applyEcharts(result);
          this.initMaterialCode(result);
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
    },
    initMaterialCode(result) {
      if (this.materialNames.length == 0) {
        for (let i = 0; i < result.legend.length; i++) {
          this.materialNames.push(result.legend[i]);
        }
        this.materialCodes = result.materialCodes;
      }
      this.materialName = this.materialCodes.join(",");
    },
    sltMaterial() {
      this.sltMaterialDialogVisible = true;
    },
    categoryDialog(materialCodes, materialNames) {
      this.materialCodes = concatAndUniqueArr(
        this.materialCodes,
        materialCodes
      );
      this.materialNames = concatAndUniqueArr(
        this.materialNames,
        materialNames
      );
      this.sltMaterialDialogVisible = false;
      if (this.materialCodes.length != 0) {
      }
      this.materialName = this.materialCodes.join(",");
    },
    hidenDialogCancel() {
      this.sltMaterialDialogVisible = false;
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
      console.log(result.legend);
      let option = {
        title: {
          text: "物料成品率",
          textStyle: {
            color: "#FAAD14"
          }
        },
        tooltip: {
          trigger: "axis",
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
          name: "成品率",
          nameTextStyle: {
            color: "#1890FF",
            fontSize: 16
          }
        },
        series: result.yList
      };
      caTemplate.setOption(option, true);
    },
    // 重置按钮
    reset() {
      resetQueryForm(this);
    }
  },
  mounted() {
    this.getData();
  },
  computed: {
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
  watch: {
    materialName() {
      this.getData();
    }
  }
};
</script>

<style lang="scss" scoped>
.el-select {
  width: 230px;
}
.el-form-item__content .el-radio {
  margin-right: 10px;
}
</style>
