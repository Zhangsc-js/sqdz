<template>
    <div style="">
        <template>
            <el-table highlight-current-row :data="tableData" stripe height="200px"  border style="width: 100%">
                <el-table-column prop="materialCode" label="物料编码" ></el-table-column>
                <el-table-column prop="materialName" label="物料名称" ></el-table-column>
                <el-table-column prop="specification" label="规格"></el-table-column>
                <el-table-column prop="primaryUnit" label="单位" ></el-table-column>
                <el-table-column prop="remake" label="备注" ></el-table-column>
                <el-table-column  label="领料量" >
                    <template slot-scope="scope" >
                        <el-input v-model="scope.row.number"></el-input>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <el-button type="primary" @click="addPick">新增</el-button>
        <el-button type="primary" @click="savePick">保存</el-button>
        <el-dialog title="选择物料" :visible.sync="sltMaterialDialogVisible" width="65%" append-to-body>
            <sltMaterial @save="categoryDialog" @cancel="hidenDialogCancel" />
        </el-dialog>
    </div>
</template>

<script>
    import {addPick} from "@/api/productionPlanning";
    import sltMaterial from "../../../plannedProduction/ppc-bom/materialInfo"
    export default {
        name: "pickOdd",
        components: {
            sltMaterial
        },
        data() {
            return {
                tableData:[],
                sltMaterialDialogVisible:false
            }
        },
        props: {
            workOrderId: {
                type: String,
                required: true
            },
            status: {
                type: String,
                required: true
            },
            inx:{
                type:Boolean,
                required:true
            }
        },
        watch: {
            inx(){
                this.tableData=[]
            }
        },
        methods: {
            categoryDialog(row){
                this.sltMaterialDialogVisible = false;
                this.tableData.push(row);
            },
            hidenDialogCancel(){
                this.sltMaterialDialogVisible = false;
            },
            addPick(){
                this.sltMaterialDialogVisible = true;
            },
            savePick(){
                if(this.tableData.length == 0){
                    this.$message.info("请选择物料")
                    return;
                }
                for(let i = 0; i < this.tableData.length; i++){
                    if(this.tableData[i].number == '' || this.tableData[i].number == null){
                        this.$message.warning(this.tableData[i].materialName + "请输入领料量！！")
                        return;
                    }
                    let y = String(this.tableData[i].number).indexOf(".") + 1
                    if(y > 0){
                        this.$message.warning(this.tableData[i].materialName + "领料量不能为小数")
                        return
                    }
                   this.tableData[i].workOrderId = this.workOrderId;
                }
                addPick(this.tableData,this.status).then((response) => {
                    let data = response.data;
                    if(data.data.code == '10000'){
                        this.$message.success("新增成功！！")
                        this.$emit("save");
                    } else {
                        this.$message.error(data.data.message);
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    body{

    }

</style>
