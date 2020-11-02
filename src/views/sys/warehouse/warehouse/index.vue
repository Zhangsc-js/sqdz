<template>
    <!-- 仓库号管理 -->
    <div class="warning" style="height:100%">
        <!-- 查询表单 -->
        <el-form
            inline
            :model="queryForm"
            class="demo-form-inline"
            style="margin-left:15px"
            ref="queryForm"
        >
            <el-form-item label="仓库号">
                <el-input v-model="queryForm.whCode" placeholder></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
        </el-form>


        <!-- 表格主体 -->
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
            <el-table
                highlight-current-row
                :data="ruleForm.tableData"
                stripe
                height="70vh"
                ref="multipleTable"
            >
                <el-table-column type="selection" width="55"></el-table-column>

                <el-table-column prop="whCode" label="仓库号">
                    <template v-slot="scope">
                        <el-form-item
                            :prop="'tableData.' + scope.$index + '.whCode'"
                            :rules="rules.whCode"
                            v-if="scope.row.isAdd"
                        >
                            <el-input v-model="scope.row.whCode"></el-input>
                        </el-form-item>
                        <span v-else>{{ scope.row.whCode }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="whName" label="仓库号描述">
                    <template v-slot="scope">
                        <el-form-item
                            :prop="'tableData.' + scope.$index + '.whName'"
                            :rules="rules.whName"
                            v-if="scope.row.seen||scope.row.isAdd"
                        >
                            <el-input v-model="scope.row.whName"></el-input>
                        </el-form-item>
                        <span v-else>{{ scope.row.whName }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="city" label="城市">
                    <template v-slot="scope">
                        <el-form-item
                            :prop="'tableData.' + scope.$index + '.city'"
                            :rules="rules.city"
                            v-if="scope.row.seen||scope.row.isAdd"
                        >
                            <el-input v-model="scope.row.city"></el-input>
                        </el-form-item>
                        <span v-else>{{ scope.row.city }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="whAddress" label="地址">
                    <template v-slot="scope">
                        <el-form-item
                            :prop="'tableData.' + scope.$index + '.whAddress'"
                            :rules="rules.whAddress"
                            v-if="scope.row.seen||scope.row.isAdd"
                        >
                            <el-input v-model="scope.row.whAddress"></el-input>
                        </el-form-item>
                        <span v-else>{{ scope.row.whAddress }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="cellEnabled" label="是否启用存储单元">
                    <template v-slot="scope">
                        <el-form-item
                            :prop="'tableData.' + scope.$index + '.cellEnabled'"
                            :rules="rules.cellEnabled"
                            v-if="scope.row.seen||scope.row.isAdd"
                        >
                            <el-input v-model="scope.row.cellEnabled"></el-input>
                        </el-form-item>
                        <span v-else>{{ scope.row.cellEnabled|enabled }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="库存地点">
                    <!--<el-select v-model="scope.row.locationList" clearable placeholder="请选择">
                        <el-option
                            v-for="item in scope.row.locationList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>-->
                    <template v-slot={row}>
                        <el-popover
                            placement="left"
                            trigger="click">
                            <el-table :data="row.locationList">
                                <el-table-column width="150" property="whCode" label="仓库号"></el-table-column>
                                <el-table-column width="100" property="ftyCode" label="工厂"></el-table-column>
                                <el-table-column width="300" property="locationCode" label="库存地点"></el-table-column>
                            </el-table>
                            <el-button slot="reference">查看详情</el-button>
                        </el-popover>

                    </template>
                </el-table-column>
                <el-table-column prop="createBy" label="创建人">
                    <template v-slot="scope">
                        <el-form-item
                            :prop="'tableData.' + scope.$index + '.createBy'"
                            :rules="rules.createBy"
                            v-if="scope.row.seen||scope.row.isAdd"
                        >
                            <el-input v-model="scope.row.createBy"></el-input>
                        </el-form-item>
                        <span v-else>{{ scope.row.createBy }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createOn" label="创建时间">
                    <template v-slot="scope">
                        <el-form-item
                            :prop="'tableData.' + scope.$index + '.createOn'"
                            :rules="rules.createOn"
                            v-if="scope.row.seen||scope.row.isAdd"
                        >
                            <el-input v-model="scope.row.createOn"></el-input>
                        </el-form-item>
                        <span v-else>{{ scope.row.createOn }}</span>
                    </template>
                </el-table-column>


                <el-table-column align="center" label="操作" fixed="right" width="120">
                    <template v-slot="scope">

                        <el-button
                            type="text"
                            v-if="scope.row.seen"
                            size="small"
                            @click="save(scope.row)"
                        >保存
                        </el-button>
                        <el-button
                            type="text"
                            v-if="scope.row.seen"
                            size="small"
                            @click="cancel(scope.row)"
                        >取消
                        </el-button>
                        <el-button type="text" @click="modifyWh(scope.row.whCode)">修改</el-button>
                        <el-button type="text" @click="rowDel(scope.row.whCode)">删除</el-button>


                    </template>

                </el-table-column>
            </el-table>
        </el-form>
        <Pagination
            :total="total"
            :page.sync="page.pageNum"
            :limit.sync="page.pageSize"
            @pagination="init()"
        />
        <!-- 新增删除行 -->
        <el-row style="padding:20px">
            <el-button type="primary" icon="el-icon-plus" @click="addRow">新增</el-button>
            <el-button type="primary" plain icon="el-icon-delete" @click="rowDelBatch">批量删除</el-button>
        </el-row>
        <el-dialog title="修改仓库号" :visible.sync="modifyDialogVisible" width="65%" @closed="">
            <ModifyWarehouse @save="onSubmit()" @cancel="cancel()" :whCode="whCode" />
        </el-dialog>
        <el-dialog title="新增仓库号" :visible.sync="addDialogVisible" width="65%" @closed="">
            <AddWarehouse @save="onSubmit()" @cancel="cancel()" :size="size" />
        </el-dialog>
    </div>

</template>

<script>
    import {
        getData,
        insertWarehouse,
        updateWarehouse,
        deleteWarehouse
    } from "@/api/sys/wms/warehouse";

    import warningInfo from "../warning/warningInfo";
    import Pagination from "@/components/Pagination";
    import ModifyWarehouse from "./modifyWarehouse";
    import AddWarehouse from "./addWarehouse";

    export default {
        components: {
            ModifyWarehouse,
            warningInfo,
            Pagination,
            AddWarehouse
        },
        data() {
            return {
                queryForm: {
                    whCode: ""
                },
                page: {
                    pageNum: 1,
                    pageSize: 10
                },
                total: 0,
                rules: {
                    whCode: [
                        {required: true, message: "请输入编码", trigger: ["blur", "change"]}
                    ]
                }, //校验规则
                tableData: [],
                code: "",
                modifyDialogVisible:false,
                addDialogVisible:false,
                whCode:"",
                size:0
            };
        },
        created() {
            this.init();
        },
        computed: {
            ruleForm() {
                return {
                    tableData: this.tableData
                };
            }
        },
        filters: {
            enabled(val) {
                switch (val) {
                    case 0:
                        return "未启用";
                    case 1:
                        return "启用";
                }
            }
        },

        methods: {
            init() {
                getData(this.page).then(res => {
                    this.tableData = res.data.data.rows;
                    this.total = res.data.data.total;
                });
            },
            // 查询
            onSubmit() {
                const param = {
                    ...this.page,
                    ...this.queryForm
                };
                getData(param).then(res => {
                    this.tableData = res.data.data.rows;
                    this.total = res.data.data.total;
                });
                this.modifyDialogVisible = false;
                this.addDialogVisible = false;
            },
            cancel(){
                this.modifyDialogVisible=false;
                this.addDialogVisible=false;
            },
            save(row) {
                if (row.id) {
                    updateWarehouse(row)
                        .then(res => {
                            const result = res.data;
                            if (result.success) {
                                this.$message.success("保存成功");
                                this.init();
                            } else {
                                this.$message.error(result.message);
                            }
                        })
                        .catch(e => {
                            this.$message.error(e.message);
                        });
                } else {
                    insertWarehouse(row)
                        .then(res => {
                            const result = res.data;
                            if (result.success) {
                                this.$message.success("保存成功");
                                this.init();
                            } else {
                                this.$message.error(result.message);
                            }
                        })
                        .catch(e => {
                            this.$message.error(e.message);
                        });
                }
            },
            cancel(row) {
                row.seen = false;
                this.init();
            },
            addRow() {
                this.addDialogVisible=true;
                this.size++
            },
            rowDelBatch() {
                if (this.$refs.multipleTable.selection.length > 0) {
                    let arr = this.$refs.multipleTable.selection.map(
                        item => item.whCode
                    );
                    const param = {
                        whCode: arr.join(",")
                    };

                    this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                        .then(() => {
                            deleteWarehouse
                            (param).then(response => {
                                const result = response.data;
                                if (result.success) {
                                    this.$message.success("删除成功");
                                    this.pageNum = 1;
                                    this.init();
                                } else {
                                    this.$message.error(result.message);
                                }
                            });
                        })
                        .catch(() => {
                            this.$message.info("已取消删除");
                        });
                }
            },
            rowDel(id) {
                const param = {
                    whCode: id
                };

                this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        deleteWarehouse
                        (param).then(response => {
                            const result = response.data;
                            if (result.success) {
                                this.$message.success("删除成功");
                                this.pageNum = 1;
                                this.init();
                            } else {
                                this.$message.error(result.message);
                            }
                        });
                    })
                    .catch(() => {
                        this.$message.info("已取消删除");
                    });
            },
            getDetail(row) {
                this.code = row.warningCode;
            },
            modifyWh(whCode) {
                this.modifyDialogVisible = true;
                this.whCode = whCode;
            },
        },
    };
</script>

<style scoped lang='scss'>
    .el-aside {
        width: 45% !important;
        height: 100%;
    }

    .el-main {
        width: 55%;
        height: 100%;
    }
</style>
