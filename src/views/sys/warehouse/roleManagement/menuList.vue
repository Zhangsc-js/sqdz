<template>
  <div class="menuList">
    <el-row style="margin-bottom:10px">
      <el-button type="primary" @click="save">保存</el-button>
    </el-row>
    <el-tree
      :data="data"
      show-checkbox
      node-key="id"
      :props="defaultProps"
      ref="tree"
      :default-checked-keys="arr"
      :expand-on-click-node="false"
    ></el-tree>
  </div>
</template>

<script>
import { getByMenu, saveMenuRole } from "@/api/role";
export default {
  props: {
    roleId: {
      type: String,
      required: true
    },
    loginUserCode: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      data: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      arr: [] //默认选择
    };
  },
  watch: {
    roleId() {
      if (this.label == "pc") {
        this.initPC();
      }
    },
    label() {
      if (this.label == "pc") {
        this.initPC();
      }
    }
  },
  methods: {
    initPC() {
      if (this.roleId) {
        if (this.label == "pc") {
          getByMenu(this.roleId, this.loginUserCode).then(response => {
            let data = response.data;
            if (data.success) {
              this.data = data.data;
              this.arr = [];
              this.getChecked(this.data);
            }
          });
        }
      } else {
        return;
      }
    },
    save() {
      // let menuIds = this.$refs.tree.getCheckedKeys();
      let menuIds = this.$refs.tree
        .getCheckedKeys()
        .concat(this.$refs.tree.getHalfCheckedKeys());
      saveMenuRole(this.roleId, menuIds).then(response => {
        let data = response.data;
        if (data.success) {
          this.$message.success("保存成功！！");
          this.initPC();
        }
      });
    },
    getChecked(data) {
      data.forEach(item => {
        if (item.boo && !item.children) {
          this.arr.push(item.id);
        }
        if (item.children) {
          this.getChecked(item.children);
        }
      });
    }
  },
  mounted() {
    // this.init();
  }
};
</script>

<style scoped>
.el-tree {
  height: 87%;
  overflow: auto;
}
</style>
