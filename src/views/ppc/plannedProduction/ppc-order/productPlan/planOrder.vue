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
          <el-button href="javascript:void(0)" icon="el-icon-refresh-left" class="btn-w" @click="clearSearchBox" type="primary">重置</el-button>
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
          <el-form-item label="计划日期：" prop="planStart">
            <el-date-picker
              v-model="queryForm.planStart"
              type="date"
              placeholder="开始日期"
              style="width: 100%"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="~" prop="planEnd" label-width="30px">
            <el-date-picker
              v-model="queryForm.planEnd"
              type="date"
              placeholder="截止日期"
              style="width: 100%"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="状态：" prop="statusIn">
            <el-select
              collapse-tags
              multiple
              filterable
              v-model="queryForm.statusIn"
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
      height="40%"
      :data="tableData"
      style="width: 100%"
      @row-click="planInfo"
      border
    >
      <el-table-column prop="ppLevel" label="层级码" width="70px"></el-table-column>
      <el-table-column prop="ppNo" label="生产单号" width="120px"></el-table-column>
      <el-table-column prop="workshopCode" label="所属车间" :formatter="formatWorkshop" width="180px"></el-table-column>
      <el-table-column prop="materialCode" label="物料编码" width="120px"></el-table-column>
      <el-table-column prop="materialName" label="物料名称" width="180px"></el-table-column>
      <el-table-column prop="bomCode" label="bom编码" width="150px"></el-table-column>
      <el-table-column prop="bomVer" label="bom版本" width="80px"></el-table-column>
      <el-table-column prop="produceQty" label="加工数量" width="80px"></el-table-column>
      <el-table-column prop="status" label="状态" width="100px">
        <template v-slot="scope">
          <span v-if="scope.row.status == 20">
            <jt-badge status="warning" :textValue="scope.row.statusName" />
          </span>
          <span v-else-if="scope.row.status == 40 || scope.row.status == 90 ">
            <jt-badge status="success" :textValue="scope.row.statusName" />
          </span>
          <span v-else>
            <jt-badge status="processing" :textValue="scope.row.statusName" />
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="planStartDate" label="计划开始" width="100px"></el-table-column>
      <el-table-column prop="planEndDate" label="计划截止" width="100px"></el-table-column>
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
            @click="issuePP(work.row)"
            v-has="'PPC-PLAN-RELEASE'"
          >下达</el-button>
          <el-button
            style="margin: 0"
            type="text"
            v-if="work.row.status<20"
            size="small"
            @click="updatePP(work.row)"
            v-has="'PPC-PLAN-UPT'"
          >更新</el-button>
          <el-button
            style="margin: 0"
            type="text"
            v-if="work.row.status<20"
            size="small"
            @click="deletePP(work.row.id)"
            v-has="'PPC-PLAN-DLT'"
          >删除</el-button>
          <el-button
            style="margin: 0"
            type="text"
            v-if="work.row.status<40"
            size="small"
            @click="forceComplete(work.row)"
            v-has="'PPC-PLAN-FORCE'"
          >强制完工</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :total="total"
      :page.sync="page.pageNum"
      :limit.sync="page.pageSize"
      :pageSizes="bpageSizes"
      @pagination="getData"
    />
    <template>
      <el-tabs class="tabPlan" :style="showMore?'height: calc(100% - 40% - 60px - 54px - 52px)':'height: calc(100% - 40% - 60px - 54px)'" type="border-card">
        <el-tab-pane label="生产Bom信息" lazy style="height: 100%">
          <ppc-bom :id="planId" :bomCode="bomCode" style="height: 100%" />
        </el-tab-pane>
        <el-tab-pane label="投料信息" lazy style="height: 100%">
          <ppc-material
            :id="planId"
            :trigger="Math.random()"
            style="height: 100%"
            :cmdUnable="ppStatus>=30"
          />
        </el-tab-pane>
        <el-tab-pane label="工序流程" lazy style="height: 100%">
          <ppc-process :id="planId" style="height: 100%" />
        </el-tab-pane>
      </el-tabs>
    </template>
    <el-dialog title="更新计划" :visible.sync="dialogPlanVisible" width="40%" @close="dialogPlanClose">
      <el-form ref="updateInfo" :model="updateInfo" label-width="100px" :rules="updateInfoRule">
        <el-row>
          <el-col :span="10">
            <el-form-item label="生产车间" prop="workshopCode">
              <el-select
                v-model="updateInfo.workshopCode"
                clearable
                placeholder="请选择生产车间"
                filterable
                style="width: 100%"
                :disabled="!enableChange"
              >
                <el-option
                  v-for="item in shop"
                  :key="item.proccode"
                  :label="item.name"
                  :value="item.proccode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="数量：" prop="produceQty">
              <el-input v-model="updateInfo.produceQty" type="number" min="1" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="计划开始：" prop="planStartDate">
              <!--                            <el-date-picker v-model="updateInfo.planStartDate" type="datet" placeholder="开始日期" style="width: 100%" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>-->
              <el-date-picker
                v-model="updateInfo.planStartDate"
                type="date"
                placeholder="开始日期"
                style="width: 100%"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="计划截止：" prop="planEndDate">
              <el-date-picker
                v-model="updateInfo.planEndDate"
                type="date"
                placeholder="截止日期"
                style="width: 100%"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="dialogPlanVisible=false">取 消</el-button>
        <el-button type="primary " icon="el-icon-check" @click="dialogPlanConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { hasBtn } from "@/utils/index";
