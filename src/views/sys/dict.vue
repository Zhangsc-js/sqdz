<template>
  <el-container style="height: 100%;">
    <el-aside width="50%" style="height: 100%;">
      <el-form inline ref="inqu" :model="inqu" label-width="80px">
        <el-divider content-position="left">主体信息</el-divider>
        <el-row>
          <el-form-item label="编码名称" prop="dictDesc">
            <el-input v-model="inqu.dictDesc" clearable />
          </el-form-item>
          <el-form-item label="所属模块" prop="belongModule">
            <el-select
              v-model="inqu.belongModule"
              placeholder="请选择"
              filterable
              style="width: 100%"
              clearable
            >
              <el-option
                v-for="item in SYSTEM_MODULE"
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
        :showAddBtn="authority"
        @jc-row-click="rowClick"
        @getData="getData"
        @savaData="saveMain"
        style="width: 99%;"
        height="75%"
        @deleteRow="deleteMain"
        :showOptBtn="authority"
        pageName="SYS-DICT"
      ></edit-table>
    </el-aside>
    <el-main style="height: 100%;">
      <el-divider content-position="left">明细信息</el-divider>
      <edit-table
        :tableData="tableDataPart"
        :opts.sync="tableColumnPart"
        highlight-current-row
        :showAddBtn="authority"
        @savaData="saveDetail"
        style="width: 100%;"
        height="90%"
        @deleteRow="deleteDetail"
        :showDelBtn="authority"
        @getData="rowClick"
        pageName="SYS-DICTIF"
      ></edit-table>
    </el-main>
  </el-container>
</template>

<script>
import {
  initDictData,
  getDictMainList,
  saveMain,
  deleteMain,
  getDictDetailList,
  saveDetail,
  deleteDetail
} from "@/api/sys/dict";
import EditTable from "@/components/EditTable";
import { dict2Edit, isNumber, resetQueryForm } from "@/utils/common";

export default {
  components: {
    EditTable
  },
  data() {
    return {
      inqu: {
        dictDesc: "",
        belongModule: ""
      },
      tableColumnMain: [
        {
          type: "input",
          label: "编码代码",
          prop: "dictCode",
          rule: true
        },
        {
          type: "input",
          label: "编码名称",
          prop: "dictDesc",
          rule: true
        },
        {
          type: "select",
          label: "级别",
          prop: "authLevel",
          width: "100px",
          rule: true,
          options: [
            {
              label: "系统",
              value: "1"
            },
            {
              label: "用户",
              value: "2"
            }
          ]
        },
        {
          type: "select",
          label: "模块分类",
          prop: "belongModule",
          width: "120px",
          rule: true,
          options: []
        },
        {
          type: "select",
          label: "字典值类型",
          rule: true,
          width: "140px",
          prop: "detailLabelType",
          options: []
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
      tableColumnPart: [
        {
          type: "input",
          label: "编码",
          prop: "code",
          rule: true
        },
        {
          type: "input",
          label: "显示值",
          prop: "label",
          rule: true
        }
      ],
      authority: true, //true系统选项，false用户权限
      SYSTEM_MODULE: [],
      DICT_VALUE_TYPE: [],
      rowClickData: ""
    };
  },
  created() {
    if (!this.authority) {
      this.tableColumnPart[0].type = null;
    }
  },
  mounted() {
    this.initDictData();
  },
  methods: {
    initDictData() {
      initDictData()
        .then(response => {
          if (response.data.success) {
            this.SYSTEM_MODULE = dict2Edit(response.data.data.SYSTEM_MODULE);
            this.DICT_VALUE_TYPE = dict2Edit(
              response.data.data.DICT_VALUE_TYPE
            );
            this.tableColumnMain[3].options = this.SYSTEM_MODULE;
            this.tableColumnMain[4].options = this.DICT_VALUE_TYPE;
            this.getData();
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    getData(code) {
      if (code === "query") {
        this.page.pageNum = 1;
      }
      var params = {
        ...this.page,
        ...this.inqu
      };
      if (!this.authority) {
        params.authLevel = "2";
      }
      getDictMainList(params)
        .then(response => {
          if (response.data.success) {
            this.tableData = response.data.data.list;
            this.total = response.data.data.size;
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
    saveMain(data, done) {
      if (!data.dictCode) {
        this.$message.error("编码代码不可为空");
        return;
      }
      if (!data.authLevel) {
        this.$message.error("请选择用户权限级别");
        return;
      }
      if(data.dictCode){
            data.dictCode=data.dictCode.trim();
        }
      if(data.dictDesc){
          data.dictDesc=data.dictDesc.trim();
      }
      done();
      saveMain(data)
        .then(response => {
          if (response.data.success) {
            this.$message.success("保存成功");
            this.getData();
          } else {
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
            this.getData();
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    deleteMain(data) {
      deleteMain(data)
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
    },
    rowClick(data) {
      if (data) this.rowClickData = data;
      this.selectMainInfo = this.rowClickData;
      getDictDetailList(this.rowClickData.dictCode)
        .then(response => {
          if (response.data.success) {
            this.tableDataPart = [];
            this.part3Info = {};
            let list = response.data.data;
            for (var i = 0; i < list.length; i++) {
              if ("3" != list[i].partType) {
                //partType=1、2 放入tableDataPart
                this.tableDataPart.push(list[i]);
              } else {
                //partType=3 放入part3Info
                this.part3Info = list[i];
              }
            }
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
    saveDetail(data) {
      data.mainCode = this.selectMainInfo.dictCode;
      if (this.selectMainInfo.detailLabelType == 2) {
        //整数验证
        if (isNumber(data.code)) {
          if (data.code.indexOf(".") != -1) {
            this.$message.warning("请输入整数");
            return;
          } else {
            data.code = parseInt(data.code);
          }
        } else {
          this.$message.warning("请输入整数");
          return;
        }
      } else if (this.selectMainInfo.detailLabelType == 3) {
        //小数验证
        if (!isNumber(data.code)) {
          this.$message.warning("请输入数字");
          return;
        } else {
          data.code = parseFloat(data.code);
        }
      }
      saveDetail(data)
        .then(response => {
          if (response.data.success) {
            this.$message.success("保存成功");
            this.rowClick(this.selectMainInfo);
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
    deleteDetail(data) {
      deleteDetail(data)
        .then(response => {
          if (response.data.success) {
            this.$message.success("删除成功");
            this.rowClick(this.selectMainInfo);
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
    reset() {
      resetQueryForm(this, "inqu", "initDictData");
    }
  }
};
</script>
