<template>
  <div class="home shangqi3" style="position: relative">
    <div class="head-box">
      <headtit title="车身车间" :date="nowDate"></headtit>
    </div>
    <div class="flex-box">
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
              <p>134</p>
            </div>
            <div class="item">
              <small>总缓存</small>
              <p>322</p>
            </div>
            <!-- <div class="item">
              <small>占用缓存</small>
              <p>{{ topData.cacheUseNum }}</p>
            </div>-->
            <div
              class="item item-btn"
              style="text-align: center; position: relative"
              @click="handImgShow = !handImgShow"
            >
              <small>占用缓存</small>
              <p>{{ topData.cacheUseNum }}</p>
            </div>
          </div>
          <el-carousel
            indicator-position="none"
            :interval="5000"
            height="145px"
            style="width: 100%; height: 145px; overflow: hidden;"
            arrow="hover"
            class="el_carousel_fade"
          >
            <el-carousel-item>
              <div class="chart-tit">
                <span>MTTR（min）</span>
              </div>
              <div id="znsc2" style="width: 100%; height: 110px"></div>
            </el-carousel-item>
            <el-carousel-item>
              <div class="chart-tit">
                <span>MTBF（h）</span>
              </div>
              <div id="znsc3" style="width: 100%; height: 110px"></div>
            </el-carousel-item>
          </el-carousel>

          <el-carousel
            indicator-position="none"
            :interval="5000"
            height="145px"
            style="width: 100%; height: 145px; overflow: hidden;margin-top:10px"
            arrow="hover"
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
              <div id="znsc4" style="width: 100%; height: 110px"></div>
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="chartbox jywl">
          <div class="box-tit">
            <img class="img" src="../../assets/img/data-icons/logistics.png" />
            <span>精益物流</span>
          </div>
          <div class="chart-tit">
            <span>收货箱数</span>
          </div>
          <div id="jywl3" style="width: 100%; height: 100px"></div>
          <div class="chart-tit">
            <span>收料体积(m³)</span>
          </div>
          <div id="jywl4" style="width: 100%; height: 100px"></div>
          <div class="chart-tit">
            <span>道口利用率/在建</span>
          </div>
          <div id style="width: 100%; height: 100px"></div>
        </div>
      </div>
      <div class="item-box" style="padding-top: 0; z-index: 1">
        <div class="mainview" style="position: relative">
          <div class="top-info">
            <div class="item">
              <span class="txt">计划产量</span>
              <v-countup :start-value="0" :end-value="startObj.planOutput || 0" class="num"></v-countup>
            </div>
            <div class="item">
              <span class="txt">实时产量</span>
              <v-countup :start-value="0" :end-value="startObj.todayOutput || 0" class="num"></v-countup>
            </div>
            <div class="item">
              <span class="txt">完成率</span>
              <v-countup :start-value="0" :end-value="startObj.completionRate || 0" class="num"></v-countup>
              <span
                v-if="startObj.completionRate !=0"
                style="font-size: 14px; font-weight: bold; color: #4ec4f8"
              >%</span>
            </div>
            <div class="item">
              <span class="txt">DLZ</span>
              <v-countup :start-value="0" :end-value="startObj.avgDlz || 0" class="num"></v-countup>
              <span style="font-size: 14px;font-weight: bold;color: #4ec4f8;">h</span>
            </div>
            <!-- <div class="item">
              <span class="txt">当日实时节拍</span>
              <v-countup :start-value="0" :end-value="startObj.todayRealTimeBeat||0" class="num"></v-countup>
            </div>
            <div class="item">
              <span class="txt">当日平均开动率</span>
              <v-countup :start-value="0" :end-value="startObj.todayAvgStartRate||0" class="num"></v-countup>
            </div>-->
            <div class="item">
              <span class="txt">OEE</span>
              <v-countup :start-value="0" :end-value="startObj.realTimeOee || 0" class="num"></v-countup>
              <span
                v-if="startObj.realTimeOee !=0"
                style="font-size: 14px;font-weight: bold;color: #4ec4f8;"
              >%</span>
            </div>
            <div class="item">
              <span class="txt">在岗人数</span>
              <!-- <v-countup :start-value="0" :end-value="startObj.onJobNum||0" class="num"></v-countup> -->
              <span style="font-size: 14px; font-weight: bold; color: #4ec4f8">{{ "在建" }}</span>
            </div>
            <div
              class="item safeCircleF"
              @click="anquan"
              style="cursor: pointer;  position: relative;z-index: 2;"
            >
              <span class="txt anquanTxt">安全</span>
              <div class="safeCircle" :style="{backgroundColor:getSafe?'lime':'red'}"></div>
            </div>
          </div>
          <div class="floor-info">
            <div class="item">
              <!-- <v-countup :start-value="0" :end-value="startObj.onJobNum" class="num"></v-countup> -->
              <span>{{changeimg == 1? "一层" :"二层"}}</span>
            </div>
          </div>
          <div class="viewbox" style="margin-top: 20px; position: relative">
            <img
              class="img"
              src="../../assets/img/cs-main-1.png"
              v-show="changeimg == 1"
              style="
                font-weight: 100;
                width: 110%;
                cursor: pointer;
                margin-left: -9%;
                margin-top: -6%;
              "
              @click="changeimg = 2"
              width="1050"
            />
            <img
              class="img"
              src="../../assets/img/cs-main-2.png"
              style="
                font-weight: 100;
                width: 110%;
                cursor: pointer;
                margin-left: -9%;
                margin-top: -6%;
              "
              v-show="changeimg == 2"
              @click="changeimg = 1"
              width="1050"
            />
            <div v-for="(item,index) in dataPoint" :key="index">
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
                  <span>底板1合格率(%)</span>
                </div>
                <div class="chart" id="zypz1"></div>
              </div>
              <div class="item">
                <div class="chart-tit">
                  <span>总拼6合格率(%)</span>
                </div>
                <div class="chart" id="zypz2"></div>
              </div>
              <div class="item">
                <div class="chart-tit">
                  <span>总拼3合格率(%)/在建</span>
                </div>
                <div class="chart" id="zypz3"></div>
              </div>
              <div class="item">
                <div class="chart-tit">
                  <span>AUDIT</span>
                </div>
                <div class="chart" id="zypz4"></div>
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
                <div id="sbgl3" style="width: 100%; height: 110px" @click="showSblgDialog()"></div>
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
                    <tr v-for="(item, index) in receiveLogData" :key="index">
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
              <div>
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
                      <tr v-for="(item, index) in fixData" :key="index">
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
          <div class="aq1" @click="shwoFactory = true">
            <img
              style="display: block; margin: 10px auto"
              src="../../assets/img/data-icons/edit.png"
            />
            <small style="font-size: 16px">智能排产</small>
            <br />
          </div>

          <div class="aq1" @click="onClickMaintain" style="cursor: pointer">
            <img
              style="display: block; margin: 10px auto"
              src="../../assets/img/data-icons/design.png"
            />
            <small style="font-size: 16px">预测性维修</small>
          </div>
        </div>
        <div class="chartbox" style="height: 793px;width:320px">
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
          <div id="nyhj1" style="width: 300px; height:  140px"></div>
          <!-- <div style="position: relative; display: flex">

          </div>-->
          <div class="chart-tit">
            <span>{{`电能（kW·h ${unitOption.dianUnit}）`}}</span>
          </div>
          <div id="nyhj4" style="width: 100%; height: 140px"></div>
          <!-- <div class="chart-tit">
          <span>压缩空气（m³）/在建</span>
        </div>
        <div style="position: relative">
          <div id="nyhj3" style="width: 100%; height: 13.5vh"></div>
          </div>-->
          <el-carousel
            indicator-position="none"
            :interval="3000"
            height="170px"
            style="width: 100%; height: 170px; overflow: hidden"
            arrow="hover"
            class="el_carousel_fade"
          >
            <el-carousel-item :key="1">
              <div class="chart-tit">
                <span>{{`自来水/在建（t ${unitOption.zilaiUnit}）`}}</span>
              </div>
              <div id="nyhj6" style="height: 140px width: 15.6vw"></div>
            </el-carousel-item>
            <el-carousel-item :key="2">
              <div class="chart-tit">
                <span>{{`空调水（t ${unitOption.kongtiaoUnit}）`}}</span>
              </div>
              <div id="nyhj2" style="width: ; height: 140px"></div>
            </el-carousel-item>
            <el-carousel-item :key="3">
              <div class="chart-tit">
                <span>{{`工艺循环水（t ${unitOption.gongyiUnit}）`}}</span>
              </div>
              <div style="position: relative">
                <div id="nyhj5" style="width: 100%; height: 140px"></div>
                <!-- <img src="../../assets/img/ybp.png" style="position: absolute;bottom: 10px;right: 10px;"> -->
              </div>
            </el-carousel-item>
          </el-carousel>
          <div class="chart-tit">
            <span>电能桑基图</span>
            <div
              class="chart"
              id="sankey1"
              style="height: 200px;margin-top:20px"
              @click="changeSanjiShow"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="as-dialog-f as-dialog-flex"
      v-show="maintainShow"
      @click="maintainShow=!maintainShow"
    >
      <div @click.stop="()=>{}" style="width:80%">
        <el-carousel
          :interval="4000"
          type="card"
          height="500px"
          style="width: 100%; height: 500px;overflow: hidden"
          :autoplay="false"
        >
          <el-carousel-item :key="1" class="ca-item">
            <div class="infotable-cs">
              <div style="position: relative">
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
                  <span>曲线</span>
                </div>
                <i
                  class="el-icon-close"
                  style="
                  color: #fff;
                  font-size: 30px;
                  position: absolute;
                  top: 10px;
                  right: 10px;
                "
                  @click="maintainShow = false"
                ></i>
              </div>

              <div class="sbxx sbxx-form" style="width: 100%; flex-direction: column; color: #fff">
                <div>
                  <el-form :inline="true" :model="formSearch" class="demo-form-inline">
                    <el-form-item label="生产线">
                      <el-select
                        v-model="formSearch.kindName"
                        placeholder="请选择"
                        style="width: 120px"
                      >
                        <el-option label="AFO6120" value="AFO6120"></el-option>
                        <el-option label="AFO6140" value="AFO6140"></el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item label="设备">
                      <el-select
                        v-model="formSearch.equipment"
                        placeholder="请选择"
                        style="width: 120px"
                      >
                        <el-option label="1轴电机" value="1"></el-option>
                        <el-option label="2轴电机" value="2"></el-option>
                        <el-option label="3轴电机" value="3"></el-option>
                        <el-option label="4轴电机" value="4"></el-option>
                        <el-option label="5轴电机" value="5"></el-option>
                        <el-option label="6轴电机" value="6"></el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item label="参数" @change="onChangeParameter">
                      <el-select v-model="formSearch.param" placeholder="请选择" style="width: 120px">
                        <el-option label="温度" value="WD"></el-option>
                        <el-option label="扭矩" value="NJ"></el-option>
                        <el-option label="电流" value="DL"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="onSubmit">查询</el-button>
                    </el-form-item>
                  </el-form>
                </div>
                <div id="chartLine" style="width: 760px;height:480px; padding: 20px"></div>
              </div>
            </div>
          </el-carousel-item>
          <el-carousel-item :key="2" class="ca-item">
            <div style="position: relative">
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
                <span>告警信息/在建</span>
              </div>
              <i
                class="el-icon-close"
                style="
                color: #fff;
                font-size: 40px;
                position: absolute;
                top: 10px;
                right: 10px;
              "
                @click="maintainShow = false"
              ></i>
            </div>

            <div class="cs-body-1" style="padding: 20px">
              <div class="sbxx sbxx-form" style="width: 100%; flex-direction: column; color: #fff">
                <div>
                  <el-form :inline="true" :model="formSearch" class="demo-form-inline">
                    <el-form-item label="生产线">
                      <el-select v-model="formSearch1.a2" placeholder="请选择" style="width: 120px"></el-select>
                    </el-form-item>
                    <el-form-item label="工位">
                      <el-select v-model="formSearch1.a3" placeholder="请选择" style="width: 120px"></el-select>
                    </el-form-item>
                    <el-form-item label="设备">
                      <el-select v-model="formSearch1.a4" placeholder="请选择" style="width: 120px"></el-select>
                    </el-form-item>
                    <el-form-item label="处理状态">
                      <el-select v-model="formSearch1.a5" placeholder="请选择" style="width: 120px"></el-select>
                    </el-form-item>
                    <el-form-item label="预警等级">
                      <el-select v-model="formSearch1.a6" placeholder="请选择" style="width: 120px"></el-select>
                    </el-form-item>
                    <el-form-item label="起止时间">
                      <el-date-picker
                        v-model="formSearch1.a7"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                      ></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary">查询</el-button>
                    </el-form-item>
                  </el-form>
                </div>

                <!-- <div id="chartLine" style="width: 760px; height: 500px"></div> -->
              </div>
              <div>
                <el-table :data="[]" style="width: 100%">
                  <el-table-column prop="a1" label="序号" width="180"></el-table-column>
                  <el-table-column prop="name" label="生产线" width="180"></el-table-column>
                  <el-table-column prop="address" label="工位"></el-table-column>
                  <el-table-column prop="address" label="设备" width="180"></el-table-column>
                  <el-table-column prop="address" label="预警类型" width="180"></el-table-column>
                  <el-table-column prop="a11" label="预警代码"></el-table-column>
                  <el-table-column prop="a12" label="预警描述"></el-table-column>
                  <el-table-column prop="a13" label="预警时间"></el-table-column>
                  <el-table-column prop="a14" label="发生次数"></el-table-column>
                  <el-table-column prop="a15" label="预警状态"></el-table-column>
                  <el-table-column prop="a16" label="处理状态"></el-table-column>
                </el-table>
              </div>
            </div>
          </el-carousel-item>

          <el-carousel-item :key="3" class="ca-item">
            <div style="position: relative">
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
                <span>性能得分/在建</span>
              </div>
              <i
                class="el-icon-close"
                style="
                color: #fff;
                font-size: 40px;
                position: absolute;
                top: 10px;
                right: 10px;
              "
                @click="maintainShow = false"
              ></i>
              <div>
                <el-form :inline="true" :model="formSearch" class="demo-form-inline">
                  <el-form-item label="生产线">
                    <el-select v-model="formSearch1.a2" placeholder="请选择" style="width: 120px"></el-select>
                  </el-form-item>
                  <el-form-item label="PLC区">
                    <el-select v-model="formSearch1.a3" placeholder="请选择" style="width: 120px"></el-select>
                  </el-form-item>
                  <el-form-item label="安全区">
                    <el-select v-model="formSearch1.a4" placeholder="请选择" style="width: 120px"></el-select>
                  </el-form-item>
                  <el-form-item label="工位">
                    <el-select v-model="formSearch1.a5" placeholder="请选择" style="width: 120px"></el-select>
                  </el-form-item>
                  <el-form-item label="设备类型">
                    <el-select v-model="formSearch1.a6" placeholder="请选择" style="width: 120px"></el-select>
                  </el-form-item>
                  <el-form-item label="设备名称">
                    <el-select v-model="formSearch1.a6" placeholder="请选择" style="width: 120px"></el-select>
                  </el-form-item>
                  <el-form-item label="检测项">
                    <el-select v-model="formSearch1.a6" placeholder="请选择" style="width: 120px"></el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" style="background-color: #566a87">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div id="xndf1" style="width: 700px; height: 320px;padding:0 20px"></div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
    <div class="as-dialog-f as-dialog-flex" v-show="shwoFactory" @click="shwoFactory=!shwoFactory">
      <div @click.stop="()=>{}" style="width:80%">
        <el-carousel
          :interval="4000"
          height="500px"
          type="card"
          style="width: 100%; height: 500px;"
          :autoplay="false"
          class="znpc"
        >
          <el-carousel-item :key="1" class="ca-item">
            <div class="infotable-cs">
              <div style="position: relative">
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
                  <span>产线信息</span>
                </div>
                <i
                  class="el-icon-close"
                  style="
                  color: #fff;
                  font-size: 24px;
                  position: absolute;
                  top: 10px;
                  right: 10px;
                "
                  @click="shwoFactory = false"
                ></i>
              </div>
              <div>
                <!-- @tab-click="(a)=>activeName=a" -->
                <el-tabs v-model="activeName" type="card">
                  <el-tab-pane label="主线配置信息" name="first">
                    <table>
                      <thead>
                        <tr>
                          <th>名称</th>
                          <th>型号</th>
                          <th>开始时间</th>
                          <th>节拍</th>
                          <th>数量</th>
                          <th>操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, index) in dataList1" :key="index">
                          <td>{{ item.name }}</td>
                          <td>{{ item.mainLogo }}</td>
                          <td>{{ item.crtTime }}}</td>
                          <td>{{ item.beat }}</td>
                          <td>{{ item.craftSort }}</td>
                          <td>
                            <span>查看</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </el-tab-pane>
                  <el-tab-pane label="分拼线配置信息" name="second">
                    <table>
                      <thead>
                        <tr>
                          <th>名称</th>
                          <th>型号</th>
                          <th>开始时间</th>
                          <th>缓存数量</th>
                          <th>数量</th>
                          <th>操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, index) in dataList2" :key="index">
                          <td>{{ item.lineName }}</td>
                          <td>{{ item.splitLogo }}</td>
                          <td>{{ item.crtTime }}}</td>
                          <td>{{ item.beat }}</td>
                          <td>{{ item.craftSort }}</td>
                          <td>
                            <span>查看</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </el-tab-pane>
                  <el-tab-pane label="输送线配置信息" name="third">
                    <table>
                      <thead>
                        <tr>
                          <th>名称</th>
                          <th>型号</th>
                          <th>开始时间</th>
                          <th>节拍</th>
                          <th>数量</th>
                          <th>操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, index) in dataList2" :key="index">
                          <td>{{ item.name }}</td>
                          <td>{{ item.mainLogo }}</td>
                          <td>{{ item.crtTime }}}</td>

                          <td>{{ item.cacheNum }}</td>
                          <td>{{ item.statNum }}</td>
                          <td>
                            <span>查看</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </el-tab-pane>
                  <el-tab-pane label="EMS配置信息列表" name="fourth">
                    <table>
                      <thead>
                        <tr>
                          <th>名称</th>
                          <th>型号</th>
                          <th>开始时间</th>
                          <th>吊具数量</th>
                          <th>车辆数量</th>
                          <th>操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, index) in dataList2" :key="index">
                          <td>{{ item.lineName }}</td>
                          <td>{{ item.emsLogo }}</td>
                          <td>{{ item.crtTime }}}</td>
                          <td>{{ item.spreaderNum }}</td>
                          <!-- spreaderNum -->
                          <td>{{ item.carNum }}</td>
                          <td>
                            <span>查看</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </div>
          </el-carousel-item>

          <el-carousel-item :key="2" class="ca-item">
            <div class="infotable-cs" style="position: relative">
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
                <span>生产状态/在建</span>
              </div>
              <i
                class="el-icon-close"
                style="
                color: #fff;
                font-size: 24px;
                position: absolute;
                top: 10px;
                right: 10px;
              "
                @click="shwoFactory = false"
              ></i>
              <div>
                <table>
                  <thead>
                    <tr>
                      <th>线体</th>
                      <th>模拟生产实况信息</th>
                      <th>车型信息</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in []" :key="index">
                      <td>{{ item.name }}</td>
                      <td>{{ item.mainLogo }}</td>
                      <td>{{ item.crtTime }}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </el-carousel-item>
          <el-carousel-item :key="3" class="ca-item">
            <div class="infotable-cs header" style="position: relative">
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
                <span>排产计划/在建</span>
              </div>
              <i
                class="el-icon-close"
                style="
                color: #fff;
                font-size: 24px;
                position: absolute;
                top: 10px;
                right: 10px;
              "
                @click="shwoFactory = false"
              ></i>
              <div>
                <!-- <img src="../../assets/img/xinjin-1.png" /> -->
                <table>
                  <thead>
                    <tr>
                      <th>工单号</th>
                      <th>车型</th>
                      <th>数量</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in []" :key="index">
                      <td>{{ item.name }}</td>
                      <td>{{ item.mainLogo }}</td>
                      <td>{{ item.crtTime }}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
    <div class="as-dialog-f" v-show="handImgShow" @click="handImgShow=!handImgShow">
      <div class="as-dialog" title="电能桑基图" @click.stop="()=>{}">
        <div class="header" style="position: absolute; right: 20px; top: 20px">
          <i
            class="el-icon-close"
            style="color: #fff; font-size: 40px"
            @click="handImgShow = false"
          ></i>
        </div>
        <div class="infotable-cs">
          <div class="chart-tit">
            <span style="padding: 20px">缓存占用</span>
          </div>
          <div id="znsc0" style="width: 700px; height: 560px;padding:20px; margin-top:20px"></div>
        </div>
      </div>
    </div>
    <sanjiDialog ref="sanjiDialog" title="总能耗桑基图"></sanjiDialog>
    <pieDialog ref="pieDialog" title="停线分析" hasData="区域"></pieDialog>
    <el-dialog title :visible.sync="anquanDialog" width="50%" append-to-body class="abc">
      <green-cross @anquan="anquan" :dayArr="dayArr" :requestOption="key"></green-cross>
    </el-dialog>
    <txjl-dialog ref="txjl_dialog" shopName="CS"></txjl-dialog>
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
import {
  list_energy_consumption,
  listTce,
  list_sankey_diagram,
} from "@/api/shangqi/enegy";
import { list_warehouse_use_info } from "@/api/shangqi/wlModule";
import {
  threeDinfo,
  switchinfo,
  productioninfo,
  Oeeinfo,
  Mttrinfo,
  getMonthProduction,
  cy_downtime_analyze,
  monthProduction,
  downtime_record
} from "@/api/shangqi/cy";
import {
  getRealTimeData,
  safeDays,
  listDayOee,
  listMonthMttrMtbf,
  lisFaultAlarm,
  productionRealTimeData,
  listCache,
  carTypeOutput,
  shopStaticValue,
  lineInfoEms,
  lineInfoTrans,
  lineInfoSplit,
  lineInfoMain,
  listFmkCs,
} from "@/api/shangqi/cs";
import { list_test_data } from '@/api/shangqi/dc'
import hand from "@/assets/img/hand.png";
import { listDlq, listAudit, getMonthProductionInfo } from "@/api/shangqi/zz";
import moment from "moment";
import { getObjectData, getUnitString } from "@/utils/common";
import { getCurYWH } from "@/api/shangqi/dev";
import { stackEchartOption, onePieEchartOption, sanKeyOption, girdEchartOption, girdLineEchartOptions, yuanEchartOption } from '@/utils/echartOption'
import sanjiDialog from '@/components/sanjiDialog';
import pieDialog from '@/components/pieDialog';

