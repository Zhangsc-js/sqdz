<template>
  <div class="margin20">
    <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
      <el-tab-pane label="随机样" name="first" :key="'first'">
        <random  v-if="isChildUpdate1"></random>
      </el-tab-pane>
      <el-tab-pane label="定点样" name="second" :key="'second'">
        <regular v-if="isChildUpdate2"></regular>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
    import RandomSpecimen from "./random"
    import RegularSpecimen from "./regular"

    export default {
        name: 'specimen',
        components: {
          random: RandomSpecimen,
          regular: RegularSpecimen
        },
        data(){
            return {
                //默认第一个选项卡
                activeName: "first",
                isChildUpdate1:true,
                isChildUpdate2:false
            }
        },
        mounted(){

        },
        methods:{
            handleClick(tab) {
                if(tab.name == "first") {
                    this.isChildUpdate1 = true;
                    this.isChildUpdate2 = false;
                } else if(tab.name == "second") {
                    this.isChildUpdate1 = false;
                    this.isChildUpdate2 = true;
                }
            }
        }
    }
</script>

<style scoped>

</style>
