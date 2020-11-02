<template>
  <SysFactoryModel :params="isEquip" :moduleNo="moduleNo"/>
</template>

<script>
import SysFactoryModel from '@/views/sys/baseData/devTree/fectory-model/index'
export default {
  name: 'FactoryModel',
  components: {
    SysFactoryModel
  },
  data() {
    return {
      isEquip: { isEquip: 1 },
      moduleNo: '01'
    }
  }
}
</script>

<style>

</style>
