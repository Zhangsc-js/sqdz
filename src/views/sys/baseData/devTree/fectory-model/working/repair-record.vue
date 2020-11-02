<template>
  <div>
    <el-table :data="tableData" stripe border style="width: 100%;height:100%" height="100%">
      <el-table-column prop="reportTime" label="报修时间" align="center" width="200"></el-table-column>
      <el-table-column prop="processTime" label="处理时间" align="center" width="200"></el-table-column>
      <el-table-column prop="partsName" label="维修部位" align="center" width="200"></el-table-column>
      <el-table-column prop="status" label="处理状态" align="center">
        <template slot-scope="scope">
          <jt-badge v-if="scope.row.status === 0" status="unactivated" textValue="待处理" />
          <jt-badge v-else-if="scope.row.status === 1" status="warning" textValue="待维修" />
          <jt-badge v-else-if="scope.row.status === 2" status="success" textValue="已关闭" />
        </template>
      </el-table-column>
      <el-table-column prop="order.orderName" label="所在维修单" align="center" width="200"></el-table-column>
      <el-table-column prop="orderNo" label="维修单号" width="'10%'" align="center"></el-table-column>
      <el-table-column prop="status" label="处理状态" align="center">
        <template slot-scope="scope">
          <jt-badge v-if="scope.row.order && scope.row.order.status === -1" status="unactivated" textValue="录入中" />
          <jt-badge v-if="scope.row.order && scope.row.order.status === 0" status="warning" textValue="待执行" />
          <jt-badge v-if="scope.row.order && scope.row.order.status === 1" status="processing" textValue="维修中" />
          <jt-badge v-else-if="scope.row.order && scope.row.order.status === 2" status="success" textValue="已关闭" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { groupByCode } from '@/api/dev/devRepair'
import { isEmpty } from '@/utils/index'
import JtBadge from '@/components/JtBadge'

export default {
  name: 'RepairRecord',
  components: {
    JtBadge
  },
  data() {
    return {
      tableData: [],
      page: {
        pageSize: 5,
        pageNum: 1
      },
      currActiveName: "repairRecord"
    }
  },
  computed: {
    selectNodeNo() {
      return this.$store.state.sysDev.selectNodeNO
    }
  },
  props: {
    activeName: {
      type: String,
      required: true,
      default: ""
    }
  },
  watch: {
    selectNodeNo() {
      if (this.activeName == this.currActiveName) {
        this.getData()
      }
    },
    activeName() {
      if (this.activeName == this.currActiveName) {
        this.getData();
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      if (isEmpty(this.selectNodeNo)) return
      const params = {
        devCode: this.selectNodeNo
      }
      groupByCode(params).then(response => {
        let data = response.data
        if (data.success) {
          this.tableData = data.data.rows
        } else {
          this.$message.error(data.message)
        }
      }).catch(e => {
        this.$message.error(e.message)
      })
    }
  }
}
</script>
