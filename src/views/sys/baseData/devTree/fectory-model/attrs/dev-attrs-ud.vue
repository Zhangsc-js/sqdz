<template>
  <div>
    <!-- 基础信息 -->
    <el-form class="content00" ref="formData" :model="formData" :rules="rules" label-width="120px">
      <el-divider content-position="left" style="width:100%">基本信息</el-divider>
      <!-- 左 -->
      <div class="left">
        <el-form-item label="设备编码：" prop="sbdm">
          <span>{{ formData.sbdm }}</span>
        </el-form-item>

        <el-form-item label="设备名称：" prop="sbmc">
          <span v-if="disabled">{{ formData.sbmc }}</span>
          <el-input v-model="formData.sbmc" v-else />
        </el-form-item>

        <el-form-item label="制造厂商：" prop="zzcs">
          <span v-if="disabled">{{ formData.zzcs }}</span>
          <el-input v-model="formData.zzcs" v-else />
        </el-form-item>

        <el-form-item label="出厂编号：" prop="sbccbh">
          <span v-if="disabled">{{ formData.sbccbh }}</span>
          <el-input v-model="formData.sbccbh" v-else />
        </el-form-item>

        <el-form-item label="产品规格：" prop="ggxn">
          <span v-if="disabled">{{ formData.ggxn }}</span>
          <el-input v-model="formData.ggxn" v-else />
        </el-form-item>

        <el-form-item label="材质：" prop="material">
          <span v-if="disabled">{{ formData.material }}</span>
          <el-input v-model="formData.material" v-else />
        </el-form-item>

        <el-form-item label="安装地点：" prop="azdd">
          <span v-if="disabled">{{ formData.azdd }}</span>
          <el-input v-model="formData.azdd" v-else />
        </el-form-item>

        <el-form-item label="采购时间：" prop="cgsj">
          <span v-if="disabled">{{ simpleDateFormat(formData.cgsj, 'yyyy-MM-dd') }}</span>
          <el-date-picker
            type="date"
            v-else
            v-model="formData.cgsj"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width:100%;"
          />
        </el-form-item>

        <el-form-item label="有效期时间：" prop="valDate">
          <span v-if="disabled">{{ simpleDateFormat(formData.valDate, 'yyyy-MM-dd') }}</span>
          <el-date-picker
            type="date"
            v-else
            v-model="formData.valDate"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width:100%;"
          />
        </el-form-item>

        <el-form-item label="额定功率：" prop="ratedPower">
          <span v-if="disabled">{{ formData.ratedPower }}</span>
          <el-input v-model="formData.ratedPower" v-else />
        </el-form-item>

        <el-form-item label="开停状态：" prop="onOff">
          <span v-if="disabled">{{ formatOnOff(formData.onOff) }}</span>
          <!-- <el-input v-model="formData.onOff" v-else /> -->
          <el-select v-else v-model="formData.onOff" clearable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <!-- 右 -->
      <div class="right">
        <div class="block">
          <el-image
            v-if="disabled"
            style="width: 300px; height: 200px"
            :src="images[0]?images[0].url:''"
            fit="contain"
            @click="showSwiper"
          >
            <div slot="error" class="image-slot el-image__error">暂无图片</div>
          </el-image>
          <el-row v-show="!disabled" style="padding-left:120px">
            <el-col :span="24">
              <el-upload
                accept="image/gif, image/jpeg, image/jpg, image/png, image/svg"
                :action="fileUploadUrl"
                :fileList="images"
                list-type="picture-card"
                :auto-upload="true"
                :data="{sbdm: selectNodeNO, type: 3}"
                :on-success="uploadSuccess"
                :headers="token"
                :on-error="uploadError"
                :before-upload="beforeAvatarUpload"
              >
                <i slot="default" class="el-icon-plus"></i>
                <div slot="file" slot-scope="{file}">
                  <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
                  <span class="el-upload-list__item-actions">
                    <span
                      class="el-upload-list__item-preview"
                      @click="handlePictureCardPreview(file.url)"
                    >
                      <i class="el-icon-zoom-in"></i>
                    </span>
                    <span
                      v-if="!disabled"
                      class="el-upload-list__item-delete"
                      @click="handleDownload(file)"
                    >
                      <i class="el-icon-download"></i>
                    </span>
                    <span
                      v-if="!disabled"
                      class="el-upload-list__item-delete"
                      @click="handleRemove(file)"
                    >
                      <i class="el-icon-delete"></i>
                    </span>
                  </span>
                </div>
              </el-upload>
            </el-col>
          </el-row>
        </div>
        <el-form-item label="ABC分类：" prop="abcFl">
          <span v-if="disabled">{{ formData.abcFl }}</span>
          <el-select v-else v-model="formData.abcFl" placeholder="请选择">
            <el-option
              v-for="item in options1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="投运时间：" prop="tysj">
          <span v-if="disabled">{{ simpleDateFormat(formData.tysj, 'yyyy-MM-dd') }}</span>
          <el-date-picker
            type="date"
            v-else
            v-model="formData.tysj"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width:100%;"
          />
        </el-form-item>

        <el-form-item label="额定电压:" prop="ratedVoltage">
          <span v-if="disabled">{{ formData.ratedVoltage }}</span>
          <el-input v-model="formData.ratedVoltage" v-else />
        </el-form-item>
        <el-form-item label="温度上下限:" prop="temLine">
          <span v-if="disabled">{{ formData.temLine }}</span>
          <el-input v-model="formData.temLine" v-else />
        </el-form-item>

        <el-form-item label="警报编码:" prop="warningCode">
          <span v-if="disabled">{{ formatWarn(formData.warningCode) }}</span>
          <el-select v-else v-model="formData.warningCode" clearable>
            <el-option
              v-for="item in warnOpts"
              :key="item.warningCode"
              :label="item.warningName"
              :value="item.warningCode"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <!-- 备注 -->
      <el-form-item style="width:100%" label="备注：" prop="bz">
        <span v-if="disabled">{{ formData.bz }}</span>
        <el-input type="textarea" :rows="2" v-else v-model="formData.bz" />
      </el-form-item>
      <el-row style="text-align:center;margin:0 8px">
        <el-button
          v-show="disabled"
          type="primary"
          icon="el-icon-edit"
          @click="disabled = !disabled"
        >更新</el-button>
        <el-button v-show="!disabled" type="primary" icon="el-icon-check" @click="saveInfo">保存</el-button>
        <el-button v-show="!disabled" type="primary" icon="el-icon-close" @click="cancel">取消</el-button>
      </el-row>
    </el-form>
    <specificInfo :active-name="activeName"></specificInfo>
    <el-dialog :visible.sync="dialogVisible" width="65%" style="height: 100%">
      <swiper :options="swiperOption" ref="mySwiper" style="width:100%; height: 95%">
        <swiper-slide v-for="item in images" :key="item.id" style="text-align:center">
          <img style="text-align:center;max-height:600px" :src="item.url" alt />
        </swiper-slide>
        <div class="swiper-button-prev" slot="button-prev" prevButton></div>
        <div class="swiper-button-next" slot="button-next"></div>
      </swiper>
    </el-dialog>
  </div>
