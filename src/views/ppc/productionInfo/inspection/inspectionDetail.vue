<template>
  <div style=" padding-left: 20px;" class="inspectionDetail">
    <template>
      <el-form
        :model="tableData"
        label-width="110px"
        ref="topTableData"
        :inline="true"
        :rules="rule"
      >
        <el-row>
          <el-form-item label="报工单号：" prop="bomCode">
            <el-input v-model="tableData.wfNo" :disabled="true" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="工单类型：">
            <el-input v-if="tableData.workType == 0" :disabled="true" value="正常" autocomplete="off"></el-input>
            <el-input v-if="tableData.workType == 1" :disabled="true" value="返工" autocomplete="off"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="报工数量：">
            <el-input v-model="tableData.finishedQty" :disabled="true" autocomplete="off"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="合格数量：" prop="goodQty">
            <el-input
              v-model="tableData.goodQty"
              min="0"
              type="number"
              @blur="finishQtySum"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="废品数量：" prop="badQty">
            <el-input
              v-model="tableData.badQty"
              min="0"
              type="number"
              @blur="finishQtySum"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="废品描述：" prop="badDesc">
            <el-input type="textarea" v-model="tableData.badDesc" autocomplete="off"></el-input>
          </el-form-item>
        </el-row>
        <!--        <el-row>-->
        <!--          <el-form-item label="返修数量：" prop="reworkQty">-->
        <!--            <el-input-->
        <!--              v-model="tableData.reworkQty"-->
        <!--              min="0"-->
        <!--              type="number"-->
        <!--              @change="changeQty"-->
        <!--              @blur="finishQtySum"-->
        <!--              autocomplete="off"-->
        <!--            ></el-input>-->
        <!--          </el-form-item>-->
        <!--          <el-form-item label="返修描述：">-->
        <!--            <el-input type="textarea" v-model="tableData.reworkDesc" autocomplete="off"></el-input>-->
        <!--          </el-form-item>-->
        <!--        </el-row>-->
        <!--        <el-row>-->
        <!--          <el-form-item label="返修工序：">-->
        <!--            <el-select-->
        <!--              multiple-->
        <!--              collapse-tags-->
        <!--              v-model="processIdList"-->
        <!--              :disabled="disabled"-->
        <!--              filterable-->
        <!--              placeholder="请选择"-->
        <!--            >-->
        <!--              <el-option-->
        <!--                v-for="item in processMap"-->
        <!--                :key="item.value"-->
        <!--                :label="item.label"-->
        <!--                :value="item.value"-->
        <!--              ></el-option>-->
        <!--            </el-select>-->
        <!--          </el-form-item>-->
        <!--        </el-row>-->
        <el-row>
          <el-form-item label="审核人">
            <el-input v-model="tableData.inspecterName" autocomplete="off"></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="cancel">取 消</el-button>
        <el-button type="primary " icon="el-icon-check" @click="erify">审核完成</el-button>
      </div>
    </template>
  </div>
</template>

<script>
import { getprocessList, addInspection } from "@/api/productionPlanning";

export default {
  name: "orderFinish",
  components: {},
  data() {
    return {
      tableData: {},
      processMap: [],
      processIdList: [],
      processId: "",
      disabled: true,
      rule: {
        goodQty: [
          {
            required: true,
            message: "请输入合格数量",
            trigger: ["change", "blur"]
          }
        ],
        badQty: [
          {
            required: true,
            message: "请输入废品数量",
            trigger: ["change", "blur"]
          }
        ],
        reworkQty: [
          {
            required: true,
            message: "请输入返修数量",
            trigger: ["change", "blur"]
          }
        ]
      }
    };
  },
  props: {
    row: {
      type: Object,
      required: true
    }
  },
  watch: {
    row() {
      (this.processIdList = []), this.getData();
    }
  },
  mounted() {
    this.processIdList = [];
    this.getData();
  },
  methods: {
    // changeQty() {
    //   if (this.tableData.reworkQty > 0) {
    //     this.processIdList = [];
    //     (this.processId = this.row.produceProcessId),
    //       this.processIdList.push(this.processId);
    //     this.disabled = false;
    //   } else {
    //     this.processIdList = [];
    //     this.disabled = true;
    //   }
    //   this.tableData.finishedQty =
    //     parseInt(this.tableData.goodQty) +
    //     parseInt(this.tableData.badQty) +
    //     parseInt(this.tableData.reworkQty);
    // },
    finishQtySum() {
      this.tableData.finishedQty =
        parseInt(this.tableData.goodQty) +
        parseInt(this.tableData.badQty) +
        parseInt(this.tableData.reworkQty);
    },
    getData() {
      if (this.row.reworkQty == null) {
        this.row.reworkQty = 0;
      }
      this.tableData = this.row;
      this.tableData.inspecterName = this.$store.getters.userName;
      // getprocessList(this.row.ppId, this.row.woId).then(response => {
      //   let data = response.data;
      //   this.processMap = data.data;
      // });
    },
    erify() {
      if (this.tableData.reworkQty != 0 || this.tableData.badQty != 0) {
        let boo = false;
        for (let i = 0; i < this.processIdList.length; i++) {
          if (this.processId == this.processIdList[i]) {
            boo = true;
            break;
          }
        }
        if (!boo && this.tableData.reworkQty > 0) {
          this.$message.warning("当前工序必选！！");
          return;
        }
      }
      this.$refs["topTableData"].validate((valid, object) => {
        if (valid) {
          addInspection(this.tableData).then(response => {
            if (response.data.success) {
              this.$message.success("质检完成！！");
              this.$emit("save");
            } else {
              this.$message.error(
                response.data.message + ":" + response.data.data
              );
            }
          });
        } else {
          this.$message.error(Object.values(object)[0][0].message);
        }
      });
    },
    cancel() {
      this.$emit("cancel");
    }
  }
};
</script>
<style >
.inspectionDetail .el-select {
  width: 170.5px;
}
</style>
