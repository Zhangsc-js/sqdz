<template>
  <div>
    <el-table :data="tableData" stripe border style="width: 100%;" height="100%">
      <el-table-column prop="recordNo" label="点检单号"></el-table-column>
      <el-table-column prop="planName" label="任务名称" align="center" width="200"></el-table-column>
      <el-table-column prop="planStartTime" label="计划开始" align="center" width="180"></el-table-column>
      <el-table-column prop="planEndTime" label="计划截止" align="center" width="180"></el-table-column>
      <el-table-column prop="startTime" label="实际开始" align="center" width="180"></el-table-column>
      <el-table-column prop="endTime" label="实际完成" align="center" width="180"></el-table-column>
      <el-table-column prop="status" label="状态" align="center" width="100">
        <template v-slot="scope">
          <span v-if="scope.row.status == 1">
            <jt-badge status="success" textValue="已完成" />
          </span>
          <span v-else-if="scope.row.status == 2">
            <jt-badge status="error" textValue="已过期" />
          </span>
          <span v-else-if="scope.row.status == 0">
            <jt-badge status="processing" textValue="执行中" />
          </span>
          <span v-else-if="scope.row.status == 3">
            <jt-badge status="warning" textValue="超期完成" />
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="result" label="点检结果" align="center" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.result == 1"><jt-badge textValue='正常'/></span>
          <span v-if="scope.row.result == 9"><jt-badge status="error" textValue='异常'/></span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { selectRecordGroupByCode } from '@/api/device'
import { isEmpty } from '@/utils/index'
import JtBadge from '@/components/JtBadge' 

export default {
  name: 'SpotCheckRecord',
  components: {
    JtBadge
  },
  data() {
    return {
      tableData: [],
      page: {
        pageNum: 1,
        pageSize: 5
      },
      currActiveName: "spotCheckRecord"
    }
  },
  props: {
    activeName: {
      type: String,
      required: true,
      default: ""
    }
  },
  computed: {
    selectNodeNo() {
      return this.$store.state.sysDev.selectNodeNO
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
      selectRecordGroupByCode(params).then(response => {
        const result = response.data
        if (result.success) {
          this.tableData = result.data
        } else {
          this.$message.error(result.message)
        }
      }).catch(e => {
        this.$message.error(e.message)
      })
    }
  }
}
</script>
