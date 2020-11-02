<template>
  <div class="home cy-body">
    <div class="head-box">
      <headtit title="冲压车间" :date="nowDate"></headtit>
    </div>
    <div class="flex-box">
      <div class="item-box" style="padding:0 0 0 15px;">
        <div class="chartbox znsc">
          <div class="box-tit">
            <img class="img" src="../../assets/img/data-icons/production.png" />
            <span>智能生产</span>
          </div>
          <div class="boxview" style="margin:0px 0 16px 0">
            <el-carousel
              indicator-position="outside"
              :interval="5000"
              style="width: 100%;overflow: hidden;height:130px"
              class="el_carousel_fade"
            >
              <el-carousel-item v-for="(item,index) in switchDataList" :key="index">
                <!-- switchdata -->
                <div style="color:#fff"></div>
                <div class="boxview">
                  <div class="item" style="height:53px;padding:6px">
                    <small>线体名称</small>
                    <p>{{(topDataList[index]||{}).shortLineBody}}</p>
                  </div>
                  <div class="item" style="height:53px;padding:6px">
                    <small>实时节拍</small>
                    <p>{{(topDataList[index]||{}).todayRealTimeBeat+'次/分'}}</p>
                  </div>
                  <div class="item" style="height:53px;padding:6px">
                    <small>模具切换时间</small>
                    <p>{{item.switchTime}}min</p>
                  </div>
                  <div class="item" style="height:53px;padding:6px">
                    <small>模具切换次数</small>
                    <p>{{item.switchNum}}</p>
                  </div>
                  <div class="item" style="height:53px;padding:6px">
                    <small>月累计产量</small>
                    <p>{{(switchDataList1[index]||{}).actualOutput}}</p>
                  </div>
                  <div class="item" style="height:53px;padding:6px">
                    <small>月生产完成率</small>
                    <p>{{(switchDataList1[index]||{}).completionRate}}%</p>
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
          <el-carousel
            indicator-position="none"
            :interval="5000"
            height="145px"
            style="width: 100%;height: 145px;overflow: hidden;"
            arrow="hover"
            class="el_carousel_fade"
          >
            <el-carousel-item style="width:100%;height:100%">
              <div class="chart-tit">
                <span>MTTR（min）</span>
              </div>
              <div id="znsc2" style="width:100%;height:110px;"></div>
            </el-carousel-item>
            <el-carousel-item style="width:100%;height:100%">
              <div class="chart-tit">
                <span>MTBF（h）</span>
              </div>
              <div id="znsc3" style="width:100%;height:110px;"></div>
            </el-carousel-item>
          </el-carousel>
          <el-carousel
            indicator-position="none"
            :interval="5000"
            height="145px"
            style="width: 100%;height: 145px;overflow: hidden;"
            class="el_carousel_fade"
          >
            <el-carousel-item style="width:100%;height:100%">
              <div class="chart-tit">
                <span>OEE（%）</span>
              </div>
              <div id="znsc1" style="width:100%;height:110px;"></div>
            </el-carousel-item>
            <el-carousel-item style="width:100%;height:100%">
              <div class="chart-tit">
                <span>产量分析</span>
              </div>
              <div id="znsc4" style="width:100%;height:110px;"></div>
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="chartbox jywl">
          <div class="box-tit">
            <img class="img" src="../../assets/img/data-icons/logistics.png" />
            <span>精益物流</span>
          </div>
          <div class="chart-tit">
            <span>收货箱数/在建</span>
          </div>
          <div id="jywl3" style="width:100%;height:100px;"></div>
          <div class="chart-tit">
            <span>收料体积(m³)/在建</span>
          </div>
          <div id="jywl4" style="width:100%;height:100px;"></div>
          <div class="chart-tit">
            <span>道口利用率/在建</span>
          </div>
          <div id style="width:100%;height:100px;"></div>
        </div>
      </div>
      <div class="item-box" style="padding-top: 0;">
        <div class="mainview" style="position: relative">
          <div class="top-info">
            <el-carousel
              :interval="5000"
              indicator-position="outside"
              style="width: 100%;height: 70px;overflow: hidden;"
            >
              <el-carousel-item v-for="(item,index) in topDataList" :key="index">
                <!-- switchdata -->
                <div class="top-info">
                  <div class="item">
                    <span class="txt">产线</span>
                    <span
                      style="font-size: 14px;font-weight: bold;color: #4ec4f8;"
                    >{{item.shortLineBody}}</span>
                  </div>
                  <div class="item">
                    <span class="txt">计划产量</span>
                    <v-countup :start-value="0" :end-value="item.planOutput" class="num"></v-countup>
                  </div>
                  <div class="item">
                    <span class="txt">实时产量</span>
                    <v-countup :start-value="0" :end-value="item.todayOutput" class="num"></v-countup>
                  </div>
                  <div class="item">
                    <span class="txt">完成率</span>
                    <v-countup :start-value="0" :end-value="topData.completionRate" class="num"></v-countup>
                    <span
                      v-if="topData.completionRate !=0"
                      style="font-size: 14px;font-weight: bold;color: #4ec4f8;"
                    >%</span>
                  </div>
                  <div class="item">
                    <span class="txt">OEE</span>
                    <v-countup :start-value="0" :end-value="topData.realTimeOee" class="num"></v-countup>
                    <span
                      v-if="topData.realTimeOee !=0"
                      style="font-size: 14px;font-weight: bold;color: #4ec4f8;"
                    >%</span>
                  </div>
                  <div class="item">
                    <span class="txt">在岗人数</span>
                    <!-- <v-countup :start-value="0" :end-value="item.onJobNum" class="num"></v-countup> -->
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
                      style="background: #0bb20c;"
                      v-if="days.todayProductionStatus == 0"
                    ></span>
                    <span
                      class="circle"
                      style="background: #ffc107;"
                      v-if="days.todayProductionStatus == 1"
                    ></span>
                    <span
                      class="circle"
                      style="background: #ff4d51;"
                      v-if="days.todayProductionStatus == 2"
                    ></span>
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
          <div class="viewbox" style="position: relative">
            <!-- 大图 -->
            <img class="img" src="../../assets/img/main-cy.png" style="margin-top: -10%;width:100%" />
            <div v-for="(item,index) in data2" :key="index">
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
                v-show="item.flag && item.flagBox"
              >
                <div v-if="item.flag">故障产线:{{item.message.lineBody}}</div>
                <div v-if="item.flag">停机类型:{{item.message.downtimeType}}</div>
                <div v-if="item.flag">开始时间:{{item.message.startTime}}</div>
                <div v-if="item.flag">持续时间:{{item.message.duration}}分钟</div>
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
                  <span>合格率（%）</span>
                </div>
                <div class="chart" id="zypz4"></div>
              </div>
              <div class="item">
                <div class="chart-tit">
                  <span>返工率（%）</span>
                </div>
                <div class="chart" id="zypz1"></div>
              </div>
              <div class="item">
                <div class="chart-tit">
                  <span>报废率（%）</span>
                </div>
                <div class="chart" id="zypz2"></div>
              </div>
              <div class="item">
                <div class="chart-tit">
                  <span>AUDIT</span>
                </div>
                <!-- <div class="chart" id="zypz4"></div> -->
                <div style="color:#fff;font-size:14px">在建</div>
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
                  <div id="sbgl1" style="width:100px;height:90px;margin-right:50px;"></div>
                </div>
                <div class="item">
                  <div class="chart-tit">
                    <span>维护完成率</span>
                  </div>
                  <div id="sbgl2" style="width:100px;height:90px;"></div>
                </div>
              </div>

              <el-carousel indicator-position="none" :interval="3000" height="140px" loop>
                <el-carousel-item>
                  <div class="sbgl3box">
                    <div class="chart-tit">
                      <span>停线分析 M100（min）</span>
                    </div>
                    <div id="sbgl3" style="width:100%;height:110px;" @click="showSblgDialog(1)"></div>
                  </div>
                </el-carousel-item>
                <el-carousel-item>
                  <div class="sbgl3box">
                    <div class="chart-tit">
                      <span>停线分析 M200（min）</span>
                    </div>
                    <div id="sbgl4" style="width:100%;height:110px;" @click="showSblgDialog(2)"></div>
                  </div>
                </el-carousel-item>
              </el-carousel>
            </div>
            <div class="sbgltop">
              <div class="info">
                <small>车间设备总数/在建</small>
                <span v-if="!!deviceTotal" style="padding-left:4px">{{deviceTotal}}</span>
              </div>
            </div>
            <div class="sbgltable" style="margin-top:3px">
              <span class="chart-tit-1" id="fixDeviceRecord">
                <span style="font-size:14px">备件领用记录/在建</span>
              </span>
              <div
                style="min-height:80px"
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
                  <tbody style="min-height:3vw">
                    <tr v-for="(item,index) in receiveLogData" v-bind:key="index">
                      <td>{{item.sparesName}}</td>
                      <td>{{item.createOn}}</td>
                      <td>{{item.usedQty}}</td>
                    </tr>
                  </tbody>
                </table>
                <div
                  v-if="!receiveLogData.length"
                  style="text-align:center;line-height:30px;color:#fff;background:rgba(255,255,255,.3)"
                >暂无记录</div>
              </div>

              <div class="chart-tit">
                <span>停线记录</span>
              </div>
              <div
                style="min-height:80px"
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
                  <tbody style="min-height:3vw">
                    <tr v-for="(item,index) in fixData" v-bind:key="index">
                      <td>{{item.downtimeType}}</td>
                      <td>{{item.sTime}}</td>
                      <td>{{item.eTime}}</td>
                    </tr>
                  </tbody>
                </table>
                <div
                  v-if="!fixData.length"
                  style="text-align:center;line-height:30px;color:#fff;background:rgba(255,255,255,.3)"
                >暂无记录</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="item-box" style="padding:0 15px 0 0;">
        <div
          class="chartbox"
          style="display: flex;justify-content: space-around;margin-bottom: 15px"
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

        <div class="chartbox nyhj" style="position: relative;">
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
          <div id="nyhj1" style="width:100%;height:130px;"></div>
          <div class="chart-tit">
            <span>{{`电能（kW·h ${unitOption.dianUnit}）`}}</span>
          </div>
          <div id="nyhj4" style="width:100%;height:130px;"></div>

          <div class="chart-tit">
            <span>{{`工艺循环水（t ${unitOption.gongyiUnit}）`}}</span>
          </div>
          <div style="position: relative">
            <div id="nyhj5" style="width:100%;height:120px;"></div>
          </div>
          <!-- <el-carousel
            indicator-position="outside"
            style="width: 100%;height: 140px;overflow: hidden;"
          >
          <el-carousel-item :key="4">-->
          <div class="chart-tit">
            <span>{{`自来水（t${unitOption.zilaiUnit}）`}}</span>
          </div>
          <div style="position: relative">
            <div id="nyhj6" style="width:100%;height:120px;"></div>
          </div>
          <!-- </el-carousel-item>
          <el-carousel-item :key="5">-->
          <!-- 无 -->
          <div class="chart-tit">
            <span>{{`空调水（t${unitOption.kongtiaoUnit}）/在建`}}</span>
          </div>
          <div style="position: relative">
            <div id="nyhj2" style="width:100%;height:120px;"></div>
            <p style=" font-size: 18px;color:#4ec4f8;"></p>在建
          </div>
          <!-- </el-carousel-item>
          </el-carousel>-->
        </div>
      </div>
    </div>
    <pieDialog ref="pieDialog" :title="twoPieTitle" hasData="类型"></pieDialog>
    <el-dialog title :visible.sync="anquanDialog" width="50%" append-to-body class="abc">
      <green-cross @anquan="anquan" :dayArr="dayArr" :requestOption="key"></green-cross>
    </el-dialog>
    <txjl-dialog ref="txjl_dialog" shopName="CY"></txjl-dialog>
  </div>
