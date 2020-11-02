<template>
  <div class="home">
    <div class="head-box">
      <headtit title="物流中心" :date="nowDate"></headtit>
    </div>
    <div class="flex-box">
      <div class="item-box" style="padding: 0 0 0 15px">
        <div class="chartbox znsc">
          <div class="box-tit">
            <img class="img" src="../../assets/img/shangqi9-2.png" />
            <span>交货分析</span>
          </div>
          <div class="top-chart" style="flex: 1; margin: 15px 0">
            <!-- <div id="znsc1" class="chart" style="width:150px;height:120px;"></div> -->
            <div id="znsc2" class="chart" style="width: 150px; height: 120px"></div>
            <div id="znsc3" class="chart" style="width: 150px; height: 120px"></div>
          </div>
          <div class="info-num">
            <div class="item">
              <div class="txt">库存覆盖天数</div>
              <small style="color: #a9ddee">{{ inventoryCoverageDays }}</small>
            </div>
            <div class="item">
              <div class="txt">收料体积(m³)</div>
              <small style="color: #a9ddee">在建</small>
            </div>
            <div class="item">
              <div class="txt">卡车数量(台)</div>
              <small style="color: #a9ddee">在建</small>
            </div>
          </div>
        </div>

        <div class="chartbox fxfx">
          <div class="box-tit">
            <img class="img" src="../../assets/img/shangqi9-6.png" />
            <span>供应商供货分析</span>
          </div>
          <div class="chart-tit" style="margin: 10px 0">
            <span>交货完成率</span>
          </div>
          <div class="chart" id="nyhj3" style="width: 100%; height: 240px"></div>
          <div class="chart-tit" style="margin: 10px 0">
            <span>库存覆盖天数</span>
          </div>
          <div id="fxfx" class="chart" style="width: 100%; height: 200px"></div>
        </div>
      </div>
      <div class="item-box" style="padding-top: 0">
        <div class="mainview" style="position: relative">
          <div class="viewbox chartbox" style="position: relative">
            <div class="box-tit">
              <img class="img" src="../../assets/img/shangqi9-3.png" />
              <span>供应链热力图</span>
            </div>
            <!-- <div class="chart-tit" style="margin: 10px 0">
              <span>供应商交货风险</span>
            </div>-->
            <div id="map" class="chart" style="width: 100%; height: 540px"></div>
          </div>
        </div>
        <div class="botview">
          <div class="chartbox zypz">
            <div class="box-tit">
              <img class="img" src="../../assets/img/shangqi9-5.png" />
              <span>国产化率变化（%）</span>
            </div>
            <div class="zypzboxs">
              <div class="item">
                <div class="chart" id="zypz1" style="width: 100%; height: 180px"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="item-box" style="padding: 0 15px 0 0">
        <div class="chartbox nyhj" style="position: relative">
          <div class="box-tit">
            <img class="img" src="../../assets/img/shangqi9-1.png" />
            <span>产能比较</span>
          </div>

          <div class="chart-tit" style="margin: 15px 0">
            <span>计划产能和实际产量对比</span>
          </div>
          <div class="nyhj-chart" style="margin-bottom: 15px">
            <div class="chart" id="nyhj1" style="width: 100%; height: 240px"></div>
          </div>
        </div>
        <div class="chartbox kcfx" style="position: relative">
          <div class="box-tit">
            <img class="img" src="../../assets/img/shangqi9-1.png" />
            <span>库存分析</span>
          </div>
          <div class="item">
            <div class="chart-tit" style="display:flex;justify-content: space-between;">
              <span>收料体积(m³)</span>
              <el-radio-group v-model="sltjModel" size="mini" fill="#152940" @change="changeSltj">
                <el-radio-button label="日"></el-radio-button>
                <el-radio-button label="周"></el-radio-button>
              </el-radio-group>
            </div>
            <div class="chart" id="sltj" style="width: 100%; height: 210px"></div>
          </div>

          <div
            class="chart-tit"
            style="margin: 15px 0;display:flex;justify-content: space-between;"
          >
            <span>收货箱数(箱)</span>
            <el-radio-group v-model="shxsModel" size="mini" fill="#152940" @change="changeSlxs">
              <el-radio-button label="日"></el-radio-button>
              <el-radio-button label="周"></el-radio-button>
            </el-radio-group>
          </div>
          <div class="nyhj-chart">
            <div class="chart" id="shxs" style="width: 100%; height: 210px"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import headtit from "./headtit.vue";
