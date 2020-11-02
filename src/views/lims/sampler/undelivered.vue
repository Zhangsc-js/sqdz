<template>
    <div>
        <el-form ref="queryForm" :inline="true" label-width="100px" class="mb20">
            <el-form-item label="计划单号" prop="planCode">
                <el-input plain="true"
                          v-model="queryForm.planCode"
                          placeholder="请输入计划单号"/>
            </el-form-item>
            <el-form-item label="任务单号" prop="scheduleCode">
                <el-input plain="true"
                          v-model="queryForm.scheduleCode"
                          placeholder="请输入任务单号"/>
            </el-form-item>
            <el-form-item label="送样地点" prop="place">
                <el-input plain="true"
                          v-model="queryForm.place"
                          placeholder="请输入送样地点"/>
            </el-form-item>
            <el-form-item label="取样日期" prop="date">
                <el-date-picker
                        v-model="queryForm.date"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择日期">
                </el-date-picker>
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
        <el-table :data="tableData">
            <el-table-column prop="planCode" align="center" label="计划单号" width="180px"></el-table-column>
            <el-table-column prop="scheduleCode" align="center" label="任务单号" width="180px"></el-table-column>
            <el-table-column prop="labProname" align="center" label="待分析样品"></el-table-column>
            <el-table-column prop="receivePlace" align="center" label="送样地点"></el-table-column>
            <el-table-column align="center" label="类型">
                <template v-slot="scope">
                    <span v-if="scope.row.planType===0">来料</span>
                    <span v-else-if="scope.row.planType===1">定点</span>
                    <span v-else-if="scope.row.planType===2">临时</span>
                    <span v-else>复验</span>
                </template>
            </el-table-column>
            <el-table-column prop="sampTime" align="center" width="180" fixed="right" label="取样时间"></el-table-column>
            <el-table-column label="操作" width="150" fixed="right" align="center" v-if="hasBtn(['LIMS-SPECIMEN-DELIVER'])">
                <template v-slot="scope">
                    <el-button type="text" size="small" @click="beforeComplete(scope.row)" v-has="'LIMS-SPECIMEN-DELIVER'">完成送样</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="height:32px;">
            <Pagination
                    :total="total"
                    :page.sync="page.pageNum"
                    :limit.sync="page.pageSize"
                    @pagination="getData"
            />
        </div>
        <el-dialog title="请核对送样地点：" :visible.sync="dialogVisible" width="400px">
            <el-input v-model="inputForm.receivePlace" :disabled="true"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="complete()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {waitSend,checkPlace} from '@/api/lims'
    import Pagination from "@/components/Pagination";
    import { hasBtn } from "@/utils/index";
    export default {
        name: "undelivered",
        components: {
            Pagination
        },
        data() {
            return {
                page: {
                    pageNum: 1,
                    pageSize: 10
                },
                queryForm: {
                    planCode: "",
                    scheduleCode: "",
                    //workNo:this.$store.getters.workCode,
                    place: '',
                    date: ''
                },
                inputForm: {receivePlace: "", id: ""},
                total: 0,
                tableData: [],
                dialogVisible: false,
                selItem: null,
            };
        },
        methods: {
            hasBtn,
            getData(pageNum) {
                if(pageNum === 1)
                    this.page.pageNum = 1;
                let params = {
                    ...this.page
                };
                if(!this.queryForm.date) this.queryForm.date = '';
                waitSend(params, this.queryForm).then((res) => {
                    this.tableData = res.data.data.rows;
                    this.total = res.data.data.total;
                }).catch(e => {
                    this.$message.error(e.message);
                });
            },
            beforeComplete(item) {
                this.inputForm.id = item.scheduleId;
                this.inputForm.receivePlace = !!item.receivePlace?item.receivePlace:"";
                this.dialogVisible = true;
            },
            clearSearchBox() {
                this.queryForm = {
                    planCode: "",
                    scheduleCode: "",
                    //workNo:this.$store.getters.workCode,
                    place: '',
                    date: ''
                };
                this.getData(1);
            },
            complete() {
                checkPlace(this.inputForm).then((res) => {
                    const result = res.data;
                    if (result.success) {
                        if(result.code===10000) {
                            this.$message({
                                type: 'success',
                                message: '核对完成，已送达'
                            });
                        }else{
                            this.$message({
                                type: 'info',
                                message: '核对失败，请检查送达地点'
                            });
                        }
                        this.getData(1);
                    } else {
                        this.$message({
                            type: 'error',
                            message: result.message
                        })
                    }
                }).catch(e => {
                    this.$message({
                        type: 'error',
                        message: e.message
                    })
                });
                this.dialogVisible = false;
            }
        },
        mounted() {
            this.getData();
        }
    };
</script>
