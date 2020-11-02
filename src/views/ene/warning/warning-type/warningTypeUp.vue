<template>
    <div>
        <el-form :model="tableData" label-width="180px" ref="tableData">
            <el-col :span="12">
                <el-form-item label="告警原因">
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
                <el-form-item label="告警类型">
                    <el-input v-model="tableData.code" autocomplete="off"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="能源类型描述">
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

    import {upWarning,selectWarningById} from '@/api/energy'

    export default {
        name: "warningTypeUp",
        data() {
            return {
                selectValue:'',
                tableData:{
                    code: '',
                    name: '',
                    descri: '',
                    dataType: '',
                }
            }
        },
        watch: {
            id () {
                this.selectWarningById(this.id)
            }
        },
        props: ['eneType','id'],
        methods: {
            save() {
                upWarning(this.tableData).then(response => {
                    const result = response.data;
                    if (result.success) {
                        this.$message.success("修改成功")
                        this.$refs['tableData'].resetFields();
                    } else {
                        this.$message.error(result.message)
                    }
                }).catch(e => {
                    this.$message({
                        type: 'error',
                        message: e.message
                    })
                }).finally(() => {
                    this.$emit("save")
                })
            },
            cancel() {
                this.$emit("cancel")
                this.$refs['tableData'].resetFields();
            },
            selectWarningById(){
                selectWarningById(this.id).then((response) =>{
                    this.tableData = response.data.data;
                }).catch(e => {
                    this.$message.error(e.message);
                })
            }
        },
        mounted() {
            this.selectWarningById();
        }
    }
</script>

<style scoped>

</style>
