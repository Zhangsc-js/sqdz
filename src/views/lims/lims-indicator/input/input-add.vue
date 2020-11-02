<template>
  <div>
    <el-form :model="addInput" ref="addInput" :rules="addRules" label-width="100px">
      <el-col :span="22">
        <el-form-item label="指标名称" prop="inputName">
          <el-input :maxlength="30" v-model="addInput.inputName" />
        </el-form-item>
      </el-col>
      <el-col :span="22">
        <el-form-item label="指标编号" prop="inputCode">
          <el-input :maxlength="15" v-model="addInput.inputCode" auto-complete="off" />
        </el-form-item>
      </el-col>
      <el-col :span="22">
        <el-form-item label="初始值" prop="inputInitial">
          <el-input v-model="addInput.inputInitial" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="计量单位" prop="inputUnit">
          <el-select
            v-model="addInput.inputUnit"
            filterable
            @change="selectUnitChange"
            placeholder="请选择计量单位"
          >
            <el-option
              v-for="item in unitType"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
        <el-col :span="12">
            <el-form-item label="可使用状态" prop="inputStatus">
                <el-select v-model="addInput.inputStatus" placeholder="请选择指标状态">
                    <el-option
                        v-for="item in statType"
                        :key="item.statId"
                        :label="item.stat"
                        :value="item.stat"
                    ></el-option>
                </el-select>
            </el-form-item>
        </el-col>
      <el-col :span="22">
        <el-form-item label="备注" prop="inputRemark">
          <el-input
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 3}"
            maxlength="123"
            v-model="addInput.inputRemark"
            placeholder="(123字以内)"
          />
        </el-form-item>
      </el-col>
    </el-form>
    <div slot="footer" class="dialog-footer" style="clear:both">
      <el-button @click="cancel()">取 消</el-button>
      <el-button type="primary" @click="save()">保存</el-button>
    </div>
  </div>
</template>

<script>
import {
  addInIndicator,
  getMeasureUnit,
  validNum,
  validCode,
  validIndicator,
  existInputCode
} from "@/api/lims";
import { simpleDateFormat } from "@/utils/index";
export default {
  name: "InputAdd",
  data() {
    let ifExist = (rule, value, callback) => {
        let param = {code:value};
        existInputCode(param).then(res => {
            if (res.data.data) {
                callback(new Error("编号已存在，请输入新的编号"));
            } else {
                callback();
            }
        });
    };
    return {
      addInput: {
        inputName: "", //指标名称
        inputCode: "", //指标编号
        inputInitial: "0.0", //初始值
        inputUnit: "", //计量单位
        inputRemark: "", //备注
        inputStatus: "有效", //可使用状态
      },
      statType: [
        {
          statId: "1",
          stat: "有效"
        },
        {
          statId: "2",
          stat: "无效"
        }
      ],
      unitType: [],
      addRules: {
        inputCode: [
          {
            required: true,
            message: "请输入指标编号",
            trigger: ["blur", "change"]
          },
          { validator: validCode, trigger: ["blur", "change"] },
          { validator: ifExist, trigger: "change" }
        ],
        inputName: [
          {
            required: true,
            message: "请输入指标名称",
            trigger: ["blur", "change"]
          },
          //{min: 2, message: '请输入不少于2个字符', trigger: 'blur' },
          { validator: validIndicator, trigger: ["blur", "change"] }
        ],
        inputInitial: [
          {
            required: true,
            message: "请输入指标初始值",
            trigger: ["blur", "change"]
          },
          { validator: validNum, trigger: ["blur", "change"] }
        ],
        inputUnit: [
          {
            required: true,
            message: "请选择计量单位",
            trigger: ["blur", "change"]
          }
        ],
        inputStatus: [
          {
            required: true,
            message: "请选择指标可使用状态",
            trigger: ["blur", "change"]
          }
        ]
      }
    };
  },
  mounted() {
    this.getUnitList();
  },
  methods: {
    save() {
      this.$refs["addInput"].validate(valid => {
        if (!valid) {
          this.$message({
            type: "error",
            message: "请正确键入再提交"
          });
        } else {
          addInIndicator(this.addInput)
            .then(response => {
              const result = response.data;
              if (result.success) {
                this.$message({
                  type: "success",
                  message: "新增成功"
                });
                this.$refs["addInput"].resetFields();
              } else {
                this.$message({
                  type: "error",
                  message: result.message
                });
              }
            })
            .catch(e => {
              this.$message({
                type: "error",
                message: e.message
              });
            })
            .finally(() => {
              this.$emit("hidenDialog");
            });
        }
      });
    },
    cancel() {
      this.$emit("hidenDialog");
    },
    selectUnitChange(val) {},
    getUnitList() {
      getMeasureUnit()
        .then(res => {
          const result = res.data;
          if (result.success && result.data.success) {
            this.unitType = result.data.data;
          } else {
            this.$message.error(result.message);
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
</style>
