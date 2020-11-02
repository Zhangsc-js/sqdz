<template>
    <div>
        <el-form :model="updInput" ref="updInput" :rules="updRules" label-width="100px">
            <el-col :span="18">
                <el-form-item label="输出指标" prop="outs">
                    <el-select v-model="updInput.outs"
                               value-key="outId"
                               @change="changeOut"
                               filterable
                               placeholder="请选择" :disabled="true">
                        <el-option
                            v-for="item in selectIndicator"
                            :key="item.outId"
                            :label="item.outValue"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="18">
                <el-form-item label="输入指标" prop="inputs">
                    <el-select v-model="updInput.inputs"
                               value-key="inputId"
                               @change="changeInput"
                               multiple
                               collapse-tags
                               filterable
                               placeholder="请选择">
                        <el-option
                            v-for="item in selectInput"
                            :key="item.inputId"
                            :label="item.inputValue"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="18">
                <el-form-item label="公式" prop="theFormula">
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 1, maxRows: 3}"
                        maxlength="123"
                        v-model="updInput.theFormula"/>
                </el-form-item>
            </el-col>
            <el-col :span="18">
                <el-form-item label="公式类型" prop="formulaStatus">
                    <el-select v-model="updInput.formulaStatus" placeholder="请选择公式状态" width="100%">
                        <el-option label="有效" value="有效"></el-option>
                        <el-option label="无效" value="无效"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="18">
                <el-form-item label="备注" prop="remark">
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 1, maxRows: 3}"
                        maxlength="123"
                        v-model="updInput.remark"
                        placeholder="(123字以内)"
                    />
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
    import {simpleDateFormat} from "@/utils/index";
    import {
        updateFormula, outExistFormula, getOutList, getInputList, validBraces
    } from "@/api/lims";

    export default {
        name: "update",
        data() {
            //公式格式限制，不能输入除输入输出指标以外的未知参数，括号匹配。
            let validFormula = (rule, value, callback) => {
                let reValue = value;
                for(let i=0;i<this.inputCodes.length;i++) {
                    if(reValue.indexOf(this.inputCodes[i]) > -1) {
                        let regI1 = new RegExp(this.inputCodes[i] + '[^\\+\\-\\*\\/\\\\)\\%]');
                        let regI2 = new RegExp('[^\\+\\-\\*\\/\\=\\\\(\\%]' + this.inputCodes[i]);
                        if (regI1.test(reValue) || regI2.test(reValue)) {
                            callback(new Error("不合格的公式"));
                        } else {
                            //reValue = reValue.replace(new RegExp(this.inputCodes[i], 'g'), "");
                            reValue = reValue.split(this.inputCodes[i]).join("");
                            value = value.split(this.inputCodes[i]).join("m");
                        }
                    }
                }
                let outCode = this.updInput.outIndicName.split("<:-:>")[0];
                reValue = reValue.replace(outCode, "");
                value = value.replace(outCode, "");
                let reg = /[a-zA-Z]+/;
                let num = value.split("=");
                if (/[\+\-\*\/\%]$/.test(value) || /\([\+\-\*\/\%]/.test(value) || /[\+\-\*\/\%]\)/.test(value) || /\(\)/.test(value) || /=[\+\*\/\%]/.test(value) ||
                    /[^\+\-\*\/\=\%\\(]\(/.test(value) || /\)[^\+\-\*\/\%\\)]/.test(value) || /[\+\-\*\/\%]{2,}/.test(value) || /[^\+\-\*\=\/\%\0-9]+/.test(reValue) ||
                    reg.test(reValue) || !validBraces(reValue) || num.length !== 2 || num[0] !== "" || num[1].trim() === "" || reValue.indexOf(" ") !== -1){
                    callback(new Error('不合格的公式'))
                } else {
                    callback()
                }
            };
            let ifExist = (rule, value, callback) => {
                let outId = this.updInput.outIndic;
                if (outId === this.oriOutIndicator) {//如果和原来一样
                    callback()
                } else {
                    outExistFormula(outId).then(res => {
                        if (res.data.data != null) {
                            callback(new Error('该指标已有对应公式，请重新对应'))
                        } else {
                            callback()
                        }
                    });
                }
            };
            return {
                updInput: {
                    inputs: [],
                    outs: ""
                },
                inputCodes: [],
                inputOutIds: [],
                inputOutNames: [],
                inIds: [],
                inNames: [],
                selectInput: [],
                selectIndicator: [],
                oriOutIndicator: "",
                updRules: {
                    inputs: [
                        {required: true, message: "请输入输入指标", trigger: ["blur", "change"]}
                    ],
                    outs: [
                        {required: true, message: "请输入输出指标", trigger: ["blur", "change"]},
                        {validator: ifExist, trigger: ["blur", "change"]}
                    ],
                    theFormula: [
                        {required: true, message: "请输入公式", trigger: ["blur", "change"]},
                        {validator: validFormula, trigger: ["blur", "change"]}
                    ],
                    formulaStatus: [
                        {required: true, message: "请选择公式状态", trigger: ["blur", "change"]}
                    ]
                }
            };
        },
        props: {
            selFormula: {
                type: Object,
                required: true
            }
        },
        watch: {
            selFormula() {
                this.getData()
            }
        },
        mounted() {
            this.getData();
            this.getInput();
            this.getOut();
        },
        methods: {
            getData() {
                this.updInput = {...this.selFormula};
                this.oriOutIndicator = this.selFormula.outIndic;
                this.inIds = this.selFormula.inputIndic.split(',');
                this.inNames = this.selFormula.inputIndicName.split('@,,,@');
                this.inNames.forEach(element => {
                    this.inputCodes.push(element.split("<:-:>")[0]);
                });
                this.inputCodes = this.inputCodes.sort(function(a,b){return b.length-a.length});
            },
            save() {
                this.$refs["updInput"].validate(valid => {
                    if (!valid) {
                        this.$message({
                            type: "error",
                            message: "请正确键入再提交"
                        });
                    } else {
                        if(this.inIds.length > 30){
                            this.$message.warning("输入超出限制");
                            return false;
                        }
                        this.updInput.inputIndic = this.inIds.join(',');
                        this.updInput.inputIndicName = this.inNames.join('@,,,@');
                        updateFormula(this.updInput)
                            .then(response => {
                                const result = response.data;
                                if (result.success) {
                                    this.$message({
                                        type: "success",
                                        message: "更新成功"
                                    });
                                    this.$refs["updInput"].resetFields();
                                } else {
                                    this.$message.error(result.message);
                                }
                            })
                            .catch(e => {
                                this.$message.error(e.message);
                            })
                            .finally(() => {
                                this.$emit("hidenDialog");
                            });
                    }
                });
            },
            cancel() {
                this.$emit("hidenDialog");
            },
            getOut() {
                getOutList()
                    .then(res => {
                        this.selectIndicator = res.data.data;
                        let outItem = {
                            outId: this.updInput.outIndic,
                            outValue: this.updInput.outIndicName
                        };
                        let arr = this.selectIndicator.filter(item => {
                            return outItem.outId === item.outId
                        });
                        if(arr.length === 0) {
                            this.selectIndicator.push(outItem);
                        }
                        this.$set(this.updInput,"outs",outItem);
                    })
                    .catch(e => {
                        this.$message.error(e.message);
                    });
            },
            getInput() {
                getInputList({type: "0"}).then(res => {
                    if (res.data.success) {
                        this.selectInput = res.data.data;
                        for (let i = 0; i < this.inIds.length; i++) {
                            let arr = this.selectInput.filter(item => {
                                return this.inIds[i] === item.inputId
                            });
                            if (arr.length === 0) {
                                let one = {
                                    inputId: this.inIds[i],
                                    inputValue: this.inNames[i],
                                    inType: 0
                                };
                                this.selectInput.push(one);
                            }
                        }
                        let indicators = this.updInput.inputIndic.split(",");
                        let inputs = this.selectInput.filter(item => {
                            return indicators.indexOf(item.inputId) > -1
                        });
                        this.$set(this.updInput, "inputs", inputs);
                    } else {
                        this.$message.error(res.data.message);
                    }
                }).catch(e => {
                    this.$message.error(e.message);
                });
            },
            changeInput(val) {
                this.$forceUpdate();
                this.inputOutIds = [];
                this.inputOutNames = [];
                this.inIds = [];
                this.inNames = [];
                this.inputCodes = [];
                val.forEach(element => {
                    this.inIds.push(element.inputId);
                    this.inNames.push(element.inputValue);
                    this.inputCodes.push(element.inputValue.split("<:-:>")[0]);
                });
                this.inputCodes = this.inputCodes.sort(function(a,b){return b.length-a.length});
            },
            changeOut(val) {
                this.updInput.outIndicName = val.outValue;
                this.updInput.outIndic = val.outId;
            },
        }
    };
</script>

<style scoped>
    .el-select-dropdown {
        max-width: 256px;
        overflow-x: auto;
    }

    .el-select-dropdown__item {
        /* display: inline-block; */
        max-width: 256px;

    }

    .el-select-dropdown__item span {
        min-width: 205px;
        display: inline-block;
    }
</style>
