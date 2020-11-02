<template>
  <div class="home">
    <div class="head-box">
      <headtit title="产品中心" :date="nowDate"></headtit>
    </div>
    <div class="flex-box">
      <div class="left-box" style="padding: 0 0 0 15px">
        <div class="item-box" style="margin-bottom: 25px">
          <div class="box-tit">
            <img class="img" src="../../assets/img/shangqi5-2.png" />
            <span>订单信息</span>
          </div>
          <ul class="box-list">
            <li>
              <span>订购时间</span>
              <span>{{ obj1.orderDate || "" }}</span>
            </li>
            <li>
              <span>车型</span>
              <span>{{ obj11.carModel }}</span>
            </li>
            <li>
              <span>颜色</span>
              <span>{{ obj11.carColor }}</span>
            </li>
            <li>
              <span>配置</span>
              <span>{{ obj1.configInfo }}</span>
            </li>
            <li>
              <span>预计下线时间</span>
              <span>{{ obj11.estimate }}</span>
            </li>
          </ul>
        </div>
        <div class="item-box">
          <div class="box-tit">
            <img class="img" src="../../assets/img/shangqi5-5.png" />
            <span>车辆参数/在建</span>
          </div>
          <ul class="box-list">
            <li>
              <span>长宽高 (mm)</span>
              <span>{{carObj.obj1 ||''}}</span>
            </li>
            <li>
              <span>电池容量 (kWh)</span>
              <span>{{carObj.obj2 || '' }}</span>
            </li>
            <li>
              <span>峰值功率 (kW)</span>
              <span>{{ carObj.obj3 || '' }}</span>
            </li>
            <li>
              <span>峰值扭矩 (Nm)</span>
              <span>{{ carObj.obj4 || '' }}</span>
            </li>
            <li>
              <span>变速箱型式</span>
              <span>{{ carObj.obj5 || '' }}</span>
            </li>

            <li>
              <span>综合续航里程 (km)</span>
              <span>{{ carObj.obj6 || '' }}</span>
            </li>

            <li>
              <span>快速充电时间(min)</span>
              <span>{{ carObj.obj7 || '' }}</span>
            </li>

            <li>
              <span>最高车速 (km/h)</span>
              <span>{{ carObj.obj8 || '' }}</span>
            </li>

            <li>
              <span>车身结构</span>
              <span>{{ carObj.obj9 || '' }}</span>
            </li>

            <li>
              <span>0～100km/h加速时间 (s)</span>
              <span>{{ carObj.obj10 || '' }}</span>
            </li>

            <li>
              <span>驱动方式</span>
              <span>{{ carObj.obj11 || '' }}</span>
            </li>
            <li>
              <span>全景天窗</span>
              <span>{{ carObj.obj12 || '' }}</span>
            </li>
            <li>
              <span>座椅材质</span>
              <span>{{ carObj.obj13 || '' }}</span>
            </li>
            <li>
              <span>多功能方向盘</span>
              <span>{{ carObj.obj14 || '' }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="right-box">
        <div class="carbox">
          <div class="linebox">
            <span
              style="
                width: 80px;
                transform: rotate(90deg);
                left: 57px;
                top: 204px;
              "
            ></span>
            <span
              style="
                width: 80px;
                transform: rotate(90deg);
                left: 57px;
                top: 425px;
              "
            ></span>
            <span style="width: 252px; left: 166px; bottom: 83px"></span>
            <span style="width: 190px; left: 562px; bottom: 83px"></span>
            <span style="width: 113px; left: 897px; bottom: 83px"></span>
            <span style="width: 25px; left: 1150px; bottom: 83px"></span>
            <span style="width: 25px; left: 1312px; bottom: 83px"></span>
            <span
              style="
                width: 339px;
                left: 422px;
                bottom: 169px;
                transform: rotate(21deg);
              "
            ></span>
          </div>
          <div class="step-box">
            <div class="step" style="top: 30px; left: 30px">
              <img src="../../assets/img/shangqi5-14.png" />
              <span>订单信息</span>
            </div>
            <div class="step" style="top: 250px; left: 30px">
              <img src="../../assets/img/shangqi5-4.png" />
              <span>关键零部件</span>
            </div>
            <div class="step" style="top: 470px; left: 30px">
              <img src="../../assets/img/shangqi5-9.png" />
              <span>车身车间</span>
            </div>
            <div class="step" style="top: 470px; left: 425px">
              <img src="../../assets/img/shangqi5-10.png" />
              <span>油漆车间</span>
            </div>
            <div class="step" style="top: 470px; left: 760px">
              <img src="../../assets/img/shangqi5-11.png" />
              <span>总装车间</span>
            </div>
            <div class="step" style="top: 310px; left: 290px">
              <img src="../../assets/img/shangqi5-6.png" />
              <span>电池车间</span>
            </div>
            <div class="step" style="top: 470px; right: 400px">
              <img src="../../assets/img/shangqi5-12.png" width="85" height="49" />
              <span>整车交付</span>
            </div>
            <div class="step" style="top: 470px; right: 240px">
              <img src="../../assets/img/shangqi5-7.png" />
              <span>售后</span>
            </div>
            <div class="step" style="top: 470px; right: 80px">
              <img src="../../assets/img/shangqi5-8.png" />
              <span>电池回收</span>
            </div>
          </div>
          <div class="item-box" style="position: absolute; left: 200px">
            <div class="box-tit">
              <img class="img" src="../../assets/img/shangqi5-6.png" />
              <span>电池车间/在建</span>
            </div>
            <ul class="box-list">
              <!-- <li>
                <span>电池名称</span>
                <span>{{ obj3.shopName }}</span>
              </li>-->
              <li>
                <span>离开时间</span>
                <span>{{ obj3.outTime || "" }}</span>
              </li>
              <li>
                <span>电池批次</span>
                <span>{{ obj3.piNo }}</span>
              </li>
              <li>
                <span>检测结果</span>
                <span>{{ obj3.checkRst }}</span>
              </li>
              <li>
                <span>缺陷记录</span>
                <span>{{ obj3.bugRec }}</span>
              </li>
              <li v-if="obj3.isRtn">
                <span>是否返修</span>
                <span>{{ obj3.isRtn ? "是" : "否" }}</span>
              </li>
              <li v-else>
                <span>是否返修</span>
                <span>{{''}}</span>
              </li>
            </ul>
          </div>
          <div class="carview">
            <img
              class="img"
              src="../../assets/img/shangqi5-1.png"
              style="width: 40vw; float: right"
            />
            <div class="search zhineng_box22">
              <!-- <div class="txt">搜索</div> -->
              <!-- <input type="text" v-model="value" placeholder="请输入PIN" @keydown.enter="onSearch" />
              <img src="../../assets/img/shangqi5-13.png" @click="onSearch()" />-->
              <el-select
                v-model="value"
                @change="onSearch()"
                placeholder="请选择"
                :popper-append-to-body="false"
                filterable
              >
                <el-option
                  v-for="(item,index) in searchData"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </div>
            <div class="state">
              订单状态：
              <span style="color: #4ec4f8; padding-left: 10px">{{obj1.kindType}}</span>
            </div>
          </div>
        </div>
        <div class="infobox">
          <div class="item-box">
            <div class="box-tit">
              <img class="img" src="../../assets/img/shangqi5-9.png" />
              <!-- <span>车<span></span>身车间</span> -->
              <span>车身车间</span>
            </div>
            <ul class="box-list">
              <li>
                <span>进入时间</span>
                <span>{{ objCs.intTime||"" }}</span>
              </li>
              <li>
                <span>离开时间</span>
                <span>{{ objCs.outTime || "" }}</span>
              </li>
              <!-- <li :v-if="obj4.shopName && obj4.shopName.indexOf('电池') > -1">
                <span>电池批次</span>
                <span>{{ obj3.piNo }}</span>
              </li>-->
              <li>
                <span>检测结果</span>
                <span>{{ obj4.checkRst }}</span>
              </li>
              <li>
                <span>缺陷记录</span>
                <span>{{ obj4.bugRec }}</span>
              </li>
              <li v-if="obj4.isRtn">
                <span>是否返修</span>
                <span>{{ obj4.isRtn ? "是" : "否" }}</span>
              </li>
              <li v-else>
                <span>是否返修</span>
                <span>{{ '' }}</span>
              </li>
            </ul>
          </div>
          <div class="item-box" style="margin-left: 30px">
            <div class="box-tit">
              <img class="img" src="../../assets/img/shangqi5-10.png" />
              <span>油漆车间</span>
            </div>
            <ul class="box-list">
              <li>
                <span>进入时间</span>
                <span>{{objYq.intTime|| "" }}</span>
              </li>
              <li>
                <span>离开时间</span>
                <span>{{ objYq.outTime || "" }}</span>
              </li>
              <!-- <li :v-if="obj5.shopName && obj5.shopName.indexOf('电池') > -1">
                <span>电池批次</span>
                <span>{{ obj5.piNo }}</span>
              </li>-->
              <li>
                <span>检测结果</span>
                <span>{{ obj5.checkRst }}</span>
              </li>
              <li>
                <span>缺陷记录</span>
                <span>{{ obj5.bugRec }}</span>
              </li>
              <li v-if="obj5.isRtn">
                <span>是否返修</span>
                <span>{{ obj5.isRtn ? "是" : "否" }}</span>
              </li>
              <li v-else>
                <span>是否返修</span>
                <span>{{ "" }}</span>
              </li>
            </ul>
          </div>
          <div class="item-box" style="margin-left: 30px">
            <div class="box-tit">
              <img class="img" src="../../assets/img/shangqi5-11.png" />
              <span>总装车间</span>
            </div>
            <ul class="box-list">
              <li>
                <span>进入时间</span>
                <span>{{ objZz.intTime || "" }}</span>
              </li>
              <li>
                <span>离开时间</span>
                <span>{{ objZz.outTime || "" }}</span>
              </li>
              <!-- <li :v-if="obj6.shopName && obj6.shopName.indexOf('电池') > -1">
                <span>电池批次</span>
                <span>{{ obj6.piNo }}</span>
              </li>-->
              <li>
                <span>检测结果</span>
                <span>{{ obj6.checkRst }}</span>
              </li>
              <li>
                <span>缺陷记录</span>
                <span>{{ obj6.bugRec }}</span>
              </li>
              <li v-if="obj6.isRtn">
                <span>是否返修</span>
                <span>{{ obj6.isRtn ? "是" : "否" }}</span>
              </li>
              <li v-else>
                <span>是否返修</span>
                <span>{{ "" }}</span>
              </li>
            </ul>
          </div>
          <div class="item-box" style="margin-left: 30px">
            <div class="minbox" style="width: 110px;">
              <div>出厂时间</div>
              <span>{{allOutTime||""}}</span>
            </div>
          </div>
          <div class="item-box" style="margin-left: 30px">
            <div class="minbox">
              <div>在建</div>
            </div>
          </div>
          <div class="item-box" style="margin-left: 30px">
            <div class="minbox">
              <div>在建</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import headtit from "./headtit.vue";
import floatmenu from "./floatmenu.vue";
import { singleOrder, singleParts, singleShopInfo, carBodyInOutTime, paintInOutTime, assemblyInOutTime, factoryOutTime, vehicleTracking } from "@/api/shangqi/dc";
import moment from "moment";
import { orderPIN, carParameter } from '@/api/abcd'
import { overview_pin } from "@/api/shangqi/zl"

const jiashuju = {
  obj1: '4254/1808/1550',
  obj2: '55',
  obj3: '125',
  obj4: '',
  obj5: '',
  obj6: '422',
  obj7: '',
  obj8: '150',
  obj9: '4门 5座 两厢轿车',
  obj10: '8.5',
  obj11: '',
  obj12: '',
  obj13: '',
  obj14: '',
};

export default {
  name: "shangqi6",
  components: {
    headtit,
    floatmenu,
  },
  data() {
    return {
      obj1: {},
      obj2: {},
      obj3: {},  //电池
      obj4: {},  // 车身
      obj5: {},  // 涂装
      obj6: {},  // 总装
      objErc: {},
      value: "",
      nowDate: "",
      objZz: {},
      objCs: {},
      objYq: {},
      allOutTime: "",
      obj11: {},
      searchData: [],
      carObj: {},
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.initData();
    //this.test();
  },
  methods: {
    initData() {
      this.getData();
      overview_pin({ workCode: 78, shopName: "ZZ", }).then(res => {
        if (res.data.success === true) {
          this.searchData = res.data.data;
        }

      })
    },
    test() {
      this.carObj = Object.assign({}, jiashuju)
    },
    async getPinInfo() {
      let res = await orderPIN(this.value)
      if (res.data.success) {
        this.$set(this.obj1, 'orderDate', res.data.data.time)
        this.$set(this.obj1, 'kindType', res.data.data.state)
        this.$set(this.obj1, 'configInfo', res.data.data.equip)
      }
      let res1 = await carParameter(this.value)
      if (res1.data.success) {
        this.$set(this.carObj, 'obj1', res1.data.data.lbh)
        this.$set(this.carObj, 'obj2', res1.data.data.soc)
        this.$set(this.carObj, 'obj3', res1.data.data.motorPower)
        this.$set(this.carObj, 'obj4', res1.data.data.motorTorque)
        this.$set(this.carObj, 'obj5', res1.data.data.gearbox)
        this.$set(this.carObj, 'obj6', res1.data.data.endurance)
        this.$set(this.carObj, 'obj7', res1.data.data.chargeTime)
        this.$set(this.carObj, 'obj8', res1.data.data.topSpeed)
        this.$set(this.carObj, 'obj9', res1.data.data.carStructure)
        this.$set(this.carObj, 'obj10', res1.data.data.accelerateTime)
        this.$set(this.carObj, 'obj11', res1.data.data.drivingMode)
        this.$set(this.carObj, 'obj12', res1.data.data.skylight)
        this.$set(this.carObj, 'obj13', res1.data.data.seatMaterial)
        this.$set(this.carObj, 'obj14', res1.data.data.steeringWheel)
      }
    },

    onSearch() {
      if (!this.value) return this.$message.error('请输入PIN码')
      this.getData();
      this.getPinInfo()
      this.carObj = Object.assign({}, jiashuju)
    },
    getData() {
      this.nowDate = moment().format('YYYY年MM月DD日');
      singleShopInfo({ PIN: this.value }).then((res) => {
        if (res.data.success === true) {
          // debugger
          res.data.data.forEach(e => {
            e.inTime = moment(e.inTime).format('YYYY-MM-DD HH:mm');
            e.outTime = moment(e.outTime).format('YYYY-MM-DD HH:mm');
            if (e.shopName == '车身') {
              this.obj4 = e;
            } else if (e.shopName == '电池') {
              this.obj3 = e;
            } else if (e.shopName == '涂装') {
              e.shopName = '油漆';
              this.obj5 = e;
            } else if (e.shopName == '总装') {
              this.obj6 = e;
            }
          })
        }
      });
      singleParts({ PIN: this.value }).then((res) => {
        if (res.data.success === true) {
          this.obj2 = res.data.data[0] || {};
        }
      });
      singleOrder({ PIN: this.value }).then((res) => {
        if (res.data.success === true) {
          this.obj1 = res.data.data[0] || {};
        }
      });
      vehicleTracking({ PIN: this.value }).then((res) => {
        if (res.data.success === true) {
          this.obj11 = { ...res.data.data };
        }
      });
      // 车间进出时间
      carBodyInOutTime({ PIN: this.value }).then((res) => {
        if (res.data.success === true) {
          this.objCs = { ...res.data.data };
        }
      });
      paintInOutTime({ PIN: this.value }).then((res) => {
        if (res.data.success === true) {
          this.objYq = { ...res.data.data };
        }
      });
      assemblyInOutTime({ PIN: this.value }).then((res) => {
        if (res.data.success === true) {
          this.objZz = { ...res.data.data };
        }
      });
      factoryOutTime({ PIN: this.value }).then((res) => {
        if (res.data.success === true) {
          this.allOutTime = res.data.data;
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
  flex: 1;
  display: flex;
  padding: 30px 10px;
}

.flex-box .left-box .item-box {
  padding: 10px 15px;
  background: rgba(3, 49, 85, 0.5);
  border: 1px solid rgba(13, 111, 135, 0.5);
  border-radius: 5px;
}
.flex-box .right-box .item-box {
  float: left;
  padding: 10px 14px;
  background: rgba(3, 49, 85, 0.5);
  border: 1px solid rgba(13, 111, 135, 0.5);
  border-radius: 5px;
}
.flex-box .right-box {
  margin-left: 25px;
  flex: 1;
  overflow: hidden;
}
.flex-box .right-box .item-box {
  background: rgba(3, 49, 85, 0.5);
}
.flex-box .right-box .carbox {
  position: relative;
  width: 100%;
  height: calc(100% - 310px);
  margin-bottom: 12px;
}
.flex-box .right-box .carbox .carview {
  position: absolute;
  right: 20px;
  top: 0px;
  width: 925px;
  height: 464px;
}
.carview .search,
.carview .state {
  position: absolute;
  left: 0px;
  top: 0px;
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
.flex-box .right-box .infobox {
  position: relative;
  text-align: left;
  width: 100%;
  height: 290px;
}
.item-box .box-tit {
  font-size: 20px;
  line-height: 35px;
  text-align: left;
  font-weight: bold;
  /*background: linear-gradient(to bottom, #1bdffc, #0c93e8);*/
  /*-webkit-background-clip: text;*/
  /*color: transparent;*/
  color: #fff;
  padding-bottom: 0;
}

.item-box .box-tit img {
  margin-right: 7px;
  position: relative;
  vertical-align: top;
}

.item-box .box-list {
  list-style: none;
  padding: 0 10px;
  margin: 10px 0 0 0;
}
.item-box .box-list li {
  background: rgba(31, 58, 84, 0.5);
  border-radius: 5px;
  margin-bottom: 10px;
  display: flex;
  width: 260px;
  box-sizing: border-box;
  line-height: 30px;
  padding: 0 15px;
  justify-content: space-between;
}
.item-box .box-list li span:first-child {
  color: #fff;
  font-size: 12px;
  /* flex: 1; */
  text-align: left;
}
.item-box .box-list li span:last-child {
  color: #4ec4f8;
  font-size: 14px;
  /* flex: 2; */
  font-weight: bold;
  text-align: right;
}

.step-box {
  position: relative;
}
.step-box .step {
  position: absolute;
  width: 130px;
  height: 130px;
  padding: 10px 0;
  text-align: center;
  background: url("../../assets/img/info.png") no-repeat;
  background-size: cover;
  color: #a9ddee;
  box-sizing: border-box;
}
.step-box .step img {
  display: block;
  margin: 10px auto;
}
.step-box .step span {
  font-size: 18px;
}
.item-box .minbox {
  color: #fff;
  width: 95px;
}

.item-box .minbox div {
  margin-bottom: 12px;
}
.item-box .minbox span {
  color: #4ec4f8;
  font-size: 14px;
  font-weight: bold;
  white-space: nowrap;
}
.linebox {
  position: absolute;
  width: 100%;
  height: 100%;
}
.linebox span {
  position: absolute;
  border-top: 2px dashed #fff;
  height: 0;
}
</style>
<style >
.zhineng_box22 .el-select-dropdown__item.hover {
  background-color: #fff;
  color: #000;
}
.zhineng_box22 .el-select .el-select-dropdown {
  background-color: #152940;
  border: 1px solid #4ec4f8;
  color: #fff;
}
.zhineng_box22 .el-select li {
  display: flex;
  align-items: center;
  justify-content: center;
}
.zhineng_box22 .el-select-dropdown__item {
  color: #ccc;
}
</style>
