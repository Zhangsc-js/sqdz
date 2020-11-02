<template>
  <div style="width: 100%; height: 100%">
    <el-form inline ref="queryForm" :model="queryForm" label-width="100px">
      <el-row>
        <el-form-item label="谱系过站时间" prop="startTime">
          <el-date-picker prop="startTime" v-model="queryForm.startTime" type="datetime"></el-date-picker>~
          <el-date-picker prop="endTime" v-model="queryForm.endTime" type="datetime"></el-date-picker>
        </el-form-item>
        <el-form-item label="车间" prop="workshopCode">
          <el-select v-model="queryForm.workshopCode" @change="workshopChange" clearable>
            <el-option
              v-for="item in workshopOpts"
              :key="item.proccode"
              :label="item.name"
              :value="item.proccode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物料" prop="materialName">
          <el-input
            readonly
            @click.native="selMaterial"
            v-model="queryForm.materialName"
            autocomplete="off"
            style="width: 100%"
            placeholder="请选择物料"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="getData(1)">查询</el-button>
          <el-button icon="el-icon-download" type="primary" @click="exportGenealogyProd">导出</el-button>
          <el-button
            href="javascript:void(0)"
            @click="clearSearchBox"
            type="primary"
            icon="el-icon-refresh-left"
          >重置</el-button>
          <el-button type="text" @click="showMore=!showMore">
            {{ showMore ? '收起' : '展开' }}
            <i class="el-icon-arrow-down" />
          </el-button>
        </el-form-item>
      </el-row>
      <el-row v-show="showMore">
        <el-col></el-col>
        <el-form-item label="生产计划单号" prop="ppNo">
          <el-input v-model="queryForm.ppNo"></el-input>
        </el-form-item>
        <el-form-item label="派工任务单号" prop="woNo">
          <el-input v-model="queryForm.woNo"></el-input>
        </el-form-item>
        <el-form-item label="生产批次号" prop="batchNo">
          <el-input v-model="queryForm.batchNo"></el-input>
        </el-form-item>
        <el-form-item label="唯一码" prop="uniqueCode">
          <el-input v-model="queryForm.uniqueCode"></el-input>
        </el-form-item>
      </el-row>
      <el-row v-show="showMore">
        <el-form-item label="产线" prop="lineCode">
          <el-select v-model="queryForm.lineCode" @change="lineChange" clearable>
            <el-option
              v-for="item in lineOpts"
              :key="item.lineCode"
              :label="item.lineName"
              :value="item.lineCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生产工序" prop="productProcessCode">
          <el-select v-model="queryForm.productProcessCode" @change="processChange" clearable>
            <el-option
              v-for="item in processOpts"
              :key="item.processCode"
              :label="item.processName"
              :value="item.processCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备" prop="deviceCode">
          <el-select v-model="queryForm.deviceCode" clearable>
            <el-option
              v-for="item in deviceOpts"
              :key="item.deviceCode"
              :label="item.deviceName"
              :value="item.deviceCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工位" prop="stationCode">
          <el-select v-model="queryForm.stationCode" clearable>
            <el-option
              v-for="item in stationOpts"
              :key="item.stationCode"
              :label="item.stationName"
              :value="item.stationCode"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-row>
    </el-form>
    <el-table
      stripe
      border
      :data="tableData"
      style="width: 100%"
      height="calc(100% - 52px - 90px - 12px - 12px)"
    >
      <el-table-column prop="stationPassTime" label="谱系过站时间" align="center" width="'10%'"></el-table-column>
      <el-table-column prop="workshopName" label="车间" align="center" width="'10%'"></el-table-column>
      <el-table-column prop="materialCode" label="物料编码" align="center" width="'10%'"></el-table-column>
      <el-table-column prop="materialName" label="物料名称" align="center" width="'10%'"></el-table-column>
      <el-table-column prop="lineName" label="产线" align="center" width="'10%'"></el-table-column>
      <el-table-column prop="productProcessName" label="工序" align="center" width="'10%'"></el-table-column>
      <el-table-column prop="deviceName" label="设备" align="center" width="'10%'"></el-table-column>
      <el-table-column prop="stationName" label="工位" align="center" width="'10%'"></el-table-column>
      <el-table-column prop="woNo" label="派工任务单号" align="center" width="'10%'"></el-table-column>
      <el-table-column prop="ppNo" label="生产计划单号" align="center" width="'10%'"></el-table-column>
      <el-table-column prop="batchNo" label="生产批次号" align="center" width="'10%'"></el-table-column>
      <el-table-column prop="productStatus" label="质检结果" :formatter="cellFormat" align="center" width="'10%'"></el-table-column>
      <el-table-column prop="uniqueCode" label="唯一码" align="center" width="'10%'"></el-table-column>
    </el-table>
    <div class="fr batch-btn-padding">
      <Pagination
        :total="total"
        :page.sync="page.pageNum"
        :limit.sync="page.pageSize"
        @pagination="getData"
      />
    </div>
    <!-- 物料选择弹框 -->
    <el-dialog title="选择物料" :visible.sync="sltMaterialDialogVisible" width="55%" append-to-body>
      <slt-material @save="categoryDialog" @cancel="hidenDialogCancel"></slt-material>
    </el-dialog>
  </div>
