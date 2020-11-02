<template>
  <div style="height: 100%;">
    <el-form :model="inpu" label-width="180px" ref="inpu" >
      <el-row>
        <el-col :span="10">
          <el-form-item label="仓库号：" prop="whCode">
            <el-select
              v-model="inpu.whCode"
              filterable
              placeholder="请选择"
              style="width: 150px;height: 100%"
              :disabled="status"
            >
              <el-option
                v-for="item in this.whArr"
                :key="item.warehouseCode"
                :label="item.warehouseName"
                :value="item.warehouseCode"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="存储区：" prop="areaCode">
            <el-select
              v-model="inpu.areaCode"
              filterable
              placeholder="请选择"
              style="width: 150px;height: 100%"
              :disabled="status"
            >
              <el-option
                v-for="item in this.areaArr"
                :key="item.areaCode"
                :label="item.areaName"
                :value="item.areaCode"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="仓位：" prop="binCode">
            <el-input style="width: 150px;"  v-model="inpu.binCode" autocomplete="off" :disabled="status"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="最大托盘数量：" prop="storageCellMax">
            <el-input
              style="width: 150px;"
              v-model="inpu.storageCellMax"
              type="Number"
              autocomplete="off"
              :min="0"
              :disabled="false"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="入库冻结：" prop="freezeInput">
            <el-checkbox v-model="inpu.freezeInput"></el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="出库冻结：" prop="freezeOutput">
            <el-checkbox v-model="inpu.freezeOutput"></el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="冻结原因：" prop="freezeReason">
            <el-input style="width: 150px;" v-model="inpu.freezeReason" autocomplete="off" :disabled="false"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" icon="el-icon-close" @click="cancel()">取 消</el-button>
      <el-button type="primary" icon="el-icon-check" @click="save()">保存</el-button>
    </div>
  </div>
</template>
<script>
import {
    saveSysWmsBin,
    findSysWmsWarehousePullDownAll,
    findSysWmsAreaPullDownAll,
    findSysWmsBinById,
    updateSysWmsBin
} from "@/api/sys/wms/warehouse"
export default {
  data() {
    return {
      whArr: [],
      areaArr: [],
      inpu: {
        id:"",
        whCode: "",
        areaCode: "",
        binCode: "",
        freezeInput: false,
        freezeOutput: false,
        freezeReason: "",
        storageCellMax: ""
      },
      status:false,
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
    'inpu.whCode':function (val){
        if (this.type=="1") {
            this.inpu.areaCode="";
        }
        findSysWmsAreaPullDownAll(this.inpu.whCode)
        .then(response => {
            if (response.data.success) {
                
                this.areaArr=response.data.data.list;
            }
        });
    },
    trigger() {
      if (this.trigger) this.getData();
    }
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    save() {
      let that=this;
        if (this.type=="1") {
            saveSysWmsBin(this.inpu)
            .then(response => {
              if(response.data.success){
                that.$message.success("新增成功!");
                that.$emit("save");
              }
            })
        }else if(this.type=="2"){
          updateSysWmsBin(this.inpu)
          .then(response => {
            if(response.data.success){
              that.$message.success("修改成功!");
                that.$emit("save");
            }
          })
        }
    },
    getData(){
        findSysWmsWarehousePullDownAll()
        .then(response=>{
            if (response.data.success) {
                this.whArr=response.data.data.list;
            }
        })
        if(this.type=="1"){
          this.status=false;
          let reSet={
            id:"",
             whCode: "",
             areaCode: "",
             binCode: "",
             freezeInput: false,
             freezeOutput: false,
             freezeReason: "",
             storageCellMax: ""
          }
          this.inpu=reSet;
        }else if(this.type=="2"){
          this.status=true;
          findSysWmsBinById(this.id)
          .then(response => {
            if(response.data.success){
              this.inpu=response.data.data.data;
            }
          })
        }
    },
    // selectWhArr(){
    //     this.$refs['areaCode'].resetFields();
    //     findSysWmsAreaPullDownAll(this.inpu.whCode)
    //     .then(response => {
    //         if (response.data.success) {
                
    //             this.areaArr=response.data.data.list;
    //         }
    //     });
    // }
  },
  mounted(){
    this.getData();
  }
};
</script>
<style scoped>
</style>