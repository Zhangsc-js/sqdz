<template>
  <div style="height: calc(100% - 25px)">
    <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
      <el-form-item label="销售订单号" prop="soNo">
        <el-input v-model="queryForm.soNo" placeholder="请输入销售订单号" clearable></el-input>
      </el-form-item>
      <el-form-item label="销售订单号" prop="soName">
        <el-input v-model="queryForm.soName" placeholder="请输入销售订单名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="销售部门：" prop="departCode">
        <el-select
          v-model="queryForm.departCode"
          filterable
          placeholder="请选择"
          style="width: 100%"
          @change="selectChanged"
        >
          <el-option v-for="item in devMap" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业务员：" prop="salesPersonCode">
        <el-select
          v-model="queryForm.salesPersonCode"
          filterable
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option
            v-for="item in userList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getData(1)">查询</el-button>
        <el-button type="primary" icon="el-icon-refresh-left" @click="resetForm('queryForm')">重置</el-button>
        <el-button type="text" @click="showMore=!showMore">
          {{ showMore ? '收起' : '展开' }}
          <i
            :class="showMore ?'el-icon-arrow-up':'el-icon-arrow-down'"
          />
        </el-button>
      </el-form-item>
      <!-- 折叠板中的内容 -->
      <span v-show="showMore">
        <el-row>
          <el-form-item label="采购商" prop="customerLinkPersonName">
            <el-input v-model="queryForm.customerLinkPersonName" placeholder="请输入采购商" clearable></el-input>
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-select v-model="queryForm.status" clearable filterable placeholder="请选择">
              <el-option
                v-for="item in SALE_STATUS"
                :key="item.code"
                :label="item.label"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="交货日期" prop="startData">
            <el-date-picker
              type="date"
              v-model="queryForm.startData"
              value-format="yyyy-MM-dd"
              :disabled="disabled"
              clearable
            />
            <span style="margin-left:5px">~</span>
          </el-form-item>
          <el-form-item prop="endData">
            <el-date-picker
              type="date"
              v-model="queryForm.endData"
              value-format="yyyy-MM-dd"
              :disabled="disabled"
              clearable
            />
          </el-form-item>
        </el-row>
      </span>
    </el-form>
    <el-table
      highlight-current-row
      :data="mainTable"
      stripe
      border
      height="calc(100% - 52px - 50px - 12px - 12px)"
      style=" width: 100%"
    >
      <el-table-column prop="soNo" label="订单号" width="170px"></el-table-column>
      <el-table-column prop="soName" label="销售订单名称"></el-table-column>
      <el-table-column prop="receiveDate" label="下单日期" width="150px"></el-table-column>
      <el-table-column prop="deliveryDate" label="交货日期" width="150px"></el-table-column>
      <el-table-column prop="departName" label="销售部门" width="150px"></el-table-column>
      <el-table-column prop="salesPersonName" label="业务员" width="80px"></el-table-column>
      <el-table-column prop="deliveryDate" label="交货日期" width="120px"></el-table-column>
      <el-table-column prop="customerName" label="采购商名称" width="150px"></el-table-column>
      <el-table-column prop="customerLinkPersonName" label="采购商联系人" width="100px"></el-table-column>
      <el-table-column prop="customerLinkPhone" label="联系方式" width="100px"></el-table-column>
      <el-table-column prop="status" label="状态" width="100px">
        <template v-slot="scope">
          <span v-if="scope.row.status == 10">
            <jt-badge status="warning" :textValue="scope.row.statusName" />
          </span>
          <span v-else-if="scope.row.status == 50">
            <jt-badge status="success" :textValue="scope.row.statusName" />
          </span>
          <span v-else>
            <jt-badge status="processing" :textValue="scope.row.statusName" />
          </span>
        </template>
      </el-table-column>

      <div>
        <el-table-column fixed="right" align="center" label="操作" width="150px">
          <template v-slot="scope">
            <el-button type="text" size="small" @click="update(scope.row)">订单明细</el-button>
            <el-button
              type="text"
              size="small"
              @click="deleteById(scope.row)"
              v-if="scope.row.status<=10"
            >删除</el-button>
          </template>
        </el-table-column>
      </div>
    </el-table>
    <el-button type="primary" icon="el-icon-plus" @click="detaddSale">新增</el-button>
    <Pagination
      :total="total"
      :page.sync="page.current"
      :limit.sync="page.size"
      @pagination="getData"
    />
    <el-dialog @close="getData" :title="title" :visible.sync="addDialogVisible" width="70%">
      <addSaleMain
        @save="hidenDialog"
        @cancel="hidenDialogCancel"
        @getIdAndType="getIdAndType"
        :trigger="addDialogVisible"
        :type="type"
        :id="saleId"
        :sId="staId"
      />
    </el-dialog>
  </div>
