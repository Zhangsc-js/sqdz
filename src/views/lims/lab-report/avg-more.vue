<template>
  <div>
    <el-table :data="tableData">
      <el-table-column prop="workShop" align="center" label="取样车间" v-if="rowObject.type === '随机'"></el-table-column>
      <el-table-column prop="sampPlace" align="center" label="取样地点" v-if="rowObject.type === '随机'"></el-table-column>
      <el-table-column prop="receivePlace" align="center" label="收样地点"></el-table-column>
      <el-table-column prop="labGroup" align="center" label="化验班组"></el-table-column>
      <el-table-column prop="labName" align="center" label="化验室"></el-table-column>
      <el-table-column prop="labOperator" align="center" label="化验人员"></el-table-column>
      <el-table-column prop="labTime" align="center" width="180" label="化验时间"></el-table-column>
      <el-table-column align="center" label="化验结果">
        <template slot-scope="scope">
          <span v-if="scope.row.isReach<=2" style="color:red">{{ scope.row.labResult }}</span>
          <span v-else style="color: #37B328">{{ scope.row.labResult }}</span>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :total="total"
      :page.sync="page.pageNum"
      :limit.sync="page.pageSize"
      @pagination="getData"
    />
  </div>
</template>

<script>
  import {getLabAvgDetail} from '@/api/lims'
  import Pagination from "@/components/Pagination";

  export default {
    name: "avgMore",
    components: {
      Pagination
    },
    data() {
      return {
        page: {
          pageNum: 1,
          pageSize: 10
        },
        total: 0,
        tableData: []
        //formLabelWidth: '100px'
      }
    },
    props: {
      rowObject: {
        type: Object,
        required: true
      }
    },
    watch: {
      rowObject() {
        this.getData();
      }
    },
    mounted() {
      this.getData();
    },
    methods: {
      getData() {
        getLabAvgDetail(this.page, this.rowObject).then((response) => {
          const result = response.data.data;
          this.total = result.total;
          this.tableData = result.rows;
        }).catch(e => {
          this.$message.error(e.message)
        })
      }
    }
  }
</script>

<style scoped>

</style>
