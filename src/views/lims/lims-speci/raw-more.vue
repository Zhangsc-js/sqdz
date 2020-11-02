<template>
    <div>
        <el-form :model="materialInfo" ref="materialInfo" label-width="100px">
            <el-col :span="12">
                <el-form-item label="来料名称:" prop="materialName">
                    <span>{{materialInfo.materialName}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="供应商:" prop="supplier">
                    <span>{{materialInfo.supplier}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="车牌号:" prop="truckNo">
                    <span>{{materialInfo.truckNo}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="来料时间:" prop="comingTime">
                    <span>{{materialInfo.comingTime}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="送料人:" prop="comingSend">
                    <span>{{materialInfo.comingSend}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="量:" prop="comingNum">
                    <span>{{materialInfo.comingNum}} {{materialInfo.comingUnit}}</span>
                </el-form-item>
            </el-col>
        </el-form>
        <div style="clear:left;"></div>
    </div>
</template>

<script>
    import { getIncomingInfo } from '@/api/lims'
    export default {
        name: 'rawMore',
        data() {
            return {
                materialInfo:{},
                //formLabelWidth: '100px'
            }
        },
        props: {
            selSpecimen:{
                type: String,
                required: true
            }
        },
        watch:{
            selSpecimen(){
                this.getData();
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            getData(){
                getIncomingInfo(this.selSpecimen).then((response) => {
                    const result = response.data;
                    if (result.success) {
                        this.materialInfo = Object.assign({}, result.data);
                    } else {
                        this.$message({
                            type: 'error',
                            message: result.message
                        })
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
