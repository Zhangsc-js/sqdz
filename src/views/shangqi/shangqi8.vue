<script src="../../../../nanzhou/src/api/zhuzhou/basicData.js"></script>
<template>
  <!-- 沒有父匹配，刪除子集 -->
  <div class="home">
    <div class="head-box asrs-body">
      <headtit title="高架库" :date="nowDate"></headtit>
    </div>
    <div class="flex-box">
      <div class="item-box" style="padding: 0 0 0 15px">
        <div class="chartbox znsc">
          <div class="box-tit zhineng_play">
            <div>
              <img class="img" src="../../assets/img/data-icons/production.png" />
              <span>智能生产</span>
            </div>
            <div style="font-size: 16px;font-weight: normal;">
              <span>
                零件种类数量:
                <span
                  style="font-weight: bold; color: #4ec4f8; font-size: 18px"
                >{{ topData.num }}</span>
              </span>
            </div>
          </div>
          <div class="chart-tit">
            <!-- <span></span -->
            <span>吞吐量</span>
          </div>
          <div id="znsc1" style="width: 100%; height: 110px"></div>

          <div class="chart-tit">
            <span>开动率（%）</span>
          </div>
          <div id="znsc3" style="width: 100%; height: 110px"></div>
          <div class="chart-tit">
            <span>MTTR（min）</span>
          </div>
          <div id="znsc2" style="width: 100%; height: 110px"></div>
          <div class="chart-tit">
            <span>MTBF（h）</span>
          </div>
          <div id="jywl3" style="width: 100%; height: 100px"></div>
        </div>

        <div class="chartbox jywl">
          <div class="box-tit">
            <img class="img" src="../../assets/img/data-icons/logistics.png" />
            <span>精益物流</span>
          </div>
          <!-- <div class="chart-tit" style="font-size:14px;position: absolute;top: 0;right: 0;">
            <span>道口利用率：{{"在建"}}</span>
          </div>-->
          <div class="chart-tit">
            <span>在库时间分析（min）</span>
          </div>
          <div id="jywl13" style="width: 300px; height: 100px"></div>
          <!-- <el-carousel
                indicator-position="outside"
                :interval="5000"
                style="width: 100%;height: 130px;overflow: hidden;"
            >
          <el-carousel-item :key="1">-->
          <div class="chart-tit">
            <span>库位利用率(%)</span>
          </div>
          <div id="jywl4" style="width: 300px; height: 100px"></div>
        </div>
      </div>
      <div class="item-box" style="padding-top: 0">
        <div class="mainview" style="position: relative">
          <div class="top-info">
            <div class="item">
              <span class="txt">在使用库位</span>
              <v-countup :start-value="0" :end-value="startObj.useNum" class="num"></v-countup>
            </div>
            <div class="item">
              <span class="txt">未使用库位</span>
              <v-countup :start-value="0" :end-value="startObj.noUseNum" class="num"></v-countup>
            </div>
            <div class="item">
              <span class="txt">今日收货数</span>
              <v-countup :start-value="0" :end-value="startObj.todayHarvestGoodsNum" class="num"></v-countup>
            </div>
            <div class="item">
              <span class="txt">今日发货数</span>
              <v-countup :start-value="0" :end-value="startObj.todayDeliverGoodsNum" class="num"></v-countup>
            </div>
            <div class="item">
              <span class="txt">
                实时吞
                <span></span>吐量
              </span>
              <v-countup :start-value="0" :end-value="startObj.realTimeThroughputNum" class="num"></v-countup>
            </div>
            <div class="item">
              <span class="txt">开动率</span>
              <v-countup :start-value="0" :end-value="startObj.realTimeThroughputNum" class="num"></v-countup>
              <span
                v-if="startObj.realTimeThroughputNum !=0"
                style="font-size: 14px;font-weight: bold;color: #4ec4f8;"
              >%</span>
            </div>
            <div
              class="item tip"
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
          <div class="viewbox" style="position: relative;text-align:center;display:flex">
            <div class="selectBoxFather" style="margin-left:2%">
              <i class="el-icon-arrow-up" style="color:#fff;font-size:25px" @click="jian"></i>
              <div
                class="selectBox"
                :class="{current:item==current}"
                v-for="item in optionsArr"
                :key="item"
                @click="currentBox(item)"
                style="padding: 10px 27px;"
              >{{item}}</div>
              <i class="el-icon-arrow-down" style="color:#fff;font-size:25px" @click="jia"></i>
            </div>
            <img src="../../assets/img//img888.png" style="width:85%;margin-left:3%" alt />
            <div
              class="boxboxbox"
              v-for="(item,index) in materialArr"
              :key="index"
              :style="{left:item.left,top:item.top}"
            ></div>
          </div>
        </div>
        <div class="botview">
          <div class="chartbox sbgl">
            <div class="box-tit">
              <img class="img" src="../../assets/img/data-icons/dev.png" />
              <span>设备管理</span>
            </div>
            <div class="botview_center_body">
              <div class="duiduo">
                <div class="chart-tit">
                  <span>堆垛机</span>
                </div>
                <div class="duiduo_content">
                  <el-tooltip
                    effect="dark"
                    :content="item.deviceNo"
                    placement="right-start"
                    class="duiduo_item"
                    v-for="(item, index) in ddjList"
                    v-bind:key="index"
                  >
                    <div v-if="item.status == 1">
                      <!-- <img src="../../assets/img/duiduo_01.png" style="width:20px;height:20px" /> -->
                      <span class="duiduoNum">{{`${index+1}`}}</span>
                      <div class="duiduoBox"></div>
                      <!-- <div>{{`${index+1}`}}</div> -->
                    </div>

                    <div v-if="item.status == 2">
                      <img src="../../assets/img/duiduo_03.png" style="width:20px;height:20px" />
                      <div>{{`${index+1}`}}</div>
                    </div>

                    <div v-if="item.status == 3">
                      <img src="../../assets/img/duiduo_02.png" style="width:20px;height:20px" />
                      <div>{{`${index+1}`}}</div>
                    </div>
                  </el-tooltip>
                </div>
              </div>

              <div class="huanchuan">
                <div class="chart-tit">
                  <span>环穿机</span>
                </div>
                <div class="huanchuan_content">
                  <div class="huanchuan_item" v-for="(item, index) in gdCarList" v-bind:key="index">
                    <div v-if="item.status == 1" class="huanchuan_item_green">{{index+1}}</div>
                    <div v-if="item.status == 2" class="huanchuan_item_yellow">{{index+1}}</div>
                    <div v-if="item.status == 3" class="huanchuan_item_red">{{index+1}}</div>
                  </div>
                </div>
              </div>
              <div class="sbgltable">
                <div class="chart-tit" style="margin-bottom: 0px">
                  <span>备件领用记录/在建</span>
                </div>
                <div
                  style="min-height: 80px;margin-top:10px"
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
                        <td>{{ item.usedQty }}</td>
                        <td>{{ item.createOn }}</td>
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
                  <span>设备故障记录</span>
                </div>
                <div
                  style="min-height: 80px"
                  @click="showTxjl(fixData,[{name:'故障类型',prop:'deviceNo'},{name:'开始时间',prop:'sTime'},{name:'结束时间',prop:'eTime'}])"
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
                        <td>{{ item.deviceNo }}</td>
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

              <div class="sbgl3box">
                <div class="chart-tit">
                  <span>设备故障分析（min）</span>
                </div>
                <div id="sbgl3" style="width: 100%; height: 200px" @click="showSblgDialog"></div>
              </div>

              <div class="boxview" style="width: 360px">
                <div class="item" v-for="(item,index) in deviceTopData" :key="index">
                  <small>{{ getDeviceName(item) }}</small>
                  <p>{{ item.deviceNum ||0}}</p>
                </div>
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
              style="display: block; margin: 10px auto"
              src="../../assets/img/data-icons/edit.png"
            />
            <small style="font-size: 16px">智能排产</small>
            <br />
            <small style="font-size: 14px; color: #fff">在建</small>
          </div>
          <div class="aq1">
            <img
              style="display: block; margin: 10px auto"
              src="../../assets/img/data-icons/design.png"
            />
            <small style="font-size: 16px">预测性维修</small>
            <br />
            <small style="font-size: 14px; color: #fff">在建</small>
          </div>
        </div>
        <div class="chartbox nyhj" style="position: relative; margin-bottom: 15px">
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
            <span>电能（kW·h）/在建</span>
          </div>
          <div style="position: relative">
            <div id="nyhj1" style="height: 120px"></div>
          </div>
        </div>
        <div class="chartbox pjlc" style="position: relative; margin-bottom: 15px;height:225px;">
          <div class="box-tit">
            <img class="img" src="../../assets/img/data-icons/ene.png" />
            <span>堆垛机总里程（km）</span>
          </div>
          <div id="pjlc"></div>
        </div>
        <div class="chartbox sp" style="position: relative;height:327px">
          <div class="box-tit">
            <img class="img" src="../../assets/img/data-icons/pc.png" />
            <span>视频监控</span>
          </div>
          <div class="imgBox" style="margin-top: 30px; position: relative">
            <img @click="imgTest('right')" class="img" :src="smallImg444" />
            <!-- <img
              @click="imgTest('right')"
              class="img"
              src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
            />-->
          </div>
          <div style="position: absolute; top: 0; right: 0; color: white">
            <!-- <a href="CXWIE://">打开视频</a> -->
            <span class="openVideo" @click="videoOpen">仿真视频</span>
          </div>
        </div>
      </div>
    </div>
    <pieDialog ref="pieDialog" title="故障分析" hasData="类型"></pieDialog>
    <div class="as-dialog-big" v-show="yqModal">
      <div class="header" style="position: absolute; right: 20px; top: 20px;">
        <i class="el-icon-close" style="color: #fff; font-size: 40px" @click="yqModal = false"></i>
      </div>
      <div class="infotable-cs-big" v-if="imgYqSrc">
        <img :src="imgYqSrc" alt />
      </div>
    </div>
    <div class="as-dialog-big" v-if="videoDialog">
      <div class="header" style="position: absolute; z-index:126; right: 20px; top: 20px;">
        <i class="el-icon-close" style="color: #fff;  font-size: 40px" @click="videoDialog = false"></i>
      </div>
      <div class="closeBox"></div>
      <vab-player-mp4 :config="config1" @player="Player1 = $event" />
    </div>
    <el-dialog title :visible.sync="anquanDialog" width="40%" append-to-body class="abc">
      <green-cross @anquan="anquan" :dayArr="dayArr" :requestOption="key"></green-cross>
    </el-dialog>
    <el-dialog title :visible.sync="imgDialog" class="bcd">
      <el-image :src="videoImg"></el-image>
    </el-dialog>
    <txjl-dialog ref="txjl_dialog" shopName="ASRS"></txjl-dialog>
  </div>
