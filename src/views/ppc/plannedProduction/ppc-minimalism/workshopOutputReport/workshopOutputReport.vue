<template>
  <div style="height: 100%">
    <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
      <el-form-item label="日期" prop="date">
        <el-date-picker
          clearable
          type="date"
          v-model="queryForm.date"
          value-format="yyyy-MM-dd"
          style="width: 140px"
          :format="formatDate"
        />
      </el-form-item>
      <el-form-item prop="type">
        <el-radio v-model="queryForm.type" label="day">日</el-radio>
        <el-radio v-model="queryForm.type" label="month">月</el-radio>
        <el-radio v-model="queryForm.type" label="year">年</el-radio>
      </el-form-item>
      <el-form-item label="车间" prop="workshopCode">
        <el-select
          v-model="queryForm.workshopCode"
          clearable
          placeholder="请选择生产车间"
          filterable
          style="width: 100%"
        >
          <el-option
            v-for="item in shop"
            :key="item.proccode"
            :label="item.name"
            :value="item.proccode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getData">查询</el-button>
        <el-button type="primary" icon="el-icon-refresh-left" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div id="shopEcharts" style="width:100%;height:90%"></div>
  </div>
</template>
<script>
import echarts from "echarts";
import { resetQueryForm } from "@/utils/common";
import { initDataPlanOrder } from "@/api/productionPlanning";
export default {
  components: {
    echarts
  },
  data() {
    return {
      queryForm: {
        date: new Date(),
        type: "month",
        workshopCode: ""
      },
      shop: []
    };
  },
  methods: {
    getData() {
      if (!this.queryForm.date) {
        this.$message.warning("请选择日期");
        return;
      }
      
    },
    reset() {},
    init(){
        initDataPlanOrder()
        .then(response => {
          if (response.data.success) {
            let shop = response.data.data.WORKSHOP_ALL;

            for (
              let index = 0;
              index < response.data.data.PP_STATUS.length;
              index++
            ) {
              const element = response.data.data.PP_STATUS[index];
              if (element.code == 10 || element.code == 25) {
                console.log(element.code);
                response.data.data.PP_STATUS.splice(index, 1);
              }
            }
            this.PP_STATUS = response.data.data.PP_STATUS;
            for (let i = 0; i < shop.length; i++) {
              shop[i].label = shop[i].name;
              shop[i].value = shop[i].proccode;
            }
            this.shop = shop;
            // this.tableColumn[2].options = shop
            this.getData();
          } else {
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    }
  },
  mounted(){
      this.init();
  },
  computed: {
        formatDate() {
            if (this.queryForm.type == "month") {
                return "yyyy-MM";
            } else if (this.queryForm.type == "year") {
                return "yyyy";
            } else {
                return "yyyy-MM-dd";
            }
        }
    }
};
</script>