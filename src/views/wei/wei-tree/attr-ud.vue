<template>
  <div>
    <el-form ref="weiDevAttr" :model="weiDevAttr" :rules="rules" label-width="160px">
      <el-divider content-position="center">基础信息</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备名称" prop="sbmc">
            <el-input v-model="weiDevAttr.sbmc" :disabled="disabled" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="英文名称" prop="sbmcEn">
            <el-input v-model="weiDevAttr.sbmcEn" :disabled="disabled" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="规格性能" prop="ggxn">
            <el-input v-model="weiDevAttr.ggxn" :disabled="disabled" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="型号" prop="sbxh">
            <el-input v-model="weiDevAttr.sbxh" :disabled="disabled" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="数量" prop="sl">
            <el-input v-model="weiDevAttr.sl" type="number" :disabled="disabled" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位" prop="dw">
            <el-input v-model="weiDevAttr.dw" :disabled="disabled" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="制造厂商" prop="zzcs">
            <el-input v-model="weiDevAttr.zzcs" :disabled="disabled" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="安装地点" prop="azdd">
            <el-input v-model="weiDevAttr.azdd" :disabled="disabled" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出厂编号" prop="sbccbh">
            <el-input v-model="weiDevAttr.sbccbh" :disabled="disabled" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="物料编码" prop="wlbm">
            <el-input v-model="weiDevAttr.wlbm" :disabled="disabled" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="精度" prop="jd">
            <el-input v-model="weiDevAttr.jd" :disabled="disabled" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="采购时间" prop="cgsj">
            <el-date-picker
              type="date"
              v-model="weiDevAttr.cgsj"
              value-format="yyyy-MM-dd HH:mm:ss"
              :disabled="disabled"
              style="width:100%;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="投运时间" prop="tysj">
            <el-date-picker
              type="date"
              v-model="weiDevAttr.tysj"
              value-format="yyyy-MM-dd HH:mm:ss"
              :disabled="disabled"
              style="width:100%;"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="备注" prop="bz">
          <el-input type="textarea" :rows="2" v-model="weiDevAttr.bz" :disabled="disabled" />
        </el-form-item>
      </el-row>
      <!--            <el-divider content-position="center">拓展信息</el-divider>-->
      <!--            <el-row>-->
      <!--                <el-col :span="8">-->
      <!--                    <el-form-item label="是否有外部接口" prop="sfWbjkbm">-->
      <!--                        <el-select v-model="weiDevAttr.sfWbjkbm" placeholder="请选择" :disabled="disabled">-->
      <!--                            <el-option-->
      <!--                                    v-for="item in options"-->
      <!--                                    :key="item.value"-->
      <!--                                    :label="item.label"-->
      <!--                                    :value="item.value">-->
      <!--                            </el-option>-->
      <!--                        </el-select>-->
      <!--                    </el-form-item>-->
      <!--                </el-col>-->
      <!--                <el-col :span="8">-->
      <!--                    <el-form-item label="是否有启停数据" prop="sfQtsj">-->
      <!--                        <el-select v-model="weiDevAttr.sfQtsj" placeholder="请选择" :disabled="disabled">-->
      <!--                            <el-option-->
      <!--                                    v-for="item in options"-->
      <!--                                    :key="item.value"-->
      <!--                                    :label="item.label"-->
      <!--                                    :value="item.value">-->
      <!--                            </el-option>-->
      <!--                        </el-select>-->
      <!--                    </el-form-item>-->
      <!--                </el-col>-->
      <!--                <el-col :span="8">-->
      <!--                    <el-form-item label="是否有化验数据" prop="sfHysj">-->
      <!--                        <el-select v-model="weiDevAttr.sfHysj" placeholder="请选择" :disabled="disabled">-->
      <!--                            <el-option-->
      <!--                                    v-for="item in options"-->
      <!--                                    :key="item.value"-->
      <!--                                    :label="item.label"-->
      <!--                                    :value="item.value">-->
      <!--                            </el-option>-->
      <!--                        </el-select>-->
      <!--                    </el-form-item>-->
      <!--                </el-col>-->
      <!--            </el-row>-->
      <!--            <el-row>-->
      <!--                <el-col :span="8">-->
      <!--                    <el-form-item label="是否有历史趋势" prop="sfLsqs">-->
      <!--                        <el-select v-model="weiDevAttr.sfLsqs" placeholder="请选择" :disabled="disabled">-->
      <!--                            <el-option-->
      <!--                                    v-for="item in options"-->
      <!--                                    :key="item.value"-->
      <!--                                    :label="item.label"-->
      <!--                                    :value="item.value">-->
      <!--                            </el-option>-->
      <!--                        </el-select>-->
      <!--                    </el-form-item>-->
      <!--                </el-col>-->
      <!--                <el-col :span="8">-->
      <!--                    <el-form-item label="是否KPI指标" prop="sfKpiZb">-->
      <!--                        <el-select v-model="weiDevAttr.sfKpiZb" placeholder="请选择" :disabled="disabled">-->
      <!--                            <el-option-->
      <!--                                    v-for="item in options"-->
      <!--                                    :key="item.value"-->
      <!--                                    :label="item.label"-->
      <!--                                    :value="item.value">-->
      <!--                            </el-option>-->
      <!--                        </el-select>-->
      <!--                    </el-form-item>-->
      <!--                </el-col>-->
      <!--                <el-col :span="8">-->
      <!--                    <el-form-item label="是否是健康危害管理点" prop="sfJkglwhd">-->
      <!--                        <el-select v-model="weiDevAttr.sfJkglwhd" placeholder="请选择" :disabled="disabled">-->
      <!--                            <el-option-->
      <!--                                    v-for="item in options"-->
      <!--                                    :key="item.value"-->
      <!--                                    :label="item.label"-->
      <!--                                    :value="item.value">-->
      <!--                            </el-option>-->
      <!--                        </el-select>-->
      <!--                    </el-form-item>-->
      <!--                </el-col>-->
      <!--            </el-row>-->
      <!--            <el-row>-->
      <!--                <el-col :span="8">-->
      <!--                    <el-form-item label="是否是环保体系管理点" prop="sfHbtxgld">-->
      <!--                        <el-select v-model="weiDevAttr.sfHbtxgld" placeholder="请选择" :disabled="disabled">-->
      <!--                            <el-option-->
      <!--                                    v-for="item in options"-->
      <!--                                    :key="item.value"-->
      <!--                                    :label="item.label"-->
      <!--                                    :value="item.value">-->
      <!--                            </el-option>-->
      <!--                        </el-select>-->
      <!--                    </el-form-item>-->
      <!--                </el-col>-->
      <!--                <el-col :span="8">-->
      <!--                    <el-form-item label="是否是质量体系管理点" prop="sfZltxgld">-->
      <!--                        <el-select v-model="weiDevAttr.sfZltxgld" placeholder="请选择" :disabled="disabled">-->
      <!--                            <el-option-->
      <!--                                    v-for="item in options"-->
      <!--                                    :key="item.value"-->
      <!--                                    :label="item.label"-->
      <!--                                    :value="item.value">-->
      <!--                            </el-option>-->
      <!--                        </el-select>-->
      <!--                    </el-form-item>-->
      <!--                </el-col>-->
      <!--                <el-col :span="8">-->
      <!--                    <el-form-item label="是否是计量标准器" prop="sfJlbzq">-->
      <!--                        <el-select v-model="weiDevAttr.sfJlbzq" placeholder="请选择" :disabled="disabled">-->
      <!--                            <el-option-->
      <!--                                    v-for="item in options"-->
      <!--                                    :key="item.value"-->
      <!--                                    :label="item.label"-->
      <!--                                    :value="item.value">-->
      <!--                            </el-option>-->
      <!--                        </el-select>-->
      <!--                    </el-form-item>-->
      <!--                </el-col>-->
      <!--            </el-row>-->
      <!--            <el-row>-->
      <!--                <el-col :span="8">-->
      <!--                    <el-form-item label="是否属于流程物料设备" prop="sfLcwlsb">-->
      <!--                        <el-select v-model="weiDevAttr.sfLcwlsb" placeholder="请选择" :disabled="disabled">-->
      <!--                            <el-option-->
      <!--                                    v-for="item in options"-->
      <!--                                    :key="item.value"-->
      <!--                                    :label="item.label"-->
      <!--                                    :value="item.value">-->
      <!--                            </el-option>-->
      <!--                        </el-select>-->
      <!--                    </el-form-item>-->
      <!--                </el-col>-->
      <!--                <el-col :span="8">-->
      <!--                    <el-form-item label="是否有过程数据" prop="sfGcsj">-->
      <!--                        <el-select v-model="weiDevAttr.sfGcsj" placeholder="请选择" :disabled="disabled">-->
      <!--                            <el-option-->
      <!--                                    v-for="item in options"-->
      <!--                                    :key="item.value"-->
      <!--                                    :label="item.label"-->
      <!--                                    :value="item.value">-->
      <!--                            </el-option>-->
      <!--                        </el-select>-->
      <!--                    </el-form-item>-->
      <!--                </el-col>-->
      <!--                <el-col :span="8">-->
      <!--                    <el-form-item label="是否属于能源计量设备" prop="sfNyjlsb">-->
      <!--                        <el-select v-model="weiDevAttr.sfNyjlsb" placeholder="请选择" :disabled="disabled">-->
      <!--                            <el-option-->
      <!--                                    v-for="item in options"-->
      <!--                                    :key="item.value"-->
      <!--                                    :label="item.label"-->
      <!--                                    :value="item.value">-->
      <!--                            </el-option>-->
      <!--                        </el-select>-->
      <!--                    </el-form-item>-->
      <!--                </el-col>-->
      <!--            </el-row>-->
      <!--            <el-row>-->
      <!--                <el-col :span="8">-->
      <!--                    <el-form-item label="是否属于维护设备" prop="sfWhsb">-->
      <!--                        <el-select v-model="weiDevAttr.sfWhsb" placeholder="请选择" :disabled="disabled">-->
      <!--                            <el-option-->
      <!--                                    v-for="item in options"-->
      <!--                                    :key="item.value"-->
      <!--                                    :label="item.label"-->
      <!--                                    :value="item.value">-->
      <!--                            </el-option>-->
      <!--                        </el-select>-->
      <!--                    </el-form-item>-->
      <!--                </el-col>-->
      <!--                <el-col :span="8">-->
      <!--                    <el-form-item label="是否属于仪表" prop="sfYb">-->
      <!--                        <el-select v-model="weiDevAttr.sfYb" placeholder="请选择" :disabled="disabled">-->
      <!--                            <el-option-->
      <!--                                    v-for="item in options"-->
      <!--                                    :key="item.value"-->
      <!--                                    :label="item.label"-->
      <!--                                    :value="item.value">-->
      <!--                            </el-option>-->
      <!--                        </el-select>-->
      <!--                    </el-form-item>-->
      <!--                </el-col>-->
      <!--                <el-col :span="8">-->
      <!--                    <el-form-item label="是否属于特种设备" prop="sfTzsb">-->
      <!--                        <el-select v-model="weiDevAttr.sfTzsb" placeholder="请选择" :disabled="disabled">-->
      <!--                            <el-option-->
      <!--                                    v-for="item in options"-->
      <!--                                    :key="item.value"-->
      <!--                                    :label="item.label"-->
      <!--                                    :value="item.value">-->
      <!--                            </el-option>-->
      <!--                        </el-select>-->
      <!--                    </el-form-item>-->
      <!--                </el-col>-->
      <!--            </el-row>-->
      <!--            <el-row>-->
      <!--                <el-col :span="8">-->
      <!--                    <el-form-item label="	设否需进行供应商分析" prop="sfGysfx">-->
      <!--                        <el-select v-model="weiDevAttr.sfGysfx" placeholder="请选择" :disabled="disabled">-->
      <!--                            <el-option-->
      <!--                                    v-for="item in options"-->
      <!--                                    :key="item.value"-->
      <!--                                    :label="item.label"-->
      <!--                                    :value="item.value">-->
      <!--                            </el-option>-->
      <!--                        </el-select>-->
      <!--                    </el-form-item>-->
      <!--                </el-col>-->
      <!--                <el-col :span="8">-->
      <!--                    <el-form-item label="是否衡器" prop="sfHq">-->
      <!--                        <el-select v-model="weiDevAttr.sfHq" placeholder="请选择" :disabled="disabled">-->
      <!--                            <el-option-->
      <!--                                    v-for="item in options"-->
      <!--                                    :key="item.value"-->
      <!--                                    :label="item.label"-->
      <!--                                    :value="item.value">-->
      <!--                            </el-option>-->
      <!--                        </el-select>-->
      <!--                    </el-form-item>-->
      <!--                </el-col>-->
      <!--                <el-col :span="8">-->
      <!--                    <el-form-item label="是否需进行成本管理" prop="sfCbgl">-->
      <!--                        <el-select v-model="weiDevAttr.sfCbgl" placeholder="请选择" :disabled="disabled">-->
      <!--                            <el-option-->
      <!--                                    v-for="item in options"-->
      <!--                                    :key="item.value"-->
      <!--                                    :label="item.label"-->
      <!--                                    :value="item.value">-->
      <!--                            </el-option>-->
      <!--                        </el-select>-->
      <!--                    </el-form-item>-->
      <!--                </el-col>-->
      <!--            </el-row>-->
      <!--            <el-row>-->
      <!--                <el-col :span="8">-->
      <!--                    <el-form-item label="是否3D设计设备" prop="sf3dSb">-->
      <!--                        <el-select v-model="weiDevAttr.sf3dSb" placeholder="请选择" :disabled="disabled">-->
      <!--                            <el-option-->
      <!--                                    v-for="item in options"-->
      <!--                                    :key="item.value"-->
      <!--                                    :label="item.label"-->
      <!--                                    :value="item.value">-->
      <!--                            </el-option>-->
      <!--                        </el-select>-->
      <!--                    </el-form-item>-->
      <!--                </el-col>-->
      <!--            </el-row>-->
      <el-row>
        <el-upload
          accept="image/gif, image/jpeg, image/jpg, image/png, image/svg"
          :action="fileUploadUrl"
          :data="{sbdm:selectNo,type:3}"
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
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel()">取 消</el-button>
      <el-button v-if="!disabled" type="primary" @click="saveInfo()">保存</el-button>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import {
  FILE_UPLOAD_URL,
  FILE_DOWNLOAD_URL,
  getDevImg,
  delDevFile
} from "@/api/weighing";
import { getToken } from "@/utils/auth";

import { isNotEmpty } from "@/utils/index";
const { mapState, mapActions } = createNamespacedHelpers("weiDevice");
export default {
  name: "WeiDevAttrUd",
  data() {
    return {
      // sbdm:'',
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
      proImgUrl: "",
      proImgId: "",
      token: {
        Authorization: `Bearer ${getToken()}`
      }
    };
  },
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
  computed: {
    ...mapState(["selectedRowId", "weiDevAttr", "disabled"])
  },
  mounted() {
    this.getWeiDevDetail(this.selectedRowId);
    this.getDevImg();
  },
  watch: {
    selectedRowId() {
      this.getWeiDevDetail(this.selectedRowId);
    },
    equipId() {
      this.getDevImg();
    }
  },
  methods: {
    ...mapActions(["getWeiDevDetail", "updateWeiDevData"]),
    saveInfo: function() {
      this.$refs["weiDevAttr"].validate(valid => {
        if (valid) {
          this.updateWeiDevData(this.weiDevAttr).finally(() => {
            this.$emit("hidenDialog");
          });
        } else {
          this.$message.error("保存失败，请检查必填项是否都正确填写");
          return false;
        }
      });
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
    cancel: function() {
      this.$emit("hidenDialog");
    }
  }
};
</script>
