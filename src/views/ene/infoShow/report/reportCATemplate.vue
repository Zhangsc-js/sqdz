<template>
    <!--    对比分析-->
    <el-container :key="appKey">
        <el-main>
            <el-row>
                <el-col :span="22">
                    <span class="title">请选择分析时间：</span>
                    <el-date-picker v-model="date" :type="dateType" :value-format="model" placeholder="选择年"></el-date-picker>
                    <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                </el-col>
                <el-col :span="2">
                    <el-button icon="el-icon-back" type="primary" @click="goBack()"></el-button>
                </el-col>
            </el-row>
            <el-row>
                <h2 style="text-align: center">{{oneName}}</h2>
            </el-row>
        </el-main>
        <el-footer>
            <div :id="chartName" style="width:100%;height:500px"></div>
        </el-footer>
    </el-container>
</template>
<script>
    import echarts from "echarts";
    import { getByHourInfoInProcCode } from "@/api/energy";

    export default {
        name: "reportCATemplate",
        data() {
            return {
                appKey: "",
                yearData: [],
                monthData: [],
                dayData: [], //选项的天数
                dataTime: [
                    "00:00",
                    "01:00",
                    "02:00",
                    "03:00",
                    "04:00",
                    "05:00",
                    "06:00",
                    "07:00",
                    "08:00",
                    "09:00",
                    "10:00",
                    "11:00",
                    "12:00",
                    "13:00",
                    "14:00",
                    "15:00",
                    "16:00",
                    "17:00",
                    "18:00",
                    "19:00",
                    "20:00",
                    "21:00",
                    "22:00",
                    "23:00"
                ],
                dayTime: [], //x轴天的时间
                monthTime: [
                    "一月",
                    "二月",
                    "三月",
                    "四月",
                    "五月",
                    "六月",
                    "七月",
                    "八月",
                    "九月",
                    "十月",
                    "十一月",
                    "十二月"
                ],
                xData: [], //x轴的数据。
                year: "",
                month: "",
                day: "",
                selectNow: "",
                oneName: "", //标题组件
                chartName: "container",
                procName: [],
                params: {
                    //提交参数
                    hourInfo: "",
                    proccode: "",
                    dateType: 1,
                    energyType: ""
                },
                eneReportData: [],
                seriess: [],
                view: "waterReportCATemplate",
                date: "", //选择框的实际日期
                dateType: "", //选择框的实际日期类型
                showYear: false,
                showMonth: false,
                showDay: false,
                model: "",
                timer: null,
                unit: ""
            };
        },
        mounted() {
            this.initData();
        },
        methods: {
            //初始化页面，加载数据
            initData() {
                //车间工序名称
                let query = this.$route.query;
                this.oneName = query.titleName;
                //年月日   日期类型
                this.params.dateType = query.dateType;
                //指定车间工序数组
                this.params.proccode = query.proccode;
                //能源类型
                this.params.energyType = query.energyType;
                if (query.energyType === "elect") {
                    this.unit = "kW/h";
                } else if (query.energyType === "gas") {
                    this.unit = "m³";
                } else if (query.energyType === "water") {
                    this.unit = "m³";
                }
                //指定车间工序名称
                let proName = query.procName.split(",");
                this.procName = [];
                for (let i = 0; i < proName.length; i++) {
                    this.procName.push(proName[i]);
                }
                let date = new Date();
                //判断日期显示类型。
                let fullYear = date.getFullYear();
                let fullMonth = date.getMonth() + 1;
                if (fullMonth < 10) {
                    fullMonth = "0" + fullMonth;
                }
                if (this.params.dateType === 1) {
                    //年
                    this.showYear = true;
                    this.showMonth = false;
                    this.showDay = false;
                    this.dateType = "year";
                    this.model = "yyyy";
                    this.year = fullYear;
                    this.selectNow = fullYear;
                    this.params.hourInfo = fullYear;
                    this.date = fullYear + "";
                    this.xData = this.monthTime;
                } else if (this.params.dateType === 2) {
                    //月
                    this.showYear = false;
                    this.showMonth = true;
                    this.showDay = false;
                    this.dateType = "month";
                    this.model = "yyyy-MM";
                    this.year = fullYear;
                    this.params.hourInfo = fullYear + "-" + fullMonth;
                    this.date = fullYear + "-" + fullMonth;
                    this.selectNow = fullYear + "-" + fullMonth;
                    this.initDateTypeIsTwo(); //选线显示月，x轴展示天。
                } else if (this.params.dateType === 3) {
                    //天
                    this.showYear = false;
                    this.showMonth = false;
                    this.showDay = true;
                    this.dateType = "date";
                    this.model = "yyyy-MM-dd";
                    this.year = fullYear;
                    this.month = fullMonth;
                    let day = date.getDate();
                    if (day < 10) {
                        day = "0" + day;
                    }
                    this.params.hourInfo = fullYear + "-" + fullMonth + "-" + day;
                    this.date = fullYear + "-" + fullMonth + "-" + day;
                    this.selectNow = fullYear + "-" + fullMonth + "-" + day;
                    this.initDateTypeIsThree(); //选线展示年月日，x轴展示时间。
                }
                this.getData(); //获取数据
            },
            getData() {
                this.eneReportData = [];
                getByHourInfoInProcCode(this.params)
                    .then(response => {
                        if (response.data.success) {
                            this.eneReportData = response.data.data;
                            this.check();
                        } else {
                            this.$message.error(response.data.message);
                        }
                    })
                    .catch(e => {
                        this.$message.error(e.message);
                    });
            },
            //选项显示月，x轴展示天。
            initDateTypeIsTwo() {
                this.selectShowMonth();
                let date = new Date();
                this.month = date.getMonth() + 1;
                this.xShowDay();
            },
            //选项展示年月日，x轴展示时间。
            initDateTypeIsThree() {
                this.selectShowMonth();
                this.selectShowDay();
                this.xShowTime();
            },
            goBack() {
                this.$router.back(-1);
                this.$store.dispatch("delVisitedViews", this.$route).then(views => {
                    const latestView = views.slice(-1)[0];
                    if (latestView) {
                        this.$router.push(latestView.path);
                    } else {
                        this.$router.push("/");
                    }
                });
            },
            //点击年分,选项展示月，x轴展示月
            toYear() {
                this.xShowMonth();
                this.year = this.date;
                this.selectNow = this.year;
                this.selectShowMonth();
                this.dayData = []; //隐藏选项天
                this.params.hourInfo = this.date;
                this.params.dateType = 1;
                this.getData();
            },
            //点击月份，选项展示日，x轴展示日。
            toMonth() {
                this.month = this.date.split("-")[1];
                this.selectShowDay();
                this.xShowDay();
                // this.params.hourInfo = this.year + '-' + item;
                this.params.hourInfo = this.date;
                this.selectNow = this.params.hourInfo;
                this.params.dateType = 2;
                this.getData();
            },
            // 点击天,x轴展示小时
            tooDay() {
                this.day = this.date.split("-")[2];
                this.xShowTime();
                // this.params.hourInfo = this.year + '-' + this.month + '-' + item;
                this.params.hourInfo = this.date;
                this.selectNow = this.params.hourInfo;
                this.params.dateType = 3;
                this.getData();
            },
            //点击查询搜索
            search() {
                if (this.date === "") {
                    return;
                }
                if (this.params.dateType === 1) {
                    this.toYear();
                } else if (this.params.dateType === 2) {
                    this.toMonth();
                } else if (this.params.dateType === 3) {
                    this.tooDay();
                }
            },
            //检查dom元素
            check() {
                let dom = document.getElementById(this.chartName);
                if (dom) {
                    this.drawLine();
                    if (!this.timer) {
                        clearTimeout(this.timer);
                    }
                } else {
                    this.timer = setTimeout(this.check, 0);
                }
            },
            //重新加载数据
            drawLine() {
                let caTemplate = echarts.init(document.getElementById(this.chartName));
                let seriess = [];
                let keys = Object.keys(this.eneReportData);
                for (let k of keys) {
                    seriess.push({
                        name: k,
                        type: "bar",
                        data: this.eneReportData[k]
                    });
                }
                let option = {
                    tooltip: {
                        trigger: "axis",
                        axisPointer: {
                            type: "cross",
                            crossStyle: {
                                color: "#999"
                            }
                        }
                    },
                    legend: {
                        data: keys
                    },
                    toolbox: {
                        feature: {
                            magicType: { show: true, type: ["bar", "line"] },
                            restore: { show: true },
                            saveAsImage: { show: true }
                        }
                    },
                    xAxis: [
                        {
                            type: "category",
                            data: this.xData,
                            axisPointer: {
                                type: "shadow"
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: "value",
                            name: "耗量总计",
                            axisLabel: {
                                formatter: "{value} " + this.unit
                            }
                        }
                    ],
                    series: seriess
                };
                caTemplate.setOption(option, true);
            },

            //选项展示12个月。
            selectShowMonth() {
                this.monthData = [];
                for (let i = 1; i <= 12; i++) {
                    this.monthData.push(i); //初始化展示12个月。
                }
            },
            //选项展示天
            selectShowDay() {
                this.dayData = [];
                let days = new Date(this.year, this.month, 0).getDate();
                for (let i = 1; i <= days; i++) {
                    if (i < 10) {
                        i = "0" + i;
                    }
                    this.dayData.push(i);
                }
            },
            //x轴显示天数
            xShowDay() {
                let days = new Date(this.year, this.month, 0).getDate();
                this.dayTime = [];
                for (let i = 1; i <= days; i++) {
                    if (i < 10) {
                        i = "0" + i;
                    }
                    this.dayTime.push(i); //x轴显示天数
                }
                this.xData = this.dayTime;
            },
            //x轴显示时间
            xShowTime() {
                this.xData = this.dataTime;
            },
            //x轴显示月份
            xShowMonth() {
                this.xData = this.monthTime;
            }
        },
        watch: {
            // 利用watch方法检测路由变化：
            $route(to) {
                if (to.query.titleName) {
                    this.appKey = new Date().getTime();
                    this.date = "";
                    // 拿到目标参数 to.path 去再次请求数据接口
                    this.initData();
                }
            }
        }
        /* watch:{
                  "$route.query":{
                      deep:true,
                      handler(){
                          this.date = '';
                          this.initData()
                      }
                  }
              }*/
    };
</script>

<style scoped>
    .title {
        font-size: 14px;
        color: #333;
    }
</style>
