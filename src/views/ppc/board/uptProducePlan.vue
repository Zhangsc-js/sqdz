<template>
    <div class="upProducePlan">
        <el-form :inline="true" label-width="120px" :model="queryForm" class="demo-form-inline" ref="queryForm" :rules="rules">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="计划单号：" prop="ppNo">
                        <el-input disabled v-model="queryForm.ppNo"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="物料编码：" prop="materialCode">
                        <el-input disabled v-model="queryForm.materialCode"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="所属车间：" prop="workshopCode">
                        <el-select v-model="queryForm.workshopCode" filterable placeholder="请选择" :disabled="queryForm.status>='25'">
                            <el-option v-for="item in shop" :key="item.proccode" :label="item.name" :value="item.proccode"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="计划数量：" prop="produceQty">
                        <el-input v-model="queryForm.produceQty" min="0" type="number" autocomplete="off" :disabled="queryForm.status>='30'"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="计划开始：" prop="planStartDate">
                        <el-date-picker type="datetime" v-model="queryForm.planStartDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :disabled="queryForm.status>='30'"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="计划结束：" prop="planEndDate">
                        <el-date-picker type="datetime" v-model="queryForm.planEndDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :disabled="queryForm.status>='30'"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="状态：">
                        <el-select v-model="queryForm.status" filterable placeholder="请选择" disabled="disabled">
                            <el-option v-for="item in PP_STATUS" :key="item.code" :label="item.label" :value="item.code" ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button icon="el-icon-close" @click="cancel()" :type="queryForm.status<'30' ? '' : 'primary'">取 消</el-button>
            <el-button icon="el-icon-check" v-if="queryForm.status<'30'" type="primary" @click="save()" >保存</el-button>
        </div>
    </div>
</template>

<script>
    import {getProeucePlan,initDataPlanOrder,uptProducePlan} from "@/api/productionPlanning";

    export default {
        name: "uptProducePlan",
        components: {

        },
        data() {
            return {
                queryForm: {
                    ppNo: '',
                    materialCode: '',
                    workshopCode: '',
                    planStartDate: '',
                    planEndDate: '',
                    produceQty:'',
                },
                shop:[],
                PP_STATUS:[],
                rules: {
                    workshopCode: [{ required: true, message: '请选择车间', trigger: 'blur' }],
                    processCode: [{ required: true, message: '请选择工序', trigger: 'blur' }],
                    teamCode: [{ required: true, message: '请选择班组', trigger: 'blur' }],
                    produceQty: [{ required: true, message: '请输入正确数量', trigger: 'blur' }],
                    planStartDate: [{ required: true, message: '请输入时间', trigger: 'blur' }],
                    planEndDate: [{ required: true, message: '请输入时间', trigger: 'blur' }],
                    workerCode: [{ required: true, message: '请选择作业人员', trigger: 'blur' }],
                },
            };
        },
        props: {
            ppId: {
                type: String,
                required: true
            },
            trigger: {
                type: Number,
                required: true
            },
        },
        watch: {
            trigger() {
                this.getData();
            }
        },
        methods: {
            getData() {
                getProeucePlan(this.ppId).then((response) =>{
                    let data = response.data
                    if(data.success){
                        this.queryForm=data.data;
                    } else {
                        this.$message.error(data.message + ":" + data.data)
                    }
                })
            },
            cancel() {
                this.$emit("cancel")
            },
            save(){
                uptProducePlan(this.queryForm).then((response) => {
                    let data = response.data
                    if(data.success){
                        this.$message.success("保存成功")
                        this.$emit("save",this.queryForm.ppNo)
                    } else {
                        this.$message.error(data.message + ":" + data.data)
                    }
                })
            },
            initData(){
                initDataPlanOrder().then((response) => {
                    if(response.data.success){
                        this.shop=response.data.data.WORKSHOP_ALL;
                        this.PP_STATUS=response.data.data.PP_STATUS;
                        this.getData();
                    }else{
                        this.$message.error(response.data.message+":"+response.data.data)
                    }
                })
            }
        },
        mounted() {
            this.initData();
        }
    };
</script>
<style>
    .upProducePlan .el-input{
        width:170px;
    }
    .upProducePlan .el-date-editor{
        width:170px !important;
    }
</style>
