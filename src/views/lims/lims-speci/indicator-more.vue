<template>
    <div>
        <el-form :model="indicatorInfo" :inline="true" label-width="100px" class="mb20">
          <el-form-item label="收样地点：" prop="receivePlace">
            <span>{{indicatorInfo.receivePlace}}</span>
          </el-form-item>
          <el-form-item label="分析项目：" prop="labIndicator">
            <span>{{indicatorInfo.labIndicator}}</span>
          </el-form-item>
          <el-form-item label="送样时间：" prop="sendTime">
            <span>{{indicatorInfo.sendTime}}</span>
          </el-form-item>
          <el-form-item label="收样时间：" prop="recieveTime">
            <span>{{indicatorInfo.recieveTime}}</span>
          </el-form-item>
        </el-form>
        <el-table :data="indicatorInfo.list" :show-header="!rowSpecimen.missSpeci">
            <el-table-column prop="outCode" align="center" label="分析项目编码"></el-table-column>
            <el-table-column prop="outName" align="center" label="分析项目名称"></el-table-column>
            <el-table-column prop="labOperatorName" align="center" label="化验人员"></el-table-column>
            <el-table-column prop="labTime" align="center" width="180" label="化验时间"></el-table-column>
            <el-table-column prop="typeTime" align="center" width="180" label="录入时间"></el-table-column>
            <el-table-column align="center" label="化验结果">
              <template slot-scope="scope">
                <span v-if="scope.row.reachStandard<=2" style="color:red">{{ scope.row.outindicData }}</span>
                <span v-else style="color: #37B328">{{ scope.row.outindicData }}</span>
              </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import { getindicatorMore } from '@/api/lims'
    export default {
        name: "indicatorMore",
        data() {
            return {
                indicatorInfo:{},
                //formLabelWidth: '100px'
            }
        },
        props: {
            rowSpecimen:{
                type: Object,
                required: true
            }
        },
        watch:{
            rowSpecimen(){
                this.getData();
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            getData(){
               if(!this.rowSpecimen.schedule || !this.rowSpecimen.schedule.scheduleId){
                   this.$message.error("任务单不存在，数据错误");
                   return false;
               }
              getindicatorMore(this.rowSpecimen.schedule.scheduleId).then((response) => {
                    const result = response.data;
                    if (result.success) {
                        if(!!result.data.error){
                            this.$message.error(result.data.error);
                        }else {
                            this.indicatorInfo = result.data;
                            if(!!this.indicatorInfo.labIndicator){
                                this.indicatorInfo.labIndicator = this.indicatorInfo.labIndicator.split("@,,,@").join(" | ").split("<:-:>").join(" --");
                            }else{
                                this.indicatorInfo.labIndicator = "";
                            }
                        }
                    } else {
                      this.$message.error(result.message);
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
