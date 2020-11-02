<template>
  <div style="padding-top: 45px;" class=" margin20 mr15 inMetering">
    <div align="center" style="width: 100%">
      <el-form
        align="center"
        style="padding-left: 15%"
        ref="addFullInMeter"
        :model="addFullInMeter"
        class="demo-ruleForm"
        :rules="rules"
      >
        <el-row type="flex">
          <el-col :span="20">
            <el-form-item prop="poundValue">
              <span>
                <Strong>磅值：</Strong>
              </span>
              <el-input
                v-model.number="addFullInMeter.poundValue"
                placeholder="请输入内容"
                style="width: 40%"
                type="number"
                min="0"
                oninput="javascript:this.value=this.value.replace(/[^\d.]/g,'')"
              />
              <span style="color: brown">KG</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="7">
            <div class="grid-content bg-purple">
              <el-form-item label="车牌号：" prop="truckNo">
                <el-select v-model="addFullInMeter.truckNo" placeholder="请选择车牌号" style="width: 70%">
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
                <el-input v-model="addFullInMeter.gross" style="width: 65%" readonly disabled=""></el-input>
                <span>KG</span>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content bg-purple">
              <el-form-item label="磅号:">
                &nbsp;&nbsp;
                <el-input v-model="addFullInMeter.weighingPlace" style="width: 70%" readonly></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="7">
            <div class="grid-content bg-purple">
              <el-form-item label="物品名：" prop="goodsName">
                <el-select
                  v-model="addFullInMeter.goodsName"
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
                <el-input v-model="addFullInMeter.tare" style="width: 65%" readonly disabled=""></el-input>
                <span>KG</span>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content bg-purple">
              <el-form-item label="日期:">
                &nbsp;&nbsp;
                <el-date-picker
                  v-model="addFullInMeter.createdOn"
                  type="datetime"
                  style="width: 70%"
                  readonly
                  disabled
                ></el-date-picker>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <div class="grid-content bg-purple">
              <el-form-item label="供应商：" prop="supplier">
                <el-select
                  v-model="addFullInMeter.supplier"
                  placeholder="请选择供应商"
                  style="width: 70%"
                >
                  <el-option
                    v-for="item in supplierList"
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
                <el-input v-model="addFullInMeter.net" style="width: 65%" readonly disabled=""></el-input>
                <span>KG</span>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content bg-purple">
              <el-form-item label="司磅员">
                <el-input v-model="addFullInMeter.createdBy" style="width:70%" readonly></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="21">
            <div class="grid-content bg-purple">
              <el-form-item label=" 备注:" prop="remarks">
                <el-input v-model="addFullInMeter.remarks" placeholder="请输入内容" style="width: 90%" />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="10">
            <div class="grid-content bg-purple">
              <el-button type="primary" @click="fullWei" icon="el-icon-truck">载车检斤</el-button>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-button type="primary" @click="emptyWei" icon="el-icon-truck">空车检斤</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-divider content-position="left">载车检斤明细</el-divider>
    <div>
      <el-main>
        <el-table :data="fullInMetersData" border style="width: 100%" @row-click="handdle">
          <el-table-column text-align="center" prop="weighingNo" label="检斤序号" width="180" border></el-table-column>
          <el-table-column text-align="center" prop="truckNo" label="车号" width="120" border></el-table-column>
          <el-table-column text-align="center" prop="supplier" label="供应商" width="180" border></el-table-column>
          <el-table-column text-align="center" prop="goodsName" label="物资名称"></el-table-column>
          <el-table-column text-align="center" prop="gross" label="毛重"></el-table-column>
          <el-table-column text-align="cneter" prop="createdBy" label="检斤员"></el-table-column>
          <el-table-column text-align="center" prop="createdOn" label="检斤时间"></el-table-column>
          <el-table-column text-align="center" prop="remarks" label="备注"></el-table-column>
        </el-table>
        <div>
          <pagination
            :total="this.fullTotal"
            :page.sync="page.pageNum"
            :limit.sync="page.pageSize"
            @pagination="getFullData"
          />
        </div>
      </el-main>
    </div>
    <el-divider content-position="left">空车检斤明细</el-divider>
    <div>
      <el-main>
        <el-table :data="emptyInMetersData" border style="width: 100%">
          <el-table-column text-align="center" prop="weighingNo" label="检斤序号" width="180" border></el-table-column>
          <el-table-column text-align="center" prop="truckNo" label="车号" width="100" border></el-table-column>
          <el-table-column text-align="center" prop="supplier" label="供应商名称" width="180" border></el-table-column>
          <el-table-column text-align="center" prop="goodsName" width="120" label="物资名称"></el-table-column>
          <el-table-column text-align="center" prop="tare" width="100" label="皮重"></el-table-column>
          <el-table-column text-align="center" prop="gross" width="100" label="毛重"></el-table-column>
          <el-table-column text-align="center" prop="net" width="100" label="净重"></el-table-column>
          <el-table-column text-align="center" prop="createdBy" width="100" label="检斤员"></el-table-column>
          <el-table-column text-align="center" prop="createdOn" label="时间日期"></el-table-column>
          <el-table-column text-align="center" prop="remarks" label="备注"></el-table-column>
        </el-table>
        <div>
          <pagination
            :total="this.emptyTotal"
            :page.sync="page1.pageNum"
            :limit.sync="page1.pageSize"
            @pagination="getEmptyData"
          />
        </div>
      </el-main>
    </div>
  </div>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
