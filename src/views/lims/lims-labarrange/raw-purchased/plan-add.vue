<template>
  <div class="arrange-cont">
    <el-form :model="addItem" ref="addItem" :rules="addRules" label-width="100px">
      <el-col :span="24">
        <el-form-item label="化验物料" prop="labProname">
          <el-select
            v-model="addItem.labProname"
            @change="changeProgram"
            filterable
            value-key="proId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in selectProgram"
              :key="item.proId"
              :label="item.proName"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="分析项目" prop="labIndic">
          <el-select
            class="sel-input"
            v-model="addItem.labIndic"
            multiple
            collapse-tags
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in selectIndicator"
              :key="item.outId"
              :label="item.outValue"
              :value="item.outId"
            ></el-option>
          </el-select>
          <el-button type="text" @click="selectAll" :disabled="!selectIndicator.length">全选</el-button>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="供应商" prop="supplier">
          <el-select v-model="addItem.supplier" filterable placeholder="请选择">
            <el-option
              v-for="item in selectSupplier"
              :key="item.id"
              :label="item.supplierName"
              :value="item.id+',,,'+item.supplierName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="车牌号" prop="truckNo">
          <el-input v-model="addItem.truckNo"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="来料时间" prop="comingTime">
          <el-date-picker v-model="addItem.comingTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="送料人员" prop="comingSend">
          <el-input v-model="addItem.comingSend"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="量" prop="comingNum">
          <el-input v-model="addItem.comingNum"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="计量单位" prop="comingUnit">
          <el-select v-model="addItem.comingUnit" filterable placeholder="请选择计量单位">
            <el-option
              v-for="item in unitType"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="收样地点" prop="receivePlace">
          <el-select v-model="addItem.receivePlace" value-key="id" placeholder="请选择">
            <el-option
              v-for="item in selectReceivePlace"
              :key="item.id"
              :label="item.label"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="取样小组" prop="sampGroup">
          <el-select
            v-model="addItem.sampGroup"
            @change="changeGroup"
            value-key="id"
            placeholder="请选择"
          >
            <el-option
              v-for="item in selectGroup"
              :key="item.id"
              :label="item.departName"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="取样地点" prop="sampPlace">
          <el-input v-model="addItem.sampPlace"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="取样时间" prop="sampTime">
          <el-date-picker
            v-model="addItem.sampTime"
            type="datetime"
            :picker-options="pickerOptions"
            placeholder="选择日期时间"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="是否留存" prop="ifRestain">
          <el-switch
            v-model="addItem.ifRestain"
            @change="restainOrNo"
            :active-value="1"
            :inactive-value="0"
            active-text="是"
            inactive-text="否"
          ></el-switch>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="留存时间类型" prop="restainTimeType">
          <el-select
            v-model="addItem.restainTimeType"
            placeholder="请选择"
            :disabled="addItem.ifRestain !== 1"
          >
            <el-option v-for="item in type" :key="item.id" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="时间类型数值" prop="restainTimeNum">
          <el-input-number v-model="addItem.restainTimeNum" :disabled="addItem.ifRestain !== 1"></el-input-number>
        </el-form-item>
      </el-col>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel()">取 消</el-button>
      <el-button type="primary" @click="save()">保存</el-button>
    </div>
  </div>
</template>

<script>
import {
  addRaw,
  getTypeProgram,
  getSampleGroups,
  getOutPart,
  getSendPlace,
  getGroupStaffs,
  getWorkshopAll,
  validNumber,
  getMeasureUnit,
  getSelectSupplier
} from "@/api/lims";
import { simpleDateFormat } from "@/utils/index";

