<template>
  <div style="width: 100%;">
    <el-form inline ref="queryForm" :model="queryForm">
      <el-row>
        <el-form-item label="计划名称" prop="planName">
          <el-input
            clearable
            id="planName"
            v-model="queryForm.planName"
            plain="true"
            placeholder="请输入计划名称"
          />
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
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" class="btn-b" @click="getData(1)">查询</el-button>
          <el-button
            class="btn-w"
            @click="clearSearchBox"
            icon="el-icon-refresh-left"
            type="primary"
          >重置</el-button>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button
            v-has="'DEV-OPS-CHECK-PLAN-ADD'"
            type="primary"
            @click="addCheckingPlan()"
            icon="el-icon-plus"
          >新增</el-button>
        </el-form-item>
      </el-row>
    </el-form>

    <el-table
      stripe
      border
      :data="tableData"
      @selection-change="selsChange"
      style="width: 100%"
      height="500px"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="planName" label="计划名称" align="center"></el-table-column>
      <el-table-column prop="tempName" label="模板名称" align="center"></el-table-column>
      <el-table-column
        prop="executor"
        :formatter="(r,c,v) => cellFormat(v, userMaps, 'code')"
        label="计划执行人"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="frequently"
        :formatter="(r,c,v) => cyclesFormat(v, cycles, 'value')"
        label="点检周期"
        align="center"
      ></el-table-column>
      <el-table-column prop="startTime" label="计划开始时间" align="center"></el-table-column>
      <el-table-column prop="endTime" label="计划结束时间" align="center"></el-table-column>
      <el-table-column prop="status" label="执行状态" align="center">
        <template slot-scope="scope">
          <jt-badge v-if="scope.row.status === 0" status="unactivated" textValue="未执行" />
          <jt-badge v-else-if="scope.row.status === 1" status="processing" textValue="执行中" />
          <jt-badge v-else-if="scope.row.status === 2" status="success" textValue="已完成" />
          <jt-badge v-else-if="scope.row.status === 9" status="error" textValue="已停止" />
        </template>
      </el-table-column>
      <el-table-column
        v-if="hasBtn([
            'DEV-OPS-CHECK-PLAN-ACTIVATE',
            'DEV-OPS-CHECK-PLAN-UPDATE',
            'DEV-OPS-CHECK-PLAN-DELETE',
            'DEV-OPS-CHECK-PLAN-STOP'
          ])"
        fixed="right"
        align="center"
        label="操作"
        width="220px"
        :key="random"
      >
        <template v-slot="scope">
          <el-button
            v-has="'DEV-OPS-CHECK-PLAN-ACTIVATE'"
            v-if="scope.row.status === 0"
            type="text"
            size="small"
            @click="activatedPlan(scope.row)"
          >启动</el-button>
          <el-button type="text" size="small" @click="detailsPlan(scope.row.id)">详情</el-button>
          <el-button
            v-has="'DEV-OPS-CHECK-PLAN-UPDATE'"
            v-if="scope.row.status != 9"
            type="text"
            size="small"
            @click="updatePlan(scope.row.id)"
          >更新</el-button>
          <el-button
            v-has="'DEV-OPS-CHECK-PLAN-DELETE'"
            v-if="scope.row.status === 0"
            type="text"
            size="small"
            @click="deletePlan(scope.row.id)"
          >删除</el-button>
          <el-button
            v-has="'DEV-OPS-CHECK-PLAN-STOP'"
            v-if="scope.row.status === 1"
            type="text"
            size="small"
            @click="stopPlan(scope.row)"
          >停止</el-button>
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
      <component
        :is="dialogForm"
        @hidenDialog="hidenDialog"
        :isRefresh="isRefresh"
        :disabled="disabled"
        :planId="id"
      ></component>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import PlanUD from "./plan-ud";
import PlanAdd from "./plan-add";
import { isEmpty, isEmptyArray, hasBtn } from "@/utils/index";
import {
  getCheckingPlan,
  deleteCheckingPlan,
  batchDelCheckingPlan,
  getCheckingUserMap,
  updateCheckingPlan,
  getCheckingPlanSelectMap
} from "@/api/device";
import JtBadge from "@/components/JtBadge";

