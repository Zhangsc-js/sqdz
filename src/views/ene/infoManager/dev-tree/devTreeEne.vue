<template>
  <el-tabs
    class="devTree"
    @tab-click="handleClick"
    type="border-card"
    style="height:100%;overflow:hidden"
  >
    <el-tab-pane label="电" ids="elect">
      <SysFactoryModel ref="elect" :params="isElect" :tragger="tragger" :moduleNo="moduleNo"></SysFactoryModel>
    </el-tab-pane>
    <el-tab-pane label="水" lazy ids="water">
      <SysFactoryModel ref="water" :params="isWater" :tragger="tragger" :moduleNo="moduleNo"></SysFactoryModel>
    </el-tab-pane>
    <el-tab-pane label="气" lazy ids="gas">
      <SysFactoryModel ref="gas" :params="isGas" :tragger="tragger" :moduleNo="moduleNo"></SysFactoryModel>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import SysFactoryModel from "@/views/sys/baseData/devTree/fectory-model/index";

export default {
  name: "devTree",
  components: {
    SysFactoryModel
  },
  computed: {},
  data() {
    return {
      moduleNo: "03",
      isWater: { isWater: 1 },
      isGas: { isGas: 1 },
      isElect: { isElect: 1 },
      tragger: Date.parse(new Date()).toString(),
      ids: "elect"
    };
  },
  watch: {},
  mounted() {},
  methods: {
    //tab页切换
    handleClick(tab) {
      this.$nextTick(() => {
        this.$refs[tab.$attrs.ids].getData();
      });
      if (this.ids != tab.$attrs.ids) {
        this.ids = tab.$attrs.ids;
        // this.tragger = Date.parse(new Date()).toString()
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
