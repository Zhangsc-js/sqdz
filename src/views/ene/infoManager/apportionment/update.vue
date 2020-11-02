<template>
    <div>
        <el-form ref="eneUpd" :modal="eneUpd" label-width="80px">
            <el-col :span="12">
                <el-form-item label="设备名称" prop="procName">
                    <el-input class="ene" v-model="eneUpd.procName" :readonly="true" :disabled="true" width="45%" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="分摊比(%)" prop="proRataShare">
                    <el-input class="ene" type="number" v-model="eneUpd.proRataShare" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="适用时间" prop="canUseOn">
                    <el-date-picker
                            v-model="eneUpd.canUseOn"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="month"
                            placeholder="选择月">
                    </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="使用状态" prop="isUse">
                    <el-radio v-model="eneUpd.isUse" :label="1">启用</el-radio>
                    <el-radio v-model="eneUpd.isUse" :label="0">未启用</el-radio>
                </el-form-item>
            </el-col>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel()">取 消</el-button>
            <el-button type="primary" @click="saveInfo()">保存</el-button>
        </div>
    </div>
</template>

<script>
    import {getEneAppById, updateEneAppById} from '@/api/energy'

    export default {
        name: "apportionmentUpdate",
        data() {
            return {
                eneUpd: {
                    procName:'',
                    proRataShare:0,
                    isUse:0,
                    id:''
                },
                disabled: true,
            }
        },
        props: {
            equipId: {
                type: String,
                required: true
            },
            flagTime:{
                type:Number,
                required: true
            }
        },
        mounted() {
            this.getData(this.equipId)
        },
        watch: {
            equipId() {
                this.getData(this.equipId)
            },
            flagTime(){
                this.getData(this.equipId)
            }
        },
        methods: {
            getData() {
                const params = {
                    id: this.equipId
                };
                getEneAppById(params).then(res => {
                    if (res.data.success){
                        this.eneUpd = res.data.data;
                        this.eneUpd.proRataShare *= 100 ;
                    }else
                        this.$message.error(res.data.message);
                }).catch(e => {
                    this.$message.error(e.message);
                })
            },
            cancel: function () {
                this.$emit('hidenDialog')
            },
            saveInfo: function () {
                this.eneUpd.proRataShare /= 100;
                updateEneAppById(this.eneUpd.id, this.eneUpd).then(res => {
                    if (res.data.success) {
                        this.$message({
                            type: 'success',
                            message: '更新成功'
                        });
                    } else {
                        this.$message.error(res.data.message);
                    }
                }).catch(e => {
                    this.$message.error(e.message);
                }).finally(() => {
                    this.$emit("hidenDialog");
                });
            },
        }
    }
</script>

<style scoped>
.el-input.ene{
    width: 45%;
}
</style>
