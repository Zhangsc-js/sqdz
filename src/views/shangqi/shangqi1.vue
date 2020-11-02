<template>
  <div class="home zl-body">
    <div class="head-box">
      <headtit title="工厂智慧管理系统" :date="nowDate"></headtit>
    </div>
    <div class="flex-box">
      <div class="item-box" style="padding: 0 0 0 15px">
        <div class="chartbox znsc">
          <div class="zhineng_box">
            <div class="box-tit" style="width:160px">
              <img class="img" src="../../assets/img/data-icons/production.png" />
              <span>智能生产</span>
            </div>
            <div>
              <el-select
                v-model="searchModel"
                @change="searchModelChange($event)"
                placeholder="请选择"
                :popper-append-to-body="false"
                filterable
                ref="searchModelSelect"
                @blur="selectBlur"
              >
                <el-option
                  v-for="(item,index) in searchData"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </div>
            <!-- <el-button type="primary" style="margin-left:10px" @click="onSearch">搜索</el-button> -->
            <i class="el-icon-search iconStyle" @click="onSearch"></i>
          </div>

          <div class="chart-tit">
            <span>实时JPH</span>
          </div>
          <div class="chart-mininfo">
            <div class="item">
              <small>车身</small>
              <div>{{ jphList.CS }}</div>
            </div>
            <div class="item">
              <small>油漆</small>
              <div>{{ jphList.YQ }}</div>
            </div>
            <div class="item">
              <el-carousel
                class="el_carousel_fade"
                :interval="3000"
                height="50px"
                indicator-position="none"
                arrow="never"
              >
                <el-carousel-item>
                  <small>电池包</small>
                  <div>{{ jphList.DC1 }}</div>
                </el-carousel-item>
                <el-carousel-item>
                  <small>电池壳</small>
                  <div>{{ jphList.DC2 }}</div>
                </el-carousel-item>
              </el-carousel>
            </div>
            <div class="item">
              <small>总装</small>
              <div>{{ jphList.ZZ }}</div>
            </div>
          </div>
          <div class="chart-tit">
            <span>产量分析</span>
            <el-radio-group
              v-model="shxsModel"
              size="mini"
              style="margin-left:15px"
              fill="#152940"
              @change="changeSlxs"
            >
              <el-radio-button label="周"></el-radio-button>
              <el-radio-button label="日"></el-radio-button>
            </el-radio-group>
          </div>
          <div id="znsc5" style="width: 100%; height: 105px"></div>
          <div class="chart-tit">
            <span>产能分析</span>
            <el-radio-group
              v-model="cnfenxi"
              size="mini"
              style="margin-left:15px"
              fill="#152940"
              @change="changeCn"
            >
              <el-radio-button label="日"></el-radio-button>
              <el-radio-button label="小时"></el-radio-button>
            </el-radio-group>
          </div>

          <div id="znsc4" style="width: 100%; height: 105px"></div>
          <!-- <div class="top-chart" style="flex: 1">
            <div id="znsc1" class="chart" style="width: 140px; height: 100px"></div>
            <div id="znsc2" class="chart" style="width: 140px; height: 100px"></div>
          </div>-->
        </div>
        <div class="chartbox jywl">
          <div class="box-tit">
            <img class="img" src="../../assets/img/data-icons/logistics.png" />
            <span>精益物流</span>
          </div>

          <div class="info-num">
            <div class="item">
              <div class="txt">供应商</div>
              <div class="num">
                {{ obj1.supplierTotal }}
                <small>个</small>
              </div>
            </div>

            <div class="item">
              <div class="txt">零件种类</div>
              <div class="num">
                {{ obj1.sparePartTotal }}
                <small>种</small>
              </div>
            </div>

            <div class="item">
              <div class="txt">月度整车发运</div>
              <div class="num">
                {{ obj1.deliverCarTotal }}
                <small>辆</small>
              </div>
            </div>

            <div class="item">
              <div class="txt">零件国产化率</div>
              <div class="num">
                {{ obj1.localizationParts }}
                <small>%</small>
              </div>
            </div>

            <div class="item">
              <div class="txt">入厂卡车</div>
              <div class="num">
                <!-- {{ obj1.carInTotal }}
                <small>个</small>-->
                <small>在建</small>
              </div>
            </div>
            <div class="item">
              <div class="txt">出厂卡车</div>
              <div class="num">
                <!-- {{ obj1.carOutTotal }}
                <small>个</small>-->
                <small>在建</small>
              </div>
            </div>

            <!-- 无 -->
          </div>
          <div style="display: flex">
            <div style="width: 50%">
              <div id="jywl4" style="width: 100%; height: 100px"></div>
              <div class="chart-tit" style="text-align: center">
                <span>交货完成率</span>
              </div>
            </div>
            <div style="width: 50%">
              <div id="jywl5" style="width: 100%; height: 100px"></div>
              <div class="chart-tit" style="text-align: center">
                <span>库存覆盖天数</span>
              </div>
            </div>
          </div>
          <div style="display: flex;justify-content: space-around;margin: 15px 0px;">
            <div class="gys" style="cursor: pointer">
              <img
                style="display: block; margin: 10px auto"
                src="../../assets/img/data-icons/gys.png"
              />
              <small style="font-size: 16px">供应商管理</small>
              <div style="color:white;">在建</div>
            </div>

            <div class="gys">
              <img
                style="display: block; margin: 10px auto"
                src="../../assets/img/data-icons/gyl.png"
              />
              <small style="font-size: 16px">供应链管理</small>
              <div style="color:white;">在建</div>
            </div>
          </div>
        </div>
      </div>
      <div class="item-box" style="padding-top: 0">
        <div class="mainview" style="position: relative">
          <div class="top-info">
            <div class="item">
              <span class="txt">计划产量</span>
              <v-countup :start-value="0" :end-value="planNumsNum" class="num"></v-countup>
            </div>
            <div class="item">
              <span class="txt">实时产量</span>
              <v-countup :start-value="0" :end-value="realYielNum" class="num"></v-countup>
            </div>

            <div class="item">
              <span class="txt">完成率</span>
              <v-countup :start-value="0" :end-value="completeRateNum" class="num"></v-countup>
              <span
                v-if="completeRateNum !=0"
                style="font-size: 14px;font-weight: bold;color: #4ec4f8;"
              >%</span>
            </div>

            <div class="item">
              <span class="txt">DLZ</span>
              <v-countup :start-value="0" :end-value="dlzNum" class="num"></v-countup>
              <span style="font-size: 14px;font-weight: bold;color: #4ec4f8;">h</span>
            </div>

            <div class="item">
              <span class="txt">在岗人数</span>
              <!-- <v-countup :start-value="0" :end-value="dailyPeopleTotalNum" class="num"></v-countup> -->
              <span style="font-size: 14px; font-weight: bold; color: #4ec4f8">{{ "在建" }}</span>
            </div>

            <div class="item">
              <span class="txt">网络安全天数</span>
              <span style="font-size: 14px; font-weight: bold; color: #4ec4f8">{{ "在建" }}</span>
            </div>
            <div
              class="item"
              @click="anquan"
              style="cursor: pointer;  position: relative;z-index: 2;"
            >
              <span class="txt anquanTxt">安全</span>
              <div class="safeCircle" :style="{backgroundColor:getSafe?'lime':'red'}"></div>
            </div>
          </div>

          <div class="viewbox" style="margin-top: 20px; position: relative;height:740px">
            <div v-for="(item,index) in data1" :key="index">
              <div
                class="car-point"
                :style="{left:item.left,top:item.top}"
                v-show="item.flag"
                @mouseenter="item.flagBox=true"
                @mouseleave="item.flagBox=false"
              ></div>
              <div
                class="boxbox"
                :style="{left:item.leftBox,top:item.topBox}"
                v-show="item.flag && item.flagBox"
              >
                <div v-if="item.flag">故障产线:{{item.message.lineBody}}</div>
                <div v-if="item.flag">停机类型:{{item.message.downtimeType}}</div>
                <div v-if="item.flag">开始时间:{{item.message.startTime}}</div>
                <div v-if="item.flag">持续时间:{{item.message.duration}}分钟</div>
              </div>
            </div>
            <img
              class="img"
              src="../../assets/img/main-src-zl-2.png"
              style="
                width:93%;position: relative;left: 4.5%;"
              v-show="changeimg == 1"
              @click="changeimg = 2"
            />

            <img
              class="img"
              src="../../assets/images/main-2.png"
              v-show="changeimg == 2"
              style="
            width:93%;position: relative;left: 4.5%;"
              @click="changeimg = 1"
            />
            <el-popover
              placement="top"
              v-show="exhaustShow"
              v-for="item in feiQiPoint"
              :key="item.name"
              trigger="click"
            >
              <div>
                <div class="fsfq_point">
                  <p class="fsfq_title">{{item.name}}</p>
                  <el-row>
                    <el-col :span="12" class="fsfq_body">
                      <p class="fsfq_body_title">非甲烷总烃(mg/m³)</p>
                      <p>
                        标准值：
                        <span>30</span>
                      </p>
                      <p>
                        检测值：
                        <span>{{item.obj.jsCurrent || 0}}</span>
                      </p>
                    </el-col>
                    <el-col :span="12" class="fsfq_body">
                      <p class="fsfq_body_title">氮氧化物(mg/m³)</p>
                      <p>
                        标准值：
                        <span>150</span>
                      </p>
                      <p>
                        检测值：
                        <span>{{item.obj.dyCurrent || 0}}</span>
                      </p>
                    </el-col>
                  </el-row>
                </div>
              </div>
              <div slot="reference" class="feiqi_point" :style="{right:item.right,top:item.top,}">
                <img src="../../assets/img/feiqi_02.png" style="width:20px;height:20px;" />
              </div>
            </el-popover>

            <el-popover
              placement="top"
              v-show="wasteWaterShow"
              v-for="item in waterPoint"
              :key="item.name"
              trigger="click"
            >
              <div>
                <div class="fsfq_point">
                  <p class="fsfq_title">{{item.name}}</p>
                  <el-row>
                    <el-col :span="12" class="fsfq_body">
                      <p class="fsfq_body_title">PH</p>
                      <p>
                        目标值：
                        <span>6-9</span>
                      </p>
                      <p>
                        检测值：
                        <span>{{7.2}}</span>
                      </p>
                    </el-col>
                    <el-col :span="12" class="fsfq_body">
                      <p class="fsfq_body_title">COD</p>
                      <p>
                        目标值：
                        <span>500</span>
                      </p>
                      <p>
                        检测值：
                        <span>{{300}}</span>
                      </p>
                    </el-col>
                    <el-col :span="12" class="fsfq_body">
                      <p class="fsfq_body_title">氮氧</p>
                      <p>
                        目标值：
                        <span>45</span>
                      </p>
                      <p>
                        检测值：
                        <span>{{42}}</span>
                      </p>
                    </el-col>
                    <el-col :span="12" class="fsfq_body">
                      <p class="fsfq_body_title">总磷</p>
                      <p>在建</p>
                    </el-col>
                  </el-row>
                </div>
              </div>
              <div slot="reference" class="feiqi_point" :style="{right:item.right,top:item.top,}">
                <img src="../../assets/img/shuidi_02.png" style="width:15px;height:15px;" />
              </div>
            </el-popover>

            <el-popover placement="top" v-if="pointObjShow" trigger="click" :offset="0">
              <div @click="pointObjShow=false" v-show="pointObjShow">
                <div class="fsfq_point">
                  <!-- <p class="fsfq_title">{{item.name}}</p> -->
                  <el-row>
                    <el-col :span="24" class="fsfq_body">
                      <p>
                        所在点位:
                        <span>{{pointObj.label}}</span>
                      </p>
                      <p>
                        预计下线:
                        <span>{{pointObj.estimate}}</span>
                      </p>
                      <p>
                        车型:
                        <span>{{pointObj.carModel}}</span>
                      </p>
                      <p>
                        颜色:
                        <span>{{pointObj.carColor}}</span>
                      </p>
                    </el-col>
                  </el-row>
                </div>
              </div>
              <div
                slot="reference"
                class="feiqi_point"
                :style="{right:pointObj.right,top:pointObj.top}"
                v-show="pointObjShow"
              >
                <img src="../../assets/img/feiqi_05.png" style="width:15px;height:15px;" />
              </div>
            </el-popover>
          </div>
        </div>
        <div class="botview">
          <div class="chartbox zypz" style="margin-top:20px">
            <div class="box-tit">
              <img class="img" src="../../assets/img/data-icons/quality.png" />
              <span>卓越品质</span>
            </div>
            <div class="zypzboxs">
              <div class="item">
                <div class="chart-tit">
                  <span>国产化零件认可</span>
                </div>
                <div class="chart" id="zypz2"></div>
              </div>
              <div class="item">
                <div class="chart-tit">
                  <span>AUDIT</span>
                </div>
                <div class="chart" id="zypz3"></div>
              </div>
              <div class="item">
                <div class="chart-tit">
                  <span>一次通过率（%）</span>
                </div>
                <div class="chart" id="zypz4"></div>
              </div>
              <div class="item">
                <div class="chart-tit">
                  <span>过程审核</span>
                  <br />
                  <span style="color:white;">在建</span>
                </div>
              </div>
            </div>
          </div>
          <div class="chartbox sbgl" style="margin-top:20px">
            <div class="box-tit">
              <img class="img" src="../../assets/img/data-icons/dev.png" />
              <span>现场监控</span>
            </div>

            <div class="sbgl1">
              <div class="item" @click="onYqClick(1)">
                <!-- <video muted autoplay>
                  <source :src="otherVideo.youqi1" type="video/mp4" />您的浏览器不支持 video 标签。
                </video>-->
                <img :src="smallImg111" alt style="height:78px;width:132px" />
              </div>
              <div class="item" @click="onYqClick(2)">
                <!-- <video muted autoplay>
                  <source :src="otherVideo.youqi2" type="video/mp4" />您的浏览器不支持 video 标签。
                </video>-->
                <img :src="smallImg222" alt style="height:78px;width:132px" />
              </div>
              <div class="item" @click="imgTest('left')">
                <!-- <video muted autoplay="autoplay">
                  <source :src="otherVideo.cheshen1" type="video/mp4" />您的浏览器不支持 video 标签。
                </video>-->
                <img :src="smallImg333" alt style="height:78px;width:132px" />
              </div>
              <div class="item" @click="imgTest('right')">
                <!-- <video muted autoplay>
                  <source :src="otherVideo.cheshen2" type="video/mp4" />您的浏览器不支持 video 标签。
                </video>-->
                <img :src="smallImg444" alt style="height:78px;width:132px" />
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
          <div class="aq1" @click="clickshowFactory">
            <img
              style="display: block; margin: 10px auto"
              src="../../assets/img/data-icons/edit.png"
            />
            <small style="font-size: 16px">专家库</small>
          </div>

          <div class="aq1" @click="clickshowVideoTwo()" style="cursor: pointer">
            <img
              style="display: block; margin: 10px auto"
              src="../../assets/img/data-icons/design.png"
            />
            <small style="font-size: 16px">数字孪生</small>
          </div>
        </div>
        <div class="chartbox yj" style="position: relative; height: 250px">
          <div class="box-tit">
            <img class="img" src="../../assets/img/data-icons/safe.png" />
            <span>风险预警</span>
          </div>
          <div class="yj-box" style="margin-top: 15px">
            <div class="item1">
              <span
                v-for="(item, index) in warnNameArr"
                :key="index"
                :class="warningString.indexOf(item) > -1 ? 'err' : ''"
                @click="onClickWarn(item)"
                :style="'width:' + (item == '物流及时率' ? '48px' : '40px')"
              >{{ item }}</span>
            </div>
            <el-carousel
              v-if="warningObj.length"
              :interval="3000"
              height="200px"
              indicator-position="none"
              arrow="hover"
              class="el_carousel_fade"
            >
              <el-carousel-item v-for="(item,index) in warningObj" :key="index">
                <div class="tip">
                  <div>类型:{{ item.theType }}</div>
                  <div>位置:{{ item.shopName }}</div>
                  <div>时间:{{ item.thTime }}</div>
                  <div>建议:{{ item.desc }}</div>
                </div>
              </el-carousel-item>
            </el-carousel>
            <div class="tip" v-else>
              <div>类型:</div>
              <div>位置:</div>
              <div>时间:</div>
              <div>建议:</div>
            </div>
          </div>
        </div>
        <div class="chartbox nyhj" style="position: relative">
          <div class="box-tit">
            <img class="img" src="../../assets/img/data-icons/ene.png" />
            <span>能源环境</span>
          </div>

          <el-carousel
            class="el_carousel_fade"
            :interval="3000"
            height="170px"
            indicator-position="none"
            arrow="hover"
          >
            <el-carousel-item style="width: 100%; height: 170px;">
              <div>
                <div class="chart-tit" style="margin: 5px 0">
                  <span>总能耗（tce）</span>
                </div>
                <div class="nyhj-chart" style="margin-bottom: 5px">
                  <div class="chart" id="nyhj1" style="height: 140px; width: 200px"></div>
                  <div>
                    <div id="pointOneChart" style="width: 100px; height: 100px"></div>
                    <div style="color: #fff; text-align: center">总耗</div>
                  </div>
                </div>
              </div>
            </el-carousel-item>
            <el-carousel-item style="width: 100%; height: 170px;">
              <div style="width: 100%; height: 170px;">
                <div class="chart-tit" style="margin: 5px 0">
                  <span>单车能耗（tce）</span>
                </div>
                <div class="nyhj-chart" style="margin-bottom: 5px">
                  <div class="chart" id="nyhj2" style="height: 140px; width: 200px"></div>
                  <div>
                    <div id="pointOneChart1" style="width: 100px; height: 100px"></div>
                    <div style="color: #fff; text-align: center">单耗</div>
                  </div>
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
          <div class="chart-tit" style="margin-top: 10px">
            <span>能耗明细</span>
          </div>
          <div class="nyhj-chart" @click="changeSanjiShow">
            <div class="chart" id="sankey1" style="height: 180px"></div>
          </div>
          <div class="chart-tit" style="margin-top: 10px">
            <span>环境在线</span>
          </div>
          <div class="feishui-body">
            <div class="feishui_item" @click="clickFeiqi()">
              <img class="feishui_img" src="../../assets/img/feiqi_02.png" />
              <span class="feishui_title">废气</span>
            </div>
            <div class="feishui_item" @click="clickFeishui()">
              <img class="feishui_img" src="../../assets/img/shuidi_02.png" />
              <span class="feishui_title">废水</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="as-dialog-f" v-if="showVideoTwo" @click="showVideoTwo=false">
      <div class="as-dialog infotable-cs111" @click.stop="()=>{}">
        <div class="header" style="position: absolute; right: 20px; top: 20px">
          <i
            class="el-icon-close"
            style="color: #fff; font-size: 30px"
            @click="showVideoTwo = false"
          ></i>
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
            <span>数字孪生</span>
          </div>
          <div>
            <el-select
              placeholder="请选择"
              v-model="trajectoryVal"
              style="width: 120px;margin-left:20px"
              @change="onChangeAgvNum"
              :popper-append-to-body="false"
              class="szrs"
            >
              <el-option
                v-for="(item,index) in elOption"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div style="display: flex; flex-direction: row; margin: 20px 10px 0">
            <video width="400" height="260" autoplay loop v-if="fanzhenOptionShow" muted>
              <source :src="fanzhenOption" type="video/mp4" />您的浏览器不支持 video 标签。
            </video>
            <video width="400" height="260" autoplay loop v-if="fanzhenOptionShow" muted>
              <source :src="shijiOPtion" type="video/mp4" />您的浏览器不支持 video 标签。
            </video>
          </div>
        </div>
      </div>
    </div>
    <div class="as-dialog-f" v-if="showFactory" @click="showFactory=false">
      <div class="as-dialog" @click.stop="()=>{}">
        <div class="header" style="position: absolute; right: 20px; top: 20px">
          <i
            class="el-icon-close"
            style="color: #fff; font-size: 30px"
            @click="showFactory = false"
          ></i>
        </div>
        <div class="infotable-cs" style="overflow:auto;padding:20px 10px">
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
            <span>专家库</span>
          </div>

          <el-tabs class="tabtab" tab-position="top" style="height: calc(100% - 50px);" type="card">
            <el-tab-pane label="专家指导">
              <exportZhidao :fileList="fileList" :flieProps="flieProps"></exportZhidao>
            </el-tab-pane>
            <el-tab-pane label="工厂知识库">
              <div
                style="display: flex; flex-direction:column; margin: 10px 10px ;line-height:36px;align-items: center;"
              >
                <el-tree
                  :data="fileList"
                  :props="flieProps"
                  @node-click="handleNodeClick"
                  :render-content="renderContent"
                ></el-tree>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <sanjiDialog ref="sanjiDialog" title="能耗明细"></sanjiDialog>
    <div class="yinyingceng" @click="dialogClose" v-show="yqModal">
      <div class="as-dialog-big" v-show="yqModal" @click.stop="aa">
        <div class="header" style="position: absolute; right: 20px; top: 20px;">
          <i class="el-icon-close" style="color: #fff; font-size: 40px" @click="yqModal = false"></i>
        </div>
        <div class="infotable-cs-big" v-if="imgYqSrc">
          <img :src="imgYqSrc" alt />
        </div>
      </div>
    </div>
    <el-dialog title :visible.sync="anquanDialog" width="50%" append-to-body class="abc">
      <green-cross @anquan="anquan" :dayArr="dayArr" :requestOption="key"></green-cross>
    </el-dialog>
    <el-dialog title :visible.sync="imgDialog" class="bcd">
      <el-image :src="videoImg"></el-image>
    </el-dialog>
  </div>
