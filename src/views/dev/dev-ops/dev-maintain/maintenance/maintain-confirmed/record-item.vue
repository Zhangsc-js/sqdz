<template>
  <div>
    <el-divider content-position="center">保养设备</el-divider>
    <el-table stripe border highlight-current-row @row-click="getItemTableData" :data="devTableData" style="width: 100%">
      <el-table-column prop="devCode" label="设备编码"></el-table-column>
      <el-table-column prop="devName" label="设备名称"></el-table-column>
      <el-table-column prop="count" label="保养项目数"></el-table-column>
    </el-table>
    <el-divider content-position="center">设备保养项目</el-divider>
    <el-table stripe border highlight-current-row :data="tableData" style="width: 100%">
      <el-table-column prop="itemInfoNo" label="保养项信息编码"></el-table-column>
      <el-table-column prop="partsName" label="保养部位"></el-table-column>
      <el-table-column prop="projectName" label="保养项目"></el-table-column>
      <el-table-column prop="methodName" label="保养方法"></el-table-column>
      <el-table-column prop="criteriaName" label="保养标准"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1"><jt-badge textValue='正常'/></span>
          <span v-if="scope.row.status == 8"><jt-badge status="warning" textValue='已报修'/></span>
          <span v-if="scope.row.status == 9"><jt-badge status="error" textValue='异常'/></span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="80px">
        <template v-slot="scope">
          <el-button type="text" size="small" @click="detailsRecordItem(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <Pagination :total="total" :page.sync="page.pageNum" :limit.sync="page.pageSize" @pagination="getData"/>
    <div slot="footer" class="dialog-footer">
      <div style="padding-bottom: 48px"></div>
    </div> -->
    <el-dialog title="记录详情" :visible.sync="dialogVisible" width="65%" append-to-body>
      <item-info :recordItem="recordItem" @hidenDialog="hidenDialog" style="height: 60vh;overflow: auto;"/>
    </el-dialog>
  </div>
</template>

<script>
import { 
  getCheckingRecordItems, 
  getDevByRecordNo } from '@/api/dev/devMaintain'
import Pagination from '@/components/Pagination'
import ItemInfo from './item-info'
import JtBadge from '@/components/JtBadge'

export default {
  name: 'RecordItem',
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
        devName: ''
      },
      tableData: [],
      devTableData: [],
      total: 0,
      recordItem: null,
      dialogVisible: false
    }
  },
  props: {
    recordNo: {
      type: String,
      required: true
    }
  },
  watch: {
    recordNo() {
      this.getDevData()
      this.tableData = []
    }
  },
  mounted() {
    this.getDevData()
  },
  methods: {
    // 获取中间设备信息
    getDevData() {
      const params = {
        recordNo: this.recordNo
      }
      getDevByRecordNo(params).then(response => {
        const result = response.data
        if (result.success) {
          this.devTableData = result.data
        } else {
          this.$message.error(result.message)
        }
      })
    },
    getItemTableData(row) {
      const params = {
        devCode: row.devCode,
        recordNo: this.recordNo
      }
      getCheckingRecordItems(params).then(response => {
        const result = response.data
        if (result.success && result.data) {
          this.tableData = response.data.data
        } else {
          this.$message.error(result.message)
        }
      }).catch(e => {
        this.$message.error(e.message)
      })
    },
    detailsRecordItem(row) {
      this.recordItem = row
      this.dialogVisible = true
    },
    hidenDialog() {
      this.dialogVisible = true
    },
    clearSearchBox() {
      this.$refs['queryForm'].resetFields()
    }
  }
}
</script>
