<template>
  <div>
    <el-tabs type="border-card" @tab-click="handleClick">
      <el-tab-pane label="保养计划" lazy ids="plan">
        <maintain-plan  :activeName="activeName"></maintain-plan>
      </el-tab-pane>
      <el-tab-pane label="保养计划模板" lazy ids="temp">
        <maintain-plan-template :activeName="activeName"></maintain-plan-template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import MaintainPlan from "./plan";
import MaintainPlanTemplate from "./maintain-plan-template";

export default {
  name: "MaintainPlane",
  components: {
    MaintainPlan,
    MaintainPlanTemplate
  },
  data() {
    return {
      activeName: 'plan'
    }
  },
  methods: {
    handleClick(tab) {
      this.activeName = tab.$attrs.ids
    }
  }
};
</script>
