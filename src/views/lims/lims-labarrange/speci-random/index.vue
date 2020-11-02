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
                           icon="el-icon-plus" v-has="'LIMS-RANDOM-PLAN-ADD'">新增
                </el-button>
            </div>
        </el-form>
        <div class="tableshadow margin20" style="width:calc(100% - 40px);">
            
            <el-table :data="tableData">
                <el-table-column prop="planCode" align="center" label="计划单号"></el-table-column>
                <el-table-column prop="labProname" align="center" label="化验物料"></el-table-column>
                <el-table-column prop="labIndicator" align="center" min-width="150" show-overflow-tooltip label="分析项目"></el-table-column>
                <el-table-column prop="receivePlace" align="center" min-width="150" show-overflow-tooltip label="收样地点"></el-table-column>
                <el-table-column prop="workShop" align="center" min-width="150" show-overflow-tooltip label="取样车间"></el-table-column>
                <el-table-column prop="sampPlace" align="center" min-width="150" show-overflow-tooltip label="取样地点"></el-table-column>
                <el-table-column prop="sampTime" align="center" label="取样时间" width="180"></el-table-column>
                <el-table-column align="center" min-width="150" label="取样小组">
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
                <el-table-column align="center" label="留存时间类型" width='120px'>
                <template slot-scope="scope">
                    <span v-if="scope.row.ifRestain">{{scope.row.restainTimeType}}</span>
                    <span v-else>未留存</span>
                </template>
                </el-table-column>
                <el-table-column align="center" label="时间类型值" width='120px'>
                    <template slot-scope="scope">
                        <span v-if="scope.row.ifRestain">{{scope.row.restainTimeNum}}</span>
                        <span v-else>未留存</span>
                    </template>
                </el-table-column>
                <!--<el-table-column prop="createOn" align="center" label="创建时间" width="150"></el-table-column>
                <el-table-column prop="createBy" align="center" label="创建人"></el-table-column>-->
                <el-table-column align="center" label="操作" fixed="right" width="180" v-if="hasBtn(['LIMS-RANDOM-PLAN-DEL'])">
                    <template v-slot="scope">
                        <!--<el-button type="text" size="small" @click="deleteIt(scope.row.planId)" v-has="'LIMS-RANDOM-PLAN-DEL'">删除</el-button>-->
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
    import {getTemp,deletePlan} from "@/api/lims";

    import Pagination from "@/components/Pagination";
    import PlanAdd from "./plan-add";
    import { hasBtn } from "@/utils/index";
    import PlanSchedule from "../plan-schedule";
    export default {
        name: "speciRandom",
        components: {
            PlanSchedule,
            Pagination,
            PlanAdd,
        },
        data() {
            return {
                page: {
                    pageNum: 1,
                    pageSize: 10
                },
                total: 2,
                loading: false,
                tableData: [],
                queryForm: {
                    labProgram: "",
                    receivePlace: "",
                    workShop: "",
                    sampPlace: "",
                    planCode: ""
                },
                dialogTableVisible: false,
                addDialogVisible: false,
                scheduleDialogVisible: false,
                selPlan: {}
            };
        },
        methods: {
            hasBtn,
            scheduleInfo(plan) {
                let _this = this;
                _this.selPlan = {planType:2,...plan};
                _this.scheduleDialogVisible = true;
            },
            getData(pageNum) {
                if(pageNum === 1)
                    this.page.pageNum = 1;
                const params = {
                    ...this.page,
                    ...this.queryForm
                };
                getTemp(params)
                    .then(res => {
                        this.tableData = res.data.data.rows.map(v => {
                            this.$set(v, "labIndicator", v.labIndicName.split('@,,,@').join(','));
                            return v;
                        });
                        this.total = res.data.data.total;
                    })
                    .catch(e => {
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
            hidenDialog() {
                this.addDialogVisible = false;
                this.getData()
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
