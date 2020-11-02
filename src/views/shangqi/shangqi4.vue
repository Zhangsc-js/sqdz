<template>
  <div class="home dc-body">
    <div class="head-box">
      <headtit title="电池车间" :date="nowDate"></headtit>
    </div>
    <div class="flex-box dccj-form">
      <div class="item-box" style="padding: 0 0 0 15px; z-index: 2">
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
              <p>{{ topData.stationNum }}</p>
            </div>
            <!-- <div class="item">
              <small>占用工位</small>
              <p>{{ topData.stationUseNum }}</p>
            </div>-->
            <div class="item">
              <small>总缓存</small>
              <p>{{ 125 }}</p>
            </div>
            <!-- <div class="item">
              <small>占用缓存</small>
              <p>{{ topData.cacheUseNum }}</p>
            </div>-->
            <!-- 暂无趋势图，点击不展示趋势图坐标 -->
            <!-- @click="handImgShow = !handImgShow" -->
            <div class="item item-btn" style="text-align: center; position: relative">
              <small>占用缓存</small>
              <p>{{ topData.cacheUseNum }}</p>
            </div>
          </div>
          <el-carousel
            indicator-position="none"
            :interval="5000"
            height="140px"
            style="width: 100%; height: 140px; overflow: hidden"
            class="el_carousel_fade"
          >
            <el-carousel-item>
              <div class="chart-tit">
                <span>MTTR（min）</span>
              </div>
              <div id="znsc4" style="width: 100%; height: 110px"></div>
            </el-carousel-item>
            <el-carousel-item>
              <div class="chart-tit">
                <span>MTBF（h）</span>
              </div>
              <div id="znsc6" style="width: 100%; height: 110px"></div>
            </el-carousel-item>
          </el-carousel>
          <el-carousel
            indicator-position="none"
            :interval="5000"
            height="140px"
            style="width: 100%; height: 140px; overflow: hidden"
            class="el_carousel_fade"
          >
            <el-carousel-item>
              <div class="chart-tit">
                <span>OEE（%）</span>
              </div>
              <div id="znsc1" style="width: 100%; height: 110px"></div>
            </el-carousel-item>
            <el-carousel-item>
              <div class="chart-tit">
                <span>产量分析</span>
              </div>
              <div id="znsc2" style="width: 100%; height: 110px"></div>
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="chartbox jywl">
          <div class="box-tit" style="display:flex; ">
            <img class="img" src="../../assets/img/data-icons/logistics.png" />
            <span>精益物流</span>
            <el-button
              style="margin-left:10px"
              @click="setAgv"
              type="primary"
              size="small"
            >{{isAgv?'车间':'AGV'}}</el-button>

            <!-- <div style="position: absolute; top: 0; right: 0">
              <small style="color: #fff">AGV总数</small>
              <span style="font-size: 18px; font-weight: bold; color: #4ec4f8;margin-left:20px;">
                {{
                125
                }}
              </span>
            </div>-->
            <div class="sumBox" v-show="isAgv">
              <span>正常:{{agvStatusModel.normal|| 0}}</span>
              <span>故障:{{agvStatusModel.fault|| 0}}</span>
              <span>充电:{{agvStatusModel.charging|| 0}}</span>
              <span>离线:{{agvStatusModel.offline|| 0}}</span>
            </div>
          </div>
          <div v-show="isAgv">
            <div class="chart-tit zhineng_box11">
              <span>轨迹分析</span>
              <el-row style="text-align:left;height:auto;" class="guiJiSelect">
                <el-select
                  placeholder="请选择"
                  v-model="trajectoryVal"
                  style="width:90px;"
                  @change="onChangeAgvNum"
                  :popper-append-to-body="false"
                  value-key="agvNum"
                  filterable
                >
                  <el-option
                    :label="item.agvNum"
                    :value="item"
                    v-for="(item, index) in trajectorNames"
                    :key="item.agvNum"
                  ></el-option>
                </el-select>
              </el-row>
            </div>
            <div style="width: 100%; position: relative">
              <img style="width: 100%" src="../../assets/img/dc-way2.png" />
              <div class="car-point" :style="carPoaition"></div>
              <div v-for="(item,index) in nokAgv" :key="index">
                <div
                  class="car-point"
                  :style="{left:item.left,top:item.top}"
                  style="backgroundColor:red"
                ></div>
              </div>
            </div>
            <div class="chart-tit">
              <span>空闲时间占比</span>
            </div>
            <div id="avg1" style="width: 100%; height: 100px"></div>
          </div>
          <div v-if="!isAgv">
            <div class="chart-tit">
              <span>收货箱数</span>
            </div>
            <div id="jywl3" style="width:100%;height:100px;"></div>
            <div class="chart-tit">
              <span>收料体积(m³)</span>
            </div>
            <div id="jywl4" style="width:100%;height:100px;"></div>
            <div class="chart-tit">
              <span>道口利用率/在建</span>
            </div>
            <div id style="width:100%;height:100px;"></div>
          </div>
          <!-- <div id="jywl5" style="width:100%;height:10.6vh;"></div> -->
        </div>
      </div>
      <div class="item-box" style="padding-top: 0; z-index: 1">
        <div class="mainview" style="position: relative">
          <div class="top-info">
            <div class="item">
              <span class="txt">计划产量</span>
              <v-countup :start-value="0" :end-value="startObj.planOutput" class="num"></v-countup>
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

            <div class="item">
              <span class="txt">OEE</span>
              <v-countup :start-value="0" :end-value="startObj.realTimeOee" class="num"></v-countup>
              <span
                v-if="startObj.realTimeOee !=0"
                style="font-size: 14px;font-weight: bold;color: #4ec4f8;"
              >%</span>
            </div>
            <div class="item">
              <span class="txt">在岗人数</span>
              <!-- <v-countup :start-value="0" :end-value="startObj.onJobNum" class="num"></v-countup> -->
              <span style="font-size: 14px; font-weight: bold; color: #4ec4f8">{{ "在建" }}</span>
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
          <div class="floor-info">
            <div class="item">
              <span>{{floorIndex == 1? "一层" :"二层"}}</span>
            </div>
          </div>
          <div class="viewbox" style="margin-top: 20px; position: relative">
            <!-- <img class="img" src="../../assets/img/dc.png" width="1050" /> -->
            <img
              class="img"
              src="../../assets/img/dc-main.png"
              v-show="floorIndex == 1"
              style="
                font-weight: 100;
                width: 110%;
                margin-left:-7%;
                margin-top:-7%;
              "
              @click="onChangeImg(2)"
            />
            <img
              class="img"
              src="../../assets/img/dc-main-2.png"
              style="
                font-weight: 100;
                width: 110%;
                margin-left:-7%;
                margin-top:-3%;
              "
              v-show="floorIndex == 2"
              @click="onChangeImg(1)"
            />
            <div v-for="(item,index) in dataPoint" :key="index">
              <div
                class="car-point11"
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
            <div class="zypzboxs" v-show="floorIndex == 1">
              <div class="item">
                <div class="chart-tit">
                  <span>下线电测试（%）</span>
                </div>
                <div class="chart" id="zypz1"></div>
              </div>
              <div class="item">
                <div class="chart-tit">
                  <span>在线电测试（%）</span>
                </div>
                <div class="chart" id="zypz2"></div>
              </div>
              <div class="item">
                <div class="chart-tit">
                  <span>密封测试（%）</span>
                </div>
                <div class="chart" id="zypz3"></div>
              </div>
              <div class="item">
                <div class="chart-tit">
                  <span>AUDIT</span>
                </div>
                <div class="chart" id="zypz4" style="width: 220px; height: 100px"></div>
              </div>
            </div>
            <div class="zypzboxs" v-show="floorIndex == 2">
              <div class="item">
                <div class="chart-tit">
                  <span>螺栓扭矩与结果</span>
                </div>
                <div class="chart" id="zypz7" style="width: 220px; height: 100px"></div>
              </div>
              <div class="item">
                <div class="chart-tit">
                  <!-- asrs -->
                  <span>返工数量</span>
                </div>
                <div class="chart" id="zypz8" style="width: 220px; height: 100px"></div>
              </div>
              <div class="item">
                <div class="chart-tit">
                  <span>挡板密封测试</span>
                </div>
                <div class="chart" id="zypz9" style="width: 220px; height: 100px"></div>
              </div>
              <div class="item">
                <div class="chart-tit">
                  <span>壳体密封测试</span>
                </div>
                <div class="chart" id="zypz10" style="width: 220px; height: 100px"></div>
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
                  <span>停线分析(min)</span>
                </div>
                <div id="sbgl3" style="width: 100%; height: 110px" @click="showSblgDialog"></div>
              </div>
            </div>
            <div class="sbgltop">
              <div class="info">
                <small>车间设备总数/在建</small>
                <!-- <span>{{ deviceTotal }}</span> -->
              </div>
              <!-- <div class="info">
                <small>AGV总数</small>
                <span>80%</span>
              </div>-->
            </div>
            <div class="sbgltable" style="margin-top:3px">
              <span class="chart-tit" id="fixDeviceRecord">
                <span>备件领用记录/在建</span>
              </span>
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
                @click="showTxjl(fixData,[{name:'故障类型',prop:'typeName'},{name:'开始时间',prop:'sTime'},{name:'结束时间',prop:'eTime'}])"
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
                      <td>{{ item.typeName }}</td>
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
      <div class="item-box" style="padding: 0 15px 0 0; z-index: 2">
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
          <div style="position: relative">
            <div id="nyhj1" style="width: 100%; height: 120px"></div>
          </div>
          <el-carousel
            indicator-position="none"
            :interval="5000"
            height="140px"
            style="width: 100%; height: 140px; overflow: hidden"
            class="el_carousel_fade"
          >
            <el-carousel-item :key="4">
              <div class="chart-tit">
                <span>{{`电能（kW·h ${unitOption.dianUnit}）`}}</span>
              </div>
              <div id="nyhj4" style="width: 100%; height: 130px"></div>
            </el-carousel-item>
            <el-carousel-item :key="5">
              <div class="chart-tit">
                <span>{{`压缩空气（m³ ${unitOption.yasuoUnit}）`}}</span>
              </div>
              <div style="position: relative">
                <div id="nyhj3" style="width: 100%; height: 120px"></div>
              </div>
            </el-carousel-item>
            <el-carousel-item :key="3">
              <div class="chart-tit">
                <span>{{`工艺循环水（t ${unitOption.gongyiUnit}）`}}</span>
              </div>
              <div style="position: relative">
                <div id="nyhj5" style="width: 100%; height: 120px"></div>
              </div>
            </el-carousel-item>
            <el-carousel-item :key="1">
              <div class="chart-tit">
                <span>{{`自来水（t ${unitOption.zilaiUnit}）`}}</span>
              </div>
              <div style="position: relative">
                <div id="nyhj6" style="width: 100%; height: 120px"></div>
              </div>
            </el-carousel-item>
            <el-carousel-item :key="2">
              <div class="chart-tit">
                <span>{{`空调水（t ${unitOption.kongtiaoUnit}）`}}</span>
              </div>
              <div style="position: relative">
                <div id="nyhj2" style="height: 120px"></div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="chartbox bdc">
          <div class="box-tit">
            <img class="img" src="../../assets/img/data-icons/bdc.png" />
            <span>电池库</span>
          </div>
          <div class="bdc-bot">
            <div class="tip">
              <small>吞吐量(入)</small>
              <p>{{throughputObj.intoNum}}</p>
            </div>

            <div class="tip">
              <small>吞吐量(出)</small>
              <p>{{throughputObj.outNum}}</p>
            </div>

            <div
              class="tip topFive"
              style="display:flex;justify-content: center; align-items: center;"
              @click="showTopFive"
            >
              <small>在库Top10</small>
              <!-- <p>{{kuObj.useNum}}</p> -->
            </div>

            <div class="tip">
              <small>在使用库位</small>
              <p>{{kuObj.useNum}}</p>
            </div>
            <div class="tip">
              <small>未使用库位</small>
              <p>{{kuObj.noUseNum}}</p>
            </div>
            <div class="tip">
              <small>库位利用率</small>
              <p>{{kuObj.useRate}}%</p>
            </div>
          </div>
          <div @click="onOpenBdc()">
            <div class="chart-tit">
              <span>{{`在库时间分析（min ${unitOption.zaikuUnit}）` }}</span>
            </div>
            <div id="bdc3" style="width: 100%; height: 110px"></div>
          </div>
          <!-- 2 输送设备 3堆垛机 -->
          <div class="bdc-mid">
            <div class="state">
              <div class="chart-tit">
                <span>堆剁机状态</span>
              </div>
              <!-- <div class="ddj" v-for="(item, index) in ddjList" v-bind:key="index">
                <img class="img" src="../../assets/img/data-icons/piler.png" width="33" height="33" />
                <span>{{ item.deviceNo }}</span>
                <div
                  :class="item.status == 0 ? 'free' : 'err'"
                >{{ item.status == 0 ? "自动模式" : "异常" }}</div>
              </div>-->
              <div class="ddj ddjBox" style="width:81%;height:74%">
                <!-- <img class="img" src="../../assets/img/data-icons/piler.png" width="33" height="33" />
                <span>输送设备1</span>-->
                <div class="ddjBoxSon" v-for="(item,index) in batteryList" :key="index">
                  <img
                    v-if="item.status==1"
                    class="img"
                    src="../../assets/img/car11  (1).png"
                    width="33"
                    height="33"
                  />
                  <img
                    v-else
                    class="img"
                    src="../../assets/img/car11  (2).png"
                    width="33"
                    height="33"
                  />
                  <span style="font-size:14px">堆垛机{{index+1}}</span>
                </div>
                <!-- <div class="ddjBoxSon">
                  <img class="img" src="../../assets/img/car11  (2).png" width="33" height="33" />
                  <span style="font-size:14px">堆垛机2</span>
                </div>-->
              </div>
            </div>
            <div class="pie">
              <div class="chart-tit">
                <span>故障分析（min）</span>
              </div>
              <div id="bdc2" style="width: 100%; height: 110px" @click="showGuzhangDialog"></div>
            </div>
          </div>
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
            padding-left: 20px;
          "
        >
          <img class="img" src="../../assets/img/shangqi5-3.png" />
          <span>在库时间分析</span>
        </div>

        <div id="bdc1" style="width: 760px; height: 500px"></div>
      </div>
    </div>
    <div class="as-dialog" v-show="handImgShow">
      <div class="header" style="position: absolute; right: 20 px; top: 20px">
        <i class="el-icon-close" style="color: #fff; font-size: 40px" @click="handImgShow = false"></i>
      </div>
      <div class="infotable-cs">
        <div class="chart-tit">
          <span style="padding:20px">缓存占用</span>
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
    <txjl-dialog ref="txjl_dialog" shopName="DC" :lineBody="floorIndex==1?'YI-LOU':'ER-LOU'"></txjl-dialog>
  </div>
