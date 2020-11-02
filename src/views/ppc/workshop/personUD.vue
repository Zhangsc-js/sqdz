<template>
    <div>
        <el-form :model="updateForm" ref="updateForm" label-width="100px" :rules="rules">
            <el-divider content-position="center">成员信息</el-divider>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="工号" prop="personCode">
                        <el-input v-model="updateForm.personCode" :disabled="disabled"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="姓名" prop="personName">
                        <el-input v-model="updateForm.personName" :disabled="disabled"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="组长" prop="isLeader">
                        <el-select v-model="updateForm.isLeader" placeholder="请选择" :disabled="disabled">
                            <el-option v-for="item in options"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="副组长" prop="isDeputyLeader">
                        <el-select v-model="updateForm.isDeputyLeader" placeholder="请选择" :disabled="disabled">
                            <el-option v-for="item in options"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button v-if="!disabled" type="primary" @click="save()">保存</el-button>
        </div>
    </div>
</template>

<script>
    import {
        getStaffById,
        //getCheckingPlanSelectMap,
        //getCheckingTempMap,
        updateStaff } from "@/api/productionPlanning"

    export default {
        name: 'PersonUD',
        data() {
            return {
                updateForm: {},
                options: [
                    {
                        label: '是',
                        value: 1
                    }, {
                        label: '否',
                        value: 0
                    }
                ],
                rules: {
                    personName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
                    personCode: [{ required: true, message: '请输入工号', trigger: 'blur' }],
                }
            }
        },
        props: {
            disabled: {
                type: Boolean,
                required: true
            },
            personId: {
                type: String,
                required: true
            }
        },
        watch: {
            personId() {
                this.getData()
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.getData()
            })

        },
        methods: {
            getData() {
                getStaffById(this.personId).then(response => {
                    const result = response.data
                    if (result.success) {
                        this.updateForm = result.data
                    } else {
                        this.$message.error(result.message)
                    }
                }).catch(e => {
                    this.$message.error(e.message)
                })
            },
            save() {
                this.$refs['updateForm'].validate(valid => {
                    if (valid) {
                        updateStaff(this.updateForm).then(response => {
                            const result = response.data
                            if (result.success) {
                                this.$message.success('保存成功')
                            } else {
                                this.$message.error(result.message)
                            }
                        }).catch(e => {
                            this.$message.error(e.message)
                        }).finally(() => {
                            this.cancel()
                        })
                    } else {
                        this.$message.error('保存失败，请检查必填项是否都正确填写')
                        return false
                    }
                })
            },
            cancel() {
                this.$emit('hidenDialog')
            }
        }
    }
</script>