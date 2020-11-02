<template>
    <div style="height: 100%">
        <el-table highlight-current-row height="100%" :data="tableData" style="width: 100%" border>
            <el-table-column align="center" prop="wfNo" width="150px" label="报工单号"></el-table-column>
            <el-table-column align="center" prop="finishedDate" width="120px" label="报工日期"></el-table-column>
            <el-table-column align="center" prop="processName" label="工序名称"></el-table-column>
            <el-table-column align="center" prop="materialCode" width="120px" label="物料编号"></el-table-column>
            <el-table-column align="center" prop="materialName" width="120px" label="物料名称"></el-table-column>
            <el-table-column align="center" prop="finishedQty" label="完工数量"></el-table-column>
            <el-table-column align="center" prop="goodQty" label="合格数量"></el-table-column>
            <el-table-column align="center" prop="badQty" label="废品数量"></el-table-column>
            <el-table-column align="center" prop="reworkQty" label="返修数量"></el-table-column>
            <el-table-column align="center" prop="status" label="状态" width="100px">
                <template v-slot="scope">
                    <span v-if="scope.row.status == 30">
                        <jt-badge status="processing"  :textValue="scope.row.statusName" />
                    </span>
                    <span v-else>
                        <jt-badge status="success" :textValue="scope.row.statusName" />
                    </span>
                </template>

            </el-table-column>
            <el-table-column align="center" prop="unitCode" label="单位"></el-table-column>
            <el-table-column align="center" prop="devName" label="加工设备"></el-table-column>
            <el-table-column align="center" prop="teamName" label="班组"></el-table-column>
            <el-table-column align="center" prop="isNeedInspect" label="是否需要质检">
                <template slot-scope="scope" >
                    <span v-if="scope.row.isNeedInspect == 1">是</span>
                    <span v-if="scope.row.isNeedInspect == 0">否</span>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="workType" label="工单类型">
                <template slot-scope="scope" >
                    <span v-if="scope.row.workType == 1">返工单</span>
                    <span v-if="scope.row.workType == 0">正常工单</span>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="reworkType" label="返工类型"></el-table-column>
            <el-table-column align="center" prop="workerName" label="报工人"></el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {queryFinishByWorkOrderId,statusAndType} from '@/api/productionPlanning'
    import JtBadge from '@/components/JtBadge'

    export default {
        name: 'finishList',
        components: {
            JtBadge
        },
        data() {
            return {
                tableData: [],
                statusList:[]
            }
        },
        props: {
            workOrderId: {
                type: String,
                required: true
            },
            trigger: {
                type: Number,
                required: true
            }
        },
        watch: {
            trigger() {
                if(this.workOrderId){
                    this.getData()
                }
            }
        },
        methods: {
            getData() {
                queryFinishByWorkOrderId(this.workOrderId).then((response) => {
                    const result = response.data
                    if (result.success) {
                        for (let i = 0; i < result.data.length; i++) {
                            for (let j = 0; j <this.statusList.length ; j++) {
                                if(result.data[i].status==this.statusList[j].code){
                                    result.data[i].statusName=this.statusList[j].label;
                                }
                            }
                            if (result.data[i].workType == 1) {
                                result.data[i].fixQty = result.data[i].finishedQty
                            } else {
                                result.data[i].fixQty = 0;
                            }

                        }
                        this.tableData = result.data
                    } else {
                        this.$message.error(result.message)
                    }
                }).catch(e => {
                    this.$message({
                        type: 'error',
                        message: e.message
                    })
                })

            },
            initData(){
                statusAndType().then((response) =>{
                    let data = response.data
                    this.statusList = data.data.WF_STATUS
                    this.getData()
                })
            },
        },
        mounted() {
            if(this.workOrderId){
                this.initData()
            }
        }
    }
</script>

<style>
</style>
