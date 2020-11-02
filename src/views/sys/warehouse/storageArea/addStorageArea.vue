<template>
  <div style="height: 100%;">
    <el-form :model="inpu" label-width="180px" ref="inpu" :rules="rule">
      <el-row>
        <el-col :span="10">
          <el-form-item label="存储区" prop="areaCode">
            <el-input v-model="inpu.areaCode" autocomplete="off" :disabled="false"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="描述" prop="areaName">
            <el-input v-model="inpu.areaName" autocomplete="off" :disabled="false"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="入库策略" prop="strategyInput">
            <el-select
              v-model="inpu.strategyInput"
              filterable
              placeholder="请选择"
              style="width: 100%;height: 100%"
            >
              <el-option
                v-for="(item,index) in this.warehousingStrategy"
                :key="index"
                :label="item.label"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="出库策略" prop="strategyOutput">
            <el-select
              v-model="inpu.strategyOutput"
              filterable
              placeholder="请选择"
              style="width: 100%;height: 100%"
            >
              <el-option
                v-for="(item,index) in this.outboundStrategy"
                :key="index"
                :label="item.label"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="最高库存" prop="stockMax">
            <el-input v-model="inpu.stockMax" autocomplete="off" :disabled="false"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="预警库存(H)" prop="stockMaxWarning">
            <el-input v-model="inpu.stockMaxWarning" autocomplete="off" :disabled="false"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="最低库存" prop="stockMin">
            <el-input v-model="inpu.stockMin" autocomplete="off" :disabled="false"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="预警库存(L)" prop="stockMinWarning">
            <el-input v-model="inpu.stockMinWarning" autocomplete="off" :disabled="false"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="合理库存" prop="stockFit">
            <el-input v-model="inpu.stockFit" autocomplete="off" :disabled="false"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="统计单位" prop="stockUnitCode">
            <el-select
              v-model="inpu.stockUnitCode"
              filterable
              placeholder="请选择"
              style="width: 100%;height: 100%"
            >
              <el-option
                v-for="(item,index) in this.UNIT_ALL"
                :key="index"
                :label="item.label"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row>
        <el-col :span="10">
          <el-form-item label="所属仓库" prop="whCode">
            <el-select
              v-model="inpu.whCode"
              filterable
              placeholder="请选择"
              style="width: 150px;height: 100%"
            >
              <el-option
                v-for="item in this.whArr"
                :key="item.warehouseCode"
                :label="item.warehouseName"
                :value="item.warehouseCode"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="存储类型:" prop="areaTypeCode">
            <el-select
              v-model="inpu.areaTypeCode"
              filterable
              placeholder="请选择"
              style="width: 100%;height: 100%"
            >
              <el-option
                v-for="(item,index) in this.areaType"
                :key="index"
                :label="item.label"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" icon="el-icon-close" @click="cancel()">取 消</el-button>
      <el-button type="primary" icon="el-icon-check" @click="save()">保存</el-button>
    </div>
  </div>
</template>
<script>
import {
  saveOrUpdate,
  findSysWmsWarehousePullDownAll,
  findWmsAreaByKey,
  findDropUnit,
  findInboundAndOutboundStrategy,
  findStorageType
} from "@/api/sys/wms/warehouse";
export default {
  data() {
    return {
      inpu: {
        id:"",
        areaCode: "",
        areaName: "",
        whCode: "",
        strategyInput: "",
        strategyOutput: "",
        stockUnitCode: "",
        stockMax: "",
        stockMin: "",
        stockMaxWarning: "",
        stockMinWarning: "",
        stockFit: "",
        areaTypeCode: ""
      },
      areaType: [],
      warehousingStrategy: [],
      outboundStrategy: [],
      whArr: [],
      UNIT_ALL: [],
      rule: {
        areaCode: [
          { required: true, message: "请输入存储区编码", trigger: "blur" }
        ],
        areaName: [
          { required: true, message: "请输入存储区描述", trigger: "blur" }
        ],
        whCode: [{ required: true, message: "请选择仓库", trigger: "blur" }],
        strategyInput: [
          { required: true, message: "请输入入库策略", trigger: "blur" }
        ],
        strategyOutput: [
          { required: true, message: "请输入出库策略", trigger: "blur" }
        ],
        stockUnitCode: [
          { required: true, message: "请输入库存单位", trigger: "blur" }
        ],
        stockMax: [
          { required: true, message: "请输入最高库存", trigger: "blur" }
        ],
        stockMin: [
          { required: true, message: "请输入最低库存", trigger: "blur" }
        ],
        stockMaxWarning: [
          { required: true, message: "请输入库存预警（高）", trigger: "blur" }
        ],
        stockMinWarning: [
          { required: true, message: "请输入库存预警（低）", trigger: "blur" }
        ],
        stockFit: [
          { required: true, message: "请输入合理库存", trigger: "blur" }
        ],
        areaTypeCode:[
          { required: true, message: "请选择存储类型", trigger: "blur" }
        ]
      }
    };
  },
  props: {
    id: {
      type: String,
      required: true
    },
    trigger: {
      type: Boolean,
      required: false
    },
    type: {
      type: String,
      required: true
    }
  },
  watch: {
    trigger() {
      if (this.trigger) this.getData();
    }
  },
  methods: {
    getData() {
      this.$refs["inpu"].resetFields();
      findStorageType()
          .then(response => {
            if(response.data.success){
              this.areaType=response.data.data.STORAGE_AREA_TYPE;
            }
          });
      findInboundAndOutboundStrategy().then(response => {
        if (response.data.success) {
          this.warehousingStrategy = response.data.data.WAREHOUSING_STRATEGY;
          this.outboundStrategy = response.data.data.OUTBOUND_STRATEGY;
        }
      });
      findStorageType().then(response => {
        if (response.data.success) {
          this.areaType = response.data.data.STORAGE_AREA_TYPE;
        }
      });
      findSysWmsWarehousePullDownAll().then(response => {
        if (response.data.success) {
          this.whArr = response.data.data.list;
        }
      });
      findDropUnit().then(response => {
        if (response.data.success) {
          this.UNIT_ALL = response.data.data.UNIT_ALL;
        }
      });

      if (this.type == "1") {
        let reSet = {
          id:"",
          areaCode: "",
          areaName: "",
          whCode: "",
          strategyInput: "",
          strategyOutput: "",
          stockUnitCode: "",
          stockMax: "",
          stockMin: "",
          stockMaxWarning: "",
          stockMinWarning: "",
          stockFit: "",
          areaTypeCode: ""
        };
        this.inpu = reSet;
      } else if (this.type == "2") {
        findWmsAreaByKey(this.id).then(response => {
          if (response.data.success) {
            this.inpu = response.data.data.data;
          }
        });
      }
    },
    save() {
      let that = this;

      this.$refs["inpu"].validate((valid, object) => {
        if (valid) {
          if (that.type == "1") {
            saveOrUpdate(that.inpu).then(response => {
              if (response.data.success) {
                that.$message.success("新增成功!");
                that.$emit("save");
              }
            });
          } else if (that.type == "2") {
            saveOrUpdate(that.inpu).then(response => {
              if (response.data.success) {
                that.$message.success("修改成功!");
                that.$emit("save");
              }
            });
          }
        } else {
          this.$message.error(Object.values(object)[0][0].message);
        }
      });
    },
    cancel() {
      this.$emit("cancel");
    }
  },
  mounted() {
    this.getData();
  }
};
</script>