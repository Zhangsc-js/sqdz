<template>
  <!-- 事件管理 -->
  <div class="eventManagement" style="height:100%">
    <!-- 表单 -->
    <el-form :inline="true" :model="queryForm" class="demo-form-inline" style="margin-left:20px">
      <el-form-item label="事件名称">
        <el-input v-model="queryForm.eventName"></el-input>
      </el-form-item>
      <el-form-item label="所属模块">
        <el-select v-model="queryForm.belongModule" placeholder="请选择">
          <el-option
            v-for="item in belongModule"
            :key="item.code"
            :label="item.label"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"icon="el-icon-search" @click="getData">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格主体 -->
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" style="height:calc(100% - 196px)">
      <el-table :data="ruleForm.tableData" stripe height="100%" highlight-current-row>
        <el-table-column prop="eventCode" label="事件编码" width="180">
          <template v-slot="scope">
            <el-form-item
              :prop="'tableData.' + scope.$index + '.eventCode'"
              :rules="rules.eventCode"
              v-if="scope.row.isAdd"
            >
              <el-input v-model="scope.row.eventCode"></el-input>
            </el-form-item>
            <span v-else>{{ scope.row.eventCode }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="eventName" label="事件名称" width="200">
          <template v-slot="scope">
            <el-form-item
              :prop="'tableData.' + scope.$index + '.eventName'"
              :rules="rules.eventCode"
              v-if="scope.row.seen||scope.row.isAdd"
            >
              <el-input v-model="scope.row.eventName"></el-input>
            </el-form-item>
            <span v-else>{{ scope.row.eventName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="eventDesc" label="事件描述" width="350">
          <template v-slot="scope">
            <el-form-item v-if="scope.row.seen||scope.row.isAdd">
              <el-input v-model="scope.row.eventDesc"></el-input>
            </el-form-item>
            <span v-else>{{ scope.row.eventDesc }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="belongModule" label="所属模块" width="120">
          <template v-slot="scope">
            <el-form-item
              :prop="'tableData.' + scope.$index + '.belongModule'"
              :rules="rules.eventCode"
              v-if="scope.row.seen||scope.row.isAdd"
            >
              <el-select v-model="scope.row.belongModule" placeholder="请选择">
                <el-option
                  v-for="item in belongModule"
                  :key="item.code"
                  :label="item.label"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <span v-else>{{ modul(scope.row.belongModule) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="serviceName" label="服务类名" width="350">
          <template v-slot="scope">
            <el-input v-if="scope.row.seen||scope.row.isAdd" v-model="scope.row.serviceName"></el-input>
            <span v-else>{{scope.row.serviceName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="methodName" label="服务方法名" width="200">
          <template v-slot="scope">
            <el-input v-model="scope.row.methodName" v-if="scope.row.seen||scope.row.isAdd"></el-input>
            <span v-else>{{ scope.row.methodName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="triggerType" label="触发源类型" width="120">
          <template v-slot="scope">
            <el-select v-model="scope.row.triggerType" placeholder="请选择" v-if="scope.row.isAdd">
              <el-option label="定时" value="1"></el-option>
              <el-option label="tag点" value="2"></el-option>
            </el-select>
            <span v-else>{{ scope.row.triggerType=='1'? '定时':'tag点' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="isManualOperation" label="是否可手动触发" width="180">
          <template v-slot="scope">
            <el-select v-model="scope.row.isManualOperation" v-if="scope.row.seen||scope.row.isAdd">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="2"></el-option>
            </el-select>
            <span v-else>{{ scope.row.isManualOperation=='1'?'是':'否' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" fixed="right" width="300px">
          <template v-slot="scope">
            <el-button
              type="text"
              v-if="!scope.row.seen"
              size="small"
              @click="edit(scope.row)"
              v-has="'SYS-EVENT-UPDATE'"
            >更新</el-button>
            <el-button type="text" v-if="scope.row.seen" size="small" @click="save(scope.row)">保存</el-button>
            <el-button type="text" v-if="scope.row.seen" size="small" @click="cancel(scope.row)">取消</el-button>
            <el-button
              type="text"
              v-if="!scope.row.seen"
              size="small"
              @click="trigger(scope.row)"
              v-has="'SYS-EVENT-TRIGGER'"
            >触发源关联</el-button>
            <el-button
              type="text"
              v-if="!scope.row.seen"
              @click="dltEventMain(scope.row.id)"
              size="small"
              v-has="'SYS-EVENT-DELETE'"
            >删除</el-button>
            <el-button
              type="text"
              v-if="!scope.row.seen && scope.row.isManualOperation=='1'"
              @click="openParam(scope.row)"
              size="small"
              v-has="'SYS-EVENT-TRIGGER'"
            >手动触发</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <el-row style="margin:20px">
      <el-button type="primary" icon="el-icon-plus" @click="addEvent" v-has="'SYS-EVENT-ADD'">新增</el-button>
      <el-button
        type="primary"
        icon="el-icon-refresh"
        v-has="'SYS-TAGMNG-TRIGGER-REFRESH'"
        @click="resetRegular"
      >重置定时任务</el-button>
      <el-button
        type="primary"
        icon="el-icon-refresh"
        v-has="'SYS-TAGMNG-REGULAR-REFRESH'"
        @click="resetTrigger"
      >重置TAG点任务</el-button>
    </el-row>
    <!-- 定时 -->
    <el-dialog title="触发源关联-定时" :visible.sync="timingDialog" width="50%" style="height:100%">
      <timing :mainId="mainId" @close="close"></timing>
    </el-dialog>
    <el-dialog title="触发源关联-tag点" :visible.sync="tagDialog" width="80%" style="height:100%">
      <tagDialog :mainId="mainId"></tagDialog>
    </el-dialog>
    <el-dialog title="手动触发-传参设置" :visible.sync="paramDialog" width="50%" style="height:80%">
      <edit-table
        border
        :tableData="paramData"
        @savaData="saveParams"
        style="width: 100%"
        height="calc(100% - 80px)"
        :opts.sync="tableColumnParam"
        pageName="SYS-EVENT_MANUAL_TRIGGER"
      ></edit-table>
      <el-row style="height:15%;padding-top:20px">
        <el-button type="primary" icon="el-icon-check" @click="triggerEventMain">触发</el-button>
      </el-row>
    </el-dialog>
    <!-- 分页 -->
    <pagination
      :total="total"
      :page.sync="page.current"
      :limit.sync="page.size"
      @pagination="getData"
    />
  </div>
</template>

<script>
import EditTable from "@/components/EditTable";
import timing from "./timing";
import tagDialog from "./tagDialog";
import {
  eventMainInit,
  findMainList,
  saveEventMain,
  dltEventMain,
  manualTrigger,
  resetTriggerEventConfig,
  resetRegularEventConfig,
} from "@/api/sys";
import Pagination from "@/components/Pagination";

export default {
  components: {
    timing,
    Pagination,
    tagDialog,
    EditTable
  },
  data() {
    return {
      queryForm: {
        eventName: "",
        belongModule: ""
      },
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      belongModule: [],
      tableData: [],
      paramData: [],
      rules: {
        eventCode: [
          {
            required: true,
            message: "请输入正确的信息",
            trigger: ["blur", "change"]
          }
        ]
      },
      tableColumnParam: [
        {
          type: "input",
          label: "参数代码",
          prop: "paramCode"
        },
        {
          type: "input",
          label: "参数值",
          prop: "paramValue"
        }
      ],
      timingDialog: false,
      tagDialog: false,
      paramDialog: false,
      manualTriggerParam: {},
      mainId: ""
    };
  },
  computed: {
    ruleForm() {
      return {
        tableData: this.tableData
      };
    },
    modul() {
      return function(code) {
        // for (var i = 0; i < 10; i++) {
        //   if (code == this.belongModule[i].code) {
        //     return this.belongModule[i].label;
        //   }
        // }v
        let label = "";
        this.belongModule.forEach(item => {
          if (item.code == code) {
            label = item.label;
          }
        });
        return label;
      };
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      eventMainInit().then(response => {
        let data = response.data;
        if (data.success) {
          this.belongModule = data.data.belongModule;
        }
      });
      this.getData();
    },
    getData() {
      const params = {
        ...this.page,
        ...this.queryForm
      };
      findMainList(params).then(response => {
        let data = response.data;
        if (data.success) {
          this.tableData = data.data.list;
          this.total = data.data.size;
        }
      });
    },
    edit(row) {
      this.$set(row, "seen", true);
    },
    save(row) {
      row.seen = false;
      saveEventMain(row).then(response => {
        let data = response.data;
        if (data.success) {
          this.$message.success("保存成功！！！");
          this.getData();
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
    },
    cancel(row) {
      row.seen = false;
      this.getData();
    },
    dltEventMain(id) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          dltEventMain(id).then(response => {
            if (response.data.success) {
              this.$message.success("删除成功!");
              this.getData();
            } else
              this.$message.error(
                response.data.message + ":" + response.data.data
              );
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    addEvent() {
      this.tableData.push({
        isAdd: true,
        seen: true,
        eventCode: "",
        eventName: "",
        eventDesc: "",
        belongModule: "",
        serviceName: "",
        methodName: "",
        triggerType: "",
        isManualOperation: ""
      });
    },
    trigger(row) {
      this.mainId = row.id;
      let type = row.triggerType;
      if (type === "1") {
        this.timingDialog = true;
      } else if (type === "2") {
        this.tagDialog = true;
      }
    },
    openParam(row) {
      this.paramDialog = true;
      this.paramData = [];
      this.manualTriggerParam = row;
    },
    triggerEventMain() {
      let paramData = {};
      for (let i = 0; i < this.paramData.length; i++) {
        paramData[this.paramData[i].paramCode] = this.paramData[i].paramValue;
      }
      this.manualTriggerParam.paramData = paramData;
      manualTrigger(this.manualTriggerParam).then(response => {
        let data = response.data;
        if (data.success) {
          this.$message.success("手动触发成功！！！");
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
    },
    saveParams(data) {
      this.paramData.push(data);
    },
    close() {
      this.timingDialog = false;
    },
    resetTrigger() {
      resetTriggerEventConfig().then(res => {
        if (res.data.success) {
          this.$message.success("重启成功");
        } else {
          this.$message.error(res.data.success + ":" + res.data.data);
        }
      });
    },
    resetRegular() {
      resetRegularEventConfig().then(res => {
        if (res.data.success) {
          this.$message.success("重启成功");
        } else {
          this.$message.error(res.data.success + ":" + res.data.data);
        }
      });
    }
  }
};
</script>

<style>
.eventManagement .el-dialog {
  height: 100%;
}
</style>
