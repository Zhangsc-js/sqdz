<template>
  <el-container class="devHmi" style="height: 100%;">
    <edit-table
      :tableData="tableData"
      :opts.sync="tableColumnMain"
      highlight-current-row
      :page="page"
      :total="total"
      :showAddBtn="showAddBtn"
      @getData="getData"
      @savaData="save"
      style="width: 100%;"
      height="95%"
      @deleteRow="deleteHmi"
      pageName="SYS-DEVTREE-ZT"
    ></edit-table>
  </el-container>
</template>
<script>
import EditTable from "@/components/EditTable";

import { saveHmi, queryHmi, delHmi } from "@/api/sys/dev";

export default {
  components: {
    EditTable
  },
  data() {
    return {
      tableColumnMain: [
        {
          type: "input",
          label: "组态名称",
          prop: "hmiName",
          width: 200
        },
        {
          type: "input",
          label: "组态url",
          prop: "hmiUrl"
        }
      ],
      showAddBtn: true,
      page: {
        pageNum: 1,
        pageSize: 10
      },
      tableData: [],
      total: 0,
      selectMainInfo: {},
      tableDataPart: [],
      currActiveName: "devImg"
    };
  },
  props: {
    activeName: {
      type: String,
      required: false,
      default: ""
    }
  },
  watch: {
    getDevCode() {
      if (this.activeName == this.currActiveName) {
        this.getData();
      }
    },
    activeName() {
      if (this.activeName == this.currActiveName) {
        this.getData();
      }
    }
  },
  computed: {
    getDevCode() {
      return this.$store.state.sysDev.selectNodeNO;
    },
    isPDF() {
      if (this.queryForm.fileName.split(".") === "pdf") {
        return true;
      } else {
        return false;
      }
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      let params = { devCode: this.getDevCode };
      queryHmi(params)
        .then(response => {
          if (response.data.success) {
            this.tableData = response.data.data;
            this.total = response.data.data.length;
          } else {
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    save(data) {
      data.devCode = this.getDevCode;
      saveHmi(data)
        .then(response => {
          if (response.data.success) {
            this.$message.success("保存成功");
            this.getData();
          } else {
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    deleteHmi(id) {
      delHmi(id)
        .then(response => {
          if (response.data.success) {
            this.$message.success("删除成功");
            this.getData();
          } else {
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
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
.row-padding {
  padding-top: 10px;
  margin: 5px;
}
.card {
  height: 50%;
}
.el-card__body {
  padding: 10px !important;
}
.pdt {
  padding-top: 20px;
}
</style>