</template>

<script>
import specificInfo from "./specificInfo";
import {
  FILE_UPLOAD_URL,
  delAttachmentFile,
  getDevImg,
  updateDevCardAttr
} from "@/api/sys/dev";
import { getDevParamWarnName } from "@/api/sys/warnMessage";

import {
  isNotEmpty,
  isEmpty,
  simpleDateFormat,
  isEmptyArray
} from "@/utils/index";
import { getToken } from "@/utils/auth";
import { saveAs } from "file-saver";

export default {
  name: "DevAttrsUd",
  components: {
    specificInfo
  },
  data() {
    return {
      options1: [
        {
          label: "A",
          value: "A"
        },
        {
          label: "B",
          value: "B"
        },
        {
          label: "C",
          value: "C"
        }
      ],
      options: [
        {
          label: "开机",
          value: 1
        },
        {
          label: "停机",
          value: 0
        }
      ],
      warnOpts: [],
      images: [],
      dialogImageUrl: null,
      dialogVisible: false,
      fileUploadUrl: FILE_UPLOAD_URL, // 文件上传路径
      rules: {
        sbmc: [{ required: true, message: "请输入设备名称", trigger: "blur" }]
      },
      token: {
        Authorization: `Bearer ${getToken()}`
      },
      swiperOption: {
        // some swiper options/callbacks
        // 所有的参数同 swiper 官方 api 参数
        // ...
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      },
      disabled: true,
      currActiveName: "devAttrs"
    };
  },
  computed: {
    selectNodeNO() {
      return this.$store.state.sysDev.selectNodeNO;
    },
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  },
  props: {
    formData: {
      type: Object,
      required: true
    },
    activeName: {
      type: String,
      required: true,
      default: ""
    }
  },
  created() {
    this.init();
  },
  mounted() {
    this.getImgData();
  },
  watch: {
    selectNodeNO() {
      if (this.activeName == this.currActiveName) {
        this.getImgData();
        this.disabled = true;
      }
    },
    activeName() {
      if (this.activeName == this.currActiveName) {
        this.getImgData();
        this.disabled = true;
      }
    }
  },
  methods: {
    simpleDateFormat,
    init() {
      getDevParamWarnName().then(res => {
        const result = res.data;
        if (result.success) {
          this.warnOpts = result.data;
        } else {
          this.$message.error(result.message);
        }
      });
    },
    getImgData() {
      const imgServer = process.env.VUE_APP_DEV_IMAGE_URL;
      if (isEmpty(this.selectNodeNO)) {
        return;
      }
      getDevImg({
        sbdm: this.selectNodeNO,
        fileType: 3
      }).then(response => {
        const result = response.data.data;
        let images = [];
        if (result != undefined && result != null) {
          for (let item of result) {
            images.push({
              id: item.id,
              name: item.fileName,
              url: imgServer + item.uploadName
            });
          }
        }
        this.images = images;
      });
    },
    uploadSuccess(response) {
      if (response.success) {
        this.$message.success("上传成功");
        this.getImgData();
      } else {
        this.$message.error(response.message);
      }
    },
    uploadError(err) {
      this.$message.error("上传失败" + err.message);
    },
    beforeAvatarUpload(file) {
      const isImage =
        file.type === "image/jpeg" ||
        file.type === "image/gif" ||
        file.type === "image/png" ||
        file.type === "image/jpg" ||
        file.type === "image/svg";
      if (!isImage) {
        this.$message.error(
          "上传图片只能是 JPG | JPGEN | PNG | GIF | SVG 格式!"
        );
      }
      return isImage;
    },
    handleRemove(file) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delAttachmentFile(file.id).then(() => {
            this.$message.success("删除成功!");
            this.getImgData();
          });
        })
        .catch(() => {
          this.$message.info("已取消删除!");
        });
    },
    handleDownload(file) {
      if (isNotEmpty(file.url)) {
        saveAs(file.url, file.name);
      }
    },
    handlePictureCardPreview(url) {
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    showSwiper() {
      this.dialogVisible = true;
    },
    formatOnOff(o) {
      if (o != null) {
        return o == 1 ? "开机" : "停机";
      }
    },
    formatWarn(w) {
      if (w && !isEmptyArray(this.warnOpts)) {
        const warn = this.warnOpts.find(e => e.warningCode == w);
        return warn.warningName;
      }
    },
    saveInfo() {
      this.disabled = true;
      if (this.showAddForm) {
        // this.add();
        this.showAddForm = false;
      } else {
        updateDevCardAttr(this.formData)
          .then(response => {
            if (response.data.success) {
              this.$message.success("保存成功");
            } else {
              this.$message.error(
                response.data.message + ":" + response.data.data
              );
            }
          })
          .catch(e => {
            this.$message.error(e.message);
          });
      }
    },
    cancel() {
      this.disabled = !this.disabled;
      this.$emit("cancel");
      this.$message.info("已取消");
    }
  }
};
</script>
<style>
.content00 {
  height: 100%;
  display: flex;
  flex-wrap: wrap;
}
.content00 .left {
  height: 100%;
  width: 50%;
}
.content00 .right {
  width: 50%;
  height: 100%;
}
.content00 .el-carousel__item {
  width: 80px;
}
.content00 .el-carousel__item,
.el-carousel__mask {
  height: auto;
}
.content00 .el-carousel__container {
  width: 100px;
  height: 100px;
  margin-top: 20px;
  transition: 1s;
}
/*.el-carousel__container:hover{ width: 520px; height: 520px; position: absolute; top: 20px;}*/
.content00 .el-carousel__indicators--outside {
  display: none;
}
.content00 .el-carousel--horizontal {
  overflow-x: visible;
}
.content00 .el-form-item__label {
  line-height: 35px;
}
.content00 .el-form-item__content {
  line-height: 35px;
}
.content00 .el-divider--horizontal {
  margin-bottom: 20px;
}
</style>
<style scoped>
* {
  text-decoration: none;
  list-style: none;
  border: 0;
  font-family: Arial, "微软雅黑";
  outline: none;
}
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
img {
  border: none;
}
a {
  list-style: none;
  text-decoration: none;
  color: #000;
  outline: none;
  -webkit-tap-highlight-color: rgba(255, 0, 0, 0);
  transition: all 0.5s;
}
a:hover {
  text-decoration: none;
  opacity: 0.9;
}
ul,
li {
  list-style: none;
}
.clear {
  clear: both;
}
.b {
  font-weight: bold;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.content00 {
  padding: 20px;
}
.content00 .el-form-item {
  width: 100%;
}
.cont01 {
  width: 70px;
  color: #ccc;
  font-size: 14px;
  line-height: 40px;
  text-align: justify;
  text-align-last: justify;
  text-justify: inter-ideograph;
}
.cont02 {
  width: calc(100% - 100px);
  color: #666;
  font-size: 14px;
  line-height: 40px;
}
.img01 img {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  border: 2px solid #ddd;
  background-color: #ddd;
  overflow: hidden;
  transition: all 2s;
  position: relative;
  /*margin-top: 10px;*/
  transform: translateX(0px) scale(1);
  position: relative;
  z-index: 111;
}
/*.img01 img:hover {*/
/*cursor: crosshair;*/
/*!*transform: scale(3);*!*/
/*width:500px;*/
/*height:500px;*/
/*position: absolute;*/
/*top:10px;*/
/*}*/
.img {
  font-size: 14px;
  margin-left: 93px;
}
</style>
<style lang="scss">
// .el-carousel{
//   width: 23px;
// }
// .el-carousel__arrow{
//   display: none;
// }
.content00 .el-dialog {
  width: 845px;
}
.content00 .el-dialog__body {
  padding: 0;
  // width: auto;
  // text-align: center;
}
.content00 .el-divider.el-divider--horizontal {
  margin-bottom: 20px;
}
</style>