</template>
<script>
import echarts from "echarts";
import headtit from "./headtit.vue";
import floatmenu from "./floatmenu.vue";
import { getUnitString } from '@/utils/common';
import {
  faultAnalysis,
  getShopDeviceNum,
  receiveLog,
  maintainPercent,
  spotCheckPercent,
  get_check_maintain_complete_rate,
} from "@/api/shangqi/device";
import { list_warehouse_use_info } from "@/api/shangqi/wlModule";
import { safeDays } from "@/api/shangqi/zl";
import {
  listDlq,
  getRealTimeData,
  carTypeOutput,
  listDayOee,
  listMonthMttrMtbf,
  listAudit,
  list_weeks_audit,
  getMonthProductionInfo,
  tightening_pass_rate
} from "@/api/shangqi/zz";
import {
  list_test_data,
  list_avg_working_hours_analysis,
  list_agv_realtime_trajectory,
  get_throughput,
  list_in_storage_time,
  list_avg_in_storage_time,
  list_battery_stereo_library,
  list_throughput,
  get_agv_status_num,
} from "@/api/shangqi/dc";
import hand from "@/assets/img/hand.png";
import {
  lisFaultAlarm,
  listCache,
  productionRealTimeData,
  get_use_storage
} from "@/api/shangqi/cs";
import { list_energy_consumption, listTce } from "@/api/shangqi/enegy";
import {
  listLineBodyRealTimeData,
  getMonthProduction,
  getScrapReworkQualified,
  Mttrinfo,
  Oeeinfo,
  switchinfo,
  safeProductionDays,
  cy_downtime_analyze,
  monthProduction,
  downtime_record,
} from "@/api/shangqi/cy";
import moment from "moment";
import { onePieEchartOption, girdEchartOption, girdLineEchartOptions, yuanEchartOption, banyuanEchartOption, areaLineEchart } from '@/utils/echartOption'
import agvData from './data'
import pieDialog from '@/components/pieDialog';
import greenCross from './greenCross'
import { list_downtime_production_line, month_un_safety_production_day, list_agv_percentage_free_time, list_month_tce, list_day_tce } from '@/api/abcd.js'
import data4 from './data4'
import topFive from './topFive'
import txjlDialog from './txjlDialog'


