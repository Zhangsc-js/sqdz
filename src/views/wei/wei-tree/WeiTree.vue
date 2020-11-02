<template>
  <SysFactoryModel :params="params" :moduleNo="moduleNo"/>
</template>

<script>
import SysFactoryModel from '@/views/sys/baseData/devTree/fectory-model/index'
export default {
  name: 'WeiTree',
  components: {
    SysFactoryModel
  },
  data() {
    return {
      params: { isjj: 1 },
      moduleNo: '02'
    }
  }
}
</script>

<style>

</style>
