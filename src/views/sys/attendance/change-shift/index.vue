<template>
    <div class="margin20">
        <el-tabs type="border-card">
  <el-tab-pane label="我的排班">
      <my-shift/>
  </el-tab-pane>
  <el-tab-pane label="换班记录">
       <change-history/>
  </el-tab-pane>
</el-tabs>
        
       
    </div>
</template>

<script>
import ChangeHistory from './change-history'
import MyShift from './my-shift'
    export default {
        name: 'changeshift',
        components:{
            ChangeHistory,
            MyShift
        }
    }
</script>

<style scoped>

</style>