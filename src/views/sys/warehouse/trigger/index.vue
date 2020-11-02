<template>
  <!-- 定时触发源管理 -->
  <div class="trigger">
    <!-- 查询表单 -->
    <el-form :inline="true" :model="queryForm" class="demo-form-inline" style="margin-left:20px">
      <el-form-item label="触发源名称：">
        <el-input v-model="queryForm.triggerName" placeholder></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getData">查询</el-button>
      </el-form-item>
    </el-form>
    <edit-table
      :tableData="tableData"
      :opts="opts"
      @savaData="save"
      @deleteRow="deleteRow"
      showAddBtn
      showDelBtn
      height="80vh"
      :page="page"
      :total="total"
      :pageSizes="pageSizes"
      :pageChangeAction="pageChange"
      @getData="getData"
      @setAdd="setAdd"
      @setEdit="setEdit"
      pageName="SYS-TRIGGER"
    ></edit-table>
  </div>
</template>

<script>
import {
  getTriggerAll,
  dltTriggerResular,
  saveriggerResular
} from "@/api/sys/trigger";
import EditTable from "@/components/EditTable/index";

export default {
  components: {
    EditTable
  },
  data() {
    return {
      page: {
        pageNum: 1,
        pageSize: 10
      },
      pageSizes: [10, 50, 100],
      total: 0,
      queryForm: {
        triggerName: ""
      },
      opts: [
        {
          type: "input",
          label: "触发源编码",
          prop: "triggerCode",
          rule: true,
          NoEdit: true
        },
        {
          type: "input",
          label: "触发源名称",
          prop: "triggerName",
          rule: true
        },
        {
          type: "input",
          label: "触发源参数",
          prop: "triggerCron",
          rule: true
        }
      ],
      tableData: [],
      pageChange: null
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      const params = {
        ...this.page,
        ...this.queryForm
      };
      getTriggerAll(params).then(response => {
        let data = response.data;
        if (data.success) {
          this.tableData = data.data.list;
          this.total = data.data.total;
        }
      });
    },
    deleteRow(id) {
      dltTriggerResular(id).then(response => {
        if (response.data.success) {
          this.$message.success("删除成功!");
          this.getData();
        } else
          this.$message.error(response.data.message + ":" + response.data.data);
      });
    },
    save(row) {
      saveriggerResular(row).then(response => {
        let data = response.data;
        if (data.success) {
          this.$message.success("保存成功");
          this.getData();
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
    },
    setAdd() {
      this.opts.forEach(item => {
        if (item.NoEdit) {
          item.NoEdit = false;
        }
      });
    },
    setEdit() {
      this.opts = [
        {
          type: "input",
          label: "触发源编码",
          prop: "triggerCode",
          rule: true,
          NoEdit: true
        },
        {
          type: "input",
          label: "触发源名称",
          prop: "triggerName",
          rule: true
        },
        {
          type: "input",
          label: "触发源参数",
          prop: "triggerCron",
          rule: true
        }
      ];
    }
  }
};
</script>

<style>
</style>
