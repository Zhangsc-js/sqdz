<template>
    <div class="insertProducePlan">
        <el-form :inline="true" label-width="120px" :model="queryForm" class="demo-form-inline" ref="queryForm" :rules="rules">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="物料编码：" prop="materialCode">
                        <el-input readonly v-on:click.native="sltMaterial" v-model="queryForm.materialCode"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="bom编码：" prop="bomCode">
                        <el-input disabled v-model="queryForm.bomCode"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>


            <el-row>
                <el-col :span="12">
                    <el-form-item label="bom版本：">
                        <el-input disabled v-model="queryForm.bomVer"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="所属车间：" prop="workshopCode">
                        <el-select v-model="queryForm.workshopCode" filterable placeholder="请选择">
                            <el-option v-for="item in shop" :key="item.proccode" :label="item.name" :value="item.proccode"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item label="计划开始：" prop="planStartDate">
                        <el-date-picker type="date" v-model="queryForm.planStartDate" value-format="yyyy-MM-dd"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="计划结束：" prop="planEndDate">
                        <el-date-picker type="date" v-model="queryForm.planEndDate" value-format="yyyy-MM-dd"/>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item label="加工数量：" prop="produceQty">
                        <el-input v-model="queryForm.produceQty" min="0" type="number" autocomplete="off"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="自动派工：">
                        <el-radio v-model="queryForm.workOrder" label="true">是</el-radio>
                        <el-radio v-model="queryForm.workOrder" label="false">否</el-radio>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button icon="el-icon-close" @click="cancel()" >取 消</el-button>
            <el-button icon="el-icon-check" type="primary" @click="save()" >保存</el-button>
        </div>
        <el-dialog title="选择物料" :visible.sync="sltMaterialDialogVisible" width="65%" append-to-body>
            <sltMaterial @save="categoryDialog" @cancel="hidenDialogCancel" />
        </el-dialog>
    </div>
</template>

<script>
    import {queryWorkShop,SavePlanGantt,getBomEffect} from "@/api/productionPlanning";
    import sltMaterial from '../plannedProduction/ppc-bom/materialInfo'
    export default {
        name: "insertProducePlan",
        components: {
            sltMaterial
        },
        data() {
            return {
                queryForm: {
                    materialCode: '',
                    bomCode: '',
                    bomVer: '',
                    workshopCode: '',
                    planStartDate: '',
                    planEndDate:'',
                    produceQty:'',
                    workOrder:"true"
                },
                rules: {
                    materialCode: [{ required: true, message: '请选择物料编码', trigger: 'blur' }],
                    bomCode: [{ required: true, message: 'bom编码不可为空', trigger: 'blur' }],
                    workshopCode: [{ required: true, message: '请选择车间', trigger: 'blur' }],
                    planStartDate: [{ required: true, message: '请输入时间', trigger: 'blur' }],
                    planEndDate: [{ required: true, message: '请输入时间', trigger: 'blur' }],
                    produceQty: [{ required: true, message: '请输入正确数量', trigger: 'blur' }],
                },
                shop:[],
                sltMaterialDialogVisible:false
            };
        },
        methods: {
            sltMaterial(){
                this.sltMaterialDialogVisible = true;
            },
            categoryDialog(data){
                this.queryForm.materialCode = data.materialCode
                this.getBomEffect(data.materialCode)
                this.sltMaterialDialogVisible = false
            },
            hidenDialogCancel(){
                this.sltMaterialDialogVisible = false;
            },
            getBomEffect(materialCode){
                getBomEffect(materialCode).then((response) =>{
                    let data = response.data
                    if(data.success) {
                        this.queryForm.bomCode = data.data.bomCode
                        this.queryForm.bomVer = data.data.bomVer
                    } else {
                        this.queryForm.materialCode="";
                        this.$message.error(data.message + ":" + data.data)
                    }
                })
            },
            getData() {
                queryWorkShop().then((response) => {
                    let data = response.data.data
                    this.shop = data.WORKSHOP_ALL
                })
            },
            cancel() {
                this.$emit("cancel")
            },
            save(){
                this.$refs["queryForm"].validate((valid, object) => {
                    if (valid) {
                        SavePlanGantt(this.queryForm).then((response) => {
                            let data = response.data
                            if (data.success) {
                                this.$message.success("新增成功")
                                this.$emit("save")
                            } else {
                                this.$message.error(data.message + ":" + data.data)
                            }
                        })

                    } else {
                        this.$message.error(Object.values(object)[0][0].message)
                    }
                })

            }
        },
        mounted() {
            this.getData();
        }
    };
</script>
<style>
    .insertProducePlan .el-input{
        width:170px;
    }
    .insertProducePlan .el-date-editor{
        width:170px !important;
    }
</style>
