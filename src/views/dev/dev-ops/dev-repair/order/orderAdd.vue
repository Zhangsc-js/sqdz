<template>
  <div style="width: 100%;">
    <el-divider content-position="left">维修单信息</el-divider>
    <el-form ref="orderForm" :model="orderForm" :rules="rules" label-width="180px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="维修单名称：" prop="orderName">
            <span v-if="disabled">{{ orderForm.orderName }}</span>
            <el-input v-else v-model="orderForm.orderName" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="执行人：" prop="executor">
            <span v-if="disabled">{{ orderForm.executorName }}</span>
            <el-select
              v-else
              v-model="orderForm.executor"
              filterable
              placeholder="请选择"
              :disabled="disabled"
            >
              <el-option
                v-for="item in executorMap"
                :key="item.code"
                :label="item.label"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="计划完成时间：" prop="planFinishTime">
            <span v-if="disabled">{{ orderForm.planFinishTime }}</span>
            <el-date-picker
              v-else
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="orderForm.planFinishTime"
              type="datetime"
              placeholder="选择日期时间"
              :pickerOptions="pickerOptions"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实际完成时间：" prop="realFinishTime" v-if="title!='新增'">
            <span v-if="disabled">{{ orderForm.realFinishTime }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注：" prop="remarks">
            <span v-if="disabled">{{ orderForm.remarks }}</span>
            <el-input
              v-else
              type="textarea"
              :rows="2"
              v-model="orderForm.remarks"
              :disabled="disabled"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 保存行 -->
    <el-row style="text-align:center;padding:10px">
      <el-button icon="el-icon-check" type="primary" v-if="title!='详情'" @click="confirmed()">保存</el-button>
    </el-row>
    <el-divider content-position="left">维修项信息</el-divider>
    <el-row style="padding:10px">
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="addInfo"
        v-if="title!='详情'"
        :disabled="isSave"
      >新增</el-button>
      <span v-if="isSave && title!='详情'" style="color:red;margin-left:20px">(请先保存维修单信息)</span>
    </el-row>
    <el-table
      stripe
      border
      :data="tableData"
      @selection-change="selectionChange"
      style="width: 100%"
      highlight-current-row
      @row-click="mainTableChange"
    >
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column prop="devName" label="设备名称"></el-table-column>
      <el-table-column prop="partsName" label="部件名称"></el-table-column>
      <el-table-column prop="projectName" label="项目名称"></el-table-column>
      <el-table-column prop="emergencyGrade" label="紧急等级" align="center">
        <template slot-scope="scope">
          <jt-badge v-if="scope.row.emergencyGrade === 30" status="unactivated" textValue="普通" />
          <jt-badge v-else-if="scope.row.emergencyGrade === 20" status="warning" textValue="一般" />
          <jt-badge v-else-if="scope.row.emergencyGrade === 10" status="error" textValue="紧急" />
        </template>
      </el-table-column>
      <el-table-column prop="reportTime" :formatter="formatter" label="报修时间" width="150"></el-table-column>
      <el-table-column prop="reportSource" label="异常来源">
        <template slot-scope="scope">
          <span v-if="scope.row.reportSource === 1">点检</span>
          <span v-else-if="scope.row.reportSource === 2">巡检</span>
          <span v-else>其他</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="realtimeData"
        label="现场情况"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <!-- <el-table-column
        v-if="disabled"
        prop="exceptionReason"
        label="异常原因"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column> -->
      <el-table-column
        v-if="disabled"
        prop="repairMethod"
        label="维修方法"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column prop="applicantName" label="申请人" align="center"></el-table-column>
      <el-table-column prop="status" label="处理状态" align="center">
        <template slot-scope="scope">
          <jt-badge v-if="scope.row.status === 0" status="unactivated" textValue="待处理" />
          <jt-badge v-else-if="scope.row.status === 1" status="processing" textValue="处理中" />
          <jt-badge v-else-if="scope.row.status === 2" status="warning" textValue="已完成" />
          <jt-badge v-else-if="scope.row.status === 9" status="error" textValue="已停止" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" v-if="title!='详情'" key="delete">
        <template slot-scope="scope">
          <el-button type="text" @click="delRow(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-divider v-if="title==='详情'" content-position="left">领用备品备件信息</el-divider>
    <el-table
      stripe
      border
      :data="tableDataSpares"
      style="width: 100%;margin-bottom: 20px"
      highlight-current-row
      v-if="title==='详情'"
    >
      <el-table-column prop="sparesCode" label="备品备件编码"></el-table-column>
      <el-table-column prop="sparesName" label="备品备件名称"></el-table-column>
      <el-table-column prop="specification" label="规格"></el-table-column>
      <el-table-column prop="modelNumber" label="型号"></el-table-column>
      <el-table-column prop="quality" label="材质"></el-table-column>
      <el-table-column prop="useQty" label="领用数量"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import JtBadge from "@/components/JtBadge";
import {
  getRecordByOrderNo,
  getRepairSparesData,
  addOrder,
  orderDetailDEl
} from "@/api/dev/devRepair";
import { getRepairUserMap } from "@/api/device";
import { simpleDateFormat } from "@/utils";
import { createNamespacedHelpers } from "vuex";

const { mapMutations } = createNamespacedHelpers("sysDev");

export default {
  name: "OrderAdd",
  components: {
    JtBadge
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      tableData: [],
      dialogVisible: false,
      tableDataSpares: [],
      orderForm: {
        orderName: null,
        executor: null,
        remarks: null
      },
      total: 0,
      page: {
        pageNum: 1,
        pageSize: 10
      },
      userMaps: [],
      executorMap: [],
      sels: [],
      batchBtnVisibles: true,
      rules: {
        orderName: [{ required: true, message: "请填写", trigger: "blur" }],
        executor: [
          { required: true, message: "请选择执行人", trigger: "blur" }
        ],
        planFinishTime: [
          { required: true, message: "请选择计划完成时间", trigger: "blur" }
        ]
      },
      isSave: false,
      orderNo: ""
    };
  },
  props: {
    count: {
      type: Number,
      required: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    order: {
      type: Object,
      required: false,
      default: () => {}
    },
    title: {
      type: String,
      required: true,
      default: ""
    }
  },
  watch: {
    order(val) {
      this.orderForm = Object.assign({}, this.order);
      this.init();
      if (!val.orderNo) {
        this.SET_ORDERNO("");
        this.isSave = true;
      }
    },
    title(val) {
      if (val == "新增") {
        this.isSave = true;
      } else {
        this.isSave = false;
      }
    },
    count() {
      this.getData();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getExecutor();
      this.init();
    });
    if (this.title == "新增") {
      this.isSave = true;
    } else {
      this.isSave = false;
    }
  },
  methods: {
    ...mapMutations(["SET_ORDERNO"]),
    init() {
      if (Object.keys(this.order).length != 0) {
        this.orderForm = Object.assign({}, this.order);
        this.SET_ORDERNO(this.orderForm.orderNo);
        const param = {
          orderNo: this.order.orderNo
        };
        // 获取表格数据
        getRecordByOrderNo(param)
          .then(response => {
            const result = response.data;
            if (result.success) {
              this.tableData = result.data;
              // this.total = result.data.total;
            } else {
              this.$message.error(result.message);
            }
          })
          .catch(e => {
            this.$message.error(e.message);
          });
      } else {
        this.tableData = [];
      }
      //   领用备品备件信息
      if (this.title == "详情") {
        this.getRepairSparesData();
      }
    },
    getData() {
      const param = {
        orderNo: this.orderForm.orderNo
      };
      getRecordByOrderNo(param).then(response => {
        const result = response.data;
        if (result.success) {
          this.tableData = result.data;
        } else {
          this.$message.error(result.message);
        }
      });
    },
    getRepairSparesData(mainData) {
      if (Object.keys(this.order).length == 0) {
        return;
      }
      let params = { orderNo: this.order.orderNo };
      if (mainData) {
        params.repairRecordId = mainData.id;
      }
      getRepairSparesData(params)
        .then(response => {
          const result = response.data;
          if (result.success) {
            this.tableDataSpares = result.data;
            // this.total = result.data.total
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    selectionChange(sels) {
      this.sels = sels;
      this.batchBtnVisibles = this.sels.length === 0;
    },
    getExecutor() {
      getRepairUserMap()
        .then(response => {
          const result = response.data;
          if (result.success) {
            this.executorMap = result.data.REPAIR_PERSON;
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    mainTableChange(mainData) {
      if (this.title != "详情") return;
      this.getRepairSparesData(mainData);
    },
    confirmed() {
      this.$refs["orderForm"].validate(valid => {
        if (valid) {
          addOrder(this.orderForm).then(res => {
            if (res.data.success) {
              this.$message.success("保存成功");
              this.isSave = false;
              this.$emit("saveSuccess");
              this.SET_ORDERNO(res.data.data.orderNo);
              this.orderForm = res.data.data;
            }
          });
        } else {
          this.$message.error("保存失败，请检查必填项是否都正确填写");
          return false;
        }
      });
    },
    formatter(r, c, v) {
      return simpleDateFormat(v, "yyyy-MM-dd HH:mm");
    },
    addInfo() {
      this.$emit("open");
    },
    delRow(row) {
      orderDetailDEl(row.id).then(res => {
        if (res.data.success) {
          this.$message.success("删除成功");
          this.getData();
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  }
};
</script>