</template>

<script>
import sltMaterial from "@/views/ppc/plannedProduction/ppc-bom/materialInfo";
import { hasBtn } from "@/utils/index";
import Pagination from "@/components/Pagination";
import {
  getGenealogyProd,
  exportGenealogyProd,
  getAllWorkshop,
  getProdStatus
} from "@/api/ppc/genealogyProd";
import {
  getDepartmentLine,
  getLineProcess,
  getProcessStation,
  getProcessDevice
} from "@/api/sys/departMentProcess";
import { saveAs } from "file-saver";
import { simpleDateFormat, isEmptyArray, isEmpty } from "@/utils";

export default {
  name: "genealogyProd",
  components: {
    Pagination,
    sltMaterial
  },
  data() {
    return {
      queryForm: {
        startTime: null,
        endTime: null,
        workshopCode: null,
        materialCode: null,
        materialName: null,
        ppNo: null,
        woNo: null,
        batchNo: null,
        uniqueCode: null,
        lineCode: null,
        productProcessCode: null,
        deviceCode: null,
        stationCode: null
      },
      tableData: [],
      workshopOpts: [],
      lineOpts: [],
      processOpts: [],
      deviceOpts: [],
      stationOpts: [],
      prodStatus: [],
      showMore: false,
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      sltMaterialDialogVisible: false
    };
  },
  created() {
    this.getData();
    this.init();
  },
  methods: {
    hasBtn,
    init() {
      getAllWorkshop().then(res => {
        const result = res.data;
        if (result.success) {
          this.workshopOpts = result.data;
        } else {
          this.$message.error(result.message);
        }
      });
      getProdStatus().then(res => {
        const result = res.data;
        if (result.success) {
          this.prodStatus = result.data;
        } else {
          this.$message.error(result.message);
        }
      })
    },
    getData() {
      const param = {
        ...this.page,
        ...this.queryForm
      };
      if (param.startTime) {
        param.startTime = simpleDateFormat(param.startTime);
      }
      if (param.endTime) {
        param.endTime = simpleDateFormat(param.endTime);
      }
      getGenealogyProd(param).then(res => {
        const result = res.data;
        if (result.success) {
          this.tableData = result.data.rows;
          this.total = result.data.total;
        } else {
          this.$message.error(result.message);
        }
      });
    },
    exportGenealogyProd() {
      const param = {
        ...this.page,
        ...this.queryForm
      };
      exportGenealogyProd(param).then(res => {
        const result = res.data;
        if (result) {
          let data = new File([result], { type: "application/octet-stream" });
          saveAs(data, "生产谱系过站信息.xls");
        } else {
          this.$message.error(result.message);
        }
      });
    },
    selMaterial() {
      this.sltMaterialDialogVisible = true;
    },
    categoryDialog(data) {
      this.queryForm.materialName = data.materialName;
      this.queryForm.materialCode = data.materialCode;

      this.hidenDialogCancel();
    },
    hidenDialogCancel() {
      this.sltMaterialDialogVisible = false;
    },
    workshopChange(val) {
      if (!val) return;
      getDepartmentLine({ departCode: val }).then(res => {
        const result = res.data;
        if (result.success) {
          this.lineOpts = result.data;
        } else {
          this.$message.error(result.message);
        }
      });
    },
    lineChange(val) {
      if (!val) return;
      const param = {
        departCode: this.queryForm.workshopCode,
        lineCode: val
      };
      getLineProcess(param).then(res => {
        const result = res.data;
        if (result.success) {
          this.processOpts = result.data;
        } else {
          this.$message.error(result.message);
        }
      });
    },
    processChange(val) {
      if (!val) return;
      const param = {
        lineCode: this.queryForm.lineCode,
        processCode: this.queryForm.productProcessCode
      };
      getProcessStation(param).then(res => {
        const result = res.data;
        if (result.success) {
          this.stationOpts = result.data;
        } else {
          this.$message.error(result.message);
        }
      });
      getProcessDevice(param).then(res => {
        const result = res.data;
        if (result.success) {
          this.deviceOpts = result.data;
        } else {
          this.$message.error(result.message);
        }
      });
    },
    cellFormat(r, c, v) {
      if (isEmptyArray(this.prodStatus) || isEmpty(v)) {
        return v;
      }
      const el = this.prodStatus.find(e => e.code == v);
      return el == undefined ? v : el.label;
    },
    clearSearchBox() {
      this.queryForm.endTime = null;
      this.queryForm.materialCode = null
      this.$refs["queryForm"].resetFields();
    }
  }
};
</script>

<style>
</style>