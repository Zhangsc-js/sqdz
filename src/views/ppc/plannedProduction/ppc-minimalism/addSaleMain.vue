<template>
  <div>
    <el-form :model="inpu" label-width="180px" ref="inpu" :rules="rule">
      <el-row>
        <el-col :span="10">
          <el-form-item label="销售订单号" prop="soNo">
            <el-input v-model="inpu.soNo" autocomplete="off" :disabled="isDisable || type=='2'" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="销售单名称" prop="soName">
            <el-input v-model="inpu.soName" autocomplete="off" :disabled="isDisable" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="销售部门" prop="departCode">
            <el-select
              v-model="inpu.departCode"
              filterable
              placeholder="请选择"
              style="width: 100%"
              @change="departChanged"
              :disabled="isDisable"
            >
              <el-option
                v-for="item in devMap"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="业务员" prop="salesPersonCode">
            <el-select
              v-model="inpu.salesPersonCode"
              filterable
              placeholder="请选择"
              style="width: 100%"
              @change="selectPersChange"
              :disabled="isDisable"
            >
              <el-option
                v-for="item in userList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="采购商名称" prop="customerCode">
            <el-select
              v-model="inpu.customerCode"
              filterable
              placeholder="请选择"
              style="width: 100%"
              @change="customerChanged"
              :disabled="isDisable"
            >
              <el-option
                v-for="item in this.customerPull"
                :key="item.customerCode"
                :label="item.customerName"
                :value="item.customerCode"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="联系人" prop="customerLinkPerson">
            <el-select
              v-model="inpu.customerLinkPerson"
              filterable
              placeholder="请选择"
              style="width: 100%"
              @change="selectCustomerUser"
              :disabled="isDisable"
            >
              <el-option
                v-for="item in this.customerUserPull"
                :key="item.id"
                :label="item.linkName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="联系方式" prop="customerLinkPhone">
            <el-input v-model="inpu.customerLinkPhone" autocomplete="off" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="交货日期" prop="deliveryDate" :disabled="isDisable">
            <el-date-picker
              type="date"
              v-model="inpu.deliveryDate"
              value-format="yyyy-MM-dd"
              :disabled="disabled"
              clearable
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="下单日期" prop="receiveDate" :disabled="isDisable">
            <el-date-picker
              type="date"
              v-model="inpu.receiveDate"
              value-format="yyyy-MM-dd"
              :disabled="disabled"
              clearable
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="状态" prop="status">
            <el-select v-model="inpu.status" clearable filterable :disabled="true">
              <el-option
                v-for="item in SALE_STATUS"
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
      <el-button type="primary" icon="el-icon-check" @click="save()" v-if="isDisable==false">保存</el-button>
    </div>
    <el-table
      highlight-current-row
      :data="tableData"
      stripe
      border
      height="300px"
      style=" width: 100%"
    >
      <el-table-column prop="sdNo" label="子订单号" width="170px"></el-table-column>
      <el-table-column prop="materialCode" label="物料编码" width="120px"></el-table-column>
      <el-table-column prop="materialName" label="物料名称" width="120px"></el-table-column>
      <el-table-column prop="specification" label="规格" width="120px"></el-table-column>
      <el-table-column prop="quality" label="材质" width="120px"></el-table-column>
      <el-table-column prop="color" label="颜色" width="120px"></el-table-column>
      <el-table-column prop="qty" label="订单数量" width="120px"></el-table-column>
      <el-table-column prop="sendedQty" label="已发货数量" width="120px"></el-table-column>
      <el-table-column prop="unit" label="单位" width="120px"></el-table-column>
      <el-table-column prop="status" label="状态" width="100px" :formatter="statusTransform"></el-table-column>
      <el-table-column prop="remarks" label="备注" width="120px"></el-table-column>
      <div>
        <el-table-column fixed="right" align="center" label="操作" width="140px">
          <template v-slot="scope">
            <el-button type="text" size="small" @click="updatePpcSaleDetail(scope.row)">更新</el-button>
            <el-button
              type="text"
              size="small"
              @click="deletePpcSaleDetail(scope.row)"
              v-if="scope.row.status<=10"
            >删除</el-button>
          </template>
        </el-table-column>
      </div>
    </el-table>
    <el-button
      type="primary"
      icon="el-icon-plus"
      v-show="showAddBtn"
      @click="detaddSale"
      :disabled="addBtnDsible"
    >新增</el-button>
    <el-dialog :title="title" :visible.sync="addDialogVisible" width="50%" append-to-body>
      <addSaleDetail
        @save="hidenDialog"
        @cancel="hidenDialogCancel"
        :trigger="addDialogVisible"
        :detype="detype"
        :id="saleId"
        :sId="staId"
      />
    </el-dialog>
  </div>
