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
                <el-form-item label="告警类型" prop="warningVaule">
                    <el-select value="selectValue" placeholder="告警类型" v-model="tableData.warningType" label="告警类型">
                        <el-option v-for="item in eneType"
                                   :key="item.code"
                                   :label="item.name"
                                   :value="item.code">
                        </el-option>
                    </el-select>
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

    import {addWarningCondition} from '@/api/energy'

    export default {
        name: "warningConditionAdd",
        data() {
            return {
                tableData: {
                    meteringCode: '',
                    meteringName: '',
                    equipCode: '',
                    warningRestrict: '',
                    warningName:'',
                    warningType:''
                },
            }
        },
        props:['id','eneType'],
        methods: {
            save() {
                addWarningCondition(this.tableData).then(response => {
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
                this.$emit("cancel")
            }
        }
    }
</script>

<style scoped>

</style>
