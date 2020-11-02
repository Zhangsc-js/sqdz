<template>
  <div class="runState" style="height:100%;overflow-y:auto;overflow-x:hidden">
    <!-- <el-container style="height:calc(100% - 60px)"> -->
    <el-container class="containerHeight">
      <el-aside width="50%">
        <small-table :tableData="tableData1"></small-table>
      </el-aside>
      <el-aside width="50%">
        <small-table :tableData="tableData2"></small-table>
      </el-aside>
    </el-container>
    <el-footer>
      <Pagination
        :total="total"
        :page.sync="page.pageNum"
        :limit.sync="page.pageSize"
        @pagination="getData"
      />
    </el-footer>
  </div>
</template>

<script>
import { onOffReport } from "@/api/device";
import Pagination from "@/components/Pagination";
import smallTable from "./table";
export default {
  name: "runState",
  components: {
    smallTable,
    Pagination
  },
  data() {
    return {
      tableData1: [],
      tableData2: [],
      total: 0,
      page: {
        pageSize: 20,
        pageNum: 1
      },
      timer: ""
    };
  },
  methods: {
    getData() {
      let params = {
        ...this.page
      };
      onOffReport(params).then(res => {
        let data = res.data;
        this.total = data.data.total;
        let arr = data.data.rows;
        if (arr.length > 10) {
          this.tableData1 = arr.slice(0, 10);
          this.tableData2 = arr.slice(10);
        } else {
          this.tableData1 = arr;
          this.tableData2 = [];
        }
      });
    }
  },
  created() {
    this.getData();
    this.timer = setInterval(() => {
      this.getData();
    }, 1000 * 60);
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
};
</script>

<style scoped>
.el-aside {
  height: calc(100%);
}
.el-main {
  height: calc(100%);
}
.el-footer {
  height: 60px;
}
@media screen and (max-width: 750px) {
  .containerHeight {
    height: auto;
    overflow: auto;
  }
}
@media screen and (min-width: 751px) {
  .containerHeight {
    height: calc(100% - 60px);
  }
}
</style>
