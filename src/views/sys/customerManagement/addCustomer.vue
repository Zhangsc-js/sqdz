<template>
  <div style="height: 100%;">
    <el-form :model="inpu" label-width="180px" ref="inpu" :rules="rule">
      <el-row>
        <el-col :span="10">
          <el-form-item label="客户代码：" prop="customerCode">
            <el-input v-model="inpu.customerCode" autocomplete="off" :disabled="isDisable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="客户名称：" prop="customerName">
            <el-input v-model="inpu.customerName" autocomplete="off" :disabled="false"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="固定电话：" prop="telephone">
            <el-input v-model="inpu.telephone" autocomplete="off" :disabled="false"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="电子邮件：" prop="email">
            <el-input v-model="inpu.email" autocomplete="off" :disabled="false"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="公司地址：" prop="customerAddr">
            <el-input v-model="inpu.customerAddr" autocomplete="off" :disabled="false"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="统一社会信用代码：" prop="companyCode">
            <el-input v-model="inpu.companyCode" autocomplete="off" :disabled="false"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="客户规模：" prop="sacle">
            <el-select
              v-model="inpu.sacle"
              filterable
              placeholder="请选择"
              style="width: 150px;height: 100%"
            >
              <el-option
                v-for="item in this.sacles"
                :key="item.code"
                :label="item.label"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="信用等级：" prop="creditLevel">
            <el-select
              v-model="inpu.creditLevel"
              filterable
              placeholder="请选择"
              style="width: 150px;height: 100%"
            >
              <el-option
                v-for="item in this.creditLevels"
                :key="item.code"
                :label="item.label"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="公司简介:" prop="companyDesc">
        <el-input type="textarea" v-model="inpu.companyDesc"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button icon="el-icon-close" @click="cancel()">取 消</el-button>
      <el-button type="primary" icon="el-icon-check" @click="save()">保存</el-button>
    </div>
    <edit-table
      :tableData="tableData"
      :opts.sync="tableColumnMain"
      highlight-current-row
      :page="pageTable"
      :total="totalTable"
      :showAddBtn="authority"
      @getData="getTableData"
      @savaData="saveMain"
      style="width: 99%;height: 300px;"
      height="75%"
      @deleteRow="deleteMain"
      :showOptBtn="authority"
      pageName="SYS-DICT"
    ></edit-table>
  </div>
</template>
<script>
import {
  queryStatus,
  querySacles,
  findSysCustomerUserService,
  saveSysCustomerUser,
  updateSysCustomerUser,
  deleteSysCustomerUser,
  saveSysCustomer,
  findSysCustomerById,
  updataSysCustomer
} from "@/api/sys/customer";
import EditTable from "@/components/EditTable";
export default {
  data() {
    return {
      customerUser: {
        id: "",
        customerCode: "",
        linkName: "",
        telephone: "",
        isDefault: ""
      },
      pageTable: {
        pageNum: 1,
        pageSize: 10
      },
      totalTable: 0,
      inpu: {
        id: "",
        customerCode: "",
        customerName: "",
        customerAddr: "",
        companyCode: "",
        telephone: "",
        email: "",
        sacle: "",
        creditLevel: "",
        companyDesc: ""
      },
      authority: true,
      showAddBtn: true,
      tableColumnMain: [
        {
          type: "input",
          label: "联系人姓名",
          prop: "linkName",
          rule: true
        },
        {
          type: "input",
          label: "联系方式",
          prop: "telephone",
          rule: true
        },
        {
          type: "select",
          label: "是否默认联系人",
          prop: "isDefault",
          rule: true,
          options: [
            {
              label: "是",
              value: "1"
            },
            {
              label: "否",
              value: "0"
            }
          ]
        }
      ],
      tableData: [],
      sacles: [],
      creditLevels: [],
      isDisable: false,
      rule: {
        customerName: [
          {
            required: true,
            message: "请输入公司名称",
            trigger: ["blur", "change"]
          }
        ],
        customerCode: [
          {
            required: true,
            message: "请输入公司代码",
            trigger: ["blur", "change"]
          }
        ],
        telephone: [
          { required: true, message: "请输入电话", trigger: ["blur", "change"] }
        ]
      }
    };
  },
  components: {
    EditTable
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
    }
  },
  methods: {
    save() {
      let that = this;
      this.$refs["inpu"].validate((valid, object) => {
        if (valid) {
          if (this.type == 1) {
            saveSysCustomer(this.inpu)
              .then(response => {
                const result = response.data;
                if (result.success) {
                  that.inpu.id = result.data.data.companyId;
                  that.inpu.customerCode = result.data.companyCode;
                  that.$emit("getIdAndType", that.inpu.id, "2");
                  console.log("type++++++++", that.inpu.id);
                  this.isDisable = true;

                  that.$message.success("新增成功!");
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
            updataSysCustomer(this.inpu)
              .then(response => {
                const result = response.data;
                if (result.success) {
                  this.$message.success("修改成功!");
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
    getData() {
      this.isDisable = false;
      this.$refs["inpu"].resetFields();
      this.tableData = [];
      queryStatus().then(response => {
        if (response.data.success) {
          this.creditLevels = response.data.data.CREDIT_LEVEL;
        }
      });
      querySacles().then(response => {
        if (response.data.success) {
          this.sacles = response.data.data.CUSTOMER_SCALE;
        }
      });
      if (this.type == "1") {
        this.isDisable = false;
      } else if (this.type == "2") {
        this.isDisable = true;
        findSysCustomerById(this.id).then(response => {
          if (response.data.success) {
            this.inpu = response.data.data.data;
          }
          this.getTableData();
        });
      }
    },
    getTableData() {
      this.customerUser.customerCode = this.inpu.customerCode;

      const params = {
        ...this.pageTable,
        ...this.customerUser
      };
      console.log(params);
      findSysCustomerUserService(params).then(response => {
        if (response.data.success) {
          this.tableData = response.data.data.list;
          this.totalTable = response.data.data.total;
        }
      });
    },
    saveMain(data, done) {
      if (!data.linkName) {
        this.$message.error("联系人姓名不可为空");
        return;
      }
      if (!data.telephone) {
        this.$message.error("联系人电话不可为空");
        return;
      }
      if (!data.isDefault) {
        this.$message.error("是否为默认联系人不可为空");
        return;
      }
      done();
      data.customerCode = this.inpu.customerCode;
      console.log(data);
      if (data.id == "" || data.id == null) {
        saveSysCustomerUser(data).then(response => {
          if (response.data.success) {
            this.$message.success("新增成功");
            this.getTableData();
          }
        });
      } else {
        updateSysCustomerUser(data).then(response => {
          this.$message.success("更新成功");
          this.getTableData();
        });
      }
    },
    deleteMain(data) {
      deleteSysCustomerUser(data).then(response => {
        if (response.data.success) {
          this.$message.success("删除成功");
          this.getData();
        }
      });
    }
  },
  mounted() {
    this.getData();
  },
  watch: {
    trigger() {
      if (this.trigger) this.getData();
    },
    type(val) {
      console.log(val);
      this.getData();
    }
  }
};
</script>
