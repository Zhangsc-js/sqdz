<template>
  <div style="padding-top: 45px;width:100%">
    <el-form
      ref="addOutMeters"
      :model="addOutMeters"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-divider content-position="center">脱机录入</el-divider>
      <el-row>
        <el-col :span="6" :offset='6'>
          <div class="grid-content bg-purple">
            <el-form-item label="车牌号" prop="truckNo">
              <el-select v-model="addOutMeters.truckNo" placeholder="请选择车牌号" @change="handleSelect">
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
                v-model="addOutMeters.tare"
                @blur="checkIsDir()"
                style="width: 90%"
                placeholder="请输入皮重"
                type="number"
                min="0"
                oninput="javascript:this.value=this.value.replace(/[^\d.]/g,'')"
              ></el-input>KG
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" :offset="6" >
          <div class="grid-content bg-purple">
            <el-form-item label="客户名称" prop="clientele">
              <el-select v-model="addOutMeters.clientele" placeholder="请选择客户名称">
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
                v-model="addOutMeters.gross"
                style="width: 90%"
                placeholder="请输入皮重"
                type="number"
                min="0"
                oninput="javascript:this.value=this.value.replace(/[^\d.]/g,'')"
              ></el-input>KG
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="6" :offset="6" >
          <div class="grid-content bg-purple">
            <el-form-item label="物资名称" prop="goodsName">
              <el-select v-model="addOutMeters.goodsName" placeholder="请选择物资名称">
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
              <el-input
                :value="netWeight"
                v-model.number="addOutMeters.net"
                readonly
                @blur="calculation()"
                style="width: 90%"
              ></el-input>KG
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" :offset="6">
          <div class="grid-content bg-purple">
            <el-form-item label="司磅员" prop="createdBy">
              <el-select v-model="addOutMeters.createdBy" placeholder="请选择">
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
              <el-date-picker v-model="addOutMeters.createdOn" type="datetime" readonly disabled style="width: 90%;"></el-date-picker>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="9" :offset="9">
          <div class="grid-content bg-purple">
            <el-form-item>
              <el-button type="primary" @click="onSubmit" :disabled="openIsDisabled">立即创建</el-button>
              <el-button @click="cancel()">取消</el-button>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import { simpleDateFormat } from "@/utils/index";

const { mapState, mapActions } = createNamespacedHelpers("outMeter");
export default {
  name: "OutMeterAdd",
  data() {
    var isTare = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("皮重不能为空"));
      } else {
        const reg = /^-?\d{1,4}(?:\.\d{1,2})?$/;
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("数字格式：0-9999或者小数点后可加1到2位"));
        }
      }
    };
    var isGross = (rule, value, callback) => {
      if (!value) {
        callback(new Error("毛重不能为空"));
      } else {
        const reg = /^-?\d{1,4}(?:\.\d{1,2})?$/;
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("数字格式：0-9999或者小数点后可加1到2位"));
        }
      }
    };
    return {
      netWeight: "",
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
          value: "刘进乾",
          label: "刘进乾"
        },
        {
          value: "张宝丹",
          label: "张宝丹"
        }
      ],
      carTare: 0,
      carToleranceRatio:0,
      openIsDisabled: false,
      rules: {
        truckNo: [
          {
            required: true,
            message: "请输入或者选择内容",
            trigger: ["blur", "change"]
          }
        ],
        clientele: [
          {
            required: true,
            message: "请输入或者选择内容",
            trigger: ["blur", "change", "input"]
          }
        ],
        goodsName: [
          {
            required: true,
            message: "请输入或者选择内容",
            trigger: ["blur", "change", "input"]
          }
        ],
        createdBy: [
          {
            required: true,
            message: "请输入或者选择内容",
            trigger: ["blur", "change", "input"]
          }
        ],
        gross: [
          {
            required: true,
            message: "请输入或者选择内容",
            trigger: ["blur", "change", "input"]
          }
        ],
        createdOn: [
          {
            required: true,
            message: "请输入或者选择内容",
            trigger: ["blur", "change", "input"]
          }
        ]
      }
    };
  },
  computed: {
    ...mapState(["addOutMeters"]),
    carsList() {
      return this.$store.state.weiCars.weiCarData;
    }
  },
  mounted() {
    this.addOutMeters.createdOn = simpleDateFormat(new Date(), "yyyy-MM-dd HH:mm:ss");
    this.selectCars();
  },
  methods: {
    ...mapActions(["addOutMetersData"]),
    selectCars() {
      this.$store.dispatch("weiCars/getAllWeiCars");
    },
    onSubmit() {
      this.$refs["addOutMeters"].validate(valid => {
        if (valid) {

          this.addOutMeters.weighingPlace = "021";
          this.addOutMetersData(this.addOutMeters).then(() => {
            this.$refs["addOutMeters"].resetFields();
            this.addOutMeters.createdOn = simpleDateFormat(new Date(), "yyyy-MM-dd HH:mm:ss");
          });
        } else {
          this.$message.error("请输入正确信息");
          return false;
        }
      });
    },
    handleSelect(data) {
      for (let i = 0; i < this.carsList.length; i++) {
        if (this.carsList[i].truckNo == data) {
          this.carTare = this.carsList[i].tare;
          this.carToleranceRatio = this.carsList[i].toleranceRatio
          return;
        }
      }
    },
    checkIsDir() {
      if (
        this.addOutMeters.tare > this.carTare + this.carTare * (this.carToleranceRatio / 100) ||
        this.addOutMeters.tare < this.carTare - this.carTare * (this.carToleranceRatio / 100)
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
      this.addOutMeters.net = this.addOutMeters.gross - this.addOutMeters.tare;
    },
    cancel() {
      this.$refs["addOutMeters"].resetFields();
    }
  },
  watch:{
      addOutMeters:{
          deep:true,
          handler(newVal){
              if(newVal.net<0){
                  this.$message.error('请输入正确的毛重')
                  this.openIsDisabled = true
              }else{
                  this.openIsDisabled=false
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
.el-form-item__error {
  position: relative;
}
</style>
