<template>
  <!-- 每日排班 -->
  <div class="dailyScheduling" style="height:100%">
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="班组排班" name="1" style="height:100%">
        <daily-team :activeName="activeName"></daily-team>
      </el-tab-pane>
      <el-tab-pane label="人员排班" name="2" style="height:100%">
        <daily-person :activeName="activeName"></daily-person>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import dailyTeam from "./dailyTeam";
import dailyPerson from "./dailyPerson";
export default {
  props: {
    name: {
      required: false
    }
  },
  components: {
    dailyTeam,
    dailyPerson
  },
  data() {
    return {
      activeName: "1"
    };
  },
  watch: {
    name(val) {
        console.log(1)
      if (val) {
        console.log(2)
        this.activeName = val;
      }
    }
  }
};
</script>

<style>
.dailyScheduling .el-tabs.el-tabs--top {
  height: 100%;
}
.dailyScheduling .el-tabs__content {
  height: calc(100% - 39px);
}
</style>
