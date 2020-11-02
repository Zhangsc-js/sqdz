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
            <el-form-item label="取样地点" prop="place">
                <el-input plain="true"
                          v-model="queryForm.place"
                          placeholder="请输入取样地点"/>
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
            <el-table-column prop="workShop" align="center" label="取样车间"></el-table-column>
            <el-table-column align="center" label="类型">
                <template v-slot="scope">
                    <span v-if="scope.row.planType===0">来料</span>
                    <span v-else-if="scope.row.planType===1">定点</span>
                    <span v-else-if="scope.row.planType===2">临时</span>
                    <span v-else>复验</span>
                </template>
            </el-table-column>
            <el-table-column prop="sampPlace" align="center" label="取样地点"></el-table-column>
            <el-table-column prop="sampTime" align="center" width="180" fixed="right" label="取样时间"></el-table-column>
            <el-table-column label="操作" width="250" align="center" fixed="right"
                             v-if="hasBtn(['LIMS-SPECIMEN-LABEL','LIMS-SPECIMEN-MISS','LIMS-SPECIMEN-COMPLETE'])">
                <template v-slot="scope">
                    <el-button type="text" size="small" @click="print(scope.row)" v-has="'LIMS-SPECIMEN-LABEL'">打印标签
                    </el-button>
                    <el-button type="text" size="small" @click="inputReason(scope.row)" v-has="'LIMS-SPECIMEN-MISS'">
                        缺样
                    </el-button>
                    <el-button type="text" size="small" @click="complete(scope.row)" v-has="'LIMS-SPECIMEN-COMPLETE'">
                        完成取样
                    </el-button>
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
        <el-dialog title="缺样原因" :visible.sync="dialogVisible" width="400px">
            <el-select v-model="inputForm.reason" placeholder="请选择缺样原因" clearable>
                <el-option
                    v-for="item in selectMiss"
                    :key="item.id"
                    :label="item.label"
                    :value="item.label"
                ></el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="miss()">确 定</el-button>
      </span>
        </el-dialog>
    </div>
</template>

<script>
    import {waitSample, labelSample, lostSample, completeSample, getMissCause} from '@/api/lims'
    import Pagination from "@/components/Pagination";
    import {hasBtn} from "@/utils/index";

    export default {
        name: "unsampled",
        components: {
            Pagination
        },
        data() {
            return {
                page: {
                    pageNum: 1,
                    pageSize: 10
                },
                downloadLoading: false,
                total: 0,
                tableData: [],
                queryForm: {
                    planCode: "",
                    scheduleCode: "",
                    //workNo: this.$store.getters.workCode,
                    place: '',
                    date: ''
                },
                labelData: {},
                dialogVisible: false,
                selItem: null,
                selectMiss: [],
                inputForm: {reason: "", id: ""}
            };
        },
        created() {
            getMissCause().then(res => {
                if(res.data.success)
                    this.selectMiss = res.data.data;
                else
                    this.$message.error(res.data.message);
            }).catch(e=>{
                this.$message.error(e.message);
            });
            this.getData();
        },
        methods: {
            hasBtn,
            getData(pageNum) {
                if (pageNum === 1)
                    this.page.pageNum = 1;
                let params = {
                    ...this.page
                };
                if(!this.queryForm.date) this.queryForm.date = '';
                waitSample(params, this.queryForm).then((res) => {
                    this.tableData = res.data.data.rows;
                    this.total = res.data.data.total;
                }).catch(e => {
                    this.$message.error(e.message);
                });
            },
            clearSearchBox() {
                this.queryForm = {
                    planCode: "",
                    scheduleCode: "",
                    //workNo: this.$store.getters.workCode,
                    place: '',
                    date: ''
                };
                this.getData(1);
            },
            base64ToBlob(code) {
                let parts = code.split(';base64,');
                let contentType = parts[0].split(':')[1];
                let raw = window.atob(parts[1]);
                let rawLength = raw.length;

                let uInt8Array = new Uint8Array(rawLength);

                for (let i = 0; i < rawLength; ++i) {
                    uInt8Array[i] = raw.charCodeAt(i);
                }
                return new Blob([uInt8Array], {type: contentType});
            },
            downloadFile(fileName, content) {
                let aLink = document.createElement('a');
                let blob = this.base64ToBlob(content); //new Blob([content]);
                let evt = document.createEvent("HTMLEvents");
                evt.initEvent("click", true, true);//initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
                aLink.download = fileName;
                aLink.href = URL.createObjectURL(blob);
                aLink.click()
            },
            print(item) {
                labelSample(item.scheduleId).then((res) => {
                    const result = res.data;
                    if (result.success) {
                        this.labelData = result.data;
                        this.$message({
                            type: 'success',
                            message: '已打印'
                        });
                        this.downloadLoading = true;
                        this.downloadFile('label.png',this.labelData);
                        this.downloadLoading = false;
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
            },
            complete(item) {
                this.$confirm('确认取样已完成？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = {
                        id: item.scheduleId,
                        //workNo: this.$store.getters.workCode,
                    };
                    completeSample(params).then((res) => {
                        const result = res.data;
                        if (result.success) {
                            this.$message({
                                type: 'success',
                                message: '已完成'
                            });
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
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    })
                })
            },
            inputReason(item) {
                this.$confirm('确认缺样？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.inputForm.id = item.scheduleId;
                    this.dialogVisible = true;
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    })
                })
            },
            miss() {
                if(this.inputForm.reason === null || this.inputForm.reason.trim() === ''){
                    this.$message.warning('请选择缺样原因');
                    return false;
                }
                this.dialogVisible = false;
                lostSample(this.inputForm).then((res) => {
                    const result = res.data;
                    if (result.success) {
                        this.$message({
                            type: 'warning',
                            message: '缺样，已记录缺样原因'
                        });
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
            }
        }
    };
</script>
