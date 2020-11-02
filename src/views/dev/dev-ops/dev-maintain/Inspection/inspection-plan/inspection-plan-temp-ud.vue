<template>
  <div>
    <el-divider content-position="center">基础信息</el-divider>
    <el-form :model="updateForm" ref="updateForm" label-width="80px" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="模板编码" prop="tempNo">
            <el-input v-model="updateForm.tempNo" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="模板名称" prop="tempName">
            <el-input v-model="updateForm.tempName" :disabled="disabled"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              v-model="updateForm.remark"
              :disabled="disabled"
              placeholder="请输入备注"
              plain="true"
            />
          </el-form-item>
        </el-col>
        <el-col :span="2" v-if="!disabled" :offset="2" style="padding-top: 25px">
          <el-button type="primary" @click="save()">保存</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div>
      <div class="padding20 pt12" v-if="!disabled">
        <el-button type="primary" @click="addCheckingTempItem()" icon="el-icon-plus">新增</el-button>
      </div>
      <el-divider content-position="center">巡检设备</el-divider>
      <el-table
        stripe
        border
        highlight-current-row
        @row-click="getTableData"
        :data="devTableData"
        style="width: 100%"
      >
        <el-table-column prop="devSort" label="序号"></el-table-column>
        <el-table-column prop="devNo" label="设备编码"></el-table-column>
        <el-table-column prop="devName" label="设备名称"></el-table-column>
        <el-table-column prop="count" label="巡检项目数"></el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="270px">
          <template v-slot="scope">
            <el-button type="text" size="small" @click="deleteByDevNoAndTempNo(scope.row)">删除</el-button>
            <el-button
              v-if="!disabled"
              type="text"
              size="small"
              @click="moveDevTop(scope.$index, scope.row)"
            >置顶</el-button>
            <el-button
              v-if="!disabled"
              type="text"
              size="small"
              @click="moveDevUp(scope.$index, scope.row)"
            >上移</el-button>
            <el-button
              v-if="!disabled"
              type="text"
              size="small"
              @click="moveDevDown(scope.$index, scope.row)"
            >下移</el-button>
            <el-button
              v-if="!disabled"
              type="text"
              size="small"
              @click="moveDevBottom(scope.$index, scope.row)"
            >置底</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-divider content-position="center">设备巡检项目</el-divider>
      <el-table stripe border highlight-current-row :data="tableData" style="width: 100%">
        <el-table-column prop="sort" label="序号" width="80"></el-table-column>
        <el-table-column prop="item.itemInfoNo" label="巡检项信息编码" width="80"></el-table-column>
        <el-table-column prop="item.partsName" label="巡检部位" width="100"></el-table-column>
        <el-table-column prop="item.projectName" label="巡检项目" width="100"></el-table-column>
        <el-table-column prop="item.methodName" label="巡检方法" width="200"></el-table-column>
        <el-table-column prop="item.criteriaName" label="巡检标准" width="200"></el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="270">
          <template v-slot="scope">
            <el-button
              v-if="!disabled"
              type="text"
              size="small"
              @click="deletePlanItem(scope.row.id)"
            >删除</el-button>
            <el-button v-if="!disabled" type="text" size="small" @click="moveTop(scope.$index)">置顶</el-button>
            <el-button v-if="!disabled" type="text" size="small" @click="moveUp(scope.$index)">上移</el-button>
            <el-button v-if="!disabled" type="text" size="small" @click="moveDown(scope.$index)">下移</el-button>
            <el-button
              v-if="!disabled"
              type="text"
              size="small"
              @click="moveBottom(scope.$index)"
            >置底</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="title" append-to-body :visible.sync="dialogVisible" width="65%">
      <component
        :is="dialogComponent"
        @hidenDialog="hidenDialog"
        :disabled="itemDisabled"
        :tempNo="updateForm.tempNo"
        :itemId="itemId"
      ></component>
    </el-dialog>
  </div>
