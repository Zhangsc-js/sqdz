<template>
  <!-- 班组排班 -->
  <div class="schedulShift" style="height:calc(100% - 93px)">
    <edit-table
      pageName="SYS-TMUSER"
      :tableData="tableData"
      :opts="opts"
      showOptBtn
      @savaData="savaData"
      @getData="getData"
      height="calc(100%)"
      show-overflow-tooltip
      @selectChange="change"
      @deleteRow="dltRow"
      @jc-row-click="rowClick"
      @setEdit="setEdit"
    ></edit-table>
  </div>
</template>

<script>
import EditTable from "@/components/EditTable";
import {
  getSchedulOrg,
  getSltData,
  saveSchedulOrg,
  getTeamList,
  deleteSchedulOrg,
  getDepartmentById
} from "@/api/sys/scheduling";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("sysDev");
export default {
  props: {
    tabsName: {
      type: String,
      required: true
    }
  },
  components: {
    EditTable
  },
  data() {
    return {
      tableData: [],
      opts: [
        {
          type: "select",
          label: "上级组织",
          prop: "parentOrgCode",
          options: [],
          rule: true
        },
        {
          type: "specialSelect",
          label: "班组",
          prop: "teamCode",
          //   options: [],
          rule: true
        }
      ],
      options1: [],
      teamSelect: []
    };
  },
  methods: {
    ...mapMutations(["SET_USERINFO"]),
    savaData(row) {
      console.log(row);
      let teamName = this.getTeamName(row.teamCode, row.options);
      let parentOrgName = this.getName(row.parentOrgCode, this.opts[0].options);
      console.log(teamName);
      let data = {
        ...row,
        schedulPlanCode: this.planCode,
        schedualType: this.tabsName,
        teamName,
        parentOrgName
      };
      saveSchedulOrg(data).then(res => {
        if (res.data.success) {
          this.$message.success("新增成功");
          this.getData();
        } else {
          this.$message.error("一个班组只能分配一次");
        }
      });
    },
    // 获取表格数据和完整的上级组织
    init() {
      this.getData();
      // 获取完整的上级组织
      getSltData({ planCategory: this.planCategory }).then(res => {
        if (res.data.success) {
          this.options1 = this.opts.filter(item => {
            return item.prop == "parentOrgCode";
          })[0].options = res.data.data;
        }
      });
    },
    // 表格数据
    getData() {
      let params = {
        planCode: this.planCode,
        planCategory: this.planCategory,
        schedualType: this.tabsName
      };
      getSchedulOrg(params).then(res => {
        if (res.data.success) {
          this.tableData = res.data.data.orgList;
          this.tableData = this.tableData.map(item => {
            return {
              ...item,
              options: res.data.data.teamList
            };
          });
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 改变上级组织 改变班组的下拉
    change(opt, val, row) {
      if (opt.prop !== "parentOrgCode") {
        return;
      }
      let params = {
        parentCode: val,
        planCategory: this.planCategory
      };
      getTeamList(params).then(res => {
        if (res.data.success) {
          let data = res.data.data.map(item => {
            return {
              ...item,
              code: item.value,
              name: item.label
            };
          });
          this.$set(row, "options", data);
          this.$set(row, "teamCode", "");
        }
      });
    },
    dltRow(id) {
      deleteSchedulOrg(id).then(res => {
        if (res.data.success) {
          this.$message.success("删除成功");
          this.getData();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 点击人员排班行 == > 获取成员数据
    rowClick(row) {
      //   当前行 班组的id
      let id = row.options.filter(item => {
        return item.code == row.teamCode;
      })[0].id;
      getDepartmentById(id).then(res => {
        if (res.data.success) {
          //   this.SET_USERINFO(res.data.data);
          this.$emit("userInfo", res.data.data);
        }
      });
    },
    getName(code, list) {
      let arr = list.filter(item => {
        return item.code == code;
      });
      if (arr.length > 0) {
        return arr[0].name;
      } else {
        return null;
      }
    },
    getTeamName(code, list) {
      let arr = list.filter(item => {
        return item.value == code;
      });
      if (arr.length > 0) {
        return arr[0].label;
      } else {
        return null;
      }
    },
    setEdit(row) {
      console.log(row);
      let params = {
        parentCode: row.parentOrgCode,
        planCategory: this.planCategory
      };
      getTeamList(params).then(res => {
        if (res.data.success) {
          let data = res.data.data.map(item => {
            return {
              ...item,
              code: item.value,
              name: item.label
            };
          });
          this.$set(row, "options", data);
        }
      });
    }
  },
  computed: {
    ...mapState(["planCode", "planCategory"])
  },
  watch: {
    planCode(val) {
      if (val && this.tabsName == "2") {
        this.init();
      }
    },
    tabsName(val) {
      if (this.planCode && val == "2") {
        this.init();
      }
    }
  }
};
</script>

<style>
</style>
