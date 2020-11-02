<template>
    <div class="uptWorkOrder">
        <div>
            <el-form :inline="true" label-width="120px" :model="queryForm" class="demo-form-inline" ref="queryForm" :rules="rule">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="派工单号：" >
                            <el-input disabled v-model="queryForm.woNo"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="计划单号：">
                            <el-input disabled v-model="queryForm.ppNo"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>


                <el-row>
                    <el-col :span="12">
                        <el-form-item label="物料编码：">
                            <el-input disabled v-model="queryForm.materialCode"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="加工工序：">
                            <el-input disabled v-model="queryForm.processName"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>

                    <el-col :span="12">
                        <el-form-item label="加工车间：" prop="workshopCode">
                            <el-select v-model="queryForm.workshopCode" filterable placeholder="请选择" :disabled="initStatus>='30'">
                                <el-option v-for="item in shop" :key="item.proccode" :label="item.name" :value="item.proccode"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="加工数量：" prop="produceQty">
                            <el-input v-model="queryForm.produceQty" min="0" type="number" autocomplete="off" :disabled="initStatus>='30'"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="计划开始：" prop="planStartDate">
                            <el-date-picker type="datetime" v-model="queryForm.planStartDate" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm:ss" :disabled="initStatus>='30'"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="计划结束：" prop="planEndDate">
                            <el-date-picker type="datetime" v-model="queryForm.planEndDate" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm:ss" :disabled="initStatus>='30'"/>
                        </el-form-item>
                    </el-col>

                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="班组：" prop="teamCode">
                            <el-select v-model="queryForm.teamCode" filterable placeholder="请选择" @change="queryMember" :disabled="initStatus>='30'">

                                <el-option v-for="item in teamMap" :key="item.teamCode" :label="item.teamName" :value="item.teamCode" ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="责任人：" prop="workerCode">
                            <el-select v-model="queryForm.workerCode" placeholder="请选择"  filterable style="width: 100%" :disabled="initStatus>='30'">
                                <el-option v-for="item in dispatchWorkerList" :key="item.value" :label="item.code" :value="item.value"> </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="加工设备：" prop="devCode">
                            <el-select v-model="queryForm.devCode" filterable placeholder="请选择" :disabled="initStatus>='30'">
                                <el-option v-for="item in devMap" :key="item.proccode" :label="item.name" :value="item.proccode"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="工单状态：" >
                            <el-select v-model="queryForm.status" filterable placeholder="请选择" :disabled="true" >
                                <el-option v-for="item in STATUS_LIST" :key="item.code" :label="item.label" :value="item.code"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="el-icon-close" @click="cancel()" :type="initStatus<'30' ? '' : 'primary'">取 消</el-button>
                <el-button icon="el-icon-check" type="primary" @click="save()" v-if="initStatus<'30'">保存</el-button>
            </div>
        </div>

    </div>
</template>

<script>
    import {queryMember,initData} from "@/api/ppc/workshopDispatch";
    import {queryWorkOrder,queryWorkShop,uptworkOrder} from "@/api/productionPlanning";

    export default {
        name: "uptworkOrder",
        components: {

        },
        data() {
            return {
                queryForm: {
                    woNo: '',
                    ppNo: '',
                    materialCode: '',
                    workshopCode: '',
                    devCode: '',
                    startData: '',
                    endData: '',
                    produceQty:'',
                    shift:'',
                    processName:''
                },
                initStatus:'',
                shop:[],
                devMap:[],
                teamMap:[],
                dispatchWorkerList:[],
                STATUS_LIST:[],
                rule:{
                    workshopCode: [{ required: true, message: '请选择车间', trigger: 'blur' }],
                    planStartDate: [{ required: true, message: '请选择开始日期', trigger: 'blur' }],
                    planEndDate: [{ required: true, message: '请选择截止日期', trigger: 'blur' }],
                    teamCode: [{ required: true, message: '请选择班组', trigger: 'blur' }],
                    workerCode: [{ required: true, message: '请选择责任人', trigger: 'blur' }],
                    produceQty: [{ required: true, message: '请输入正确数量', trigger: 'blur' }],
                },

            };
        },
        props: {
            woNo: {
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

                queryWorkOrder(this.woNo).then((response) =>{
                    let data = response.data
                    if(data.success){
                        this.devMap = data.data.DEV_LIST
                        this.teamMap = data.data.teamList
                        data.data.orderMap.processName=data.data.orderMap.processCode+"-"+data.data.orderMap.processName;
                        if(data.data.orderMap.workerCode){
                            this.queryMember(data.data.orderMap.teamCode);
                        }
                        this.queryForm = data.data.orderMap;
                        this.initStatus=data.data.orderMap.status;
                    } else {
                        this.$message.error(data.message + ":" + data.data)
                    }
                })
            },
            cancel() {
                this.$emit("cancel")
            },
            queryMember(teamCode) {
                queryMember(teamCode).then((response) => {
                    if (response.data.success) {
                        this.dispatchWorkerList = response.data.data;
                    } else {
                        this.$message.error(response.data.message + ":" + response.data.data)
                    }
                }).catch(e => {
                    this.$message.error(e.message)
                })
            },
            save(){
                this.$refs["queryForm"].validate((valid,object)=>{
                    if(valid){
                        uptworkOrder(this.queryForm).then((response) => {
                            let data = response.data
                            if(data.success){
                                this.$message.success("成功")
                                this.$emit("save",this.queryForm.woNo)
                            } else {
                                this.$message.error(data.message + ":" + data.data)
                            }
                        })
                    }else{
                        this.$message.error(Object.values(object)[0][0].message)
                    }
                })
            }
        },
        mounted() {
            initData().then((response) => {
                let data = response.data.data
                this.shop = data.WORKSHOP_ALL;
                this.STATUS_LIST = data.WO_STATUS;
            })
            this.getData();
        }
    };
</script>
<style>
    .uptWorkOrder .el-input{
        width:170px;
    }
    .uptWorkOrder .el-date-editor{
        width:170px !important;
    }
</style>
