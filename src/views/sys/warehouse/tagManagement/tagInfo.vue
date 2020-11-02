<template>
  <div class="tagInfo" style="height:100%;overflow:hidden">
    <!-- 查询表单 -->
    <el-form :inline="true" :model="queryForm" class="demo-form-inline">
      <el-form-item label="触发源编码">
        <el-input v-model="queryForm.triggerCode" placeholder></el-input>
      </el-form-item>
      <el-form-item label="tag点位">
        <el-input v-model="queryForm.tagCode" placeholder></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getData">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格主体 -->
    <EditTable
      :tableData="tableData"
      :page="page"
      :total="total"
      :pageSizes="pageSizes"
      :opts="opts"
      @getData="getData"
      @savaData="save"
      @deleteRow="deleteRow"
      @jc-row-click="rowClick"
      pageName="SYS-TAGMNG"
      height="calc(100% - 90px)"
    ></EditTable>
  </div>
</template>

<script>
import EditTable from "@/components/EditTable";
import {
  getTriggerTag,
  saveTriggerTag,
  dltTriggerTag
} from "@/api/sys/trigger";

export default {
  components: {
    EditTable
  },
  data() {
    return {
      queryForm: {
        triggerCode: "",
        tagCode: ""
      },
      page: {
        pageNum: 1,
        pageSize: 5
      },
      pageSizes: [5, 50, 100],
      total: 0,
      opts: [
        {
          type: "input",
          prop: "triggerCode",
          label: "触发源编码",
          NoEdit: true
        },
        {
          type: "input",
          prop: "tagCode",
          label: "tag点位"
        },
        {
          type: "input",
          prop: "tagDesc",
          label: "tag点位描述"
        },
        {
          type: "select",
          prop: "triggerType",
          options: [
            { value: "1", label: "高限" },
            { value: "2", label: "低限" },
            { value: "3", label: "超限" },
            { value: "4", label: "偏差" },
            { value: "5", label: "打开" },
            { value: "6", label: "关闭" },
            { value: "7", label: "变位" }
          ],
          label: "触发条件"
        },
        {
          type: "input",
          prop: "highMax",
          label: "高限",
          number: true
        },
        {
          type: "input",
          prop: "lowMin",
          label: "低限",
          number: true
        },
        {
          type: "input",
          prop: "middleFit",
          label: "tag点中值",
          number: true
        },
        {
          type: "input",
          prop: "middleOffset",
          label: "偏差限",
          number: true
        }
      ],
      tableData: []
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
      getTriggerTag(params).then(response => {
        let data = response.data;
        if (data.success) {
          this.tableData = data.data.list;
          this.total = data.data.total;
        }
      });
    },
    save(row) {
      saveTriggerTag(row).then(response => {
        let data = response.data;
        if (data.success) {
          this.$message.success("保存成功");
          this.getData();
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
    },
    deleteRow(id) {
      dltTriggerTag(id).then(response => {
        if (response.data.success) {
          this.$message.success("删除成功!");
          this.getData();
          this.$emit("del");
        } else
          this.$message.error(response.data.message + ":" + response.data.data);
      });
    },
    rowClick(row) {
      this.$emit("rowClick", row);
    }
  }
};
</script>

<style>
</style>
