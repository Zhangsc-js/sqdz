<template>
  <div style="display: flex">
    <select-tree
      :requestUrl="requestUrl"
      :queryParams="queryParams"
      @saveSelectNode="handleSaveSelectNode"
      :multipleSelection="multipleSelection"
      style="height: 100%;flex: 2"
    ></select-tree>
    <!--<el-dialog title="新增子项"  append-to-body :visible.sync="dialogVisible" width="65%">-->
    <div style="flex:3;height: 65vh; overflow: auto">
      <el-form ref="queryForm" :model="queryForm" label-width="80px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="设备名称" prop="devName">
              <el-input v-model="queryForm.devName" plain="true" placeholder="请输入计划名称" />
            </el-form-item>
          </el-col>
          <el-col :span="10" style="margin-left: 20px">
            <el-button
              icon="el-icon-search"
              type="primary"
              class="btn-b"
              @click="getCheckingItemInfo(1)"
            >查询</el-button>
            <el-button class="btn-w" @click="clearSearchBox">清空</el-button>
            <el-button type="primary" @click="save">保存</el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-table stripe border :data="tableData" @selection-change="handleSelectionChange">
        <el-table-column fixed type="selection" width="55"></el-table-column>
        <el-table-column prop="devName" label="设备名称" align="center"></el-table-column>
        <el-table-column prop="partsName" label="保养部位" align="center"></el-table-column>
        <el-table-column prop="projectName" label="保养内容" align="center"></el-table-column>
        <el-table-column prop="methodName" label="保养方法" align="center"></el-table-column>
        <el-table-column prop="criteriaName" label="保养标准" align="center"></el-table-column>
      </el-table>
      <Pagination
        :total="total"
        :page.sync="page.pageNum"
        :limit.sync="page.pageSize"
        @pagination="getCheckingItemInfo"
      />
    </div>
    <!--</el-dialog>-->
  </div>
</template>

<script>
import { getDevTree } from "@/api/device";
import {
  getMaintainItemInfoByDevNo,
  addCheckingTempItem
} from "@/api/dev/devMaintain";
import SelectTree from "@/components/SelectTree";
import Pagination from "@/components/Pagination";
import { isEmptyArray } from "@/utils";

export default {
  name: "CheckingPlanItemsAdd",
  components: {
    SelectTree,
    Pagination
  },
  data() {
    return {
      requestUrl: getDevTree,
      multipleSelection: true, // 树是否支持多选
      selectTreeIds: [], // 弹出设备树多选ID
      dialogVisible: false,
      tableData: [],
      total: 0,
      page: {
        pageNum: 1,
        pageSize: 10
      },
      selectItemIds: [],
      queryForm: {
        devName: "" // 查询设备名称
      },
      queryParams: {
        isMaintain: 1
      }
    };
  },
  props: {
    tempNo: {
      type: String,
      required: true
    }
  },
  watch: {
    tempNo() {
      this.tableData = [];
    }
  },
  methods: {
    getCheckingItemInfo(pageNum) {
      if (pageNum === 1) {
        this.page.pageNum = pageNum;
      }
      const params = {
        ...this.page,
        devNos: this.selectTreeIds,
        ...this.queryForm
      };
      getMaintainItemInfoByDevNo(params)
        .then(response => {
          const result = response.data;
          if (result.success) {
            this.tableData = result.data.rows;
            this.total = result.data.total;
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    handleSaveSelectNode(data) {
      if (!isEmptyArray(data)) {
        this.selectTreeIds = [];
        for (let e of data) {
          this.selectTreeIds.push(e.code);
        }
        this.dialogVisible = true;
        this.getCheckingItemInfo();
      }
    },
    handleSelectionChange(data) {
      if (!isEmptyArray(data)) {
        this.selectItemIds = [];
        for (let e of data) {
          this.selectItemIds.push({
            itemInfoNo: e.itemInfoNo,
            devNo: e.devNo,
            tempNo: this.tempNo
          });
        }
      }
    },
    save() {
      if (isEmptyArray(this.selectItemIds)) {
        this.$message.error("请至少选择一条记录");
        return;
      }
      addCheckingTempItem(this.selectItemIds)
        .then(response => {
          const result = response.data;
          if (result.success) {
            this.$message.success("保存成功");
            this.dialogVisible = false;
            this.$emit("hidenDialog");
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    clearSearchBox() {
      this.$refs["queryForm"].resetFields();
    }
  }
};
</script>
