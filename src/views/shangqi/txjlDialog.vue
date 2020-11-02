<template>
  <el-dialog
    class="txjlDialog"
    title="停线记录"
    :visible.sync="visible"
    custom-class="pie_tyle"
    width="50%"
  >
    <el-row style="padding:10px 10px 10px 0px ">
      <el-date-picker
        v-model="dateValue"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <el-button @click="getData" icon="el-icon-search" style="margin-left:20px" type="primary">查询</el-button>
    </el-row>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column
        v-for="(item,index) in propData"
        :key="index"
        :prop="item.prop"
        :label="item.name"
      ></el-table-column>
    </el-table>
    <Pagination
      class="txjiPage"
      :total="total"
      :page.sync="page.pageNum"
      :limit.sync="page.pageSize"
      @pagination="getData"
    />
  </el-dialog>
</template>

<script>
import { list_downtime_record } from '@/api/abcd'
import Pagination from "@/components/Pagination";
import { simpleDateFormat } from "@/utils/index";


export default {
  props: {
    shopName: {
      require: false
    },
    lineBody: {
      require: false,
      default: ''
    }
  },
  components: {
    Pagination
  },
  data() {
    return {
      visible: false,
      tableData: [],
      propData: [],
      dateValue: [],
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
    }
  },
  mounted() {
    this.dateValue = [new Date().getTime() - 3600 * 1000 * 24 * 30, new Date()]
  },
  methods: {
    async getData() {
      let data = {
        ...this.page,
        workCode: '78',
        startDate: simpleDateFormat(
          this.dateValue[0],
          "yyyy-MM-dd"
        ),
        endDate: simpleDateFormat(
          this.dateValue[1],
          "yyyy-MM-dd"
        ),
        shopName: this.shopName,
        lineBody: this.lineBody
      }
      if (this.propData.filter(item => item.name == '故障类型').length > 0) {
        let res = await list_downtime_record(data)
        if (res.data.success) {
          this.tableData = res.data.data
        }
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.getData()
      }
    }
  }
}
</script>

<style scoped>
.pie_tyle {
  display: block;
  /* background-color: #edf0f5; */
  padding-bottom: 30px;
  background-color: #566a87;
}
</style>
<style lang="scss">
.txjlDialog {
  .el-dialog {
    * {
      border-bottom: 0 !important;
      border-top: 0 !important;
      border-left: 0 !important;
      border-right: 0 !important;
      overflow: hidden;
    }
    .el-table--border::after {
      width: 0 !important;
    }
    .el-table::before {
      width: 0 !important;
    }
    background-color: #033155;
    .el-table {
      background-color: rbga(0, 0, 0, 0);
    }
    .el-dialog__header {
      span {
        color: #fff;
        font-size: 20px;
      }
    }
    .el-table__body-wrapper {
      background-color: #033155;
    }
    thead {
      tr {
        background-color: #033155;

        th {
          background-color: rgba(40, 74, 108, 0.5);
          color: #4ec4f8;
        }
      }
    }
    tbody {
      tr:hover > td {
        background-color: #4ec4f8 !important;
      }
      .el-table__row {
        background-color: rgba(0, 0, 0, 0);
        color: #fff;
      }

      .el-table__row.el-table__row--striped {
        background-color: rgba(40, 74, 108, 0.3);
        td {
          background: rgba(0, 0, 0, 0);
        }
      }
    }
  }
}
.txjiPage .el-pagination__total {
  color: #fff;
}
.txjiPage .el-pagination__jump {
  display: none !important;
}
</style>
