<template>
  <div class="home sb-body">
    <div class="head-box">
      <headtit title="设备树" :date="nowDate"></headtit>
    </div>
    <div class="flex-box">
      <div class="left-box">
        <div class="box-tit" style="padding: 15px 0">
          <span>设备模型</span>
        </div>
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </div>
      <div class="right-box">
        <div class="infobox" style="position: absolute; z-index: 99;width: 100%;">
          <div class="li">
            <div class="txt">设备数量</div>
            <div class="num">{{topdata.total}}<small>台</small></div>
          </div>
          <div class="li">
            <div class="txt">点检完成率</div>
            <div class="num">{{topdata.a1||0}}<small>%</small></div>
          </div>
          <div class="li">
            <div class="txt">维护完成率</div>
            <div class="num">{{topdata.a1||0}}<small>%</small></div>
          </div>
          <div class="li">
            <div class="txt">设备备件数量</div>
            <div class="num">{{topdata.a1||0}}<small></small></div>
          </div>
        </div>
        <div class="boxbg" >
         <img
              class="img"
              :src="centerImgSrc"

              style="font-weight: 100;width: 72vw;
              margin-left: 4vw;
              margin-top: -4vw;"
              @click="changeimg=2"
              width="1050"
            />
        </div>
      <el-carousel :interval="4000" type="card" height="500px" :initial-index="1"  :autoplay="false" v-show="showChildCard">
          <el-carousel-item :key="1">
            <!-- <template v-if="item==1"> -->
              <div class="infotable">
                <div class="box-tit" style="text-align: left">
                  <img class="img" src="../../assets/img/shangqi5-3.png">
                  <span>运行管理</span>
                </div>
                <table>
                  <thead>
                  <tr>
                    <th>任务名称</th>
                    <th>计划开始</th>
                    <th>计划结束</th>
                    <th>实际开始</th>
                    <th>实际结束</th>
                    <th>任务状态</th>
                    <th>结果</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item,index) in runList" :key="index">
                    <td>{{item.macName}}</td>
                    <td>{{item.planStime}}</td>
                    <td>{{item.planEtime}}</td>
                    <td>{{item.factStime}}</td>
                    <td>{{item.factEtime}}</td>
                    <td>
                      <span class="green"></span>
                      {{item.taskState}}
                    </td>
                    <td>
                      <span class="blue"></span>
                      {{item.result}}
                    </td>
                  </tr>

                  </tbody>
                </table>
                 <el-pagination
                    small
                    layout="prev, pager, next"
                    @current-change="onChangeSize1"
                    :total="total1">
                  </el-pagination >
              </div>
          </el-carousel-item>
           <el-carousel-item   :key="2" >
            <!-- </template>
            <template v-else-if="item==2"> -->
              <div class="infotable">
                <div class="box-tit" style="text-align: left">
                  <img class="img" src="../../assets/img/shangqi5-3.png">
                  <span>设备信息</span>
                </div>
                  <div class="sbxx ">
                    <ul class="list">
                      <li>
                        <span>设备编号</span>
                        <span>{{deviceobj.macCode}}</span>
                      </li>
                      <li>
                        <span>设备名称</span>
                        <span>{{deviceobj.macName}}</span>
                      </li>
                      <li>
                        <span>车间名称</span>
                        <span>{{deviceobj.shopName}}</span>
                      </li>
                      <li>
                        <span>产线名称</span>
                        <span>{{deviceobj.lineName}}</span>
                      </li>
                      <li>
                        <span>生产厂商</span>
                        <span>{{deviceobj.madeCust}}</span>
                      </li>
                    </ul>
                    <img :src="deviceImg" style="height: calc( 24vw - 100px );width: auto;">
                    <div class="time-box">
                      <div class="line"></div>
                      <div class="case">
                        <span>{{deviceobj.butTime}}</span>
                        <small></small>
                        <div class="t">采购</div>
                      </div>
                      <div class="case">
                        <span>{{deviceobj.installTime}}</span>
                        <small></small>
                        <div class="t">安装</div>
                      </div>
                      <div class="case">
                        <span>{{deviceobj.debugTime}}</span>
                        <small></small>
                        <div class="t">调试</div>
                      </div>
                      <div class="case">
                        <span>{{deviceobj.fyTime}}</span>
                        <small></small>
                        <div class="t">投运</div>
                      </div>
                      <div class="case active">
                        <span>{{deviceobj.bz}}</span>
                        <small></small>
                        <div class="t">当前</div>
                      </div>
                    </div>
                </div>
              </div>
            </el-carousel-item>
            <el-carousel-item   :key="3">
              <div class="infotable">
                <div class="box-tit" style="text-align: left">
                  <img class="img" src="../../assets/img/shangqi5-3.png">
                  <span>温度曲线</span>
                </div>
                <div class="sbxx sbxx-form" style="width:100%;flex-direction: column;color:#fff;">
                  <div id="chartLine" style="width:500px;height:300px"></div>
                </div>
              </div>

              </el-carousel-item>
              <el-carousel-item   :key="4">
                <div class="infotable">
                  <div class="box-tit" style="text-align: left">
                    <img class="img" src="../../assets/img/shangqi5-3.png">
                    <span>备件管理</span>
                  </div>
                    <table>
                <thead>
                <tr>
                  <th>备件名称</th>
                  <th>型号</th>
                  <th>规格</th>
                  <th>领用数量</th>
                  <th>领用日期</th>

                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in dataList4" :key="index">
                  <td>{{item.sparesName}}</td>
                  <td> {{item.modelNumber}}</td>
                  <td>{{item.pecification}}}</td>
                  <td>
                    {{item.createdOn}}
                  </td>
                  <td>
                    {{item.usedQty}}
                  </td>

                </tr>
                </tbody>
              </table>
              <el-pagination
                small
                layout="prev, pager, next"
                @current-change="onChangeSize2"
                :total="total2"
              >
              </el-pagination >
              </div>
           </el-carousel-item>
           <el-carousel-item :key="6">
            <div class="infotable">
              <div class="box-tit" style="text-align: left">
                <img class="img" src="../../assets/img/shangqi5-3.png">
                <span>附件管理</span>
              </div>
              <table>
                <thead>
                <tr>
                  <th>文件名称</th>
                  <th>更新时间</th>
                  <th>操作</th>
                </tr>
                </thead>
                <tbody>
                  <tr v-for="(item,index) in dataList6" :key="index">

                    <td> {{item.fileName}}</td>
                    <td>
                      {{item.createdOn}}
                    </td>
                    <td>
                      <span class="blue"></span>
                      <span @click="onSee(item)"> 查看</span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div>
                <el-pagination
                  small
                  layout="prev, pager, next"
                  @current-change="onChangeSize3"
                  :total="total3">
                </el-pagination >
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
  </div>
