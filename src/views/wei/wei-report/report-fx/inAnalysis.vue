<template>
        <el-tabs type="border-card" v-model="activeName">
            <el-tab-pane label="车号明细" name="first">
                <div :id="chartName" style="width: 98%;height:500px">
                </div>
                <div style="width: 98%">
                    <el-table
                            height="250px"
                            :data="tableData"
                            style="width: 100%;text-align: center;align:center;margin-left: 10%"
                    >
                        <el-table-column label="历史过磅记录">
                            <el-table-column
                                    prop="createdOn"
                                    label="时间日期"
                                    align="center"
                                    width="200">
                            </el-table-column>
                            <el-table-column
                                    prop="supplier"
                                    label="发货单位"
                                    align="center"
                                    width="200">
                            </el-table-column>
                            <el-table-column
                                    prop="truckNo"
                                    label="车号"
                                    align="center"
                                    width="200">
                            </el-table-column>
                            <el-table-column
                                    prop="goodsName"
                                    label="货物名称"
                                    align="center"
                                    width="200">
                            </el-table-column>
                            <el-table-column
                                    prop="net"
                                    label="净重(KG)"
                                    align="center"
                                    width="200">
                            </el-table-column>
                        </el-table-column>

                    </el-table>
                </div>
            </el-tab-pane>
            <el-tab-pane label="货物明细" name="second" style="height: 100%;width: 100%">
                <el-row>
                    <el-col :span="12">
                        <div :id="chartPieName" style="width: 700px;height:520px"></div>
                    </el-col>
                    <el-col :span="12">
                        <div :id="chartPieOneName" style="width: 700px;height:520px"></div>
                    </el-col>
                </el-row>
            </el-tab-pane>
        </el-tabs>
</template>
<script>
    import echarts from "echarts"
    import {
        getInMeterNetHistory,
        getInMeterGroupPie,
        getInMeterGoodsNamePie,
        getInMeterNetHistoryTab
    } from '@/api/weighing'

    export default {
        name: "inAnalysis",
        data() {
            return {
                activeName: 'first',
                chartName: "container",
                chartPieName: "containerOne",
                chartPieOneName: "containerTwo",
                chartData: {
                    nets: [],
                    createdOns: [],
                },
                charDataPie: {
                    nets: [],
                    suppliers: []
                },
                charDataPieOne: {
                    nets: [],
                    goodsNames: []
                },
                dataOne: [],
                dataTwo: [],
                tableData: []
            }
        },
        mounted() {
            this.getData()
        },
        methods: {
            drawLine() {
                let netHistoryLineChart = echarts.init(document.getElementById(this.chartName))
                netHistoryLineChart.setOption({
                    tooltip: {
                        trigger: 'axis',
                        position: function (pt) {
                            return [pt[0], '10%'];
                        }
                    },
                    title: {
                        left: 'center',
                        text: '入厂净重历史',
                    },
                    toolbox: {
                        feature: {
                            magicType: {show: true, type: ['line', 'bar']},
                            dataZoom: {
                                yAxisIndex: 'none'
                            },
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.chartData.createdOns
                    },
                    yAxis: {
                        type: 'value',
                        boundaryGap: [0, '100%']
                    },
                    dataZoom: [{
                        type: 'inside',
                        // start: 0,
                        // end: 10
                    }, {
                        // start: 0,
                        // end: 10,
                        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                        handleSize: '80%',
                        handleStyle: {
                            color: '#fff',
                            shadowBlur: 3,
                            shadowColor: 'rgba(0, 0, 0, 0.6)',
                            shadowOffsetX: 2,
                            shadowOffsetY: 2
                        }
                    }],
                    series: [
                        {
                            name: '入厂净重(KG)',
                            type: 'line',
                            smooth: true,
                            symbol: 'none',
                            sampling: 'average',
                            itemStyle: {
                                color: 'rgb(255, 70, 131)'
                            },
                            areaStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgb(255, 158, 68)'
                                }, {
                                    offset: 1,
                                    color: 'rgb(255, 70, 131)'
                                }])
                            },
                            data: this.chartData.nets
                        }
                    ]
                })
            },
            drawPie() {
                let supplierPieChart = echarts.init(document.getElementById(this.chartPieName))
                for (let i = 0; i < this.charDataPie.suppliers.length; i++) {
                    let tmp = {}
                    tmp.value = this.charDataPie.nets[i]
                    tmp.name = this.charDataPie.suppliers[i];
                    this.dataOne.push(tmp);
                    // console.log(this.dataOne)
                }
                supplierPieChart.setOption({
                    title: {
                        text: '来源分析',
                        subtext: '单位：KG',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        x: 'center',
                        y: 'bottom',
                        data: this.charDataPie.suppliers
                    },
                    toolbox: {
                        show: false,
                        feature: {
                            mark: {show: true},
                            dataView: {show: true, readOnly: false},
                            magicType: {
                                show: true,
                                type: ['pie', 'funnel']
                            },
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    calculable: true,
                    series: [
                        {
                            name: '原料占比(单位：KG)',
                            type: 'pie',
                            radius: [20, 110],
                            center: ['40%', '50%'],
                            roseType: 'radius',
                            label: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            lableLine: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            data: this.dataOne,
                        },
                        // console.log(this.dataOne)
                    ]
                })
            },
            drawPieOne() {
                let goodsNamePieChart = echarts.init(document.getElementById(this.chartPieOneName))
                for (let i = 0; i < this.charDataPieOne.goodsNames.length; i++) {
                    let tmp = {}
                    tmp.value = this.charDataPieOne.nets[i]
                    tmp.name = this.charDataPieOne.goodsNames[i];
                    this.dataTwo.push(tmp);
                    // console.log(this.dataOne)
                }
                goodsNamePieChart.setOption({
                    title: {
                        text: '原料占比',
                        subtext: '单位：KG',
                        x: 'center'
                    },
                    toolbox: {
                        show: false,
                        feature: {
                            mark: {show: true},
                            dataView: {show: true, readOnly: false},
                            magicType: {
                                show: true,
                                type: ['pie', 'funnel']
                            },
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: this.charDataPieOne.goodsNames
                    },
                    series: [
                        {
                            name: '原料品种',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '50%'],
                            data: this.dataTwo,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                })
            },
            getData() {
                this.$nextTick(() => {
                    getInMeterNetHistory().then(response => {
                        this.chartData = response.data.data
                        this.drawLine()
                    })
                    getInMeterGroupPie().then(response => {
                        this.charDataPie = response.data.data
                        this.drawPie()
                    })
                    getInMeterGoodsNamePie().then(response => {
                        this.charDataPieOne = response.data.data
                        this.drawPieOne()
                    })
                    getInMeterNetHistoryTab().then(response => {
                        this.tableData = response.data.data
                    })
                })
            }
        }
    }
</script>

<style scoped>

</style>
