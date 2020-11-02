<template>
  <div style="height: calc(100% - 25px)" class="planDaily">
    <el-divider content-position="left">班组排班计划</el-divider>
    <el-form inline :model="queryForm" ref="queryForm">
      <el-row>
        <el-form-item label="排班日期" required prop="startDate">
          <el-date-picker
            type="date"
            v-model="queryForm.startDate"
            placeholder="开始日期"
            value-format="yyyy-MM-dd"
            style="width: 100%"
            clearable
          />
        </el-form-item>

        <el-form-item label="~" prop="endDate">
          <el-date-picker
            type="date"
            v-model="queryForm.endDate"
            placeholder="截止日期"
            value-format="yyyy-MM-dd"
            style="width: 100%"
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getData()">查询</el-button>
          <el-button type="primary" icon="el-icon-refresh-left" @click="reset()">重置</el-button>
          <el-button
            type="primary"
            icon="el-icon-date"
            @click="addDaily"
            v-has="'PPC-SCHEDUL-ADD'"
          >排班</el-button>
          <el-button type="text" @click="showMore=!showMore">
            {{ showMore ? '收起' : '展开' }}
            <i v-if="showMore" class="el-icon-arrow-up" />
            <i v-else class="el-icon-arrow-down" />
          </el-button>
        </el-form-item>
      </el-row>

      <!-- 折叠板中的内容 -->
      <div v-show="showMore">
        <el-row>
          <el-form-item label="车间:" prop="workshopCode">
            <el-select
              @change="shopChange"
              v-model="queryForm.workshopCode"
              clearable
              filterable
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in shopMap"
                :key="item.proccode"
                :label="item.name"
                :value="item.proccode"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="班组:" prop="teamCode">
            <el-select
              v-model="queryForm.teamCode"
              clearable
              filterable
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in teamMap"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="班次:" prop="shiftCode">
            <el-select
              v-model="queryForm.shiftCode"
              clearable
              filterable
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in shiftMap"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
      </div>
    </el-form>
    <edit-table
      :tableData="tableData"
      :height="showMore?'calc(100% - 49px - 52px - 50px - 52px)':'calc(100% - 49px - 52px - 50px)'"
      :showAddBtn="false"
      :opts.sync="tableColumnSelect"
      highlight-current-row
      :page="page"
      :total="total"
      :pageSizes="pageSizes"
      @getData="getData"
      @savaData="saveDaily"
      @deleteRow="dltDaily"
      :pageChangeAction="pageChange"
      pageName="PPC-SCDLIST"
    ></edit-table>

    <el-dialog
      append-to-body
      title="班组排班计划"
      :visible.sync="dailyDialogVisible"
      width="65%"
      style="height: 100%"
      top="50px"
    >
      <add-daily @save="categoryDialog" @cancel="hidenDialogCancel" />
    </el-dialog>
  </div>
</template>

<script>
import EditTable from "@/components/EditTable";
import addDaily from "./addDaily";
import { getDate } from "@/utils/index";
import {
  queryDaily,
  saveDaily,
  queryWorkShop,
  teamShiftSltToShopCode,
  deleteDaily,
  teamSelect,
  shiftSelect
} from "@/api/productionPlanning";
import { resetQueryForm } from "@/utils/common";

export default {
  name: "planDaily",
  components: {
    EditTable,
    addDaily
  },
  data() {
    return {
      page: {
        pageNum: 1,
        pageSize: 10
      },
      pageSizes: [10, 50, 100],
      total: 0,
      showMore: false,
      queryForm: {
        startDate: new Date(),
        endDate: getDate(7),
        teamCode: null,
        shiftCode: null
      },
      shopMap: [],
      teamMap: [],
      shiftMap: [],
      dailyDialogVisible: false,
      tableColumnSelect: [
        {
          label: "日期",
          prop: "schedulDate"
        },
        {
          label: "星期",
          prop: "week"
        },
        {
          label: "班次方案",
          prop: "schedulPlanName"
        },
        {
          label: "车间",
          prop: "workshopName"
        },
        {
          label: "班次",
          prop: "shiftName"
        },
        {
          type: "specialSelect",
          label: "班组",
          prop: "teamCode"
        }
      ],
      tableData: [],
      pageChange: null
    };
  },
  mounted() {
    this.init();
    this.workshopSelect();
  },
  methods: {
    init() {
      //班组下拉
      teamSelect().then(response => {
        let data = response.data;
        if (data.success) {
          this.teamMap = data.data;
        }
      });
      //班次下拉
      shiftSelect().then(response => {
        let data = response.data;
        if (data.success) {
          this.shiftMap = data.data;
          this.getData();
        }
      });
    },
    workshopSelect() {
      queryWorkShop().then(response => {
        let data = response.data;
        if (data.success) {
          this.shopMap = response.data.data.WORKSHOP_ALL;
        }
      });
    },
    shopChange() {
      this.queryForm.teamCode = "";
      this.queryForm.shiftCode = "";
      if (this.queryForm.workshopCode === "") {
        this.init();
      } else {
        //根据车间编号查询班组下拉和班次下拉
        teamShiftSltToShopCode(this.queryForm.workshopCode).then(response => {
          let data = response.data;
          if (data.success) {
            this.teamMap = data.data.teamSelect;
            this.shiftMap = data.data.shiftSelect;
          }
        });
      }
    },
    getData() {
      this.pageChange = null;
      const params = {
        ...this.page,
        ...this.queryForm
      };
      queryDaily(params).then(response => {
        let data = response.data;
        if (data.success) {
          this.tableData = data.data.result;
          this.total = data.data.total;
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
    },
    saveDaily(row) {
      saveDaily(row).then(response => {
        let data = response.data;
        if (data.success) {
          this.$message.success("保存成功！！！");
          this.getData();
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
    },
    dltDaily(id) {
      deleteDaily(id).then(response => {
        let data = response.data;
        if (data.success) {
          this.$message.success("删除成功！");
          this.getData();
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
    },
    addDaily() {
      this.dailyDialogVisible = true;
    },
    categoryDialog() {
      this.dailyDialogVisible = false;
      this.getData();
    },
    hidenDialogCancel() {
      this.dailyDialogVisible = false;
    },
    reset() {
      resetQueryForm(this);
    }
  }
};
</script>
<style>
 .planDaily .el-dialog__body {
  padding: 10px 20px 60px 20px;
}
</style>
