<template>
  <!-- 运输费用录入 -->
  <div class="transportationCost">
    <!-- 查询表单 -->
    <el-form :inline="true" :model="queryForm" class="demo-form-inline" style="margin-left:30px">
      <el-row>
        <el-form-item label="业务单号">
          <el-input v-model="queryForm.code" placeholder></el-input>
        </el-form-item>
        <el-form-item label="接单日期">
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
        <el-button type="primary">新增</el-button>
      </el-row>
    </el-form>
    <!-- 表格 -->
    <el-table highlight-current-row :data="tableData" border style="width: 100%;" align="center">
      <el-table-column prop="code" label="业务单号" align="center" width="150"></el-table-column>
      <el-table-column prop="date" label="绩单日期" align="center" width="120"></el-table-column>
      <el-table-column prop="name" label="客户名称" align="center"></el-table-column>
      <el-table-column prop="type" label="报关方式" align="center"></el-table-column>
      <el-table-column prop="huoName" label="货物名称" align="center"></el-table-column>
      <el-table-column prop="loadPlace" label="装货地" align="center"></el-table-column>
      <el-table-column prop="dischargePlace" label="卸货地" align="center"></el-table-column>
      <el-table-column prop="loadTime" label="装货时间" align="center" width="120"></el-table-column>
      <el-table-column prop="loadCar" label="装货车次" align="center"></el-table-column>
      <el-table-column prop="cabinetShape" label="柜型" align="center"></el-table-column>
      <el-table-column prop="cabinetQty" label="柜量" align="center"></el-table-column>
      <el-table-column prop="model" label="箱型" align="center"></el-table-column>
      <el-table-column prop="dingCang" label="订舱号" align="center"></el-table-column>
      <el-table-column prop="fenTiao" label="封条号" align="center"></el-table-column>
      <el-table-column prop="chePai" label="车牌号" align="center" width="120"></el-table-column>
      <el-table-column prop="siJi" label="司机名" align="center"></el-table-column>
      <el-table-column prop="factory" label="工厂名称" align="center"></el-table-column>
      <el-table-column prop label="操作" align="center"></el-table-column>
      <el-table-column prop label align="center" width="100"></el-table-column>
      <el-table-column prop label align="center" width="100"></el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <el-button type="text">编辑</el-button>
        <el-button type="text">删除</el-button>
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
          code: "OP-200101000001",
          date: "2020-01-01",
          name: "时料",
          type: "转关",
          huoName: "煤",
          loadPlace: "成品库",
          dischargePlace: "卸货地",
          loadTime: "2019-11-01",
          loadCar: "",
          cabinetShape: "20GP",
          cabinetQty: "1",
          model: "",
          dingCang: "提单号",
          fenTiao: "05000",
          chePai: "贵A00982",
          siJi: "李凯",
          factory: "总部"
        },
        {
          code: "OP-200101000002",
          date: "2020-01-01",
          name: "时料",
          type: "转关",
          huoName: "煤",
          loadPlace: "成品库",
          dischargePlace: "卸货地",
          loadTime: "2019-11-20",
          loadCar: "",
          cabinetShape: "20GP",
          cabinetQty: "1",
          model: "10",
          dingCang: "提单号",
          fenTiao: "39021",
          chePai: "贵A00982",
          siJi: "李凯",
          factory: "总部"
        },
        {
          code: "OP-200101000003",
          date: "2020-01-01",
          name: "时料",
          type: "",
          huoName: "煤",
          loadPlace: "成品库",
          dischargePlace: "卸货地",
          loadTime: "2019-11-16",
          loadCar: "",
          cabinetShape: "20GP",
          cabinetQty: "1",
          model: "",
          dingCang: "提单号",
          fenTiao: "98923",
          chePai: "贵A00982",
          siJi: "李凯",
          factory: "总部"
        },
        {
          code: "OP-200103000001",
          date: "2020-01-01",
          name: "时料",
          type: "",
          huoName: "煤",
          loadPlace: "成品库",
          dischargePlace: "卸货地",
          loadTime: "2019-12-01",
          loadCar: "",
          cabinetShape: "20GP",
          cabinetQty: "1",
          model: "",
          dingCang: "提单号",
          fenTiao: "88992",
          chePai: "贵A00982",
          siJi: "李凯",
          factory: "总部"
        },
        {
          code: "OP-200103000002",
          date: "2020-01-01",
          name: "时料",
          type: "",
          huoName: "煤",
          loadPlace: "成品库",
          dischargePlace: "卸货地",
          loadTime: "2019-11-11",
          loadCar: "",
          cabinetShape: "20GP",
          cabinetQty: "1",
          model: "30",
          dingCang: "提单号",
          fenTiao: "77782",
          chePai: "贵A00982",
          siJi: "李凯",
          factory: "总部"
        },
        {
          code: "OP-200103000003",
          date: "2020-01-03",
          name: "CZCT",
          type: "",
          huoName: "",
          loadPlace: "成品库",
          dischargePlace: "卸货地",
          loadTime: "2019-12-08",
          loadCar: "",
          cabinetShape: "20GP",
          cabinetQty: "1",
          model: "",
          dingCang: "提单号",
          fenTiao: "88692",
          chePai: "贵A87723",
          siJi: "王利",
          factory: "总部"
        },
        {
          code: "OP-200103000004",
          date: "2020-01-03",
          name: "时料",
          type: "清关",
          huoName: "原油",
          loadPlace: "成品库",
          dischargePlace: "卸货地",
          loadTime: "2019-11-23",
          loadCar: "",
          cabinetShape: "20GP",
          cabinetQty: "1",
          model: "40",
          dingCang: "提单号",
          fenTiao: "65209",
          chePai: "贵A87723",
          siJi: "王利",
          factory: "总部"
        },
        {
          code: "OP-200107000001",
          date: "2020-01-07",
          name: "时料",
          type: "",
          huoName: "原油",
          loadPlace: "成品库",
          dischargePlace: "卸货地",
          loadTime: "2019-11-09",
          loadCar: "",
          cabinetShape: "20GP",
          cabinetQty: "1",
          model: "",
          dingCang: "提单号",
          fenTiao: "57689",
          chePai: "贵A00982",
          siJi: "李凯",
          factory: "总部"
        },
        {
          code: "OP-200107000002",
          date: "2020-01-07",
          name: "时料",
          type: "",
          huoName: "原油",
          loadPlace: "成品库",
          dischargePlace: "卸货地",
          loadTime: "2019-12-16",
          loadCar: "",
          cabinetShape: "20GP",
          cabinetQty: "1",
          model: "",
          dingCang: "提单号",
          fenTiao: "76234",
          chePai: "贵A00982",
          siJi: "李凯",
          factory: "总部"
        }
      ],
      queryForm: {
        code: "",
        date: ""
      }
    };
  }
};
</script>

<style>
</style>
