<template>
  <div>
    <div class="tableshadow margin20" style="width:calc(100% - 40px);">
      <el-table :data="tableData" ref="refTable">
        <el-table-column prop="userWork" align="center" label="工号" width="150px"></el-table-column>
        <el-table-column prop="userName" align="center" label="姓名" width="150px"></el-table-column>
        <el-table-column prop="clockInTime" align="center" label="打卡时间" width="180"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="accept(scope.row)">确认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Pagination
      :total="total"
      :page.sync="page.pageNum"
      :limit.sync="page.pageSize"
      @pagination="getData"
    />
  </div>
</template>

<script>
import { getClockinList, confirmClockin,getClockinRecord } from "@/api/sys/attendance";
import Pagination from "@/components/Pagination";

export default {
  name: "clockinList",
  components: {
    Pagination
  },
  data() {
    return {
      queryForm: {},
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      tableData: []
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      getClockinList({ userWork: this.$store.state.user.workCode })
        .then(res => {
          this.tableData = res.data.rows;
          this.total = res.data.total;
        })
        .catch(e => {
          this.$message.error(e.message);
        });
        getClockinRecord({userWork:111,clockInTimeStart:"2020-03-01 00:00:00",clockInTimeEnd:"2020-03-09 23:59:59"})
    },
    hidenDialog() {
      this.itemDialogVisible = false;
      this.getData();
    },
    clearSearchBox() {
      this.queryForm = {
        labDate: ""
      };
    },
    accept(item) {
      const params = {
        id: item.id,
        agreeUserName: this.$store.state.user.userName,
        agreeUserWork: this.$store.state.user.workCode
      };
      this.$confirm("确认签到", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          confirmClockin(params).then(res => {
            if (res.data.code != 10000) {
              this.$message.error(res.data.message);
            } else {
              this.$message.success("确认成功");
              this.getData();
            }
          });
        })
        .catch(() => {});
    },
  }
};
</script>

<style scoped>
</style>
