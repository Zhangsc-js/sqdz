<template>
    <div id="app" style="position:relative">
        <floatmenu></floatmenu>
        <router-view>

        </router-view>
    </div>
</template>

<script>

import floatmenu from "@/views/shangqi/floatmenu";
  export default {
    name: 'app',
    components:{
        floatmenu
    },
      mounted() {
          // var w_w=$(window).width()
          // var w_h=$(window).height()
          // let self=this
          // window.onresize = () => {
          //     var w_w=$(window).width()
          //     var w_h=$(window).height()
          //     this.resize(w_w,w_h)
          // }
          // this.resize(w_w,w_h)
      },
      methods: {
          // resize(w,h){
          //     $("body").css({"transform":"scale("+ w/1920+", "+ h/1080+")"})
          // }
      }
  }
</script>
<style>
    html{
        height: 100%;
        width: 100%;
    }
    body {
        width: 1920px;
        height: 1080px;
        /* width: 100vw;
        height: 125.3vh; */
        min-height: 635px;
        /* position: relative; */
        overflow: hidden;
        transform-origin: left top;
    }
</style>
