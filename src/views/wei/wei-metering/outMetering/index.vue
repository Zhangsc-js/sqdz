<template>
  <div style="padding-top: 45px;" class=" margin20 mr15">
    <div align="center" style="width: 100%">
      <el-form
        :rules="rules"
        align="center"
        style="padding-left: 20%"
        ref="addEmptyOutMeter"
        :model="addEmptyOutMeter"
        class="demo-ruleForm"
      >
        <el-row>
          <el-col :span="20">
            <div class="grid-content bg-purple">
              <el-form-item prop="poundValue">
                <span>
                  <strong>磅值:&nbsp;&nbsp;&nbsp;&nbsp;</strong>
                </span>
                <el-input
                  v-model="addEmptyOutMeter.poundValue"
                  placeholder="请输入内容"
                  style="width: 40%"
                  type="number"
                  min="0"
                  oninput="javascript:this.value=this.value.replace(/[^\d.]/g,'')"
                />
                <span style="color: brown">KG</span>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <div class="grid-content bg-purple">
              <el-form-item label="车牌号:" prop="truckNo">
                <el-select
                  v-model="addEmptyOutMeter.truckNo"
                  placeholder="请选择车牌号"
                  style="width: 70%"
                >
                  <el-option
                    v-for="item in carsList"
                    :key="item.id"
                    :label="item.truckNo"
                    :value="item.truckNo"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content bg-purple">
              <el-form-item label="毛重:" prop="gross">
                <el-input v-model="addEmptyOutMeter.gross" style="width: 65%" readonly disabled></el-input>
                <span>KG</span>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content bg-purple">
              <el-form-item label="磅号:" >
                &nbsp;&nbsp;&nbsp;
                <el-input v-model="addEmptyOutMeter.weighingPlace" style="width: 70%" readonly></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <div class="grid-content bg-purple">
              <el-form-item label="物品名:" prop="goodsName">
                <el-select
                  v-model="addEmptyOutMeter.goodsName"
                  placeholder="-请选择-"
                  style="width: 70%"
                >
                  <el-option
                    v-for="item in goodsList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content bg-purple">
              <el-form-item label="皮重:" prop="tare">
                <el-input v-model="addEmptyOutMeter.tare" style="width: 65%" readonly disabled></el-input>
                <span>KG</span>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content bg-purple">
              <el-form-item label="日期:" prop="createdOn">
                &nbsp;&nbsp;&nbsp;
                <el-date-picker
                  v-model="addEmptyOutMeter.createdOn"
                  type="datetime"
                  style="width: 70%"
                  readonly disabled
                ></el-date-picker>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <div class="grid-content bg-purple">
              <el-form-item label="客户:" prop="clientele">
                &nbsp;&nbsp;&nbsp;
                <el-select
                  v-model="addEmptyOutMeter.clientele"
                  placeholder="请选择客户"
                  style="width:70%"
                >
                  <el-option
                    v-for="item in clienteleList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content bg-purple">
              <el-form-item label="净重:" prop="net">
                <el-input v-model="addEmptyOutMeter.net" style="width: 65%" readonly disabled></el-input>
                <span>KG</span>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content bg-purple">
              <el-form-item label="司磅员:" >
                <el-input v-model="addEmptyOutMeter.createdBy" style="width: 70%" readonly></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row style="position: relative;left: 14px;">
          <el-col :span="21">
            <div class="grid-content bg-purple">
              <el-form-item label="备注:" prop="remarks">
                <el-input
                  v-model="addEmptyOutMeter.remarks"
                  placeholder="请输入内容"
                  style="width: 90%"
                />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="10">
            <div class="grid-content bg-purple">
              &nbsp;&nbsp;&nbsp;
              <el-button type="primary" @click="emptyWei" icon="el-icon-truck">空车检斤</el-button>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-button type="primary" @click="fullWei" icon="el-icon-truck">载车检斤</el-button>
            </div>
          </el-col>
