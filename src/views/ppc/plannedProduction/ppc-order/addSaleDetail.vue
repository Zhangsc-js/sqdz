<template>
    <div>
        <el-form  :model="tableData" label-width="160px" ref="tableData" :rules="detailRules">
            <el-row>
                <el-col :span="10">
                    <el-form-item label="子订单号：" prop="sdNo">
                        <el-input v-model="tableData.sdNo" autocomplete="off" placeholder="输入或后端自动生成" :disabled="editType"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="物料编码：" prop="materialCode">
                        <el-input
                            readonly
                            v-on:click.native="sltMaterial"
                            v-model="tableData.materialCode"
                            :disabled="tableData.mpsStatus==1"
                        ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="物料名称：">
                        <el-input readonly v-model="tableData.materialName" :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="规格：">
                        <el-input v-model="tableData.specification" autocomplete="off" :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="材质：">
                        <el-input v-model="tableData.quality" autocomplete="off" :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="Bom编码：">
                        <el-input v-model="tableData.bomCode" autocomplete="off" :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="Bom版本：" prop="bomVer">
                        <el-select
                            v-model="tableData.bomVer"
                            filterable
                            placeholder="请选择"
                            style="width: 100%"
                            @change="bomChange"
                            :disabled="editType"
                        >
                            <el-option
                                v-for="item in bomMap"
                                :key="item.bomVer"
                                :label="item.bomVer"
                                :value="item.bomVer"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="单位：">
                        <el-input v-model="tableData.unit" autocomplete="off" :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="订单数量：" prop="qty">
                        <el-input v-model="tableData.qty" type="number" min="1" :disabled="editType"/>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="发货数量：" prop="sendedQty">
                        <el-input v-model="tableData.sendedQty" type="number" min="0"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="备注：">
                        <el-input v-model="tableData.remarks" autocomplete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="产品背景图：" prop="productBackgroundPicName">
                        <el-select
                            v-model="tableData.productBackgroundPicName"
                            filterable
                            placeholder="请选择"
                            style="width: 100%"
                            :disabled="editType"
                        >
                            <el-option
                                v-for="item in PIC_LIST"
                                :key="item.productBackgroundPicName"
                                :label="item.productBackgroundPicName"
                                :value="item.productBackgroundPicName"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="状态：">
                        <el-select
                            v-model="tableData.status"
                            filterable
                            placeholder="请选择"
                            style="width: 100%"
                            :disabled="true"
                        >
                            <el-option
                                v-for="item in statsMap"
                                :key="item.code"
                                :label="item.label"
                                :value="item.code"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button icon="el-icon-close" @click="cancel()">取 消</el-button>
            <el-button icon="el-icon-check" type="primary" @click="save()">保存</el-button>
        </div>
        <el-dialog title="选择物料" :visible.sync="sltMaterialDialogVisible" width="65%" append-to-body>
            <sltMaterial @save="confirmMaterial" :category="category" @cancel="hidenDialogCancel" :id="objId"/>
        </el-dialog>
    </div>
</template>

