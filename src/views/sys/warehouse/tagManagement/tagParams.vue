<template>
  <!-- 参数 -->
  <div class="tagParams">
    <EditTable
      :tableData="tableData"
      :opts="opts"
      @getData="getData"
      @savaData="savaData"
      @deleteRow="deleteRow"
      pageName="SYS-TAGPAM"
    ></EditTable>
  </div>
</template>

<script>
import EditTable from "@/components/EditTable";
import {
  queryByTaggerCode,
  saveTagParam,
  dltTagParam
} from "@/api/sys/trigger";
export default {
  components: {
    EditTable
  },
  props: {
    triggerCode: {
      type: String,
      required: false
    },
    count: {
      type: Number,
      required: false
    }
  },
  data() {
    return {
      opts: [
        {
          type: "select",
          prop: "paramType",
          options: [
            { value: "1", label: "常量" },
            { value: "2", label: "点位编码" }
          ],
          label: "参数类型"
        },
        {
          type: "input",
          prop: "paramKey",
          label: "参数名称"
        },
        {
          type: "input",
          prop: "paramDesc",
          label: "参数描述"
        },
        {
          type: "input",
          prop: "paramValue",
          label: "参数变量"
        }
      ],
      tableData: []
    };
  },
  methods: {
    getData() {
      queryByTaggerCode(this.triggerCode).then(response => {
        let data = response.data;
        if (data.success) {
          this.tableData = data.data;
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
    },
    savaData(row) {
      row.triggerCode = this.triggerCode;
      saveTagParam(row).then(response => {
        let data = response.data;
        if (data.success) {
          this.$message.success("新增成功");
          this.getData();
        } else {
          this.$message.error(data.message + ":" + data.data);
        }
      });
    },
    deleteRow(id) {
      dltTagParam(id).then(response => {
        let data = response.data;
        if (data.success) {
          this.$message.success("删除成功!");
          this.getData();
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
    }
  },
  watch: {
    triggerCode() {
      if (this.triggerCode) this.getData();
    },
    count() {
      this.getData();
    }
  },
  mounted() {
    this.getData();
  }
};
</script>

<style>
.tagParams .el-table__body-wrapper {
  min-height: 150px;
  max-height: 311px;
  height: auto !important;
}
</style>
