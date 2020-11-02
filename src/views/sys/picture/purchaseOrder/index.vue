<template>
  <!-- 申购单管理 -->
  <div class="purchaseOrder">
    <!-- 查询表单 -->
    <el-form :inline="true" :model="queryForm" class="demo-form-inline" style="margin-left:30px">
      <el-row>
        <el-form-item label="申购订单号">
          <el-input v-model="queryForm.orderNo" placeholder="请输入订单号"></el-input>
        </el-form-item>
        <el-form-item label="采购期限">
          <el-date-picker
            style="padding:0 5px"
            v-model="queryForm.date"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
          <el-button type="primary" plain>清空</el-button>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="申请人">
          <el-input v-model="queryForm.person" placeholder="请输入订申请人"></el-input>
        </el-form-item>
        <el-form-item label="申购类型">
          <el-select v-model="queryForm.state" placeholder="请选择类型">
            <el-option label="未完成" value="0"></el-option>
            <el-option label="完成" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-row>
    </el-form>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" stripe border>
      <el-table-column prop="orderNo" label="申请单单号" align="center"></el-table-column>
      <el-table-column prop="supplierName" label="单据类型" align="center"></el-table-column>
      <el-table-column prop="orderNum" label="对应单号" align="center"></el-table-column>
      <el-table-column prop="warehouseNum" label="采购期限" align="center"></el-table-column>
      <el-table-column prop="returnGoodsNum" label="创建日期" align="center"></el-table-column>
      <el-table-column prop="deliveryDate" label="申请人" align="center"></el-table-column>
      <el-table-column label="采购员" prop="state" align="center"></el-table-column>
      <el-table-column label="单据状态" align="center">
        <template v-slot="{row}">
          <span :class="{red:row.extensionDays==='未审核'}">{{row.extensionDays}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否全部采购" align="center">
        <template v-slot="{row}">
          <span :class="{red:row.isAll==='否'}">{{row.isAll}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cause" label="申请事由" align="center"></el-table-column>
      <el-table-column label="操作" width="100" align="center" fixed="right">
        <template v-slot="{row}">
          <el-button type="text" v-if="row.extensionDays==='未审核'">审核</el-button>
          <el-button type="text" v-else>查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :current-page="1"
      :page-sizes="[10, 20]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableData.length"
      style="margin:20px;text-align:right"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          orderNo: "SGD-20200101-001",
          supplierName: "销售订单申购单",
          orderNum: "CG-20200101-002",
          warehouseNum: "2020-01-01",
          returnGoodsNum: "2020-01-01",
          deliveryDate: "管理员",
          state: "管理员",
          extensionDays: "未审核",
          isAll: "否",
          cause: ""
        },
        {
          orderNo: "SGD-20200101-002",
          supplierName: "销售订单申购单",
          orderNum: "CG-20200101-003",
          warehouseNum: "2020-01-01",
          returnGoodsNum: "2020-01-01",
          deliveryDate: "管理员",
          state: "管理员",
          extensionDays: "已审核",
          isAll: "是",
          cause: ""
        },
        {
          orderNo: "SGD-20200103-001",
          supplierName: "销售订单申购单",
          orderNum: "CG-20200103-002",
          warehouseNum: "2020-01-03",
          returnGoodsNum: "2020-01-03",
          deliveryDate: "张伟",
          state: "张伟",
          extensionDays: "已审核",
          isAll: "是",
          cause: ""
        },
        {
          orderNo: "SGD-20200104-001",
          supplierName: "销售订单申购单",
          orderNum: "CG-20200104-001",
          warehouseNum: "2020-01-04",
          returnGoodsNum: "2020-01-04",
          deliveryDate: "张伟",
          state: "张伟",
          extensionDays: "未审核",
          isAll: "否",
          cause: ""
        },
        {
          orderNo: "SGD-20200105-001",
          supplierName: "销售订单申购单",
          orderNum: "CG-20200105-002",
          warehouseNum: "2020-01-05",
          returnGoodsNum: "2020-01-05",
          deliveryDate: "李佳",
          state: "李佳",
          extensionDays: "已审核",
          isAll: "是",
          cause: ""
        },
        {
          orderNo: "SGD-20200105-002",
          supplierName: "销售订单申购单",
          orderNum: "CG-20200105-002",
          warehouseNum: "2020-01-05",
          returnGoodsNum: "2020-01-05",
          deliveryDate: "张文",
          state: "张文",
          extensionDays: "已审核",
          isAll: "是",
          cause: ""
        }
      ],
      queryForm: {
        orderNo: "",
        date: "",
        person: "",
        state: ""
      }
    };
  }
};
</script>

<style scoped>
.red {
  color: #ff5e5e;
}
</style>

