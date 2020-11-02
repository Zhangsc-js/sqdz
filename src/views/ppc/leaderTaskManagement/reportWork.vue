<template>
  <!-- 查看报工  -->
  <div style="height:calc(100% - 14px)">
    <edit-table
      :tableData="tableData"
      :opts.sync="opts"
      highlight-current-row
      @getData="getData"
      style="width: 100%"
      height="calc(100% - 20px)"
    ></edit-table>

    <el-button type="primary" icon="el-icon-circle-close" @click="close">关闭</el-button>
  </div>
</template>

<script>
import { queryFinishByWorkOrderId } from "@/api/productionPlanning";
import Pagination from "@/components/Pagination";
import EditTable from "@/components/EditTable";

export default {
  name: "reportWork",
  props: {
    woId: {
      type: String,
      required: true
    }
  },
  components: {
    Pagination,
    EditTable
  },
  data() {
    return {
      tableData: [],
      opts: [
        {
          type: "input",
          label: "报工日期",
          prop: "finishedDate"
        },
        {
          type: "input",
          label: "合格数量",
          prop: "goodQty"
        },
        {
          type: "input",
          label: "废品数量",
          prop: "badQty"
        },
        {
          type: "input",
          label: "单位",
          prop: "unitCode"
        },
        {
          type: "input",
          label: "报工人",
          prop: "workerCode"
        },
        {
          type: "input",
          label: "报工工位",
          prop: "stationName"
        },
        {
          type: "input",
          label: "报工设备",
          prop: "devName"
        }
      ],
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0
    };
  },
  watch: {
    woId() {
      this.getData();
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      queryFinishByWorkOrderId(this.woId).then(response => {
        let data = response.data;
        if (data.success) {
          this.tableData = data.data;
        } else {
          this.$message.error(data.message + ":" + data.data);
        }
      });
    },
    close() {
      this.$emit("close");
    }
  }
};
</script>

<style>
</style>
