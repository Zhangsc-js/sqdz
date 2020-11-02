<template>
  <div class="devTree">
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
      type="border-card"
      style="height:100%; position: relative;"
    >
      <el-tab-pane label="电" name="elect"></el-tab-pane>
      <el-tab-pane label="水" name="water"></el-tab-pane>
      <el-tab-pane label="气" name="gas"></el-tab-pane>
      <el-container class="contain" style="margin:-15px;height:100%">
        <el-aside width="250px" style="height: 1200px">
          <el-tree
            :data="treeData"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            accordion
            @node-click="handleNodeClick"
            @node-contextmenu="handleRightClick"
          />
          <ul v-show="menuVisible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
            <li v-show="showMore" @click="addNode(selectTreeNode)">新增子节点</li>
            <li v-show="showMore" @click="deleteNode(selectTreeNode)">删除节点</li>
            <li v-show="showMore" @click="updateNode(selectTreeNode)">更新节点</li>
            <li v-show="showMore" @click="copyNode(selectTreeNode)">复制</li>
            <li v-show="showMore" @click="cutNode(selectTreeNode)">剪切</li>
            <li v-show="showMore" @click="pasteNode(selectTreeNode)">粘贴</li>
          </ul>
        </el-aside>
        <el-main class="tableshadow" style="height: 1200px">
          <div>
            <el-button
              v-show="!flag"
              type="primary"
              @click="eneDevAdd()"
              icon="el-icon-circle-plus-outline"
            >新增</el-button>
          </div>
          <div>
            <el-button
              v-show="flag"
              type="primary"
              @click="eneDevUp(tableData.id)"
              icon="el-icon-edit"
            >更新</el-button>
            <el-button
              v-show="flag"
              type="danger"
              @click="eneDevDelete(tableData.id)"
              icon="el-icon-delete"
            >删除</el-button>
          </div>

          <el-carousel v-show="showImg" :interval="4000" type="card" height="300px">
            <el-carousel-item v-for="item in proImgList" :key="item.id">
              <img width="100%" :src="item.url" :alt="item.name" />
            </el-carousel-item>
          </el-carousel>

          <div class="device">
            <div class="showDevice">设备信息</div>
          </div>
          <el-form ref="tableData" :model="tableData" label-width="160px">
            <el-row :gutter="20">
              <el-col :span="12">
                <div class="grid-content">
                  <b>设备名称：</b>
                  {{ tableData.sbmc }}
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  <b>设备英文：</b>
                  {{ tableData.sbmcEn }}
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  <b>设备代码：</b>
                  {{ tableData.sbdm}}
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  <b>规格型号：</b>
                  {{ tableData.standard}}
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  <b>测量范围：</b>
                  {{ tableData.measureScope}}
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  <b>使用车间：</b>
                  {{tableData.useWorkshop}}
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  <b>使用单位：</b>
                  {{tableData.useDepartment}}
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  <b>使用工序：</b>
                  {{tableData.useProcess}}
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  <b>上报周期：</b>
                  {{tableData.cycleReport}}
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  <b>计量上限：</b>
                  {{tableData.meteringUpper}}
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  <b>计量下限：</b>
                  {{tableData.meteringLower}}
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  <b>ABC分类：</b>
                  {{tableData.abcFl}}
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  <b>精度：</b>
                  {{tableData.jd}}
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  <b>出厂时间：</b>
                  {{tableData.ccTime}}
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  <b>出厂编号：</b>
                  {{tableData.ccCode}}
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  <b>备注：</b>
                  {{tableData.bz}}
                </div>
              </el-col>
            </el-row>
          </el-form>
          <el-dialog :title="title" :visible.sync="dialogVisible" width="65%">
            <devUpd @hidenDialog="hidenDialog" :selectNo="selectNo" :equipId="equipId" />
          </el-dialog>
          <el-dialog :title="title" :visible.sync="addDialogVisible" width="65%">
            <devAdd @hidenDialog="hidenDialog" :selectNo="selectNo" />
          </el-dialog>
          <el-dialog title="新增子节点" :visible.sync="addTreeDialogVisible" width="65%">
            <tree-node-add
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
        </el-main>
      </el-container>
    </el-tabs>
  </div>
