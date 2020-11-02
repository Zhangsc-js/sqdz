<template>
    <!--    环比分析-->
    <el-container :key="appKey">
        <el-main>
            <el-row>
                <el-col :span="22">
                    <span class="title">请选择分析时间：</span>
                    <el-date-picker v-model="date" type="month" value-format="yyyy-MM" placeholder="选择月"></el-date-picker>
                    <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                </el-col>
                <el-col :span="2">
                    <el-button icon="el-icon-back" type="primary" @click="goBack()"></el-button>
                </el-col>
            </el-row>
            <el-row>
                <h2 style="text-align: center">{{titleName}}</h2>
            </el-row>
        </el-main>
        <el-footer>
            <div :id="chartName" style="width:100%;height:500px"></div>
        </el-footer>
    </el-container>
</template>
<script>
    import echarts from "echarts";
    import { getChainConsumeData } from "@/api/energy";
    import { simpleDateFormat } from "@/utils/index";

    export default {
        name: "reportChainTemplate",
        data() {
            return {
                titleName: [],
                procName: [], //车间名称
                reportData: [],
                params: {
                    proccode: "",
                    years: "",
                    lastYears: "",
                    energyType: ""
                },
                selectMonth: [],
                chartName: "container",
                series: [],
                date: "",
                appKey: "",
                timer: null,
                unit: ""
            };
        },
        mounted() {
            this.initData();
        },
        methods: {
            initData() {
                //车间工序名称
                let query = this.$route.query;
                this.titleName = query.titleName;
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
                //年分
                let date = new Date();
                this.date = date;
                let month = date.getMonth();
                if (month + 1 < 10) {
                    this.params.years = date.getFullYear() + "-" + "0" + (month + 1);
                    this.params.lastYears = date.getFullYear() + "-" + "0" + month;
                } else if (month + 1 === 10) {
                    this.params.years = date.getFullYear() + "-" + (month + 1);
                    this.params.lastYears = date.getFullYear() + "-" + "0" + month;
                } else {
                    this.params.years = date.getFullYear() + "-" + month + 1;
                    this.params.lastYears = date.getFullYear() + "-" + month;
                    // this.params.lastYears = date.getFullYear() + "-" + "0" +month;
                }
                // this.params.lastYears = date.getFullYear() + "-" + (month<10?+"0"+month:month);
                //是1月分的时间
                if (month === 0) {
                    this.params.lastYears = date.getFullYear() - 1 + "-" + 12;
                }
                //指定车间工序名称
                this.procName = [];
                let proName = query.procName.split(",");
                for (let i = 0; i < proName.length; i++) {
                    this.procName.push(proName[i]);
                }
                this.selectMonth = [this.params.lastYears, this.params.years];
                this.getData();
            },
            getData() {
                this.reportData = [];
                getChainConsumeData(this.params)
                    .then(res => {
                        if (res.data.success) {
                            this.reportData = res.data.data;
                            this.check();
                        } else this.$message.error(res.data.message);
                    })
                    .catch(e => {
                        this.$message.error(e.message);
                    });
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
            search() {
                if (this.date === "") {
                    return;
                }
                let date = new Date(this.date);
                //今年
                let years = simpleDateFormat(date, "yyyy-MM");
                //去年
                let lastYears = simpleDateFormat(
                    new Date(date.setMonth(date.getMonth() - 1)),
                    "yyyy-MM"
                );
                this.params.years = years;
                this.params.lastYears = lastYears;
                this.selectMonth = [lastYears, years];
                this.getData();
            },
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
            drawLine() {
                let caTemplate = echarts.init(document.getElementById(this.chartName));
                this.series = [];
                this.series.push({
                    name: this.selectMonth[0],
                    type: "bar",
                    barWidth: 40,
                    data: this.reportData[0]
                });
                this.series.push({
                    name: this.selectMonth[1],
                    type: "bar",
                    barWidth: 40,
                    data: this.reportData[1]
                });
                caTemplate.setOption(
                    {
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
                            data: this.selectMonth
                        },
                        toolbox: {
                            feature: {
                                restore: { show: true },
                                saveAsImage: { show: true }
                            }
                        },
                        xAxis: [
                            {
                                type: "category",
                                data: this.procName,
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
                        series: this.series
                    },
                    true
                );
            }
        },
        watch: {
            // 利用watch方法检测路由变化：
            $route(to) {
                if (to.meta.chainTemplate) {
                    this.appKey = new Date().getTime();
                    this.date = "";
                    // 拿到目标参数 to.path 去再次请求数据接口
                    this.initData();
                }
            }
        }
        /*watch:{
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