</template>


<script>
import echarts from "echarts";
import headtit from "./headtit.vue";
import floatmenu from "./floatmenu.vue";
import sanjiDialog from '@/components/sanjiDialog';
import exportZhidao from './expertZhidao'
import {
  dailyPeopleTotal,
  safeDays,
  realYiel,
  internetSafe,
  qualityDlq,
  qualityAudit,
  capacityList,
  fiveWeekJPH,
  fiveHourJPH,
  supplierGrade,
  supplierTotal,
  sparePartTotal,
  deliverCarTotal,
  TSTAndPKG,
  localizationParts,
  realJPH,
  flow,
  planNums,
  completeRate,
  vehicleTracking,
  rate_dey,
  rate,
  getEP_FSSJ,
  getEP_ZTPF,
  dlz,
  jhwc,
  energyTotal,
  sankeyDiagram,
  oneCar,
  library,
  yearTceOneCar,
  yearTotal,
  domesticTrend,
  getProWarnInfo,
  YQ_image,
  overview_pin,
  rate_day,

} from "@/api/shangqi/zl";
//
import { machineHaltLogs } from "@/api/shangqi/device";
import moment from 'moment';
import { stackEchartOption, pointOneChartFun, sanKeyOption, girdEchartOption, girdLineEchartOptions, yuanEchartOption, banyuanEchartOption, areaLineEchart } from '@/utils/echartOption'
import { list_downtime_production_line, asrsImages, month_un_safety_production_day, capacityDaily, list_day_total_single_tce } from '@/api/abcd'
import data1 from './data1'
import greenCross from './greenCross'
import data from './data';


