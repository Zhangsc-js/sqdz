<template>
    <div>
        <el-form ref="queryForm" :inline="true" label-width="100px" class="mb20">
            <el-form-item label="样品名称" prop="speciName">
                <el-input
                    v-model="queryForm.speciName"
                    :maxlength="12"
                    plain="true"
                    placeholder="请输入样品名称"
                />
            </el-form-item>
            <el-form-item label="取样车间" prop="workShop">
                <el-input
                    v-model="queryForm.workShop"
                    :maxlength="12"
                    plain="true"
                    placeholder="取样车间"
                />
            </el-form-item>
            <el-form-item label="取样地点" prop="sampPlace">
                <el-input
                    v-model="queryForm.sampPlace"
                    :maxlength="12"
                    plain="true"
                    placeholder="请输入取样地点"
                />
            </el-form-item>
            <el-form-item label="计划单号" prop="planCode">
                <el-input
                    v-model="queryForm.planCode"
                    :maxlength="12"
                    plain="true"
                    placeholder="请输入计划单号"
                />
            </el-form-item>
            <el-form-item label="任务单号" prop="scheduleCode">
                <el-input
                    v-model="queryForm.scheduleCode"
                    :maxlength="12"
                    plain="true"
                    placeholder="请输入任务单号"
                />
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
        </el-form>
        <el-table :data="tableData" ref="refTable" @expand-change="expandChange" :row-key="getRowKeys"
                  :expand-row-keys="expands">
            <el-table-column type="expand">
                <el-form label-position="left" inline class="demo-table-expand" label-width="100px">
                    <el-form-item label="定点开始时间">
                        <span v-text="spot.spottingStart"></span>
                    </el-form-item>
                    <el-form-item label="定点结束时间">
                        <span v-text="spot.spottingEnd"></span>
                    </el-form-item>
                    <el-form-item label="取样间隔类型">
                        <span v-text="spot.intervalType"></span>
                    </el-form-item>
                    <el-form-item label="取样间隔">
                        <span v-text="spot.sampInterval"></span>
                    </el-form-item>
                    <el-form-item label="取样次数">
                        <span v-text="spot.sampNum"></span>
                    </el-form-item>
                </el-form>
            </el-table-column>
            <el-table-column prop="schedule.planCode" align="center"  width="150px" label="计划单号"></el-table-column>
            <el-table-column prop="schedule.scheduleCode" align="center"  width="150px" label="任务单号"></el-table-column>
            <el-table-column prop="speciName" align="center" label="样品名称"></el-table-column>
            <el-table-column prop="speciCode" align="center" label="样品编号" width="150px"></el-table-column>
            <el-table-column prop="sampTime" align="center" label="取样时间" width="150px"></el-table-column>
            <el-table-column prop="actualTime" align="center" width="150px" label="实际取样时间"></el-table-column>
            <el-table-column prop="workShop" align="center" label="取样车间" width="150px"></el-table-column>
            <el-table-column prop="sampPlace" align="center" label="取样地点" width="150px"></el-table-column>
            <el-table-column align="center" min-width="150px" label="取样小组">
                <template slot-scope="scope">
                    <el-tooltip placement="bottom">
                        <div slot="content">
                  <span v-for="(item,i) in scope.row.sampPers.split(',')" v-bind:key="i">
                    {{item}}
                    <br/>
                  </span>
                        </div>
                        <button type="button" class="el-button el-button--text el-button--small">
                            <i class="el-icon-info">{{scope.row.sampGroup}}</i>
                        </button>
                    </el-tooltip>
                </template>
            </el-table-column>
            <!--<el-table-column align="center" label="是否缺样">
                <template slot-scope="scope">
                    <div v-if="scope.row.missSpeci">
                        <el-tooltip :content=scope.row.missCause placement="bottom">
                            <button type="button" class="el-button el-button&#45;&#45;text el-button&#45;&#45;small">
                                <i class="el-icon-info">缺样原因</i>
                            </button>
                        </el-tooltip>
                    </div>
                    <span v-else>否</span>
                </template>
            </el-table-column>-->
            <el-table-column align="center" label="是否留存">
                <template slot-scope="scope">
                    <el-popover v-if="scope.row.ifRestain" @show="queryRestain(scope.row)" trigger="click"
                                placement="bottom">
                        <span>{{'留存有效期：'}}{{restainData.restainTimeNum?restainData.restainTimeNum:''}}
                            {{restainData.restainTimeType?restainData.restainTimeType:''}}
                            <br/>
                            {{'截止时间：'}}{{restainData.restainExpiration?restainData.restainExpiration:''}}
                        </span>
                        <el-button slot="reference" style="border: 0" :disabled="!hasBtn(['LIMS-SPECIMEN-REGULAR-KEEP'])"><i class="el-icon-info" style="font-size: 12px">留存详情</i>
                        </el-button>
                    </el-popover>
                    <span v-else>否</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="分析项目"  fixed="right"  v-if="hasBtn(['LIMS-SPECIMEN-REGULAR-ITEM'])">
                <template slot-scope="scope">
                    <button type="button" class="el-button el-button--text el-button--small"
                            @click="getIndicatorDetail(scope.row)">
                        <i class="el-icon-info">项目详情</i>
                    </button>
                </template>
            </el-table-column>
            <!--<el-table-column align="center" prop="remark" label="备注"></el-table-column>-->
        </el-table>
        <Pagination
            :total="total"
            :page.sync="page.pageNum"
            :limit.sync="page.pageSize"
            @pagination="getData"
        />
        <el-dialog title="分析项目详情" :visible.sync="itemDialogVisible" width="60%">
            <indicator-more @hidenDialog="hidenDialog" :rowSpecimen="rowSpecimen"/>
        </el-dialog>
    </div>
