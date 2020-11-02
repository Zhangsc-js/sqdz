<template>
  <div>
    <el-form :model="addForm" ref="addForm" label-width="80px" :rules="rules">
      <el-divider content-position="center">基础信息</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="模板编码" prop="tempNo">
            <el-input v-model="addForm.tempNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="模板名称" prop="tempName">
            <el-input v-model="addForm.tempName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="addForm.remark" placeholder="请输入备注" plain="true"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save()" :disabled="!disabled">保存</el-button>
    </div>
    <el-divider content-position="center">点检设备</el-divider>
    <el-button :disabled="disabled" type="primary" @click="addCheckingTempItem()" icon="el-icon-plus">新增</el-button>
    <el-table stripe border highlight-current-row @row-click="getTableData" :data="devTableData" style="width: 100%">
      <el-table-column prop="devNo" label="设备编码"></el-table-column>
      <el-table-column prop="devName" label="设备名称"></el-table-column>
      <el-table-column prop="count" label="点检项目数"></el-table-column>
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
    <el-divider content-position="center">设备点检项目</el-divider>
    <el-table stripe border :data="itemTableData" style="width: 100%">
      <el-table-column prop="item.itemInfoNo" label="点检项信息编码"></el-table-column>
      <el-table-column prop="item.partsName" label="点检部位"></el-table-column>
      <el-table-column prop="item.projectName" label="点检项目"></el-table-column>
      <el-table-column prop="item.methodName" label="点检方法"></el-table-column>
      <el-table-column prop="item.criteriaName" label="点检标准"></el-table-column>
      <el-table-column
        fixed="right" 
        align="center" 
        label="操作" 
        width="170">
        <template v-slot="scope">
          <el-button type="text" size="small" @click="deletePlanItem(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="title" append-to-body :visible.sync="dialogVisible" width="65%">
      <component
        :is="dialogComponent"
        @hidenDialog="hihidenAddDialogd"
        :tempNo="tempNo"></component>
    </el-dialog>
  </div>
</template>

<script>
import {
  addCheckingTemp,
  getTempGroupByDev,
  deleteBydevNo,
  getCheckingTempItems,
  deleteCheckingTempItem
} from '@/api/device'
import CheckingPlanItemAdd from './temp-item-add'

export default {
  name: 'CheckingPlanAdd',
  components: {
    CheckingPlanItemAdd
  },
  data() {
    return {
      addForm: {
        tempName: null,
        tempNo: null,
        remark: null
      },
      rules: {
        tempName: [{ required: true, message: '请输入模版名称',  trigger: 'change' }],
        tempNo: [{ required: true, message: '请选输入模版编码',  trigger: 'change' }]
      },
      devTableData: [],
      itemTableData: [],
      disabled: true,
      dialogVisible: false,
      tempNo: null,
      dialogComponent: null,
      title: ''
    }
  },
  props: {
    datetime: {
      required: true,
      type: Date
    }
  },
  watch: {
    datetime() {
      this.addForm = {
        tempName: null,
        tempNo: null,
        remark: null
      }
      this.devTableData = []
      this.itemTableData = []
      this.disabled = true
    }
  },
  methods: {
    addCheckingTempItem() {
      this.dialogVisible = true
      this.dialogComponent = CheckingPlanItemAdd
      this.title = '选择设备'
    },
    save() {
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          addCheckingTemp(this.addForm).then(response => {
            const result = response.data
            if (result.success) {
              this.$message.success('保存成功')
              this.disabled = false
              this.addForm = result.data
              this.tempNo = this.addForm.tempNo
            } else {
              this.$message.error(result.message)
            }
          }).catch(e => {
            this.$message.error(e.message)
          }).finally(() => {
            this.$emit('hidenDialog')
          })
        } else {
          this.$message.error('保存失败，请检查必填项是否都正确填写')
          return false
        }
      })
    },
    // 获取中间设备信息
    getDevData() {
      const params = {
        tempNo: this.tempNo
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
    getTableData(row) {
      if (row) {
        this.selDevNo = row.devNo
      }
      const params = {
        tempNo: this.addForm.tempNo,
        devNo: this.selDevNo
      }
      getCheckingTempItems(params).then(response => {
        if (response.data.data) {
          this.itemTableData = response.data.data
        }
      }).catch(e => {
        this.$message.error(e.message)
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
            this.itemTableData = []
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
    hihidenAddDialogd() {
      this.getDevData()
      this.dialogVisible = false
    }
  }
}
</script>