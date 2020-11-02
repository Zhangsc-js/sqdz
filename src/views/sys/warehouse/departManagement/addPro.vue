<template>
  <div class="addPRo" style="height:100%">
    <el-tree
      class="treeHeight"
      :data="treeData"
      show-checkbox
      check-strictly
      node-key="id"
      :default-expanded-keys="defaultExpanded"
      ref="addTree"
    ></el-tree>
    <el-row style="padding:15px">
      <el-button icon="el-icon-plus" type="primary" @click="addTree">确定</el-button>
    </el-row>
  </div>
</template>

<script>
import { findProcessTree } from "@/api/sys/departMentProcess";
import { setDefaultExpanded } from "@/utils/common";

export default {
  data() {
    return {
      treeData: [],
      defaultExpanded: []
    };
  },
  methods: {
    getData() {
      findProcessTree().then(response => {
        let data = response.data;
        if (data.success) {
          this.treeData = data.data;
          setDefaultExpanded(this);
        } else {
          this.$message.error(data.message + ":" + data.data);
        }
      });
    },
    addTree() {
      let data = this.$refs["addTree"].getCheckedNodes().map(item => {
        return item;
      });
      this.$emit("save", data);
    }
  },
  mounted() {
    this.getData();
  }
};
</script>

<style scoped>
.treeHeight {
  max-height: calc(100% - 55px - 62px);
}
</style>
