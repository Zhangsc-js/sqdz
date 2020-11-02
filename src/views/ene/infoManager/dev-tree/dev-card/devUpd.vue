<template>
  <div>
    <el-form ref="devUpd" :model="devUpd" :rules="rules" label-width="160px">
      <el-divider content-position="center">基础信息</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备名称" prop="sbmc">
            <el-input v-model="devUpd.sbmc" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="英文名称" prop="sbmcEn">
            <el-input v-model="devUpd.sbmcEn" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="规格型号" prop="standard">
            <el-input v-model="devUpd.standard" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="测量范围" prop="measureScope">
            <el-input v-model="devUpd.measureScope" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="上报周期" prop="cycleReport">
            <el-input v-model="devUpd.cycleReport" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="使用工序" prop="useProcess">
            <el-input v-model="devUpd.useProcess" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="使用车间" prop="useWorkshop">
            <el-input v-model="devUpd.useWorkshop" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="使用单位" prop="useDepartment">
            <el-input v-model="devUpd.useDepartment" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="计量上限" prop="meteringUpper">
            <el-input v-model="devUpd.meteringUpper" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计量下限" prop="meteringLower">
            <el-input v-model="devUpd.meteringLower" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="ABC分类" prop="abcFl">
            <el-input v-model="devUpd.abcFl" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="精度" prop="jd">
            <el-input v-model="devUpd.jd" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="出厂时间" prop="ccTime">
            <el-date-picker type="date" v-model="devUpd.ccTime" value-format="yyyy-MM-dd HH:mm:ss" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出厂编号" prop="ccCode">
            <el-input v-model="devUpd.ccCode" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="备注" prop="bz">
          <el-input type="textarea" :rows="2" v-model="devUpd.bz" />
        </el-form-item>
      </el-row>
      <el-row>
        <el-upload
          accept="image/gif, image/jpeg, image/jpg, image/png, image/svg"
          :action="fileUploadUrl"
          :data="{sbdm:devUpd.sbdm,type:3}"
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
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="设备图片" />
        </el-dialog>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel()">取 消</el-button>
      <el-button type="primary" @click="save()">保存</el-button>
    </div>
  </div>
</template>

<script>
import {
  findDevById,
  upDev,
  FILE_UPLOAD_URL,
  FILE_DOWNLOAD_URL,
  getDevImg,
  delDevFile
} from "@/api/energy";
import { isNotEmpty } from "@/utils/index";
import { getToken } from "@/utils/auth";

export default {
  name: "eneDevUpd",
  props: {
    equipId: {
      type: String,
      required: true
    },
    selectNo: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      devUpd: {
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
      dialogImageUrl: "",
      dialogVisible: false,
      fileUploadUrl: FILE_UPLOAD_URL, ///api/ene/files/upload
      proImgList: [],
      token: {
        Authorization: `Bearer ${getToken()}`
      }
    };
  },
  computed: {},
  watch: {
    equipId() {
      this.findDevById();
      this.getDevImg();
    }
  },
  mounted() {
    this.findDevById();
    this.getDevImg();
  },
  methods: {
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
    findDevById() {
      findDevById(this.equipId)
        .then(res => {
          this.devUpd = res.data.data;
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    //初始化自动预览图片
    getDevImg() {
      const params = {
        sbdm: this.selectNo,
        fileType: 3
      };
      getDevImg(params)
        .then(response => {
          const imgServer = process.env.VUE_APP_DEV_IMAGE_URL;
          const result = response.data.data;
          // 将原有数据置空
          const images = [];
          if (result) {
            for (let item of result) {
              images.push({
                id: item.id,
                name: item.fileName,
                url: imgServer + item.uploadName
              });
            }
          }
          this.proImgList = images;
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    //===================================图片上传方法
    uploadSuccess(response) {
      if (response.success) {
        this.$message.success("上传成功");
        this.getDevImg();
      } else {
        this.$message.error(response.message);
      }
    },
    handleDownload(file) {
      if (isNotEmpty(file.url)) {
        window.location = FILE_DOWNLOAD_URL + file.id;
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
    save() {
      this.$refs["devUpd"].validate(valid => {
        if (!valid) {
          this.$message({
            type: "error",
            message: "请正确键入再提交"
          });
        } else {
          upDev(this.devUpd.id, this.devUpd)
            .then(res => {
              if (res.data.success) {
                this.$message({
                  type: "success",
                  message: "更新成功"
                });
                this.findDevById();
              } else {
                this.$message({
                  type: "error",
                  message: "更新失败"
                });
              }
            })
            .catch(e => {
              this.$message.error(e.message);
            })
            .finally(() => {
              this.proImgList = [];
              this.$emit("hidenDialog");
            });
        }
      });
    },
    cancel() {
      this.$refs["devUpd"].resetFields(); //prop
      this.findDevById();
      this.$emit("hidenDialog");
    }
  }
};
</script>
