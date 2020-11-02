<template>
    <div>
        <el-form :model="tableData" label-width="200px" ref="tableData" :rules="rule">
            <el-row>
                <el-col :span="10">
                    <el-form-item label="订单号：" prop="soNo">
                        <el-input v-model="tableData.soNo" autocomplete="off" :disabled="type!='1'"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="订单名：" prop="soName">
                        <el-input v-model="tableData.soName" autocomplete="off" :disabled="type!='1'"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="销售部门：" prop="departCode">
                        <el-select  v-model="tableData.departCode"  filterable placeholder="请选择"  style="width: 100%" @change="selectChanged">
                            <el-option
                                    v-for="item in devMap"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="业务员：" prop="salesPersonName">
                        <el-select  v-model="tableData.salesPersonName"  filterable placeholder="请选择"  style="width: 100%" >
                            <el-option
                                v-for="item in userList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="下单日期：" prop="receiveDate">
                        <el-date-picker type="date" v-model="tableData.receiveDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss"  style="width: 100%" :disabled="tableData.status!=10"/>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="交货日期：" prop="deliveryDate">
                        <el-date-picker type="date" v-model="tableData.deliveryDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss"  style="width: 100%" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="采购商名称：" prop="customerCode">
                        <el-input v-model="tableData.customerCode" autocomplete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="采购商联系人：" prop="customerLinkPerson">
                        <el-input v-model="tableData.customerLinkPerson" autocomplete="off"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="采购商联系方式：" prop="customerLinkPhone">
                        <el-input v-model="tableData.customerLinkPhone" autocomplete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="状态：" prop="status">
                        <el-select  v-model="tableData.status"  filterable placeholder="请选择"  style="width: 100%" :disabled="true">
                            <el-option
                                    v-for="item in statsMap"
                                    :key="item.code"
                                    :label="item.label"
                                    :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button icon="el-icon-close" @click="cancel()">取 消</el-button>
            <el-button icon="el-icon-check" type="primary" @click="save()">保存</el-button>
        </div>
    </div>
</template>

<script>

    import {selectDepart, statusToSelect,addSale,getSaleCode,getSaleById} from '@/api/productionPlanning'
    import {sltUserByDepartId} from '@/api/sys'

    export default {
        name: "ppcAddMaterial",
        data() {
            return {
                tableData: {
                    soNo: '',
                    soName:'',
                    departCode: '',
                    departName: '',
                    salesPersonName: '',
                    receiveDate: new Date(),
                    deliveryDate:'',
                    customerCode:'',
                    customerLinkPerson:'',
                    customerLinkPhone:'',
                    status:'10'
                },
                rule:{
                    soNo: [{ required: true, message: '请输入订单单号', trigger: ['change','blur'] }],
                    soName:[{ required: true, message: '请输入订单名', trigger: ['change','blur']}],
                    receiveDate: [{ required: true, message: '请输入接单日期', trigger: ['change','blur'] }],
                    deliveryDate: [{ required: true, message: '请输入交货日期', trigger: ['change','blur'] }],
                    departCode: [{ required:true, message:'请选择销售部门', trigger:['change','blur']}],
                    salesPersonName: [{ required:true, message:'请选择业务人员', trigger:['change','blur']}]
                },
                devMap: [],
                statsMap:[],
                disabled:false,
                readonly:true,
                userList:[]
            }
        },
        props: {
            trigger: {
                type: Boolean,
                required: true
            },
            type: {
                type: String,
                required: true
            },
            sId: {
                type: String,
                required: true
            },
        },
        methods: {
            reSet(){
                this.tableData = {
                    soNo: '',
                    departCode: '',
                    departName: '',
                    salesPersonName: '',
                    receiveDate: new Date(),
                    deliveryDate:'',
                    customerCode:'',
                    customerLinkPerson:'',
                    customerLinkPhone:'',
                    status:'10'
                };
            },
            selectChanged(value){
                let departId = ''
                for(let i = 0; i < this.devMap.length; i++){
                    if(this.devMap[i].code == value) {
                        this.tableData.departName = this.devMap[i].name;
                        departId = this.devMap[i].id
                    }
                }
                sltUserByDepartId(departId).then(response => {
                    let data = response.data
                    if(data.success) {
                        this.userList = data.data
                    }
                })
            },
            formatDateTime(date){
                const d = new Date(date)
                const resDate = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate())
                return resDate
            },
            p(s) {
                return s < 10 ? '0' + s : s
            },
            save() {
                this.$refs["tableData"].validate((valid,object)=>{
                    if(valid){
                        if(this.formatDateTime(this.tableData.receiveDate) > this.tableData.deliveryDate){
                            this.$message.error("交货日期不能早于下单日期")
                            return;
                        }
                        addSale(this.tableData).then(response => {
                            const result = response.data;
                            if (result.success) {
                                this.$message.success("保存成功")
                                this.reSet();
                                this.$emit("save")
                            } else {
                                this.$message.error(result.message + ":" + result.data)
                            }
                        }).catch(e => {
                            this.$message({
                                type: 'error',
                                message: e.message
                            })
                        })
                    }else{
                        this.$message.error(Object.values(object)[0][0].message)
                    }
                })
            },
            getData(){
                if(this.type=='1'){
                    this.$refs["tableData"].resetFields();
                    getSaleCode().then((response) => {
                        this.tableData.soNo = response.data.data;
                        this.tableData.soName = response.data.data
                    })
                }else{
                    getSaleById(this.sId).then(response => {
                        const result = response.data;
                        if (result.success) {
                            if(result.data.deliveryDate){
                                result.data.deliveryDate+=" 00:00:00";
                            }
                            if(result.data.receiveDate){
                                result.data.receiveDate+=" 00:00:00";
                            }
                            this.tableData = Object.assign({}, result.data)
                        } else {
                            this.$message.error("result");
                        }
                    }).catch(e => {
                        this.$message.error(e.message)
                    });
                }
            },
            cancel() {
                this.$emit("cancel")
            }
        },
        computed: {
            timeDefault() {
                let date = new Date();
                let s1 = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate());
                return s1;
            }
        },
        mounted() {
            selectDepart().then((response) => {
                const result = response.data;
                if (result.success) {
                    this.devMap = result.data
                }
            }).catch(e => {
                this.$message.error(e.message)
            });
            statusToSelect().then((response) => {
                const result = response.data;
                if (result.success) {
                    this.statsMap = result.data.SALE_DETAIL_STATUS
                }
            }).catch(e => {
                this.$message.error(e.message)
            });
            this.getData();
        },
        watch: {
            trigger () {
                if(this.trigger){
                    this.getData();
                }
            }
        },
    }
</script>

<style lang="css" scoped>
    .el-date-editor{
        margin-left: 0px;
        width: 265.5px;
    }
    .el-select{
        width:265.5px;
    }
</style>
