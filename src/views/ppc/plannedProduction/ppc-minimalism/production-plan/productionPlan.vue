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
          <el-form-item label="子销售单号：" prop="saleDetailNo">
            <el-input v-model="queryForm.saleDetailNo" placeholder="请输入子销售单号" clearable></el-input>
          </el-form-item>
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
      height="calc(100% - 52px - 50px - 28px - 28px)"
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

      <el-table-column prop="planStartDate" label="计划开始" width="100px"></el-table-column>
      <el-table-column prop="planEndDate" label="计划截止" width="100px"></el-table-column>
      <el-table-column prop="unitCode" label="单位" width="100px"></el-table-column>
      <el-table-column prop="status" :formatter="formatStast" label="状态" width="100px"></el-table-column>
      <el-table-column prop="goodQty" label="合格数量" width="100px"></el-table-column>
      <el-table-column prop="badQty" label="废品数量" width="100px"></el-table-column>
      <el-table-column label="完成进度" width="100px">
        <template v-slot="scope">
            <el-progress v-if="scope.row.progressValue>100" :percentage="100" :show-text='true'></el-progress>
            <el-progress v-if="scope.row.progressValue==null" :percentage="0" :show-text='true'></el-progress>
            <el-progress v-if="scope.row.progressValue!=null" :percentage="scope.row.progressValue" :show-text='true'></el-progress>
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
            v-if="work.row.status<20"
            size="small"
            @click="issuePP(work.row.id)"
            v-has="'PPC-PLAN-RELEASE'"
          >下达</el-button>
          <el-button
            style="margin: 0"
            type="text"
            v-if="work.row.status<=20"
            size="small"
            @click="updatePP(work.row.id)"
            v-has="'PPC-PLAN-UPT'"
          >更新</el-button>
          <el-button
            style="margin: 0"
            type="text"
            v-if="work.row.status<=20"
            size="small"
            @click="deletePP(work.row.id)"
            v-has="'PPC-PLAN-DLT'"
          >删除</el-button>
          <el-button
            style="margin: 0"
            type="text"
            v-if="work.row.status>=30&&work.row.status<40"
            size="small"
            @click="forceComplete(work.row.id)"
            v-has="'PPC-PLAN-FORCE'"
          >强制完工</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" icon="el-icon-plus" @click="addPlan">新增</el-button>
    <Pagination
      :total="total"
      :page.sync="page.pageNum"
      :limit.sync="page.pageSize"
      @pagination="getData"
    />
    <el-dialog :title="title" :visible.sync="addDialogVisible" width="65%">
      <addPlan
        @save="hidenDialog"
        @cancel="hidenDialogCancel"
        :trigger="addDialogVisible"
        :type="type"
        :id="id"
      />
    </el-dialog>
  </div>
</template>
<script>
import {
  initDataPlanOrder,
  queryAllPlan,
  batchSavePlan,
  issuePp,
  forceComplete,
  dltProducePlan,
  checkEnableChangeWorkshop,
  deletePpcProducePlanById,
  updateStatus,
  findPpcProduocePlanSimpleAll
} from "@/api/productionPlanning";
import { hasBtn } from "@/utils/index";
import Pagination from "@/components/Pagination";
import addPlan from "./addPlan";
export default {
  components:{
      Pagination,
      addPlan
  },
  data() {
    return {
      queryForm: {
        ppNo: "",
        workshopCode: "",
        saleDetailNo: "",
        planStartDate: "",
        planEndDate: "",
        status: ""
      },
      id:"",
      total:0,
      title:"",
      type:"",
      addDialogVisible:false,
      showMore: false,
      PP_STATUS: [],
      tableData: [],
      shop: [],
      page: {
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  methods: {
    hasBtn,
    updatePP(id){
      this.addDialogVisible=true;
      this.title="修改生产计划";
      this.id=id;
      this.type="2";
    },
    issuePP(id){
      let that = this;
      let map={
        id:id,
        status:"20"
      }
      this.$confirm("此操作将下达该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          updateStatus(map)
          .then(response=>{
             console.log(response);
            if (response.data.success) {
              that.getData();
              that.$message.success("下达成功!");
            }else
              that.$message.error(
                response.data.message + ":" + response.data.data);
          })
        })
        .catch(() => {
          this.$message.info("已取消下达");
        });
    },
    deletePP(id){
      let that = this;
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          deletePpcProducePlanById(id)
          .then(response=>{
             console.log(response);
            if (response.data.success) {
              that.getData();
              that.$message.success("删除成功!");
            }else
              that.$message.error(
                response.data.message + ":" + response.data.data);
          })
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    formatStast:function(row,column) {
      for (let index = 0; index < this.PP_STATUS.length; index++) {
        const element = this. PP_STATUS[index];
        if(row.status==element.code){
          return element.label;
        }
      }
    },
    forceComplete(id){
       let that = this;
      let map={
        id:id,
        status:"90"
      }
      this.$confirm("此操作将强制完成该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          updateStatus(map)
          .then(response=>{
             console.log(response);
            if (response.data.success) {
              that.getData();
              that.$message.success("强制完成成功!");
            }else
              that.$message.error(
                response.data.message + ":" + response.data.data);
          })
        })
        .catch(() => {
          this.$message.info("已取消强制完成");
        });
    },
    addPlan(){
        this.title="计划新增";
        this.type="1";
        this.addDialogVisible=true;
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
    hidenDialogCancel(){
      this.addDialogVisible=false;
    },
    hidenDialog(){
      this.init();
      this.addDialogVisible=false;
    },
    planInfo() {},
    formatWorkshop() {},
    init() {
      initDataPlanOrder()
        .then(response => {
          if (response.data.success) {
            let shop = response.data.data.WORKSHOP_ALL;
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
      const params = {
        ...this.page,
        ...this.queryForm
      };
      findPpcProduocePlanSimpleAll(params)
        .then(response => {
          let data = response.data.data.list;
          for (let i = 0; i < data.length; i++) {
            if (data[i].planStartDate) {
              data[i].planStartDate = data[i].planStartDate.substr(0, 10);
            }
            if (data[i].planEndDate) {
              data[i].planEndDate = data[i].planEndDate.substr(0, 10);
            }
            for (let j = 0; j < this.PP_STATUS.length; j++) {
              if (this.PP_STATUS[j].code == data[i].status) {
                data[i].statusName = this.PP_STATUS[j].label;
                break;
              }
            }
          }
          console.log(data);
          this.tableData = data;
          this.total = response.data.data.total;
        })
        .catch(e => {
          this.$message({
            type: "error",
            message: e.message,
            duration: 3 * 1000
          });
        });
    }
  },
  mounted() {
    this.init();
  }
};
</script>
