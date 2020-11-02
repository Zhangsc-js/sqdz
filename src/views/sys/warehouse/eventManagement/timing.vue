<template>
  <div class="timing" style="height:100%">
    <!-- 查询表单 -->
    <el-form :inline="true" :model="queryForm" class="demo-form-inline" style="height:10%">
      <el-form-item label="触发源名称">
        <el-input v-model="queryForm.triggerName" placeholder></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      height="70%"
      ref="multipleTable"
      @select="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="triggerCode" label="触发源编码" width="180"></el-table-column>
      <el-table-column prop="triggerName" label="触发源名称" width="180"></el-table-column>
      <el-table-column prop="triggerCron" label="触发参数"></el-table-column>
    </el-table>
    <el-row style="height:15%;padding-top:20px">
      <el-button type="primary" icon="el-icon-check" @click="add">确定</el-button>
      <el-button type="primary" icon="el-icon-circle-close" @click="close">关闭</el-button>
    </el-row>
  </div>
</template>

<script>
import { findTriggerByMainId, addEventMainTrigger } from "@/api/sys";

export default {
  props: {
    mainId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      queryForm: {
        triggerName: ""
      },
      triggerId: "",
      tableData: [],
      select: "" //选择的
    };
  },
  watch: {
    mainId() {
      this.getData();
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      findTriggerByMainId(this.mainId, this.queryForm).then(response => {
        let data = response.data;
        if (data.success) {
          this.tableData = data.data;
          this.$nextTick(() => {
            this.setCheck();
          });
        } else {
          this.$message.error(data.message + ":" + data.data);
        }
      });
    },
    close() {
      this.$emit("close");
    },
    add() {
      addEventMainTrigger(this.mainId, this.triggerId).then(response => {
        let data = response.data;
        if (data.success) {
          this.$message.success("保存成功！！");
          this.$emit("close");
        } else {
          this.$message.error(data.message + ":" + data.data);
        }
      });
    },
    setCheck() {
      //   data.forEach((item, index) => {
      //     if (item.boolean) {
      //     //   this.$refs.multipleTable.toggleRowSelection(
      //     //     this.tableData[index],
      //     //     true
      //     //   );
      //     }
      //   });
      this.select = "";
      this.tableData = this.tableData.filter(item => {
        if (item.boolean) {
          this.select = item;
        }
        return !item.boolean;
      });
      if (this.select) {
        this.tableData.unshift(this.select);
        this.$nextTick(() => {
          this.$refs.multipleTable.toggleRowSelection(this.tableData[0], true);
        });
      }
    },
    handleSelectionChange(selection, row) {
      this.triggerId = row.id
      this.$refs.multipleTable.clearSelection();
      //   this.tableData.forEach(item => {
      //     if (item.id == row.id) {
      //       item.boolean = true;
      //     } else {
      //       item.boolean = false;
      //     }
      //   });
      //   this.setCheck();
      this.$nextTick(() => {
        this.$refs.multipleTable.toggleRowSelection(row, true);
      });
    }
  }
};
</script>

<style>
</style>
