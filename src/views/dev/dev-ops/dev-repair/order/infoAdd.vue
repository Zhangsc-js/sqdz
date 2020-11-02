<template>
  <div class="infoAdd" style="height:100%">
    <el-form ref="queryForm" :model="queryForm" label-width="90px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="设备名称" prop="devName">
            <el-input v-model="queryForm.devName" plain="true" placeholder="请输入设备名称" />
          </el-form-item>
        </el-col>
        <el-col :span="6" style="margin-left: 20px">
          <el-button icon="el-icon-search" type="primary" class="btn-b" @click="getData(1)">查询</el-button>
          <el-button class="btn-w" @click="clearSearchBox">清空</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      stripe
      border
      :data="tableData"
      style="width: 100%"
      highlight-current-row
      ref="multipleTable"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="devName" label="设备名称"></el-table-column>
      <el-table-column prop="partsName" label="部件名称"></el-table-column>
      <el-table-column prop="projectName" label="项目名称"></el-table-column>
      <el-table-column prop="emergencyGrade" label="紧急等级" align="center">
        <template slot-scope="scope">
          <jt-badge v-if="scope.row.emergencyGrade === 30" status="unactivated" textValue="普通" />
          <jt-badge v-else-if="scope.row.emergencyGrade === 20" status="warning" textValue="一般" />
          <jt-badge v-else-if="scope.row.emergencyGrade === 10" status="error" textValue="紧急" />
        </template>
      </el-table-column>
      <el-table-column prop="reportTime" :formatter="formatter" label="报修时间"></el-table-column>
      <el-table-column prop="reportSource" label="异常来源">
        <template slot-scope="scope">
          <span v-if="scope.row.reportSource === 1">点检</span>
          <span v-else-if="scope.row.reportSource === 2">巡检</span>
          <span v-else-if="scope.row.reportSource === 3">润滑</span>
          <span v-else-if="scope.row.reportSource === 4">保养</span>
          <span v-else>其他</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="realtimeData"
        label="现场情况"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="exceptionReason"
        label="故障原因"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="repairMethod"
        label="维修方法"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column prop="applicantName" label="申请人" align="center"></el-table-column>
      <el-table-column prop="status" label="处理状态" align="center">
        <template slot-scope="scope">
          <jt-badge v-if="scope.row.status === 0" status="unactivated" textValue="待处理" />
          <jt-badge v-else-if="scope.row.status === 1" status="processing" textValue="处理中" />
          <jt-badge v-else-if="scope.row.status === 2" status="warning" textValue="已完成" />
          <jt-badge v-else-if="scope.row.status === 9" status="error" textValue="已停止" />
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :total="total"
      :page.sync="page.pageNum"
      :limit.sync="page.pageSize"
      @pagination="getData"
    />
    <!--  确定行 -->
    <el-row style="text-align:center;padding:10px">
      <el-button icon="el-icon-check" type="primary" @click="check()">确定</el-button>
    </el-row>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import JtBadge from "@/components/JtBadge";
import { getPendingRecords, addRepairRecord } from "@/api/dev/devRepair";
import { simpleDateFormat } from "@/utils";
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("sysDev");

export default {
  components: {
    Pagination,
    JtBadge
  },
  data() {
    return {
      queryForm: {
        devName: ""
      },
      page: {
        pageNum: 1,
        pageSize: 10
      },
      tableData: [],
      total: 0
    };
  },
  methods: {
    getData() {
      let params = {
        ...this.queryForm,
        ...this.page
      };
      getPendingRecords(params)
        .then(response => {
          const result = response.data;
          if (result.success) {
            this.tableData = result.data.rows;
            this.total = result.data.total;
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    clearSearchBox() {
      this.$refs["queryForm"].resetFields();
    },
    formatter(r, c, v) {
      return simpleDateFormat(v, "yyyy-MM-dd HH:mm");
    },
    check() {
      let rows = this.$refs.multipleTable.store.states.selection;
      addRepairRecord(this.orderNO, rows).then(res => {
        if (res.data.success) {
          this.$message.success("添加成功");
          this.$emit("close");
        }
      });
    }
  },
  mounted() {
    this.getData();
  },
  computed: {
    ...mapState(["orderNO"])
  },
  props: {
    count: {
      type: Number,
      required: false
    }
  },
  watch: {
    count() {
      this.getData();
    }
  }
};
</script>

<style>
</style>
