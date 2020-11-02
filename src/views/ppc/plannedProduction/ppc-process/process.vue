<template>
  <el-container style="height: 100%;">
    <el-aside width="25%">
      <el-divider content-position="left">工序列表</el-divider>
      <el-tree
        :data="treeData"
        node-key="id"
        :props="defaultProps"
        :default-expanded-keys="defaultExpanded"
        :expand-on-click-node="false"
        @node-click="queryInfo"
        :highlight-current="true"
      >
        <template v-slot="{data}">
          <span class="el-icon-folder" style="font-size:14px">{{data.label}}</span>
        </template>
      </el-tree>
    </el-aside>
    <el-main style="border: 1px solid #eee;">
      <el-divider content-position="left">基本信息</el-divider>
      <el-form ref="mainInfo" :model="mainInfo" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="7">
            <el-form-item label="工序编码：" prop="processCode">
              <el-input v-model="mainInfo.processCode" placeholder="请输入工序编码" />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="工序名称：" prop="processName">
              <el-input v-model="mainInfo.processName" placeholder="请输入工序名称" />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="是否设备加工：" prop="isMachineProduce">
              <el-select
                v-model="mainInfo.isMachineProduce"
                placeholder="请选择"
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="item in IS_OR_NOT"
                  :key="item.code"
                  :label="item.label"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="父工序：" prop="parentName">
              <el-select
                v-model="mainInfo.parentCode"
                placeholder="请选择"
                filterable
                @change="parentProcessChange"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="(item,index) in opts"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="工序层级：" prop="code">
              <el-input v-model="mainInfo.level" disabled="disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="是否需要质检：" prop="isNeedInspect">
              <el-select v-model="mainInfo.isNeedInspect" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in IS_OR_NOT"
                  :key="item.code"
                  :label="item.label"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="工序类型：" prop="processType">
              <el-select
                v-model="mainInfo.processType"
                placeholder="请选择"
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="item in PROCESS_TYPE"
                  :key="item.code"
                  :label="item.label"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="计件单价(元)：" prop="price">
              <el-input v-model="mainInfo.price" type="number" min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="是否统计产量：" prop="is_statistic">
              <el-select v-model="mainInfo.is_statistic" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in IS_OR_NOT"
                  :key="item.code"
                  :label="item.label"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-button
              type="primary "
              icon="el-icon-plus"
              @click="addProcess"
              v-has="'SYS-PROCESS-SAVE'"
            >新增</el-button>
            <el-button
              type="primary "
              icon="el-icon-check"
              @click="saveProcess"
              v-has="'SYS-PROCESS-ADD'"
            >保存</el-button>
            <el-button
              type="danger "
              icon="el-icon-delete"
              :disabled="!mainInfo.id"
              @click="deleteProcess"
              v-has="'SYS-PROCESS-DELETE'"
            >删除</el-button>
            <el-button
              type="primary"
              plain
              @click="downloadTemplate"
              v-has="'SYS-PROCESS-EXPORT'"
            >导入模板下载</el-button>
            <el-upload
              class="upload"
              action="/api/sys/ppc/process/importProcess"
              :show-file-list="false"
              :headers="token"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              :on-success="uploadSuccess"
              :on-error="uploadError"
              style="display: inline-block;margin-left: 5px"
            >
              <el-button type="primary" plain v-has="'SYS-PROCESS-IMPORT'">导入</el-button>
            </el-upload>
          </el-col>
        </el-row>
      </el-form>
    </el-main>
  </el-container>
</template>
<script>
import Pagination from "@/components/Pagination";
import {
  getProcessTree,
  queryInfo,
  initData,
  saveProcess,
  deleteProcess,
  queryDevList,
  addDevToProcess,
  removeDevFromProcess,
  downlowdProcessModelTemp
} from "@/api/ppc.process";
import { saveAs } from "file-saver";
import { getToken } from "@/utils/auth";
import { setDefaultExpanded } from "@/utils/common";

