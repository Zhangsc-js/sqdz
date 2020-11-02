<template>
  <div style="width: 100%;height: 100%">
    <el-form inline ref="queryForm" :model="queryForm" style="margin-left:20px">
      <el-row>
        <el-form-item label="上报日期：" prop="reportStart">
          <el-date-picker
            v-model="queryForm.reportStart"
            style="width:140px"
            type="datetime"
            placeholder="开始日期"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="~" prop="reportEnd" label-width="30px">
          <el-date-picker
            v-model="queryForm.reportEnd"
            style="width:140px"
            type="datetime"
            placeholder="截止日期"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
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
              :key="item.code"
              :label="item.label"
              :value="item.code"
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
    </el-form>
    <el-table
      stripe
      border
      :data="tableData"
      style="width: 100%"
      height="calc(100% - 48px - 60px - 60px)"
    >
      <el-table-column prop="devName" label="设备名称" width="160"></el-table-column>
      <el-table-column prop="partsName" label="部件名称" width="120"></el-table-column>
      <el-table-column prop="projectName" label="项目名称" width="140"></el-table-column>
      <el-table-column prop="orderNo" label="维修单号" align="center" width="120"></el-table-column>
      <el-table-column prop="emergencyGrade" label="紧急等级" align="center" width="80">
        <template slot-scope="scope">
          <jt-badge v-if="scope.row.emergencyGrade === 30" status="unactivated" textValue="普通" />
          <jt-badge v-else-if="scope.row.emergencyGrade === 20" status="warning" textValue="一般" />
          <jt-badge v-else-if="scope.row.emergencyGrade === 10" status="error" textValue="紧急" />
        </template>
      </el-table-column>
      <el-table-column width="100" prop="executorName" label="维修人员" align="center"></el-table-column>
      <el-table-column width="100" prop="applicantName" label="报修人员" align="center"></el-table-column>
      <el-table-column
        prop="reportTime"
        :formatter="formatter"
        label="上报时间"
        align="center"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="processTime"
        :formatter="formatter"
        label="受理时间"
        align="center"
        width="150"
      ></el-table-column>
      <!-- <el-table-column prop="repairBegin" label="维修开始时间" align="center" width="150"></el-table-column>
      <el-table-column prop="repairEnd" label="维修结束时间" align="center" width="150"></el-table-column>-->
      <el-table-column
        prop="realtimeData"
        label="现场情况"
        width="140"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="exceptionReason"
        label="故障原因"
        width="140"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="repairMethod"
        label="维修方法"
        width="140"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column prop="status" label="处理状态" align="center">
        <template slot-scope="scope">
          <jt-badge v-if="scope.row.status === 0" status="unactivated" textValue="待处理" />
          <jt-badge v-else-if="scope.row.status === 1" status="warning" textValue="待维修" />
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
      <el-table-column prop="sourceNo" label="来源单号" align="center" width="150"></el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="220px">
        <template v-slot="scope">
          <el-button type="text" size="small" @click="recordDetails(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :total="total"
      :page.sync="page.pageNum"
      :limit.sync="page.pageSize"
      @pagination="getData"
    />
    <el-dialog title="详情" :visible.sync="dialogVisible" width="65%">
      <component
        :is="comp"
        @hidenDialog="hidenDialog"
        :disabled="disabled"
        :record="record"
        style="height: 60vh;overflow: auto"
      ></component>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import JtBadge from "@/components/JtBadge";
import RecordDetails from "./recordDetails";
import { getDevRepairRecords, getEmgAndType } from "@/api/dev/devRepair";
import { simpleDateFormat } from "@/utils";

export default {
  name: "DevRepairRecord",
  components: {
    Pagination,
    RecordDetails,
    JtBadge
  },
  data() {
    return {
      total: 0,
      comp: RecordDetails,
      page: {
        pageNum: 1,
        pageSize: 10
      },
      tableData: [],
      queryForm: {
        reportStart: null,
        reportEnd: null,
        devName: "",
        emergencyGrade: null,
        status: null,
        orderNo: null
      },
      userMaps: [],
      dialogVisible: false,
      disabled: false,
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
      typeOpts: []
    };
  },
  mounted() {
    this.$nextTick(res => {
      this.getData();
      this.getMapData();
    });
  },
  methods: {
    getData(pageNum) {
      if (pageNum === 1) {
        this.page.pageNum = 1;
      }
      let params = {
        ...this.queryForm,
        ...this.page
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
    recordDetails(row) {
      this.dialogVisible = true;
      this.record = row;
    },
    cellFormat(v, opts) {
      const el = opts.find(e => e.code == v);
      return el == undefined ? v : el.label;
    },
    hidenDialog() {},
    clearSearchBox() {
      this.$refs["queryForm"].resetFields();
      this.getData();
    },
    formatter(r, c, v) {
      return simpleDateFormat(v, "yyyy-MM-dd HH:mm");
    }
  }
};
</script>
