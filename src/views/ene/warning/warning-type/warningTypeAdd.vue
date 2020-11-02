<template>
    <div>
        <el-form :model="tableData"  label-width="180px" ref="tableData">
            <el-col :span="12">
                <el-form-item label="告警原因" prop="name">
                    <el-input v-model="tableData.name" autocomplete="off"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="能源类型">
                    <el-select value="selectValue" placeholder="能源类型" v-model="tableData.dataType" label="能源类型">
                        <el-option v-for="item in eneType"
                                   :key="item.code"
                                   :label="item.name"
                                   :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="告警类型" prop="code">
                    <el-input v-model="tableData.code" autocomplete="off"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="能源类型描述" prop="descri">
                    <el-input v-model="tableData.descri" autocomplete="off"></el-input>
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

    import {addWarning} from '@/api/energy'

    export default {
        name: "warningTypeAdd",
        data() {
            return {
                tableData: {
                    code: '',
                    name: '',
                    descri: '',
                    dataType: '',
                },
                selectValue:''
            }
        },
        props: ['eneType'],
        methods: {
            save() {
                const params = {
                    ...this.tableData,
                };
                addWarning(params).then(response => {
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
                    this.$refs['tableData'].resetFields();
                    this.$emit("save")
                })
            },
            cancel() {
                this.$refs['tableData'].resetFields();
                this.$emit("cancel")
            }
        },
        mounted() {

        }
    }
</script>

<style scoped>

</style>
