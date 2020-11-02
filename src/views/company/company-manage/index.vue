<template>
  <div class="company_manage" style="height:calc(100% - 15px)">
    <!-- 查询表单 -->
    <el-form :inline="true" :model="queryFrom" class="demo-form-inline" style="margin-left:20px">
      <el-form-item label="公司名称">
        <el-input v-model="queryFrom.name"></el-input>
      </el-form-item>
      <el-form-item label="租户状态">
        <el-select v-model="queryFrom.auditState" placeholder="请选择状态">
          <el-option label="待审核" value="1"></el-option>
          <el-option label="审核通过" value="2"></el-option>
          <el-option label="待续租" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="init">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <edit-table
      :tableData="tableData"
      :opts="opts"
      @savaData="save"
      showSelectBtn
      showOptBtn
      :showDelBtn="false"
      pageName="SYS-DICT"
      height=" calc(100% - 32px - 52px)"
      :showAddBtn="false"
      :total="total"
      :page="page"
      :pageSizes="[10,20,30]"
      :selectionChange="selectionChange"
      :fixed="false"
    ></edit-table>
    <!-- 新增删除行 -->
    <el-row style="padding-left:20px">
      <el-button type="primary" icon="el-icon-plus" @click="addRow">新增</el-button>
      <el-button type="danger" icon="el-icon-delete" @click="delRows">删除</el-button>
    </el-row>
  </div>
</template>

<script>
import EditTable from "@/components/EditTable";

import { list, addCompany, dltCompany } from "@/api/company";
import { simpleDateFormat } from "@/utils/index";

export default {
  components: {
    EditTable
  },
  data() {
    return {
      queryFrom: {
        name: "",
        auditState: ""
      },
      opts: [
        {
          type: "input",
          prop: "name",
          label: "公司名称"
        },
        {
          type: "input",
          prop: "companyAddress",
          label: "公司地址"
        },
        {
          type: "input",
          label: "申请人名称",
          prop: "legalRepresentative"
        },
        {
          type: "input",
          label: "申请人联系方式",
          prop: "companyPhone"
        },
        {
          type: "select",
          label: "租户状态",
          prop: "auditState",
          options: [
            { label: "待审核", value: "1" },
            { label: "审核通过", value: "2" },
            { label: "待续租", value: "3" }
          ]
        },
        {
          type: "date",
          label: "注册时间",
          prop: "createTime",
          format: "yyyy-MM-dd"
        },
        {
          type: "date",
          label: "到期时间",
          prop: "expirationDate",
          format: "yyyy-MM-dd"
        },
        {
          label: "剩余天数",
          prop: "surplus"
        },
        {
          type: "input",
          label: "公司账号数量限制",
          prop: "userAccountLimit"
        },
        {
          type: "input",
          label: "公司数据库编码",
          prop: "mycatSchema"
        }
      ],
      tableData: [],
      total: 10,
      page: {
        pageNum: 1,
        pageSize: 10
      },
      seles: []
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const params = {
        ...this.page,
        ...this.queryFrom
      };
      list(params).then(response => {
        let data = response.data;
        if (data.success) {
          this.tableData = data.data.list;
          this.total = data.data.total;
          this.tableData.forEach(item => {
            let a2 = Date.parse(new Date(item.expirationDate));
            let a1 = Date.parse(new Date());
            item.surplus = parseInt((a2 - a1) / (1000 * 60 * 60 * 24));
            item.surplus = item.surplus > 0 ? item.surplus : 0;
            if (item.createTime) {
              item.createTime = simpleDateFormat(item.createTime, "yyyy-MM-dd");
            }
            if (item.expirationDate) {
              item.expirationDate = simpleDateFormat(
                item.expirationDate,
                "yyyy-MM-dd"
              );
            }
          });
        } else {
          this.$message.error(data.message + ":" + data.data);
        }
      });
    },
    save(row) {
      addCompany(row).then(response => {
        let data = response.data;
        if (data.success) {
          this.$message.success("保存成功");
          this.init();
        } else {
          this.$message.error(data.message + ":" + data.data);
        }
      });
    },
    delRows() {
      let ids = this.seles.map(item => item.id);
      dltCompany(ids).then(response => {
        let data = response.data;
        if (data.success) {
          this.$message.success("删除成功！");
          this.init();
        } else {
          this.$message.error(data.message + ":" + data.data);
        }
      });
    },
    selectionChange(val) {
      this.seles = val;
    },
    addRow() {
      const row = {
        seen: true,
        visibleCancel: true,
        visibleOptBtn: true,
        isEdit: true
      };
      this.tableData.unshift(row);
    }
  }
};
</script>

