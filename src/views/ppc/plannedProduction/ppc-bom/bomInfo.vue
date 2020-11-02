<template>
  <div @keyup.esc="menuVisible = false" tabindex="0" style="height: 100%;" id="bomInfo">
    <el-form
      :inline="true"
      :model="queryForm"
      class="demo-form-inline"
      ref="queryForm"
      style="padding-left:30px;"
    >
      <el-form-item label="BOM编码" prop="bomCode">
        <el-input clearable v-model="queryForm.bomCode" placeholder="请输入物料编码"></el-input>
      </el-form-item>
      <el-form-item label="BOM名称" prop="bomName">
        <el-input clearable v-model="queryForm.bomName" placeholder="请输入物料名称"></el-input>
      </el-form-item>
      <el-form-item label="物料编码" prop="materialCode">
        <el-input clearable v-model="queryForm.materialCode" placeholder="请输入物料编码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getdata(1)" icon="el-icon-search">查询</el-button>
        <el-button type="primary" @click="reset" icon="el-icon-refresh-left">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="downloadTemplate" v-has="'SYS-BOM-EXPORT'">导入模板下载</el-button>
      </el-form-item>
      <el-form-item>
        <el-upload
          class="upload"
          action="/api/sys/ppc/ProductionBom/importBom"
          :show-file-list="false"
          :headers="token"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          :on-success="uploadSuccess"
          :on-error="uploadError"
        >
          <el-button type="primary" plain v-has="'SYS-BOM-IMPORT'">导入</el-button>
        </el-upload>
      </el-form-item>
    </el-form>

    <el-container style="height: calc(100% - 54px - 12px)">
      <el-aside width="40%">
        <el-table
          ref="singleTable"
          :data="treeData"
          style="width: 100%;"
          row-key="uuid"
          highlight-current-row
          height="calc(100% - 72px)"
          border
          lazy
          :load="load"
          @row-click="handleNodeClick"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
          <el-table-column prop="code" label="BOM编码" min-width="200px"></el-table-column>
          <el-table-column prop="name" label="BOM名称" width="200px"></el-table-column>
          <el-table-column prop="ver" width="110px" label="版本号"></el-table-column>
          <el-table-column prop="status" width="100px" :formatter="statusFormat" label="BOM状态"></el-table-column>
          <el-table-column prop="category" width="100px" :formatter="categoryFormat" label="BOM分类"></el-table-column>
          <el-table-column min-width="100px" prop="materialCode" label="物料代码"></el-table-column>
        </el-table>
        <Pagination
          :total="page.total"
          :page.sync="page.pageNum"
          :limit.sync="page.pageSize"
          @pagination="getdata"
        />
      </el-aside>
      <el-main>
        <div
          class="tableshadow"
          style="width: calc(100%);height:calc(100% - 0px);padding-bottom: 24px"
        >
          <!--padding-bottom:24px，由于子页面开头使用devide,导致高度被莫名挤压--王剑 -->
          <bom-right
            @delBom="delBom"
            @save="renovate"
            @leftReflash="leftReflash"
            :id="objId"
            style="height: 100%;"
          />
        </div>
      </el-main>
    </el-container>
  </div>
</template>