</template>

<script>
    import echarts from 'echarts'
    import headtit from './headtit.vue'
    import floatmenu from './floatmenu.vue'
    import { devTree,devCount,noList,filesManage,queryDevSpares ,groupByCode,getEquipTempCurve}  from "@/api/shangqi/dev";
    import moment from 'moment';
    import Pagination from "@/components/Pagination/index";
    export default {
        name: 'shangqi7',
        components: {
            headtit,
            floatmenu,
            Pagination
        },
    data() {
      return {
        topdata:{},
        showIndex:null,
        showChildCard:false,
        dataList1:[],
        runList:[],
        dataList4:[],
        dataList6:[],
        deviceobj:{},
        deviceImg: '',
        total3:0,
        total1:0,
        total2:0,
        sbdm:"",
        unitObj:{1:'A',2:'T',3:'N'},
       testObj:{1:["车身车间"],2:["后盖、右前门、右后门","后盖的",],3:["右前2","后盖1"],4:["6120R1","6140R1","7210V01"]},
        nowDate:"",
        myChart:null,
        formSearch:{},
        //切换图片的时间
        slide: 1,
        //图片的个数
        num: 0,
        //定时器的名称
        timer: null,
        timer2:null,
        //屏幕的尺寸
        screen: null,
        //定时器每张图停留的时间
        min: 3000,
        data: [{
          label: 'MEB工厂',
          children: [{
            label: '冲压车间',
            children: [{
              label: 'A生产线',
              children: [{
                label: 'A设备',
              }]
            }]
          },{
            label: '车身车间',
            children: [{
              label: '右后门',
              children: [{
                label: 'KUKA机器人',
              },{
                label: 'KUKA机器人',
              }

              ]
            },{
              label: '后盖、右前门、右后门',
              children: [{
                label: 'KUKA机器人',
                children: [{
                    label: '6121110R1',
                  },{
                    label: '614110R1',
                    children:[]
                  }]
              },{
                label: '右前二',
                 children: [{
                    label: '6120R1',
                  },{
                    label: '6140R1',
                  },{
                    label: '6140Rqq1',
                    children:[]
                  }]
              }]
            },{
              label: '后盖的',
              children: [{
                label: 'KUKA机器人',
              }]
            }]
          },{
            label: '油漆车间',
            disabled: true,
            children: [{
              label: 'A生产线'
            }]
          },{
            label: '总装车间',
            children: [{
              label: 'A生产线'
            }]
          },{
            label: '电池车间',
            children: [{
              label: 'A生产线'
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        syjt: {
          "lnqk": [{
            "name": "KW23",
            "value": "262.21"
          },
            {
              "name": "KW24",
              "value": "331.68"
            },
            {
              "name": "KW25",
              "value": "434.83"
            },
            {
              "name": "KW26",
              "value": "457.96"
            }
          ]
        },
        centerImg:[{label:"MEB工厂",url:require('../../assets/img/shangqi1-2.png')},{
        label:"冲压车间",url:require('../../assets/img/main-cy.png')
        },{
        label:"车身车间",url:require('../../assets/img/main-car1.png')
        },{
        label:"总装车间",url:require('../../assets/img/mainviewbg.png')
        },{
        label:"电池车间",url:require('../../assets/img/dc.png')
        },{
        label:"油漆车间",url:require('../../assets/img/main-yq1.png')
        }],
        centerImgSrc:require('../../assets/img/main-src-zl-2.png'),


        tData:[]
      };
    },
    computed: {

    },
    watch: {},
    mounted() {
      this.initData();
      //this.test();
    },
    //关闭页面之前摧毁定时器
    beforeDestroy() {
      clearInterval(this.timer);
        clearInterval(this.timer2);
      // this.timer = null
    },
    methods: {
      doTree(data){
        // let data  = this.data;
        let newDataObj = data[0];
        let data0 = data[0].children;

        let objx = {},objy={};
        let xLen = [],yLen =[],zLen  =[];
        for (let x=0;x<data0.length;x++){

          if(this.testObj[1].indexOf(data0[x].label)<0){

              delete data0[x].children

          }
            xLen = data0[x].children||[];

            for(let y=0;y< xLen.length-1;y++){

              if(this.testObj[2].indexOf( xLen[y].label)<0){
                 // data0[x] = {...data0[x],children:null}
                 delete xLen[y].children;
              }
              yLen = xLen[y].children||[];
               for(let z=0;z< yLen.length-1;z++){

                  if(this.testObj[3].indexOf( yLen[z].label)<0){
                    // data0[x] = {...data0[x],children:null}
                    delete yLen[z].children;
                  }
                   zLen = yLen[z].children||[];
                    for(let i=0;i< zLen.length-1;i++){

                  if(this.testObj[4].indexOf( zLen[i].label)<0){
                    // data0[x] = {...data0[x],children:null}
                    delete zLen[i].children;
                  }



              }


              }

          }
           if(x==data0.length-1){

                  let newData = [{...newDataObj,children:data0}];
                  console.log(newData)
                // return newData;
                  this.$set(this,'data',newData)
            }
        }
      },
      initData() {
        this.getTreeData();
      },
      test(){

      },
      onSee(item){
        if(item&&item.url){
          window.open(item.url, "_blank");
        }
      },

      getTreeData(){
        this.nowDate  = moment().format('YYYY年MM月DD日');
        devTree({isEquip:1}).then((res) => {
          if (res.data.success === true) {
          let data = res.data.data;
            this.data = res.data.data;
           // this.doTree(data);
            this.getDataTop((data[0]||{}).code)
          }
        })
      },
      getData(code){
          filesManage({sbdm:code,pageNum:1,pageSize:10}).then((res) => {
          if (res.data.success === true) {
            console.log(res.data.data)
            let data = res.data.data;

            this.dataList6 = data.data;
            this.total3 = data.total;
          }
        })
        noList({sbdm:code}).then((res) => {
          if (res.data.success === true) {

            this.deviceImg = res.data.data.image
            this.$set(this,'deviceobj',{...res.data.data.devInfo,bz:moment().locale('zh-cn').format('YYYY-MM-DD')})
            }
        })
        groupByCode({sbdm:code}).then((res) => {
          if (res.data.success === true) {

            //  this.deviceobj = res.data.data
            let data = res.data.data;
            this.$set(this,'runList',res.data.data)
          }
        })
        queryDevSpares({devCode:code,pageNum:1,pageSize:10}).then((res) => {
          if (res.data.success === true) {
            let data = res.data.data;
            const {rows = [],total=0} = data
            this.dataList4 = rows;
            this.total2 = total;
          }
        })

        this.getLine()
        this.timer2= setInterval(() => {
          this.getLine(code)
        }, 2000);

      },
      getDataTop(code){

        devCount({proccode:code}).then((res) => {
          if (res.data.success === true) {
            // this.topdata = {total:res.data.data}
            // console.log(this.topdata)
            this.$set(this.topdata,'total',res.data.data)
            this.$forceUpdate();
          }
        })
      },
      getLine(code){

      },
      handleNodeClick(data) {
        // console.log(data);

          let imgIndex = this.centerImg.find(x=>x.label==data.label);

          if(imgIndex&&imgIndex.url){
            this.centerImgSrc = imgIndex.url;
            // console.log(this.centerImgSrc)
          }
        // if(data.label=="MEB工厂"){

        // }else if(){

        // }
        clearInterval(this.timer2);

        if(data.children&&!data.children.length){

          this.getData(data.code);
          this.showChildCard = true;
          clearInterval(this.timer);
          this.timer = setInterval(this.get, 5000);
        }else{
          this.showChildCard = false;
           clearInterval(this.timer);
        }
        this.sbdm = data.code;
        this.getDataTop(data.code)

      },

      buttonVis(index) {
        if (index == this.num) {
          return true;
        } else {
          return false;
        }
      },
      //点击按钮切换图片时，让num等于当前按钮的index值     num改变，图片也随之改变
      //此处让slide=0是为了点击瞬间切换，而不是倒退轮播图
      changeImg(index) {
        this.num = index;
        this.slide = 0;
      },
      //此方法主要用于判断图片轮播的距离
      get() {
        //获取屏幕的宽度，以实现随着页面的改变，图片滑动的距离改变
        this.screen = document.body.clientWidth * 0.4;

        if (this.showIndex == 4) {
          this.slide = 0;
          //当滑动到第四章图片时，切换的时间为0s，这样不会出现轮播倒滑的效果
          this.showIndex = 0;
        } else if(this.showIndex===null){
          this.showIndex = 0;
        }else {
          this.slide = 1;
          this.showIndex++;
          // console.log(this.num)
        }
      },
      onChangeSize1(current){

         queryDevSpares({devCode:code,pageNum:current,pageSize:10}).then((res) => {
          if (res.data.success === true) {
            let data = res.data.data;
            const {rows = [],total=0} = data
            this.dataList4 = rows;
            this.total2 = total;
          }
        })
      },
      onChangeSize2(current){
          groupByCode({devCode:code}).then((res) => {
          if (res.data.success === true) {

            let data = res.data.data;
            this.$set(this,'runList',res.data.data)
          }
        })

      },
      onChangeSize3(current){
         filesManage({sbdm:this.sbdm,pageNum:current,pageSize:10}).then((res) => {
          if (res.data.success === true) {
            console.log(res.data.data)
            let data = res.data.data;
            this.dataList6 = data.data;
          }
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .home {
    display: flex;
    flex-direction: column;
    width: 1920px;
    height: 1080px;
    background-image: url('../../assets/img/background1.png');
    background-size: cover;
  }

  .home .head-box {
    position: relative;
  }

  .home .flex-box {
    flex: 1;
    display: flex;
    padding: 30px 35px;
  }
  .flex-box .left-box{
    border: 1px solid  rgba(11,92,111,0.5);
    width: 222px;
    border-radius: 5px;
    overflow: auto;
    height: 850px;
  }
  .flex-box .left-box .el-tree{
    background: none;
    color: #fff;
    height: 100%;
    /* overflow: auto; */
  }
  /* .flex-box .left-box::-webkit-scrollbar{
    display: none;
  }

  .flex-box .left-box .el-tree::-webkit-scrollbar{
    display: none;
  }  */

  /deep/ .el-tree-node__content:hover{
    background-color: #4ec4f8;
    color: #333;
  }
  /deep/ .el-tree-node:focus>.el-tree-node__content{
    background-color: #4ec4f8;
    color: #333;
  }

  .flex-box .right-box{
    position: relative;
    margin-left: 25px;
    flex: 1;
    overflow: hidden;
  }
  .flex-box .right-box .infobox {
    width: 60%;
    margin: 0px auto;
    display: flex;
    justify-content: space-around;
  }
  .flex-box .right-box .infobox .li{
    padding: 15px;
    width: 168px;
    height: 100px;
    background: url('../../assets/img/shangqi6-2.png') no-repeat;
    border-radius: 5px;
    box-sizing: border-box;
  }
  .flex-box .right-box .infobox .li .txt{
    font-size: 14px;
    color: #a9ddee;
    line-height: 28px;
  }
  .flex-box .right-box .infobox .li .num{
    color: #4ec4f8;
    font-size: 32px;
    font-weight: bold;
  }
  .flex-box .right-box .infobox .li .num small{
    font-size: 18px;
    margin-left: 5px;
  }
  .box-tit {
    font-size: 1vw;
    line-height: 35px;
    text-align: center;
    font-weight: bold;
    /*background: linear-gradient(to bottom, #1bdffc, #0c93e8);*/
    /*-webkit-background-clip: text;*/
    /*color: transparent;*/
    color:#fff;
    padding-bottom: 5px;
  }

  .box-tit img {
    margin-right: 7px;
    position: relative;
    vertical-align: top;
  }
  .infotable{
    /* width: 670px;
    height: 450px; */
     width: 100%;
     height: 100%;
    min-height: 24vw;
    line-height: 2vw;
    padding: 0.7vw;
    padding: 0.7vw;
    background: rgba(3,49,85,0.5);
    border: 1px solid  rgba(13,111,135,0.5);
    border-radius: 5px;
    box-sizing: border-box;
  }
  .infotable table{
    width: 100%;
    border-collapse: collapse;
  }
  .infotable table th{
    color: #4ec4f8;
    background: rgba(40,74,108,0.5);
    line-height: 30px;
    text-align: center;
  }
  .infotable table td{
    color: #fff;
    padding: 0.2vw;
    text-align: center;
  }
  .infotable table td span.green{
    vertical-align: middle;
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #0bb20c;
  }
  .infotable table td span.blue{
    vertical-align: middle;
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #0c93e8;
  }

  .el-carousel__item{
    color: #475669;
    font-size: 14px;
    width: 670px;
    height: 450px;
    margin: 0;
  }
  /deep/ .el-carousel__mask{
    background-color: transparent !important;
  }
  .sbxx{
    width: calc(36vw - 30px);
    height: calc(24vw - 80px);
    padding: 10px 20px;
    position: absolute;
    display: flex;
    box-sizing: border-box;
  }
  .sbxx .list{
    margin: 0;
    padding-left: 0;
    list-style: none;
    flex: 1;
  }
  .sbxx .list li{
    line-height: 30px;
    text-align: left;
  }
  .sbxx .list li span:first-child{
    color: #fff;
    padding-right: 10px;
  }
  .sbxx .list li span:last-child{
    font-size: 14px;
    color: #4ec4f8;
  }
  .sbxx .time-box{
    position: absolute;
    left: 20px;
    bottom: 0.1vw;
    display: flex;
  }
  .sbxx .time-box .line{
    position: absolute;
    left: 0px;
    top:32px;
    width: 100%;
    height: 0px;
    border-top: 2px solid #fff;
  }
  .sbxx .time-box .case{
    padding: 0 5px;
    color: #fff;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .sbxx .time-box .case span{
    line-height: 14px;
    font-size: 12px;
  }
  .sbxx .time-box .case small{
    width: 8px;
    height: 8px;
    background: #fff;
    border-radius: 50%;
    margin: 15px auto;
  }
  .sbxx .time-box .case.active small{
    background: #4dc2f7;
    z-index: 2;
  }
  .sbxx .time-box .case .t{
    width: 1.3vw;
    height: 50px;
    /* padding: 1vw 0; */
    text-align: center;
    color: #333;
    background: #fff;
    font-size: 0.8vw;
    border-radius: 3px;
    line-height: 22px;
    margin: 0px auto;
  }
  /deep/ .el-carousel__container{
    margin-top: 200px;
  }
  .yjgl .right-table{
    width:36vw;
  }
  .sbxx.yjgl .list li{
    width: 50%;
    float: left;
  }
  .boxbg{
    position: absolute;
    left: 0px;
    top: 100px;
    bottom: 0px;
    right: 0px;
    /* background: url('../../assets/img/dc.png') center center no-repeat; */
  }


  #lunbo {
    text-align: center;
    border-radius: 1rem;
  }

/*轮播图所在容器，宽度为父容器的四倍，这里设置了4张轮播图，轮播图滑动时，一个两秒的滑动特效*/
/* 有几张轮播图宽度设置多少倍 */
.lunbo {
    display: flex;
    flex-direction: row;
}

/* 图片的宽度=1除以轮播图的张数 */
.lunbo .item{
     /* height: 100px;
     width:20%;
    position: absolute;
    right: 0;
    bottom: 0;
    opacity: 0; */
    height: 24vw;
    width:36vw;
    position: absolute;
    right: 0;
    bottom: 0;
    scale: (0.5);


}

   .box1 {position: absolute; width: 100px; height:100px;border: 1px solid #0050D0;background: #96E555; cursor: pointer;right:0;bottom:0;opacity: 0;}
 .box2 {position: absolute; width: 100px; height:100px;border: 1px solid #0050D0;background: #96E555; cursor: pointer;right:0;bottom:0;opacity: 0;}
  .box3 {position: absolute; width: 100px; height:100px;border: 1px solid #0050D0;background: #96E555; cursor: pointer;right:0;bottom:0;opacity: 0;}
    .box4 {position: absolute; width: 100px; height:100px;border: 1px solid #0050D0;background: #96E555; cursor: pointer;right:0;bottom:0;opacity: 0;}
      .box5 {position: absolute; width: 100px; height:100px;border: 1px solid #0050D0;background: #96E555; cursor: pointer;right:0;bottom:0;opacity: 0;}
.buttons {
  position: absolute;
  left: 50%;
  top: 90%;
  transform: translate(-50%, -50%);
  display: flex;
}
.button {
  display: inline-block;
  margin-left: 10px;
  width: 20px;
  height: 4px;
  border-radius: 2px;
  background-color: white;
}
.active {
  background-color: #4ec4f8;;
}

.bounce-enter-active {
  animation: bounce-in 5s;
  opacity:0;
}
.bounce-leave-active {
  animation: bounce-in 5s reverse;
  opacity:0;
}


  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }



  .is-active {
    background-color: rgba(11, 17, 29,0.6);
}
</style>
<style >
  .sbxx-form .el-form--inline .el-form-item__label {
    float: none;
    display: inline-block;
    color: #fff;
}
.sb-body .el-tree-node__label{
  font-size: 20px;
}
 .sb-body .tree{
   line-height: 40px;
 }
 .sb-body .el-tree-node__content{
   line-height: 40px;
   height: 40px;
 }
 .sb-body  .flex-box .left-box .el-tree{
   height:auto;
 }
</style>
