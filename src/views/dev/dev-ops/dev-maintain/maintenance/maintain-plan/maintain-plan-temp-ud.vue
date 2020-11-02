<template>
  <div>
    <el-divider content-position="center">基础信息</el-divider>
    <el-form :model="updateForm" ref="updateForm" label-width="80px" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="模板编码" prop="tempNo">
            <el-input :disabled="true" v-model="updateForm.tempNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="模板名称" prop="tempName">
            <el-input v-model="updateForm.tempName" :disabled="disabled"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="updateForm.remark" :disabled="disabled" placeholder="请输入备注" plain="true"/>
          </el-form-item>
        </el-col>
        <el-col :span="2" v-if="!disabled" :offset="2" style="padding-top: 25px">
          <el-button type="primary" @click="save()">保存</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div>
      <div class="padding20 pt12" v-if="!disabled">
        <el-button type="primary" @click="addCheckingTempItem()" icon="el-icon-plus">新增</el-button>
      </div>
      <el-divider content-position="center">保养设备</el-divider>
      <el-table stripe border highlight-current-row @row-click="getTableData" :data="devTableData" style="width: 100%">
        <el-table-column prop="devNo" label="设备编码"></el-table-column>
        <el-table-column prop="devName" label="设备名称"></el-table-column>
        <el-table-column prop="count" label="保养项目数"></el-table-column>
        <el-table-column
          fixed="right" 
          align="center" 
          label="操作" 
          width="230px">
          <template v-slot="scope">
            <el-button type="text" size="small" @click="deleteByDevNoAndTempNo(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-divider content-position="center">设备保养项目</el-divider>
      <el-table stripe border highlight-current-row :data="tableData" style="width: 100%">
        <el-table-column prop="itemInfoNo" label="保养项信息编码"></el-table-column>
        <el-table-column prop="partsName" label="保养部位"></el-table-column>
        <el-table-column prop="projectName" label="保养项目"></el-table-column>
        <el-table-column prop="methodName" label="保养方法"></el-table-column>
        <el-table-column prop="criteriaName" label="保养标准"></el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="170px">
          <template v-slot="scope">
            <el-button v-if="!disabled" type="text" size="small" @click="deletePlanItem(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="title" append-to-body :visible.sync="dialogVisible" width="65%">
      <component
        :is="dialogComponent"
        @hidenDialog="hidenDialog"
        :tempNo="updateForm.tempNo"
        :itemId="itemId"></component>
    </el-dialog>
  </div>
</template>

<script>
import CheckingPlanItemAdd from './temp-item-add'
import Pagination from '@/components/Pagination'
import {
  getCheckingTempItems,
  deleteCheckingTempItem,
  batchDelCheckingTempItems,
  getCheckingTempById,
  updateCheckingTemp,
  getTempGroupByDev,
  deleteBydevNo } from '@/api/dev/devMaintain'

export default {
  name: 'CheckingPlanUpd',
  components: {
    Pagination,
    CheckingPlanItemAdd
  },
  props: {
    disabled: {
      type: Boolean,
      required: true
    },
    tempId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      updateForm: {},
      rules: {
        tempName: [{ required: true, message: '请选输入设备名称',  trigger: 'change' }]
      },
      queryForm: {
        devName: ''
      },
      tableData: [],
      sels: [],
      page: {
        pageNum: 1,
        pageSize: 5
      },
      pageSizes: [5, 10, 20, 50],
      total: 0,
      batchBtnVisibles: true,
      title: '',
      dialogVisible: false,
      dialogComponent: null,
      itemId: '',
      itemDisabled: false,
      devTableData: [],
      selDevNo: null
    }
  },
  watch: {
    tempId() {
      this.getData()
      this.tableData = []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData(pageNum) {
      if (pageNum ===1 ) {
        this.page.pageNum = 1
      }
      getCheckingTempById(this.tempId).then(response => {
        const result = response.data
        if (result.success) {
          this.updateForm = result.data
          this.getDevData()
        } else {
          this.$message.error(result.message)
        }
      }).catch(e => {
        this.$message.error(e.message)
      })
    },
    getTableData(row) {
      if (row) {
        this.selDevNo = row.devNo
      }
      const params = {
        tempNo: this.updateForm.tempNo,
        devNo: this.selDevNo
      }
      getCheckingTempItems(params).then(response => {
        if (response.data.data) {
          this.tableData = response.data.data
        }
      }).catch(e => {
        this.$message.error(e.message)
      })
    },
    // 获取中间设备信息
    getDevData() {
      const params = {
        tempNo: this.updateForm.tempNo
      }
      getTempGroupByDev(params).then(response => {
        const result = response.data
        if (result.success) {
          this.devTableData = result.data
        } else {
          this.$message.error(result.message)
        }
      })
    },
    deleteByDevNoAndTempNo(row) {
      const params = {
        devNo: row.devNo,
        tempNo: row.tempNo
      }
      this.$confirm('此操作将永久删除该记录及其子记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteBydevNo(params).then(response => {
          const result = response.data
          if (result.success) {
            this.$message.success('删除成功!')
            // 清空字表
            this.tableData = []
            // 刷新主表
            this.getDevData()
          } else {
            this.$message.error(result.message)
          }
        })
      }).catch(e => {
        this.$message.info('已取消删除')
      })
    },
    save() {
      this.$refs['updateForm'].validate(valid => {
        if (valid) {
          updateCheckingTemp(this.updateForm).then(response => {
            const result = response.data
            if (result.success) {
              this.$message.success('保存成功')
            } else {
              this.$message.error(result.message)
            }
          }).catch(e => {
            this.$message.error(e.message)
          }).finally(() => {
            this.cancel()
          })
        } else {
          this.$message.error('保存失败，请检查必填项是否都正确填写')
          return false
        }
      })
    },
    addCheckingTempItem() {
      this.dialogVisible = true
      this.dialogComponent = CheckingPlanItemAdd
      this.title = '选择设备'
    },
    deletePlanItem(id) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCheckingTempItem(id).then(response => {
          const result = response.data
          if (result.success) {
            this.$message.success('删除成功!')
            this.getTableData()
            this.getDevData();
          } else {
            this.$message.error(result.message)
          }
        })
      }).catch(e => {
        this.$message.info('已取消删除')
      })
    },
    batchDelete() {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchDelCheckingTempItems(this.sels).then(response => {
          const result = response.data
          if (result.success) {
            this.$message.success('删除成功!')
            this.getTableData()
          } else {
            this.$message.error(result.message)
          }
        })
      }).catch(e => {
        this.$message.info('已取消删除')
      })
    },
    hidenDialog() {
      this.dialogVisible = false
      this.getDevData()
      this.tableData = []
    },
    selsChange: function(sels) {
      this.sels.length = 0
      const _this = this
      sels.forEach(element => {
        _this.sels.push(element.id)
      })
      this.batchBtnVisibles = this.sels.length === 0
    },
    clearSearchBox() {
      this.$refs['queryForm'].resetFields()
    },
    cancel() {
      this.$emit('hidenDialog')
    }
  }
}
</script>
