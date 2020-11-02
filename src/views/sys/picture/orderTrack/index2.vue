<template>
  <div class="orderTrack" style="height:100%">
    <el-tabs type="border-card" style="height:100%">
      <el-tab-pane label="用户管理" style="height:100%">
        <div style="height:100%" id="test"></div>
      </el-tab-pane>
      <el-tab-pane label="配置管理" style="height:100%">配置管理</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  methods: {
    drawLine() {
      let test = echarts.init(document.getElementById("test"));
      let option = {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: "bar",
            showBackground: true,
            backgroundStyle: {
              color: "rgba(220, 220, 220, 0.8)"
            }
          }
        ]
      };
      test.setOption(option, true);
    }
  },
  mounted(){
      this.$nextTick(()=>{
          this.drawLine()
      })
  }
};
</script>

<style>
.orderTrack .el-tabs__content {
  height: calc(100% - 40px);
}
</style>
