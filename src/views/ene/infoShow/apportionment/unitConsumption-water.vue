<template>
    <el-tabs id="elect" type="border-card" v-model="activeName">
        <el-tab-pane label="月产品单耗" name="first">
            <el-form :inline="true" class="demo-form-inline" ref="monthForm">
                <el-form-item label="请选择日期" prop="startTime" style="padding-left: 2%">
                    <el-date-picker
                        v-model="monthForm.startTime"
                        type="month"
                        placeholder="选择日期"
                        value-format="yyyy-MM"
                        style="width: 200px;"
                    ></el-date-picker>
                    <span> - </span>
                    <el-date-picker
                        v-model="monthForm.endTime"
                        type="month"
                        placeholder="选择日期"
                        value-format="yyyy-MM"
                        style="width: 200px;"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="请选择产品">
                    <el-input
                        v-model="monthForm.materialName"
                        readonly
                        v-on:click.native="sMaterial"
                        style="height: auto;margin-bottom: 0px"
                        filterable
                    >
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button  icon="el-icon-search" type="primary" @click="searchUnitConsumption()">查询</el-button>
                </el-form-item>
            </el-form>
        </el-tab-pane>
        <el-dialog title="选择物料" :visible.sync="sltMaterialDialogVisible" width="65%" append-to-body>
            <sMaterial @save="cMaterial" @cancel="hidenDialogCancel" :id="objId" />
        </el-dialog>
    </el-tabs>
</template>

<script>
    import sMaterial from './materialList'
    export default {
        name: "unitConsumption-water",
        components: {
            sMaterial,
        },
        data() {
            return{
                monthForm:{
                    startTime:null,
                    endTime:null,
                    materialName:'',
                    materialCode:''
                },
                activeName:'first',
                sltMaterialDialogVisible:false,
                objId:'',
            }
        },
        methods:{
            cMaterial(data){
                this.monthForm.materialCode=data.materialCode;
                this.monthForm.materialName=data.materialName;
                this.sltMaterialDialogVisible = false;
            },
            sMaterial(){
                this.sltMaterialDialogVisible = true;
            },
            hidenDialogCancel(){
                this.sltMaterialDialogVisible = false;
            },
            searchUnitConsumption(){}
        }
    }
</script>

<style scoped>

</style>
