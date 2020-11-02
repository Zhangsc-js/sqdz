<template>
    <div style="">
        <template>
            <el-table highlight-current-row :data="tableData" stripe @selection-change="objSelection" border style="width: 100%">
                <el-table-column type="selection" width="60" center></el-table-column>
                <el-table-column  prop="materialCode" label="物料编码" ></el-table-column>
                <el-table-column  prop="materialName" label="物料名称" ></el-table-column>
                <el-table-column  prop="specification" label="规格"></el-table-column>
                <el-table-column  prop="inputQty" label="计划量" ></el-table-column>
                <el-table-column  prop="primaryUnit" label="单位" ></el-table-column>
                <el-table-column  prop="alterQty" label="已领量" ></el-table-column>
                <el-table-column  prop="remake" label="备注" ></el-table-column>
                <el-table-column  label="本次领用量" >
                    <template slot-scope="scope" >
                        <el-input v-model="scope.row.number"></el-input>
                    </template>
                </el-table-column>
            </el-table>
            <el-button type="primary" @click="submitPick">提交</el-button>
        </template>
    </div>
</template>

<script>
    import {getpickByPlanId,addPick} from "@/api/productionPlanning";

    export default {
        name: "pickInfo",
        components: {
        },
        data() {
            return {
                tableData:[],
                objIds: [],                 // 选择行数据
                batchBtn: true,
                rows:[]
            }
        },
        props: {
            id: {
                type: String,
                required: true
            },
            workOrderId:{
                type:String,
                required:true
            },
            index:{
                type:Number,
                required:true
            }
        },
        watch: {
            index(){
                this.getData();
            }
        },
        methods: {
            objSelection(objs){
                this.objIds.length = 0;
                this.rows.length = 0;
                const _this = this;
                objs.forEach(element => {
                    _this.objIds.push(element.id)
                    _this.rows.push(element);
                });
                this.batchBtn = this.objIds.length === 0
            },
            submitPick(){
                //前端数据验证
                if(this.rows.length == 0){
                    this.$message.warning("请选择物料！！！")
                    return;
                }
                for(let i = 0; i < this.rows.length; i++){
                    if(this.rows[i].number == '' || this.rows[i].number == null){
                        this.$message.warning(this.rows[i].materialName + "请输入本次领用量！！")
                        return;
                    }

                    if(this.rows[i].alterQty >= this.rows[i].inputQty){
                        this.$message.warning(this.rows[i].materialName + "物料领料已完成,无法领料！！");
                        return;
                    }

                    if(parseInt(this.rows[i].alterQty) + parseInt(this.rows[i].number) > this.rows[i].inputQty ){
                        this.$message.warning(this.rows[i].materialName + "物料当前领料大于剩余领料,无法领料！！");
                        return;
                    }

                    this.rows[i].workOrderId = this.workOrderId;
                }
                addPick(this.rows,1).then((response) => {
                    let data = response.data;
                    if(data.data.code == '10000'){
                       this.$message.success("新增成功！！")
                        this.$emit("save");
                    } else {
                        this.$message.error(data.data.message);
                    }
                })
            },
            getData(){
                getpickByPlanId(this.id).then((response) => {
                    let data = response.data;
                    this.tableData = data.data;
                }).catch(e => {
                    this.$message({
                        type: 'error',
                        message: e.message,
                        duration: 3 * 1000
                    })
                });
            },
        },
        mounted() {
            this.getData();
        }
    }
</script>

<style lang="scss" scoped>
    body{

    }

</style>
