<template>
  <div class="stationBind">
    <!-- 已绑定信息 -->
    <el-row>
      <el-col :span="24">
        <el-divider content-position="left">已绑信息</el-divider>
        <el-card shadow="always">
          <div class="info">
            <span>绑定工位：</span>
            <span class="orange">{{stationInfo}}</span>
          </div>
          <div class="info">
            <span>当前ip：</span>
            <span class="orange">{{ip}}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 表单 -->
    <el-form :inline="true" :model="stationForm" class="demo-form-inline">
      <el-row>
        <el-form-item label="车间选择">
          <el-select ref="workShopCode" v-model="stationForm.workShopCode" placeholder="请选择车间">
            <el-option
              v-for="item in workShopList"
              :key="item.id"
              :value="item.departCode"
              :label="item.departName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="产线选择">
          <el-select ref="lineCode" v-model="stationForm.lineCode" placeholder="请选择产线">
            <el-option
              v-for="item in lineCodeList"
              :key="item.id"
              :value="item.lineCode"
              :label="item.lineName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工序选择">
          <el-select ref="processCode" v-model="stationForm.processCode" placeholder="请选择工序">
            <el-option
              v-for="item in processCodeList"
              :key="item.id"
              :value="item.processCode"
              :label="item.processName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工位选择">
          <el-select ref="station" v-model="stationForm.station" placeholder="请选择工位">
            <el-option
              v-for="item in stationList"
              :key="item.id"
              :value="item.stationCode"
              :label="item.stationName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-row>
    </el-form>
    <!-- 确定 关闭 -->
    <el-row style="padding:20px;text-align:center">
      <el-button type="primary" icon="el-icon-check" @click="hangleBind">登录</el-button>
      <el-button type="danger" icon="el-icon-close" @click="loginOut">登出</el-button>
    </el-row>
  </div>
</template>

