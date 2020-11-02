<template>
  <!-- 日历管理 -->
  <div class="calendar" style="height:100%">
    <!-- 查询行 -->
    <el-row style="padding:10px">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="日历名称">
          <el-input v-model="queryForm.calendarName" placeholder></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getData">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <!-- 表格主体 -->
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
      height="calc(100% - 100px)"
      :showOptBtn="true"
      :showDelBtn="false"
      pageName="SYS-DICT"
      optWidth="300"
      @delRows="delRows"
      :showDelRows="true"
    >
      <template v-slot:customizeOpt="{scope}">
        <el-button type="text" size="small" @click="exception(scope.row)">例外日</el-button>
        <el-button type="text" size="small" @click="copy(scope.row)">复制</el-button>
      </template>
    </edit-table>
    <!-- 例外日 对话框 -->
    <el-dialog fullscreen append-to-body title="例外日设定" :visible.sync="dialogVisible" width="70%">
      <exception :calendarCode="calendarCode" @sync="sync"></exception>
    </el-dialog>
    <!-- 例外日同步 对话框 -->
    <el-dialog fullscreen append-to-body title="例外日同步" :visible.sync="syncDialog" width="50%">
      <except-sync :calendarCode="calendarCode" @close="close"></except-sync>
    </el-dialog>
    <!-- 复制对话框 -->
    <el-dialog title="复制" append-to-body  class="copyDialog" :visible.sync="copyDialog" width="30%">
      <el-form ref="copyForm" :model="copyForm" label-width="80px">
        <el-form-item label="日历编码">
          <el-input v-model="copyForm.calendarCode"></el-input>
        </el-form-item>
        <el-form-item label="日历名称">
          <el-input v-model="copyForm.calendarName"></el-input>
        </el-form-item>
        <el-form-item style="text-align:center">
          <el-button type="primary" icon="el-icon-check" @click="copyCalendar">保存</el-button>
          <el-button type="danger" icon="el-icon-close" @click="copyDialog=!copyDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import exception from "./exception";
import exceptSync from "./except-sync";
import EditTable from "@/components/EditTable";
import {
  queryAll,
  saveCalendar,
  copyCalendar,
  batchDeleteCalendar
} from "@/api/sys";

export default {
  components: {
    EditTable,
    exception,
    exceptSync
  },
  props: {
    calendar_code: {
      type: String,
      default: "",
      required: false
    }
  },
  data() {
    return {
      queryForm: {
        calendarName: "",
        calendarCode:''
      },
      calendarCode: "",
      calendarName: "",
      calendarId: "",
      tableColumnMain: [
        {
          type: "input",
          label: "日历编码",
          prop: "calendarCode",
          NoEdit: true
        },
        {
          type: "input",
          prop: "calendarName",
          label: "日历名称",
          NoEdit: true
        },
        {
          type: "select",
          prop: "mondayWork",
          label: "礼拜一",
          options: [
            { label: "班", value: "1" },
            { label: "休", value: "0" }
          ]
        },
        {
          type: "select",
          prop: "tuesdayWork",
          label: "礼拜二",
          options: [
            { label: "班", value: "1" },
            { label: "休", value: "0" }
          ]
        },
        {
          type: "select",
          prop: "wednesdayWork",
          label: "礼拜三",
          options: [
            { label: "班", value: "1" },
            { label: "休", value: "0" }
          ]
        },
        {
          type: "select",
          prop: "thursdayWork",
          label: "礼拜四",
          options: [
            { label: "班", value: "1" },
            { label: "休", value: "0" }
          ]
        },
        {
          type: "select",
          prop: "fridayWork",
          label: "礼拜五",
          options: [
            { label: "班", value: "1" },
            { label: "休", value: "0" }
          ]
        },
        {
          type: "select",
          prop: "saturdayWork",
          label: "礼拜六",
          options: [
            { label: "班", value: "1" },
            { label: "休", value: "0" }
          ]
        },
        {
          type: "select",
          prop: "sundayWork",
          label: "礼拜日",
          options: [
            { label: "班", value: "1" },
            { label: "休", value: "0" }
          ]
        }
      ],
      tableData: [],
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      selects: [],
      dialogVisible: false,
      syncDialog: false,
      copyDialog: false,
      copyForm: {
        calendarCode: "",
        calendarName: ""
      }
    };
  },
  mounted() {
    if (this.calendar_code) {
      this.queryForm.calendarCode = this.calendar_code;
    }
    this.getData();
  },
  activated() {
    if (this.calendar_code) {
      this.queryForm.calendarCode = this.calendar_code;
    }
    this.getData();
  },
  methods: {
    getData() {
      const params = {
        calendarName: this.queryForm.calendarName,
        calendarCode: this.queryForm.calendarCode,
          NotCalendarCode: "",
        ...this.page
      };
      queryAll(params).then(response => {
        let data = response.data;
        if (data.success) {
          this.tableData = data.data.result;
          this.total = data.data.total;
        } else {
          this.$message.error(data.message + ":" + data.data);
        }
      });
    },
    savaData(row) {
      saveCalendar(row).then(response => {
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
      batchDeleteCalendar(ids).then(response => {
        let data = response.data;
        if (data.success) {
          this.$message.success("删除成功！！");
          this.getData();
        } else {
          this.$message.error(data.message + ":" + data.data);
        }
      });
    },
    // 点击例外日
    exception(row) {
      this.calendarCode = row.calendarCode;
      this.calendarName = row.calendarName;
      this.dialogVisible = true;
    },
    sync() {
      this.syncDialog = true;
    },
    close() {
      this.syncDialog = false;
    },
    copy(row) {
      this.calendarId = row.id;
      this.copyDialog = true;
    },
    copyCalendar() {
      copyCalendar(this.calendarId, this.copyForm).then(response => {
        let data = response.data;
        if (data.success) {
          this.$message.success("复制成功！！");
          this.copyDialog = false;
          this.getData();
        } else {
          this.$message.error(data.message + ":" + data.data);
        }
      });
    }
  },
  watch: {
    calendar_code(val) {
      this.queryForm.calendarCode = val;
    }
  }
};
</script>

<style>
.calendar .el-dialog {
  height: 100%;
}

.calendar .copyDialog .el-dialog {
  height: auto;
}
</style>
