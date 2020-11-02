<template>
  <div style="height: 100%">
    <component :is="currPage"></component>
  </div>

</template>

<script>
import aa from '@/views/ene/firstPage/index'
import bb from '@/views/ppc/report/singleManagement'

export default {
  data() {
    return {
      pageList: [aa, bb],
      currPage: aa,
      index: 0
    }
  },
  created() {
    setInterval(() => {
      this.currPage = this.pageList[this.index]
      this.index++;
      this.index = this.index > this.pageList.length - 1 ? 0 : this.index
    }, 10 * 1000)

  },
  beforeDestory() {
    window.clearInterval()
  }
}
</script>

<style>

</style>