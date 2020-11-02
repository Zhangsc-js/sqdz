<template>
  <div style="width: 100%;">
    <el-form ref="record" :model="record" label-width="120px">
      <el-divider content-position="center">基础信息</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备名称:" prop="devName">
            <span>{{ record.devName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部位名称:" prop="partsName">
            <span>{{ record.partsName }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="项目名称:" prop="projectName">
            <span>{{ record.projectName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="报修人员:" prop="applicant">
            <span>{{ record.applicantName }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="维修单号:" prop="orderNo">
            <span>{{ record.orderNo }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="紧急等级:" prop="emergencyGrade">
            <span>{{ record.emergencyGrade|grade }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="上报时间:" prop="reportTime">
            <span>{{ record.reportTime }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="受理时间:" prop="processTime">
            <span>{{ record.processTime }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <!-- <el-col :span="12">
          <el-form-item label="维修结束时间:" prop="repairEnd" >
            <span>{{ record.repairEnd }}</span>
          </el-form-item>
        </el-col>-->
        <el-col :span="12">
          <el-form-item label="状态:" prop="status">
            <span v-if="record.status == 0">{{ '待处理' }}</span>
            <span v-else-if="record.status == 1">{{ '待维修' }}</span>
            <span v-else-if="record.status == 2">{{ '已关闭' }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="center">异常信息</el-divider>
      <el-row>
        <el-col :span="24">
          <el-form-item label="现场情况:" prop="realtimeData">
            <span>{{ record.realtimeData }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="异常原因:" prop="exceptionReason">
            <span>{{ record.exceptionReason }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="维修方法:" prop="repairMethod">
            <span>{{ record.repairMethod }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider>领用备品备件信息</el-divider>
      <el-table
        stripe
        border
        :data="tableDataSpares"
        style="width: 100%;margin-bottom: 20px"
        highlight-current-row
      >
        <el-table-column prop="sparesCode" label="备品备件编码"></el-table-column>
        <el-table-column prop="sparesName" label="备品备件名称"></el-table-column>
        <el-table-column prop="specification" label="规格"></el-table-column>
        <el-table-column prop="modelNumber" label="型号"></el-table-column>
        <el-table-column prop="quality" label="材质"></el-table-column>
        <el-table-column prop="useQty" label="领用数量"></el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script>
import { getRepairSparesData } from "@/api/dev/devRepair";
export default {
  name: "RecordDetails",
  data() {
    return {
      tableDataSpares: []
    };
  },
  props: {
    record: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  watch: {
    record(obj) {
      this.getRepairSparesData(obj.id);
    }
  },
  methods: {
    getRepairSparesData(id) {
      let param = {
        repairRecordId: id
      };
      getRepairSparesData(param)
        .then(response => {
          const result = response.data;
          if (result.success) {
            this.tableDataSpares = result.data;
            // this.total = result.data.total
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    }
  },
  filters: {
    grade(val) {
      switch (val) {
        case 10:
          return "紧急";
        case 20:
          return "一般";
        case 30:
          return "普通";
      }
    }
  }
};
</script>
