<template>
  <div @keyup.esc="menuVisible = false" tabindex="0" style="height:100%" class="attr">
    <el-container style="padding-top:24px;height:100%">
      <el-aside width="250px" style="height:100%;border-right: 10px solid #fff">
        <el-tree
          :data="weiTreeData"
          node-key="id"
          :default-expanded-keys="defaultExpanded"
          @node-click="handleNodeClick"
          @node-contextmenu="handleRightClick"
         :expand-on-click-node="false"
        >
          <template v-slot="{data}">
            <span class="el-icon-folder" style="font-size:14px">{{data.label}}</span>
          </template>
        </el-tree>
        <ul v-show="menuVisible" :style="{left:left+'px',top:top+'px'}" class="contextmenu showUl">
          <li v-show="showMore" @click="addNode(selectTreeNode)">新增子节点</li>
          <li v-show="showMore" @click="deleteNode(selectTreeNode)">删除节点</li>
          <li v-show="showMore" @click="updateNode(selectTreeNode)">更新节点</li>
          <li v-show="showMore" @click="copyNode(selectTreeNode)">复制</li>
          <li v-show="showMore" @click="cutNode(selectTreeNode)">剪切</li>
          <li v-show="showMore" @click="pasteNode(selectTreeNode)">粘贴</li>
        </ul>
      </el-aside>
      <div v-if="showInfo">
        <div>
          <div class="margin10">
            <el-button
              class="add"
              v-show="!flag"
              type="primary"
              @click="addWeiDevsAttr()"
              icon="el-icon-edit"
              :disabled="isAble"
            >更新</el-button>
          </div>
          <div class="margin10">
            <el-button
              v-show="flag"
              type="primary"
              @click="updateWeiDev(tablesData.id)"
              icon="el-icon-edit"
            >更新</el-button>
            <el-button
              v-show="flag"
              type="danger"
              @click="delWeiDev(tablesData.id)"
              icon="el-icon-delete"
            >删除</el-button>
          </div>
          <div class="basic">
            <div class="textCenter">基础信息</div>
          </div>
          <el-form
            ref="tablesData"
            :model="tablesData"
            label-width="160px"
            style="max-height: 74.5vh;overflow: auto"
          >
            <el-row :gutter="20">
              <el-col :span="12">
                <div class="grid-content">
                  <b>实物图片：</b>
                  <span v-if="proImgList.length==0">无</span>
                  <img
                    width="200px"
                    style="vertical-align:middle;margin:20px"
                    v-if="proImgList.length>0"
                    :src="proImgList[0].url"
                    alt="proImgList[0].name"
                    @click="handlePictureCardPreview(proImgList[0].url)"
                  />
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  <b>设备名称：</b>
                  {{ tablesData.sbmc }}
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  <b>设备英文：</b>
                  {{ tablesData.sbmcEn }}
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  <b>设备代码：</b>
                  {{ tablesData.sbdm}}
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  <b>制造厂商：</b>
                  {{ tablesData.zzcs}}
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  <b>安装地点：</b>
                  {{ tablesData.azdd}}
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  <b>规格性能：</b>
                  {{ tablesData.ggxn}}
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  <b>设备型号：</b>
                  {{ tablesData.sbxh}}
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  <b>精度：</b>
                  {{tablesData.jd}}
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  <b>采购时间：</b>
                  {{tablesData.cgsj}}
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  <b>投运时间：</b>
                  {{tablesData.tysj}}
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  <b>出厂编号：</b>
                  {{tablesData.sbccbh}}
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  <b>备注：</b>
                  {{tablesData.bz}}
                </div>
              </el-col>
            </el-row>
          </el-form>
        </div>
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
                <el-form-item label="是否生成设备" prop="issproduction">
                  <!--<el-select v-model="updateNodeForm.issproduction" placeholder="请选择">
                                                          <el-option
                                                                  v-for="item in options"
                                                                  :key="item.value"
                                                                  :label="item.label"
                                                                  :value="item.value">
                                                          </el-option>
                  </el-select>-->
                  <el-radio v-model="updateNodeForm.issproduction" :label="1">是</el-radio>
                  <el-radio v-model="updateNodeForm.issproduction" :label="0">否</el-radio>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否检斤设备" prop="isjj">
                  <!--<el-select v-model="updateNodeForm.isjj" placeholder="请选择">
                                                          <el-option
                                                                  v-for="item in options"
                                                                  :key="item.value"
                                                                  :label="item.label"
                                                                  :value="item.value">
                                                          </el-option>
                  </el-select>-->
                  <el-radio v-model="updateNodeForm.isjj" :label="1">是</el-radio>
                  <el-radio v-model="updateNodeForm.isjj" :label="0">否</el-radio>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="treeDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveInfo()">保存</el-button>
          </div>
        </el-dialog>
        <el-dialog title="新增子节点" :visible.sync="addTreeDialogVisible" width="65%">
          <tree-node-add :pproCode="nodeCode" @treeHidenDialog="treeHidenDialog"></tree-node-add>
        </el-dialog>
        <el-dialog :title="title" :visible.sync="dialogVisible" width="65%">
          <WeiDevAttrUd @hidenDialog="hidenDialog" :selectNo="selectNo" :equipId="equipId" />
        </el-dialog>
        <el-dialog title="新增" :visible.sync="addDialogVisible" width="65%" :selectNo="selectNo">
          <WeiDevAttrAdd @hidenDialog="hidenDialog" />
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
      </div>
    </el-container>
  </div>
