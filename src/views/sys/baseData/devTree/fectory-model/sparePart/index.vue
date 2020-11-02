<template>
  <!-- 备品备件管理 -->
  <div class="sparePart" style="height:100%">
    <header>
      <!-- 新增行 -->
      <el-row style="padding-right:20px">
        <el-button icon="el-icon-plus" type="primary" @click="addRow">新增</el-button>
      </el-row>
    </header>
    <el-table :data="tableData" border stripe style="width: 100%" height="calc(100% - 102px)">
      <el-table-column prop="devCode" label="设备编码"></el-table-column>
      <el-table-column prop="sparesCode" label="备品备件编码"></el-table-column>
      <el-table-column prop="sparesName" label="备品备件名称"></el-table-column>
      <el-table-column prop="modelNumber" label="型号"></el-table-column>
      <el-table-column prop="specification" label="规格"></el-table-column>
      <el-table-column prop="quality" label="材质"></el-table-column>
      <el-table-column prop="sparesType" label="性质">
        <template v-slot="{row}">
          <span v-if="row.sparesType=='1'">{{'关键备品备件'}}</span>
          <span v-if="row.sparesType=='2'">{{'一般性备品备件'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="replenishType" label="补货类型">
        <template v-slot="{row}">
          <span v-if="row.replenishType=='1'">{{'采购'}}</span>
          <span v-if="row.replenishType=='2'">{{'自制'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template v-slot="{row}">
          <el-button type="text" @click="delRow(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      v-if="total > -1"
      :total="total"
      :page.sync="page.pageNum"
      :limit.sync="page.pageSize"
      @pagination="getData"
    />

    <!-- 弹框 -->

    <el-dialog title="备品备件新增" :visible.sync="dialogVisible" width="60%">
      <partAdd @close="close" :count="count"></partAdd>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { queryDevSpares, delById } from "@/api/sys/dev";
import partAdd from "./partAdd";
export default {
  components: {
    Pagination,
    partAdd
  },
  data() {
    return {
      tableData: [],
      total: 0,
      page: {
        pageNum: 1,
        pageSize: 10
      },
      dialogVisible: false,
      count: 0,
      currActiveName: "devSparePart"
    };
  },
  props: {
    activeName: {
      type: String,
      required: false,
      default: ""
    }
  },
  computed: {
    selectNodeNO() {
      return this.$store.state.sysDev.selectNodeNO;
    }
  },
  watch: {
    selectNodeNO() {
      if (this.activeName == this.currActiveName) {
        this.getData();
      }
    },
    activeName() {
      if (this.activeName == this.currActiveName) {
        this.getData();
      }
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      let params = {
        ...this.page,
        devCode: this.selectNodeNO
      };
      queryDevSpares(params).then(res => {
        this.tableData = res.data.data.rows;
        this.total = res.data.data.total;
      });
    },
    delRow(id) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delById({ id }).then(res => {
            if (res.data.success) {
              this.$message.success("删除成功");
              this.getData();
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    addRow() {
      this.dialogVisible = true;
      this.count++;
    },
    close() {
      (this.dialogVisible = false), this.getData();
    }
  }
};
</script>

<style >
.sparePart .el-dialog {
  height: 100%;
}
</style>
