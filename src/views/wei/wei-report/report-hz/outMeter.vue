<template>
  <el-tabs
    type="border-card"
    v-model="activeName"
    class="outMeter"
  >
    <el-tab-pane label="车号汇总" name="first">
      <el-form :inline="true" class="demo-form-inline" ref="outMeterSumTruckNoForm">
        <!--<el-col :span="6">-->
          <el-form-item label="车牌号" prop="truckNo">
            <el-select
              style="height:auto;margin-bottom:0px"
              v-model="outMeterSumTruckNoForm.truckNo"
              filterable
              placeholder="请选择"
              id="truckNo"
            >
              <el-option
                v-for="item in carsList"
                :key="item.value"
                :label="item.truckNo"
                :value="item.truckNo"
              ></el-option>
            </el-select>
          </el-form-item>
        <el-form-item label="日期">
          <el-date-picker type="datetime" v-model="outMeterSumTruckNoForm.sTime" placeholder="选择开始日期" value-format="yyyy-MM-dd HH:mm:ss"
          /><span>~</span>
          <el-date-picker type="datetime" v-model="outMeterSumTruckNoForm.eTime" placeholder="选择结束日期" value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="submitSearch()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button href="javascript:void(0)" class="btn-w"  @click="clearSearchBox()">清空</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-document" @click="exportExcel()">导出</el-button>
        </el-form-item>
      </el-form>
      <el-table
        id="outTable"
        :data="tableData"
        style="width: 100%;text-align: center;align:center"
        show-summary
        :summary-method="getSummaries"
      >
        <el-table-column prop="truckNo" label="车号" align="center"></el-table-column>
        <el-table-column prop="gross" label="毛重(KG)" align="center"></el-table-column>
        <el-table-column prop="tare" label="皮重(KG)" align="center"></el-table-column>
        <el-table-column prop="net" label="净重(KG)" align="center"></el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="货物汇总" name="second">
      <el-form :inline="true" class="demo-form-inline" ref="outMeterSumGoodsForm" >
        <!--<el-col :span="6">-->
          <el-form-item label="货物名称" prop="goodsName">
            <el-input
              id="goodsName"
              v-model="outMeterSumGoodsForm.goodsName"
              :maxlength="20"
              plain="true"
              placeholder="请输入货物名称"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker type="datetime" v-model="outMeterSumGoodsForm.sTime" placeholder="选择开始日期" value-format="yyyy-MM-dd HH:mm:ss"
            /><span>~</span>
            <el-date-picker type="datetime" v-model="outMeterSumGoodsForm.eTime" placeholder="选择结束日期" value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="submitSearch()">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button href="javascript:void(0)" class="btn-w"  @click="clearSearchBox()">清空</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-document" @click="exportExcelOne()">导出</el-button>
          </el-form-item>
      </el-form>
      <el-table
        id="outTableOne"
        :data="tableDataOne"
        style="width: 100%;
                                text-align: center;
                                align:center"
        show-summary
        :summary-method="getSummaries"
      >
        <el-table-column prop="goodsName" label="货物名称" align="center"></el-table-column>
        <el-table-column prop="gross" label="毛重(KG)" align="center"></el-table-column>
        <el-table-column prop="tare" label="皮重(KG)" align="center"></el-table-column>
        <el-table-column prop="net" label="净重(KG)" align="center"></el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="收货单位汇总" name="third">
      <el-form :inline="true" class="demo-form-inline" ref="outMeterSumClientele" >
        <!--<el-col :span="6">-->
          <el-form-item label="收货单位" prop="clientele">
            <el-input
              id="clientele"
              v-model="outMeterSumClientele.clientele"
              :maxlength="20"
              plain="true"
              placeholder="请输入收货单位"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker type="datetime" v-model="outMeterSumClientele.sTime" placeholder="选择开始日期" value-format="yyyy-MM-dd HH:mm:ss"
            /><span>~</span>
            <el-date-picker type="datetime" v-model="outMeterSumClientele.eTime" placeholder="选择结束日期" value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="submitSearch()">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button href="javascript:void(0)" class="btn-w"  @click="clearSearchBox()">清空</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-document" @click="exportExcelTwo()">导出</el-button>
          </el-form-item>
      </el-form>
      <el-table
        id="outTableTwo"
        :data="tableDataTwo"
        style="width: 100%;text-align: center;align:center"
        show-summary
        :summary-method="getSummaries"
      >
        <el-table-column prop="clientele" label="收货单位" align="center"></el-table-column>
        <el-table-column prop="gross" label="毛重(KG)" align="center"></el-table-column>
        <el-table-column prop="tare" label="皮重(KG)" align="center"></el-table-column>
        <el-table-column prop="net" label="净重(KG)" align="center"></el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
