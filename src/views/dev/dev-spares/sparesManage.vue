<template>
  <div style="height: 100%;">
    <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
      <el-form-item label="备品备件名称">
        <el-input v-model="queryForm.sparesName" placeholder="请输入备品备件名称"></el-input>
      </el-form-item>
      <el-form-item label="备品性质：" prop="sparesType">
        <el-select
          v-model="queryForm.sparesType"
          placeholder="请选择备品备件性质"
          filterable
          style="width: 100%"
          clearable
        >
          <el-option
            v-for="item in SPARES_TYPE"
            :key="item.code"
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
          @click="addSpares"
          icon="el-icon-plus"
          v-has="'SYS-SPARES-SAVE'"
        >新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          :disabled="batchBtn"
          type="danger "
          @click="batchDelSpares"
          v-has="'SYS-SPARES-BATDEL'"
        >批量删除</el-button>
      </el-form-item>
      <!--            <el-form-item>-->
      <!--                <el-button-->
      <!--                    type="primary"-->
      <!--                    plain-->
      <!--                    @click="downloadTemplate"-->
      <!--                    v-has="'SYS-SPARES-EXPORT'"-->
      <!--                >导入模板下载</el-button>-->
      <!--            </el-form-item>-->
      <el-form-item>
        <el-upload
          class="upload"
          action="/api/sys/ppc/material/importMaterial"
          :show-file-list="false"
          :headers="token"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :on-progress="progress"
        >
          <el-button type="primary" plain v-has="'SYS-MATERIAL-IMPORT'">导入</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="text" @click="showMore=!showMore">
          {{ showMore ? '收起' : '展开' }}
          <i class="el-icon-arrow-down" />
        </el-button>
      </el-form-item>
      <div v-show="showMore">
        <el-row>
          <el-form-item label="备品备件编码">
            <el-input v-model="queryForm.sparesCode" placeholder="请输入备品备件编码"></el-input>
          </el-form-item>
          <el-form-item label="补货方式：" prop="replenishType">
            <el-select
              v-model="queryForm.replenishType"
              placeholder="请选择"
              filterable
              style="width: 100%"
              clearable
            >
              <el-option
                v-for="item in REPLENISH_TYPE"
                :key="item.code"
                :label="item.label"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
      </div>
    </el-form>

    <el-table
      highlight-current-row
      :data="tableData"
      stripe
      @selection-change="objSelection"
      border
      :height="showMore?'calc(100% - 52px - 50px - 12px - 12px - 52px)':'calc(100% - 52px - 50px - 12px - 12px)'"
      style=" width: 100%;"
    >
      <el-table-column type="selection" width="60" center></el-table-column>
      <el-table-column prop="sparesCode" label="备品备件编码" min-width="150"></el-table-column>
      <el-table-column prop="sparesName" label="备品备件名称" min-width="120"></el-table-column>
      <el-table-column prop="specification" label="规格" min-width="180"></el-table-column>
      <el-table-column prop="modelNumber" label="型号" min-width="120"></el-table-column>
      <el-table-column prop="quality" label="材质" min-width="180"></el-table-column>
      <el-table-column prop="sparesTypeName" label="性质" min-width="80"></el-table-column>
      <el-table-column prop="replenishTypeName" label="补货方式" min-width="80"></el-table-column>
      <el-table-column
        fixed="right"
        align="center"
        label="操作"
        width="170px"
        v-if="hasBtn(['SYS-SPARES-UPDATE','SYS-SPARES-DELETE'])"
      >
        <template v-slot="scope">
          <el-button
            type="text"
            size="small"
            @click="updateSpares(scope.row.id)"
            v-has="'SYS-SPARES-UPDATE'"
          >更新</el-button>
          <el-button
            type="text"
            size="small"
            @click="delectSparesById(scope.row.id)"
            v-has="'SYS-SPARES-DELETE'"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      :total="total"
      :page.sync="page.pageNum"
      :limit.sync="page.pageSize"
      @pagination="getData"
    />
    <el-dialog :title="title" :visible.sync="addDialogVisible" width="55%">
      <editSpares
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
import editSpares from "./editSpares";
import { initSparesData, queryList, delSparesMulti } from "@/api/dev/devSpares";
import { saveAs } from "file-saver";

export default {
  name: "devSpares",
  components: {
    Pagination,
    editSpares
  },
  data() {
    return {
      loading: null,
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      title: "",
      token: {
        Authorization: `Bearer ${getToken()}`
      },
      type: "", //1新增，2修改
      queryForm: {
        sparesCode: "",
        sparesName: "",
        sparesType: "",
        replenishType: ""
      },
      tableData: [],
      addDialogVisible: false,
      upDialogVisible: false,
      objId: "",
      objIds: [], // 选择行数据
      batchBtn: true,
      SPARES_TYPE: [],
      REPLENISH_TYPE: [],
      showMore: false
    };
  },
  methods: {
    hasBtn,
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
      this.loading.close();
      if (response.success) {
        this.$message.success("导入成功");
      } else {
        this.$message({
          message: response.message,
          type: "error",
          duration: 8 * 1000
        });
      }
      this.getData();
    },
    // 导入失败
    uploadError(err) {
      this.loading.close();
      this.$message.error(err.message);
    },
    addSpares() {
      this.type = "1";
      this.addDialogVisible = true;
      this.title = "新增";
    },
    updateSpares(id) {
      this.objId = id;
      this.type = "2";
      this.addDialogVisible = true;
      this.title = "更新";
    },
    clearSearchBox() {
      this.queryForm = {
        sparesCode: "",
        sparesName: ""
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
        this.page.pageNum = current;
      }
      const params = {
        ...this.page,
        ...this.queryForm
      };
      params.sparesNameLike = params.sparesName;
      params.sparesName = "";
      queryList(params)
        .then(response => {
          let data = response.data.data;
          for (let i = 0; i < data.rows.length; i++) {
            for (let j = 0; j < this.SPARES_TYPE.length; j++) {
              if (data.rows[i].sparesType == this.SPARES_TYPE[j].code) {
                data.rows[i].sparesTypeName = this.SPARES_TYPE[j].label;
              }
            }
            for (let j = 0; j < this.REPLENISH_TYPE.length; j++) {
              if (data.rows[i].replenishType == this.REPLENISH_TYPE[j].code) {
                data.rows[i].replenishTypeName = this.REPLENISH_TYPE[j].label;
              }
            }
          }
          this.tableData = data.rows;
          this.total = data.total;
        })
        .catch(e => {
          this.$message({
            type: "error",
            message: e.message,
            duration: 3 * 1000
          });
        });
    },
    progress() {
      this.loading = this.$loading({
        lock: true,
        text: "上传中",
        background: "rgba(0, 0, 0, 0.7)"
      });
    },
    delSpares(id) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delSpares(id).then(response => {
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
    batchDelSpares() {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delSparesMulti(this.objIds.join(",")).then(response => {
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
    },
    initData() {
      initSparesData()
        .then(response => {
          if (response.data.success) {
            this.SPARES_TYPE = response.data.data.SPARES_TYPE;
            this.REPLENISH_TYPE = response.data.data.REPLENISH_TYPE;
            this.getData();
          } else {
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    }
  },

  mounted() {
    this.initData();
  }
};
</script>

<style scoped>
</style>