<script>
import {
  getDepartmentLine,
  getLineProcess,
  getProcessStation,
} from "@/api/sys/departMentProcess";
import { getBindStation, bindStation, StationLogOut } from "@/api/stationBind";
export default {
  data() {
    return {
      stationForm: {
        workShopCode: "",
        lineCode: "",
        processCode: "",
        station: ""
      },
      workShopList: [],
      lineCodeList: [],
      processCodeList: [],
      stationList: [],
      workShopName: "",
      lineName: "",
      processName: "",
      stationName: "",
      ip: "192.168.50.59",
      user: {}
    };
  },
  methods: {
    getData() {
      getBindStation({ ipStation: "192.168.50.59" }).then(res => {
        if (res.data.success) {
          this.workShopList = res.data.data.workShopList;
          this.stationForm.workShopCode = res.data.data.workShopCode
          this.stationForm.lineCode = res.data.data.lineCode
          this.stationForm.processCode = res.data.data.processCode
          this.stationForm.station = res.data.data.station
        } else {
          this.$message.error(res.data.message + ":" + res.data.data);
        }
      });
    },
    //   产线数据
    getDepartmentLine() {
      getDepartmentLine({ departCode: this.stationForm.workShopCode }).then(
        response => {
          const result = response.data;
          if (result.success) {
            this.lineCodeList = result.data;
          } else {
            this.$message.error(result.message);
          }
        }
      );
    },
    //   工序数据
    getLineProcess() {
      const param = {
        lineCode: this.stationForm.lineCode
      };
      getLineProcess(param).then(res => {
        const result = res.data;
        if (result.success) {
          this.processCodeList = result.data;
        } else {
          this.$message.error(result.message);
        }
      });
    },
    // 工位数据
    getProcessStation() {
      const param = {
        processCode: this.stationForm.processCode,
        lineCode: this.stationForm.lineCode
      };
      getProcessStation(param).then(res => {
        const result = res.data;
        if (result.success) {
          //   this.workplaceData = result.data;
          this.stationList = result.data;
        } else {
          this.$message.error(result.message);
        }
      });
    },
    hangleBind() {
      let data = {
        userStation: {
          workShopCode: this.stationForm.workShopCode,
          workShopName: this.workShopName,
          lineCode: this.stationForm.lineCode,
          lineName: this.lineName,
          processCode: this.stationForm.processCode,
          processName: this.processName,
          stationCode: this.stationForm.station,
          stationName: this.stationName,
          userCode: this.$store.getters.userCode,
          userName: this.$store.getters.userName,
          stationStatus: 1
        },
        station: {
          lineCode: this.stationForm.lineCode,
          processCode: this.stationForm.processCode,
          stationCode: this.stationForm.station,
          stationName: this.stationName,
          stationIp: this.ip,
          loginUserCode: this.$store.getters.userCode
        }
      };
      bindStation(data).then(res => {
          let result = res.data
          if(result.success){
              this.$message.success("绑定成功！！")
              this.$emit('closeDialog')
          } else {
              this.$message.error(result.message + ":" + result.data)
          }
      });
    },
    loginOut(){
        let data = {
            workShopCode: this.stationForm.workShopCode,
            workShopName: this.workShopName,
            lineCode: this.stationForm.lineCode,
            lineName: this.lineName,
            processCode: this.stationForm.processCode,
            processName: this.processName,
            stationCode: this.stationForm.station,
            stationName: this.stationName,
            userCode: this.$store.getters.userCode,
            userName: this.$store.getters.userName,
            stationStatus: 0
        }
        StationLogOut(data).then(response => {
            let data = response.data
            if(data.success){
                this.$message.success("登出成功！！")
                this.$emit('closeDialog')
            } else {
                this.$message.error(data.message + ":" + data.data)
            }
        })
    },
    getIPs() {
      let _this = this;
      var RTCPeerConnection =
        window.RTCPeerConnection ||
        window.webkitRTCPeerConnection ||
        window.mozRTCPeerConnection;
      if (RTCPeerConnection)
        (function() {
          var rtc = new RTCPeerConnection({ iceServers: [] });
          if (1 || window.mozRTCPeerConnection) {
            rtc.createDataChannel("", { reliable: false });
          }

          rtc.onicecandidate = function(evt) {
            if (evt.candidate) grepSDP("a=" + evt.candidate.candidate);
          };
          rtc.createOffer(
            function(offerDesc) {
              grepSDP(offerDesc.sdp);
              rtc.setLocalDescription(offerDesc);
            },
            function(e) {
              console.warn("offer failed", e);
            }
          );

          var addrs = Object.create(null);
          addrs["0.0.0.0"] = false;
          function updateDisplay(newAddr) {
            if (newAddr in addrs) return;
            else addrs[newAddr] = true;
            var displayAddrs = Object.keys(addrs).filter(function(k) {
              return addrs[k];
            });
            console.log(displayAddrs);
            for (var i = 0; i < displayAddrs.length; i++) {
              if (displayAddrs[i].length > 16) {
                displayAddrs.splice(i, 1);
                i--;
              }
            }
            console.log("内网ip", displayAddrs[0]); //打印出内网ip
            // _this.user.ip_in = displayAddrs[0]; //获取内网ip
            _this.ip = displayAddrs[0];
          }

          function grepSDP(sdp) {
            var hosts = [];
            sdp.split("\r\n").forEach(function(line, index, arr) {
              if (~line.indexOf("a=candidate")) {
                var parts = line.split(" "),
                  addr = parts[4],
                  type = parts[7];
                if (type === "host") updateDisplay(addr);
              } else if (~line.indexOf("c=")) {
                var parts = line.split(" "),
                  addr = parts[2];
                updateDisplay(addr);
              }
            });
          }
        })();
      else {
        console.log("请使用主流浏览器：chrome,firefox,opera,safari");
      }
    }
  },
  created() {
    this.getData();
  },
  mounted() {
    this.getIPs();
  },
  computed: {
    stationInfo() {
      if (
        this.stationForm.lineCode &&
        this.stationForm.processCode &&
        this.stationForm.station &&
        this.stationForm.workShopCode
      ) {
        return `${this.$refs["workShopCode"].selectedLabel} -> ${this.$refs["lineCode"].selectedLabel} -> ${this.$refs["processCode"].selectedLabel} -> ${this.$refs["station"].selectedLabel}`;
      } else {
        return "";
      }
    }
  },
  watch: {
    "stationForm.workShopCode"(val) {
      if (!val) {
        this.$set(this.stationForm, "lineCode", "");
        this.$set(this.stationForm, "processCode", "");
        this.$set(this.stationForm, "station", "");
      } else {
        this.$nextTick(() => {
          this.workShopName = this.$refs["workShopCode"].selectedLabel;
        });
        //   获取产线
        this.getDepartmentLine();
      }
    },
    "stationForm.lineCode"(val) {
      if (!val) {
        this.$set(this.stationForm, "processCode", "");
        this.$set(this.stationForm, "station", "");
      } else {
        this.$nextTick(() => {
          this.lineName = this.$refs["lineCode"].selectedLabel;
        });
        //   获取工序
        this.getLineProcess();
      }
    },
    "stationForm.processCode"(val) {
      if (!val) {
        this.$set(this.stationForm, "station", "");
      } else {
        this.$nextTick(() => {
          this.processName = this.$refs["processCode"].selectedLabel;
        });
        //   获取工序
        this.getProcessStation();
      }
    },
    "stationForm.station"(val) {
      if (val) {
        this.$nextTick(() => {
          this.stationName = this.$refs["station"].selectedLabel;
        });
      }
    }
  }
};
</script>

<style lang='scss'>
.stationBind .el-card__body {
  display: flex;
  justify-content: space-between;
  .info {
    font-weight: 700;
  }
}
.orange {
  color: #ff9b6a;
}
</style>
