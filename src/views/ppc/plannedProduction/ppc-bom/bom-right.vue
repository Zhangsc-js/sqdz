<template style="height: 100%;" class="bom-right">
  <div>
    <template>
      <el-form :model="topTableData" ref="topTableData" :inline="true" :rules="rules">
        <el-row>
          <el-col :span="8">
            <el-form-item label="BOM编码" prop="bomCode">
              <el-input v-model="topTableData.bomCode" autocomplete="off" disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="BOM名称" prop="bomName">
              <el-input v-model="topTableData.bomName" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="版本号">
              <el-input v-model="topTableData.bomVer" autocomplete="off" disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="BOM状态">
              <el-select v-model="topTableData.versionStatus" filterable placeholder="请选择">
                <el-option
                  v-for="item in BOM_STATUS"
                  :key="item.code"
                  :label="item.label"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物料代码">
              <el-input v-model="topTableData.materialCode" autocomplete="off" disabled="disabled"></el-input>
            </el-form-item>
          </el-col>

          <el-form-item>
            <el-button type="primary" @click="saveBom" icon="el-icon-check" v-has="'SYS-BOM-ADD'">保存</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addBom" icon="el-icon-plus" v-has="'SYS-BOM-SAVE'">新增</el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              type="danger"
              @click="deleteBom"
              icon="el-icon-delete"
              :disabled="id == ''"
              v-has="'SYS-BOM-DELETE'"
            >删除</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </template>
    <template>
      <el-divider content-position="left">BOM清单信息</el-divider>
      <edit-table
        :tableData="tableData"
        :opts.sync="tableColumn"
        highlight-current-row
        :showAddBtn="false"
        @getData="getData"
        @savaData="saveItem"
        style="width: 100%;"
        @deleteRow="delItem"
        height="calc(100% - 49px - 112px - 34px - 3px)"
        optWidth="220px"
        pageName="SYS-BOMITEM"
      ></edit-table>
    </template>
    <el-button type="primary" icon="el-icon-plus" @click="addBomItem" v-has="'SYS-BOMITEM-ADD'">新增</el-button>
    <!--        <el-button :disabled="batchBtn" type="danger " @click="batchDelBomItem">批量删除</el-button>-->
    <!--        <Pagination :total="total" :page.sync="page.current" :limit.sync="page.size" @pagination="getData"/>-->

    <el-dialog append-to-body title="新增BOM" :visible.sync="addDialogVisible" width="45%">
      <AddBom @save="hidenDialog" @cancel="hidenDialogCancel" />
    </el-dialog>
    <el-dialog title="新增子BOM" :visible.sync="addItemDialogVisible" width="65%" @closed="getData">
      <AddBomItem @save="itemhidenDialog" @cancel="hidenDialogCancel" :id="objId" />
    </el-dialog>
    <el-dialog title="选择物料" :visible.sync="sltMaterialDialogVisible" width="65%">
      <sltMaterial @save="categoryDialog" @cancel="hidenDialogCancel" :id="objId" />
    </el-dialog>
  </div>
</template>

<script>
// import Pagination from '@/components/Pagination'
import AddBom from "./addBom";
import AddBomItem from "./addBomItem";
import sltMaterial from "./materialInfo";
import {
  initBomData,
  getBomItem,
  getBom,
  updateBom,
  deleteBom,
  delectBomItemBatch,
  queryToSelect,
  itemQty,
  delItem
} from "@/api/productionPlanning";
import EditTable from "@/components/EditTable";

