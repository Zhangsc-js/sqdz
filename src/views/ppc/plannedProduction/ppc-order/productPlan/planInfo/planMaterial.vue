<template>
  <div>
    <el-button v-has="'PPC-PBOM-SAVE'" type="primary" @click="sltMaterial" v-if="cmdUnable!=true">新增</el-button>
    <edit-table
      :tableData="tableDate"
      :opts.sync="tableColumn"
      highlight-current-row
      :showAddBtn="false"
      :showOptBtn="showOptBtn"
      height="100%"
      @savaData="savePlanMaterial"
      style="width: 100%;"
      @deleteRow="dltPlanMaterial"
      ref="child"
      pageName="PPC-PBOM"
    ></edit-table>
    <el-dialog title="选择物料" :visible.sync="sltMaterialDialogVisible" width="65%">
      <sltMaterial @save="categoryDialog" @cancel="hidenDialogCancel" />
    </el-dialog>
  </div>
</template>

<script>
import {
  initDataInput,
  getPlanMaterial,
  SavePlanMaterial,
  updatePlanMaterial,
  dltPlanMaterial
} from "@/api/productionPlanning";
import sltMaterial from "./../../../ppc-bom/materialInfo";
import EditTable from "@/components/EditTable";

export default {
  name: "planMaterial",
  components: {
    sltMaterial,
    EditTable
  },
  data() {
    return {
      showAddBtn: false,
      showOptBtn: false,
      tableColumn: [
        {
          label: "物料编码",
          prop: "materialCode"
        },
        {
          label: "物料名称",
          prop: "materialName"
        },
        {
          type: "input",
          label: "计划用量",
          prop: "inputQty",
          rule: true
        },
        {
          label: "已用量",
          prop: "alterQty"
        },
        {
          label: "单位",
          prop: "primaryUnit"
        },
        {
          label: "类型",
          prop: "categoryName"
        }
      ],
      tableDate: [],
      sltMaterialDialogVisible: false,
      materialId: "",
      MATERIAL_CATEGORY: []
    };
  },
  props: {
    id: {
      type: String,
      required: true
    },
    trigger: {
      type: Number,
      required: false
    },
    cmdUnable: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  watch: {
    trigger() {
      this.getData();
    }
  },
  mounted() {
    this.initData();
    this.getData();
  },
  methods: {
    initData() {
      initDataInput()
        .then(response => {
          if (response.data.success) {
            let data = response.data.data;
            for (let i = 0; i < data.MATERIAL_CATEGORY.length; i++) {
              data.MATERIAL_CATEGORY[i].value = data.MATERIAL_CATEGORY.code;
            }
            this.MATERIAL_CATEGORY = data.MATERIAL_CATEGORY;
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
    sltMaterial() {
      this.sltMaterialDialogVisible = true;
      this.objId = this.id;
    },
    savePlanMaterial(row) {
      updatePlanMaterial(row)
        .then(response => {
          if (response.data.success) {
            this.$message.success("保存成功");
            this.getData();
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
    },
    dltPlanMaterial(id) {
      dltPlanMaterial(id).then(response => {
        if (response.data.success) {
          this.$message.success("删除成功");
          this.getData();
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
    },
    categoryDialog(data) {
      this.sltMaterialDialogVisible = false;
      //   this.materialCode = data.materialCode;
      //   SavePlanMaterial(this.materialCode, this.id)
      //     .then(response => {
      //       if (response.data.success) {
      //         this.$message.success("保存成功");
      //         this.getData();
      //       } else {
      //         this.$message.error(
      //           response.data.message + ":" + response.data.data
      //         );
      //       }
      //     })
      //     .catch(e => {
      //       this.$message({
      //         type: "error",
      //         message: e.message,
      //         duration: 3 * 1000
      //       });
      //     });
      let obj = {
        ...data,
        inputQty: "",
        seen: true,
        visibleCancel: true,
        producePlanId: this.id
      };
      this.tableDate.push(obj);
      this.$nextTick(() => {
        this.$refs.child.edit(obj);
      });
    },
    hidenDialogCancel() {
      this.sltMaterialDialogVisible = false;
    },
    getData() {
      if (this.cmdUnable == true) {
        this.showOptBtn = false;
      } else {
        this.showOptBtn = true;
      }
      if (this.id != "") {
        getPlanMaterial(this.id)
          .then(response => {
            for (let i = 0; i < response.data.data.length; i++) {
              for (let j = 0; j < this.MATERIAL_CATEGORY.length; j++) {
                if (
                  response.data.data[i].category ==
                  this.MATERIAL_CATEGORY[j].code
                ) {
                  response.data.data[i].categoryName = this.MATERIAL_CATEGORY[
                    j
                  ].label;
                }
              }
            }
            this.tableDate = response.data.data;
          })
          .catch(e => {
            this.$message({
              type: "error",
              message: e.message,
              duration: 3 * 1000
            });
          });
      }
    }
  }
};
</script>
