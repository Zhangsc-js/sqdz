<template>
  <div>
    <el-tabs type="border-card" @tab-click="handleClick">
      <el-tab-pane label="点检计划" lazy ids="plan">
        <inspection-plan ref="plan" :activeName="activeName"></inspection-plan>
      </el-tab-pane>
      <el-tab-pane label="点检计划模板" lazy ids="temp">
        <checking-plan-template :activeName="activeName"></checking-plan-template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import InspectionPlan from "./plan";
import CheckingPlanTemplate from "./checking-plan-template";

export default {
  name: "CheckingPlane",
  components: {
    InspectionPlan,
    CheckingPlanTemplate
  },
  data() {
    return {
      activeName: "plan"
    };
  },
  methods: {
    handleClick(tab) {
      this.activeName = tab.$attrs.ids;
      if (tab.$attrs.ids == "plan") {
          this.$refs["plan"].random = Math.random();
      }
    }
  }
};
</script>
