<template>
  <div>
    <el-form ref="addWeiDevAttr" :model="addWeiDevAttr" :rules="rules" label-width="160px">
      <el-divider content-position="center">基础信息</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备名称" prop="sbmc">
            <el-input v-model="addWeiDevAttr.sbmc" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="英文名称" prop="sbmcEn">
            <el-input v-model="addWeiDevAttr.sbmcEn" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="工艺编号" prop="gybh">
            <el-input v-model="addWeiDevAttr.gybh" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="型号" prop="sbxh">
            <el-input v-model="addWeiDevAttr.sbxh" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="规格性能" prop="ggxn">
            <el-input v-model="addWeiDevAttr.ggxn" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位" prop="dw">
            <el-input v-model="addWeiDevAttr.dw" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="数量" prop="sl">
            <el-input v-model="addWeiDevAttr.sl" type="number" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="制造厂商" prop="zzcs">
            <el-input v-model="addWeiDevAttr.zzcs" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="安装地点" prop="azdd">
            <el-input v-model="addWeiDevAttr.azdd" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出厂编号" prop="sbccbh">
            <el-input v-model="addWeiDevAttr.sbccbh" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="物料编码" prop="wlbm">
            <el-input v-model="addWeiDevAttr.wlbm" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="功率" prop="glJddw">
            <el-input v-model="addWeiDevAttr.glJddw" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="ABC分类" prop="abcFl">
            <el-input v-model="addWeiDevAttr.abcFl" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="精度" prop="jd">
            <el-input v-model="addWeiDevAttr.jd" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="采购时间" prop="cgsj">
            <el-date-picker
              type="date"
              v-model="addWeiDevAttr.cgsj"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="投运时间" prop="tysj">
            <el-date-picker
              type="date"
              v-model="addWeiDevAttr.tysj"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="备注" prop="bz">
          <el-input type="textarea" :rows="2" v-model="addWeiDevAttr.bz" />
        </el-form-item>
      </el-row>
    </el-form>
    <el-upload
      accept="image/gif, image/jpeg, image/jpg, image/png, image/svg"
      :action="fileUploadUrl"
      :data="{sbdm:this.selectNodeNO,type:3}"
      :fileList="proImgList"
      list-type="picture-card"
      :auto-upload="true"
      :headers="token"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :before-upload="beforeAvatarUpload"
    >
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{file}">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
            <i class="el-icon-zoom-in"></i>
          </span>
          <span class="el-upload-list__item-delete" @click="handleDownload(file)">
            <i class="el-icon-download"></i>
          </span>
          <span class="el-upload-list__item-delete" @click="handleRemove(file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel()">取 消</el-button>
      <el-button type="primary" @click="save()">保存</el-button>
    </div>
  </div>
</template>

<script>
import { FILE_UPLOAD_URL, FILE_DOWNLOAD_URL } from "@/api/weighing";
import { createNamespacedHelpers } from "vuex";
import { getToken } from "@/utils/auth";

const { mapState, mapActions } = createNamespacedHelpers("weiDevice");

export default {
  name: "WeiDevAttrAdd",
  data() {
    return {
      options: [
        {
          label: "是",
          value: 1
        },
        {
          label: "否",
          value: 0
        }
      ],
      rules: {
        sbmc: [{ required: true, message: "请输入设备名称", trigger: "blur" }]
      },
      proImgList: [],
      fileUploadUrl: FILE_UPLOAD_URL,
      token: {
        Authorization: `Bearer ${getToken()}`
      }
    };
  },
  props: ["selectNo"],
  computed: {
    ...mapState(["addWeiDevAttr", "selectNodeNO"])
    // selectNodeNO() {
    //    return this.$store.state.selectNodeNO
    // }
  },
  methods: {
    ...mapActions(["addWeiDevData"]),
    init() {
      this.proImgList = [];
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
    uploadSuccess(response) {
      if (response.success) {
        this.$message.success("上传成功");
        // this.getDevImg();
      } else {
        this.$message.error(response.message);
      }
    },

    //图片删除
    handleRemove(file, fileList) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delDevFile(file.id).then(() => {
            this.$message.success("删除成功!");
            this.getDevImg();
          });
        })
        .catch(() => {
          this.$message.info("已取消删除!");
        });
    },
    //预览图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //下载图片
    handleDownload(file) {
      if (isNotEmpty(file.url)) {
        window.location = FILE_DOWNLOAD_URL + file.id;
      }
    },
    save: function() {
      this.$refs["addWeiDevAttr"].validate(valid => {
        if (valid) {
          const from = {
            ...this.addWeiDevAttr,
            sbdm: this.selectNodeNO
          };
          this.addWeiDevData(from)
            .then(() => {
              // console.log(sbdm)
              this.$refs["addWeiDevAttr"].resetFields();
            })
            .finally(() => {
              this.$emit("hidenDialog");
            });
        } else {
          this.$message.error("保存失败，请检查必填项是否都正确填写");
          return false;
        }
      });
    },
    cancel: function() {
      this.$emit("hidenDialog");
    }
  }
};
</script>
