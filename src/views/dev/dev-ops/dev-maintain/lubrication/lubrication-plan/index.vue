<template>
  <div>
    <el-tabs type="border-card" @tab-click="handleClick">
      <el-tab-pane label="润滑计划" lazy ids="plan">
        <lubrication-plan :activeName="activeName"></lubrication-plan>
      </el-tab-pane>
      <el-tab-pane label="润滑计划模板" lazy ids="temp">
        <lubrication-plan-template :activeName="activeName"></lubrication-plan-template>
        <!--        润滑计划模板-->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import LubricationPlan from "./plan";
import lubricationPlanTemplate from "./lubrication-plan-template";
export default {
  name: "inspectionPlane",
  components: {
    LubricationPlan,
    lubricationPlanTemplate
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
