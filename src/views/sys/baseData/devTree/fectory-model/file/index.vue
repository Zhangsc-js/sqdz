<template>
  <div class="file">
    <el-form ref="queryForm" label-width="80px" inline>
      <el-row>
        <el-form-item label="文件名称" prop="fileName">
          <el-input
            clearable
            id="fileName"
            v-model="queryForm.fileName"
            plain="true"
            placeholder="请输入文件名称"
          />
        </el-form-item>
        <el-form-item label="上传时间" prop="createdOn">
          <el-date-picker
            id="createdOn"
            v-model="queryForm.createdOn"
            type="date"
            placeholder="请选择上传时间"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="getData(1)">查询</el-button>
          <el-button @click="clearSearchBox" type="primary" icon="el-icon-refresh-left">重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <div>
      <el-upload
        :action="fileUploadUrl"
        multiple
        :limit="3"
        :show-file-list="false"
        :on-success="uploadSuccess"
        :headers="token"
        :data="{sbdm: selectNodeNO, type: 1}"
        :on-error="uploadError"
      >
        <el-button size="small" type="primary" v-show="showUpload">点击上传</el-button>
      </el-upload>
    </div>
    <el-table stripe border :data="tableData" style="width: 100%">
      <el-table-column align="center" prop="fileName" label="文件名称"></el-table-column>
      <el-table-column align="center" prop="createdOn" label="上传时间"></el-table-column>
      <el-table-column align="center" prop="sbdm" label="设备代码"></el-table-column>
      <el-table-column fixed="right" align="center" label="操作">
        <template v-slot="scope">
          <el-button
            v-if="scope.row.fileName.split('.')[1] === 'pdf'"
            type="text"
            size="small"
            @click="showPDF(scope.row.id)"
          >预览</el-button>
          <el-button type="text" size="small" @click="delFile(scope.row.id)">删除</el-button>
          <el-button type="text" size="small" @click="downloadFile(scope.row)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :total="total"
      :page.sync="page.pageNum"
      :limit.sync="page.pageSize"
      @pagination="getData"
    />
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import {
  getDevAttachmentFiles,
  FILE_UPLOAD_URL,
  downloadDevFile,
  delAttachmentFile,
  getFileURL
} from "@/api/sys/dev";
import { isNotEmpty, simpleDateFormat } from "@/utils/index";
import { getToken } from "@/utils/auth";
import { saveAs } from "file-saver";

export default {
  name: "DevAttachFile",
  components: {
    Pagination
  },
  data() {
    return {
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      tableData: [],
      queryForm: {
        fileName: "",
        createdOn: null
      },
      fileUploadUrl: FILE_UPLOAD_URL, // 文件上传路径
      showUpload: false,
      showPreview: "",
      token: {
        Authorization: `Bearer ${getToken()}`
      },
      currActiveName: 'devAttachFile'
    };
  },
  props: {
    activeName: {
      type: String,
      required: false,
      default: ''
    }
  },
  computed: {
    selectNodeNO() {
      return this.$store.state.sysDev.selectNodeNO;
    },
    isPDF() {
      if (this.queryForm.fileName.split(".") === "pdf") {
        return true;
      } else {
        return false;
      }
    }
  },
  watch: {
    selectNodeNO() {
      if (this.activeName == this.currActiveName) {
        this.getData();
        if (isNotEmpty(this.selectNodeNO)) {
          this.showUpload = true;
        }
      }
    },
    activeName() {
      if (this.activeName == this.currActiveName) {
        this.getData();
        if (isNotEmpty(this.selectNodeNO)) {
          this.showUpload = true;
        }
      }
    }
  },
  mounted() {
    if (isNotEmpty(this.selectNodeNO)) {
      this.showUpload = true;
      this.getData();
    }
  },
  methods: {
    getData(pageNum) {
      if (pageNum === 1) {
        this.page.pageNum = 1;
      }
      this.queryForm.createdOn = simpleDateFormat(
        this.queryForm.createdOn,
        "yyyy-MM-dd HH:mm:ss"
      );
      const params = {
        ...this.page,
        ...this.queryForm,
        sbdm: this.selectNodeNO
      };
      getDevAttachmentFiles(params)
        .then(response => {
          const result = response.data;
          if (result.success && result.data) {
            this.tableData = result.data.rows;
            this.total = result.data.total;
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
        this.$message.success("上传成功");
      } else {
        this.$message.error(response.message);
      }
      this.getData();
    },
    uploadError(err) {
      this.$message.error("上传失败" + err.message);
    },
    delFile(id) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delAttachmentFile(id).then(() => {
            this.getData(1);
            this.$message.success("删除成功!");
          });
        })
        .catch(() => {
          this.$message.info("已取消删除!");
        });
    },
    downloadFile(row) {
      downloadDevFile(row.id)
        .then(response => {
          const result = response.data;
          if (result) {
            let data = new File([result], { type: "application/octet-stream" });
            saveAs(data, row.fileName);
            this.getData();
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    clearSearchBox() {
      this.queryForm = {
        fileName: "",
        createdOn: null
      };
    },
    showPDF(id) {
      getFileURL(id).then(response => {
        const fileURL = response.data.data;
        let imgServer = process.env.VUE_APP_DEV_FILE_URL;
        if (fileURL && fileURL) {
          window.open(imgServer + fileURL);
        }
      });
    }
  }
};
</script>
<style lang="scss">
.file .el-date-editor.el-input {
  width: 100%;
}
</style>
