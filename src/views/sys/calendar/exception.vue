<template>
  <!-- 例外设定 -->
  <div class="exception" style="height:100%">
    <!-- 查询表单 -->
    <el-form :inline="true" :model="queryForm" class="demo-form-inline">
      <el-form-item label="日期">
        <!-- <el-input v-model="queryForm.user" placeholder="审批人"></el-input> -->
        <el-date-picker
          type="date"
          v-model="queryForm.startDate"
          placeholder="选择开始日期"
          value-format="yyyy-MM-dd"
          clearable
        />
        <span>~</span>
        <el-date-picker
          type="date"
          v-model="queryForm.endDate"
          placeholder="选择结束日期"
          value-format="yyyy-MM-dd"
          clearable
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryForm.exceptType" placeholder="请选择" clearable>
          <el-option label="班" value="1"></el-option>
          <el-option label="休" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getData">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <edit-table
      :tableData="tableData"
      :opts.sync="tableColumnMain"
      showSelectBtn
      highlight-current-row
      :page="page"
      :total="total"
      @getData="getData"
      @savaData="savaData"
      style="width: 99%;"
      height="calc(100% - 160px)"
      pageName="SYS-DICT"
      @delRows="delRows"
      @deleteRow="deleteRow"
      :showDelRows="true"
      :selectionChange="sltChange"
    >
      <template v-slot:query>
        <el-button
          :disabled="disabled"
          class="edit-table-class btn-add"
          type="primary"
          @click="exceptSync"
        >例外日同步</el-button>
      </template>
    </edit-table>
  </div>
</template>


<script>
import EditTable from "@/components/EditTable";
import {
  getExceptByCalendarCode,
  saveExcept,
  deleteExcept,
  batchDeleteExcept
} from "@/api/sys";
import { createNamespacedHelpers } from "vuex";
const { mapMutations } = createNamespacedHelpers("sysDev");

export default {
  components: {
    EditTable
  },
  props: {
    calendarCode: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      queryForm: {
        startDate: "",
        endDate: "",
        exceptType: ""
      },
      tableData: [],
      tableColumnMain: [
        {
          type: "date",
          label: "例外日期",
          prop: "exceptDay",
          format: "yyyy-MM-dd"
        },
        {
          type: "select",
          label: "例外类型",
          prop: "exceptType",
          options: [
            { value: "0", label: "休" },
            { value: "1", label: "班" }
          ]
        },
        {
          type: "input",
          label: "备注",
          prop: "remarks"
        }
      ],
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      dialogVisible: false,
      disabled: true,
      exceptIds: []
    };
  },
  watch: {
    calendarCode() {
      this.getData();
    }
  },
  methods: {
    ...mapMutations(["SET_EXCEPTIDS"]),
    getData() {
      this.queryForm.calendarCode = this.calendarCode;
      const params = {
        ...this.queryForm,
        ...this.page
      };
      if (!params.startDate) {
        params.startDate = "";
      }
      if (!params.endDate) {
        params.endDate = "";
      }
      getExceptByCalendarCode(params).then(response => {
        let data = response.data;
        if (data.success) {
          this.tableData = data.data.result;
          this.total = data.data.total;
        } else {
          this.$message.error(data.message + ":" + data.data);
        }
      });
    },
    sltChange(val) {
      this.exceptIds = [];
      for (let i = 0; i < val.length; i++) {
        this.exceptIds.push(val[i].id);
      }
      this.SET_EXCEPTIDS(this.exceptIds);
      if (this.exceptIds.length > 0) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
      console.log(this.exceptIds);
    },
    savaData(row) {
      row.calendarCode = this.calendarCode;
      saveExcept(row).then(response => {
        let data = response.data;
        if (data.success) {
          this.$message.success("保存成功！！");
          this.getData();
        } else {
          this.$message.error(data.message + ":" + data.data);
        }
      });
    },
    // 批量删除
    delRows(val) {
      let ids = [];
      for (let i = 0; i < val.length; i++) {
        ids.push(val[i].id);
      }
      batchDeleteExcept(ids).then(response => {
        let data = response.data;
        if (data.success) {
          this.$message.success("删除成功！！");
          this.getData();
        } else {
          this.$message.error(data.message + ":" + data.data);
        }
      });
    },
    // 删除一行
    deleteRow(id) {
      deleteExcept(id).then(response => {
        let data = response.data;
        if (data.success) {
          this.$message.success("删除成功！！");
          this.getData();
        } else {
          this.$message.error(data.message + ":" + data.data);
        }
      });
    },
    // 操作列同步
    exceptSync() {
      this.$emit("sync");
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style>
</style>
