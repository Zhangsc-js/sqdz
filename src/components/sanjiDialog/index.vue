
<template>
  <el-dialog :title="title" :visible.sync="visible" custom-class="sanjistyle" >
    <div style="width:100%;height:100%;overflow:auto">
      <div id="sanji" :style="'width:100%;height:'+height+'px;'"></div>
    </div>
    
  </el-dialog>
</template>

<script>
import { sanKeyOption } from '@/utils/echartOption';
import echarts from 'echarts';
export default {
  naem:'sanjiDialog',
  props:{
    title:'',
    height:{
      type:Number,
      default:850,
      
    }
  },
  data(){
    return {
      visible: false,
    }
  },
  mounted(){

  },
  methods:{
    showSankey(f){

      this.visible = true;
      // console.log(this.height)
      this.$nextTick(() => {
        sanKeyOption({id:'sanji',f:f,fontSize:15});

      })
    }, 
  }
}
</script>


<style >
.sanjistyle {
  width: 1500px;
  height: 1300px;
  /* background-color: #edf0f5; */
  background-color: #566a87;
}
.sanjistyle .el-dialog__header {
  border-bottom: #e8e8e8 solid 0px
}
.sanjistyle .el-dialog__header .el-dialog__title {
  font-size: 24px;
  color:white;
  font-weight: bold;
}
</style>