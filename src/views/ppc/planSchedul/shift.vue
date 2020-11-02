<template>
    <div style="height:100%">
            <edit-table :tableData="tableData" height="100%" :opts.sync="tableColumn" highlight-current-row :showAddBtn="showAddBtn" @getData="getData"
                        @savaData="saveMain" style="width: 100%;"  @deleteRow="deleteMain" pageName="SYS-SHIFTS">
            </edit-table>
    </div>
</template>

<script>
    import EditTable from '@/components/EditTable'
    import {queryByPlanCode,saveshift,dltShift} from "@/api/productionPlanning";
    export default {
        name: "planScheduInfo",
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
                        type:"input",
                        label:'班次序号',
                        prop:'shiftCode'
                    }, {
                        type:"input",
                        label:'班次名称',
                        prop:'shiftName'
                    },{
                        type:"time",
                        label:'开始日期',
                        prop:'startTime',
                        format:"HH:mm"
                    },{
                        type:"time",
                        label:'结束日期',
                        prop:'endTime',
                        format:"HH:mm"
                    },{
                        type:"select",
                        label:'是否跨天',
                        prop:'isCrossDay',
                        options:[{
                            label:"是",
                            value:"1"
                        },{
                            label:"否",
                            value:"0"
                        },]
                    },

                ],
                tableData: [],
                DialogVisible: false,
                SaveDialogVisible: false,
                showAddBtn:false,
                row: {},
            }
        },
        props: {
            planCode: {
                type: String,
                required: true
            }
        },
        watch: {
            planCode() {
                this.getData()
            }
        },
        methods:{
            getData(){
               if(this.planCode == ''){
                    return;
               }
               this.showAddBtn = true;
                const params = {
                    ...this.page,
                    planCode:this.planCode
                };
                queryByPlanCode(params).then((response) => {
                    let data = response.data
                    if(data.success) {
                        this.tableData = data.data.result;
                        this.total = data.data.total
                    } else {
                        this.$message.error(response.data.message+":"+response.data.data)
                    }
                })
            },
            saveMain(row,done){
                done();
                saveshift(this.planCode,row).then((response) => {
                    let data = response.data;
                    if(data.success) {
                        this.$message.success("新增成功")
                        this.getData();
                    } else {
                        this.$message.error(response.data.message+":"+response.data.data)
                    }
                })
            },
            deleteMain(id){
                dltShift(id).then(() => {
                    this.getData();
                    this.$message.success("删除成功!");
                })

            },
        },

    }
</script>