</template>

<script>
import {
  getEneDevTree,
  findMeteringInfo,
  delDev,
  getDevImg,
  delEneTreeNode,
  getEneTreeByNode,
  udEneTreeNode,
  copyEneDevTreeNode,
  cutEneDevTreeNode
} from "@/api/energy";
import Pagination from "@/components/Pagination";
import devUpd from "./devUpd";
import devAdd from "./devAdd";
import { isEmptyArray } from "@/utils/index";
import TreeNodeAdd from "./tree-node-add";
import { isEmpty } from "@/utils/index";

export default {
  name: "devTree",
  data() {
    return {
      tableData: {},
      treeData: [],
      equipId: "",
      dialogVisible: false,
      addDialogVisible: false,
      disabled: false,
      title: "",
      selectNo: "",
      devData: {},
      flag: false,
      showImg: false,
      proImgList: [],
      activeName: "elect",
      isElect: 1,
      isWater: "",
      isGas: "",
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
  mounted() {
    this.getEneDevTree();
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
  methods: {
    getEneDevTree() {
      const params = {
        isElect: this.isElect,
        isWater: this.isWater,
        isGas: this.isGas
      };
      getEneDevTree(params)
        .then(res => {
          this.treeData = res.data.data;
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    //点击树，code做参数，调用该方法
    handleNodeClick(data) {
      this.proImgList = [];
      this.selectNo = data.code;
      this.findMeteringInfo(data.code);
    },
    //查询该树的某一设备信息
    findMeteringInfo(code) {
      findMeteringInfo(code)
        .then(res => {
          //有数据则显示
          if (!isEmptyArray(res.data.data.rows)) {
            this.flag = true;
            this.tableData = res.data.data.rows[0];
            if (this.tableData) {
              this.showImg = true;
              this.getDevImg();
            }
          } else {
            //无数据则制空
            this.tableData = {};
            this.flag = false;
            this.showImg = false;
          }
        })
        .catch(e => {
          this.$message.error(e);
        });
    },
    eneDevUp(id) {
      this.equipId = id;
      this.title = "设备编辑页面";
      this.disabled = true;
      this.dialogVisible = true;
      // this.disabled = true;
    },
    eneDevAdd() {
      this.title = "设备添加页面";
      this.disabled = true;
      this.addDialogVisible = true;
    },
    hidenDialog() {
      this.dialogVisible = false;
      this.addDialogVisible = false;
      this.findMeteringInfo(this.selectNo);
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
        sbdm: this.tableData.sbdm,
        fileType: 3
      };
      getDevImg(params)
        .then(res => {
          const result = res.data.data;
          if (!isEmptyArray(res.data.data)) {
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
    //tab页切换
    handleClick(tab) {
      let name = tab.name;
      this.lableName = name;
      if (name == "elect") {
        this.isElect = 1;
        this.isWater = "";
        this.isGas = "";
      } else if (name == "water") {
        this.isElect = "";
        this.isWater = 1;
        this.isGas = "";
      } else if (name == "gas") {
        this.isElect = "";
        this.isWater = "";
        this.isGas = 1;
      }
      this.tableData = {};
      this.proImgList = [];
      this.showImg = false;
      this.flag = false;
      this.getEneDevTree();
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
      this.top = e.clientY - 120;
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
    }
  },
  components: {
    Pagination,
    devUpd,
    devAdd,
    TreeNodeAdd
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
.el-container.contain {
  padding: 0;
  position: relative;
  left: -4px;
}
.tableshadow {
  height: 100%;
}
.el-tab-pane {
  position: fixed;
  top: 0;
}
.el-container .el-main .el-button {
  margin: 10px 0 0 30px;
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
</style>

<template>
  <div style="height: 100%">
    <div class="tmdiv">
      <el-divider content-position="left">车间</el-divider>
      <edit-table
        :tableData="workshoptable"
        height="300px"
        style="margin-left:-20px"
        :opts.sync="wtableColumn"
        highlight-current-row
        @getData="getData"
        @savaData="saveShop"
        @jc-row-click="teamInfo"
        @deleteRow="delWorkshop"
        pageName="SYS-TEAMCE"
      ></edit-table>
    </div>
    <div class="tmdiv">
      <el-divider content-position="left">班组</el-divider>
      <edit-table
        :tableData="teamtable"
        style="position: relative;top:44px"
        :showOptBtn="false"
        height="300px"
        :showAddBtn="false"
        :opts.sync="ttableColumn"
        highlight-current-row
        @getData="teamInfo"
      ></edit-table>
    </div>
  </div>
</template>

<script>
import EditTable from "@/components/EditTable";
import {dict2Edit} from "@/utils/common";
import {
  getSchedulWorkshop,
  queryWorkShop,
  savePlanWorkShop,
  delWorkshopFromPlan,
  teamInfo
} from "@/api/productionPlanning";
export default {
  name: "planTeam",
  components: {
    EditTable
  },
  data() {
    return {
      page: {
        pageNum: 1,
        pageSize: 3
      },
      pageSizes: [3, 10, 50, 100],
      total: 0,
      rpage: {
        pageNum: 1,
        pageSize: 5
      },
      rpageSizes: [5, 10, 50, 100],
      rtotal: 0,
      row: {},
      workshoptable: [],
      workshopMap: [],
      teamtable: [],
      wtableColumn: [
        {
          type: "select",
          label: "车间名称",
          prop: "workshopCode",
          options: []
        },
        {
          label: "班组数量",
          prop: "teamCount"
        },
        {
          label: "当前班次",
          prop: "shiftName"
        },
        {
          label: "当前排班",
          prop: "teamName"
        }
      ],
      ttableColumn: [
        {
          label: "班组编码",
          prop: "teamCode"
        },
        {
          label: "班组名称",
          prop: "teamName"
        },
        {
          label: "组长",
          prop: "leaders"
        },
        {
          label: "班组人数",
          prop: "personNum"
        }
      ]
    };
  },
  methods: {
    getData() {
      if (!this.planCode) return;
      const params = {
        ...this.page,
        planCode: this.planCode
      };
      getSchedulWorkshop(params).then(response => {
        this.workshoptable = response.data.data.result;
        this.total = response.data.data.total;
      });

      queryWorkShop().then(response => {
        let data = response.data;
          for (let i = 0; i <data.data.WORKSHOP_ALL.length; i++) {
              data.data.WORKSHOP_ALL[i].value=data.data.WORKSHOP_ALL[i].proccode;
              data.data.WORKSHOP_ALL[i].label=data.data.WORKSHOP_ALL[i].name;
              data.data.WORKSHOP_ALL[i].code=data.data.WORKSHOP_ALL[i].proccode;
          }
        let d=data.data.WORKSHOP_ALL;
        this.wtableColumn[0].options =d ;
        this.workshopMap = d;
        console.log(d)
      });
    },
    saveShop(row, done) {
      done();
      let workshopName = "";
      for (let i = 0; i < this.workshopMap.length; i++) {
        if (this.workshopMap[i].value == row.workshopCode) {
          workshopName = this.workshopMap[i].label;
        }
      }
      const params = {
        id: row.id,
        schedulPlanCode: this.planCode,
        workshopCode: row.workshopCode,
        workshopName: workshopName
      };
      savePlanWorkShop(params).then(response => {
        let data = response.data;
        if (data.success) {
          this.$message.success("更新成功！！！");
          this.getData();
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
    },
    delWorkshop(id) {
      delWorkshopFromPlan(id).then(response => {
        let data = response.data;
        if (data.success) {
          this.$message.success("更新成功！！！");
          this.getData();
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
    },
    teamInfo(row) {
      if (row != undefined) {
        this.row = row;
      }
      const params = {
        ...this.rpage,
        workshopCode: this.row.workshopCode,
        teamType:"1"
      };
      teamInfo(params).then(response => {
        let data = response.data;
        if (data.success) {
          this.teamtable = data.data.result;
          this.rtotal = data.data.total;
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
    }
  },
  mounted() {
    this.getData();
  },
  props: {
    planCode: {
      type: String,
      required: true
    }
  },
  watch: {
    planCode() {
      this.getData();
    }
  }
};
</script>
<style lang="css" scoped>
.tmdiv {
  width: 48%;
  margin-left: 20px;
  float: left;
}
</style>
