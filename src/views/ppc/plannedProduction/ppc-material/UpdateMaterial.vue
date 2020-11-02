<!--<template>-->
<!--    <div>-->
<!--        <el-form :model="tableData" label-width="180px" ref="tableData">-->
<!--            <el-row>-->
<!--                <el-col :span="12">-->
<!--                    <el-form-item label="物料编号">-->
<!--                        <el-input v-model="tableData.materialCode" autocomplete="off"></el-input>-->
<!--                    </el-form-item>-->
<!--                </el-col>-->
<!--                <el-col :span="12">-->
<!--                    <el-form-item label="物料名称">-->
<!--                        <el-input v-model="tableData.materialName" autocomplete="off"></el-input>-->
<!--                    </el-form-item>-->
<!--                </el-col>-->
<!--            </el-row>-->
<!--            <el-row>-->
<!--                <el-col :span="12">-->
<!--                    <el-form-item label="物料规格">-->
<!--                        <el-input v-model="tableData.specification" autocomplete="off"></el-input>-->
<!--                    </el-form-item>-->
<!--                </el-col>-->
<!--                <el-col :span="12">-->
<!--                    <el-form-item label="物料材质">-->
<!--                        <el-input v-model="tableData.quality" autocomplete="off"></el-input>-->
<!--                    </el-form-item>-->
<!--                </el-col>-->
<!--            </el-row>-->
<!--            <el-row>-->
<!--                <el-col :span="12">-->
<!--                    <el-form-item label="物料类别">-->
<!--                        <el-select v-model="tableData.category" filterable placeholder="请选择">-->
<!--                            <el-option-->
<!--                                    v-for="item in this.category"-->
<!--                                    :key="item.value"-->
<!--                                    :label="item.lable"-->
<!--                                    :value="item.value">-->
<!--                            </el-option>-->
<!--                        </el-select>-->
<!--                    </el-form-item>-->
<!--                </el-col>-->
<!--                <el-col :span="12">-->
<!--                    <el-form-item label="物料型号">-->
<!--                        <el-input v-model="tableData.modelNumber" autocomplete="off"></el-input>-->
<!--                    </el-form-item>-->
<!--                </el-col>-->
<!--            </el-row>-->
<!--            <el-row>-->
<!--                <el-col :span="12">-->
<!--                    <el-form-item label="供应商方式">-->
<!--                        <el-select v-model="tableData.supplyMode" filterable placeholder="请选择">-->
<!--                            <el-option-->
<!--                                    v-for="item in this.supplyMode"-->
<!--                                    :key="item.value"-->
<!--                                    :label="item.lable"-->
<!--                                    :value="item.value">-->
<!--                            </el-option>-->
<!--                        </el-select>-->
<!--                    </el-form-item>-->
<!--                </el-col>-->
<!--                <el-col :span="12">-->
<!--                    <el-form-item label="所属物料分类">-->
<!--                        <el-input v-model="tableData.materialTypeId" autocomplete="off"></el-input>-->
<!--                    </el-form-item>-->
<!--                </el-col>-->
<!--            </el-row>-->
<!--            <el-row>-->
<!--                <el-col :span="12">-->
<!--                    <el-form-item label="单位">-->
<!--                        <el-input v-model="tableData.primaryUnit" autocomplete="off"></el-input>-->
<!--                    </el-form-item>-->
<!--                </el-col>-->
<!--                <el-col :span="12">-->
<!--                    <el-form-item label="安全库存">-->
<!--                        <el-input v-model="tableData.safeInventory" autocomplete="off"></el-input>-->
<!--                    </el-form-item>-->
<!--                </el-col>-->
<!--            </el-row>-->
<!--            <el-row>-->
<!--                <el-col :span="12">-->
<!--                    <el-form-item label="最大库存">-->
<!--                        <el-input v-model="tableData.maxInventory" autocomplete="off"></el-input>-->
<!--                    </el-form-item>-->
<!--                </el-col>-->
<!--                <el-col :span="12">-->
<!--                    <el-form-item label="最小库存">-->
<!--                        <el-input v-model="tableData.minInventory" autocomplete="off"></el-input>-->
<!--                    </el-form-item>-->
<!--                </el-col>-->
<!--            </el-row>-->
<!--        </el-form>-->
<!--        <div slot="footer" class="dialog-footer">-->
<!--            <el-button @click="cancel()">取 消</el-button>-->
<!--            <el-button type="primary" @click="save()">保存</el-button>-->
<!--        </div>-->
<!--    </div>-->
<!--</template>-->


