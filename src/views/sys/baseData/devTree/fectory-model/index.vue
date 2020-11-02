<template>
  <div @keyup.esc="menuVisible = false" tabindex="0" style="height: 100%" id="factoryModel">
    <el-container style="height: 100%">
      <el-aside width="250px" style="height: 100%" @click.right.native="clickAside">
        <el-tree
          :data="treeData"
          node-key="id"
          highlight-current
          :expand-on-click-node="false"
          :current-node-key="nodeId"
          default-expand-all
          @node-click="handleNodeClick"
          style="height: 100%;"
        >
          <!-- <template v-slot="{data}">
            <span class="el-icon-folder" style="font-size:14px">{{data.label}}</span>
          </template>-->
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <div>
              <i
                class="el-icon-stopwatch"
                v-if="data.isElect==1"
                :class="{red:data.isReal!=1}"
                style="font-size:14px"
              ></i>
              <i
                class="el-icon-timer"
                v-else-if="data.isWater==1"
                :class="{red:data.isReal!=1}"
                style="font-size:14px"
              ></i>
              <i
                class="el-icon-odometer"
                v-else-if="data.isGas==1"
                :class="{red:data.isReal!=1}"
                style="font-size:14px"
              ></i>
              <i class="el-icon-folder" v-else style="font-size:14px"></i>
              <span style="font-size:14px">{{ node.label }}</span>
            </div>
            <span v-if="moduleNo == '05'">
              <el-button type="text" size="mini" @click="() => moveUp(data)">上移</el-button>
              <el-button type="text" size="mini" @click="() => moveDown(node, data)">下移</el-button>
            </span>
          </span>
        </el-tree>
      </el-aside>
      <div class style="flex:1;height: 100%;overflow:auto">
        <dev-card
          style="height: 100%"
          :showCards="showCards"
          :isEquip="params"
          :moduleNo="moduleNo"
        />
      </div>
    </el-container>
  </div>
</template>
<script>
import DevCard from "./dev-card.vue";
import { createNamespacedHelpers } from "vuex";
import {
  updateDevTreeNode,
  delTreeNode,
  copyTreeNode,
  cutTreeNode,
  downlowdFactoryModelTemp,
  IMPORT_FECTORY,
  getDeviceTypeMap,
  getDevTreeNode,
  moveUp,
  moveDown
} from "@/api/sys/dev";
import { isEmpty, isEmptyArray } from "@/utils/index";
import NodeAdd from "./node-add";
import { getToken } from "@/utils/auth";
import { saveAs } from "file-saver";
const { mapState, mapActions, mapMutations } = createNamespacedHelpers(
  "sysDev"
);