</template>

<script>
import pieDialog from '@/components/pieDialog';
import { getUnitString } from '@/utils/common';
import echarts from "echarts";
import headtit from "./headtit.vue";
import floatmenu from "./floatmenu.vue";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { list_energy_consumption, listTce } from "@/api/shangqi/enegy";
import {
  threeDinfo,
  switchinfo,
  productioninfo,
  Oeeinfo,
  Mttrinfo,
  getScrapReworkQualified,
  monthProduction,
  switchTimeAndNum,
  safeProductionDays,
  listLineBodyRealTimeData,
  getMonthProduction,
  cy_downtime_analyze,
  cy_status_analyze,
  downtime_record
} from "@/api/shangqi/cy";
import {
  faultAnalysis,
  getShopDeviceNum,
  receiveLog,
  maintainPercent,
  spotCheckPercent,
  get_check_maintain_complete_rate,
} from "@/api/shangqi/device";
import { listOutput } from "@/api/shangqi/asrs";
import moment from "moment";
import { lisFaultAlarm } from "@/api/shangqi/cs";
import { list_warehouse_use_info } from "@/api/shangqi/wlModule";
import { twoPieEchartOption, girdEchartOption, girdLineEchartOptions, yuanEchartOption, onePieEchartOption } from '@/utils/echartOption'
import data2 from './data2'
import { list_downtime_production_line, month_un_safety_production_day, list_month_tce, list_day_tce } from '@/api/abcd'
import greenCross from './greenCross'
import txjlDialog from './txjlDialog'
export default {
  name: "shangqi2",
  components: {
    headtit,
    floatmenu,
    swiper,
    swiperSlide,
    pieDialog,
    greenCross,
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
      data2,
      txfx: '类型',
      anquanDialog: false,
      interval: null, //自动循环参数
      start: 0,
      key: {
        workCode: 78,
        shopName: "CY",
      },
      swiperIndex: 1,
      topData: {},
      nyhjChange: '日',
      topDataList: [],
      prodata: {},
      days: {},
      switchdata: {},
      switchDataList: [],
      switchDataList1: [],
      mttrdata: [],
      mtbfdata: [],
      mttrmouth: [],
      deviceTotal: 0,
      fixData: [],
      receiveLogData: [],
      Mapzbid: "",
      nowDate: "",
      zbid: "",
      shortName: "",
      getSafe: true,

      swiperobj: {
        top1: "top1",
        top2: "top2",
        top3: "top3",
        top4: "top4",
        top5: "top5",
      },
      fixDeviceRecord: "停机数据记录",
      swiperOption2: {
        autoplay: {
          delay: 13000,
          disableOnInteraction: false,
        },
        loop: false,
        freeMode: true,
        direction: "vertical",
        slidesPerView: "auto",
        on: {
          slideChangeTransitionEnd() {
            console.log(index);
          },
        },
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
      timer: null,
      onePieOption1: null,
      onePieOption2: null,
      twoPieTitle: '',
      dayArr: [],
    };
  },
  computed: {},
  watch: {},
  created() {
    this.get3Dinfo();
  },
  mounted() {

    this.initData();
    // this.test()

    //测试请求数据
    // setTimeout(()=>{
    //   this.test();
    // },1000)
    // 能源环境
    this.changeNyhj()

  },
  methods: {

    initData() {
      //正式请求数据
      this.data2 = this.data2.map(item => {
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

      this.getZNSCdata();
      this.getFixRecord();
      this.getDeviceAns();
      this.getDeviceAnsTwo();
    },
    async anquan(month) {
      if (!(typeof month == 'string' || typeof month == 'number')) {
        month = (new Date).getMonth() + 1
        month = month < 10 ? '0' + month : month
        let year = (new Date).getFullYear()
        month = year + '-' + month
      }
      this.anquanDialog = true
      let res = await month_un_safety_production_day({ ...this.key, "month": month })
      if (res.data.success) {
        this.dayArr = res.data.data
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
    showSblgDialog(type) {
      if (type == 1) {
        if (this.onePieOption1) {
          this.twoPieTitle = '停线分析 M100'
          //   this.$refs.pieDialog.twoPieDialog(this.onePieOption1.inData, this.onePieOption1.outData);
          this.$refs.pieDialog.onePieDialog(this.onePieOption1);
        }
      } else {
        if (this.onePieOption2) {
          this.twoPieTitle = '停线分析 M200'
          this.$refs.pieDialog.onePieDialog(this.onePieOption2);
        }
      }
    },
    showTxjl(data, propData) {
      this.$refs.txjl_dialog.tableData = data
      this.$refs.txjl_dialog.propData = propData
      this.$refs.txjl_dialog.visible = true
    },
    changeTxfx() {
      alert(this.txfx)
    },
    // 能源环境切换
    changeNyhj() {
      if (this.nyhjChange == '月') {
        // 总能耗
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
    async getData() {
      let res = await list_downtime_production_line({ ...this.key })
      if (res.data.data && res.data.data.length > 0) {
        res.data.data.forEach(item => {
          this.data2.forEach(v => {
            if (item.lineBody == v.name) {
              v.flag = true
              v.message = {
                downtimeType: item.downtimeType,
                startTime: item.startTime,
                duration: item.duration,
                lineBody: item.lineBody
              }
            }
          })
        })
      }
    },

    test() {
      //  测试 右侧 nyjh 数据
      this.topDataList = [{}, {}, {}, {}, {}, {}];
      var arr = ['2020-09-01', '2020-09-02', '2020-09-03', '2020-09-04', '2020-09-05',]
      var data = [100, 20, 50, 40, 90];
      var data1 = [10000, 20000, 30000, 40000, 50000]
      var data2 = [1, 2, 3, 4, 5]
      var date = arr.map(e => moment(e).format('MM-DD'));

      var obj1 = { id: 'nyhj1', x: date, y: [data2], name: ['总耗'], unit: 'kw' }
      girdEchartOption(obj1);

      var obj2 = { id: 'nyhj2', x: date, y: [data2], name: ['总耗'], unit: 'kw' }
      girdEchartOption(obj2);

      var obj5 = { id: 'nyhj5', x: date, y: [data2], name: ['工艺循环水'], unit: 'kw' }
      girdEchartOption(obj5);

      var obj4 = { id: 'nyhj4', x: date, y: [data2], name: ['总耗'], unit: 'kw' }
      girdEchartOption(obj4);

      var obj6 = { id: 'nyhj6', x: date, y: [data2], name: ['总耗'], unit: 'kw' }
      girdEchartOption(obj6);

      var obj7 = { id: 'znsc2', x: date, y: [data2], name: ['mttr'], unit: 'min' }
      girdLineEchartOptions(obj7)

      var obj8 = { id: 'znsc3', x: date, y: [data2], name: ['mtbf'], unit: 'h' }
      girdLineEchartOptions(obj8)


      var obj9 = { id: 'znsc1', x: date, y: [data2], name: ['OEE'], unit: '%' }
      girdEchartOption(obj9);

      var obj10 = { id: 'znsc4', x: date, y: [data2], name: ['总耗'], unit: 'kw' }
      girdEchartOption(obj10);

      var obj11 = { id: 'sbgl1', value: 50, }
      yuanEchartOption(obj11);

      var obj12 = { id: 'sbgl2', value: 80, }
      yuanEchartOption(obj12);

      // 合格率v
      const hegeOption = { id: 'zypz4', x: date, y: [data1], name: ['合格率'], unit: '%', max: 100 };
      girdEchartOption(hegeOption)

      // 反工
      const fangongOption = { id: 'zypz1', x: date, y: [data2], name: ['返工率'], max: 10 };
      girdLineEchartOptions(fangongOption)

      // 报废数
      const baofeiOption = { id: 'zypz2', x: date, y: [data], name: ['合格率'], max: 10 };
      girdLineEchartOptions(baofeiOption)


      const twoPieData1 = [{ name: '故障一', value: 20 }, { name: '故障二', value: 40 }, { name: '生产时间', value: 20 }, { name: '计划停机时间', value: 40 }, { name: '非计划停机时间', value: 40 }];
      onePieEchartOption({ id: 'sbgl3', inData: twoPieData1 })
      onePieEchartOption({ id: 'sbgl4', inData: twoPieData1 })

    },

    get3Dinfo() {
      listLineBodyRealTimeData({ ...this.key }).then(async (result) => {
        if (result.data.success === true) {
          this.topData = result.data.data && (result.data.data[0] || {});
          this.topDataList = result.data.data.map(e => {
            if (e.lineBody.indexOf('MEB 100') != -1) {
              e.shortLineBody = 'MEB 100';
            } else if (e.lineBody.indexOf('MEB 200') != -1) {
              e.shortLineBody = 'MEB 200';
            } else {
              e.shortLineBody = e.lineBody;
            }
            return e;
          })
          //.map((x,index)=>({...x,partsStartDate:x.partsStartDate?moment(x.partsStartDate).format('YYYY-MM-DD'):""}));
          let topDataList = result.data.data;
          let switchDataList = [];
          let switchDataList1 = [];
          let nameMap = topDataList.map(e => {
            return e.shortLineBody;
          })

          // 以下的是折线图
          let MttrOption = {
            x: [],
            y: [],
            name: nameMap,
            id: 'znsc2',
            legend: true,
          }

          let MtbfOption = {
            x: [],
            y: [],
            name: nameMap,
            id: 'znsc3',
            legend: true,
          }

          // 是柱状图
          let oeeOption = {
            x: [],
            y: [],
            name: nameMap,
            id: 'znsc1',
            legend: true,
            max: 100,
          }
          // 是柱状
          let listOutOption = {
            x: [],
            y: [],
            name: nameMap,
            id: 'znsc4',
            legend: true,
          }
          for (let i = 0; i < topDataList.length; i++) {

            try {
              let mttrRes = await Mttrinfo({ ...this.key, rowNum: 7, lineBody: topDataList[i].lineBody, })
              if (mttrRes.data.success == true) {
                MttrOption.x = mttrRes.data.data.map((item) => item.theMonth)
                MttrOption.y.push(mttrRes.data.data.map((item) => item.mttr))

                MtbfOption.x = mttrRes.data.data.map((item) => item.theMonth)
                MtbfOption.y.push(mttrRes.data.data.map((item) => item.mtbf))

              }
            } catch (error) {

            }

            try {
              let oeeRes = await Oeeinfo({ ...this.key, rowNum: 7, lineBody: topDataList[i].lineBody, })
              if (oeeRes.data.success == true) {

                oeeOption.x = oeeRes.data.data.map((item) => moment(item.theDate).format('MM-DD'))
                oeeOption.y.push(oeeRes.data.data.map((item) => item.oee))

              }
            } catch (error) {

            }

            try {
              let listOutputRes = await listOutput({ ...this.key, rowNum: 7, lineBody: topDataList[i].lineBody })
              if (listOutputRes.data.success === true) {

                listOutOption.x = listOutputRes.data.data.map((x) => moment(x.theDate).format('MM-DD'))
                listOutOption.y.push(listOutputRes.data.data.map((item) => item.output))
              };

            } catch (error) {

            }

            try {
              let switchRes = await switchinfo({ ...this.key, rowNum: 7, lineBody: topDataList[i].lineBody, });
              if (switchRes.data.success === true) {
                switchDataList.push({
                  name: topDataList[i].lineBody,
                  ...switchRes.data.data,
                })
              }
            } catch (error) {

            }

            try {
              let MonthProductionRes = await getMonthProduction({ ...this.key, rowNum: 7, lineBody: topDataList[i].lineBody, });
              if (MonthProductionRes.data.success === true) {
                switchDataList1.push(MonthProductionRes.data.data);

              }
            } catch (error) {

            }
          }

          girdLineEchartOptions(MttrOption);
          girdLineEchartOptions(MtbfOption);
          girdLineEchartOptions(oeeOption);
          girdEchartOption(listOutOption);
          this.switchDataList = switchDataList;
          this.switchDataList1 = switchDataList1;

        }

      });
    },
    getFixRecord() {
      this.nowDate = moment().format('YYYY年MM月DD日')
      // 停线记录接口
      downtime_record({ ...this.key, rowNum: 3 }).then((res) => {
        if (res.data.success === true) {
          this.fixData = res.data.data.map((x) => ({
            ...x,
            sTime: moment(x.sTime).format("MM-DD HH:mm"),
            eTime: moment(x.eTime).format("MM-DD HH:mm"),
          }));
        }
      });
      getShopDeviceNum({ ...this.key }).then((res) => {
        if (res.data.success === true) {
          // this.deviceTotal=res.data.data;
          this.$set(this, "deviceTotal", res.data.data);
        }
      });
      receiveLog({ ...this.key, rowNum: 3 }).then((res) => {
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
            // console.log((res.data.data))

            var sbgl1Option = { id: 'sbgl1', value: (res.data.data || {}).checkCompleteRate || 0 };
            yuanEchartOption(sbgl1Option);

            var sbgl2Option = { id: 'sbgl2', value: (res.data.data || {}).maintainCompleteRate || 0 };
            yuanEchartOption(sbgl2Option);
          }
        }
      );

      monthProduction({ ...this.key }).then((res) => {
        if (res.data.success === true) {
          this.prodata = { ...res.data.data };
        }
      });
      safeProductionDays({ ...this.key }).then((res) => {
        if (res.data.success === true) {
          this.days = { ...res.data.data };
        }
      });

    },

    async getDeviceAns() {
      //

      let data1 = [];
      let data2 = [];
      try {
        const res = await cy_downtime_analyze({ ...this.key, lineBody: "SVW Anting MEB 100" });
        data1 = res.data.data.map(e => ({ name: e.downtimeType, value: e.duration }))
      } catch (error) {

      }

      try {
        const res = await cy_status_analyze({ ...this.key, lineBody: "SVW Anting MEB 100" });
        let json1 = { name: '生产时间', value: res.data.data.productionDuration };
        let json2 = { name: '计划停机时间', value: res.data.data.planDowntimeDuration };
        let json3 = { name: '非计划停机时间', value: res.data.data.unplannedDowntimeDuration };
        data2 = [json1, json2, json3];
      } catch (error) {

      }
      data1 = data1.concat(data2)
      this.onePieOption1 = { inData: data1, outData: data2 }
      this.onePieOption1 = data1
      onePieEchartOption({ id: 'sbgl3', inData: data1, showLabel: false })

    },

    async getDeviceAnsTwo() {
      //
      let data1 = [];
      let data2 = [];
      try {
        const res = await cy_downtime_analyze({ ...this.key, lineBody: "SVW Anting MEB 200" });
        data1 = res.data.data.map(e => ({ name: e.downtimeType, value: e.duration }))
      } catch (error) {

      }

      //   try {
      //     const res = await cy_status_analyze({ ...this.key, lineBody: "SVW Anting MEB 200" });
      //     let json1 = { name: '生产时间', value: res.data.data.productionDuration };
      //     let json2 = { name: '计划停机时间', value: res.data.data.planDowntimeDuration };
      //     let json3 = { name: '非计划停机时间', value: res.data.data.unplannedDowntimeDuration };
      //     data2 = [json1, json2, json3];
      //   } catch (error) {

      //   }
      this.onePieOption2 = data1
      onePieEchartOption({ id: 'sbgl4', inData: data1, showLabel: false })

    },


    async getZNSCdata() {
      // 卓越品质
      getScrapReworkQualified({ ...this.key, rowNum: 7 }).then((res) => {
        if (res.data.success === true) {

          let line1 = res.data.data.filter(e => e.lineBody === "SVW Anting MEB 100");
          let line2 = res.data.data.filter(e => e.lineBody === "SVW Anting MEB 200");

          let date = line1.map((item) => moment(item.statisDate).format('MM-DD'));
          // 报废

          let line1ReworkRate = line1.map((item) => {
            return item.reworkRate;
          });
          let line1QualifiedRate = line1.map((item) => {
            return item.qualifiedRate;
          });
          let line1ScrapRate = line1.map((item) => {
            return item.scrapRate;
          });

          let line2ReworkRate = line2.map((item) => {
            return item.reworkRate;
          });
          let line2QualifiedRate = line2.map((item) => {
            return item.qualifiedRate;
          });
          let line2ScrapRate = line2.map((item) => {
            return item.scrapRate;
          });
          // 合格率v
          const hegeOption = { id: 'zypz4', max: 100, x: date, y: [line1QualifiedRate, line2QualifiedRate], legend: true, name: ['MEB 100', 'MEB 200'], max: 100 };
          girdLineEchartOptions(hegeOption)

          // 反工
          const fangongOption = { id: 'zypz1', max: 100, x: date, y: [line1ReworkRate, line2ReworkRate], legend: true, name: ['MEB 100', 'MEB 200'], max: 100 };
          girdLineEchartOptions(fangongOption)

          // 报废数
          const baofeiOption = { id: 'zypz2', max: 100, x: date, y: [line1ScrapRate, line2ScrapRate], legend: true, name: ['MEB 100', 'MEB 200'], max: 100 };
          girdLineEchartOptions(baofeiOption)
        }
      });
      //
      // list_energy_consumption({
      //   ...this.key,
      //   rowNum: 7,
      //   energyTypes: "空调水",
      // }).then((res) => {
      //   if (res.data.success === true) {
      //     let date = res.data.data.list.map((x) => moment(x.theDate).format('MM-DD'));
      //     let data = res.data.data.list.map((x) => x.consume && x.consume.toFixed(0));
      //     var obj = {
      //       id: 'nyhj2',
      //       x: date,
      //       y: [data],
      //       name: ['空调水'],
      //       unit: 'T'
      //     }
      //     this.unitOption = { ...this.unitOption, kongtiaoUnit: getUnitString(res.data.data.powerNum) }
      //     girdEchartOption(obj);
      //   }
      // });

      list_energy_consumption({
        ...this.key,
        rowNum: 7,
        energyTypes: "工艺循环水",
      }).then((res) => {
        if (res.data.success === true) {
          let date = res.data.data.list.map((x) => moment(x.theDate).format('MM-DD'));
          let data = res.data.data.list.map((x) => x.consume && x.consume.toFixed(0));
          var obj = {
            id: 'nyhj5',
            x: date,
            y: [data],
            name: ['工艺循环水'],
            unit: 'T'
          }
          this.unitOption = { ...this.unitOption, gongyiUnit: getUnitString(res.data.data.powerNum) }
          girdEchartOption(obj);
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
          var obj = {
            id: 'nyhj6',
            x: date,
            y: [data],
            name: ['自来水'],
            unit: 'T'
          }
          this.unitOption = { ...this.unitOption, zilaiUnit: getUnitString(res.data.data.powerNum) }
          girdEchartOption(obj);
        }
      });
      // list_warehouse_use_info({
      //   ...this.key,
      //   rowNum: 7,
      // }).then((res) => {
      //   if (res.data.success === true) {
      //     let date = res.data.data.map((x) => moment(x.createTime).format('MM-DD'));
      //     let data = res.data.data.map((x) => x.boxNum);
      //     let data1 = res.data.data.map((x) => x.volume);
      //     let data2 = res.data.data.map((x) => x.useRate);

      //     var obj1 = {id: 'jywl3',x: date,y:[data],name: ['收货箱数']}
      //     girdEchartOption(obj1);
      //     var obj2 = {id: 'jywl4',x: date,y:[data1],name: ['收料体积'],unit:"m³"}
      //     girdEchartOption(obj2);

      //   }
      // });
    },
    get() {
      if (this.swiperIndex >= 5) {
        this.$set(this, "swiperIndex", 1);
        this.$set(this, "swiperobj", {
          top1: "top1",
          top2: "top2",
          top3: "top3",
          top4: "top4",
          top5: "top5",
        });
      } else if (this.swiperIndex == 1) {
        this.$set(this, "swiperobj", {
          top1: "top1",
          top2: "top2",
          top3: "top3",
          top4: "top4",
          top5: "top5",
        });
        this.$set(this, "swiperIndex", this.swiperIndex + 1);
      } else if (this.swiperIndex == 2) {
        this.$set(this, "swiperobj", {
          top1: "top5",
          top2: "top1",
          top3: "top2",
          top4: "top3",
          top5: "top4",
        });
        this.$set(this, "swiperIndex", this.swiperIndex + 1);
      } else if (this.swiperIndex == 3) {
        this.$set(this, "swiperobj", {
          top1: "top4",
          top2: "top5",
          top3: "top1",
          top4: "top2",
          top5: "top3",
        });
        this.$set(this, "swiperIndex", this.swiperIndex + 1);
      } else if (this.swiperIndex == 4) {
        this.$set(this, "swiperobj", {
          top1: "top3",
          top2: "top4",
          top3: "top5",
          top4: "top1",
          top5: "top2",
        });
        this.$set(this, "swiperIndex", this.swiperIndex + 1);
      }
    },
  },
};
</script>
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

.chart-tit-1 {
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
  height: 480px;
  box-sizing: border-box;
  margin-bottom: 15px;
}
.jywl {
  width: 400px;
  /*padding: 15px;*/
  height: 455px;
  box-sizing: border-box;
}

.nyhj {
  width: 320px;
  height: 793px;
  /*padding: 15px;*/
  box-sizing: border-box;
}
.nyhj .chart-tit {
  margin-bottom: 0;
}
.top-chart {
  display: flex;
}

.top-chart .chart {
  flex: 1;
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
  height: 428px;
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
  justify-content: space-around;
}

.bdc-bot .tip-error {
  display: inline-block;
  width: 63px;
  height: 47px;
  font-size: 14px;
  padding: 5px 6px;
  text-align: center;
  background: url("../../assets/img/bdc3.png") no-repeat;
  color: #ff0000;
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
  font-size: 14px;
}
.bdc-bot .tip {
  display: inline-block;
  width: 63px;
  height: 47px;
  padding: 5px 0;
  display: block;
  text-align: center;
  line-height: 14px;
  background: url("../../assets/img/bdc4.png") no-repeat;
  color: #a9ddee;
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
  right: 330px;
  top: 233px;
}
.mainview .top-info {
  display: flex;
  justify-content: center;
  text-align: center;
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
  justify-content: center;
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
  width: 45%;
  text-align: left;
  font-size: 12px;
  color: #fff;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 0px;
  border-radius: 3px;
  display: inline-block;
  white-space: nowrap;
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
  line-height: 17px;
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
  height: 45px;
  box-sizing: border-box;
  padding: 6px 0;
  margin-bottom: 10px;
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
  text-align: center;
  margin: 5px;
}
.sbgltable tr td {
  text-align: center;
}

swiper2 {
  width: 300px;
  height: 560px;
  margin: 20px auto;
}
.swiper2 .swiper-container {
  height: 100%;
}
.swiper2 .swiper-slide {
  height: 140px;
}
.swiper2 .swiper-slide > div {
  box-sizing: border-box;
  height: 100%;
}
.swiper2 {
  position: relative;
  height: 560px;
  overflow: hidden;
}
.swiper-item {
  position: absolute;
  left: 0;
  width: 100%;
}
.top1 {
  top: 0px;
}
.top2 {
  top: 140px;
}
.top3 {
  top: 280px;
}
.top4 {
  top: 420px;
}
.top5 {
  top: 560px;
}
</style>
<style >
.abc .el-dialog {
  background-color: #0c3b4e;
}
.abc .el-dialog__header {
  /* border-bottom: #e8e8e8 solid 1px; */
  border-bottom: 0;
}

.sbxx-form .el-form--inline .el-form-item__label {
  float: none;
  display: inline-block;
  color: #fff;
}
.cy-body .el-carousel__item {
  opacity: 0;
  transform: translateX(0px) scale(1) !important;
}
.cy-body .el-carousel__item.is-active {
  opacity: 1;
  transition: 5s;
  display: block;
  animation: fadeio 5s infinite;
}

@keyframes fadeio {
  /*设置内容由显示变为隐藏*/
  0% {
    opacity: 0.5;
  }
  10% {
    opacity: 0.9;
  }
  15% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
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
.boxbox {
  position: absolute;

  z-index: 2;
  color: #fff;
  padding: 10px;
  transform: translateY(-50%);
  background-color: #152940;
  /* animation: bounce-up 2s linear infinite;  */
}
.anquanTxt {
  padding: 10px;
  cursor: pointer;
  position: relative;
  z-index: 100;
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
</style>
