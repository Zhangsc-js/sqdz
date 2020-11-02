<template>
  <div style="height: 100%;">
    <el-form :model="inpu" label-width="180px" ref="inpu">
      <el-row>
        <el-col :span="10">
          <el-form-item label="仓库号：" prop="whCode">
            <el-select
              v-model="inpu.whCode"
              filterable
              placeholder="请选择"
              style="width: 150px;height: 100%"
              @change="selectWh()"
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
          <el-form-item label="存储区：" prop="areaCode">
            <el-select
              v-model="inpu.areaCode"
              filterable
              placeholder="请选择"
              style="width: 150px;height: 100%"
              @change="selectArea"
            >
              <el-option
                v-for="item in this.areaArr"
                :key="item.areaCode"
                :label="item.areaName"
                :value="item.areaCode"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="仓位：" prop="binCode">
            <el-select
              v-model="inpu.binCode"
              filterable
              placeholder="请选择"
              style="width: 150px;height: 100%"
            >
              <el-option
                v-for="item in this.binArr"
                :key="item.binCode"
                :label="item.binCode"
                :value="item.binCode"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="存储单元:" prop="cellCode">
            <el-input style="width: 150px;" v-model="inpu.cellCode" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="最大承重" prop="weightMax">
            <el-input
              style="width: 150px;"
              v-model="inpu.weightMax"
              type="number"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="单位：" prop="weightUnitCode">
            <el-select
              v-model="inpu.weightUnitCode"
              filterable
              placeholder="请选择"
              style="width: 150px;height: 100%"
            >
              <el-option
                v-for="item in this.unit"
                :key="item.id"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="是否冻结：" prop="freeze">
            <el-checkbox v-model="inpu.freeze"></el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="冻结原因：" prop="freezeReason">
            <el-input
              style="width: 150px;"
              v-model="inpu.freezeReason"
              autocomplete="off"
              :disabled="false"
            ></el-input>
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
  findSysWmsWarehousePullDownAll,
  findSysWmsAreaPullDownAll,
  findPullWmsBin,
  saveSysWmsCell,
  updateSysWmsCell,
  findSysWmsCell,
  findDropUnit
} from "@/api/sys/wms/warehouse";
export default {
  data() {
    return {
      inpu: {
        id: "",
        whCode: "",
        areaCode: "",
        binCode: "",
        cellCode: "",
        weightMax: 0,
        weightUnitCode: "",
        freeze: false,
        freezeReason: ""
      },
      whArr: [],
      areaArr: [],
      binArr: [],
      unit: []
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
    selectArea() {
      findPullWmsBin(this.inpu.areaCode).then(response => {
        if (response.data.success) {
          this.binArr = response.data.data.list;
        }
      });
    },
    selectWh() {
      findSysWmsAreaPullDownAll(this.inpu.whCode).then(response => {
        if (response.data.success) {
          this.areaArr = response.data.data.list;
        }
      });
    },
    getData() {
      findSysWmsWarehousePullDownAll().then(response => {
        if (response.data.success) {
          this.whArr = response.data.data.list;
        }
      });
      findDropUnit().then(response => {
        if (response.data.success) {
          this.unit = response.data.data.UNIT_ALL;
        }
      });
      if (this.type == "1") {
        this.reSet();
      } else {
        findSysWmsCell(this.id).then(response => {
          if (response.data.success) {
            this.inpu = response.data.data.data;
          }
        });
      }
    },
    cancel() {
      this.$emit("cancel");
    },
    save() {
      if (this.type == "1") {
        saveSysWmsCell(this.inpu).then(response => {
          if (response.data.success) {
            this.$message.success("新增成功!");
            this.$emit("save");
          }
        });
      } else {
        updateSysWmsCell(this.inpu).then(response => {
          if (response.data.success) {
            this.$message.success("修改成功!");
            this.$emit("save");
          }
        });
      }
    },
    reSet() {
      this.inpu = {
        id: "",
        whCode: "",
        areaCode: "",
        binCode: "",
        cellCode: "",
        weightMax: 0,
        weightUnitCode: "",
        freeze: false,
        freezeReason: ""
      };
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
<style scoped>
</style>