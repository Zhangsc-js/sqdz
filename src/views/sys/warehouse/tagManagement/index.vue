<template>
  <!-- tag点触发源管理 -->
  <div class="tagManagement" style="height:100%">
    <div class="top" style="height:100%">
      <tagInfo @rowClick="rowClick" @del="del"></tagInfo>
    </div>
    <el-dialog
      ref="dialog"
      v-dialogDrag
      append-to-body
      title="tag点触发源参数"
      :modal="false"
      :closeOnClickModal="false"
      :visible.sync="dialogVisible"
      width="70%"
    >
      <tagParams ref="tagParams" :triggerCode="triggerCode" :count="count"></tagParams>
    </el-dialog>
  </div>
</template>

<script>
import tagInfo from "./tagInfo";
import tagParams from "./tagParams";

export default {
  components: {
    tagInfo,
    tagParams
  },
  data() {
    return {
      triggerCode: "",
      count: 1,
      dialogVisible: false
    };
  },
  methods: {
    rowClick(row) {
      this.triggerCode = row.triggerCode;
      this.dialogVisible = true;
    },
    del() {
      this.count++;
    },
    click() {
      alert(1);
    }
  },
  watch: {
    "$route.path"() {
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang='scss' scoped>
.top {
  //   height: 55%;
  width: 100%;
  //   background-color: pink;
}

.bottom {
  //   height: 45%;
  width: 100%;
  margin-top: 20px;
  //   background-color: lime;taggerCode
}
</style>
<style lang='scss'>
.tagManagement .el-dialog__wrapper {
  position: initial !important;
  .el-dialog {
    position: absolute;
    z-index: 5000;
  }
}
</style>
