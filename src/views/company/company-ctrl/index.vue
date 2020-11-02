<template>


  <div class="dashboard-container" style="padding-top:45px">
    <div class="app-container">
      <el-card shadow="never">

          <el-form ref="form" :model="formSeach" label-width="100px" >
              <el-row>
                  <el-col :span="8">
                  <el-form-item label="企业Id" >
                      <el-input v-model="formSeach.id" style="width:250px"></el-input>
                  </el-form-item>
                      </el-col>
                          <el-col :span="8">
                  <el-form-item label="企业名称">
                      <el-input v-model="formSeach.name"  style="width:250px"></el-input>
                  </el-form-item>
                   </el-col>
                  <el-form-item>
                      <el-button type="primary" style="margin-left:30px;">查询</el-button>
                      <el-button>清空</el-button>
                  </el-form-item>
              </el-row>
          </el-form>
        <!--elementui的table组件
          data：数据模型
         -->
        <el-table  :data="dataList"  border style="width: 100%">
            <!--el-table-column : 构造表格中的每一列
              prop： 数组中每个元素对象的属性名
            -->
            <el-table-column  type="index" label="序号" width="100"></el-table-column>
            <el-table-column  prop="id" label="企业编号"  width="200"></el-table-column>
            <el-table-column  prop="name" label="企业名称"  width="200"></el-table-column>
            <el-table-column  prop="industry" label="所属行业"  width="200"></el-table-column>
            <el-table-column  prop="version" label="版本"  width="150"></el-table-column>
            <el-table-column  prop="legalRepresentative" label="法人代表"  width="150"></el-table-column>
            <el-table-column  prop="companyPhone" label="联系电话"  width="150"></el-table-column>
            <el-table-column  prop="mailbox" label="邮箱"  width="150"></el-table-column>
            <el-table-column  prop="managerId" label="企业登录账号ID"  width="150"></el-table-column>
            <el-table-column  prop="companySize" label="公司规模"  width="150"></el-table-column>
            <el-table-column  prop="companyArea" label="公司地区"  width="150"></el-table-column>
            <el-table-column  prop="companyAddress" label="公司地址"  width="150"></el-table-column>
            <el-table-column  prop="businessLicenseId" label="营业执照-图片ID"  width="150"></el-table-column>
            <el-table-column  prop="renewalDate" label="续期时间"  width="150"></el-table-column>
            <el-table-column  prop="expirationDate" label="截至时间"  width="150"></el-table-column>
            <el-table-column  prop="balance" label="余额"  width="150"></el-table-column>
            <el-table-column  prop="state" label="状态"  width="150">
              <!--scope:传递当前行的所有数据 -->
              <template slot-scope="scope">
              <!--开关组件
                  active-value：激活的数据值
                  active-color：激活的颜色
                  inactive-value：未激活
                  inactive-color：未激活的颜色
               -->
              <el-switch
                  v-model="scope.row.state"
                  inactive-value="0"
                  active-value="1"
                  disabled
                  active-color="#13ce66"
                  inactive-color="#ff4949">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column  prop="remarks" label="备注"  width="150"></el-table-column>
            <el-table-column fixed="right" label="操作" width="150">
              <template slot-scope="scope">
                <router-link :to="`/detail/${scope.row.id}`">查看</router-link>
              </template>
            </el-table-column>
          </el-table>
      </el-card>
     </div>
  </div>
</template>

<script>
import {list} from '@/api/company'
export default {

  name: 'saas-index',

  data () {
    return {
      dataList:[],
      companyId: '',
      companyName: '',
      formSeach:{

      }
    }
  },
  methods: {
    getList() {
      //调用API发起请求
      //res=响应数据
      list().then(res => {
          console.log(res)
        this.dataList = res.data.data
      })
    }
  },
  // 创建完毕状态
  created() {
    this.getList()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.alert {
  margin: 10px 0px 0px 0px;
}
.pagination {
  margin-top: 10px;
  text-align: right;
}
</style>
