<template>
    <div>
        <el-table highlight-current-row height="220px" :data="tableDate" style="width: 100%">
            <el-table-column prop="mainNo" label="销售单号"></el-table-column>
            <el-table-column prop="detailNo" label="子销售单号"></el-table-column>
            <el-table-column prop="empyName" label="业务员"></el-table-column>
            <el-table-column prop="receiveDate" label="接单日期"></el-table-column>
            <el-table-column prop="deliveryDate" label="交货日期"></el-table-column>
            <el-table-column prop="produceStandard" label="生产标准"></el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {getPlanProcess} from "@/api/productionPlanning";

    export default {
        name: "planSaleDetail",
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