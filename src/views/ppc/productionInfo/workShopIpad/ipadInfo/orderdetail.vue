<template>
    <div style=" padding-left: 20px;">
            <el-form :model="tableData" label-width="80px"  ref="topTableData" :inline="true">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="派工单号" prop="bomCode">
                            <el-input disabled v-model="tableData.woNo" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="生产单号">
                            <el-input disabled v-model="tableData.ppNo" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="销售明细">
                            <el-input disabled v-model="tableData.sdNo" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="销售总单">
                            <el-input disabled v-model="tableData.saleNo" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="6">
                        <el-form-item label="物料编码" prop="bomCode">
                            <el-input disabled v-model="tableData.materialCode" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="物料名称">
                            <el-input disabled v-model="tableData.materialName" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="规格">
                            <el-input disabled v-model="tableData.specification" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="型号">
                            <el-input disabled v-model="tableData.quality" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="6">
                        <el-form-item label="BOM编号" prop="bomCode">
                            <el-input disabled v-model="tableData.bomCode" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="BOM版本">
                            <el-input disabled v-model="tableData.bomVer" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="加工数量">
                            <el-input disabled v-model="tableData.produceQty" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="加工单位">
                            <el-input disabled v-model="tableData.unitName" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="6">
                        <el-form-item label="计划开始" prop="bomCode">
                            <el-input disabled v-model="tableData.planStartDate" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="计划截止">
                            <el-input disabled v-model="tableData.planEndDate" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="实际开工">
                            <el-input disabled v-model="tableData.actualStartDate" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="实际完工">
                            <el-input disabled v-model="tableData.actualEndDate" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="6">
                        <el-form-item label="所属车间" prop="bomCode">
                            <el-input disabled v-model="tableData.workshopName" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="加工工序">
                            <el-input disabled v-model="tableData.processCodeName" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="加工设备">
                            <el-input disabled v-model="tableData.devName" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="加工班组">
                            <el-input disabled v-model="tableData.teamName" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="6">
                        <el-form-item label="登录人" prop="bomCode">
                            <el-input disabled v-model="tableData.workerName" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="工单类型">
                            <el-input disabled v-if="tableData.workType == 0" value="正常" autocomplete="off"></el-input>
                            <el-input disabled v-if="tableData.workType == 1" value="返工" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="加工备注">
                            <el-input disabled  v-model="tableData.remarks" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
    </div>
</template>

<script>

    export default {
        name: "ipad-info",
        components: {
        },
        data() {
            return {
                tableData:{},

            }
        },
        props: {
            row: {
                type: Object,
                required: true
            }
        },
        watch: {
            row() {
                this.getData()
            }
        },
        methods: {
            getData(){
                this.tableData = this.row;
                this.tableData.processCodeName=this.tableData.processCode+"-"+this.tableData.processName;
            },
        }
    }
</script>

<style lang="css" >
</style>
