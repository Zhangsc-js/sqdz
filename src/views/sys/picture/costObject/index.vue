<template>
  <!-- 成本对象-科目信息 -->
  <div class="costObject">
    <!-- 查询行 -->
    <el-form :inline="true" :model="queryForm" class="demo-form-inline">
      <el-row style="padding-left:30px">
        <el-form-item label="成本对象编号">
          <el-input v-model="queryForm.code" placeholder></el-input>
        </el-form-item>
        <el-form-item label="成本对象名称">
          <el-input v-model="queryForm.name" placeholder></el-input>
        </el-form-item>
        <el-form-item label="成名项目">
          <el-select v-model="queryForm.project" placeholder="请选择">
            <el-option label="区域一" value="shanghai"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
          <el-button type="primary" plain>清空</el-button>
        </el-form-item>
      </el-row>
      <el-row style="padding-left:30px">
        <el-button type="primary">新增</el-button>
      </el-row>
    </el-form>
    <!-- 表格 -->
    <el-table highlight-current-row :data="tableData" border style="width: 100%;" align="center">
      <el-table-column prop="code" label="成本对象编辑" align="center"></el-table-column>
      <el-table-column prop="name" label="成本对象名称" align="center"></el-table-column>
      <el-table-column prop="project" label="成本项目" align="center"></el-table-column>
      <el-table-column prop="projectName" label="成本项目名称" align="center"></el-table-column>
      <el-table-column prop="production" label="生产成本科目" align="center"></el-table-column>
      <el-table-column prop="qty" label="数量差异科目" align="center"></el-table-column>
      <el-table-column prop="price" label="价格差异科目" align="center"></el-table-column>
      <el-table-column fixed="right" align="center" label="操作">
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
          code: "01001000120400",
          name: "大石灰石",
          project: "002",
          projectName: "直接材料",
          production: "4107",
          qty: "",
          price: ""
        },
        {
          code: "01001000500400",
          name: "小块石灰石",
          project: "002",
          projectName: "直接材料",
          production: "4107",
          qty: "",
          price: ""
        },
        {
          code: "01001009000400",
          name: "重油",
          project: "002",
          projectName: "直接材料",
          production: "4107",
          qty: "",
          price: ""
        },
        {
          code: "01001000500498",
          name: "焦炭",
          project: "002",
          projectName: "直接材料",
          production: "4107",
          qty: "",
          price: ""
        },
        {
          code: "01001000090401",
          name: "无烟煤",
          project: "002",
          projectName: "直接材料",
          production: "4107",
          qty: "",
          price: ""
        },
        {
          code: "01001000500045",
          name: "纯碱",
          project: "002",
          projectName: "直接材料",
          production: "4107",
          qty: "",
          price: ""
        },
        {
          code: "01001000500046",
          name: "片碱",
          project: "002",
          projectName: "直接材料",
          production: "4107",
          qty: "",
          price: ""
        },
        {
          code: "01001000332000",
          name: "吕矿",
          project: "002",
          projectName: "直接材料",
          production: "4107",
          qty: "",
          price: ""
        },
        {
          code: "01001000770400",
          name: "生料浆",
          project: "002",
          projectName: "直接材料",
          production: "4107",
          qty: "",
          price: ""
        }
      ],
      queryForm: {
        code: "",
        name: "",
        project: ""
      }
    };
  }
};
</script>

<style>
</style>
