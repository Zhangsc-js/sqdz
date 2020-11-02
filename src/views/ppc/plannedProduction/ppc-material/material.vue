<template>
  <div style="height: 100%;">
    <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
      <el-form-item label="物料编码">
        <el-input v-model="queryForm.materialCode" placeholder="请输入物料编码"></el-input>
      </el-form-item>
      <el-form-item label="物料名称">
        <el-input v-model="queryForm.materialName" placeholder="请输入物料名称"></el-input>
      </el-form-item>
      <el-form-item label="物料类别">
        <el-select
          v-model="queryForm.category"
          filterable
          placeholder="请选择"
          style="width: 100%;height: 100%"
        >
          <el-option
            v-for="(item,index) in this.materialStatus"
            :key="index"
            :label="item.label"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getData(1)">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          href="javascript:void(0)"
          class="btn-w"
          @click="clearSearchBox"
          type="primary"
          icon="el-icon-refresh-left"
        >重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="addmaterial"
          icon="el-icon-plus"
          v-has="'SYS-MATERIAL-SAVE'"
        >新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          :disabled="batchBtn"
          type="danger "
          @click="batchDelmaterial"
          v-has="'SYS-MATERIAL-BATDEL'"
        >批量删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          plain
          @click="downloadTemplate"
          v-has="'SYS-MATERIAL-EXPORT'"
        >导入模板下载</el-button>
      </el-form-item>
      <el-form-item>
        <el-upload
          class="upload"
          action="/api/sys/ppc/material/importMaterial"
          :show-file-list="false"
          :headers="token"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          :on-success="uploadSuccess"
          :on-error="uploadError"
        >
          <el-button type="primary" plain v-has="'SYS-MATERIAL-IMPORT'">导入</el-button>
        </el-upload>
      </el-form-item>
    </el-form>

    <el-table
      highlight-current-row
      :data="tableData"
      stripe
      @selection-change="objSelection"
      border
      height="calc(100% - 52px - 50px - 12px - 12px)"
      style=" width: 100%"
    >
      <el-table-column type="selection" width="60" center></el-table-column>
      <el-table-column prop="materialCode" label="物料编码" min-width="150"></el-table-column>
      <el-table-column prop="materialName" label="物料名称" min-width="120"></el-table-column>
      <el-table-column prop="specification" label="物料规格" min-width="180"></el-table-column>
      <el-table-column prop="quality" label="物料材质" min-width="180"></el-table-column>
      <el-table-column :formatter="categoryFormat" prop="category" label="物料类别" min-width="100"></el-table-column>
      <el-table-column prop="modelNumber" label="物料型号" min-width="120"></el-table-column>
      <el-table-column prop="primaryUnit" label="单位" min-width="80"></el-table-column>
      <el-table-column
        fixed="right"
        align="center"
        label="操作"
        width="170px"
        v-if="hasBtn(['SYS-MATERIAL-UPDATE','SYS-MATERIAL-DELETE'])"
      >
        <template v-slot="scope">
          <el-button
            type="text"
            size="small"
            @click="updateMaterial(scope.row.id)"
            v-has="'SYS-MATERIAL-UPDATE'"
          >更新</el-button>
          <el-button
            type="text"
            size="small"
            @click="delectMaterialById(scope.row.id)"
            v-has="'SYS-MATERIAL-DELETE'"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      :total="total"
      :page.sync="page.current"
      :limit.sync="page.size"
      @pagination="getData"
    />
    <el-dialog :title="title" :visible.sync="addDialogVisible" width="55%">
      <Addmaterial
        @save="hidenDialog"
        @cancel="hidenDialogCancel"
        :type="type"
        :id="objId"
        :trigger="addDialogVisible"
      />
    </el-dialog>
  </div>
</template>

<script>
import { hasBtn } from "@/utils/index";
import { getToken } from "@/utils/auth";
import Pagination from "@/components/Pagination";
import Addmaterial from "./Addmaterial";
import {
  getMaterial,
  delectmaterialBatch,
  delectMaterialById,
  queryStatus,
  downlowdMaterialModelTemp
} from "@/api/productionPlanning";
import { saveAs } from "file-saver";

export default {
  name: "ppcmaterial",
  components: {
    Addmaterial,
    Pagination
  },
  data() {
    return {
      page: {
        current: 1,
        size: 10
      },
      total: 0,
      title: "",
      token: {
        Authorization: `Bearer ${getToken()}`
      },
      type: "", //1新增，2修改
      queryForm: {
        materialCode: "",
        materialName: ""
      },
      tableData: [],
      addDialogVisible: false,
      upDialogVisible: false,
      objId: "",
      objIds: [], // 选择行数据
      batchBtn: true,
      materialStatus: []
    };
  },
  methods: {
    hasBtn,
    categoryFormat(row, column) {
      for (var i = 0; i < this.materialStatus.length; i++) {
        if (row.category == this.materialStatus[i].code) {
          return this.materialStatus[i].label;
        }
      }
    },
    // 导出模板
    downloadTemplate() {
      downlowdMaterialModelTemp()
        .then(response => {
          const result = response.data;
          if (result) {
            let data = new File([result], { type: "application/octet-stream" });
            saveAs(data, "物料管理.xlsx");
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
    addmaterial() {
      this.type = "1";
      this.addDialogVisible = true;
      this.title = "新增";
    },
    updateMaterial(id) {
      this.objId = id;
      this.type = "2";
      this.addDialogVisible = true;
      this.title = "更新";
    },
    clearSearchBox() {
      this.queryForm = {
        materialCode: "",
        materialName: "",
        category: ""
      };
      this.getData();
    },
    hidenDialog() {
      this.addDialogVisible = false;
      this.upDialogVisible = false;
      this.getData(this.page);
    },
    hidenDialogCancel() {
      this.addDialogVisible = false;
      this.upDialogVisible = false;
    },
    getData(current) {
      if (current === 1) {
        this.page.current = current;
      }
      const params = {
        ...this.page,
        ...this.queryForm
      };
      getMaterial(params)
        .then(response => {
          let data = response.data;
          this.tableData = data.rows;
          this.total = data.total;
          this.queryStatus();
        })
        .catch(e => {
          this.$message({
            type: "error",
            message: e.message,
            duration: 3 * 1000
          });
        });
    },
    queryStatus() {
      queryStatus().then(response => {
        let result = response.data;
        if (result.success) {
          this.materialStatus = result.data.MATERIAL_CATEGORY;
        }
      });
    },
    delectMaterialById(id) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delectMaterialById(id).then(response => {
            if (response.data.success) {
              this.getData(1);
              this.$message.success("删除成功!");
            } else
              this.$message.error(
                response.data.message + ":" + response.data.data
              );
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    objSelection(objs) {
      this.objIds.length = 0;
      const _this = this;
      objs.forEach(element => {
        _this.objIds.push(element.id);
      });
      this.batchBtn = this.objIds.length === 0;
    },
    batchDelmaterial() {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delectmaterialBatch(this.objIds).then(response => {
            if (response.data.success) {
              this.getData();
              this.$message.success("删除成功!");
            } else
              this.$message.error(
                response.data.message + ":" + response.data.data
              );
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },

  mounted() {
    this.getData();
  }
};
</script>

<style >
.vjs-big-play-button {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