<script>
  import sltMaterial from "../ppc-bom/materialInfo";
  import {
    queryToSelect,
    statusToSelect,
    addSaleDetail,
    getBomEffect,
    getSaleById,
    getSaleDetailById,
    getdetailCode,
    getBomVerStatusList
  } from "@/api/productionPlanning";

  export default {
    name: "ppcAddMaterial",
    components: {
      sltMaterial
    },
    data() {
      return {
        tableData: {
          mainId: "",
          sdNo: "",
          materialCode: "",
          specification: "",
          quality: "",
          qty: "",
          unit: "",
          produceStandard: "",
          bomVer: "",
          status: "10",
          sendedQty: 0
        },
        editType:false,
        detailRules: {
          materialCode: [
            {
              required: true,
              message: "请选择物料编码",
              trigger: ["change", "blur"]
            }
          ],
          bomVer: [
            {
              required: true,
              message: "该物料无已启用生产的bom，需要配置",
              trigger: ["change", "blur"]
            }
          ],
          qty: [
            {
              required: true,
              message: "请输入正确数量",
              trigger: ["change", "blur"]
            }
          ]
        },
        category: "1,2,3,5,6,99", //物料类别
        devMap: [],
        statsMap: [],
        sltMaterialDialogVisible: false,
        objId: "",
        templateNo: "",
        bomMap: [],
        PIC_LIST: [],
      };
    },
    props: {
      trigger: {
        type: Boolean,
        required: true
      },
      type: {
        type: String,
        required: true
      },
      sId: {
        type: String,
        required: true
      },
      dId: {
        type: String,
        required: true
      }
    },
    methods: {
      save() {
        this.$refs["tableData"].validate((valid, object) => {
          if (valid) {
            this.tableData.mainId = this.sId;
            addSaleDetail(this.tableData)
              .then(response => {
                if (response.data.success) {
                  this.$message.success("保存成功");
                  this.$emit("save");
                } else {
                  this.$message.error(
                    response.data.message + ":" + response.data.data
                  );
                }
              })
              .catch(e => {
                this.$message({
                  type: "error",
                  message: e.message
                });
              });
          } else {
            this.$message.error(Object.values(object)[0][0].message);
          }
        });
      },
      bomChange(ver) {
        for (let b of this.bomMap) {
          if (b.bomVer == ver) {
            this.tableData.bomCode = b.bomCode
            return
          }
        }
      },
      setIsDisabled(){
        if(this.tableData.status=='10'){
          this.editType=false;
        }else{
          this.editType=true;
        }
      },
      getData() {
        if (this.type == "1") {
          this.reSet();
          this.tableData.id = "";
          this.setIsDisabled();
        } else {
          getSaleDetailById(this.dId)
            .then(response => {
              const result = response.data;
              if (result.success) {
                this.tableData = Object.assign({}, result.data);
                this.setIsDisabled();
              } else {
                this.$message.error("result");
              }
            })
            .catch(e => {
              this.$message.error(e.message);
            });
        }
      },
      reSet() {
        this.tableData = {
          mainId: "",
          sdNo: this.templateNo,
          materialCode: "",
          specification: "",
          quality: "",
          qty: "",
          unit: "",
          produceStandard: "",
          bomVer: "",
          status: "10",
          sendedQty: 0,

        };
      },
      cancel() {
        this.reSet();
        this.$emit("cancel");
      },
      confirmMaterial(data) {
        this.tableData.materialCode = data.materialCode;
        this.tableData.materialName = data.materialName;
        this.tableData.specification = data.specification;
        this.tableData.quality = data.quality;
        this.tableData.unit = data.primaryUnit;
        this.getBomInfo(data.materialCode);
        this.getBomVerStatusList(data.materialCode);
        this.sltMaterialDialogVisible = false;
      },
      sltMaterial() {
        this.sltMaterialDialogVisible = true;
      },
      getBomInfo(materialCode) {
        getBomEffect(materialCode)
          .then(response => {
            if (response.data.success) {
              this.tableData.bomCode = response.data.data.bomCode;
              this.tableData.bomVer = response.data.data.bomVer;
            } else {
              this.tableData.materialCode = "";
              this.$message.error(
                response.data.message + ":" + response.data.data
              );
            }
          })
          .catch(e => {
            this.$message.error(e.message);
          });
      },
      getBomVerStatusList(materialCode) {
        getBomVerStatusList(materialCode).then(response => {
          let data = response.data
          if (data.success) {
            this.bomMap = data.data.list
          }
        })
      },
      hidenDialogCancel() {
        this.sltMaterialDialogVisible = false;
      }
    },
    mounted() {
      statusToSelect()
        .then(response => {
          const result = response.data;
          if (result.success) {
            this.statsMap = result.data.SALE_DETAIL_STATUS;
            this.PIC_LIST = result.data.PIC_LIST;
            for (let i = 0; i < this.PIC_LIST.length; i++) {
              this.PIC_LIST[i].productBackgroundPicName=this.PIC_LIST[i].picName;
            }
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
      this.getData();
    },
    watch: {
      trigger() {
        if (this.trigger) {
          this.$refs["tableData"].resetFields();
          this.getData();
        }
      }
    }
  };
</script>

<style lang="css" scoped>
    body {
    }
</style>
