<template>
  <div style="width: 100%;height:100%">
    <el-tabs type="border-card" v-model="defaultActiveName" style="height: 100%;overflow: hidden" @tab-click="handleTabClick">
      <el-tab-pane label="组态图" name="processDrawing" lazy style="height: 100%" >
        <process-drawing class="card" style="height: 100%" :active-name="tabName"></process-drawing>
      </el-tab-pane>
      <el-tab-pane label="开停记录" v-if="showCards" name="devOnOff" lazy style="height: 100%">
          <dev-on-off :active-name="tabName"></dev-on-off>
      </el-tab-pane>
      <el-tab-pane label="点位趋势" v-if="showCards" lazy name="historyTrend" style="height: 100%">
        <history-trend class="card" style="height: 100%" :active-name="tabName"></history-trend>
      </el-tab-pane>
      <el-tab-pane label="点检记录" v-if="showCards" lazy name="spotCheckRecord" style="height: 100%">
        <spot-check-record class="card" style="height: 100%" :active-name="tabName"></spot-check-record>
      </el-tab-pane>
      <el-tab-pane label="巡检记录" v-if="showCards" lazy name="inspectionRecord" style="height: 100%">
        <inspection-record class="card" style="height: 100%" :active-name="tabName"></inspection-record>
      </el-tab-pane>
      <el-tab-pane label="润滑记录" v-if="showCards" lazy name="lubricationRecord" style="height: 100%">
        <lubrication-record class="card" :active-name="tabName"></lubrication-record>
      </el-tab-pane>
      <el-tab-pane label="保养记录" v-if="showCards" lazy name="maintainRecord" style="height: 100%">
        <maintain-record class="card" :active-name="tabName"></maintain-record>
      </el-tab-pane>
      <el-tab-pane label="维修记录" v-if="showCards" lazy name="repairRecord" style="height: 100%">
        <repair-record class="card" :active-name="tabName"></repair-record>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import ProcessDrawing from "./process-drawing";
import HistoryTrend from "./history-trend";
import InspectionRecord from "./inspection-record";
import SpotCheckRecord from "./spot-check-record";
import LubricationRecord from "./lubrication-record";
import DevOnOff from "../on-off-record/devOnOffRecord";
import MaintainRecord from './maintain-record';
import RepairRecord from './repair-record';

export default {
  name: "DevWorking",
  components: {
    ProcessDrawing,
    HistoryTrend,
    SpotCheckRecord,
    InspectionRecord,
    LubricationRecord,
    DevOnOff,
    MaintainRecord,
    RepairRecord
  },
  data() {
    return {
      isLeave: false,
      tabName: 'processDrawing',
      defaultActiveName: 'processDrawing'
    };
  },
  props: {
    showCards: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {
    // 判断是否要
    beforeLeave(activeName, oldActiveName) {
    },
    handleTabClick(tab) {
      this.tabName = tab.name
    }
  }
};
</script>

<style scoped>
.card {
  height: 100%;
  text-align: center;
}

</style>
<style>
.el-tabs__content{
    height: calc(100% - 40px);
}
.el-tab-pane{
    height: 100%;
}
</style>
