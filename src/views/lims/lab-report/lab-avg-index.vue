<template>
  <div class="margin20">
    <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
      <el-tab-pane label="定点" name="first" :key="'first'">
          <lab-avg-spot  v-if="isChildUpdate1"></lab-avg-spot>
      </el-tab-pane>
      <el-tab-pane label="随机" name="second" :key="'second'">
        <lab-avg v-if="isChildUpdate2"></lab-avg>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
    import LabAvgSpot from "./lab-avg-spot";
    import LabAvg from "./lab-avg";
    export default {
        name: 'labAvgIndex',
        components: {
            LabAvg,
            LabAvgSpot
        },
        data(){
            return {
                //默认第一个选项卡
                activeName: "first",
                isChildUpdate1:true,
                isChildUpdate2:false,
                isChildUpdate3:false
            }
        },
        mounted(){

        },
        methods:{
            handleClick(tab) {
                if(tab.name == "first") {
                    this.isChildUpdate1 = true;
                    this.isChildUpdate2 = false;
                    this.isChildUpdate3 = false;
                } else if(tab.name == "second") {
                    this.isChildUpdate1 = false;
                    this.isChildUpdate2 = true;
                    this.isChildUpdate3 = false;
                }
            }
        }
    }
</script>

<style scoped>

</style>
