<template>
  <!-- 班制管理 -->
  <div class="schedulShift" style="height:calc(100% - 93px)">
    <edit-table
      pageName="SYS-SHIFT"
      :tableData="tableData"
      :opts="opts"
      showOptBtn
      @savaData="savaData"
      @getData="getData"
      @deleteRow="dltRow"
      height="calc(100%)"
      show-overflow-tooltip
    ></edit-table>
  </div>
</template>

<script>
import EditTable from "@/components/EditTable";
import {
  getShiftByPlanCode,
  saveShift,
  deleteShift
} from "@/api/sys/scheduling";
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("sysDev");
export default {
  components: {
    EditTable
  },
  data() {
    return {
      tableData: [],
      opts: [
        {
          type: "input",
          label: "班次序号",
          prop: "shiftCode",
          rule: true
        },
        {
          type: "input",
          label: "班次名称",
          prop: "shiftName",
          rule: true
        },
        {
          type: "time",
          label: "开始时间",
          prop: "startTime",
          format: "HH:mm",
          rule: true
        },
        {
          type: "time",
          label: "截止时间",
          prop: "endTime",
          format: "HH:mm",
          rule: true
        },
        {
          type: "select",
          label: "是否跨天",
          prop: "isCrossDay",
          rule: true,
          options: [
            { label: "是", value: "1" },
            { label: "否", value: "2" }
          ]
        }
      ]
    };
  },
  methods: {
    getData() {
      getShiftByPlanCode({ planCode: this.planCode }).then(res => {
        let data = res.data;
        if (data.success) {
          this.tableData = data.data;
        }
      });
    },
    savaData(row) {
      let data = {
        ...row,
        schedulPlanCode: this.planCode
      };
      saveShift(data).then(res => {
        let data = res.data;
        if (data.success) {
          this.$message.success("新增成功");
          this.getData();
        } else {
          this.$message.error(data.message + ":" + data.data);
        }
      });
    },
    dltRow(id) {
      deleteShift(id).then(res => {
        if (res.data.success) {
          this.$message.success("删除成功");
          this.getData();
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  },
  computed: {
    ...mapState(["planCode"])
  },
  watch: {
    planCode(val) {
      if (val) {
        this.getData();
      }
    }
  }
};
</script>

<style>
</style>
