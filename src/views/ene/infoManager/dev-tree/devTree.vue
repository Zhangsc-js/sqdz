<template>
  <el-tabs
    class="devTree"
    v-model="activeName"
    @tab-click="handleClick"
    type="border-card"
    style="height:100%;overflow:hidden"
  >
    <!---->
    <el-tab-pane label="电" name="elect"></el-tab-pane>
    <el-tab-pane label="水" name="water"></el-tab-pane>
    <el-tab-pane label="气" name="gas"></el-tab-pane>
    <el-container style="margin:0px;height:calc(100% - 39px)">
      <el-aside width="252px" style="height: 100%;">
        <el-tree
          :data="treeData"
          node-key="id"
          :expand-on-click-node="false"
          accordion
          highlight-current
          :default-expanded-keys="defaultExpanded"
          @node-click="handleNodeClick"
          @node-contextmenu="handleRightClick"
          style="height: 100%;"
        >
          <template v-slot="{data}">
            <span class="el-icon-folder" style="font-size:14px">{{data.label}}</span>
          </template>
        </el-tree>
        <ul v-show="menuVisible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
          <li v-show="showMore" @click="addNode(selectTreeNode)">新增子节点</li>
          <li v-show="showMore" @click="deleteNode(selectTreeNode)">删除节点</li>
          <li v-show="showMore" @click="updateNode(selectTreeNode)">更新节点</li>
          <li v-show="showMore" @click="copyNode(selectTreeNode)">复制</li>
          <li v-show="showMore" @click="cutNode(selectTreeNode)">剪切</li>
          <li v-show="showMore" @click="pasteNode(selectTreeNode)">粘贴</li>
        </ul>
      </el-aside>
      <el-main class="tableshadow" style="padding:0">
        <devCardIndex style="height: 100%" />

        <el-dialog title="新增子节点" :visible.sync="addTreeDialogVisible" width="65%">
          <tree-node-add
            class="treeAdd"
            :pproCode="nodeCode"
            @treeHidenDialog="treeHidenDialog"
            :lableName="lableName"
          ></tree-node-add>
        </el-dialog>
        <el-dialog title="更新节点" :visible.sync="treeDialogVisible" width="65%">
          <el-form ref="updateNodeForm" label-width="120px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="设备名称" prop="name">
                  <el-input v-model="updateNodeForm.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="序号" prop="xh">
                  <el-input v-model="updateNodeForm.xh"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="是否计量设备" prop="isjl">
                  <el-radio v-model="updateNodeForm.isjl" :label="1">是</el-radio>
                  <el-radio v-model="updateNodeForm.isjl" :label="0">否</el-radio>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否水" prop="isWater">
                  <el-radio v-model="updateNodeForm.isWater" :label="1">是</el-radio>
                  <el-radio v-model="updateNodeForm.isWater" :label="0">否</el-radio>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="是否电" prop="isElect">
                  <el-radio v-model="updateNodeForm.isElect" :label="1">是</el-radio>
                  <el-radio v-model="updateNodeForm.isElect" :label="0">否</el-radio>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否气" prop="isGas">
                  <el-radio v-model="updateNodeForm.isGas" :label="1">是</el-radio>
                  <el-radio v-model="updateNodeForm.isGas" :label="0">否</el-radio>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="treeDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveInfo()">保存</el-button>
          </div>
        </el-dialog>
        <el-dialog :visible.sync="dialogVisible1">
          <swiper :options="swiperOption" ref="mySwiper" style="width:800px">
            <swiper-slide v-for="item in proImgList" :key="item">
              <img style="width:800px;text-align:center" :src="item.url" alt />
            </swiper-slide>
            <div class="swiper-button-prev" slot="button-prev" prevButton></div>
            <div class="swiper-button-next" slot="button-next"></div>
          </swiper>
        </el-dialog>
      </el-main>
    </el-container>
  </el-tabs>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import {
  getEneDevTree,
  delDev,
  delEneTreeNode,
  getEneTreeByNode,
  udEneTreeNode,
  copyEneDevTreeNode,
  cutEneDevTreeNode
} from "@/api/energy";
import TreeNodeAdd from "./tree-node-add";
import { isEmpty } from "@/utils/index";
import devCardIndex from "@/views/ene/infoManager/dev-tree/dev-card-index.vue";
const { mapState, mapActions, mapMutations } = createNamespacedHelpers(
  "eneDev"
);
import { setDefaultExpanded } from "@/utils/common";

