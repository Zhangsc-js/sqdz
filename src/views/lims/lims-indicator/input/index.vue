<template>
  <div class="lims_indicator">
    <div>
      <el-form ref="queryForm" :inline="true" label-width="100px" class="margin20 mb0">
        <el-form-item label="指标名称" prop="inputName">
          <el-input
            v-model="queryForm.inputName"
            maxlength="20"
            plain="true"
            placeholder="请输入指标名称"
          />
        </el-form-item>
        <el-form-item label="指标编号" prop="inputCode">
          <el-input
            v-model="queryForm.inputCode"
            :maxlength="20"
            plain="true"
            placeholder="请输入指标编号"
          />
        </el-form-item>
        <el-form-item label="可使用状态" prop="inputStatus">
          <el-select v-model="queryForm.inputStatus" maxlength="20" @change="getData(1)" placeholder="请选择指标状态">
            <el-option
              v-for="item in statType"
              :key="item.statId"
              :label="item.stat"
              :value="item.stat"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            icon="el-icon-search"
            href="javascript:void(0)"
            type="primary"
            class="btn-b"
            @click="getData(1)"
          >查询</el-button>
          <el-button href="javascript:void(0)" class="btn-w" @click="clearSearchBox">清空</el-button>
        </el-form-item>
        <div style="padding-left:30px;">
          <el-button type="primary" @click="addInput()" icon="el-icon-plus" v-has="'LIMS-INPUT-INDICATOR-ADD'">新增</el-button>
          <!--<el-button :disabled="batchBtn" type="danger " @click="batchDel" v-has="'LIMS-INPUT-INDICATOR-BATCH'">批量删除</el-button>-->
        </div>
      </el-form>
    </div>
    <div class="tableshadow margin20" style="width:calc(100% - 40px);">
      <el-table
        :data="tableData"
        v-loading="loading"
        @selection-change="selsChange"
        style="width: 100%"
      >
        <!--<el-table-column fixed type="selection" width="55" v-if="hasBtn(['LIMS-INPUT-INDICATOR-BATCH'])"></el-table-column>-->
        <el-table-column label="#" width="55" align="center">
          <template slot-scope="{row,$index}">
            <span>{{$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="inputName" align="center" label="指标名称" width="180"></el-table-column>
        <el-table-column prop="inputCode" align="center" label="指标编号" width="180"></el-table-column>
        <el-table-column prop="inputInitial" align="center" label="初始值" width="180"></el-table-column>
        <el-table-column prop="inputUnit" align="center" label="计量单位"></el-table-column>
        <el-table-column
          prop="inputRemark"
          align="center"
          label="备注"
          show-overflow-tooltip
          width="180"
        ></el-table-column>
        <el-table-column prop="inputOptime" align="center" label="最近操作时间" width="180"></el-table-column>
        <el-table-column
          prop="inputOperator"
          align="center"
          label="操作人员"
          show-overflow-tooltip
          width="180"
        ></el-table-column>
        <el-table-column fixed="right" prop="inputStatus" align="center" label="可使用状态" width="100">
          <template v-slot="scope">
            <el-tooltip :content="'状态: ' + scope.row.inputStatus" placement="top">
              <el-switch
                v-model="scope.row.inputStatus"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="有效"
                inactive-value="无效"
                size="small"
                @change="changeSwitch(scope.row)"
                :disabled="!hasBtn(['LIMS-INPUT-INDICATOR-STATUS'])"
              ></el-switch>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="180" v-if="hasBtn(['LIMS-INPUT-INDICATOR-UPD','LIMS-INPUT-INDICATOR-DEL'])">
          <template v-slot="scope">
            <el-button type="text" size="small" @click="updateInput(scope.row.inputId,scope.row.inputStatus)" v-has="'LIMS-INPUT-INDICATOR-UPD'">更新</el-button>
            <el-button type="text" size="small" @click="deleteInput(scope.row.inputId)" v-has="'LIMS-INPUT-INDICATOR-DEL'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        :total="total"
        :page.sync="page.pageNum"
        :limit.sync="page.pageSize"
        @pagination="getData"
      />

      <el-dialog title="更新" :visible.sync="dialogVisible" width="40%" v-if="dialogVisible">
        <input-upd @hidenDialog="hidenDialog" :inputObj="selObj" />
      </el-dialog>
      <el-dialog title="新增" :visible.sync="addDialogVisible" width="40%" v-if="addDialogVisible">
        <input-add @hidenDialog="hidenDialog" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import {
  getInIndicators,
  updateInIndicator,
  deleteInIndicator,
  getInIndicator,
  deleteInIndicators,
  getFormulaByInputId
} from "@/api/lims";
import { simpleDateFormat } from "@/utils/index";
import InputAdd from "./input-add";
import InputUpd from "./input-upd";
import { hasBtn } from "@/utils/index";
export default {
  name: "inputManager",
  components: {
    Pagination,
    InputAdd,
    InputUpd
  },
  data() {
    return {
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      loading: false,
      tableData: [],
      queryForm: {
        // 查询表单
        inputName: "",
        inputCode: "",
        inputStatus: ""
      },
      statType: [
        {
          statId: "1",
          stat: "有效"
        },
        {
          statId: "2",
          stat: "无效"
        }
      ],
      showMore: false,
      dialogVisible: false,
      addDialogVisible: false,
      batchBtn: true,
      sels: [], // 选择行数据
      selObj: "", // 选中行ID,状态
        str:['\\','%','_'],
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    hasBtn,
    /*formatDate: function(row, column) {
                let date = new Date(row.inputOptime);
                return simpleDateFormat(date, 'yyyy-MM-dd HH:mm:ss');
            },*/
    changeSwitch(row) {
      updateInIndicator(row)
        .then(response => {
          const result = response.data;
          if (result.success) {
            this.$message({
              type: "success",
              message: "使用状态已更改"
            });
              this.getData();
          } else {
            this.$message({
              type: "error",
              message: result.message
            });
          }
        })
        .catch(e => {
          this.$message({
            type: "error",
            message: e.message
          });
        });
    },
    formatSpace(val) {
      return val.replace(/(^\s*)|(\s*$)/g, "");
    },
    getData(pageNum) {
        if(pageNum === 1)
            this.page.pageNum = 1;
        if(this.total!==0 && this.total < this.page.pageNum*this.page.pageSize) {
            if (this.total % this.page.pageSize > 0)
                this.page.pageNum = parseInt(this.total / this.page.pageSize) + 1;
            else
                this.page.pageNum = parseInt(this.total / this.page.pageSize);
        }
        let queryParam = JSON.parse(JSON.stringify(this.queryForm));
        queryParam.inputName =  this.formatSpace(queryParam.inputName);
        queryParam.inputCode =  this.formatSpace(queryParam.inputCode);
        this.str.forEach(i=> {
            if (queryParam.inputName.indexOf(i) > -1) {
                queryParam.inputName = queryParam.inputName.replace(new RegExp('\\'+i, 'g'), '\\' + i);
            }
            if (queryParam.inputCode.indexOf(i) > -1) {
                queryParam.inputCode = queryParam.inputCode.replace(new RegExp('\\'+i, 'g'), '\\' + i);
            }
        });
      const params = {
        ...this.page,
        ...queryParam
      };
      getInIndicators(params)
        .then(res => {
          if(res.data.success) {
              this.tableData = res.data.data.rows;
              this.total = res.data.data.total;
          }else{
              this.message.error(res.data.data);
          }
        })
        .catch(e => {
          Message({
            type: "error",
            message: e.message,
            duration: 3 * 1000
          });
        });
    },
    addInput() {
      this.addDialogVisible = true;
    },
    updateInput(id,status) {
      this.selObj = {id:id,status:status};
      this.dialogVisible = true;
    },
    deleteInput(id) {
        getFormulaByInputId({id:id}).then((res) => {
            const result = res.data;
            if(result.success){
                let messageStr;
                if(!!result.data && result.data.length !== 0) {
                    messageStr = '该输入指标已有公式运用，是否继续删除？';
                }else {
                    messageStr = '该操作会永远删除该记录，是否确认删除？';
                }
                this.$confirm(messageStr, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteInIndicator(id).then((response) => {
                        if(response.data.success) {
                            this.$message.success('删除成功!');
                            this.getData();
                        }else{
                            this.$message.error(response.data.message);
                        }
                    }).catch(e=>{
                        this.$message.error(e.message);
                    })
                }).catch(() => {
                    this.$message.info('已取消删除')
                })
            }else {
                this.$message.error(result.message);
            }
        }).catch(e=>{
            this.$message.error(e.message);
        })
    },/*
            batchDel() {
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let ids = this.sels;
                    deleteInIndicators(ids).then(response => {
                        const result = response.data;
                        if (result.success) {
                            this.$message({
                                type: 'success',
                                message: '批量删除成功!'
                            });
                            // 刷新页面
                            this.getData()
                        } else {
                            this.$message({
                                type: 'error',
                                message: result.message
                            })
                        }
                    })
                })
            },*/
    hidenDialog() {
      this.addDialogVisible = false;
      this.dialogVisible = false;
      this.getData();
    },
    selsChange: function(sels) {
      this.sels.length = 0;
      const _this = this;
      sels.forEach(element => {
        _this.sels.push(element.inputId);
      });
      this.batchBtn = this.sels.length === 0;
    },
    clearSearchBox() {
      this.queryForm = {
        inputName: "",
        inputCode: "",
        inputStatus: ""
      };
      this.getData(1);
    }
  }
};
</script>
<style lang="css">
.lims_indicator .el-tooltip__popper {
  max-width: 30%;
}
</style>
<style scoped>
.el-form .el-col .el-button {
  margin: 0px 0px 0px 2px;
}
.padding20 .pt12 .el-button {
  margin: 0px 0px 12px 10px;
}
</style>
