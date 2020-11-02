<template>
  <div class="specificInfo">
    <div v-if="+device.isElect == 1">
      <el-divider content-position="left" style="width:100%">{{ '电表' }}</el-divider>
      <el-form
        :model="electricForm"
        ref="electricForm"
        class="demo-form-inline"
        label-width="140px"
        label-position="right"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="电表类型：" prop>
              <span v-show="electricEdit">{{ formatData(electricType, electricForm.elecDevType) }}</span>
              <el-select v-show="!electricEdit" v-model="electricForm.elecDevType" clearable>
                <el-option
                  v-for="item in electricType"
                  :key="item.code"
                  :label="item.label"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作原理：" prop="workTheory">
              <span v-show="electricEdit">{{ formatData(elecWorkTheory ,electricForm.workTheory)}}</span>
              <el-select v-show="!electricEdit" v-model="electricForm.workTheory" clearable>
                <el-option
                  v-for="item in elecWorkTheory"
                  :key="item.code"
                  :label="item.label"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="测量范围：" prop="range">
              <span v-show="electricEdit">{{electricForm.range}}</span>
              <el-input v-show="!electricEdit" v-model="electricForm.range"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="精确度：" prop="accuracy">
              <span v-show="electricEdit">{{electricForm.accuracy}}</span>
              <el-input v-show="!electricEdit" v-model="electricForm.accuracy"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-row style="text-align:center;padding:0 8px">
            <el-button
              v-show="electricEdit"
              type="primary"
              icon="el-icon-edit"
              @click="electricEdit = false"
            >更新</el-button>
            <el-button
              v-show="!electricEdit"
              type="primary"
              icon="el-icon-check"
              @click="electricSave"
            >保存</el-button>
            <el-button
              v-show="!electricEdit"
              type="primary"
              icon="el-icon-close"
              @click="cancel('electricEdit')"
            >取消</el-button>
          </el-row>
        </el-row>
      </el-form>
    </div>
    <div v-if="+device.isWater ==1">
      <el-divider content-position="left" style="width:100%">{{ '水表' }}</el-divider>
      <el-form
        :model="waterForm"
        ref="waterForm"
        class="demo-form-inline"
        label-width="140px"
        label-position="right"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="水表类型：" prop="waterDevType">
              <span v-show="waterEdit">{{ formatData(waterDevType, waterForm.waterDevType) }}</span>
              <el-select v-show="!waterEdit" v-model="waterForm.waterDevType" clearable>
                <el-option
                  v-for="item in waterDevType"
                  :key="item.code"
                  :label="item.label"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示方式：" prop="viewType">
              <span v-show="waterEdit">{{formatData(waterDevViewType, waterForm.viewType) }}</span>
              <el-select v-show="!waterEdit" v-model="waterForm.viewType" clearable>
                <el-option
                  v-for="item in waterDevViewType"
                  :key="item.code"
                  :label="item.label"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="最大量程：" prop="range">
              <span v-show="waterEdit">{{waterForm.range}}</span>
              <el-input v-show="!waterEdit" v-model="waterForm.range"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="口径：" prop="bore">
              <span v-show="waterEdit">{{waterForm.bore}}</span>
              <el-input v-show="!waterEdit" v-model="waterForm.bore"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="最小流量：" prop="minFlow">
              <span v-show="waterEdit">{{waterForm.minFlow}}</span>
              <el-input v-show="!waterEdit" v-model="waterForm.minFlow"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="常用流量：" prop="commonFlow">
              <span v-show="waterEdit">{{waterForm.commonFlow}}</span>
              <el-input v-show="!waterEdit" v-model="waterForm.commonFlow"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="过载流量：" prop="maxFlow">
              <span v-show="waterEdit">{{waterForm.maxFlow}}</span>
              <el-input v-show="!waterEdit" v-model="waterForm.maxFlow"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-row style="text-align:center;padding:0 8px">
            <el-button
              v-show="waterEdit"
              type="primary"
              icon="el-icon-edit"
              @click="waterEdit = false"
            >更新</el-button>
            <el-button v-show="!waterEdit" type="primary" icon="el-icon-check" @click="waterSave">保存</el-button>
            <el-button
              v-show="!waterEdit"
              type="primary"
              icon="el-icon-close"
              @click="cancel('waterEdit')"
            >取消</el-button>
          </el-row>
        </el-row>
      </el-form>
    </div>
    <div v-if="+device.isGas == 1">
      <el-divider content-position="left" style="width:100%">{{ '气表' }}</el-divider>
      <el-form
        :model="gasForm"
        ref="gasForm"
        class="demo-form-inline"
        label-width="140px"
        label-position="right"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="最小流量：" prop="minFlow">
              <span v-show="gasEdit">{{gasForm.minFlow}}</span>
              <el-input v-show="!gasEdit" v-model="gasForm.minFlow"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大流量：" prop>
              <span v-show="gasEdit">{{gasForm.maxFlow}}</span>
              <el-input v-show="!gasEdit" v-model="gasForm.maxFlow"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="最大工作压力：" label-width="130px" prop="maxWorkPress">
              <span v-show="gasEdit">{{gasForm.maxWorkPress}}</span>
              <el-input v-show="!gasEdit" v-model="gasForm.maxWorkPress"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="压力损失：" prop="pressLoss">
              <span v-show="gasEdit">{{gasForm.pressLoss}}</span>
              <el-input v-show="!gasEdit" v-model="gasForm.pressLoss"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="基本误差：" prop="basicOffect">
              <span v-show="gasEdit">{{gasForm.basicOffect}}</span>
              <el-input v-show="!gasEdit" v-model="gasForm.basicOffect"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密封性：" prop="tightness">
              <span v-show="gasEdit">{{gasForm.tightness}}</span>
              <el-input v-show="!gasEdit" v-model="gasForm.tightness"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="表接头螺纹：" prop="screwThread">
              <span v-show="gasEdit">{{gasForm.screwThread}}</span>
              <el-input v-show="!gasEdit" v-model="gasForm.screwThread"></el-input>
            </el-form-item>
            <el-form-item label="接头中心距：" prop="spacing">
              <span v-show="gasEdit">{{gasForm.spacing}}</span>
              <el-input v-show="!gasEdit" v-model="gasForm.spacing"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-row style="text-align:center;padding:0 8px">
            <el-button
              v-show="gasEdit"
              type="primary"
              icon="el-icon-edit"
              @click="gasEdit = false"
            >更新</el-button>
            <el-button v-show="!gasEdit" type="primary" icon="el-icon-check" @click="gasSave">保存</el-button>
            <el-button
              v-show="!gasEdit"
              type="primary"
              icon="el-icon-close"
              @click="cancel('gasEdit')"
            >取消</el-button>
          </el-row>
        </el-row>
      </el-form>
    </div>
    <div v-if="+device.isjl == 1 || +device.isjj == 1">
      <el-divider content-position="left" style="width:100%">{{ '检斤/计量' }}</el-divider>
      <el-form
        :model="materageForm"
        ref="materageForm"
        class="demo-form-inline"
        label-width="140px"
        label-position="right"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="计量范围：" prop="range">
              <span v-show="materageEdit">{{materageForm.range}}</span>
              <el-input v-show="!materageEdit" v-model="materageForm.range"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="误差值：" prop="offset">
              <span v-show="materageEdit">{{materageForm.offset}}</span>
              <el-input v-show="!materageEdit" v-model="materageForm.offset"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="分度值：" prop="scaleInterval">
              <span v-show="materageEdit">{{materageForm.scaleInterval}}</span>
              <el-input v-show="!materageEdit" v-model="materageForm.scaleInterval"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="精确值：" prop="accuracy">
              <span v-show="materageEdit">{{materageForm.accuracy}}</span>
              <el-input v-show="!materageEdit" v-model="materageForm.accuracy"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-row style="text-align:center;padding:0 8px">
            <el-button
              v-show="materageEdit"
              type="primary"
              icon="el-icon-edit"
              @click="materageEdit = false"
            >更新</el-button>
            <el-button
              v-show="!materageEdit"
              type="primary"
              icon="el-icon-check"
              @click="materageSave"
            >保存</el-button>
            <el-button
              v-show="!materageEdit"
              type="primary"
              icon="el-icon-close"
              @click="cancel('materageEdit')"
            >取消</el-button>
          </el-row>
        </el-row>
      </el-form>
    </div>
    <div v-if="+device.iscg == 1">
      <el-divider content-position="left" style="width:100%">{{ '槽罐' }}</el-divider>
      <el-form
        :model="potForm"
        ref="potForm"
        class="demo-form-inline"
        label-width="140px"
        label-position="right"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="容积：" prop="volume">
              <span v-show="potEdit">{{potForm.volume}}</span>
              <el-input v-show="!potEdit" v-model="potForm.volume"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="壁厚：" prop="wallThickness">
              <span v-show="potEdit">{{potForm.wallThickness}}</span>
              <el-input v-show="!potEdit" v-model="potForm.wallThickness"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="最大充装量：" prop="maxFillVolume">
              <span v-show="potEdit">{{potForm.maxFillVolume}}</span>
              <el-input v-show="!potEdit" v-model="potForm.maxFillVolume"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="水压试验压力：" label-width="140px" prop="waterPress">
              <span v-show="potEdit">{{potForm.waterPress}}</span>
              <el-input v-show="!potEdit" v-model="potForm.waterPress"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="气密性试验压力：" label-width="140px" prop="gasTightness">
              <span v-show="potEdit">{{potForm.gasTightness}}</span>
              <el-input v-show="!potEdit" v-model="potForm.gasTightness"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="进口1：" prop="in1">
              <span v-show="potEdit">{{potForm.in1}}</span>
              <el-input v-show="!potEdit" v-model="potForm.in1"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="进口2：" prop="in2">
              <span v-show="potEdit">{{potForm.in2}}</span>
              <el-input v-show="!potEdit" v-model="potForm.in2"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="进口3：" prop="in3">
              <span v-show="potEdit">{{potForm.in3}}</span>
              <el-input v-show="!potEdit" v-model="potForm.in3"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="进口4：" prop="in4">
              <span v-show="potEdit">{{potForm.in4}}</span>
              <el-input v-show="!potEdit" v-model="potForm.in4"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="进口5：" prop="in5">
              <span v-show="potEdit">{{potForm.in5}}</span>
              <el-input v-show="!potEdit" v-model="potForm.in5"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="出口1：" prop="out1">
              <span v-show="potEdit">{{potForm.out1}}</span>
              <el-input v-show="!potEdit" v-model="potForm.out1"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出口2：" prop="out2">
              <span v-show="potEdit">{{potForm.out2}}</span>
              <el-input v-show="!potEdit" v-model="potForm.out2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="出口3：" prop="out3">
              <span v-show="potEdit">{{potForm.out3}}</span>
              <el-input v-show="!potEdit" v-model="potForm.out3"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出口4：" prop="out4">
              <span v-show="potEdit">{{potForm.out4}}</span>
              <el-input v-show="!potEdit" v-model="potForm.out4"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="出口5：" prop="out5">
              <span v-show="potEdit">{{potForm.out5}}</span>
              <el-input v-show="!potEdit" v-model="potForm.out5"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-row style="text-align:center;padding:0 8px">
            <el-button
              v-show="potEdit"
              type="primary"
              icon="el-icon-edit"
              @click="potEdit = false"
            >更新</el-button>
            <el-button v-show="!potEdit" type="primary" icon="el-icon-check" @click="potSave">保存</el-button>
            <el-button
              v-show="!potEdit"
              type="primary"
              icon="el-icon-close"
              @click="cancel('potEdit')"
            >取消</el-button>
          </el-row>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getDevTreeNode } from "@/api/sys/dev";