</template>
<script>
import { resetQueryForm } from "@/utils/common";
import { sltUserByDepartId } from "@/api/sys";
import {
  getSaleMainAll,
  selectDepart,
  getSaleStatus,
  getBomVerStatusList,
  addSaleMain,
  getBomEffect,
  getPpcSalebyId,
  updatePpcSaleById,
  findPpcSaleDetailByMainId,
  deletePpcSaleDetail,
  findPullDownSysCustomer,
  findPullDownSysCustomerUser
} from "@/api/productionPlanning";
import addSaleDetail from "./addSaleDetail";
export default {
  components: {
    addSaleDetail
  },
  data() {
    return {
      title: "",
      addBtnDsible: true,
      sltMaterialDialogVisible: false,
      objId: "",
      showAddBtn: true,
      devMap: [],
      userList: [],
      addDialogVisible: false,
      saleId: "",
      isDisable: false,
      disabled: false,
      showOptBtn: true,
      detype: "",
      staId: "",
      SALE_STATUS: [],
      category: "1,2,3,5,6,99",
      total: 0,
      tableData: [],
      page: {
        current: 1,
        pageSize: 1000,
        mainId: ""
      },
      customerPull: [],
      customerUserPull: [],
      inpu: {
        id: "",
        soNo: "",
        soName: "",
        departCode: "",
        departName: "",
        salesPersonCode: "",
        salesPersonName: "",
        receiveDate: "",
        deliveryDate: "",
        customerCode: "",
        customerLinkPerson: "",
        customerLinkPhone: "",
        status: "",
        createBy: "",
        updateBy: ""
      },
      tableMainData: [],
      rule: {
        soName: [
          {
            required: true,
            message: "请输入销售单名称",
            trigger: ["change", "blur"]
          }
        ],
        departCode: [
          { required: true, message: "请选择部门", trigger: ["change", "blur"] }
        ],
        salesPersonCode: [
          {
            required: true,
            message: "请选择业务员",
            trigger: ["change", "blur"]
          }
        ],
        linkMan: [
          {
            required: true,
            message: "请输入联系人",
            trigger: ["change", "blur"]
          }
        ],
        linkTelephone: [
          {
            required: true,
            message: "请输入联系方式",
            trigger: ["change", "blur"]
          }
        ],
        customerCode: [
          {
            required: true,
            message: "请输入采购商名称",
            trigger: ["change", "blur"]
          }
        ],
        customerLinkPerson: [
          {
            required: true,
            message: "请输入联系人",
            trigger: ["change", "blur"]
          }
        ],
        customerLinkPhone: [
          {
            required: true,
            message: "请输入联系方式",
            trigger: ["change", "blur"]
          }
        ],
        deliveryDate: [
          {
            required: true,
            message: "请选择交货日期",
            trigger: ["change", "blur"]
          }
        ],
        receiveDate: [
          {
            required: true,
            message: "请选择下单日期",
            trigger: ["change", "blur"]
          }
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
      required: true
    },
    type: {
      type: String,
      required: true
    },
    sId: {
      type: String,
      required: true
    }
  },
  watch: {
    trigger() {
      if (this.trigger) this.initData(1);
    }
  },
  methods: {
    reSet() {
      this.tableData = [];
      this.inpu = {
        id: "",
        soNo: "",
        soName: "",
        departCode: "",
        departName: "",
        salesPersonCode: "",
        salesPersonName: "",
        receiveDate: "",
        deliveryDate: "",
        customerCode: "",
        customerLinkPerson: "",
        customerLinkPhone: "",
        status: "10",
        createBy: "",
        updateBy: ""
      };
    },
    hidenDialog() {
      this.addDialogVisible = false;
      this.getDataDetail(this.inpu.id);
    },
    hidenDialogCancel() {
      this.addDialogVisible = false;
    },
    initData(current) {
      this.addBtnDsible = true;
      this.showAddBtn = true;
      this.isDisable = false;
      findPullDownSysCustomer().then(response => {
        if (response.data.success) {
          this.customerPull = response.data.data.list;
        }
      });
      selectDepart()
        .then(response => {
          const result = response.data;
          if (result.success) {
            this.devMap = result.data;
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });

      if (this.type == 1) {
        this.$refs["inpu"].resetFields();
        this.reSet();
        getSaleStatus().then(response => {
          if (response.data.success) {
            this.SALE_STATUS = response.data.data.SALE_STATUS;
            this.inpu.status = this.SALE_STATUS[0].code;
          }
        });
      } else if (this.type == 2) {
        this.getDataMain(this.id);
        this.getDataDetail(this.id);
        this.addBtnDsible = false;
        getSaleStatus().then(response => {
          if (response.data.success) {
            this.SALE_STATUS = response.data.data.SALE_STATUS;
          }
        });
        if (this.sId >= 25) {
          this.showAddBtn = false;
          this.isDisable = true;
        } else {
          this.isDisable = false;
          this.showAddBtn = true;
        }
      }
    },
    getDataMain(mainId) {
      getPpcSalebyId(mainId).then(response => {
        if (response.data.success) {
          console.log(response.data.data);
          this.inpu = response.data.data.data;
          this.customerChanged(this.inpu.customerCode, 1);
          this.selectSalePersonsByDepartCode(this.inpu.departCode);
        }
      });
    },
    getDataDetail(mainId) {
      this.page.mainId = mainId;
      this.page.current = 1;
      const params = {
        ...this.page
      };
      findPpcSaleDetailByMainId(params).then(response => {
        if (response.data.success) {
          console.log(response.data.data.list);
          this.tableData = response.data.data.list;
        }
      });
    },
    updatePpcSaleDetail(row) {
      this.title = "子订单更新";
      this.addDialogVisible = true;
      this.saleId = this.inpu.id;
      this.detype = "2";
      this.staId = row.id;
    },
    statusTransform(row, column) {
      let status = this.SALE_STATUS;
      for (let index = 0; index < status.length; index++) {
        const element = status[index];
        if (element.code == row.status) {
          return element.label;
        }
      }
    },
    customerChanged(value, num) {
      if (num != 1) {
        this.inpu.customerLinkPerson = "";
      }
      findPullDownSysCustomerUser(value).then(response => {
        if (response.data.success) {
          console.log(this.inpu.customerLinkPerson);
          this.customerUserPull = response.data.data.list;
          if (
            this.customerUserPull.length > 0 &&
            !this.inpu.customerLinkPerson
          ) {
            // this.inpu.customerLinkPerson = this.customerUserPull[0].id;
            this.selectCustomerUser(this.inpu.customerLinkPerson);
          }
        }
      });
    },
    selectCustomerUser(value) {
      for (let index = 0; index < this.customerUserPull.length; index++) {
        const element = this.customerUserPull[index];
        if (value == element.id) {
          this.inpu.customerLinkPhone = element.telephone;
        }
      }
    },
    departChanged(departCode) {
      this.inpu.salesPersonCode = "";
      this.selectSalePersonsByDepartCode(departCode);
    },
    selectSalePersonsByDepartCode(departCode) {
      let departId = "";
      for (let i = 0; i < this.devMap.length; i++) {
        if (this.devMap[i].code == departCode) {
          this.inpu.departName = this.devMap[i].name;
          departId = this.devMap[i].id;
        }
      }
      sltUserByDepartId(departId).then(response => {
        let data = response.data;
        if (data.success) {
          this.userList = data.data;
        }
      });
    },

    deletePpcSaleDetail(row) {
      let that = this;
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          deletePpcSaleDetail(row.id).then(response => {
            console.log(response);
            if (response.data.success) {
              that.$message.success("删除成功!");
              this.getDataDetail(this.inpu.id);
            } else
              that.$message.error(
                response.data.message + ":" + response.data.data
              );
          });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    selectPersChange(value) {
      let persId = "";
      for (let i = 0; i < this.userList.length; i++) {
        if (this.userList[i].value == value) {
          this.inpu.salesPersonName = this.userList[i].label;
        }
      }
    },
    resetForm() {
      resetQueryForm(this);
    },
    save() {
      this.$refs["inpu"].validate((valid, object) => {
        if (valid) {
          if (this.inpu.receiveDate > this.inpu.deliveryDate) {
            this.$message.error("交货日期不能早于下单日期");
            return;
          }
          let name = this.customerUserPull.filter(
            item => item.id == this.inpu.customerLinkPerson
          )[0].linkName;
          let customerName = this.customerPull.filter(
            item => item.customerCode == this.inpu.customerCode
          )[0].customerName;
          let params = {
            ...this.inpu,
            customerLinkPersonName: name,
            customerName
          };
          console.log(params);
          if (this.type == 1) {
            addSaleMain(params)
              .then(response => {
                const result = response.data;
                // console.log(result.data.id);
                if (result.success) {
                  this.$message.success("新增成功!");
                  this.type = 2;
                  this.addBtnDsible = false;
                  this.inpu.id = result.data.id;
                  this.getDataMain(result.data.id);
                } else {
                  this.$message.error(result.message + ":" + result.data);
                }
              })
              .catch(e => {
                this.$message({
                  type: "error",
                  message: e.message
                });
              });
          } else {
            updatePpcSaleById(params)
              .then(response => {
                const result = response.data;
                if (result.success) {
                  this.$message.success("修改成功!");
                  this.getDataMain(this.inpu.id);
                } else {
                  this.$message.error(result.message + ":" + result.data);
                }
              })
              .catch(e => {
                this.$message({
                  type: "error",
                  message: e.message
                });
              });
          }
        } else {
          this.$message.error(Object.values(object)[0][0].message);
        }
      });
    },
    cancel() {
      this.$emit("cancel");
    },
    detaddSale() {
      this.title = "新增销售子订单";
      this.addDialogVisible = true;
      this.saleId = this.inpu.id;
      this.detype = "1";
    },
    cancel() {
      this.$emit("cancel");
    }
  },
  mounted() {
    this.initData(1);
  }
};
</script>
