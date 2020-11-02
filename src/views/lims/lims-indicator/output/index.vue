<template>
    <div>
        <el-form ref="queryForm" :inline="true" label-width="100px" class="margin20 mb0">
            <el-form-item label="指标名称" prop="outName">
                <el-input v-model="queryForm.outName" maxlength="20" plain="true" placeholder="请输入指标名称"/>
            </el-form-item>
            <el-form-item label="指标编号" prop="outCode">
                <el-input v-model="queryForm.outCode" :maxlength="20" plain="true" placeholder="请输入指标编号"/>
            </el-form-item>
            <el-form-item label="可使用状态" prop="outStatus">
                <el-select v-model="queryForm.outStatus" maxlength="20" @change="getData(1)" placeholder="请选择指标状态">
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
                >查询
                </el-button>
                <el-button href="javascript:void(0)" class="btn-w" @click="clearSearchBox">清空</el-button>
            </el-form-item>
            <div style="padding-left:30px;">
                <el-button type="primary" @click="addOut()" icon="el-icon-plus" v-has="'LIMS-OUTPUT-INDICATOR-ADD'">新增
                </el-button>
            </div>
            <!-- <el-button :disabled="batchBtn" type="danger " @click="batchDel">批量删除</el-button>-->
        </el-form>
        <div class="tableshadow margin20" style="width: calc(100% - 40px);">
            <!-- <el-form ref="queryForm" label-width="100px" class="margin20 mb0">
                      <el-col :span="5">
                          <el-form-item label="指标名称" prop="outName">
                              <el-input
                                      v-model="queryForm.outName"
                                      :maxlength="20"
                                      plain="true"
                                      placeholder="请输入指标名称"
                              />
                          </el-form-item>
                      </el-col>
                      <el-col :span="5">
                          <el-form-item label="指标编号" prop="outCode">
                              <el-input
                                      v-model="queryForm.outCode"
                                      :maxlength="20"
                                      plain="true"
                                      placeholder="请输入指标编号"
                              />
                          </el-form-item>
                      </el-col>
                      <el-col :span="5">
                          <el-form-item label="可使用状态" prop="outStatus">
                              <el-select
                                         v-model="queryForm.outStatus"
                                         :maxlength="20"
                                         placeholder="请选择指标状态">
                                  <el-option v-for="item in statType" :key="item.statId" :label="item.statId" :value="item.stat"></el-option>
                              </el-select>
                          </el-form-item>
                      </el-col>
                      <el-col :span="6" class="pt12" style="margin-left: 20px">
                          <el-button icon="el-icon-search" href="javascript:void(0)" type="primary" class="btn-b" @click="getData">查询</el-button>
                          <el-button href="javascript:void(0)" class="btn-w" @click="clearSearchBox">清空</el-button>
                      </el-col>
                      <el-col></el-col>
            </el-form>-->

            <el-table
                :data="tableData"
                v-loading="loading"
                @selection-change="selsChange"
                style="width: 100%"
            >
                <!--<el-table-column fixed type="selection" width="55" v-has="'LIMS-OUTPUT-INDICATOR-BATCH'"></el-table-column>-->
                <el-table-column label="#" width="55" align="center">
                    <template slot-scope="{row,$index}">
                        <span>{{$index + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="outName" align="center" label="指标名称" width="180"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column prop="outCode" align="center" label="指标编号" width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column prop="llowerLimit" align="center" label="指标下下限" min-width="120"></el-table-column>
                <el-table-column prop="lowerLimit" align="center" label="指标下限"></el-table-column>
                <el-table-column prop="upperLimit" align="center" label="指标上限"></el-table-column>
                <el-table-column prop="uupperLimit" align="center" label="指标上上限" min-width="120"></el-table-column>
                <el-table-column prop="decimalDigits" align="center" label="小数点位数" min-width="120"></el-table-column>
                <el-table-column prop="outUnit" align="center" label="计量单位"></el-table-column>
                <el-table-column
                    prop="outRemark"
                    align="center"
                    label="备注"
                    show-overflow-tooltip
                    width="180"
                ></el-table-column>
                <el-table-column prop="outOptime" align="center" label="最近操作时间" width="180"></el-table-column>
                <el-table-column
                    prop="outOperator"
                    align="center"
                    label="操作人员"
                    show-overflow-tooltip
                    width="180"
                ></el-table-column>
                <el-table-column fixed="right" prop="outStatus" align="center" label="可使用状态" width="100">
                    <template v-slot="scope">
                        <el-tooltip :content="'状态: ' + scope.row.outStatus" placement="top">
                            <el-switch
                                v-model="scope.row.outStatus"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                active-value="有效"
                                inactive-value="无效"
                                @change="changeSwitch(scope.row)"
                                :disabled="!hasBtn(['LIMS-OUTPUT-INDICATOR-STATUS'])"
                            ></el-switch>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" align="center" label="操作" width="180"
                                 v-if="hasBtn(['LIMS-OUTPUT-INDICATOR-UPD','LIMS-OUTPUT-INDICATOR-DEL'])">
                    <template v-slot="scope">
                        <el-button type="text" size="small" @click="updateOut(scope.row.outId)" v-has="'LIMS-OUTPUT-INDICATOR-UPD'">更新</el-button>
                        <el-button type="text" size="small" @click="deleteOut(scope.row.outId)"
                                   v-has="'LIMS-OUTPUT-INDICATOR-DEL'">删除
                        </el-button>
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
                <out-upd @hidenDialog="hidenDialog" :outId="selId"/>
            </el-dialog>
            <el-dialog title="新增" :visible.sync="addDialogVisible" v-if="addDialogVisible" width="40%">
                <out-add @hidenDialog="hidenDialog"/>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import Pagination from "@/components/Pagination";
    import {
        getOutIndicators,
        addOutIndicator,
        updateOutIndicator,
        deleteOutIndicator,
        getOutIndicator,
        preOperateOut,
        deleteOutIndicators
    } from "@/api/lims";
    import {simpleDateFormat} from "@/utils/index";
    import outAdd from "./output-add";
    import outUpd from "./output-upd";
    import {hasBtn} from "@/utils/index";

    export default {
        name: "outputManager",
        components: {
            Pagination,
            outAdd,
            outUpd
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
                    outName: "",
                    outCode: "",
                    outStatus: ""
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
                selId: "", // 选中行ID
                str: ['\\', '%', '_'],
            };
        },
        mounted() {
            this.getData();
        },
        methods: {
            hasBtn,
            /*formatDate: function(row, column) {
                        let date = new Date(row.outOptime);
                        return simpleDateFormat(date, 'yyyy-MM-dd HH:mm:ss');
                    },*/
            changeSwitch(row) {
                updateOutIndicator(row,"0").then(response => {
                    const result = response.data;
                    if (result.success) {
                        this.$message.success(result.data);
                        this.getData();
                    } else {
                        this.$message({
                            type: "warning",
                            message: result.message
                        });
                    }
                }).catch(e => {
                    this.$message.error(e.message);
                });
            },
            formatSpace(val) {
                return val.replace(/(^\s*)|(\s*$)/g, "");
            },
            getData(pageNum) {
                if (pageNum === 1)
                    this.page.pageNum = 1;
                if (this.total !== 0 && this.total < this.page.pageNum * this.page.pageSize) {
                    if (this.total % this.page.pageSize > 0)
                        this.page.pageNum = parseInt(this.total / this.page.pageSize) + 1;
                    else
                        this.page.pageNum = parseInt(this.total / this.page.pageSize);
                }
                let queryParam = JSON.parse(JSON.stringify(this.queryForm));
                queryParam.outName = this.formatSpace(queryParam.outName);
                queryParam.outCode = this.formatSpace(queryParam.outCode);
                this.str.forEach(i => {
                    if (queryParam.outName.indexOf(i) > -1) {
                        queryParam.outName = queryParam.outName.replace(new RegExp('\\' + i, 'g'), '\\' + i);
                    }
                    if (queryParam.outCode.indexOf(i) > -1) {
                        queryParam.outCode = queryParam.outCode.replace(new RegExp('\\' + i, 'g'), '\\' + i);
                    }
                });
                const params = {
                    ...this.page,
                    ...queryParam
                };
                getOutIndicators(params)
                    .then(res => {
                        //alert(JSON.stringify(params));
                        this.tableData = res.data.data.rows;
                        this.total = res.data.data.total;
                    })
                    .catch(e => {
                        this.$message({
                            type: "error",
                            message: e.message
                        });
                    });
            },
            addOut() {
                this.addDialogVisible = true;
            },
            deleteOut(id) {
                preOperateOut({id: id}).then((res) => {
                    const preMessage = res.data;
                    if (preMessage.success) {
                        this.$confirm(preMessage.data, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            deleteOutIndicator(id).then((res) => {
                                if (res.data.success) {
                                    this.$message.success(res.data.data);
                                } else {
                                    this.$message.warning(res.data.message);
                                }
                                this.getData(1);
                            }).catch(e => {
                                this.$message.error(e.message);
                            });
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消删除'
                            })
                        })
                    } else {
                        this.$message.error(preMessage.message);
                    }
                }).catch(e => {
                    this.$message.error(e.message);
                });
            },
            updateOut(id) {
                preOperateOut({id: id}).then((res) => {
                    const preMessage = res.data;
                    if (preMessage.success) {
                        if (preMessage.data.indexOf("永久删除") === -1) {
                            this.$confirm(preMessage.data, '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                this.selId = id;
                                this.dialogVisible = true
                            }).catch(() => {
                                this.$message({
                                    type: 'info',
                                    message: '已取消更新'
                                })
                            })
                        } else {
                            this.selId = id;
                            this.dialogVisible = true
                        }
                    } else {
                        this.$message.error(preMessage.message);
                    }
                }).catch(e => {
                    this.$message.error(e.message);
                });
            },
            /*
            batchDel() {
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let ids = this.sels;
                    deleteOutIndicators(ids).then(response => {
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
            selsChange: function (sels) {
                this.sels.length = 0;
                const _this = this;
                sels.forEach(element => {
                    _this.sels.push(element.outId);
                });
                this.batchBtn = this.sels.length === 0;
            },
            clearSearchBox() {
                this.queryForm = {
                    outName: "",
                    outCode: "",
                    outStatus: ""
                };
                this.getData(1);
            }
        }
    }
</script>
<style lang="css">
    .el-tooltip__popper {
        max-width: 30%;
    }
</style>
<style scoped>
    .el-col .el-button {
        margin: 0px 0px 0px 2px;
    }

    .padding20 .pt12 .el-button {
        margin: 0px 0px 12px 10px;
    }
</style>
