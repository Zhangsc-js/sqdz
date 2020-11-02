<template>
    <div>
        <el-form ref="queryForm" :rules="rules" :model="queryForm" label-width="80px" class="clearfix" inline>
            <el-form-item label="点位" prop="name">
                <el-input id="name" v-model="queryForm.name" plain="true" placeholder="请输入设备名称"/>
            </el-form-item>
            <el-form-item>
                <el-button @click="queryData" type="primary">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table
            id="accountTable"
            stripe
            border
            :data="tableData"
            @row-click="openDetails"
            style="width: 100%"
            ref="attrsTable"
        >
            <el-table-column fixed type="selection" width="55"></el-table-column>
            <el-table-column prop="paramName" align="center" label="名称"></el-table-column>
            <el-table-column prop="paramValue" align="center" label="点位"></el-table-column>
        </el-table>
        <el-button type="primary" @click="addRow">确定</el-button>
    </div>
</template>

<script>
    import { getPoint } from "@/api/energy";
    export default {
        name: "attrsList",
        props: {
            count: {
                type: Number,
                required: false
            }
        },
        data() {
            return {
                tableData: [],
                queryForm:{
                    name: ""
                },
                sels: [],
                rules:{
                    name:[
                        {required: true, message: '请输入点位', trigger: ['blur','change'] },
                    ]
                }
            };
        },
        mounted() {
            // this.getData();
        },
        methods: {
            getData() {
                let params = {
                    ...this.queryForm
                };
                getPoint(params)
                    .then(response => {
                        this.tableData = response.data.data.rows;
                        this.total = response.data.data.total;
                        //   console.log(response);
                    })
                    .catch(e => {
                        this.$message.error(e.message);
                    });
            },
            openDetails(row) {
                const param = Object.assign({ id: row.id }, row);
                this.$emit("save", param);
            },
            addRow() {
                //   console.log(this.$refs.attrsTable.selection);
                let rows = this.$refs.attrsTable.selection;
                this.$emit("addRow", rows);
            },
            queryData(){
                this.$refs['queryForm'].validate(val=>{
                    if(val){
                        this.getData()
                    }else{
                        this.$message.error('请输入点位')
                    }
                })
            }
        },
        watch: {
            count() {
                this.$refs.attrsTable.clearSelection();
            }
        }
    };
</script>

<style scoped>
</style>
