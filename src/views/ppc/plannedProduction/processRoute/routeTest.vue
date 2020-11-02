<template>
  <div style="height: 100%">
    <div
      tabindex="0"
      class="method-1-wrap wrap"
      style="float: left;width: 48%;margin-left: 20px;height: calc(100% - 28px);"
    >
      <span class="title">Bom信息</span>
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
        <el-form-item label="Bom代码" prop="bomCode">
          <el-input clearable v-model="queryForm.bomCode" placeholder="请输入物理代码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getData(1)">查询</el-button>
          <el-button type="primary" icon="el-icon-refresh-left" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table
        highlight-current-row
        :data="bomTable"
        @row-click="findProcess"
        border
        style="width: 100%"
        height="calc(100% - 100px)"
      >
        <el-table-column prop="bomCode" label="Bom编码"></el-table-column>
        <el-table-column prop="category" :formatter="categoryFormat" label="类型" width="100px"></el-table-column>
        <el-table-column prop="materialCode" label="物料编码"></el-table-column>
        <el-table-column prop="bomVer" label="启用版本" width="100px"></el-table-column>
      </el-table>

      <Pagination
        :total="total"
        :page.sync="page.current"
        :limit.sync="page.size"
        :pageSizes="pageSizes"
        @pagination="getData"
      />
    </div>
    <div
      class="method-1-wrap wrap"
      tabindex="0"
      style="float: left;width: 50%;margin-left: 5px;height: calc(20% - 28px);"
    >
      <span class="title">路线信息</span>
      <el-form :inline="true" :model="routeForm" class="demo-form-inline" ref="queryForm">
        <el-form-item label="路线编码">
          <el-input v-model="routeForm.routeCode" placeholder="请输入物料编码"></el-input>
        </el-form-item>
        <el-form-item label="路线名称">
          <el-input v-model="routeForm.routeName" placeholder="请输入物料路线"></el-input>
        </el-form-item>
        <el-form-item style="margin-right: 5px">
          <el-button
            type="primary"
            icon="el-icon-check"
            @click="saveRoute"
            v-has="'SYS-ROUTE-ADD'"
          >保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div
      tabindex="0"
      class="method-1-wrap wrap"
      style="float: left;width: 50%;margin-left: 5px;height: calc(80% - 26px);"
    >
      <span class="title">工序配置</span>
      <edit-table
        :tableData="processData"
        :opts.sync="opts"
        highlight-current-row
        height="calc(100% - 50px)"
        :showAddBtn="showAddBtn"
        @getData="findProcess"
        @savaData="saveProcess"
        @deleteRow="dltProcess"
        style="width: 100%"
        pageName="SYS-ROUPRO"
      ></edit-table>
    </div>
  </div>
</template>


<script>
import Pagination from "@/components/Pagination";
import EditTable from "@/components/EditTable";
// import Addmaterial from './Addmaterial'
import {
  getGroupBomData,
  getroute,
  saveRoute,
  saveProcess,
  selectProcess,
  dltProcess,
  queryStatus
} from "@/api/productionPlanning";
import { resetQueryForm } from "@/utils/common";

