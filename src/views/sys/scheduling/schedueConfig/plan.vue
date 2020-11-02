<template>
  <!-- 班制管理 -->
  <div class="schedulPlan" style="height:calc(100% - 93px)">
    <edit-table
      pageName="SYS-TEAMPLAN"
      :tableData="tableData"
      :opts="opts"
      showOptBtn
      @savaData="savaData"
      @getData="getData"
      :page="page"
      :total="total"
      :pageSizes="pageSizes"
      @jc-row-click="rowClick"
      @deleteRow="dltRow"
      height="calc(100%)"
      optWidth="190"
    >
      <!-- <slot name="customizeOpt" :scope="scope"></slot> -->
      <template v-slot:customizeOpt="{scope}">
        <el-button style="font-size:12px" type="text" @click="showCalendar(scope.row)">日历</el-button>
      </template>
    </edit-table>
    <el-dialog fullscreen title="日历" append-to-body :visible.sync="dialogVisible" width="100%">
      <calendar :calendar_code="calendarCode"></calendar>
    </el-dialog>
  </div>
</template>

<script>
import EditTable from "@/components/EditTable";
import calendar from "@/views/sys/calendar";
import {
  schedulPlanAll,
  saveSchedulPlan,
  sltCalendar,
  deleteSchedulPlan
} from "@/api/sys/scheduling";
import { getDictDetailList } from "@/api/sys/dict";
import { createNamespacedHelpers } from "vuex";
const { mapMutations } = createNamespacedHelpers("sysDev");
export default {
  components: {
    EditTable,
    calendar
  },
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      calendarCode: "",
      opts: [
        {
          type: "input",
          label: "班制编码",
          prop: "planCode",
          rule: true,
          NoEdit: true
        },
        {
          type: "input",
          label: "班制名称",
          prop: "planName",
          rule: true
        },
        {
          type: "input",
          label: "排班方案",
          prop: "planMethodCode",
          rule: true
        },
        {
          type: "select",
          label: "排班分类",
          prop: "planCategory",
          rule: true,
          options: []
        },
        {
          type: "select",
          label: "排班日历",
          prop: "calendarCode",
          rule: true,
          options: []
        }
      ],
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      pageSizes: [10, 50, 100]
    };
  },
  methods: {
    ...mapMutations(["SET_PLANCODE", "SET_PLANCATEGORY"]),
    init() {
      this.getData();
      //   排班分类
      getDictDetailList("SHIFT_CATEGORY").then(res => {
        let data = res.data;
        if (data.success) {
          let planCategory = this.opts.filter(item => {
            return item.prop == "planCategory";
          });
          let arr = data.data.map(item => {
            return {
              label: item.label,
              value: item.code
            };
          });
          this.$set(planCategory[0], "options", arr);
        }
      });
      //   日历下拉
      sltCalendar().then(res => {
        let data = res.data;
        if (data.success) {
          this.opts.filter(item => {
            return item.prop == "calendarCode";
          })[0].options = data.data;
        }
      });
      this.SET_PLANCODE("");
    },
    savaData(row) {
      let msg = row.id ? "更新成功" : "新增成功";
      saveSchedulPlan(row).then(res => {
        if (res.data.success) {
          this.$message.success(msg);
          this.getData();
        } else {
          this.$message.error(res.data.message + ":" + res.data.data);
        }
      });
    },
    getData() {
      let params = {
        ...this.page
      };
      schedulPlanAll(params).then(res => {
        let data = res.data;
        if (data.success) {
          (this.total = data.data.total), (this.tableData = data.data.list);
        }
      });
    },
    rowClick(row) {
      if (row.seen) return;
      this.SET_PLANCODE(row.planCode);
      this.SET_PLANCATEGORY(row.planCategory);
    },
    dltRow(id) {
      deleteSchedulPlan(id).then(res => {
        console.log(res);
        if (res.data.success) {
          this.$message.success("删除成功");
          this.getData();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    showCalendar(row) {
      this.calendarCode = row.calendarCode;
      this.dialogVisible = true;
    }
  },
  created() {
    this.init();
  },
  activated() {
    //   日历下拉
    sltCalendar().then(res => {
      let data = res.data;
      if (data.success) {
        this.opts.filter(item => {
          return item.prop == "calendarCode";
        })[0].options = data.data;
      }
    });
  }
};
</script>

<style>
</style>
