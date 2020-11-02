<template>
  <div style="width: 100%;">
    <el-form inline ref="queryForm" :model="queryForm" style="margin-left:20px">
      <el-row>
        <el-form-item label="维修单生成时间：" prop="startDate">
          <el-date-picker
            v-model="queryForm.startDate"
            style="width:140px"
            type="date"
            placeholder="开始日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="~" prop="endDate" label-width="30px">
          <el-date-picker
            v-model="queryForm.endDate"
            style="width:140px"
            type="date"
            placeholder="截止日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="维修单名称" prop="orderName">
          <el-input clearable v-model="queryForm.orderName" plain="true" placeholder="请输入维修单名称" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryForm.status" prop="status" clearable>
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
            type="primary"
            icon="el-icon-refresh-left"
          >重置</el-button>
          <el-button type="text" @click="showMore=!showMore">
            {{ showMore ? '收起' : '展开' }}
            <i class="el-icon-arrow-down" />
          </el-button>
        </el-form-item>
      </el-row>
      <div v-show="showMore">
        <el-row>
          <el-form-item label="维修人员：" prop="executor">
            <el-select
              v-model="queryForm.executor"
              placeholder="请选择"
              filterable
              style="width: 100%"
              clearable
            >
              <el-option
                v-for="item in executorMap"
                :key="item.code"
                :label="item.label"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="维修单号" prop="orderNo">
            <el-input clearable v-model="queryForm.orderNo" plain="true" placeholder="请输入维修单号" />
          </el-form-item>
        </el-row>
      </div>
      <el-row>
        <el-form-item>
          <el-button
            v-has="'DEV-OPS-REPAIR-ORDER-ADD'"
            type="primary"
            @click="addRepairOrder()"
            icon="el-icon-plus"
          >新增</el-button>
        </el-form-item>
      </el-row>
    </el-form>

    <el-table stripe border :data="tableData" style="width: 100%" highlight-current-row>
      <el-table-column prop="orderNo" label="维修单号" align="center" width="120px"></el-table-column>
      <el-table-column prop="orderName" label="维修单名称" align="center"></el-table-column>
      <el-table-column
        prop="createdOn"
        :formatter="formatter"
        label="生成时间"
        width="160px"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="planFinishTime"
        :formatter="formatter"
        label="计划完成时间"
        width="160px"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="realFinishTime"
        :formatter="formatter"
        label="实际完成时间"
        width="160px"
        align="center"
      ></el-table-column>
      <el-table-column prop="executorName" label="维修员" align="center" width="100px"></el-table-column>
      <el-table-column prop="remarks" label="备注" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" align="center" width="100px">
        <template slot-scope="scope">
          <jt-badge v-if="scope.row.status === -1" status="unactivated" textValue="录入中" />
          <jt-badge v-if="scope.row.status === 0" status="warning" textValue="待执行" />
          <jt-badge v-if="scope.row.status === 1" status="processing" textValue="维修中" />
          <jt-badge v-else-if="scope.row.status === 2" status="success" textValue="已关闭" />
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        align="center"
        label="操作"
        width="220px"
        v-if="hasBtn([
          'DEV-OPS-REPAIR-ORDER-EFFECT',
          'DEV-OPS-REPAIR-ORDER-UPDATE'
        ])"
      >
        <template v-slot="scope">
          <el-button type="text" size="small" @click="orderDetail(scope.row)">详情</el-button>
          <el-button
            type="text"
            size="small"
            v-if="scope.row.status===-1"
            @click="effectRepair(scope.row)"
            v-has="'DEV-OPS-REPAIR-ORDER-EFFECT'"
          >生效</el-button>
          <el-button
            v-if="scope.row.status===-1"
            @click="editDetail(scope.row)"
            type="text"
            size="small"
            v-has="'DEV-OPS-REPAIR-ORDER-UPDATE'"
          >更新</el-button>
          <el-button
            v-if="scope.row.status===-1"
            type="text"
            size="small"
            @click="delRow(scope.row)"
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
    <el-dialog :title="tital" :visible.sync="dialogVisible" width="75%">
      <component
        :is="comp"
        :title="tital"
        @hidenDialog="hidenDialog"
        :disabled="disabled"
        :order="order"
        @open="infoAddDialog=true"
        :count="count"
        @saveSuccess="getData"
      ></component>
    </el-dialog>
    <el-dialog title="新增维修项信息" :visible.sync="infoAddDialog" width="75%">
      <infoAdd @close="close" :count="count"></infoAdd>
    </el-dialog>
  </div>
