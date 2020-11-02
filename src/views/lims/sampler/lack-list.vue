<template>
  <div>
    <el-form ref="queryForm" :inline="true" label-width="100px" class="margin20 mb0">
      <el-form-item label="计划单号" prop="planCode">
        <el-input v-model="queryForm.planCode" plain="true" placeholder="请输入计划单号" />
      </el-form-item>
      <el-form-item label="任务单号" prop="scheduleCode">
        <el-input
          v-model="queryForm.scheduleCode"
          plain="true"
          placeholder="请输入任务单号"
        />
      </el-form-item>
      <el-form-item label="样品名称" prop="speciName">
        <el-input v-model="queryForm.speciName" plain="true" placeholder="请输入样品名称" />
      </el-form-item>
      <el-form-item label="取样车间" prop="workShop">
        <el-input v-model="queryForm.workShop" plain="true" placeholder="取样车间" />
      </el-form-item>
      <el-form-item label="取样地点" prop="sampPlace">
        <el-input v-model="queryForm.sampPlace" plain="true" placeholder="请输入取样地点" />
      </el-form-item>
      <el-form-item label="样品类型" prop="speciType">
        <el-select v-model="queryForm.speciType">
          <el-option value="随机样" label="随机样"></el-option>
          <el-option value="定点样" label="定点样"></el-option>
        </el-select>
      </el-form-item>
        <el-form-item label="审核状态" prop="ifRecheck">
            <el-select v-model="queryForm.ifRecheck">
                <el-option value="1" label="通过"></el-option>
                <el-option value="2" label="拒绝"></el-option>
                <el-option value="3" label="未审核"></el-option>
            </el-select>
        </el-form-item>
      <el-form-item>
        <el-button
          icon="el-icon-search"
          href="javascript:void(0)"
          type="primary"
          class="btn-b"
          @click="getData(1)"
        >查询</el-button>
        <el-button href="javascript:void(0)" class="btn-w" @click="clearSearchBox">清空</el-button>
      </el-form-item>
    </el-form>
    <div class="tableshadow margin20" style="width:calc(100% - 40px);padding-bottom:20px;">
      <el-table :data="tableData" ref="refTable">
        <el-table-column prop="schedule.planCode" align="center" width="150px" label="计划单号"></el-table-column>
        <el-table-column prop="schedule.scheduleCode" align="center" width="150px" label="任务单号"></el-table-column>
        <el-table-column prop="speciName" align="center" width="180" label="样品名称"></el-table-column>
        <el-table-column prop="speciType" align="center" label="样品类型"></el-table-column>
        <el-table-column prop="speciCode" align="center" label="样品编号" width="150px"></el-table-column>
        <el-table-column prop="missCause" align="center" label="缺样原因" width="150px"></el-table-column>
        <el-table-column prop="workShop" align="center" label="取样车间" width="150px"></el-table-column>
        <el-table-column prop="sampPlace" align="center" label="取样地点" width="150px"></el-table-column>
        <el-table-column align="center" min-width="150px" label="取样小组">
          <template slot-scope="scope">
            <el-tooltip placement="bottom">
              <div slot="content">
                <span
                  v-for="(item,
                                    i) in scope.row.sampPers.split(',')"
                  v-bind:key="i"
                >
                  {{ item }}
                  <br />
                </span>
              </div>
              <button type="button" class="el-button el-button--text el-button--small">
                <i class="el-icon-info">
                  {{
                  scope.row.sampGroup
                  }}
                </i>
              </button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="createUserName" align="center" width="150px" label="申请人"></el-table-column>
        <el-table-column prop="createTime" align="center" width="180px" label="申请时间"></el-table-column>
        <el-table-column prop="checkUserName" align="center" width="150px" label="审核人"></el-table-column>
        <el-table-column prop="checkTime" align="center" width="180px" label="审核时间"></el-table-column>
        <!-- <el-table-column align="center" label="是否留存">
          <template slot-scope="scope">
            <el-popover
              v-if="scope.row.ifRestain"
              @show="queryRestain(scope.row)"
              trigger="click"
              placement="bottom"
            >
              <span>
                {{'留存有效期：'}}{{restainData.restainTimeNum?restainData.restainTimeNum:''}}
                {{restainData.restainTimeType?restainData.restainTimeType:''}}
                <br />
                {{'截止时间：'}}{{restainData.restainExpiration?restainData.restainExpiration:''}}
              </span>
              <el-button
                slot="reference"
                style="border: 0"
                :disabled="!hasBtn(['LIMS-SPECIMEN-REGULAR-KEEP'])"
              >
                <i class="el-icon-info" style="font-size: 12px">留存详情</i>
              </el-button>
            </el-popover>
            <span v-else>否</span>
          </template>
        </el-table-column>-->
        <!-- <el-table-column align="center" label="是否留存">
               <template slot-scope="scope">
                 <button type="button" class="el-button el-button&#45;&#45;text el-button&#45;&#45;small" v-if="scope.row.ifRestain" @click="getRestainDetail(scope.row)"
                         :disabled="!hasBtn(['LIMS-SPECIMEN-RANDOM-KEEP'])">
                   <i class="el-icon-info">留存详情</i>
                 </button>
                 <span v-else>否</span>
               </template>
        </el-table-column>-->
        <!-- <el-table-column
          align="center"
          label="来料信息"
          v-if="hasBtn(['LIMS-SPECIMEN-RANDOM-INCOMING'])"
        >
          <template slot-scope="scope">
            <button
              type="button"
              class="el-button el-button--text el-button--small"
              v-if="scope.row.ifIncoming"
              @click="getRawDetail(scope.row)"
            >
              <i class="el-icon-info">来料详情</i>
            </button>
            <span v-else>/</span>
          </template>
        </el-table-column>-->
        <!-- <el-table-column align="center" label="分析项目" v-if="hasBtn(['LIMS-SPECIMEN-RANDOM-ITEM'])">
          <template slot-scope="scope">
            <button
              type="button"
              class="el-button el-button--text el-button--small"
              @click="getIndicatorDetail(scope.row)"
            >
              <i class="el-icon-info">项目详情</i>
            </button>
          </template>
        </el-table-column>-->
        <!--<el-table-column align="center" prop="remark" label="备注"></el-table-column>-->
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template v-slot="scope">
            <span v-if="!scope.row.ifRecheck">
              <el-button type="text" @click="check(scope.row.speciId, 1)">通过</el-button>
              <el-button type="text" @click="check(scope.row.speciId, 2)">拒绝</el-button>
            </span>
            <span v-else-if="scope.row.ifRecheck === 1">通过</span>
            <span v-else>拒绝</span>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        :total="total"
        :page.sync="page.pageNum"
        :limit.sync="page.pageSize"
        @pagination="getData"
      />
    </div>
    <!-- <el-dialog title="留存详情" :visible.sync="DialogVisible" width="60%">
            <restain-more @hidenDialog="hidenDialog" :selSpecimen="selSpecimen"/>
        </el-dialog>
        <el-dialog title="来料详情" :visible.sync="rawDialogVisible" width="60%">
            <raw-more @hidenDialog="hidenDialog" :selSpecimen="selSpecimen"/>
        </el-dialog>
        <el-dialog title="分析项目详情" :visible.sync="itemDialogVisible" width="60%">
            <indicator-more @hidenDialog="hidenDialog" :rowSpecimen="rowSpecimen"/>
    </el-dialog>-->
  </div>