export default {
  name: "Device",
  components: {
    DevCard,
    NodeAdd
  },
  data() {
    return {
      devMap: [],
      menuVisible: false,
      top: 0,
      left: 0,
      selectTreeNode: {},
      sourceNode: {
        id: "",
        sbdm: ""
      },
      dialogVisible: false,
      addDialogVisible: false,
      isCut: false, // 是否为剪切操作
      fileUploadUrl: IMPORT_FECTORY,
      showMore: null,
      nodeCode: null,
      nodeId: null,
      showCards: false,
      token: {
        Authorization: `Bearer ${getToken()}`
      }
      //   默认展开的结点
    };
  },
  props: {
    params: {
      type: Object,
      required: false,
      default: null
    },
    moduleNo: {
      type: String,
      required: false,
      default: "05"
    },
    tragger: {
      type: String,
      required: false,
      default: ""
    }
  },
  computed: {
    ...mapState(["treeData", "defaultExpanded"])
  },
  watch: {
    tragger() {
      this.getData();
    }
  },
  // created() {
  //   this.getData();
  // },
  activated() {
    this.getData();
  },
  methods: {
    ...mapActions(["getTreeData"]),
    ...mapMutations([
      "SET_NODE_NO",
      "SET_TREE_DATA",
      "SET_TEMPNAME",
      "SET_NODE_ID"
    ]),
    getData() {
      this.$nextTick(() => {
        this.getTreeData({ ...this.params });
        if (!isEmptyArray(this.treeData)) {
          this.nodeId = this.treeData[0].id;
          this.SET_NODE_NO(this.treeData[0].code);
        }
      });
    },
    handleNodeClick(data) {
      this.SET_TEMPNAME(data.label);
      this.SET_NODE_NO(data.code);
      this.SET_NODE_ID(data.id);
      this.showCards = !(data.isWorkshop || data.isProcess);
    },
    addNode(node) {
      this.addDialogVisible = true;
      this.nodeCode = node.code;
    },
    hidenDialog() {
      this.addDialogVisible = false;
      this.getData();
    },
    moveUp(data) {
      const params = {
        id: data.id,
        proccode: data.code,
        pproccode: data.parentCode,
        xh: data.xh
      };
      moveUp(params).then(response => {
        const result = response.data;
        if (result.success) {
          this.getData();
          this.$message.success("上移成功");
        } else {
          this.$message.error(result.message);
        }
      });
    },
    moveDown(node, data) {
      const params = {
        id: data.id,
        proccode: data.code,
        pproccode: data.parentCode,
        xh: data.xh
      };
      moveDown(params).then(response => {
        const result = response.data;
        if (result.success) {
          this.getData();
          this.$message.success("下移成功");
        } else {
          this.$message.error(result.message);
        }
      });
    },
    saveInfo() {
      this.dialogVisible = false;
      updateDevTreeNode(this.updateNodeForm)
        .then(response => {
          const result = response.data;
          if (result.success) {
            this.$message.success("更新节点成功");
          } else {
            this.$message.error(result.message);
          }
          this.getData();
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    downloadTemplate() {
      downlowdFactoryModelTemp(this.sels)
        .then(response => {
          const result = response.data;
          if (result) {
            let data = new File([result], { type: "application/octet-stream" });
            saveAs(data, "工厂模型导入模板.xlsx");
            this.getData();
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    uploadSuccess(response) {
      if (response.success) {
        this.$message.success("导入成功");
        setTimeout(() => {
          // 刷新子组件的数据。
          this.$router.go(0);
        }, 2 * 1000);
      } else {
        this.$message.error(response.message);
      }
    },
    uploadError(err) {
      this.$message.error(err.message);
    },
    clickAside(e) {
      window.event.returnValue = false;
      this.setStyle(e);
      this.showMore = false;
      this.menuVisible = true;
    },
    // getMap() {
    //   getDeviceTypeMap()
    //     .then(response => {
    //       const result = response.data;

    //       if (result.success) {
    //         this.devMap = result.data;
    //         this.code = this.devMap.code;
    //       } else {
    //         this.$message.error(result.message);
    //       }
    //     })
    //     .catch(e => {
    //       this.$message.error(e.message);
    //     });
    // },
    setStyle(e) {
      const menuMinWidth = 105;
      const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
      const offsetWidth = this.$el.offsetWidth; // container width
      const maxLeft = offsetWidth - menuMinWidth; // left boundary
      const left = e.clientX - offsetLeft + 60; // 15: margin right
      if (left > maxLeft) {
        this.left = maxLeft;
      } else {
        this.left = left;
      }
      if (e.screenY > 500) {
        this.top = e.clientY - 320;
      } else {
        this.top = e.clientY - 80;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.red {
  color: red;
}
.el-aside {
  overflow: auto;
}
.contextmenu {
  margin: 0;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
  li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;
    &:hover {
      background: #eee;
    }
  }
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
}
</style>

<style>
#factoryModel .el-tree-node__children {
  overflow: inherit !important;
}
#factoryModel .el-tabs {
  overflow: auto !important;
  min-height: 100% !important;
}
</style>
