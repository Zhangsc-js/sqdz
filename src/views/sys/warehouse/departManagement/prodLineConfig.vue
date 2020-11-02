<template>
  <div style="height: 100%;" class='prodlineConfig'>
    <!-- 产线配置 -->
    <edit-table
      :tableData="prodLineData"
      :opts="prodLineOpts"
      height="300px"
      pageName="SYS-DEPART-PORD-LINE"
      @jc-row-click="prodLineRowClick"
      @deleteRow="prodLineDelete"
      @savaData="prodLineSave"
    ></edit-table>
    <!-- 工序配置 -->
    <edit-table
      class="table-padd"
      :tableData="processData"
      :opts="processOpts"
      height="300px"
      :showAddBtn="false"
      pageName="SYS-DEPART-PORD-LINE"
      @jc-row-click="processRowClick"
      @deleteRow="processDelete"
      @savaData="processUpdate"
    >
      <template v-slot:header>
        <el-button
          class="edit-table-class btn-add"
          type="primary"
          icon="el-icon-plus"
          v-has="'SYS-DEPART-PORD-LINE-SAVE'"
          @click="addLineProcess()"
        >新增</el-button>
      </template>
    </edit-table>
    <el-tabs type="card" class="table-padd">
      <el-tab-pane label="工位" style="height: 100%">
        <!-- 工位配置 -->
        <edit-table
          :tableData="workplaceData"
          :opts="workplaceOpts"
          height="80%"
          pageName="SYS-DEPART-PORD-LINE"
          @savaData="stationSave"
        ></edit-table>
      </el-tab-pane>
      <el-tab-pane label="设备" style="height: 100%">
        <!-- 设备配置 -->
        <edit-table
          :tableData="deviceData"
          :opts="deviceOpts"
          :showUpdateBtn="false"
          :showAddBtn="false"
          height="80%"
          @deleteRow="deviceDelete"
          pageName="SYS-DEPART-PORD-LINE"
        >
          <template v-slot:header>
            <el-button
              class="edit-table-class btn-add"
              type="primary"
              icon="el-icon-plus"
              v-has="'SYS-DEPART-PORD-LINE-SAVE'"
              @click="addProcessDevice()"
            >新增</el-button>
          </template>
        </edit-table>
      </el-tab-pane>
    </el-tabs>
    <!-- 对话框 -->
    <el-dialog title="新增工序" style="height:100%" :visible.sync="dialogVisible" width="50%">
      <add-pro @save="processSave" :departCode="departCode"></add-pro>
    </el-dialog>
    <!-- 设备选择 -->
    <el-dialog title="设备选择" :visible.sync="deviceDialogVisible" width="60%">
      <el-form inline ref="mainInfo" :model="inqu" label-width="100px">
        <el-row>
          <el-form-item label="设备编码：" prop="devCode">
            <el-input v-model="inqu.devCode" />
          </el-form-item>
          <el-form-item label="设备名称：" prop="devName">
            <el-input v-model="inqu.devName" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary " icon="el-icon-search" @click="queryDevList(true)">查询</el-button>
            <el-button type="primary" icon="el-icon-delete" @click="clear">清空</el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <el-table
        ref="dialogTable"
        stripe
        :data="dialogTableData"
        style="width: 100%;"
        height="300px"
        @selection-change="selectionChangeDialog"
      >
        <el-table-column type="selection" width="55px"></el-table-column>
        <el-table-column prop="proccode" align="center" label="设备编码"></el-table-column>
        <el-table-column prop="name" align="center" label="设备名称"></el-table-column>
        <el-table-column prop="issproduction" align="center" label="是否生产设备"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <Pagination
          :total="dialogTableTotal"
          :page.sync="dialogTablePage.pageNum"
          :limit.sync="dialogTablePage.pageSize"
          @pagination="queryDevList(false)"
        />
        <el-button type="primary " icon="el-icon-check" @click="confirmSelect">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import Pagination from "@/components/Pagination";
import EditTable from "@/components/EditTable";
import AddPro from "./addPro";
import {
  getDepartmentLine,
  saveDepartmentLine,
  updateDepartmentLine,
  delDepartmentLine,
  getLineProcess,
  saveLineProcess,
  updateLineProcess,
  delLineProcess,
  getProcessStation,
  saveProcessStation,
  updateProcessStation,
  delProcessStation,
  getProcessDevice,
  saveProcessDevice,
  delProcessDevice
} from "@/api/sys/departMentProcess";
import { queryDevList } from "@/api/ppc.process";