export default {
  name: "processTree",
  components: {
    Pagination
  },
  mounted() {
    this.$nextTick(() => {
      this.initData();
      this.getData();
    });
  },
  data() {
    return {
      dialogFormVisible: false,
      defaultExpanded: [],
      token: {
        Authorization: `Bearer ${getToken()}`
      },
      mainInfo: {
        selectProcessCode: "",
        processCode: "",
        processName: "",
        level: "",
        id: "",
        parentCode: "",
        isMachineProduce: "0",
        belongWorkshopIds: "",
        isNeedInspect: "0",
        price: 0
      },
      rules: {
        processCode: [{ required: true, message: "请输入工序编码" }],
        processName: [{ required: true, message: "请输入工序名称" }]
      },
      PROCESS_ALL: [],
      WORKSHOP_ALL: [],
      PROCESS_TYPE: [],
      IS_OR_NOT: [],
      treeData: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      tableData: [],
      total: 0,
      page: {
        pageNum: 1,
        pageSize: 10
      },
      dialogTableData: [],
      dialogTableTotal: 0,
      dialogTablePage: {
        pageNum: 1,
        pageSize: 10
      },
      selectedDevDialog: [],
      selectedDevMain: [],
      inqu: {
        devCode: "",
        devName: ""
      },
      disabled: false,
      opts: []
    };
  },
  methods: {
    transWorkshop(row) {
      for (let i = 0; i < this.WORKSHOP_ALL.length; i++) {
        if (row.workshopCode == this.WORKSHOP_ALL[i].proccode) {
          return this.WORKSHOP_ALL[i].name;
        }
      }
    },
    getData() {
      const params = {
        ...this.page
      };
      getProcessTree(params)
        .then(response => {
          if (response.data.success) {
            this.treeData = response.data.data.resultTree;
            setDefaultExpanded(this);
            let resultList = response.data.data.resultList;
            this.PROCESS_ALL = [];
            for (let i = 0; i < resultList.length; i++) {
              this.PROCESS_ALL.push({
                label:
                  resultList[i].processCode + "-" + resultList[i].processName,
                value: resultList[i].processCode
              });
            }
          } else {
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    getOptions(data) {
      // this.PROCESS_ALL=this.PROCESS_ALL
      this.opts = this.opts.filter(item => item.value != data.processCode);
      if (data.children && data.children.length > 0) {
        data.children.forEach(item => {
          this.getOptions(item);
        });
      }
    },
    queryInfo(data) {
      queryInfo(data.selectProcessCode || data.processCode)
        .then(response => {
          if (response.data.success) {
            this.mainInfo = response.data.data.processInfo;
            console.log(this.mainInfo);
            this.mainInfo.selectProcessCode = this.mainInfo.processCode;
            this.mainInfo.isMachineProduce =
              this.mainInfo.isMachineProduce + "";
            if (this.mainInfo.belongWorkshopId) {
              this.mainInfo.belongWorkshopIds = this.mainInfo.belongWorkshopId.split(
                ","
              );
            }
            this.opts = this.PROCESS_ALL;
            this.getOptions(data);
            // let data = response.data.data.devList;
            // console.log(data);
            // for (let i = 0; i < data.length; i++) {
            //   for (let j = 0; j < this.IS_OR_NOT.length; j++) {
            //     if (this.IS_OR_NOT[j].code == data[i].issproduction) {
            //       data[i].issproduction = this.IS_OR_NOT[j].label;
            //       break;
            //     }
            //   }
            // }
            // this.tableData = data;
          } else {
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    // 导入成功
    uploadSuccess(response) {
      if (response.success) {
        this.$message.success("导入成功");
        this.getData();
      } else {
        this.$message.error(response.data);
      }
    },
    // 导入失败
    uploadError(err) {
      this.$message.error(err.message);
    },
    // 导出模板
    downloadTemplate() {
      downlowdProcessModelTemp()
        .then(response => {
          const result = response.data;
          if (result) {
            let data = new File([result], { type: "application/octet-stream" });
            saveAs(data, "工序管理.xlsx");
            // this.getData();
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    addProcess() {
      if (this.mainInfo.id) {
        this.mainInfo.parentCode = this.mainInfo.selectProcessCode;
      } else {
        this.mainInfo.parentCode = "";
      }
      this.mainInfo.id = "";
      this.mainInfo.processCode = "";
      this.mainInfo.processName = "";
      this.mainInfo.belongWorkshopIds = "";
      this.mainInfo.belongWorkshopId = "";
      this.mainInfo.isMachineProduce = "0";
      this.mainInfo.price = 0;
      this.$refs["mainInfo"].validate(() => {});
    },
    saveProcess() {
      this.$refs["mainInfo"].validate((valid, object) => {
        if (valid) {
          let belongWorkshopIds = this.mainInfo.belongWorkshopIds;
          if (belongWorkshopIds && belongWorkshopIds.length != 0) {
            this.mainInfo.belongWorkshopId = belongWorkshopIds.join(",");
          }
          saveProcess(this.mainInfo)
            .then(response => {
              if (response.data.success) {
                this.$message.success("保存成功");
                this.getData();
              } else {
                this.$message.error(
                  response.data.message + ":" + response.data.data
                );
              }
            })
            .catch(e => {
              this.$message.error(e.message);
            });
        } else {
          this.$message.error(Object.values(object)[0][0].message);
        }
      });
    },
    deleteProcess() {
      this.$confirm("此操作将删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteProcess(this.mainInfo.id)
            .then(response => {
              if (response.data.success) {
                this.$message.success("删除成功");
                this.getData();
                this.mainInfo = {};
              } else {
                this.$message.error(
                  response.data.message + ":" + response.data.data
                );
              }
            })
            .catch(e => {
              this.$message.error(e.message);
            });
        })
        .catch(() => {
          this.$message.info("取消操作");
        });
    },
    parentProcessChange(data) {
      if (data) {
        queryInfo(data)
          .then(response => {
            if (response.data.success) {
              this.mainInfo.level = response.data.data.processInfo.level + 1;
            } else {
              this.$message.error(
                response.data.message + ":" + response.data.data
              );
            }
          })
          .catch(e => {
            this.$message.error(e.message);
          });
      } else {
        this.mainInfo.level = "1";
      }
    },
    initData() {
      initData()
        .then(response => {
          if (response.data.success) {
            this.WORKSHOP_ALL = response.data.data.WORKSHOP_ALL;
            this.IS_OR_NOT = response.data.data.IS_OR_NOT;
            this.PROCESS_TYPE = response.data.data.PROCESS_TYPE;
          } else {
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    showDialog() {
      if (this.mainInfo.id) {
        this.dialogFormVisible = true;
        this.queryDevList(false);
      } else {
        this.$message.error("请先选择工序");
      }
    },
    queryDevList(flag) {
      //   若点击查询 重置当前页
      if (flag) {
        this.dialogTablePage.pageNum = 1;
      }
      let param = {
        ...this.inqu,
        ...this.dialogTablePage
      };

      queryDevList(param)
        .then(response => {
          if (response.data.success) {
            let data = response.data.data.rows;
            for (let i = 0; i < data.length; i++) {
              for (let j = 0; j < this.IS_OR_NOT.length; j++) {
                if (this.IS_OR_NOT[j].code == data[i].issproduction) {
                  data[i].issproduction = this.IS_OR_NOT[j].label;
                  break;
                }
              }
            }
            this.dialogTableData = data;
            this.dialogTableTotal = response.data.data.total;
          } else {
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    selectionChangeDialog(obj) {
      this.selectedDevDialog = [];
      for (let i = 0; i < obj.length; i++) {
        this.selectedDevDialog.push(obj[i].proccode);
      }
    },
    selectionChangeMain(obj) {
      this.selectedDevMain = [];
      for (let i = 0; i < obj.length; i++) {
        this.selectedDevMain.push(obj[i].proccode);
      }
    },
    confirmSelect() {
      this.dialogFormVisible = false;
      if (this.selectedDevDialog.length == 0) {
        return;
      }
      let params = {
        devCodes: this.selectedDevDialog.join(","),
        processCode: this.mainInfo.selectProcessCode
      };
      this.$refs.dialogTable.clearSelection();
      addDevToProcess(params)
        .then(response => {
          if (response.data.success) {
            this.$message.success("新增成功");
            this.queryInfo(this.mainInfo);
          } else {
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    removeDevFromProcess() {
      if (this.selectedDevMain.length == 0) {
        return;
      }
      this.$confirm("此操作将删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            devCodes: this.selectedDevMain.join(","),
            processCode: this.mainInfo.selectProcessCode
          };
          removeDevFromProcess(params)
            .then(response => {
              if (response.data.success) {
                this.$message.success("删除设备成功");
                this.queryInfo(this.mainInfo);
              } else {
                this.$message.error(
                  response.data.message + ":" + response.data.data
                );
              }
            })
            .catch(e => {
              this.$message.error(e.message);
            });
        })
        .catch(() => {
          this.$message.info("取消操作");
        });
    },
    clear() {
      this.$refs["mainInfo"].resetFields();
      this.queryDevList();
    }
  }
};
</script>
<style lang="scss" scoped>
.el-main {
  overflow-y: auto;
}
</style>
