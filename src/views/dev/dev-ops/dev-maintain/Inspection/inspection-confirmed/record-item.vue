<template>
  <div>
    <!-- <el-row>
      <el-form ref="queryForm" :model="queryForm" label-width="80px" class="margin20 mb0">
        <el-col :span="8">
          <el-form-item label="设备名称" prop="devName">
            <el-input
                    id="devName"
                    v-model="queryForm.devName"
                    plain="true"
                    placeholder="请输入设备名称"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6" >
          <el-button icon="el-icon-search" href="javascript:void(0)" type="primary"  @click="getData(1)">查询</el-button>
          <el-button href="javascript:void(0)" @click="clearSearchBox">清空</el-button>
        </el-col>
      </el-form>
    </el-row>-->
    <el-divider content-position="center">巡检设备</el-divider>
    <el-table
      stripe
      border
      highlight-current-row
      @row-click="getItemTableData"
      :data="devTableData"
      style="width: 100%"
    >
      <el-table-column prop="devCode" label="设备编码"></el-table-column>
      <el-table-column prop="devName" label="设备名称"></el-table-column>
      <el-table-column prop="count" label="巡检项目数"></el-table-column>
    </el-table>
    <el-divider content-position="center">设备巡检项目</el-divider>
    <el-table stripe border highlight-current-row :data="tableData" style="width: 100%">
      <!-- <el-table-column prop="sort" label="编号"></el-table-column> -->
      <el-table-column prop="item.itemInfoNo" label="巡检项信息编码"></el-table-column>
      <el-table-column prop="item.partsName" label="部件名称"></el-table-column>
      <el-table-column prop="item.projectName" label="项目名称"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1">
            <jt-badge textValue="正常" />
          </span>
          <span v-if="scope.row.status == 8">
            <jt-badge status="warning" textValue="已报修" />
          </span>
          <span v-if="scope.row.status == 9">
            <jt-badge status="error" textValue="异常" />
          </span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="80px">
        <template v-slot="scope">
          <el-button type="text" size="small" @click="detailsRecordItem(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="记录详情" :visible.sync="dialogVisible" width="65%" append-to-body>
      <item-info :row="row" @hidenDialog="hidenDialog" style="height: 60vh;overflow: auto;" />
    </el-dialog>
  </div>
</template>

<script>
import { getInspectionRecordItems, getInsDevByRecordNo } from "@/api/device";
import Pagination from "@/components/Pagination";
import ItemInfo from "./record-item-info";
import JtBadge from "@/components/JtBadge";

export default {
  name: "RecordItem",
  components: {
    Pagination,
    ItemInfo,
    JtBadge
  },
  data() {
    return {
      page: {
        pageNum: 1,
        pageSize: 10
      },
      queryForm: {
        devName: ""
      },
      tableData: [],
      devTableData: [],
      total: 0,
      row: "",
      recordItemId: null,
      dialogVisible: false
    };
  },
  props: {
    recordNo: {
      type: String,
      required: true
    }
  },
  watch: {
    recordNo() {
      this.getDevData();
      this.tableData = [];
    }
  },
  mounted() {
    this.getDevData();
  },
  methods: {
    // 获取中间设备信息
    getDevData() {
      const params = {
        inspectionRecordNo: this.recordNo
      };
      getInsDevByRecordNo(params).then(response => {
        const result = response.data;
        if (result.success) {
          this.devTableData = result.data;
        } else {
          this.$message.error(result.message);
        }
      });
    },
    getItemTableData(row) {
      const params = {
        devCode: row.devCode,
        inspectionRecordNo: this.recordNo
      };
      getInspectionRecordItems(params)
        .then(response => {
          const result = response.data;
          if (result.success && result.data) {
            this.tableData = response.data.data;
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    detailsRecordItem(row) {
      this.row = row;
      this.dialogVisible = true;
    },
    hidenDialog() {
      this.dialogVisible = true;
    },
    clearSearchBox() {
      this.$refs["queryForm"].resetFields();
    }
  }
};
</script>
