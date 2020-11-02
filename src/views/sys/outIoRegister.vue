<template>
  <!-- 外部接口注册 -->
  <div class="outIoRegister" style="height:100%">
    <!-- 查询行 -->
    <el-form :inline="true" :model="queryForm" class="demo-form-inline" style="margin-left:20px">
      <el-form-item label="接口编码">
        <el-select v-model="queryForm.ioCode">
          <el-option
            v-for="(item,index) in ioCodeOpts"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="接口名称">
        <el-input v-model="queryForm.ioName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="getData(1)">查询</el-button>
        <el-button
          href="javascript:void(0)"
          @click="clearSearchBox"
          icon="el-icon-refresh-left"
          type="primary"
        >重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格主体 -->
    <edit-table
      :tableData="tableData"
      :opts="opts"
      height="calc(100% - 96px)"
      pageName="SYS-DEPART-PORD-LINE"
      @deleteRow="delRow"
      @savaData="saveData"
      :total="total"
      :page="page"
    ></edit-table>
  </div>
</template>

<script>
import EditTable from "@/components/EditTable";
import {
  ioManageSlt,
  ioManageQueryAll,
  saveIoManage,
  deleteIoManege
} from "@/api/sys";
export default {
  components: {
    EditTable
  },
  data() {
    return {
      queryForm: {
        ioCode: "",
        ioName: ""
      },
      tableData: [],
      opts: [
        {
          type: "input",
          label: "接口编码",
          prop: "ioCode"
        },
        {
          type: "input",
          label: "接口名称",
          prop: "ioName"
        },
        {
          type: "input",
          label: "调用方",
          prop: "caller"
        },
        {
          type: "input",
          label: "被调方",
          prop: "called"
        },
        {
          type: "select",
          label: "数据操作",
          prop: "ioType",
          options: [
            { label: "获取数据", value: "1" },
            { label: "写入数据", value: "2" }
          ]
        }
      ],
      total: 0,
      page: {
        pageNum: 1,
        pageSize: 10
      },
      ioCodeOpts: []
    };
  },
  methods: {
    async getData() {
      let params = {
        ...this.queryForm
      };
      let res = await ioManageQueryAll(params);
      if (res.data.success) {
        this.tableData = res.data.data.list;
        this.total = res.data.data.total;
      } else {
        this.$message.error(res.data.message + ":" + res.data.data);
      }

      ioManageSlt().then(res => {
        if (res.data.success) {
          this.ioCodeOpts = res.data.data;
        } else {
          this.$message.error(res.data.message + ":" + res.data.data);
        }
      });
    },
    clearSearchBox() {},
    delRow(id) {
      deleteIoManege(id).then(res => {
        if (res.data.success) {
          this.$message.success("删除成功");
          this.getData();
        } else {
          this.$message.error(res.data.message + res.data.data);
        }
      });
    },
    saveData(row) {
      let title = row.id ? "更新成功" : "新增成功";
      saveIoManage(row).then(res => {
        if (res.data.success) {
          this.$message.success(title);
          this.getData();
        } else {
          this.$message.error(res.data.message + ":" + res.data.data);
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
</style>
