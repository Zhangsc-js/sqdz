<template>
  <div style="height: 100%;">
    <el-form
      :inline="true"
      :model="queryForm"
      class="demo-form-inline"
      ref="queryForm"
      style="margin-left:10px"
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
        <el-input v-model="queryForm.areaCode"></el-input>
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
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="areaCode" label="存储区"></el-table-column>
      <el-table-column prop="areaName" label="存储区描述"></el-table-column>
      <el-table-column prop="areaTypeCode" :formatter="areaTypeShow" label="存储区类型"></el-table-column>
      <el-table-column prop="strategyInput" :formatter="strategyInputShow" label="入库策略"></el-table-column>
      <el-table-column prop="strategyOutput" :formatter="strategyOutputShow" label="出库策略"></el-table-column>
      <el-table-column prop="whCode" :formatter="whCodeFormatter" label="仓库号"></el-table-column>
      <el-table-column prop="createBy" label="创建人"></el-table-column>
      <el-table-column prop="createOn" label="创建时间"></el-table-column>
      <el-table-column label="操作" min-width="120" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="updataArea(scope.row)">更新</el-button>
          <el-button type="text" size="small" @click="deleteArea(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding:15px 0 0 10px">
      <el-button type="primary" @click="addArea()" icon="el-icon-plus">新增</el-button>
      <el-button
        type="danger"
        :disabled="tableChecked.length<=0"
        icon="el-icon-close"
        @click="batchDelete(tableChecked)"
      >批量删除</el-button>
    </div>
    <Pagination
      :total="total"
      :page.sync="page.pageNum"
      :limit.sync="page.pageSize"
      @pagination="getData"
    />
    <el-dialog :title="title" :visible.sync="addDialogVisible" width="65%">
      <addStorageArea
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
import addStorageArea from "./addStorageArea";
import {
  findAreaList,
  findSysWmsWarehousePullDownAll,
  deleteWmsAreaByKey,
  deleteBatchSysArea,
  findInboundAndOutboundStrategy,
  findStorageType
} from "@/api/sys/wms/warehouse";
export default {
  components: {
    Pagination,
    addStorageArea
  },
  data() {
    return {
      total: 0,
      id: "",
      page: {
        pageNum: 1,
        pageSize: 10
      },
      queryForm: {
        whCode: "",
        areaCode: ""
      },
      tableData: [],
      whArr: [],
      title: "",
      addDialogVisible: false,
      type: "",
      tableChecked: [],
      areaType: [],
      warehousingStrategy: [],
      outboundStrategy: []
    };
  },
  methods: {
    areaTypeShow(row, column) {
      for (let index = 0; index < this.areaType.length; index++) {
        const element = this.areaType[index];
        if (element.code == row.areaTypeCode) {
          return element.label;
        }
      }
    },
    strategyOutputShow(row, column) {
      for (let index = 0; index < this.outboundStrategy.length; index++) {
        const element = this.outboundStrategy[index];
        if (element.code == row.strategyOutput) {
          return element.label;
        }
      }
    },
    strategyInputShow(row, column) {
      for (let index = 0; index < this.warehousingStrategy.length; index++) {
        const element = this.warehousingStrategy[index];
        if (element.code == row.strategyInput) {
          return element.label;
        }
      }
    },
    whCodeFormatter(row, column) {
      for (let index = 0; index < this.whArr.length; index++) {
        const element = this.whArr[index];
        if (row.whCode == element.warehouseCode) {
          return element.warehouseName;
        }
      }
    },
    batchDelete(rows) {
      let arr = [];
      rows.forEach(element => {
        arr.push(element.id);
      });
      deleteBatchSysArea(arr).then(response => {
        if (response.data.success) {
          this.getData();
          this.$message.success("删除成功!");
        }
      });
    },
    hidenDialog() {
      this.addDialogVisible = false;
      this.getData();
    },
    hidenDialogCancel() {
      this.addDialogVisible = false;
    },
    getData() {
      const params = {
        ...this.page,
        ...this.queryForm
      };
      findInboundAndOutboundStrategy().then(response => {
        if (response.data.success) {
          this.warehousingStrategy = response.data.data.WAREHOUSING_STRATEGY;
          this.outboundStrategy = response.data.data.OUTBOUND_STRATEGY;
        }
      });
      findStorageType().then(response => {
        if (response.data.success) {
          this.areaType = response.data.data.STORAGE_AREA_TYPE;
        }
      });
      findSysWmsWarehousePullDownAll().then(response => {
        if (response.data.success) {
          this.whArr = response.data.data.list;
        }
      });
      findAreaList(params).then(response => {
        if (response.data.success) {
          this.tableData = response.data.data.rows;
          this.total = response.data.data.total;
        }
      });
    },
    updataArea(row, column) {
      this.title = "修改存储区";
      this.addDialogVisible = true;
      this.id = row.id;
      this.type = "2";
    },
    deleteArea(row, column) {
      let that = this;

      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          deleteWmsAreaByKey(row.id).then(response => {
            console.log(response);
            if (response.data.success) {
              that.getData();
              that.$message.success("删除成功!");
            } else
              that.$message.error(
                response.data.message + ":" + response.data.data
              );
          });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    handleSelectionChange(val) {
      this.tableChecked = val;
    },
    addArea() {
      this.title = "新增存储区";
      this.type = "1";
      this.id = "";
      this.addDialogVisible = true;
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
