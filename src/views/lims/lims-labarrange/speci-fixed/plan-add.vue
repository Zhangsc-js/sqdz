<template>
    <div class="arrange-cont">
        <el-form :model="addItem" ref="addItem" :rules="addRules" label-width="120px">
            <el-col :span="24">
                <el-form-item align="left" label="化验物料" prop="labProname">
                    <el-select
                        v-model="addItem.labProname"
                        @change="changeProgram"
                        value-key="proId"
                        filterable
                        placeholder="请选择">
                        <el-option v-for="item in selectProgram" :key="item.proId" :label="item.proName"
                                   :value="item"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="分析项目" align="left" prop="labIndic" >
                    <el-select v-model="addItem.labIndic" multiple collapse-tags filterable placeholder="请选择" class="sel-input">
                        <el-option
                            v-for="item in selectIndicator"
                            :key="item.outId"
                            :label="item.outValue"
                            :value="item.outId"
                            >
                        </el-option>
                    </el-select>
                    <el-button type="text" @click="selectAll" :disabled="!selectIndicator.length">全选</el-button>

                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="收样地点" align="left" prop="receivePlace">
                    <el-select
                        v-model="addItem.receivePlace"
                        value-key="id"
                        placeholder="请选择">
                        <el-option v-for="item in selectReceivePlace" :key="item.id" :label="item.label"
                                   :value="item"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="取样小组" align="left" prop="sampGroup">
                    <el-select
                        v-model="addItem.sampGroup"
                        @change="changeGroup"
                        value-key="id"
                        placeholder="请选择">
                        <el-option v-for="item in selectGroup" :key="item.id" :label="item.departName"
                                   :value="item"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="取样车间" align="left" prop="workShop">
                    <el-select v-model="addItem.workShop"
                               filterable
                               @change="changeWorkshop"
                               placeholder="请选择">
                        <el-option v-for="item in selectWorkshop" :key="item.id" :label="item.name"
                                   :value="item.name+',,,'+item.proccode"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="取样地点" align="left" prop="sampPlace">
                    <el-select v-model="addItem.sampPlace"
                               filterable
                               allow-create
                               placeholder="请选择">
                        <el-option v-for="item in selectPlace" :key="item.id" :label="item.name"
                                   :value="item.name+',,,'+item.proccode"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="是否留存" align="left" prop="ifRestain">
                    <el-switch
                        v-model="addItem.ifRestain"
                        @change="restainOrNo"
                        :active-value=1
                        :inactive-value=0
                        active-text="是"
                        inactive-text="否"
                    ></el-switch>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="留存时间类型" prop="restainTimeType">
                    <el-select v-model="addItem.restainTimeType"
                               placeholder="请选择"
                               :disabled="addItem.ifRestain !== 1">
                        <el-option v-for="item in type" :key="item.id" :label="item.name"
                                   :value="item.name"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="时间类型数值" prop="restainTimeNum">
                    <el-input-number v-model="addItem.restainTimeNum"
                                     :disabled="addItem.ifRestain !== 1"></el-input-number>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="定点开始时间" align="left" prop="spottingStart">
                    <el-date-picker
                        v-model="addItem.spottingStart"
                        type="datetime"
                        placeholder="选择日期时间"
                        :picker-options="pickerOptions">
                    </el-date-picker>
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
                <el-form-item label="定点结束时间" align="left" prop="spottingEnd">
                    <el-date-picker
                        v-model="addItem.spottingEnd"
                        type="datetime"
                        placeholder="选择日期时间"
                        :disabled="!chooseType"
                        :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="取样次数" align="left" prop="sampNum">
                    <el-input-number v-model="addItem.sampNum"
                                     :disabled="chooseType"></el-input-number>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="间隔类型" align="left" prop="intervalType">
                    <el-select v-model="addItem.intervalType"
                               placeholder="请选择">
                        <el-option v-for="item in type" :key="item.id" :label="item.name"
                                   :value="item.name"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="取样间隔" align="left" prop="sampInterval">
                    <el-input-number v-model="addItem.sampInterval"></el-input-number>
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
        addPlanSpot,
        getLabProgram,
        getTypeProgram,
        getSampleGroups,
        getOutPart,
        getSendPlace,
        getGroupStaffs,
        getWorkshopAll
    } from '@/api/lims';
    import {simpleDateFormat} from "@/utils/index";

    export default {
        name: "PlanAdd",
        data() {
            let validInteger = (rule, value, callback) => {
                let reg = /^[1-9]\d*$/;
                if (!reg.test(value)) {
                    callback(new Error('不合格的数,须为正整数'))
                } else {
                    callback()
                }
            };
            let compareTime = (rule, value, callback) => {
                if (this.addItem.spottingStart && this.addItem.spottingEnd) {
                    let start = simpleDateFormat(this.addItem.spottingStart, "yyyy-MM-dd HH:mm:ss");
                    let end = simpleDateFormat(this.addItem.spottingEnd, "yyyy-MM-dd HH:mm:ss");
                    if (start >= end) {
                        callback(new Error('定点开始时间应小于结束时间'))
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
                    selectableRange: simpleDateFormat(new Date(),'HH:mm:ss')+' - 23:59:59'
                },
                addItem: {
                    labProname: '',//化验项目
                    labIndic: '',//化验指标
                    receivePlace: '',//收样地点
                    workShop: '',//车间
                    sampPlace: '',//取样地点
                    sampGroup: '',//取样小组
                    ifRestain: 0,//是否留存
                    restainTimeType: '',//留存时间类型
                    restainTimeNum: '',//留存时间类型值
                    spottingStart: '',//定点开始
                    spottingEnd: '',//定点结束
                    sampNum: '1',//取样次数
                    intervalType: '',//取样间隔类型
                    sampInterval: ''//取样间隔
                },
                type: [{
                    id: 1,
                    name: '时'
                }, {
                    id: 2,
                    name: '天'
                }, {
                    id: 3,
                    name: '周'
                }, {
                    id: 4,
                    name: '月'
                }, {
                    id: 5,
                    name: '旬'
                }],
                selectReceivePlace: [],
                chooseType: true,
                selectProgram: [],
                selectIndicator: [],
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
                addRules: {
                    labIndic: [
                        {required: true, message: '请选择分析项目', trigger: 'blur'},
                    ],
                    labProname: [
                        {required: true, message: '请选择化验物料', trigger: 'blur'},
                    ],
                    receivePlace: [
                        {required: true, message: '请选择收样地点', trigger: 'blur'},
                    ],
                    ifRestain: [
                        {required: true, message: '请勾选留存与否', trigger: 'blur'},
                    ],
                    sampGroup: [
                        {required: true, message: '请选择取样小组', trigger: 'blur'},
                    ],
                    workShop: [
                        {required: true, message: '请输入取样车间', trigger: 'blur'},
                    ],
                    sampPlace: [
                        {required: true, message: '请输入取样地点', trigger: 'blur'},
                    ],
                    intervalType: [
                        {required: true, message: '请选择取样间隔类型', trigger: 'blur'},
                    ],
                    spottingStart: [
                        {required: true, message: '请选择定点开始时间', trigger: 'blur'},
                        {validator: compareTime, trigger: 'blur'}
                    ],
                    spottingEnd: [
                        {required: true, message: '请选择定点结束时间', trigger: 'blur'},
                        {validator: compareTime, trigger: 'blur'}
                    ],
                    sampInterval: [
                        {required: true, message: '请输入取样间隔', trigger: 'blur'},
                        {validator: validInteger, trigger: 'blur'}
                    ],
                    sampNum: []
                }
            }
        },
        mounted() {
            this.getProgramList();
            this.getSelectSendPlace();
            this.getSampleGroup();
            this.getWorkshop();
        },
        computed:{
            spottingStart: function() {
                return this.addItem.spottingStart;
            }
        },
        watch:{
          spottingStart:function (newVal,oldVal) {
              let selectDate = simpleDateFormat(newVal, "yyyyMMdd");
              let oldDate = simpleDateFormat(oldVal, "yyyyMMdd");
              let nowDate = simpleDateFormat(new Date(), 'yyyyMMdd');
              if (oldDate !== selectDate) {
                  if (selectDate === nowDate) {
                      this.pickerOptions.selectableRange =
                          simpleDateFormat(new Date(),'HH:mm:ss')+' - 23:59:59';
                  } else {
                      this.pickerOptions.selectableRange = '00:00:00 - 23:59:59';
                  }
              }
          }
        },
        methods: {
            changeType(){
                if(this.chooseType){
                    this.addRules.sampNum = [];
                    this.addRules.spottingEnd =  this.endTimeRule.spottingEnd;
                    this.addRules.spottingStart = this.endTimeRule.spottingStart;
                }else{
                    this.addRules.spottingEnd = [];
                    this.addRules.sampNum =  this.sampleNumRule.sampNum;
                    this.addRules.spottingStart = this.sampleNumRule.spottingStart;
                }
                this.$refs.addItem.clearValidate();
            },
            save() {
                this.$refs['addItem'].validate((valid) => {
                    if (!valid) {
                        this.$message({
                            type: 'error',
                            message: '请正确键入再提交'
                        })
                    } else {
                        if (this.addItem.labIndic.length > 30) {
                            this.$message.warning("最多勾选30个分析项");
                            return false;
                        }
                        if (this.addItem.ifRestain === 1) {
                            if (this.addItem.restainTimeType === null || this.addItem.restainTimeType === '' || this.addItem.restainTimeNum === '') {
                                this.$message.error('请设置留存时间');
                                return false;
                            }
                            if (!(/^[1-9]\d*$/).test(this.addItem.restainTimeNum)) {
                                this.$message.error('留存时间类型值须为正整数');
                                return false;
                            }
                        }
                        if (this.chooseType) {
                            this.addItem.sampNum = null;
                        } else {
                            this.addItem.spottingEnd = null;
                        }
                        const item = {
                            plan: {
                                labProname: this.addItem.labProname.proName,
                                matId: this.addItem.labProname.matId,
                                labIndic: this.addItem.labIndic.join(','),
                                receivePlace: this.addItem.receivePlace.label,
                                receivePlaceCode: this.addItem.receivePlace.code,
                                sampGroup: this.addItem.sampGroup.departName,
                                sampGroupId: this.addItem.sampGroup.id,
                                workShop: this.addItem.workShop.split(',,,')[0],
                                workshopCode: this.addItem.workShop.split(',,,')[1],
                                sampPlace: this.addItem.sampPlace.indexOf(',,,')<0?this.addItem.sampPlace:this.addItem.sampPlace.split(',,,')[0],
                                placeCode: this.addItem.sampPlace.indexOf(',,,')<0?'0000':this.addItem.sampPlace.split(',,,')[1],
                                ifRestain: this.addItem.ifRestain,//是否留存
                                restainTimeType: this.addItem.restainTimeType,//留存时间类型
                                restainTimeNum: this.addItem.restainTimeNum,//留存时间类型值
                            },
                            spot: {
                                spottingStart: simpleDateFormat(this.addItem.spottingStart, 'yyyy-MM-dd HH:mm:ss'),//定点开始
                                spottingEnd: this.chooseType?simpleDateFormat(this.addItem.spottingEnd, 'yyyy-MM-dd HH:mm:ss'):null,//定点结束
                                sampNum: this.chooseType?null:this.addItem.sampNum,//取样次数
                                intervalType: this.addItem.intervalType,//取样间隔类型
                                sampInterval: this.addItem.sampInterval//取样间隔
                            }
                        };
                        addPlanSpot(item).then(response => {
                            const result = response.data;
                            if (result.success) {
                                this.$message({
                                    type: 'success',
                                    message: '新增成功'
                                });
                                this.$refs['addItem'].resetFields();
                                this.$emit("hidenDialog")
                            } else {
                                this.$message.error(result.message);
                            }
                        }).catch(e => {
                            this.$message.error(e.message);
                        })
                    }
                });
            },
            cancel() {
                this.$emit("hidenDialog");
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
            restainOrNo(val) {
                if (val === 0) {
                    this.addItem.restainTimeNum = '';
                    this.addItem.restainTimeType = null;
                }
            },
            getSelectSendPlace(){
                getSendPlace().then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.selectReceivePlace = result.data;
                    } else {
                        this.$message.error(result.message);
                    }
                }).catch(e => {
                    this.$message.error(e.message);
                });
            },
            getProgramList() {
                let param = "all";
                getTypeProgram(param).then(res => {
                    if (res.data.success) {
                        this.selectProgram = res.data.data;
                    }
                }).catch(e => {
                    this.$message.error(e.message);
                });
            },
            getSampleGroup() {
                getSampleGroups().then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.selectGroup = result.data;
                    } else {
                        this.$message.error(result.message);
                    }
                }).catch(e => {
                    this.$message.error(e.message);
                });
            },
            getWorkshop() {
                getWorkshopAll({code: this.code}).then(res => {
                    const result = res.data;
                    if (result.success && result.data.success) {
                        if (this.code === "")
                            this.selectWorkshop = result.data.data;
                        else
                            this.selectPlace = result.data.data;
                    } else {
                        this.$message.error(result.message);
                    }
                }).catch(e => {
                    this.$message.error(e.message);
                });
            },
            changeWorkshop(val) {
                this.addItem.sampPlace = '';
                this.code = val.split(',,,')[1];
                this.getWorkshop();
            },
            changeGroup(val) {
                let param = {
                    id: val.id
                };
                getGroupStaffs(param).then((response) => {
                    const result = response.data;
                    if (result.success) {
                        if (result.data.length === 0) {
                            this.addItem.sampGroup = '';
                            this.$message.warning('当前小组下未分配在职员工，请重新配置');
                            return false;
                        }
                    } else {
                        this.$message.error(result.message);
                    }
                }).catch(e => {
                    this.$message.error(e.message);
                });
            },
            selectAll(){
                let selected = this.selectIndicator.map(item=>item.outId);
                this.$set(this.addItem,"labIndic",selected);
            }
        },
    }
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