</template>
<script>
    import {getSpecimenPage, getSpotMore, getRestainInfo} from "@/api/lims";
    import Pagination from "@/components/Pagination";
    import IndicatorMore from './indicator-more'
    import {hasBtn} from "@/utils/index";

    export default {
        name: "regular",
        components: {
            Pagination,
            IndicatorMore
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
                spot: {},
                restainData: {},
                queryForm: {
                    // 查询表单
                    speciName: "",
                    sampPlace: "",
                    workShop: "",
                    planCode: "",
                    scheduleCode: ""
                },
                getRowKeys(row) {
                    return row.speciId;
                },
                expands: [],
                dialogTableVisible: false,
                DialogVisible: false,
                itemDialogVisible: false,
                rowSpecimen: {},
                selSpecimen: {}
            };
        },
        methods: {
            hasBtn,
            getData(pageNum) {
                if (pageNum === 1)
                    this.page.pageNum = 1;
                const params = {
                    ...this.queryForm,
                    speciType: '定点样'
                };
                getSpecimenPage(this.page, params).then((res) => {
                    this.tableData = res.data.data.rows;
                    this.total = res.data.data.total;
                }).catch(e => {
                    this.$message.error(e.message);
                });
            },
            hidenDialog() {
                this.DialogVisible = false;
                this.itemDialogVisible = false;
                this.getData()
            },
            expandChange(row, expandedRows) {
                if (this.expands.indexOf(row.speciId) >= 0) {
                    //收起当前行
                    this.expands.shift();
                    return;
                }
                let _this = this;
                _this.loading = true;
                _this.spot = {};
                getSpotMore(row.speciId).then((res) => {
                    const result = res.data;
                    if (result.success) {
                        _this.spot = result.data;
                        _this.loading = false;
                        _this.expands.shift();
                        /** 新增 **/
                        _this.expands.push(row.speciId);
                        /** 新增 **/
                    } else {
                        this.$message.error(result.message);
                    }
                }).catch(e => {
                    this.$message.error(e.message);
                });
                if (expandedRows.length > 1) {
                    //只展开当前选项
                    expandedRows.shift()
                }
            },
            getRestainDetail(specimen) {
                let _this = this;
                _this.selSpecimen = specimen.speciId;
                _this.DialogVisible = true;
            },
            queryRestain(row) {
                getRestainInfo(row.speciId).then((response) => {
                    const result = response.data;
                    if (result.success) {
                        this.restainData = result.data;
                    } else {
                        this.$message({
                            type: 'error',
                            message: result.message
                        })
                    }
                }).catch(e => {
                    this.$message.error(e.message)
                })
            },
            getIndicatorDetail(specimen) {
                let _this = this;
                _this.rowSpecimen = specimen;
                _this.itemDialogVisible = true;
            },
            clearSearchBox() {
                this.queryForm = {
                    speciName: "",
                    sampPlace: "",
                    workShop: "",
                    planCode: "",
                    scheduleCode: ""
                };
                this.getData(1);
            },
        },
        mounted() {
            this.getData();
        }
    };
</script>

<style scoped>
    .el-form .el-col button {
        margin: -1px 4px 0px 4px;
    }
</style>
