<template>
  <div class="ss_record" style="height:calc(100% - 25px)">
    <!-- 查询表单 -->
    <el-form
      ref="queryForm"
      :inline="true"
      :model="queryForm"
      class="demo-form-inline"
      style="padding-left:20px"
    >
      <el-row>
        <el-form-item label="停机时间：" prop="startDate">
          <el-date-picker
            v-model="queryForm.startDate"
            type="datetime"
            placeholder="开始日期"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="~" prop="endDate" label-width="30px">
          <el-date-picker
            v-model="queryForm.endDate"
            type="datetime"
            placeholder="截止日期"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="reason">
          <el-checkbox v-model="queryForm.reason">未确认停机原因</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="query(1)">查询</el-button>
          <el-button type="primary" icon="el-icon-document" @click="exportData">导出</el-button>
          <el-button type="primary" @click="resetQuery" icon="el-icon-refresh-left">重置</el-button>
          <el-button type="text" @click="showMore=!showMore">
            {{showMore?'收起':'展开'}}
            <i :class="showMore?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
          </el-button>
        </el-form-item>
      </el-row>
      <el-row v-if="showMore">
        <el-form-item label="设备编码" prop="devCode">
          <el-input v-model="queryForm.devCode" placeholder></el-input>
        </el-form-item>
        <el-form-item label="设备名称" prop="devName">
          <el-input v-model="queryForm.devName" placeholder></el-input>
        </el-form-item>
        <el-form-item label="监控点位" prop="monitorTag">
          <el-input v-model="queryForm.monitorTag" placeholder></el-input>
        </el-form-item>
        <el-form-item label="停机原因" prop="offReasonCode">
          <el-select v-model="queryForm.offReasonCode" clearable placeholder="请选择停机原因">
            <el-option
              v-for="item in offReasonCodes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-row>
    </el-form>
    <!-- 表格 -->
    <EditTable
      pageName="LIMS-REMARK"
      :tableData="tableData"
      :opts="opts"
      :showDelBtn="false"
      showOptBtn
      :page="page"
      :total="total"
      :pageSizes="pageSizes"
      :showAddBtn="false"
      @savaData="updateOnOff"
      @getData="query"
      :height="showMore?'calc(100% - 104px)':'calc(100% - 52px)'"
    ></EditTable>
  </div>
</template>

<script>
import EditTable from "@/components/EditTable";
import { simpleDateFormat } from "@/utils/index";
import { getDevOnOffRecord, updateOnOff, initOnOffData } from "@/api/sys/dev";
import { exportExcel, resetQueryForm } from "@/utils/common";

export default {
  components: {
    EditTable
  },
  data() {
    return {
      showMore: true,
      tableData: [],
      offReasonCodes: [],
      queryForm: {
        reason: false,
        devCode: "",
        devName: "",
        monitorTag: "",
        offReasonCode: "",
        startDate: "",
        endDate: ""
      },
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      pageSizes: [10, 50, 100],
      opts: [
        { prop: "devCode", label: "设备编码" },
        { prop: "devName", label: "设备名称" },
        { prop: "monitorTag", label: "监控点位" },
        {
          prop: "offTime",
          label: "停机时间"
        },
        {
          prop: "onTime",
          label: "开机时间"
        },
        { prop: "continuedTime", label: "停机持续时间(分钟)" },
        {
          prop: "offReasonCode",
          label: "停机原因",
          type: "select",
          options: []
        }
      ]
    };
  },
  created() {
    initOnOffData().then(response => {
      this.offReasonCodes = response.data.data.DEV_ON_OFF_REASON.map(item => {
        return {
          label: item.label,
          value: item.code
        };
      });
      this.opts[this.opts.length - 1].options = this.offReasonCodes;
      this.query();
    });
  },
  methods: {
    getData() {},
    resetQuery() {
      resetQueryForm(this, "queryForm", "query");
    },
    query(type) {
      // 若是查询 重置分页
      if (type == 1) {
        this.page.pageNum = 1;
      }
      // const qfrom = {
      //     reason: this.queryForm.reason,
      //     devCode: this.queryForm.devCode,
      //     devName: this.queryForm.devName,
      //     monitorTag: this.queryForm.monitorTag,
      //     offReasonCode: this.queryForm.offReasonCode
      // }
      const params = {
        ...this.page,
        ...this.queryForm
      };

      getDevOnOffRecord(params).then(response => {
        let data = response.data;
        if (data.success) {
          this.total = data.data.total;
          this.tableData = data.data.rows;
          this.tableData.forEach(item => {
            let onTime = item.onTime == null ? new Date() : item.onTime;
            let offTime = item.offTime;
            item.continuedTime = (
              (new Date(onTime).getTime() - new Date(offTime).getTime()) /
              1000 /
              60
            ).toFixed(1);
          });
        } else {
          this.$message.error(data.message + ":" + data.data);
        }
      });
    },
    updateOnOff(row) {
      updateOnOff(row).then(response => {
        let data = response.data;
        if (data.success) {
          this.$message.success("修改成功！！");
          this.query();
        } else {
          this.$message.error(data.$message + ":" + data.data);
        }
      });
    },
    exportData() {
      let exportData = [];
      const fields = {
        devCode: "设备编码",
        devName: "设备名称",
        monitorTag: "监控点位",
        offTime: "停机时间",
        onTime: "开机时间",
        continuedTime: "停机持续时间(分钟)",
        offReasonCode: "停机原因"
      };
      const fileName = "设备开停记录";

      // const qfrom = {
      //     reason: this.queryForm.reason,
      //     devCode: this.queryForm.devCode,
      //     devName: this.queryForm.devName,
      //     monitorTag: this.queryForm.monitorTag,
      //     offReasonCode: this.queryForm.offReasonCode
      // }
      const qpage = {
        pageNum: 1,
        pageSize: 1000
      };
      const params = {
        ...qpage,
        ...this.queryForm
      };
      getDevOnOffRecord(params)
        .then(response => {
          exportData = response.data.data.rows;
          exportData.forEach(item => {
            let onTime = item.onTime == null ? new Date() : item.onTime;
            let offTime = item.offTime;
            item.continuedTime = (
              (new Date(onTime).getTime() - new Date(offTime).getTime()) /
              1000 /
              60
            ).toFixed(1);
            for (let i = 0; i < this.offReasonCodes.length; i++) {
              if (this.offReasonCodes[i].value === item.offReasonCode) {
                item.offReasonCode = this.offReasonCodes[i].label;
                continue;
              }
            }
          });
          exportExcel(fileName, fields, exportData);
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    }
  }
};
</script>

<style>
</style>