const playerOptions = {
  playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
  autoplay: false, //如果true,浏览器准备好时开始回放。
  muted: false, // 默认情况下将会消除任何音频。

  loop: false, // 导致视频一结束就重新开始。
  preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
  language: 'zh-CN',
  aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
  fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
  sources: [{
    type: "",
    src: 'https://www.w3school.com.cn/example/html5/mov_bbb.mp4'//url地址
    // src: "" //url地址
  }],
  pause: function () { },
  poster: "", //你的封面地址
  // width: document.documentElement.clientWidth,
  notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
  controlBar: {
    timeDivider: true,
    durationDisplay: true,
    remainingTimeDisplay: false,
    fullscreenToggle: true  //全屏按钮
  },
};

export default {
  name: "shangqi1",
  components: {
    headtit,
    floatmenu,
    sanjiDialog,
    greenCross,
    exportZhidao
  },
  data() {
    return {
      searchPopShow: true,
      WaterPointShow: false,
      timer: '',
      searchModel: '',
      smallImg222: '',
      imgtime1: null,
      showSelect: true,
      smallImg111: "",
      imgtime2: null,
      smallImg333: "",
      imgtime3: null,
      smallImg444: "",
      imgtime4: null,
      imgtime5: null,
      imgtime6: null,
      imgtime7: null,
      imgtime8: null,
      imgtime9: null,
      anquanDialog: false,
      videoImg: '',
      searchData: [],
      cnfenxi: '日',
      shxsModel: '周',
      getSafe: true,
      imgDialog: false,
      flieProps: {
        label: 'name',
        children: 'children',
      },

      fanzhenOptionShow: true,
      elOption: [
        { value: '冲压', name: '冲压' },
        { value: '车身', name: '车身' },
        { value: '油漆', name: '油漆' },
        { value: '总装', name: '总装' },
        { value: '电池', name: '电池' },
        { value: 'ASRS', name: 'ASRS' },
      ],
      trajectoryVal: '冲压',
      elVideoData: {
        '冲压': {
          fanzhen: 'http://172.21.13.88:8800/data_video/cy/DJI_0818-4X.mp4',
          //fanzhen:"../../assets/yq_mp4_1/01.mp4",
          shiji: 'http://172.21.13.88:8800/data_video/cy/r.mp4',
        },
        '车身': {
          fanzhen: 'http://172.21.13.88:8800/data_video/cs/C0007.MP4',
          // fanzhen:"../../assets/yq_mp4_1/02.mp4",
          shiji: 'http://172.21.13.88:8800/data_video/cs/r.mp4',
        },
        '总装': {
          fanzhen: 'http://172.21.13.88:8800/data_video/zz/DJI_0830.mp4',
          shiji: 'http://172.21.13.88:8800/data_video/zz/r.mp4',
        },
        '电池': {
          fanzhen: 'http://172.21.13.88:8800/data_video/dc/C0026.MP4',
          shiji: 'http://172.21.13.88:8800/data_video/dc/r.mp4',
        },
        '油漆': {
          fanzhen: 'http://172.21.13.88:8800/data_video/yq/C0033.MP4',
          shiji: 'http://172.21.13.88:8800/data_video/yq/r.mp4',
        },
        'ASRS': {
          fanzhen: 'http://172.21.13.88:8800/data_video/asrs/ASRS-02.mp4',
          shiji: 'http://172.21.13.88:8800/data_video/asrs/ASRS-01.MP4',
        }
      },

      otherVideo: {
        cheshen1: 'http://172.21.13.88:8800/data_video/data_Camera/asrs/01.mp4',
        cheshen2: 'http://172.21.13.88:8800/data_video/data_Camera/asrs/02.mp4',
        youqi1: 'http://172.21.13.88:8800/data_video/data_Camera/yq/01.mp4',
        youqi2: 'http://172.21.13.88:8800/data_video/data_Camera/yq/02.mp4',
      },

      // otherVideo: {
      //   cheshen1: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
      //   cheshen2: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
      //   youqi1: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
      //   youqi2: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
      // },

      carPoaition: "display: block;",
      carPoaitionBox: '',
      poaArr: {},

      // fanzhenOption:Object.assign({}, playerOptions) ,
      // shijiOPtion :Object.assign({}, playerOptions),
      shijiOPtion: 'http://172.21.13.88:8800/data_video/cy/DJI_0818-4X.mp4',
      fanzhenOption: 'http://172.21.13.88:8800/data_video/cy/r.mp4',
      //  fanzhenOption: '../../assets/yq_mp4_1/01.mp4',
      // shijiOPtion :Object.assign({}, playerOptions),
      cheshen1: Object.assign({}, playerOptions),
      cheshen2: Object.assign({}, playerOptions),
      youqi1: Object.assign({}, playerOptions),
      youqi2: Object.assign({}, playerOptions),
      start: 0,
      modalObj: {},
      value: "7820208313791",
      modalObjStyle: "",
      obj0: {},
      obj1: {},
      obj2: {},
      obj3: {},
      obj4: {},
      startObj: {},
      days: {},
      warningString: '',
      warningObj: [],
      jphList: {},
      pointObj: { show: false },
      pointObjShow: false,
      warnNameArr: ["生产", "设备", "质量", "物流", "能源"],
      showVideoTwo: false,
      showFactory: false,
      key: {
        workCode: 78,
        shopName: "ZZ",
      },
      fileList: [],
      nowDate: "",
      pointCenterLineArr: {
        M100: { right: "61.67%", top: "33.73%" },
        M150: { right: "68.67%", top: "30.73%" },
        M200: { right: "65.67%", top: "35.73%" },
        M250: { right: "75.67%", top: "28.73%" },
        M300: { right: "62.67%", top: "39.73%" },
        M400: { right: "58.67%", top: "45.73%" },
        M500: { right: "67.67%", top: "39.73%" },
        M600: { right: "60.67%", top: "48.73%" },
        Z700: { right: "68.67%", top: "41.73%" },
        Z900: { right: "65.67%", top: "49.73%" },
        R100: { right: "40.67%", top: "13.73%" },
        R200: { right: "45.67%", top: "12.73%" },
        R300: { right: "38.67%", top: "6.73%" },
        L500: { right: "29.67%", top: "17.73%" },
        L800: { right: "34.67%", top: "24.73%" },
        L900: { right: "38.67%", top: "35.73%" },
        M100: { right: "57.66%", top: "30.55%" },
        I100: { right: "38.67%", top: "26.73%" },
        K100: { right: "56.8%", top: "29.26%" },
        R500: { right: "29.67%", top: "41.73%" },
        L100: { right: "25.67%", top: "43.73%" },
        L200: { right: "15.67%", top: "40.73%" },
        "L300.1": { right: "15.67%", top: "39.73%" },
        "L300.2": { right: "8.67%", top: "26.73%" },
      },
      wasteWaterShow: false,
      exhaustShow: false,
      completeRateNum: 0,
      planNumsNum: 0,
      dailyPeopleTotalNum: 0,
      realYielNum: 0,
      internetSafeNum: 0,
      dlzNum: 0,
      changeimg: 2,
      fssjObj: [],
      ztpfObj: [],
      nyhjChart1: null,
      nyhjChart2: null,
      zypzChart3: null,
      pointOneChart1: null,
      pointOneChart: null,
      sankeyChart1: null,
      fileStr: "",
      sanKeyOption: [],
      imgYqSrc: "",
      yqModal: false,
      timerYq: null,
      dayArr: [],
      exhaustNames: ["", "一线电泳烘房P1", "一线电泳焙房P2", "二线电泳焙房P1", "二线电泳焙房P2", "一线预凝胶烘房P1", "一线预凝胶烘房P2", "一线喷漆和中间烘房", "二线喷漆和中间烘房", "三线喷漆和中间烘房", "一线面漆烘房", "二线面漆烘房", "三线面漆烘房"],
      exhaustName: { exhaustName: "" },
      kucunDay: 0,
      data1,

      feiQiPoint: [
        { name: "一线电泳烘房P1", obj: { jsCurrent: 0.117, dyCurrent: 31.236 }, key: '3', top: '33%', right: '12.5%', },
        { name: "一线电泳焙房P2", obj: { jsCurrent: 0.143, dyCurrent: 28.881 }, key: '2', top: '33.5%', right: '11.5%', },
        { name: "二线电泳焙房P1", obj: { jsCurrent: 1.461, dyCurrent: 13.368 }, key: '1', top: '34.3%', right: '10%', },
        { name: "二线电泳焙房P2", obj: { jsCurrent: 0.083, dyCurrent: 32.538 }, key: '6', top: '36%', right: '14.5%', },
        { name: "一线预凝胶烘房P1", obj: { jsCurrent: 0.108, dyCurrent: 1.764 }, key: '5', top: '36.5%', right: '13.5%', },
        { name: "一线预凝胶烘房P2", obj: { jsCurrent: 0.083, dyCurrent: 32.538 }, key: '4', top: '37.3%', right: '12%', },
        { name: "一线喷漆和中间烘房", obj: { jsCurrent: 0.005, dyCurrent: 33.634 }, key: '12', top: '38.5%', right: '24%', },
        { name: "二线喷漆和中间烘房", obj: { jsCurrent: 0.228, dyCurrent: 24.136 }, key: '11', top: '39.2%', right: '22.8%' },
        { name: "三线喷漆和中间烘房", obj: { jsCurrent: 0.096, dyCurrent: 19.232 }, key: '10', top: '40%', right: '21.5%' },
        { name: "一线面漆烘房", obj: { jsCurrent: 1.248, dyCurrent: 7.395 }, key: '9', top: '47%', right: '30.5%' },
        { name: "二线面漆烘房", obj: { jsCurrent: 2.733, dyCurrent: 7.037 }, key: '8', top: '48%', right: '29%' },
        { name: "三线面漆烘房", obj: { jsCurrent: 9.124, dyCurrent: 6.534 }, key: '7', top: '49%', right: '27%' },
      ],
      waterPoint: [
        { name: "工厂总排口", obj: {}, key: '3', top: '63%', right: '27%', },
        { name: "废水总排口", obj: {}, key: '3', top: '65%', right: '37%', },
      ]
    }

  },
  computed: {},

  mounted() {
    this.initData();
    // this.test()
    //();
  },
  beforeDestroy() {
    // 数字孪生与工厂知识库的弹窗展示
    // 数字孪生不展示，video销毁
    this.showVideoTwo = false;
    this.showFactory = false;
    clearInterval(this.timer)
    this.distoryTimer()
  },
  methods: {


    initData() {
      //请求数据
      this.getObjData();
      // 请求数据加载图0
      this.loadChart();
      this.getData();
      this.data1 = this.data1.map(item => {
        return {
          ...item,
          flag: false,
          flagBox: false,
          message: {}
        }
      })

      this.isSafe()
      this.smallImg1()
      this.smallImg2()
      this.smallImg3()
      this.smallImg4()
      //桑基图初始化
      // 初始化信息
      // 将 数据元绑定到数据上

      this.shijiOPtion = this.elVideoData['冲压'].shiji;
      this.fanzhenOption = this.elVideoData['冲压'].fanzhen;
      this.cheshen1 = { ... this.cheshen1, sources: [{ type: '', src: this.otherVideo.cheshen1 }] }
      this.cheshen2 = { ... this.cheshen1, sources: [{ type: '', src: this.otherVideo.cheshen2 }] }
      this.youqi1 = { ... this.cheshen1, sources: [{ type: '', src: this.otherVideo.youqi1 }] }
      this.youqi2 = { ... this.cheshen1, sources: [{ type: '', src: this.otherVideo.youqi2 }] }
    },
    changeSlxs() {

      if (this.shxsModel == '日') {
        capacityDaily().then(res => {
          if (res.data.success) {
            let data = []
            let date = res.data.data.map(x => x.theDate);

            date = Array.from(new Set(date));  //日期

            let type = res.data.data.map(x => x.kindZZ); //类型
            type = Array.from(new Set(type));

            date.forEach((item, index) => {
              let arr = res.data.data.filter(v => {
                return v.theDate == item
              })
              arr = arr.map(item => item.pdNums)
              data.push(arr)
            })  // 每天的情况
            let newType = type.map(e => e);
            date = date.map(item => {
              let arr = item.split('-')
              return arr[1] + '-' + arr[2]
            })
            let option = { id: 'znsc5', name: newType, x: date, y: data, legend: true }
            stackEchartOption(option);
          }
        })
      } else {
        //产量分析
        capacityList({ ...this.key }).then((res) => {
          if (res.data.success === true) {
            let data = []  //需要的数据  [1,2,3,4,5],[1,2,3,4,5]
            let date = res.data.data.map(x => x.WEEK);
            date = Array.from(new Set(date));

            let type = res.data.data.map(x => x.MODELL);
            type = Array.from(new Set(type));
            type.forEach((item, index) => {
              let arr = res.data.data.filter(v => {
                return v.MODELL == item
              })
              arr.sort((a, b) => {
                return a.WEEK = b.WEEK
              })
              arr = arr.map(item => item.TOTAL)
              data.push(arr)
            })  // 每天的情况
            let newType = type.map(e => e);
            date = date.map(x => x + '周');
            let option = { id: 'znsc5', name: newType, x: date, y: data, legend: true }
            stackEchartOption(option);
          }
        });
      }
    },
    selectBlur(e) {
      console.log(e.target.value)
      this.searchModel = e.target.value
    },
    test() {

      this.pointObj = { estimate: 0, right: "31.67%", top: "50.73%", label: 'Z900', factPoint: 'Z200', show: true }
      this.pointObjShow = true;
      return;

      let date = ['2020-01', '2020-02', '2020-03', '2020-04', '2020-05']
      let data = [0, 0, 0, 0, 0]

      let data1 = [100, 200, 300, 400, 200];

      let option = { max: 100, id: 'zypz4', name: ['DLQ'], x: date, y: [data], unit: "%", colors: [["#3BFFF9", "#3BFFF9", "#3BFFF9"]] };
      girdLineEchartOptions(option);


      let nyhj1option = { id: 'nyhj1', name: ['总耗'], x: date, y: [data1], colors: [["#00ffa7", "#00d3e4", "#00d3e4"]] }
      girdEchartOption(nyhj1option);

      let nyhj2option = { id: 'nyhj2', name: ['总耗'], x: date, y: [data1], colors: [["#00ffa7", "#00d3e4", "#00d3e4"]] }
      girdEchartOption(nyhj2option);

      var fileData = [{ "children": [{ "children": [{ "children": [], "name": "MEB项目联合厂房1-TG 史纪军【02~12】冲压车间压机地坑试模压机地坑-20181126.dwg", "url": "c:\\temp\\knowledge_lib\\冲压\\MEB项目联合厂房1-TG 史纪军【02~12】冲压车间压机地坑试模压机地坑-20181126.dwg" }, { "children": [], "name": "冲压车间MEB项目一期废料线布置图.dwg", "url": "c:\\temp\\knowledge_lib\\冲压\\冲压车间MEB项目一期废料线布置图.dwg" }], "name": "冲压", "url": "c:\\temp\\knowledge_lib\\冲压" }, { "children": [{}, { "children": [], "name": "00-VW MEB layout.dwg", "url": "c:\\temp\\knowledge_lib\\总装\\00-VW MEB layout.dwg" }, { "children": [], "name": "001-building 190106.dwg", "url": "c:\\temp\\knowledge_lib\\总装\\001-building 190106.dwg" }, { "children": [], "name": "002-TFA4A_WORKING STATION.dwg", "url": "c:\\temp\\knowledge_lib\\总装\\002-TFA4A_WORKING STATION.dwg" }, { "children": [], "name": "01-BA0 0218.dwg", "url": "c:\\temp\\knowledge_lib\\总装\\01-BA0 0218.dwg" }, { "children": [], "name": "02-BA12 0218.dwg", "url": "c:\\temp\\knowledge_lib\\总装\\02-BA12 0218.dwg" }, { "children": [], "name": "03-BA34_0320.dwg", "url": "c:\\temp\\knowledge_lib\\总装\\03-BA34_0320.dwg" }, { "children": [], "name": "04-BA12_BUFFER 0218.dwg", "url": "c:\\temp\\knowledge_lib\\总装\\04-BA12_BUFFER 0218.dwg" }, { "children": [], "name": "A+SUVe.ppt", "url": "c:\\temp\\knowledge_lib\\总装\\A+SUVe.ppt" }, { "children": [], "name": "MEB总装.pptx", "url": "c:\\temp\\knowledge_lib\\总装\\MEB总装.pptx" }], "name": "总装", "url": "c:\\temp\\knowledge_lib\\总装" }, { "children": [{}, { "children": [], "name": "C100-CA120P-00-L9-LACK-231_VDU_2019-08-26.pdf", "url": "c:\\temp\\knowledge_lib\\油漆\\C100-CA120P-00-L9-LACK-231_VDU_2019-08-26.pdf" }, { "children": [], "name": "C100-CA120P-DG-L9-LACK-231_VDU_2019-07-25.pdf", "url": "c:\\temp\\knowledge_lib\\油漆\\C100-CA120P-DG-L9-LACK-231_VDU_2019-07-25.pdf" }, { "children": [], "name": "C100-CA120P-E1-L9-LACK-231_VDU_2019-07-25.pdf", "url": "c:\\temp\\knowledge_lib\\油漆\\C100-CA120P-E1-L9-LACK-231_VDU_2019-07-25.pdf" }, { "children": [], "name": "C100-CA120P-EG-L9-LACK-231_VDU_2019-07-25.pdf", "url": "c:\\temp\\knowledge_lib\\油漆\\C100-CA120P-EG-L9-LACK-231_VDU_2019-07-25.pdf" }, { "children": [], "name": "C100-CA120P-H1-L9-LACK-231_VDU_2019-08-26.pdf", "url": "c:\\temp\\knowledge_lib\\油漆\\C100-CA120P-H1-L9-LACK-231_VDU_2019-08-26.pdf" }, { "children": [], "name": "C100-CA120P-HG-L9-LACK-231_VDU2019-07-26.pdf", "url": "c:\\temp\\knowledge_lib\\油漆\\C100-CA120P-HG-L9-LACK-231_VDU2019-07-26.pdf" }, { "children": [], "name": "DURR-SVW Paint Shop Overview Instruction.pdf", "url": "c:\\temp\\knowledge_lib\\油漆\\DURR-SVW Paint Shop Overview Instruction.pdf" }, { "children": [], "name": "MEB注蜡线平面图.dwg", "url": "c:\\temp\\knowledge_lib\\油漆\\MEB注蜡线平面图.dwg" }], "name": "油漆", "url": "c:\\temp\\knowledge_lib\\油漆" }, { "children": [{}, { "children": [], "name": "MEB Battery Deliver System Layout 20200803.dwg", "url": "c:\\temp\\knowledge_lib\\电池\\MEB Battery Deliver System Layout 20200803.dwg" }, { "children": [], "name": "MEB Battery Deliver System Layout 20200803.pdf", "url": "c:\\temp\\knowledge_lib\\电池\\MEB Battery Deliver System Layout 20200803.pdf" }, { "children": [], "name": "MEB布局20200306.dwg", "url": "c:\\temp\\knowledge_lib\\电池\\MEB布局20200306.dwg" }, { "children": [], "name": "文件内仅物流区准确 MEB布局1楼 .dwg", "url": "c:\\temp\\knowledge_lib\\电池\\文件内仅物流区准确 MEB布局1楼 .dwg" }, { "children": [], "name": "文件内仅物流区准确 MEB布局2楼.dwg", "url": "c:\\temp\\knowledge_lib\\电池\\文件内仅物流区准确 MEB布局2楼.dwg" }], "name": "电池", "url": "c:\\temp\\knowledge_lib\\电池" }, { "children": [{}, { "children": [], "name": "7800-00000-00-L9-MASTER-9879_1F_VAA-Default-000.pdf", "url": "c:\\temp\\knowledge_lib\\车身\\7800-00000-00-L9-MASTER-9879_1F_VAA-Default-000.pdf" }, { "children": [], "name": "7800-00000-00-L9-MASTER-9879_2F_VAA-Default-000.pdf", "url": "c:\\temp\\knowledge_lib\\车身\\7800-00000-00-L9-MASTER-9879_2F_VAA-Default-000.pdf" }, { "children": [], "name": "MEB Blocklayout Karosseriebau_V5_20200601.pdf", "url": "c:\\temp\\knowledge_lib\\车身\\MEB Blocklayout Karosseriebau_V5_20200601.pdf" }], "name": "车身", "url": "c:\\temp\\knowledge_lib\\车身" }], "name": "knowledge_lib", "url": "c:\\temp\\knowledge_lib" }]

      this.fileList = fileData;

      this.yuanEchartOption({ id: 'jywl5', value: 100, text: 500 });

      this.searchData = ['202010001001001', '202010001001002', '202010001001003', '202010001001004', '202010001001005']

      // let option ={id:'znsc5',name:['dc','dt','dy','df'],x:['11'+"周",'12','13','14'],
      //   y: [
      //     [1,2,4,5,],
      //     [2,4,6,8,],
      //     [10,2,3,6,],
      //     [8,2,5,9,]
      //   ],
      //   legend: true,
      // }
      // pointOneChartFun(10000,12000,'pointOneChart')

      // girdEchartOption(option);


      // this.warningObj = [
      //     {theType:'质量预警',shopName:'冲压',theTime:'2020-10-07',desc:'合格率过低'},
      //     {theType:'冲压预警',shopName:'冲压',theTime:'2020-10-07',desc:'合格率过低'},
      //     {theType:'生产预警',shopName:'冲压',theTime:'2020-10-07',desc:'合格率过低'},
      //     {theType:'时间预警',shopName:'冲压',theTime:'2020-10-07',desc:'合格率过低'},
      //     {theType:'建议预警',shopName:'冲压',theTime:'2020-10-07',desc:'合格率过低'},
      // ];
      // this.warningString ='质量生产设备';



      this.sanKeyOption =
        [
          { "source": "电力", "target": "电力-电泳设备2", "flow": 128.25 },
          { "source": "电力", "target": "电力-CC-室体2，漆雾分离", "flow": 0.00 },
          { "source": "电力", "target": "电力-敞开工位，照明，供排风 生产线1", "flow": 0.00 },
          { "source": "电力", "target": "电力-电泳设备1", "flow": 216.08 },
          { "source": "电力", "target": "电力-敞开工位，照明，供排风 生产线2", "flow": 0.00 },
          { "source": "电力", "target": "电力-敞开工位，照明，供排风 生产线3", "flow": 0.00 },
          { "source": "电力", "target": "电力-敞开工位，照明，供排风 生产线4", "flow": 0.00 },
          { "source": "空调水", "target": "空调水-电泳设备整流电源1", "flow": 36.13 },
          { "source": "空调水", "target": "空调水-电泳设备整流电源2", "flow": 3.77 },
          { "source": "电力", "target": "电力-漆雾分离通用设备1", "flow": 0.00 },
          { "source": "电力", "target": "电力-漆雾分离通用设备2", "flow": 0.00 },
          { "source": "电力", "target": "电力-电泳设备整流电源2", "flow": 0.20 },
          { "source": "电力", "target": "电力-漆雾分离通用设备3", "flow": 0.00 },
          { "source": "电力", "target": "电力-CC-室体3，漆雾分离", "flow": 0.00 },
          { "source": "电力", "target": "电力-BC-室体2和中间烘干炉，漆雾分离", "flow": 0.00 },
          { "source": "电力", "target": "电力-Schweller Applikation 2", "flow": 0.00 },
          { "source": "电力", "target": "电力-Schweller Applikation 3", "flow": 0.00 },
          { "source": "电力", "target": "电力-GAD innen L3", "flow": 0.00 },
          { "source": "电力", "target": "电力-GAD innen L2", "flow": 0.00 },
          { "source": "电力", "target": "电力-GAD innen L1", "flow": 0.00 },
          { "source": "电力", "target": "电力-前处理设备1", "flow": 97.46 },
          { "source": "电力", "target": "电力-前处理设备2", "flow": 50.77 },
          { "source": "电力", "target": "电力-PVC烘房2", "flow": 11.10 },
          { "source": "电力", "target": "电力-PVC烘房1", "flow": 41.07 },
          { "source": "压缩空气", "target": "压缩空气-电泳烘房 L2.1", "flow": 1.07 },
          { "source": "压缩空气", "target": "压缩空气-电泳烘房 L1.2", "flow": 2.42 },
          { "source": "压缩空气", "target": "压缩空气-电泳烘房 L1.1", "flow": 2.62 },
          { "source": "电力", "target": "电力-BC-室体1和中间烘干炉，漆雾分离", "flow": 0.00 },
          { "source": "电力", "target": "电力-面漆烘房L2", "flow": 14.16 },
          { "source": "电力", "target": "电力-电泳烘房 L1.1", "flow": 17.91 },
          { "source": "压缩空气", "target": "压缩空气-电泳烘房 L2.2", "flow": 1.26 },
          { "source": "电力", "target": "电力-面漆烘房L3", "flow": 26.79 },
          { "source": "电力", "target": "电力-电泳烘房 L2.1", "flow": 12.17 },
          { "source": "压缩空气", "target": "压缩空气-电泳设备整流电源2", "flow": 0.19 },
          { "source": "电力", "target": "电力-电泳烘房 L1.2", "flow": 18.12 },
          { "source": "电力", "target": "电力-电泳烘房 L2.2", "flow": 11.16 },
          { "source": "压缩空气", "target": "压缩空气-电泳设备整流电源1", "flow": 1.88 },
          { "source": "电力", "target": "电力-BC-室体3和中间烘干炉，漆雾分离", "flow": 0.00 },
          { "source": "电力", "target": "电力-废气处理 生产线2", "flow": 0.00 },
          { "source": "电力", "target": "电力-废气处理 生产线3", "flow": 0.00 },
          { "source": "电力", "target": "电力-CC-室体1，漆雾分离", "flow": 0.00 },
          { "source": "电力", "target": "电力-GAD UBS L2", "flow": 0.00 },
          { "source": "电力", "target": "电力-GAD UBS L1", "flow": 0.00 },
          { "source": "电力", "target": "电力-面漆烘房L1", "flow": 27.84 },
          { "source": "涂装车间", "target": "电力", "flow": 7930.843308500 },
          { "source": "涂装车间", "target": "工艺热水95℃", "flow": 0 },
          { "source": "涂装车间", "target": "空调水", "flow": 36.703377600 },
          { "source": "涂装车间", "target": "压缩空气", "flow": 0.233400000 },
          { "source": "涂装车间", "target": "中水", "flow": 0 },
          { "source": "涂装车间", "target": "自来水", "flow": 1.429378302 }
        ]



    },
    dialogClose() {
      this.yqModal = false
    },
    changeCn() {
      if (this.cnfenxi == '日') {
        fiveWeekJPH({}).then((res) => {
          if (res.data.success === true) {
            // this.jphList = res.data.data
            let date = res.data.data.map((x) => moment(x.theDate).format('MM-DD'));
            let data = res.data.data.map((x) => x.jph.toFixed(3));
            let option = { id: 'znsc4', name: ['产能'], x: date, y: [data] }
            girdEchartOption(option);
          }
        });
      } else {
        fiveHourJPH({}).then(res => {
          if (res.data.success) {
            // this.jphList = res.data.data
            let date = res.data.data.map((x) => x.theHour);
            let data = res.data.data.map((x) => x.jph.toFixed(3));
            let option = { id: 'znsc4', name: ['产能'], x: date, y: [data] }
            girdEchartOption(option);
          }
        })
      }
    },

    distoryTimer() {
      if (this.imgtime1) {
        clearInterval(this.imgtime1)
      }
      if (this.imgtime2) {
        clearInterval(this.imgtime2)
      }
      if (this.imgtime3) {
        clearInterval(this.imgtime3)
      }
      if (this.imgtime4) {
        clearInterval(this.imgtime4)
      }
      if (this.imgtime5) {
        clearInterval(this.imgtime5)
      }
      if (this.imgtime6) {
        clearInterval(this.imgtime6)
      }
      if (this.imgtime7) {
        clearInterval(this.imgtime7)
      }
      if (this.imgtime8) {
        clearInterval(this.imgtime8)
      }
      if (this.imgtime9) {
        clearInterval(this.imgtime9)
      }

    },

    clickFeishui() {
      this.wasteWaterShow = !this.wasteWaterShow;
    },
    clickFeiqi() {
      this.exhaustShow = !this.exhaustShow;
    },
    async getData() {
      let data = []
      let res1 = await list_downtime_production_line({ shopName: 'ZZ', workCode: "78" })
      if (res1.data.success && res1.data.data.length > 0) {
        let obj = this.data1.filter(item => item.name == 'ZZ')[0]
        obj.flag = true
        if (res1.data.data.length > 1) {
          let num = 1
          //   obj.message = res1.data.data[0]
          obj.message = {
            downtimeType: res1.data.data[0].downtimeType,
            startTime: res1.data.data[0].startTime,
            duration: res1.data.data[0].duration,
            lineBody: res1.data.data[0].lineBody
          }
          this.imgtime5 = setInterval(() => {
            obj.message = {
              downtimeType: res1.data.data[num].downtimeType,
              startTime: res1.data.data[num].startTime,
              duration: res1.data.data[num].duration,
              lineBody: res1.data.data[num].lineBody
            }
            num++
            if (num >= res1.data.data.length) {
              num = 0
            }
          }, 3000)
        } else {
          obj.message = {
            downtimeType: res1.data.data[0].downtimeType,
            startTime: res1.data.data[0].startTime,
            duration: res1.data.data[0].duration,
            lineBody: res1.data.data[0].lineBody
          }
        }
      }
      let res2 = await list_downtime_production_line({ shopName: 'CY', workCode: "78" })
      if (res2.data.success && res2.data.data.length > 0) {
        let obj = this.data1.filter(item => item.name == 'CY')[0]
        obj.flag = true
        if (res2.data.data.length > 1) {
          let num = 1
          obj.message = {
            downtimeType: res2.data.data[0].downtimeType,
            startTime: res2.data.data[0].startTime,
            duration: res2.data.data[0].duration,
            lineBody: res2.data.data[0].lineBody

          }
          this.imgtime6 = setInterval(() => {
            obj.message = {
              downtimeType: res2.data.data[num].downtimeType,
              startTime: res2.data.data[num].startTime,
              duration: res2.data.data[num].duration,
              lineBody: res2.data.data[num].lineBody

            }
            num++
            if (num >= res2.data.data.length) {
              num = 0
            }
          }, 3000)
        } else {
          obj.message = {
            downtimeType: res2.data.data[0].downtimeType,
            startTime: res2.data.data[0].startTime,
            duration: res2.data.data[0].duration,
            lineBody: res2.data.data[0].lineBody

          }
        }
      }
      let res3 = await list_downtime_production_line({ shopName: 'DC', workCode: "78" })
      if (res3.data.success && res3.data.data.length > 0) {
        let obj = this.data1.filter(item => item.name == 'DC')[0]
        obj.flag = true
        if (res3.data.data.length > 1) {
          let num = 1
          obj.message = {
            downtimeType: res3.data.data[0].downtimeType,
            startTime: res3.data.data[0].startTime,
            duration: res3.data.data[0].duration,
            lineBody: res3.data.data[0].lineBody

          }
          this.imgtime7 = setInterval(() => {
            obj.message = {
              downtimeType: res3.data.data[num].downtimeType,
              startTime: res3.data.data[num].startTime,
              duration: res3.data.data[num].duration,
              lineBody: res3.data.data[num].lineBody

            }
            num++
            if (num >= res3.data.data.length) {
              num = 0
            }
          }, 3000)
        } else {
          obj.message = {
            downtimeType: res3.data.data[0].downtimeType,
            startTime: res3.data.data[0].startTime,
            duration: res3.data.data[0].duration,
            lineBody: res3.data.data[0].lineBody

          }
        }
      }
      let res4 = await list_downtime_production_line({ shopName: 'YQ', workCode: "78" })
      if (res4.data.success && res4.data.data.length > 0) {
        let obj = this.data1.filter(item => item.name == 'YQ')[0]
        obj.flag = true
        if (res4.data.data.length > 1) {
          let num = 1
          obj.message = {
            downtimeType: res4.data.data[0].downtimeType,
            startTime: res4.data.data[0].startTime,
            duration: res4.data.data[0].duration,
            lineBody: res4.data.data[0].lineBody

          }
          this.imgtime8 = setInterval(() => {
            obj.message = {
              downtimeType: res4.data.data[num].downtimeType,
              startTime: res4.data.data[num].startTime,
              duration: res4.data.data[num].duration,
              lineBody: res4.data.data[num].lineBody

            }
            num++
            if (num >= res4.data.data.length) {
              num = 0
            }
          }, 3000)
        } else {
          obj.message = {
            downtimeType: res4.data.data[0].downtimeType,
            startTime: res4.data.data[0].startTime,
            duration: res4.data.data[0].duration,
            lineBody: res4.data.data[0].lineBody

          }
        }
      }
      let res5 = await list_downtime_production_line({ shopName: 'CS', workCode: "78" })
      if (res5.data.success && res5.data.data.length > 0) {
        let obj = this.data1.filter(item => item.name == 'CS')[0]
        obj.flag = true
        if (res5.data.data.length > 1) {
          let num = 1
          obj.message = {
            downtimeType: res5.data.data[0].downtimeType,
            startTime: res5.data.data[0].startTime,
            duration: res5.data.data[0].duration,
            lineBody: res5.data.data[0].lineBody

          }
          this.imgtime9 = setInterval(() => {
            obj.message = {
              downtimeType: res5.data.data[num].downtimeType,
              startTime: res5.data.data[num].startTime,
              duration: res5.data.data[num].duration,
              lineBody: res5.data.data[num].lineBody

            }
            num++
            if (num >= res5.data.data.length) {
              num = 0
            }
          }, 3000)
        } else {
          obj.message = {
            downtimeType: res5.data.data[0].downtimeType,
            startTime: res5.data.data[0].startTime,
            duration: res5.data.data[0].duration,
            lineBody: res5.data.data[0].lineBody

          }
        }
      }
    },
    imgTest(lr) {
      this.imgYqSrc = ''
      this.yqModal = true;
      clearInterval(this.timerYq);
      this.timerYq = setInterval(async () => {
        let res = await asrsImages(lr)
        if (res.data.success) {
          this.imgYqSrc = res.data.data
        }
      }, 1000)
    },
    async anquan(month) {
      if (!(typeof month == 'string' || typeof month == 'number')) {
        month = (new Date).getMonth() + 1
        month = month < 10 ? '0' + month : month
        let year = (new Date).getFullYear()
        month = year + '-' + month
      }
      this.anquanDialog = true
      let res = await month_un_safety_production_day({ ...this.key, month })
      if (res.data.success) {
        this.dayArr = res.data.data
      }
    },
    aa() { },
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


    changeMonth(value) {
      console.log(value);
    },

    searchModelChange(event) {
      this.onSearch();
      //  当选中位置后，还要进行去搜索
    },

    onSearch() {
      if (!this.searchModel) return this.$message.error('请选择或输入PIN码')
      vehicleTracking({ PIN: this.searchModel }).then((res) => {
        if (res.data.success === true) {
          let data = res.data.data;
          if (!data) {
            return this.$message.error('无此数据')
          }
          if (this.pointCenterLineArr[data.showPoint]) {

            let obj = {
              ...this.pointCenterLineArr[data.showPoint],
              label: data.factPoint,
              estimate: data.estimate,
              ...data,
            };
            this.pointObj = { ...obj, show: true };
            this.pointObjShow = true
          } else {
            this.pointObjShow = false
          }
        } else {
          this.pointObj = { label: '暂无数据', show: false };
          this.pointObjShow = false
          this.$message.error('无此数据')
        }
      });

    },

    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          {data.isFile === true ?
            <span>
              <span>{node.label}</span>
              <span>
                <el-button size="mini" type="text" on-click={() => { this.openPdf(node, data) }}>查看</el-button>
              </span>
            </span>
            : <span>{node.label}</span>
          }
        </span>);
    },
    handleNodeClick(data) {
      console.log(data)
    },
    openPdf(node, data) {
      console.log(node, data)
      data && window.open(data.url);
    },
    clickshowFactory() {
      this.showVideoTwo = false
      this.showFactory = true

    },
    clickshowVideoTwo() {
      this.showFactory = false;
      this.showVideoTwo = true;
    },

    onExhaustModel(ind) {
      this.exhaustName = { exhaustName: "" };
      this.$nextTick(() => {
        this.exhaustName = { ...this.exhaustName, exhaustName: this.exhaustNames[ind] };
      });
    },
    onYqClick(ind) {
      this.imgYqSrc = ''
      //   this.timerYq = null;
      this.yqModal = true;
      clearInterval(this.timerYq);
      this.getImg(ind)
      this.timerYq = setInterval(this.getImg(ind), 3000)
    },
    getImg(ind, data = {}) {

      return () => {
        // this.imgYqSrc = "";
        YQ_image().then(res => {

          if (res.data.success == true) {

            this.imgYqSrc = (res.data.data || {})['url' + ind] + '?t=' + new Date().getTime();
          }
        });
        //  this.imgYqSrc = data['url'+ind]+'?t='+new Date().getTime();
      }

    },
    smallImg1() {
      this.imgtime1 = setInterval(() => {
        YQ_image().then(res => {
          if (res.data.success == true) {
            this.smallImg111 = (res.data.data || {})['url' + 1] + '?t=' + new Date().getTime();
          }
        });
      }, 1000)
    },
    smallImg2() {
      YQ_image().then(res => {
        if (res.data.success == true) {
          this.smallImg222 = (res.data.data || {})['url' + 2] + '?t=' + new Date().getTime();
        }
      });
      this.imgtime2 = setInterval(() => {
        YQ_image().then(res => {
          if (res.data.success == true) {
            this.smallImg222 = (res.data.data || {})['url' + 2] + '?t=' + new Date().getTime();
          }
        });
      }, 3000)
    },
    smallImg3() {
      this.imgtime3 = setInterval(async () => {
        let res = await asrsImages('left')
        if (res.data.success) {
          this.smallImg333 = res.data.data
        }
      }, 1000)
    },
    smallImg4() {
      this.imgtime4 = setInterval(async () => {
        let res = await asrsImages('right')
        if (res.data.success) {
          this.smallImg444 = res.data.data
        }
      }, 1000)
    },
    onChangeAgvNum(val) {
      console.log(val);

      let option = this.elVideoData[val];
      // this.shijiOPtion = {...this.shijiOPtion,sources: [{type:"",src: option.shiji}]};
      // this.fanzhenOption = {...this.fanzhenOption,sources: [{type:"",src: option.fanzhen}]};
      this.shijiOPtion = option.shiji;
      this.fanzhenOption = option.fanzhen;
      this.fanzhenOptionShow = false;
      // this.fanzhenOptionShow = true;
    },

    changeSanjiShow() {
      // console.log(this.$refs,Object.keys(this.sanKeyOption));
      if (this.sanKeyOption.length) {
        this.$refs.sanjiDialog.showSankey(this.sanKeyOption);
      }

    },

    yuanEchartOption(f) {
      const yuanColor = ["#02d6fc", "#367bec"];
      const { id, value, colors = yuanColor, text = '' } = f;

      let chart = echarts.init(document.getElementById(id));
      let option = {
        title: {
          text: `${text}天`,
          x: "center",
          y: "center",
          textStyle: {
            fontWeight: "normal",
            color: "#fff",
            fontSize: "14",
          },
        },
        color: ["#282c40"],
        legend: {
          show: false,
          data: [],
        },
        series: [
          {
            name: "Line 1",
            type: "pie",
            clockWise: true,
            center: ["50%", "50%"],
            radius: ["70%", "80%"],
            itemStyle: {
              normal: {
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
              },
            },
            hoverAnimation: false,
            data: [
              {
                value: 100,
                name: "",
                itemStyle: {
                  normal: {
                    color: {
                      // 完成的圆环的颜色
                      colorStops: [
                        {
                          offset: 0,
                          color: colors[0], // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: colors[1], // 100% 处的颜色
                        },
                      ],
                    },
                    label: {
                      show: false,
                    },
                    labelLine: {
                      show: false,
                    },
                  },
                },
              },
              {
                name: "",
                value: 0,
              },
            ],
          },
        ],
      }
      chart.setOption(option);
    },

    onChangeAgvNum(val) {
      console.log(val);

      let option = this.elVideoData[val];
      // this.shijiOPtion = {...this.shijiOPtion,sources: [{type:"",src: option.shiji}]};
      // this.fanzhenOption = {...this.fanzhenOption,sources: [{type:"",src: option.fanzhen}]};
      this.shijiOPtion = option.shiji;
      this.fanzhenOption = option.fanzhen;
      this.fanzhenOptionShow = false;
      // this.fanzhenOptionShow = true;
    },

    onClickWarn(name) {
      let obj = this.warningObj.find((x) => x.type == name);
      this.warnObj = obj;
    },
    getObjData() {
      this.nowDate = moment().format('YYYY年MM月DD日');
      library().then(res => {
        if (res.data.success) {
          this.fileList = res.data.data;
        }
      }).catch(e => {

      });


      overview_pin({ ...this.key }).then(res => {
        //
        if (res.data.success === true) {
          this.searchData = res.data.data;
        }

      })
      rate_day().then(res => {
        if (res.data.success === true) {
          this.yuanEchartOption({ id: 'jywl5', value: 100, text: res.data.data });
        }

      })

      getEP_FSSJ({ ...this.key }).then((res) => {
        if (res.data.success === true) {
          this.fssjObj = res.data.data;
        }
      })
      getEP_ZTPF({ ...this.key }).then((res) => {
        if (res.data.success === true) {
          this.ztpfObj = res.data.data;
        }
      })
      planNums({ ...this.key }).then((res) => {
        if (res.data.success === true) {
          this.planNumsNum = res.data.data;
        }
      });
      completeRate({ ...this.key }).then((res) => {
        if (res.data.success === true) {
          this.startObjNum = { ...this.startObj, completeRate: res.data.data };
        }
      });
      dailyPeopleTotal({ ...this.key }).then((res) => {
        if (res.data.success === true) {
          this.dailyPeopleTotalNum = res.data.data;
        }
      });
      realYiel({}).then((res) => {
        if (res.data.success === true) {
          this.realYielNum = res.data.data;
        }
      });
      internetSafe({ ...this.key }).then((res) => {
        if (res.data.success === true) {
          this.internetSafeNum = res.data.data;
        }
      });
      safeDays({ ...this.key }).then((res) => {
        if (res.data.success === true) {
          this.days = { ...res.data.data };
        }
      });
      getProWarnInfo({ ...this.key }).then((res) => {
        if (res.data.success === true) {
          let data = res.data.data;
          this.warningObj = data;
          var jsonArr = data.map(e => e.theType);
          this.warningString = jsonArr.join('');
          // 风险预警的处理

        }
      });
      dlz({ ...this.key }).then((res) => {
        if (res.data.success === true) {
          this.dlzNum = res.data.data;
        }
      });
      supplierTotal({ ...this.key }).then((res) => {
        if (res.data.success === true) {
          this.obj1 = { ...this.obj1, supplierTotal: res.data.data };
        }
      });
      sparePartTotal({ ...this.key }).then((res) => {
        if (res.data.success === true) {
          this.obj1 = { ...this.obj1, sparePartTotal: res.data.data };
        }
      });
      deliverCarTotal({ ...this.key }).then((res) => {
        if (res.data.success === true) {
          this.obj1 = { ...this.obj1, deliverCarTotal: res.data.data };
        }
      });
      localizationParts({ ...this.key }).then((res) => {
        if (res.data.success === true) {
          this.obj1 = { ...this.obj1, localizationParts: res.data.data };
        }
      });
      flow({ ...this.key }).then((res) => {
        if (res.data.success === true) {
          this.obj1 = { ...this.obj1, ...res.data.data };
        }
      });
      list_day_total_single_tce({ isSingle: 0, rowNum: 7 }).then((res) => {
        if (res.data.success) {
          // debugger

          let data = res.data.data.map((x) => x.tec && x.tec.toFixed(0));
          let date = res.data.data.map((x) => moment(x.date).format('MM-DD'));
          let option = { id: 'nyhj1', name: ['总能耗'], x: date, y: [data], colors: [["#00ffa7", "#00d3e4", "#00d3e4"]] }
          girdEchartOption(option);

        }
      });
      sankeyDiagram({ ...this.key }).then((res) => {
        if (res.data.success === true) {
          sanKeyOption({ id: 'sankey1', f: res.data.data, fontSize: 12 });
          this.sanKeyOption = res.data.data;
        }
      });
      fiveWeekJPH({}).then((res) => {
        if (res.data.success === true) {
          // this.jphList = res.data.data
          let date = res.data.data.map((x) => moment(x.theDate).format('MM-DD'));
          let data = res.data.data.map((x) => x.jph.toFixed(3));
          let option = { id: 'znsc4', name: ['产能'], x: date, y: [data] }
          girdEchartOption(option);

        }
      });
      realJPH({ ...this.key }).then((res) => {
        if (res.data.success === true) {
          this.jphList = res.data.data;
        }
      });
      // TSTAndPKG({ ...this.key }).then((res) => {
      //   if (res.data.success === true) {
      //     // this.obj0 = {...res.data.data}
      //     let data = res.data.data;
      //     //data.TST
      //     let znsc1Option = { id: 'znsc1', name: 'TST', value: 92.3 };
      //     banyuanEchartOption(znsc1Option);
      //     let znsc2Option = { id: 'znsc2', name: 'PKG', value: 82.1 };
      //     banyuanEchartOption(znsc2Option);

      //   }
      // });
      yearTceOneCar({ ...this.key }).then((res) => {
        if (res.data.success === true) {
          // this.obj0 = {...res.data.data}
          let data = res.data.data || {};
          let tce = data.tce;
          pointOneChartFun(tce, 3.2, 'pointOneChart1')
        }
      });
      yearTceOneCar({ isSingle: 0, rowNum: 7 }).then((res) => {
        if (res.data.success === true) {
          // this.obj0 = {...res.data.data}
          let data = res.data.data || {};
          let tce = data.tce;
          pointOneChartFun(tce, 23000, 'pointOneChart')
        }
      });
    },
    loadChart() {
      qualityAudit({ ...this.key }).then((res) => {
        if (res.data.success === true) {
          let date = res.data.data.map((x) => moment(x.theDate).format('MM-DD'));
          let data = res.data.data.map((x) => x.audit);
          let option = { id: 'zypz3', name: ['AUDIT'], x: date, y: [data], colors: [["#3BFFF9", "#3BFFF9", "#3BFFF9"]] };
          girdLineEchartOptions(option);

        }
      });
      qualityDlq({ ...this.key, workCode: "78" }).then((res) => {
        if (res.data.success === true) {
          let date = res.data.data.map((x) => moment(x.theDate).format('MM-DD'));
          let data = res.data.data.map((x) => x.pecRate);
          let option = { id: 'zypz4', max: 100, name: ['DLQ'], x: date, y: [data], unit: "%", colors: [["#3BFFF9", "#3BFFF9", "#3BFFF9"]] };
          girdLineEchartOptions(option);
        }
      });

      // 国产化零件

      domesticTrend({}).then((res) => {
        if (res.data.success === true) {
          var dataArr = [];
          var AArr = [];
          var BArr = [];
          var CArr = [];
          res.data.data.forEach(e => {
            dataArr.push(e.theMonth);
            AArr.push(e['待整改'] ? e['待整改'] : 0);
            BArr.push(e['合格'] ? e['合格'] : 0);

          })
          let option = { id: 'zypz2', name: ['待整改', '合格'], legend: true, x: dataArr, y: [AArr, BArr], colors: [["#c9ca22", "#02a29b", "#c9ca22",], ["#c3aa22", "#052b3c", "#c9ca22"], ["#c95f22", "#02339b", "#c9ca22",]] };
          girdEchartOption(option);
        }
      })
      //产量分析
      capacityList({ ...this.key }).then((res) => {
        if (res.data.success === true) {
          let data = []  //需要的数据  [1,2,3,4,5],[1,2,3,4,5]
          let date = res.data.data.map(x => x.WEEK);
          date = Array.from(new Set(date));

          let type = res.data.data.map(x => x.MODELL);
          type = Array.from(new Set(type));
          type.forEach((item, index) => {
            let arr = res.data.data.filter(v => {
              return v.MODELL == item
            })
            arr.sort((a, b) => {
              return a.WEEK = b.WEEK
            })
            arr = arr.map(item => item.TOTAL)
            data.push(arr)
          })  // 每天的情况
          console.log('data', data)
          let newType = type.map(e => e);
          date = date.map(x => x + '周');
          let option = { id: 'znsc5', name: newType, x: date, y: data, legend: true }
          stackEchartOption(option);
        }
      });
      // rate_dey({ ...this.key }).then((res) => {
      //   if (res.data.success === true) {
      //     let data = res.data.data;
      //     let option = { id: 'jywl3', value: data };
      //     yuanEchartOption(option);

      //   }
      // });
      jhwc({ ...this.key }).then((res) => {
        if (res.data.success === true) {
          let data = res.data.data;
          let option = { id: 'jywl4', value: data };
          yuanEchartOption(option);
        }
      });
      list_day_total_single_tce({ isSingle: 1, rowNum: 7 }).then((res) => {
        if (res.data.success === true) {
          // let data1 = res.data.data.map(x=>x.output)
          // this.jywl5(data);
          let data = res.data.data.map((x) => x.tec && x.tec.toFixed(0));
          let date = res.data.data.map((x) => moment(x.date).format('MM-DD'));
          let option = { id: 'nyhj2', name: ['单车能耗'], x: date, y: [data], colors: [["#00ffa7", "#00d3e4", "#00d3e4"]] }
          girdEchartOption(option);
        }
      });
    },
    onFixFun() {
      console.log(111); this.pointObjShow = false
    },
  },
  watch: {
    fanzhenOption() {
      this.$nextTick(() => {
        this.fanzhenOptionShow = true
      })
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->


<style>
.el-popover {
  border: none;
  height: auto;
  background-color: #152940;
  box-shadow: none;
}

.el-popover .popper__arrow::after {
  border-top-color: #152940;
}

.zhineng_box .el-select-dropdown__item.hover {
  background-color: #fff;
  color: #000;
}
.zhineng_box .el-select .el-select-dropdown {
  background-color: #152940;
  border: 1px solid #4ec4f8;
  color: #fff;
}
.zhineng_box .el-select li {
  display: flex;
  align-items: center;
  justify-content: center;
}
.zhineng_box .el-select-dropdown__item {
  color: #ccc;
}

.vue-fullcalendar_red {
  color: red;
  background: red;
}
</style>

<style scoped>
.gys {
  width: 112px;
  height: 112px;
  padding: 10px 0;
  text-align: center;
  background: url("../../assets/img/info.png") no-repeat;
  background-size: cover;
  color: #a9ddee;
  box-sizing: border-box;
}

.gys img {
  width: 40px;
  height: 40px;
}

.zhineng_box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.handModal {
  position: absolute;
  left: -400px;

  bottom: -200px;
  width: 200px;
  height: 120px;
  background: rgba(0, 0, 0, 0.5);
  transition: all 0.5s;
  z-index: 99;
  text-align: center;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  opacity: 0;
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
  font-size: 14px;
  margin: 5px;
}
.info-num {
  margin-top: 10px;
  display: flex;
  text-align: center;
  justify-content: space-around;
  flex-wrap: wrap;
}
.info-num .item {
  width: 136px;
  height: 55px;
  margin-bottom: 10px;
  line-height: 25px;
  background: url("../../assets/img/shangqi1-1.png") no-repeat;
}
.info-num .item .txt {
  font-size: 12px;
  color: #a9ddee;
}
.info-num .item .num {
  font-size: 18px;
  color: #4ec4f8;
}
.info-num .item .num small {
  font-size: 12px;
}
/* znsc */
.znsc {
  width: 320px;
  /*padding: 15px;*/
  height: 430px;
  box-sizing: border-box;
  margin-bottom: 15px;
}
.jywl {
  width: 320px;
  /*padding: 15px;*/
  height: 505px;
  box-sizing: border-box;
}

.nyhj {
  width: 320px;
  height: 530px;
  /*padding: 15px;*/
  box-sizing: border-box;
}
.chart-mininfo {
  display: flex;
  flex-direction: row;
  color: #ffffff;
  text-align: center;
}
.chart-mininfo .item {
  /* width: 25%;
  text-align: left; */

  background: url("../../assets/img/btnbg.png") no-repeat;
  background-size: 100% 100%;
  /* width: 85px; */
  height: 53px;
  box-sizing: border-box;
  padding: 3px 0px;
  margin: 0px 3px;
  margin-bottom: 10px;

  flex: 1;
}
.chart-mininfo .item span:first-child {
  font-size: 12px;
  color: #fff;
}
.chart-mininfo .item span:last-child {
  font-size: 12px;
  color: #4ec4f8;
}
.top-chart {
  display: flex;
}

.top-chart .chart {
  flex: 1;
}

.yj {
  width: 320px;
  /*padding: 15px;*/
  box-sizing: border-box;
  margin-bottom: 15px;
}
.yj .item1,
.yj .item2 {
  display: flex;
  font-size: 12px;
  justify-content: space-around;
  margin-bottom: 15px;
  flex-wrap: wrap;
}
.yj .item1 span {
  display: flex;
  align-items: center;

  box-sizing: border-box;
  justify-content: center;
  height: 43px;
  width: 42px;
  color: #fff;
  padding: 0 5px;
  color: #fff;
  margin-bottom: 5px;
  background: url("../../assets/img/shangqi1-3.png") no-repeat;
  background-position: center;
  background-size: 100% 100%;
}
.yj .item1 span.err {
  color: #ff0000;
}
.yj .item2 span {
  display: flex;
  align-items: center;
  padding: 0 15px;
  box-sizing: border-box;
  justify-content: center;
  width: 136px;
  height: 43px;
  color: #fff;
  background: url("../../assets/img/shangqi1-5.png") no-repeat;
}
.yj .tip {
  border-radius: 3px;
  background: #152940;
  line-height: 15px;
  padding: 5px 5px;
  font-size: 0;
  color: #fff;
  line-height: 26px;
}
.yj .tip div {
  display: block;
  font-size: 12px;
  margin-right: 8px;
  color: #fff;
  padding-left: 20px;
}
/* 废气 */

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
  height: 130px;
  /*padding: 15px;*/
  box-sizing: border-box;
  margin-bottom: 15px;
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
  width: 50%;
  position: relative;
  font-size: 12px;
  color: #fff;
  text-align: center;
  float: left;
}
.bdc-mid .state .ddj .chart-tit {
  text-align: center;
}
.bdc-mid .state .ddj .green {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin: 0 auto 2px auto;
  background: #00ff57;
}

.bdc-mid .state .ddj .yellow {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin: 2px auto 2px auto;
  background: #f8ff45;
}

.bdc-mid .state .ddj .red {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin: 0 auto 15px auto;
  background: #ff0000;
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
  margin-top: 15px;
}

.bdc-bot .tip-error {
  display: inline-block;
  width: 63px;
  height: 47px;
  padding: 5px 6px;
  text-align: center;
  background: url("../../assets/img/bdc3.png") no-repeat;
  color: #ff0000;
  box-sizing: border-box;
}
.envinfo {
  position: absolute;
  left: 10px;
  top: 50px;
}
.safeinfo {
  position: absolute;
  right: 10px;
  top: 50px;
}
.dotted-top-info {
  position: absolute;
  right: 100px;
  top: 150px;
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
.nyhj-chart {
  display: flex;
}
.nyhj-chart .chart {
  flex: 1;
  width: 100%;
}
.nyhj-chart img {
  width: 76px;
  padding: 25px 15px 0 15px;
}
.mainview {
  width: 1200px;
  height: 700px;
  box-sizing: border-box;
}
.viewbox .tit {
  position: absolute;
  left: 150px;
  top: 300px;
  width: 133px;
  font-size: 20px;
  font-weight: 600;
  color: #4ec4f8;
  height: 55px;
  padding: 5px 0 0 45px;
  box-sizing: border-box;
  text-align: left;
  background: url("../../assets/img/shangqi1-7.png") no-repeat;
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
  left: 377px;
  top: 188px;
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

.viewbox .point {
  position: absolute;
  margin-top: -72px;
  height: 80px;
  width: 140px;
  display: flex;
  flex-direction: column;
}
.viewbox .point .point-span1 {
  margin-left: -65px;
  width: 150px;
  height: 50px;
  line-height: 25px;
  text-align: center;
  border-radius: 5px;
  color: #fff;
  /* animation: ju; */
  justify-content: center;
  /* animation: mycircle 1s alternate infinite; */
}
.viewbox .point .point-span2 {
  width: 32px;
  height: 32px;
  margin-left: -16px;
  /* border: 1px solid red; */
  justify-content: center;
  border-radius: 100%;

  /* animation: mycircle 2s alternate infinite;  */
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
.btninfo {
  position: absolute;
  left: 0px;
  bottom: 10px;
  color: #fff;
  font-size: 12px;
  text-align: center;
}
.btninfo .item img {
  border: 2px solid #003b77;
  padding: 10px;
}
.botview {
  display: flex;
}

.botview .zypz {
  width: 870px;
  height: 230px;
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
  width: 25%;
  height: 165px;
  margin-top: 10px;
}

.zypzboxs .chart {
  width: 100%;
  height: calc(100% - 30px);
}

.botview .sbgl {
  position: relative;
  width: 310px;
  height: 230px;
  /*padding: 15px;*/
  box-sizing: border-box;
  overflow: hidden;
}
.sbgl-link {
  position: absolute;
  top: 0px;
  right: 0px;
  border: 1px solid #4ec4f8;
  border-radius: 5px;
  padding: 3px 10px;
  color: #4ec4f8;
  font-size: 12px;
}
.sbgl1 {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  flex: 1;
  margin-top: 10px;
}

.sbgl1 .item {
  margin: 3px;
}

.sbgl1 .item video {
  object-fit: fill;
  width: 132px;
  height: 78px;
}
.model-item {
  color: #4ec4f8;
}
.infotable-cs {
  height: 100%;
  background-color: #566a87;
  border: 1px solid #566a87;
  border-radius: 10px;
}

.as-dialog {
  position: absolute;
  background-color: #566a87;
  top: 50%;
  left: 50%;
  height: 70%;
  width: 70%;
  transform: translate(-50%, -50%);
  z-index: 99;
}
</style>
<style >
/* .el-popover {
  background-color: #003b77;
  box-shadow: 0 0 1vw #00c1de;
  height: 120px;
} */
.flex-box .right-box .carbox .carview {
  position: absolute;
  right: 20px;
  top: 0px;
  width: 925px;
  height: 464px;
}
.carview .search,
.carview .state {
  left: 0px;
  top: 0px;
  margin-bottom: 10px;
  line-height: 40px;
  border: 1px solid rgba(11, 84, 113, 0.5);
  padding: 0 15px;
  border-radius: 5px;
}
.carview .state {
  top: 60px;
  color: #fff;
}
.carview .search .txt {
  position: absolute;
  left: 15px;
  top: 0px;
  color: #fff;
}
.carview .search img {
  position: absolute;
  right: 10px;
  top: 7px;
  cursor: pointer;
}
.carview .search input {
  border: none;
  background: none;
  outline: none;
  color: #fff;
  height: 40px;
  padding: 0 40px;
}

.blue-arror {
  position: relative;
  width: 0;
  height: 0;
  border-width: 40px 0 0 40px;
  border-style: solid;
  border-color: transparent transparent blue;
}

.blue-arror:after {
  content: "";
  width: 0;
  height: 0;
  position: absolute;
  top: 0px;
  left: 0px;
  border-width: 0 40px 40px;
  border-style: solid;
  border-color: transparent transparent yellow;
}

.wasteWater {
  position: absolute;
  top: 40%;
  left: 62%;
  height: 220px;
  width: 200px;
  text-align: center;
}

.wasteWater .blue {
  width: 16px;
  height: 16px;
  border-radius: 100%;
  /* background-color: #4ec4f8; */
  position: absolute;
  right: -4%;
  bottom: 13%;
  background: url("../../assets/img/job-point.png") no-repeat;
  background-size: 100%;
}
.wasteWater .blue:nth-child(2) {
  position: absolute;
  left: 23%;
  top: 55%;
}
/* .wasteWater .blue:nth-child(3){
    position: absolute;
    top: 35%;
    left: 73%;
  } */
.wasteWater .blue:nth-child(4) {
  position: absolute;
  bottom: 10%;
  right: -8%;
}
.wasteWater .blue:last-child {
  position: absolute;
  left: 40%;
  bottom: 1%;
}
/* .model-exhault{
    position: absolute;
    top:0;left:10%;
    background-color: rgba(11,84,113,0.5);
    color: #fff;
     height: 100px;
    width: 200px;
    justify-content: center;
    line-height: 30px;
    display: flex;
    align-items: center;
  } */
.btn-info-bottom {
  display: flex;
  flex-direction: row;
}
.btn-info-bottom .item {
  flex-direction: row;
  display: flex;
  color: #fff;
  line-height: 30px;
  flex: 1;
  text-align: center;
}
.btn-info-bottom .item small {
  display: flex;
  flex-direction: row;
  line-height: 30px;
}
.btn-info-bottom .item img {
  width: 20px;
  height: 20px;
  margin: 5px;
  display: inline-block;
}

.name-info {
  position: absolute;

  z-index: 2;
}
.name1 {
  top: 10%;
  right: 10%;
  width: 200px;
}
.name-info .dotted {
  position: absolute;
  z-index: 9;
  left: 0;
  top: 0;
}
.name-info .dotted img {
  width: 24px;
  height: 24px;
}
.box-name {
  position: absolute;
  z-index: 9;
  top: 6%;
  right: 6%;
  width: 120px;
  height: 24px;
  text-indent: 20px;
  background-position: center;
  background-size: 100%;
  background: url("../../assets/images/bg-cj-name.png");
}
</style>
<style >
.dccj-form .el-form--inline .el-form-item__label {
  float: none;
  display: inline-block;
  color: #fff;
}

.file-name > .child {
  padding-left: 20px;
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
  z-index: 2;
}
.infotable-cs-big {
  width: 100%;
  height: 100%;
}
.infotable-cs-big img {
  width: 100%;
  height: 100%;
}

.feishui-body {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

.feishui-body .feishui_item {
  width: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.feishui-body .feishui_item .feishui_img {
  width: 40px;
  height: 40px;
}

.feishui-body .feishui_item .feishui_title {
  font-size: 16px;
  color: white;
  text-align: center;
}
.infotable-cs111 {
  width: 822px !important;
  height: 370px !important;
}
.as-dialog-f {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.iconStyle {
  font-size: 12px;
  margin-left: 10px;
  color: #fff;
  display: flex;
  align-items: center;
  cursor: pointer;
}
</style>


<style lang='scss'>
.el-tree {
  background: none;
  color: white;
}
.el-tree-node__expand-icon {
  color: white !important;
}
.el-tree-node:focus > .el-tree-node__content {
  background-color: #66b1ff87 !important;
}
.el-tree-node__content:hover {
  background-color: #66b1ff87 !important;
}
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #66b1ff87 !important;
}

.car-point {
  position: absolute;
  width: 12px;
  height: 12px;
  top: 15%;
  left: 45%;
  z-index: 2;
  background-color: red;
  /* animation: bounce-up 2s linear infinite;  */
  border-radius: 50%;
  animation: warn 1s ease-out 0s infinite;
}
.boxbox {
  position: absolute;
  top: 13%;
  left: 47%;
  z-index: 2;
  color: #fff;
  padding: 10px;
  transform: translateY(-50%);
  background-color: #152940;
  /* animation: bounce-up 2s linear infinite;  */
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
.abc .el-dialog {
  background-color: #0c3b4e;
}
.abc .el-dialog__header {
  /* border-bottom: #e8e8e8 solid 1px; */
  border-bottom: 0;
}
.anquanTxt {
  padding: 10px;
  cursor: pointer;
  position: relative;
  z-index: 10;
}
.bcd .el-dialog {
  background-color: rgba(0, 0, 0, 0);
}
.bcd .el-dialog__header {
  /* border-bottom: #e8e8e8 solid 1px; */
  border-bottom: 0;
}
.gys img {
  width: 40px;
  height: 35px !important;
}

.feiqi_point {
  position: absolute;
}

.fsfq_point {
  width: 300px;
}

.fsfq_title {
  font-size: 18px;
  color: #4ec4f8;
  font-weight: bold;
}

.fsfq_body {
  display: flex;
  flex-direction: column;
}

.fsfq_body_title {
  font-size: 16px;
  font-weight: bold;
}

.fsfq_body p {
  font-size: 14px;
  line-height: 18px;
  color: white;
  padding: 0px;
}

.fsfq_body span {
  font-size: 16px;
  font-weight: bold;
  color: #4ec4f8;
  line-height: 18px;
}

.tabtab .el-tabs__content {
  height: calc(100% - 45px);
  .el-tab-pane {
    height: 100%;
  }
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
.yinyingceng {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
// .szrs .el-select-dropdown__item.hover,
// .el-select-dropdown__item:hover {
//   color: #000;
// }
// .szrs .el-scrollbar__view.el-select-dropdown__list {
//   background-color: #152940;
//   color: #fff;
//   li {
//     color: #fff;
//   }
// }
.szrs .el-select-dropdown__item.hover {
  background-color: #fff;
  color: #000;
}
.szrs.el-select .el-select-dropdown {
  background-color: #152940;
  border: 1px solid #4ec4f8;
  color: #fff;
}
.szrs.el-select li {
  display: flex;
  align-items: center;
  justify-content: center;
}
.szrs .el-select-dropdown__item {
  color: #ccc;
}
</style>
