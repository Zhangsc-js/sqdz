<template>
  <div class="arrange-cont">
    <el-form :model="updItem" ref="updItem" :rules="updRules" label-width="120px">
      <el-col :span="24">
        <el-form-item label="化验物料" align="left" prop="plan.labProname">
          <el-select
            v-model="updItem.plan.labProname"
            @change="changeProgram"
            value-key="proId"
            filterable
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
        <el-form-item label="分析项目" align="left" prop="plan.labIndicator">
          <el-select
            v-model="updItem.plan.labIndicator"
            value-key="outId"
            multiple
            collapse-tags
            filterable
            placeholder="请选择"
            class="sel-input"
          >
            <el-option
              v-for="item in selectIndic"
              :key="item.outId"
              :label="item.outValue"
              :value="item"
            ></el-option>
          </el-select>
          <el-button type="text" @click="selectAll" :disabled="!selectIndic.length">全选</el-button>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="收样地点" align="left" prop="plan.receivePlace">
          <el-select v-model="updItem.plan.receivePlace" value-key="id" placeholder="请选择">
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
        <el-form-item label="取样小组" align="left" prop="plan.sampGroup">
          <el-select
            v-model="updItem.plan.sampGroup"
            value-key="id"
            @change="changeGroup"
            placeholder="请选择取样小组"
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
        <el-form-item label="取样车间" align="left" prop="plan.workShop">
          <el-select
            v-model="updItem.plan.workShop"
            filterable
            @change="changeWorkshop"
            placeholder="请选择"
          >
            <el-option
              v-for="item in selectWorkshop"
              :key="item.id"
              :label="item.name"
              :value="item.name+',,,'+item.proccode"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="取样地点" align="left" prop="plan.sampPlace">
          <el-select v-model="updItem.plan.sampPlace" filterable allow-create placeholder="请选择">
            <el-option
              v-for="item in selectPlace"
              :key="item.id"
              :label="item.name"
              :value="item.name+',,,'+item.proccode"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="是否留存" align="left" prop="plan.ifRestain">
          <el-switch
            v-model="updItem.plan.ifRestain"
            @change="restainOrNo"
            :active-value="1"
            :inactive-value="0"
            active-text="是"
            inactive-text="否"
          ></el-switch>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="留存时间类型" prop="plan.restainTimeType">
          <el-select
            v-model="updItem.plan.restainTimeType"
            placeholder="请选择"
            :disabled="updItem.plan.ifRestain !== 1"
          >
            <el-option v-for="item in type" :key="item.id" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="时间类型数值" prop="plan.restainTimeNum">
          <el-input-number
            v-model="updItem.plan.restainTimeNum"
            :disabled="updItem.plan.ifRestain !== 1"
          ></el-input-number>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="定点开始时间" align="left" prop="spot.spottingStart">
          <el-date-picker
            v-model="updItem.spot.spottingStart"
            type="datetime"
            placeholder="选择日期时间"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="结束类型" align="left" prop="chooseType">
          <el-switch
            v-model="chooseType"
            @change="changeType"
            :active-value="true"
            :inactive-value="false"
            active-text="结束时间"
            inactive-text="取样次数"
          ></el-switch>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="定点结束时间" align="left" prop="spot.spottingEnd">
          <el-date-picker
            v-model="updItem.spot.spottingEnd"
            type="datetime"
            placeholder="选择日期时间"
            :picker-options="pickerOptions"
            :disabled="!chooseType"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="取样次数" align="left" prop="spot.sampNum">
          <el-input-number v-model="updItem.spot.sampNum" :disabled="chooseType"></el-input-number>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="间隔类型" align="left" prop="spot.intervalType">
          <el-select v-model="updItem.spot.intervalType" placeholder="请选择">
            <el-option v-for="item in type" :key="item.id" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="取样间隔" align="left" prop="spot.sampInterval">
          <el-input-number v-model="updItem.spot.sampInterval"></el-input-number>
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
  updatePlanSpot,
  getOutPart,
  getTypeProgram,
  getSendPlace,
  getSpotSetting,
  getSampleGroups,
  getProIndicator,
  getGroupStaffs,
  getWorkshopAll
} from "@/api/lims";
import { simpleDateFormat } from "@/utils/index";

