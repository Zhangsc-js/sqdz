<template>
    <div>
        <el-form :model="tableData"  label-width="180px" ref="tableData">
            <el-col :span="12">
                <el-form-item label="点位名称" prop="paramName">
                    <el-input v-model="tableData.paramName" autocomplete="off"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="点位编码" prop="paramValue">
                    <el-input v-model="tableData.paramValue" autocomplete="off"></el-input>
                </el-form-item>
            </el-col>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="save('tableData')">保存</el-button>
            <el-button @click="cancel()">取 消</el-button>
            <el-button @click="reset('tableData')">重 置</el-button>
        </div>
    </div>
</template>

<script>
    import {addPoint} from '@/api/energy'
    export default {
        name: "pointAdd",
        data(){
            return{
                tableData:{},
                selectValue:'',
                codes:[],
                energyType:[]
            }
        },
        props: ['eneType'],
        mounted() {

        },
        computed: {
            selectNodeNO() {
                return this.$store.state.sysDev.selectNodeNO;
            }
        },
        methods:{
            save(){
                const params = {
                    ...this.tableData,
                    devNo:this.selectNodeNO
                };
                addPoint(params).then(res =>{
                    const result = res.data;
                    if(result.success){
                        this.$message.success("新增成功")
                    } else {
                        this.$message.error(result.message)
                    }
                }).catch(e =>{
                    this.$message({type:'error', message:e.message})
                }).finally(() => {
                    this.$refs['tableData'].resetFields();
                    this.$emit("hidenDialog")
                })
            },
            cancel() {
                this.$emit("hidenDialog")
            },
            reset(tableData){
                this.$refs[tableData].resetFields();
            }
        }
    }
</script>

<style scoped>

</style>
