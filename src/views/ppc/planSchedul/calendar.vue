<template>
  <div>
    <div class="calendar">
      <el-divider content-position="left">基本设定</el-divider>
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
        <el-row>
          <el-col :span="6">
            <el-form-item label="星期一">
              <el-select v-model="queryForm.isMondayWork" filterable placeholder="请选择">
                <el-option v-for="item in work" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="星期二">
              <el-select v-model="queryForm.isTuesdayWork" filterable placeholder="请选择">
                <el-option v-for="item in work" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="星期三">
              <el-select v-model="queryForm.isWednesdayWork" filterable placeholder="请选择">
                <el-option v-for="item in work" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="星期四">
              <el-select v-model="queryForm.isThursdayWork" filterable placeholder="请选择">
                <el-option v-for="item in work" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="星期五">
              <el-select v-model="queryForm.isFridayWork" filterable placeholder="请选择">
                <el-option v-for="item in work" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="星期六">
              <el-select v-model="queryForm.isSaturdayWork" filterable placeholder="请选择">
                <el-option v-for="item in work" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="星期七">
              <el-select v-model="queryForm.isSundayWork" filterable placeholder="请选择">
                <el-option v-for="item in work" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-button type="primary" icon="el-icon-check" @click="saveCalendar">保存</el-button>
    </div>
    <el-divider content-position="left">例外设定</el-divider>
    <edit-table
      :tableData="tableData"
      height="300px"
      :opts.sync="tableColumn"
      highlight-current-row
      @getData="getData"
      @savaData="saveExcep"
      @deleteRow="dltExcep"
      :page="page"
      :total="total"
      :pageSizes="pageSizes"
    ></edit-table>
  </div>
</template>

<script>
import EditTable from "@/components/EditTable";
import {
  saveCalendar,
  queryCalendar,
  saveExcep,
  dltExcep
} from "@/api/productionPlanning";

export default {
  name: "uptScheduInfo",
  components: {
    EditTable
  },
  data() {
    return {
      page: {
        pageNum: 1,
        pageSize: 3
      },
      pageSizes: [3, 10, 50, 100],
      total: 0,
      tableColumn: [
        {
          type: "date",
          label: "例外日期",
          prop: "exceptDay",
          format: "yyyy-MM-dd"
        },
        {
          type: "select",
          label: "上班/休班",
          prop: "exceptType",
          options: [
            {
              value: "0",
              label: "休班"
            },
            {
              value: "1",
              label: "上班"
            }
          ]
        },
        {
          type: "input",
          label: "备注",
          prop: "remarks"
        }
      ],
      queryForm: {
        isMondayWork: "1",
        isTuesdayWork: "1",
        isWednesdayWork: "1",
        isThursdayWork: "1",
        isFridayWork: "1",
        isSaturdayWork: "0",
        isSundayWork: "0"
      },
      tableData: [],
      work: [
        {
          id: "0",
          name: "休班"
        },
        {
          id: "1",
          name: "上班"
        }
      ]
    };
  },
  props: {
    planCode: {
      type: String,
      required: true
    }
  },
  watch: {
    planCode() {
      this.getData();
    }
  },
  methods: {
    getData() {
      const params = {
        ...this.page,
        planCode: this.planCode
      };
      queryCalendar(params).then(response => {
        let data = response.data;
        if (data.success) {
          this.queryForm = data.data.plan;
          this.tableData = data.data.list;
          this.total = data.data.total;
        }
      });
    },
    saveCalendar() {
      saveCalendar(this.planCode, this.queryForm).then(response => {
        let data = response.data;
        if (data.success) {
          this.$message.success("新增成功！！");
          this.$emit("save");
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
    },
    cancel() {
      this.$emit("cancel");
    },
    saveExcep(row, done) {
      done();
      saveExcep(row, this.planCode).then(response => {
        let data = response.data;
        if (data.success) {
          this.$message.success("新增成功！！");
          this.getData();
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
    },
    dltExcep(id) {
      dltExcep(id).then(response => {
        let data = response.data;
        if (data.success) {
          this.$message.success("删除成功！");
          this.getData();
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
<style>
.calendar .el-dialog__body {
  padding: 10px 20px 60px 20px;
}
</style>
