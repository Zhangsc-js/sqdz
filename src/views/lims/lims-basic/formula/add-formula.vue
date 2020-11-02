<template>
    <div class="arrange-cont">
        <el-form
            :model="addInput"
            ref="addInput"
            :rules="addRules"
            class="formula-form"
            label-width="100px"
        >
            <el-col :span="18">
                <el-form-item label="输出指标" prop="outs">
                    <el-select
                        v-model="addInput.outs"
                        filterable
                        value-key="outId"
                        @change="changeOut"
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="item in selectIndicator"
                            :key="item.outId"
                            :label="item.outValue"
                            :value="item"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="18">
                <el-form-item label="输入指标" prop="inputs" class="sel-input">
                    <el-select
                        v-model="addInput.inputs"
                        value-key="inputId"
                        @change="changeInput"
                        multiple
                        collapse-tags
                        filterable
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="item in selectInput"
                            :key="item.inputId"
                            :label="item.inputValue"
                            :value="item"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="18">
                <el-form-item label="公式" prop="theFormula">
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 1, maxRows: 3}"
                        maxlength="123"
                        v-model="addInput.theFormula"/>
                </el-form-item>
            </el-col>
            <el-col :span="18">
                <el-form-item label="公式类型" prop="formulaStatus">
                    <el-select v-model="addInput.formulaStatus" placeholder="请选择公式状态" width="100%">
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
                        v-model="addInput.remark"
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
        addFormula,
        outExistFormula,
        getOutList,
        getInputList,
        validBraces
    } from "@/api/lims";

    export default {
        name: "add",
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
                let outCode = this.addInput.outIndicName.split("<:-:>")[0];
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
                let outId = this.addInput.outIndic;
                outExistFormula(outId).then(res => {
                    if (res.data.data != null) {
                        callback(new Error("该指标已有对应公式，请重新对应"));
                    } else {
                        callback();
                    }
                });
            };
            return {
                addInput: {
                    inputs: [],
                    outs: "",
                    inputIndic: "",
                    inputIndicName: "",
                    outIndic: "",
                    outIndicName: "",
                    theFormula: "",
                    formulaStatus: "有效",
                    remark: ""
                },
                inputCodes: [],
                inputOutIds: [],
                inputOutNames: [],
                inIds: [],
                inNames: [],
                selectInput: [],
                selectIndicator: [],
                addRules: {
                    inputs: [
                        {required: true, message: "请输入输入指标", trigger: ["blur", "change"]}
                    ],
                    outs: [
                        {required: true, message: "请输入输出指标", trigger: ["blur", "change"]},
                        {validator: ifExist, trigger: "change"}
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
        mounted() {
            this.getInput();
            this.getOut();
        },
        methods: {
            save() {
                this.$refs["addInput"].validate(valid => {
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
                        let item = {
                            outIndic: this.addInput.outIndic,
                            outIndicName: this.addInput.outIndicName,
                            inputIndic: this.inIds.join(','),
                            inputIndicName: this.inNames.join('@,,,@'),
                            theFormula: this.addInput.theFormula,
                            formulaStatus: this.addInput.formulaStatus,
                            remark: this.addInput.remark
                        };
                        this.addInput = {...item};
                        addFormula(this.addInput)
                            .then(response => {
                                const result = response.data;
                                if (result.success) {
                                    this.$message({
                                        type: "success",
                                        message: "新增成功"
                                    });
                                    this.$refs["addInput"].resetFields();
                                } else {
                                    this.$message({
                                        type: "error",
                                        message: result.message
                                    });
                                }
                            })
                            .catch(e => {
                                this.$message({
                                    type: "error",
                                    message: e.message
                                });
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
            changeInput(val) {
                this.inputCodes = [];
                this.inputOutIds = [];
                this.inputOutNames = [];
                this.inIds = [];
                this.inNames = [];
                val.forEach(element => {
                    this.inIds.push(element.inputId);
                    this.inNames.push(element.inputValue);
                    this.inputCodes.push(element.inputValue.split("<:-:>")[0]);
                });
                this.inputCodes = this.inputCodes.sort(function(a,b){return b.length-a.length});
            },
            changeOut(val) {
                this.addInput.outIndicName = val.outValue;
                this.addInput.outIndic = val.outId;
            },
            getOut() {
                getOutList()
                    .then(res => {
                        this.selectIndicator = res.data.data;
                    })
                    .catch(e => {
                        this.$message.error(e.message);
                    });
            },
            getInput() {
                getInputList({type: "0"})
                    .then(res => {
                        this.selectInput = res.data.data;
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
    .el-select-dropdown {
        max-width: 243px;
        overflow-x: auto;
    }

    .el-select-dropdown__item {
        /* display: inline-block; */
        max-width: 243px;

    }

    .el-select-dropdown__item span {
        min-width: 205px;
        display: inline-block;
    }
</style>
