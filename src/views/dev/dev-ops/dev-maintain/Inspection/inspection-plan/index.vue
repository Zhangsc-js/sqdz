<template>
  <div>
    <el-tabs type="border-card" @tab-click="handleClick">
      <el-tab-pane label="巡检计划" lazy ids="plan">
        <inspection-plan :activeName="activeName"></inspection-plan>
      </el-tab-pane>
      <el-tab-pane label="巡检计划模板" lazy ids="temp">
        <inspection-plan-template :activeName="activeName"></inspection-plan-template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import InspectionPlan from "./plan";
import InspectionPlanTemplate from "./inspection-plan-template";
export default {
  name: "inspectionPlane",
  components: {
    InspectionPlan,
    InspectionPlanTemplate
  },
  data() {
    return {
      activeName: "plan"
    };
  },
  methods: {
    handleClick(tab) {
      this.activeName = tab.$attrs.ids;
    }
  }
};
</script>
