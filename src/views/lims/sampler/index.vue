<template>
  <div class="margin20">
    <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
      <el-tab-pane label="待取样" name="first" :key="'first'">
        <unsampled  v-if="isChildUpdate1"></unsampled>
      </el-tab-pane>
      <el-tab-pane label="待送达" name="second" :key="'second'">
        <undelivered v-if="isChildUpdate2"></undelivered>
      </el-tab-pane>
      <!-- <el-tab-pane label="缺样数据" name="miss" :key="'miss'">
        <miss v-if="isChildUpdate3"></miss>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>
<script>
    import Unsampled from "./unsampled"
    import Undelivered from "./undelivered"
    import miss from "./miss"

    export default {
        name: 'sampler',
        components: {
            unsampled: Unsampled,
            undelivered: Undelivered,
            miss:miss
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
                } else if(tab.name == "miss") {
                    this.isChildUpdate1 = false;
                    this.isChildUpdate2 = false;
                    this.isChildUpdate3 = true;
                }
            }
        }
    }
</script>

<style scoped>

</style>
