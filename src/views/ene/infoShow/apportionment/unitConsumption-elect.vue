<template>
    <el-tabs id="elect" type="border-card" v-model="activeName" style="height: 100%;">
        <el-tab-pane label="月产品单耗" name="first" style="height: 100%;">
            <el-form :inline="true" class="demo-form-inline" ref="monthForm">
                <el-row>
                    <el-form-item label="选择日期" prop="startTime">
                        <el-date-picker
                            v-model="monthForm.monthTime"
                            type="monthrange"
                            value-format="yyyy-MM"
                            range-separator="-"
                            style="height:auto;margin-bottom:0px;padding:0"
                            start-placeholder="开始月份"
                            end-placeholder="结束月份"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="选择产品">
                        <el-input
                            v-model="monthForm.materialName"
                            readonly
                            v-on:click.native="sMaterial"
                            style="height: auto;margin-bottom: 0px"
                            filterable
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="能源类型">
                        <el-select
                            v-model="monthForm.energyType"
                            style="height:auto;margin-bottom:0px"
                            filterable
                        >
                            <el-option
                                v-for="item in energyTypeData"
                                :key="item.value"
                                :label="item.label"
                                :value="item.code"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button icon="el-icon-search" type="primary" @click="searchUnitConsumption()">查询</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
            <div :id="chartName" style="width: 100%;height:400px" v-if="flag"></div>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="dateInfo" label="日期" align="left"></el-table-column>
                <el-table-column prop="kwhQty" label="产量" align="center"></el-table-column>
                <el-table-column prop="sumCost" label="耗能" align="center"></el-table-column>
                <el-table-column prop="unitCon" :label="theLabel" align="center"></el-table-column>
            </el-table>
        </el-tab-pane>
        <el-dialog title="选择物料" :visible.sync="sltMaterialDialogVisible" width="65%" append-to-body>
            <sMaterial @save="cMaterial" @cancel="hidenDialogCancel" :id="objId"/>
        </el-dialog>
    </el-tabs>
</template>

<script>
    import sMaterial from "./materialList";
    import echarts from "echarts";
    import {getAllEneType, getUnitConsumptionMonth} from "@/api/energy";

    export default {
        name: "unitConsumption-elect",
        components: {
            sMaterial
        },
        data() {
            return {
                monthForm: {
                    monthTime: "",
                    materialName: "",
                    materialCode: "",
                    energyType: ""
                },
                activeName: "first",
                chartName: "container",
                sltMaterialDialogVisible: false,
                objId: "",
                energyTypeData: [],
                tableData: [],
                unitConsumptionChart: "",
                monthData: [],
                produceData: [], //产量
                consumeData: [], //耗能
                unitConData: [], //单耗
                colors: ["#5793f3", "#d14a61", "#675bba"],
                theLabel: "单耗",
                monthParams: {
                    startTime: "",
                    endTime: "",
                    materialCode: "",
                    energyType: ""
                },
                flag: false // 默认不展示echarts容器
            };
        },
        created() {
            getAllEneType().then(res => {
                this.energyTypeData = res.data.data;
                this.monthForm.energyType = this.energyTypeData[0].code;
            });
        },
        mounted() {
            this.monthForm.monthTime[0] = new Date().getFullYear() + "-01"
            this.monthForm.monthTime[1] = new Date().getFullYear() + "-12"
            this.monthForm.energyType = "elect"
            this.monthForm.materialCode = "9.07.0144"
        },
        methods: {
            cMaterial(data) {
                this.monthForm.materialCode = data.materialCode;
                this.monthForm.materialName = data.materialName;
                this.sltMaterialDialogVisible = false;
            },
            sMaterial() {
                this.sltMaterialDialogVisible = true;
            },
            hidenDialogCancel() {
                this.sltMaterialDialogVisible = false;
            },

            searchUnitConsumption() {
                this.flag = true;
                this.monthParams.startTime = this.monthForm.monthTime[0];
                this.monthParams.endTime = this.monthForm.monthTime[1];
                this.monthParams.energyType = this.monthForm.energyType;
                this.monthParams.materialCode = this.monthForm.materialCode;
                getUnitConsumptionMonth(this.monthParams).then(res => {
                    this.tableData = res.data.data;
                    this.theLabel = "单耗(" + this.tableData[0].unitConUnit + ")";
                });
                this.drawLine();
            },
            drawLine() {
                this.monthData = [];
                this.produceData = [];
                this.consumeData = [];
                this.unitConData = [];
                for (let i = 0; i < this.tableData.length; i++) {
                    this.monthData.push(
                        JSON.parse(JSON.stringify(this.tableData[i].dateInfo))
                    );
                    this.produceData.push(this.tableData[i].kwhQty);
                    this.consumeData.push(this.tableData[i].sumCost);
                    this.unitConData.push(this.tableData[i].unitCon);
                }
                this.$nextTick(() => {
                    this.unitConsumptionChart = echarts.init(
                        document.getElementById(this.chartName)
                    );
                    this.unitConsumptionChart.setOption(
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
                            toolbox: {
                                feature: {
                                    restore: {show: true},
                                    saveAsImage: {show: true}
                                }
                            },
                            legend: {
                                data: ["单耗", "耗能", "产量"]
                            },
                            xAxis: [
                                {
                                    type: "category",
                                    data: this.monthData,
                                    axisPointer: {
                                        type: "shadow"
                                    }
                                }
                            ],
                            yAxis: [
                                {
                                    type: "value",
                                    name: "单耗",
                                    min: 0,
                                    position: "right",
                                    axisLine: {
                                        lineStyle: {
                                            color: this.colors[0]
                                        }
                                    },
                                    axisLabel: {
                                        formatter: "{value}"
                                    }
                                },
                                {
                                    type: "value",
                                    name: "耗能",
                                    min: 0,
                                    position: "left",
                                    axisLine: {
                                        lineStyle: {
                                            color: this.colors[1]
                                        }
                                    },
                                    axisLabel: {
                                        formatter: "{value}"
                                    }
                                },
                                {
                                    type: "value",
                                    name: "产量",
                                    position: "left",
                                    min: 0,
                                    axisLine: {
                                        lineStyle: {
                                            color: this.colors[2]
                                        }
                                    },
                                    offset: 85,
                                    axisLabel: {
                                        formatter: "{value}"
                                    }
                                }
                            ],
                            series: [
                                {
                                    name: "单耗",
                                    type: "line",
                                    data: this.unitConData
                                },
                                {
                                    name: "耗能",
                                    type: "bar",
                                    barWidth: 30,
                                    yAxisIndex: 1,
                                    data: this.consumeData
                                },
                                {
                                    name: "产量",
                                    type: "bar",
                                    barWidth: 30,
                                    yAxisIndex: 2,
                                    data: this.produceData
                                }
                            ]
                        },
                        true
                    );
                });
            }
        },
        watch: {
            tableData: {
                deep: true,
                handler() {
                    this.drawLine();
                }
            }
        }
    };
</script>

<style scoped>
</style>
