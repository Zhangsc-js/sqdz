<template>
  <div style="padding-top: 45px;width: 100%">
    <el-form
      ref="addInMeters"
      :model="addInMeters"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-divider content-position="center">脱机录入</el-divider>
      <el-row :gutter="20">
        <el-col :span="6" :offset="6">
          <div class="grid-content bg-purple">
            <el-form-item label="车牌号" prop="truckNo">
              <el-select v-model="addInMeters.truckNo" placeholder="请选择车牌号" @change="handleSelect">
                <el-option
                  v-for="item in carsList"
                  :key="item.id"
                  :label="item.truckNo"
                  :value="item.truckNo"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-form-item label="皮重" prop="tare">
              <el-input
                v-model="addInMeters.tare"
                @blur="checkIsDir()"
                style="width: 89%"
                type="number"
                min="0"
                oninput="javascript:this.value=this.value.replace(/[^\d.]/g,'')"
              ></el-input>
              <span>KG</span>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" :offset="6">
          <div class="grid-content bg-purple">
            <el-form-item label="供应商" prop="supplier">
              <el-select v-model="addInMeters.supplier" placeholder="请选择供应商">
                <el-option
                  v-for="item in supplierList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-form-item label="毛重" prop="gross">
              <el-input
                v-model="addInMeters.gross"
                style="width: 89%"
                type="number"
                min="0"
                oninput="javascript:this.value=this.value.replace(/[^\d.]/g,'')"
              ></el-input>
              <span>KG</span>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" :offset="6">
          <div class="grid-content bg-purple">
            <el-form-item label="物资名称" prop="goodsName">
              <el-select v-model="addInMeters.goodsName" placeholder="请选择物资名称">
                <el-option
                  v-for="item in goodsList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-form-item label="净重" prop="net">
              <el-input v-model="addInMeters.net" readonly @blur="calculation()" style="width: 89%"></el-input>
              <span>KG</span>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" :offset="6">
          <div class="grid-content bg-purple">
            <el-form-item label="司磅员" prop="createdBy">
              <el-select v-model="addInMeters.createdBy" placeholder="请选择">
                <el-option
                  v-for="item in createrList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-form-item label="检斤时间">
              <el-date-picker
                v-model="addInMeters.createdOn"
                type="datetime"
                style="width: 90%"
                readonly
                disabled
              ></el-date-picker>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="9" :offset="9">
          <el-form-item>
            <el-button type="primary" @click="onSubmit()" :disabled="openIsDisabled">立即创建</el-button>
            <el-button @click="cancel()">取消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import { simpleDateFormat } from "@/utils/index";

const { mapState, mapActions } = createNamespacedHelpers("inMeter");
export default {
  name: "InMeterAdd",
  data() {
    var isTare = (rule, value, callback) => {
      if (!value) {
         callback(new Error("皮重不能为空"));
      } else {
        const reg = /^-?\d{1,4}(?:\.\d{1,2})?$/;
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("数字格式：0-9999或者小数点后可加1到2位"));
        }
      }
    };
    // var isGross = (rule, value, callback) => {
    //   if (!value) {
    //     callback(new Error("毛重不能为空"));
    //   }
    // };
    /* var isNet=(rule,value,callback)=>{
                 if(!value){
                     return  callback(new Error('净重不能为空'));
                 }else{
                     const reg = /^-?\d{1,4}(?:\.\d{1,2})?$/;
                     if(reg.test(value)){
                         callback()
                     }else{
                         callback(new Error("数字格式：0-9999或者小数点后可加1到2位"))
                     }
                 }
             };*/
    return {
      supplierList: [
        {
          value: "贵阳磷化肥有限公司",
          label: "贵阳磷化肥有限公司"
        },
        {
          value: "贵阳铵化肥有限公司",
          label: "贵阳铵化肥有限公司"
        }
      ],
      goodsList: [
        {
          value: "磷矿石",
          label: "磷矿石"
        },
        {
          value: "铵矿石",
          label: "铵矿石"
        }
      ],
      createrList: [
        {
          value: "张宝丹",
          label: "张宝丹"
        },
        {
          value: "刘进乾",
          label: "刘进乾"
        }
      ],
      carTare: 0,
      carToleranceRatio: 0,
      openIsDisabled: false,
      // data:'',
      rules: {
        gross: [
          { required: true, message: "请输入或选择正确信息", trigger: "blur" },
        ],
        truckNo: [
          {
            required: true,
            message: "请输入或选择正确信息",
            trigger: ["blur", "change", "input"]
          }
        ],
        goodsName: [
          {
            required: true,
            message: "请输入或选择正确信息",
            trigger: ["blur", "change", "input"]
          }
        ],
        supplier: [
          {
            required: true,
            message: "请输入或选择正确信息",
            trigger: ["blur", "change", "input"]
          }
        ],
        createdBy: [
          {
            required: true,
            message: "请输入或选择正确信息",
            trigger: ["blur", "change", "input"]
          }
        ],
        createdOn: [
          {
            required: true,
            message: "请输入或选择正确信息",
            trigger: ["blur", "change", "input"]
          }
        ]
        /* net:[
                         { required: true, message: "请输入净重", trigger: "blur" },
                         { validator: isNet, trigger: "blur" }
                     ]*/
      }
    };
  },
  computed: {
    ...mapState(["addInMeters"]),
    carsList() {
      return this.$store.state.weiCars.weiCarData;
    }
  },
  mounted() {
    this.addInMeters.createdOn = simpleDateFormat(
      new Date(),
      "yyyy-MM-dd HH:mm:ss"
    );
    this.selectCars();
  },
  methods: {
    ...mapActions(["addInMetersData"]),
    selectCars() {
      this.$store.dispatch("weiCars/getAllWeiCars");
    },
    onSubmit() {
      this.$refs["addInMeters"].validate(valid => {
        if (valid) {
          this.addInMeters.weighingPlace = "021";
          this.addInMetersData(this.addInMeters).then(() => {
            this.$refs["addInMeters"].resetFields();
          });
        } else {
          this.$message.error("检斤失败，请检查必填项是否都填写正确");
          return false
        }
      });
    },
    handleSelect(data) {
      for (let i = 0; i < this.carsList.length; i++) {
        if (this.carsList[i].truckNo == data) {
          this.carTare = this.carsList[i].tare;
          this.carToleranceRatio = this.carsList[i].toleranceRatio;
          return;
        }
      }
    },
    checkIsDir() {
      if (
        this.addInMeters.tare >
          this.carTare + this.carTare * (this.carToleranceRatio / 100) ||
        this.addInMeters.tare <
          this.carTare - this.carTare * (this.carToleranceRatio / 100)
      ) {
        this.$notify({
          type: "error",
          title: "警告",
          message: "车辆皮重存在异常!",
          offset: 100
        });
        this.openIsDisabled = true;
      } else {
        this.openIsDisabled = false;
      }
    },
    calculation() {
      this.addInMeters.net = this.addInMeters.gross - this.addInMeters.tare;
    },
    cancel() {
      this.$refs["addInMeters"].resetFields();
    }
  },
  watch: {
    addInMeters: {
      deep: true,
      handler(newVal) {
        if (newVal.net < 0) {
          this.$message.error("请输入正确的毛重");
          this.openIsDisabled = true;
        } else {
          this.openIsDisabled = false;
        }
      }
    }
  }
};
</script>

<style scoped>
.grid-content {
  min-height: 36px;
}
</style>
<style type="text/css">
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
