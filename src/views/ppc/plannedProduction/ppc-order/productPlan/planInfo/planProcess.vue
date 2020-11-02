<template>
    <div>
        <el-table highlight-current-row height="100%" :data="tableDate" style="width: 100%">
            <el-table-column prop="processNo" label="流程号"></el-table-column>
            <el-table-column prop="processCode" label="工序编码"></el-table-column>
            <el-table-column prop="processName" label="工序名称"></el-table-column>
            <el-table-column prop="prodDevQty" label="工序下设备数量"></el-table-column>
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
            id: {
                type: String,
                required: true
            },
        },
        watch: {
            id () {
                this.getData();
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            getData() {
                if(this.id != '') {
                    getPlanProcess(this.id).then((response) => {
                        this.tableDate = response.data.data
                    }).catch(e => {
                        this.$message({
                            type: 'error',
                            message: e.message,
                            duration: 3 * 1000
                        })
                    });
                }
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>