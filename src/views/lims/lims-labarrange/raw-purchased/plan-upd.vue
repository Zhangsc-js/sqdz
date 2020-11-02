<template>
    <div class="arrange-cont">
        <el-form :model="updItem" ref="updItem" :rules="updRules" label-width="100px">
            <el-col :span="12">
                <el-form-item label="化验物料" prop="labProname">
                    <el-select v-model="updItem.labProname" value-key="proId" @change="changeProgram" placeholder="请选择">
                        <el-option v-for="item in selectProgram" :key="item.proId" :label="item.proName"
                                   :value="item"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="分析项目" prop="labIndicator">
                    <el-select
                        v-model="updItem.labIndicator"
                        value-key="outId"
                        multiple
                        collapse-tags
                        filterable
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="item in selectIndic"
                            :key="item.outId"
                            :label="item.outValue"
                            :value="item"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="收样地点" prop="receivePlace">
                    <el-select v-model="updItem.receivePlace" value-key="id" placeholder="请选择">
                        <el-option v-for="item in selectReceivePlace" :key="item.id" :label="item.label"
                                   :value="item"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="取样小组" prop="sampGroup">
                    <el-select
                        v-model="updItem.sampGroup"
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
                <el-form-item label="是否留存" prop="ifRestain">
                    <el-switch
                        v-model="updItem.ifRestain"
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
                    <el-select v-model="updItem.restainTimeType"
                               placeholder="请选择"
                               :disabled="updItem.ifRestain !== 1">
                        <el-option v-for="item in type" :key="item.id" :label="item.name"
                                   :value="item.name"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="时间类型数值" prop="restainTimeNum">
                    <el-input-number v-model="updItem.restainTimeNum"
                                     :disabled="updItem.ifRestain !== 1"></el-input-number>
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
        updateRaw,
        getOutPart,
        getTypeProgram,
        getSendPlace,
        getGroupStaffs,
        getProIndicator,
        getSampleGroups
    } from "@/api/lims";
    import {simpleDateFormat} from "@/utils/index";

    export default {
        name: "PlanUpd",
        data() {
            return {
                updItem: {
                    labProname: "", //化验项目名
                    labIndicator: [],
                    labIndic: "",
                    receivePlace: "", //收样地点
                    receivePlaceCode: "",
                    sampGroupId: "",
                    sampGroup: "", //取样小组
                    ifRestain: "", //是否留存
                    restainTimeType: '',//留存时间类型
                    restainTimeNum: '',//留存时间类型值
                    planCode: '',//计划单号
                },
                selectProgram: [],
                selectIndic: [],
                selectReceivePlace: [],
                selectGroup: [],
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
                updRules: {
                    labIndicator: [
                        {required: true, message: "请选择分析项目", trigger: "blur"}
                    ],
                    labProname: [
                        {required: true, message: "请选择化验物料", trigger: "blur"}
                    ],
                    receivePlace: [{required: true, message: "请选择收样地点", trigger: "blur"}],
                    ifRestain: [
                        {required: true, message: "请勾选留存与否", trigger: "blur"}
                    ],
                    sampGroup: [
                        {required: true, message: "请选择取样小组", trigger: "blur"}
                    ]
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
            }
        },
        created() {
            this.getData();
            this.getSelectIndicatorInit();
            this.getSelectSendPlace();
            this.getProgramList();
            this.getSampleGroup();
        },
        methods: {
            getSelectIndicatorInit() {
                getProIndicator({matId:this.selPlan.matId,planId:this.selPlan.planId})
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
            getSelectSendPlace(){
                getSendPlace().then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.selectReceivePlace = result.data;
                        let arr = this.selectReceivePlace.filter(item =>{
                            return this.updItem.receivePlaceCode === item.code;
                        });
                        this.$set(this.updItem,"receivePlace",arr.length > 0 ? arr[0]:{});
                    } else {
                        this.$message.error(result.message);
                    }
                }).catch(e => {
                    this.$message.error(e.message);
                });
            },
            getData() {
                let indicatorName = this.selPlan.labIndicName.split(",");
                this.updItem = {...this.selPlan};
                let selIndicator = [];
                let indicatorId = this.selPlan.labIndic.split(",");
                indicatorId.map((item, i) => {
                    selIndicator.push({
                        outValue: indicatorName[i],
                        outId: item
                    });
                });
                this.$set(this.updItem,"labIndicator",selIndicator.length > 0 ? selIndicator:[]);
            },
            save() {
                this.$refs["updItem"].validate(valid => {
                    if (!valid) {
                        this.$message({
                            type: "error",
                            message: "请正确键入再提交"
                        });
                        return false;
                    } else {
                        if(this.updItem.labIndicator.length > 30){
                            this.$message.warning("最多勾选30个分析项");
                            return false;
                        }
                        if(this.updItem.ifRestain === 1){
                            if(this.updItem.restainTimeType === null || this.updItem.restainTimeType === '' || this.updItem.restainTimeNum === ''){
                                this.$message.error('请设置留存时间');
                                return false;
                            }
                            if(!(/^[1-9]\d*$/).test(this.updItem.restainTimeNum)){
                                this.$message.error('留存时间类型值须为正整数');
                                return false;
                            }
                        }
                        const _this = this;
                         _this.updItem.labIndic = (_this.updItem.labIndicator.map(item => {return item.outId;})).join(",");
                        _this.updItem.receivePlaceCode = _this.updItem.receivePlace.code;
                        _this.updItem.receivePlace = _this.updItem.receivePlace.label;
                        _this.updItem.matId = _this.updItem.labProname.matId;
                        _this.updItem.labProname = _this.updItem.labProname.proName;
                        _this.updItem.sampGroupId = _this.updItem.sampGroup.id;
                        _this.updItem.sampGroup = _this.updItem.sampGroup.departName;
                        updateRaw({planType:0, ..._this.updItem})
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
                            })
                    }
                });
            },
            cancel() {
                this.$emit("hidenDialog");
            },
            restainOrNo(val){
                if(val === 0){
                    this.updItem.restainTimeNum = '';
                    this.updItem.restainTimeType = null;
                }
            },
            changeProgram(val) {
                this.updItem.labIndicator = [];
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
                getTypeProgram(param).then(res => {
                    if (res.data.success) {
                        this.selectProgram = res.data.data;
                        let arr = this.selectProgram.filter(item =>{
                            return this.selPlan.matId === item.matId;
                        });
                        this.$set(this.updItem,"labProname",arr.length > 0 ? arr[0]: {});
                    }
                }).catch(e => {
                    this.$message.error(e.message);
                });
            },
            getSampleGroup() {
                getSampleGroups()
                    .then(res => {
                        const result = res.data;
                        if (result.success) {
                            this.selectGroup = result.data;
                            let arr = this.selectGroup.filter(item =>{
                                return this.updItem.sampGroupId === item.id;
                            });
                            this.$set(this.updItem,"sampGroup",arr.length > 0 ? arr[0]:{});
                        } else {
                            this.$message.error(result.message);
                        }
                    })
                    .catch(e => {
                        this.$message.error(e.message);
                    });
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
    .el-input-number{
        line-height: 30px !important;
    }
    .dialog-footer .el-button{
        margin-top: 40px;
    }
</style>
