<template>
  <div class="warnMessage" style="height:100%">
    <!-- 上 -->
    <div class="top">
      <warnMessageInfo @row_clcik="row_clcik"></warnMessageInfo>
    </div>
    <!-- 下 -->
    <div class="bottom">
      <responseInfo :warningNo='warningNo'></responseInfo>
    </div>
  </div>
</template>

<script>
import warnMessageInfo from "./warnMessageInfo";
import responseInfo from "./responseInfo";
export default {
  components: {
    warnMessageInfo,
    responseInfo
  },
  data() {
    return {
      topTableData: [],
      personTableData: [],
      warningNo: ''
    };
  },
  methods: {
    row_clcik(row) {
      this.warningNo = row.warningNo
    }
  }
};
</script>

<style scoped lang='scss'>
.top {
  height: 60%;
  width: 100%;
}
.bottom {
  height: 40%;
  width: 100%;
}
</style>
