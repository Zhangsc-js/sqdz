<template>
  <div>
    <el-form ref="updDevAccount" :model="updDevAccount" :rules="rules" label-width="80px">
      <el-divider content-position="center">基础信息</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备名称" prop="sbmc">
            <span v-if="disabled">{{ updDevAccount.sbmc }}</span>
            <el-input v-else v-model="updDevAccount.sbmc" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备编码" prop="sbdm" >
            <span v-if="disabled">{{ updDevAccount.sbdm }}</span>
            <el-select v-else v-model="updDevAccount.sbdm" filterable placeholder="请选择" :disabled="true">
              <el-option
                v-for="item in devMap"
                :key="item.value"
                :label="item.value"
                :value="item.value">
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="英文名称" prop="sbmcEn" >
            <span v-if="disabled">{{ updDevAccount.sbmcEn }}</span>
            <el-input v-else v-model="updDevAccount.sbmcEn" :disabled="disabled"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工艺编号" prop="gybh" >
            <span v-if="disabled">{{ updDevAccount.gybh }}</span>
            <el-input v-else v-model="updDevAccount.gybh" :disabled="disabled"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="型号" prop="sbxh" >
            <span v-if="disabled">{{ updDevAccount.sbxh }}</span>
            <el-input v-else v-model="updDevAccount.sbxh" :disabled="disabled"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="规格性能" prop="ggxn" >
            <span v-if="disabled">{{ updDevAccount.ggxn }}</span>
            <el-input v-else v-model="updDevAccount.ggxn" :disabled="disabled"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="数量" prop="sl" >
            <span v-if="disabled">{{ updDevAccount.sl }}</span>
            <el-input v-else v-model="updDevAccount.sl" type="number" :disabled="disabled"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位" prop="dw" >
            <span v-if="disabled">{{ updDevAccount.dw }}</span>
            <el-input v-else v-model="updDevAccount.dw" :disabled="disabled"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="制造厂商" prop="zzcs" >
            <span v-if="disabled">{{ updDevAccount.zzcs }}</span>
            <el-input v-else v-model="updDevAccount.zzcs" :disabled="disabled"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="安装地点" prop="azdd" >
            <span v-if="disabled">{{ updDevAccount.azdd }}</span>
            <el-input v-else v-model="updDevAccount.azdd" :disabled="disabled"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出厂编号" prop="sbccbh" >
            <span v-if="disabled">{{ updDevAccount.sbccbh }}</span>
            <el-input v-else v-model="updDevAccount.sbccbh" :disabled="disabled"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="物料编码" prop="wlbm" >
            <span v-if="disabled">{{ updDevAccount.wlbm }}</span>
            <el-input v-else v-model="updDevAccount.wlbm" :disabled="disabled"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="功率" prop="glJddw" >
            <span v-if="disabled">{{ updDevAccount.glJddw }}</span>
            <el-input v-else v-model="updDevAccount.glJddw" :disabled="disabled"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="ABC分类" prop="abcFl" >
            <span v-if="disabled">{{ updDevAccount.abcFl }}</span>
              <el-select v-else v-model="updDevAccount.abcFl" :disabled="disabled">
                <el-option v-for="item in options"
                  :key="item.code"
                  :label="item.label"
                  :value="item.code">
                </el-option>
              </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="精度" prop="jd" >
            <span v-if="disabled">{{ updDevAccount.jd }}</span>
            <el-input v-else v-model="updDevAccount.jd" :disabled="disabled"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="采购时间" prop="cgsj" >
            <span v-if="disabled">{{ updDevAccount.cgsj }}</span>
            <el-date-picker v-else type="date" v-model="updDevAccount.cgsj" value-format="yyyy-MM-dd HH:mm:ss" :disabled="disabled"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="投运时间" prop="tysj" >
            <span v-if="disabled">{{ updDevAccount.tysj }}</span>
            <el-date-picker v-else type="date" v-model="updDevAccount.tysj" value-format="yyyy-MM-dd HH:mm:ss" :disabled="disabled"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
       <el-form-item label="备注" prop="bz" >
          <span v-if="disabled">{{ updDevAccount.bz }}</span>
          <el-input v-else type="textarea" :rows="2" v-model="updDevAccount.bz" :disabled="disabled"/>
       </el-form-item>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" v-if="!disabled" @click="save()">保存</el-button>
    </div>
  </div>
</template>
<script>
import { getDevAccount, updateDevAccount, getDeviceSelectMap } from '@/api/sys/dev'

export default {
  name: "DevAccountUpd",
  data() {
    return {
      updDevAccount: {},
      options: [
        { label: 'A', code: 'A' },
        { label: 'B', code: 'B' },
        { label: 'C', code: 'C' }
      ],
      rules: {
        sbmc: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
        sbdm: [{ required: true, message: '请输入设备编码', trigger: 'blur' }]
      },
      devMap: []
    }
  },
  props: {
    id: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      required: true,
      default: () => false
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getData()
      this.getMapData()
    })
  },
  watch: {
    id() {
      this.getData()
    }
  },
  methods: {
    getData() {
      getDevAccount(this.id).then(response => {
        const result = response.data
        if (result.success) {
          this.updDevAccount = Object.assign({}, result.data)
        } else {
          this.$message({
            type: 'error',
            message: result.message
          })
        }
      }).catch(e => {
        this.$message({
          type: 'error',
          message: e.message
        })
      })
    },
    save() {
      this.$refs['updDevAccount'].validate((valid) => {
        if (valid) {
          const record = {
            id: this.id,
            ...this.updDevAccount
          }
          updateDevAccount(record).then(response => {
            const result = response.data
            if (result.success) {
              this.$message.success( '更新成功')
            } else {
              this.$message.error(result.message)
            }
          }).catch(e => {
            this.$message.error(e.message)
          }).finally(() => {
            this.$emit("hidenDialog")
          })
        } else {
          this.$message.error('保存失败，请检查必填项是否都正确填写')
          return false
        }
      })
    },
    cancel() {
      this.$emit("hidenDialog")
    },
    getMapData() {
      getDeviceSelectMap().then((response) => {
        const result = response.data
        if (result.success) {
          this.devMap = result.data
        }
      }).catch(e => {
        this.$message.error(e.message)
      })
    }
  }
}
</script>