import data3 from './data3'
import { list_downtime_production_line, month_un_safety_production_day, list_month_tce, list_day_tce } from '@/api/abcd.js'
import greenCross from './greenCross'
import txjlDialog from './txjlDialog'

export default {
  name: "shangqi3",
  components: {
    headtit,
    floatmenu,
    sanjiDialog,
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
      data3,
      nyhjChange: '日',
      anquanDialog: false,

      changeimg: 1,
      interval: null, //自动循环参数
      key: {
        workCode: 78,
        shopName: "CS",
      },
      activeName: "first",
      deviceTotal: 0,
      swiperIndex: 1,
      fixData: [],
      dataList1: [],
      dataList2: [],
      dataList3: [],
      dataList4: [],
      shwoFactory: false,
      receiveLogData: [],
      jsrc2_res: [],
      jsrc3_res: [],
      days: {},
      topData: {},
      jsrc4_res: "",
      start: 0,
      Mapzbid: "",
      maintainShow: false,
      mainLineData: [],
      zbid: "",
      shortName: "",
      showModal: false,
      shopObj: {},
      handImgSrc: hand,
      nowDate: "",

      shwoFactory: false,
      djry4_res: [],
      djrydata: "",
      djrczrs: "",
      zbdryqk: [],
      zbdryqkShow: [],
      //地图参数
      tabcur: 4,
      points: [],
      centerpoint: "",
      startObj: {},
      formSearch: { kindName: "AFO6120", param: "WD", equipment: "1" },
      formSearch1: {},
      timer1: null,
      myChart: null,
      handImgShow: false,
      sanKeyOption: [],
      monthObj: {},
      sblgOption: null,
      getSafe: true,
      dayArr: []
    };
  },
  computed: {
    dataPoint() {
      if (this.changeimg == '1') {
        return this.data3.one
      } else {
        return this.data3.two
      }
    }
  },
  watch: {},
  mounted() {

    this.initData();

    // setTimeout(()=>{
    //   this.test();
    // })
    // 能源环境  总能耗
    this.changeNyhj()

  },

  beforeDestroy() {
    clearInterval(this.timer);

    // this.timer = null
  },
  methods: {


    initData() {
      this.getZNSCdata();
      this.getFixRecord();
      this.getData();
      this.isSafe()
      this.data3.one = this.data3.one.map(item => {
        return {
          ...item,
          leftBox: +item.left + 2,
          topBox: +item.top - 2,
          flag: false,
          flagBox: false,
          message: {}
        }
      })
      this.data3.two = this.data3.two.map(item => {
        return {
          ...item,
          leftBox: +item.left + 2,
          topBox: +item.top - 2,
          flag: false,
          flagBox: false,

          message: {}
        }
      })
      // 智能排产
      getMonthProductionInfo({ shopName: "CS", workCode: "78" }).then(res => {
        if (res.data.success) {
          this.$set(this.monthObj, 'actualOutput', res.data.data.monthlyOutput)
          this.$set(this.monthObj, 'completionRate', res.data.data.monthCompletionRate)
        }
      })
    },
    test() {

      let cnfxX = ['2020-05', '2020-06', '2020-07', '2020-08', '2020-09'];
      let cnfxName = ['SUV-1', 'SUV-2', 'SUV-3', 'SUV-4'];
      let cnfxY = [
        [100, 300, 400, 500, 800],
        [500, 300, 900, 300, 1100],
        [200, 500, 200, 900, 2000],
        [400, 300, 200, 700, 500],
      ]

      let sblgData = [{ "faultType": "设备故障", "duration": 1211 }, { "faultType": "安全类停线", "duration": 505 }, { "faultType": "网络故障", "duration": 451 }, { "faultType": "外部故障", "duration": 226 }, { "faultType": "紧停触发", "duration": 48 }, { "faultType": "无自动模式", "duration": 40 }, { "faultType": "手动模式驱动选择", "duration": 19 }]
      sblgData = sblgData.map(e => ({ name: e.faultType, value: e.duration }))
      this.sblgOption = sblgData
      onePieEchartOption({ id: 'sbgl3', inData: sblgData, name: '停线分析', showLabel: false })


      let option = { id: 'znsc4', x: cnfxX, name: cnfxName, y: cnfxY, legend: true, };
      stackEchartOption(option);



      let data =
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

      this.sanKeyOption = data;

    },
    showTxjl(data, propData) {
      this.$refs.txjl_dialog.tableData = data
      this.$refs.txjl_dialog.propData = propData
      this.$refs.txjl_dialog.visible = true
    },
    async getData() {
      let res = await list_downtime_production_line({ ...this.key })
      console.log('aaafs', res)
      if (res.data.data && res.data.data.length > 0) {
        res.data.data.forEach(item => {
          this.data3.one.forEach(v => {
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
          this.data3.two.forEach(v => {
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
    showSblgDialog() {
      if (this.sblgOption) {
        this.$refs.pieDialog.onePieDialog(this.sblgOption);
      }
    },
    changeSanjiShow() {
      // console.log(this.$refs,Object.keys(this.sanKeyOption));
      if (this.sanKeyOption.length) {
        this.$refs.sanjiDialog.showSankey(this.sanKeyOption);
      }

    },

    onChangeParameter(value) {
      console.log(value);
    },
    onClickMaintain() {
      this.maintainShow = true;
      this.getChartLine();
      this.timer1 = setInterval(() => {
        this.getChartLine();


      }, 30000);
      //  this.chartLine();
      // "kindName": "AFO6120",
      // "param": "1",
      // "equipment" : "WD"
    },

    getChartLine() {
      let setOption = false;
      const { equipment = "" } = this.formSearch;
      if (!this.myChart) {
        setOption = true;
      }
      getCurYWH({ ...this.formSearch }).then((res) => {
        if (res.data.success === true) {
          // this.obj0 = {...res.data.data}
          let data = res.data.data;
          data = data.map((x) => [x.time, x.value]);
          data.map((x) => [x.time, x.value]);
          this.mainLineData = data;
          if (setOption) {
            this.chartLine();
          } else {

            this.chartLine();
          }
        }
      });
      // this.chartLine();
    },
    onSubmit() {
      clearInterval(this.timer1);
      this.getChartLine();
      this.timer1 = setInterval(() => {
        this.getChartLine();
      }, 30000);
    },
    getFixRecord() {
      this.nowDate = moment().format("YYYY年MM月DD日");
      downtime_record({ ...this.key, rowNum: 2 }).then((res) => {
        if (res.data.success === true) {
          this.fixData = res.data.data.map((x) => ({
            ...x,
            sTime: moment(x.sTime).format("MM-DD HH:mm"),
            eTime: moment(x.eTime).format("MM-DD HH:mm"),
          }));
        }
      });

      // 底盘1的数据
      list_test_data({
        ...this.key,
        rowNum: 7,
        testType: "DB1",
      }).then((res) => {
        if (res.data.success === true) {
          let date = res.data.data.map((x) => moment(x.theDate).format('MM-DD'));
          let data = res.data.data.map((x) => x.okRate);
          let option = { id: 'zypz1', max: 100, name: ['底盘1合格率'], x: date, y: [data] }
          girdLineEchartOptions(option);

        }
      });

      // 总拼6的数据
      list_test_data({
        ...this.key,
        rowNum: 7,
        testType: "ZP6",
      }).then((res) => {
        if (res.data.success === true) {
          let date = res.data.data.map((x) => moment(x.theDate).format('MM-DD'));
          let data = res.data.data.map((x) => x.okRate);
          let option = { id: 'zypz2', max: 100, name: ['总拼1合格率'], x: date, y: [data] }
          girdLineEchartOptions(option);

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
      safeDays({ ...this.key }).then((res) => {
        if (res.data.success === true) {
          this.days = { ...res.data.data };
        }
      });
      getRealTimeData({ ...this.key, rowNum: 7 }).then((res) => {
        if (res.data.success === true) {
          this.startObj = { ...res.data.data };
        }
      });
      get_check_maintain_complete_rate({ ...this.key, rowNum: 3 }).then(
        (res) => {
          if (res.data.success === true) {
            // console.log((res.data.data))

            let option = { id: "sbgl1", value: (res.data.data || {}).checkCompleteRate || 0 }
            yuanEchartOption(option)

            let option1 = { id: "sbgl2", value: (res.data.data || {}).maintainCompleteRate || 0 }
            yuanEchartOption(option1)
          }
        }
      );
      productionRealTimeData({ ...this.key }).then((res) => {
        if (res.data.success === true) {
          this.topData = { ...res.data.data };
          //this.deviceTotal=res.data.data
        }
      });
      shopStaticValue({ ...this.key }).then((res) => {
        if (res.data.success === true) {
          this.shopObj = { ...res.data.data };
          //this.deviceTotal=res.data.data
        }
      });
      // 主线
      lineInfoMain({ page: 1, limt: 10 }).then((res) => {
        if (res.data.success === true) {
          let data = res.data.data;
          this.dataList1 = data;
        }
      });
      // 分线
      lineInfoSplit({ page: 1, limt: 10 }).then((res) => {
        if (res.data.success === true) {
          let data = res.data.data;
          this.dataList2 = data;
          //this.deviceTotal=res.data.data
        }
      });
      // 输送线配置信息列表
      lineInfoTrans({ page: 1, limt: 10 }).then((res) => {
        if (res.data.success === true) {
          let data = res.data.data;
          this.dataList3 = data;
          //this.deviceTotal=res.data.data
        }
      });
      // EMS配置详细信息
      lineInfoEms({ page: 1, limt: 10 }).then((res) => {
        if (res.data.success === true) {
          let data = res.data.data;
          this.dataList4 = data;
          //this.deviceTotal=res.data.data
        }
      });

      // 获取cs/fmk
    },
    getZNSCdata() {
      //   productioninfo({ ...this.key, rowNum: 7 }).then((res) => {
      //     if (res.data.success === true) {
      //       this.prodata = res.data.data;
      //     }
      //   });
      switchinfo().then((res) => {
        if (res.data.success === true) {
          this.switchdata = res.data.data;
        }
      });
      Mttrinfo({ ...this.key, rowNum: 7 }).then((res) => {
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

          let mttrOption = { id: 'znsc2', name: ['MTTR'], x: mttrmouth, y: [mttrdata], unit: "min" };
          girdLineEchartOptions(mttrOption);

          let mtbfOption = { id: 'znsc3', name: ['MTBF'], x: mttrmouth, y: [mtbfdata], unit: "h" };
          girdLineEchartOptions(mtbfOption);
        }
      });
      Oeeinfo({ ...this.key, rowNum: 7 }).then((res) => {
        if (res.data.success === true) {
          let oeedata = res.data.data.map((item) => {
            return item.oee;
          });
          let oeemouth = res.data.data.map((item) => moment(item.theDate).format('MM-DD'));
          let option = { id: 'znsc1', max: 100, x: oeemouth, y: [oeedata], name: ['OEE'], unit: "%" }
          girdLineEchartOptions(option);

        }
      });

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
          let option = { id: 'znsc4', x: date, name: type, y: data, legend: true, legend: true };
          stackEchartOption(option);
        }
      });
      // lisFaultAlarm({ ...this.key, rowNum: 7 }).then((res) => {
      //   if (res.data.success === true) {
      //     let date = res.data.data.map((x) => x.faultType);
      //     let data = res.data.data.map((x) => x.duration);
      //     let option = {id:'sbgl3',x:date,y:[data],name:['设备故障分析'], colors:[["#115380","#00b3cf","#115380"]],unit:"min"}
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



      listAudit({ ...this.key, rowNum: 5 }).then((res) => {
        if (res.data.success === true) {
          let date = res.data.data.map((x) => x.carType);
          let data = res.data.data.map((x) => x.audit);

          let option = { id: 'zypz4', name: ['AUDIT'], x: date, y: [data] };
          girdEchartOption(option);
        }
      });

      listCache({ ...this.key, rowNum: 7 }).then((res) => {
        if (res.data.success === true) {
          let date = res.data.data.map((x) =>
            moment(x.theDate).format("MM-DD")
          );
          let data = res.data.data.map((x) => x.occupancyNum);
          let option = { id: 'znsc0', name: ['缓存占用'], x: date, y: [data] };
          girdLineEchartOptions(option);

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
          let option = { id: 'nyhj2', name: ['空调水'], x: date, y: [data], colors: [["#1825ee", "#3351da", "#3351da"]], unit: 'T' }
          this.unitOption = { ...this.unitOption, kongtiaoUnit: getUnitString(res.data.data.powerNum) };
          girdEchartOption(option)

        }
      });
      // list_energy_consumption({
      //   ...this.key,
      //   rowNum: 7,
      //   energyTypes: "压缩空气0.7MPa",
      // }).then((res) => {
      //   if (res.data.success === true) {
      //     let date = res.data.data.map((x) =>  moment(x.theDate).format('MM-DD'));
      //      let data = res.data.data.map((x) => x.consume&&x.consume.toFixed(0));

      //     let option = {id:'nyhj3',name:['压缩空气'],x: date, y:[data],colors:[["#ffc21f", "#c4f7ff","#c4f7ff"]],unit:'m³'}
      //     girdEchartOption(option)
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
          let option = { id: 'nyhj5', name: ['工艺循环水'], x: date, y: [data], colors: [["#ff5b1f", "#3351da", "#c4f7ff"]], unit: 'T' }
          this.unitOption = { ...this.unitOption, gongyiUnit: getUnitString(res.data.data.powerNum) };
          girdEchartOption(option)

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
          let option = { id: 'nyhj6', name: ['自来水'], x: date, y: [data], colors: [["#00ffa7", "#00d3e4", "#c4f7ff"]], unit: 'T' }
          this.unitOption = { ...this.unitOption, zilaiUnit: getUnitString(res.data.data.powerNum) };
          girdEchartOption(option)
        }
      });

      list_sankey_diagram({
        ...this.key,
        rowNum: 7,
      }).then((res) => {
        if (res.data.success === true) {
          sanKeyOption({ id: 'sankey1', f: res.data.data, });
          this.sanKeyOption = res.data.data;
        }
      });
      list_warehouse_use_info({
        ...this.key,
        rowNum: 7,
      }).then((res) => {
        if (res.data.success === true) {
          let date = res.data.data.map((x) =>
            moment(x.createTime).format("MM-DD")
          );
          let data = res.data.data.map((x) => x.boxNum);
          let data1 = res.data.data.map((x) => x.volume);
          let data2 = res.data.data.map((x) => x.useRate);

          let option = { id: 'jywl3', name: ['收货箱数'], x: date, y: [data] };
          girdEchartOption(option);

          let option1 = { id: 'jywl4', name: ['收料体积'], x: date, y: [data1], unit: "m³" };
          girdEchartOption(option1);

        }
      });
    },
    chartLine() {
      let vm = this;
      this.myChart = echarts.init(document.getElementById("chartLine"));
      let data = this.mainLineData;
      // let data = [["2000-06-05",116],["2000-06-06",129],["2000-06-07",135],["2000-06-08",86],["2000-06-09",73],["2000-06-10",85],["2000-06-11",73],["2000-06-12",68],["2000-06-13",92],["2000-06-14",130],["2000-06-15",245],["2000-06-16",139],["2000-06-17",115],["2000-06-18",111],["2000-06-19",309],["2000-06-20",206],["2000-06-21",137],["2000-06-22",128],["2000-06-23",85],["2000-06-24",94],["2000-06-25",71],["2000-06-26",106],["2000-06-27",84],["2000-06-28",93],["2000-06-29",85],["2000-06-30",73],["2000-07-01",83],["2000-07-02",125],["2000-07-03",107],["2000-07-04",82],["2000-07-05",44],["2000-07-06",72],["2000-07-07",106],["2000-07-08",107],["2000-07-09",66],["2000-07-10",91],["2000-07-11",92],["2000-07-12",113],["2000-07-13",107],["2000-07-14",131],["2000-07-15",111],["2000-07-16",64],["2000-07-17",69],["2000-07-18",88],["2000-07-19",77],["2000-07-20",83],["2000-07-21",111],["2000-07-22",57],["2000-07-23",55],["2000-07-24",60]];

      let dateList = data.map(function (item) {
        return item[0];
      });
      let valueList = data.map(function (item) {
        return item[1];
      });
      this.myChart.setOption({

        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}",
        },
        xAxis: {
          axisTick: {
            show: false, //去刻度线
          },
          type: "category",
          splitLine: {
            show: false,
          },
          data: dateList,
          nameTextStyle: {
            fontSize: 14,
          },
          axisLine: {
            lineStyle: {
              color: "#fff", // 颜色
            },
          },
          axisLabel: {
            textStyle: {
              fontSize: 14, // 让字体变大
            },
          },
        },
        grid: {
          top: "15%",
          left: "12%",
          right: "4%",
          bottom: "15%",
          containLabel: true,
        },
        yAxis: {
          splitNumber: 5, //y轴最大间隔
          name: "A",
          axisTick: {
            show: false, //去刻度线
          },
          type: "value",
          // name: '单位（平方米）',
          // nameLocation: 'end',
          nameTextStyle: {
            // padding: [0, 0, 0, 850],
            fontSize: "10px",
          },
          splitLine: {
            show: false,
            // lineStyle: {
            //   type: 'solid',
            //   color: '#33466a'
            // }
          },
          axisLine: {
            lineStyle: {
              color: "#fff", // 颜色
            },
          },
          axisLabel: {
            //调整x轴的lable
            textStyle: {
              fontSize: 14, // 让字体变大
            },
          },
        },
        dataZoom: [
          {
            startValue: data[0][0],
          },
          {
            endValue: data[data.length - 1][0],
          },
          {
            type: "inside",
          },
        ],
        series: [
          {
            name: "",
            type: "line",
            data: valueList,
            symbol: "circle",
            symbolSize: 8,
            itemStyle: {
              normal: {
                color: "#3BFFF9",
                shadowColor: "#3BFFF9",
                shadowBlur: 10,
              },
            },
          },
        ],
      });
    },
  },
};
</script>

<style>
.el-tabs__item {
  color: white;
}

.el-tabs__item .is-active {
  color: #409eff;
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.yuce-dilog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ca-item {
  height: 500px;
  background: rgba(3, 49, 85, 1);
  border: 1px solid rgba(13, 111, 135, 0.5);
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
  height: 500px;
  box-sizing: border-box;
  margin-bottom: 15px;
}
.jywl {
  width: 400px;
  /*padding: 15px;*/
  height: 435px;
  box-sizing: border-box;
}

.nyhj {
  width: 320px;
  height: 775px;
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
.viewbox img {
  cursor: pointer;
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
.infotable-cs {
  height: 560px;
  border: 1pxs solid #566a87;
  border-radius: 10px;
}

.as-dialog-f {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}
.as-dialog-flex {
  display: flex;
  justify-content: center;
  align-items: center;
}
.as-dialog {
  position: fixed;
  background-color: #566a87;
  top: 50%;
  left: 50%;
  margin-top: -300px;
  margin-left: -400px;
  z-index: 99;
  height: 640px;
  border-radius: 10px;
}

.infotable-cs table {
  width: 100%;
  border-collapse: collapse;
}
.infotable-cs table th {
  color: #4ec4f8;
  background: rgba(40, 74, 108, 0.5);
  line-height: 30px;
  text-align: center;
}
.infotable-cs table td {
  color: #fff;
  padding: 0.2vw;
  text-align: center;
}
.infotable-cs table td span.green {
  vertical-align: middle;
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #0bb20c;
}
.infotable-cs table td span.blue {
  vertical-align: middle;
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #0c93e8;
}
</style>
<style >
.sbxx-form .el-form--inline .el-form-item__label {
  float: none;
  display: inline-block;
  color: #fff;
}

.cs-body-1 th {
  /* background: rgba(78, 196, 248, 1); */
  background: rgba(73, 91, 154, 0.6);
  color: #fff;
  text-align: center;
}
.cs-body-1 .el-table__empty-block,
.cs-body td {
  color: rgb(255, 255, 255);

  background: #38495f;
}

.cs-body .el-input input {
  background: #566a87;
}
.cs-body .goog-te-spinner-pos {
  background: #566a87;
}

.el-select-dropdown__list {
  background: #566a87;
}

.el-select-dropdown__list li {
  background: #566a87;
  color: #fff;
}

.el-input--suffix .el-input__inner,
.el-select-dropdown__empty,
.el-date-range-picker .el-picker-panel__body,
.el-range-editor.el-input__inner,
.el-range-editor .el-range-input {
  background: #566a87;
  color: #fff;
}
.el-form--inline .el-form-item__label {
  color: #fff;
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
.abc .el-dialog {
  background-color: #0c3b4e;
}
.abc .el-dialog__header {
  /* border-bottom: #e8e8e8 solid 1px; */
  border-bottom: 0;
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
.safeCircleF {
  position: relative;
  z-index: 2;
}
/* .louBgi {
  background-image: url("../../assets/img/carBodyBgi.png");
  background-size: 100% 100%;
  margin-top: 10px;
} */
.znpc .el-carousel__container {
  height: auto !important;
}
</style>