export default {
  name: "devTree",
  components: {
    TreeNodeAdd,
    devCardIndex
  },
  computed: {
    ...mapState(["activeName", "isElect", "isWater", "isGas", "selectNo"])
  },
  data() {
    return {
      showInfo: false,
      //   默认展开的结点
      defaultExpanded: [],
      swiperOption: {
        // some swiper options/callbacks
        // 所有的参数同 swiper 官方 api 参数
        // ...
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      },
      dialogVisible1: false,
      dialogImageUrl: null,
      images: [],
      isAble: true,
      tableData: {},
      treeData: [],
      equipId: "",
      dialogVisible: false,
      addDialogVisible: false,
      disabled: false,
      title: "",
      devName: "",
      devData: {},
      flag: false,
      showImg: false,
      proImgList: [],
      menuVisible: false,
      showMore: false,
      top: 0,
      left: 0,
      selectTreeNode: {},
      addTreeDialogVisible: false,
      nodeCode: null,
      treeDialogVisible: false,
      updateNodeForm: {
        id: "",
        name: "",
        xh: null,
        isjl: null, // 是否计量设备
        isWater: null,
        isElect: null,
        isGas: null
      },
      lableName: "",
      isCut: false,
      sourceNode: {
        id: "",
        sbdm: ""
      },
      sbdm: ""
    };
  },
  watch: {
    menuVisible(value) {
      if (value) {
        document.body.addEventListener("click", this.closeMenu);
      } else {
        document.body.removeEventListener("click", this.closeMenu);
      }
    },
    selectNodeNO() {
      this.getAttrData();
    }
  },
  mounted() {
    this.getEneDevTree();
  },
  methods: {
    ...mapActions(["findMetering", "getDevImgX"]),
    ...mapMutations([
      "SET_ENERGYTYPE",
      "SET_PROIMG_LIST",
      "SET_AVTIVENAME",
      "SET_SELECTNO",
      "SET_DEVNAME",
      "SET_EQUIPID"
    ]),
    //加载树结构
    getEneDevTree() {
      const params = {
        isElect: this.isElect,
        isWater: this.isWater,
        isGas: this.isGas
      };
      getEneDevTree(params)
        .then(res => {
          this.treeData = res.data.data;
          // 默认展开第一个
          setDefaultExpanded(this);
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    click(row) {
      console.log(row);
    },
    //点击树，code做参数，调用该方法
    handleNodeClick(data) {
      this.showInfo = true;
      this.isAble = false;
      this.SET_SELECTNO(data.code);
      this.findMeteringInfo(data.code);
      this.SET_PROIMG_LIST([]);
      this.SET_DEVNAME(data.label);
    },
    //查询该树的某一设备信息
    findMeteringInfo(code) {
      this.findMetering(code); //tableData
      this.getDevImg(); //图片
    },
    //删除设备信息以及相关的图片
    eneDevDelete(id) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delDev(id).then(() => {
            this.getEneDevTree();
            this.findMeteringInfo(this.selectNo);
            this.proImgList = [];
          });
          this.$message.success("删除成功!");
        })
        .catch(e => {
          this.$message.info(e.message);
        });
    },
    getDevImg() {
      const params = {
        sbdm: this.selectNo,
        fileType: 3
      };
      this.getDevImgX(params);
    },

    //tab页切换
    handleClick(tab) {
      let name = tab.name;
      this.lableName = name;
      this.SET_AVTIVENAME(name);
      this.SET_ENERGYTYPE(name);
      this.SET_SELECTNO("");
      this.SET_DEVNAME("");
      this.tableData = {};
      this.proImgList = [];
      this.showImg = false;
      this.flag = false;
      this.getEneDevTree();
    },

    handleRightClick(e, data) {
      this.menuVisible = true;
      this.showMore = true;
      this.setStyle(e);
      this.selectTreeNode = data;
    },
    closeMenu() {
      this.menuVisible = false;
    },
    setStyle(e) {
      const menuMinWidth = 105;
      const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
      const offsetWidth = this.$el.offsetWidth; // container width
      const maxLeft = offsetWidth - menuMinWidth; // left boundary
      const left = e.clientX - offsetLeft + 46; // 15: margin right
      if (left > maxLeft) {
        this.left = maxLeft;
      } else {
        this.left = left;
      }
      if (e.screenY > 500) {
        this.top = e.clientY - 300;
      } else {
        this.top = e.clientY - 120;
      }
      // this.top=this.$el.clientHeight
    },
    addNode(node) {
      this.addTreeDialogVisible = true;
      this.nodeCode = node.code;
    },
    treeHidenDialog() {
      this.addTreeDialogVisible = false;
      // this.getAttrData()
      this.getEneDevTree();
    },
    deleteNode(node) {
      if ("021" == node.code) {
        this.$message.error("根结点不允许删除");
        return;
      }
      const params = {
        procCode: node.code,
        id: node.id
      };
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delEneTreeNode(params)
            .then(response => {
              const result = response.data;
              if (result.success) {
                this.$message.success("删除节点成功");
                setTimeout(() => {
                  // 刷新子组件的数据。
                  this.$router.go(0);
                }, 2 * 1000);
              } else {
                this.$message.error(result.message);
              }
            })
            .catch(e => {
              this.$message.error(e.message);
            });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    updateNode(data) {
      this.treeDialogVisible = true;
      getEneTreeByNode(data.code)
        .then(response => {
          const result = response.data;
          if (result.success) {
            this.updateNodeForm = result.data;
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    saveInfo() {
      this.treeDialogVisible = false;
      udEneTreeNode(this.updateNodeForm)
        .then(response => {
          const result = response.data;
          if (result.success) {
            this.$message.success("更新节点成功");
          } else {
            this.$message.error(result.message);
          }
          this.getEneDevTree();
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    copyNode(data) {
      if ("021" == data.code) {
        this.$message.error("根节点不允许复制");
        return;
      }
      this.$message.success("复制成功");
      this.sourceNode = {
        id: data.id,
        sbdm: data.code
      };
      this.isCut = false;
    },
    cutNode(data) {
      if ("021" == data.code) {
        this.$message.error("根结点不允许剪切");
        return;
      }
      this.$message.success("剪切成功");
      this.sourceNode = {
        id: data.id,
        sbdm: data.code
      };
      this.isCut = true;
    },
    pasteNode(data) {
      const params = {
        sourceId: this.sourceNode.id,
        sourceSbdm: this.sourceNode.sbdm,
        targetId: data.id,
        targetSbdm: data.code
      };
      if (isEmpty(this.sourceNode.sbdm)) {
        this.$message.error("粘贴失败,请先复制或者剪切一个节点");
        return;
      }
      if (this.sourceNode.sbdm === data.code) {
        this.$message.error("粘贴失败,源节点和目标节点不能相同");
        return;
      }
      if (this.isCut) {
        cutEneDevTreeNode(params)
          .then(response => {
            const result = response.data;
            if (result.success) {
              this.getEneDevTree();
              this.$message.success("粘贴成功");
            } else {
              this.$message.error(result.message);
            }
          })
          .catch(e => {
            this.$message.error(e.message);
          });
      } else {
        copyEneDevTreeNode(params)
          .then(response => {
            const result = response.data;
            if (result.success) {
              this.getEneDevTree();
              this.$message.success("粘贴成功");
            } else {
              this.$message.error(result.message);
            }
          })
          .catch(e => {
            this.$message.error(e.message);
          });
      }
    },
    handlePictureCardPreview(url) {
      this.dialogImageUrl = url;
      this.dialogVisible1 = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.treeAdd {
  padding: 20px;
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

.el-col {
  margin-bottom: 20px;
  width: 100%;
  margin: 0;
  padding: 0;
  text-decoration: none;
  list-style: none;
  border: 0;
  font-family: Arial, "\5FAE\8F6F\96C5\9ED1";
  outline: none;
  .grid-content {
    text-align: left;
    margin-left: 100px;
    b {
      font-weight: 400;
      font-size: 14px;
    }
  }
}

.grid-content {
  padding: 0 12px;
  border-radius: 4px;
  min-height: 36px;
  line-height: 36px;
}

.span {
  display: inline-block;
  width: 120px;
}

.tableshadow {
  height: 100%;
}

.el-tab-pane {
  position: fixed;
  top: 0;
}

.el-container .el-button {
  margin: 10px 0 0 30px;
}

.el-main {
  overflow-y: scroll;
}

.el-form {
  text-align: center;
  margin-top: 20px;
}

.device {
  width: 100%;
  height: 1px;
  position: relative;
  background-color: #ccc;
  top: 20px;
  margin-bottom: 60px;
  .showDevice {
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #fff;
    width: 100px;
    height: 20px;
    text-align: center;
  }
}

.el-aside {
  overflow: auto;
}
</style>
<style lang='scss'>
.devTree .el-tabs__content {
  padding: 0 !important;
}

.devTree .el-tabs__content {
  height: 100%;
}

.devTree .el-dialog {
  width: 845px;
}

.devTree .el-dialog__body {
  padding: 0;
  margin: auto;
}
.devTree .el-tree-node > .el-tree-node__children {
  overflow: inherit;
}
</style>
