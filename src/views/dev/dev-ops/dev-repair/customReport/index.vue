<template>
  <div style="width: 100%;">
    <el-form inline ref="queryForm" :model="queryForm" style="margin-left:20px">
      <el-row>
        <el-form-item label="设备名称" prop="devName">
          <el-input clearable v-model="queryForm.devName" plain="true" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select clearable v-model="queryForm.status" prop="status">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="紧急等级" prop="emergencyGrade">
          <el-select clearable v-model="queryForm.emergencyGrade" prop="emergencyGrade">
            <el-option
              v-for="item in egOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="维修单号" prop="orderNo">
          <el-input clearable v-model="queryForm.orderNo" plain="true" placeholder="请输入维修单号" />
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" class="btn-b" @click="getData(1)">查询</el-button>
          <el-button
            class="btn-w"
            @click="clearSearchBox"
            type="primary"
            icon="el-icon-refresh-left"
          >重置</el-button>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button
            v-has="'DEV-OPS-REPAIR-CUSTOM-ADD'"
            type="primary"
            @click="addRepairRecord()"
            icon="el-icon-plus"
          >新增</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-table stripe border :data="tableData" style="width: 100%">
      <el-table-column prop="devName" label="设备名称" width="120"></el-table-column>
      <el-table-column prop="partsName" label="部件名称" width="120"></el-table-column>
      <el-table-column prop="projectName" label="项目名称" width="120"></el-table-column>
      <el-table-column prop="orderNo" label="维修单号" align="center" width="120"></el-table-column>
      <el-table-column prop="emergencyGrade" label="紧急等级" align="center" width="80">
        <template slot-scope="scope">
          <jt-badge v-if="scope.row.emergencyGrade === 30" status="unactivated" textValue="普通" />
          <jt-badge v-else-if="scope.row.emergencyGrade === 20" status="warning" textValue="一般" />
          <jt-badge v-else-if="scope.row.emergencyGrade === 10" status="error" textValue="紧急" />
        </template>
      </el-table-column>
      <el-table-column
        width="200"
        prop="exceptionReason"
        label="异常原因"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        width="80"
        prop="applicantName"
        label="申请人"
        align="center"
      ></el-table-column>
      <el-table-column prop="reportTime" :formatter="formatter" label="上报时间" align="center" width="150"></el-table-column>
      <el-table-column prop="processTime" :formatter="formatter" label="受理时间" align="center" width="150"></el-table-column>
      <!-- <el-table-column prop="repairBegin" label="维修开始时间" align="center" width="150"></el-table-column>
      <el-table-column prop="repairEnd" label="维修结束时间" align="center" width="150"></el-table-column> -->
      <el-table-column prop="status" label="处理状态" align="center">
        <template slot-scope="scope">
          <jt-badge v-if="scope.row.status === 0" status="unactivated" textValue="待处理" />
          <jt-badge v-else-if="scope.row.status === 1" status="unactivated" textValue="待维修" />
          <jt-badge v-else-if="scope.row.status === 2" status="success" textValue="已关闭" />
        </template>
      </el-table-column>
      <el-table-column
        prop="reportSource"
        label="来源类型"
        align="center"
        :formatter="(r,c,v) => cellFormat(v, typeOpts, 'code')"
        width="150"
      ></el-table-column>
      <!-- <el-table-column prop="sourceNo" label="来源单号" align="center" width="150"></el-table-column> -->
      <el-table-column fixed="right" align="center" label="操作" width="170"         
        v-if="hasBtn([
          'DEV-OPS-REPAIR-CUSTOM-UPDATE',
          'DEV-OPS-REPAIR-CUSTOM-UPDATE'
        ])">
        <template v-slot="scope">
          <el-button
            v-if="scope.row.status === 0"
            type="text"
            size="small"
            v-has="'DEV-OPS-REPAIR-CUSTOM-UPDATE'"
            @click="updateRecord(scope.row)"
          >更新</el-button>
          <el-button
            v-if="scope.row.status === 0"
            type="text"
            size="small"
            v-has="'DEV-OPS-REPAIR-CUSTOM-DELETE'"
            @click="deleteRecord(scope.row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :total="total"
      :page.sync="page.pageNum"
      :limit.sync="page.pageSize"
      @pagination="getData"
    />
    <el-dialog :title="title" :visible.sync="dialogVisible" width="65%">
      <RecordCRU
        @hidenDialog="hidenDialog"
        :record="record"
        :egOptions="egOptions"
        style="height: 40vh;overflow: auto"
      ></RecordCRU>
    </el-dialog>
  </div>
</template>

<script>
import { hasBtn, simpleDateFormat } from "@/utils";
import Pagination from "@/components/Pagination";
import JtBadge from "@/components/JtBadge";
import RecordCRU from "./recordCRU.vue";
import {
  getDevRepairRecords,
  getEmgAndType,
  deleteDevRepairRecord
} from "@/api/dev/devRepair";

export default {
  name: "customReport",
  components: {
    Pagination,
    JtBadge,
    RecordCRU
  },
  data() {
    return {
      total: 0,
      page: {
        pageNum: 1,
        pageSize: 10
      },
      tableData: [],
      queryForm: {
        devName: "",
        emergencyGrade: null,
        status: null,
        orderNo: null
      },
      userMaps: [],
      dialogVisible: false,
      record: null,
      options: [
         {
          label: "待处理",
          value: 0
        },
        {
          label: "待维修",
          value: 1
        },
        {
          label: "已关闭",
          value: 2
        }
      ],
      egOptions: [],
      typeOpts: [],
      title: null
    };
  },
  created() {
    this.$nextTick(res => {
      this.getData();
      this.getMapData();
    });
  },
  methods: {
    hasBtn,
    getData(pageNum) {
      if (pageNum === 1) {
        this.page.pageNum = 1;
      }
      let params = {
        ...this.queryForm,
        ...this.page,
        // 其它
        reportSource: 9
      };
      getDevRepairRecords(params)
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
    getMapData() {
      getEmgAndType().then(res => {
        const result = res.data;
        if (result.success) {
          this.egOptions = result.data.emgGrade;
          this.typeOpts = result.data.sourceType;
        } else {
          this.$message.error(result.message);
        }
      });
    },
    updateRecord(row) {
      this.dialogVisible = true;
      this.record = row;
      this.title = "更新";
    },
    deleteRecord(id) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteDevRepairRecord(id).then(response => {
            const result = response.data;
            if (result.success) {
              this.$message.success("删除成功!");
              this.getData();
            } else {
              this.$message.error(result.message);
            }
          });
        })
        .catch(e => {
          this.$message.info(e);
        });
    },
    addRepairRecord() {
      this.dialogVisible = true;
      this.title = "新增";
      this.record = {};
    },
    hidenDialog() {
      this.dialogVisible = false;
      this.getData();
    },
    cellFormat(v, opts) {
      const el = opts.find(e => e.code == v);
      return el == undefined ? v : el.label;
    },
    clearSearchBox() {
      this.$refs["queryForm"].resetFields();
      this.getData();
    },
    formatter(r, c, v) {
      return simpleDateFormat(v, 'yyyy-MM-dd HH:mm')
    }
  }
};
</script>

<style>
</style>