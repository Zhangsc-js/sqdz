/* eslint-disable vue/no-dupe-keys */
<template>
  <el-container class="autocode" style="height: 100%;">
    <el-aside width="30%" style="height: 100%;">
      <el-form ref="inqu" :model="inqu" inline>
        <el-divider content-position="left">主体信息</el-divider>
        <el-row style="padding-left:10px">
          <el-form-item label="编码名称" prop="name">
            <el-input v-model="inqu.name" clearable />
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
        @jc-row-click="rowClick"
        @getData="getData"
        @savaData="saveMain"
        style="width: 100%;"
        height="75%"
        @deleteRow="deleteMain"
        pageName="SYS-AUTONO"
      ></edit-table>
    </el-aside>
    <el-main>
      <el-divider content-position="left">分段配置</el-divider>
      <edit-table
        :tableData="tableDataPart"
        :opts.sync="tableColumnPart"
        highlight-current-row
        :showAddBtn="showAddBtn"
        @savaData="savePart1"
        style="width: 100%;;"
        @deleteRow="deletePart1"
        height="40%"
        @getData="rowClick"
        pageName="SYS-AUTONO"
      ></edit-table>
      <el-divider content-position="left">流水号配置</el-divider>
      <el-form ref="part3Info" :model="part3Info" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="分段序号" prop="partIndex">
              <el-input v-model="part3Info.partIndex" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分段长度" prop="partLength">
              <el-input v-model="part3Info.partLength" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="初始值" prop="serialStartNum">
              <el-input v-model="part3Info.serialStartNum" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="步长" prop="serialStep">
              <el-input v-model="part3Info.serialStep" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="重置方式" prop="serialResetType">
              <el-select
                v-model="part3Info.serialResetType"
                placeholder="请选择"
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="item in resetType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row>
        <el-col :span="24">
          <el-button
            type="primary "
            v-has="'SYS-SERIAL-SAVE'"
            icon="el-icon-check"
            @click="savePart2"
          >保存</el-button>
          <el-button
            type="primary "
            v-has="'SYS-SERIAL-DELETE'"
            icon="el-icon-delete"
            @click="deletePart2"
          >删除</el-button>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import Pagination from "@/components/Pagination";
import {
  getAutocodeList,
  saveMain,
  deleteMain,
  getPartList,
  savePart,
  deletePart
} from "@/api/sys/autocode";
import EditTable from "@/components/EditTable";
import { resetQueryForm } from "@/utils/common";
export default {
  components: {
    Pagination,
    EditTable
  },
  mounted() {
    this.getData();
  },
  data() {
    return {
      inqu: {},
      tableColumnMain: [
        {
          type: "input",
          label: "编码代码",
          prop: "code",
          rule: true
        },
        {
          type: "input",
          label: "编码名称",
          prop: "name",
          rule: true
        },
        {
          label: "最新值",
          prop: "lastNo",
          width: "130px"
        }
      ],
      showAddBtn: true,
      rowClickData: "",
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
          label: "分段序号",
          prop: "partIndex",
          rule: true
        },
        {
          type: "select",
          label: "分段类型",
          prop: "partType",
          rule: true,
          options: [
            {
              label: "固定字符",
              value: "1"
            },
            {
              label: "日期类型",
              value: "2"
            }
          ]
        },
        {
          type: "input",
          label: "时间格式字符串(yyMMdd)",
          prop: "datetimeFormat"
        },
        {
          type: "input",
          label: "固定字符串",
          prop: "fixChars"
        }
      ],
      resetType: [
        {
          value: "1",
          label: "按年"
        },
        {
          value: "2",
          label: "按月"
        },
        {
          value: "3",
          label: "按日"
        },
        {
          value: "0",
          label: "不重置"
        }
      ],
      part3Info: {
        partIndex: "",
        partLength: 0,
        serialStartNum: "",
        serialStep: "",
        serialResetType: ""
      }
    };
  },
  methods: {
    getData(code) {
      if (code === "query") {
        this.page.pageNum = 1;
      }
      var params = {
        ...this.page,
        ...this.inqu
      };
      getAutocodeList(params)
        .then(response => {
          this.tableData = response.data.data.list;
          this.total = response.data.data.size;
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    saveMain(data) {
      saveMain(data)
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
    deleteMain(data) {
      deleteMain(data)
        .then(response => {
          this.$message.success("删除成功");
          this.getData();
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    // eslint-disable-next-line vue/no-dupe-keys
    rowClick(data) {
      if (data) this.rowClickData = data;
      this.selectMainInfo = this.rowClickData;
      getPartList(this.rowClickData.id)
        .then(response => {
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
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    savePart1(data) {
      data.mainId = this.selectMainInfo.id;
      savePart(data)
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
    savePart2() {
      this.part3Info.mainId = this.selectMainInfo.id;
      this.part3Info.partType = "3";
      this.part3Info.serialNowNum = 0;
      savePart(this.part3Info)
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
    deletePart1(data) {
      deletePart(data)
        .then(response => {
          this.$message.success("删除成功");
          this.rowClick(this.selectMainInfo);
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    deletePart2() {
      deletePart(this.part3Info.id)
        .then(response => {
          this.$message.success("删除成功");
          this.rowClick(this.selectMainInfo);
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    reset() {
      resetQueryForm(this, "inqu", "getData");
    }
  }
};
</script>
<style lang="scss" >
.autocode .el-input {
  width: auto;
}
</style>