export default {
  name: "shangqi4",
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
      agvStatusModel: {},
      pieDialogTitle: "",
      unitOption: {
        zaikuUnit: '',
        dianUnit: '',
        kongtiaoUnit: '',
        gongyiUnit: '',
        zilaiUnit: '',
        yasuoUnit: '',
      },
      timer111: '',
      hasData: "",
      nyhjChange: '日',
      topFiveDialog: false,
      interval: null, //自动循环参数
      start: 0,
      isAgv: true,
      batteryList: [],
      key: {
        workCode: 78,
        shopName: "DC",
      },
      dianchiKey: {
        workCode: 78,
        shopName: "DCLTK",
      },
      deviceTotal: 0,
      fixData: [],
      receiveLogData: [],
      floorIndex: 1,
      startObj: {},
      topData: {},
      days: {},
      ddjList: [],
      anquanDialog: false,

      bdcShow: false,
      //地图参数
      startList: [],
      throughputObj: {},
      kuObj: {},
      dayArr: [],
      getSafe: true,

      data4,
      trajectoryObj: {
        893: { w: "12.84%", h: "19.21%" },
        91: { w: "12.84%", h: "26.93%" },
        55: { w: "12.84%", h: "34.78%" },
        851: { w: "12.84%", h: "42.64%" },
        46: { w: "12.84%", h: "50.49%" },
        44: { w: "12.84%", h: "58.35%" },
        837: { w: "12.84%", h: "66.20%" },
        35: { w: "12.84%", h: "74.05%" },
        33: { w: "12.84%", h: "83.29%" },
        730: { w: "12.84%", h: "89.62%" },

        894: { w: "15.46%", h: "20.48%" },
        92: { w: "15.46%", h: "28.61%" },
        56: { w: "15.46%", h: "36.75%" },
        852: { w: "15.46%", h: "44.89%" },
        47: { w: "15.46%", h: "52.87%" },
        45: { w: "15.46%", h: "61.15%" },
        841: { w: "15.46%", h: "69.28%" },
        36: { w: "15.46%", h: "77.42%" },
        34: { w: "15.46%", h: "85.55%" },
        732: { w: "15.46%", h: "93.69%" },

        761: { w: "21.76%", h: "16.5%" },
        61: { w: "36.85%", h: "12.17%" },
        651: { w: "24.48%", h: "18.18%" },
        62: { w: "29.93%", h: "20%" },
        763: { w: "24.48%", h: "22.66%" },
        63: { w: "29.93%", h: "23.92%" },
        764: { w: "24.48v%", h: "26.43%" },
        64: { w: "29.93%", h: "27.97%" },
        40: { w: "24.48v%", h: "30.07%" },
        920: { w: "24.48v%", h: "34.13%" },
        748: { w: "28.21%", h: "32.03%" },
        48: { w: "32.01%", h: "31.7%" },
        926: { w: "29.68%", h: "37.34%" },
        529: { w: "26.73%", h: "54.83%" },
        575: { w: "26.73%", h: "46.15%" },
        579: { w: "26.88%", h: "41.96%" },
        589: { w: "26.73%", h: "50.35%" },
        599: { w: "26.73%", h: "60.56%" },
        749: { w: "35.59%", h: "34.55%" },
        771: { w: "36.29%", h: "12.31%" },
        861: { w: "35.59%", h: "26.15%" },
        862: { w: "35.59%", h: "20.56%" },
        863: { w: "35.59%", h: "24.34%" },
        864: { w: "35.59%", h: "28.25%" },
        225: { w: "26.73%", h: "68.53%" },
        226: { w: "31.08%", h: "70.63%" },
        512: { w: "32.17%", h: "41.40%" },
        514: { w: "32.17%", h: "46.43%" },
        516: { w: "32.17%", h: "50.35%" },
        521: { w: "32.17%", h: "54.83%" },
        523: { w: "32.17%", h: "60.56%" },
        525: { w: "32.17%", h: "64.20%" },
        572: { w: "37.84%", h: "57.76%" },
        576: { w: "37.92%", h: "43.50%" },
        595: { w: "26.73%", h: "64.20%" },
        596: { w: "37.84%", h: "61.68%" },
        125: { w: "48.33%", h: "69.37%" },
        126: { w: "43.20%", h: "70.63%" },
        127: { w: "43.20%", h: "76.22%" },
        511: { w: "42.11%", h: "41.54%" },
        513: { w: "43.20%", h: "45.87%" },
        515: { w: "43.20%", h: "51.05%" },
        517: { w: "43.20%", h: "55.52%" },
        519: { w: "48.33%", h: "41.96%" },
        522: { w: "43.20%", h: "60.70%" },
        524: { w: "43.20%", h: "66.01%" },
        527: { w: "48.33%", h: "61.82%" },
        531: { w: "48.64%", h: "86.71%" },
        539: { w: "48.64%", h: "80.98%" },
        541: { w: "48.64%", h: "84.20%" },
        573: { w: "48.33%", h: "53.29%" },
        577: { w: "48.33%", h: "48.81%" },
        587: { w: "48.33%", h: "57.48%" },
        597: { w: "48.33%", h: "66.15%" },
        227: { w: "36.52%", h: "70.63%" },
        219: { w: "82.67%", h: "53.85%" },
        229: { w: "82.67%", h: "49.65%" },
        234: { w: "81.27%", h: "45.59%" },
        244: { w: "81.35%", h: "41.26%" },
        257: { w: "81.27%", h: "37.34%" },
        267: { w: "81.35%", h: "32.17%" },
        307: { w: "81.35%", h: "23.92%" },
        309: { w: "81.27%", h: "28.25%" },
        310: { w: "75.76%", h: "59.16%" },
        311: { w: "82.67%", h: "62.94%" },
        312: { w: "80.57%", h: "66.43%" },
        314: { w: "124.55%", h: "62.94%" },
        317: { w: "81.35%", h: "16.50%" },
        318: { w: "95.73%", h: "86.99%" },
        319: { w: "81.27%", h: "19.72%" },
        321: { w: "89.12%", h: "79.02%" },
        322: { w: "91.22%", h: "83.92%" },
        326: { w: "87.02%", h: "77.62%" },
        328: { w: "87.02%", h: "70.21%" },
        329: { w: "92.46%", h: "79.02%" },
        330: { w: "87.02%", h: "75.24%" },
        331: { w: "91.30%", h: "90.07%" },
        332: { w: "86.64%", h: "90.63%" },
        341: { w: "81.51%", h: "87.97%" },
        342: { w: "81.51%", h: "85.03%" },
        348: { w: "82.60%", h: "88.11%" },
        349: { w: "81.51%", h: "82.24%" },
        350: { w: "74.90%", h: "49.79%" },
        351: { w: "71.79%", h: "20.14%" },
        352: { w: "71.79%", h: "16.08%" },
        353: { w: "74.90%", h: "28.81%" },
        354: { w: "74.90%", h: "24.62%" },
        355: { w: "74.90%", h: "36.78%" },
        356: { w: "74.90%", h: "33.01%" },
        361: { w: "74.90%", h: "45.17%" },
        362: { w: "74.90%", h: "41.12%" },
        366: { w: "74.90%", h: "43.36%" },
        367: { w: "66.20%", h: "41.40%" },
        369: { w: "67.99%", h: "44.76%" },
        372: { w: "74.90%", h: "26.15%" },
        373: { w: "66.20%", h: "24.20%" },
        375: { w: "66.20%", h: "28.25%" },
        376: { w: "74.90%", h: "30.77%" },
        377: { w: "66.20%", h: "20.00%" },
        378: { w: "74.90%", h: "16.08%" },
        384: { w: "66.20%", h: "36.78%" },
        386: { w: "74.90%", h: "35.80%" },
        387: { w: "66.20%", h: "33.01%" },
        388: { w: "74.90%", h: "38.88%" },
        397: { w: "66.20%", h: "15.66%" },
        400: { w: "76.85%", h: "75.66%" },
        401: { w: "70.40%", h: "77.20%" },
        407: { w: "66.20%", h: "50.63%" },
        408: { w: "67.60%", h: "73.15%" },
        409: { w: "66.20%", h: "80.56%" },
        411: { w: "72.03%", h: "82.38%" },
        418: { w: "68.30%", h: "82.38%" },
        419: { w: "45.77%", h: "75.94%" },
        428: { w: "78.63%", h: "86.15%" },
        922: { w: "84.69%", h: "58.74%" },
        927: { w: "70.71%", h: "63.22%" },
        930: { w: "82.67%", h: "56.64%" },
      },
      carPoaition: "display: block;",
      handImgShow: false,
      trajectorNames: [
        {
          agvNum: 1,
          landmark: '1111'
        }
      ],
      monthObj: {},
      nowDate: '',
      trajectoryVal: "",
      agvData,
      nokAgv: [],
      sblgOption: null,
      guzhangOption: null,

    };
  },
  computed: {
    dataPoint() {
      if (this.floorIndex == '1') {
        return this.data4.one
      } else {
        return this.data4.two
      }
    }
  },
  watch: {},
  mounted() {
    // console.log(this.agvData.filter(item=>item.name==541))
    this.initData();
    // this.test();
    // this.setCharts()
  },
  beforeDestroy() {
    clearInterval(this.timer111)
  },
  methods: {
    initData() {
      this.data4.one = this.data4.one.map(item => {
        return {
          ...item,
          leftBox: +item.left + 2,
          topBox: +item.top - 2,
          flag: false,
          flagBox: false,
          message: {}
        }
      })
      this.data4.two = this.data4.two.map(item => {
        return {
          ...item,
          leftBox: +item.left + 2,
          topBox: +item.top - 2,
          flag: false,
          flagBox: false,
          message: {}
        }
      })
      this.getFixRecord();
      this.getChartData();
      this.getData()
      this.isSafe()
      list_battery_stereo_library({ deviceType: 3 }).then(res => {
        if (res.data.success) {
          this.batteryList = res.data.data
        }
      })
      // 轨迹
      list_agv_realtime_trajectory({ ...this.key, rowNum: 3, lineBody: "YI-LOU", }).then((res) => {
        if (res.data.success === true) {
          // debugger
          this.trajectorNames = res.data.data.filter(item => { item.agvStatus == 1 });
          console.log('agvNum', this.trajectorNames)
          this.nokAgv = res.data.data.filter(item => { item.agvStatus == 2 })
        }
      });
      // 智能排产
      getMonthProductionInfo({ shopName: "DC", workCode: "78" }).then(res => {
        if (res.data.success) {
          this.$set(this.monthObj, 'actualOutput', res.data.data.monthlyOutput)
          this.$set(this.monthObj, 'completionRate', res.data.data.monthCompletionRate)
        }
      })
    },
    showTopFive() {
      this.topFiveDialog = true
      this.$nextTick(() => {
        this.$refs.top_five.rowNum = 5
        this.$refs.top_five.getData('DCLTK')
      })
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
    showTxjl(data, propData) {
      this.$refs.txjl_dialog.tableData = data
      this.$refs.txjl_dialog.propData = propData
      this.$refs.txjl_dialog.visible = true
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
    setCharts() {
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
    async getData() {
      let res = await list_downtime_production_line({ ...this.key })
      if (res.data.data && res.data.data.length > 0) {
        res.data.data.forEach(item => {
          this.data4.one.forEach(v => {
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
          this.data4.two.forEach(v => {
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
    setAgv() {
      this.isAgv = !this.isAgv
      if (!this.isAgv) {
        this.$nextTick(() => {
          this.setCharts()
        })
      }
    },
    test() {
      let obj = { w: "12.84%", h: "19.21%" };
      this.carPoaition = `left:${obj.w};top:${obj.h};display:block`;

      let data = [{ name: '故障1', value: 200 }, { name: '故障2', value: 200 }, { name: '故障3', value: 200 }, { name: '故障4', value: 200 }]
      this.sblgOption = data;
      onePieEchartOption({ id: 'sbgl3', inData: data, name: '停线分析', showLabel: false })

      this.trajectorNames = [
        { agvNum: 1, landmark: '1111' },
        { agvNum: 2, landmark: '1111' },
        { agvNum: 3, landmark: '1111' },
        { agvNum: 4, landmark: '1111' },
        { agvNum: 5, landmark: '1111' },
        { agvNum: 6, landmark: '1111' },
        { agvNum: 7, landmark: '1111' },
        { agvNum: 8, landmark: '1111' },
      ];
    },

    // 停线分析
    showSblgDialog() {
      if (this.sblgOption) {
        this.pieDialogTitle = "停线分析";
        this.hasData = "区域";
        this.$refs.pieDialog.onePieDialog(this.sblgOption);
      }
    },

    showGuzhangDialog() {
      if (this.guzhangOption) {
        this.pieDialogTitle = "故障分析";
        this.hasData = "类型";
        this.$refs.pieDialog.onePieDialog(this.guzhangOption);
      }
    },

    onOpenBdc() {
      this.bdcShow = true;
    },
    onChangeAgvNum(a) {
      let obj = this.agvData.filter(item => item.name == a.landmark)[0]
      this.carPoaition = `left:${obj.left};top:${obj.top};display:block`;
    },
    onChangeImg(floor) {
      this.floorIndex = floor;
      // 数据刷新
      this.startObj = this.startList[floor - 1] || {};
      let lineBody = floor == 1 ? "YI-LOU" : "ER-LOU";


      cy_downtime_analyze({ ...this.key, lineBody: lineBody, }).then(res => {
        if (res.data.success === true) {
          let data = res.data.data.map(e => ({ name: e.downtimeType, value: e.duration }))
          this.sblgOption = data;
          onePieEchartOption({ id: 'sbgl3', inData: data, name: '停线分析', showLabel: false })
        }
      })


      Oeeinfo({ ...this.key, rowNum: 7, lineBody: lineBody }).then((res) => {
        if (res.data.success === true) {
          let date = res.data.data.map((x) => moment(x.theDate).format('MM-DD'));
          let oeeData = res.data.data.map((x) => x.oee);

          let mttrOption = { id: 'znsc1', max: 100, name: ['OEE'], x: date, y: [oeeData] }
          girdLineEchartOptions(mttrOption)
        }
      });
      productionRealTimeData({ ...this.key, lineBody: lineBody }).then(
        (res) => {
          if (res.data.success === true) {
            this.topData = { ...res.data.data };
            //this.deviceTotal=res.data.data
          }
        });
      carTypeOutput({ ...this.key, rowNum: 7, lineBody: lineBody }).then(
        (res) => {
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
            let option = { id: 'znsc2', x: date, name: type, y: data, legend: true, legend: true };
            girdEchartOption(option);
          }
        }
      );


    },

    getFixRecord() {
      this.nowDate = moment().format('YYYY年MM月DD日');
      // 停线记录
      downtime_record({ ...this.key, rowNum: 2 }).then(res => {
        if (res.data.success === true) {
          this.fixData = res.data.data.map((x) => ({
            ...x,
            sTime: moment(x.sTime).format("MM-DD HH:mm"),
            eTime: moment(x.eTime).format("MM-DD HH:mm"),
          }));
        }
      })

      // 获取电agv 的状态总数
      get_agv_status_num({ ...this.key }).then(res => {
        if (res.data.success === true) {
          this.agvStatusModel = res.data.data;
        }
      });

      monthProduction({ ...this.key }).then(res => {
        if (res.data.success === true) {
          this.monthObj = res.data.data;
        }
      })

      // 吞吐量
      get_throughput({ ...this.key, rowNum: 3 }).then((res) => {
        if (res.data.success === true) {
          let data = res.data.data;
          this.throughputObj = { ...data };
        }
      });

      //  库的使用
      get_use_storage({ ...this.dianchiKey }).then((res) => {
        if (res.data.success === true) {
          this.kuObj = res.data.data;
        }
      });

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
      safeProductionDays({ ...this.key }).then((res) => {
        if (res.data.success === true) {
          this.days = { ...res.data.data };
        }
      });
      listLineBodyRealTimeData({
        ...this.key,
        rowNum: 7,
        lineBody: "YI-LOU",
      }).then((res) => {
        if (res.data.success === true) {
          this.startList = res.data.data;
          this.startObj = res.data.data[this.floorIndex - 1] || {};
        }
      });
      //   list_agv_realtime_trajectory({
      //     ...this.key,
      //     rowNum: 3,
      //     lineBody: "YI-LOU",
      //   }).then((res) => {
      //     if (res.data.success === true) {
      //       // debugger

      //       this.trajectorNames = res.data.data;
      //       // let names = data.map(x=>x.landmark);
      //       //let obj = data[0];
      //       //if(){
      //       //  trajectoryObj[obj.landmark]
      //       // }
      //     }
      //   });

      get_check_maintain_complete_rate({ ...this.key, rowNum: 3 }).then(
        (res) => {
          if (res.data.success === true) {
            // console.log((res.data.data))
            let sbgl1Option = { id: 'sbgl1', value: (res.data.data || {}).checkCompleteRate || 0 };
            yuanEchartOption(sbgl1Option)

            let sbgl2Option = { id: 'sbgl2', value: (res.data.data || {}).maintainCompleteRate || 0 };
            yuanEchartOption(sbgl2Option)

          }
        }
      );
      // 获取电池车间故障
      // lisFaultAlarm({ ...this.key, rowNum: 7 }).then((res) => {
      //   if (res.data.success === true) {
      //     let date = res.data.data.map((x) => x.faultType);
      //     let data = res.data.data.map((x) => x.duration);

      //     let option = { id: 'sbgl3', name: ["设备故障分析"], x: date, y: [data], colors: [["#115380", "#00b3cf", "#115380"]] };
      //     girdLineEchartOptions(option);

      //   }
      // });

      cy_downtime_analyze({ ...this.key, lineBody: "YI-LOU", }).then(res => {
        if (res.data.success === true) {
          let data = res.data.data.map(e => ({ name: e.downtimeType, value: e.duration }))
          this.sblgOption = data;
          onePieEchartOption({ id: 'sbgl3', inData: data, name: '停线分析', showLabel: false })
        }
      })
      //  获取电池故障
      lisFaultAlarm({ ...this.dianchiKey }).then((res) => {
        if (res.data.success === true) {
          let data = res.data.data.map((x) => {
            return ({ name: x.faultType, value: x.duration });
          });
          this.guzhangOption = data;
          onePieEchartOption({ id: 'bdc2', inData: data, name: '故障分析', showLabel: false, width: '50%' });
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
          let option = { id: 'nyhj2', name: ["空调水"], x: date, y: [data] };
          this.unitOption = { ...this.unitOption, kongtiaoUnit: getUnitString(res.data.data.powerNum) }
          girdLineEchartOptions(option);
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
          let option = { id: 'nyhj3', name: ["压缩空气"], x: date, y: [data] };
          this.unitOption = { ...this.unitOption, yasuoUnit: getUnitString(res.data.data.powerNum) }
          girdLineEchartOptions(option);
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
          let option = { id: 'nyhj5', name: ["工艺循环水"], x: date, y: [data] };
          this.unitOption = { ...this.unitOption, gongyiUnit: getUnitString(res.data.data.powerNum) }
          girdLineEchartOptions(option);
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
          let option = { id: 'nyhj6', name: ["自来水"], x: date, y: [data] };
          this.unitOption = { ...this.unitOption, zilaiUnit: getUnitString(res.data.data.powerNum) }
          girdLineEchartOptions(option);

        }
      });
      listTce({
        ...this.key,
        rowNum: 7,
      }).then((res) => {
        if (res.data.success === true) {
          let date = res.data.data.map((x) => moment(x.statisDate).format('MM-DD'));
          let data = res.data.data.map((x) => x.tce && x.tce.toFixed(0));
          let option = { id: 'nyhj1', name: ["吨标煤"], x: date, y: [data] };
          girdEchartOption(option);
        }
      });
    },
    getChartData() {
      Mttrinfo({ ...this.key, rowNum: 7, lineBody: "YI-LOU" }).then((res) => {
        if (res.data.success === true) {
          let date = res.data.data.map((x) => x.theMonth);
          let mttrData = res.data.data.map((x) => x.mttr);
          let mtbfData = res.data.data.map((x) => x.mtbf);

          let mttrOption = { id: 'znsc4', name: ['MTTR'], x: date, y: [mttrData] }
          girdLineEchartOptions(mttrOption)

          let mtbfOption = { id: 'znsc6', name: ['MTBF'], x: date, y: [mttrData] }
          girdLineEchartOptions(mtbfOption)

        }
      });
      Oeeinfo({ ...this.key, rowNum: 7, lineBody: "YI-LOU" }).then((res) => {
        if (res.data.success === true) {
          let date = res.data.data.map((x) => moment(x.theDate).format('MM-DD'));
          let oeeData = res.data.data.map((x) => x.oee);

          let mttrOption = { id: 'znsc1', name: ['OEE'], x: date, y: [oeeData] }
          girdLineEchartOptions(mttrOption)
        }
      });
      productionRealTimeData({ ...this.key, lineBody: "YI-LOU" }).then(
        (res) => {
          if (res.data.success === true) {
            this.topData = { ...res.data.data };
            //this.deviceTotal=res.data.data
          }
        }
      );

      carTypeOutput({ ...this.key, rowNum: 7, lineBody: "YI-LOU" }).then(
        (res) => {
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
            let option = { id: 'znsc2', x: date, name: type, y: data, legend: true };
            girdEchartOption(option);
          }
        }
      );

      listCache({ ...this.key, rowNum: 7 }).then((res) => {
        if (res.data.success === true) {
          let date = res.data.data.map((x) => moment(x.theDate).format('MM-DD'));
          let data = res.data.data.map((x) => x.occupancyNum);
          let option = { id: 'znsc0', name: ['缓存占用分析'], x: date, y: [data] }
          girdEchartOption(option);
        }
      });
      list_weeks_audit({ rowNum: 7, shopName: "DC", workCode: "78" }).then((res) => {
        if (res.data.success) {
          let date = res.data.data.map((x) => x.weeks);
          let data = res.data.data.map((x) => x.audit);

          //  this.days ={...res.data.data}
          let option = { id: 'zypz4', name: ['AUDIT'], x: date, y: [data], colors: [["#c9ca22", "#02a29b", "#c9ca22"]] }
          girdEchartOption(option);
        }
      });
      getScrapReworkQualified({ ...this.key, rowNum: 7 }).then((res) => {
        if (res.data.success === true) {
          //   let date = res.data.data.map((item) => {
          //     return item.statisDate.format('MM-DD');
          //   });
          let date = res.data.data.map((x) => moment(x.statisDate).format('MM-DD'));

          let reworkNumData = res.data.data.map((item) => {
            return item.reworkNum;
          });
          let option = { id: 'zypz8', name: ['返工数'], x: date, y: [reworkNumData] }
          girdEchartOption(option);

        }
      });


      //lineBody  IL：在线电测试  EOL：线下电测试  Leck：密封测试
      list_test_data({
        ...this.key,
        rowNum: 7,
        lineBody: "YI-LOU",
        testType: "EOL",
      }).then((res) => {
        if (res.data.success === true) {
          let date = res.data.data.map((x) => moment(x.theDate).format('MM-DD'));
          let data = res.data.data.map((x) => x.okRate);
          let option = { id: 'zypz1', max: 100, name: ['下线电测试'], x: date, y: [data] }
          girdLineEchartOptions(option);

        }
      });
      list_test_data({
        ...this.key,
        rowNum: 7,
        lineBody: "YI-LOU",
        testType: "IL",
      }).then((res) => {
        if (res.data.success === true) {
          let date = res.data.data.map((x) => moment(x.theDate).format('MM-DD'));
          let data = res.data.data.map((x) => x.okRate);
          let option = { id: 'zypz2', max: 100, name: ['在线电测试'], x: date, y: [data] }
          girdLineEchartOptions(option);
        }
      });
      list_test_data({
        ...this.key,
        rowNum: 7,
        lineBody: "YI-LOU",
        testType: "Leck",
      }).then((res) => {
        if (res.data.success === true) {
          let date = res.data.data.map((x) => moment(x.theDate).format('MM-DD'));
          let data = res.data.data.map((x) => x.okRate);
          // let data1 = res.data.data.map(x=>x.output)
          // this.znsc6('znsc0',date, data,"缓存占用分析");
          let option = { id: 'zypz3', max: 100, name: ['密封测试'], x: date, y: [data] }
          girdLineEchartOptions(option);
        }
      });
      list_test_data({
        ...this.key,
        rowNum: 7,
        lineBody: "ER-LOU",
        testType: "Bater",
      }).then((res) => {
        if (res.data.success === true) {
          let date = res.data.data.map((x) => moment(x.theDate).format('MM-DD'));
          let data = res.data.data.map((x) => x.okNum);
          let option = { id: 'zypz9', name: ['挡板密封测试'], x: date, y: [data] }
          girdLineEchartOptions(option);
        }
      });
      list_test_data({
        ...this.key,
        rowNum: 7,
        lineBody: "ER-LOU",
        testType: "Case",
      }).then((res) => {
        if (res.data.success === true) {
          let date = res.data.data.map((x) => moment(x.theDate).format('MM-DD'));
          let data = res.data.data.map((x) => x.okNum);
          let option = { id: 'zypz10', name: ['壳体密封测试'], x: date, y: [data] }
          girdLineEchartOptions(option);
        }
      });
      //   螺栓扭矩与结果
      tightening_pass_rate({
        rowNum: 7
      }).then((res) => {
        if (res.data.success === true) {
          let date = res.data.data.map((x) => moment(x.statisDate).format('MM-DD'));
          let data = res.data.data.map((x) => x.qualifiedRate);
          let option = { id: 'zypz7', name: ['螺栓扭矩与结果'], x: date, y: [data] }
          girdLineEchartOptions(option);
        }
      });



      list_agv_percentage_free_time({
        shopName: "DC",
        workCode: "78",
      }).then((res) => {
        if (res.data.success === true) {
          let dateSum = res.data.data.map((x) => x.stationNo);
          let date = dateSum.filter((item, index) => index <= 4) //5个;
          let dataSum = res.data.data.map((x) => x.freeTimePercentage);
          let data = dataSum.filter((item, index) => index <= 4) //5个
          let name = res.data.data.map((item) => item.stationName);
          const t = {
            formatter: (params) => {
              let str
              name.forEach(v => {
                str = v + ':' + params.name + ', ' + params.data
              })
              return name[params.dataIndex] + params.name + ', ' + params.data;
            }
          }
          console.log(date, data)
          let option = { id: 'avg1', name, x: date, y: [data], t }
          girdLineEchartOptions(option);
          let i = 5
          this.timer111 = setInterval(() => {
            data.shift()
            date.shift()
            data.push(dataSum[i])
            date.push(dateSum[i])
            i++
            girdLineEchartOptions(option);
            if (i >= dataSum.length) {
              i = 0
            }
          }, 1000)
        }
      });

      // top 5 接口
      list_in_storage_time({
        ...this.dianchiKey,
        rowNum: 7,
      }).then((res) => {
        if (res.data.success === true) {
          let date = res.data.data.map((x) => x.durationScope);
          let data = res.data.data.map((x) => x.num);

          let option = { id: 'bdc1', x: date, nameX: '分钟', y: [data], name: ['在库时长'] }
          girdLineEchartOptions(option);
        }
      });
      //  正常的
      list_in_storage_time({
        ...this.dianchiKey,
        rowNum: 7,
      }).then((res) => {
        if (res.data.success === true) {
          let date = res.data.data.list.map((x) => moment(x.dayDate).format('MM-DD'));
          let data = res.data.data.list.map((x) => x.duration);
          let option = { id: 'bdc3', x: date, y: [data], name: ['在库时长'] }
          this.unitOption = { ...this.unitOption, zaikuUnit: getUnitString(res.data.data.powerNum) }
          girdLineEchartOptions(option);
        }
      });

    },
    // testEcharts(x, name, y) {
    //   let option = {
    //     tooltip: {
    //       formatter: (params) => {
    //         let str
    //         name.forEach(v => {
    //           str = v + ':' + params.name + ', ' + params.data
    //         })
    //         return name[params.dataIndex] + params.name + ', ' + params.data;
    //       }
    //     },
    //     grid: {
    //       top: "15px",
    //       left: "45",
    //       right: "4%",
    //       bottom: "20",
    //       containLabel: false,
    //     },
    //     calculable: true,
    //     // grid:{top:'20%',bottom:'20%'},
    //     xAxis: {
    //       axisTick: {
    //         show: false, //去刻度线
    //       },
    //       type: "category",
    //       splitLine: {
    //         show: false,
    //       },
    //       data: x,
    //       nameTextStyle: {
    //         fontSize: 14,
    //       },
    //       axisLine: {
    //         lineStyle: {
    //           color: "#fff", // 颜色
    //         },
    //       },
    //       axisLabel: {
    //         //  interval: 0, //横轴信息全部显示
    //         fontSize: 12,
    //         textStyle: {
    //           fontSize: 12, // 让字体变大
    //         },
    //       },
    //     },
    //     yAxis: {
    //       name: name,
    //       max: 'dataMax',
    //       nameTextStyle: {
    //         color: "#fff"
    //       },
    //       // nameLocation :"center",
    //       splitNumber: 5, //y轴最大间隔
    //       axisTick: {
    //         show: false, //去刻度线
    //       },
    //       splitLine: {
    //         show: false,
    //       },
    //       axisLine: {
    //         lineStyle: {
    //           color: "#fff", // 颜色
    //         },
    //       },
    //       axisLabel: {
    //         //调整x轴的lable
    //         textStyle: {
    //           fontSize: 12, // 让字体变大
    //         },
    //         showMinLabel: true,
    //         showMaxLabel: true,
    //       },
    //     },
    //     series: {
    //       name: name,
    //       type: "line",
    //       data: y,
    //       symbol: "circle",
    //       symbolSize: 8,
    //       itemStyle: {
    //         normal: {
    //           color: '#18a5ee',
    //           shadowColor: '#3351da',
    //           shadowBlur: 10,
    //         },
    //       },
    //     }
    //   }
    // }
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
  height: 480px;
  box-sizing: border-box;
  margin-bottom: 15px;
}
.jywl {
  width: 400px;
  /*padding: 15px;*/
  height: 455px;
  box-sizing: border-box;
  position: relative;
}

.icon-car {
  width: 32px;
  height: 32px;
}

.nyhj {
  width: 320px;
  height: 345px;
  /*padding: 15px;*/
  margin-bottom: 15px;
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
  height: 433px;
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
  width: 90px;
  height: 47px;
  font-size: 14px;
  padding: 5px 6px;
  text-align: center;
  background: url("../../assets/img/bdc3.png") no-repeat;
  color: #ff0000;
  box-sizing: border-box;
}
.floor-info {
  position: absolute;
  left: -10px;
  bottom: 20px;
  width: 120px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  background: url("../../assets/img/cheshen_bg.png") no-repeat;
  background-size: 100% 100%;
}
.floor-info span {
  font-size: 14px;
  font-weight: bold;
  color: rgb(78, 196, 248);
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
  margin-bottom: 5px;
  padding: 5px 0;
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
  /* position: absolute; */
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
  text-align: center;
  font-size: 12px;
  color: #fff;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 0px;
  border-radius: 3px;
  display: inline-block;
}
.sbgltop span {
  font-size: 12px;
  color: #4ec4f8;
}
.sbgltable .chart-tit {
  font-size: 14px;
  margin-bottom: 0;
  position: relative;
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
  height: 53px;
  box-sizing: border-box;
  padding: 8px 0;
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
.car-point {
  position: absolute;
  width: 8px;
  height: 8px;
  top: -100px;
  left: -1000px;
  z-index: 888;
  background-color: yellow;
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

.car-point:after {
  background-color: #2ea598;
}

/* 设置动画后颜色 */
.car-point:before {
  background-color: rgba(0, 168, 253, 0.2);
}

/* @keyframes bounce-up {
  0% {
    margin-top: -16px;
     transform: scale(1);
  }
  25% {
    margin-top: -12px;
      transform: scale(1.25);
  }
  50% {
    margin-top: -20px;
     transform: scale(1.5)
  }
  75% {
    transform: -12px;
  }
  100% {
    margin-top: -16px;
     transform: scale(1)
  }
} */

/* .car-point .point {
  width: 16px;
  height: 16px;
  margin-left: -16px;
  display: inline-block;
  margin: 8px;
  background-color: #4ec4f8;

  justify-content: center;
  border-radius: 100%;


} */
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
</style>

<style lang='scss' >
.dccj-form .el-form--inline .el-form-item__label {
  float: none;
  display: inline-block;
  color: #fff;
}
.dc-body .el-input input {
  background: #566a87;
  color: #fff;
}
.dc-body .goog-te-spinner-pos {
  background: #566a87;
}

.el-select-dropdown__list {
  background: #566a87;
}

.el-select-dropdown__list li {
  background: #566a87;
  color: #fff;
  height: 24px;
}
.el-select-dropdown__item.hover {
  background-color: #566a87;
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
.ddjBox {
  display: flex;
  //   background-color: lime;
  .ddjBoxSon {
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 16px;
    justify-content: center;
  }
}
.car-point11 {
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
.guiJiSelect {
  position: relative;
  top: 10px;
}
.sumBox {
  width: 200px;
  height: 70px;
  position: absolute;
  right: -30px;
  display: flex;
  flex-wrap: wrap;
  span {
    width: 50%;
    height: 50%;
    text-align: left;
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 12px;
    font-weight: 400;
  }
}
.sumBox .el-button span {
  position: relative;
  left: 4px;
}
.el-popover .popper__arrow::after {
  border-top-color: #152940;
}
.zhineng_box11 .el-select-dropdown__item.hover {
  background-color: #fff;
  color: #000;
}
.zhineng_box11 .el-select-dropdown__item {
  display: flex;
  justify-content: center;
  align-items: center;
}
// .zhineng_box11 {
//   display: flex;
//   flex-direction: row;
//   justify-content: space-between;
// }
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
