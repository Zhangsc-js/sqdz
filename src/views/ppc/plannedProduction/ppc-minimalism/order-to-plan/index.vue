<template>
  <!-- 订单转计划 -->
  <div class="orderToPlan" style="height:100%">
    <!-- 查询表单 -->
    <el-form ref="queryForm" :model="queryForm" style="margin-left:20px" inline>
      <el-row>
        <el-form-item label="交货日期" prop="time">
          <el-date-picker
            v-model="queryForm.time"
            type="datetimerange"
            range-separator="~"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="物料编码" prop="materialCode">
          <el-input v-model="queryForm.materialCode" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="getData(1)">查询</el-button>
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
        <el-form-item label="计划状态" prop="mpsStatus">
          <el-select v-model="queryForm.mpsStatus" prop="status" clearable>
            <el-option value="0" label="待生成计划"></el-option>
            <el-option value="1" label="已生成计划"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主订单号" prop="soNo">
          <el-input v-model="queryForm.soNo"></el-input>
        </el-form-item>
        <el-form-item label="子订单号" prop="sdNo">
          <el-input v-model="queryForm.sdNo" clearable></el-input>
        </el-form-item>
      </el-row>
    </el-form>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      stripe
      border
      style="width:100%"
      ref="multipleTable"
      :height="showMore?'calc(100% - 166px - 52px)':'calc(100% - 166px)'"
    >
      <el-table-column type="selection" width="55" fixed :key="random + '1'"></el-table-column>
      <el-table-column prop="materialCode" label="物料编码"></el-table-column>
      <el-table-column prop="materialName" label="物料名称" width="150"></el-table-column>
      <el-table-column prop="specification" label="规格" width="100"></el-table-column>
      <el-table-column prop="modelNumber" label="型号"></el-table-column>
      <el-table-column prop="color" label="颜色"></el-table-column>
      <el-table-column prop="qty" label="加工数量"></el-table-column>
      <el-table-column prop="unit" label="单位"></el-table-column>
      <el-table-column prop="bomVer" label="bom版本"></el-table-column>
      <el-table-column prop="receiveDate" label="下单日期" width="120"></el-table-column>
      <el-table-column prop="deliveryDate" label="交货日期" width="120"></el-table-column>
      <el-table-column prop="remarks" label="备注"></el-table-column>
      <el-table-column prop="status" label="订单状态" width="120" :formatter="formatterStatus"></el-table-column>
      <el-table-column prop="mpsStatus" :formatter="formatterMpsStatus" label="计划状态"></el-table-column>
      <el-table-column prop="planerName" label="计划员" width="100"></el-table-column>
      <el-table-column prop="sdNo" width="120" label="子订单号"></el-table-column>
      <el-table-column prop="soNo" width="120" label="主订单号"></el-table-column>
      <el-table-column label="操作" width="280" fixed="right" align="center">
        <template v-slot="{row}">
          <el-button v-if="row.status==10" type="text" @click="release(row.id)">下达</el-button>
          <el-button
            v-if="row.mpsStatus==0&&row.status==20&&row.planerCode!=''"
            type="text"
            @click="producePlan(row)"
          >生成计划</el-button>
          <el-button type="text" v-if="row.mpsStatus==1" @click="planPage(row)">查看计划</el-button>
          <el-button
            v-if="row.mpsStatus==1&&row.status==20"
            type="text"
            @click="cancelPlan(row.id)"
          >取消计划</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      :page.sync="page.pageNum"
      :limit.sync="page.pageSize"
      @pagination="getData"
    />
    <!-- 领取订单--取消领取订单 -->
    <el-row style="padding: 0 20px 20px 20px">
      <el-button type="primary" @click="receive">领取订单</el-button>
      <el-button @click="cancelReceive">取消领取订单</el-button>
    </el-row>
    <!-- 对话框 -->
    <el-dialog title="领取订单" :visible.sync="dialogVisible" append-to-body fullscreen>
      <receive-order @closeDialog="closeDialog" ref="dialogVisible" :random="random"></receive-order>
    </el-dialog>
    <el-dialog title="选择bom版本" :visible.sync="dialogVisibleBom" width="30%">
      <el-select v-model="bomVer" placeholder="请选择" style="width: 100%">
        <el-option
          v-for="item in bomMap"
          :key="item.bomVer"
          :label="item.bomVer"
          :value="item.bomVer"
        ></el-option>
      </el-select>
      <!-- 确定按钮 -->
      <el-row style="padding:10px;text-align:center">
        <el-button type="primary" icon="el-icon-check" @click="addProductPlan">确定</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import receiveOrder from "./receiveOrder";
import { simpleDateFormat } from "@/utils/index";
import {
  getBomVerStatusList,
  queryDetailByMap,
  addProductPlan1,
  cancelReceive,
  dltPlanById,
  getBomEffect,
  release,
  addProductPlan
} from "@/api/productionPlanning";
import Pagination from "@/components/Pagination";

