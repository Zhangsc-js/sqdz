<template>
    <div>
        <el-form :model="addOut" ref="addOut" :rules="addRules" label-width="100px">
            <el-col :span="18">
                <el-form-item label="指标名称" prop="outName">
                    <el-input v-model="addOut.outName"/>
                </el-form-item>
            </el-col>
            <el-col :span="18">
                <el-form-item label="指标编号" prop="outCode">
                    <el-input v-model="addOut.outCode" auto-complete="off"/>
                </el-form-item>
            </el-col>
            <el-col :span="18">
                <el-form-item label="小数点位数" prop="decimalDigits">
                    <el-input v-model="addOut.decimalDigits"/>
                </el-form-item>
            </el-col>
            <el-col :span="18">
                <el-form-item label="计量单位" prop="outUnit">
                    <el-select
                        v-model="addOut.outUnit"
                        filterable
                        @change="selectUnitChange" placeholder="请选择计量单位">
                        <el-option v-for="item in unitType" :key="item.id" :label="item.name"
                                   :value="item.name"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="18">
                <el-form-item label="可使用状态" prop="outStatus">
                    <el-select
                        v-model="addOut.outStatus"
                        placeholder="请选择指标状态">
                        <el-option v-for="item in statType" :key="item.statId" :label="item.stat"
                                   :value="item.stat"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="18">
                <el-form-item label="限值类型" prop="type">
                    <el-select v-model="addOut.type" placeholder="请选择">
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
                    <div v-if="addOut.type === 1" style="margin-top:8px;">
                        <el-input
                            placeholder="请输入标准值"
                            v-model="addOut.lowerLimit"
                        >
                            <template slot="prepend">{{"≥"}}</template>
                        </el-input>
                    </div>
                    <div v-else-if="addOut.type === 2" style="margin-top:8px;">
                        <el-input
                            placeholder="请输入标准值"
                            v-model="addOut.upperLimit"
                        >
                            <template slot="prepend">{{"≤"}}</template>
                        </el-input>
                    </div>
                    <div v-else-if="addOut.type === 3" class="input-group">
                        <el-input
                            class="input-left"
                            placeholder="请输入标准下限"
                            v-model="addOut.lowerLimit"
                        >
                            <template slot="append">~</template>
                        </el-input>
                        <el-input
                            class="input-right"
                            placeholder="请输入标准上限"
                            v-model="addOut.upperLimit"
                        ></el-input>
                    </div>
                    <div v-else-if="addOut.type === 4" class="input-group">
                        <el-input
                            class="input-left"
                            placeholder="请输入标准下下限"
                            v-model="addOut.llowerLimit"
                        >
                            <template slot="append">≤</template>
                        </el-input>
                        <el-input
                            class="input-left"
                            placeholder="请输入标准下限"
                            v-model="addOut.lowerLimit"
                        >
                            <template slot="append">~</template>
                        </el-input>
                        <el-input
                            class="input-right"
                            placeholder="请输入标准上限"
                            v-model="addOut.upperLimit"
                        >
                            <template slot="append">≤</template>
                        </el-input>
                        <el-input
                            class="input-right"
                            placeholder="请输入标准上上限"
                            v-model="addOut.uupperLimit"
                        ></el-input>
                    </div>
                </el-form-item>
            </el-col>
            <el-col :span="18">
                <el-form-item label="备注" prop="outRemark">
                    <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 3}"
                              maxlength="123" v-model="addOut.outRemark" placeholder="(123字以内)"/>
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
        addOutIndicator,
        getMeasureUnit,
        validNum,
        validCode,
        validIndicator,
        existOutCode,
        getOutIndicator
    } from '@/api/lims';
    import {simpleDateFormat} from "@/utils/index";

    export default {
        name: "outAdd",
        data() {
            //小数点保留位数格式限制
            let validDigits = (rule, value, callback) => {
                let reg = /^[0-5]$/;
                if (!reg.test(value)) {
                    callback(new Error('不合格的数，小数点位数保留范围为0-5'))
                } else {
                    callback()
                }
            };
            let ifExist = (rule, value, callback) => {
                let param = {code: value};
                existOutCode(param).then(res => {
                    if (res.data.data) {
                        callback(new Error('编号已存在，请输入新的编号'));
                    } else {
                        callback()
                    }
                })
            };
            return {
                addOut: {
                    outName: '',//指标名称
                    outCode: '',//指标编号
                    type: 1,
                    uupperLimit: '',//指标上上限
                    upperLimit: '',//指标上限
                    lowerLimit: '',//指标下限
                    llowerLimit: '',//指标下下限
                    decimalDigits: 2,//计算值保留小数点位数
                    outUnit: '',//计量单位
                    outRemark: '',//备注
                    outStatus: '有效',//可使用状态
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
                addRules: {
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
                    type: [
                        {required: true, message: '请选择类型', trigger: 'blur'}
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
        mounted() {
            this.getUnitList();
        },
        methods: {
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
                this.$refs['addOut'].validate((valid) => {
                    if (!valid) {
                        this.$message({
                            type: 'error',
                            message: '请正确键入再提交'
                        });
                        return false;
                    } else {
                        switch (this.addOut.type) {
                            case 1:
                                if (!this.validNumber(this.addOut.lowerLimit)) {
                                    this.$message.error('限值为无效的数');
                                    return false;
                                }
                                this.addOut.uupperLimit = "--";
                                this.addOut.upperLimit = "--";
                                this.addOut.llowerLimit = "--";
                                break;
                            case 2:
                                if (!this.validNumber(this.addOut.upperLimit)) {
                                    this.$message.error('限值为无效的数');
                                    return false;
                                }
                                this.addOut.uupperLimit = "--";
                                this.addOut.lowerLimit = "--";
                                this.addOut.llowerLimit = "--";
                                break;
                            case 3:
                                if (!this.validNumber(this.addOut.upperLimit) || !this.validNumber(this.addOut.lowerLimit)) {
                                    this.$message.error('限值为无效的数');
                                    return false;
                                }
                                if (this.addOut.upperLimit * 1 < this.addOut.lowerLimit * 1) {
                                    this.$message.error('限值大小不合要求');
                                    return false;
                                }
                                this.addOut.uupperLimit = "--";
                                this.addOut.llowerLimit = "--";
                                break;
                            case 4:
                                if (!this.validNumber(this.addOut.upperLimit) || !this.validNumber(this.addOut.lowerLimit)
                                    || !this.validNumber(this.addOut.uupperLimit) || !this.validNumber(this.addOut.llowerLimit)) {
                                    this.$message.error('限值为无效的数');
                                    return false;
                                }
                                if (this.addOut.upperLimit * 1 < this.addOut.lowerLimit * 1 || this.addOut.uupperLimit * 1 < this.addOut.lowerLimit * 1 ||
                                    this.addOut.upperLimit * 1 < this.addOut.llowerLimit * 1 || this.addOut.uupperLimit * 1 < this.addOut.llowerLimit * 1 ||
                                    this.addOut.uupperLimit * 1 < this.addOut.upperLimit * 1 || this.addOut.lowerLimit * 1 < this.addOut.llowerLimit * 1) {
                                    this.$message.error('限值大小不合要求');
                                    return false;
                                }
                                break;
                        }
                        addOutIndicator(this.addOut).then(response => {
                            const result = response.data;
                            if (result.success) {
                                this.$message({
                                    type: 'success',
                                    message: '新增成功'
                                });
                                this.$refs['addOut'].resetFields()
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
                        })
                    }
                })
            },
            cancel() {
                this.$emit("hidenDialog")
            },
            selectUnitChange(val) {

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
<style lang="scss">
</style>
<style scoped>
</style>
