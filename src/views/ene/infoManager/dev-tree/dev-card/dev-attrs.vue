<template>
  <div>
    <div v-if="showInfo">
      <div>
        <el-button
          v-show="!flag"
          type="primary"
          @click="eneDevAdd()"
          icon="el-icon-edit"
          :disabled="isAble"
        >更新</el-button>
      </div>
      <div>
        <el-button v-show="flag" type="primary" @click="eneDevUp" icon="el-icon-edit">更新</el-button>
        <el-button v-show="flag" type="danger" @click="eneDevDelete" icon="el-icon-delete">删除</el-button>
      </div>
      <el-divider content-position="left"></el-divider>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="grid-content">
            <b>实物图片：</b>
            <span v-if="proImgList.length==0">无</span>
            <img
              width="200px"
              style="vertical-align:middle;margin:20px"
              v-if="proImgList.length>0"
              :src="proImgList[0].url"
              alt="proImgList[0].name"
              @click="handlePictureCardPreview(proImgList[0].url)"
            />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content">
            <b>设备名称：</b>
            {{ tableData.sbmc }}
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content">
            <b>设备英文：</b>
            {{ tableData.sbmcEn }}
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content">
            <b>设备代码：</b>
            {{ tableData.sbdm}}
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content">
            <b>规格型号：</b>
            {{ tableData.standard}}
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content">
            <b>测量范围：</b>
            {{ tableData.measureScope}}
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content">
            <b>使用车间：</b>
            {{tableData.useWorkshop}}
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content">
            <b>使用单位：</b>
            {{tableData.useDepartment}}
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content">
            <b>使用工序：</b>
            {{tableData.useProcess}}
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content">
            <b>上报周期：</b>
            {{tableData.cycleReport}}
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content">
            <b>计量上限：</b>
            {{tableData.meteringUpper}}
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content">
            <b>计量下限：</b>
            {{tableData.meteringLower}}
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content">
            <b>ABC分类：</b>
            {{tableData.abcFl}}
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content">
            <b>精度：</b>
            {{tableData.jd}}
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content">
            <b>出厂时间：</b>
            {{tableData.ccTime}}
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content">
            <b>出厂编号：</b>
            {{tableData.ccCode}}
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content">
            <b>备注：</b>
            {{tableData.bz}}
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="65%">
      <devUpd @hidenDialog="hidenDialog" :selectNo="selectNo" :equipId="equipId" />
    </el-dialog>
    <el-dialog :title="title" :visible.sync="addDialogVisible" width="65%">
      <devAdd @hidenDialog="hidenDialog" :selectNo="selectNo" :devName="devName" />
    </el-dialog>
    <!--
    <el-dialog :title="title" :visible.sync="dialogVisible" width="65%">
      <devUpd @hidenDialog="hidenDialog" :selectNo="selectNo" :equipId="equipId"/>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="addDialogVisible" width="65%">
      <devAdd @hidenDialog="hidenDialog" :selectNo="selectNo" :devName="devName"/>
    </el-dialog>
    -->
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import devUpd from "@/views/ene/infoManager/dev-tree/dev-card/devUpd.vue";
import devAdd from "@/views/ene/infoManager/dev-tree/dev-card/devAdd.vue";
import { delDev } from "@/api/energy";
const { mapMutations, mapState, mapActions } = createNamespacedHelpers(
  "eneDev"
);

export default {
  name: "dev-attrs",
  components: {
    devUpd,
    devAdd
  },
  data() {
    let flag = this.flag;
    return {
      isAble: flag,
      dialogVisible: false,
      addDialogVisible: false,
      disabled: false,
      title: ""
    };
  },
  computed: {
    ...mapState([
      "tableData",
      "selectNo",
      "showInfo",
      "flag",
      "proImgList",
      "devName",
      "equipId"
    ])
  },
  watch: {},
  mounted() {},
  methods: {
    ...mapMutations(["SET_PROIMG_LIST"]),
    ...mapActions(["findMetering", "getDevImgX"]),
    eneDevUp() {
      this.title = "设备编辑页面";
      this.dialogVisible = true;
      this.disabled = true;
    },
    eneDevAdd() {
      this.title = "设备添加页面";
      this.disabled = true;
      this.addDialogVisible = true;
    },
    //删除设备信息以及相关的图片
    eneDevDelete() {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delDev(this.equipId)
            .then(res => {
              if (res.data.success) {
                // this.getEneDevTree();
                // this.findMeteringInfo(this.selectNo);
                this.findMetering(this.selectNo);
                const params = {
                  sbdm: this.selectNo,
                  fileType: 3
                };
                this.getDevImgX(params);

                // ================================================
                this.SET_PROIMG_LIST([]);
                this.$message.success("删除成功!");
              } else {
                this.$message.error("删除失败!");
              }
            })
            .catch(e => {
              this.$message.error(e.message);
            });
        })
        .catch(e => {
          this.$message.info(e.message);
        });
    },
    hidenDialog() {
      this.dialogVisible = false;
      this.addDialogVisible = false;
      // this.findMeteringInfo(this.selectNo);
      this.findMetering(this.selectNo); //tableData
      // this.getDevImg(); //图片
      const params = {
        sbdm: this.selectNo,
        fileType: 3
      };
      this.getDevImgX(params);
    }
  }
};
</script>

<style lang="scss" scoped>
.treeAdd {
  padding: 20px;
}

.contextmenu {
  margin: 0;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

  li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;
    &:hover {
      background: #eee;
    }
  }
}

.el-col {
  margin-bottom: 20px;
  width: 100%;
  margin: 0;
  padding: 0;
  text-decoration: none;
  list-style: none;
  border: 0;
  font-family: Arial, "\5FAE\8F6F\96C5\9ED1";
  outline: none;
  .grid-content {
    text-align: left;
    margin-left: 100px;
    b {
      font-weight: 400;
      font-size: 14px;
    }
  }
}

.grid-content {
  padding: 0 12px;
  border-radius: 4px;
  min-height: 36px;
  line-height: 36px;
}

.span {
  display: inline-block;
  width: 120px;
}

.tableshadow {
  height: 100%;
}

.el-tab-pane {
  position: fixed;
  top: 0;
}

.el-container .el-button {
  margin: 10px 0 0 30px;
}

.el-main {
  overflow-y: scroll;
}

.el-form {
  text-align: center;
  margin-top: 20px;
}

.device {
  width: 100%;
  height: 1px;
  position: relative;
  background-color: #ccc;
  top: 20px;
  margin-bottom: 60px;
  .showDevice {
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #fff;
    width: 100px;
    height: 20px;
    text-align: center;
  }
}

.el-aside {
  overflow: scroll;
}
</style>
<style lang='scss'>
.devTree .el-tabs__content {
  padding: 0 !important;
}

.devTree .el-tabs__content {
  height: 100%;
}

.devTree .el-dialog {
  width: 845px;
}

.devTree .el-dialog__body {
  padding: 0;
  margin: auto;
}
</style>
<style lang="scss"  scoped>
.el-row {
  height: 62vh;
  overflow: auto;
}
</style>
