<template>
  <div class="addDepart" style="height:100%">
    <el-tree
      class="treeHeight"
      :data="treeData"
      show-checkbox
      check-strictly
      default-expand-all
      ref="addTree"
      node-key="label"
      :default-checked-keys="labels"
    ></el-tree>
    <el-row style="padding:15px">
      <el-button icon="el-icon-plus" type="primary" @click="addTree">确定</el-button>
    </el-row>
  </div>
</template>

<script>
import { departmentTree } from "@/api/sys";
export default {
  props: {
    labels: {
      type: Array,
      required: true
    },
    count: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      treeData: [],
      defaultExpanded: []
    };
  },
  methods: {
    getData() {
      departmentTree().then(response => {
        let data = response.data;
        if (data.success) {
          this.treeData = data.data.treeData;
          this.sltDepartment = data.data.sltDepartment;
          // 默认展开以一个节点
          //   this.defaultExpanded = [this.treeData[0].children[0].id];
          //   let node = this.treeData[0].children[0];
          //   for (let i = 0; i < 5; i++) {
          //     if (node.children) {
          //       if (node.children.length > 0) {
          //         this.defaultExpanded.push(node.children[0].id);
          //         node = node.children[0];
          //       }
          //     } else {
          //       break;
          //     }
          //   }
        }
      });
    },
    addTree() {
      let ids = this.$refs["addTree"].getCheckedNodes().map(item => {
        return item.id;
      });
      let names = this.$refs["addTree"].getCheckedNodes().map(item => {
        return item.label;
      });
      this.$emit("saveDepart", ids, names);
    }
  },
  mounted() {
    this.getData();
  },
  watch: {
    count() {
      this.$nextTick(() => {
        this.$refs["addTree"].setCheckedKeys([]);
      });
    }
  }
};
</script>

<style scoped>
.treeHeight {
  max-height: calc(100% - 55px - 62px);
}
</style>