<script>
import {
  getTreeData,
  copyBom,
  getTreeDetailData,
  bomStatus,
  downlowdBomModelTemp
} from "@/api/productionPlanning";
import BomRight from "./bom-right";
import Pagination from "@/components/Pagination";
import { saveAs } from "file-saver";
import { getToken } from "@/utils/auth";
import { resetQueryForm } from "@/utils/common";
export default {
  name: "bom",
  components: {
    BomRight,
    Pagination
  },
  data() {
    return {
      queryForm: {
        bomCode: "",
        bomName: "",
        materialCode: ""
      },
      defaultProps: {
        children: "children",
        label: "name"
      },
      menuVisible: false,
      top: 0,
      left: 0,
      treeData: [],
      DialogVisible: false,
      showMore: null,
      objId: "",
      expandedKeys: [],
      bomStatusList: [],
      MATERIAL_CATEGORY: [],
      page: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      row: null,
      token: {
        Authorization: `Bearer ${getToken()}`
      }
    };
  },
  mounted() {
    this.$refs["singleTable"].layout.store.states.indent = 8;
    this.initData();
    this.getdata();
  },
  methods: {
    load(tree, treeNode, resolve) {
      console.log(this.$refs["singleTable"]);
      getTreeDetailData(tree.id)
        .then(response => {
          setTimeout(() => {
            resolve(response.data.data);
          });
          // resolve =
        })
        .catch(e => {
          this.$message({
            type: "error",
            message: e.message,
            duration: 3 * 1000
          });
        });
    },
    // 导出模板
    downloadTemplate() {
      downlowdBomModelTemp()
        .then(response => {
          const result = response.data;
          if (result) {
            let data = new File([result], { type: "application/octet-stream" });
            saveAs(data, "BOM管理.xlsx");
            // this.getData();
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },

    // 导入成功
    uploadSuccess(response) {
      if (response.success) {
        this.$message.success("导入成功");
        this.getData();
      } else {
        this.$message.error(response.data);
      }
    },
    // 导入失败
    uploadError(err) {
      this.$message.error(err.message);
    },

    handleRightClick(e, data, node, self) {
      let id = data.id;
      this.$confirm("此操作将复制该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          copyBom(id).then(response => {
            if (response.data.success) {
              this.getdata();
              this.$message.success("复制成功!");
            } else this.$message.error("复制异常,请联系管理员!");
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消复制"
          });
        });
    },
    getdata(pageNum) {
      return new Promise((resolve, reject) => {
        if (pageNum === 1) {
          this.page.pageNum = pageNum;
        }
        const params = {
          ...this.page,
          ...this.queryForm
        };
        getTreeData(params)
          .then(response => {
            if (response.data.success) {
              this.treeData = response.data.data.list;
              if (this.treeData.length > 0) {
                this.expandedKeys.push(this.treeData[0].id); //展开父节点
                //   如果objId为空 则objId为第一条数据的id
                if (!this.objId) {
                  this.objId = this.treeData[0].id;
                }
              }
              this.page.total = response.data.data.total;
              resolve();
            } else {
              this.$message.error(
                response.data.message + ":" + response.data.data
              );
              reject();
            }
          })
          .catch(e => {
            this.$message({
              type: "error",
              message: e.message,
              duration: 3 * 1000
            });
          });
      });
    },
    initData() {
      bomStatus().then(response => {
        let result = response.data;
        if (result.success) {
          this.bomStatusList = result.data.BOM_STATUS;
          this.MATERIAL_CATEGORY = result.data.MATERIAL_CATEGORY;
          //   const row = this.row;
          //   console.log(row);
          //   this.$refs.singleTable.setCurrentRow(row);
        }
      });
    },
    renovate() {
      //   this.objId = "";
      this.getdata();
    },
    delBom() {
      //   this.objId = "";
      this.getdata().then(() => {
        this.objId = this.treeData[0].id;
      });
    },
    handleNodeClick(row) {
      this.objId = row.id;
      // this.DialogVisible = true
      this.row = row;
    },
    statusFormat(row, column) {
      for (var i = 0; i < this.bomStatusList.length; i++) {
        if (row.status == this.bomStatusList[i].code) {
          return this.bomStatusList[i].label;
        }
      }
    },
    categoryFormat(row, column) {
      for (var i = 0; i < this.MATERIAL_CATEGORY.length; i++) {
        if (row.category == this.MATERIAL_CATEGORY[i].code) {
          return this.MATERIAL_CATEGORY[i].label;
        }
      }
    },
    format(data) {
      data.forEach((item, index) => {
        if (item.uuid == this.row.uuid) {
          //   this.row = item;
          this.$set(this.treeData, index, this.row);
        }
      });
    },
    leftReflash(params) {
      this.row.name = params.bomName;
      this.row.status = params.versionStatus;
      this.format(this.treeData);
    },
    reset() {
      resetQueryForm(this, "queryForm", "getdata");
    }
  }
};
</script>

<style scoped>
.app-main > div {
  height: 100%;
}

.el-main {
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.15);
}
</style>
<style >
#bomInfo .el-table__indent {
  /* padding-left: 8px !important; */
}
</style>
