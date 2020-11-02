<template>
  <div >
    <div class="head">
      <img class="logo" @click="clickShowMenu" src="../../assets/img/logo.png" width="91" height="40"/>
      <img class="left-bgline" src="../../assets/img/left-bgline.jpg" width="607" height="29">
      <img class="right-bgline" src="../../assets/img/right-bgline.jpg" width="607" height="29">
      <div class="date">{{date}}</div>
      <div class="left-light">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="title">{{title.substring(0,1)}}<span></span>{{title.substring(1)}}</div>
      <div class="right-light">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    <div class="left-move-light"></div>
    <div class="right-move-light"></div>
    <!--<div class="centerlight"></div>-->
  </div>
</template>

<script>
export default {
  name:'headtit',
  components:{},
  props:{
    title:"",
    date:'',
  },
  name:'',
  methods:{
      clickShowMenu(){
        console.log('我点击了按钮')
         this.$store.dispatch('upAnimate',true)
      }
    }
}
</script>

<style scoped>
  .head{
    height: 90px;
    z-index: 9;
    text-align: center;
  }
  .head .logo{
    position: absolute;
    left: 50px;
    top: 15px;
  }
  .head .date{
    position: absolute;
    right: 12px;
    top: 36px;
    color: #c4f7ff;
    font-size: 17px;
  }
  .title{
    font-size: 45px;
    height: 90px;
    font-weight: bold;
    line-height: 95px;
    color: #c4f7ff;
    /*text-shadow: rgb(255, 255, 255) 0px 0px 0.1em,*/
    /*rgb(255, 255, 255) 0px 0px 0.2em,*/
    /*rgb(255, 255, 255) 0px 0px 0.3em,*/
    /*rgb(0, 0, 0) 0px 0px 0.4em;*/
    /*!*rgb(0, 207, 255) 0px 0px 0.6em,*!*/
    /*!*rgb(0, 207, 255) 0px 0px 0.8em,*!*/
    /*!*rgb(0, 207, 255) 0px 0px 1em,*!*/
    /*!*rgb(0, 207, 255) 0px 0px 1.2em,*!*/
    /*!*rgb(0, 207, 255) 0px 0px 1.4em;*!*/
  }
  .left-bgline{
    position: absolute;
    left:0px;
    top: 46px;
  }
  .right-bgline{
    position: absolute;
    right:0px;
    top: 46px;
  }
  .left-light{
    position: absolute;
    left:220px;
    top: 60px;
  }
  .right-light{
    position: absolute;
    right:220px;
    top: 60px;
  }
  .left-light span{
    position: relative;
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid #01fffd;
    border-radius: 50%;
  }
  .right-light span{
    position: relative;
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid #01fffd;
    border-radius: 50%;
  }
  .left-light span:nth-of-type(1){
    left: 0px;
    animation: light-show1 2s 0.2s alternate infinite;
    -webkit-animation: light-show1 2s 0.2s alternate infinite;
  }
  .left-light span:nth-of-type(2){
    left: 10px;
    animation: light-show2 2s 0.4s alternate infinite;
    -webkit-animation: light-show2 2s 0.4s alternate infinite;
  }
  .left-light span:nth-of-type(3){
    left: 20px;
    animation: light-show3 2s 0.6s alternate infinite;
    -webkit-animation: light-show3 2s 0.6s alternate infinite;
  }
  .left-light span:nth-of-type(4){
    left: 30px;
    animation: light-show4 2s 0.8s alternate infinite;
    -webkit-animation: light-show4 2s 0.8s alternate infinite;
  }
  /*.left-light span:nth-of-type(5){*/
    /*left: 40px;*/
    /*animation: light-show5 2s 1s alternate infinite;*/
    /*-webkit-animation: light-show5 2s 1s alternate infinite;*/
  /*}*/
  .right-light span:nth-of-type(5){
    right: 0px;
    animation: light-show1 2s 0.2s alternate infinite;
    -webkit-animation: light-show1 2s 0.2s alternate infinite;
  }
  .right-light span:nth-of-type(4){
    right: 10px;
    animation: light-show2 2s 0.4s alternate infinite;
    -webkit-animation: light-show2 2s 0.4s alternate infinite;
  }
  .right-light span:nth-of-type(3){
    right: 20px;
    animation: light-show3 2s 0.6s alternate infinite;
    -webkit-animation: light-show3 2s 0.6s alternate infinite;
  }
  .right-light span:nth-of-type(2){
    right: 30px;
    animation: light-show4 2s 0.8s alternate infinite;
    -webkit-animation: light-show4 2s 0.8s alternate infinite;
  }
  .right-light span:nth-of-type(1){
    right: 40px;
    animation: light-show5 2s 1s alternate infinite;
    -webkit-animation: light-show5 2s 1s alternate infinite;
  }
  @keyframes light-show1{
    0%{background: #01fffd;}
    80%{background: #01fffd;}
    100%{background: none;}
  }
  @-webkit-keyframes light-show1{
    0%{background: #01fffd;}
    80%{background: #01fffd;}
    100%{background: none;}
  }
  @keyframes light-show2{
    0%{background: #01fffd;}
    60%{background: #01fffd;}
    100%{background: none;}
  }
  @-webkit-keyframes light-show2{
    0%{background: #01fffd;}
    60%{background: #01fffd;}
    100%{background: none;}
  }
  @keyframes light-show3{
    0%{background: #01fffd;}
    40%{background: #01fffd;}
    100%{background: none;}
  }
  @-webkit-keyframes light-show3{
    0%{background: #01fffd;}
    40%{background: #01fffd;}
    100%{background: none;}
  }
  @keyframes light-show4{
    0%{background: #01fffd;}
    20%{background: #01fffd;}
    100%{background: none;}
  }
  @-webkit-keyframes light-show4{
    0%{background: #01fffd;}
    20%{background: #01fffd;}
    100%{background: none;}
  }
  @keyframes light-show5{
    0%{background: #01fffd;}
    100%{background: none;}
  }
  @-webkit-keyframes light-show5{
    0%{background: #01fffd;}
    100%{background: none;}
  }
  /*.centerlight{*/
    /*position: absolute;*/
    /*left:50%;*/
    /*width: 264px;*/
    /*margin-left: -132px;*/
    /*top:103px;*/
    /*height: 51px;*/
    /*background: url('../../assets/image/centerlight.png') no-repeat;*/
    /*animation: centerlight 4s alternate infinite;*/
    /*-webkit-animation: centerlight 4s alternate infinite;*/
  /*}*/
  @keyframes centerlight{
    0%{opacity: 0;}
    100%{opacity: 1;}
  }
  @-webkit-keyframes centerlight{
    0%{opacity: 0;}
    75%{opacity: 0.5;}
    100%{opacity: 1;}
  }
  .left-move-light{
    position: absolute;
    left:370px;
    top:46px;
    border-top: 2px dotted #07a1f6;
    animation: left-move-line 4s alternate infinite;
  }
  .left-move-light:after{
    content: '';
    position: absolute;
    left: 0px;
    top: -2px;
    display: block;
    height: 2px;
    width: 15px;
    background: #07a1f6;
  }
  .left-move-light:before{
    content: '';
    position: absolute;
    right: 0px;
    top: -2px;
    display: block;
    height: 2px;
    width: 15px;
    background: #07a1f6;
  }
  .right-move-light{
    position: absolute;
    right:370px;
    top:46px;
    border-top: 2px dotted #07a1f6;
    animation: right-move-line 4s alternate infinite;
  }
  .right-move-light:after{
    content: '';
    position: absolute;
    left: 0px;
    top: -2px;
    display: block;
    height: 2px;
    width: 15px;
    background: #07a1f6;
  }
  .right-move-light:before{
    content: '';
    position: absolute;
    right: 0px;
    top: -2px;
    display: block;
    height: 2px;
    width: 15px;
    background: #07a1f6;
  }
  @keyframes left-move-line{
    0%{width: 20px; }
    100%{width: 210px; }
  }
  @-webkit-keyframes left-move-line{
    0%{width: 20px; }
    100%{width: 210px; }
  }
  @keyframes right-move-line{
    0%{width: 20px;}
    100%{width: 210px; }
  }
  @-webkit-keyframes right-move-line{
    0%{width: 20px;}
    100%{width: 210px; }
  }
</style>
