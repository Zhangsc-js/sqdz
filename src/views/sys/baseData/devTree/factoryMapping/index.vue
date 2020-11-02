<template>
  <div class="factoryMapping" style="height: 100%">
    <el-container style="height: 100%">
      <div style="flex:1;height: 100%;overflow:auto">
        <el-form
          :inline="true"
          :model="updateNodeForm"
          class="demo-form-inline"
          ref="updateNodeForm"
          label-width="120px"
          :rules="rules"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item label="设备编码：" prop="proccode">
                <el-input disabled v-model="updateNodeForm.proccode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设备名称：" prop="name">
                <el-input v-model="updateNodeForm.name" style="width:230px"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-button
                type="primary"
                @click="addNode()"
                v-has="'SYS-DEVTREE-MODEL-ADD'"
                icon="el-icon-plus"
              >新增</el-button>
              <el-button @click="saveInfo()" v-has="'SYS-DEVTREE-MODEL-SAVE'">保存</el-button>
              <el-button
                type="danger"
                @click="deleteNode()"
                v-has="'SYS-DEVTREE-MODEL-DELETE'"
                icon="el-icon-delete"
                :disabled="id?false:true"
              >删除</el-button>
              <el-button @click="copyNode()" v-has="'SYS-DEVTREE-MODEL-COPY'">复制</el-button>
              <el-button @click="cutNode()" v-has="'SYS-DEVTREE-MODEL-SHEAR'">剪切</el-button>
              <el-button @click="pasteNode()" v-has="'SYS-DEVTREE-MODEL-PASTE'">粘贴</el-button>
              <el-upload
                class="upload"
                :action="fileUploadUrl"
                :show-file-list="false"
                :headers="token"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :on-progress="progress"
              >
                <el-button v-has="'SYS-DEVTREE-MODEL-IMPORT'">导入</el-button>
              </el-upload>
              <el-button @click="downloadTemplate()" v-has="'SYS-DEVTREE-MODEL-EXPORT'">导出模板</el-button>
            </el-col>
          </el-row>
          <!-- 模型类型横线 -->
          <el-row>
            <el-col :span="24">
              <el-divider content-position="left">节点类型</el-divider>
            </el-col>
          </el-row>
          <!-- 模型类型 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="是否车间" prop="isWorkshop">
                <el-radio v-model="updateNodeForm.isWorkshop" :label="1">是</el-radio>
                <el-radio v-model="updateNodeForm.isWorkshop" :label="0">否</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否工序" prop="isProcess">
                <el-radio v-model="updateNodeForm.isProcess" :label="1">是</el-radio>
                <el-radio v-model="updateNodeForm.isProcess" :label="0">否</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 设备类型横线 -->
          <el-row>
            <el-col :span="24">
              <el-divider content-position="left">设备类型</el-divider>
            </el-col>
          </el-row>
          <!-- 设备类型 -->
          <div>
            <el-row>
              <el-col :span="12">
                <el-form-item label="是否生产设备" prop="issproduction">
                  <el-radio class="vam" v-model="updateNodeForm.issproduction" :label="1">是</el-radio>
                  <el-radio class="vam" v-model="updateNodeForm.issproduction" :label="0">否</el-radio>
                  <el-button
                    class="vam m0"
                    type="primary"
                    plain
                    @click="treeMap('issproduction')"
                  >查看映射树</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否检斤设备" prop="isjj">
                  <el-radio class="vam" v-model="updateNodeForm.isjj" :label="1">是</el-radio>
                  <el-radio class="vam" v-model="updateNodeForm.isjj" :label="0">否</el-radio>
                  <el-button class="vam m0" type="primary" plain @click="treeMap('isjj')">查看映射树</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="是否计量设备" prop="isjl">
                  <el-radio class="vam" v-model="updateNodeForm.isjl" :label="1">是</el-radio>
                  <el-radio class="vam" v-model="updateNodeForm.isjl" :label="0">否</el-radio>
                  <el-button class="vam m0" type="primary" plain @click="treeMap('isjl')">查看映射树</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否槽罐" prop="iscg">
                  <el-radio class="vam" v-model="updateNodeForm.iscg" :label="1">是</el-radio>
                  <el-radio class="vam" v-model="updateNodeForm.iscg" :label="0">否</el-radio>
                  <el-button class="vam m0" type="primary" plain @click="treeMap('iscg')">查看映射树</el-button>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="是否水表" prop="isWater">
                  <el-radio class="vam" v-model="updateNodeForm.isWater" :label="1">是</el-radio>
                  <el-radio class="vam" v-model="updateNodeForm.isWater" :label="0">否</el-radio>
                  <el-button class="vam m0" type="primary" plain @click="treeMap('isWater')">查看映射树</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否电表" prop="isElect">
                  <el-radio class="vam" v-model="updateNodeForm.isElect" :label="1">是</el-radio>
                  <el-radio class="vam" v-model="updateNodeForm.isElect" :label="0">否</el-radio>
                  <el-button class="vam m0" type="primary" plain @click="treeMap('isElect')">查看映射树</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="是否气表" prop="isGas">
                  <el-radio class="vam" v-model="updateNodeForm.isGas" :label="1">是</el-radio>
                  <el-radio class="vam" v-model="updateNodeForm.isGas" :label="0">否</el-radio>
                  <el-button class="vam m0" type="primary" plain @click="treeMap('isGas')">查看映射树</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否真实设备" prop="isReal">
                  <el-radio v-model="updateNodeForm.isReal" class="vam" :label="1">是</el-radio>
                  <el-radio v-model="updateNodeForm.isReal" class="vam" :label="0">否</el-radio>
                  <el-button style="opacity: 0;" class="vam m0">查看映射树</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-divider content-position="left">设备维护</el-divider>
              </el-col>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="是否需要巡检" prop="isChecking">
                    <el-radio class="vam" v-model="updateNodeForm.isChecking" :label="1">是</el-radio>
                    <el-radio class="vam" v-model="updateNodeForm.isChecking" :label="0">否</el-radio>
                    <el-button
                      class="vam m0"
                      type="primary"
                      plain
                      @click="treeMap('isChecking')"
                    >查看映射树</el-button>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="是否需要点检" prop="isInspection">
                    <el-radio class="vam" v-model="updateNodeForm.isInspection" :label="1">是</el-radio>
                    <el-radio class="vam" v-model="updateNodeForm.isInspection" :label="0">否</el-radio>
                    <el-button
                      class="vam m0"
                      type="primary"
                      plain
                      @click="treeMap('isInspection')"
                    >查看映射树</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="是否需要润滑" prop="isLubrication">
                    <el-radio class="vam" v-model="updateNodeForm.isLubrication" :label="1">是</el-radio>
                    <el-radio class="vam" v-model="updateNodeForm.isLubrication" :label="0">否</el-radio>
                    <el-button
                      class="vam m0"
                      type="primary"
                      plain
                      @click="treeMap('isLubrication')"
                    >查看映射树</el-button>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="是否需要保养" prop="isMaintain">
                    <el-radio class="vam" v-model="updateNodeForm.isMaintain" :label="1">是</el-radio>
                    <el-radio class="vam" v-model="updateNodeForm.isMaintain" :label="0">否</el-radio>
                    <el-button
                      class="vam m0"
                      type="primary"
                      plain
                      @click="treeMap('isMaintain')"
                    >查看映射树</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-row>
          </div>
        </el-form>
      </div>
    </el-container>
    <el-dialog title="新增子节点" :visible.sync="addDialogVisible" width="65%">
      <node-add :devMap="devMap" :pproCode="nodeCode" @hidenDialog="hidenDialog"></node-add>
    </el-dialog>
    <el-dialog title="映射树设置" :visible.sync="treeMapDialogVisible" width="65%" class="treeMap">
      <el-form :inline="true" :model="treeMapForm" class="demo-form-inline">
        <el-form-item label="映射树">
          <el-select
            v-model="treeMapForm.tree"
            placeholder="请选择"
            @change="changeTree(treeMapForm.tree)"
          >
            <el-option
              v-for="item in treeMapForm.trees"
              :key="item.id"
              :label="item.label"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="treeMap(treeMapForm.tree)">查询</el-button>
          <el-button type="primary" @click="treeMapSave()" v-has="'SYS-DEVTREE-SET-SAVE'">保存</el-button>
        </el-form-item>
      </el-form>
      <el-tree
        :data="treeData"
        node-key="code"
        show-checkbox
        :default-checked-keys="checkedKeys"
        check-on-click-node
        :expand-on-click-node="false"
        check-strictly
        highlight-current
        :current-node-key="nodeId"
        default-expand-all
        style="height: 100%;"
        ref="tree"
      ></el-tree>
    </el-dialog>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import { isEmpty, isEmptyArray, isNotEmpty } from "@/utils/index";
