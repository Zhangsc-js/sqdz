<template>
    <div style="height: 100%">
        <el-divider content-position="left">班组排班计划</el-divider>
        <edit-table :tableData="tableData" height="100%" :opts.sync="tableColumn" highlight-current-row  @getData="getData"
                    @savaData="saveExcep" @deleteRow="dltExcep" :page="page" :total="total" :pageSizes="pageSizes">
        </edit-table>
    </div>
</template>

<script>
    import EditTable from '@/components/EditTable'
    import {saveCalendar,queryCalendar,saveExcep,dltExcep } from "@/api/productionPlanning";

    export default {
        name: "uptScheduInfo",
        components: {
            EditTable
        },
        data() {
            return {
                page: {
                    pageNum: 1,
                    pageSize: 3,
                },
                pageSizes: [3, 10, 50, 100],
                total: 0,
                tableColumn:[
                    {
                        type:"time",
                        label:'例外日期',
                        prop:'exceptDay',
                        format:"yyyy-MM-dd"
                    },
                    {
                        type: 'select',
                        label: "上班/休班",
                        prop: "exceptType",
                        options: [{
                            value:'0',
                            label:'休班'
                        },{
                            value:'1',
                            label:'上班'
                        }]
                    }, {
                        type:"input",
                        label:'备注',
                        prop:'remarks'
                    }
                ],
                queryForm:{
                    isMondayWork:'1',
                    isTuesdayWork:'1',
                    isWednesdayWork:'1',
                    isThursdayWork:'1',
                    isFridayWork:'1',
                    isSaturdayWork:'0',
                    isSundayWork:'0'

                },
                tableData:[],
                work:[{
                    id:'0',
                    name:'休班'
                },{
                    id:'1',
                    name:'上班'
                }]
            }
        },
        props: {
            id: {
                type: String,
                required: true
            },
        },
        watch: {
            id() {
                this.getData()
            }
        },
        methods: {
            getData() {
                const params = {
                    ...this.page,
                    id:this.id
                };
                queryCalendar(params).then((response) => {
                    let data = response.data;
                    if(data.success){
                        this.queryForm = data.data.plan
                        this.tableData = data.data.list
                        this.total = data.data.total
                    }
                })
            },
            saveCalendar(){
                saveCalendar(this.id,this.queryForm).then((response) =>{
                    let data = response.data;
                    if(data.success){
                        this.$message.success("新增成功！！")
                        this.$emit("save");
                    } else {
                        this.$message.error(response.data.message+":"+response.data.data)
                    }
                })
            },
            cancel() {
                this.$emit("cancel")
            },
            saveExcep(row,done){
                done();
                saveExcep(row,this.id).then((response) =>{
                    let data = response.data;
                    if(data.success){
                        this.$message.success("新增成功！！")
                    } else {
                        this.$message.error(response.data.message+":"+response.data.data)
                    }
                })
            },
            dltExcep(id){
                dltExcep(id).then((response) =>{
                    let data = response.data;
                    if(data.success) {
                        this.$message.success("删除成功！")
                    } else {
                        this.$message.error(response.data.message+":"+response.data.data)
                    }
                })
            }
        },
        mounted() {
            this.getData();
        }

    }
</script>