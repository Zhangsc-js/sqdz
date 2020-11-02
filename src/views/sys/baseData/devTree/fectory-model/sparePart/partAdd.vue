<template>
  <!--  备件新增 -->
  <div class="partAdd">
    <!-- 查询行 -->
    <el-form inline :model="queryForm" ref="queryForm" class="demo-form-inline">
      <el-row>
        <el-form-item label="备品备件名称" prop="sparesName">
          <el-input v-model="queryForm.sparesName" clearable></el-input>
        </el-form-item>
        <el-form-item label="备品备件性质" prop="sparesType">
          <el-select v-model="queryForm.sparesType" placeholder clearable>
            <el-option label="关键备品备件" value="1"></el-option>
            <el-option label="一般性备品备件" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="getData(1)">查询</el-button>
          <el-button
            href="javascript:void(0)"
            type="primary"
            icon="el-icon-refresh-left"
            @click="resetQuery"
          >重置</el-button>
          <el-button type="text" @click="showMore=!showMore">
            {{showMore?'收起':'展开'}}
            <i :class="showMore?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
          </el-button>
        </el-form-item>
      </el-row>
      <el-row v-show="showMore">
        <el-form-item label="备品备件编码" prop="sparesCode">
          <el-input v-model="queryForm.sparesCode" clearable></el-input>
        </el-form-item>
        <el-form-item label="　　补货类型" prop="replenishType">
          <!-- <el-input v-model="queryForm.replenishType"></el-input> -->
          <el-select v-model="queryForm.replenishType" placeholder clearable>
            <el-option label="采购" value="1"></el-option>
            <el-option label="自制" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-row>
    </el-form>
    <!-- 表格 -->
    <el-table
      ref="addTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="sparesCode" label="备品备件编码"></el-table-column>
      <el-table-column prop="sparesName" label="备品备件名称"></el-table-column>
      <el-table-column prop="modelNumber" label="型号"></el-table-column>
      <el-table-column prop="specification" label="规格"></el-table-column>
      <el-table-column prop="quality" label="材质"></el-table-column>
      <el-table-column prop="sparesType" label="性质">
        <template v-slot="{row}">
          <span v-if="row.sparesType=='1'">{{'关键备品备件'}}</span>
          <span v-if="row.sparesType=='2'">{{'一般性备品备件'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="replenishType" label="补货类型">
        <template v-slot="{row}">
          <span v-if="row.replenishType=='1'">{{'采购'}}</span>
          <span v-if="row.replenishType=='2'">{{'自制'}}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      v-if="total > -1"
      :total="total"
      :page.sync="page.pageNum"
      :limit.sync="page.pageSize"
      @pagination="getData"
    />
    <!-- 保存关闭行 -->
    <el-row style="padding:20px;text-align:center">
      <el-button icon="el-icon-check" type="primary" @click="saveRow">保存</el-button>
      <el-button icon="el-icon-close" type="danger" @click="close">关闭</el-button>
    </el-row>
  </div>
</template>

<script>
import { querySpares, saveDevSpares } from "@/api/sys/dev";
import Pagination from "@/components/Pagination";
import { resetQueryForm } from "@/utils/common";
export default {
  components: {
    Pagination
  },
  props: {
    count: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      queryForm: {
        sparesName: "",
        sparesType: "",
        sparesCode: "",
        replenishType: ""
      },
      showMore: false,
      tableData: [
        {
          id: "1",
          sparesCode: "XQ",
          sparesName: "断路器分闸线圈",
          modelNumber: "DX02SK31",
          specification: "12cm*12cm*12cm",
          quality: "铜制",
          sparesType: "1",
          replenishType: "1"
        }
      ],
      total: 0,
      page: {
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  methods: {
    getData(code) {
      if (+code === 1) {
        this.page.pageNum = 1;
      }
      let params = {
        ...this.queryForm,
        ...this.page
      };
      querySpares(params).then(res => {
        this.total = res.data.data.total;
        this.tableData = res.data.data.rows;
      });
    },
    handleSelectionChange() {},
    resetQuery() {
      resetQueryForm(this);
    },
    saveRow() {
      let codes = this.$refs["addTable"].store.states.selection.map(
        item => item.sparesCode
      );
      let data = {
        sparesCode: codes.join(","),
        devCode: this.selectNodeNO
      };
      saveDevSpares(data).then(res => {
        if (res.data.success) {
          this.$message.success("新增成功");
          this.close();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    close() {
      this.$emit("close");
    }
  },
  mounted() {
    this.getData();
  },
  computed: {
    selectNodeNO() {
      return this.$store.state.sysDev.selectNodeNO;
    }
  },
  watch: {
    count() {
      this.$refs.addTable.clearSelection();
      this.$refs.queryForm.resetFields();
    }
  }
};
</script>

<style>
</style>
