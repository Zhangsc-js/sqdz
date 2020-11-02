<template>
  <el-tabs type="border-card" style="height: 100%;overflow: hidden">
    <el-tab-pane label="设备信息管理" lazy style="overflow:hidden">
      <dev-attrs/>
    </el-tab-pane>
    <el-tab-pane label="设备相关资料" lazy>
      <!--<dev-attach-file/>-->
    </el-tab-pane>
    <el-tab-pane label="设备相关图片" lazy>
      <!--<dev-img />-->
    </el-tab-pane>
    <el-tab-pane label="设备参数管理" lazy>
      <!--<dev-params/>-->
    </el-tab-pane>
    <!-- <el-tab-pane label="打印二维码" lazy>
      <print-img/>
    </el-tab-pane> -->
  </el-tabs>
</template>

<script>
import DevAttrs from '@/views/ene/infoManager/dev-tree/dev-card/dev-attrs.vue'

export default {
  name: 'DevCardIndex',
  components: {
      DevAttrs
  }
}
</script>

<style scoped>
  .el-tabs__content {
    overflow: scroll;
    height: 100%;
  }
  .app-main{
    overflow: hidden;
  }
</style>
