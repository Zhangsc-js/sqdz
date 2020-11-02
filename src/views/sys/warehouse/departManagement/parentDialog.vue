<template>
  <div class="parentDialog">
    <el-tree
      ref="treeDialog"
      :data="treeDataDialog"
      show-checkbox
      default-expand-all
      node-key="code"
      highlight-current
      check-strictly
      @check="checkNode"
    ></el-tree>
    <el-button type="primary" icon="el-icon-check" style="margin-left:10px" @click="check">确定</el-button>
  </div>
</template>

<script>
export default {
  props: {
    treeData: {
      required: true
    },
    nodeCode: {
      required: true
    },
    parentCode: {
      required: true
    }
  },
  data() {
    return {
      treeDataDialog: []
    };
  },
  //   computed: {
  //     formartTreeData() {
  //       if (!this.nodeCode) {
  //         return this.treeData;
  //       } else {
  //         let arr = JSON.parse(JSON.stringify(this.treeData));
  //         console.log(arr);
  //         this.setSelects(arr);
  //         return arr;
  //       }
  //     }
  //   },
  methods: {
    init() {
      console.log(11);
      if (!this.nodeCode) {
        this.treeDataDialog = this.treeData;
      } else {
        let arr = JSON.parse(JSON.stringify(this.treeData));
        console.log(arr);
        this.setSelects(arr);
        this.treeDataDialog = arr;
      }
    },
    check() {
      let checked = this.$refs.treeDialog.getCheckedNodes();
      this.$emit("checkSelect", checked[0]);
    },
    // 递归遍历 treeData
    setSelects(arr) {
      this.$nextTick(() => {
        arr.forEach(item => {
          if (item.code == this.parentCode) {
            console.log(item.code);
            this.$refs.treeDialog.setCheckedKeys([item.code]);
          }
          if (item.code == this.nodeCode) {
            this.$set(item, "disabled", true);
            this.setDisabled(item);
          }
          if (item.children && item.children.length > 0) {
            this.setSelects(item.children);
          }
        });
      });
    },
    // 递归 添加 disabled
    setDisabled(item) {
      if (item.children && item.children.length > 0) {
        item.children.forEach(v => {
          this.$set(v, "disabled", true);
          this.setDisabled(v);
        });
      }
    },
    // 点击树节点 ==> 排他 只能选择一个
    checkNode(current, checks) {
      this.$refs.treeDialog.setCheckedKeys([current.code]);
    }
  }
};
</script>

<style>
</style>
