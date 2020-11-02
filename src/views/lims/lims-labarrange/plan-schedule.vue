<template>
    <div>
        <el-table :data="planScheduleList">
            <el-table-column prop="scheduleCode" align="center" label="任务单号" width="150"></el-table-column>
            <el-table-column align="center" label="是否复验">
                <template v-slot="scope">
                    <span v-if="scope.row.planType === 3">是</span>
                    <span v-else>否</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="实际取样时间" width="180">
                <template v-slot="scope">
                    <span v-if="scope.row.planType === 3">/</span>
                    <span v-else-if="scope.row.ifMiss && scope.row.ifMiss === 1">缺样</span>
                    <span v-else-if="scope.row.ifSample === 0 || !scope.row.actualTime">待取样</span>
                    <span v-else>{{scope.row.actualTime}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="送达时间" width="180">
                <template v-slot="scope">
                    <span v-if="!!scope.row.sendTime">{{scope.row.sendTime}}</span>
                    <span v-else>/</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="是否接收" width="220">
                <template v-slot="scope">
                    <span v-if="!!scope.row.receiveTime && !!scope.row.receiveUserName">
                        接收时间：{{scope.row.receiveTime}} 接收人：{{scope.row.receiveUserName}}</span>
                    <span v-else>未接收</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="完成化验时间" width="180">
                <template v-slot="scope">
                    <span v-if="!!scope.row.okTime">{{scope.row.okTime}}</span>
                    <span v-else>未完成</span>
                </template>
            </el-table-column>
        </el-table>
        <Pagination
            :total="total"
            :page.sync="page.pageNum"
            :limit.sync="page.pageSize"
            @pagination="getData()"
        />
    </div>
</template>

<script>
    import { getScheduleByPlan } from '@/api/lims'
    import Pagination from "@/components/Pagination";
    export default {
        name: "PlanSchedule",
        components:{
            Pagination
        },
        data() {
            return {
                planScheduleList:[],
                page: {
                    pageNum: 1,
                    pageSize: 10
                },
                total: 0
            }
        },
        props: {
            selPlan:{
                type: Object,
                required: true
            }
        },
        watch:{
            selPlan(){
                this.getData();
            }
        },
        created() {
            this.getData();
        },
        methods: {
            getData(){
                getScheduleByPlan(this.selPlan.planId,this.page).then((response) => {
                    const result = response.data;
                    if (result.success) {
                        this.planScheduleList = result.data.rows;
                        this.total = result.data.total;
                    } else {
                        this.$message.error(result.message);
                    }
                }).catch(e => {
                    this.$message.error(e.message)
                })
            }
        }
    }
</script>

<style scoped>

</style>
