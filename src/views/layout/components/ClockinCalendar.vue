<template>
  <div class="calendar-box">
    <el-calendar v-model="dateValue">
      <template slot="dateCell" slot-scope="{date, data}">
        <div>
          <div class="calendar-day">{{ data.day.split('-').slice(2).join('-') }}</div>
          <div v-for="(item,i) in calendarData" :key="i">
            <div v-if="item.clockInTime.split(' ')[0]== data.day">
              <el-tooltip
                class="item"
                effect="dark"
                :content="item.clockInTime.split(' ')[1]+' ' +item.status"
                placement="bottom"
              >
                <i class="el-icon-check" v-if="item.status==='已确认'"></i>
                <i class="el-icon-time" v-else></i>
              </el-tooltip>
            </div>
          </div>
        </div>
      </template>
    </el-calendar>
    <div class="sign-btns">
      <el-button type="primary" @click="sign" v-if="!signStatus">签到</el-button>
      <!-- <el-button type="primary" disabled v-else>{{signStatus}}</el-button> -->
    </div>
  </div>
</template>
<script>
import { isClockin, clockIn, getClockinRecord } from "@/api/sys/attendance";
import { simpleDateFormat, getDate } from "@/utils/index";

export default {
  name: "ClockinCalendar",
  props: {},
  data() {
    return {
      calendarData: [],
      dateValue: null,
      queryForm: {
        userWork: this.$store.getters.workCode,
        clockInTimeStart: "",
        clockInTimeEnd: ""
      },
      signStatus: null
    };
  },
  mounted() {
    this.setDateRange(new Date());
    this.isSign();
    this.getData();
  },
  methods: {
    getData() {
      getClockinRecord(this.queryForm).then(res => {
        if (res.data.success) {
          this.calendarData = res.data.data;
        }
      });
    },
    setDateRange(date) {
      const day = simpleDateFormat(new Date(date), "yyyy-MM-dd");
      this.queryForm.clockInTimeStart = day.slice(0, 7) + "-01 00:00:00";
      let nextMonth = new Date(this.queryForm.clockInTimeStart);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      let lastDay = new Date(nextMonth.getTime() - 1000);
      this.queryForm.clockInTimeEnd = simpleDateFormat(
        lastDay,
        "yyyy-MM-dd HH:mm:ss"
      );
    },
    isSign() {
      isClockin({ userWork: this.$store.state.user.workCode }).then(res => {
        if (res.data.success) {
          this.signStatus = res.data.data;
        }
      });
    },
    sign() {
      const user = this.$store.state.user;
      const params = {
        userName: user.userName,
        userWork: user.workCode,
        userId: "",
        isChangeShift: ""
      };
      clockIn(params).then(res => {
        if (res.data.success) {
          this.$message.success("签到成功");
          this.isSign();
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  },
  watch: {
    dateValue(newVal, oldVal) {
      this.setDateRange(newVal);
      this.getData();
    }
  }
};
</script>

<style lang="scss">
.calendar-box {
  .el-calendar {
    width: 400px;
    .el-calendar__body {
      padding: 20px;
    }
    .el-calendar-table .el-calendar-day {
      height: 50px;
      text-align: center;
    }
    .el-calendar-table:not(.is-range) td.next,
    .el-calendar-table:not(.is-range) td.prev {
      pointer-events: none;
    }
  }
  .sign-btns {
    text-align: right;
    padding: 0 20px 12px 20px;
  }
}
</style>