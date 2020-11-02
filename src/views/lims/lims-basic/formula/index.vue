<template>
  <div>
    <div>
        <el-form ref="queryForm" :inline="true" label-width="100px" class="margin20 mb0">
            <el-form-item label="输出指标" prop="outIndicator">
                <el-input
                    v-model="queryForm.outIndicator"
                    maxlength="20"
                    plain="true"
                    placeholder="请输入输出指标"
                />
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
            <div style="padding-left:30px;padding-top: 10px">
              <el-button type="primary" @click="addItem" v-has="'LIMS-FORMULA-ADD'">
                <i class="el-icon-plus"></i> 新增公式
              </el-button>
              <el-button :loading="downloadLoading" type="primary" @click="exportItem" v-has="'LIMS-FORMULA-EXPORT-PAGE'">
                <i class="el-icon-download"></i> 导出本页公式
              </el-button>
              <el-button :loading="downloadLoading" type="primary" @click="exportAll" v-has="'LIMS-FORMULA-EXPORT-ALL'">
                <i class="el-icon-download"></i> 导出所有公式
              </el-button>
            </div>
        </el-form>
    </div>
    <div class="tableshadow margin20" style="width:calc(100% - 40px);">
      <el-table :data="tableData" @selection-change="selsChange" >
        <el-table-column fixed type="selection" width="45" v-if="hasBtn(['LIMS-FORMULA-EXPORT-PAGE'])"></el-table-column>
        <el-table-column label="#" align="center" width="50">
          <template slot-scope="{row,$index}">
            <span>{{$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="outIndicName" align="center" label="输出指标" show-overflow-tooltip width="220"></el-table-column>
        <el-table-column prop="theFormula" align="center" label="公式" show-overflow-tooltip width="220"></el-table-column>
        <el-table-column prop="inputIndicatorName" align="center" label="输入指标" show-overflow-tooltip width="220"></el-table-column>
        <el-table-column prop="remark" align="center" label="备注" show-overflow-tooltip width="180"></el-table-column>
        <el-table-column prop="createOn" align="center" label="创建时间" width="180"></el-table-column>
        <el-table-column prop="createBy" align="center" label="创建人" show-overflow-tooltip width="150"></el-table-column>
        <el-table-column prop="updateOn" align="center" label="更新时间" width="180"></el-table-column>
        <el-table-column prop="updateBy" align="center" label="更新人" show-overflow-tooltip width="150"></el-table-column>
      <el-table-column prop="formulaStatus" align="center" label="公式状态" >
          <template v-slot="scope">
              <el-tooltip :content="'状态: ' + scope.row.formulaStatus" placement="top">
                  <el-switch
                      v-model="scope.row.formulaStatus"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      active-value="有效"
                      inactive-value="无效"
                      size="small"
                      @change="changeSwitch(scope.row)"
                  ></el-switch>
              </el-tooltip>
          </template>
      </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="120" v-if="hasBtn(['LIMS-FORMULA-UPD','LIMS-FORMULA-DEL'])">
          <template v-slot="scope">
            <el-button type="text" size="small" @click="editItem(scope.row)" v-has="'LIMS-FORMULA-UPD'">更新</el-button>
            <el-button
              type="text"
              class="btn-text-danger"
              size="small"
              @click="deleteItem(scope.row.formulaId)"
              v-has="'LIMS-FORMULA-DEL'"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div >
        <Pagination
          :total="total"
          :page.sync="page.pageNum"
          :limit.sync="page.pageSize"
          @pagination="getData"
        />
      </div>
    </div>
    <el-dialog title="新增公式" :visible.sync="dialogAddVisible" width="40%" v-if="dialogAddVisible">
      <add-formula @hidenDialog="hidenDialog" />
    </el-dialog>
    <el-dialog title="更新公式" :visible.sync="dialogUpdateVisible" width="40%" v-if="dialogUpdateVisible">
      <update-formula @hidenDialog="hidenDialog" :selFormula="selFormula" />
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import { getFormula, deleteFormula,getFormulaAll,updateFormula} from "@/api/lims";
import UpdateFormula from "./update-formula";
import AddFormula from "./add-formula";
import { hasBtn } from "@/utils/index";
export default {
  name: "formula",
  components: {
    Pagination,
    UpdateFormula,
    AddFormula
  },
  data() {
    return {
      page: {
        pageNum: 1,
        pageSize: 10
      },
      queryForm: {
        outIndicator: ""
      },
      /*batchBtn:false,*/
      total: 0,
      sels: [],                 // 选择行数据
      selId: '',                 // 选中行ID
      tableData: [],
      dialogUpdateVisible: false,
      dialogAddVisible: false,
      downloadLoading: false,
      selFormula: {},
      list: []
    };
  },
  activated() {
    this.getData();
  },
  methods: {
    hasBtn,
    getData(pageNum) {
        if(pageNum === 1)
            this.page.pageNum = 1;
      const params = {
        ...this.queryForm,
        ...this.page
      };
      getFormula(params).then(res => {
        this.tableData = res.data.data.rows.map(v => {
          v.inputIndicatorName = (v.inputIndicName.split("@,,,@").join(' | '));
          return v;
        });
        this.total = res.data.data.total;
      });
    },
    addItem(){
      this.dialogAddVisible = true;
    },
    editItem(item) {
      this.dialogUpdateVisible = true;
      this.selFormula = item;
    },
      changeSwitch(row){
          updateFormula(row).then(response => {
              const result = response.data;
              if (result.success) {
                  this.$message({
                      type: "success",
                      message: "使用状态已更改"
                  });
                  this.getData();
              } else {
                  this.$message.error(result.message);
              }
          }).catch(e => {
              this.$message.error(e.message);
          })
      },
    deleteItem(id) {
      this.$confirm("此操作删除该条公式, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteFormula(id).then((res) => {
              if(res.data.success){
                  this.$message.success(res.data.data);
              }else {
                  this.$message.warning(res.data.message);
              }
              this.getData(1);
          });
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    exportAll(){
        getFormulaAll(this.queryForm).then(res => {
            if(res.data.success){
                this.list = res.data.data.map(v => {
                    v.inputIndicatorName = v.inputIndicName.split("@,,,@").join(',');
                    return v;
                });
                this.downloadLoading = true;
                import('@/api/Export2Excel').then(excel => {
                    const tHeader = ['序号', '输出指标', '输入指标', '公式', '备注', '创建时间', '创建人', '更新时间', '更新人'];
                    const filterVal = ['colNum', 'outIndicName', 'inputIndicatorName', 'theFormula', 'remark', 'createOn', 'createBy', 'updateOn', 'updateBy'];
                    const selExport = this.list;
                    const data = this.formatJson(filterVal, selExport);
                    excel.export_json_to_excel({
                        header: tHeader,
                        data,
                        filename: 'formula'
                    });
                    this.downloadLoading = false
                })
            }
        }).catch(e => {
            this.$message.error(e.message);
        });
    },
      clearSearchBox() {
          this.queryForm = {
              outIndicator: ""
          };
          this.getData(1);
      },
    exportItem() {
        this.downloadLoading = true;
        import('@/api/Export2Excel').then(excel => {
            const tHeader = ['序号','输出指标', '输入指标', '公式', '备注', '创建时间', '创建人', '更新时间', '更新人'];
            const filterVal = ['colNum','outIndicName', 'inputIndicatorName', 'theFormula', 'remark', 'createOn', 'createBy', 'updateOn', 'updateBy'];
            const selExport = this.sels.length===0?this.tableData:this.sels;
            const data = this.formatJson(filterVal, selExport);
            excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: 'formula'
            });
            this.downloadLoading = false
        })
    },
    formatJson(filterVal, jsonData) {
        let i = 1;
        jsonData = jsonData.map(v => {
            this.$set(v, "colNum", i++); // https://vuejs.org/v2/guide/reactivity.html
            return v;
        });
        return jsonData.map(v => filterVal.map(j => {
            return v[j]
        }))
    },
    selsChange: function(sels) {
        this.sels.length = 0;
        const _this = this;
        sels.forEach(element => {
            _this.sels.push(element)
        });
        /*this.batchBtn = this.sels.length === 0*/
    },
    hidenDialog() {
      this.dialogUpdateVisible = false;
      this.dialogAddVisible = false;
      this.getData();
    }
  }
};
</script>

<style scoped>
</style>
