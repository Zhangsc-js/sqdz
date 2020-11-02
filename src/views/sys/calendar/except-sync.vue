<template>
    <div class="exceptSync">
        <!-- 查询表单 -->
        <el-form inline :model="queryForm">
            <el-form-item label="日历名称">
                <el-input v-model="queryForm.calendarName" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-query" @click="getData">查询</el-button>
            </el-form-item>
        </el-form>
        <!-- 表格 -->
        <el-table :data="tableData" stripe border style="width: 100%" ref="multipleTable">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="calendarCode" label="日历编码"></el-table-column>
            <el-table-column prop="calendarName" label="日历名称"></el-table-column>
        </el-table>
        <Pagination
            :total="total"
            :page.sync="page.pageNum"
            :limit.sync="page.pageSize"
            :pageSizes="pageSizes"
            @pagination="getData"
        />
        <el-row style="padding:10px;text-align:center">
            <el-button type="primary" @click="check">确定</el-button>
        </el-row>
    </div>
</template>

<script>
    import {queryAll,exceptSyc} from "@/api/sys";
    import {createNamespacedHelpers} from "vuex";
    import Pagination from "@/components/Pagination";
    const { mapState } = createNamespacedHelpers("sysDev");

    export default {
        components:{
            Pagination
        },
        props: {
            calendarCode: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                tableData: [],
                queryForm: {
                    calendarName:''
                },
                page: {
                    pageNum: 1,
                    pageSize: 10
                },
                pageSizes: [10, 50, 100],
                total: 0,
            };
        },
        mounted() {
            this.getData();
        },
        watch:{
            calendarCode(){
                this.getData()
            }

        },
        methods: {
            getData() {
                const params = {
                    NotCalendarCode:this.calendarCode,
                    calendarName:this.queryForm.calendarName,
                    ...this.page
                }
                queryAll(params).then(response => {
                    let data = response.data
                    if(data.success){
                        this.tableData = data.data.result
                        this.total = data.data.total
                    } else {
                        this.$message.error(data.message + ":" + data.data)
                    }
                })
            },
            check() {
                let rows =  this.$refs.multipleTable.store.states.selection
                let calendarIds = []
                for(let i = 0; i < rows.length; i++){
                    calendarIds.push(rows[i].id)
                }

                exceptSyc(calendarIds,this.exceptIds).then(response => {
                    let data = response.data
                    if(data.success){
                        this.$message.success("例外日同步成功！！！")
                        this.$emit("close");
                    } else {
                        this.$message.error(data.message + ":" + data.data)
                    }
                })
            }
        },
        computed:{
            ...mapState(["exceptIds"])
        }

    };
</script>

<style>
</style>