</template>

<script>
import { isEmpty } from "@/utils/index";
import { createNamespacedHelpers } from "vuex";
import WeiDevAttrAdd from "./attr-add";
import WeiDevAttrUd from "./attr-ud";
// import WeiDevAttrDtl from './attr-details'
import TreeNodeAdd from "./tree-node-add";
import {
  delWeiDevTreeNode,
  getWeiDevTreeByNode,
  udWeiDevTreeNode,
  cutWeiDevTreeNode,
  copyWeiDeiTreeNode,
  getWeiDevAttrs,
  getDevImg
} from "@/api/weighing";
import { isEmptyArray } from "../../../utils";

const { mapState, mapActions, mapMutations } = createNamespacedHelpers(
  "weiDevice"
);
export default {
  name: "WeighingTree",
  components: {
    WeiDevAttrAdd,
    WeiDevAttrUd,
    // WeiDevAttrDtl,
    TreeNodeAdd
  },
  data() {
    return {
      showInfo: false,
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
      isAble: true,
      dialogVisible: false,
      treeDialogVisible: false,
      addDialogVisible: false,
      addTreeDialogVisible: false,
      dtlDialogVisible: false,
      equipId: "",
      title: "",
      menuVisible: false,
      top: 0,
      left: 0,
      nodeNo: "",
      selectNo: "",
      devData: {},
      flag: false,
      showImg: false,
      tablesData: {},
      showMore: false,
      proImgList: [],
      selectTreeNode: {},
      sourceNode: {
        id: "",
        sbdm: ""
      },
      sbdm: "",
      updateNodeForm: {
        id: "",
        name: "",
        xh: null,
        issproduction: null, // 是否生成设备
        isjj: 1 // 是否检斤设备
      },
      isCut: false,
      options: [
        {
          label: "是",
          value: 1
        },
        {
          label: "否",
          value: 0
        }
      ],
      nodeCode: null
    };
  },
  computed: {
    ...mapState(["weiTreeData", "tableData", "defaultExpanded"])
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
    this.$nextTick(() => {
      this.getWeiTreeData({ isjj: 1 });
    });
  },
  methods: {
    ...mapActions(["getWeiTreeData", "getTableData", "delWeiDevData"]),
    ...mapMutations([
      "SET_NODE_NO",
      "SET_WEI_TREE_DATA",
      "SET_TABLE_DATA",
      "SET_SELECTED_ROW_ID",
      "SET_DISABLED",
      "SET_TEMPNAME"
    ]),
    handleNodeClick(data) {
      this.showInfo = true;
      this.isAble = false;
      this.proImgList = [];
      this.selectNo = data.code;
      this.nodeNO = data.code;
      this.SET_NODE_NO(data.code);
      this.SET_TEMPNAME(data.label);
      // this.getAttrData()
      this.getData(data);
    },
    handleRightClick(e, data, node, self) {
      this.menuVisible = true;
      this.showMore = true;
      this.setStyle(e);
      this.selectTreeNode = data;
    },
    closeMenu() {
      this.menuVisible = false;
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
          delWeiDevTreeNode(params)
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
    addNode(node) {
      this.addTreeDialogVisible = true;
      this.nodeCode = node.code;
    },
    updateNode(data) {
      this.treeDialogVisible = true;
      getWeiDevTreeByNode(data.code)
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
      udWeiDevTreeNode(this.updateNodeForm)
        .then(response => {
          const result = response.data;
          if (result.success) {
            this.$message.success("更新节点成功");
          } else {
            this.$message.error(result.message);
          }
          this.getWeiTreeData({ isjj: 1 });
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
        cutWeiDevTreeNode(params)
          .then(response => {
            const result = response.data;
            if (result.success) {
              this.getWeiTreeData({ isjj: 1 });
              this.$message.success("粘贴成功");
            } else {
              this.$message.error(result.message);
            }
          })
          .catch(e => {
            this.$message.error(e.message);
          });
      } else {
        copyWeiDeiTreeNode(params)
          .then(response => {
            const result = response.data;
            if (result.success) {
              this.getWeiTreeData({ isjj: 1 });
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

    // getAttrData() {
    //     this.getTableData({
    //         sbdm: this.nodeNO,
    //     })
    // },
    hidenDialog() {
      this.dialogVisible = false;
      this.addDialogVisible = false;
      // this.getTableData({
      //     sbdm: this.nodeNO,
      // })
      this.getData({
        sbdm: this.nodeNO
      });
    },
    dtlHidenDialog() {
      this.dtlDialogVisible = false;
    },
    treeHidenDialog() {
      this.addTreeDialogVisible = false;
      // this.getAttrData()
      this.getWeiTreeData({ isjj: 1 });
    },
    addWeiDevsAttr() {
      this.addDialogVisible = true;
      // this.getAttrData()
    },
    updateWeiDev(id) {
      this.equipId = id;
      this.SET_SELECTED_ROW_ID(id);
      this.SET_DISABLED(false);
      this.title = "更新";
      this.dialogVisible = true;
    },
    // weiDevDetail(data) {
    //     this.SET_SELECTED_ROW_ID(data.id)
    //     this.equipId = data.id
    //     this.devData = data
    //     this.title = '详情'
    //     this.dtlDialogVisible = true
    // },
    delWeiDev(id) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delWeiDevData(id).then(() => {
            this.getData();
            this.$message.success("删除成功!");
          });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
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
        this.top = e.clientY - 260;
      } else {
        this.top = e.clientY - 80;
      }
    },
    getData() {
      this.sbdm = this.selectNo;
      getWeiDevAttrs(this.sbdm)
        .then(res => {
          if (res.data.data) {
            this.flag = true;
            this.tablesData = res.data.data;
            if (this.tablesData) {
              this.showImg = true;
              this.getDevImg();
              console.log(this.tablesData);
            }
          } else {
            //无数据则制空
            this.tablesData = {};
            this.flag = false;
            this.showImg = false;
          }
        })
        .catch(e => {
          this.$message.error(e);
        });
    },
    getDevImg() {
      const params = {
        sbdm: this.tablesData.sbdm,
        fileType: 3
      };
      getDevImg(params)
        .then(res => {
          const result = res.data.data;
          if (res.data.data) {
            //无图片
            this.showImg = true;
          } else {
            this.showImg = false;
          }
          // 将原有数据置空
          const images = [];
          if (result) {
            for (let item of result) {
              images.push({
                id: item.id,
                name: item.fileName,
                url: process.env.VUE_APP_DEV_IMAGE_URL + item.uploadName
              });
            }
          }
          this.proImgList = images;
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    handlePictureCardPreview(url) {
      this.dialogImageUrl = url;
      this.dialogVisible1 = true;
    }
  }
};
</script>

<style lang="scss" scoped>
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
  padding: 0px 6px;
  height: 100%;
  width: 100%;
}

.basic {
  width: 100%;
  height: 1px;
  background-color: #ccc;
  margin: 24px 0;
  position: relative;
  .textCenter {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    background-color: #fff;
    height: 30px;
    width: 100px;
    line-height: 24px;
    text-align: center;
    top: -12px;
  }
}

.el-row {
  text-align: center;
}

.el-main {
  overflow-y: scroll;
}

.add {
  position: relative;
  top: 5px;
  left: 20px;
}

.carousel {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: calc(100% - 250px);
}
</style>
<style lang='scss'>
.attr .el-tabs--border-card > .el-tabs__content {
  padding: 0 !important;
}

.attr .el-tabs__content {
  height: 100%;
}

.attr .el-dialog {
  width: 845px;
}

.attr .el-dialog__body {
  padding: 0;
  margin: auto;
}
</style>
