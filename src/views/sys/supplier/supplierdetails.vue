<template>
  <div>
    <el-form :model="tableData" label-width="180px" ref="tableData" :rules="rule">
      <el-row>
        <el-col :span="10">
          <el-form-item label="供应商名称：" prop="supplierName" :required="true">
            <el-input v-model="tableData.supplierName" autocomplete="off" :disabled="isDisable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="统一信用代码：" prop="supplierCode" :required="true">
            <el-input v-model="tableData.supplierCode" autocomplete="off" :disabled="isDisable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="公司地址：" prop="companyAddr" >
            <el-input v-model="tableData.companyAddr" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="公司传真：" prop="fax">
            <el-input v-model="tableData.fax" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="固定电话：" prop="telephone" :required="true">
            <el-input v-model="tableData.telephone" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="电子邮件：" prop="email" style="width: 100%;height: 100%">
            <el-input v-model="tableData.email" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="业务联系人：" prop="linkMan" style="width: 100%;height: 100%" :required="true">
            <el-input v-model="tableData.linkMan" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="手机号码：" prop="linkTelephone" style="width: 100%;height: 100%" :required="true">
            <el-input v-model="tableData.linkTelephone" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="信用等级：" prop="creditLevel">
        <el-select
          v-model="tableData.creditLevel"
          filterable
          placeholder="请选择"
          style="width: 20%;height: 100%"
        >
          <el-option
            v-for="(item,index) in this.creditLevels"
            :key="index"
            :label="item.label"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="公司简介:" prop="companyDesc">
        <el-input type="textarea" v-model="tableData.companyDesc"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button icon="el-icon-close" @click="cancel()">取 消</el-button>
      <el-button type="primary" icon="el-icon-check" @click="save()">保存</el-button>
    </div>
  </div>
</template>
<script>
import {
  getSupplerList,
  deleteSuppler,
  addSuppler,
  getSupplerDetails,
  updateSuppler,
  queryStatus
} from "@/api/sys/suppler";
export default {
  data() {
    return {
      creditLevels:[],
      tableData: {
        supplierName:"",
        supplierCode:"",
        companyAddr:"",
        fax:"",
        telephone:"",
        email:"",
        linkMan:"",
        linkTelephone:"",
        creditLevel:"",
        companyDesc:"",
        createBy:"",
        createOn:"",
        updateOn:"",
        updateBy:"",
      },
      isDisable:false,
      rule:{
        supplierName:[{
            required: true,
            message: "请输入供应商名称",
            trigger: ["change", "blur"]
          }],
        supplierCode:[
          {
            required: true,
            message: "请输入统一社会信用码",
            trigger: ["change", "blur"]
          }
          ],
        telephone:[
          {
            required: true,
            message: "请输入固定电话",
            trigger: ["change", "blur"]
          }
        ],
        linkMan:[
          {
            required: true,
            message: "请输入联系人",
            trigger: ["change", "blur"]
          }
        ],
        linkTelephone:[
          {
            required: true,
            message: "请输入联系方式",
            trigger: ["change", "blur"]
          }
        ]  
      }
    };
  },
  props: {
    id: {
      type: String,
      required: true
    },
    trigger: {
      type: Boolean,
      required: false
    },
    type: {
      type: String,
      required: true
    }
  },
  watch: {
    trigger() {
      if (this.trigger) this.getData();
    }
  },
  methods:{
    save(){
      this.$refs["tableData"].validate((valid, object) => {
        if (valid) {
          if (this.type==1) {
             addSuppler(this.tableData)
          .then(response=>{
            const result=response.data;
            if (result.success) {
              this.$message.success("新增成功!");
              this.$emit("save");
            }else {
                this.$message.error(result.message + ":" + result.data);
              }
          })
          .catch(e => {
              this.$message({
                type: "error",
                message: e.message
              });
            });
          }else{
            updateSuppler(this.tableData)
          .then(response=>{
            const result=response.data;
            if (result.success) {
              this.$message.success("修改成功!");
              this.$emit("save");
            }else {
                this.$message.error(result.message + ":" + result.data);
              }
          })
          .catch(e => {
              this.$message({
                type: "error",
                message: e.message
              });
            });
          }
        } else {
          this.$message.error(Object.values(object)[0][0].message);
        }
        });
    },
    cancel(){
      console.log("1111111");
      this.$emit("cancel");
    },
    reSet(){
      this.tableData={
        supplierName:"",
        supplierCode:"",
        companyAddr:"",
        fax:"",
        telephone:"",
        email:"",
        linkMan:"",
        linkTelephone:"",
        creditLevel:"AAA",
        companyDesc:"",
        createBy:"",
        createOn:"",
        updateOn:"",
        updateBy:"",
      }
    },
    getData(){
      
      if (this.type==1) {
        this.$refs["tableData"].resetFields();
        this.isDisable=false;
        this.reSet();
        this.tableData.createBy=this.$store.getters.userName;
      }else{
        this.isDisable=true;
        
        getSupplerDetails(this.id)
        .then(response=>{
          this.tableData=response.data.data;
        });
        this.tableData.updateBy=this.tableData.createBy=this.$store.getters.userName;
      }
      queryStatus().then(response=>{
        let data=response.data;
        if (data.success) {
          this.creditLevels=data.data.CREDIT_LEVEL;
        }
      });
    }
  },
  mounted(){
    this.getData();
  }
}
</script>