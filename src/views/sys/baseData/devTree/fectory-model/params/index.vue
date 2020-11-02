<template>
  <div style="height: 100%" class="parmas11">
    <edit-table
      class="params"
      @getData="getData"
      :page="page"
      :tableData="tableData"
      :opts="opts"
      :total="total"
      @savaData="save"
      @deleteRow="deleteParams"
      :showAddBtn="showAddBtn"
      pageName="SYS-DEV-PARAM"
      height="calc(100% - 45px)"
    >
      <template v-slot:query="{scope}">
        <el-button
          type="primary"
          class="upload"
          @click="downloadTemlate"
          icon="el-icon-download"
        >模版下载</el-button>
        <el-upload
          class="upload"
          :action="fileUploadUrl"
          :show-file-list="false"
          :headers="token"
          :on-success="uploadSuccess"
          :on-error="uploadError"
        >
          <el-button type="primary" icon="el-icon-upload2">批量导入</el-button>
        </el-upload>
      </template>
    </edit-table>
  </div>
</template>

<script>
import EditTable from "@/components/EditTable";
import {
  getDevParameters,
  saveDevParameter,
  updateDevParameter,
  deleteDevParameter,
  downloadDevParams,
  IMPORT_DEV_PARAM,
  initDevParamData
} from "@/api/sys/dev";
import { saveAs } from "file-saver";
import { isEmpty } from "@/utils";
import { getToken } from "@/utils/auth";

export default {
  name: "DevParams",
  components: {
    EditTable
  },
  data() {
    return {
      fileUploadUrl: IMPORT_DEV_PARAM,
      showAddBtn: true,
      DEV_PARAM_TYPE: [],
      page: {
        pageSize: 10,
        pageNum: 1
      },
      total: 0,
      tableData: [],
      opts: [
        {
          type: "input",
          prop: "paramName",
          label: "参数名称"
        },
        {
          type: "input",
          prop: "maxValue",
          label: "最大值"
        },
        {
          type: "input",
          prop: "minValue",
          label: "最小值"
        },
        {
          type: "input",
          prop: "searchPoint",
          label: "查询点位"
        },
        {
          type: "input",
          prop: "defaultPoint",
          label: "设定点位"
        },
        {
          type: "select",
          prop: "paramType",
          label: "参数类型",
          multiple: true,
          options: []
        }
      ],
      token: {
        Authorization: `Bearer ${getToken()}`
      },
      currActiveName: "devParams"
    };
  },
  props: {
    activeName: {
      type: String,
      required: false,
      default: ""
    }
  },
  computed: {
    selectNodeNO() {
      return this.$store.state.sysDev.selectNodeNO;
    }
  },
  watch: {
    selectNodeNO() {
      if (this.activeName == this.currActiveName) {
        this.getData(1);
      }
    },
    activeName() {
      if (this.activeName == this.currActiveName) {
        this.getData(1);
      }
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      initDevParamData()
        .then(response => {
          if (response.data.success) {
            this.DEV_PARAM_TYPE = response.data.data.DEV_PARAM_TYPE;
            for (let i = 0; i < this.DEV_PARAM_TYPE.length; i++) {
              this.DEV_PARAM_TYPE[i].value = this.DEV_PARAM_TYPE[i].code;
            }
            this.opts[5].options = this.DEV_PARAM_TYPE;
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
    },
    getData(type) {
      if (isEmpty(this.selectNodeNO)) {
        return;
      }
      if (type == "1") {
        this.page.pageNum = 1;
      }
      const params = {
        ...this.page,
        devNo: this.selectNodeNO
      };
      getDevParameters(params)
        .then(response => {
          const result = response.data;
          if (result.success) {
            let rows = result.data.rows;
            for (let i = 0; i < rows.length; i++) {
              if (rows[i].paramType) {
                rows[i].paramType = rows[i].paramType.split(",");
              }
            }
            this.tableData = rows;
            this.total = result.data.total;
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.getMessage);
        });
    },
    save(data) {
      if (!this.verifyData(data)) {
        return;
      }
      data = Object.assign(data, { devNo: this.selectNodeNO });
      if (data.id) {
        data.paramType = data.paramType.join(",");
        updateDevParameter(data)
          .then(response => {
            const result = response.data;
            if (result.success) {
              this.$message.success("保存成功");
              this.getData();
            } else {
              this.$message.error(result.message);
            }
          })
          .catch(e => {
            this.$message.error(e.message);
          });
      } else {
        data.paramType = data.paramType.join(",");
        saveDevParameter(data)
          .then(response => {
            const result = response.data;
            if (result.success) {
              this.$message.success("保存成功");
              this.getData();
            } else {
              this.$message.error(result.message);
            }
          })
          .catch(e => {
            this.$message.error(e.message);
          });
      }
    },
    deleteParams(id) {
      deleteDevParameter(id)
        .then(response => {
          const result = response.data;
          if (result.success) {
            this.$message.success("删除成功");
            this.page.pageNum = 1;
            this.getData();
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    downloadTemlate() {
      downloadDevParams()
        .then(response => {
          const result = response.data;
          if (result) {
            let data = new File([result], { type: "application/vnd.ms-excel" });
            saveAs(data, "设备参数导入模版.xls");
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    uploadSuccess(response) {
      if (response.success) {
        this.$message.success("导入成功");
      } else {
        this.$message.error(response.message);
      }
      this.getData();
    },
    uploadError(err) {
      this.$message.error("上传失败" + err.message);
    },
    verifyData(data) {
      if (!data.paramName) {
        this.$message.error("参数名不能为空");
        return false;
      }
      if (!data.searchPoint) {
        this.$message.error("点位不能为空");
        return false;
      }
      return true;
    }
  }
};
</script>
<style lang="scss">
.params {
  height: 100%;
  //   .el-table__body-wrapper {
  //     height: auto !important;
  //     min-height: 200px;
  //     // max-height: 100%
  //   }
  .parmas11 .el-table__empty-block {
    height: 200px;
  }
}
</style>

<style lang="scss" scoped >
.upload {
  display: inline-block;
  margin: 0 7px;
  position: relative;
  top: 4px;
  left: 15px;
  vertical-align: middle;
}
</style>