<!--<script>-->

<!--    import {getMaterialById} from '@/api/productionPlanning'-->
<!--    import {upMaterial} from '@/api/productionPlanning'-->

<!--    export default {-->
<!--        name: "devHandAdd",-->
<!--        data() {-->
<!--            return {-->
<!--                tableData: {-->
<!--                    materialCode: '',-->
<!--                    materialName: '',-->
<!--                    specification: '',-->
<!--                    quality: '',-->
<!--                    category: '',-->
<!--                    modelNumber: '',-->
<!--                    supplyMode: '',-->
<!--                    materialTypeId: '',-->
<!--                    dwgNo: '',-->
<!--                    primaryUnit: '',-->
<!--                    safeInventory: '',-->
<!--                    maxInventory: '',-->
<!--                    minInventory: ''-->
<!--                },-->
<!--                category: [{-->
<!--                    'lable': '产品',-->
<!--                    'value': '1'-->
<!--                }, {-->
<!--                    'lable': '部件',-->
<!--                    'value': '2'-->
<!--                }, {-->
<!--                    'lable': '型号',-->
<!--                    'value': '3'-->
<!--                }, {-->
<!--                    'lable': '原料',-->
<!--                    'value': '4'-->
<!--                }, {-->
<!--                    'lable': '副产品',-->
<!--                    'value': '5'-->
<!--                }, {-->
<!--                    'lable': '联产品',-->
<!--                    'value': '6'-->
<!--                }, {-->
<!--                    'lable': '其他',-->
<!--                    'value': '7'-->
<!--                }],-->
<!--                supplyMode: [{-->
<!--                    'lable': '自制',-->
<!--                    'value': '1'-->
<!--                }, {-->
<!--                    'lable': '采购',-->
<!--                    'value': '2'-->
<!--                }, {-->
<!--                    'lable': '客供',-->
<!--                    'value': '3'-->
<!--                }]-->
<!--            }-->
<!--        },-->
<!--        props: {-->
<!--            id: {-->
<!--                type: String,-->
<!--                required: true-->
<!--            }-->
<!--        },-->
<!--        watch: {-->
<!--            id() {-->
<!--                this.getMaterialById(this.id)-->
<!--            }-->
<!--        },-->
<!--        mounted() {-->
<!--            this.getMaterialById(this.id);-->
<!--        },-->
<!--        methods: {-->
<!--            getMaterialById(id) {-->
<!--                getMaterialById(id).then(response => {-->
<!--                    const result = response.data;-->
<!--                    if (result.success) {-->
<!--                        this.tableData = Object.assign({}, result.data)-->
<!--                    } else {-->
<!--                        this.$message.error("result");-->
<!--                    }-->
<!--                }).catch(e => {-->
<!--                    this.$message.error(e.message)-->
<!--                })-->
<!--            },-->
<!--            save() {-->
<!--                const params = {-->
<!--                    id: this.id,-->
<!--                    ...this.tableData-->
<!--                };-->
<!--                upMaterial(params).then(response => {-->
<!--                    const result = response.data;-->
<!--                    if (result.success) {-->
<!--                        this.$message.success("修改成功")-->
<!--                    } else {-->
<!--                        this.$message.error(result.message)-->
<!--                    }-->
<!--                }).catch(e => {-->
<!--                    this.$message.error(e.message)-->
<!--                }).finally(() => {-->
<!--                    // this.$refs['tableData'].resetFields();-->
<!--                    this.$emit("save")-->
<!--                })-->
<!--            },-->
<!--            cancel() {-->
<!--                this.$emit("cancel")-->
<!--            }-->
<!--        }-->
<!--    }-->
<!--</script>-->

<!--<style lang="css" scoped>-->

<!--    .el-select {-->
<!--        width: 265.1px;-->
<!--    }-->
<!--</style>-->
