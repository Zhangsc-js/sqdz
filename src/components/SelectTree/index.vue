<template style="height: 100%;">
  <div style="height: 100%;width: 100%">
    <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
    <el-tree
      style="height: 60vh;overflow: auto;"
      :data="treeData"
      class="filter-tree"
      default-expand-all
      :show-checkbox="showCheckbox"
      node-key="id"
      highlight-current
      :props="defaultProps"
      :check-strictly="checkStrictly"
      :default-checked-keys="defaultCheckedKeys"
      :expand-on-click-node="false"
      :accordion="false"
      ref="tree"
      :filter-node-method="filterNode"
    ></el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="saveSelectNode">确定</el-button>
    </span>
  </div>
</template>

<script>
import { isEmptyArray } from "@/utils/index";
export default {
  name: "SelectTree",
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      filterText: "",
      defaultCheckedKeys: []
    };
  },
  props: {
    rootNode: {
      type: Array,
      default: () => []
    },
    showCheckbox: {
      type: Boolean,
      default: true
    },
    multipleSelection: {
      type: Boolean,
      default: false
    },
    requestUrl: {
      type: Function,
      required: true
    },
    checkStrictly: {
      type: Boolean,
      default: true
    },
    queryParams: {
      type: Object,
      default: null
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      const params = this.queryParams ? this.queryParams : null;
      this.requestUrl(params)
        .then(response => {
          const result = response.data;
          if (result.success) {
            this.treeData = result.data.data;
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    saveSelectNode() {
      let selectNodes = this.$refs.tree.getCheckedNodes();
      if (isEmptyArray(selectNodes)) {
        this.$message.error("请至少选择一个节点");
      }
      if (this.multipleSelection) {
        this.$emit("saveSelectNode", selectNodes);
        // 清空选择项
        this.$refs.tree.setCheckedKeys([]);
      } else {
        if (selectNodes.length > 1) {
          this.$message.error("请勿多选");
        } else {
          this.$emit("saveSelectNode", selectNodes);
          // 清空选择项
          this.$refs.tree.setCheckedKeys([]);
        }
      }
    }
  }
};
</script>
