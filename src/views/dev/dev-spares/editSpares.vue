<template>
    <div>
        <el-form :model="tableData" label-width="180px" ref="tableData" :rules="rule">
            <el-row>
                <el-col :span="10">
                    <el-form-item label="备品备件编码：" prop="sparesCode">
                        <el-input v-model="tableData.sparesCode" autocomplete="off" :disabled="isDisable"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="备品备件名称：" prop="sparesName">
                        <el-input v-model="tableData.sparesName" autocomplete="off"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="规格：" prop="specification">
                        <el-input v-model="tableData.specification" autocomplete="off" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="型号：" prop="modelNumber">
                        <el-input v-model="tableData.modelNumber" autocomplete="off"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="材质：" prop="quality">
                        <el-input v-model="tableData.quality" autocomplete="off" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="颜色：" prop="color">
                        <el-input v-model="tableData.color" autocomplete="off"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="性质：" prop="quality">
                        <el-select
                            v-model="tableData.sparesType"
                            filterable
                            placeholder="请选择"
                            style="width: 100%;height: 100%"
                        >
                            <el-option
                                v-for="(item,index) in this.SPARES_TYPE"
                                :key="index"
                                :label="item.label"
                                :value="item.code"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="补货方式：" prop="replenishType">
                        <el-select
                            v-model="tableData.replenishType"
                            filterable
                            placeholder="请选择"
                            style="width: 100%;height: 100%"
                        >
                            <el-option
                                v-for="(item,index) in this.REPLENISH_TYPE"
                                :key="index"
                                :label="item.label"
                                :value="item.code"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="最小库存：" prop="minInventory">
                        <el-input v-model="tableData.minInventory" type="number" min="0" />
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="再订货点：" prop="reorderPoint">
                        <el-input v-model="tableData.reorderPoint" type="number" min="0" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="补货量：" prop="replenishQty">
                        <el-input v-model="tableData.replenishQty" type="number" min="0" />
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="单位：" prop="primaryUnitCode">
                        <el-select
                            v-model="tableData.primaryUnitCode"
                            filterable
                            placeholder="请选择"
                            style="width: 100%;height: 100%"
                        >
                            <el-option
                                v-for="(item,index) in this.UNIT_ALL"
                                :key="index"
                                :label="item.label"
                                :value="item.code"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button icon="el-icon-close" @click="cancel()">取 消</el-button>
            <el-button type="primary" icon="el-icon-check" @click="save()">保存</el-button>
        </div>
    </div>
</template>

<script>
    import {
        initSparesData,
        getSparesById,
        saveSpares
    } from "@/api/dev/devSpares";
    export default {
        name: "editSpares",
        data() {
            return {
                tableData: {
                    sparesCode: "",
                    sparesName: "",
                    specification: "",
                    quality: "",
                    modelNumber: "",
                    color: "",
                    sparesType: "",
                    replenishType: "",
                    primaryUnitCode: "",
                    safeInventory: 999,
                    maxInventory: 9999,
                    minInventory: 0,
                    reorderPoint: 9999,
                    maxOrderQuantity: 9999,
                    purchaseCycle: 0
                },
                isDisable: false,
                SPARES_TYPE:[],
                REPLENISH_TYPE:[],
                UNIT_ALL: [],
                rule: {
                    sparesCode: [{ required: true, message: "请输入备品备件编码" }],
                    sparesName: [
                        { required: true, message: "请输入备品备件名称", trigger: "blur" }
                    ],
                    specification: [
                        { required: true, message: "请输入规格", trigger: "blur" }
                    ],
                    modelNumber: [
                        { required: true, message: "请输选择型号", trigger: "blur" }
                    ],
                    quality: [
                        { required: true, message: "请输输入材质", trigger: "blur" }
                    ],
                    sparesType: [
                        { required: true, message: "请选择备品备件性质", trigger: "blur" }
                    ],
                    replenishType: [
                        { required: true, message: "请选择补货方式", trigger: "blur" }
                    ],
                    minInventory: [
                        { required: true, message: "请输入最小库存", trigger: "blur" }
                    ],
                    reorderPoint: [
                        { required: true, message: "请输入再订货点", trigger: "blur" }
                    ],
                    replenishQty: [
                        { required: true, message: "请输入补货量", trigger: "blur" }
                    ],
                    primaryUnitCode: [
                        { required: true, message: "请选择单位", trigger: "blur" }
                    ]
                }
            };
        },
        props: {
            id: {
                type: String,
                required: true
            },
            type: {
                type: String,
                required: true
            },
            trigger: {
                type: Boolean,
                required: true
            },
        },
        watch: {
            trigger() {
                if (this.trigger) this.getData();
            }
        },

        mounted() {
            this.initData();
        },
        methods: {
            initData() {
                initSparesData()
                    .then(response => {
                        if (response.data.success) {
                            this.SPARES_TYPE = response.data.data.SPARES_TYPE;
                            this.REPLENISH_TYPE = response.data.data.REPLENISH_TYPE;
                            this.UNIT_ALL = response.data.data.UNIT_ALL;
                            this.getData();
                        } else {
                            this.$message.error(
                                response.data.message + ":" + response.data.data
                            );
                        }
                    })
                    .catch(e => {
                        this.$message.error(e.message);
                    });
            },
            save() {
                this.$refs["tableData"].validate((valid, object) => {
                    if (valid) {
                        saveSpares(this.tableData)
                            .then(response => {
                                const result = response.data;
                                if (result.success) {
                                    this.$message.success(
                                        this.type == "1" ? "新增成功" : "更新成功"
                                    );
                                    this.$emit("save");
                                } else {
                                    this.$message.error(result.message + ":" + result.data);
                                }
                            })
                            .catch(e => {
                                this.$message({
                                    type: "error",
                                    message: e.message
                                });
                            });
                    } else {
                        this.$message.error(Object.values(object)[0][0].message);
                    }
                });
            },
            reSet() {
                this.tableData = {
                    sparesCode: "",
                    sparesName: "",
                    specification: "",
                    quality: "",
                    modelNumber: "",
                    color: "",
                    id: "",
                    dwgNo: "",
                    primaryUnitCode: "",
                    minInventory: 0,
                    reorderPoint: 0,
                    replenishQty: 0
                };
            },
            getData() {
                if (this.type == "1") {
                    this.isDisable = false;
                    this.reSet();
                    this.$refs["tableData"].resetFields();
                } else {
                    this.isDisable = true;
                    getSparesById(this.id)
                        .then(response => {
                            if (response.data.success) {
                                this.tableData = response.data.data.rows[0];
                            }else{
                                this.$message.error(
                                    response.data.message + ":" + response.data.data
                                );
                            }
                        })
                        .catch(e => {
                            this.$message({
                                type: "error",
                                message: e.message
                            });
                        });
                }
            },
            cancel() {
                this.$emit("cancel");
            }
        }
    };
</script>

<style lang="css" scoped>
    .el-select {
        width: 265.1px;
    }
</style>
