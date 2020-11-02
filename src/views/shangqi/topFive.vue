<template>
  <div class="topFive">
    <el-table :data="tableData" :border="false" stripe style="width: 100%">
      <el-table-column width="80" label="TOPN" align="center">
        <template v-slot="{$index}">
          <span>{{$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="barcode" label="条码" align="center"></el-table-column>
      <el-table-column prop="inTime" label="入库时间" align="center"></el-table-column>
      <el-table-column prop="duration" label="在库时长（h）" align="center"></el-table-column>
    </el-table>
  </div>
</template>

  <script>
import { list_not_outbound_in_storage_time } from '@/api/abcd.js'
export default {
  data() {
    return {
      tableData: [],
      rowNum: 5
    }
  },
  methods: {
    async getData(shopName) {
      let res = await list_not_outbound_in_storage_time({ rowNum: this.rowNum, shopName, workCode: "78" })
      if (res.data.success) {
        this.tableData = res.data.data
      }
    }
  },
}
  </script>

<style lang='scss'>
.topFive {
  padding-bottom: 20px;
  /* background-color: pink; */
  .el-table,
  .el-table__expanded-cell {
    // /* background-color: #FFF; */
    background-color: rgba(0, 0, 0, 0);
  }
}
.topFive th .cell {
  font-size: 20px;
}
.topFive td .cell {
  font-size: 18px;
}
</style>
