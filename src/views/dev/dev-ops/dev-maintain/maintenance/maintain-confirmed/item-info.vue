<template>
  <div>
    <el-form ref="itemInfoForm" :model="itemInfoForm" label-width="200px">
      <el-divider content-position="center">基础信息</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备名称:" prop="devName">
            <span>{{ itemInfoForm.devName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部位名称:" prop="partsName">
            <span>{{ itemInfoForm.partsName }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="保养项目:" prop="projectName" >
            <span>{{ itemInfoForm.projectName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="保养方法:" prop="methodName" >
            <span>{{ itemInfoForm.methodName }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="状态:" prop="status" >
            <span v-if="itemInfoForm.status == 1">{{ '正常'}}</span>
            <span v-else-if="itemInfoForm.status == 8">{{ '已上报'}}</span>
            <span v-else-if="itemInfoForm.status == 9">{{ '异常'}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="center">异常信息</el-divider>
      <!-- <el-row>
        <el-col :span="24">
          <el-form-item label="异常原因:" prop="exceptionReason" >
            <span>{{ itemInfoForm.exceptionReason }}</span>
          </el-form-item>
        </el-col>
      </el-row> -->
      <!-- <el-row>
        <el-col :span="24">
          <el-form-item label="异常处理方法:" prop="exceptionHandleMethod" >
            <span>{{ itemInfoForm.exceptionHandleMethod }}</span>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row>
        <el-col :span="24">
          <el-form-item label="处理情况:" prop="exceptionHandleResult" >
            <span>{{ itemInfoForm.exceptionHandleResult }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="center">实时数据</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="现场情况:" prop="realtimeData" >
            <span>{{ itemInfoForm.realtimeData }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
          <el-col :span="8" v-for="item in srcList" :key="item">
            <el-form-item label="照片" prop="item" >
              <div class="demo-image__preview">
                <el-image
                  style="width: 300px; height: 300px"
                  :src="item">
                </el-image>
              </div>
            </el-form-item>
          </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import {
 getFileList } from '@/api/device'
import {
  getCheckingRecordItemById
} from '@/api/dev/devMaintain'
export default {
  name: 'ItemInfo',
  data() {
    return {
      disabled: true,
      srcList: [],
      itemInfoForm: null
    }
  },
  props: {
    recordItem: {
      type: Object,
      required: true,
      required: true
    }
  },
  watch: {
    recordItem() {
      this.itemInfoForm = this.recordItem
    }
  },
  created() {
    this.itemInfoForm = this.recordItem
  },
  methods: {
    getData(pageNum) {
      if (pageNum ===1 ) {
        this.page.pageNum = 1
      }
      this.srcList = []
      getCheckingRecordItemById(this.recordItemId).then(response => {
        const result = response.data
        if (result.success) {
          this.itemInfoForm = result.data
          if (this.itemInfoForm.photo) {
            const params = { ids: this.itemInfoForm.photo }
            getFileList(params).then(response => {
              const result = response.data
              if (result.success) {
                const imgServer = process.env.VUE_APP_DEV_IMAGE_URL
                for (const e of result.data) {
                  this.srcList.push(imgServer + e.uploadName)
                }
              } else {
                this.$message.error(result.message)
              }
            }).catch(e => {
              this.$message.error(e.message)
            })
          }
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
