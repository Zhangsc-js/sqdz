<template>
    <div>
        <el-form ref="addForm" label-width="120px" :model="addForm" :rules="rules">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="设备名称" prop="name">
                        <el-input v-model="addForm.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="序号" prop="xh">
                        <el-input v-model="addForm.xh"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="是否生成设备" prop="issproduction">
                        <!--<el-select v-model="addForm.issproduction" placeholder="请选择">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>-->
                        <el-radio v-model="addForm.issproduction" :label="1">是</el-radio>
                        <el-radio v-model="addForm.issproduction" :label="0">否</el-radio>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="是否检斤设备" prop="isjj">
                        <!--<el-select v-model="addForm.isjj" placeholder="请选择">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>-->
                        <el-radio v-model="addForm.isjj" :label="1">是</el-radio>
                        <el-radio v-model="addForm.isjj" :label="0">否</el-radio>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel()">取 消</el-button>
            <el-button type="primary" @click="save()">保存</el-button>
        </div>
    </div>
</template>

<script>
    import {addWeiDevTreeNode} from "@/api/weighing";

    export default {
        name: "TreeNodeAdd",
        props: {
            pproCode: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                addForm: {
                    name: '',
                    pproCode: '',
                    xh: null,
                    issproduction: null,           // 是否生成设备
                    iscg: null,                    // 是否槽罐
                    isjj: 1,                    // 是否检斤设备
                },
                options: [
                    {
                        label: '是',
                        value: 1
                    },
                    {
                        label: '否',
                        value: 0
                    }
                ],
                rules: {
                    name: [{required: true, message: '请输入设备名称', trigger: 'blur'}]
                }
            }
        },
        methods: {
            save() {
                this.$refs['addForm'].validate(valid => {
                    if (valid) {
                        this.addForm.pproccode = this.pproCode
                        addWeiDevTreeNode(this.addForm).then(response => {
                            const result = response.data
                            if (result.success) {
                                this.$message.success('保存成功')
                                this.$refs['addForm'].resetFields()
                            } else {
                                this.$message.error(result.message)
                            }
                        }).catch(e => {
                            this.$message.error(e.message)
                        }).finally(() => {
                            this.$emit('treeHidenDialog')
                        })
                    } else {
                        this.$message.error('保存失败，请检查必填项是否都正确填写')
                        return false
                    }
                })
            },
            cancel() {
                this.$emit('treeHidenDialog')
            }
        }
    }
</script>

<style scoped>

</style>
