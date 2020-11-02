<template>
  <div class="scheduConfig" style="height:100%">
    <!-- 上 -->
    <el-container>
      <!-- 班制管理 -->
      <el-main width="50%">
        <el-divider content-position="left">班制管理</el-divider>
        <plan></plan>
      </el-main>
      <!-- 班次管理 -->
      <el-aside width="50%">
        <el-divider content-position="left">班次管理</el-divider>
        <shift></shift>
      </el-aside>
    </el-container>
    <!-- 下 -->
    <el-container>
      <el-tabs type="border-card" v-model="tabsName" style="width:100%;height:100%">
        <el-tab-pane label="班组排班" name="1" style="height:100%">
          <team :tabsName='tabsName'></team>
        </el-tab-pane>
        <el-tab-pane label="人员排班" name="2" style="height:100%">
          <personnel :tabsName='tabsName'></personnel>
        </el-tab-pane>
      </el-tabs>
    </el-container>
  </div>
</template>

<script>
import plan from "./plan";
import shift from "./shift";
import team from "./team";
import personnel from "./personnel";
export default {
  components: {
    plan,
    shift,
    team,
    personnel
  },
  data() {
    return {
      tabsName: "1"
    };
  },
  methods: {}
};
</script>

<style scoped>
.el-container {
  height: 50%;
}
</style>
