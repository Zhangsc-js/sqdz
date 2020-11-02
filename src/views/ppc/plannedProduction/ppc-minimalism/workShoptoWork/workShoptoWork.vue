<template>
  <div style="height: 100%;" class="planOrder">
    <el-form inline :model="queryForm" class="demo-form-inline" ref="queryForm" label-width="110px">
      <el-row>
        <el-form-item label="生产单号：" prop="ppNo">
          <el-input v-model="queryForm.ppNo" placeholder="请输入生产单号" clearable></el-input>
        </el-form-item>
        <el-form-item label="生产车间：" prop="workshopCode">
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
          <el-button type="primary " icon="el-icon-search" @click="getData()">查询</el-button>
          <el-button
            href="javascript:void(0)"
            icon="el-icon-refresh-left"
            class="btn-w"
            @click="clearSearchBox"
            type="primary"
          >重置</el-button>
          <el-button type="text" @click="showMore=!showMore">
            {{ showMore ? '收起' : '展开' }}
            <i class="el-icon-arrow-down" />
          </el-button>
        </el-form-item>
      </el-row>
      <div v-show="showMore">
        <el-row>
          <el-form-item label="计划日期：" prop="planStartDate">
            <el-date-picker
              v-model="queryForm.planStartDate"
              type="date"
              placeholder="开始日期"
              style="width: 100%"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="~" prop="planEndDate" label-width="30px">
            <el-date-picker
              v-model="queryForm.planEndDate"
              type="date"
              placeholder="截止日期"
              style="width: 100%"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="状态：" prop="status">
            <el-select
              clearable
              filterable
              v-model="queryForm.status"
              placeholder="请选择状态"
              style="width: 100%"
              @change="getData()"
            >
              <el-option
                v-for="item in PP_STATUS"
                :key="item.code"
                :label="item.label"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
      </div>
    </el-form>
    <el-table
      highlight-current-row
      height="calc(100% - 52px - 50px - 12px - 12px)"
      :data="tableData"
      style="width: 100%"
      @row-click="planInfo"
      border
    >
      <el-table-column prop="ppNo" label="生产单号" width="120px"></el-table-column>
      <el-table-column prop="workshopName" label="生产车间" width="180px"></el-table-column>
      <el-table-column prop="materialCode" label="物料编码" width="120px"></el-table-column>
      <el-table-column prop="materialName" label="物料名称" width="180px"></el-table-column>
      <el-table-column prop="specification" label="规格" width="150px"></el-table-column>
      <el-table-column prop="quality" label="材质" width="80px"></el-table-column>
      <el-table-column prop="color" label="颜色" width="80px"></el-table-column>
      <el-table-column prop="produceQty" label="加工数量" width="80px"></el-table-column>
      <el-table-column prop="planStartDate" label="计划开始" width="180px"></el-table-column>
      <el-table-column prop="planEndDate" label="计划截止" width="180px"></el-table-column>
      <el-table-column prop="unitCode" label="单位" width="100px"></el-table-column>
      <el-table-column prop="status" :formatter="formatStast" label="状态" width="100px"></el-table-column>
      <el-table-column prop="goodQty" label="合格数量" width="100px"></el-table-column>
      <el-table-column prop="badQty" label="废品数量" width="100px"></el-table-column>
      <el-table-column label="完成进度" width="100px">
        <template v-slot="scope">
          <el-progress v-if="scope.row.progressValue>100" :percentage="100" :show-text="true"></el-progress>
          <el-progress v-if="scope.row.progressValue==null" :percentage="0" :show-text="true"></el-progress>
          <el-progress
            v-if="scope.row.progressValue!=null&&scope.row.progressValue<=100"
            :percentage="scope.row.progressValue"
            :show-text="true"
          ></el-progress>
        </template>
      </el-table-column>
      <el-table-column prop="saleDetailNo" label="子销售单号" width="180px"></el-table-column>
      <el-table-column
        fixed="right"
        align="center"
        label="操作"
        width="220px"
        v-if="hasBtn(['PPC-PLAN-RELEASE','PPC-PLAN-UPT','PPC-PLAN-DLT','PPC-PLAN-FORCE'])"
      >
        <template v-slot="work">
          <el-button
            style="margin: 0"
            type="text"
            v-if="work.row.status==20"
            size="small"
            @click="issuePP(work.row.id)"
            v-has="'PPC-PLAN-RELEASE'"
          >开工</el-button>
          <el-button
            style="margin: 0"
            type="text"
            v-if="work.row.status>20"
            size="small"
            @click="updatePP(work.row.id)"
            v-has="'PPC-PLAN-UPT'"
          >报工</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :total="total"
      :page.sync="page.pageNum"
      :limit.sync="page.pageSize"
      @pagination="getData"
    />
    <el-dialog :title="title" :visible.sync="productionDialogVisible" width="90%">
      <productionSubmitted
        @save="hidenDialog"
        @cancel="hidenDialogCancel"
        :trigger="productionDialogVisible"
        :id="id"
      />
    </el-dialog>
  </div>
</template>
<script>
import {
  initDataPlanOrder,
  findWorkShoptoWork,
  updateStatus,
  findPpcProduocePlanSimpleAll
} from "@/api/productionPlanning";
import Pagination from "@/components/Pagination";
import { hasBtn } from "@/utils/index";
import productionSubmitted from "./productionSubmitted";
export default {
  components: {
    Pagination,
    productionSubmitted
  },
  data() {
    return {
      queryForm: {
        ppNo: "",
        workshopCode: "",
        planStartDate: "",
        planEndDate: "",
        status: ""
      },
      showMore: false,
      PP_STATUS: [],
      tableData: [],
      shop: [],
      page: {
        pageNum: 1,
        pageSize: 10
      },
      id: "",
      total: 0,
      title: "",
      type: "",
      productionDialogVisible: false
    };
  },
  methods: {
    hasBtn,
    issuePP(id) {
      let that = this;
      let map = {
        id: id,
        status: "30"
      };
      this.$confirm("此操作将开工该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          updateStatus(map).then(response => {
            console.log(response);
            if (response.data.success) {
              that.getData();
              that.$message.success("开工成功!");
            } else
              that.$message.error(
                response.data.message + ":" + response.data.data
              );
          });
        })
        .catch(() => {
          this.$message.info("已取消开工");
        });
    },
    init() {
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
    },
    getData() {
      let that = this;
      let params = {
        ...that.queryForm,
        ...that.page
      };
      findPpcProduocePlanSimpleAll(params).then(response => {
        if (response.data.success) {
          that.tableData = response.data.data.list;
          that.total = response.data.data.total;
        }
      });
    },
    clearSearchBox() {
      this.queryForm = {
        ppNo: "",
        workshopCode: "",
        saleDetailNo: "",
        planStart: "",
        planEnd: "",
        status: ""
      };
    },
    planInfo() {},
    hidenDialog() {
      this.productionDialogVisible = false;
      this.getData();
    },
    hidenDialogCancel() {
      this.productionDialogVisible = false;
    },
    updatePP(id) {
      this.title = "生产报工";
      this.productionDialogVisible = true;
      this.id = id;
    },
    formatStast: function(row, column) {
      for (let index = 0; index < this.PP_STATUS.length; index++) {
        const element = this.PP_STATUS[index];
        if (row.status == element.code) {
          return element.label;
        }
      }
    }
  },
  mounted() {
    this.init();
  }
};
</script>
