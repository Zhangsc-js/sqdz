<template>
    <div>
        <el-table :data="tableData">
            <el-table-column prop="outCode" align="center" label="分析项目编码"></el-table-column>
            <el-table-column prop="outName" align="center" label="名称" width="220"></el-table-column>
            <el-table-column prop="lower" align="center" label="范围下下限"></el-table-column>
            <el-table-column prop="low" align="center" label="范围下限"></el-table-column>
            <el-table-column prop="up" align="center" label="范围上限"></el-table-column>
            <el-table-column prop="upper" align="center" label="范围上上限"></el-table-column>
            <el-table-column prop="labOperator" align="center" label="化验人员"></el-table-column>
            <el-table-column prop="labTime" align="center" label="化验时间" width="180"></el-table-column>
            <el-table-column align="center" label="化验结果">
                <template v-slot="scope">
                    <span style="color: red">{{scope.row.resultData}}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {getNoSpecimenDetail} from '@/api/lims'

    export default {
        name: "noMore",
        data() {
            return {
                tableData: []
                //formLabelWidth: '100px'
            }
        },
        props: {
            rowId: {
                type: String,
                required: true
            }
        },
        watch: {
            rowId() {
                this.getData();
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            getData() {
                let param = {id: this.rowId};
                getNoSpecimenDetail(param).then((response) => {
                    const result = response.data;
                    console.log(result);
                    if (result.success) {
                        this.tableData = result.data;
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
