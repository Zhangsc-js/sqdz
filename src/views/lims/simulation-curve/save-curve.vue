<template>
    <div>
        <el-form :model="postItem" ref="postItem" :rules="itemRules" label-width="150px">
            <el-col :span="18">
                <el-form-item label="输入(x)编号--名称" prop="inputParam">
                    <el-select
                        v-model="postItem.inputParam"
                        filterable
                        allow-create
                        default-first-option
                        @change="changeInput"
                        placeholder="请选择">
                        <el-option
                            v-for="item in selectInput"
                            :key="item.inputId"
                            :label="item.inputValue"
                            :value="item.inputId+','+item.inputValue">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="输出(y)编号--名称" prop="outParam">
                    <el-input v-model="postItem.outParam" @change="changeOut"/>
                </el-form-item>
            </el-col>
            <el-col :span="18">
                <el-form-item label="输入(x)计量单位" prop="inputUnit">
                    <el-select
                               v-model="postItem.inputUnit"
                               filterable
                               allow-create
                               default-first-option
                               @change="selectUnitChange" placeholder="请选择计量单位">
                        <el-option v-for="item in unitType" :key="item.id" :label="item.name" :value="item.name"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="18">
                <el-form-item label="输出(y)计量单位" prop="outUnit">
                    <el-select
                        v-model="postItem.outUnit"
                        filterable
                        allow-create
                        default-first-option
                        @change="selectUnitChange" placeholder="请选择计量单位">
                        <el-option v-for="item in unitType" :key="item.id" :label="item.name" :value="item.name"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="18">
                <el-form-item label="(y)保留小数点位数" prop="decimalDigits">
                    <el-input v-model="postItem.decimalDigits"/>
                </el-form-item>
            </el-col>
            <el-col :span="18">
                <el-form-item label="限值类型" prop="type">
                    <el-select v-model="postItem.type" placeholder="请选择">
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
                    <div v-if="postItem.type === 1" style="margin-top:8px;">
                        <el-input
                            placeholder="请输入标准值"
                            v-model="postItem.lowerLimit"
                        >
                            <template slot="prepend">{{"≥"}}</template>
                        </el-input>
                    </div>
                    <div v-else-if="postItem.type === 2" style="margin-top:8px;">
                        <el-input
                            placeholder="请输入标准值"
                            v-model="postItem.upperLimit"
                        >
                            <template slot="prepend">{{"≤"}}</template>
                        </el-input>
                    </div>
                    <div v-else-if="postItem.type === 3" class="input-group">
                        <el-input
                            class="input-left"
                            placeholder="请输入标准下限"
                            v-model="postItem.lowerLimit"
                        >
                            <template slot="append">~</template>
                        </el-input>
                        <el-input
                            class="input-right"
                            placeholder="请输入标准上限"
                            v-model="postItem.upperLimit"
                        ></el-input>
                    </div>
                    <div v-else-if="postItem.type === 4" class="input-group">
                        <el-input
                            class="input-left"
                            placeholder="请输入标准下下限"
                            v-model="postItem.llowerLimit"
                        >
                            <template slot="append">≤</template>
                        </el-input>
                        <el-input
                            class="input-left"
                            placeholder="请输入标准下限"
                            v-model="postItem.lowerLimit"
                        >
                            <template slot="append">~</template>
                        </el-input>
                        <el-input
                            class="input-right"
                            placeholder="请输入标准上限"
                            v-model="postItem.upperLimit"
                        >
                            <template slot="append">≤</template>
                        </el-input>
                        <el-input
                            class="input-right"
                            placeholder="请输入标准上上限"
                            v-model="postItem.uupperLimit"
                        ></el-input>
                    </div>
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
    import { getInIndicator, addReturnOut, addReturnInput, getMeasureUnit, getInputList, addFormula } from '@/api/lims';
    import {simpleDateFormat } from "@/utils/index";
    export default {
        name: 'saveCurve',
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
            return {
                postItem: {
                    inputParam: '',//输入参数编号--名称(x)
                    outParam: '',//输出参数编号--名称(y)
                    outUnit: '',//计量单位
                    inputUnit: '',//计量单位
                    decimalDigits: 4,
                    theFormula: '',//公式
                    uupperLimit: '',//指标上上限
                    upperLimit: '',//指标上限
                    lowerLimit: '',//指标下限
                    llowerLimit: '',//指标下下限
                    type: 1
                },
                checkList:[],
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
                addFormula: {
                    inputIndic: "",
                    inputIndicName: "",
                    outIndic: "",
                    outIndicName: "",
                    theFormula: "",
                    formulaStatus: "有效",
                    remark: "曲线公式"
                },
                llower: false,
                lower: false,
                upper: false,
                uupper: false,
                updInput: {},
                addInput: false,
                inputId: "",
                outId: "",
                unitType: [],
                selectInput: [],
                selectIndicator: [],
                itemRules: {
                    inputParam: [
                        {required: true, message: '不能为空', trigger: 'blur'}
                    ],
                    outParam: [
                        {required: true, message: '不能为空', trigger: 'blur'}
                    ],
                    inputUnit: [
                        {required: true, message: '请选择计量单位',trigger: 'blur'},
                    ],
                    outUnit: [
                        {required: true, message: '请选择计量单位',trigger: 'blur'},
                    ],
                    decimalDigits: [
                        {required: true, message: '请输入小数点位数', trigger: 'blur'},
                        {validator: validDigits, trigger: 'blur'}
                    ]
                }
            }
        },
        props: {
            postObject: {
                type: Object,
                required: true
            }
        },
        mounted() {
            this.getData();
            this.getInput();
            this.getUnitList();
        },
        watch: {
            postObject() {
                this.getData();
            }
        },
        methods: {
            getData() {
                this.postItem.theFormula = this.postObject.equation;
            },
            validNumber(num) {
                let regNum = /^(0|-?[1-9]\d*)\b/;
                /*let reg = /^(0*[1-9]\d*)\b/;*/
                let reg = /^([0-9]\d*)\b/;
                if (num.indexOf(".") === -1) {
                    if (!regNum.test(num)) {
                        return false
                    }
                } else {
                    if (num.split(".").length !== 2 || !regNum.test(num.split(".")[0]) || !reg.test(num.split(".")[1])) {
                        return false
                    }
                }
                return true
            },
            save() {
                this.$refs['postItem'].validate((valid)=> {
                    if (!valid) {
                        this.$message({
                            type: 'error',
                            message: '请正确键入再提交'
                        });
                        return false;
                    }else{
                        switch (this.postItem.type) {
                            case 1:
                                if (!this.validNumber(this.postItem.lowerLimit)) {
                                    this.$message.error('限值为无效的数');
                                    return false;
                                }
                                this.postItem.uupperLimit = "--";
                                this.postItem.upperLimit = "--";
                                this.postItem.llowerLimit = "--";
                                break;
                            case 2:
                                if (!this.validNumber(this.postItem.upperLimit)) {
                                    this.$message.error('限值为无效的数');
                                    return false;
                                }
                                this.postItem.uupperLimit = "--";
                                this.postItem.lowerLimit = "--";
                                this.postItem.llowerLimit = "--";
                                break;
                            case 3:
                                if (!this.validNumber(this.postItem.upperLimit) || !this.validNumber(this.postItem.lowerLimit)) {
                                    this.$message.error('限值为无效的数');
                                    return false;
                                }
                                if (this.postItem.upperLimit * 1 < this.postItem.lowerLimit * 1) {
                                    this.$message.error('限值大小不合要求');
                                    return false;
                                }
                                this.postItem.uupperLimit = "--";
                                this.postItem.llowerLimit = "--";
                                break;
                            case 4:
                                if (!this.validNumber(this.postItem.upperLimit) || !this.validNumber(this.postItem.lowerLimit)
                                    || !this.validNumber(this.postItem.uupperLimit) || !this.validNumber(this.postItem.llowerLimit)) {
                                    this.$message.error('限值为无效的数');
                                    return false;
                                }
                                if (this.postItem.upperLimit * 1 < this.postItem.lowerLimit * 1 || this.postItem.uupperLimit * 1 < this.postItem.lowerLimit * 1 ||
                                    this.postItem.upperLimit * 1 < this.postItem.llowerLimit * 1 || this.postItem.uupperLimit * 1 < this.postItem.llowerLimit * 1 ||
                                    this.postItem.uupperLimit * 1 < this.postItem.upperLimit * 1 || this.postItem.lowerLimit * 1 < this.postItem.llowerLimit * 1) {
                                    this.$message.error('限值大小不合要求');
                                    return false;
                                }
                                break;
                        }
                    }//验证指标界限结束
                    let saveTime = simpleDateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss');
                    let saveOperator = this.$store.getters.workCode+"--"+this.$store.getters.userName;
                    if(this.addInput){//添加新的输入参数开始
                        let addInParam = {
                            inputName: this.postItem.inputParam.split("--")[1],
                            inputCode: this.postItem.inputParam.split("--")[0],
                            inputInitial: 0.0,
                            inputUnit: this.postItem.inputUnit,
                            inputStatus: "有效",
                            inputOptime: saveTime,
                            inputOperator: saveOperator
                        };
                        addReturnInput(addInParam).then(response => {
                            const result = response.data;
                            if (result.success) {
                                this.addFormula.inputIndic = result.data.inputId;
                                this.addFormula.inputIndicName = result.data.inputCode + "--" + result.data.inputName
                            } else {
                                this.$message.error(result.message)
                            }
                        }).catch(e => {
                            this.$message.error(e.message)
                        })//添加新的输入参数结束
                    }else{//选择已有的输入参数
                        this.addFormula.inputIndic = this.postItem.inputParam.split(",")[0];
                        this.addFormula.inputIndicName = this.postItem.inputParam.split(",")[1];
                    }
                    let postItemParam = {//添加新的输出参数开始
                        outName: this.postItem.outParam.split("--")[1],
                        outCode: this.postItem.outParam.split("--")[0],
                        type: this.postItem.type,
                        uupperLimit: this.postItem.uupperLimit,//指标上上限
                        upperLimit: this.postItem.upperLimit,//指标上限
                        lowerLimit: this.postItem.lowerLimit,//指标下限
                        llowerLimit: this.postItem.llowerLimit,//指标下下限
                        decimalDigits: this.postItem.decimalDigits,//计算值保留小数点位数
                        outUnit: this.postItem.outUnit,//计量单位
                        outStatus: '有效',//可使用状态
                        outOptime: saveTime,
                        outOperator: saveOperator
                    };
                    setTimeout(()=>{
                        addReturnOut(postItemParam).then(response => {
                            const result = response.data;
                            if (result.success) {
                                this.addFormula.outIndic = result.data.outId;
                                this.addFormula.outIndicName = result.data.outCode + "--" + result.data.outName;
                                let inputCode = this.addFormula.inputIndicName.split("--")[0];
                                this.addFormula.theFormula = this.postObject.equation.replace(/x/g,inputCode);
                                this.addFormula.theFormula = this.addFormula.theFormula.replace(/y/g,result.data.outCode);
                                let formulaParams = {
                                    createOn: saveTime,
                                    updateOn: saveTime,
                                    createBy: saveOperator,
                                    updateBy: saveOperator
                                };
                                addFormula({...this.addFormula,...formulaParams}).then(response => {//添加新的公式开始
                                    const formula = response.data;
                                    if (formula.success) {
                                        this.$message({
                                            type: "success",
                                            message: "新增成功"
                                        });
                                    } else {
                                        this.$message.error(formula.message);//添加新的公式结束
                                    }
                                }).catch(e => {
                                    this.$message.error(e.message);
                                })
                            } else {
                                this.$message.error(result.message);//添加新的输出参数结束
                            }
                        }).catch(e => {
                            this.$message.error(e.message);
                        }).finally(() => {
                            this.$emit("hidenDialog")
                        })
                    },1000);
                });
            },
            cancel() {
                this.$emit("hidenDialog")
            },
            selectUnitChange(val) {

            },
            changeInput(val) {
                console.log(val);
                if(val.indexOf(",") !== -1) {
                    getInIndicator(val.split(",")[0]).then(response => {
                        const result = response.data;
                        if (result.success) {
                            this.updInput ={};
                            this.updInput = Object.assign({}, result.data);
                            this.postItem.inputUnit = result.data.inputUnit;
                            this.addInput = false
                        } else {
                            this.$message.error(result.message)
                        }
                    }).catch(e => {
                        this.$message.error(e.message)
                    });
                }else {
                    let reg = /[0-9]+[a-zA-Z]+[0-9a-zA-Z]*|[a-zA-Z]+[0-9]+[0-9a-zA-Z]*/;
                    if(val.indexOf("--") === -1){
                        this.$message.error('请以编号--名称形式录入');
                        this.postItem.inputUnit = "";
                        this.postItem.inputParam = "";
                        return false
                    }else if(!reg.test(val.split("--")[0]) || val.split("--")[1].trim() === ""){
                        this.$message.error('编号须是数字和字母组合,名称不能为空');
                        this.postItem.inputUnit = "";
                        this.postItem.inputParam = "";
                        return false
                    }else{
                        this.addInput = true;
                    }
                }
            },
            changeOut(val) {
                console.log(val);
                let reg = /[0-9]+[a-zA-Z]+[0-9a-zA-Z]*|[a-zA-Z]+[0-9]+[0-9a-zA-Z]*/;
                if(val.indexOf("--") === -1){
                    this.$message.error('请以编号--名称形式录入');
                    this.postItem.outParam = "";
                    return false
                }else if(!reg.test(val.split("--")[0]) || val.split("--")[1].trim() === ""){
                    this.$message.error('编号须是数字和字母组合,名称不能为空');
                    this.postItem.outParam = "";
                    return false
                }else{
                    return true
                }
            },
            getInput() {
                getInputList({type: "1"})
                    .then(res => {
                        this.selectInput = res.data.data;
                    })
                    .catch(e => {
                        this.$message.error(e.message);
                    });
            },
            getUnitList(){
              getMeasureUnit().then(res =>{
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
