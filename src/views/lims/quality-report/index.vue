<template>
    <div style="height: 800px;width: 100%">
        <div id="first" style="height: 50%;width:100%;">
            <div id="left" style="float:left;height:100%;width:50%;">
                <div id="leftCondition" style="margin-top: 10px;margin-left: 10px;height: 8%">
                    <el-date-picker
                        v-model="leftDate"
                        type="month"
                        placeholder="选择月"
                    >
                    </el-date-picker>
                    <el-button icon="el-icon-search"
                               href="javascript:void(0)"
                               type="primary"
                               class="btn-b"
                               @click="changeLeft" style="margin-left: 8px">确认
                    </el-button>
                </div>
                <div id="imgLeft" style="margin-left:10px;margin-top:10px;height: 92%;width: 100%"></div>
            </div>
            <div id="right" style="float:left;height:100%;width:50%;">
                <div id="rightCondition" style="margin-top: 10px;margin-left: 10px;height: 8%">
                    <el-date-picker
                        v-model="rightDate"
                        type="month"
                        placeholder="选择月"
                    >
                    </el-date-picker>
                    <el-button icon="el-icon-search"
                               href="javascript:void(0)"
                               type="primary"
                               class="btn-b"
                               @click="changeRight" style="margin-left: 8px">确认
                    </el-button>
                </div>
                <div id="imgRight" style="margin-left:10px;margin-top:10px;height: 92%;width: 100%"></div>
            </div>
        </div>
        <div id="second" style="height: 50%;width:100%;margin-top: 30px">
            <div id="secondCondition" style="height:8%;margin-left: 10px;margin-top: 30px;width: 100%">
                <el-select v-model="typeValue" placeholder="请选择">
                    <el-option
                        v-for="item in typeSelection"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-date-picker
                    v-model="yearSelect"
                    type="year"
                    placeholder="选择年" :disabled="typeValue!=='forYear'"
                    style="margin-left: 8px">
                </el-date-picker>
                <el-date-picker
                    v-model="monthSelect"
                    type="month"
                    placeholder="选择月" :disabled="typeValue!=='forMonth'"
                    style="margin-left: 8px">
                </el-date-picker>
                <el-date-picker
                    v-model="daySelect"
                    type="date"
                    placeholder="选择日" :disabled="typeValue!=='forDay'"
                    style="margin-left: 8px">
                </el-date-picker>
                <el-button icon="el-icon-search"
                           href="javascript:void(0)"
                           type="primary"
                           class="btn-b"
                           @click="changeSecond" style="margin-left: 8px">确认
                </el-button>
            </div>
            <div id="specimen" style="margin-left:10px;margin-top:10px;height:92%;width:100%;"></div>
        </div>
        <!--<div id="second" style="height: 500px;width:100%;margin-top: 10px">
            <span class="demonstration" style="margin-left: 10px;">选择日期</span>
            <el-date-picker
                v-model="secondDate"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="margin-left: 10px;">
            </el-date-picker>
            <el-button @click="getSecondData" style="margin-left: 8px">确认
            </el-button>
            <el-table :data="tableData" v-loading="loading" style="width: 100%">
                <el-table-column label="#" width="55" align="center">
                    <template slot-scope="{row,$index}">
                        <span>{{$index + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="speciCode" align="center" label="样品编号" width="180"></el-table-column>
                <el-table-column prop="workshop" align="center" label="取样车间" width="180"></el-table-column>
                <el-table-column prop="sampPlace" align="center" label="取样地点" width="180"></el-table-column>
                <el-table-column prop="num" align="center" label="不合格化验项量" width="180"></el-table-column>
            </el-table>
            <Pagination
                :total="total"
                :page.sync="page.pageNum"
                :limit.sync="page.pageSize"
                @pagination="getSecondData"
            />
        </div>-->
    </div>
</template>

<script>
    import echarts from "echarts";
    import {simpleDateFormat} from "@/utils/index";
    import Pagination from "@/components/Pagination";
    import {
        getPassOrNoMonth,
        getNoRateTop,
        getNoPassSpecimen,
        getWorkshopSpecimen
    } from "@/api/lims";

    export default {
        name: 'qualityreport',
        components: {
            Pagination
        },
        data() {
            return {
                leftPass: [],
                leftNoPass: [],
                leftX: [],
                leftChat: "",
                leftDate: new Date(),
                leftDraw: true,
                leftChange: false,
                rightDate: new Date(),
                rightDraw: true,
                rightChat: "",
                rightPlant: [],
                rightTotal: [],
                rightNoPass: [],
                rightRate: [],
                tableData: [],
                loading: false,
                secondDate: "",
                page: {
                    pageNum: 1,
                    pageSize: 10
                },
                total: 0,
                typeSelection: [
                    {
                        label: "总统计",
                        value: "forTotal"
                    },
                    {
                        label: "按年统计",
                        value: "forYear"
                    },
                    {
                        label: "按月统计",
                        value: "forMonth"
                    },
                    {
                        label: "按日统计",
                        value: "forDay"
                    },
                ],
                typeValue: "forTotal",
                yearSelect: "",
                monthSelect: "",
                daySelect: "",
                plantPlace: [],
                num: [],
                secondChat: ""
            }
        },
        mounted() {
            this.getLeftData();
            this.getRightData();
            this.getSecondData();
        },
        methods: {
            changeLeft() {
                this.leftDraw = false;
                this.getLeftData();
            },
            changeRight() {
                this.rightDraw = false;
                this.getRightData();
            },
            changeSecond() {
                this.getSecondData();
            },
            getLeftData() {
                this.leftX = [];
                this.leftPass = [];
                this.leftNoPass = [];
                let timeMonth = this.leftDate != "" ? simpleDateFormat(this.leftDate, 'yyyy-MM-dd HH:mm:ss') : "";
                let param = {toDate: timeMonth};
                getPassOrNoMonth(param).then(response => {
                    const result = response.data;
                    if (result.success) {
                        result.data.forEach(element => {
                            this.leftX.push(element.labDate.split("-")[1] + "-" + element.labDate.split("-")[2]);
                            this.leftPass.push(element.pass);
                            this.leftNoPass.push(element.noPass);
                        });
                        if (this.leftDraw) {
                            this.drawLeft();
                        } else {
                            this.leftChange = true;
                        }
                    } else {
                        this.$message.error(result.message);
                    }
                }).catch(e => {
                    this.$message.error(e.message);
                });
            },
            drawLeft() {
                let toIndex = 8;
                let xData = this.leftX.slice(0, toIndex);
                let noPass = this.leftNoPass.slice(0, toIndex);
                let pass = this.leftPass.slice(0, toIndex);
                this.leftChat = echarts.init(document.getElementById("imgLeft"));
                let option = {
                    title: {
                        text: '化验项合格/不合格月每日统计',
                        textStyle: {
                            fontSize: 15
                        },
                    },
                    color: ['#37B328', '#d14a61'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    legend: {
                        data: ['合格', '不合格']
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: xData
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '化验项数'
                        }
                    ],
                    series: [
                        {
                            name: '合格',
                            type: 'line',
                            stack: '总量',
                            areaStyle: {},
                            smooth: true,
                            data: pass
                        },
                        {
                            name: '不合格',
                            type: 'line',
                            stack: '总量',
                            areaStyle: {},
                            smooth: true,
                            data: noPass
                        }
                    ]
                };
                setInterval(() => {
                    if (this.leftChange) {
                        toIndex = 8;
                        xData = this.leftX.slice(0, toIndex);
                        pass = this.leftNoPass.slice(0, toIndex);
                        noPass = this.leftPass.slice(0, toIndex);
                        this.leftChange = false;
                    } else if (toIndex === this.leftX.length) {
                        toIndex = 8;
                        xData = this.leftX.slice(0, toIndex);
                        pass = this.leftNoPass.slice(0, toIndex);
                        noPass = this.leftPass.slice(0, toIndex);
                    } else {
                        xData.shift();
                        pass.shift();
                        noPass.shift();
                        xData.push(this.leftX[toIndex]);
                        pass.push(this.leftPass[toIndex]);
                        noPass.push(this.leftNoPass[toIndex]);
                        toIndex++;
                    }
                    this.leftChat.setOption({
                        xAxis: {
                            type: "category",
                            data: xData
                        },
                        series: [
                            {
                                name: "不合格",
                                data: noPass
                            },
                            {
                                name: "合格",
                                data: pass
                            }
                        ]
                    });
                }, 3000);
                if (option && typeof option === "object") {
                    this.leftChat.setOption(option, true);
                }
            },
            getRightData() {
                this.rightPlant = [];
                this.rightTotal = [];
                this.rightNoPass = [];
                this.rightRate = [];
                let timeMonth = this.rightDate != "" ? simpleDateFormat(this.rightDate, 'yyyy-MM-dd HH:mm:ss') : "";
                let param = {toDate: timeMonth};
                getNoRateTop(param).then(response => {
                    const result = response.data;
                    if (result.success) {
                        result.data.forEach(element => {
                            this.rightPlant.push(element.workshop);
                            this.rightTotal.push(element.total);
                            this.rightNoPass.push(element.noPass);
                            this.rightRate.push(element.percent);
                        });
                        this.drawRight();
                    } else {
                        this.$message.error(result.message);
                    }
                }).catch(e => {
                    this.$message.error(e.message);
                });
            },
            drawRight() {
                this.rightChat = echarts.init(document.getElementById("imgRight"));
                let option = {
                    title: {
                        text: '车间化验项不合格Top统计',
                        textStyle: {
                            fontSize: 15
                        },
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data: ['不合格', '总量', '不合格率']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value',
                        boundaryGap: [0, 0.01]
                    },
                    yAxis: {
                        type: 'category',
                        data: this.rightPlant,
                        name: '车间'
                    },
                    series: [
                        {
                            name: '不合格',
                            type: 'bar',
                            data: this.rightNoPass
                        },
                        {
                            name: '总量',
                            type: 'bar',
                            data: this.rightTotal
                        },
                        {
                            name: '不合格率',
                            type: 'bar',
                            data: this.rightRate
                        },
                    ]
                };
                if (option && typeof option === "object") {
                    this.rightChat.setOption(option, true);
                }
            },
            /*getSecondData() {
                let startTime = this.secondDate[0] != undefined ? simpleDateFormat(this.secondDate[0], "yyyy-MM-dd") : "";
                let endTime = this.secondDate[1] != undefined ? simpleDateFormat(this.secondDate[1], "yyyy-MM-dd") : "";
                let param = {startDate: startTime, endDate: endTime};
                getNoPassSpecimen(this.page, param).then(response => {
                    this.tableData = response.data.data.rows;
                    this.total = response.data.data.total;
                }).catch(e => {
                    this.$message.error(e.message);
                });
            },*/
            getSecondData() {
                let timeValue = "";
                this.plantPlace = [];
                this.num = [];
                if (this.typeValue !== "forTotal") {
                    switch (this.typeValue) {
                        case "forYear":
                            timeValue = simpleDateFormat(this.yearSelect, 'yyyy');
                            break;
                        case "forMonth":
                            timeValue = simpleDateFormat(this.monthSelect, 'yyyy-MM');
                            break;
                        case "forDay":
                            timeValue = simpleDateFormat(this.daySelect, 'yyyy-MM-dd');
                    }
                }
                let param = {type: this.typeValue, toDate: timeValue != null ? timeValue : ""};
                getWorkshopSpecimen(param).then(response => {
                    const result = response.data;
                    if (result.success) {
                        result.data.forEach(element => {
                            this.plantPlace.push(element.workshop + "-" + element.sampPlace);
                            this.num.push(element.num);
                        });
                        this.drawIt();
                    } else {
                        this.$message.error(result.message);
                    }
                }).catch(e => {
                    this.$message.error(e.message);
                });
            },
            drawIt() {
                this.secondChat = echarts.init(document.getElementById("specimen"));
                let option = {
                    title: {
                        text: "车间取样点化验样品量统计",
                        textStyle: {
                            fontSize: 15
                        },
                    },
                    color: ['#3398DB'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: this.plantPlace,
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '数量'
                        }
                    ],
                    series: [
                        {
                            name: '化验样品量',
                            type: 'line',
                            //barWidth: '60%',
                            data: this.num
                        }
                    ]
                };
                if (option && typeof option === "object") {
                    this.secondChat.setOption(option, true);
                }
            }
        }
    }
</script>

<style scoped>

</style>
