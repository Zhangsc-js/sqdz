
<template>
  <el-dialog class="pieDialog" :title="dialogTit" :visible.sync="visible" custom-class="pie_tyle">
    <div style="text-align:center">
      <el-radio-group style="margin-left:10px" v-model="txfx" @change="changRadio">
        <el-radio label="类型"></el-radio>
        <el-radio label="区域"></el-radio>
      </el-radio-group>
    </div>
    <div v-if="txfx==hasData" id="onePieDialog" class="onePieDialog"></div>
  </el-dialog>
</template>

<script>
import { onePieEchartOption, twoPieEchartOption } from '@/utils/echartOption';
import echarts from 'echarts';
export default {
  naem: 'sanjiDialog',
  props: {
    title: '',
    hasData: {
      require: false
    }
  },
  data() {
    return {
      visible: false,
      txfx: '类型',
      dataSheet: [
        { name: 'CY', has: '类型' },
        { name: '车身', has: '区域' },
        { name: 'YQ', has: '区域' },
        { name: 'ZZ', has: '区域' },
        { name: 'DC', has: '区域' },
        { name: 'GJK', has: '类型' },
        { name: 'BDC', has: '类型' },
        { name: 'DCK', has: '类型' },
      ],
      chartData: null
    }
  },
  mounted() {

  },
  methods: {
    onePieDialog(f) {
      this.visible = true;
      this.chartData = f
      this.$nextTick(() => {
        if (this.txfx == this.hasData) {
          onePieEchartOption({ id: 'onePieDialog', inData: f, name: '', width: '50%', legend: true });
        }
      })
    },
    twoPieDialog(f1, f2) {
      this.visible = true;
      this.$nextTick(() => {
        if (this.txfx == this.hasData) {
          twoPieEchartOption({ id: 'onePieDialog', inData: f1, outData: f2, legend: true });
        }
      })
    },
    changRadio() {
      this.$nextTick(() => {
        if (this.txfx == this.hasData) {
          onePieEchartOption({ id: 'onePieDialog', inData: this.chartData, name: '', width: '50%', legend: true });
        }
      })
    }
  },
  computed: {
    dialogTit() {
      if (this.txfx == this.hasData) {
        return this.title
      } else {
        return this.title + '/在建'
      }
    }
  }
}
</script>


<style >
.pie_tyle {
  width: 1100px;
  height: 750px;
  display: block;
  /* background-color: #edf0f5; */
  background-color: #566a87;
}
.pie_tyle .el-dialog__header {
  border-bottom: #e8e8e8 solid 0px;
}
.onePieDialog {
  height: 700px;
  width: 100%;
}
.pie_tyle .el-dialog__header .el-dialog__title {
  font-size: 24px;
  color: white;
  font-weight: bold;
}
.pieDialog .el-radio {
  color: #fff;
}
.pieDialog .el-radio__input.is-checked + .el-radio__label {
  color: #fff;
}
</style>