export default {
  name: "PlanAdd",
  data() {
      let compareTime = (rule, value, callback) => {
          if (this.addItem.comingTime && this.addItem.sampTime) {
              let start = simpleDateFormat(this.addItem.comingTime, "yyyy-MM-dd HH:mm:ss");
              let end = simpleDateFormat(this.addItem.sampTime, "yyyy-MM-dd HH:mm:ss");
              if (start >= end) {
                  callback(new Error('取样时间应大于来料时间'))
              } else {
                  callback()
              }
          } else {
              callback()
          }
      };
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        },
        selectableRange:
          simpleDateFormat(new Date(), "HH:mm:ss") + " - 23:59:59"
      },
      unitType: [],
      addItem: {
        labProname: "", //化验项目
        labIndic: "", //化验指标
        receivePlace: "", //收样地点
        sampGroup: "", //取样小组
        ifRestain: 0, //是否留存
        restainTimeType: "", //留存时间类型
        restainTimeNum: "", //留存时间类型值
        supplier: "", //供应商
        truckNo: "", //车牌号
        comingTime: "", //来料时间
        comingSend: "", //送料人员
        comingNum: "", //量
        comingUnit: "", //计量单位
        workShop: "", //取样车间
        sampPlace: "", //取样地点
        sampTime: "" //取样时间
      },
      code: "",
      samplers: "",
      selectSupplier: [],
      selectProgram: [],
      selectIndicator: [],
      selectReceivePlace: [],
      selectGroup: [],
      selectWorkshop: [],
      selectPlace: [],
      type: [
        {
          id: 1,
          name: "时"
        },
        {
          id: 2,
          name: "天"
        },
        {
          id: 3,
          name: "周"
        },
        {
          id: 4,
          name: "月"
        },
        {
          id: 5,
          name: "旬"
        }
      ],
      addRules: {
        labIndic: [
          { required: true, message: "请选择分析项目", trigger: "blur" }
        ],
        labProname: [
          { required: true, message: "请选择化验物料", trigger: "blur" }
        ],
        receivePlace: [
          { required: true, message: "请选择收样地点", trigger: "blur" }
        ],
        ifRestain: [
          { required: true, message: "请勾选留存与否", trigger: "blur" }
        ],
        sampGroup: [
          { required: true, message: "请选择取样小组", trigger: "blur" }
        ],
        sampPlace: [
          {
            required: true,
            message: "请输入取样地点",
            trigger: ["blur", "change"]
          }
        ],
        sampTime: [
          { required: true, message: "请选择取样时间", trigger: "blur" },
            {validator: compareTime, trigger: 'blur'}
        ],
        supplier: [
          { required: true, message: "请输入供应商", trigger: "blur" }
        ],
        truckNo: [{ required: true, message: "请输入车牌号", trigger: "blur" }],
        comingTime: [
          { required: true, message: "请选择来料时间", trigger: "blur" },
            {validator: compareTime, trigger: 'blur'}
        ],
        comingSend: [
          { required: true, message: "请输入送料人", trigger: "blur" }
        ],
        comingNum: [
          { required: true, message: "请输入来料量", trigger: "blur" },
          { validator: validNumber, trigger: "blur" }
        ],
        comingUnit: [
          { required: true, message: "请选择计量单位", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    sampTime: function() {
      return this.addItem.sampTime;
    }
  },
  watch: {
    sampTime: function(newVal, oldVal) {
      let selectDate = simpleDateFormat(newVal, "yyyyMMdd");
      let oldDate = simpleDateFormat(oldVal, "yyyyMMdd");
      let nowDate = simpleDateFormat(new Date(), "yyyyMMdd");
      if (oldDate !== selectDate) {
        if (selectDate === nowDate) {
          this.pickerOptions.selectableRange =
            simpleDateFormat(new Date(), "HH:mm:ss") + " - 23:59:59";
        } else {
          this.pickerOptions.selectableRange = "00:00:00 - 23:59:59";
        }
      }
    }
  },
  mounted() {
    this.getUnitList();
    this.getProgramList();
    this.getSelectSendPlace();
    this.getSampleGroup();
    this.getSupplier();
  },
  methods: {
    getSupplier() {
      getSelectSupplier()
        .then(res => {
          const result = res.data;
          if (result.success) {
            this.selectSupplier = result.data.list;
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    getUnitList() {
      getMeasureUnit()
        .then(res => {
          const result = res.data;
          if (result.success && result.data.success) {
            this.unitType = result.data.data;
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    save() {
      this.$refs["addItem"].validate(valid => {
        if (!valid) {
          this.$message({
            type: "error",
            message: "请正确键入再提交"
          });
          return false;
        } else {
          if (this.addItem.labIndic.length > 30) {
            this.$message.warning("最多勾选30个分析项");
            return false;
          }
          if (this.addItem.ifRestain === 1) {
            if (
              this.addItem.restainTimeType === null ||
              this.addItem.restainTimeType === "" ||
              this.addItem.restainTimeNum === ""
            ) {
              this.$message.error("请设置留存时间");
              return false;
            }
            if (!/^[1-9]\d*$/.test(this.addItem.restainTimeNum)) {
              this.$message.error("留存时间类型值须为正整数");
              return false;
            }
          }
          const item = {
            plan: {
              labProname: this.addItem.labProname.proName,
              matId: this.addItem.labProname.matId,
              labIndic: this.addItem.labIndic.join(","),
              receivePlace: this.addItem.receivePlace.label,
              receivePlaceCode: this.addItem.receivePlace.code,
              sampGroup: this.addItem.sampGroup.departName,
              sampGroupId: this.addItem.sampGroup.id,
              sampPer: this.samplers,
              workShop: "无",
              workshopCode: "0000",
              sampPlace: this.addItem.sampPlace,
              placeCode: "0000",
              sampTime: simpleDateFormat(
                this.addItem.sampTime,
                "yyyy-MM-dd HH:mm:ss"
              ),
              ifRestain: this.addItem.ifRestain, //是否留存
              restainTimeType: this.addItem.restainTimeType, //留存时间类型
              restainTimeNum: this.addItem.restainTimeNum //留存时间类型值
            },
            raw: {
              supplier: this.addItem.supplier.split(",,,")[1],
              truckNo: this.addItem.truckNo,
              comingTime: simpleDateFormat(
                this.addItem.comingTime,
                "yyyy-MM-dd HH:mm:ss"
              ),
              comingSend: this.addItem.comingSend,
              comingNum: this.addItem.comingNum,
              comingUnit: this.addItem.comingUnit
            }
          };
          addRaw(item)
            .then(response => {
              const result = response.data;
              if (result.success) {
                this.$message({
                  type: "success",
                  message: "新增成功"
                });
                this.$refs["addItem"].resetFields();
                this.$emit("hidenDialog");
              } else {
                this.$message.error(result.message);
              }
            })
            .catch(e => {
              this.$message.error(e.message);
            });
        }
      });
    },
    cancel() {
      this.$emit("hidenDialog");
    },
    restainOrNo(val) {
      if (val === 0) {
        this.addItem.restainTimeNum = "";
        this.addItem.restainTimeType = null;
      }
    },
    changeProgram(val) {
      this.addItem.labIndic = "";
      let indicatorString = val.proIndic;
      getOutPart(indicatorString.split(",")).then(response => {
        const result = response.data;
        if (result.success) {
          this.selectIndicator = result.data;
        } else {
          this.$message.error(result.message);
        }
      });
    },
    getSelectSendPlace() {
      getSendPlace()
        .then(res => {
          const result = res.data;
          if (result.success) {
            this.selectReceivePlace = result.data;
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    getProgramList() {
      let param = "all";
      getTypeProgram(param)
        .then(res => {
          if (res.data.success) {
            this.selectProgram = res.data.data;
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    getSampleGroup() {
      getSampleGroups()
        .then(res => {
          const result = res.data;
          if (result.success) {
            this.selectGroup = result.data;
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    changeGroup(val) {
      let param = {
        id: val.id
      };
      getGroupStaffs(param)
        .then(response => {
          const result = response.data;
          if (result.success) {
            if (result.data.length === 0) {
              this.addItem.sampGroup = "";
              this.$message.warning("当前小组下未分配在职员工，请重新配置");
              return;
            }
            let tempArray = [];
            result.data.forEach(element => {
              tempArray.push(element.userCode + "--" + element.userName);
            });
            this.samplers = tempArray.join(",");
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    selectAll() {
      let selected = this.selectIndicator.map(item => item.outId);
      this.$set(this.addItem, "labIndic", selected);
    }
  }
};
</script>
<style lang="scss">
.arrange-cont {
  .el-input__inner {
    width: 185px;
  }
  .sel-input {
    width: calc(100% - 120px);
    .el-input__inner {
      width: 100%;
    }
  }
}
</style>
<style scoped>
.el-input-number {
  line-height: 30px !important;
}
.dialog-footer .el-button {
  margin-top: 40px;
}
</style>
