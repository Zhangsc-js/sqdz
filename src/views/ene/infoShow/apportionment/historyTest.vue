<template>
    <div>
        <el-table highlight-current-row :data="tableDate"   border stripe style="width: 100%">
            <el-table-column prop="addressId" label="点位名称" width="150"></el-table-column>
            <el-table-column prop="dataValue" label="值" width="180"></el-table-column>
            <el-table-column prop="hourInfo" label="时间"></el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {valueTest} from "@/api/energy";
    export default {
        name: "historyTest",
        data(){
            return{
                tableDate:[]
            }
        },
        mounted(){
            this.getData()
        },
        methods:{
            getData(){
                valueTest().then((response) =>{
                    this.tableDate = response.data.data
                }).catch(e =>{
                    this.$message.error(e.message);
                })
            }
        }
    }
</script>

<style scoped>

</style>
