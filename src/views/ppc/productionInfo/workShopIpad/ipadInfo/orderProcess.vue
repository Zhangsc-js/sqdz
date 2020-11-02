<template>
    <div class="orderProcess">
        <el-table height="312px"  :row-class-name="tableRowClassName" :data="tableDate" border style="width: 100%">
            <el-table-column prop="processNo" label="流程号"></el-table-column>
            <el-table-column prop="processCode" label="工序编码"></el-table-column>
            <el-table-column prop="processName" label="工序名称"></el-table-column>
            <el-table-column prop="qty" label="是否当前派工工序">
                <template slot-scope="scope" >
                    <span v-if="scope.row.id === row.planProcessId">是</span>
                    <span v-if="scope.row.id !== row.planProcessId">否</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {getPlanProcess} from "@/api/productionPlanning";

    export default {
        name: "planProcess",
        components: {
            // BomRight
            //DevCard
        },
        data() {
            return {
                tableDate: [],
            }
        },
        props: {
            row: {
                type: Object,
                required: true
            },
        },
        watch: {
            row() {
                this.getData();
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            tableRowClassName({row, rowIndex}){
                if(row.id === this.row.planProcessId) {
                    return 'success-row';
                }
            },
            getData() {
                if (this.row.planId === undefined) {
                    this.$message.warning("请选择派工数据！！")
                    return;
                }
                getPlanProcess(this.row.planId).then((response) => {
                    this.tableDate = response.data.data
                }).catch(e => {
                    this.$message({
                        type: 'error',
                        message: e.message,
                        duration: 3 * 1000
                    })
                });

            },
        }
    }
</script>

<style lang="css">
   .orderProcess .el-table .success-row {
        background: #C7EDCC;
    }
</style>
