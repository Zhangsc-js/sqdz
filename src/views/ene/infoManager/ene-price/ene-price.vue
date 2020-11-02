<template>
    <el-container style="padding-top:24px">
        <div class="tableshadow" style="width: 100%;">
            <el-form inline label-width="80px" class="margin20 mb0">
                <el-form-item label="能源类型" prop="energyCode">
                    <el-select v-model="energyCode" value="selectValue" placeholder="能源类型">
                        <el-option label="请选择能源类型" value></el-option>
                        <el-option
                            v-for="item in eneType"
                            :key="item.code"
                            :label="item.label"
                            :value="item.code"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button
                        icon="el-icon-search"
                        href="javascript:void(0)"
                        type="primary"
                        class="btn-b"
                        @click="getData"
                    >查询</el-button>
                    <el-button href="javascript:void(0)" class="btn-w" @click="clearSearchBox">清空</el-button>
                    <el-button type="primary" @click="addEnePrice" icon="el-icon-plus">新增</el-button>
                </el-form-item>
            </el-form>

            <el-table stripe :data="tableData" @selection-change="selsChange" style="width: 100%">
                <el-table-column fixed type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="name" align="center" label="能源价格名称" width="130"></el-table-column>
                <el-table-column
                    prop="startTime"
                    align="center"
                    label="开始时间"
                    min-width="180"
                ></el-table-column>
                <el-table-column
                    prop="endTime"
                    align="center"
                    label="结束时间"
                    min-width="180"
                ></el-table-column>
                <el-table-column prop="price" align="center" label="价格(￥)" width="150"></el-table-column>
                <el-table-column prop="unit" align="center" label="单位" width="150"></el-table-column>
                <el-table-column prop="codeName" align="center" label="能源类型" width="150"></el-table-column>
                <el-table-column fixed="right" align="center" label="操作" width="180px">
                    <template v-slot="scope">
                        <el-button type="text" size="small" @click="updateEnePrice(scope.row)">更新</el-button>
                        <el-button type="text" size="small" @click="deleteEnePrice(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="fl batch-btn-padding">
                <el-row>
                    <el-col :span="24">
                        <el-button :disabled="batchBtn" type="danger" @click="batchDel">批量删除</el-button>
                    </el-col>
                </el-row>
            </div>
            <Pagination
                :total="total"
                :page.sync="page.pageNum"
                :limit.sync="page.pageSize"
                @pagination="getData"
            />
            <el-dialog :title="title" :visible.sync="editDialogVisible" width="65%">
                <enePriceUp
                    @hidenDialog="hidenDialog"
                    @cancel="hidenDialogCancel"
                    :ene-type="eneType"
                    :tableData="data"
                />
            </el-dialog>
            <el-dialog :title="title" :visible.sync="addDialogVisible" width="65%">
                <enePriceAdd @hidenDialog="hidenDialog" @cancel="hidenDialogCancel" :ene-type="eneType" />
            </el-dialog>
        </div>
    </el-container>
</template>

<script>
    import {
        getAllEneType,
        getAllEnePrice,
        deleteEnePrice,
        batchDelEnePrices
    } from "@/api/energy";
    import enePriceAdd from "./ene-price-add";
    import enePriceUp from "./ene-price-up";
    import Pagination from "@/components/Pagination";
    // import { simpleDateFormat } from "@/utils/index";

    export default {
        name: "ene-price",
        data() {
            return {
                editDialogVisible: false,
                addDialogVisible: false,
                title: "",
                batchBtn: true,
                total: 0,
                page: {
                    pageNum: 0,
                    pageSize: 10
                },
                eneType: [],
                tableData: [],
                energyCode: "",
                quryForm: {
                    energyCode: ""
                },
                objIds: [],
                selId: "",
                data: {}
            };
        },
        components: {
            enePriceAdd,
            enePriceUp,
            Pagination
        },
        mounted() {
            this.getData();
            getAllEneType()
                .then(response => {
                    if (response.data.success) {
                        this.eneType = response.data.data;
                    } else {
                        this.$message.error(response.data.message);
                    }
                })
                .catch(e => {
                    this.$message.error(e.message);
                });
        },
        methods: {
            //获取数据
            getData() {
                const params = {
                    ...this.page,
                    energyCode: this.energyCode
                };
                getAllEnePrice(params)
                    .then(res => {
                        if (res.data.success) {
                            this.tableData = res.data.data.rows;
                            this.total = res.data.data.total;
                        } else {
                            this.$message.error(res.data.message);
                        }
                    })
                    .catch(e => {
                        this.$message.error(e.message);
                    });
            },
            //增加能源价格
            addEnePrice() {
                this.title = "能源价格添加页面";
                this.addDialogVisible = true;
            },
            //修改
            updateEnePrice(data) {
                this.title = "能源价格编辑页面";
                this.editDialogVisible = true;
                this.data = data;
                console.log(this.data)
            },
            //删除
            deleteEnePrice(id) {
                this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        deleteEnePrice(id).then(() => {
                            this.$message.success("删除成功!");
                            this.getData();
                        });
                    })
                    .catch(() => {
                        this.$message.info("已取消删除");
                    });
            },
            //批量删除
            batchDel() {
                this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    let ids = this.objIds.toString();
                    batchDelEnePrices(ids).then(response => {
                        const result = response.data;
                        if (result.success) {
                            this.$message({
                                type: "success",
                                message: "批量删除成功!"
                            });
                            // 刷新页面
                            this.getData();
                        } else {
                            this.$message({
                                type: "error",
                                message: result.message
                            });
                        }
                    });
                });
            },
            //批量选择
            selsChange(objs) {
                this.objIds.length = 0;
                objs.forEach(element => {
                    this.objIds.push(element.id);
                });
                this.batchBtn = this.objIds.length === 0;
            },
            //清空选项框
            clearSearchBox() {
                // this.$refs["energyCode"].resetFields();
                //this.eneType = [];
                this.energyCode = "";
            },
            hidenDialog() {
                this.addDialogVisible = false;
                this.editDialogVisible = false;
                this.getData();
            },
            hidenDialogCancel() {
                this.addDialogVisible = false;
                this.editDialogVisible = false;
            },
        }
    };
</script>

<style scoped>
    .el-col button {
        margin: -2px 4px 0px 4px;
    }
</style>
