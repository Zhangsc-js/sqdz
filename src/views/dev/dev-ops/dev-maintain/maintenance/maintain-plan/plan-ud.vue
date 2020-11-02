<template>
  <div>
    <el-form :model="updateForm" ref="updateForm" label-width="120px" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="计划名称" prop="planName">
            <el-input v-model="updateForm.planName" :disabled="disabled" style="width: 80%;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="执行人" prop="executor">
            <el-select v-model="updateForm.executor" :disabled="disabled" style="width: 80%;">
              <el-option
                v-for="item in userMaps"
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
          <el-form-item label="模板名称" prop="tempNo">
            <el-select
              v-model="updateForm.tempNo"
              @change="handleChange"
              :disabled="disabled"
              style="width: 80%;"
            >
              <el-option
                v-for="item in tempMaps"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="周期" prop="frequently">
            <el-select
              multiple
              v-model="updateForm.frequently"
              placeholder="请选择"
              :disabled="disabled"
              style="width: 80%;"
            >
              <el-option
                v-for="item in cycles"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="任务有效期" prop="validityTime">
            <el-input-number
              v-model="updateForm.validityTime"
              controls-position="right"
              :disabled="disabled"
              :min="1"
            ></el-input-number>
            <span>小时</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="日历" prop="calendarCode">
            <el-select v-model="updateForm.calendarCode" :disabled="disabled" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="现场情况" prop="isRealtimeData">
            <el-radio v-model="updateForm.isRealtimeData" :label="1" :disabled="disabled">是</el-radio>
            <el-radio v-model="updateForm.isRealtimeData" :label="0" :disabled="disabled">否</el-radio>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="现场照片" prop="isPhoto">
            <el-radio v-model="updateForm.isPhoto" :label="1" :disabled="disabled">是</el-radio>
            <el-radio v-model="updateForm.isPhoto" :label="0" :disabled="disabled">否</el-radio>
          </el-form-item>
        </el-col>-->
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="计划开始时间" prop="startTime">
            <el-date-picker
              :disabled="disabled"
              id="startTime"
              v-model="updateForm.startTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="请选择"
              style="width: 80%;"
              :pickerOptions="pickerOptions"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划结束时间" prop="endTime" :disabled="disabled">
            <el-date-picker
              id="endTime"
              :disabled="disabled"
              v-model="updateForm.endTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="请选择"
              style="width: 80%;"
              :pickerOptions="pickerOptions"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              :disabled="disabled"
              v-model="updateForm.remark"
              placeholder="请输入备注"
              plain="true"
            />
          </el-form-item>
        </el-col>
        <el-col :span="2" :offset="2" style="padding-top: 25px">
          <el-button v-if="!disabled" type="primary" @click="save()">保存</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-divider content-position="center">保养设备</el-divider>
    <el-table
      stripe
      border
      highlight-current-row
      @row-click="getTableData"
      :data="devTableData"
      style="width: 100%"
    >
      <el-table-column prop="devNo" label="设备编码"></el-table-column>
      <el-table-column prop="devName" label="设备名称"></el-table-column>
      <el-table-column prop="count" label="保养项目数"></el-table-column>
    </el-table>
    <el-divider content-position="center">设备保养项目</el-divider>
    <el-table stripe border highlight-current-row :data="tableData" style="width: 100%">
      <el-table-column prop="itemInfoNo" label="保养项信息编码"></el-table-column>
      <el-table-column prop="partsName" label="保养部位"></el-table-column>
      <el-table-column prop="projectName" label="保养项目"></el-table-column>
      <el-table-column prop="methodName" label="保养方法"></el-table-column>
      <el-table-column prop="criteriaName" label="保养标准"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import {
  getCheckingPlanById,
  getCheckingPlanSelectMap,
  getCheckingTempMap,
  getCheckingTempItems,
  updateCheckingPlan,
  getCheckingUserMap,
  getTempGroupByDev
} from "@/api/dev/devMaintain";

import { sltCalendar } from "@/api/dev/devCheckingPlan";