</template>

<script>
import echarts from "echarts";
import headtit from "./headtit.vue";
import floatmenu from "./floatmenu.vue";
import moment from "moment";
import { VabPlayerMp4 } from "./player";

import "echarts-gl";
import {
  throughputinfo,
  Mttrinfo,
  threeDinfo,
  avgLibraryList,
  mileageList,
  deviceStatus,
  asrsDeviceNum,
  storageLocation,
  realTimeThroughPut,
  realTimeStaus,
  listOutput,
  get_part_type_num,
  gjq_avvw,
  gjq_list_month_mttr_mtbf,
  gjq_list_avg_time_library,
  gjq_list_warehouse_use_rate,
  listThroughputNew
} from "@/api/shangqi/asrs";
import {
  switchinfo,
  productioninfo,
  Oeeinfo,
  safeProductionDays,
} from "@/api/shangqi/cy";
import {
  GJQlisFaultAlarm,
  GJQmachineHaltLogs,
  faultAnalysis,
  getShopDeviceNum,
  receiveLog,
  maintainPercent,
  spotCheckPercent,
} from "@/api/shangqi/device";
import { list_energy_consumption } from "@/api/shangqi/enegy";
import { onePieEchartOption, girdEchartOption, girdLineEchartOptions, yuanEchartOption, banyuanEchartOption, areaLineEchart } from '@/utils/echartOption'
import pieDialog from '@/components/pieDialog';
import { list_real_time_staus, month_un_safety_production_day, asrsImages } from '@/api/abcd.js'
import greenCross from './greenCross'
import txjlDialog from './txjlDialog'


