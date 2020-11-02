<template>
  <el-tabs type="border-card" style="height: 100%;overflow: hidden"  @tab-click="handleTabClick">
    <el-tab-pane v-if="visiableCard('06')" label="谱系树管理" style="overflow:hidden" lazy ids="factoryMapping">
      <factory-mapping ></factory-mapping>
    </el-tab-pane>
    <el-tab-pane
      v-if="visiableCard('01') && showCards"
      label="信息管理"
      lazy
      style="overflow:hidden"
      ids="devAttrs"
    >
      <dev-attrs  :active-name="ids"></dev-attrs>
    </el-tab-pane>
    <el-tab-pane v-if="visiableCard('02')" label="运行管理" lazy ids="devWorking">
      <dev-working :showCards="showCards" :active-name="ids"></dev-working>
    </el-tab-pane>
    <el-tab-pane v-if="visiableCard('03')" label="附件管理" lazy ids="devAttachFile">
      <dev-attach-file :active-name="ids"></dev-attach-file>
    </el-tab-pane>
    <el-tab-pane v-if="visiableCard('04')"  label="组态管理" lazy ids="devImg">
      <dev-img :active-name="ids"></dev-img>
    </el-tab-pane>
    <el-tab-pane v-if="visiableCard('05') && showCards" label="参数管理" lazy ids="devParams">
      <dev-params :active-name="ids"></dev-params>
    </el-tab-pane>
    <el-tab-pane v-if="visiableCard('07') && showCards" label="备品备件管理" lazy ids="devSparePart">
      <dev-sparePart :active-name="ids"></dev-sparePart>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import DevAttrs from "./attrs/index";
import DevWorking from "./working/index";
import DevAttachFile from "./file/index";
import DevImg from "./dev-img/index";
import DevParams from "./params/index";
import FactoryMapping from "../factoryMapping";
import { getEquipCardType } from "@/api/sys/devCardType";
import DevOnOff from "./on-off-record/devOnOffRecord";
import DevSparePart from "./sparePart/index";

export default {
  name: "DevCard",
  components: {
    DevOnOff,
    DevAttrs,
    DevAttachFile,
    DevImg,
    DevParams,
    DevWorking,
    FactoryMapping,
    DevSparePart
  },
  props: {
    //  模块类型，用来判断是否加载卡片
    moduleNo: {
      type: String,
      required: false,
      default: "01"
    },
    showCards: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      cards: [],
      activeName: "devAttrs",
      ids: 'devAttrs'
    };
  },
  created() {
    if (this.moduleNo == '05') {
      this.activeName = "FactoryMapping"
    }
    this.getInitData();
  },
  methods: {
    getInitData() {
      getEquipCardType({ moduleNo: this.moduleNo }).then(response => {
        const result = response.data;
        if (result.success) {
          this.cards = result.data.map(el => {
            return el.cardNo;
          });
        } else {
          this.$message.error(result.message);
        }
      });
    },
    visiableCard(cardNo) {
      return this.cards.indexOf(cardNo) == -1 ? false : true;
    },
    handleTabClick(tab) {
      this.ids = tab.$attrs.ids
    }
  }
};
</script>

<style scoped>
.el-tabs__content {
  overflow: scroll;
  height: 100%;
}
.app-main {
  overflow: hidden;
}
</style>
