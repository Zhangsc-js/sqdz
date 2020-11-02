<template>
  <div>
    <el-form ref="queryForm" :inline="true"  :model="queryForm" label-width="100px" class="margin20 mb0">
      <el-form-item label="化验项目" prop="labProname">
        <el-input :maxlength="12" plain="true" placeholder="请输入化验项目" />
      </el-form-item>
      <el-form-item>
        <el-button
          icon="el-icon-search"
          href="javascript:void(0)"
          type="primary"
          class="btn-b"
          @click="getData"
        >查询</el-button>
        <el-button href="javascript:void(0)" class="btn-w" @click="clearSearchBox">清空</el-button>
        <!-- <el-button type="primary" @click="addInput()" icon="el-icon-plus">新增</el-button> -->
      </el-form-item>
    </el-form>
    <div class="tableshadow margin20" style="width:calc(100% - 40px);padding:20px 0;">
      <el-table :data="tableData">
        <el-table-column prop="labProname" label="化验项目"></el-table-column>
        <el-table-column prop label="化验指标"></el-table-column>
        <el-table-column label="是否留存">
          <template v-slot="scope">
            <el-tooltip placement="right" v-if="scope.row.isRemain">
              <div slot="content">
                应取样时间：
                <br />取样小组：
                <br />取样人员：
                <br />取样地点：
              </div>
              <el-buttom type="text">是</el-buttom>
            </el-tooltip>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="cennter" width="120">
          <template v-slot="scope">
            <el-button type="text" size="small" @click="assign(scope.row)">分配</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="height:32px;">
        <Pagination
          :total="total"
          :page.sync="page.pageNum"
          :limit.sync="page.pageSize"
          @pagination="getData"
        />
      </div>
      <el-dialog title="分配" :visible.sync="dialogVisible" width="70%">
        <assignment @hidenDialog="hidenDialog" :assignItem="selItem" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import Assignment from "./assignment"

export default {
  name: "labAssign",
  components: {
    Pagination,
    Assignment
  },
  data() {
    return {
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      loading: false,
      tableData: [{}],
      queryForm: { labProname: "" },
      selItem:{},
      dialogVisible:false
    };
  },
  methods: {
    getData() {},
    clearSearchBox() {
      this.queryForm = { labProname: "" };
    },
    assign(item) {
      this.selItem = item;
      this.dialogVisible = true;
    },
    hidenDialog() {
      this.dialogVisible = false;
      this.getData();
    }
  
  }
};
</script>

<style scoped>
</style>