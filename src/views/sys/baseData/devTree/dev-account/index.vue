<template>
  <el-container style="padding-top:24px">
    <div style="width: 100%;">
      <div style="display: block">
        <el-form
          ref="queryForm"
          :model="queryForm"
          label-width="80px"
          class="margin20 mb0 clearfix"
          inline
        >
          <el-form-item label="设备名称" prop="sbmc">
            <el-input
              clearable
              id="sbmc"
              v-model="queryForm.sbmc"
              plain="true"
              placeholder="请输入设备名称"
            />
          </el-form-item>
          <!-- 折叠板中的内容 -->
          <!-- <el-form-item label="设备类型" prop="devType" v-show="showMore">
            <el-select v-model="queryForm.devType" clearable>
              <el-option
                v-for="item in devMap"
                :key="item.code"
                :label="item.label"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item label="ABC分类" prop="abcFl" v-show="showMore">
            <el-select v-model="queryForm.abcFl" clearable>
              <el-option
                v-for="item in options"
                :key="item.code"
                :label="item.label"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              href="javascript:void(0)"
              type="primary"
              class="btn-b"
              @click="getData(1)"
            >查询</el-button>
            <el-button
              href="javascript:void(0)"
              class="btn-w"
              @click="clearSearchBox"
              icon="el-icon-refresh-left"
              type="primary"
            >重置</el-button>
            <el-button type="text" @click="showMore=!showMore">
              {{ showMore ? '收起' : '展开' }}
              <i
                :class="showMore?'el-icon-arrow-up':'el-icon-arrow-down'"
              />
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="padding20 pb10" style="margin-top:12px; padding-left:30px;">
        <el-button
          type="primary"
          @click="exportDevAccount()"
          icon="el-icon-download"
          v-has="'SYS-ACCOUNT-EXPORTEXCEL'"
        >导出Excel</el-button>
        <!-- <el-button type="primary" @click="addDevAccount()" icon="el-icon-plus">新增详情</el-button> -->
        <el-button
          type="primary"
          @click="exportWord"
          icon="el-icon-download"
          :disabled="batchBtn"
          v-has="'SYS-ACCOUNT-EXPORTWORD'"
        >导出二维码</el-button>
        <el-button
          :disabled="batchBtn"
          type="danger "
          @click="batchDel"
          v-has="'SYS-ACCOUNT-BATCHDELETE'"
        >批量删除</el-button>
      </div>
      <el-table
        id="accountTable"
        stripe
        border
        :data="tableData"
        @selection-change="selsChange"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="sbmc" align="center" label="设备名称" width="200"></el-table-column>
        <!-- <el-table-column prop="sbdm" align="center" label="设备编码" width="180"></el-table-column> -->
        <el-table-column prop="gybh" align="center" label="工艺编号" width="180"></el-table-column>
        <el-table-column prop="zzcs" align="center" label="制造厂商" width="240"></el-table-column>
        <el-table-column prop="azdd" align="center" label="安装地点" width="170"></el-table-column>
        <el-table-column prop="abcFl" align="center" label="ABC分类"></el-table-column>
        <el-table-column prop="glJddw" align="center" label="设备功率"></el-table-column>
        <el-table-column prop="sl" align="center" label="数量"></el-table-column>
        <el-table-column prop="dw" align="center" label="单位"></el-table-column>
        <el-table-column align="center" label="操作" width="200px">
          <template v-slot="scope">
            <el-button type="text" size="small" @click="detailsAccount(scope.row.id)">详情</el-button>
            <el-button
              type="text"
              size="small"
              @click="updateAccount(scope.row.id)"
              v-has="'SYS-ACCOUNT-UPDATE'"
            >更新</el-button>
            <el-button
              type="text"
              size="small"
              @click="deleteAccount(scope.row.id)"
              v-has="'SYS-ACCOUNT-DELETE'"
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
      <el-dialog :title="title" :visible.sync="dialogVisible" width="65%">
        <dev-account-ud
          @hidenDialog="hidenDialog"
          :disabled="disabled"
          :id="selId"
          style="height: 60vh;overflow: auto;"
        />
      </el-dialog>
      <el-dialog title="新增" :visible.sync="addDialogVisible" width="65%">
        <dev-account-add
          @hidenDialog="hidenDialog"
          :newNode="isNewNode"
          style="height: 60vh;overflow: auto;"
        />
      </el-dialog>
    </div>
  </el-container>