import NodeAdd from "@/views/sys/baseData/devTree/fectory-model/node-add";
const { mapState, mapActions, mapMutations } = createNamespacedHelpers(
  "sysDev"
);
import {
  downlowdFactoryModelTemp,
  IMPORT_FECTORY,
  delTreeNode,
  copyTreeNode,
  cutTreeNode,
  getDevTreeNode,
  getAllDevByCond,
  updateDevTreeNode,
  getDeviceTypeMap,
  batchUpdateFactoryMapping
} from "@/api/sys/dev";
import { getToken } from "@/utils/auth";
import { saveAs } from "file-saver";

export default {
  components: {
    NodeAdd
  },
  data() {
    return {
      loading: null,
      defaultProps: {
        children: "children",
        label: "label"
      },
      formInline: {
        user: ""
      },
      nodeId: 1,
      updateNodeForm: {
        nodeCode: "",
        nodeName: "",
        xh: ""
      },
      rules: {
        name: [{ required: true, message: "请输入设备名称", trigger: "blur" }]
      },
      fileUploadUrl: IMPORT_FECTORY,
      token: {
        Authorization: `Bearer ${getToken()}`
      },
      addDialogVisible: false,
      nodeCode: null,
      devMap: [],
      faName: "",
      treeMapDialogVisible: false,
      //   映射树
      treeMapForm: {
        tree: "",
        trees: [
          { label: "生产设备", code: "issproduction" },
          { label: "检斤设备", code: "isjj" },
          { label: "计量设备", code: "isjl" },
          { label: "槽罐", code: "iscg" },
          { label: "巡检设备", code: "isChecking" },
          { label: "点检设备", code: "isInspection" },
          { label: "润滑设备", code: "isLubrication" },
          { label: "保养设备", code: "isMaintain" },
          // { label: "设备", code: "isEquip" }
          { label: "水", code: "isWater" },
          { label: "电", code: "isElect" },
          { label: "气", code: "isGas" }
        ]
      },
      treeMapData: [],
      //   初始选中
      checkedKeys: [],
      changeArr: [],
      checkedData: []
    };
  },
  computed: {
    selectNodeNO() {
      return this.$store.state.sysDev.selectNodeNO;
    },
    ...mapState(["treeData", "defaultExpanded", "id"])
  },
  watch: {
    selectNodeNO() {
      if (isNotEmpty(this.selectNodeNO)) {
        this.getData();
      }
    },
    checkedKeys: {
      deep: true,
      handler() {
        this.setCheckedNodes();
      }
    }
  },
  activated() {
    this.getData();
  },
  methods: {
    ...mapActions(["getTreeData"]),
    getData(data) {
      if (!this.selectNodeNO) return;
      getDevTreeNode(this.selectNodeNO)
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
    progress() {
      this.loading = this.$loading({
        lock: true,
        text: "上传中",
        background: "rgba(0, 0, 0, 0.7)"
      });
    },
    uploadSuccess(response) {
      this.loading.close();
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
      this.loading.close();
      this.$message.error(err.message);
    },
    deleteNode(node) {
      if ("021" == this.updateNodeForm.proccode) {
        this.$message.error("根结点不允许删除");
        return;
      }
      const params = {
        procCode: this.updateNodeForm.proccode,
        id: this.updateNodeForm.id
      };
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delTreeNode(params)
            .then(response => {
              const result = response.data;
              if (result.success) {
                this.$message.success("删除节点成功");
                this.getTreeData();
                this.$refs.updateNodeForm.resetFields();
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
    copyNode() {
      if ("021" == this.updateNodeForm.proccode) {
        this.$message.error("根结点不允许复制");
        return;
      }
      this.$message.success("复制成功");
      this.sourceNode = {
        id: this.updateNodeForm.id,
        sbdm: this.updateNodeForm.proccode
      };
      this.isCut = false;
    },
    pasteNode() {
      if (isEmpty(this.sourceNode) || isEmpty(this.sourceNode.sbdm)) {
        this.$message.error("粘贴失败,请先复制或者剪切一个节点");
        return;
      }
      if (this.sourceNode.sbdm === this.updateNodeForm.proccode) {
        this.$message.error("粘贴失败,源节点和目标节点不能相同");
        return;
      }
      const params = {
        sourceId: this.sourceNode.id,
        sourceSbdm: this.sourceNode.sbdm,
        targetId: this.updateNodeForm.id,
        targetSbdm: this.updateNodeForm.proccode
      };
      if (this.isCut) {
        cutTreeNode(params)
          .then(response => {
            const result = response.data;
            if (result.success) {
              this.getData();
              this.getTreeData();
              this.$message.success("粘贴成功");
            } else {
              this.$message.error(result.message);
            }
          })
          .catch(e => {
            this.$message.error(e.message);
          });
      } else {
        copyTreeNode(params)
          .then(response => {
            const result = response.data;
            if (result.success) {
              this.getData();
              this.getTreeData();
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
    cutNode(data) {
      if ("021" == this.updateNodeForm.proccode) {
        this.$message.error("根结点不允许剪切");
        return;
      }
      this.$message.success("剪切成功");
      this.sourceNode = {
        id: this.updateNodeForm.id,
        sbdm: this.updateNodeForm.proccode
      };
      this.isCut = true;
    },
    saveInfo() {
      this.dialogVisible = false;
      if (this.computedIsEquip() == 1) {
        this.updateNodeForm.isEquip = 1;
      }
      updateDevTreeNode(this.updateNodeForm)
        .then(response => {
          const result = response.data;
          if (result.success) {
            this.getData();
            this.getTreeData();
            this.$message.success("更新节点成功");
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    addNode(node) {
      if (!this.updateNodeForm.proccode) {
        this.$message.error("请选择节点");
        return;
      }
      this.nodeCode = this.selectNodeNO;
      this.addDialogVisible = true;
    },
    getMap() {
      getDeviceTypeMap()
        .then(response => {
          const result = response.data;
          if (result.success) {
            this.devMap = result.data;
            this.code = this.devMap.code;
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    hidenDialog() {
      this.addDialogVisible = false;
      this.getData();
    },
    // 查看映射树
    treeMap(key) {
      this.treeMapDialogVisible = true;
      this.treeMapForm.tree = key;
      this.getTreeData().then(() => {
        // 已选择的
        getAllDevByCond({ [key]: 1 }).then(response => {
          const result = response.data;
          this.checkedKeys = [];
          if (result.success) {
            this.checkedData = result.data;
            result.data.forEach(e => {
              if (e[key]) {
                this.checkedKeys.push(e.proccode);
              }
            });
          } else {
            this.$message.error(result.message);
          }
        });
      });
    },
    // 改变映射树
    changeTree(code) {
      this.treeMapData = this.treeData[0].children.filter(
        item => item.code === code
      );
    },
    // 点击保存  获取差异
    treeMapSave() {
      // 和初始比较 发送变化的项
      let currnetCheckedData = this.$refs.tree.getCheckedNodes();
      let currnetCheckedKeys = currnetCheckedData.map(item => item.code);

      let deleteArr = [];
      // 删除
      this.checkedKeys.forEach(item => {
        if (currnetCheckedKeys.indexOf(item) === -1) {
          deleteArr.push(item);
        }
      });
      let updateArr = [];
      // 新增
      currnetCheckedKeys.forEach(item => {
        if (this.checkedKeys.indexOf(item) === -1) {
          updateArr.push(item);
        }
      });
      let updateIds = [];
      let deleteIds = [];
      currnetCheckedData.forEach(e => {
        if (updateArr.indexOf(e.code) != -1) {
          updateIds.push(e.id);
        }
      });
      this.checkedData.forEach(e => {
        if (deleteArr.indexOf(e.proccode) != -1) {
          deleteIds.push(e.id);
        }
      });
      const map = {
        updateIds: updateIds,
        deleteIds: deleteIds,
        field: this.treeMapForm.tree
      };
      batchUpdateFactoryMapping(map).then(response => {
        const result = response.data;
        if (result.success) {
          this.treeMapDialogVisible = false;
          this.$message.success("保存成功");
          this.getData();
        } else {
          this.$message.error(result.message);
        }
      });
    },
    // 设置勾选的结点
    setCheckedNodes() {
      this.$refs.tree.setCheckedKeys(this.checkedKeys);
    },
    computedIsEquip() {
      return (
        this.updateNodeForm.issproduction ||
        this.updateNodeForm.iscg ||
        this.updateNodeForm.isjj ||
        this.updateNodeForm.isjl ||
        this.updateNodeForm.isWater ||
        this.updateNodeForm.isElect ||
        this.updateNodeForm.isGas ||
        this.updateNodeForm.isReal ||
        this.updateNodeForm.isChecking ||
        this.updateNodeForm.isLubrication ||
        this.updateNodeForm.isInspection ||
        this.updateNodeForm.isMaintain
      );
    }
  }
};
</script>

<style scoped>
.main {
  background-color: lime;
}
.el-col {
  text-align: center;
  margin: 0 auto;
}
.upload {
  display: inline-block;
  margin: 0 5px;
}
</style>
<style lang="scss">
.factoryMapping .el-tree-node > .el-tree-node__children {
  overflow: inherit;
}
.factoryMapping .el-form-item__label,
.factoryMapping .el-form-item__content {
  vertical-align: middle;
}
.treeMap .el-dialog {
  height: 100%;
}
.factoryMapping .m0 {
  margin: 0 !important;
}
</style>