export default {
  name: "PlanUpd",
  data() {
    let validInteger = (rule, value, callback) => {
      let reg = /^[1-9]\d*$/;
      if (!reg.test(value)) {
        callback(new Error("不合格的数,须为整数"));
      } else {
        callback();
      }
    };
    let compareTime = (rule, value, callback) => {
      if (this.updItem.spot.spottingStart && this.updItem.spot.spottingEnd) {
        let start = simpleDateFormat(
          this.updItem.spot.spottingStart,
          "yyyy-MM-dd HH:mm:ss"
        );
        let end = simpleDateFormat(
          this.updItem.spot.spottingEnd,
          "yyyy-MM-dd HH:mm:ss"
        );
        if (start >= end) {
          callback(new Error("定点开始时间应小于结束时间"));
        } else {
          callback();
        }
      } else {
        callback();
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
      updItem: {
        plan: {
          planId: "",
          labProname: "", //化验项目名
          labIndicator: [],
          labIndic: "", //化验指标
          receivePlace: "", //收样地点
          workShop: "", //车间
          sampPlace: "", //取样地点
          receivePlaceCode: "",
          sampGroupId: "",
          sampGroup: "", //取样小组
          ifRestain: "", //是否留存
          restainTimeType: "", //留存时间类型
          restainTimeNum: "", //留存时间类型值
          planCode: "",
          planType: 1
        },
        spot: {
          planId: "",
          spottingStart: "", //定点开始
          spottingEnd: "", //定点结束
          sampNum: 1, //取样次数
          intervalType: "", //取样间隔类型
          sampInterval: "", //取样间隔
          status: ""
        }
      },
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
      chooseType: true,
      indicatorId: "",
      selectProgram: [],
      selectIndic: [],
      selectReceivePlace: [],
      selectGroup: [],
      selectWorkshop: [],
      selectPlace: [],
      code: "",
      endTimeRule:{
        spottingEnd: [
            {required: true, message: '请选择定点结束时间', trigger: 'blur'},
            {validator: compareTime, trigger: ["blur", "change"]}
        ],
        spottingStart: [
            {required: true, message: '请选择定点开始时间', trigger: 'blur'},
            {validator: compareTime, trigger: ["blur", "change"]}
        ],
      },
      sampleNumRule:{
        sampNum: [
            {required: true, message: '请输入取样次数', trigger: 'blur'},
            {validator: validInteger, trigger: ["blur", "change"]}
        ],
        spottingStart: [
            {required: true, message: '请选择定点开始时间', trigger: 'blur'}
        ],
      },
      updRules: {
        plan: {
          labIndicator: [
            { required: true, message: "请选择分析项目", trigger: "blur" }
          ],
          labProname: [
            { required: true, message: "请选择化验品名", trigger: "blur" }
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
          workShop: [
            { required: true, message: "请输入取样车间", trigger: "blur" }
          ],
          sampPlace: [
            { required: true, message: "请输入取样地点", trigger: "blur" }
          ]
        },
        spot: {
          intervalType: [
            { required: true, message: "请选择取样间隔类型", trigger: "blur" }
          ],
          sampInterval: [
            { required: true, message: "请输入取样间隔", trigger: "blur" },
            { validator: validInteger, trigger: "blur" }
          ],
          spottingStart: [],
          spottingEnd: [],
          sampNum: []
        }
      }
    };
  },
  props: {
    selPlan: {
      type: Object,
      required: true
    }
  },
  watch: {
    selPlan() {
      this.getData();
      this.getSelectIndicatorInit();
      this.getSelectSendPlace();
      this.getProgramList();
      this.getSampleGroup();
      this.getWorkshop();
    },
    spottingStart: function(newVal, oldVal) {
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
    this.getData();
    this.getSelectIndicatorInit();
    this.getProgramList();
    this.getSelectSendPlace();
    this.getSampleGroup();
    this.getWorkshop();
  },
  computed: {
    spottingStart: function() {
      return this.updItem.spot.spottingStart;
    }
  },
  methods: {
    changeType(){
      if(this.chooseType){
          this.updRules.spot.sampNum = [];
          this.updRules.spot.spottingEnd =  this.endTimeRule.spottingEnd;
          this.updRules.spot.spottingStart = this.endTimeRule.spottingStart;
      }else{
          this.updRules.spot.spottingEnd = [];
          this.updRules.spot.sampNum =  this.sampleNumRule.sampNum;
          this.updRules.spot.spottingStart = this.sampleNumRule.spottingStart;
      }
      this.$refs.updItem.clearValidate();
    },
    getSelectIndicatorInit() {
      getProIndicator({
        matId: this.selPlan.matId,
        planId: this.selPlan.planId
      })
        .then(res => {
          const result = res.data;
          if (result.success) {
            this.selectIndic = result.data;
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    getSelectSendPlace() {
      getSendPlace()
        .then(res => {
          const result = res.data;
          if (result.success) {
            this.selectReceivePlace = result.data;
            let arr = this.selectReceivePlace.filter(item => {
              return this.updItem.plan.receivePlaceCode === item.code;
            });
            this.$set(
              this.updItem.plan,
              "receivePlace",
              arr.length > 0 ? arr[0] : {}
            );
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    changeProgram(val) {
      this.updItem.plan.labIndicator = [];
      let indicatorString = val.proIndic;
      getOutPart(indicatorString.split(",")).then(response => {
        const result = response.data;
        if (result.success) {
          this.selectIndic = result.data;
        } else {
          this.$message.error(result.message);
        }
      });
    },
    restainOrNo(val) {
      if (val === 0) {
        this.updItem.plan.restainTimeNum = "";
        this.updItem.plan.restainTimeType = null;
      }
    },
    getSamplePlace(val) {
      getWorkshopAll({ code: val })
        .then(res => {
          const result = res.data;
          if (result.success && result.data.success) {
            this.selectPlace = result.data.data;
            let arr = this.selectPlace.filter(item => {
              return (
                item.name === this.selPlan.sampPlace &&
                item.proccode === this.selPlan.placeCode
              );
            });
            if (arr.length === 0) {
              this.selectPlace.push({
                id: "0000",
                name: this.selPlan.sampPlace,
                pproccode: this.selPlan.workshopCode,
                proccode: this.selPlan.placeCode
              });
            }
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    changeWorkshop(val) {
      this.updItem.plan.sampPlace = "";
      this.getSamplePlace(val.split(",,,")[1]);
    },
    getData() {
      let indicatorName = this.selPlan.labIndicName.split("@,,,@");
      this.updItem.plan = { ...this.selPlan };
      if(!this.updItem.spot.spottingEnd || this.updItem.spot.spottingEnd.trim() === ''){
          this.chooseType = false;
          this.changeType();
      }
      this.updItem.plan.planType = 1;
      let selIndicator = [];
      let indicatorId = this.selPlan.labIndic.split(",");
      indicatorId.map((item, i) => {
        selIndicator.push({
          outValue: indicatorName[i],
          outId: item
        });
      });
      this.$set(
        this.updItem.plan,
        "labIndicator",
        selIndicator.length > 0 ? selIndicator : []
      );
      this.getSamplePlace(this.selPlan.workshopCode);
      this.updItem.plan.workShop =
        this.selPlan.workShop + ",,," + this.selPlan.workshopCode;
      this.updItem.plan.sampPlace =
        this.selPlan.sampPlace + ",,," + this.selPlan.placeCode;
      getSpotSetting(this.selPlan.planId)
        .then(res => {
          const result = res.data;
          if (result.success) {
            this.updItem.spot = Object.assign({}, result.data);
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    save() {
      this.$refs["updItem"].validate(valid => {
        if (!valid) {
          this.$message({
            type: "error",
            message: "请正确键入再提交"
          });
        } else {
          if (!this.chooseType && !/^[1-9]\d*$/.test(this.sampNum)) {
            this.$message.error("取样次数须为正整数");
            return false;
          }
          if (this.updItem.plan.labIndicator.length > 30) {
            this.$message.warning("最多勾选30个分析项");
            return false;
          }
          if (this.updItem.plan.ifRestain === 1) {
            if (
              this.updItem.plan.restainTimeType === null ||
              this.updItem.plan.restainTimeType === "" ||
              this.updItem.plan.restainTimeNum === ""
            ) {
              this.$message.error("请设置留存时间");
              return false;
            }
            if (!/^[1-9]\d*$/.test(this.updItem.plan.restainTimeNum)) {
              this.$message.error("留存时间类型值须为正整数");
              return false;
            }
          }
          this.updItem.plan.planId = this.selPlan.planId;
          this.updItem.spot.planId = this.selPlan.planId;
          this.updItem.plan.matId = this.updItem.plan.labProname.matId;
          this.updItem.plan.labProname = this.updItem.plan.labProname.proName;
          this.updItem.plan.receivePlaceCode = this.updItem.plan.receivePlace.code;
          this.updItem.plan.receivePlace = this.updItem.plan.receivePlace.label;
          this.updItem.plan.sampGroupId = this.updItem.plan.sampGroup.id;
          this.updItem.plan.sampGroup = this.updItem.plan.sampGroup.departName;
          this.updItem.spot.spottingStart = simpleDateFormat(
            this.updItem.spot.spottingStart,
            "yyyy-MM-dd HH:mm:ss"
          ); //定点开始
          this.updItem.spot.spottingEnd = simpleDateFormat(
            this.updItem.spot.spottingEnd,
            "yyyy-MM-dd HH:mm:ss"
          ); //定点结束
            if(!this.chooseType){
                this.updItem.spot.spottingEnd = null;
            }else{
                this.updItem.spot.sampNum = null;
            }
          this.updItem.plan.labIndic = this.updItem.plan.labIndicator
            .map(item => {
              return item.outId;
            })
            .join(",");
          this.updItem.plan.workshopCode = this.updItem.plan.workShop.split(
            ",,,"
          )[1];
          this.updItem.plan.workShop = this.updItem.plan.workShop.split(
            ",,,"
          )[0];
          this.updItem.plan.placeCode =
            this.updItem.plan.sampPlace.indexOf(",,,") < 0
              ? "0000"
              : this.updItem.plan.sampPlace.split(",,,")[1];
          this.updItem.plan.sampPlace =
            this.updItem.plan.sampPlace.indexOf(",,,") < 0
              ? this.updItem.plan.sampPlace
              : this.updItem.plan.sampPlace.split(",,,")[0];
          updatePlanSpot(this.updItem)
            .then(response => {
              const result = response.data;
              if (result.success) {
                this.$message({
                  type: "success",
                  message: "更改成功"
                });
                this.$refs["updItem"].resetFields();
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
    changeGroup(val) {
      let param = {
        id: val.id
      };
      getGroupStaffs(param)
        .then(response => {
          const result = response.data;
          if (result.success) {
            if (result.data.length === 0) {
              this.updItem.sampGroup = "";
              this.$message.warning("当前小组下未分配在职员工，请重新配置");
              return false;
            }
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
            let arr = this.selectProgram.filter(item => {
              return this.selPlan.matId === item.matId;
            });
            this.$set(
              this.updItem.plan,
              "labProname",
              arr.length > 0 ? arr[0] : {}
            );
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    getWorkshop() {
      getWorkshopAll({ code: "" })
        .then(res => {
          const result = res.data;
          if (result.success && result.data.success) {
            this.selectWorkshop = result.data.data;
          } else {
            this.$message.error(result.message);
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
            let arr = this.selectGroup.filter(item => {
              return this.selPlan.sampGroupId === item.id;
            });
            this.$set(
              this.updItem.plan,
              "sampGroup",
              arr.length > 0 ? arr[0] : {}
            );
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    selectAll() {
      let selected = this.selectIndic.map(item => item);
      this.$set(this.updItem.plan, "labIndicator", selected);
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
