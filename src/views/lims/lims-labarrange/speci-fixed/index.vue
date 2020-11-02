<template>
    <div>
        <el-form ref="queryForm" :inline="true" label-width="100px" class="margin20 mb0">
            <el-form-item label="化验物料" prop="labProgram">
                <el-input
                    v-model="queryForm.labProgram"
                    maxlength="20"
                    plain="true"
                    placeholder="请输入化验物料名"
                />
            </el-form-item>
            <el-form-item label="收样地点" prop="receivePlace">
                <el-input
                    v-model="queryForm.receivePlace"
                    maxlength="20"
                    plain="true"
                    placeholder="请输入收样地点"
                />
            </el-form-item>
            <el-form-item label="取样车间" prop="workShop">
                <el-input
                    v-model="queryForm.workShop"
                    plain="true"
                    placeholder="请输入取样车间"
                />
            </el-form-item>
            <el-form-item label="取样地点" prop="sampPlace">
                <el-input
                    v-model="queryForm.sampPlace"
                    plain="true"
                    placeholder="请输入取样地点"
                />
            </el-form-item>
            <el-form-item label="计划单号" prop="planCode">
                <el-input
                    v-model="queryForm.planCode"
                    plain="true"
                    placeholder="请输入计划单号"
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
            <div style="padding-left:30px;">
                <el-button style="margin:0px 0px 0px 2px;" type="primary" @click="addIt()"
                           icon="el-icon-plus" v-has="'LIMS-FIXED-PLAN-ADD'">新增
                </el-button>
            </div>
        </el-form>
        <div class="tableshadow margin20" style="width:calc(100% - 40px);">
           
            <el-table :data="tableData" @expand-change="expandChange" :row-key="getRowKeys" :expand-row-keys="expands">
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
                      <!--  <el-form-item label="取样通知提前/min" label-width="150px">
                            <span v-text="spot.triggerTime"></span>
                        </el-form-item>-->
                    </el-form>
                </el-table-column>
                <el-table-column prop="planCode" align="center" label="计划单号" min-width="150px"></el-table-column>
                <el-table-column prop="labProname" align="center" label="化验物料" min-width="160px"></el-table-column>
                <el-table-column prop="labIndicator" align="center" min-width="150px" show-overflow-tooltip label="分析项目"></el-table-column>
                <el-table-column prop="receivePlace" align="center" min-width="150px" show-overflow-tooltip label="收样地点"></el-table-column>
                <el-table-column prop="workShop" align="center" label="取样车间" min-width="150px" show-overflow-tooltip></el-table-column>
                <el-table-column prop="sampPlace" align="center" label="取样地点" min-width="150px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="取样小组" min-width="150px">
                    <template slot-scope="scope">
                        <el-popover @show="getUsers(scope.row)" trigger="click" placement="bottom">
                            <!-- <div slot="content">-->
                            <span v-for="(item,i) in samplers.split(',')" v-bind:key="i">
                                  {{item}}
                                  <br />
                                </span>
                            <!-- </div>-->
                            <el-button style="border: 0px" slot="reference">{{scope.row.sampGroup}}</el-button>
                        </el-popover>
                        <!-- <span>{{ scope.row.groups[0]}}</span> -->
                    </template>
                </el-table-column>
                <el-table-column align="center" label="任务状态" width='150'>
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.planStat"
                                   @change = "changeStatus(scope.row)"
                                   active-value="有效"
                                   inactive-value="无效"
                                   active-text="有效"
                                   inactive-text="无效"
                                   :disabled="!hasBtn(['LIMS-FIXED-PLAN-STATUS'])">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="留存时间类型" width='120'>
                    <template slot-scope="scope">
                        <span v-if="scope.row.ifRestain">{{scope.row.restainTimeType}}</span>
                        <span v-else>未留存</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="时间类型值" width='120'>
                    <template slot-scope="scope">
                        <span v-if="scope.row.ifRestain">{{scope.row.restainTimeNum}}</span>
                        <span v-else>未留存</span>
                    </template>
                </el-table-column>
                <!--<el-table-column prop="createOn" align="center" label="创建时间" width="150"></el-table-column>
                <el-table-column prop="createBy" align="center" label="创建人"></el-table-column>
                <el-table-column prop="updateOn" align="center" label="更新时间" width="150"></el-table-column>
                <el-table-column prop="updateBy" align="center" label="更新人"></el-table-column>-->
                <el-table-column align="center" fixed="right" label="操作" width="210" v-if="hasBtn(['LIMS-FIXED-PLAN-UPD','LIMS-FIXED-PLAN-DEL'])">
                    <template v-slot="scope">
                        <el-button type="text" size="small" @click="updateIt(scope.row)" v-has="'LIMS-FIXED-PLAN-UPD'">更新</el-button>
                        <el-button type="text" size="small" @click="deleteIt(scope.row.planId)" v-has="'LIMS-FIXED-PLAN-DEL'">删除</el-button>
                        <el-button type="text" size="small" @click="scheduleInfo(scope.row)">任务单信息</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination
                    :total="total"
                    :page.sync="page.pageNum"
                    :limit.sync="page.pageSize"
                    @pagination="getData"
            />
            <el-dialog title="更新" ref="updateDialog" :visible.sync="dialogVisible" width="800px" v-if="dialogVisible">
                <plan-upd @hidenDialog="hidenDialog" :selPlan="selPlan"/>
            </el-dialog>
            <el-dialog title="新增" ref="addDialog" :visible.sync="addDialogVisible" width="800px" v-if="addDialogVisible">
                <plan-add @hidenDialog="hidenDialog"/>
            </el-dialog>
            <el-dialog title="任务单信息" ref="infoDialog" :visible.sync="scheduleDialogVisible" width="60%" v-if="scheduleDialogVisible">
                <plan-schedule @hidenDialog="hidenDialog" :selPlan="selPlan"/>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import {getPlanSpot,getGroupStaffs, getSpotSetting,deletePlanSpot,changeState} from "@/api/lims";

    import Pagination from "@/components/Pagination";
    import PlanAdd from "./plan-add";
    import PlanUpd from "./plan-upd";
    import { hasBtn } from "@/utils/index";
    import PlanSchedule from "../plan-schedule";
    export default {
        name: "speciFixed",
        components: {
            PlanSchedule,
            Pagination,
            PlanAdd,
            PlanUpd
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
                samplers:"",
                queryForm: {
                    labProgram: "",
                    receivePlace: "",
                    workShop: "",
                    sampPlace: "",
                    planCode: ""
                },
                scheduleDialogVisible: false,
                dialogTableVisible: false,
                dialogVisible: false,
                addDialogVisible: false,
                selPlan: {},
                spot: {},
                expands: [],
                getRowKeys(row) {
                    return row.planId;
                },
            };
        },
        methods: {
            hasBtn,
            getData(pageNum) {
                if(pageNum === 1)
                    this.page.pageNum = 1;
                const params = {
                    ...this.page,
                    ...this.queryForm
                };
                getPlanSpot(params).then((res) => {
                    this.tableData = res.data.data.rows.map(v => {
                        this.$set(v, "labIndicator", v.labIndicName.split('@,,,@').join(','));
                        return v;
                    });
                    this.total = res.data.data.total;
                }).catch(e => {
                    this.$message.error(e.message);
                });
            },
            expandChange(row, expandedRows) {
                if (this.expands.indexOf(row.planId) >= 0) {
                    //收起当前行
                    this.expands.shift();
                    return;
                }
                let _this = this;
                _this.loading = true;
                _this.spot = [];
                getSpotSetting(row.planId).then((res) => {
                    const result = res.data;
                    if (result.success) {
                        _this.spot = result.data;
                        _this.loading = false;
                        _this.expands.shift();
                        /** 新增 **/
                        _this.expands.push(row.planId);
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
            updateIt(plan) {
                let _this = this;
                _this.selPlan = {planType:1,...plan};
                _this.dialogVisible = true;
            },
            scheduleInfo(plan) {
                let _this = this;
                _this.selPlan = {planType:1,...plan};
                _this.scheduleDialogVisible = true;
            },
            addIt() {
                this.addDialogVisible = true;
            },
            hidenDialog() {
                this.addDialogVisible = false;
                this.dialogVisible = false;
                this.getData()
            },
            deleteIt(id) {
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deletePlanSpot(id).then((res) => {
                        const result = res.data;
                        if(result.success) {
                            this.getData(1);
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            })
                        }else{
                            this.$message.error(result.message);
                        }
                    }).catch(e=>{
                        this.$message.error(e.message);
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            getUsers(row){
                let param = {
                    id: row.sampGroupId
                };
                getGroupStaffs(param).then((response) => {
                    const result = response.data;
                    if (result.success) {
                        let tempArray = [];
                        result.data.forEach(element=>{
                            tempArray.push(element.userCode+"--"+element.userName);
                        });
                        this.samplers = tempArray.join(',');
                    } else {
                        this.$message.error(result.message);
                    }
                }).catch(e => {
                    this.$message.error(e.message);
                });
            },
            changeStatus(row){
                changeState(row.planId).then(response => {
                    const result = response.data;
                    if (result.success) {
                        this.$message({
                            type: 'success',
                            message: '状态已更改'
                        })
                    } else {
                        this.$message.error(result.message);
                    }
                }).catch(e => {
                    this.$message.error(e.message);
                });
            },
            clearSearchBox(){
                this.queryForm = {
                    labProgram: '',
                    receivePlace: '',
                    workShop: "",
                    sampPlace: "",
                    planCode: ""
                };
                this.getData(1);
            }
        },
        mounted() {
            this.getData();
        }
    };
</script>

<style scoped>
    .btn-add {
        margin: 0 0 20px 20px;
    }
</style>