<!--          <el-col :span="5">-->
<!--            <div class="grid-content bg-purple">-->
<!--              <el-button type="primary">车辆备案</el-button>-->
<!--            </div>-->
<!--          </el-col>-->
        </el-row>
      </el-form>
    </div>
    <el-divider content-position="left">空车检斤明细</el-divider>
    <div>
      <el-main>
        <el-table :data="emptyOutMetersData" border @row-click="handdle" style="width: 100%">
          <el-table-column text-align="center" prop="weighingNo" label="检斤序号" width="180" border></el-table-column>
          <el-table-column text-align="center" prop="truckNo" label="车号" width="120" border></el-table-column>
          <el-table-column text-align="center" prop="clientele" label="客户" width="180" border></el-table-column>
          <el-table-column text-align="center" prop="goodsName" label="物资名称"></el-table-column>
          <el-table-column text-align="center" prop="tare" label="皮重"></el-table-column>
          <el-table-column text-align="center" prop="createdBy" label="检斤员"></el-table-column>
          <el-table-column text-align="center" prop="createdOn" width="180" label="时间日期"></el-table-column>
          <el-table-column text-align="center" prop="remarks"  label="备注"></el-table-column>
        </el-table>
        <div>
          <pagination
            :total="this.emptyTotal"
            :page.sync="page.pageNum"
            :limit.sync="page.pageSize"
            @pagination="getEmptyData"
          />
        </div>
      </el-main>
    </div>
    <el-divider content-position="left">载车检斤明细</el-divider>
    <div>
      <el-main>
        <el-table :data="fullOutMetersData" border style="width: 100%">
          <el-table-column text-align="center" prop="weighingNo" label="检斤序号" width="180" border></el-table-column>
          <el-table-column text-align="center" prop="truckNo" label="车号" width="120" border></el-table-column>
          <el-table-column text-align="center" prop="clientele" label="客户" width="180" border></el-table-column>
          <el-table-column text-align="center" prop="goodsName" label="物资名称"></el-table-column>
          <el-table-column text-align="center" prop="tare" width="100" label="皮重"></el-table-column>
          <el-table-column text-align="center" prop="gross" width="100" label="毛重"></el-table-column>
          <el-table-column text-align="center" prop="net" width="100" label="净重"></el-table-column>
          <el-table-column text-align="center" prop="createdBy" label="检斤员"></el-table-column>
          <el-table-column text-align="center" prop="createdOn" width="180" label="时间日期"></el-table-column>
          <el-table-column text-align="center" prop="remarks"  label="备注"></el-table-column>
        </el-table>
        <div>
          <pagination
            :total="this.fullTotal"
            :page.sync="page1.pageNum"
            :limit.sync="page1.pageSize"
            @pagination="getFullData"
          />
        </div>
      </el-main>
    </div>
  </div>
</template>
<style>
.el-row {
  /*margin-bottom: px;*/
  & :last-child {
    margin-bottom: 0;
  }
}
.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  min-height: 36px;
}

.row-bg {
  /*padding: 10px 0;*/
  background-color: #f9fafc;
}
</style>
<script>
import { createNamespacedHelpers } from "vuex";
import {simpleDateFormat } from "@/utils/index";
import Pagination from "@/components/Pagination/index";

