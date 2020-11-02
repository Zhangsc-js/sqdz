<template>
  <div>
    <div class="workshopDispatch">
      <el-divider content-position="left">生产计划工单</el-divider>
      <el-form inline ref="mainInfo" :model="mainInfo" :rules="rules" label-width="110px">
        <el-row style="margin-left:20px">
          <el-form-item label="生产计划单号：" prop="ppNo">
            <el-input v-model="inqu.ppNo" placeholder="请输入生产单号" clearable />
          </el-form-item>

          <el-form-item label="物料编码：" prop="materialCode">
            <el-input v-model="inqu.materialCode" placeholder="请输入物料编码" clearable />
          </el-form-item>

          <el-form-item>
            <el-button type="primary " icon="el-icon-search" @click="getMainData(1)">查询</el-button>
            <el-button
              href="javascript:void(0)"
              class="btn-w"
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
        <div v-show="showMore">
          <el-row>
            <el-form-item label="车间：" prop="workshopCode">
              <el-select
                v-model="inqu.workshopCode"
                placeholder="请选择"
                filterable
                style="width: 100%"
                @change="getMainData(1)"
                :disabled="$store.getters.userCode=='admin'?false:true"
              >
                <el-option
                  v-for="item in WORKSHOP_ALL"
                  :key="item.proccode"
                  :label="item.name"
                  :value="item.proccode"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="计划日期：" prop="planStart">
              <el-date-picker
                v-model="inqu.planStart"
                type="date"
                placeholder="开始日期"
                style="width: 100%"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>

            <el-form-item label="~" prop="planEnd" label-width="30px">
              <el-date-picker
                v-model="inqu.planEnd"
                type="date"
                placeholder="截止日期"
                style="width: 100%"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>

            <el-form-item label="状态：" prop="statusIn">
              <el-select
                v-model="statusIn"
                placeholder="请选择状态"
                @change="getMainData(1)"
                multiple
                filterable
                collapse-tags
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
        stripe
        :data="tableData"
        style="width: 100%;"
        height="300px"
        highlight-current-row
        @row-click="mainTableChange"
        border
      >
        <el-table-column fixed type="selection" width="55"></el-table-column>
        <el-table-column prop="ppNo" align="center" label="工单号" width="125"></el-table-column>
        <el-table-column prop="workshopName" align="center" label="车间" width="180">
          <template v-slot="{row}">
            <span :class="{yellow:inqu.workshopCode != row.workshopCode}">{{row.workshopName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="materialCode" align="center" label="物料编码" width="150"></el-table-column>
        <el-table-column prop="materialName" align="center" label="物料名称" width="150"></el-table-column>
        <el-table-column prop="bomCode" align="center" label="BOM编码" width="125"></el-table-column>
        <el-table-column prop="bomVer" align="center" label="BOM版本" width="150"></el-table-column>
        <el-table-column prop="produceQty" align="center" label="加工数量" width="100"></el-table-column>
        <el-table-column align="center" label="状态" width="100">
          <template v-slot="scope">
            <span v-if="scope.row.status == 20">
              <jt-badge status="warning" :textValue="scope.row.statusName" />
            </span>
            <span v-else-if="scope.row.status == 40 || scope.row.status == 90">
              <jt-badge status="success" :textValue="scope.row.statusName" />
            </span>
            <span v-else>
              <jt-badge status="processing" :textValue="scope.row.statusName" />
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="planStartDate" align="center" label="开始日期" width="125"></el-table-column>
        <el-table-column prop="planEndDate" align="center" label="截止日期" width="125"></el-table-column>
        <el-table-column prop="prodStandard" align="center" label="加工标准" width="125"></el-table-column>
        <el-table-column prop="workshopNote" align="center" label="备注" width="125"></el-table-column>
        <el-table-column
          fixed="right"
          align="center"
          label="操作"
          width="100"
          v-if="hasBtn('PPC-WOSHOP-DISPATH')"
        >
          <template slot-scope="scope">
            <el-button
              style="margin: 0"
              type="text"
              v-if="scope.row.status<40"
              size="small"
              @click="forceComplete(scope.row)"
              v-has="'PPC-PLAN-FORCE'"
            >强制完工</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        :total="total"
        :page.sync="page.pageNum"
        :limit.sync="page.pageSize"
        @pagination="getMainData"
      />
    </div>
    <div>
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="工序流程" name="process">
          <el-button
            type="primary "
            icon="el-icon-plus"
            v-if="mainInfo.status<40 && isCurWorkshop"
            @click="dispatch()"
          >派工</el-button>
          <el-table
            stripe
            :data="tabProcessData"
            @selection-change="selectionChangTabProcess"
            border
            highlight-current-row
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="processNo" align="center" label="流程号" width="100"></el-table-column>
            <el-table-column prop="processCode" align="center" label="工序编码" width="180">
              <template v-slot="{row}">
                <span
                  :class="{yellow:processCodes.indexOf(row.processCode)=='-1'}"
                >{{row.processCode}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="processName" align="center" label="工序名称"></el-table-column>
            <el-table-column prop="produceQty" align="center" label="加工数量"></el-table-column>
            <el-table-column prop="dispatchQty" align="center" label="已派工数量"></el-table-column>
            <el-table-column prop="goodQty" align="center" label="合格数量"></el-table-column>
            <el-table-column prop="badQty" align="center" label="废品数量"></el-table-column>
            <el-table-column prop="uncompleteQty" align="center" label="待完工数量"></el-table-column>
            <el-table-column prop="reworkQty" align="center" label="待返工数量"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="派工信息" name="workOrder">
          <el-table stripe :data="tabWorkData" border style="width: 100%" highlight-current-row>
            <!--                            <el-table-column type="selection" width="55"></el-table-column>-->
            <el-table-column
              prop="processNo"
              align="center"
              label="流程号"
              width="100"
              :filters="tabWorkFilterProcess"
              :filter-method="filterHandler"
            ></el-table-column>
            <el-table-column prop="woNo" align="center" label="派工单号" width="130"></el-table-column>
            <el-table-column prop="materialName" align="center" label="物料" width="120"></el-table-column>
            <el-table-column
              prop="statusName"
              align="center"
              label="状态"
              :filters="tabWorkFilterStatus"
              :filter-method="filterHandler"
              width="100"
            >
              <template v-slot="scope">
                <span v-if="scope.row.status == 10 || scope.row.status == 20">
                  <jt-badge status="warning" :textValue="scope.row.statusName" />
                </span>
                <span v-else-if="scope.row.status == 40 || scope.row.status == 90">
                  <jt-badge status="success" :textValue="scope.row.statusName" />
                </span>
                <span v-else>
                  <jt-badge status="processing" :textValue="scope.row.statusName" />
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="planStartDate" align="center" label="开始日期" width="150"></el-table-column>
            <el-table-column prop="planEndDate" align="center" label="截止日期" width="150"></el-table-column>
            <el-table-column prop="processName" align="center" label="工序" width="110"></el-table-column>
            <el-table-column prop="workshopName" align="center" label="车间" width="120"></el-table-column>
            <el-table-column prop="teamName" align="center" label="班组" width="100"></el-table-column>
            <el-table-column prop="produceQty" align="center" label="派工数量" width="80"></el-table-column>
            <el-table-column prop="unitCode" align="center" label="单位" width="60"></el-table-column>
            <el-table-column prop="exceptionInfo" align="center" label="加工备注" width="120"></el-table-column>
            <el-table-column fixed="right" align="center" label="操作" width="170px">
              <template v-slot="work">
                <el-button
                  type="text"
                  size="small"
                  v-if="work.row.status<20"
                  @click="issueWo(work.row.id)"
                >下达</el-button>
                <el-button
                  type="text"
                  size="small"
                  v-if="work.row.status<30"
                  @click="updateWo(work.row)"
                >更新</el-button>
                <el-button
                  type="text"
                  size="small"
                  v-if="work.row.status<30"
                  @click="deleteWo(work.row.id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="投料信息" name="input" v-if="isCurWorkshop">
          <el-table stripe :data="tabInputData" border style="width: 100%" highlight-current-row>
            <el-table-column prop="materialCode" align="center" label="物料编码" width="200"></el-table-column>
            <el-table-column prop="materialName" align="center" label="物料名称" width="240"></el-table-column>
            <el-table-column prop="specification" align="center" label="规格型号" width="240"></el-table-column>
            <el-table-column prop="quality" align="center" label="材质" width="200"></el-table-column>
            <el-table-column prop="inputQty" align="center" label="计划数量" width="120"></el-table-column>
            <el-table-column prop="alterQty" align="center" label="实际用量" width="120"></el-table-column>
            <el-table-column prop="primaryUnit" align="center" label="单位" width="120"></el-table-column>
            <el-table-column prop="remake" align="center" label="备注"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="46%">
      <el-form
        ref="dispatchInfo"
        :model="dispatchInfo"
        label-width="100px"
        :rules="dispatchInfoRules"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="车间：" prop="workshopCode">
              <el-select
                v-model="dispatchInfo.workshopCode"
                placeholder="请选择"
                filterable
                style="width: 100%"
                :disabled="!isCurWorkshop || shopDisabled"
                @change="findLineByWorkshopAndProcess"
              >
                <el-option
                  v-for="item in WORKSHOPLIST"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="加工产线：" prop="lineCode">
              <el-select
                v-model="dispatchInfo.lineCode"
                placeholder="请选择"
                filterable
                style="width: 100%"
                :disabled="!isCurWorkshop"
              >
                <el-option
                  v-for="item in lines"
                  :key="item.lineCode"
                  :label="item.lineName"
                  :value="item.lineCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="数量：" prop="produceQty">
              <el-input
                v-model="dispatchInfo.produceQty"
                type="number"
                :disabled="!isCurWorkshop"
                min="0"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="班组：" prop="teamCode">
              <el-select
                v-model="dispatchInfo.teamCode"
                placeholder="请选择"
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="item in dispatchTeamList"
                  :key="item.departCode"
                  :label="item.departName"
                  :value="item.departCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="加工开始：" prop="planStartDate">
              <el-date-picker
                v-model="dispatchInfo.planStartDate"
                type="datetime"
                placeholder="开始日期"
                style="width: 100%"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="加工截止：" prop="planEndDate">
              <el-date-picker
                v-model="dispatchInfo.planEndDate"
                type="datetime"
                placeholder="开始日期"
                style="width: 100%"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="工序：" prop="processName">
              <el-input v-model="dispatchInfo.processName" disabled="disabled" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="备注信息：" prop="exceptionInfo">
              <el-input v-model="dispatchInfo.exceptionInfo" :disabled="!isCurWorkshop" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary " icon="el-icon-check" @click="dispatchConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { hasBtn } from "@/utils/index";
import Pagination from "@/components/Pagination";
import JtBadge from "@/components/JtBadge";
import {
  queryPlanList,
  queryPlanProcessList,
  initData,
  saveDispatchByProducePlanId,
  queryDispatchInit,
  saveDispatchOne,
  saveDispatchBatch,
  queryWorkOrderList,
  queryWorkOrderByPIdAndShopCode,
  deleteWo,
  queryInputListByPlanId,
  findLineByWorkshopAndProcess,
  issueWo,
  queryTeamByWorksho,
  queryMember
} from "@/api/ppc/workshopDispatch";
import { forceComplete } from "@/api/productionPlanning";
import {
  getDepartmentLine,
  getByDepartCode
} from "@/api/sys/departMentProcess";
import reworkPng from "@/assets/images/rework.png";

export default {
  name: "workshop",
  components: {
    Pagination,
    JtBadge
  },
  mounted() {
    this.initData();
  },
  data() {
    return {
      showMore: false,
      mainInfo: {},
      dispatchInfo: {
        workshopCode: "",
        processCode: "",
        processName: "",
        devCode: "",
        teamCode: "",
        produceQty: 0,
        exceptionInfo: "",
        planStartDate: "",
        planEndDate: "",
        workerCode: "",
        lineCode: ""
      },
      dispatchInfoBatch: {
        produceQty: 0,
        planStartDate: "",
        planEndDate: ""
      },
      dispatchTeamList: [],
      dispatchWorkerList: [],
      rules: {},
      tableData: [],
      tabInputData: [],
      WORKSHOP_ALL: [],
      WORKSHOPLIST: [],
      WO_STATUS: [],
      IS_OR_NOT: [],
      WO_TYPE: [],
      PP_STATUS: [],
      DEV_LIST: [],
      total: 0,
      page: {
        pageNum: 1,
        pageSize: 10
      },
      activeName: "process",
      inqu: {},
      statusIn: ["20", "25", "30"],
      tabProcessData: [],
      dialogFormVisible: false,
      dialogFormVisibleBatch: false,
      selectTabProcessObj: {},
      selectTabProcessIds: [],
      selectTabProcessCodes: [],
      selectTabProcessNames: [],
      dispatchInfoRules: {
        workshopCode: [
          { required: true, message: "请选择车间", trigger: ["change", "blur"] }
        ],
        processCode: [
          { required: true, message: "请选择工序", trigger: ["change", "blur"] }
        ],
        teamCode: [
          { required: true, message: "请选择班组", trigger: ["change", "blur"] }
        ],
        produceQty: [
          {
            required: true,
            message: "请输入正确数量",
            trigger: ["change", "blur"]
          }
        ],
        planStartDate: [
          { required: true, message: "请输入时间", trigger: ["change", "blur"] }
        ],
        planEndDate: [
          { required: true, message: "请输入时间", trigger: ["change", "blur"] }
        ],
        workerCode: [
          {
            required: true,
            message: "请选择作业人员",
            trigger: ["change", "blur"]
          }
        ]
      },
      dispatchInfoRulesBatch: {
        produceQty: [
          {
            required: true,
            message: "请输入正确数量",
            trigger: ["change", "blur"]
          }
        ],
        planStartDate: [
          { required: true, message: "请输入时间", trigger: ["change", "blur"] }
        ],
        planEndDate: [
          { required: true, message: "请输入时间", trigger: ["change", "blur"] }
        ]
      },
      tabWorkData: [],
      tabWorkFilterProcess: [],
      tabWorkFilterStatus: [],
      tabWorkFilterType: [],
      title: "",
      reworkPng: reworkPng,
      isCurWorkshop: true, //判断是否为本车间管理计划
      lines: [],
      detWorkshop: [], //登录用户(车间主任)所在的车间
      processList: [], //车间主任所在车间 分配的工序集合
      processCodes: [], //车间主任所在车间 分配的工序Code集合
      shopDisabled: true ////true 本车间，false其他车间
    };
  },
  methods: {
    hasBtn,
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    clearSearchBox() {
      this.inqu = {};
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
            this.getMainData();
          } else {
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
          }
        });
      });
    },
    getMainData(pageNum) {
      if (pageNum === 1) {
        this.page.pageNum = pageNum;
      }
      const params = {
        ...this.page,
        ...this.inqu,
        statusIn: this.statusIn.join(",")
      };
      queryPlanList(params)
        .then(response => {
          if (response.data.success) {
            this.tableData = response.data.data.list;
            for (var i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].planStartDate) {
                this.tableData[i].planStartDate = this.tableData[
                  i
                ].planStartDate.substr(0, 10);
              }
              if (this.tableData[i].planEndDate) {
                this.tableData[i].planEndDate = this.tableData[
                  i
                ].planEndDate.substr(0, 10);
              }
              for (let j = 0; j < this.PP_STATUS.length; j++) {
                if (this.PP_STATUS[j].code == this.tableData[i].status) {
                  this.tableData[i].statusName = this.PP_STATUS[j].label;
                  break;
                }
              }
            }
            this.total = response.data.data.total;
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
    mainTableChange(data) {
      this.isCurWorkshop = data.workshopCode == this.inqu.workshopCode;
      if (data) {
        this.mainInfo = data;
      }
      this.getTabData();
    },
    tabClick() {
      this.getTabData();
    },
    getTabData() {
      if (this.activeName == "process") {
        //获取工序下拉
        getByDepartCode(this.inqu.workshopCode).then(response => {
          if (response.data.success) {
            this.processCodes = response.data.data;
          } else {
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
          }
        });

        queryPlanProcessList(this.mainInfo.id)
          .then(response => {
            if (response.data.success) {
              this.tabProcessData = response.data.data;
            } else {
              this.$message.error(
                response.data.message + ":" + response.data.data
              );
            }
          })
          .catch(e => {
            this.$message.error(e.message);
          });
      } else if (this.activeName == "workOrder") {
        let data = [];
        if (this.isCurWorkshop) {
          queryWorkOrderList(this.mainInfo.id)
            .then(response => {
              if (response.data.success) {
                data = response.data.data;
                this.tabData(data);
              } else {
                this.$message.error(
                  response.data.message + ":" + response.data.data
                );
              }
            })
            .catch(e => {
              this.$message.error(e.message);
            });
        } else {
          queryWorkOrderByPIdAndShopCode(
            this.mainInfo.id,
            this.inqu.workshopCode
          )
            .then(response => {
              if (response.data.success) {
                data = response.data.data;
                this.tabData(data);
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

        //获取产线下拉
        const params = {
          departCode: this.mainInfo.workshopCode
        };
        getDepartmentLine(params).then(response => {
          if (response.data.success) {
            this.lines = response.data.data;
            if (this.lines.length > 0) {
              this.dispatchInfo.lineCode = response.data.data[0].lineCode;
            }
          }
        });
      } else if (this.activeName == "input") {
        queryInputListByPlanId(this.mainInfo.id, this.detWorkshop[0].departCode)
          .then(response => {
            if (response.data.success) {
              this.tabInputData = response.data.data;
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
    tabData(data) {
      let filterPorcess = [];
      for (var i = 0; i < data.length; i++) {
        data[i].planStartDate = data[i].planStartDate.substr(0, 16);
        data[i].planEndDate = data[i].planEndDate.substr(0, 16);
        for (let j = 0; j < this.WO_STATUS.length; j++) {
          if (this.WO_STATUS[j].code == data[i].status) {
            data[i].statusName = this.WO_STATUS[j].label;
            break;
          }
        }
        for (let j = 0; j < this.WO_TYPE.length; j++) {
          if (this.WO_TYPE[j].code == data[i].workType) {
            data[i].workTypeName = this.WO_TYPE[j].label;
            break;
          }
        }
        let addFlag = true;
        for (let j = 0; j < filterPorcess.length; j++) {
          if (filterPorcess[j].value == data[i].processNo) {
            addFlag = false;
            break;
          }
        }
        if (addFlag)
          filterPorcess.push({
            text: data[i].processNo,
            value: data[i].processNo
          });
      }
      this.tabWorkData = data;
      this.tabWorkFilterProcess = filterPorcess;
    },
    initData() {
      initData()
        .then(response => {
          if (response.data.success) {
            this.WORKSHOP_ALL = response.data.data.WORKSHOP_ALL;
            this.IS_OR_NOT = response.data.data.IS_OR_NOT;
            this.WO_STATUS = response.data.data.WO_STATUS;
            this.WO_TYPE = response.data.data.WO_TYPE;
            this.detWorkshop = response.data.data.DFT_WORKSHOP;
            if (this.detWorkshop.length == 0) {
              this.inqu.workshopCode = this.WORKSHOP_ALL[0].proccode;
            } else {
              this.inqu.workshopCode = this.detWorkshop[0].departCode;
            }
            response.data.data.PP_STATUS.splice(0, 1);
            // this.PP_STATUS.splice(0,1);
            this.PP_STATUS = response.data.data.PP_STATUS;
            for (let i = 0; i < this.WO_STATUS.length; i++) {
              this.tabWorkFilterStatus.push({
                text: this.WO_STATUS[i].label,
                value: this.WO_STATUS[i].label
              });
            }
            for (let i = 0; i < this.WO_TYPE.length; i++) {
              this.tabWorkFilterType.push({
                text: this.WO_TYPE[i].label,
                value: this.WO_TYPE[i].label
              });
            }
            this.getMainData();
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
    dispatchPPClick(id) {
      saveDispatchByProducePlanId(id)
        .then(response => {
          if (response.data.success) {
            this.mainTableChange(this.mainInfo);
            this.getMainData();
            this.$message.success("派工成功");
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
    selectionChangTabProcess(data) {
      this.selectTabProcessObj = {};
      this.selectTabProcessIds = [];
      this.selectTabProcessCodes = [];
      this.selectTabProcessNames = [];
      if (data.length == 1) {
        this.selectTabProcessObj = data[0];
        this.selectTabProcessIds.push(data[0].id);
        this.selectTabProcessCodes.push(data[0].processCode);
        this.selectTabProcessNames.push(data[0].processName);
      } else {
        this.selectTabProcessObj = {};
        for (let i = 0; i < data.length; i++) {
          this.selectTabProcessIds.push(data[i].id);
          this.selectTabProcessCodes.push(data[i].processCode);
          this.selectTabProcessNames.push(data[i].processName);
        }
      }
    },
    resetOne() {
      this.dispatchInfo = {
        workshopCode: "",
        processCode: "",
        processName: "",
        devCode: "",
        teamCode: "",
        produceQty: 0,
        exceptionInfo: "",
        planStartDate: "",
        planEndDate: "",
        workerCode: ""
      };
    },
    dispatch() {
      if (this.selectTabProcessIds.length == 0) {
        this.$message.error("请至少选择一条进行派工");
        return;
      }
      if (this.selectTabProcessIds.length == 1) {
        this.title = "单个派工中";
        // 验证工序是否为当前车间所分配工序
        for (let i = 0; i < this.selectTabProcessCodes.length; i++) {
          if (this.processCodes.indexOf(this.selectTabProcessCodes[i]) == -1) {
            this.shopDisabled = false;
          }
        }
      } else {
        this.title = "批量派工中";
        // 验证工序是否为当前车间所分配工序
        for (let i = 0; i < this.selectTabProcessCodes.length; i++) {
          if (this.processCodes.indexOf(this.selectTabProcessCodes[i]) == -1) {
            this.$message.error(
              "【" + this.selectTabProcessCodes[i] + "】工序需要单独派工"
            );
            return;
          }
        }
      }

      let param = {
        produceProcessId: this.selectTabProcessIds[0]
      };
      queryDispatchInit(param)
        .then(response => {
          if (response.data.success) {
            if (response.data.data.workshopList.length > 0) {
              this.dialogFormVisible = true;
            } else {
              this.$message.error("当前工序没有车间拥有作业权限,请配置！！");
            }
            this.resetOne();
            this.WORKSHOPLIST = response.data.data.workshopList;
            if (this.shopDisabled) {
              //本车间派工
              this.lines = response.data.data.lineList;
              if (this.lines.length > 0) {
                this.dispatchInfo.lineCode = this.lines[0].lineCode;
              }
              this.dispatchTeamList = response.data.data.teamList;
              if (response.data.data.teamList.length != 0) {
                this.dispatchInfo.teamCode =
                  response.data.data.teamList[0].departCode;
              }
              this.dispatchInfo.workshopCode = this.mainInfo.workshopCode;
            } else {
              //非本车间派工
              //先确定车间,默认列表中第一个车间，并触发相应事件
              this.dispatchInfo.workshopCode = this.WORKSHOPLIST[0].value;
              this.dispatchInfo.processCode = this.selectTabProcessCodes[0];
              //根据车间、工序，锁定产线
              this.findLineByWorkshopAndProcess();
              this.queryTeamByWorksho();
            }
            this.dispatchInfo.processName = this.selectTabProcessNames.join(
              ","
            );
            this.dispatchInfo.planStartDate =
              this.mainInfo.planStartDate + " 08:00:00";
            this.dispatchInfo.planEndDate =
              this.mainInfo.planEndDate + " 18:00:00";
            this.dispatchInfoBatch.produceQty = this.mainInfo.produceQty;
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
    findLineByWorkshopAndProcess() {
      let map = {
        workshopCode: this.dispatchInfo.workshopCode,
        processCode: this.dispatchInfo.processCode
      };
      findLineByWorkshopAndProcess(map)
        .then(response => {
          if (response.data.success) {
            let lineList = response.data.data;
            this.lines = lineList;
            if (lineList.length > 0) {
              this.dispatchInfo.lineCode = lineList[0].lineCode;
            }
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
    queryTeamByWorksho() {
      let map = {
        workshopCode: this.dispatchInfo.workshopCode
      };
      queryTeamByWorksho(map)
        .then(response => {
          if (response.data.success) {
            let teamList = response.data.data;
            this.dispatchTeamList = teamList;
            if (teamList.length > 0) {
              this.dispatchInfo.teamCode = teamList[0].departCode;
            }
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
    dispatchConfirm() {
      if (this.dispatchInfo.produceQty <= 0) {
        this.$message.error("派工数量异常");
        return;
      }
      if (this.selectTabProcessIds.length > 1) {
        this.dispatchConfirmBatch();
        return;
      }
      let param = {
        processCode: this.selectTabProcessObj.processCode,
        planProcessId: this.selectTabProcessObj.id,
        planId: this.mainInfo.id,
        ...this.dispatchInfo
      };
      this.$refs["dispatchInfo"].validate((valid, object) => {
        if (valid) {
          saveDispatchOne(param)
            .then(response => {
              if (response.data.success) {
                this.$message.success("保存成功");
                this.mainTableChange(this.mainInfo);
                this.getMainData();
                this.dialogFormVisible = false;
              } else {
                this.$message.error(
                  response.data.message + ":" + response.data.data
                );
              }
            })
            .catch(e => {
              this.$message.error(e.message);
            });
        } else {
          this.$message.error(Object.values(object)[0][0].message);
        }
      });
    },
    dispatchConfirmBatch() {
      if (this.dispatchInfoBatch.produceQty <= 0) {
        this.$message.error("派工数量需要大于0");
        return;
      }
      let param = {
        ...this.dispatchInfo,
        planId: this.mainInfo.id,
        selectTabProcessIds: this.selectTabProcessIds.join(",")
      };
      this.$refs["dispatchInfo"].validate((valid, object) => {
        if (valid) {
          saveDispatchBatch(param)
            .then(response => {
              if (response.data.success) {
                this.$message.success("派工成功");
                this.mainTableChange(this.mainInfo);
                this.dialogFormVisible = false;
              } else {
                this.$message.error(
                  response.data.message + ":" + response.data.data
                );
              }
            })
            .catch(e => {
              this.$message.error(e.message);
            });
        } else {
          this.$message.error(Object.values(object)[0][0].message);
        }
      });
    },
    issueWo(id) {
      issueWo(id)
        .then(response => {
          if (response.data.success) {
            this.$message.success("下达成功");
            this.mainTableChange(this.mainInfo);
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
    updateWo(data) {
      if (data.status == "30") {
        this.$message.error("已开工，不可更新");
        return;
      } else if (data.status == "40") {
        this.$message.error("已完工，不可更新");
        return;
      }

      this.title = "更新";
      let param = {
        processCode: data.processCode,
        produceProcessId: data.planProcessId,
        id: data.id
      };
      this.dialogFormVisible = true;
      queryDispatchInit(param)
        .then(response => {
          if (response.data.success) {
            this.resetOne();
            this.DEV_LIST = response.data.data.DEV_LIST;
            this.dispatchTeamList = response.data.data.teamList;
            this.WORKSHOPLIST = response.data.data.workshopList;
            this.lines = response.data.data.lineList;
            if (response.data.data.teamList.length != 0) {
              this.dispatchInfo.teamCode = data.teamCode;
              this.dispatchInfo.workerCode = data.workerCode;
            }
            this.dispatchInfo.workshopCode = data.workshopCode;
            this.dispatchInfo.lineCode = data.lineCode;
            this.dispatchInfo.devCode = data.devCode;
            this.dispatchInfo.processName = data.processName;
            this.dispatchInfo.planStartDate = data.planStartDate + ":00";
            this.dispatchInfo.planEndDate = data.planEndDate + ":00";
            this.dispatchInfo.produceQty = data.produceQty;
            this.dispatchInfo.exceptionInfo = data.exceptionInfo;
            this.dispatchInfo.planProcessId = data.planProcessId;
            this.dispatchInfo.id = data.id;
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
    deleteWo(id) {
      this.$confirm("此操作将删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteWo(id)
          .then(response => {
            if (response.data.success) {
              this.$message.success("删除成功");
              this.tabClick();
            } else {
              this.$message.error(
                response.data.message + ":" + response.data.data
              );
            }
          })
          .catch(e => {
            this.$message.error(e.message);
          });
      });
    },
    queryMember(teamCode) {
      queryMember(teamCode)
        .then(response => {
          if (response.data.success) {
            this.dispatchWorkerList = response.data.data;
            if (
              response.data.data.length != 0 &&
              !this.dispatchInfo.workerCode
            ) {
              this.dispatchInfo.workerCode = response.data.data[0].value;
            }
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
  }
};
</script>
<style scoped>
.reworkDiv {
  width: 20px;
  height: 20px;
  display: inline-block;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  vertical-align: bottom;
}
</style>
<style lang="scss">
.workshopDispatch .el-select__tags {
  max-width: 200px !important;
}

.yellow {
  background-color: yellow;
}
</style>