</template>
<script>
import Pagination from "@/components/Pagination";
import {
  getDevAccounts,
  deleteDevAccount,
  batchDelDevAccounts,
  downlowdDevQRs,
  getDeviceTypeMap
} from "@/api/sys/dev";
import DevAccountAdd from "./dev-account-add";
import DevAccountUd from "./dev-account-ud";
import { exportExcel } from "@/utils/common";
import FileSaver from "file-saver";

export default {
  name: "DevAccount",
  components: {
    Pagination,
    DevAccountAdd,
    DevAccountUd
  },
  data() {
    return {
      page: {
        pageNum: 1,
        pageSize: 10
      },
      batchBtn: true,
      total: 0,
      tableData: [],
      queryForm: {
        // 查询表单
        sbmc: "",
        zzcs: "",
        abcFl: "",
        devType: null
      },
      showMore: false,
      dialogVisible: false,
      addDialogVisible: false,
      sels: [], // 选择行数据
      selId: "", // 选中行ID
      title: "",
      disabled: false,
      fileUploadUrl: "",
      isNewNode: null,
      devMap: [],
      options: [
        { label: "A", code: "A" },
        { label: "B", code: "B" },
        { label: "C", code: "C" }
      ]
    };
  },
  props: {
    params: {
      type: Number,
      required: false,
      default: null
    }
  },
  mounted() {
    this.getData();
    this.getMap();
  },
  methods: {
    getData(pageNum) {
      if (pageNum === 1) {
        this.page.pageNum = 1;
      }
      let params = null;
      if (this.params) {
        params = {
          ...this.page,
          ...this.queryForm,
          isEquip: this.params
        };
      } else {
        params = {
          ...this.page,
          ...this.queryForm
        };
      }
      getDevAccounts(params)
        .then(response => {
          this.tableData = response.data.data.rows;
          this.total = response.data.data.total;
        })
        .catch(e => {
          this.$message.error(e.message);
        });
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
    addDevAccount() {
      this.addDialogVisible = true;
      this.isNewNode = false;
    },
    addDevNode() {
      this.addDialogVisible = true;
      this.isNewNode = true;
    },
    batchDel() {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          batchDelDevAccounts(this.sels).then(response => {
            const result = response.data;
            if (result.success) {
              this.$message.success("批量删除成功!");
              this.getData(1);
            } else {
              this.$message.error(result.message);
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    exportWord() {
      downlowdDevQRs(this.sels)
        .then(response => {
          const result = response.data;
          if (result) {
            let data = new File([result], { type: "application/octet-stream" });
            FileSaver.saveAs(data, "设备二维码.doc");
            this.getData();
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    updateAccount(id) {
      this.selId = id;
      this.dialogVisible = true;
      this.title = "更新";
      this.disabled = false;
    },
    detailsAccount(id) {
      this.selId = id;
      this.dialogVisible = true;
      this.title = "详情";
      this.disabled = true;
    },
    deleteAccount(id) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteDevAccount(id).then(response => {
            const result = response.data;
            if (result.success) {
              this.$message.success("删除成功!");
              this.getData(1);
            } else {
              this.$message.error(result.message);
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    exportDevAccount() {
      let exportData = [];
      const params = {
        ...this.queryForm,
        pageNum: 1,
        pageSize: this.total
      };
      const fields = {
        sbmc: "设备名称",
        gybh: "工艺编号",
        zzcs: "制造厂商",
        azdd: "安装地点",
        abcFl: "ABC分类",
        glJddw: "设备功率",
        sl: "数量",
        dw: "单位"
      };
      const fileName = "设备台帐";
      getDevAccounts(params)
        .then(response => {
          exportData = response.data.data.rows;
          exportExcel(fileName, fields, exportData);
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    hidenDialog() {
      this.addDialogVisible = false;
      this.dialogVisible = false;
      this.getData();
    },
    selsChange: function(sels) {
      this.sels.length = 0;
      const _this = this;
      sels.forEach(element => {
        _this.sels.push(element.id);
      });
      this.batchBtn = this.sels.length === 0;
    },
    clearSearchBox() {
      this.$refs["queryForm"].resetFields();
      this.getData();
    }
  }
};
</script>
<style lang="scss" scoped>
.el-col > button {
  margin: 12px 0px 0px 12px;
}
</style>>
