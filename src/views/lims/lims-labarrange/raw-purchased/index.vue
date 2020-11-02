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
                           icon="el-icon-plus" v-has="'LIMS-RAW-PLAN-ADD'">新增
                </el-button>
            </div>
        </el-form>
        <div class="tableshadow margin20" style="width:calc(100% - 40px);">
            
            <el-table :data="tableData">
                <el-table-column prop="planCode" align="center" label="计划单号"></el-table-column>
                <el-table-column prop="labProname" align="center" label="化验物料"></el-table-column>
                <el-table-column prop="labIndicator" align="center" show-overflow-tooltip label="分析项目"></el-table-column>
                <el-table-column prop="receivePlace" align="center" show-overflow-tooltip label="收样地点"></el-table-column>
                <!--<el-table-column prop="workShop" align="center" label="取样车间" show-overflow-tooltip></el-table-column>-->
                <el-table-column prop="sampPlace" align="center" label="取样地点" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" min-width="150px" label="取样小组">
                    <template slot-scope="scope">
                        <el-tooltip placement="bottom">
                            <div slot="content">
                                 <span v-for="(item,i) in !!scope.row.sampPer?scope.row.sampPer.split(','):[]" v-bind:key="i">
                                  {{item}}
                                  <br />
                                </span>
                            </div>
                            <button type="button" class="el-button el-button--text">{{scope.row.sampGroup}}</button>
                        </el-tooltip>
                        <!-- <span>{{ scope.row.groups[0]}}</span> -->
                    </template>
                </el-table-column>
                <el-table-column align="center" label="留存时间类型">
                    <template slot-scope="scope">
                        <span v-if="scope.row.ifRestain">{{scope.row.restainTimeType}}</span>
                        <span v-else>未留存</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="时间类型值">
                    <template slot-scope="scope">
                        <span v-if="scope.row.ifRestain">{{scope.row.restainTimeNum}}</span>
                        <span v-else>未留存</span>
                    </template>
                </el-table-column>
                <!--<el-table-column label="任务状态" align="center" width='150'>
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.planStat"
                                   @change = "changeStatus(scope.row)"
                                   active-value="有效"
                                   inactive-value="无效"
                                   active-text="有效"
                                   inactive-text="无效"
                                   :disabled="!hasBtn(['LIMS-RAW-PLAN-STATUS'])">
                        </el-switch>
                    </template>
                </el-table-column>-->
                <!--<el-table-column prop="createOn" align="center" label="创建时间" width="150"></el-table-column>
                <el-table-column prop="createBy" align="center" label="创建人"></el-table-column>-->
                <!--<el-table-column prop="updateOn" align="center" label="更新时间" width="150"></el-table-column>
                <el-table-column prop="updateBy" align="center" label="更新人"></el-table-column>-->
                <el-table-column align="center" label="操作" fixed="right" width="180" v-if="hasBtn(['LIMS-RAW-PLAN-UPD','LIMS-RAW-PLAN-DEL'])">
                    <template v-slot="scope">
                       <!-- <el-button type="text" size="small" @click="updateIt(scope.row)" v-has="'LIMS-RAW-PLAN-UPD'">更新</el-button>-->
                        <!--<el-button type="text" size="small" @click="deleteIt(scope.row.planId)" v-has="'LIMS-RAW-PLAN-DEL'">删除</el-button>-->
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
            <!--<el-dialog title="更新" ref="updateDialog" :visible.sync="dialogVisible" width="40%" v-if="dialogVisible">
                <plan-upd @hidenDialog="hidenDialog" :selPlan="selPlan"/>
            </el-dialog>-->
            <el-dialog title="新增" ref="addDialog" :visible.sync="addDialogVisible" width="800px" v-if="addDialogVisible">
                <plan-add @hidenDialog="hidenDialog"/>
            </el-dialog>
            <el-dialog title="任务单信息" ref="infoDialog" :visible.sync="scheduleDialogVisible" width="70%" v-if="scheduleDialogVisible">
                <plan-schedule @hidenDialog="hidenDialog" :selPlan="selPlan"/>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import {getRawPurchased, deletePlan,changeState,getGroupStaffs} from "@/api/lims";

    import Pagination from "@/components/Pagination";
    import PlanAdd from "./plan-add";
    import PlanUpd from "./plan-upd";
    import { hasBtn } from "@/utils/index";
    import PlanSchedule from "../plan-schedule";
    export default {
        name: "rawPurchased",
        components: {
            PlanSchedule,
            PlanAdd,
            PlanUpd,
            Pagination
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
                selPlan: {}
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
                getRawPurchased(params).then((res) => {
                    this.tableData = res.data.data.rows.map(v => {
                        this.$set(v, "labIndicator", v.labIndicName.split('@,,,@').join(','));
                        return v;
                    });
                    this.total = res.data.data.total;
                }).catch(e => {
                    this.$message.error(e.message);
                });
            },
            updateIt(plan) {
                let _this = this;
                _this.selPlan = {planType:0,...plan};
                _this.dialogVisible = true;
            },
            addIt() {
                this.addDialogVisible = true;
            },
            deleteIt(id) {
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deletePlan(id).then((res) => {
                        const result = res.data;
                        if (result.success) {
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
            scheduleInfo(plan) {
                let _this = this;
                _this.selPlan = {planType:0,...plan};
                _this.scheduleDialogVisible = true;
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
            hidenDialog() {
                this.addDialogVisible = false;
                this.dialogVisible = false;
                this.getData()
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