import {
  getOutSumByTruckNo,
  getOutSumByGoods,
  getOutSumByClientele
} from "@/api/weighing";
export default {
  name: "outMeterHzReport",
  data() {
    return {
      tableData: [],
      tableDataOne: [],
      tableDataTwo: [],
      outMeterSumTruckNoForm: {
        truckNo: "",
        sTime: "",
        eTime: ""
      },
      outMeterSumGoodsForm: {
        goodsName: "",
        sTime: "",
        eTime: ""
      },
      outMeterSumClientele: {
        clientele: "",
        sTime: "",
        eTime: ""
      },
      activeName: "first"
    };
  },
  computed: {
    carsList() {
      return this.$store.state.weiCars.weiCarData;
    }
  },
  mounted() {
    this.getData();
    this.selectCars();
  },
  methods: {
    selectCars() {
      this.$store.dispatch("weiCars/getAllWeiCars");
    },
    getData() {
      getOutSumByTruckNo(this.outMeterSumTruckNoForm).then(response => {
        this.tableData = response.data.data;
      });

      getOutSumByGoods(this.outMeterSumGoodsForm).then(response => {
        this.tableDataOne = response.data.data;
      });

      getOutSumByClientele(this.outMeterSumClientele).then(response => {
        this.tableDataTwo = response.data.data;
      });
    },

    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      // const total= this.total
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += "";
        }
      });
      return sums;
    },
    submitSearch() {
      this.getData(), this.getSummaries();
    },
    clearSearchBox() {
      (this.outMeterSumTruckNoForm = {
        truckNo: "",
        sTime: "",
        eTime: ""
      }),
        (this.outMeterSumGoodsForm = {
          goodsName: "",
          sTime: "",
          eTime: ""
        }),
        (this.outMeterSumClientele = {
          clientele: "",
          sTime: "",
          eTime: ""
        });
    },
    exportExcel() {
      const xlsxParam = { raw: true };
      const wb = XLSX.utils.table_to_book(
        document.querySelector("#outTable"),
        xlsxParam
      );
      const wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream;charset=utf-8" }),
          "车号汇总出厂报表.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") alert(e, wbout);
      }
      return wbout;
    },
    exportExcelOne() {
      const xlsxParam = { raw: true };
      const wb = XLSX.utils.table_to_book(
        document.querySelector("#outTableOne"),
        xlsxParam
      );
      const wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream;charset=utf-8" }),
          "货物汇总出厂报表.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") alert(e, wbout);
      }
      return wbout;
    },
    exportExcelTwo() {
      const xlsxParam = { raw: true };
      const wb = XLSX.utils.table_to_book(
        document.querySelector("#outTableTwo"),
        xlsxParam
      );
      const wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream;charset=utf-8" }),
          "收货单位汇总出厂报表.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") alert(e, wbout);
      }
      return wbout;
    }
  }
};
</script>

<style >
.outMeter .has-gutter .cell {
  color: rgb(17, 119, 221);
}
</style>
<style scoped>
.el-col-offset-1 {
  margin-left: 74px;
}
</style>