export default {
  components: {
    EditTable,
    AddPro,
    Pagination
  },
  data() {
    return {
      prodLineData: [],
      prodLineOpts: [
        {
          prop: "lineCode",
          label: "产线编码",
          type: "input"
        },
        {
          prop: "lineName",
          label: "产线名称",
          type: "input"
        }
      ],
      processData: [],
      processOpts: [
        {
          type: "input",
          prop: "sort",
          label: "序号"
        },
        {
          prop: "processCode",
          label: "工序编码"
        },
        {
          prop: "processName",
          label: "工序名称"
        }
      ],
      workplaceData: [],
      workplaceOpts: [
        {
          type: "input",
          prop: "stationCode",
          label: "工位编码"
        },
        {
          type: "input",
          prop: "stationName",
          label: "工位名称"
        },
        {
          type: "input",
          prop: "stationIp",
          label: "工位IP"
        },
        {
          prop: "userName",
          label: "操作员"
        },
      ],
      deviceData: [],
      deviceOpts: [
        {
          prop: "deviceName",
          label: "设备名称"
        },
        {
          prop: "deviceCode",
          label: "设备编码"
        }
      ],
      sleLineCode: null,
      selProcessCode: null,
      dialogVisible: false,
      deviceDialogVisible: false,
      inqu: {
        devCode: "",
        devName: ""
      },
      dialogTableData: [],
      dialogTableTotal: 0,
      dialogTablePage: {
        pageNum: 1,
        pageSize: 10
      },
      selectedDevDialog: []
    };
  },
  props: {
    departCode: {
      type: String,
      required: true
    },
    activeName: {
      type: String,
      required: true
    }
  },
  watch: {
    departCode() {
      if (this.departCode && this.activeName === "2") {
        this.getData();
      }
    },
    activeName() {
      if (this.departCode && this.activeName === "2") {
        this.getData();
      }
    }
  },
  methods: {
    getData() {
      if (!this.departCode) {
        return
      }
      getDepartmentLine({ departCode: this.departCode }).then(response => {
        const result = response.data;
        if (result.success) {
          this.prodLineData = result.data;
        } else {
          this.$message.error(result.message);
        }
      });
    },
    getLineProcessData() {
      if (!this.sleLineCode) {
        return
      }
      const param = {
        lineCode: this.sleLineCode
      };
      getLineProcess(param).then(res => {
        const result = res.data;
        if (result.success) {
          this.processData = result.data;
          this.workplaceData = [];
        } else {
          this.$message.error(result.message);
        }
      });
    },
    getProcessStationData() {
      if (!this.selProcessCode || !this.sleLineCode) {
        return
      }
      const param = {
        processCode: this.selProcessCode,
        lineCode: this.sleLineCode
      };
      getProcessStation(param).then(res => {
        const result = res.data;
        if (result.success) {
          this.workplaceData = result.data;
        } else {
          this.$message.error(result.message);
        }
      });
    },
    getProcessDeviceData() {
      const param = {
        processCode: this.selProcessCode,
        lineCode: this.sleLineCode
      };
      getProcessDevice(param).then(res => {
        const result = res.data;
        if (result.success) {
          this.deviceData = result.data;
        } else {
          this.$message.error(result.message);
        }
      });
    },
    prodLineSave(data) {
      if (!this.departCode) {
        this.$message.error("请先选择一个车间！");
        return;
      }
      if (!data.lineCode) {
        this.$message.error("产线编码不能为空！");
        return;
      }
      if (!data.lineName) {
        this.$message.error("产线名称不能为空！");
        return;
      }
      if (data && data.id) {
        updateDepartmentLine(data).then(response => {
          const result = response.data;
          if (result.success) {
            this.$message.success("保存成功！");
            this.getData();
          } else {
            this.$message.error(result.message);
          }
        });
      } else {
        const record = {
          ...data,
          departCode: this.departCode
        };
        saveDepartmentLine(record).then(response => {
          const result = response.data;
          if (result.success) {
            this.$message.success("保存成功！");
            this.getData();
          } else {
            this.$message.error(result.message);
          }
        });
      }
    },
    processUpdate(data) {
      updateLineProcess(data).then(response => {
        const result = response.data;
        if (result.success) {
          this.$message.success("保存成功！");
          this.getLineProcessData();
        } else {
          this.$message.error(result.message);
        }
      });
    },
    processSave(data) {
      if (!this.sleLineCode) {
        this.$message.error("请先选择一个产线！");
        return;
      }
      const record = [];
      data.forEach(e => {
        record.push({
          lineCode: this.sleLineCode,
          processCode: e.processCode
        });
      });
      saveLineProcess(record).then(response => {
        const result = response.data;
        if (result.success) {
          this.$message.success("保存成功！");
          this.dialogVisible = false;
          this.getLineProcessData();
        } else {
          this.$message.error(result.message);
        }
      });
    },
    stationSave(data) {
      if (!this.sleLineCode) {
        this.$message.error("请先选择一个产线！");
        return;
      }
      if (!this.selProcessCode) {
        this.$message.error("请先选择一个工序！");
        return;
      }
      if (!data.stationCode) {
        this.$message.error("工位编码不能为空！");
        return;
      }
      if (!data.stationName) {
        this.$message.error("工位名称不能为空！");
        return;
      }
      if (data && data.id) {
        updateProcessStation(data).then(response => {
          const result = response.data;
          if (result.success) {
            this.$message.success("保存成功！");
            this.getProcessStationData();
          } else {
            this.$message.error(result.message);
          }
        });
      } else {
        const record = {
          ...data,
          lineCode: this.sleLineCode,
          processCode: this.selProcessCode
        };
        saveProcessStation(record).then(response => {
          const result = response.data;
          if (result.success) {
            this.$message.success("保存成功！");
            this.getProcessStationData();
          } else {
            this.$message.error(result.message);
          }
        });
      }
    },
    prodLineDelete(id) {
      delDepartmentLine(id).then(response => {
        const result = response.data;
        if (result.success) {
          this.$message.success("删除成功！");
          this.getData();
          this.processData = [];
          this.workplaceData = [];
        } else {
          this.$message.error(result.message);
        }
      });
    },
    processDelete(id) {
      delLineProcess(id).then(response => {
        const result = response.data;
        if (result.success) {
          this.$message.success("删除成功！");
          this.getLineProcessData();
          this.workplaceData = [];
        } else {
          this.$message.error(result.message);
        }
      });
    },
    stationDelete(id) {
      delProcessStation(id).then(response => {
        const result = response.data;
        if (result.success) {
          this.$message.success("删除成功！");
          this.getProcessStationData();
        } else {
          this.$message.error(result.message);
        }
      });
    },
    deviceDelete(id) {
      delProcessDevice(id).then(response => {
        const result = response.data;
        if (result.success) {
          this.$message.success("删除成功！");
          this.getProcessDeviceData();
        } else {
          this.$message.error(result.message);
        }
      });
    },
    prodLineRowClick(data) {
      this.sleLineCode = data.lineCode;
      this.getLineProcessData();
    },
    processRowClick(data) {
      this.selProcessCode = data.processCode;
      this.getProcessStationData();
      this.getProcessDeviceData();
    },
    addLineProcess() {
      this.dialogVisible = true;
    },
    addProcessDevice() {
      this.deviceDialogVisible = true;
      this.queryDevList(false);
    },
    queryDevList(flag) {
      //   若点击查询 重置当前页
      if (flag) {
        this.dialogTablePage.pageNum = 1;
      }
      let param = {
        ...this.inqu,
        ...this.dialogTablePage
      };

      queryDevList(param)
        .then(response => {
          if (response.data.success) {
            let data = response.data.data.rows;
            this.dialogTableData = data;
            this.dialogTableTotal = response.data.data.total;
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
    confirmSelect() {
      if (!this.sleLineCode) {
        this.$message.error("请先选择一个产线！");
        return;
      }
      if (!this.selProcessCode) {
        this.$message.error("请先选择一个工序！");
        return;
      }
      const record = [];
      this.selectedDevDialog.forEach(e => {
        record.push({
          lineCode: this.sleLineCode,
          processCode: this.selProcessCode,
          deviceCode: e
        });
      });
      saveProcessDevice(record).then(response => {
        const result = response.data;
        if (result.success) {
          this.$message.success("保存成功！");
          this.deviceDialogVisible = false;
          this.getProcessDeviceData();
        } else {
          this.$message.error(result.message);
        }
      });
    },
    selectionChangeDialog(obj) {
      this.selectedDevDialog = [];
      for (let i = 0; i < obj.length; i++) {
        this.selectedDevDialog.push(obj[i].proccode);
      }
    },
    clear() {
      this.$refs["mainInfo"].resetFields();
      this.queryDevList();
    }
  }
};
</script>

<style>
.prodlineConfig .table-padd {
  padding-top: 10px;
  height: 300px;
}
</style>