import "echarts/map/js/china.js";
import floatmenu from "./floatmenu.vue";
import moment from "moment";
import {
  deliveryRate,
  deyOkRate,
  localizationRate,
  marketForecasting,
  onPassage,
  pullRisk,
  repertoryRate,
  supplierAreaRate,
  supplierInOut,
  KCZZ_rateMonth,
  coverDaysMonth,
  deliRateMonth,
  locRateMonth,
  repertoryRateMonth,
  JHWC_rateMonth,
  KWLY_rateDate,
  get_analysis_of_delivery,
  planAndActualFinishWeek,
  list_day_total_warehouse_use_info,
  list_weeks_total_warehouse_use_info
} from "@/api/shangqi/wl";
import {
  girdEchartOption,
  girdLineEchartOptions,
  yuanEchartOption,
  banyuanEchartOption,
  areaLineEchart,
} from "@/utils/echartOption";

export default {
  name: "shangqi9",
  components: {
    headtit,
    floatmenu,
  },
  data() {
    return {
      sltjModel: '日',
      shxsModel: '日',
      start: 0,
      inventoryCoverageDays: "", // 库存覆盖天数
      goodsVolume: "", // 收料体积
      truckNum: "", //卡车数量
      key: {
        workCode: 78,
        shopName: "WL",
      },
      nowDate: "",
    };
  },
  computed: {},
  watch: {},
  mounted() {
    //
    this.initData();
    // this.test();
  },
  methods: {
    initData() {
      this.nowDate = moment().format("YYYY年MM月DD日");
      this.getDataRecord();
      this.getNewData();
      this.changeSltj();
      this.changeSlxs()
    },

    test() {
      // 交货分析 仪表盘
      // 测试
      let mapData = {
        success: true,
        code: 10000,
        message: "操作成功！",
        data: [
          { theMonth: 2010, theArea: "北京", theNum: 3834 },
          { theMonth: 2010, theArea: "天津市", theNum: 1988 },
          { theMonth: 2010, theArea: "河北省", theNum: 2414 },
          { theMonth: 2010, theArea: "内蒙古自治区", theNum: 142 },
          { theMonth: 2010, theArea: "辽宁省", theNum: 3550 },
          { theMonth: 2010, theArea: "吉林省", theNum: 8520 },
          { theMonth: 2010, theArea: "黑龙江省", theNum: 284 },
          { theMonth: 2010, theArea: "上海市", theNum: 71212 },
          { theMonth: 2010, theArea: "江苏省", theNum: 33832 },
          { theMonth: 2010, theArea: "浙江省", theNum: 16756 },
          { theMonth: 2010, theArea: "安徽省", theNum: 1988 },
          { theMonth: 2010, theArea: "福建省", theNum: 852 },
          { theMonth: 2010, theArea: "江西省", theNum: 142 },
          { theMonth: 2010, theArea: "山东省", theNum: 3124 },
          { theMonth: 2010, theArea: "河南省", theNum: 852 },
          { theMonth: 2010, theArea: "湖北省", theNum: 4260 },
          { theMonth: 2010, theArea: "湖南省", theNum: 1988 },
          { theMonth: 2010, theArea: "广东省", theNum: 4570 },
          { theMonth: 2010, theArea: "重庆市", theNum: 852 },
          { theMonth: 2010, theArea: "四川省", theNum: 710 },
          { theMonth: 2010, theArea: "贵州省", theNum: 1420 },
          { theMonth: 2010, theArea: "云南省", theNum: 142 },
          { theMonth: 2010, theArea: "陕西省", theNum: 142 },
        ],
      };
      mapData = mapData.data.map((x) => ({ name: x.theArea, value: x.theNum }));
      this.getNewData(mapData);
    },

    // 体积
    changeSltj(type = '日') {
      console.log(type);
      let value = type === '日' ? 'day' : 'week';
      if (type == '日') {
        list_day_total_warehouse_use_info({ workCode: "78" }).then(res => {
          if (res.data.success) {
            let date = res.data.data.map(x => x.date);
            date = date.map(item => {
              let arr = item.split('-')
              return arr[1] + '-' + arr[2]
            })
            console.log(date)
            let data = res.data.data.map(x => x.volume);
            let option = { id: "sltj", x: date, y: [data], name: ['收料体积'] }
            girdEchartOption(option);
          }
        });
      } else {
        list_weeks_total_warehouse_use_info({ workCode: "78" }).then(res => {
          if (res.data.success) {
            let date = res.data.data.map(x => x.weeks);
            let data = res.data.data.map(x => x.volume);
            let option = { id: "sltj", x: date, y: [data], name: ['收料体积'] }
            girdEchartOption(option);
          }
        })
      }
    },
    // 箱数
    changeSlxs(type = '日') {
      let value = type === '日' ? 'day' : 'week';
      if (type == '日') {
        list_day_total_warehouse_use_info({ workCode: "78" }).then(res => {
          if (res.data.success) {
            let date = res.data.data.map(x => x.date);
            date = date.map(item => {
              let arr = item.split('-')
              return arr[1] + '-' + arr[2]
            })
            console.log(date)
            let data = res.data.data.map(x => x.boxNum);
            let option = { id: "shxs", x: date, y: [data], name: ['收料体积'] }
            girdEchartOption(option);
          }
        });
      } else {
        list_weeks_total_warehouse_use_info({ workCode: "78" }).then(res => {
          if (res.data.success) {
            let date = res.data.data.map(x => x.weeks);
            let data = res.data.data.map(x => x.boxNum);
            let option = { id: "shxs", x: date, y: [data], name: ['收料体积'] }
            girdEchartOption(option);
          }
        })
      }
    },
    getDataRecord() {
      this.nowDate = moment().format("YYYY年MM月DD日");
      // KWLY_rateDate({...this.key}).then(res=>{
      //       if (res.data.success === true) {
      //             let date = res.data.data.map((x) => moment(x.theDate).format('MM-DD'));
      //             let data = res.data.data.map((x) => x.posRate);
      //             let option = {id:'zypz2',name:['库位利用率趋势'],x:date,y:[data],colors: [["#115380","#00b3cf","#115380"]]};
      //             girdEchartOption(option)
      //       }
      //  });



      get_analysis_of_delivery({ ...this.key }).then((res) => {
        if (res.data.success === true) {
          //  "goodsVolume": null, 收料体积
          // "truckNum": null  // 卡车数量

          this.inventoryCoverageDays = res.data.data.inventoryCoverageDays; // 库存覆盖天数
          let znsc1Option = {
            id: "znsc2",
            name: "交货完成率",
            value: res.data.data.completionRateOfDelivery,
          };
          banyuanEchartOption(znsc1Option);

          let znsc2Option = {
            id: "znsc3",
            name: "国产化率",
            value: res.data.data.localizationRate,
          };
          banyuanEchartOption(znsc2Option);
        }
      });
      supplierAreaRate({ ...this.key }).then((res) => {
        if (res.data.success === true) {
          //  console.log(res.data.data)
          // {theMonth: "2020-09", theArea: "北京", theNum: 2000}
          let data = res.data.data.map((x) => ({
            name: x.theArea,
            value: x.theNum,
          }));
          //this.map(data);
          this.getNewData(data);
        }
      });
      //1，2
      // repertoryRateMonth({ ...this.key }).then((res) => {
      //   if (res.data.success === true) {
      //     console.log(res.data.data);
      //     let date = res.data.data.map((x) => x.theMonth);
      //     let data = res.data.data.map((x) => x.repRate);
      //     let option ={id:'fbfx',name:['库存周转率趋势'],x:date,y:[data]}
      //     areaLineEchart(option);

      //   }
      // });
      coverDaysMonth({ ...this.key }).then((res) => {
        if (res.data.success === true) {
          let date = res.data.data.map((x) => x.theMonth);
          let data = res.data.data.map((x) => x.coverDays);
          let option = {
            id: "fxfx",
            name: ["库存覆盖天数趋势"],
            x: date,
            y: [data],
          };
          areaLineEchart(option);
        }
      });
      locRateMonth({ ...this.key, rowNum: 9 }).then((res) => {
        if (res.data.success === true) {
          console.log(res.data.data);
          let date = res.data.data.map((x) => x.month);
          let data = res.data.data.map((x) => x.localizationRate);
          var option = {
            id: "zypz1",
            max: 100,
            name: ["国产化率"],
            x: date,
            y: [data],
            colors: [["#c9ca22", "#02a29b", "#c9ca22"]],
          };
          girdLineEchartOptions(option);
        }
      });

      planAndActualFinishWeek({ ...this.key }).then((res) => {
        if (res.data.success === true) {
          let date = res.data.data.map((x) =>
            moment(x.theDate).format("MM-DD")
          );
          let plan = res.data.data.map((x) => x.planProdNum);
          let actual = res.data.data.map((x) => x.factProdNum);

          let option = {
            id: "nyhj1",
            name: ["计划产量", "实际产量"],
            x: date,
            y: [plan, actual],
            legend: true,
          };
          girdLineEchartOptions(option);
        }
      });

      // 折线
      //  value: 131,
      //           stationName: "s1",
      // 5，6
      deliveryRate({}).then((res) => {
        if (res.data.success === true) {
          let date = res.data.data.map((x) => x.weeks);
          let data = res.data.data.map((x) => x.deRate);
          let option = {
            id: "nyhj3",
            max: 100,
            name: ["交货完成率"],
            x: date,
            y: [data],
            colors: [["#3BFFF9", "#3BFFF9", "#3BFFF9"]],
          };
          areaLineEchart(option);
        }
      });
    },




    getNewData(data1 = []) {
      let data = [
        { name: "北京", value: 0 },
        { name: "天津", value: 0 },
        { name: "河北", value: 0 },
        { name: "山西", value: 0 },
        { name: "内蒙古", value: 0 },
        { name: "辽宁", value: 0 },
        { name: "吉林", value: 0 },
        { name: "黑龙江", value: 0 },
        { name: "上海", value: 0 },
        { name: "江苏", value: 0 },
        { name: "浙江", value: 0 },
        { name: "安徽", value: 0 },
        { name: "福建", value: 0 },
        { name: "江西", value: 0 },
        { name: "山东", value: 0 },
        { name: "河南", value: 0 },
        { name: "湖北", value: 0 },
        { name: "湖南", value: 0 },
        { name: "重庆", value: 0 },
        { name: "四川", value: 0 },
        { name: "贵州", value: 0 },
        { name: "云南", value: 0 },
        { name: "西藏", value: 0 },
        { name: "陕西", value: 0 },
        { name: "甘肃", value: 0 },
        { name: "青海", value: 0 },
        { name: "宁夏", value: 0 },
        { name: "新疆", value: 0 },
        { name: "广东", value: 0 },
        { name: "广西", value: 0 },
        { name: "海南", value: 0 },
        { name: "台湾", value: 0 },
        { name: "香港", value: 0 },
        { name: "澳门", value: 0 },
        { name: "南海诸岛", value: 0 },
      ];
      for (let i = 0; i < data1.length; i++) {
        let index = data.findIndex((x) => data1[i].name.indexOf(x.name) != -1);
        console.log(index, "index");

        if (index > -1) {
          data[index].value = data1[i].value;
        }
      }
      this.remap(data);
    },
    remap(data = []) {
      let vm = this;
      var mapName = "china";
      var geoCoordMap = {};
      let map = echarts.init(document.getElementById("map"));
      /*获取地图数据*/
      map.showLoading();
      var mapFeatures = echarts.getMap(mapName).geoJson.features;

      map.hideLoading();
      let shanghaiObj = {};
      mapFeatures.forEach(function (v) {
        // 地区名称
        var name = v.properties.name;
        // 地区经纬度
        geoCoordMap[name] = v.properties.cp;
        // 拿到上海的 坐标和位置
        if (name === '上海') {
          shanghaiObj = v.properties;
        }
      });
      var convertData = function (data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
          var geoCoord = geoCoordMap[data[i].name];

          if (geoCoord) {
            res.push({
              name: data[i].name,
              value: geoCoord.concat(data[i].value),
            });
          }
        }

        return res;
      };



      var lineCoverData = function (data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
          var geoCoord = geoCoordMap[data[i].name];
          if (geoCoord) {
            res.push({
              fromName: shanghaiObj.name,
              toName: data[i].name,
              coords: [shanghaiObj.cp, geoCoord]
            });
          }
        }
        return res;
      };
      map.setOption({
        tooltip: {
          trigger: "item",
        },
        visualMap: {
          show: false,
          min: 0,
          max: 2000,
          left: "10%",
          top: "bottom",
          // top:'10%',
          calculable: true,
          seriesIndex: [1],
          inRange: {
            color: ["#04387b", "#467bc0"], // 蓝绿
          },
        },
        grid: {
          top: "20px",
          left: "42px",
          right: "4%",
          bottom: "20px",
          containLabel: false,
        },
        geo: {
          show: true,
          map: mapName,
          zoom: 1.1,
          label: {
            normal: {
              show: false,
            },
            emphasis: {
              show: false,
            },
          },
          roam: false,
          itemStyle: {
            normal: {
              areaColor: "#fff",
              borderColor: "#fff",
            },
            emphasis: {
              areaColor: "#4499d0",
            },
          },
        },

        series: [
          {
            name: "热力图",
            type: "scatter",
            coordinateSystem: "geo",
            tooltip: {
              formatter: function (e) {
                return (
                  e.seriesName + '</br>' +
                  e.data.name + ':' + e.data.value[2] + '</br>' +
                  '流量统计:(在建)'
                )
              }
            },
            encode: {
              value: 2,
            },
            data: convertData(data),
            symbolSize: function (val) {
              return 10;
            },
            label: {
              formatter: "{b}",
              position: "right",
            },
            itemStyle: {
              color: "#FF8C00",
            },
            emphasis: {
              label: {
                show: true,
              },
            },
          },
          {
            name: "热力图",
            type: "map",
            map: mapName,
            geoIndex: 0,
            aspectScale: 1, //长宽比
            showLegendSymbol: false, // 存在legend时显示
            tooltip: {
              formatter: function (e) {
                return ('')
              }
            },
            label: {
              normal: {
                show: false,
              },
              emphasis: {
                show: false,
                textStyle: {
                  color: "#fff",
                },
              },
            },
            roam: true,
            itemStyle: {
              normal: {
                areaColor: "#031525",
                borderColor: "#3B5077",
              },
              emphasis: {
                areaColor: "#2B91B7",
              },
            },
            animation: false,
            data: data,
            symbolSize: 10,
          },
          {
            name: "Top 10",
            type: "effectScatter",
            coordinateSystem: "geo",
            tooltip: {
              formatter: function (e) {
                return (
                  e.seriesName + '</br>' +
                  e.data.name + ':' + e.data.value[2] + '</br>' +
                  '流量统计:(在建)'
                )
              }
            },
            encode: {
              value: 2,
            },
            data: convertData(
              data
                .sort(function (a, b) {
                  return b.value - a.value;
                })
                .slice(0, 10)
            ),

            symbolSize: function (val) {
              return 15;
            },
            showEffectOn: "render",
            rippleEffect: {
              brushType: "stroke",
            },
            hoverAnimation: true,
            label: {
              normal: {
                formatter: "{b}",
                position: "left",
                show: false,
              },
            },
            itemStyle: {
              normal: {
                color: "#FF8C00",
                shadowBlur: 10,
                shadowColor: "#FF8C00",
              },
            },
            zlevel: 1,
          },
          {
            type: "lines",
            coordinateSystem: "geo",
            zlevel: 1,
            large: true,
            effect: {
              show: true,
              constantSpeed: 30,
              symbol: "arrow", //ECharts 提供的标记类型包括 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
              symbolSize: 0,
              trailLength: 0,
            },

            lineStyle: {
              normal: {
                show: false,
                color: "#D2691E",
                width: 2,
                opacity: 1.0,
                curveness: 0.15,
              },
            },
            data: lineCoverData(
              data
                .sort(function (a, b) {
                  return b.value - a.value;
                })
                .slice(0, 10)
            ),
          }
        ],
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
  padding: 0 35px;
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
.info-num {
  margin-top: 30px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.info-num .item {
  width: 150px;
  height: 109px;
  margin-bottom: 10px;
  line-height: 25px;
  background: url("../../assets/img/shangqi9-8.png") no-repeat;
  text-align: center;
  position: relative;
  background-position: center;
  background-size: 100% 100%;
}
.info-num .item .txt {
  font-size: 14px;
  display: block;
  color: #a9ddee;
  line-height: 40px;
  margin-bottom: 20px;
}
.info-num .item .small-position {
  position: absolute;
  top: 70%;
  margin-top: -8px;
  left: 10%;
  font-size: 12px;
  color: #fff;
}
.info-num .item .num {
  font-size: 24px;
  font-weight: bold;
  color: #4ec4f8;
  padding-left: 60px;
}
.info-num .item .num small {
  font-size: 12px;
  margin-left: 5px;
}
/* znsc */
.znsc {
  width: 520px;
  height: 340px;

  box-sizing: border-box;
  margin-bottom: 35px;
}
.jywl {
  /* width: 1025px; */
  height: 26.6vh;
  width: 32.55vw;
  box-sizing: border-box;
  margin-bottom: 35px;
}
.fxfx {
  width: 520px;
  height: 575px;
  box-sizing: border-box;
}
.nyhj {
  width: 520px;
  height: 340px;
  /*padding: 15px;*/
  box-sizing: border-box;
  /* margin-bottom: 15px; */
  margin-bottom: 35px;
}

.kcfx {
  width: 520px;
  height: 575px;
  /*padding: 15px;*/
  box-sizing: border-box;
  margin-bottom: 15px;
}
.chart-mininfo {
  width: 70px;
  position: absolute;
  right: 0px;
  bottom: 5px;
  color: #ffffff;
}
.chart-mininfo .item span:first-child {
  font-size: 12px;
  color: #fff;
}
.chart-mininfo .item span:last-child {
  font-size: 14px;
  color: #4ec4f8;
}
.top-chart {
  display: flex;
}

.top-chart .chart {
  flex: 1;
}

.yj {
  width: 520px;
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
}
.yj .item1 span {
  display: flex;
  align-items: center;
  padding: 0 15px;
  box-sizing: border-box;
  justify-content: center;
  width: 87px;
  height: 43px;
  color: #fff;
  background: url("../../assets/img/shangqi1-3.png") no-repeat;
}
.yj .item1 span.err {
  display: flex;
  align-items: center;
  padding: 0 15px;
  box-sizing: border-box;
  justify-content: center;
  width: 87px;
  height: 43px;
  color: #ff0000;
  background: url("../../assets/img/shangqi1-4.png") no-repeat;
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
  line-height: 20px;
  padding: 10px 5px;
  font-size: 0;
}
.yj .tip span {
  display: inline-block;
  font-size: 12px;
  color: #fff;
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
  width: 16.67vw;
  height: 230px;
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
  margin: 0 auto 15px auto;
  background: #00ff57;
}

.bdc-mid .state .ddj .yellow {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin: 15px auto 15px auto;
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
  width: 745px;
  box-sizing: border-box;
  margin-bottom: 35px;
}
.viewbox {
  height: 635px;
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
  justify-content: space-around;
  margin-bottom: 35px;
}
.mainview .top-info .item {
  width: 253px;
  height: 101px;
  text-align: center;
  padding: 10px;
  background: url("../../assets/img/shangqi9-7.png") no-repeat;
  background-position: center;
  background-size: 100%;
}
.mainview .top-info .txt {
  font-size: 14px;
  display: block;
  color: #a9ddee;
  line-height: 35px;
}
.mainview .top-info .num {
  font-size: 34px;
  font-weight: bold;
  color: #4ec4f8;
}
.btninfo {
  position: absolute;
  right: 0px;
  bottom: 10px;
  color: #fff;
  font-size: 12px;
}
.btninfo .item img {
  border: 2px solid #003b77;
  padding: 10px;
}
.botview {
  display: flex;
}

.botview .zypz {
  width: 745px;
  height: 280px;
  /*padding: 15px;*/
  box-sizing: border-box;
}

.zypzboxs {
  display: flex;
  justify-content: center;
  align-self: auto;
  flex-wrap: wrap;
  height: 265px;
}

.zypzboxs .item {
  width: 100%;
  height: 165px;
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
  justify-content: space-around;
  flex-wrap: wrap;
  margin-top: 15px;
}
.sbgl1 .item {
  width: 133px;
}
</style>
