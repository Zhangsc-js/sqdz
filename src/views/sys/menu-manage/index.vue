<template>
  <div class="tableshadow margin20">
    <div class="add-btn">
      <el-button type="primary" class="el-button--small" @click="preAppend()">新增一级菜单</el-button>
      <el-button type="danger" class="el-button--small" @click="preRemove()">批量删除</el-button>
    </div>
    <div class="menu-panel">
      <el-tree
        ref="menuTree"
        :data="menuTree"
        :props="defaultProps"
        node-key="id"
        show-checkbox
        default-expand-all
        @node-drag-start="handleDragStart"
        @node-drag-end="handleDragEnd"
        @node-drop="handleDrop"
        :expand-on-click-node="false"
      >
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <span>
            <span>{{ node.label }}</span>
          </span>
          <span>
            <el-button type="text" @click="preAppend(data)"
              >添加子菜单</el-button
            >
            <el-button type="text" @click="preUpdate(data)">更新</el-button>
            <el-button type="text" @click="preRemove(data)">删除</el-button>
          </span>
        </div>
      </el-tree>
    </div>
    <el-dialog title="添加菜单" :visible.sync="dialogAddVisible" width="800px" v-if="dialogAddVisible">
      <add-menu :selData="selData" @getData="getData" @hideDialog="hideDialog" />
    </el-dialog>
    <el-dialog title="更新菜单" :visible.sync="dialogUpdateVisible" width="800px" v-if="dialogUpdateVisible">
      <update-menu :selData="selData" @getData="getData" @hideDialog="hideDialog" />
    </el-dialog>
  </div>
</template>

<script>
import commonApi from "@/utils/common";
import { getMenu, addMenu, delMenu } from "@/api/sys";
import AddMenu from "./add-menu";
import UpdateMenu from "./update-menu";
export default {
  name: "menu-manage",
  components: {
    AddMenu,
    UpdateMenu
  },
  data() {
    return {
      menuTree: [],
      defaultProps: {
        children: "children",
        label: (data, node) => {
          return data.meta.title;
        }
      },
      dialogAddVisible: false,
      dialogUpdateVisible: false,
      selData: null
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      getMenu().then(res => {
        let data = res.data.data.map(item => {
          item.meta = JSON.parse(item.meta);
          return item;
        });
        this.menuTree = commonApi.transformTozTreeFormat(data);
      });
    },
    preAppend(data) {
      if (!data) {
        data = { id: "0" };
      }
      this.dialogAddVisible = true;
      this.selData = data;
    },
    preUpdate(data) {
      this.dialogUpdateVisible = true;
      this.selData = data;
    },
    hideDialog() {
      this.dialogAddVisible = false;
      this.dialogUpdateVisible = false;
    },
    preRemove(data) {
      this.$confirm("此操作将删除对应菜单及所有子菜单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.remove(data);
        })
        .catch(res => {
          this.$message.info("已取消删除");
        });
    },
    remove(data) {
      let arr = [];
      if (!!data) {
        this.getChildIds(data, arr);
      } else {
        arr = this.$refs.menuTree.getCheckedKeys();
      }
      delMenu(arr)
        .then(res => {
          if (res.data.code == 10000) {
            this.getData();
          } else {
            this.$message(res.data.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    getChildIds(data, arr) {
      arr.push(data.id);
      if (data.children && data.children.length > 0) {
        data.children.map(item => {
          this.getChildIds(item, arr);
        });
      }
    },
    handleDragStart(node, ev) {
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
    },
  }
};
</script>
<style>
.menu-panel .el-tree-node__expand-icon.expanded {
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}
</style>
<style scoped>
.menu-panel {
  padding: 20px;
}
.add-btn {
  padding: 20px 0 0 20px;
}
.dialog-footer {
  clear: left;
}
.tableshadow {
  height: auto;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
