<template>
    <div style="padding-top:50px; padding-left: 20px">
        <el-form ref="queryForm" :inline="true" :model="queryForm" class="demo-form-inline" >
            <el-form-item label="计量名称" prop="meteringName">
                <el-input v-model="queryForm.meteringName" placeholder="请输入计量名称"></el-input>
            </el-form-item>
            <el-form-item label="告警名称" prop="warningType">
                <el-select v-model="queryForm.warningType" value="selectValue" placeholder="告警名称">
                    <el-option value="" label="所有告警类型"></el-option>
                    <el-option v-for="item in eneType"
                               :key="item.code"
                               :label="item.name"
                               :value="item.code"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="selectWarningConditionByNameAndType">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button href="javascript:void(0)" class="btn-w" @click="clearSearchBox">清空</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="addWarningCondition" icon="el-icon-plus">新增</el-button>
            </el-form-item>
        </el-form>
            <el-table :data="tableData" stripe @selection-change="objSelection" style="width: 100%">
                <el-table-column type="selection" width="60" center></el-table-column>
                <el-table-column type="index" label="序号" width="60"></el-table-column>
                <el-table-column prop="meteringName" label="计量名称" width="150"></el-table-column>
                <el-table-column prop="meteringCode" label="计量编号" width="150"></el-table-column>
                <el-table-column prop="equipCode" label="设备编码" width="150"></el-table-column>
                <el-table-column prop="warningName" label="告警名称" width="150"></el-table-column>
                <el-table-column prop="warningType" label="告警类型" width="150"></el-table-column>
                <el-table-column prop="warningRestrict" label="限定值" width="110"></el-table-column>
                <el-table-column prop="createBy" label="创建人" width="110"></el-table-column>
                <el-table-column prop="createOn" label="创建时间" width="150"></el-table-column>
                <el-table-column fixed="right" align="center" label="操作" width="170px">
                    <template v-slot="scope">
                        <el-button type="text" size="small" @click="updateWarningCondition(scope.row.id)">更新</el-button>
                        <el-button type="text" size="small" @click="deleteWarningConditionById(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        <div class="fl batch-btn-padding">
            <el-row>
                <el-col :span="24">
                    <el-button :disabled="batchBtn" type="danger" @click="batchDelEneWarningCondition">批量删除</el-button>
                </el-col>
            </el-row>
        </div>
        <Pagination :total="total" :page.sync="page.pageNum" :limit.sync="page.pageSize" @pagination="selectWarningConditionByNameAndType"/>
               <!--新增页面弹框-->
               <el-dialog title="新增页面" :visible.sync="addDialogVisible" width="65%">
                   <warningConditionAdd @save="hidenDialog" @cancel="hidenDialogCancel" :ene-type="eneType" />
               </el-dialog>
               <el-dialog title="修改页面" :visible.sync="upDialogVisible" width="65%">
                   <warningConditionUp @save="hidenDialog" @cancel="hidenDialogCancel" :id="objId"/>
               </el-dialog>
    </div>
</template>

<script>

    import warningConditionAdd from './warningConditionAdd'
    import warningConditionUp from './warningConditionUp'
    import Pagination from '@/components/Pagination'
    import {selectWarningByNameAndCode,selectWarningConditionByNameAndType,deleteWarningConditionById,batchDelEneWarningCondition} from '@/api/energy'
    export default {
        name: "warningCondition",
        components: {
            warningConditionAdd,
            warningConditionUp,
            Pagination
        },
        data() {
            return {
                page: {
                    pageNum: 1,
                    pageSize: 10
                },
                total: 0,
                queryForm: {
                    meteringName: '',
                    warningType: ''
                },
                selectValue: '',
                eneType: [{
                    name: 'a',
                    code: '1'
                }],
                tableData: [{
                    equipCode: 'a',
                    meteringName: '1'
                }],
                addDialogVisible: false,
                upDialogVisible: false,
                batchBtn: true,
                objId: '',
                objIds: [],
            }
        },
        methods: {
            getData() {
                //查询所有告警类型
                selectWarningByNameAndCode(null).then(response =>{
                    this.eneType = response.data.rows;
                }).catch(e=>{
                    this.$message.error(e.message)
                });
                //查询所有告警记录
                this.selectWarningConditionByNameAndType();
            },
            objSelection(objs) {
                this.objIds.length = 0;
                const _this = this;
                objs.forEach(element => {
                    _this.objIds.push(element.id)
                });
                this.batchBtn = this.objIds.length === 0;
            },
            updateWarningCondition(id) {
                this.objId = id;
                this.upDialogVisible = true
            },
            addWarningCondition(){
                this.addDialogVisible = true
            },
            deleteWarningConditionById(id) {
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteWarningConditionById(id).then(() => {
                        this.selectWarningConditionByNameAndType();
                        this.$message.success("删除成功!");
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            batchDelEneWarningCondition(){
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    batchDelEneWarningCondition(this.objIds).then((response) => {
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
            clearSearchBox(){
                this.$refs['queryForm'].resetFields()
            },
            selectWarningConditionByNameAndType(){
                const params = {
                    ...this.page,
                    ...this.queryForm
                };
                //查询所有告警条件
                selectWarningConditionByNameAndType(params).then(response =>{
                    this.tableData = response.data.rows;
                    this.total = response.data.total
                }).catch(e=>{
                    this.$message.error(e.message)
                })
            },
             hidenDialog() {
                this.addDialogVisible = false;
                this.upDialogVisible = false;
                this.getData(this.page);
            },
            hidenDialogCancel() {
                this.addDialogVisible = false;
                this.upDialogVisible = false;
            },
        },
        mounted() {
            this.getData();
        }
    }
</script>

<style scoped>

</style>
