<template>
    <div>
        <el-form :model="updOut" ref="updOut" :rules="updRules" label-width="100px">
            <el-col :span="18">
                <el-form-item label="指标名称" prop="outName">
                    <el-input v-model="updOut.outName"/>
                </el-form-item>
            </el-col>
            <el-col :span="18">
                <el-form-item label="指标编号" prop="outCode">
                    <el-input v-model="updOut.outCode" auto-complete="off"/>
                </el-form-item>
            </el-col>
            <el-col :span="18">
                <el-form-item label="小数点位数" prop="decimalDigits">
                    <el-input v-model="updOut.decimalDigits"/>
                </el-form-item>
            </el-col>
            <el-col :span="18">
                <el-form-item label="计量单位" prop="outUnit">
                    <el-select
                        v-model="updOut.outUnit"
                        filterable
                        placeholder="请选择计量单位">
                        <el-option v-for="item in unitType" :key="item.id" :label="item.name"
                                   :value="item.name"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="18">
                <el-form-item label="可使用状态" prop="outStatus">
                    <el-select
                        v-model="updOut.outStatus"
                        placeholder="请选择指标状态">
                        <el-option v-for="item in statType" :key="item.statId" :label="item.stat"
                                   :value="item.stat"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="18">
                <el-form-item label="限值类型" prop="type">
                    <el-select v-model="updOut.type" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="18">
                <el-form-item label="指标限值">
                    <div v-if="updOut.type === 1" style="margin-top:8px;">
                        <el-input
                            placeholder="请输入标准值"
                            v-model="updOut.lowerLimit"
                        >
                            <template slot="prepend">{{"≥"}}</template>
                        </el-input>
                    </div>
                    <div v-else-if="updOut.type === 2" style="margin-top:8px;">
                        <el-input
                            placeholder="请输入标准值"
                            v-model="updOut.upperLimit"
                        >
                            <template slot="prepend">{{"≤"}}</template>
                        </el-input>
                    </div>
                    <div v-else-if="updOut.type === 3" class="input-group">
                        <el-input
                            class="input-left"
                            placeholder="请输入标准下限"
                            v-model="updOut.lowerLimit"
                        >
                            <template slot="append">~</template>
                        </el-input>
                        <el-input
                            class="input-right"
                            placeholder="请输入标准上限"
                            v-model="updOut.upperLimit"
                        ></el-input>
                    </div>
                    <div v-else-if="updOut.type === 4" class="input-group">
                        <el-input
                            class="input-left"
                            placeholder="请输入标准下下限"
                            v-model="updOut.llowerLimit"
                        >
                            <template slot="append">≤</template>
                        </el-input>
                        <el-input
                            class="input-left"
                            placeholder="请输入标准下限"
                            v-model="updOut.lowerLimit"
                        >
                            <template slot="append">~</template>
                        </el-input>
                        <el-input
                            class="input-right"
                            placeholder="请输入标准上限"
                            v-model="updOut.upperLimit"
                        >
                            <template slot="append">≤</template>
                        </el-input>
                        <el-input
                            class="input-right"
                            placeholder="请输入标准上上限"
                            v-model="updOut.uupperLimit"
                        ></el-input>
                    </div>
                </el-form-item>
            </el-col>
            <el-col :span="18">
                <el-form-item label="备注" prop="outRemark">
                    <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 3}"
                              maxlength="123" v-model="updOut.outRemark" placeholder="(123字以内)"/>
                </el-form-item>
            </el-col>
        </el-form>
        <div slot="footer" class="dialog-footer" style="clear:both">
            <el-button @click="cancel()">取 消</el-button>
            <el-button type="primary" @click="save()">保存</el-button>
        </div>
    </div>
</template>