</template>
<script>
import { speciLackList, speciLackCheck } from "@/api/lims";
import Pagination from "@/components/Pagination";
import { hasBtn } from "@/utils/index";

export default {
  name: "LackList",
  components: {
    Pagination
  },
  data() {
    return {
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      loading: false,
      tableData: [],
      queryForm: {
        // 查询表单
        speciName: "",
        sampPlace: "",
        workShop: "",
        planCode: "",
        scheduleCode: "",
        ifRecheck: ""
      },
      restainData: {},
      rawDialogVisible: false,
      DialogVisible: false,
      itemDialogVisible: false,
      selSpecimen: {},
      rowSpecimen: {}
    };
  },
  methods: {
    hasBtn,
    getData(pageNum) {
      if (pageNum === 1) this.page.pageNum = 1;
      const params = {
        ...this.queryForm,
        ...this.page
      };
      speciLackList(params)
        .then(res => {
          this.tableData = res.data.data.rows;
          this.total = res.data.data.total;
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    clearSearchBox() {
      this.queryForm = {
        speciName: "",
        sampPlace: "",
        workShop: "",
        planCode: "",
        scheduleCode: "",
        speciType: "",
        ifRecheck: ""
      };
      this.getData(1);
    },
    hidenDialog() {
      this.DialogVisible = false;
      this.rawDialogVisible = false;
      this.itemDialogVisible = false;
      this.getData();
    },
    getRestainDetail(specimen) {
      let _this = this;
      _this.selSpecimen = specimen.speciId;
      _this.DialogVisible = true;
    },
    getRawDetail(specimen) {
      let _this = this;
      _this.selSpecimen = specimen.speciId;
      _this.rawDialogVisible = true;
    },
    getIndicatorDetail(specimen) {
      let _this = this;
      _this.rowSpecimen = specimen;
      _this.itemDialogVisible = true;
    },
    queryRestain(row) {
      getRestainInfo(row.speciId)
        .then(response => {
          const result = response.data;
          if (result.success) {
            this.restainData = result.data;
          } else {
            this.$message({
              type: "error",
              message: result.message
            });
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    check(id, type) {
      const str = ["", "通过", "拒绝"];
      this.$confirm(`该操作将${str[type]}本条信息, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const params = { speciId: id, check: type };
          speciLackCheck(params).then(res => {
            if (res.data.success) {
              this.$message.success(res.data.message);
              this.getData();
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消");
        });
    }
  },
  mounted() {
    this.getData();
  }
};
</script>

<style scoped>
.el-form .el-col button {
  margin: -1px 4px 0px 4px;
}
</style>