</template>
<script>
import {
  getSaleMainAll,
  selectDepart,
  getSaleStatus,
  deleteById
} from "@/api/productionPlanning";
import { resetQueryForm } from "@/utils/common";
import Pagination from "@/components/Pagination";
import { sltUserByDepartId } from "@/api/sys";
import addSaleMain from "./addSaleMain";
import JtBadge from "@/components/JtBadge";

export default {
  components: {
    Pagination,
    addSaleMain,
    JtBadge
  },
  data() {
    return {
      queryForm: {
        soNo: "",
        soName: "",
        departCode: "",
        salesPersonCode: "",
        startData: "",
        endData: "",
        status: "",
        customerLinkPersonName: ""
      },
      mainTable: [],
      SALE_STATUS: [],
      page: {
        current: 1,
        pageSize: 10
      },
      total: 0,
      showMore: false,
      disabled: false,
      devMap: [],
      userList: [],
      addDialogVisible: false,
      title: "",
      id: "",
      type: "",
      saleId: "",
      staId: ""
    };
  },

  methods: {
    initData() {
      selectDepart()
        .then(response => {
          const result = response.data;
          if (result.success) {
            this.devMap = result.data;
            this.getData();
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
      getSaleStatus().then(response => {
        if (response.data.success) {
          this.SALE_STATUS = response.data.data.SALE_STATUS;
        }
      });
    },
    update(data) {
      this.title = "订单明细";
      this.type = "2";
      this.saleId = data.id;
      this.staId = data.status;
      this.addDialogVisible = true;
    },
    getData(current) {
      if (current === 1) {
        this.page.current = current;
      }
      const params = {
        ...this.page,
        ...this.queryForm
      };
      getSaleMainAll(params).then(response => {
        if (response.data.success) {
          let data = response.data.data;
          for (let i = 0; i < data.list.length; i++) {
            for (let j = 0; j < this.SALE_STATUS.length; j++) {
              if (data.list[i].status == this.SALE_STATUS[j].code) {
                data.list[i].statusName = this.SALE_STATUS[j].label;
              }
            }
          }
          this.mainTable = data.list;
          this.total = response.data.data.size;
        }
      });
    },
    statusTransform(row, column) {
      let status = this.SALE_STATUS;
      for (let index = 0; index < status.length; index++) {
        const element = status[index];
        if (element.code == row.status) {
          return element.label;
        }
      }
    },
    deleteById(row) {
      let that = this;
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          deleteById(row.id).then(response => {
            console.log(response);
            if (response.data.success) {
              that.getData();
              that.$message.success("删除成功!");
            } else
              that.$message.error(
                response.data.message + ":" + response.data.data
              );
          });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    selectChanged(value) {
      let departId = "";
      for (let i = 0; i < this.devMap.length; i++) {
        if (this.devMap[i].code == value) {
          //   this.mainTable.departName = this.devMap[i].name;
          departId = this.devMap[i].id;
        }
      }
      sltUserByDepartId(departId).then(response => {
        let data = response.data;
        if (data.success) {
          this.userList = data.data;
        }
      });
    },
    resetForm() {
      resetQueryForm(this);
    },
    detaddSale() {
      this.title = "新增销售订单";
      this.type = "1";
      this.addDialogVisible = true;
    },
    hidenDialogCancel() {
      this.addDialogVisible = false;
      this.getData();
      selectDepart()
        .then(response => {
          const result = response.data;
          if (result.success) {
            this.devMap = result.data;
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    hidenDialog() {
      this.addDialogVisible = false;
      this.getData();
      selectDepart()
        .then(response => {
          const result = response.data;
          if (result.success) {
            this.devMap = result.data;
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    getIdAndType(id, type) {
      this.saleId = id;
      this.type = type;
    }
  },

  mounted() {
    this.initData();
  }
};
</script>
