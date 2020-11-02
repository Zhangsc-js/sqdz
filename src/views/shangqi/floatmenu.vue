<template>
    <div class="floatmenu" :class="{'menu_click' :animate  }" @mouseenter="MenuInter" @mouseleave="MenuLeave">
        <div @click="gotolink(item.path)"  class="item" v-for="(item,index) in infolist" :key="index">
            <img class="img" :src="item.imgsrc">
            <div class="info">{{item.tit}}</div>
        </div>
        <div class="item" @click="loginIntoHref()">
            
                 <img class="img" :src="require('@/assets/img/weihu.png')">
                <div class="info">{{"维护"}}</div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
    computed: {
        animate: function(){
           return  this.$store.state.floatMenu.animate 
        }
    },
    watch: {
        animate:{
            immediate:true,
            handler(val){
                return val;
            }
        }
    },

    data(){
        return{
            infolist:[{
                tit:'总览',
                imgsrc:require('@/assets/img/zonglan.png'),
                path:'/'
            },{
                tit:'冲压',
                imgsrc:require('@/assets/img/chongya.png'),
                path:'shangqi2'
            },{
                tit:'车身',
                imgsrc:require('@/assets/img/data-icons/cheshen.png'),
                path:'shangqi3'
            },{
                tit:'油漆',
                imgsrc:require('@/assets/img/data-icons/menu1.jpg'),
                path:'shangqi5'
            },{
                tit:'总装',
                imgsrc:require('@/assets/img/data-icons/menu7.jpg'),
                path:'shangqi'
            },{
                tit:'电池',
                imgsrc:require('@/assets/img/shangqi5-8.png'),
                path:'shangqi4'
            },{
                tit:'高架库',
                imgsrc:require('@/assets/img/data-icons/menu6.jpg'),
                path:'shangqi8'
            },{
                tit:'物流',
                imgsrc:require('@/assets/img/data-icons/menu4.jpg'),
                path:'shangqi9'
            },{
                tit:'设备树',
                imgsrc:require('@/assets/img/data-icons/menu9.jpg'),
                path:'shangqi7'
            },{
                tit:'产品',
                imgsrc:require('@/assets/img/data-icons/menu5.jpg'),
                path:'shangqi6'
            }]
        }
      },
      methods:{
          MenuInter(){

          },
          MenuLeave(){
            this.$store.dispatch('upAnimate',false)
          },
          gotolink(path){
              console.log('我在前')
              this.$router.push(path)
          },
          loginIntoHref(){
              window.location.href="LoginInto://"
          }
      }
}
</script>
<style scoped>
    .floatmenu{
        position: absolute;
        left: -100px;
        top: 20px;
        bottom: 0px;
        width: 110px;
        background: rgba(0,0,0,0.5);
        transition: all 0.5s;
        z-index: 99;
        text-align: center;
        padding: 0 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        /* background-color: red; */
    }
    .menu_click {
        position: absolute;
        left: 0px;
    }
    .floatmenu:hover{
        position: absolute;
        left: 0px;
    }
    .floatmenu .item{
        padding: 6px;
        border-bottom: none;
        cursor: pointer;
        background: url("../../assets/img/data-icons/menubg.jpg") no-repeat;
        background-size: 100% 100%;
        margin: 5px 0;
    }
    .floatmenu img{
        width: 40px;
        height: 40px;
    }
    .floatmenu .info{
        color: #fff;
        margin-top: 5px;
        font-size: 18px;
    }
</style>
