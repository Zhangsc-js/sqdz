<template>
    <el-container style=" width:calc(100% + 5px); margin:-5px; padding-top:24px;" class="simulation_curve">
        <div class="tableshadow margin20 mr15" style="width: 100%;">
            <div>
                <el-form :model="inputForm" ref="inputForm" label-width="125px" :rules="validRules"
                         class="margin20 mb0">
                    <el-row>
                        <el-col :span="5">
                            <el-form-item label="拟合曲线图名称" prop="nameImg">
                                <el-input
                                    v-model="inputForm.nameImg"
                                    maxlength="20"
                                    plain="true"
                                    placeholder="请输入曲线图名称"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="因变量（y）名称/单位" prop="nameY" label-width="170px">
                                <el-input
                                    v-model="inputForm.nameY"
                                    maxlength="20"
                                    plain="true"
                                    placeholder="请输入名称/单位（y）"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="自变量（x）名称/单位" prop="nameX" label-width="170px">
                                <el-input
                                    v-model="inputForm.nameX"
                                    maxlength="20"
                                    plain="true"
                                    placeholder="请输入名称/单位（x）"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5">
                            <el-form-item label="x取值范围左值" prop="xMin">
                                <el-input
                                    v-model="inputForm.xMin"
                                    maxlength="20"
                                    plain="true"
                                    placeholder="请输入曲线x左值"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="x取值范围右值" prop="xMax">
                                <el-input
                                    v-model="inputForm.xMax"
                                    :maxlength="20"
                                    plain="true"
                                    placeholder="请输入曲线x右值"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="x取值范围间隔" prop="xInterval">
                                <el-input
                                    v-model="inputForm.xInterval"
                                    :maxlength="20"
                                    plain="true"
                                    placeholder="请输入x取值间隔"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="多项式拟合阶数" prop="order">
                                <el-input
                                    v-model="inputForm.order"
                                    :maxlength="20"
                                    plain="true"
                                    placeholder="请输入拟合阶数"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-col :span="10" class="pt12" style="margin-left: 20px">
                        <el-button icon="el-icon-plus" href="javascript:void(0)" type="primary" class="btn-b"
                                   @click="addData">新增(x,y)
                        </el-button>
                        <el-button href="javascript:void(0)" class="btn-w" @click="clearSearchBox">清空</el-button>
                        <span style="color:red;font-size:15px">（提示：数据点数不小于3以拟合）</span>
                    </el-col>
                    <el-col>
                    </el-col>
                </el-form>
            </div>
            <!-- <div class="padding20 add01 pb10">
                 <el-col :span="6" class="pt12" style="margin-left: 20px">
                     <el-button type="primary" @click="addInput()" icon="el-icon-plus">新增</el-button>
                 </el-col>
             </div>-->
            <div id="left">
                <el-table :data="dataXY" style="width: 100%">
                    <!--<el-table-column fixed type="selection" width="55"></el-table-column>-->
                    <el-table-column label="#" width="55" align="center">
                        <template slot-scope="{row,$index}">
                            <span>{{$index + 1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="dataX" align="center" label="数据x值" width="150">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.dataX" placeholder="请输入x" v-if="scope.row.edit"></el-input>
                            <span v-else>{{ scope.row.dataX }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="dataY" align="center" label="x对应y值" width="150">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.dataY" placeholder="请输入y" v-if="scope.row.edit"></el-input>
                            <span v-else>{{ scope.row.dataY }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="180">
                        <template slot-scope="scope">
                            <span v-if="scope.row.edit">
                              <el-button @click="editData(scope.row)" type="text" size="small">保存</el-button>
                              <el-button @click="preEdit(scope.row)" type="text" size="small">取消</el-button>
                             </span>
                            <span v-else>
                                <el-button @click="updData(scope.row)" type="text"
                                           seditDataize="small">更改</el-button>
                                <el-button @click="delData(scope.row)" type="text" size="small">删除</el-button>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button href="javascript:void(0)" class="btn-w" @click="curveImg"
                           style="float:right;margin-right: 20px;margin-top: 10px">拟合
                </el-button>
            </div>
            <div id="right">
                <el-card class="img-card" id="imgFit" style="width: 100%;height: 500px;">

                </el-card>
                <el-row>
                    <el-col :span="6">
                        <el-input
                            v-model="inputX"
                            plain="true"
                            placeholder="请输入x"
                            style="margin-top: 10px;margin-bottom: 10px"
                        />
                    </el-col>
                    <el-col :span="6">
                        <el-input
                            v-model="getY"
                            :disabled="true"
                            style="margin-top: 10px;margin-bottom: 10px;margin-left: 15px"
                        />
                    </el-col>
                    <el-button href="javascript:void(0)" class="btn-w" @click="calculateY"
                               style="margin-left: 30px;margin-top: 10px;margin-bottom: 10px">计算y值
                    </el-button>
                    <el-button href="javascript:void(0)" class="btn-w" @click="saveCurve" v-has="'LIMS-CURVE-SAVE'"
                               style="margin-left: 15px;margin-top: 10px;margin-bottom: 10px">保存曲线方程
                    </el-button>
                </el-row>
            </div>
            <el-dialog title="保存曲线方程" :visible.sync="dialogVisible" width="40%" v-if="dialogVisible">
                <save-curve @hidenDialog="hidenDialog" :postObject="openObject"/>
            </el-dialog>
        </div>
    </el-container>
</template>

<script>
    import {validNumber, validPos, validPosInt, getCurve} from '@/api/lims';
    import echarts from "echarts";
    import SaveCurve from "./save-curve";
    import { hasBtn } from "@/utils/index";
    export default {
        name: 'curve',
        components: {SaveCurve},
        data() {
            let validUpLow=(rule,value,callback)=> {
                if (parseFloat(this.inputForm.xMin)>=parseFloat(this.inputForm.xMax)) {
                    callback(new Error('区间范围右值应大于左值'))
                } else {
                    callback()
                }
            };
            return {
                inputForm: {
                    xMax: "",
                    xMin: "",
                    xInterval: "",
                    order: "",
                    nameImg: "",
                    nameX: "",
                    nameY: ""
                },
                dialogVisible: false,
                dataXY: [],
                resultItem: {},
                addRow: false,
                editRow: false,
                validRules: {
                    xMax: [
                        {required: true, message: '不能为空', trigger: 'blur'},
                        {validator: validNumber, trigger: 'blur'},
                        {validator: validUpLow, trigger: 'blur'}
                    ],
                    xMin: [
                        {required: true, message: '不能为空', trigger: 'blur'},
                        {validator: validNumber, trigger: 'blur'},
                        {validator: validUpLow, trigger: 'blur'}
                    ],
                    xInterval: [
                        {required: true, message: '不能为空', trigger: 'blur'},
                        {validator: validPos, trigger: 'blur'}
                    ],
                    order: [
                        {required: true, message: '不能为空', trigger: 'blur'},
                        {validator: validPosInt, trigger: 'blur'}
                    ],
                },
                myChat: "",
                inputX: "",
                getY: "",
                xData1: [],
                xData2: [],
                yData1: [],
                yData2: [],
                equation: "",
                correlation: "",
                openObject: {}
            }
        },
        methods: {
            hasBtn,
            updData(item) {
                if (
                    this.editRow || this.addRow
                ) {
                    this.$message.error("有未保存的信息，请保存");
                    return false;
                }
                item.edit = this.$set(item, "edit", !item.edit);
                this.editRow = true;
            },
            addData() {
                if (
                    this.addRow || this.editRow
                ) {
                    this.$message.error("有未保存的信息，请保存");
                    return false;
                }
                this.dataXY.unshift({dataX: null, dataY: null, edit: true});
                this.addRow = true;
            },
            preEdit(item) {
                item.edit = this.$set(item, "edit", !item.edit);
                this.editRow = false;
                if (this.addRow) {
                    let index = this.dataXY.indexOf(item);
                    this.dataXY.splice(index, 1);
                    this.addRow = false;
                }
            },
            validData(num) {
                let regNum = /^(0|-?[1-9]\d*)\b/;
                let reg = /^(0*[1-9]\d*)\b/;
                if (num.indexOf(".") === -1) {
                    if (!regNum.test(num)) {
                        return false
                    }
                } else {
                    if (num.split(".").length != 2 || !regNum.test(num.split(".")[0]) || !reg.test(num.split(".")[1])) {
                        return false
                    }
                }
                return true
            },
            editData(item) {
                if (item.dataX === null || item.dataY === null || item.dataX.trim() === "" || item.dataY.trim() === "") {
                    this.$message.error("不能为空");
                    return false;
                } else if (!this.validData(item.dataX) || !this.validData(item.dataY)) {
                    this.$message.error("不合格的数");
                    return false;
                } else {
                    item.edit = this.$set(item, "edit", !item.edit);
                    this.addRow = false;
                    this.editRow = false;
                }
            },
            delData(item) {
                let index = this.dataXY.indexOf(item);
                this.dataXY.splice(index, 1);
            },
            clearSearchBox() {
                this.inputForm = {}
            },
            calculateY() {
                if(this.equation.trim() === ""){
                    this.$message({
                        type: 'error',
                        message: '请先拟合再计算'
                    });
                    return false
                }else if(!this.validData(this.inputX)) {
                    this.$message({
                        type: 'error',
                        message: 'x为无效值'
                    });
                    return false
                } else{
                    let expression = this.equation.replace(/y=/g,'');
                    expression = expression.replace(/x/g,this.inputX);
                    this.getY = eval(expression);
                }
            },
            curveImg() {
                this.$refs['inputForm'].validate((valid)=> {
                    if (!valid || this.dataXY.length < 3 || this.addRow || this.editRow) {
                        this.$message({
                            type: 'error',
                            message: '请正确键入再提交'
                        })
                    } else {
                        this.xData1 = [];
                        this.yData1 = [];
                        this.xData2 = [];
                        this.yData2 = [];
                        this.equation = "";
                        let sectionX = this.inputForm.xMin + ',' + this.inputForm.xMax + ',' + this.inputForm.xInterval;
                        const params = {
                            nameImg: this.inputForm.nameImg,
                            nameX: this.inputForm.nameX,
                            nameY: this.inputForm.nameY,
                            dataXY: this.dataXY,
                            sectionX: sectionX,
                            order: this.inputForm.order
                        };
                        getCurve(params).then((res) => {
                            const result = res.data;
                            if (result.success) {
                                this.resultItem = result.data;
                                if (this.resultItem.resultXY != undefined) {
                                    this.resultItem.resultXY.forEach(element => {
                                        this.xData2.push(element.x);
                                        this.yData2.push(element.y);
                                    });
                                }
                                if(this.resultItem.originXY != undefined){
                                    this.resultItem.originXY.forEach(element => {
                                        this.xData1.push(element.x);
                                        this.yData1.push(element.y);
                                    });
                                }
                                if(this.resultItem.equation != undefined){
                                    this.equation = this.resultItem.equation
                                }
                                if(this.resultItem.correlation != undefined){
                                    this.correlation = this.resultItem.correlation
                                }
                                this.drawImg();
                            } else {
                                this.$message.error(result.message)
                            }
                        }).catch(e => {
                            this.$message.error(e.message)
                        });
                        console.log(params);
                        console.log(this.resultItem);
                    }
                })
            },
            saveCurve(){
                if(this.equation.trim() === ""){
                    this.$message({
                        type: 'error',
                        message: '请先拟合再保存曲线方程'
                    });
                    return false
                }else {
                    this.dialogVisible = true;
                    this.openObject = {
                        equation: this.equation,
                        nameX: this.inputForm.nameX,
                        nameY: this.inputForm.nameY
                    }
                }
            },
            hidenDialog() {
                this.dialogVisible = false;
            },
            drawImg() {
                this.$nextTick(function() {
                    this.myChat = echarts.init(document.getElementById("imgFit"));
                    // 绘制图表
                    let colors = ["#5793f3", "#d14a61", "#675bba"];

                    this.myChat.setOption({
                        title: {
                            text: this.inputForm.nameImg + '拟合曲线图',
                            subtext: '曲线方程:'+ this.equation + " 相关系数:" + this.correlation,
                            subtextStyle:{
                                color:'#d14a61',
                                //字体风格,'normal','italic','oblique'
                                fontStyle:'normal',
                                //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
                                fontWeight:'bold',
                                //字体系列
                                fontFamily:'sans-serif',
                                //字体大小
                                fontSize:13
                            },
                            left: 'center'
                        },
                        color: colors,
                        tooltip: {
                            trigger: "none",
                            axisPointer: {
                                type: "cross"
                            }
                        },
                        /*legend: {
                            data: ["原数据曲线", "拟合曲线"]
                        },*/
                        grid: {
                            top: 70,
                            bottom: 50
                        },
                        xAxis: [
                            /*{
                                type: "category",
                                axisTick: {
                                    alignWithLabel: true
                                },
                                axisLine: {
                                    onZero: false,
                                    lineStyle: {
                                        color: colors[1]
                                    }
                                },
                                axisPointer: {
                                    label: {
                                        formatter: function (params) {
                                            return (
                                                "原值" +
                                                params.value +
                                                (params.seriesData.length
                                                    ? "：" + params.seriesData[0].data
                                                    : "")
                                            );
                                        }
                                    }
                                },
                                data: this.xData1
                            },*/
                            {
                                type: "category",
                                name: this.inputForm.nameX,
                                axisTick: {
                                    alignWithLabel: true
                                },
                                axisPointer: {
                                    label: {
                                        formatter: function (params) {
                                            return (
                                                "拟合值" +
                                                params.value +
                                                (params.seriesData.length
                                                    ? "：" + params.seriesData[0].data
                                                    : "")
                                            );
                                        }
                                    }
                                },
                                data: this.xData2
                            }
                        ],
                        yAxis: [
                            {
                                name: this.inputForm.nameY,
                                type: "value"
                            }
                        ],
                        series: [
                           /* {
                                name: this.inputForm.nameY + "原值",
                                type: "line",
                                xAxisIndex: 1,
                                data: this.yData1
                            },*/
                            {
                                name: this.inputForm.nameY + "拟合值",
                                type: "line",
                                smooth: true,
                                data: this.yData2
                            }
                        ]
                    });
                })
                }
            }
    }
</script>

<style lang="css">
   .simulation_curve .el-tooltip__popper {
        max-width: 30%
    }

    #left {
        width: 45%;
        height: 100%;
        float: left;
    }

    #right {
        width: 55%;
        height: 100%;
        float: left;
    }
</style>
<style scoped>
    .el-form .el-col .el-button {
        margin: 0px 0px 0px 2px;
    }

    .padding20 .pt12 .el-button {
        margin: 0px 0px 12px 10px;
    }
</style>
