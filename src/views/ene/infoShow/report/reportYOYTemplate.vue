<template>
    <!--    同比分析-->
    <el-container :key="appKey">
        <el-main>
            <el-row>
                <el-col :span="22">
                    <span class="title">请选择分析时间：</span>
                    <el-date-picker v-model="date" type="year" value-format="yyyy" placeholder="选择年"></el-date-picker>
                    <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                </el-col>
                <el-col :span="2">
                    <el-button icon="el-icon-back" type="primary" @click="goBack()" />
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
    import { getYOYConsumeYearData } from "@/api/energy";
    import { simpleDateFormat } from "@/utils/index";

    export default {
        name: "reportYOYTemplate",
        data() {
            return {
                appKey: "",
                params: {
                    proccode: "",
                    years: new Date().getFullYear(),
                    energyType: ""
                },
                reportData: [],
                series: [],
                selectYear: [],
                titleName: "",
                chartName: "container",
                date: "",
                timer: null,
                unit: ""
            };
        },
        mounted() {
            this.initData();
        },
        methods: {
            initData() {
                //标题名称
                let query = this.$route.query;
                this.titleName = query.titleName;
                //指定设备
                this.params.proccode = query.proccode;
                let date = new Date();
                this.date = date;
                //年份
                this.params.years = date.getFullYear();
                //能源类型
                this.params.energyType = query.energyType;
                if (query.energyType === "elect") {
                    this.unit = "kW/h";
                } else if (query.energyType === "gas") {
                    this.unit = "m³";
                } else if (query.energyType === "water") {
                    this.unit = "m³";
                }
                this.selectYear = [date.getFullYear() - 1 + "", date.getFullYear() + ""]; //初始化当前的年
                //设备名称
                this.procName = query.procName;
                this.getData();
            },
            getData() {
                this.reportData = [];
                getYOYConsumeYearData(this.params)
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
                //   this.data=this.data
                this.date = simpleDateFormat(this.date, "yyyy");
                this.selectYear = [this.date - 1 + "", this.date]; ////初始化当前的年
                this.params.years = this.date;
                this.getData();
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
            drawLine() {
                let caTemplate = echarts.init(document.getElementById(this.chartName));
                this.series = [];
                for (let i = 0; i < this.reportData.length; i++) {
                    this.series.push({
                        name: this.selectYear[i],
                        type: "bar",
                        data: this.reportData[i]
                        //stack看数据是否采用数据堆叠方式
                    });
                }
                caTemplate.setOption(
                    {
                        /* title: {
                             text: this.titleName,
                         },*/
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
                            data: this.selectYear
                        },
                        toolbox: {
                            feature: {
                                magicType: { show: true, type: ["bar", "line"] },
                                restore: { show: true },
                                saveAsImage: { show: true }
                            }
                        },
                        /*  dataZoom: [{
                              type: 'slider',
                              show: true,
                              xAxisIndex: [0],
                              start: 1,
                              end: 100
                          }],*/
                        xAxis: [
                            {
                                type: "category",
                                data: [
                                    "1月",
                                    "2月",
                                    "3月",
                                    "4月",
                                    "5月",
                                    "6月",
                                    "7月",
                                    "8月",
                                    "9月",
                                    "10月",
                                    "11月",
                                    "12月"
                                ],
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
                if (to.meta.yoyTemplate) {
                    this.appKey = new Date().getTime();
                    this.date = "";
                    // 拿到目标参数 to.path 去再次请求数据接口
                    this.initData();
                }
            }
        }
        /*     watch:{
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
