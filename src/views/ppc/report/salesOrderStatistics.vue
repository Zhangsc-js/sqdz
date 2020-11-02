<template>
  <div style="height: 100%;" class="saleOrderStatistics">
    <el-tabs type="border-card" style="height: 100%;">
      <el-tab-pane label="产品维度" style="height: 100%;">
        <el-form
          :inline="true"
          :model="queryForm"
          class="demo-form-inline"
          ref="queryForm"
          :rules="rule"
        >
          <el-form-item label="日期" prop="date">
            <el-date-picker
              clearable
              type="date"
              v-model="queryForm.date"
              value-format="yyyy-MM-dd"
              style="width: 140px"
            />
          </el-form-item>
          <el-form-item prop="type">
            <el-radio v-model="queryForm.type" label="day">日</el-radio>
            <el-radio v-model="queryForm.type" label="month">月</el-radio>
            <el-radio v-model="queryForm.type" label="year">年</el-radio>
          </el-form-item>
          <el-form-item label="产品名称:" prop="materialName">
            <el-input
              v-model="queryForm.materialName"
              v-on:click.native="sltMaterial"
              autocomplete="off"
              :disabled="false"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-check" @click="getData()">查询</el-button>
          </el-form-item>
        </el-form>

        <div id="salesOrdeEcharts" style="height:100%"></div>
      </el-tab-pane>
      <el-tab-pane label="客户维度" style="height: 100%;">
        <el-form :inline="true" :model="inpu" class="demo-form-inline" ref="inpu" :rules="custRule">
          <el-form-item label="日期" prop="date">
            <el-date-picker
              clearable
              type="date"
              v-model="inpu.date"
              value-format="yyyy-MM-dd"
              style="width: 140px"
            />
          </el-form-item>
          <el-form-item prop="type">
            <el-radio v-model="inpu.type" label="day">日</el-radio>
            <el-radio v-model="inpu.type" label="month">月</el-radio>
            <el-radio v-model="inpu.type" label="year">年</el-radio>
          </el-form-item>
          <el-form-item label="客户名称名称:" prop="id">
            <!-- <el-input v-model="inpu.id" autocomplete="off" :disabled="false"></el-input> -->
            <el-select
              v-model="inpu.id"
              filterable
              placeholder="请选择"
              style="width: 100%"
              @change="selectCustomer"
              :disabled="isDisable"
            >
              <el-option
                v-for="item in this.customerPull"
                :key="item.id"
                :label="item.customerName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-check" @click="getCustomerData()">查询</el-button>
          </el-form-item>
        </el-form>
        <div id="customerEcharts" style="height:100%"></div>
      </el-tab-pane>
    </el-tabs>
    <!-- <div id="salesOrdeEcharts" style="height:100%"></div> -->
    <el-dialog title="选择物料" :visible.sync="sltMaterialDialogVisible" width="65%" append-to-body>
      <sltMaterial
        @save="confirmMaterial"
        :category="category"
        @cancel="hidenDialogCancel"
        :id="objId"
      />
    </el-dialog>
  </div>
