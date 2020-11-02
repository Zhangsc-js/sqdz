<template>
  <div>
    <el-form :model="addForm" ref="addForm" label-width="120px" :rules="rules">
      <el-divider content-position="center">基础信息</el-divider>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="计划名称" prop="planName">
            <el-input v-model="addForm.planName" style="width: 80%;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="执行人" prop="executor">
            <el-select v-model="addForm.executor" style="width: 80%;">
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
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="模板名称" prop="tempNo">
            <el-select v-model="addForm.tempNo" @change="handleChange" style="width: 80%;">
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
            <el-select v-model="addForm.frequently" multiple placeholder="请选择" style="width: 80%;">
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
            <el-input-number v-model="addForm.validityTime" controls-position="right" :min="1"></el-input-number>
            <span>小时</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="日历" prop="calendarCode">
            <el-select v-model="addForm.calendarCode" placeholder="请选择">
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
            <el-radio v-model="addForm.isRealtimeData" :label="1">是</el-radio>
            <el-radio v-model="addForm.isRealtimeData" :label="0">否</el-radio>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
              <el-form-item label="现场照片" prop="isPhoto">
                  <el-radio v-model="addForm.isPhoto" :label=1>是</el-radio>
                  <el-radio v-model="addForm.isPhoto" :label=0>否</el-radio>
              </el-form-item>
        </el-col>-->
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="计划开始时间" prop="startTime">
            <el-date-picker
              id="startTime"
              v-model="addForm.startTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="请选择"
              style="width: 80%;"
              :pickerOptions="pickerOptions"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划结束时间" prop="endTime">
            <el-date-picker
              id="endTime"
              v-model="addForm.endTime"
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
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="addForm.remark" placeholder="请输入备注" plain="true" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="save()">保存</el-button>
    </div>
  </div>
</template>

<script>
import {
  addLubricationPlan,
  getCheckingPlanSelectMap,
  getLubricationTempMap,
  getLubricationUserMap
} from "@/api/device";

import { sltCalendar } from "@/api/dev/devCheckingPlan";

export default {
  name: "PlanAdd",
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
      addForm: {
        planName: "",
        executor: "",
        frequently: "",
        isSequential: null,
        isRealtimeData: null,
        isPhoto: null,
        endTime: null,
        startTime: null,
        tempNo: null,
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
          { required: true, message: "请输选择计划周期", trigger: "blur" }
        ],
        validityTime: [
          { required: true, validator: validityTimeValidator, trigger: "blur" }
        ],
        startTime: [
          { required: true, message: "请选择计划开始时间", trigger: "blur" }
        ],
        endTime: [
          { required: true, message: "请选择计划结束时间", trigger: "blur" }
        ],
        calendarCode: [
          { required: true, message: "请选择日历", trigger: "blur" }
        ]
      },
      code: "",
      options: []
    };
  },
  props: {
    isRefresh: {
      type: Boolean,
      required: true
    }
  },
  watch: {
    isRefresh() {
      this.init();
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      //周期  暂用点检
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
      //模板 下拉数据
      getLubricationTempMap()
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

      //暂用点检
      getLubricationUserMap()
        .then(response => {
          const result = response.data;

          if (result.success) {
            this.userMaps = result.data.LUBRICATION_PERSON;
            this.code = this.userMaps.code;
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
    save() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          if (this.addForm.startTime >= this.addForm.endTime) {
            this.$message.error("结束时间必须大于开始时间！");
            return;
          }
          const frequently = String(this.addForm.frequently);
          const parms = {
            ...this.addForm,
            ...this.code,
            frequently
          };
          addLubricationPlan(parms)
            .then(response => {
              const result = response.data;
              if (result.success) {
                this.$message.success("保存成功");
                this.$refs["addForm"].resetFields();
              } else {
                this.$message.error(result.message);
              }
            })
            .catch(e => {
              this.$message.error(e.message);
            })
            .finally(() => {
              this.$emit("hidenDialog");
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
      this.addForm.tempName = data.label;
    },
    cancel() {
      this.$emit("hidenDialog");
    }
  }
};
</script>
