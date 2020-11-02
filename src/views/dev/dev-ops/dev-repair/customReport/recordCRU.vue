<template>
  <div>
    <el-form :model="recordForm" ref="recordForm" label-width="120px" :rules="rules">
      <el-divider content-position="center">基础信息</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备名称" prop="devName">
            <el-input v-model="recordForm.devName" @click.native="devNameRowCliek()"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="紧急等级" prop="emergencyGrade">
            <el-select v-model="recordForm.emergencyGrade" style="width: 100%;">
              <el-option
                v-for="item in egOptions"
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
          <el-form-item label="部位名称" prop="partsName">
            <el-input
              type="text"
              v-model="recordForm.partsName"
              placeholder="请输入部位名称"
              plain="true"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目名称" prop="projectName">
            <el-input
              type="text"
              v-model="recordForm.projectName"
              placeholder="请输入项目名称"
              plain="true"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="现场情况" prop="realtimeData">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              v-model="recordForm.realtimeData"
              placeholder="请输入现场情况"
              plain="true"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="save()">保存</el-button>
    </div>
    <el-dialog title="设备选择" :visible.sync="dialogVisible" width="65%" append-to-body>
      <select-tree
        :requestUrl="requestUrl"
        @saveSelectNode="handleSaveSelectNode"
        style="height: 100%"
      ></select-tree>
    </el-dialog>
  </div>
</template>

<script>
import { hasBtn } from "@/utils";
import SelectTree from "@/components/SelectTree";
import {
  saveDevRepairRecord,
  updateDevRepairRecord
} from "@/api/dev/devRepair";
import { getDevTree } from "@/api/device";

export default {
  name: "RepairRecordCRU",
  components: {
    SelectTree
  },
  data() {
    return {
      recordForm: {
        devName: null,
        devCode: null,
        partsName: null,
        projectName: null,
        emergencyGrade: null,
        realtimeData: null
      },
      rules: {
        devName: [{ required: true, message: "请选择设备", change: "blur" }],
        emergencyGrade: [
          { required: true, message: "请选择紧急等级", trigger: "blur" }
        ]
      },
      dialogVisible: false,
      requestUrl: getDevTree
    };
  },
  props: {
    egOptions: {
      type: Array,
      required: true
    },
    record: {
      type: Object,
      required: false,
      default: () => {}
    }
  },
  watch: {
    record: {
      deep: true,
      handler: function(val, oldVal) {
        this.recordForm = val;
      }
    }
  },
  created() {
    this.recordForm = this.record;
  },
  methods: {
    hasBtn,
    devNameRowCliek() {
      this.dialogVisible = true;
    },
    save() {
      this.$refs["recordForm"].validate(valid => {
        if (valid) {
          if (this.recordForm.id) {
            updateDevRepairRecord(this.recordForm).then(res => {
              const result = res.data;
              if (result.success) {
                this.$message.success("保存成功");
                this.$refs["recordForm"].resetFields();
                this.cancel();
              } else {
                this.$message.error(result.message);
              }
            });
          } else {
            const record = {
              ...this.recordForm,
              // 其它
              reportSource: 9
            };
            saveDevRepairRecord(record).then(res => {
              const result = res.data;
              if (result.success) {
                this.$message.success("保存成功");
                this.$refs["recordForm"].resetFields();
                this.cancel();
              } else {
                this.$message.error(result.message);
              }
            });
          }
        } else {
          this.$message.error("保存失败，请检查必填项是否都正确填写");
          return false;
        }
      });
    },
    handleSaveSelectNode(data) {
      this.dialogVisible = false;
      this.recordForm = Object.assign(
        {},
        this.recordForm,
        { devName: data[0].label },
        { devCode: data[0].code }
      );
    },
    cancel() {
      this.$emit("hidenDialog");
    }
  }
};
</script>

<style>
</style>