</template>

<script>
import InspectionPlanItemAdd from "./temp-item-add";
import Pagination from "@/components/Pagination";
import {
  getInspectionTempItems,
  deleteInspectionTempItem,
  batchDelInspectionTempItems,
  getInspectionTempById,
  updateInspectionTemp,
  getInsTempGroupByDev,
  deleteByInsDevNo,
  devSortTempItem,
  sortTempItem
} from "@/api/device";

export default {
  name: "inspectionPlanUp",
  components: {
    Pagination,
    InspectionPlanItemAdd
  },
  props: {
    disabled: {
      type: Boolean,
      required: true
    },
    tempId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      updateForm: {},
      rules: {
        tempName: [
          { required: true, message: "请选输入设备名称", trigger: "change" }
        ]
      },
      queryForm: {
        devName: ""
      },
      tableData: [],
      sels: [],
      page: {
        pageNum: 1,
        pageSize: 5
      },
      pageSizes: [5, 10, 20, 50],
      total: 0,
      batchBtnVisibles: true,
      title: "",
      dialogVisible: false,
      dialogComponent: null,
      itemId: "",
      itemDisabled: false,
      devTableData: []
    };
  },
  watch: {
    tempId() {
      this.getData();
      this.tableData = [];
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData(pageNum) {
      if (pageNum === 1) {
        this.page.pageNum = 1;
      }
      getInspectionTempById(this.tempId)
        .then(response => {
          const result = response.data;
          if (result.success) {
            this.updateForm = result.data;
            this.getDevData();
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    getTableData(row) {
      if (row) {
        this.selDevNo = row.devNo;
      }
      const params = {
        tempNo: this.updateForm.tempNo,
        devNo: this.selDevNo
      };
      getInspectionTempItems(params)
        .then(response => {
          if (response.data.data) {
            this.tableData = response.data.data;
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    // 获取中间设备信息
    getDevData() {
      const params = {
        tempNo: this.updateForm.tempNo
      };
      getInsTempGroupByDev(params).then(response => {
        const result = response.data;
        if (result.success) {
          this.devTableData = result.data;
        } else {
          this.$message.error(result.message);
        }
      });
    },
    deleteByDevNoAndTempNo(row) {
      const params = {
        devNo: row.devNo,
        tempNo: row.tempNo
      };
      this.$confirm("此操作将永久删除该记录及其子记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteByInsDevNo(params).then(response => {
            const result = response.data;
            if (result.success) {
              this.$message.success("删除成功!");
              // 清空字表
              this.tableData = [];
              // 刷新主表
              this.getDevData();
            } else {
              this.$message.error(result.message);
            }
          });
        })
        .catch(e => {
          this.$message.info("已取消删除");
        });
    },
    save() {
      this.$refs["updateForm"].validate(valid => {
        if (valid) {
          updateInspectionTemp(this.updateForm)
            .then(response => {
              const result = response.data;
              if (result.success) {
                this.$message.success("保存成功");
              } else {
                this.$message.error(result.message);
              }
            })
            .catch(e => {
              this.$message.error(e.message);
            })
            .finally(() => {
              this.cancel();
            });
        } else {
          this.$message.error("保存失败，请检查必填项是否都正确填写");
          return false;
        }
      });
    },
    addCheckingTempItem() {
      this.dialogVisible = true;
      this.dialogComponent = InspectionPlanItemAdd;
      this.title = "选择设备";
    },
    deletePlanItem(id) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteInspectionTempItem(id).then(response => {
            const result = response.data;
            if (result.success) {
              this.$message.success("删除成功!");
              this.getTableData();
              this.getDevData();
            } else {
              this.$message.error(result.message);
            }
          });
        })
        .catch(e => {
          this.$message.info("已取消删除");
        });
    },
    batchDelete() {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          batchDelInspectionTempItems(this.sels).then(response => {
            const result = response.data;
            if (result.success) {
              this.$message.success("删除成功!");
              this.getTableData();
            } else {
              this.$message.error(result.message);
            }
          });
        })
        .catch(e => {
          this.$message.info("已取消删除");
        });
    },
    hidenDialog() {
      this.dialogVisible = false;
      this.getDevData();
      this.tableData = [];
    },
    selsChange: function(sels) {
      this.sels.length = 0;
      const _this = this;
      sels.forEach(element => {
        _this.sels.push(element.id);
      });
      this.batchBtnVisibles = this.sels.length === 0;
    },
    clearSearchBox() {
      this.$refs["queryForm"].resetFields();
    },
    moveDevTop(index, row) {
      if (index == 0) return;
      const params = {
        targetDevNO: this.devTableData[0].devNo,
        sourceDevNo: row.devNo,
        tempNo: row.tempNo
      };
      this.devSortTempItem(params);
    },
    moveDevUp(index, row) {
      if (index == 0) return;
      const params = {
        targetDevNO: this.devTableData[index - 1].devNo,
        sourceDevNo: row.devNo,
        tempNo: row.tempNo
      };
      this.devSortTempItem(params);
    },
    moveDevDown(index, row) {
      const lastIndex = this.devTableData.length - 1;
      if (lastIndex == index) return;
      const params = {
        targetDevNO: this.devTableData[index + 1].devNo,
        sourceDevNo: row.devNo,
        tempNo: row.tempNo
      };
      this.devSortTempItem(params);
    },
    moveDevBottom(index, row) {
      const lastIndex = this.devTableData.length - 1;
      if (lastIndex == index) return;
      const params = {
        targetDevNO: this.devTableData[lastIndex].devNo,
        sourceDevNo: row.devNo,
        tempNo: row.tempNo
      };
      this.devSortTempItem(params);
    },
    moveTop(index) {
      if (index == 0) return;
      const tempSort = this.tableData[index].sort;
      this.tableData[index].sort = this.tableData[0].sort;
      this.tableData[0].sort = tempSort;
      let items = [this.tableData[index], this.tableData[0]];
      this.sortTempItem(items);
    },
    moveUp(index) {
      if (index == 0) return;
      const lessSort = index - 1;
      const tempSort = this.tableData[index].sort;
      this.tableData[index].sort = this.tableData[lessSort].sort;
      this.tableData[lessSort].sort = tempSort;
      let items = [this.tableData[index], this.tableData[lessSort]];
      this.sortTempItem(items);
    },
    moveDown(index) {
      const lastIndex = this.tableData.length - 1;
      if (lastIndex == index) return;
      const greaterSort = index + 1;
      const tempSort = this.tableData[index].sort;
      this.tableData[index].sort = this.tableData[greaterSort].sort;
      this.tableData[greaterSort].sort = tempSort;
      let items = [this.tableData[index], this.tableData[greaterSort]];
      this.sortTempItem(items);
    },
    moveBottom(index) {
      const lastIndex = this.tableData.length - 1;
      if (lastIndex == index) return;
      // 交换序号
      const tempSort = this.tableData[index].sort;
      this.tableData[index].sort = this.tableData[lastIndex].sort;
      this.tableData[lastIndex].sort = tempSort;
      let items = [this.tableData[index], this.tableData[lastIndex]];
      this.sortTempItem(items);
    },
    sortTempItem(records) {
      sortTempItem(records).then(res => {
        const result = res.data;
        if (result.success) {
          this.$message.success("移动成功");
          this.getTableData();
        } else {
          this.$message.error("移动失败", result.message);
        }
      });
    },
    devSortTempItem(params) {
      devSortTempItem(params).then(res => {
        const result = res.data;
        if (result.success) {
          this.$message.success("移动成功");
          this.getDevData();
        } else {
          this.$message.error("移动失败", result.message);
        }
      });
    },
    cancel() {
      this.$emit("hidenDialog");
    }
  }
};
</script>