export default {
  name: "PlanUD",
  components: {
    Pagination
  },
  data() {
    const validityTimeValidator = (rule, value, callback) => {
      if (!value.toString().match(/^[0-9]*$/)) {
        callback(new Error("请输入大于1的正整数"));
      } else {
        callback();
      }
    };
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      updateForm: {
        validityTime: 1
      },
      cycles: [],
      tempMaps: [],
      userMaps: [],
      timeOptions: [],
      rules: {
        planName: [
          { required: true, message: "请输入计划名称", trigger: "blur" }
        ],
        executor: [
          { required: true, message: "请选择执行人", trigger: "blur" }
        ],
        tempNo: [
          { required: true, message: "请选择计划模版", trigger: "blur" }
        ],
        frequently: [
          { required: true, message: "请输入计划名称", trigger: "blur" }
        ],
        validityTime: [
          { required: true, validator: validityTimeValidator, trigger: "blur" }
        ],
        startTime: [
          { required: true, message: "请选择计划开始时间", trigger: "blur " }
        ],
        endTime: [
          { required: true, message: "请选择计划结束时间", trigger: "blur " }
        ],
        calendarCode: [
          { required: true, message: "请选择日历", trigger: "blur" }
        ]
      },
      tableData: [],
      devTableData: [],
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      pageSizes: [5, 10, 50, 100],
      queryForm: {},
      selDevNo: null,
      options: []
    };
  },
  props: {
    disabled: {
      type: Boolean,
      required: true
    },
    planId: {
      type: String,
      required: true
    }
  },
  watch: {
    planId() {
      this.getData();
      this.init();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getData();
      this.init();
    });
  },
  methods: {
    init() {
      getCheckingPlanSelectMap()
        .then(response => {
          const result = response.data;
          if (result.success) {
            this.cycles = result.data.cycles;
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
      getCheckingTempMap()
        .then(response => {
          const result = response.data;
          if (result.success) {
            this.tempMaps = result.data;
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
      getCheckingUserMap()
        .then(response => {
          const result = response.data;

          if (result.success) {
            this.userMaps = result.data;
            this.code = this.userMaps.code;
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    getData(pageNum) {
      if (pageNum === 1) {
        this.page.pageNum = 1;
      }
      getCheckingPlanById(this.planId)
        .then(response => {
          const result = response.data;
          if (result.success) {
            this.updateForm = result.data;
            this.updateForm.frequently = this.updateForm.frequently.split(",")
            this.getDevData();
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
      sltCalendar().then(response => {
        const result = response.data;
        if (result.success) {
          this.options = result.data;
        } else {
          this.$message.error(result.message);
        }
      });
    },
    // 获取中间设备信息
    getDevData() {
      const params = {
        tempNo: this.updateForm.tempNo
      };
      getTempGroupByDev(params).then(response => {
        const result = response.data;
        if (result.success) {
          this.devTableData = result.data;
        } else {
          this.$message.error(result.message);
        }
      });
    },
    getTableData(row) {
      if (row) {
        this.selDevNo = row.devNo;
      }
      const params = {
        tempNo: this.updateForm.tempNo,
        devNo: this.selDevNo
      };
      getCheckingTempItems(params)
        .then(response => {
          if (response.data.data) {
            this.tableData = response.data.data;
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    save() {
      this.$refs["updateForm"].validate(valid => {
        if (valid) {
          if (this.updateForm.startTime >= this.updateForm.endTime) {
            this.$message.error("结束时间必须大于开始时间！");
            return;
          }
          const frequently = this.updateForm.frequently.join(",")
          const record = {
            ...this.updateForm,
            frequently
          }
          updateCheckingPlan(record)
            .then(response => {
              const result = response.data;
              if (result.success) {
                this.$message.success("保存成功");
              } else {
                this.$message.error(result.message);
              }
            })
            .catch(e => {
              this.$message.error(e.message);
            })
            .finally(() => {
              this.cancel();
            });
        } else {
          this.$message.error("保存失败，请检查必填项是否都正确填写");
          return false;
        }
      });
    },
    handleChange(id) {
      const data = this.tempMaps.find(item => {
        return item.value === id;
      });
      this.updateForm = Object.assign(this.updateForm, {
        tempName: data.label
      });
      this.getDevData();
    },
    cancel() {
      this.$emit("hidenDialog");
    }
  }
};
</script>
