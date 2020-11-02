<template>
  <el-tabs
    type="border-card"
    v-model="activeName"
  >
    <el-tab-pane label="车号分类" name="first">
      <el-form :inline="true" class="demo-form-inline" ref="outMeterTruckGbForm">
        <!--<el-col :span="6">-->
          <el-form-item label="车号" prop="truckNo">
            <el-select
              style="height:auto;margin-bottom:0px"
              v-model="outMeterTruckGbForm.truckNo"
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
        <!--</el-col>
        <el-col :span="6">-->
          <el-form-item label="日期" prop="truckNo">
            <el-date-picker
              v-model="outMeterTruckGbForm.createdOn"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              style="width:200px"
            ></el-date-picker>
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
        <!--</el-col>
        <el-col :span="6">
          <el-button
            icon="el-icon-search"
            href="javascript:void(0)"
            type="primary"
            class="btn-b"
            @click="submitSearch()"
          >搜索</el-button>
          <el-button href="javascript:void(0)" class="btn-w" @click="clearSearchBox()">清空</el-button>
          <el-button
            href="javascript:void(0)"
            type="primary"
            class="btn-b"
            @click="exportExcel()"
          >导出</el-button>
        </el-col>-->
      </el-form>
      <div id="outTable">
        <el-table
          v-for="(item, index) in tableData"
          :key="index"
          :data="item"
          style="width: 100%;text-align: center;"
          show-summary
          :summary-method="getSummaries"
        >
          <el-table-column prop="createdOn" label="日期" align="center" width="180"></el-table-column>
          <el-table-column prop="truckNo" label="车号" align="center" width="180"></el-table-column>
          <el-table-column prop="clientele" label="收货单位" align="center" width="180"></el-table-column>
          <el-table-column prop="goodsName" label="货物名称" align="center" width="180"></el-table-column>
          <el-table-column prop="gross" align="center" sortable label="毛重(KG)"></el-table-column>
          <el-table-column prop="tare" align="center" sortable label="皮重(KG)"></el-table-column>
          <el-table-column prop="net" align="center" sortable label="净重(KG)"></el-table-column>
        </el-table>
      </div>
    </el-tab-pane>
    <el-tab-pane label="货物分类" name="second">
      <el-form :inline="true" class="demo-form-inline" ref="outMeterGoodsGbForm" >
        <!--<el-col :span="6">-->
          <el-form-item label="货物名称" prop="goodsName">
            <el-input
              id="goodsName"
              v-model="outMeterGoodsGbForm.goodsName"
              :maxlength="20"
              plain="true"
              placeholder="请输入货物名称"
              style="width: 200px"
            />
          </el-form-item>
        <!--</el-col>
        <el-col :span="6">-->
          <el-form-item label="日期" prop="truckNo">
            <el-date-picker
              v-model="outMeterGoodsGbForm.createdOn"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              style="width:200px"
            ></el-date-picker>
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
        <!--</el-col>
        <el-col :span="6">
          <el-button
            icon="el-icon-search"
            href="javascript:void(0)"
            type="primary"
            class="btn-b"
            @click="submitSearch()"
          >搜索</el-button>
          <el-button href="javascript:void(0)" class="btn-w" @click="clearSearchBox()">清空</el-button>
          <el-button
            href="javascript:void(0)"
            type="primary"
            class="btn-b"
            @click="exportExcelOne()"
          >导出</el-button>
        </el-col>-->
      </el-form>
      <div id="outTableOne">
        <el-table
          v-for="(item, index) in tableDataOne"
          :key="index"
          :data="item"
          style="width: 100%;text-align: center;"
          show-summary
          :summary-method="getSummaries"
        >
          <el-table-column prop="createdOn" label="日期" align="center" width="180"></el-table-column>
          <el-table-column prop="goodsName" label="货物名称" align="center" width="180"></el-table-column>
          <el-table-column prop="clientele" label="收货单位" align="center" width="180"></el-table-column>
          <el-table-column prop="truckNo" label="车号" align="center" width="180"></el-table-column>
          <el-table-column prop="gross" align="center" sortable label="毛重(KG)"></el-table-column>
          <el-table-column prop="tare" align="center" sortable label="皮重(KG)"></el-table-column>
          <el-table-column prop="net" align="center" sortable label="净重(KG)"></el-table-column>
        </el-table>
      </div>
    </el-tab-pane>
    <el-tab-pane label="收货单位分类" name="third">
      <el-form :inline="true" class="demo-form-inline" ref="outMeterClienteleGbForm">
        <!--<el-col :span="6">-->
          <el-form-item label="收货单位" prop="clientele">
            <el-input
              id="clientele"
              v-model="outMeterClienteleGbForm.clientele"
              :maxlength="20"
              plain="true"
              placeholder="请输入收货单位"
              style="width: 200px"
            />
          </el-form-item>
        <!--</el-col>
        <el-col :span="6">-->
          <el-form-item label="日期" prop="truckNo">
            <el-date-picker
              v-model="outMeterClienteleGbForm.createdOn"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              style="width:200px"
            ></el-date-picker>
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
        <!--</el-col>
        <el-col :span="6">
          <el-button
            icon="el-icon-search"
            href="javascript:void(0)"
            type="primary"
            class="btn-b"
            @click="submitSearch()"
          >搜索</el-button>
          <el-button href="javascript:void(0)" class="btn-w" @click="clearSearchBox()">清空</el-button>
          <el-button
            href="javascript:void(0)"
            type="primary"
            class="btn-b"
            @click="exportExcelTwo()"
          >导出</el-button>
        </el-col>-->
      </el-form>
      <div id="outTableTwo">
        <el-table
          v-for="(item, index) in tableDataTwo"
          :key="index"
          :data="item"
          style="width: 100%;text-align: center;"
          show-summary
          :summary-method="getSummaries"
        >
          <el-table-column prop="createdOn" label="日期" align="center" width="180"></el-table-column>
          <el-table-column prop="clientele" label="收货单位" align="center" width="180"></el-table-column>
          <el-table-column prop="truckNo" label="车号" align="center" width="180"></el-table-column>
          <el-table-column prop="goodsName" label="货物名称" align="center" width="180"></el-table-column>
          <el-table-column prop="gross" align="center" sortable label="毛重(KG)"></el-table-column>
          <el-table-column prop="tare" align="center" sortable label="皮重(KG)"></el-table-column>
          <el-table-column prop="net" align="center" sortable label="净重(KG)"></el-table-column>
        </el-table>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import {
  getOutMeterGroupByTruckNo,
  getOutMeterGroupByGoodsName,
  getOutMeterGroupByClientele
} from "@/api/weighing";
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
  name: "outMeterFlReport",
  data() {
    return {
      tableData: [[]],
      tableDataOne: [[]],
      tableDataTwo: [[]],
      outMeterTruckGbForm: {
        truckNo: "",
        createdOn: ""
      },
      outMeterGoodsGbForm: {
        goodsName: "",
        createdOn: ""
      },
      outMeterClienteleGbForm: {
        clientele: "",
        createdOn: ""
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
      getOutMeterGroupByTruckNo(this.outMeterTruckGbForm).then(response => {
        this.tableData = response.data.data;
      });
      getOutMeterGroupByGoodsName(this.outMeterGoodsGbForm).then(response => {
        this.tableDataOne = response.data.data;
      });
      getOutMeterGroupByClientele(this.outMeterClienteleGbForm).then(
        response => {
          this.tableDataTwo = response.data.data;
        }
      );
    },

    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = "小计";
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
      this.outMeterTruckGbForm = {
        truckNo: "",
        createdOn: ""
      };
      this.outMeterGoodsGbForm = {
        goodsName: "",
        createdOn: ""
      };
      this.outMeterClienteleGbForm = {
        clientele: "",
        createdOn: ""
      };
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
          "车号分类出厂报表.xlsx"
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
          "货物分类出厂报表.xlsx"
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
          "收货单位分类出厂报表.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") alert(e, wbout);
      }
      return wbout;
    }
  }
};
</script>

<style scoped>
/deep/ .has-gutter .cell {
  color: rgb(17, 119, 221);
}
</style>
