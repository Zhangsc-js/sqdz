<!-- discard -->
<template>
  <div class="productionProcess" style="height: 100%;">
    <!-- 表格 -->
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      stripe
      height="calc(100% - 72px)"
      ref="multipleTable"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="processCode" label="工艺编码"></el-table-column>
      <el-table-column prop="processName" label="工艺名称"></el-table-column>
      <el-table-column label="操作" align="center" width="100" fixed="right">
        <template v-slot="{row}">
          <el-button type="text" @click="delRow(row.id)" v-has="'SYS-DPROCESS-DELETE'">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增删除 -->
    <el-row style="padding:20px">
      <el-button
        :disabled="!departCode"
        type="primary"
        icon="el-icon-plus"
        @click="add"
        v-has="'SYS-DPROCESS-ADD'"
      >新增</el-button>
      <el-button
        :disabled="!departCode || tableData.length===0 "
        type="danger"
        icon="el-icon-delete"
        @click="delRows()"
        v-has="'SYS-DPROCESS-DELETE'"
      >删除</el-button>
    </el-row>

    <!-- 对话框 -->
    <el-dialog title="新增生产工序" style="height:100%" :visible.sync="dialogVisible" width="50%">
      <addPro @save="save" :departCode="departCode"></addPro>
    </el-dialog>
  </div>
</template>


<script>
import {
  findByDepartId,
  dltDepartMentProcess,
  BatchDltDepartMentProcess
} from "@/api/sys/departMentProcess";
import addPro from "./addPro";

export default {
  props: {
    departCode: {
      type: String,
      required: true
    }
  },
  components: {
    addPro
  },
  data() {
    return {
      tableData: [],
      dialogVisible: false
    };
  },
  watch: {
    departCode() {
      if (this.departCode) {
        this.getData();
      }
    },
    activeName() {
      if (this.departcode) {
        this.getData();
      }
    }
  },
  methods: {
    getData() {
      findByDepartId(this.departCode).then(response => {
        let data = response.data;
        if (data.success) {
          this.tableData = data.data;
        } else {
          this.$message.error(data.message + ":" + data.data);
        }
      });
    },
    delRow(id) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          dltDepartMentProcess(id).then(response => {
            let data = response.data;
            if (data.success) {
              this.$message.success("删除成功");
              this.getData();
            } else {
              this.$message.error(data.message + ":" + data.data);
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    delRows() {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let ids = this.$refs.multipleTable.store.states.selection.map(
            item => item.id
          );
          BatchDltDepartMentProcess(ids).then(response => {
            let data = response.data;
            if (data.success) {
              this.$message.success("删除成功");
              this.getData();
            } else {
              this.$message.error(data.message + ":" + data.data);
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    add() {
      this.dialogVisible = true;
    },
    save() {
      this.dialogVisible = false;
      this.getData();
    }
  }
};
</script>

<style>
.productionProcess .el-dialog {
  max-height: 100%;
  min-height: 60%;
}
</style>