export default {
  name: "bom-right",
  components: {
    AddBom,
    AddBomItem,
    sltMaterial,
    EditTable
  },
  data() {
    return {
      total: 0,
      rules: {
        bomName: [
          { required: true, message: "请输入Bom名称", trigger: "blur" }
        ],
        bomCode: [{ required: true, message: "请输入Bom编码", trigger: "blur" }]
      },
      tableData: [],
      topTableData: {
        bomCode: "",
        bomName: "",
        bomVer: "",
        versionStatus: "",
        materialId: "",
        materialName: ""
      },
      // objId:'',
      objIds: [], // 选择行数据
      batchBtn: true,
      addDialogVisible: false,
      addItemDialogVisible: false,
      sltMaterialDialogVisible: false,
      objId: "",
      mid: "", //物料Id
      devMap: [],
      BOM_STATUS: [],
      tableColumn: [
        {
          label: "物料名称",
          prop: "name"
        },
        {
          label: "物料编码",
          prop: "code"
        },
        {
          label: "物料类型",
          prop: "categoryName"
        },
        {
          type: "input",
          label: "用量",
          prop: "qty",
          width: "80px"
        },
        {
          label: "单位",
          prop: "unit",
          width: "80px"
        }
      ],
      MATERIAL_CATEGORY: []
    };
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  watch: {
    id() {
      this.getData();
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      initBomData()
        .then(response => {
          if (response.data.success) {
            this.MATERIAL_CATEGORY = response.data.data.MATERIAL_CATEGORY;
            this.BOM_STATUS = response.data.data.BOM_STATUS;
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
    deleteBom() {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteBom(this.id).then(response => {
            const result = response.data;
            if (result.success) {
              this.$message.success("删除成功");
              this.$emit("delBom");
            } else {
              this.$message.error(
                response.data.message + ":" + response.data.data
              );
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    saveItem(row, done) {
      const params = {
        id: row.id,
        qty: row.qty,
        unit: row.unit
      };
      done();
      itemQty(params).then(response => {
        const result = response.data;
        if (result.success) {
          this.$message.success("修改成功");
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
    },
    clearSearchBox() {
      this.topTableData = {
        bomCode: "",
        bomName: "",
        bomVer: "",
        versionStatus: "",
        materialId: "",
        materialName: ""
      };
    },
    itemhidenDialog() {
      this.addItemDialogVisible = false;
      this.$emit("save");
      this.getData();
    },
    hidenDialog() {
      this.addDialogVisible = false;
      this.$emit("save");
    },
    categoryDialog(data) {
      this.sltMaterialDialogVisible = false;
      this.topTableData.materialName = data.materialName;
      this.topTableData.materialId = data.id;
      this.mid = data.id;
    },
    hidenDialogCancel() {
      this.addDialogVisible = false;
      this.addItemDialogVisible = false;
      this.sltMaterialDialogVisible = false;
    },
    addBom() {
      this.addDialogVisible = true;
      this.objId = this.id;
    },
    addBomItem() {
      this.addItemDialogVisible = true;
      this.objId = this.id;
    },
    sltMaterial() {
      this.sltMaterialDialogVisible = true;
      this.objId = this.id;
    },
    getData() {
      getBom(this.id)
        .then(response => {
          const result = response.data;
          if (result.success) {
            this.topTableData = Object.assign({}, result.data);
          } else {
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
          }
        })
        .catch(e => {
          this.$message({
            type: "error",
            message: e.message,
            duration: 3 * 1000
          });
        });

      getBomItem(this.id)
        .then(response => {
          let data = response.data.data;
          for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < this.MATERIAL_CATEGORY.length; j++) {
              if (this.MATERIAL_CATEGORY[j].code == data[i].type) {
                data[i].categoryName = this.MATERIAL_CATEGORY[j].label;
                break;
              }
            }
          }
          this.tableData = data;
        })
        .catch(e => {
          this.$message({
            type: "error",
            message: e.message,
            duration: 3 * 1000
          });
        });

      queryToSelect()
        .then(response => {
          const result = response.data;
          if (result.success) {
            this.devMap = result.data;
          }
        })
        .catch(e => {
          this.$message.error(e.message);
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
    saveBom() {
      this.$refs["topTableData"].validate(val => {
        if (val) {
          const params = {
            ...this.topTableData,
            mid: this.mid
          };
          updateBom(params)
            .then(response => {
              const result = response.data;
              if (result.success) {
                this.$message.success("修改成功");
                this.$emit("leftReflash", params);
              } else {
                this.$message.error(
                  response.data.message + ":" + response.data.data
                );
              }
            })
            .catch(e => {
              this.$message.error(e.message);
            })
            .finally(() => {});
        } else {
          this.$message.error("请输入必填信息！！！");
        }
      });
    },
    batchDelBomItem() {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delectBomItemBatch(this.objIds).then(response => {
            if (response.data.success) {
              this.getData();
              this.$message.success("删除成功!");
            } else {
              this.$message.error(
                response.data.message + ":" + response.data.data
              );
            }
          });
        })
        .catch(() => {
          this.$message.error(e.message);
        });
    },
    delItem(id) {
      delectBomItemBatch(id)
        .then(response => {
          if (response.data.success) {
            this.getData();
            this.$message.success("删除成功!");
          } else {
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
          }
        })
        .catch(() => {
          this.$message.error(e.message);
        });
    }
  }
};
</script>

<style lang="css" scoped>
body {
}

.el-dialog {
  height: 500px;
}

.el-select {
  width: 170.4px;
}

.bom-right .cell {
  text-align: center;
}
</style>
