<template>
    <div style="padding-top:50px; padding-left: 20px">
        <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
            <el-form-item label="告警类型名">
                <el-input v-model="queryForm.name" placeholder="请输入告警类型"></el-input>
            </el-form-item>
            <el-form-item label="能源类型">
                <el-select v-model="queryForm.type" value="selectValue" placeholder="能源类型">
                    <!--       <el-option label="设备名" value="shanghai"></el-option>
                           <el-option label="车间" value="shanghai"></el-option>-->
                    <el-option value="" label="所有能源类型"></el-option>
                    <el-option v-for="item in eneType"
                               :key="item.code"
                               :label="item.name"
                               :value="item.code"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getData">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button href="javascript:void(0)" class="btn-w" @click="clearSearchBox">清空</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="addWarningType" icon="el-icon-plus">新增</el-button>
            </el-form-item>
        </el-form>
        <template>
            <el-table :data="tableData" stripe @selection-change="objSelection" style="width: 100%">
                <el-table-column type="selection" width="60" center></el-table-column>
                <el-table-column type="index" label="序号" width="80"></el-table-column>
                <el-table-column prop="name" label="告警原因" width="180"></el-table-column>
                <el-table-column prop="code" label="能源类型" width="150"></el-table-column>
                <el-table-column prop="createperson" label="创建人" width="150"></el-table-column>
                <el-table-column prop="createtime" label="创建时间" width="180"></el-table-column>
                <el-table-column prop="descri" label="描述"></el-table-column>
                <el-table-column fixed="right" align="center" label="操作" width="170px">
                    <template v-slot="scope">
                        <el-button type="text" size="small" @click="updateEneWarning(scope.row.id)">更新</el-button>
                        <el-button type="text" size="small" @click="deleteEneWarningById(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="fl batch-btn-padding">
                <el-row>
                    <el-col :span="24">
                        <el-button :disabled="batchBtn" type="danger" @click="batchDelEneType">批量删除</el-button>
                    </el-col>
                </el-row>
            </div>
        </template>

        <Pagination :total="total" :page.sync="page.current" :limit.sync="page.size" @pagination="getData"/>
        <!--新增页面弹框-->
        <el-dialog title="新增页面" :visible.sync="addDialogVisible" width="65%">
            <WarningTypeAdd @save="hidenDialog" @cancel="hidenDialogCancel" :ene-type="eneType"/>
        </el-dialog>
        <el-dialog title="修改页面" :visible.sync="upDialogVisible" width="65%">
            <WarningTypeUp @save="hidenDialog" @cancel="hidenDialogCancel" :ene-type="eneType" :id="objId"/>
        </el-dialog>
    </div>
</template>

<script>

    import {getAllEneType, selectWarningByNameAndCode,deleteEneWarningById,deleteEneWarningByBatchId} from '@/api/energy';
    import Pagination from '@/components/Pagination'
    import WarningTypeAdd from './warningTypeAdd'
    import WarningTypeUp from './warningTypeUp'

    export default {
        name: "warningType",
        components: {
            WarningTypeAdd,
            WarningTypeUp,
            Pagination
        },
        data() {
            return {
                page: {
                    current: 1,
                    size: 10,
                },
                total: 0,
                queryForm: {
                    name: '',
                    type: ''
                },
                selectValue:'',
                eneType: [],
                tableData: [],
                addDialogVisible: false,
                upDialogVisible: false,
                batchBtn: true,
                objId: '',
                objIds: [],
            }
        },
        methods: {
            getData() {
                const params = {
                    ...this.page,
                    ...this.queryForm
                };
                selectWarningByNameAndCode(params).then((response) => {
                    let data = response.data;
                    this.tableData = data.rows;
                    this.total = data.total;
                }).catch(e => {
                    this.$message.error(e.message);
                })
            },
            clearSearchBox() {
                // this.$refs['queryForm'].resetFields();
                this.queryForm = {
                    name: '',
                    type: ''
                }
            },
            addWarningType() {
                this.addDialogVisible = true;
            },
            batchDelEneType() {
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteEneWarningByBatchId(this.objIds).then((response) => {
                        if(response.data.success) {
                            this.getData();
                            this.$message.success("删除成功!");
                        }  else
                            this.$message.error("删除失败!");
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            objSelection(objs) {
                this.objIds.length = 0;
                const _this = this;
                objs.forEach(element => {
                    _this.objIds.push(element.id)
                });
                this.batchBtn = this.objIds.length === 0
            },
            updateEneWarning(id) {
                this.objId = id;
                this.upDialogVisible = true;
            },
            deleteEneWarningById(id) {
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteEneWarningById(id).then((response) => {
                        if(response.data.success) {
                            this.getData();
                            this.$message.success("删除成功!");
                        }  else
                            this.$message.error("删除失败!");
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
                this.upDialogVisible = false;
                this.getData();
            },
            hidenDialogCancel() {
                this.addDialogVisible = false;
                this.upDialogVisible = false;
            }
        },
        mounted() {
            this.getData();
            getAllEneType(null).then((response) => {
                let data = response.data;
                this.eneType = data.rows;
            }).catch(e => {
                this.$message.error("删除失败!");
            });
        }
    }
</script>

<style scoped>

</style>
