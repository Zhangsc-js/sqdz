<template>
  <div class="home">
    <div class="head-box">
      <headtit title="总装车间" :date="nowDate"></headtit>
    </div>
    <div class="flex-box zz-body">
      <div class="item-box" style="padding: 0 0 0 15px">
        <div class="chartbox znsc">
          <div class="box-tit">
            <img class="img" src="../../assets/img/data-icons/production.png" />
            <span>智能生产</span>
          </div>
          <div class="boxview">
            <div class="item">
              <small>实时节拍</small>
              <p>{{ topData.beat }}</p>
            </div>
            <div class="item">
              <small>月累计产量</small>
              <p>{{ monthObj.actualOutput||0 }}</p>
            </div>
            <div class="item">
              <small>月生产完成率</small>
              <p>{{ monthObj.completionRate||0 }}%</p>
            </div>
            <div class="item">
              <small>总工位</small>
              <p>149</p>
            </div>

            <div class="item">
              <small>总缓存</small>
              <p>40</p>
            </div>

            <div class="item item-btn" style="text-align: center; position: relative">
              <small>占用缓存</small>
              <p>{{ topData.cacheUseNum }}</p>
            </div>
          </div>
          <el-carousel
            indicator-position="none"
            :interval="3000"
            height="130px"
            style="width: 100%; height: 130px; overflow: hidden"
            arrow="hover"
            class="el_carousel_fade"
          >
            <el-carousel-item>
              <div class="chart-tit">
                <span>产量分析</span>
              </div>
              <div id="znsc5" style="width: 380px; height: 90px"></div>
            </el-carousel-item>
            <el-carousel-item>
              <div class="chart-tit">
                <span>OEE （%）</span>
              </div>
              <div id="znsc3" style="width: 380px; height: 90px"></div>
            </el-carousel-item>
          </el-carousel>
          <el-carousel
            indicator-position="none"
            arrow="hover"
            :interval="5000"
            height="130px"
            style="width: 100%; height: 130px; overflow: hidden"
            class="el_carousel_fade"
          >
            <el-carousel-item>
              <div class="chart-tit">
                <span>MTTR（min）</span>
              </div>
              <div id="znsc4" style="width: 380px; height: 90px"></div>
            </el-carousel-item>
            <el-carousel-item>
              <div class="chart-tit">
                <span>MTBF（h）</span>
              </div>
              <div id="znsc6" style="width: 380px; height: 90px"></div>
            </el-carousel-item>
          </el-carousel>
        </div>

        <div class="chartbox jywl">
          <div class="box-tit">
            <img class="img" src="../../assets/img/data-icons/logistics.png" />
            <span>精益物流</span>
          </div>
          <!-- <div
            class="chart-tit"
            style="font-size: 14px; position: absolute; top: 0; right: 0"
          >
            <span>道口利用率：{{ 0 }}</span>
          </div>-->
          <div class="chart-tit">
            <span>收货箱数</span>
          </div>
          <div id="jywl3" style="width: 100%; height: 110px"></div>
          <div class="chart-tit">
            <span>收料体积(m³)</span>
          </div>
          <div id="jywl4" style="width: 100%; height: 120px"></div>
          <div class="chart-tit">
            <span>道口利用率/在建</span>
          </div>
          <div id="jywl5" style="width: 100%; height: 110px"></div>
        </div>
      </div>
      <div class="item-box" style="padding-top: 0">
        <div class="mainview" style="position: relative">
          <div class="top-info">
            <div class="item">
              <span class="txt">计划产量</span>
              <v-countup :start-value="0" :end-value="startObj.planOutput " class="num"></v-countup>
            </div>
            <div class="item">
              <span class="txt">实时产量</span>
              <v-countup :start-value="0" :end-value="startObj.todayOutput" class="num"></v-countup>
            </div>

            <div class="item">
              <span class="txt">完成率</span>
              <v-countup :start-value="start" :end-value="startObj.completionRate" class="num"></v-countup>
              <span
                v-if="startObj.completionRate !=0"
                style="font-size: 14px;font-weight: bold;color: #4ec4f8;"
              >%</span>
            </div>
            <div class="item">
              <span class="txt">DLZ</span>
              <v-countup :start-value="0" :end-value="startObj.avgDlz" class="num"></v-countup>
              <span style="font-size: 14px;font-weight: bold;color: #4ec4f8;">h</span>
            </div>
            <div class="item" style="font-weight: bold;color: #4ec4f8;">
              <span class="txt">OEE</span>
              <v-countup :start-value="0" :end-value="startObj.realTimeOee" class="num"></v-countup>
              <span
                v-if="startObj.realTimeOee!=0"
                style="font-size: 14px;font-weight: bold;color: #4ec4f8;"
              >%</span>
            </div>
            <div class="item">
              <span class="txt">在岗人数</span>

              <span style="font-size: 14px;font-weight: bold;color: #4ec4f8;">{{"在建"}}</span>
            </div>
            <div
              class="item"
              @click="anquan"
              style="cursor: pointer;  position: relative;z-index: 2;"
            >
              <span class="txt anquanTxt">安全</span>
              <div class="safeCircle" :style="{backgroundColor:getSafe?'lime':'red'}"></div>
              <span
                class="circle"
                style="background: #0bb20c"
                v-if="days.todayProductionStatus == 0"
              ></span>
              <span
                class="circle"
                style="background: #ffc107"
                v-if="days.todayProductionStatus == 1"
              ></span>
              <span
                class="circle"
                style="background: #ff4d51"
                v-if="days.todayProductionStatus == 2"
              ></span>
            </div>
          </div>
          <div class="viewbox" style="margin-top: 20px; position: relative">
            <img
              class="img"
              src="../../assets/img/mainviewbg.png"
              style="width:95%;margin-left: 0; margin-top: -3%"
            />
            <div v-for="(item,index) in dataSum" :key="index">
              <div
                class="car-point"
                :style="{left:item.left+'%',top:item.top+'%'}"
                v-show="item.flag"
                @mouseenter="item.flagBox=true"
                @mouseleave="item.flagBox=false"
              ></div>
              <div
                class="boxbox"
                :style="{left:item.leftBox+'%',top:item.topBox+'%'}"
                v-show="item.flag&&item.flagBox"
              >
                <div v-if="item.flag">停机类型:{{item.message.downtimeType}}</div>
                <div v-if="item.flag">开始时间:{{item.message.startTime}}</div>
                <div v-if="item.flag">持续时间:{{item.message.duration}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="botview">
          <div class="chartbox zypz">
            <div class="box-tit">
              <img class="img" src="../../assets/img/data-icons/quality.png" />
              <span>卓越品质</span>
            </div>
            <div class="zypzboxs">
              <div class="item">
                <div class="chart-tit">
                  <span>拧紧合格率（%）</span>
                </div>
                <div class="chart" id="zypz1"></div>
              </div>

              <div class="item">
                <div class="chart-tit">
                  <span>一次通过率（%）</span>
                </div>
                <div class="chart" id="zypz3"></div>
              </div>
              <div class="item">
                <div class="chart-tit">
                  <span>AUDIT</span>
                </div>
                <div class="chart" id="zypz4"></div>
              </div>
              <div class="item">
                <div class="chart-tit">
                  <span>过点合格占比</span>
                </div>
                <div class="chart" id="gdhg"></div>
              </div>
            </div>
          </div>
          <div class="chartbox sbgl">
            <div class="box-tit">
              <img class="img" src="../../assets/img/data-icons/dev.png" />
              <span>设备管理</span>
            </div>
            <div class="sbgl1">
              <div class="sbgl2box">
                <div class="item">
                  <div class="chart-tit">
                    <span>点检完成率</span>
                  </div>
                  <div id="sbgl1" style="width: 100px; height: 90px;margin-right:50px;"></div>
                </div>
                <div class="item">
                  <div class="chart-tit">
                    <span>维修完成率</span>
                  </div>
                  <div id="sbgl2" style="width: 100px; height: 90px"></div>
                </div>
              </div>
              <div class="sbgl3box">
                <div class="chart-tit">
                  <span>停线分析（min）</span>
                </div>
                <div id="sbgl3" style="width: 100%; height: 110px" @click="showSblgDialog"></div>
              </div>
            </div>
            <div class="sbgltop">
              <div class="info">
                <small>车间设备总数/在建</small>
                <!-- <span>{{ deviceTotal }}</span> -->
              </div>
            </div>
            <div class="sbgltable">
              <div class="chart-tit">
                <span>备件领用记录/在建</span>
              </div>
              <div
                style="min-height: 80px"
                @click="showTxjl(receiveLogData,[{name:'备件名称',prop:'sparesName'},{name:'领取数量',prop:'createOn'},{name:'领用日期',prop:'usedQty'}])"
              >
                <table class="table">
                  <thead>
                    <tr>
                      <th>备件名称</th>
                      <th>领取数量</th>
                      <th>领用日期</th>
                    </tr>
                  </thead>
                  <tbody style="min-height: 3vw">
                    <tr v-for="(item, index) in receiveLogData" v-bind:key="index">
                      <td>{{ item.sparesName }}</td>
                      <td>{{ item.createOn }}</td>
                      <td>{{ item.usedQty }}</td>
                    </tr>
                  </tbody>
                </table>
                <div
                  v-if="!receiveLogData.length"
                  style="
                    text-align: center;
                    line-height: 30px;
                    color: #fff;
                    background: rgba(255, 255, 255, 0.3);
                  "
                >暂无记录</div>
              </div>

              <div class="chart-tit">
                <span>停线记录</span>
              </div>
              <div
                style="min-height: 80px"
                @click="showTxjl(fixData,[{name:'故障类型',prop:'downtimeType'},{name:'开始时间',prop:'sTime'},{name:'结束时间',prop:'eTime'}])"
              >
                <table class="table">
                  <thead>
                    <tr>
                      <th>故障类型</th>
                      <th>开始时间</th>
                      <th>结束时间</th>
                    </tr>
                  </thead>
                  <tbody style="min-height: 3vw">
                    <tr v-for="(item, index) in fixData" v-bind:key="index">
                      <td>{{ item.downtimeType }}</td>
                      <td>{{ item.sTime }}</td>
                      <td>{{ item.eTime }}</td>
                    </tr>
                  </tbody>
                </table>
                <div
                  v-if="!fixData.length"
                  style="
                    text-align: center;
                    line-height: 30px;
                    color: #fff;
                    background: rgba(255, 255, 255, 0.3);
                  "
                >暂无记录</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="item-box" style="padding: 0 15px 0 0">
        <div
          class="chartbox"
          style="
            display: flex;
            justify-content: space-around;
            margin-bottom: 15px;
          "
        >
          <div class="aq1">
            <img
              style="display: block;margin: 10px auto;"
              src="../../assets/img/data-icons/edit.png"
            />
            <small style="font-size: 16px;">智能排产</small>
            <br />
            <small style="font-size: 14px;color:#fff">在建</small>
          </div>
          <div class="aq1">
            <img
              style="display: block;margin: 10px auto;"
              src="../../assets/img/data-icons/design.png"
            />
            <small style="font-size: 16px;">预测性维修</small>
            <br />
            <small style="font-size: 14px;color:#fff">在建</small>
          </div>
        </div>

        <div class="chartbox nyhj" style="position: relative">
          <div class="box-tit">
            <img class="img" src="../../assets/img/data-icons/ene.png" />
            <span>能源环境</span>
            <el-radio-group
              style="margin-left:10px"
              v-model="nyhjChange"
              size="mini"
              fill="#152940"
              @change="changeNyhj"
            >
              <el-radio-button label="日"></el-radio-button>
              <el-radio-button label="月"></el-radio-button>
            </el-radio-group>
          </div>
          <div class="chart-tit">
            <span>总能耗（tce）</span>
          </div>
          <div id="nyhj1" style="width: 290px; height: 120px"></div>
          <el-carousel
            indicator-position="none"
            :interval="5000"
            height="140px"
            style="width: 100%; height: 140px; overflow: hidden"
            arrow="hover"
            class="el_carousel_fade"
          >
            <el-carousel-item :key="4">
              <div class="chart-tit">
                <span>电能（kW·h）</span>
              </div>
              <div id="nyhj4" style="width: 290px; height: 110px"></div>
            </el-carousel-item>
            <el-carousel-item :key="5">
              <div class="chart-tit">
                <span>压缩空气（m³）/在建</span>
              </div>
              <div style="position: relative">
                <div id="nyhj3" style="width: 290px; height: 110px"></div>
              </div>
            </el-carousel-item>
            <el-carousel-item :key="3">
              <div class="chart-tit">
                <span>工艺循环水(t)/在建</span>
              </div>
              <div style="position: relative">
                <div id="nyhj5" style="width: 290px; height: 110px"></div>
              </div>
            </el-carousel-item>
            <el-carousel-item :key="1">
              <div class="chart-tit">
                <span>自来水(t)</span>
              </div>
              <div style="position: relative">
                <div id="nyhj6" style="width: 290px; height: 110px"></div>
              </div>
            </el-carousel-item>
            <el-carousel-item :key="2">
              <div class="chart-tit">
                <span>空调水(t)</span>
              </div>
              <div style="position: relative">
                <div id="nyhj2" style="width: 290px; height: 110px"></div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="chartbox bdc">
          <div class="box-tit">
            <img class="img" src="../../assets/img/data-icons/bdc.png" />
            <span>BDC</span>
          </div>
          <!-- <el-row style="color: #fff; font-size: 12px; padding: 10px 0">
            <el-col :span="8">
              <span>吞吐量/入：</span>
              <span style="colo: #4ec4f8">{{houtBDCObj.inNums || 0}}</span>
            </el-col>
            <el-col :span="8">
              <span>吞吐量/出：</span>
              <span style="colo: #4ec4f8">{{houtBDCObj.outNums || 0}}</span>
            </el-col>
            <el-col :span="8">
              <span>在库数量：</span>
              <span style="colo: #4ec4f8">{{houtBDCObj.inBankNum|| 0}}</span>
            </el-col>
          </el-row>-->
          <div class="bdc-bot">
            <div class="tip">
              <small>吞吐量/入</small>
              <p>{{ houtBDCObj.inNums || 0 }}</p>
            </div>
            <div class="tip">
              <small>吞吐量/出</small>
              <p>{{ houtBDCObj.outNums || 0}}</p>
            </div>
            <div
              class="tip topFive"
              style="display:flex;justify-content: center; align-items: center;"
              @click="showTopFive"
            >
              <small>在库Top10</small>
            </div>
          </div>
          <div class="bdc-bot">
            <div class="tip">
              <small>在使用库位</small>
              <p>{{ bufferPrediction.useNum }}</p>
            </div>
            <div class="tip">
              <small>未使用库位</small>
              <p>{{ bufferPrediction.freeNum }}</p>
            </div>
            <div class="tip">
              <small>库位利用率</small>
              <p>{{ bufferPrediction.useRate }}%</p>
            </div>
          </div>

          <div @click="onOpenBdc()">
            <div class="chart-tit">
              <span>在库</span>
            </div>
            <div id="bdc3" style="width: 100%; height: 110px"></div>
          </div>

          <div class="bdc-mid">
            <div class="state">
              <div class="chart-tit">
                <span>堆垛机状态</span>
              </div>
              <div class="ddj" v-for="(item, index) in ddjList" v-bind:key="index">
                <img class="img" src="../../assets/img/data-icons/piler.png" width="33" height="33" />
                <span>{{ item.pilerName }}</span>
                <div
                  :class="item.pilerStatus == 0 ? 'free' : 'err'"
                >{{ item.pilerStatus == 0 ? "自动模式" : "异常" }}</div>
              </div>
            </div>
            <div class="pie">
              <div class="chart-tit">
                <span>故障分析</span>
              </div>
              <div id="bdc2" style="width: 100%; height: 110px" @click="showGuzhangDialog"></div>
            </div>
          </div>
          <!-- <div class="chart-tit">
            <span>缓存区预警</span>
          </div>-->
        </div>
      </div>
    </div>
    <div class="as-dialog" v-show="bdcShow">
      <div class="header" style="position: absolute; right: 20px; top: 20px">
        <i class="el-icon-close" style="color: #fff; font-size: 40px" @click="bdcShow = false"></i>
      </div>
      <div class="infotable-cs">
        <div
          class="box-tit"
          style="
            text-align: left;
            display: flex;
            align-items: center;
            color: #fff;
            line-height: 50px;
          "
        >
          <img class="img" src="../../assets/img/shangqi5-3.png" />
          <span>在库时长TOP5</span>
        </div>

        <div id="bdc1" style="width: 760px; height: 500px"></div>
      </div>
    </div>
    <div class="as-dialog" v-show="handImgShow">
      <div class="header" style="position: absolute; right: 20px; top: 20px">
        <i class="el-icon-close" style="color: #fff; font-size: 40px" @click="handImgShow = false"></i>
      </div>
      <div class="infotable-cs">
        <div class="chart-tit">
          <span style="padding:20px">缓存占用趋势</span>
        </div>
        <div id="znsc0" style="width: 760px; height: 460px"></div>
      </div>
    </div>
    <pieDialog ref="pieDialog" :title="pieDialogTitle" :hasData="hasData"></pieDialog>
    <el-dialog title :visible.sync="anquanDialog" width="50%" append-to-body class="abc">
      <green-cross @anquan="anquan" :dayArr="dayArr" :requestOption="key"></green-cross>
    </el-dialog>
    <el-dialog class="topFiveDialog" title="在库Top10列表" :visible.sync="topFiveDialog" width="50%">
      <top-five ref="top_five"></top-five>
    </el-dialog>
    <txjl-dialog ref="txjl_dialog" shopName="ZZ"></txjl-dialog>
  </div>
</template>

<script>
import echarts from "echarts";
import headtit from "./headtit.vue";
import floatmenu from "./floatmenu.vue";
import {
  faultAnalysis,
  getShopDeviceNum,
  receiveLog,
  maintainPercent,
  spotCheckPercent,
  get_check_maintain_complete_rate,

} from "@/api/shangqi/device";
import { safeProductionDays, cy_downtime_analyze, monthProduction, downtime_record } from "@/api/shangqi/cy";
import {
  getRealTimeData,
  getMonthProductionInfo,
  getTodayProductionInfo,
  avgPassTime,
  safeDays,
  listAudit,
  listCoincidenceRate,
  getTodayOk,
  carTypeOutput,
  listDayOee,
  listMonthMttrMtbf,
  listDlq,
  pilerStatus,
  pilerFault,
  pilerUsageRateFault,
  avg_on_garage_time,
  tightening_pass_rate,
  houtBDCinOut,
  dayBDCAvgTime,
  get_today_ok_nok,
  list_test_data
} from "@/api/shangqi/zz";
import { list_energy_consumption, listTce } from "@/api/shangqi/enegy";
import { productionRealTimeData } from "@/api/shangqi/cs";
import hand from "@/assets/img/hand.png";
import moment from "moment";
import { getUnitString } from '@/utils/common';
import { lisFaultAlarm, listCache } from "@/api/shangqi/cs";
import { list_warehouse_use_info } from "@/api/shangqi/wlModule";
import { stackEchartOption, onePieEchartOption, girdEchartOption, girdLineEchartOptions, yuanEchartOption, banyuanEchartOption, areaLineEchart } from '@/utils/echartOption'
import { types } from '@babel/core';
import pieDialog from '@/components/pieDialog';
import greenCross from './greenCross'
import { list_downtime_production_line, month_un_safety_production_day, get_today_test_data, list_month_tce, list_day_tce } from '@/api/abcd.js'
import dataSum from './dataSum'
import topFive from './topFive'
import txjlDialog from './txjlDialog'


export default {
  name: "shangqi",
  components: {
    headtit,
    floatmenu,
    pieDialog,
    greenCross,
    topFive,
    txjlDialog
  },
  data() {
    return {
      unitOption: {
        dianUnit: '',
        kongtiaoUnit: '',
        gongyiUnit: '',
        zilaiUnit: '',
        yasuoUnit: ''
      },
      nyhjChange: '日',
      topFiveDialog: false,
      houtBDCObj: {},
      interval: null, //自动循环参数
      DjList: ["年龄分布", "籍贯分布", "学历分布", "党龄分布"],
      jsrc2_res: [],
      jsrc3_res: [],
      jsrc4_res: "",
      start: 0,
      Mapzbid: "",
      getSafe: true,
      zbid: "",
      shortName: "",
      fixData: [],
      handImgSrc: hand,
      receiveLogData: [],
      ddjList: [],
      startObj: {},
      anquanDialog: false,
      dataSum,
      days: {},
      topData: {},
      bufferPrediction: {},
      deviceTotal: "",
      key: {
        workCode: 78,
        shopName: "ZZ",
      },
      djry4_res: [],
      djrydata: "",
      djrczrs: "",
      zbdryqk: [],
      zbdryqkShow: [],
      //地图参数
      tabcur: 4,
      points: [],
      centerpoint: "",
      key: {
        workCode: 78,
        shopName: "ZZ",
      },
      bdcShow: false,
      handImgShow: false,
      nowDate: "",
      monthObj: {},
      sblgOption: null,
      guzhangOption: null,
      okNoOkOption: null,
      dayArr: [],
      pieDialogTitle: '',
      hasData: ''
    };
  },
  computed: {},
  watch: {},
  mounted() {

    this.initData();
    //this.test();
    // 智能排产
    getMonthProductionInfo({ shopName: "ZZ", workCode: "78" }).then(res => {
      if (res.data.success) {
        this.$set(this.monthObj, 'actualOutput', res.data.data.monthlyOutput)
        this.$set(this.monthObj, 'completionRate', res.data.data.monthCompletionRate)
      }
    })
    // 能源总耗
    this.changeNyhj()
  },
  methods: {
    async getData() {
      let res = await list_downtime_production_line({ ...this.key })
      if (res.data.data && res.data.data.length > 0) {
        res.data.data.forEach(item => {
          this.dataSum.forEach(v => {
            if (item.lineBody == v.name) {
              v.flag = true
              v.message = {
                downtimeType: item.downtimeType,
                startTime: item.startTime,
                duration: item.duration,
              }
            }
          })
        })
      }
    },
    async isSafe() {

      let month = (new Date).getMonth() + 1
      let year = (new Date).getFullYear()
      month = year + '-' + month
      let res = await month_un_safety_production_day({ ...this.key, month })
      if (res.data.success) {
        if (res.data.data.success) {
          if (res.data.data.length <= 0) {
            this.getSafe = true
          } else {
            res.data.data.forEach(item => {
              let num = item.split('-')[2]
              if (num == (new Date).getDate()) {
                this.getSafe = false
              }
            })
          }

        }
      }
    },
    initData() {
      this.getFixRecord();
      this.getChartData();
      this.dataSum = this.dataSum.map(item => {
        return {
          ...item,
          leftBox: +item.left + 2,
          topBox: +item.top - 2,
          flag: false,
          flagBox: false,
          message: {}
        }
      })
      this.getData()
      this.isSafe()

    },
    changeNyhj() {
      // 总能耗
      if (this.nyhjChange == '月') {
        list_month_tce({ ...this.key, rowNum: 7 }).then(res => {
          let date = res.data.data.map((x) => x.statisDate);
          let data = res.data.data.map((x) => x.tce && x.tce.toFixed(0));
          var obj = {
            id: 'nyhj1',
            x: date,
            y: [data],
            name: ['总耗'],
            colors: [['#00ffa7', '#00d3e4']],
            unit: 'T'
          }
          girdEchartOption(obj);
        })
        // 电能
        list_energy_consumption({ dimensionality: 'm', energyTypes: '电力', rowNum: 7, ...this.key }).then(res => {
          if (res.data.success) {
            let date = res.data.data.list.map((x) => moment(x.theDate).format('yyyy-MM'));
            let data = res.data.data.list.map((x) => x.consume && x.consume.toFixed(0));
            var obj = {
              id: 'nyhj4',
              x: date,
              y: [data],
              name: ['电力'],
              unit: "kW·h"
            }
            this.unitOption = { ...this.unitOption, dianUnit: getUnitString(res.data.data.powerNum) }
            girdEchartOption(obj);
          }
        })
      } else {
        list_day_tce({ ...this.key, rowNum: 7 }).then(res => {
          let date = res.data.data.map((x) => moment(x.statisDate).format('MM-DD'));
          let data = res.data.data.map((x) => x.tce && x.tce.toFixed(0));
          var obj = {
            id: 'nyhj1',
            x: date,
            y: [data],
            name: ['总耗'],
            colors: [['#00ffa7', '#00d3e4']],
            unit: 'T'
          }
          girdEchartOption(obj);
        })
        // 电能
        list_energy_consumption({ dimensionality: 'd', energyTypes: '电力', rowNum: 7, ...this.key }).then(res => {
          if (res.data.success) {
            let date = res.data.data.list.map((x) => moment(x.theDate).format('MM-dd'));
            let data = res.data.data.list.map((x) => x.consume && x.consume.toFixed(0));
            var obj = {
              id: 'nyhj4',
              x: date,
              y: [data],
              name: ['电力'],
              unit: "kW·h"
            }
            this.unitOption = { ...this.unitOption, dianUnit: getUnitString(res.data.data.powerNum) }
            girdEchartOption(obj);
          }
        })
      }
    },
    showTopFive() {
      this.topFiveDialog = true
      this.$nextTick(() => {
        this.$refs.top_five.rowNum = 10
        this.$refs.top_five.getData('ZZ')
      })
    },

    showTxjl(data, propData) {
      this.$refs.txjl_dialog.tableData = data
      this.$refs.txjl_dialog.propData = propData
      this.$refs.txjl_dialog.visible = true
    },
    test() {

    },
    async anquan(month) {
      if (!(typeof month == 'string' || typeof month == 'number')) {
        month = (new Date).getMonth() + 1
        month = month < 10 ? '0' + month : month
        let year = (new Date).getFullYear()
        month = year + '-' + month
      }
      this.anquanDialog = true
      let res = await month_un_safety_production_day({ ...this.key, "month": month, })
      if (res.data.success) {
        this.dayArr = res.data.data
      }
    },

    // 停线分析
    showSblgDialog() {
      if (this.sblgOption) {
        this.pieDialogTitle = '停线分析';
        this.hasData = '区域';
        this.$refs.pieDialog.onePieDialog(this.sblgOption);
      }
    },

    showGuzhangDialog() {
      if (this.guzhangOption) {
        this.pieDialogTitle = '故障分析';
        this.hasData = '类型';
        this.$refs.pieDialog.onePieDialog(this.guzhangOption);
      }
    },

    showGDHGDialog() {
      if (this.okNoOkOption) {
        this.pieDialogTitle = '过点合格占比';
        this.$refs.pieDialog.onePieDialog(this.okNoOkOption);
      }
    },

    // 打开bdc弹窗
    onOpenBdc() {
      this.bdcShow = true;
    },
    getFixRecord() {
      this.nowDate = moment().format('YYYY年MM月DD日');
      downtime_record({ ...this.key, rowNum: 2 }).then((res) => {
        if (res.data.success === true) {
          this.fixData = res.data.data.map((x) => ({
            ...x,
            sTime: moment(x.sTime).format("MM-DD HH:mm"),
            eTime: moment(x.eTime).format("MM-DD HH:mm"),
          }));
        }
      });
      //  过点合格占比 接口
      get_today_test_data({ shopName: "ZZ", workCode: "78" }).then(res => {
        if (res.data.success === true) {
          let data = res.data.data;
          let dataOK = data.okNum
          let dataNOK = data.nokNum
          let data1 = { name: '合格', value: dataOK, color: true };
          let data2 = { name: '不合格', value: dataNOK, color: true };
          this.okNoOkOption = [data1, data2];
          onePieEchartOption({ id: 'gdhg', inData: [data1, data2], name: '过点合格占比', showLabel: false, isRed: true })
        }
      });

      monthProduction({ ...this.key }).then(res => {
        if (res.data.success === true) {
          this.monthObj = res.data.data;
        }
      })

      houtBDCinOut({ ...this.key }).then(res => {
        if (res.data.success === true) {
          this.houtBDCObj = res.data.data;
        }
      })

      dayBDCAvgTime({ ...this.key }).then(res => {
        if (res.data.success === true) {
          let date = res.data.data.map(e => moment(e.theDate).format('MM-DD'));
          let data = res.data.data.map(e => e.avgTimes);
          let option = { id: "bdc3", x: date, y: [data], name: ['在库'], colors: [["#115380", "#00b3cf", "#115380",]] };
          girdEchartOption(option);

        }
      });

      tightening_pass_rate({ ...this.key, rowNum: 7 }).then(res => {
        if (res.data.success === true) {
          let date = res.data.data.map(e => moment(e.statisDate).format('MM-DD'));
          let data = res.data.data.map(e => e.qualifiedRate);
          let option = { id: 'zypz1', max: 100, name: ['螺栓拧紧合格率'], x: date, y: [data] };
          girdEchartOption(option);
        }
      })
      getShopDeviceNum({ ...this.key }).then((res) => {
        if (res.data.success === true) {
          this.deviceTotal = res.data.data;
        }
      });
      receiveLog({ ...this.key, rowNum: 2 }).then((res) => {
        if (res.data.success === true) {
          this.receiveLogData = res.data.data.map((x) => ({
            ...x,
            createOn: moment(x.createOn).format("YYYY-MM-DD HH:mm"),
          }));
        }
      });

      get_check_maintain_complete_rate({ ...this.key, rowNum: 3 }).then(
        (res) => {
          if (res.data.success === true) {

            let value1 = (res.data.data || {}).checkCompleteRate || 0;
            let value2 = (res.data.data || {}).maintainCompleteRate || 0;

            let option1 = { id: 'sbgl1', value: (res.data.data || {}).checkCompleteRate || 0 }
            yuanEchartOption(option1);

            let option2 = { id: 'sbgl2', value: (res.data.data || {}).maintainCompleteRate || 0 }
            yuanEchartOption(option2);
          }
        }
      );
      getRealTimeData({ ...this.key, rowNum: 7 }).then((res) => {
        if (res.data.success === true) {
          this.startObj = { ...res.data.data };
        }
      });
      safeProductionDays({ ...this.key }).then((res) => {
        if (res.data.success === true) {
          this.days = { ...res.data.data };
        }
      });
      // pilerStatus,pilerUsageRateFault
      pilerStatus({ ...this.key }).then((res) => {
        if (res.data.success === true) {
          //this.days ={...res.data.data}
          //pilerName pilerStatus
          this.ddjList = res.data.data;
        }
      });
      pilerUsageRateFault({ ...this.key }).then((res) => {
        if (res.data.success === true) {
          //this.days ={...res.data.data}
          this.bufferPrediction = res.data.data;
        }
      });
      productionRealTimeData({ ...this.key }).then((res) => {
        if (res.data.success === true) {
          this.topData = { ...res.data.data };
          //this.deviceTotal=res.data.data
        }
      });
    },
    getChartData() {

      carTypeOutput({ ...this.key, rowNum: 7 }).then((res) => {
        if (res.data.success === true) {
          let date = res.data.data.map(x => moment(x.statisDate).format('MM-DD'));
          let type = [];
          res.data.data.forEach(e => {
            e.carTypeOutput.forEach(j => {
              type.push(j.carType)
            })
          })
          type = Array.from(new Set(type)); // 对数组去重
          let data = [];
          type.forEach((d, i) => {
            let value = [];
            res.data.data.forEach((e, m) => {
              e.carTypeOutput.forEach(j => {
                if (j.carType === d) {
                  value.push(j.output);
                }
              })
              if (value.length == m) {
                value.push(0);
              }
            })
            data.push(value);
          })

          console.log(date, type, data);
          let option = { id: 'znsc5', x: date, name: type, y: [data], legend: true };
          stackEchartOption(option);
        }
      });
      // oEE
      listDayOee({ ...this.key, rowNum: 7 }).then((res) => {
        if (res.data.success === true) {
          let date = res.data.data.map((x) => moment(x.theDate).format('MM-DD'));
          let oeeData = res.data.data.map((x) => x.oee);
          let option = { id: 'znsc3', name: ['OEE'], x: date, y: [oeeData] };
          girdEchartOption(option);
        }
      });
      //
      listMonthMttrMtbf({ ...this.key, rowNum: 7 }).then((res) => {
        if (res.data.success === true) {
          let date = res.data.data.map((x) => x.theMonth);
          let mttrData = res.data.data.map((x) => x.mttr);
          let mtbfData = res.data.data.map((x) => x.mtbf);

          let option1 = { id: 'znsc4', name: ['MTTR'], x: date, y: [mttrData] };
          girdLineEchartOptions(option1);

          let option2 = { id: 'znsc6', name: ['MTBF'], x: date, y: [mttrData] };
          girdLineEchartOptions(option2);
        }
      });
      listDlq({ ...this.key, rowNum: 7 }).then((res) => {
        if (res.data.success === true) {
          let date = res.data.data.map((x) => moment(x.theDate).format('MM-DD'));
          let data = res.data.data.map((x) => x.pecRate);
          let option = { id: 'zypz3', max: 100, name: ['DLQ'], x: date, y: [data], colors: [["#3BFFF9", "#3BFFF9", "#3BFFF9"]] };
          girdLineEchartOptions(option)
        }
      });
      listAudit({ ...this.key, rowNum: 7 }).then((res) => {
        if (res.data.success === true) {
          let date = res.data.data.map((x) => x.carType);
          let data = res.data.data.map((x) => x.audit);

          let option = { id: 'zypz4', name: ['AUDIT'], x: date, y: [data], colors: [["#c9ca22", "#02a29b", "#c9ca22"]] };
          girdEchartOption(option);
        }
      });
      // 右下角堆垛机故障分析
      pilerFault({ ...this.key, rowNum: 7 }).then((res) => {
        if (res.data.success === true) {
          //rowNum
          let data = res.data.data.map((x) => ({
            name: x.typeName,
            value: x.num,
          }));
          this.guzhangOption = data;
          onePieEchartOption({ id: 'bdc2', inData: data, name: '故障分析', showLabel: false, width: '50%' })

        }
      });
      // lisFaultAlarm({ ...this.key, rowNum: 7 }).then((res) => {
      //   if (res.data.success === true) {
      //     let date = res.data.data.map((x) => x.faultType);
      //     let data = res.data.data.map((x) => x.duration);

      //     let option = {id:'sbgl3',name:['设备故障'],x:date,y:[data]}
      //     girdEchartOption(option);
      //   }
      // });

      cy_downtime_analyze({ ...this.key }).then(res => {
        if (res.data.success === true) {
          let data = res.data.data.map(e => ({ name: e.downtimeType, value: e.duration }))
          this.sblgOption = data;
          onePieEchartOption({ id: 'sbgl3', inData: data, name: '停线分析', showLabel: false })
        }
      })


      avg_on_garage_time({ ...this.key, rowNum: 7 }).then((res) => {
        if (res.data.success === true) {
          let date = res.data.data.map((x) => moment(x.statisDate).format('MM-DD'));
          let data = res.data.data.map((x) => x.duration);

          let option = { id: "bdc1", name: ["在库时长"], x: date, y: [data] };
          girdEchartOption(option);
        }
      });

      list_energy_consumption({
        ...this.key,
        rowNum: 7,
        energyTypes: "空调水",
      }).then((res) => {
        if (res.data.success === true) {
          let date = res.data.data.list.map((x) => moment(x.theDate).format('MM-DD'));
          let data = res.data.data.list.map((x) => x.consume && x.consume.toFixed(0));
          let option = { id: 'nyhj2', name: ['空调水'], x: date, y: [data] };
          this.unitOption = { ...this.unitOption, kongtiaoUnit: res.data.data.powerNum };
          girdEchartOption(option);

        }
      });
      list_energy_consumption({
        ...this.key,
        rowNum: 7,
        energyTypes: "压缩空气0.7MPa",
      }).then((res) => {
        if (res.data.success === true) {
          let date = res.data.data.list.map((x) => moment(x.theDate).format('MM-DD'));
          let data = res.data.data.list.map((x) => x.consume && x.consume.toFixed(0));
          let option = { id: 'nyhj3', name: ['压缩空气'], x: date, y: [data] };
          this.unitOption = { ...this.unitOption, yasuoUnit: res.data.data.powerNum };
          girdEchartOption(option);
        }
      });
      list_energy_consumption({
        ...this.key,
        rowNum: 7,
        energyTypes: "工艺循环水",
      }).then((res) => {
        if (res.data.success === true) {
          let date = res.data.data.list.map((x) => moment(x.theDate).format('MM-DD'));
          let data = res.data.data.list.map((x) => x.consume && x.consume.toFixed(0));
          let option = { id: 'nyhj5', name: ['工艺循环水'], x: date, y: [data] };
          this.unitOption = { ...this.unitOption, gongyiUnit: res.data.data.powerNum };
          girdEchartOption(option);

        }
      });
      list_energy_consumption({
        ...this.key,
        rowNum: 7,
        energyTypes: "自来水",
      }).then((res) => {
        if (res.data.success === true) {
          let date = res.data.data.list.map((x) => moment(x.theDate).format('MM-DD'));
          let data = res.data.data.list.map((x) => x.consume && x.consume.toFixed(0));
          let option = { id: 'nyhj6', name: ['自来水'], x: date, y: [data] };
          this.unitOption = { ...this.unitOption, zilaiUnit: res.data.data.powerNum };
          girdEchartOption(option);
        }
      });

      listCache({ ...this.key, rowNum: 7 }).then((res) => {
        if (res.data.success === true) {
          let date = res.data.data.map((x) => moment(x.theDate).format('MM-DD'));
          let data = res.data.data.map((x) => x.occupancyNum);
          let option = { id: 'znsc0', name: ['缓存占用趋势'], x: date, y: [data] };
          girdEchartOption(option);
        }
      });
      list_warehouse_use_info({
        ...this.key,
        rowNum: 7,
      }).then((res) => {
        if (res.data.success === true) {
          let date = res.data.data.map((x) => moment(x.createTime).format('MM-DD'));
          let data = res.data.data.map((x) => x.boxNum);
          let data1 = res.data.data.map((x) => x.volume);
          let data2 = res.data.data.map((x) => x.useRate);

          let option1 = { id: 'jywl3', name: ['收货箱数'], x: date, y: [data] };
          girdEchartOption(option1);

          let option2 = { id: 'jywl4', name: ['收料体积'], x: date, y: [data1] };
          girdEchartOption(option2);
        }
      });
    },

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.home {
  display: flex;
  flex-direction: column;
  width: 1920px;
  height: 1080px;
  background-image: url("../../assets/img/background1.png");
  background-size: cover;
}

.home .head-box {
  position: relative;
}

.home .flex-box {
  display: flex;
  padding: 30px 10px;
}

.flex-box .item-box {
  box-sizing: border-box;
  padding: 15px;
}

.flex-box .item-box .chartbox {
  border-image-source: url("../../assets/img/borderimg.png");
  border-image-slice: 28 fill;
  border-width: 15px;
  border-style: solid;
  background-clip: padding-box;
  filter: blur(0px);
}

.item-box .box-tit {
  font-size: 20px;
  line-height: 22px;
  text-align: left;
  font-weight: bold;
  /*background: linear-gradient(to bottom, #1bdffc, #0c93e8);*/
  /*-webkit-background-clip: text;*/
  /*color: transparent;*/
  color: #fff;
}

.item-box .box-tit img {
  width: 20px;
  height: 17px;
  margin-right: 7px;
  position: relative;
  vertical-align: top;
}

.item-box .box-cont {
  color: #fbfcfa;
  display: flex;
  padding: 0 10px;
}

.chart-tit {
  text-align: left;
  position: relative;
  /*color: #4ec4f8;*/
  color: #fff;
  font-size: 16px;
  margin: 5px 0 5px 0;
}

/* znsc */
.znsc {
  width: 400px;
  /*padding: 15px;*/
  height: 448px;
  box-sizing: border-box;
  margin-bottom: 15px;
}

.top-chart {
  display: flex;
}

.top-chart .chart {
  flex: 1;
}

.jywl {
  width: 400px;
  /*padding: 15px;*/
  height: 488px;
  box-sizing: border-box;
}

.nyhj {
  width: 320px;
  height: 330px;
  /*padding: 15px;*/
  box-sizing: border-box;
  margin-bottom: 15px;
}

.aq {
  width: 320px;
  height: 100px;
  /*padding: 15px;*/
  box-sizing: border-box;
  margin-bottom: 15px;
}

.aq1 {
  width: 112px;
  height: 112px;
  padding: 10px 0;
  text-align: center;
  background: url("../../assets/img/info.png") no-repeat;
  background-size: cover;
  color: #a9ddee;
  box-sizing: border-box;
}

.bdc {
  width: 320px;
  height: 448px;
  /*padding: 15px;*/
  box-sizing: border-box;
}

.bdc-mid {
  display: flex;
}

.bdc-mid .state {
  width: 100%;
  overflow: hidden;
}

.bdc-mid .pie {
  width: 150px;
}

.bdc-mid .state .ddj {
  width: 70px;
  position: relative;
  font-size: 12px;
  color: #fff;
  margin: 0px 55px 5px 10px;
  text-align: center;
  float: left;
}

.bdc-mid .state .ddj img {
  display: inline-block;
}

.bdc-mid .state .ddj span {
  display: inline-block;
}

.bdc-mid .state .ddj .free {
  position: absolute;
  right: -50px;
  top: 15px;
  width: 50px;
  height: 20px;
  line-height: 20px;
  color: #000;
  background: #00fff6;
  border-radius: 3px;
}

.bdc-mid .state .ddj .err {
  position: absolute;
  right: -50px;
  top: 15px;
  width: 50px;
  height: 20px;
  line-height: 20px;
  color: #fff;
  background: #ff0000;
  border-radius: 3px;
}

.bdc-bot {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.bdc-bot .tip-error {
  display: inline-block;
  width: 70px;
  height: 47px;
  font-size: 14px;
  padding: 5px 6px;
  text-align: center;
  background: url("../../assets/img/bdc3.png") no-repeat;
  color: #00fff6;
  box-sizing: border-box;
}
.bdc-bot .tip-sccuesss {
  display: inline-block;
  width: 120px;
  height: 47px;
  font-size: 14px;
  padding: 5px 6px;
  text-align: center;
  background: url("../../assets/img/bdc3.png") no-repeat;
  color: #ff0000;
  background-size: 100%;
  box-sizing: border-box;
}
.safeinfo {
  position: absolute;
  right: 10px;
  top: 50px;
}
.safeinfo .tip {
  text-align: left;
  line-height: 30px;
}
.safeinfo .tip .txt {
  color: #fff;
  display: inline-block;
  width: 100px;
  text-align: right;
  margin-right: 10px;
}
.safeinfo .tip .circle {
  display: inline-block;
  margin-right: 10px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  margin-top: 5px;
  vertical-align: top;
}
.safeinfo .tip .num {
  font-weight: bold;
  color: #4ec4f8;
  font-size: 18px;
}
.bdc-bot .tip {
  display: inline-block;
  width: 90px;
  height: 47px;
  padding: 5px 0;
  margin-bottom: 5px;
  display: block;
  text-align: center;
  line-height: 18px;
  background: url("../../assets/img/bdc4.png") no-repeat;
  color: #a9ddee;
  background-size: 100% 100%;
  box-sizing: border-box;
}

.bdc-bot .tip small {
  font-size: 12px;
  height: 18px;
  display: block;
}

.bdc-bot .tip p {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
}

.mainview {
  width: 1120px;
  height: 620px;
  box-sizing: border-box;
}
.viewbox .t-box {
  position: absolute;
  left: 220px;
  top: 34px;
  color: #fff;
}
.viewbox .t-box span {
  position: absolute;
  left: 0px;
  top: 0px;
  text-align: center;
  width: 33px;
  font-size: 14px;
  line-height: 35px;
}
.viewbox .err {
  position: absolute;
  left: 375px;
  top: 170px;
}
.viewbox .err .span1 {
  position: absolute;
  left: 0px;
  top: 70px;
  width: 30px;
  height: 30px;
  border: 1px solid red;
  border-radius: 50%;
  animation: mycircle 1s alternate infinite;
}
.viewbox .err .span2 {
  position: absolute;
  left: -5px;
  top: 65px;
  width: 40px;
  height: 40px;
  border: 1px solid red;
  border-radius: 50%;
  animation: mycircle 2s alternate infinite;
}
@keyframes mycircle {
  0% {
    transform: scale(1) rotateX(50deg);
    opacity: 0;
  }
  25% {
    transform: scale(1.25) rotateX(50deg);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.5) rotateX(50deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotateX(50deg);
    opacity: 0;
  }
}
.viewbox .watch {
  position: absolute;
  right: 310px;
  top: 233px;
}
.mainview .top-info {
  display: flex;
  justify-content: center;
  z-index: 99;
  text-align: center;
  width: 100%;
}
.mainview .top-info .item {
  /*flex: 1;*/
  padding: 0 10px;
  width: 150px;
  text-align: left !important;
}
.mainview .top-info .txt {
  font-size: 14px;
  color: #fff;
  margin-right: 10px;
}
.mainview .top-info .num {
  font-size: 18px;
  font-weight: bold;
  color: #4ec4f8;
}
.botview {
  display: flex;
}

.botview .zypz {
  width: 500px;
  height: 330px;
  /*padding: 15px;*/
  box-sizing: border-box;
  margin-right: 15px;
}

.zypzboxs {
  display: flex;
  justify-content: flex-start;
  align-self: auto;
  flex-wrap: wrap;
  height: 265px;
}

.zypzboxs .item {
  width: 50%;
  height: 50%;
}

.zypzboxs .chart {
  width: 100%;
  height: calc(100% - 30px);
}

.botview .sbgl {
  width: 600px;
  height: 330px;
  /*padding: 15px;*/
  box-sizing: border-box;
  overflow: hidden;
}
.sbgl1 {
  float: left;
  width: 300px;
  vertical-align: top;
}
.sbgl1 .sbgl2box {
  display: flex;
}
.sbgl1 .sbgl2box .item {
  width: 100%;
}
.sbgltable {
  float: right;
  display: inline-block;
  width: 270px;
}
.sbgltop {
  position: absolute;
  right: 0px;
  top: 0px;
  width: 270px;
}
.sbgltop .info {
  text-align: center;
  font-size: 12px;
  color: #fff;
  display: inline-block;
}
.sbgltop span {
  font-size: 12px;
  color: #4ec4f8;
}
.sbgltable .chart-tit {
  font-size: 14px;
  margin-bottom: 0;
}
.sbgltable .table {
  width: 100%;
  border: none;
  border-collapse: separate;
  border-spacing: 0px 5px;
  color: #fbfcfa;
  font-size: 12px;
  line-height: 25px;
}

.table thead tr th {
  background: rgba(78, 196, 248, 0.3);
  color: #4ec4f8;
}

.table tbody tr td {
  line-height: 20px;
  color: #fff;
}
.boxview {
  margin: 10px 0;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.boxview .item {
  background: url("../../assets/img/btnbg.png") no-repeat;
  background-size: 100% 100%;
  width: 100px;
  height: 53px;
  box-sizing: border-box;
  padding: 8px 0;
  margin-bottom: 10px;
}
item-btn {
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.boxview .item.state {
  width: 45%;
  height: 60px;
  margin-bottom: 10px;
}
.boxview .item.state.err {
  background: url("../../assets/img/btn_red.png") no-repeat;
  background-size: 100% 100%;
}
.boxview .item.state.err small,
.boxview .item.state.err p {
  color: #ff0000;
}
.boxview .item small {
  display: block;
  text-align: center;
  font-size: 12px;
  color: #fff;
}
.boxview .item p {
  font-size: 18px;
  color: #4ec4f8;
  font-weight: bold;
  margin: 0;
  text-align: center;
  line-height: 28px;
}
.item-btn .handModal {
  position: absolute;
  right: -100px;
  top: 40px;
  bottom: 0px;
  width: 220px;
  height: 160px;
  background: rgba(0, 0, 0, 0.5);
  transition: all 0.5s;
  z-index: 99;
  text-align: center;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.item-btn:hover .handModal {
  position: absolute;
  right: -100px;
  top: 60px;
  opacity: 1;
  transition: 1s;
}
.infotable-cs {
  height: 560px;
  width: 800px;
  background-color: #566a87;
  border: 1pxs solid #566a87;
  border-radius: 10px;
}

.as-dialog {
  position: absolute;
  background-color: #566a87;
  top: 50%;
  left: 50%;
  margin-top: -300px;
  margin-left: -400px;
  z-index: 99;
}
</style>
<style  lang='scss'>
.sbxx-form .el-form--inline .el-form-item__label {
  float: none;
  display: inline-block;
  color: #fff;
}
.anquanTxt {
  padding: 10px;
  cursor: pointer;
  position: relative;
  z-index: 100;
}
.abc .el-dialog {
  background-color: #0c3b4e;
}
.abc .el-dialog__header {
  /* border-bottom: #e8e8e8 solid 1px; */
  border-bottom: 0;
}
.car-point {
  position: absolute;
  width: 8px;
  height: 8px;
  top: 0px;
  left: 0px;
  z-index: 2;
  background-color: red;
  /* animation: bounce-up 2s linear infinite;  */
  border-radius: 50%;
  animation: warn 1s ease-out 0s infinite;
}

@keyframes warn {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }

  30% {
    opacity: 1;
  }

  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}
.boxbox {
  position: absolute;

  z-index: 2;
  color: #fff;
  padding: 10px;
  transform: translateY(-50%);
  background-color: #152940;
  /* animation: bounce-up 2s linear infinite;  */
}
.safeCircle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
  background-color: lime;
  position: relative;
  left: -10px;
}
.topFive {
  cursor: pointer;
}
.topFiveDialog {
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
</style>
