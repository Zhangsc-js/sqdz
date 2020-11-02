<template>
  <div style="height: 100%" class="addDaily">
    <el-divider content-position="left">班组排班计划</el-divider>
    <el-form :model="queryForm" :rules="rules" ref="queryForm" label-width="100px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="排班日期：" prop="startDate">
            <el-date-picker
              v-model="queryForm.startDate"
              type="date"
              :picker-options="pickerOptions"
              placeholder="开始日期"
              style="width: 100%"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="~" prop="endDate" label-width="40px">
            <el-date-picker
              v-model="queryForm.endDate"
              type="date"
              :picker-options="pickerOptions"
              placeholder="截止日期"
              style="width: 100%"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="车间:" prop="workshopCode">
            <el-select
              v-model="queryForm.workshopCode"
              collapse-tags
              multiple
              filterable
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in shopMap"
                :key="item.proccode"
                :label="item.name"
                :value="item.proccode"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item>
            <el-button type="primary" icon="el-icon-date" @click="planDaily('queryForm')">排班</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <edit-table
      :tableData="tableData"
      height="500px"
      :showAddBtn="false"
      :showOptBtn="false"
      :opts.sync="tableColumnPlan"
      highlight-current-row
      :firstLoadEdit="true"
      append-to-body
      :pageChangeAction="pageChange"
    ></edit-table>
    <div slot="footer" class="dialog-footer">
      <el-button icon="el-icon-close" @click="cancel()">取 消</el-button>
      <el-button icon="el-icon-check" type="primary" @click="save()">保存</el-button>
    </div>
  </div>
</template>

<script>
import EditTable from "@/components/EditTable";
import {
  queryWorkShop,
  planDaily,
  batchSaveDaily
} from "@/api/productionPlanning";

export default {
  name: "planDaily",
  components: {
    EditTable
  },
  data() {
    return {
      queryForm: {
        startDate: null,
        endDate: null,
        workshopCode: "",
        shops: ""
      },
      tableColumnPlan: [
        {
          label: "日期",
          prop: "schedulDate"
        },
        {
          label: "星期",
          prop: "week"
        },
        {
          label: "班次方案",
          prop: "schedulPlanName"
        },
        {
          label: "车间",
          prop: "workshopName"
        },
        {
          label: "班次",
          prop: "shiftName"
        },
        {
          type: "specialSelect",
          label: "班组",
          prop: "teamCode"
        }
      ],
      tableData: [],
      pageChange: null,
      shopMap: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      rules: {
        workshopCode: [
          {
            type: "array",
            required: true,
            message: "请选择车间",
            trigger: "blur"
          }
        ],
        startDate: [
          {
            type: "string",
            required: true,
            message: "请选择开始日期",
            trigger: "change"
          }
        ],
        endDate: [
          {
            type: "string",
            required: true,
            message: "请选择结束日期",
            trigger: "change"
          }
        ]
      }
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      queryWorkShop().then(response => {
        let data = response.data;
        if (data.success) {
          this.shopMap = response.data.data.WORKSHOP_ALL;
        }
      });
    },
    planDaily(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let ids = "";
          for (let i = 0; i < this.queryForm.workshopCode.length; i++) {
            ids += this.queryForm.workshopCode[i];
            if (i < this.queryForm.workshopCode.length - 1) {
              ids += ",";
            }
          }
          this.queryForm.shops = ids;
          const params = {
            ...this.page,
            ...this.queryForm
          };
          delete params.workshopCode;
          planDaily(params).then(response => {
            let data = response.data;
            if (data.success) {
              this.tableData = data.data;
            } else {
              this.$message.error(
                response.data.message + ":" + response.data.data
              );
            }
          });
        } else {
          return false;
        }
      });
    },
    cancel() {
      this.tableData = [];
      (this.queryForm = {
        startDate: null,
        endDate: null,
        workshopCode: ""
      }),
        this.$emit("cancel");
    },
    save() {
        for(let i = 0; i < this.tableData.length; i++){
            console.log(this.tableData[i].teamCode)
            if(this.tableData[i].teamCode == ''){
                this.$message.error("第" + (i + 1) + "行,班组为空,请选择")
                return;
            }
        }

      batchSaveDaily(this.tableData).then(response => {
        let data = response.data;
        if (data.success) {
          this.$message.success("新增成功！！");
          this.tableData = [];
          this.$emit("save");
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
    }
  }
};
</script>
<style>
.addDaily .el-dialog__body {
  padding: 10px 20px 60px 20px;
}
</style>
