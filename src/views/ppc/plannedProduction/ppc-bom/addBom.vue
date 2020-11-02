<template>
    <div>
        <el-form :model="tableData" label-width="110px" ref="tableData" :rules="rule">
            <el-row>
                <el-col :span="10">
                    <el-form-item label="BOM编号" prop="bomCode">
                        <el-input v-model="tableData.bomCode" autocomplete="off" style="width: 100%" placeholder="请输入BOM编号"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="BOM名称" prop="bomName">
                        <el-input v-model="tableData.bomName" autocomplete="off" style="width: 100%" placeholder="请输入BOM名称"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="BOM版本" prop="bomVer" >
                        <el-input v-model="tableData.bomVer" autocomplete="off" style="width: 100%" placeholder="请输入BOM版本"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="物料" prop="materialName">
                        <el-input readonly v-on:click.native="sltMaterial" v-model="tableData.materialName" autocomplete="off" style="width: 100%" placeholder="请选择物料"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="状态" prop="versionStatus">
                        <el-select  v-model="tableData.versionStatus"   filterable placeholder="请选择" style="width: 100%">
                            <el-option   v-for="item in bomStatusList" :key="item.code"  :label="item.label" :value="item.code"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="备注" prop="remarks">
                        <el-input v-model="tableData.remarks" autocomplete="off"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button icon="el-icon-close" @click="cancel()">取 消</el-button>
            <el-button icon="el-icon-check" type="primary" @click="save()">保存</el-button>
        </div>

        <el-dialog title="选择物料" :visible.sync="sltMaterialDialogVisible" width="55%" append-to-body>
            <sltMaterial @save="categoryDialog" :category="category" @cancel="hidenDialogCancel" />
        </el-dialog>
    </div>
</template>

<script>

    import {addBom, bomStatus} from '@/api/productionPlanning'
    import sltMaterial from './materialInfo'
    export default {
        name: "ppcAddMaterial",
        components: {
            sltMaterial
        },
        data() {
            return {
                tableData: {
                    bomCode: '',
                    bomName: '',
                    bomVer: '',
                    materialCode: '',
                    materialName:'',
                    versionStatus: '1',
                    remarks: ''
                },
                rule:{
                    bomCode: [{ required: true, message: '请输入BOM编号', trigger: ['change','blur'] }],
                    bomName: [{ required: true, message: '请输入BOM名称', trigger: ['change','blur'] }],
                    bomVer: [{ required: true, message: '请输入BOM版本', trigger: ['change','blur'] }],
                    materialName: [{ required: true, message: '请选择物料', trigger: ['change','blur'] }],
                },
                sltMaterialDialogVisible:false,
                bomStatusList:[],
                category:'1,2,3' //默认查询物料类型产品,部件/半产品,型号
            }
        },
        mounted() {
            this.getData()
        },
        methods: {
            sltMaterial(){
                this.sltMaterialDialogVisible = true;
            },
            categoryDialog(data){
                this.tableData.materialName = data.materialName;
                this.tableData.materialCode = data.materialCode;
                this.sltMaterialDialogVisible = false;
                this.tableData.bomCode = 'BOM'+data.materialCode;
                this.tableData.bomName = 'BOM'+data.materialName;
            },
            hidenDialogCancel(){
                this.$refs["tableData"].resetFields();
                this.sltMaterialDialogVisible = false;
            },
            getData() {
                bomStatus().then((response) => {
                    let result = response.data
                    if(result.success){
                        this.bomStatusList = result.data.BOM_STATUS
                    }
                })
            },
            save() {
                this.$refs["tableData"].validate((valid,object)=>{
                    if(valid){
                       addBom(this.tableData).then(response => {
                            const result = response.data;
                            if (result.success) {
                                this.$message.success("新增成功")
                            } else {
                                this.$message.error(response.data.message+":"+response.data.data)
                            }
                        }).catch(e => {
                            this.$message({
                                type: 'error',
                                message: e.message
                            })
                        }).finally(() => {
                            this.$refs['tableData'].resetFields();
                            this.$emit("save")
                        })
                    }else{
                        this.$message.error(Object.values(object)[0][0].message)
                    }
                })
            },
            cancel() {
                this.$emit("cancel")
            }
        }
    }
</script>

<style lang="css" scoped>

    .el-select {
        width: 265.1px;
    }
</style>
