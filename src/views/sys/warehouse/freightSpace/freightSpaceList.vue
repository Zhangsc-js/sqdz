<template>
  <div style="height: 100%;">
    <el-form
      :inline="true"
      :model="queryForm"
      class="demo-form-inline"
      ref="queryForm"
      style="margin-left:15px"
    >
      <el-form-item label="仓库号" prop="whCode">
        <el-select
          v-model="queryForm.whCode"
          filterable
          placeholder="请选择"
          style="width: 150px;height: 100%"
        >
          <el-option
            v-for="item in this.whArr"
            :key="item.warehouseCode"
            :label="item.warehouseName"
            :value="item.warehouseCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="存储区" prop="areaCode">
        <el-select
          v-model="queryForm.areaCode"
          filterable
          placeholder="请选择"
          style="width: 150px;height: 100%"
          ref="areaCode"
        >
          <el-option
            v-for="item in this.areaArr"
            :key="item.areaCode"
            :label="item.areaName"
            :value="item.areaCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="仓位" prop="binCode">
        <el-input v-model="queryForm.binCode"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="getData()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      highlight-current-row
      :data="tableData"
      stripe
      border
      height="calc(100% - 52px - 50px - 42px - 12px - 15px)"
      style=" width: 100%"
      @selection-change="handleSelectionChange"
      ref="multipleTable"
    >
      <el-table-column type="selection" min-width="12%"></el-table-column>
      <el-table-column prop="binCode" label="仓位" min-width="12%"></el-table-column>
      <el-table-column prop="whCode" :formatter="whCodeFormatter" label="仓库" min-width="12%"></el-table-column>
      <el-table-column
        prop="areaCode"
        :formatter="areaCodeFormatter"
        label="存储区"
        width="150"
        show-overflow-tooltip
      ></el-table-column>
      <!-- <el-table-column prop="binTypeCode" label="仓位类型" min-width="12%"></el-table-column> -->
      <el-table-column prop="storageCellMax" label="允许的最大托盘数" width="200"></el-table-column>
      <el-table-column
        prop="freezeInput"
        :formatter="freezeInputFormatter"
        label="入库冻结标识"
        min-width="12%"
      ></el-table-column>
      <el-table-column
        prop="freezeOutput"
        label="出库冻结标识"
        :formatter="freezeOutputFormatter"
        min-width="12%"
      ></el-table-column>
      <el-table-column prop="freezeReason" label="冻结原因" min-width="12%"></el-table-column>
      <el-table-column prop="createBy" label="创建人" min-width="20%"></el-table-column>
      <el-table-column prop="createOn" label="创建时间" min-width="20%"></el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="updataBin(scope.row)">更新</el-button>
          <el-button type="text" size="small" @click="deleteBin(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding:15px 0 0 15px">
      <el-button type="primary" icon="el-icon-plus" @click="addFreight()">新增</el-button>
      <el-button
        :disabled="tableChecked.length<=0"
        type="danger"
        icon="el-icon-close"
        @click="batchDelete(tableChecked)"
      >批量删除</el-button>
    </div>
    <Pagination
      :total="total"
      :page.sync="page.current"
      :limit.sync="page.pageSize"
      @pagination="getData"
    />
    <el-dialog :title="title" :visible.sync="addDialogVisible" width="65%">
      <addFreightSpace
        @save="hidenDialog"
        @cancel="hidenDialogCancel"
        :id="id"
        :type="type"
        :trigger="addDialogVisible"
      />
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import addFreightSpace from "./addFreightSpace";
import {
  findSysWmsBinAll,
  findSysWmsWarehousePullDownAll,
  findSysWmsAreaPullDownAll,
  deleteSysWmsBinById,
  batchDeleteSysWmsBin,
  findAreaAll,
  findPullSysWhWarehouse
} from "@/api/sys/wms/warehouse";
export default {
  components: {
    Pagination,
    addFreightSpace
  },
  data() {
    return {
      page: {
        current: 1,
        pageSize: 10
      },
      total: 0,
      queryForm: {
        whCode: "",
        areaCode: "",
        binCode: ""
      },
      tableData: [],
      id: "",
      type: "",
      addDialogVisible: false,
      title: "",
      whArr: [],
      areaArr: [],
      tableChecked: [],
      areaList: []
    };
  },
  watch: {
    "queryForm.whCode": function(val) {
      findSysWmsAreaPullDownAll(this.queryForm.whCode).then(response => {
        if (response.data.success) {
          this.areaArr = response.data.data.list;
        }
      });
    }
  },
  methods: {
    areaCodeFormatter(row, column) {
      for (let index = 0; index < this.areaList.length; index++) {
        const element = this.areaList[index];
        if (row.areaCode == element.areaCode && row.whCode == element.whCode) {
          return element.areaName;
        }
      }
    },
    whCodeFormatter(row, column) {
      for (let index = 0; index < this.whArr.length; index++) {
        const element = this.whArr[index];
        if (element.warehouseCode == row.whCode) {
          return element.warehouseName;
        }
      }
    },

    freezeOutputFormatter(row, column) {
      if (row.freezeOutput) {
        return "是";
      } else {
        return "否";
      }
    },
    freezeInputFormatter(row, column) {
      if (row.freezeInput) {
        return "是";
      } else {
        return "否";
      }
    },
    handleSelectionChange(val) {
      this.tableChecked = val;
    },
    batchDelete(rows) {
      console.log(rows);
      let arr = [];
      rows.forEach(element => {
        arr.push(element.id);
      });
      console.log(arr);
      // console.log(JSON.stringify(arr));

      batchDeleteSysWmsBin(arr).then(response => {
        if (response.data.success) {
          this.getData();
          this.$message.success("删除成功!");
        }
      });
    },
    updataBin(row) {
      this.id = row.id;
      this.type = "2";
      this.title = "修改仓位";
      this.addDialogVisible = true;
    },
    deleteBin(row) {
      let that = this;
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          deleteSysWmsBinById(row.id).then(response => {
            console.log(response);
            if (response.data.success) {
              this.getData();
              this.$message.success("删除成功!");
            } else
              this.$message.error(
                response.data.message + ":" + response.data.data
              );
          });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    getData() {
      findSysWmsWarehousePullDownAll().then(response => {
        if (response.data.success) {
          this.whArr = response.data.data.list;
        }
      });
      const params = {
        ...this.page,
        ...this.queryForm
      };
      findSysWmsBinAll(params).then(response => {
        if (response.data.success) {
          this.tableData = response.data.data.list;
          this.total = response.data.data.total;
        }
      });
    },
    addFreight() {
      this.title = "新增仓位";
      this.addDialogVisible = true;
      this.type = "1";
      this.id = "";
    },
    hidenDialog() {
      this.addDialogVisible = false;
      this.getData();
    },
    hidenDialogCancel() {
      this.addDialogVisible = false;
    },
    getAreaList() {
      findAreaAll().then(response => {
        if (response.data.success) {
          this.areaList = response.data.data.list;
        }
      });
    }
  },
  mounted() {
    this.getData();
    this.getAreaList();
  }
};
</script>
<style scoped>
</style>