import ppcBom from "./planInfo/planBom";
import ppcMaterial from "./planInfo/planMaterial";
import ppcProcess from "./planInfo/planProcess";
import {
  initDataPlanOrder,
  queryAllPlan,
  batchSavePlan,
  issuePp,
  forceComplete,
  dltProducePlan,
  checkEnableChangeWorkshop
} from "@/api/productionPlanning";
import EditTable from "@/components/EditTable";
import Pagination from "@/components/Pagination";
import JtBadge from "@/components/JtBadge";
export default {
  name: "planinfo",
  components: {
    ppcBom,
    ppcMaterial,
    ppcProcess,
    EditTable,
    Pagination,
    JtBadge
  },
  data() {
    return {
      shop: [],
      showAddBtn: false,
      showMore: false,
      page: {
        pageNum: 1,
        pageSize: 5
      },
      total: 0,
      bpageSizes: [5, 10, 50, 100],
      queryForm: {
        saleDetailNo: "",
        ppNo: ""
      },
      dialogPlanVisible: false,
      updateInfo: {
        workshopCode: "",
        planStartDate: "",
        planEndDate: "",
        produceQty: ""
      },
      id: "",
      ppStatus: "",
      updateInfoRule: {
        workshopCode: [
          { required: true, message: "请选择车间", trigger: ["change", "blur"] }
        ],
        planStartDate: [
          {
            required: true,
            message: "请选择开始日期",
            trigger: ["change", "blur"]
          }
        ],
        planEndDate: [
          {
            required: true,
            message: "请选择截止日期",
            trigger: ["change", "blur"]
          }
        ],
        produceQty: [
          { required: true, message: "请输入数量", trigger: ["change", "blur"] }
        ]
      },
      planId: "",
      bomCode: "", //bomCode
      objIds: [],
      objs: [],
      tableData: [],
      batchBtn: true,
      PP_STATUS: [],
      enableChange: true
    };
  },
  methods: {
    hasBtn,
    formatWorkshop(data) {
      return data.workshopName;
    },
    dialogPlanClose() {
      this.$refs["updateInfo"].resetFields();
    },
    planInfo(row) {
      this.planId = row.id;
      this.ppStatus = row.status;
      this.bomCode = row.bomCode;
    },
    batchSavePlan() {
      for (let j = 0; j < this.objs.length; j++) {
          if(this.objs[j].planEndDate < this.objs[j].planStartDate){
              this.$message.error("计划结束日期不能早于计划开始日期")
              return
          }
          for (let i = 0; i < this.shop.length; i++) {
          if (this.shop[i].proccode == this.objs[j].workshopCode) {
            this.objs[j].workshopName = this.shop[i].name;
          }
        }
      }
      batchSavePlan(this.objs)
        .then(response => {
          if (response.data.success) {
            this.$message.success("保存成功");
            this.dialogPlanVisible = false;
            this.getData();
          } else {
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
          }
        })
        .catch(e => {
          this.$message({
            type: "error",
            message: e.message,
            duration: 3 * 1000
          });
        });
    },
    issuePP(row) {
      if (row.status && row.status != "10") {
        this.$message.error("仅录入状态可下达");
        return;
      }
      issuePp(row.id).then(response => {
        let data = response.data;
        if (data.success) {
          this.$message.success("操作成功");
          this.getData();
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
    },
    forceComplete(row) {
      this.$confirm("此操作将该计划强制完工, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        forceComplete(row.id).then(response => {
          let data = response.data;
          if (data.success) {
            this.$message.success("操作成功");
            this.getData();
          } else {
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
          }
        });
      });
    },
    updatePP(data) {
      this.updateInfo = data;
      if (data.status >= "25") {
        this.$message.warning("当前状态不可更新");
        return false;
      } else {
        this.enableChange = true;
      }
      this.dialogPlanVisible = true;
    },
    dialogPlanConfirm() {
      this.$refs["updateInfo"].validate((valid, object) => {
        if (valid) {
          this.objs = [this.updateInfo];
          this.batchSavePlan();
        } else {
          this.$message.error(Object.values(object)[0][0].message);
        }
      });
    },
    dialogPlanCancel() {
      this.dialogPlanVisible = false;
    },
    deletePP(id) {
      this.$confirm("此操作将删除该计划及所有子计划, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        dltProducePlan(id).then(response => {
          let data = response.data;
          if (data.success) {
            this.getData();
            this.$message.success("删除成功");
          } else {
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
          }
        });
      });
    },
    clearSearchBox() {
      this.queryForm = {
        saleDetailNo: "",
        ppNo: "",
        id: ""
      };
    },
    objSelection(objs) {
      this.objIds.length = 0;
      this.objs.length = 0;
      const _this = this;
      objs.forEach(element => {
        _this.objIds.push(element.id);
        _this.objs.push(element);
      });
      this.batchBtn = this.objIds.length === 0;
    },
    getData() {
      const params = {
        ...this.page,
        ...this.queryForm
      };
      if (this.queryForm.statusIn) {
        params.statusIn = this.queryForm.statusIn.join(",");
      }
      queryAllPlan(params)
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
    },
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
    }
  },
  activated() {
    if (this.$route.params.detailNo) {
      this.queryForm.saleDetailNo = this.$route.params.detailNo;
      this.getData();
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$route.params.detailNo) {
        this.queryForm.saleDetailNo = this.$route.params.detailNo;
      }
      this.init();
    });
  }
};
</script>

<style lang="css" scoped>
.el-date-editor {
  width: 128px;
}
.el-form-item__label {
  margin-left: 20px;
}
.el-button {
  margin-left: 20px;
}
.el-input__icon {
  line-height: 100%;
}
div .el-table {
  margin: 0;
}
.app-main > div {
  height: 100%;
}
.el-button {
  margin-left: 5px;
}
</style>
<style>
.tabPlan .el-tabs__content {
  height: calc(100% - 38px);
}
.tabPlan .el-tabs--border-card > .el-tabs__content {
  padding: 0px;
}
.planOrder .el-input {
  width: 100%;
}
</style>

