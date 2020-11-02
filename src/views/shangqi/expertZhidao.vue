<template>
  <div class="expertZhidao">
    <img
      v-if="!isVideo"
      class="img"
      @click="isVideo=!isVideo"
      style="height:80px;width:80px;left:40%"
      src="../../assets/img/sq_phone.png"
      alt
    />
    <img
      v-if="isVideo"
      class="img"
      @click="isVideo=!isVideo"
      style="height:80px;width:80px;left:40%"
      src="../../assets/img/sq_phone(2).png"
      alt
    />
    <img
      @click="getFabric"
      class="img"
      style="right:40%;bottom:55px"
      src="../../assets/img/sq_pen.png"
      alt
    />
    <div class="imgBox11" v-if="isVideo">
      <img class src="../../assets/img/videoImg1.png" alt />
    </div>
    <!-- <img v-show="isVideo" style="right:5%" class="vidImg" src="../../assets/img/videoImg2.jpg" alt /> -->
    <!-- el -->
    <el-tree
      v-show="isVideo"
      class="vidImg"
      style="right:5%;min-height: 330px"
      :data="fileList"
      :props="flieProps"
      :render-content="renderContent"
    ></el-tree>
    <vab-player-mp4 v-if="isVideo" :config="config1" @player="Player1 = $event" />
    <!-- fabric -->
    <div class="aa" v-if="isPhone" style="height:100%;width:100%">
      <canvas style="height:100%;width:100%" id="c17" class="canvas"></canvas>
    </div>
  </div>
</template>

<script>
import { VabPlayerMp4 } from "./player";
import { fabric } from "fabric";
export default {
  props: {
    fileList: {
      required: false,
    },
    flieProps: {
      required: false
    }
  },
  components: {
    VabPlayerMp4,
  },
  data() {
    return {
      config1: {
        id: "mse1",
        url: "http://172.21.13.88:8800/data_video/zhuanjia/zj.mp4",
        // url: "https://v-cdn.zjol.com.cn/280443.mp4",
        volume: 1,
        autoplay: true,
      },
      Player1: null,
      isVideo: false,
      canvas: '',
      isPhone: false,
    }
  },
  mounted() {

  },
  methods: {
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          {data.isFile === true ?
            <span>
              <span>{node.label}</span>
              <span>
                <el-button size="mini" type="text" on-click={() => { window.open(url); }}>查看</el-button>
              </span>
            </span>
            : <span>{node.label}</span>
          }
        </span>);
    },
    getFabric() {
      if (!this.isPhone) {
        this.isPhone = true
        this.$nextTick(() => {
          this.canvas = new fabric.Canvas("c17");
          this.canvas.isDrawingMode = true;
          this.canvas.freeDrawingBrush.color = "red";

        })
      } else {
        this.removeAll()
      }
    },
    remove() {
      let lastItemIndex = this.canvas.getObjects().length - 1;
      let item = this.canvas.item(lastItemIndex);
      this.canvas.remove(item);
      this.canvas.renderAll();
    },
    removeAll() {
      let sum = this.canvas.getObjects().length;
      for (var i = 0; i < sum; i++) {
        this.remove();
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.el-tree {
  background-color: rgba(0, 0, 0, 0.5);
}
.expertZhidao {
  width: 100%;
  //   height: 270px;
  //   background-color: pink;
  height: 100%;
}
.xgplayer.xgplayer-pc.xgplayer-skin-default {
  height: 100% !important;
  padding-top: 0 !important;
}
.sq_svg {
  font-size: 50px;
  fill: #fff;
}
.img {
  width: 60px;
  height: 60px;
  position: absolute;
  bottom: 50px;
  z-index: 2;
}
.vidImg {
  width: 300px;
  //   height: 300px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
}
.rotate {
  transform: translateY(-50%);
}
.aa {
  position: absolute;
  //   z-index: 8888;
  top: 0;
}
.imgBox11 {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  padding: 20px;
  width: 300px;
  //   height: 300px;
  background-color: rgba(0, 0, 0, 0.5);
  img {
    width: 100%;
    height: 300px;
  }
}
</style>
<style lang="scss">
.canvas-container {
  height: 100% !important;
  width: 100% !important;
  canvas {
    height: 100% !important;
    width: 100% !important;
  }
}
</style>