export default {
  name: "ppcroute",
  components: {
    // Addmaterial,
    Pagination,
    EditTable
  },
  data() {
    return {
      opts: [
        {
          type: "input",
          label: "流程号",
          prop: "processNo"
        },
        {
          type: "select",
          label: "工序编号/名称",
          prop: "processCode",
          options: []
        }
      ],
      page: {
        current: 1,
        size: 15
      },
      showAddBtn: true,
      precess: [],
      pageSizes: [15, 50, 100],
      total: 0,
      queryForm: {
        bomCode: "",
        bomName: ""
      },
      routeForm: {
        routeCode: "",
        routeName: ""
      },
      bomTable: [],
      processData: [],
      bomCode: "",
      selectRouteCode: "",
      materialStatus: ""
    };
  },
  methods: {
    init() {
      this.selectProcess();
    },
    saveProcess(data, done) {
      done();
      data.bomCode = this.bomCode;
      saveProcess(data).then(response => {
        if (response.data.success) {
          this.$message.success("保存成功!");
          const params = {
            ...this.bpage,
            bomCode: this.bomCode
          };
          getroute(params)
            .then(response => {
              let result = response.data;
              if (result.data[0].route != null) {
                this.routeForm = result.data[0].route;
                this.processData = result.data[0].list;
                this.btotal = result.data[0].list.length;
              } else {
                this.routeForm = {
                  routeCode: "",
                  routeName: ""
                };
                this.processData = [];
              }
            })
            .catch(e => {
              this.$message({
                type: "error",
                message: e.message,
                duration: 3 * 1000
              });
            });
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
    },
    dltProcess(id) {
      dltProcess(id).then(response => {
        if (response.data.success) {
          this.$message.success("删除成功!");
          const params = {
            ...this.bpage,
            bomCode: this.bomCode
          };
          getroute(params)
            .then(response => {
              let result = response.data;
              if (result.data[0].route != null) {
                this.routeForm = result.data[0].route;
                this.processData = result.data[0].list;
                this.btotal = result.data[0].list.length;
              } else {
                this.routeForm = {
                  routeCode: "",
                  routeName: ""
                };
                this.processData = [];
              }
            })
            .catch(e => {
              this.$message({
                type: "error",
                message: e.message,
                duration: 3 * 1000
              });
            });
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
    },
    saveRoute() {
      if (!this.routeForm.routeCode) {
        this.$message.error("路线编码不可为空");
      }
      saveRoute(this.routeForm, this.bomCode).then(response => {
        if (response.data.success) {
          this.$message.success("保存成功!");
          this.getData();
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
    },
    clearSearchBox() {
      this.queryForm = {
        materialCode: "",
        materialName: ""
      };
    },
    selectProcess() {
      selectProcess().then(response => {
        let data = response.data;
        this.opts[1].options = data.data;
      });
    },
    findProcess(row) {
      if (row != undefined) {
        this.bomCode = row.bomCode;
      }
      const params = {
        ...this.bpage,
        bomCode: this.bomCode
      };
      getroute(params)
        .then(response => {
          let result = response.data;
          if (result.data[0].route != null) {
            this.routeForm = result.data[0].route;
            this.processData = result.data[0].list;
            this.btotal = result.data[0].list.length;
            this.selectRouteCode = result.data[0].route.routeCode;
          } else {
            this.routeForm = {
              routeCode: "",
              routeName: ""
            };
            this.processData = [];
            this.selectRouteCode = "";
          }
          if (this.selectRouteCode) {
            this.showAddBtn = true;
          } else {
            this.showAddBtn = false;
          }
        })
        .catch(e => {
          this.$message({
            type: "error",
            message: e.message,
            duration: 3 * 1000
          });
        });
    },
    getData(current) {
      if (current === 1) {
        this.page.current = current;
      }
      const params = {
        ...this.page,
        ...this.queryForm
      };
      getGroupBomData(params)
        .then(response => {
          let data = response.data;
          this.bomTable = data.data.list;
          this.total = data.data.total;
          this.queryStatus();
        })
        .catch(e => {
          this.$message({
            type: "error",
            message: e.message,
            duration: 3 * 1000
          });
        });
    },
    queryStatus() {
      queryStatus().then(response => {
        let result = response.data;
        if (result.success) {
          this.materialStatus = result.data.MATERIAL_CATEGORY;
        }
      });
    },
    categoryFormat(row, column) {
      for (var i = 0; i < this.materialStatus.length; i++) {
        if (row.category == this.materialStatus[i].code) {
          return this.materialStatus[i].label;
        }
      }
    },
    reset() {
      resetQueryForm(this);
      this.init();
    }
  },
  mounted() {
    this.init();
    this.getData();
  },
  activated() {
    this.init();
  }
};
</script>

<style lang="css" scoped>
.el-form-item__label {
  width: 70px;
}

.wrap {
  margin: 13px auto;
  width: 500px;
}

.method-1-wrap {
  position: relative;
  border: 1px solid #ccc;
  padding: 20px;
  box-sizing: border-box;
}

.method-1-wrap .title {
  position: absolute;
  top: -1em;
  left: 10%;
  line-height: 2em;
  padding: 0 1em;
  background-color: #fff;
}

.cell {
  text-align: center;
}

app-main > div {
  height: 100%;
}
</style>
