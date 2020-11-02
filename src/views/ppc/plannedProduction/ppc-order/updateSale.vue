<template>
    <div>
        <el-form :model="tableData" label-width="180px" ref="tableData">
            <el-col :span="12">
                <el-form-item label="订单编号">
                    <el-input v-model="tableData.soNo" autocomplete="off"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="部门编号" >
                    <el-select  v-model="tableData.departCode"  filterable placeholder="请选择" @change="selectChanged">
                        <el-option
                                v-for="item in devMap"
                                :key="item.name"
                                :label="item.code"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="部门名称">
                    <el-input v-model="tableData.departName" autocomplete="off" readonly></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="业务员">
                    <el-input v-model="tableData.salesPersonName" autocomplete="off"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="接单日期">
                    <el-date-picker type="date" v-model="tableData.receiveDate" value-format="yyyy-MM-dd"
                                    :disabled="disabled"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="交货日期">
                    <el-date-picker type="date" v-model="tableData.deliveryDate" value-format="yyyy-MM-dd"
                                    :disabled="disabled"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="采购商机构">
                    <el-input v-model="tableData.customerId" autocomplete="off"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="采购商联系人">
                    <el-input v-model="tableData.customerLinkPerson" autocomplete="off"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="采购商联系方式">
                    <el-input v-model="tableData.customerLinkPhone" autocomplete="off"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="状态">
                    <el-select  v-model="tableData.status"  filterable placeholder="请选择" >
                        <el-option
                                v-for="item in statsMap"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel()">取 消</el-button>
            <el-button type="primary" @click="save()">保存</el-button>
        </div>
    </div>
</template>

<script>

    import {selectDepart, statusToSelect,getSaleById,updateSale} from '@/api/productionPlanning'

    export default {
        name: "ppcAddMaterial",
        data() {
            return {
                tableData: {
                    soNo: '',
                    departCode: '',
                    departName: '',
                    receiveDate: '',
                    deliveryDate:'',
                    customerId:'',
                    customerLinkPerson:'',
                    customerLinkPhone:'',
                    status:''
                },
                devMap: [],
                statsMap:[],
                disabled:false,
                readonly:true
            }
        },
        props: {
            id: {
                type: String,
                required: true
            }
        },
        watch: {
            id () {
                this.getData(this.id)
            }
        },
        methods: {
            selectChanged(value){
                for(let i = 0; i < this.devMap.length; i++){
                    if(this.devMap[i].id == value) {
                        this.tableData.departName = this.devMap[i].name;
                    }
                }
            },
            save() {
                switch (this.tableData.status) {
                    case "录入":
                        this.tableData.status = "input";
                        break;
                    case "下达":
                        this.tableData.status = "Release";
                        break;
                    case "完工":
                        this.tableData.status = "finish";
                        break;
                    case "终止":
                        this.tableData.status = "termination";
                        break;
                }
                updateSale(this.tableData).then(response => {
                    const result = response.data;
                    if (result.success) {
                        this.$message.success("新增成功")
                    } else {
                        this.$message.error(result.message)
                    }
                }).catch(e => {
                    this.$message({
                        type: 'error',
                        message: e.message
                    })
                }).finally(() => {
                    // this.$refs['tableData'].resetFields();
                    this.tableData = {
                        soNo: '',
                        departCode: '',
                        departName: '',
                        receiveDate: '',
                        deliveryDate:'',
                        customerId:'',
                        customerLinkPerson:'',
                        customerLinkPhone:'',
                        status:''
                    };
                    this.$emit("save")
                })
            },
            getData(id){
                getSaleById(id).then(response => {
                    const result = response.data;
                    if (result.success) {
                        this.tableData = Object.assign({}, result.data)
                        switch (this.tableData.status) {
                            case "input":
                                this.tableData.status = "录入";
                                break;
                            case "Release":
                                this.tableData.status = "下达";
                                break;
                            case "finish":
                                this.tableData.status = "完工";
                                break;
                            case "termination":
                                this.tableData.status = "终止";
                                break;
                        }
                    } else {
                        this.$message.error("result");
                    }
                }).catch(e => {
                    this.$message.error(e.message)
                });
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
                        this.statsMap = result.data
                    }
                }).catch(e => {
                    this.$message.error(e.message)
                })
            },
            cancel() {
                this.$emit("cancel")
            }
        },
        mounted() {
            this.getData(this.id);
        }
    }
</script>

<style lang="css" scoped>

    body{

    }
    .el-date-editor{
        margin-left: 0;
        width: 265.5px;
    }
    .el-select{
        width:265.5px;
    }
</style>
