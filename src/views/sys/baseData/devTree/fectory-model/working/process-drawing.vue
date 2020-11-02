<template>
  <div style="height:100%; width: 100%">
    <div>
      <el-row>
        <el-col :span="6">
          <span>请选择组态：</span>
          <el-select v-model="value" @change="handleChange" placeholder="请选择组态">
            <el-option
              v-for="item in options"
              :key="item.hmiUrl"
              :label="item.hmiName"
              :value="item.hmiUrl">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="rightClick">在新页面打开</el-button>
        </el-col>
      </el-row>
    </div>
    <div style="height:100%; width: 100%" >
      <iframe :src="processImgUrl" style="height:100%; width: 100%"></iframe>
    </div>
  </div>
</template>

<script>
import { reQueryHmi } from "@/api/sys/dev";
import { isNotEmpty, isEmptyArray } from "@/utils/index";

export default {
  name: "DevPhoto",
  data() {
    return {
      dialogVisible: false,
      fit: "fill",
      url: "",
      srcList: [],
      show: false,
      processImgUrl: "",
      options: [],
      value: null,
      currActiveName: "processDrawing"
    };
  },
  props: {
    activeName: {
      type: String,
      required: true,
      default: ""
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
        this.processImgUrl = ''
        this.value = null
        this.init()
      }
    },
    activeName() {
      if (this.activeName == this.currActiveName) {
        this.processImgUrl = ''
        this.value = null
        this.init()
      }
    }
  },
  mounted() {
    if (isNotEmpty(this.selectNodeNO)) {
      this.init()
    }
  },
  methods: {
    init() {
      const params = {
        devCode: this.selectNodeNO
      }
      reQueryHmi(params).then(response => {
        const result = response.data
        if (result.success) {
          this.options = result.data
          if (!isEmptyArray(this.options)) {
            this.value = this.options[0].hmiUrl
            this.processImgUrl = this.options[0].hmiUrl
          }
        } else {
          this.$message.error(result.message)
        }
      
      })
    },
    handleChange(v) {
      this.processImgUrl = v
    },
    rightClick() {
      if (isNotEmpty(this.processImgUrl)) {
        window.open(this.processImgUrl, "_blank");
      }
    }
  }
};
</script>

<style scoped>
.el-col button {
  margin: 0px 0px 0px 0px;
}
</style>
