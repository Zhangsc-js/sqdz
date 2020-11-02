<template>
  <div>
    <el-form ref="addDevAccount" :model="addDevAccount" :rules="rules" label-width="160px">
      <el-divider content-position="center">基础信息</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item v-if="newNode" label="设备名称" prop="sbmc">
            <el-input v-model="addDevAccount.sbmc"/>
          </el-form-item>
          <el-form-item v-if="!newNode" label="设备名称" prop="sbdm">
            <el-select  v-model="addDevAccount.sbdm"  @change="handleChange" filterable placeholder="请选择">
              <el-option
                v-for="item in devMap"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="newNode" label="上级设备编码" prop="sjsbdm">
            <el-select v-model="addDevAccount.sjsbdm" filterable placeholder="请选择">
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
            <el-input v-model="addDevAccount.sbmcEn"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工艺编号" prop="gybh" >
            <el-input v-model="addDevAccount.gybh"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="型号" prop="sbxh" >
            <el-input v-model="addDevAccount.sbxh"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="规格性能" prop="ggxn" >
            <el-input v-model="addDevAccount.ggxn"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="单位" prop="dw" >
            <el-input v-model="addDevAccount.dw"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="数量" prop="sl" >
            <el-input v-model="addDevAccount.sl" type="number"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="制造厂商" prop="zzcs" >
            <el-input v-model="addDevAccount.zzcs"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="安装地点" prop="azdd" >
            <el-input v-model="addDevAccount.azdd"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出厂编号" prop="sbccbh" >
            <el-input v-model="addDevAccount.sbccbh"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="物料编码" prop="wlbm" >
            <el-input v-model="addDevAccount.wlbm"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="功率" prop="glJddw" >
            <el-input v-model="addDevAccount.glJddw"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="ABC分类" prop="abcFl" >
            <el-select v-model="addDevAccount.abcFl">
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
            <el-input v-model="addDevAccount.jd"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="采购时间" prop="cgsj" >
            <el-date-picker type="date" v-model="addDevAccount.cgsj" value-format="yyyy-MM-dd HH:mm:ss" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="投运时间" prop="tysj" >
            <el-date-picker type="date" v-model="addDevAccount.tysj" value-format="yyyy-MM-dd HH:mm:ss" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
       <el-form-item label="备注" prop="bz" >
         <el-input type="textarea" :rows="2" v-model="addDevAccount.bz" />
       </el-form-item>
      </el-row>
      <!-- <el-divider content-position="center">拓展信息</el-divider>
      <el-row>
        <el-col :span="8">
          <el-form-item label="是否有外部接口" prop="sfWbjkbm" >
            <el-select v-model="addDevAccount.sfWbjkbm" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否有过程数据" prop="sfGcsj" >
            <el-select v-model="addDevAccount.sfGcsj" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否有化验数据" prop="sfHysj" >
            <el-select v-model="addDevAccount.sfHysj" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="是否有历史趋势" prop="sfLsqs" >
            <el-select v-model="addDevAccount.sfLsqs" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否KPI指标" prop="sfKpiZb" >
            <el-select v-model="addDevAccount.sfKpiZb" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否是健康危害管理点" prop="sfJkglwhd" >
            <el-select v-model="addDevAccount.sfJkglwhd" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="是否是环保体系管理点" prop="sfHbtxgld" >
            <el-select v-model="addDevAccount.sfHbtxgld" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否是质量体系管理点" prop="sfZltxgld" >
            <el-select v-model="addDevAccount.sfZltxgld" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否是计量标准器" prop="sfJlbzq" >
            <el-select v-model="addDevAccount.sfJlbzq" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="是否属于流程物料设备" prop="sfLcwlsb" >
            <el-select v-model="addDevAccount.sfLcwlsb" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否有启停数据" prop="sfQtsj" >
            <el-select v-model="addDevAccount.sfQtsj" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否属于能源计量设备" prop="sfNyjlsb" >
            <el-select v-model="addDevAccount.sfNyjlsb" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="是否属于维护设备" prop="sfWhsb" >
            <el-select v-model="addDevAccount.sfWhsb" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否属于仪表" prop="sfYb" >
            <el-select v-model="addDevAccount.sfYb" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否属于特种设备" prop="sfTzsb" >
            <el-select v-model="addDevAccount.sfTzsb" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="	设否需进行供应商分析" prop="sfGysfx" >
            <el-select v-model="addDevAccount.sfGysfx" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否衡器" prop="sfHq" >
            <el-select v-model="addDevAccount.sfHq" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否需进行成本管理" prop="sfCbgl" >
            <el-select v-model="addDevAccount.sfCbgl" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="是否3D设计设备" prop="sf3dSb" >
            <el-select v-model="addDevAccount.sf3dSb" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row> -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel()">取 消</el-button>
      <el-button type="primary" @click="save()">保存</el-button>
    </div>
  </div>
</template>

<script>
import { addDevAccount, getDeviceSelectMap } from '@/api/sys/dev'

export default {
  name: "DevAccountAdd",
  data() {
    return {
      addDevAccount: {
          sbdm: '',
          sbmc: '',
          sbmcEn: '',
          zzcs: '',
          gybh: '',
          sbxh: '',
          ggxn: '',
          dw: '',
          sl: '',
          azdd: '',
          sbccbh: '',
          wlbm: '',
          glJddw: '',
          abcFl: '',
          jd: '',
          cgsj: null,
          tysj: null,
          sfWbjkbm: null,
          sfGcsj: null,
          sfQtsj: null,
          sfHysj: null,
          sfLsqs: null,
          sfKpiZb: null,
          sfJkglwhd: null,
          sfHbtxgld: null,
          sfZltxgld: null,
          sfJlbzq: null,
          sfLcwlsb: null,
          sfNyjlsb: null,
          sfWhsb: null,
          sfYb: null,
          sfTzsb: null,
          sfGysfx: null,
          sfHq: null,
          sfCbgl: null,
          sf3dSb: null,
          bz: '',
          sjsbdm: ''
      },
      options: [
        { label: 'A', code: 'A' },
        { label: 'B', code: 'B' },
        { label: 'C', code: 'C' }
      ],
      rules: {
        sbmc: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
        sbdm: [{ required: true, message: '请输入设备编码', trigger: 'blur' }],
        sjsbdm: [{ required: true, message: '请输入上级设备编码', trigger: 'blur' }]
      },
      devMap: []
    }
  },
  props: {
    newNode: {
      type: Boolean,
      required: true
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    save() {
      this.$refs['addDevAccount'].validate((valid) => {
          if (valid) {
            if(this.newNode) {
              this.addDevAccount.sbdm = ''
            } else {
              this.addDevAccount.sjsbdm = ''
            }
            addDevAccount(this.addDevAccount).then(response => {
              const result = response.data
              if (result.success) {
                this.$message.success('新增成功')
                this.$refs['addDevAccount'].resetFields()
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
    handleChange(sbdm) {
      const data = this.devMap.find(item => {
        return item.value === sbdm
      })
      this.addDevAccount.sbmc = data.label
    },
    cancel() {
      this.$emit("hidenDialog")
    },
    getData() {
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
