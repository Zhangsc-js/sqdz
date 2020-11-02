<template>
  <div style=" padding-left: 20px;">
    <template>
      <el-form :model="tableData" label-width="100px" ref="topTableData" :rules="rule">
        <el-row>
          <el-col :span="8">
            <el-form-item label="派工单号：" prop="bomCode">
              <el-input
                v-model="tableData.woNo"
                :disabled="true"
                autocomplete="off"
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物料编码：">
              <el-input
                v-model="tableData.materialCode"
                :disabled="true"
                autocomplete="off"
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物料名称：" style="width: 100%">
              <el-input
                v-model="tableData.materialName"
                :disabled="true"
                autocomplete="off"
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="派工数量：">
              <el-input v-model="tableData.produceQty" :disabled="true" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="已报数量：">
              <el-input v-model="tableData.finishNumber" :disabled="true" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否质检：">
              <el-select
                v-model="tableData.inspect"
                filterable
                style="width: 100%"
                disabled="disabled"
              >
                <el-option
                  v-for="item in IS_OR_NOT"
                  :key="item.code"
                  :label="item.label"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="报工日期：" prop="finishedDate">
              <el-date-picker
                type="date"
                v-model="tableData.finishedDate"
                value-format="yyyy-MM-dd"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车间：">
              <el-input v-model="tableData.workShopName" :disabled="true" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="班组：">
              <el-input v-model="tableData.teamName" :disabled="true" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="完工数量：">
              <el-input v-model="tableData.finishedQty" :disabled="true" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合格数量：" prop="goodQty">
              <el-input
                v-model="tableData.goodQty"
                min="0"
                type="number"
                @change="goodblur"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="废品数量：" prop="badQty">
              <el-input
                v-model="tableData.badQty"
                min="0"
                type="number"
                @change="goodblur"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="生产产线：">
              <el-input v-model="tableData.lineName" :disabled="true" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="加工工序：" prop="goodQty">
              <el-input v-model="tableData.processCode" :disabled="true" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="报工工位：" prop="stationName">
              <el-input v-model="tableData.stationName" :disabled="true" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="报工设备：" prop="devCode">
              <el-select v-model="tableData.devCode" filterable style="width: 100%">
                <el-option
                  v-for="item in tableData.devList"
                  :key="item.deviceCode"
                  :label="item.deviceName"
                  :value="item.deviceCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="cancels">取 消</el-button>
        <el-button type="primary " icon="el-icon-check" @click="addfinish">确定</el-button>
      </div>
    </template>
  </div>
</template>

<script>
import {
  initShiftWorkData,
  queryFinish,
  addFinish
} from "@/api/productionPlanning";

export default {
  name: "orderFinish",
  components: {},
  data() {
    return {
      tableData: {
        finishedDate: "",
        goodQty: "",
        badQty: "",
        lineName: "",
        stationName: "",
        stationCode: "",
        devCode: "",
        devList: []
      },
      rule: {
        finishedDate: [
          {
            required: true,
            message: "请选择报工日期",
            trigger: ["change", "blur"]
          }
        ],
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
        stationName: [
          {
            required: true,
            message: "报工工位不可为空，请先绑定工位",
            trigger: ["change", "blur"]
          }
        ]
      },
      IS_OR_NOT: []
    };
  },
  props: {
    workOrderId: {
      type: String,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  watch: {
    index() {
      this.getData();
    }
  },
  methods: {
    getData() {
      if (this.workOrderId == undefined) {
        this.$message.warning("请选中派工行数据");
        return;
      }
      queryFinish(this.workOrderId)
        .then(response => {
          let data = response.data;
          this.tableData = data.data;
          // this.tableData.finishedDate = this.timeDefault;
          this.$set(this.tableData, "finishedDate", this.timeDefault);
        })
        .catch(e => {
          this.$message({
            type: "error",
            message: e.message,
            duration: 3 * 1000
          });
        });
    },
    goodblur() {
      if (this.tableData.goodQty < 0) {
        this.tableData.goodQty = 0;
        this.$message.error("请输入正确的合格数量！！");
        return;
      }
      this.tableData.finishedQty =
        parseInt(this.tableData.badQty) + parseInt(this.tableData.goodQty);
    },
    addfinish() {
      if (this.tableData.finishedQty == 0) {
        this.$message.error("报工数量为0，不可报工");
        return false;
      }
      this.$refs["topTableData"].validate((valid, object) => {
        if (valid) {
          this.tableData.workOrderId = this.workOrderId;
          if (
            parseInt(this.tableData.finishNumber) +
              parseInt(this.tableData.finishedQty) >
            this.tableData.produceQty
          ) {
            this.$confirm("当前属于超量报工, 是否继续?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                this.savefinish();
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消"
                });
              });
          } else {
            this.savefinish();
          }
        } else {
          this.$message.error(Object.values(object)[0][0].message);
        }
      });
    },
    savefinish() {
      if (this.tableData.finishedQty == 0) {
        this.$message.error("报工数量为0，不可报工");
        return false;
      }
      addFinish(this.tableData)
        .then(response => {
          if (response.data.success) {
            this.$message.success("新增成功");
            this.$emit("save");
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
    initShiftWorkData() {
      initShiftWorkData()
        .then(response => {
          if (response.data.success) {
            this.IS_OR_NOT = response.data.data.IS_OR_NOT;
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
    cancels() {
      this.$emit("cancel");
    }
  },
  computed: {
    timeDefault() {
      let date = new Date();
      let s1 =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      return s1;
    }
  },
  mounted() {
    this.initShiftWorkData();
    this.getData();
  }
};
</script>

<style lang="css" >
</style>
