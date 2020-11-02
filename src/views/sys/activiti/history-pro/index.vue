<template>
  <div>
    <el-form></el-form>
    <img :src="pic"/>
    <div class="tableshadow margin20" style="width:calc(100% - 40px);padding-bottom:20px;">
      <el-table
        :data="tableData"
        ref="refTable"
        @expand-change="expandChange"
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        @row-click="expandChange"
      >
        <el-table-column type="expand">
          <el-steps :active="instList.length" align-center direction="vertical">
            <el-step v-for="(item , i) in instList" :key="item.id" :title="item.activityName">
              <template slot="description">
                <p v-if="i==0">开始时间：{{item.startTime}}</p>
                <p v-else-if="i!=0" class="activiti-info">
                  <span>签核人员：{{item.assignee}} </span>
                  <span>结束时间：{{item.endTime}} </span>
                  <span>耗时:{{durationFormat(null,null,item.durationInMillis)}}</span>
                  <span v-if="i!=instList.length-1">意见：{{historyList[i].TEXT_}}</span>
                </p> 
              </template>
            </el-step>
          </el-steps>
        </el-table-column>
        <!-- <el-table-column prop="scheduleId" label="任务ID" :formatter="dataFormat"></el-table-column> -->
        <el-table-column prop="activiti.DEPNAME" label="签核类型" align="center"></el-table-column>
        <el-table-column
          prop="activiti.STARTTIME"
          label="开始时间"
          :formatter="dateFormat"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="activiti.ENDTIME"
          label="结束时间"
          :formatter="dateFormat"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="activiti.DURATION"
          :formatter="durationFormat"
          label="耗时"
          align="center"
        ></el-table-column>
      </el-table>
      <div style="height:32px;">
        <Pagination
          :total="total"
          :page.sync="page.pageNum"
          :limit.sync="page.pageSize"
          @pagination="getData"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { getTaskList, getTaskListByInst, testPic } from "@/api/sys/activiti";
import { simpleDateFormat ,ge} from "@/utils/index";
const Base64  =  require('js-base64').Base64

export default {
  name: "history-pro",
  components: {
    Pagination
  },
  data() {
    return {
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      tableData: [],
      getRowKeys(row) {
        return row.activiti.PROCINSTID;
      },
      expands: [],
      instList: [],
      historyList: [],
      pic:""
    };
  },
  mounted() {
    this.getData();
    // testPic().then(res=>{
    //   console.log(res.data)
    //   const url = window.btoa(new Uint8Array(res.data).reduce((data,byte)=>data+String.fromCharCode(byte),''))
    //   return 'data:image/png;base64,' + url;
    // })
    // .then(data=>{
    //   console.log('data');
    //   this.pic=data;
    // });
  },
  methods: {
    getData() {
      let params = { ...this.page };
      getTaskList(params)
        .then(res => {
          this.tableData = res.data.data;
          this.total = res.data.count;
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    dateFormat(row, column, cellValue, index) {
      let res = "/";
      if (!!cellValue) {
        res = simpleDateFormat(new Date(cellValue), "yyyy-MM-dd  HH:mm:ss");
      }
      return res;
    },
    dataFormat(row, column, cellValue, index) {
      let value;
      if (row.activiti.DEPNAME.indexOf("复验") > -1) {
        value = row.reExamination.schedule[column.property];
      } else if(row.activiti.DEPNAME.indexOf("化验")>-1) {
        value = row.Schedule[column.property];
      }else{
        value="/"
      }
      return value;
    },
    durationFormat(row, column, cellValue, index) {
      let time = "未结束";
      if (!!cellValue) {
        let duration = cellValue;
        time = "";
        let days = duration / 1000 / 60 / 60 / 24;
        let daysRound = Math.floor(days);
        let hours = duration / 1000 / 60 / 60 - 24 * daysRound;
        let hoursRound = Math.floor(hours);
        let minutes =
          duration / 1000 / 60 - 24 * 60 * daysRound - 60 * hoursRound;
        let minutesRound = Math.floor(minutes);
        let seconds =
          duration / 1000 -
          24 * 60 * 60 * daysRound -
          60 * 60 * hoursRound -
          60 * minutesRound;
        daysRound > 0 && (time += parseInt(daysRound) + "天");
        hoursRound > 0 && (time += parseInt(hoursRound) + "小时");
        minutesRound > 0 && (time += parseInt(minutesRound) + "分钟");
        seconds > 0 && (time += parseInt(seconds) + "秒");
      }
      return time;
    },
    expandChange(row, expandedRows) {
      if (this.expands.indexOf(row.activiti.PROCINSTID) >= 0) {
        //收起当前行
        this.expands.shift();
        return;
      } else {
        this.instList = [];
        this.historyList = [];
      }
      let self = this;
      getTaskListByInst({ PROCINSTID: row.activiti.PROCINSTID }).then(res => {
        self.instList = res.data.historicActivityInstances;
        self.historyList = res.data.HistoricVariableInstance;
        self.historyList.unshift({});
        self.historyList.push({});
        self.expands.shift();
        self.expands.push(row.activiti.PROCINSTID);
      });

      if (expandedRows.length > 1) {
        expandedRows.shift();
      }
    }
  }
};
</script>

<style scoped>
.activiti-info > span+span {
  margin-left: 10px;
}
</style>