const { mapState, mapActions } = createNamespacedHelpers("outMeter");
export default {
  name: "weiOutMetering",
  components: { Pagination },
  data() {
    return {
      page: {
        pageNum: 0,
        pageSize: 10
      },
      page1: {
        pageNum: 0,
        pageSize: 10
      },
      clienteleList: [
        {
          value: "贵阳磷化肥有限公司",
          label: "贵阳磷化肥有限公司"
        },
        {
          value: "贵阳铵化肥有限公司",
          label: "贵阳铵化肥有限公司"
        }
      ],
      goodsList: [
        {
          value: "磷矿石",
          label: "磷矿石"
        },
        {
          value: "铵矿石",
          label: "铵矿石"
        }
      ],
      rules: {
        poundValue: [
          {
            required: true,
            message: "请输入或者选择内容",
            trigger: ["blur", "change"]
          }
        ],
        truckNo: [
          {
            required: true,
            message: "请输入或者选择内容",
            trigger: ["blur", "change"]
          }
        ],
        goodsName: [
          {
            required: true,
            message: "请输入或者选择内容",
            trigger: ["blur", "change"]
          }
        ],
        clientele: [
          {
            required: true,
            message: "请输入或者选择内容",
            trigger: ["blur", "change"]
          }
        ],
        weighingPlace: [
          {
            required: true,
            message: "请输入或者选择内容",
            trigger: ["blur", "change"]
          }
        ],
        createdOn: [
          {
            required: true,
            message: "请输入或者选择内容",
            trigger: ["blur", "change"]
          }
        ],
        createdBy: [
          {
            required: true,
            message: "请输入或者选择内容",
            trigger: ["blur", "change"]
          }
        ]
      }
    };
  },
  computed: {
    ...mapState([
      "addEmptyOutMeter",
      "emptyOutMetersData",
      "emptyTotal",
      "fullTotal",
      "fullOutMetersData"
    ]),
    carsList() {
      return this.$store.state.weiCars.weiCarData;
    }
  },
  mounted() {
    this.addEmptyOutMeter.createdOn=simpleDateFormat(new Date(),'yyyy-MM-dd HH:mm:ss')
    this.getEmptyData();
    this.getFullData();
    this.selectCars();
    this.addEmptyOutMeter.weighingPlace = "021";
    this.addEmptyOutMeter.createdBy = "刘进乾";
  },
  methods: {
    ...mapActions([
      "addEmptyOutMeterData",
      "updateOutMeterData",
      "getEmptyOutMeter",
      "getFullOutMeter"
    ]),
    getEmptyData() {
      this.getEmptyOutMeter({
        ...this.page
      });
    },
    getFullData() {
      this.getFullOutMeter({
        ...this.page1
      });
    },
    selectCars() {
      this.$store.dispatch("weiCars/getAllWeiCars");
    },
    emptyWei() {
      this.$refs["addEmptyOutMeter"].validate(valid => {
        if (valid) {
          this.addEmptyOutMeter.status = 0;
          this.addEmptyOutMeter.tare = this.addEmptyOutMeter.poundValue;
          this.addEmptyOutMeterData(this.addEmptyOutMeter).then(() => {
            this.$refs["addEmptyOutMeter"].resetFields();
            this.addEmptyOutMeter.createdOn=simpleDateFormat(new Date(),'yyyy-MM-dd HH:mm:ss')
            this.getEmptyData();
          });
        } else {
          this.$message.error("请输入正确信息");
          return false;
        }
      });
    },
    fullWei() {
      this.$refs["addEmptyOutMeter"].validate(valid => {
        if (valid) {
          this.addEmptyOutMeter.gross = this.addEmptyOutMeter.poundValue;
          this.addEmptyOutMeter.net =
            this.addEmptyOutMeter.gross - this.addEmptyOutMeter.tare;
          if (
            this.addEmptyOutMeter.tare == null ||
            this.addEmptyOutMeter.tare == ""
          ) {
            return (
              false,
              this.$notify({
                type: "error",
                title: "警告",
                message: "皮重不能为空!",
                offset: 100
              })
            );
          } else {
            this.addEmptyOutMeter.status = 1;
            this.updateOutMeterData(this.addEmptyOutMeter).then(() => {
              this.$refs["addEmptyOutMeter"].resetFields();
              this.addEmptyOutMeter.createdOn=simpleDateFormat(new Date(),'yyyy-MM-dd HH:mm:ss')
              this.getFullData();
              this.getEmptyData();
            });
          }
        } else {
          this.$message.error("请输入正确信息");
          return false;
        }
      });
    },
    handdle(row) {
      this.addEmptyOutMeter.id = row.id;
      this.addEmptyOutMeter.weighingNo = row.weighingNo;
      this.addEmptyOutMeter.tare = row.tare;
      this.addEmptyOutMeter.clientele = row.clientele;
      this.addEmptyOutMeter.truckNo = row.truckNo;
      this.addEmptyOutMeter.goodsName = row.goodsName;
      this.addEmptyOutMeter.createdOn = row.createdOn;
      this.addEmptyOutMeter.createdBy = row.createdBy;
      this.addEmptyOutMeter.weighingPlace = row.weighingPlace;
      this.addEmptyOutMeter.remarks = row.remarks;
    }
  }
};
</script>

<style type="text/css">
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
.el-form-item__error{
    position: relative;
}
</style>
