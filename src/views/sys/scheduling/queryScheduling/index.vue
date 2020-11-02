<template>
  <!-- 每日排班 -->
  <div class="queryScheduling" style="height:100%">
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="班组排班查询" name="1" style="height:100%">
        <query-team></query-team>
      </el-tab-pane>
      <el-tab-pane label="人员排班查询" name="2" style="height:100%">
        <query-person></query-person>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import queryTeam from "./queryTeam";
import queryPerson from "./queryPerson";
export default {
  components: {
    queryTeam,
    queryPerson
  },
  data() {
    return {
      activeName: "1"
    };
  }
};
</script>

<style>
.queryScheduling .el-tabs.el-tabs--top {
  height: 100%;
}
.queryScheduling .el-tabs__content {
  height: calc(100% - 39px);
}
</style>