import { isEmptyArray } from "@/utils";

import {
  findExtendElectric,
  updateExtendElectric,
  saveExtendElectric,
  findExtendGas,
  updateExtendGas,
  saveExtendGas,
  findExtendMater,
  updateExtendMater,
  saveExtendMater,
  findExtendPot,
  updateExtendPot,
  saveExtendPot,
  findExtendWater,
  updateExtendWater,
  saveExtendWater,
  getWaterSelectMap,
  getElectSelectMap
} from "@/api/sys/dev/info";

export default {
  data() {
    return {
      electricForm: {
        devCode: "",
        elecDevType: "",
        workTheory: "",
        range: "",
        accuracy: ""
      },
      gasForm: {
        devCode: "",
        minFlow: "",
        maxFlow: "",
        maxWorkPress: "",
        pressLoss: "",
        basicOffect: "",
        tightness: "",
        screwThread: "",
        spacing: ""
      },
      materageForm: {
        devCode: "",
        range: "",
        offset: "",
        scaleInterval: "",
        accuracy: ""
      },
      potForm: {
        devCode: "",
        volume: "",
        wallThickness: "",
        maxFillVolume: "",
        waterPress: "",
        gasTightness: "",
        in1: "",
        in2: "",
        in3: "",
        in4: "",
        in15: "",
        out1: "",
        out2: "",
        out3: "",
        out4: "",
        out5: ""
      },
      waterForm: {
        devCode: "",
        waterDevType: "",
        viewType: "",
        range: "",
        bore: "",
        minFlow: "",
        commonFlow: "",
        maxFlow: ""
      },
      electricEdit: true,
      gasEdit: true,
      waterEdit: true,
      materageEdit: true,
      potEdit: true,
      device: {},
      electricType: [],
      elecWorkTheory: [],
      waterDevType: [],
      waterDevViewType: [],
      currActiveName: "devAttrs"
    };
  },
  props: {
    activeName: {
      type: String,
      required: true,
      default: ''
    }
  },
  computed: {
    selectNodeNO() {
      return this.$store.state.sysDev.selectNodeNO;
    }
  },
  watch: {
    selectNodeNO() {
      if (this.activeName == this.currActiveName) {
        this.init();
      }
    },
    activeName() {
      if (this.activeName == this.currActiveName) {
        this.init();
      }
    }
  },
  created() {
    this.getSelectMap();
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (!this.selectNodeNO) return;
      getDevTreeNode(this.selectNodeNO)
        .then(response => {
          const result = response.data;
          if (result.success) {
            this.device = result.data;
          } else {
            this.$message.error(result.message);
          }
        })
        .then(() => {
          this.getData();
        });
    },
    getSelectMap() {
      getWaterSelectMap().then(res => {
        const result = res.data;
        if (result.success) {
          this.waterDevType = result.data.waterDevType;
          this.waterDevViewType = result.data.waterDevViewType;
        } else {
          this.$message.error(result.message);
        }
      });
      getElectSelectMap().then(res => {
        const result = res.data;
        if (result.success) {
          this.electricType = result.data.electricType;
          this.elecWorkTheory = result.data.elecWorkTheory;
        } else {
          this.$message.error(result.message);
        }
      });
    },
    getData() {
      if (!this.selectNodeNO) return;
      if (+this.device.isElect == 1) {
        this.getElectData();
      }
      if (+this.device.isWater == 1) {
        this.getWaterData();
      }
      if (+this.device.isGas == 1) {
        this.getGasData();
      }
      if (+this.device.isjl == 1 || +this.device.isjj == 1) {
        this.getMaterageData();
      }
      if (+this.device.iscg == 1) {
        this.getPotData();
      }
    },
    getElectData() {
      findExtendElectric({ devCode: this.selectNodeNO }).then(res => {
        const result = res.data;
        if (result.success) {
          this.electricForm = Object.assign({}, result.data);
        } else {
          this.$message.error(result.message);
        }
      });
    },
    getWaterData() {
      findExtendWater({ devCode: this.selectNodeNO }).then(res => {
        const result = res.data;
        if (result.success) {
          this.waterForm = Object.assign({}, result.data);
        } else {
          this.$message.error(result.message);
        }
      });
    },
    getGasData() {
      findExtendGas({ devCode: this.selectNodeNO }).then(res => {
        const result = res.data;
        if (result.success) {
          this.gasForm = Object.assign({}, result.data);
        } else {
          this.$message.error(result.message);
        }
      });
    },
    getMaterageData() {
      findExtendMater({ devCode: this.selectNodeNO }).then(res => {
        const result = res.data;
        if (result.success) {
          this.materageForm = Object.assign({}, result.data);
        } else {
          this.$message.error(result.message);
        }
      });
    },
    getPotData() {
      findExtendPot({ devCode: this.selectNodeNO }).then(res => {
        const result = res.data;
        if (result.success) {
          this.potForm = Object.assign({}, result.data);
        } else {
          this.$message.error(result.message);
        }
      });
    },
    potSave() {
      this.potForm.devCode = this.selectNodeNO;
      if (this.potForm.id) {
        updateExtendPot(this.potForm).then(res => {
          const result = res.data;
          if (result.success) {
            this.$message.success("保存成功");
            this.potEdit = !this.potEdit;
          } else {
            this.$message.error(result.message);
          }
        });
      } else {
        saveExtendPot(this.potForm).then(res => {
          const result = res.data;
          if (result.success) {
            this.$message.success("保存成功");
            this.potForm = result.data;
            this.potEdit = !this.potEdit;
          } else {
            this.$message.error(result.message);
          }
        });
      }
    },
    materageSave() {
      this.materageForm.devCode = this.selectNodeNO;
      if (this.materageForm.id) {
        updateExtendMater(this.materageForm).then(res => {
          const result = res.data;
          if (result.success) {
            this.$message.success("保存成功");
            this.materageEdit = !this.materageEdit;
          } else {
            this.$message.error(result.message);
          }
        });
      } else {
        saveExtendMater(this.materageForm).then(res => {
          const result = res.data;
          if (result.success) {
            this.$message.success("保存成功");
            this.materageForm = result.data;
            this.materageEdit = !this.materageEdit;
          } else {
            this.$message.error(result.message);
          }
        });
      }
    },
    gasSave() {
      this.gasForm.devCode = this.selectNodeNO;
      if (this.gasForm.id) {
        updateExtendGas(this.gasForm).then(res => {
          const result = res.data;
          if (result.success) {
            this.$message.success("保存成功");
            this.gasEdit = !this.gasEdit;
          } else {
            this.$message.error(result.message);
          }
        });
      } else {
        saveExtendGas(this.gasForm).then(res => {
          const result = res.data;
          if (result.success) {
            this.$message.success("保存成功");
            this.gasForm = result.data;
            this.gasEdit = !this.gasEdit;
          } else {
            this.$message.error(result.message);
          }
        });
      }
    },
    waterSave() {
      this.waterForm.devCode = this.selectNodeNO;
      if (this.waterForm.id) {
        updateExtendWater(this.waterForm).then(res => {
          const result = res.data;
          if (result.success) {
            this.$message.success("保存成功");
            this.waterEdit = !this.waterEdit;
          } else {
            this.$message.error(result.message);
          }
        });
      } else {
        saveExtendWater(this.waterForm).then(res => {
          const result = res.data;
          if (result.success) {
            this.$message.success("保存成功");
            this.waterForm = result.data;
            this.waterEdit = !this.waterEdit;
          } else {
            this.$message.error(result.message);
          }
        });
      }
    },
    electricSave() {
      this.electricForm.devCode = this.selectNodeNO;
      if (this.electricForm.id) {
        updateExtendElectric(this.electricForm).then(res => {
          const result = res.data;
          if (result.success) {
            this.$message.success("保存成功");
            this.electricEdit = !this.electricEdit;
          } else {
            this.$message.error(result.message);
          }
        });
      } else {
        saveExtendElectric(this.electricForm).then(res => {
          const result = res.data;
          if (result.success) {
            this.$message.success("保存成功");
            this.electricForm = result.data;
            this.electricEdit = !this.electricEdit;
          } else {
            this.$message.error(result.message);
          }
        });
      }
    },
    formatData(opts, val) {
      if (isEmptyArray(opts)) {
        return val;
      }
      let res = val;
      opts.forEach(e => {
        if (e.code == val) {
          res = e.label;
          return;
        }
      });
      return res;
    },
    cancel(type) {
      this.init();
      this[type] = true;
      this.$message.info("已取消");
    }
  }
};
</script>

<style scoped>
.el-input {
  width: calc(100% - 120px);
}
</style>
