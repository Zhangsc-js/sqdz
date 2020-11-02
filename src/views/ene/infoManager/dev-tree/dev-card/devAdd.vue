<template>
  <div>
    <el-form ref="tableData" :model="tableData" :rules="rules" label-width="160px">
      <el-divider content-position="center">基础信息</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备名称" prop="sbmc">
            <el-input v-model="tableData.sbmc" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="英文名称" prop="sbmcEn">
            <el-input v-model="tableData.sbmcEn" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="规格型号" prop="standard">
            <el-input v-model="tableData.standard" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="测量范围" prop="measureScope">
            <el-input v-model="tableData.measureScope" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="上报周期" prop="cycleReport">
            <el-input v-model="tableData.cycleReport" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="使用工序" prop="useProcess">
            <el-input v-model="tableData.useProcess" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="使用车间" prop="useWorkshop">
            <el-input v-model="tableData.useWorkshop" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="使用单位" prop="useDepartment">
            <el-input v-model="tableData.useDepartment" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="计量上限" prop="meteringUpper">
            <el-input v-model="tableData.meteringUpper" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计量下限" prop="meteringLower">
            <el-input v-model="tableData.meteringLower" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="ABC分类" prop="abcFl">
            <el-input v-model="tableData.abcFl" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="精度" prop="jd">
            <el-input v-model="tableData.jd" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="出厂时间" prop="ccTime">
            <el-date-picker
              type="date"
              v-model="tableData.ccTime"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出厂编号" prop="ccCode">
            <el-input v-model="tableData.ccCode" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="备注" prop="bz">
          <el-input type="textarea" :rows="2" v-model="tableData.bz" />
        </el-form-item>
      </el-row>
    </el-form>
    <el-upload
      accept="image/gif, image/jpeg, image/jpg, image/png, image/svg"
      :action="fileUploadUrl"
      :data="{sbdm:this.selectNo,type:3}"
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
import { addDev, FILE_UPLOAD_URL, FILE_DOWNLOAD_URL } from "@/api/energy";
import { createNamespacedHelpers } from "vuex";
import { getToken } from "@/utils/auth";

const { mapMutations, mapState, mapActions } = createNamespacedHelpers(
  "eneDev"
);

export default {
  name: "eneDevAdd",
  props: ["selectNo", "devName"],
  data() {
    return {
      tableData: {
        sbmc: "",
        sbmcEn: "",
        standard: "",
        measureScope: "",
        cycleReport: "",
        useProcess: "",
        useWorkshop: "",
        useDepartment: "",
        meteringUpper: "",
        meteringLower: "",
        abcFl: "",
        jd: "",
        ccTime: "",
        ccCode: "",
        bz: ""
      },
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
      fileUploadUrl: FILE_UPLOAD_URL, ///api/ene/files/upload getDevImg
      token: {
        Authorization: `Bearer ${getToken()}`
      }
    };
  },
  computed: {
    ...mapState(["proImgList"])
  },
  mounted() {
    this.init();
  },
  watch: {
    devName() {
      this.tableData.sbmc = this.devName;
    }
  },
  methods: {
    ...mapMutations(["SET_PROIMG_LIST"]),
    init() {
      this.tableData.sbmc = this.devName;
      this.SET_PROIMG_LIST([]);
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
    save() {
      this.$refs["tableData"].validate(valid => {
        if (!valid) {
          this.$message.error("请正确键入再提交");
        } else {
          const params = {
            ...this.tableData,
            sbdm: this.selectNo
          };
          addDev(params)
            .then(res => {
              if (res.data.success) {
                this.$message({
                  type: "success",
                  message: "添加成功"
                });
                this.tableData = {};
              } else {
                this.$message({
                  type: "error",
                  message: "添加失败"
                });
              }
            })
            .catch(e => {
              this.$message.error(e.message);
            })
            .finally(() => {
              this.$emit("hidenDialog");
            });
        }
      });
    },
    cancel() {
      this.$emit("hidenDialog");
    }
  }
};
</script>