</template>
<script>
import echarts from "echarts";
import { simpleDateFormat } from "@/utils/index";
import {
  findSaleReport,
  getBomVerStatusList,
  getBomEffect,
  findCustomerReport,
  findPullDownSysCustomer
} from "@/api/productionPlanning";
import sltMaterial from "../plannedProduction/ppc-bom/materialInfo";
import { resetQueryForm } from "@/utils/common";
export default {
  components: {
    echarts,
    sltMaterial
  },
  data() {
    return {
      queryForm: {
        date: new Date(),
        materialCode: "",
        type: "",
        materialName: ""
      },
      customerPull:[],
      inpu: {
        date: new Date(),
        customerCode: "",
        type: "",
        id:""
      },
      sltMaterialDialogVisible: false,
      objId: "",
      category: "1,2,3,5,6,99",
      customer: {
        qtyData: [],
        customerData: []
      },
      material: {
        qtyData: [],
        materialData: []
      },
      rule: {
        materialName: [
          {
            required: true,
            message: "请选择产品名称",
            trigger: ["change", "blur"]
          }
        ],
        date: [
          {
            required: true,
            message: "请选择时间",
            trigger: ["change", "blur"]
          }
        ],
        type: [
          {
            required: true,
            message: "请选择类型",
            trigger: ["change", "blur"]
          }
        ]
      },
      custRule:{
        date: [
          {
            required: true,
            message: "请选择时间",
            trigger: ["change", "blur"]
          }
        ],
        id: [
          {
            required: true,
            message: "请选择客户名称",
            trigger: ["change", "blur"]
          }
        ]
      }
    };
  },
  methods: {
    hidenDialogCancel() {
      this.sltMaterialDialogVisible = false;
    },
    confirmMaterial(data) {
      this.queryForm.materialCode = data.materialCode;
      this.queryForm.materialName = data.materialName;
      this.getBomInfo(data.materialCode);
      this.getBomVerStatusList(data.materialCode);
      this.sltMaterialDialogVisible = false;
    },
    sltMaterial() {
      this.sltMaterialDialogVisible = true;
    },
    getBomInfo(materialCode) {
      getBomEffect(materialCode)
        .then(response => {
          if (response.data.success) {
            this.inpu.bomCode = response.data.data.bomCode;
            this.inpu.bomVer = response.data.data.bomVer;
          } else {
            this.tableData.materialCode = "";
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    getBomVerStatusList(materialCode) {
      getBomVerStatusList(materialCode).then(response => {
        let data = response.data;
        if (data.success) {
          this.bomMap = data.data.list;
        }
      });
    },
    applyBarEchart(data) {
      this.chartDetail = echarts.init(
        document.getElementById("salesOrdeEcharts")
      );
      let option = {
        title: {
          text: "产品销售-TOP10客户",
          textStyle: {
            color: "#FAAD14"
          }
        },
        color: ["#7CDBBC"],
        tooltip: {
          trigger: 'axis',
          position: [20, 20]
        },
        // grid: {
        //   left: "5%",
        //   right: "5%",
        //   bottom: "5%",
        //   containLabel: true
        // },
        xAxis: {
          type: "category",
          data: data.customerData,
          name: "客户",
          nameTextStyle: {
            color: "#1890FF",
            fontSize: 16
          }
        },
        yAxis: {
          type: "value",
          name: "销售量",
          nameTextStyle: {
            color: "#1890FF",
            fontSize: 16
          }
        },
        series: [
          {
            name: "销售量",
            barWidth: "40%",
            data: data.qtyData,
            type: "bar"
          }
        ]
      };
      console.log(data);
      this.chartDetail.setOption(option, true);
    },
    getData() {
      let qtyData = [];
      let customerData = [];
      this.$refs["queryForm"].validate((valid, object) => {
        if (valid) {
          this.queryForm.date = simpleDateFormat(
            this.queryForm.date,
            "yyyy-MM-dd"
          );
          findSaleReport(this.queryForm).then(response => {
            if (response.data.success) {
              for (
                let index = 0;
                index < response.data.data.data.length;
                index++
              ) {
                const element = response.data.data.data[index];
                qtyData.push(element.qty);
                // console.log(element.qty);
                customerData.push(element.customer_name);
              }
              this.customer.customerData = customerData;
              this.customer.qtyData = qtyData;
            }
            this.$nextTick(() => {
              this.applyBarEchart(this.customer);
              // this.applyCustomerBarEchart();
            });
          });
          // this.applyBarEchart(this.customer);
        } else {
          this.$message.error(Object.values(object)[0][0].message);
        }
      });
    },
    applyCustomerBarEchart(data) {
      this.chartDetail = echarts.init(
        document.getElementById("customerEcharts")
      );
      let option = {
        title: {
          text: "客户采购-TOP5产品",
          textStyle: {
            color: "#FAAD14"
          }
        },
        color: ["#7CDBBC"],
        tooltip: {
          trigger: "axis",
        //   axisPointer: {
        //     // 坐标轴指示器，坐标轴触发有效
        //     type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
        //   }
        },
        grid: {
          left: "5%",
          right: "5%",
          bottom: "5%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: data.materialData,
          name: "产品",
          nameTextStyle: {
            color: "#1890FF",
            fontSize: 16
          }
        },
        yAxis: {
          type: "value",
          name: "采购量",
          nameTextStyle: {
            color: "#1890FF",
            fontSize: 16
          }
        },
        series: [
          {
            name: "采购量",
            barWidth: "40%",
            data: data.qtyData,
            type: "bar"
          }
        ]
      };
      this.chartDetail.setOption(option, true);
    },
    init() {
      this.$refs["queryForm"].resetFields();
      this.queryForm.type = "month";
      this.inpu.type='month';
      findPullDownSysCustomer()
      .then(response => {
        if(response.data.success){
          this.customerPull=response.data.data.list;
        }
      })
    },
    getCustomerData(){
      let materialData=[];
      let qtyData=[];
         this.$refs["inpu"].validate((valid, object) => {
        if (valid) {
          this.inpu.date = simpleDateFormat(
            this.inpu.date,
            "yyyy-MM-dd"
          );
          findCustomerReport(this.inpu).then(response => {
            if (response.data.success) {
              for (
                let index = 0;
                index < response.data.data.data.length;
                index++
              ) {
                const element = response.data.data.data[index];
                qtyData.push(element.qty);
                // console.log(element.qty);
                materialData.push(element.material_name);
              }
              this.material.materialData = materialData;
              this.material.qtyData = qtyData;
            }
            this.$nextTick(() => {
      this.applyCustomerBarEchart(this.material);
    });
          });
          // this.applyBarEchart(this.customer);
        } else {
          this.$message.error(Object.values(object)[0][0].message);
        }
      });
       
    }
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.applyBarEchart();
    //   this.applyCustomerBarEchart();
    // });
    this.init();
  }
};
</script>
<style >
.saleOrderStatistics .el-tabs--border-card > .el-tabs__content {
  height: calc(100% - 40px);
}
#salesOrdeEcharts > div {
  height: 100% !important;
  width: 100% !important;
}
</style>