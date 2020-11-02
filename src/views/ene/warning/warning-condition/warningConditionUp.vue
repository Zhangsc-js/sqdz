<template>
    <div>
        <el-form :model="tableData" label-width="180px" ref="tableData">
            <el-col :span="12">
                <el-form-item label="计量编号" prop="meteringCode">
                    <el-input v-model="tableData.meteringCode" autocomplete="off"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="计量名称" prop="meteringName">
                    <el-input v-model="tableData.meteringName" autocomplete="off"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="设备编码" prop="equipCode">
                    <el-input v-model="tableData.equipCode" autocomplete="off"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="告警名称" prop="warningName">
                    <el-input v-model="tableData.warningName" autocomplete="off"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="限定值" prop="warningRestrict">
                    <el-input v-model="tableData.warningRestrict" autocomplete="off"></el-input>
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

    import {upWarningCondition,getWarningConditionById} from '@/api/energy'

    export default {
        name: "warningConditionUp",
        data() {
            return {
                tableData: {
                    meteringCode: '',
                    meteringName: '',
                    equipCode: '',
                    warningRestrict: '',
                    warningVaule:'',
                    warningName:''
                },
            }
        },
        props: {
            id: {
                type: String,
                required: true
            }
        },
        watch:{
            id(){
                this.getWarningConditionById();
            }
        },
        mounted(){
            this.getWarningConditionById();
        },
        methods: {
            save() {
                upWarningCondition(this.tableData).then(response => {
                    const result = response.data;
                    if (result.success) {
                        this.$message.success("修改成功")
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
                    this.$emit("save")
                })
            },
            cancel() {
                this.$emit("cancel")
            },
            getWarningConditionById(){
                getWarningConditionById(this.id).then(response => {
                    const result = response.data;
                    if (result.success) {
                        this.tableData = Object.assign({}, result.data)
                    } else {
                        this.$message.error("result");
                    }
                }).catch(e => {
                    this.$message.error(e.message)
                })
            }
        }
    }
</script>

<style scoped>

</style>
