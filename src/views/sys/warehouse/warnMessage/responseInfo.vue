<template>
  <div class="responseInfo">
    <el-tabs type="card">
      <el-tab-pane label="响应情况">
        <el-table :data="tableDate" stripe border style="width: 100%">
          <el-table-column prop="userCode" label="员工工号"></el-table-column>
          <el-table-column prop="userName" label="员工姓名"></el-table-column>
          <el-table-column prop="isMainResponse" label="是否主响应人">
            <template v-slot="{row}">
              <span>{{row.isMainResponse==='1'?'是':'否'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="isConfirm" label="执行确认">
            <template v-slot="{row}">
              <span>{{row.isConfirm === '1' ? '是' : '否'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="confirmTime" label="确认时间"></el-table-column>
          <el-table-column prop="isClose" label="执行关闭">
            <template v-slot="{row}">
              <span>{{row.isClose==='1' ? '是' : '否'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="closeTime" label="关闭时间"></el-table-column>
        </el-table>
        <Pagination
          :total="total"
          :page.sync="page.pageNum"
          :limit.sync="page.pageSize"
          @pagination="init()"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getPerson } from "@/api/sys/warnMessage";
import Pagination from "@/components/Pagination";

export default {
  components: {
    Pagination
  },
  props: {
    warningNo: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      tableDate: [],
      total: 0,
      page: {
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  methods: {
    init() {
      const param = {
        warningNo: this.warningNo,
        ...this.page
      }
      getPerson(param).then(res => {
        this.tableDate = res.data.data.rows;
        this.total = res.data.data.total;
      });
    }
  },
  watch: {
    warningNo() {
      if (this.warningNo) {
        this.init();
      }
    }
  }
};
</script>

<style>
</style>
