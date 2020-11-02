<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in" style="height: 100%;">
      <!-- or name="fade" -->
      <!-- <router-view :key="key"></router-view> -->
      <keep-alive :max="10" :exclude="arr">
        <router-view />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: "AppMain",
  computed: {
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  },
  data() {
    return {
      arr: [
        "AuditList",
        "CategoryManage",
        "HistoryFile",
        "operateLog",
        "kanBan",
        "UploadList",
        "runState",
        "singleManagement",
        'shangqi1',
        'shangqi2',
        'shangqi3',
        'shangqi4',
        'shangqi5',
        'shangqi6',
        'shangqi7',
        'shangqi8',
        'shangqi9',
      ]
    };
  }
};
</script>