</template>

<script>
import infoAdd from "./infoAdd";
import Pagination from "@/components/Pagination";
import JtBadge from "@/components/JtBadge";
import orderAdd from "./orderAdd";
import { simpleDateFormat, hasBtn } from "@/utils";
import {
  getDevRepairOrders,
  deleteDevRepairOrders,
  orderDel,
  effectRepair
} from "@/api/dev/devRepair";
import { getRepairUserMap } from "@/api/device";

export default {
  name: "DevRepairOrder",
  components: {
    Pagination,
    orderAdd,
    JtBadge,
    infoAdd
  },
  data() {
    return {
      showMore: false,
      total: 0,
      page: {
        pageNum: 1,
        pageSize: 10
      },
      dialogVisible: false,
      tital: "",
      tableData: [],
      disabled: false,
      comp: orderAdd,
      userMaps: [],
      queryForm: {
        startDate: null,
        endDate: null,
        orderName: null,
        status: null,
        orderNo: null
      },
      order: {},
      executorMap: [],
      options: [
        {
          label: "录入中",
          value: -1
        },
        {
          label: "待执行",
          value: 0
        },
        {
          label: "维修中",
          value: 1
        },
        {
          label: "已关闭",
          value: 2
        }
      ],
      infoAddDialog: false,
      rows: [],
      count: 0
    };
  },
  mounted() {
    this.getExecutor();
    this.getData();
  },
  methods: {
    hasBtn,
    getData(pageNum) {
      if (pageNum === 1) {
        this.page.pageNum = 1;
      }
      const params = {
        ...this.queryForm,
        ...this.page
      };
      getDevRepairOrders(params)
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
    getExecutor() {
      getRepairUserMap()
        .then(response => {
          const result = response.data;
          if (result.success) {
            this.executorMap = result.data.REPAIR_PERSON;
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    addRepairOrder() {
      this.dialogVisible = true;
      this.disabled = false;
      this.order = {};
      this.tital = "新增";
    },
    deleteOrder(orderNo) {
      deleteDevRepairOrders(orderNo)
        .then(response => {
          const result = response.data;
          if (result.success) {
            this.$message.success();
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.erroe(e.message);
        });
    },
    orderDetail(row) {
      this.dialogVisible = true;
      this.disabled = true;
      this.order = row;
      this.tital = "详情";
    },
    editDetail(row) {
      this.dialogVisible = true;
      this.disabled = false;
      this.order = row;
      this.tital = "更新";
      // this.SET_ORDERNO(row.orderNo);
    },
    cellFormat() {},
    hidenDialog() {
      this.dialogVisible = false;
      this.getData();
    },
    clearSearchBox() {
      this.$refs["queryForm"].resetFields();
      this.getData();
    },
    formatter(r, c, v) {
      return simpleDateFormat(v, "yyyy-MM-dd HH:mm");
    },
    close(rows) {
      this.infoAddDialog = false;
      this.count++;
    },
    delRow(row) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          orderDel(row.orderNo).then(res => {
            if (res.data.success) {
              this.$message.success("删除成功");
              this.getData();
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    effectRepair(row) {
      if (row.planFinishTime) {
        const now = new Date();
        const planFinishTime = new Date(row.planFinishTime);
        if (now.getTime() >= planFinishTime.getTime()) {
          this.$message.error("计划完成时间不能是过去时间！");
          return;
        }
      }
      effectRepair(row.id).then(res => {
        if (res.data.success) {
          this.$message.success("生效成功");
          this.getData();
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  }
};
</script>