export default {
  name: "CheckingPlan",
  components: {
    Pagination,
    JtBadge
  },
  data() {
    return {
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      queryForm: {
        planName: "",
        status: -1
      },
      sels: [], // 选择行数据
      batchBtnVisibles: true,
      tableData: [],
      title: "",
      dialogVisible: false,
      dialogForm: null,
      disabled: null,
      id: null,
      userMaps: [],
      cycles: [],
      isRefresh: false,
      options: [
        {
          label: "全部",
          value: -1
        },
        {
          label: "未执行",
          value: 0
        },
        {
          label: "执行中",
          value: 1
        },
        {
          label: "已过期",
          value: 2
        },
        {
          label: "已停止",
          value: 9
        }
      ],
      random: Math.random()
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getData();
      this.getUserMap();
      this.getCycles();
    });
  },
  methods: {
    hasBtn,
    getData(pageNum) {
      if (pageNum === 1) {
        this.page.pageNum = pageNum;
      }
      let param = Object.assign({}, this.queryForm);
      if (this.queryForm.status == -1) {
        delete param.status;
      }
      const params = {
        ...param,
        ...this.page
      };
      getCheckingPlan(params)
        .then(response => {
          this.tableData = response.data.data.rows;
          this.total = response.data.data.total;
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    addCheckingPlan() {
      (this.isRefresh = !this.isRefresh),
        (this.dialogVisible = true),
        (this.title = "新增"),
        (this.dialogForm = PlanAdd);
    },
    deletePlan(id) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (isEmpty(id)) {
            this.$message.error("请选择要删除的数据");
            return;
          }
          deleteCheckingPlan(id).then(response => {
            const result = response.data;
            if (result.success) {
              this.$message.success("删除成功");
            } else {
              this.$message.error(result.message);
            }
            this.getData(1);
          });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    batchDelete() {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (isEmptyArray(this.sels)) {
            this.$message.error("请选择要删除的数据");
            return;
          }
          batchDelCheckingPlan(this.sels)
            .then(response => {
              const result = response.data;
              if (result.success) {
                this.$message.success("删除成功");
              } else {
                this.$message.error(result.message);
              }
              this.getData(1);
            })
            .catch(e => {
              this.$message.error(e.message);
            });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    getUserMap() {
      getCheckingUserMap()
        .then(response => {
          const result = response.data;
          if (result.success) {
            this.userMaps = result.data;
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    getCycles() {
      getCheckingPlanSelectMap()
        .then(response => {
          const result = response.data;
          if (result.success) {
            this.cycles = result.data.cycles;
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    updatePlan(id) {
      (this.dialogVisible = true),
        (this.title = "更新"),
        (this.disabled = false);
      this.dialogForm = PlanUD;
      this.id = id;
    },
    activatedPlan(row) {
      const plan = {
        ...row,
        status: 1
      };
      if (new Date(plan.endTime).getTime() < Date.now()) {
        this.$message.error("计划结束时间不能是过去时间！");
        return;
      }
      updateCheckingPlan(plan)
        .then(response => {
          const result = response.data;
          if (result.success) {
            this.$message.success("已启动");
            this.getData();
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    stopPlan(row) {
      this.$confirm(
        "您确定要停止任务吗？停止后数据只能查看, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          const plan = {
            ...row,
            status: 9
          };
          updateCheckingPlan(plan)
            .then(response => {
              const result = response.data;
              if (result.success) {
                this.$message.success("已停止");
                this.getData();
              } else {
                this.$message.error(result.message);
              }
            })
            .catch(e => {
              this.$message.error(e.message);
            });
        })
        .catch(e => {
          this.$message.info("已取消");
        });
    },
    detailsPlan(id) {
      (this.dialogVisible = true), (this.disabled = true);
      (this.title = "详情"), (this.dialogForm = PlanUD);
      this.id = id;
    },
    hidenDialog() {
      this.dialogVisible = false;
      this.getData();
    },
    selsChange: function(sels) {
      this.sels.length = 0;
      const _this = this;
      sels.forEach(element => {
        _this.sels.push(element.id);
      });
      this.batchBtnVisibles = this.sels.length === 0;
    },
    clearSearchBox() {
      this.$refs["queryForm"].resetFields();
      this.getData();
      this.getUserMap();
      this.getCycles();
    },
    cellFormat(v, opts, prop) {
      if (isEmptyArray(opts) || isEmpty(v)) {
        return v;
      }
      const el = opts.find(e => e[prop] == v);
      return el == undefined ? v : el.label;
    },
    cyclesFormat(v, opts, prop) {
      if (isEmptyArray(opts) || isEmpty(v)) {
        return v;
      }
      const val = v.split(",");
      let label = "";
      opts.forEach(e => {
        if (val.indexOf(e[prop]) != -1) {
          label += e.label + ",";
        }
      });
      return label.substring(0, label.length - 1);
    }
  },
  activated() {
    this.random = Math.random();
  }
};
</script>
<style lang="scss" scoped>
.el-form .el-col .el-button {
  margin: 12px 4px 0px 4px;
}
</style>
