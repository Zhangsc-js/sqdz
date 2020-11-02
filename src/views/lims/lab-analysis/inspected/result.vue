<template>
  <div>
    <div class="tableshadow" style="padding:20px 0;">
      <el-table :data="tableData">
        <el-table-column prop="elName" label="化验元素名称"></el-table-column>
        <el-table-column prop="labOp" label="化验人员"></el-table-column>
        <el-table-column prop="paramList" label="参数列表"></el-table-column>
        <el-table-column prop="params" label="参数值"></el-table-column>
        <el-table-column prop="output" label="输出值"></el-table-column>
        <el-table-column prop="standards" label="是否达标"></el-table-column>
      </el-table>
      <div style="height:32px;">
        <Pagination
          :total="total"
          :page.sync="page.pageNum"
          :limit.sync="page.pageSize"
          @pagination="getData"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";

export default {
  name: "result",
  components: {
    Pagination
  },
  data() {
    return {
      itemId:null,
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      loading: false,
      tableData: [],
      queryForm: {}
    };
  },
  props: {
    selId: {
      type: String,
      required: true
    }
  },
  mounted(){
    this.itemId = this.selId;
    this.getData();
  },
  methods: {
    getData() {
      console.log(this.selId);
    },
    clearSearchBox() {
      this.queryForm = {
        labProname: ""
      };
    }
  }
};
</script>
