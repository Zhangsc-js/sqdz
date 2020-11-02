<template>
  <div style="height: 100%;">
    <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
      <el-form-item label="仓库编码">
        <el-input v-model="queryForm.warehouseCode"></el-input>
      </el-form-item>
      <el-form-item label="厂区">
        <el-select
          v-model="queryForm.departCode"
          filterable
          placeholder="请选择"
          style="width: 150px;height: 100%"
        >
          <el-option
            v-for="item in factory"
            :key="item.depart_code"
            :label="item.depart_name"
            :value="item.depart_code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="getData">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- <edit-table
      :tableData="tableData"
      :opts.sync="tableColumnMain"
      highlight-current-row
      :page="pageTable"
      :total="totalTable"
      :showAddBtn="authority"
      @getData="getTableData"
      @savaData="saveMain"
      @selectChange="selectWarehouseCode"
      style="width: 99%;height: 90%;"
      height="75%"
      @deleteRow="deleteMain"
      :showOptBtn="authority"
      pageName="SYS-DICT"
    ></edit-table>-->
    <el-button class="addRow" type="primary" @click="addRow" icon="el-icon-plus">新增</el-button>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="warehouseCode" label="仓库编码">
        <template v-slot="scope">
          <!-- <el-input
            v-model="scope.row.warehouseCode"
            v-if="flag"
            @click.native="devNameRowCliek(scope.row)"
          ></el-input>
          <span v-else>{{ scope.row.warehouseCode }}</span>-->
          <el-select
            v-model="scope.row.warehouseCode"
            v-if="scope.row.flag"
            filterable
            placeholder="请选择"
            @change="selectWarehouseCode(scope.row)"
          >
            <el-option
              v-for="item in whArr"
              :key="item.whCode"
              :label="item.whCode"
              :value="item.whCode"
            ></el-option>
          </el-select>
          <span v-else>{{ scope.row.warehouseCode }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="warehouseName" label="仓库名称">
        <template v-slot="scope">
          <el-input v-model="scope.row.warehouseName" v-if="scope.row.flag" :disabled="true"></el-input>
          <span v-else>{{ scope.row.warehouseName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="departCode" label="厂区">
        <template v-slot="scope">
          <el-select
            v-model="scope.row.departCode"
            filterable
            placeholder="请选择"
            :disabled="true"
            v-if="scope.row.flag"
          >
            <el-option
              v-for="item in factory"
              :key="item.depart_code"
              :label="item.depart_name"
              :value="item.depart_code"
            ></el-option>
          </el-select>
          <span v-else>{{ formatFactory(scope.row.departCode) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="地址">
        <template v-slot="scope">
          <el-input v-model="scope.row.address" v-if="scope.row.flag"></el-input>
          <span v-else>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="warehouseDescribe" label="描述">
        <template v-slot="scope">
          <el-input v-model="scope.row.warehouseDescribe" v-if="scope.row.flag"></el-input>
          <span v-else>{{ scope.row.warehouseDescribe }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="warehouseType" label="类别">
        <template v-slot="scope">
          <el-input v-model="scope.row.warehouseType" v-if="scope.row.flag"></el-input>
          <span v-else>{{ scope.row.warehouseType }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" fixed="right" width="120px">
        <template v-slot="scope">
          <el-button
            type="text"
            v-if="!scope.row.visibleCancel"
            size="small"
            @click.stop="edit(scope.row)"
          >更新</el-button>
          <el-button
            type="text"
            v-if="scope.row.visibleCancel"
            size="small"
            @click.stop="save(scope.row)"
          >保存</el-button>
          <el-button
            type="text"
            v-if="scope.row.visibleCancel"
            size="small"
            @click.stop="cancel(scope.row)"
          >取消</el-button>
          <el-button
            type="text"
            v-if="scope.row.id && !scope.row.visibleCancel"
            size="small"
            @click.stop="deleteRow(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :total="totalTable"
      :page.sync="pageTable.pageNum"
      :limit.sync="pageTable.pageSize"
      @pagination="getData"
    />
  </div>
</template>
<script>
import EditTable from "@/components/EditTable";
import {
  findSysWhWarehouseAll,
  saveSysWhWarehouse,
  updateSysWhWarehouse,
  deleteSysWhWarehouse,
  findFactory,
  findWh,
  findByWhCode,
  findSysWmsCellByWhCode,
  deleteSysWmsCellByWhCode,
  deleteAreaByWhCode
} from "@/api/sys/wms/warehouse";
import Pagination from "@/components/Pagination";
export default {
  data() {
    return {
      factory: [],
      queryForm: {
        warehouseCode: "",
        departCode: ""
      },
      tableData: [],
      pageTable: {
        pageNum: 1,
        pageSize: 10
      },
      totalTable: 0,
      whArr: []
    };
  },
  components: {
    EditTable,
    Pagination
  },
  methods: {
    addRow() {
      const row = {
        flag: true,
        visibleCancel: true,
        warehouseCode: "",
        warehouseName: "",
        address: "",
        departCode: "",
        warehouseDescribe: "",
        warehouseType: ""
      };
      this.tableData.unshift(row);
    },
    selectWarehouseCode(row) {
      console.log(row);
      for (let index = 0; index < this.whArr.length; index++) {
        const element = this.whArr[index];
        if (element.whCode == row.warehouseCode) {
          row.warehouseName = element.whName;
          row.departCode = element.ftyCode;
        }
      }
    },
    async deleteRow(row) {
      let params = {
        whCode: row.warehouseCode
      };
      console.log(params);
      let areaArr = await findByWhCode(params).then(response => {
        if (response.data.success) {
          return response.data.data.list;
        }
      });
      let cellArr = await findSysWmsCellByWhCode(params).then(response => {
        if (response.data.success) {
          return response.data.data.list;
        }
      });
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          if (areaArr.length > 0 || cellArr.length > 0) {
            console.log("areaArr:" + areaArr + "----------cellArr:" + cellArr);
            this.$confirm(
              "此仓库下绑定了存储区或存储单元,是否继续删除(确定删除绑定的存储区和存储单元都将被删除)",
              "提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消"
              }
            )
              .then(() => {
                if (areaArr.length > 0 && !cellArr.length > 0) {
                  deleteAreaByWhCode(row.warehouseCode).then(response => {
                    if (response.data.success) {
                      this.$message.success("删除成功！");
                    }
                  });
                  deleteSysWhWarehouse(row.id).then(response => {
                    if (response.data.success) {
                      this.$message.success("删除成功！");
                      this.getData();
                    }
                  });
                }
                if (!areaArr.length > 0 && cellArr.length > 0) {
                  deleteSysWmsCellByWhCode(row.warehouseCode).then(response => {
                    if (response.data.success) {
                      this.$message.success("删除成功！");
                    }
                  });
                  deleteSysWhWarehouse(row.id).then(response => {
                    if (response.data.success) {
                      this.$message.success("删除成功！");
                      this.getData();
                    }
                  });
                }
                if (areaArr.length > 0 && cellArr.length > 0) {
                  deleteAreaByWhCode(row.warehouseCode).then(response => {
                    if (response.data.success) {
                      this.$message.success("删除成功！");
                    }
                  });
                  deleteSysWmsCellByWhCode(row.warehouseCode).then(response => {
                    if (response.data.success) {
                      this.$message.success("删除成功！");
                    }
                  });
                  deleteSysWhWarehouse(row.id).then(response => {
                    if (response.data.success) {
                      this.$message.success("删除成功！");
                      this.getData();
                    }
                  });
                }
              })
              .catch(() => {
                this.$message.info("已经取消删除");
              });
          } else {
            deleteSysWhWarehouse(row.id).then(response => {
              if (response.data.success) {
                this.$message.success("删除成功！");
                this.getData();
              }
            });
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    edit(row) {
      console.log(row);

      this.$set(row, "visibleCancel", true);
      this.$set(row, "flag", true);
      //   row.visibleCancel = true;
      //   row.flag = true;
    },
    save(row) {
      if (row.id != null) {
        updateSysWhWarehouse(row).then(response => {
          if (response.data.success) {
            this.$message.success("修改成功！");
            this.getData();
          }
        });
      } else {
        saveSysWhWarehouse(row).then(response => {
          if (response.data.success) {
            this.$message.success("保存成功！");
            this.getData();
          }
        });
      }
    },
    cancel(row) {
      this.$set(row, "visibleCancel", false);
      this.$set(row, "flag", false);
    },
    getTableData() {
      const params = {
        ...this.pageTable,
        ...this.queryForm
      };

      findWh().then(response => {
        if (response.data.success) {
          this.whArr = response.data.data.list;
        }
      });
      findSysWhWarehouseAll(params).then(response => {
        if (response.data.success) {
          this.tableData = response.data.data.list;
          this.totalTable = response.data.data.total;
        }
      });
    },
    getData() {
      findFactory().then(response => {
        if (response.data.success) {
          this.factory = response.data.data.list;
        }
      });
      this.getTableData();
    }
  },
  computed: {
    formatFactory() {
      return function(val) {
        let arr = this.factory.filter(item => item.depart_code == val);
        let name = arr.length > 0 ? arr[0].depart_name : "";
        return name;
      };
    }
  },
  mounted() {
    this.getData();
  }
};
</script>