<script>
    import {
        getOutIndicator,
        updateOutIndicator,
        getMeasureUnit,
        validNum,
        validCode,
        validIndicator,
        existOutCode
    } from '@/api/lims';
    import {simpleDateFormat} from "@/utils/index";

    export default {
        name: "outUpd",
        data() {
            //小数点保留位数格式限制
            let validDigits = (rule, value, callback) => {
                let reg = /^[0-7]$/;
                if (!reg.test(value)) {
                    callback(new Error('不合格的数，小数点位数保留范围为0-7'))
                } else {
                    callback()
                }
            };
            let ifExist = (rule, value, callback) => {
                let param = {code: value};
                existOutCode(param).then(res => {
                    let outTemp = '';
                    if (res.data.data) {
                        getOutIndicator(this.outId).then(response => {
                            outTemp = response.data.data.outCode;
                            if (outTemp === value) {
                                callback()
                            } else {
                                callback(new Error('编号已存在，请输入新的编号'))
                            }
                        });
                    } else {
                        callback()
                    }
                })
            };
            return {
                updOut: {
                    outName: '',//指标名称
                    outCode: '',//指标编号
                    upperLimit: '',//指标上限
                    uupperLimit: '',//指标上上限
                    llowerLimit: '',//指标下下限
                    lowerLimit: '',//指标下限
                    decimalDigits: 0,//计算值保留小数点位数
                    outUnit: '',//计量单位
                    outRemark: '',//备注
                    outStatus: '',//可使用状态
                },
                statType: [{
                    statId: '1',
                    stat: '有效'
                }, {
                    statId: '2',
                    stat: '无效'
                }],
                options: [{
                    value: 1,
                    label: '大于等于'
                }, {
                    value: 2,
                    label: '小于等于'
                }, {
                    value: 3,
                    label: '两级区间'
                }, {
                    value: 4,
                    label: '四级区间'
                }],
                unitType: [],
                updRules: {
                    outCode: [
                        {required: true, message: '请输入指标编号', trigger: ["blur", "change"]},
                        {validator: validIndicator, trigger: ["blur", "change"]},
                        {validator: ifExist, trigger: 'change'}
                    ],
                    outName: [
                        {required: true, message: '请输入指标名称', trigger: ["blur", "change"]},
                        //{min: 2, message: '请输入不少于2个字符', trigger: 'blur' },
                        {validator: validIndicator, trigger: ["blur", "change"]}
                    ],
                    uupperLimit: [
                        {required: true, message: '请输入指标上上限', trigger: 'blur'},
                        {validator: validNum, trigger: 'blur'}
                    ],
                    upperLimit: [
                        {required: true, message: '请输入指标上限', trigger: 'blur'},
                        {validator: validNum, trigger: 'blur'}
                    ],
                    lowerLimit: [
                        {required: true, message: '请输入指标下限', trigger: 'blur'},
                        {validator: validNum, trigger: 'blur'}
                    ],
                    llowerLimit: [
                        {required: true, message: '请输入指标下下限', trigger: 'blur'},
                        {validator: validNum, trigger: 'blur'}
                    ],
                    decimalDigits: [
                        {required: true, message: '请输入小数点位数', trigger: 'blur'},
                        {validator: validDigits, trigger: 'blur'}
                    ],
                    outUnit: [
                        {required: true, message: '请选择计量单位', trigger: 'blur'},
                    ],
                    outStatus: [
                        {required: true, message: '请选择指标可使用状态', trigger: 'blur'},
                    ]
                }
            }
        },
        props: {
            outId: {
                type: String,
                required: true
            }
        },
        mounted() {
            this.getData();
            this.getUnitList();
        },
        watch: {
            outId() {
                this.getData()
            }
        },
        methods: {
            getData() {
                getOutIndicator(this.outId).then(response => {
                    const result = response.data;
                    if (result.success) {
                        this.updOut = Object.assign({}, result.data);
                    } else {
                        this.$message({
                            type: 'error',
                            message: result.message
                        })
                    }
                }).catch(e => {
                    this.$message({
                        type: 'error',
                        message: e.message
                    })
                })
            },
            validNumber(num) {
                let regNum = /^(0|-?[1-9]\d*)\b/;
                let reg = /^([0-9]\d*)\b/;
                /*let reg = /^(0*[1-9]\d*)\b/;*/
                if (num.indexOf('.') === -1) {
                    return regNum.test(num);
                } else {
                    return !(num.split(".").length !== 2 || !regNum.test(num.split(".")[0]) || !reg.test(num.split(".")[1]));
                }
            },
            save() {
                this.$refs['updOut'].validate((valid) => {
                    if (!valid) {
                        this.$message({
                            type: 'error',
                            message: '请正确键入再提交'
                        });
                        return false;
                    } else {
                        switch (this.updOut.type) {
                            case 1:
                                if (!this.validNumber(this.updOut.lowerLimit)) {
                                    this.$message.error('限值为无效的数');
                                    return false;
                                }
                                this.updOut.uupperLimit = "--";
                                this.updOut.upperLimit = "--";
                                this.updOut.llowerLimit = "--";
                                break;
                            case 2:
                                if (!this.validNumber(this.updOut.upperLimit)) {
                                    this.$message.error('限值为无效的数');
                                    return false;
                                }
                                this.updOut.uupperLimit = "--";
                                this.updOut.lowerLimit = "--";
                                this.updOut.llowerLimit = "--";
                                break;
                            case 3:
                                if (!this.validNumber(this.updOut.upperLimit) || !this.validNumber(this.updOut.lowerLimit)) {
                                    this.$message.error('限值为无效的数');
                                    return false;
                                }
                                if (this.updOut.upperLimit * 1 < this.updOut.lowerLimit * 1) {
                                    this.$message.error('限值大小不合要求');
                                    return false;
                                }
                                this.updOut.uupperLimit = "--";
                                this.updOut.llowerLimit = "--";
                                break;
                            case 4:
                                if (!this.validNumber(this.updOut.upperLimit) || !this.validNumber(this.updOut.lowerLimit)
                                    || !this.validNumber(this.updOut.uupperLimit) || !this.validNumber(this.updOut.llowerLimit)) {
                                    this.$message.error('限值为无效的数');
                                    return false;
                                }
                                if (this.updOut.upperLimit * 1 < this.updOut.lowerLimit * 1 || this.updOut.uupperLimit * 1 < this.updOut.lowerLimit * 1 ||
                                    this.updOut.upperLimit * 1 < this.updOut.llowerLimit * 1 || this.updOut.uupperLimit * 1 < this.updOut.llowerLimit * 1 ||
                                    this.updOut.uupperLimit * 1 < this.updOut.upperLimit * 1 || this.updOut.lowerLimit * 1 < this.updOut.llowerLimit * 1) {
                                    this.$message.error('限值大小不合要求');
                                    return false;
                                }
                                break;
                        }
                        const record = {
                            outId: this.outId,
                            outName: this.updOut.outName,
                            outCode: this.updOut.outCode,
                            uupperLimit: this.updOut.uupperLimit,
                            upperLimit: this.updOut.upperLimit,
                            lowerLimit: this.updOut.lowerLimit,
                            llowerLimit: this.updOut.llowerLimit,
                            decimalDigits: this.updOut.decimalDigits,
                            outUnit: this.updOut.outUnit,
                            outRemark: this.updOut.outRemark,
                            outStatus: this.updOut.outStatus,
                        };
                        let putRecord = eval('(' + JSON.stringify(record) + ')');
                        updateOutIndicator(putRecord,"1").then(response => {
                            const result = response.data;
                            if (result.success) {
                                this.$message.success(result.data);
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: result.message
                                })
                            }
                        }).catch(e => {
                            this.$message({
                                type: 'error',
                                message: e.message
                            })
                        }).finally(() => {
                            this.$emit("hidenDialog")
                        });
                    }
                });
            },
            cancel() {
                this.$emit("hidenDialog")
            },
            getUnitList() {
                getMeasureUnit().then(res => {
                    const result = res.data;
                    if (result.success && result.data.success) {
                        this.unitType = result.data.data;
                    } else {
                        this.$message.error(result.message);
                    }
                }).catch(e => {
                    this.$message.error(e.message);
                });
            }
        }
    }
</script>

<style scoped>

</style>