export default {
  components: {
    receiveOrder,
    Pagination
  },
  data() {
    return {
      queryForm: {
        time: ["", ""],
        materialCode: "",
        mpsStatus: "",
        soNo: "",
        sdNo: ""
      },
      showMore: false,
      tableData: [],
      random: Math.random(),
      dialogVisible: false,
      dialogVisibleBom: false,
      bomVer: "",
      bomMap: [],
      total: 0,
      page: {
        pageSize: 10,
        pageNum: 1
      },
      id: ""
    };
  },
  methods: {
    getData(page) {
      if (page == 1) {
        this.page.pageNum = 1;
      }
      let params = {};
      if (this.queryForm.time) {
        params = {
          ...this.queryForm,
          ...this.page,
          planerCode: this.$store.getters.userCode,
          deliveryStartDate: simpleDateFormat(
            this.queryForm.time[0],
            "yyyy-MM-dd"
          ),
          deliveryEndDate: simpleDateFormat(
            this.queryForm.time[1],
            "yyyy-MM-dd"
          )
        };
        delete params.time;
      } else {
        params = {
          ...this.queryForm,
          planerCode: this.$store.getters.userCode,
          ...this.page
        };
      }
      queryDetailByMap(params).then(res => {
        if (res.data.success) {
          this.total = res.data.data.total;
          this.tableData = res.data.data.list;
        } else {
          this.$message.error(res.message + ":" + res.data);
        }
      });
    },
    release(id) {
      release(id, "20").then(response => {
        let data = response.data;
        if (data.success) {
          this.getData();
        } else {
          this.$message.error(data.message + ":" + data.data);
        }
      });
    },
    clearSearchBox() {
      this.$refs["queryForm"].resetFields();
      this.getData();
    },
    formatterStatus(row) {
      switch (row.status) {
        case "10":
          return "录入";
        case "20":
          return "下达";
        case "30":
          return "完工";
        case "90":
          return "终止";
      }
    },
    cancelReceive() {
      // cancelReceive(){}
      let selects = this.$refs.multipleTable.store.states.selection;
      let ids = selects.map(item => item.id);
      if (ids.length == 0) {
        this.$message.error("请先选择需要取消领取的订单");
        return;
      }
      for (let i = 0; i < selects.length; i++) {
        if (selects[i].mpsStatus != 0) {
          this.$message.error("请选择订单状态为未生成的数据");
          return;
        }
      }
      this.$confirm("确定要取消领取订单吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          cancelReceive(ids).then(res => {
            if (res.data.success) {
              this.$message.success("取消领取成功");
              this.getData();
            } else {
              this.$message.error(res.data.message + ":" + res.data.data);
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消");
        });
    },
    formatterMpsStatus(row) {
      switch (row.mpsStatus) {
        case 0:
          return "未生成";
        case 1:
          return "已生成";
      }
    },
    // 领取订单
    receive() {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["dialogVisible"].getData();
      });
    },
    // 点击生成计划->选bom版本
    producePlan(row) {
      if (!row.planerName) {
        this.$message.error("请选领取订单");
        return;
      }
      this.id = row.id;
      this.dialogVisibleBom = true;
      this.getBomVerStatusList(row.materialCode);
      getBomEffect(row.materialCode)
        .then(response => {
          if (response.data.success) {
            this.bomVer = response.data.data.bomVer;
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
    // bom版本下拉选项
    getBomVerStatusList(materialCode) {
      getBomVerStatusList(materialCode).then(response => {
        let data = response.data;
        if (data.success) {
          this.bomMap = data.data.list;
        }
      });
    },
    // 选完bom版本点击确定
    addProductPlan() {
      let params = {
        bomVer: this.bomVer
      };
      addProductPlan1(this.id, params).then(response => {
        this.dialogVisibleBom = false;
        if (response.data.success) {
          this.$message.success("生成成功!");
          //   this.saledetail(this.row); //销售单头行
          this.getData();
        } else
          this.$message.error(response.data.message + ":" + response.data.data);
      });
    },
    // 取消计划
    cancelPlan(id) {
      this.$confirm("此操作将取消计划, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          dltPlanById(id).then(res => {
            if (res.data.success) {
              this.$message.success("取消成功");
              this.getData();
            } else {
              this.$message.error(res.data.message + ":" + res.data.data);
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消");
        });
    },
    // 查看计划
    planPage(row) {
      this.$router.push({
        name: "productPlan-planOrder",
        params: { detailNo: row.sdNo }
      });
    },
    closeDialog() {
      this.dialogVisible = false;
      this.getData();
    }
  },
  activated() {
    this.random = Math.random();
  },
  mounted() {
    this.getData();
  }
};
</script>

<style>
</style>
