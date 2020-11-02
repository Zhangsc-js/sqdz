<!--<template>-->
<!--    <div>-->
<!--        <el-form :model="tableData" label-width="180px" ref="tableData">-->
<!--            <el-col :span="12">-->
<!--                <el-form-item label="子订单号">-->
<!--                    <el-input v-model="tableData.sdNo" autocomplete="off"></el-input>-->
<!--                </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--                <el-form-item label="物料编码">-->
<!--                    <el-input readonly v-on:click.native="sltMaterial"  v-model="tableData.materialCode" ></el-input>-->
<!--                </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--                <el-form-item label="物料名称">-->
<!--                    <el-input readonly  v-model="tableData.materialName" :disabled="true"></el-input>-->
<!--                </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--                <el-form-item label="规格">-->
<!--                    <el-input v-model="tableData.specification" autocomplete="off" :disabled="true"></el-input>-->
<!--                </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--                <el-form-item label="材质">-->
<!--                    <el-input v-model="tableData.quality" autocomplete="off" :disabled="true"></el-input>-->
<!--                </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--                <el-form-item label="Bom编码">-->
<!--                    <el-input v-model="tableData.bomCode" autocomplete="off" :disabled="true"></el-input>-->
<!--                </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--                <el-form-item label="Bom版本">-->
<!--                    <el-input v-model="tableData.bomVer" autocomplete="off" :disabled="true"></el-input>-->
<!--                </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--                <el-form-item label="单位">-->
<!--                    <el-input v-model="tableData.unit" autocomplete="off" :disabled="true"></el-input>-->
<!--                </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--                <el-form-item label="生产标准">-->
<!--                    <el-input v-model="tableData.produceStandard" autocomplete="off"></el-input>-->
<!--                </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--                <el-form-item label="Bom版本">-->
<!--                    <el-input v-model="tableData.bomVer" autocomplete="off"></el-input>-->
<!--                </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--                <el-form-item label="状态">-->
<!--                    <el-select  v-model="tableData.status"  filterable placeholder="请选择" >-->
<!--                        <el-option-->
<!--                                v-for="item in statsMap"-->
<!--                                :key="item"-->
<!--                                :label="item"-->
<!--                                :value="item">-->
<!--                        </el-option>-->
<!--                    </el-select>-->
<!--                </el-form-item>-->
<!--            </el-col>-->
<!--        </el-form>-->
<!--        <div slot="footer" class="dialog-footer">-->
<!--            <el-button @click="cancel()">取 消</el-button>-->
<!--            <el-button type="primary" @click="save()">保存</el-button>-->
<!--        </div>-->
<!--    </div>-->
<!--</template>-->

<!--<script>-->

<!--    import {queryToSelect, statusToSelect,updateSaleDetail,getSaleDetailById} from '@/api/productionPlanning'-->

<!--    export default {-->
<!--        name: "ppcAddMaterial",-->
<!--        data() {-->
<!--            return {-->
<!--                tableData: {-->
<!--                    mainId:'',-->
<!--                    sdNo: '',-->
<!--                    materialId:'',-->
<!--                    materialCode: '',-->
<!--                    specification: '',-->
<!--                    quality: '',-->
<!--                    qty:'',-->
<!--                    unit:'',-->
<!--                    produceStandard:'',-->
<!--                    bomVer:'',-->
<!--                    status:''-->
<!--                },-->
<!--                devMap: [],-->
<!--                statsMap:[]-->
<!--            }-->
<!--        },-->
<!--        props: {-->
<!--            id: {-->
<!--                type: String,-->
<!--                required: true-->
<!--            }-->
<!--        },-->
<!--        watch: {-->
<!--            id () {-->
<!--                this.getData(this.id)-->
<!--            }-->
<!--        },-->
<!--        methods: {-->
<!--            selectChanged(value){-->
<!--                for(let i = 0; i < this.devMap.length; i++){-->
<!--                    if(this.devMap[i].value == value) {-->
<!--                        this.tableData.materialId = this.devMap[i].id;-->
<!--                    }-->
<!--                }-->
<!--            },-->
<!--            save() {-->
<!--                switch (this.tableData.status) {-->
<!--                    case "录入":-->
<!--                        this.tableData.status = "input";-->
<!--                        break;-->
<!--                    case "下达":-->
<!--                        this.tableData.status = "Release";-->
<!--                        break;-->
<!--                    case "完工":-->
<!--                        this.tableData.status = "finish";-->
<!--                        break;-->
<!--                    case "终止":-->
<!--                        this.tableData.status = "termination";-->
<!--                        break;-->
<!--                }-->
<!--               updateSaleDetail(this.tableData).then(response => {-->
<!--                    const result = response.data;-->
<!--                    if (result.success) {-->
<!--                        this.$message.success("修改成功")-->
<!--                    } else {-->
<!--                        this.$message.error(result.message)-->
<!--                    }-->
<!--                }).catch(e => {-->
<!--                    this.$message({-->
<!--                        type: 'error',-->
<!--                        message: e.message-->
<!--                    })-->
<!--                }).finally(() => {-->
<!--                    // this.$refs['tableData'].resetFields();-->
<!--                    this.tableData = {-->
<!--                        mainId:'',-->
<!--                        sdNo: '',-->
<!--                        materialId:'',-->
<!--                        materialCode: '',-->
<!--                        specification: '',-->
<!--                        quality: '',-->
<!--                        qty:'',-->
<!--                        unit:'',-->
<!--                        produceStandard:'',-->
<!--                        bomVer:'',-->
<!--                        status:''-->
<!--                    };-->
<!--                    this.$emit("save")-->
<!--                })-->
<!--            },-->
<!--            getData(id){-->
<!--                getSaleDetailById(id).then(response => {-->
<!--                    const result = response.data;-->
<!--                    if (result.success) {-->
<!--                        this.tableData = Object.assign({}, result.data);-->
<!--                        switch (this.tableData.status) {-->
<!--                            case "input":-->
<!--                                this.tableData.status = "录入";-->
<!--                                break;-->
<!--                            case "Release":-->
<!--                                this.tableData.status = "下达";-->
<!--                                break;-->
<!--                            case "finish":-->
<!--                                this.tableData.status = "完工";-->
<!--                                break;-->
<!--                            case "termination":-->
<!--                                this.tableData.status = "终止";-->
<!--                                break;-->
<!--                        }-->
<!--                    } else {-->
<!--                        this.$message.error("result");-->
<!--                    }-->
<!--                }).catch(e => {-->
<!--                    this.$message.error(e.message)-->
<!--                });-->


<!--                statusToSelect().then((response) => {-->
<!--                    const result = response.data;-->
<!--                    if (result.success) {-->
<!--                        this.statsMap = result.data-->
<!--                    }-->
<!--                }).catch(e => {-->
<!--                    this.$message.error(e.message)-->
<!--                });-->

<!--                queryToSelect().then((response) => {-->
<!--                    const result = response.data;-->
<!--                    if (result.success) {-->
<!--                        this.devMap = result.data-->
<!--                    }-->
<!--                }).catch(e => {-->
<!--                    this.$message.error(e.message)-->
<!--                })-->
<!--            },-->
<!--            cancel() {-->
<!--                this.$emit("cancel")-->
<!--            }-->
<!--        },-->
<!--        mounted() {-->
<!--            this.getData(this.id);-->
<!--        }-->
<!--    }-->
<!--</script>-->

<!--<style lang="css" scoped>-->

<!--    body{-->

<!--    }-->
<!--    .el-select{-->
<!--        width:265.5px;-->
<!--    }-->
<!--</style>-->