import Pagination from "@/components/Pagination/index";
import { simpleDateFormat } from "@/utils/index";

const { mapState, mapActions } = createNamespacedHelpers("inMeter");
export default {
  name: "weiInMetering",
  components: { Pagination },
  data() {
    return {
      // total1:1,
      page: {
        pageNum: 1,
        pageSize: 10
      },
      page1: {
        pageNum: 1,
        pageSize: 10
      },
      supplierList: [
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
      tableData: [
        {
          purchaseNo: "2016050201",
          supplier: "贵州第三化肥厂",
          goodsName: "催化剂",
          net: "1000",
          weiUnit: "T",
          price: "1000",
          createdOn: "2019-09-02"
        }
      ],
      inMetBuyForm: {
        purchaseNo: ""
      },
      rules: {
        poundValue: [
          { required: true, message: "磅值不能为空" },
          { type: "number", message: "请输入正确数值" }
        ],
        truckNo: [{ required: true, message: "请选择车牌号", trigger:[ "blur","change","input"] }],
        weighingPlace: [{ required: true, message: "请选择车牌号", trigger:[ "blur","change","input"] }],
        createdBy: [{ required: true, message: "请选择车牌号", trigger:[ "blur","change","input"] }],
        goodsName: [{ required: true, message: "请选择物品", trigger:[ "blur","change","input"] }],
        createdOn: [
          { required: true, message: "日期不能为空", trigger:[ "blur","change","input"] }
        ],
        supplier: [{ required: true, message: "请选择供应商", trigger:[ "blur","change","input"] }]
      }
    };
  },
  computed: {
    ...mapState([
      "addFullInMeter",
      "emptyInMetersData",
      "emptyTotal",
      "fullTotal",
      "fullInMetersData"
    ]),
    carsList() {
      return this.$store.state.weiCars.weiCarData;
    }
  },
  mounted() {
    this.addFullInMeter.createdOn=simpleDateFormat(new Date(),'yyyy-MM-dd HH:mm:ss')
    this.getEmptyData();
    this.getFullData();
    this.selectCars();
    this.addFullInMeter.weighingPlace = "021";
    this.addFullInMeter.createdBy = "张宝丹";
  },
  methods: {
    ...mapActions([
      "addFullInMeterData",
      "updateInMeterData",
      "getEmptyInMeter",
      "getFullInMeter"
    ]),
    getEmptyData() {
      this.getEmptyInMeter({
        ...this.page1
      });
    },
    getFullData() {
      this.getFullInMeter({
        ...this.page
      });
    },
    selectCars() {
      this.$store.dispatch("weiCars/getAllWeiCars");
    },
    emptyWei() {
      this.addFullInMeter.tare = this.addFullInMeter.poundValue;
      this.addFullInMeter.net =
        this.addFullInMeter.gross - this.addFullInMeter.tare;
      this.$refs["addFullInMeter"].validate(valid => {
        if (valid) {
          this.addFullInMeter.status = 0;
          this.updateInMeterData(this.addFullInMeter).then(() => {
            this.$refs["addFullInMeter"].resetFields();
            this.addFullInMeter.createdOn=simpleDateFormat(new Date(),'yyyy-MM-dd HH:mm:ss')
            this.getEmptyData();
            this.getFullData();
          });
        } else {
          this.$message.error("检斤失败，请检查必填项是否都填写正确");
        }
      });
    },
    fullWei() {
      this.$refs["addFullInMeter"].validate(valid => {
        if (valid) {
          this.addFullInMeter.status = 1;
          this.addFullInMeter.gross = this.addFullInMeter.poundValue;
          this.addFullInMeterData(this.addFullInMeter).then(() => {
            this.$refs["addFullInMeter"].resetFields();
            this.getFullData();
            this.addFullInMeter.createdOn=simpleDateFormat(new Date(),'yyyy-MM-dd HH:mm:ss')
          });
        } else {
          this.$message.error("检斤失败，请检查必填项是否都填写正确");
        }
      });
    },
    handdle(row) {
      // console.log(row.tare)
      this.addFullInMeter.id = row.id;
      this.addFullInMeter.weighingNo = row.weighingNo;
      this.addFullInMeter.gross = row.gross;
      this.addFullInMeter.supplier = row.supplier;
      this.addFullInMeter.truckNo = row.truckNo;
      this.addFullInMeter.goodsName = row.goodsName;
      this.addFullInMeter.createdOn = row.createdOn;
      this.addFullInMeter.createdBy = row.createdBy;
      this.addFullInMeter.weighingPlace = row.weighingPlace;
      this.addFullInMeter.remarks = row.remarks;
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
.inMetering .el-form-item__error{
    position: relative;
}
</style>
