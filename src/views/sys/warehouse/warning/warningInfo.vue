<template>
  <!-- 报警信息 -->
  <div class="warningInfo" style="height:100%;">
    <el-tabs type="border-card" @tab-click="handleTabClick" style="height:100%;overflow:auto" value="1">
      <el-tab-pane label="初级警报" name="1">
        <primaryWarn :code="code" :level="'1'"></primaryWarn>
      </el-tab-pane>
      <el-tab-pane label="升级警报" name="2">
        <primaryWarn :code="code" :level="'2'"></primaryWarn>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import primaryWarn from "./primaryWarn";
export default {
  components: {
    primaryWarn
  },
  props: {
    code: {
      type: String,
      required: false
    }
  },
  data() {
    return {
    };
  },
  methods: {
    handleTabClick(tab) {
      this.level = tab.name;
    }
  }
};
</script>

<style>
</style>
