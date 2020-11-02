<template>
  <div style="width: 100%">
    <el-form ref="queryForm" :model="queryForm" label-width="80px" class="margin20 mb0">
      <el-row>
        <el-col :span="8">
          <el-form-item label="设备名称" prop="devName">
            <el-input v-model="queryForm.devName" plain="true" placeholder="请输入设备名称" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button
            icon="el-icon-search"
            href="javascript:void(0)"
            type="primary"
            @click="getData(1)"
          >查询</el-button>
          <el-button href="javascript:void(0)" @click="clearSearchBox">清空</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-button
      icon="el-icon-plus"
      href="javascript:void(0)"
      type="primary"
      :disabled="batchBtnVisable"
      @click="report()"
    >报修</el-button>
    <el-table
      stripe
      border
      :data="tableData"
      @selection-change="handleSelectionChange"
      style="width: 100%"
    >
      <el-table-column fixed type="selection" width="55"></el-table-column>
      <el-table-column prop="item.devName" label="设备名称"></el-table-column>
      <el-table-column prop="item.partsName" label="部件名称"></el-table-column>
      <el-table-column prop="item.projectName" label="项目名称"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 9">
            <jt-badge status="error" textValue="异常" />
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="eg" label="紧急状态">
        <template slot-scope="scope">
          <el-select v-model="scope.row.emergencyGrade" prop="emergencyGrade">
            <el-option
              v-for="item in options"
              :key="item.code"
              :label="item.label"
              :value="item.code"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="80px">
        <template v-slot="scope">
          <el-button type="text" size="small" @click="detailsRecordItem(scope.row.id)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :total="total"
      :page.sync="page.pageNum"
      :limit.sync="page.pageSize"
      @pagination="getData"
    />
    <div slot="footer" class="dialog-footer">
      <div style="padding-bottom: 48px"></div>
    </div>
    <el-dialog title="记录详情" :visible.sync="dialogVisible" width="65%" append-to-body>
      <item-info
        :recordItemId="recordItemId"
        @hidenDialog="hidenDialog"
        style="height: 60vh;overflow: auto;"
      />
    </el-dialog>
  </div>
</template>

<script>
import { getExceptionRecordItems, reportExceptionRecord } from "@/api/device";

import { getEmergencyGrade } from "@/api/dev/devRepair";
import Pagination from "@/components/Pagination";
import ItemInfo from "./item-info";
import JtBadge from "@/components/JtBadge";
import { isEmptyArray } from "@/utils/index";

export default {
  name: "RecordItem",
  components: {
    Pagination,
    ItemInfo,
    JtBadge
  },
  data() {
    return {
      page: {
        pageNum: 1,
        pageSize: 10
      },
      queryForm: {
        devName: ""
      },
      tableData: [],
      total: 0,
      recordItemId: null,
      dialogVisible: false,
      selectData: [],
      batchBtnVisable: true,
      options: []
    };
  },
  props: {
    recordNo: {
      type: String,
      required: true
    }
  },
  watch: {
    recordNo() {
      this.getData();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getData();
      this.getEmergencyGrade();
    });
  },
  methods: {
    getData(pageNum) {
      if (pageNum === 1) {
        this.page.pageNum = pageNum;
      }
      const params = {
        ...this.page,
        ...this.queryForm,
        checkingRecordNo: this.recordNo
      };
      getExceptionRecordItems(params)
        .then(response => {
          const result = response.data;
          if (result.success && result.data) {
            this.total = result.data.total;
            // 紧急等级设置为“普通” 30
            this.tableData = result.data.rows.map(e => {
              return Object.assign({}, e, { emergencyGrade: "20" });
            });
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    getEmergencyGrade() {
      getEmergencyGrade().then(response => {
        const result = response.data;
        if (result.success) {
          this.options = result.data;
        } else {
          this.$message.error(result.message);
        }
      });
    },
    handleSelectionChange(data) {
      this.selectData = data;
      this.batchBtnVisable = isEmptyArray(this.selectData);
    },
    report() {
      reportExceptionRecord(this.selectData).then(response => {
        const result = response.data;
        if (result.success) {
          this.page.pageNum = 1;
          this.$message.success("报修成功！");
          this.getData();
          this.$emit("hidenDialog");
        } else {
          this.$message.error(result.message);
        }
      });
    },
    detailsRecordItem(id) {
      this.recordItemId = id;
      this.dialogVisible = true;
    },
    hidenDialog() {
      this.dialogVisible = true;
    },
    clearSearchBox() {
      this.$refs["queryForm"].resetFields();
    }
  }
};
</script>