export default {
  name: "shangqi8",
  components: {
    headtit,
    floatmenu,
    pieDialog,
    greenCross,
    VabPlayerMp4,
    txjlDialog
  },
  data() {
    return {
      key: {
        workCode: 78,
        shopName: "ASRS",
      },
      optionsArr: [
        '01', '02', '03', '04', '05', '06', '07', '08'
      ],
      videoDialog: false,
      yqModal: false,
      timerYq: null,
      materialArr: [{ x: 1, y: 5, z: 10 }, { x: 1, y: 8, z: 6 }],
      current: '01',
      cenji: 1,
      nyhjChange: '日',
      config1: {
        id: "mse1",
        url: "http://172.21.13.88:8800/data_video/asrs/ASRS-01.mp4",
        volume: 1,
        autoplay: true,
      },
      Player1: null,
      smallImg444: "",
      imgDialog: false,
      deviceTotal: 0,
      fixData: [],
      receiveLogData: [],
      ddjList: [],
      gdCarList: [],
      start: 0,
      videoImg: '',
      topdata: {},
      switchdata: "",
      mttrdata: [],
      mtbfdata: [],
      mttrmouth: [],
      throughputdata: [],
      throughputtime: [],
      topData: {},
      Mapzbid: "",
      anquanDialog: false,

      zbid: "",
      startObj: {
        realTimeThroughputNum: 0,
        todayDeliverGoodsNum: 0,
        todayHarvestGoodsNum: 0,
        noUseNum: 0,
        useNum: 0,
      },
      shortName: "",
      data11: "",
      nowDate: "",
      djry4_res: [],
      djrydata: "",
      djrczrs: "",
      zbdryqk: [],
      zbdryqkShow: [],
      //地图参数
      tabcur: 4,
      points: [],
      centerpoint: "",
      deviceTopData: [],
      dayArr: [],
      timer: '',
      getSafe: true,
      imgtime4: '',
      days: {},
      imgYqSrc: '',
      sblgOption: null,
      dateUnitObj: {        0: '点击保障故障', 1: '位置正向故障', 2: '位置反转故障', 6: '速度监控故障', 11: "满越位", 29: "左超差1", 30: "左超差2", 31: "右超差1", 32: "右超差2", 33: "左前超宽", 34: "左后超宽", 35: "右前超宽", 36: "右后超宽",
        79: "2楼安全门打开", 81: "2楼安全光幕无信号", 102: "传感器占用异常", 104: "传感切换顺序异常", 1004: "驱动器回执异常"      }
    };
  },
  computed: {},
  watch: {
  },
  mounted() {

    this.initData();
    // this.test();
    this.smallImg4()
  },
  beforeDestroy() {
    clearInterval(this.timer)
    clearInterval(this.imgtime4)
  },
  methods: {
    async getData() {
      let x = this.current > 10 ? this.current + '' : this.current
      let res = await list_real_time_staus(x)
      console.log(res)
      if (res.data.success) {
        this.materialArr = res.data.data.map(item => {
          return {
            x: item.xcoordinate,
            y: item.ycoordinate,
            z: item.zcoordinate,

          }
        })
        this.materialArr = this.materialArr.map(item => {
          let left = 14.8 + 1.35 + (item.y - 1) * 2.35
          let top = 87 - (item.z - 1) * 6.583
          return {
            ...item,
            x: item.x,
            left: left + '%',
            top: top + '%'
          }
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
    changeNyhj() { },
    showTxjl(data, propData) {
      this.$refs.txjl_dialog.tableData = data
      this.$refs.txjl_dialog.propData = propData
      this.$refs.txjl_dialog.visible = true
    },
    smallImg4() {
      this.imgtime4 = setInterval(async () => {
        let res = await asrsImages('right')
        if (res.data.success) {
          this.smallImg444 = res.data.data
        }
      }, 1000)
    },
    jian() {
      if (this.optionsArr[0] > 1) {
        let num = +this.optionsArr[0] - 1
        num = num >= 10 ? num : '0' + num
        this.optionsArr.unshift(num)
        this.optionsArr = this.optionsArr.slice(0, 8)
      }
    },
    jia() {
      if (this.optionsArr[7] < 18) {
        let num = +this.optionsArr[7] + 1
        num = num >= 10 ? num : '0' + num
        this.optionsArr.push(num)
        this.optionsArr = this.optionsArr.slice(1)
      }
    },
    imgTest(lr) {
      this.yqModal = true;
      clearInterval(this.timerYq);
      this.timerYq = setInterval(async () => {
        let res = await asrsImages(lr)
        if (res.data.success) {
          this.imgYqSrc = res.data.data
        }
      }, 1000)
    },
    videoOpen() {
      //   this.yqModal = true;
      //   clearInterval(this.timerYq);
      //   this.timerYq = setInterval(async () => {
      //     let res = await asrsImages(lr)
      //     if (res.data.success) {
      //       this.imgYqSrc = res.data.data
      //     }
      //   }, 1000)
      this.videoDialog = true
    },
    currentBox(num) {
      console.log(num);
      this.current = num
      //   this.materialArr = this.materialArr.filter(item => item.x == num)
      this.getData()
    },
    getDeviceName(item) {
      let obj = {
        "1": "输送线",
        "2": "环穿机",
        "3": "堆垛机"
      };
      return obj[item.deviceType];
    },

    clickToIe() {
      let url = "";
      window.location.href = "openIE:" + url;
    },
    initData() {
      this.nowDate = moment().format("YYYY年MM月DD日");
      this.getZNSCdata();
      this.getWlData();
      this.getDeviceData();

      this.materialArr = this.materialArr.map(item => {
        let left = 14.8 + 1.35 + (item.y - 1) * 2.35
        let top = 87 - (item.z - 1) * 6.583
        return {
          ...item,
          x: item.x,
          left: left + '%',
          top: top + '%'
        }
      })
      this.current = '01';
      this.getData()
      this.isSafe()
    },
    test() {
      this.ddjList = [
        { deviceNo: '0', status: 1 },
        { deviceNo: '0', status: 1 },
        { deviceNo: '0', status: 1 },
        { deviceNo: '0', status: 1 },
        { deviceNo: '0', status: 1 },
        { deviceNo: '0', status: 1 },
        { deviceNo: '0', status: 1 },
        { deviceNo: '0', status: 1 },
        { deviceNo: '0', status: 1 }
      ];
      var arr = [];
      for (let index = 0; index < 24; index++) {
        arr.push({ deviceNo: '0', status: 1 })
      }
      this.gdCarList = arr;
    },

    showSblgDialog() {
      if (this.sblgOption) {
        this.$refs.pieDialog.onePieDialog(this.sblgOption);
      }
    },

    generateData(dataA) {
      var data = [];
      for (var i = 0; i <= 8; i++) {
        for (var j = 0; j <= 13; j++) {
          for (var k = 0; k <= 13; k++) {
            let value = 3.5,
              name = "";
            let indexObj = dataA.find((item) => item.x == i) || {};
            // if(indexObj&&indexObj.x==i&&indexObj.y==j&&indexObj.z==k){
            //     value = 8;

            // }
            if (i == 1 && j == 1 && k == 3) {
              value = 4;
              name = indexObj.locationNo;
              data.push({ name, value: [i, j, k, value] });
            } else if (i == 1 && j < 10 && k < 10) {
              // value = 5;
              // name = "无"
            } else {
              value = 3;
              data.push({ name, value: [i, j, k, value] });
            }
            // if(y==1&&x<=10){
            //     value = 9
            // }
          }
        }
      }
      return data;

    },
    delZero(str) {
      return str && str.replace(/^[0]+/, "");
    },
    getDeviceData() {
      let data1 = [];
      get_part_type_num({ ...this.key }).then((res) => {
        if (res.data.success === true) {
          this.topData = { num: res.data.data };
          console.log(this.topData);
        }
      });
      safeProductionDays({ ...this.key }).then((res) => {
        if (res.data.success === true) {
          //this.receiveLogData=res.data.data.map(x=>({...x,createOn:moment(x.createOn).format('YYYY-MM-DD HH:mm')}));
          this.days = { ...res.data.data };
        }
      });
      receiveLog({ ...this.key, rowNum: 2 }).then((res) => {
        if (res.data.success === true) {
          this.receiveLogData = res.data.data.map((e) => ({
            ...e,
            createOn: moment(e.createOn).format("YYYY-MM-DD HH:mm"),
          }));
        }
      });
      GJQmachineHaltLogs({ ...this.key, rowNum: 2 }).then((res) => {
        if (res.data.success === true) {
          this.fixData = res.data.data.map((x) => ({
            ...x,
            sTime: moment(x.sTime).format("MM-DD HH:mm"),
            eTime: moment(x.eTime).format("MM-DD HH:mm"),
          }));
        }
      });
    },

    get3Dinfo() {
      threeDinfo({ ...this.key }).then((res) => {
        if (res.data.success === true) {
          this.topdata = res.data.data;
        }
      });
      // realTimeStaus
    },
    getZNSCdata() {
      listThroughputNew({ ...this.key, rowNum: 7, }).then((res) => {
        if (res.data.success === true) {
          let data = res.data.data.map((item) => item.intoNum);
          let data1 = res.data.data.map((item) => item.outNum);
          let date = res.data.data.map((item) =>
            moment(item.statisDate).format("MM-DD")
          );
          var option = { id: 'znsc1', name: ['吞量', '吐量'], legend: true, x: date, y: [data, data1], colors: [["#115380", "#00b3cf", "#115380"], ["#3d7afb", "#acef52", "#acef52"]] }
          girdEchartOption(option)
        }
      });


      gjq_avvw({ ...this.key, rowNum: 5 }).then((res) => {
        if (res.data.success === true) {
          let date = res.data.data.map((e) =>
            moment(e.statisDate).format("MM-DD")
          );
          let data = res.data.data.map((e) => e.avvw);


          var options = { id: 'znsc3', max: 100, x: date, y: [data], colors: [["#115380", "#00b3cf", "#115380"]], name: ['开动率趋势'] }
          girdEchartOption(options)
        }
      });

      gjq_list_avg_time_library({ ...this.key, rowNum: 5 }).then((res) => {
        if (res.data.success === true) {
          let date = res.data.data.map((e) =>
            moment(e.dayDate).format("MM-DD")
          );
          let data = res.data.data.map((e) => e.duration);
          let option = { id: 'jywl13', x: date, y: [data], name: ['在库时间分析'] }
          girdEchartOption(option)
        }
      });

      gjq_list_warehouse_use_rate({ ...this.key, rowNum: 5 }).then((res) => {
        if (res.data.success === true) {
          let date = res.data.data.map((e) =>
            moment(e.createTime).format("MM-DD")
          );
          let volumeData = res.data.data.map((e) => e.volume);
          let useRateData = res.data.data.map((e) => e.useRate);

          // let jywl4Pption = { id: 'jywl4', x: date, y: [volumeData], name: ['收料体积'] }
          // girdEchartOption(jywl4Pption)

          let jywl5Pption = { id: 'jywl4', x: date, y: [useRateData], name: ['库位利用率'] }
          girdEchartOption(jywl5Pption)


        }
      });

      gjq_list_month_mttr_mtbf({ ...this.key, rowNum: 5 }).then((res) => {
        if (res.data.success === true) {
          let mttrdata = res.data.data.map((item) => {
            return item.mttr;
          });
          let mttrmouth = res.data.data.map((item) => {
            return item.theMonth;
          });
          let mtbfdata = res.data.data.map((item) => {
            return item.mtbf;
          });

          let mttrOption = { id: 'znsc2', name: ['MTTR'], x: mttrmouth, y: [mttrdata], colors: [["#115380", "#115380", "#115380"]] }
          girdEchartOption(mttrOption);

          let mtbfOPtion = { id: 'znsc2', name: ['MTBF'], x: mttrmouth, y: [mtbfdata], colors: [["#115380", "#115380", "#115380"]] }
          girdEchartOption(mtbfOPtion);
        }
      });
    },

    getWlData() {

      mileageList({ ...this.key, rowNum: 7 }).then((res) => {
        if (res.data.success === true) {

          let date = res.data.data.map(x => moment(x.statisticalDate).format("MM-DD"));
          let data = res.data.data.map(x => x.avgMileage)
          let option = { id: 'pjlc', x: date, y: [data], name: ['平均里程'] };
          girdLineEchartOptions(option);
        }
      });
      deviceStatus({ deviceType: 3 }).then((res) => {
        if (res.data.success === true) {
          let data = res.data.data;
          this.ddjList = data;
        }
      });
      //gdCarList
      deviceStatus({ deviceType: 2 }).then((res) => {
        if (res.data.success === true) {
          let data = res.data.data;
          this.gdCarList = data;
        }
      });
      asrsDeviceNum({}).then((res) => {
        if (res.data.success === true) {
          let data = res.data.data;
          this.deviceTopData = data;
        }
      });
      //
      storageLocation({}).then((res) => {
        if (res.data.success === true) {
          let data = res.data.data;
          this.startObj = { ...this.startObj, ...data };
        }
      });
      realTimeThroughPut({}).then((res) => {
        if (res.data.success === true) {
          let data = res.data.data;
          console.log({ ...this.startObj, ...data });
          this.startObj = { ...this.startObj, ...data };
        }
      });
      GJQlisFaultAlarm({ ...this.key, rowNum: 7 }).then((res) => {
        if (res.data.success === true) {
          // let date = res.data.data.map((x) => x.type);
          // date= date.map(x=>this.dateUnitObj(x))
          // let data = res.data.data.map((x) => x.duration);
          //  date= date.map(x=>this.dateUnitObj[x]);

          let pieData = res.data.data.map((x) => ({ name: x.type, value: x.duration }));
          this.sblgOption = pieData;
          onePieEchartOption({ id: 'sbgl3', inData: pieData, name: '设备故障', width: '60%', showLabel: false })

          // let option = {id:'sbgl3',name:['设备故障'],x:date,y:[data],colors:[["#115380","#00b3cf","#115380"]]} ;
          // girdEchartOption(option)

        }
      });

      // list_energy_consumption({
      //   ...this.key,
      //   rowNum: 7,
      //   energyTypes: "电力",
      // }).then((res) => {
      //   if (res.data.success === true) {
      //     let date = res.data.data.map((x) => moment(x.theDate).format("MM-DD"));
      //     let data = res.data.data.map((x) => x.consume);
      //     let option = { id: 'nyhj1', x: date, y: [data], name: ['电力'] }
      //     girdEchartOption(option);
      //   }
      // });
    },
  },
};
// {1:["后盖、右前门、右后门"],2:["右前二","后盖的",],3:["右前2","后盖1"],4:["6120R1","6140R1","7210V01"]}
</script>





<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.botview_center_body {
  width: 100%;
  height: 280px;
  display: flex;
  flex: row;
}
.as-dialog-big {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 50%;
  height: 50%;
  z-index: 109;
  background: #fff;
  transform: translate(-50%, -50%);
}
.botview_center_body .duiduo {
  width: 60px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.botview_center_body .duiduo .duiduo_item {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.duiduo_content {
  display: flex;
  flex: 1;
  flex-direction: column;
  color: white;
  font-size: 16px;
}

.botview_center_body .huanchuan {
  width: 210px;
  margin-left: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.botview_center_body .huanchuan .huanchuan_content {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  color: "#4ec4f8";
  font-size: 16px;
}

.huanchuan_content .huanchuan_item {
  width: 40px;
  height: 40px;
  margin: 1px 3px 1px 3px;
}

.huanchuan_item .huanchuan_item_green {
  text-align: center;
  line-height: 40px;
  width: 100%;
  height: 100%;
  background: url("../../assets/img/huanchuan_01.png") no-repeat;
  background-size: contain;
}

.huanchuan_item .huanchuan_item_yellow {
  width: 100%;
  height: 100%;
  background: url("../../assets/img/huanchuan_03.png") no-repeat;
  background-size: contain;
  color: black;
}

.huanchuan_item .huanchuan_item_red {
  width: 100%;
  height: 100%;
  background: url("../../assets/img/huanchuan_02.png") no-repeat;
  background-size: contain;
  color: black;
}

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
  height: 605px;
  box-sizing: border-box;
  margin-bottom: 15px;
}
.jywl {
  width: 400px;
  /*padding: 15px;*/
  height: 330px;
  box-sizing: border-box;
}

.nyhj {
  width: 320px;
  height: 210px;
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
  font-size: 18px;
}
.bdc-bot .tip {
  display: inline-block;
  width: 63px;
  height: 47px;
  padding: 5px 0;
  display: block;
  text-align: center;
  line-height: 18px;
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
  height: 310px;
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
  width: 1120px;
  height: 330px;
  /*padding: 15px;*/
  box-sizing: border-box;
  overflow: hidden;
}
.sbgl2box,
.ddj-box {
  float: left;
  width: 300px;
}
.ddj-box {
  left: 180px;
}
.sbgl3box {
  margin-top: 35px;
  width: 340px;
  margin-left: 20px;
}
.sbgltable {
  width: 400px;
  margin-left: 20px;
}
.sbgl2box .stateball,
.ddj-box .stateball {
  padding: 10px 0;
  display: flex;
  flex-wrap: wrap;
}
.stateball .flex_6 {
  width: 16.66%;
  height: 40px;
}

.sbgl2box .stateball span,
.ddj-box .stateball span {
  display: inline-flex;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: #fff;
  text-align: center;
  line-height: 32px;
  border-radius: 50%;
  background: #0bb20c;
  margin-left: 10px;
  overflow: hidden;
  margin-bottom: 20px;
}
.sbgl2box .stateball span.green,
.ddj-box .stateball span.green {
  background: #0bb20c;
  display: inline-block;
  width: 32px;
  margin: 0;
}
.sbgl2box .stateball span.yellow,
.ddj-box .stateball span.yellow {
  background: yellow;
  display: inline-block;
  width: 32px;
  margin: 0;
}
.sbgl2box .stateball span.red,
.ddj-box .stateball span.red {
  background: red;
  display: inline-block;
  width: 40px;
  margin: 0;
}
.sbgltop {
  position: absolute;
  right: 0px;
  top: 0px;
  width: 370px;
}
.sbgltop .info {
  width: 30%;
  text-align: center;
  font-size: 12px;
  color: #fff;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 5px;
  border-radius: 3px;
  display: inline-block;
}
.sbgltop span {
  font-size: 12px;
  color: #4ec4f8;
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
i {
  cursor: pointer;
}

.table tbody tr td {
  line-height: 17px;
  color: #fff;
}
#pjlc {
  width: 100%;
  height: 180px;
}
.boxview {
  position: absolute;
  right: 0px;
  top: 0px;
  width: 792px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.boxview .item {
  background: url("../../assets/img/btnbg.png") no-repeat;
  background-size: 100% 100%;
  width: 100px;
  height: 50px;
  box-sizing: border-box;
  padding: 8px 0;
  margin: 0 5px;
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
#threeD {
  width: 1050px;
  height: 500px;
}
/* 0 3 d  未使用  1 已使用 */
</style>
<style  lang='scss'>
.sbxx-form .el-form--inline .el-form-item__label {
  float: none;
  display: inline-block;
  color: #fff;
}
.zhineng_play {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.selectBox {
  /* height: 40%; */
  padding: 10px;
  margin: 5px;
  background-color: #537580;
  cursor: pointer;
  color: #fff;
}
.selectBoxFather {
  padding: 10px 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.current {
  background-color: orange;
}
.boxboxbox {
  position: absolute;
  left: -1000px;
  top: 1000px;
  width: 1.5%;
  height: 4%;
  background-color: yellow;
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
.openVideo {
  cursor: pointer;
}
.bcd .el-dialog {
  background-color: rgba(0, 0, 0, 0);
}
.bcd .el-dialog__header {
  /* border-bottom: #e8e8e8 solid 1px; */
  border-bottom: 0;
}
.as-dialog-big {
  position: fixed;
  top: 0;
  left: 0;
  width: 1920px;
  height: 1080px;
  z-index: 109;
  background: #fff;
}
.infotable-cs-big {
  width: 100%;
  height: 100%;
}
.infotable-cs-big img {
  width: 100%;
  height: 100%;
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
.duiduoBox {
  width: 100%;
  height: 100%;
  background: url("../../assets/img/car11  (1).png") no-repeat center center;
  background-size: contain;
}
.duiduoNum {
  position: relative;
  top: 1px;
}
.imgBox {
  height: calc(100% - 50px);
  width: 100%;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
