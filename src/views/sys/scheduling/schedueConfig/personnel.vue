<template>
  <!-- 人员排班 -->
  <div class="schedulePersonal" style="height:100%">
    <el-container style="height:100%">
      <!-- 组织 -->
      <el-aside width="50%">
        <el-divider content-position="left">组织</el-divider>
        <!-- <edit-table
          pageName="LIMS-REMARK"
          :tableData="tableData1"
          :opts="opts1"
          showOptBtn
          @savaData="savaData1"
          @getData="getData1"
          height="calc(100% - 93px)"
          show-overflow-tooltip
        ></edit-table>-->
        <team-right @userInfo="userInfo" :tabsName="tabsName"></team-right>
      </el-aside>
      <!-- 成员 -->
      <el-aside width="50%">
        <el-divider content-position="left">成员</el-divider>
        <edit-table
          pageName=""
          :tableData="tableData2"
          :opts="opts2"
          :showAddBtn="false"
          :showOptBtn="false"
          height="calc(100% - 50px)"
          show-overflow-tooltip
        ></edit-table>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import EditTable from "@/components/EditTable";
import teamRight from "./teamRight";
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("sysDev");
export default {
  props: {
    tabsName: {
      type: String,
      required: false
    }
  },
  components: {
    EditTable,
    teamRight
  },
  data() {
    return {
      tableData2: [],
      opts2: [
        {
          type: "input",
          label: "员工工号",
          prop: "userCode"
        },
        {
          type: "input",
          label: "员工姓名",
          prop: "userName"
        }
      ]
    };
  },
  methods: {
    savaData2() {},
    getData2() {},
    userInfo(list) {
      this.tableData2 = list;
    }
  },
  computed: {
    ...mapState(["planCode"])
  },
  watch: {
    planCode(val) {
      this.tableData2 = [];
    }
  }
};
</script>

<style>
.scheduConfig .el-tabs__content {
  height: calc(100% - 39px);
}
</style>
