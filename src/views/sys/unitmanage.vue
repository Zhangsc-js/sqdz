<template>
  <el-container style="height: 100%;">
    <el-aside width="100%">
      <!--style="height: 100%;"-->
      <el-form ref="inqu" :model="inqu" inline>
        <el-divider content-position="left">单位管理</el-divider>
        <el-row>
          <el-form-item label="单位名称：" prop="name">
            <el-input v-model.trim="inqu.name" />
          </el-form-item>
          <el-form-item label="单位类型：" prop="type">
            <el-select v-model="inqu.type" clearable filterable placeholder="请选择">
              <el-option
                v-for="item in unitTypeMap"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary " icon="el-icon-search" @click="getData('query')">查询</el-button>
            <el-button type="primary " icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <edit-table
        :tableData="tableData"
        :opts.sync="tableColumnMain"
        highlight-current-row
        :page="page"
        :total="total"
        :showAddBtn="showAddBtn"
        @getData="getData"
        @savaData="saveUnit"
        style="width: 100%;"
        height="calc(100% - 145px)"
        @deleteRow="deleteUnit"
        pageName="SYS-UNITMN"
      ></edit-table>
      <!--@jc-row-click="rowClick"-->
    </el-aside>
  </el-container>
</template>

<script>
//import Pagination from '@/components/Pagination'
import { getUnitData, saveUnit, deleteUnit, queryUnitType } from "@/api/sys";
import EditTable from "@/components/EditTable";
import { isNumber, resetQueryForm } from "@/utils/common";

export default {
  name: "unitmanage",
  components: {
    //Pagination,
    EditTable
  },
  data() {
    return {
      inqu: {
        name: "",
        type: ""
      },
      tableColumnMain: [
        {
          type: "input",
          label: "单位编码",
          rule: true,
          prop: "code"
        },
        {
          type: "input",
          label: "单位名称",
          rule: true,
          prop: "name"
        },
        {
          type: "select",
          label: "单位类型",
          prop: "type",
          rule: true,
          options: []
        },
        {
          type: "input",
          label: "计算精度",
          prop: "calculateFigure",
          rule: true
        },
        {
          type: "input",
          label: "显示精度",
          prop: "showFigure",
          rule: true
        }
      ],
      showAddBtn: true,
      page: {
        pageNum: 1,
        pageSize: 10
      },
      page1: {
        pageNum: 1,
        pageSize: 10
      },
      tableData: [],
      unitTypeMap: [],
      total: 0,
      total1: 0,
      selectMainInfo: {},
      tableDataPart: [],
      sels: []
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    getData(type) {
      //   for (let key in this.inqu) {
      //     if (this.inqu[key]) {
      //       this.page.pageNum = 1;
      //     }
      //   }
      if (type === "query") {
        this.page.pageNum = 1;
      }
      var params = {
        ...this.page,
        ...this.inqu
      };
      getUnitData(params)
        .then(response => {
          this.tableData = response.data.data.list;
          this.total = response.data.data.size;
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    init() {
      queryUnitType().then(response => {
        let resultList = response.data.data.resultList;
        let unitTypeMap = [];
        for (let i = 0; i < resultList.length; i++) {
          unitTypeMap.push({
            label: resultList[i].label,
            value: resultList[i].code
          });
        }
        this.tableColumnMain[2].options = unitTypeMap;
        this.unitTypeMap = unitTypeMap;
        this.getData();
      });
    },
    saveUnit(data, done) {
      if (data.code) {
        data.code = data.code.trim();
      }
      if (data.name) {
        data.name = data.name.trim();
      }
      if (isNumber(data.calculateFigure)) {
        var calculateFigure = data.calculateFigure.toString();
        if (calculateFigure.indexOf(".") != -1) {
          this.$message.warning("请输入整数");
          return;
        } else {
          data.calculateFigure = parseInt(data.calculateFigure);
        }
      } else {
        this.$message.warning("请输入整数");
        return;
      }

      if (isNumber(data.showFigure)) {
        var showFigure = data.showFigure.toString();
        if (showFigure.indexOf(".") != -1) {
          this.$message.warning("请输入整数");
          return;
        } else {
          data.showFigure = parseInt(data.showFigure);
        }
      } else {
        this.$message.warning("请输入整数");
        return;
      }
      done();
      saveUnit(data)
        .then(response => {
          if (response.data.success) {
            this.$message.success("保存成功");
            this.getData();
          } else {
            this.getData();
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    deleteUnit(data) {
      deleteUnit(data)
        .then(response => {
          this.$message.success("删除成功");
          this.getData();
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    reset() {
      this.page.pageNum = 1;
      resetQueryForm(this, "inqu");
    }
    // pageChange() {
    //   if (this.page.pageNum > Math.ceil(this.total / this.page.pageSize)) {
    //     alert(1);
    //   }
    //   this.getData();
    // }
  }
};
</script>
