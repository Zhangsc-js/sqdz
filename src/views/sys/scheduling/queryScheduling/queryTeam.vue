<template>
  <!-- 班组排班查询 -->
  <div class="queryTeam" style="height:100%;overflow:auto">
    <!-- 查询行 -->
    <el-form ref="queryForm" :model="queryForm" style="margin-left:20px" inline>
      <el-row>
        <el-form-item label="排班日期" prop="time">
          <el-date-picker
            v-model="queryForm.time"
            type="daterange"
            range-separator="~"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="getData(1)">查询</el-button>
          <el-button type="primary" @click="schuduling">排班</el-button>
          <el-button
            href="javascript:void(0)"
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
      <el-row v-show="showMore">
        <el-form-item label="班制分类" prop="planCategory">
          <el-select v-model="queryForm.planCategory" clearable @change="changePlanCategory">
            <el-option label="生产班组" value="01"></el-option>
            <el-option label="化验班组" value="02"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上级组织" prop="parentOrgCode">
          <el-select v-model="queryForm.parentOrgCode" clearable @change="changeParentOrgCode">
            <el-option
              v-for="(item) in parentOrgCodeOpts"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班组" prop="teamCode">
          <el-select v-model="queryForm.teamCode" clearable @change="changeTeamCode">
            <el-option
              v-for="item in teamCodeOpts"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班次" prop="shiftCode">
          <el-select v-model="queryForm.shiftCode" clearable>
            <el-option
              v-for="item in shiftCodeOpts"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-row>
    </el-form>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      border
      stripe
      style="width: 100%"
      :height="showMore?'calc(100% - 166px)':'calc(100% - 166px + 52px)'"
      ref="multipleTable"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="schedulDate" label="日期"></el-table-column>
      <el-table-column label="星期">
        <template v-slot="{row}">
          <span>{{new Date(row.schedulDate).getDay()|day}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="planCategory" label="班制分类" :formatter="formatterCatefory"></el-table-column>
      <el-table-column prop="schedulPlanName" label="班制方案"></el-table-column>
      <el-table-column prop="parentOrgName" label="上级组织"></el-table-column>
      <el-table-column prop="shiftName" label="班次"></el-table-column>
      <el-table-column prop="teamCode" label="班组" width="150">
        <template v-slot="{row}">
          <el-select @change="changeTeam(row)" v-if="row.isEdit" v-model="row.teamCode">
            <el-option
              v-for="item in row.teamList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span v-else>{{teamName(row)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140" align="center">
        <template v-slot="{row}">
          <div v-if="true">
            <el-button type="text" @click="edit(row)" v-if="!row.isEdit">更新</el-button>
            <el-button type="text" @click="delRow(row)" v-if="!row.isEdit">删除</el-button>
            <el-button type="text" @click="cancel" v-if="row.isEdit">取消</el-button>
            <el-button type="text" @click="save(row)" v-if="row.isEdit">保存</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 删除行 -->
    <el-row style="padding:15px 0 0 20px">
      <el-button type="danger" icon="el-icon-delete" @click="delRows">删除</el-button>
    </el-row>
    <!-- 对话框 -->
    <el-dialog title="排班" :visible.sync="dialogVisible" width="100%">
      <daily-team></daily-team>
    </el-dialog>
  </div>
</template>

<script>
import dailyTeam from "../dailyScheduling/dailyTeam";
import {
  getOrgSltByCategory,
  getShiftList,
  getTeamList,
  updateTeamDaily,
  getTeamDailyList,
  deleteTeamDaily,
  batDeleteTeamDaily
} from "@/api/sys/scheduling";
import { simpleDateFormat } from "@/utils/index";
import { parse } from "@babel/core";
export default {
  components: {
    dailyTeam
  },
  data() {
    return {
      queryForm: {},
      showMore: true,
      parentOrgCodeOpts: [],
      teamCodeOpts: [],
      shiftCodeOpts: [],
      tableData: [],
      dialogVisible: false,
      planCategory: "",
      parentCode: ""
    };
  },
  methods: {
    getData() {
      let startDate = "";
      let endDate = "";
      let params = "";
      if (this.queryForm.time) {
        startDate = simpleDateFormat(this.queryForm.time[0], "yyyy-MM-dd");
        endDate = simpleDateFormat(this.queryForm.time[1], "yyyy-MM-dd");
        params = {
          ...this.queryForm,
          startDate,
          endDate
        };
        delete params.time;
      } else {
        params = {
          ...this.queryForm
        };
      }
      getTeamDailyList(params).then(res => {
        this.tableData = res.data.data.map(item => {
          return {
            ...item.row,
            boo: item.boo,
            teamList: item.teamList
          };
        });
      });
    },
    clearSearchBox() {
      this.$refs["queryForm"].resetFields();
      this.getData();
    },
    edit(row) {
      this.$set(row, "isEdit", true);
    },
    // 改变班组
    changeTeam(row) {
      row.teamName = row.teamList.filter(
        item => row.teamCode == item.value
      )[0].label;
    },
    save(row) {
      updateTeamDaily(row).then(res => {
        if (res.data.success) {
          this.$message.success("更新成功");
          this.getData();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    cancel() {
      this.getData();
    },
    delRow(row) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteTeamDaily(row.id).then(res => {
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
    formatterCatefory(row, column) {
      if (row.planCategory == "01") {
        return "生产班组";
      } else if (row.planCategory == "02") {
        return "化验班组";
      } else {
        return "";
      }
    },
    // 排班
    schuduling() {
      this.dialogVisible = true;
    },
    // 改变班制分类
    changePlanCategory(val) {
      this.$set(this.queryForm, "parentOrgCode", "");
      this.$set(this.queryForm, "teamCode", "");
      this.$set(this.queryForm, "shiftCode", "");
      if (val) {
        this.planCategory = val;
        getOrgSltByCategory({ planCategory: val }).then(res => {
          if (res.data.success) {
            this.parentOrgCodeOpts = res.data.data;
          }
        });
      }
    },
    // 改变上级组织
    changeParentOrgCode(val) {
      this.$set(this.queryForm, "teamCode", "");
      this.$set(this.queryForm, "shiftCode", "");
      if (val) {
        this.parentCode = val;
        let params = {
          planCategory: this.planCategory,
          parentCode: val
        };
        getTeamList(params).then(res => {
          if (res.data.success) {
            this.teamCodeOpts = res.data.data;
          }
        });
      }
    },
    // 改变班组
    changeTeamCode(val) {
      this.$set(this.queryForm, "shiftCode", "");
    },
    delRows() {
      let ids = this.$refs["multipleTable"].store.states.selection.map(
        item => item.id
      );
      if (ids.length == 0) {
        this.$message.error("请先勾选需要删除的行");
        return;
      }
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          batDeleteTeamDaily(ids).then(res => {
            if (res.data.success) {
              this.$message.success("删除成功");
              this.getData();
            } else {
              this.$message.error(res.data.message + ":" + res.data.data);
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    }
  },
  filters: {
    day(val) {
      switch (val) {
        case 0:
          return "星期天";
        case 1:
          return "星期一";
        case 2:
          return "星期二";
        case 3:
          return "星期三";
        case 4:
          return "星期四";
        case 5:
          return "星期五";
        case 6:
          return "星期六";
      }
    }
  },
  watch: {
    queryForm: {
      deep: true,
      handler(val) {
        if (
          val.planCategory &&
          val.parentOrgCode &&
          val.teamCode &&
          !val.shiftCode
        ) {
          const { planCategory, parentOrgCode, teamCode } = this.queryForm;
          let params = {
            planCategory,
            parentOrgCode,
            teamCode
          };
          getShiftList(params).then(res => {
            console.log(res);
            if (res.data.success) {
              this.shiftCodeOpts = res.data.data;
            }
          });
        }
      }
    }
  },
  computed: {
    teamName() {
      return function(row) {
        let arr = row.teamList.filter(item => {
          return item.value == row.teamCode;
        });
        return arr[0] ? arr[0].label : "";
      };
    }
  }
};
</script>

<style>
.queryTeam .el-dialog {
  height: 100%;
}
</style>
