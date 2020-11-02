<template>
  <div class="menuList">
    <el-row style="margin-bottom:10px">
      <el-button type="primary" @click="save">保存</el-button>
    </el-row>
    <el-tree
      :data="data"
      show-checkbox
      node-key="menuCode"
      :props="defaultProps"
      ref="tree"
      :default-checked-keys="arr"
      :expand-on-click-node="false"
    ></el-tree>
  </div>
</template>

<script>
import { mobileGetByMenu, mobileSaveMenuRole } from "@/api/role";
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
      if (this.label == "mobile") {
        this.initMobile();
      }
    },
    label() {
      if (this.label == "mobile") {
        this.initMobile();
      }
    }
  },
  methods: {
    initMobile() {
      if (this.roleId) {
        if (this.label == "mobile") {
          let params = {
            roleId: this.roleId,
            userCode: this.loginUserCode
          };
          mobileGetByMenu(params).then(res => {
            let data = res.data;
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
      mobileSaveMenuRole(this.roleId, menuIds).then(response => {
        let data = response.data;
        if (data.success) {
          this.$message.success("保存成功！！");
          this.initMobile();
        }
      });
    },
    getChecked(data) {
      data.forEach(item => {
        if (item.boo && !item.children) {
          this.arr.push(item.menuCode);
        }
        if (item.children) {
          this.getChecked(item.children);
        }
      });
      console.log(this.arr);
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
