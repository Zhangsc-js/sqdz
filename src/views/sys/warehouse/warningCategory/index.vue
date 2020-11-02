<template>
    <!-- 警报分类 -->
    <div class="warning" style="height:100%">


        <!-- 查询表单 -->
        <el-form
            inline="true"
            :model="queryForm"
            class="demo-form-inline"
            style="margin-left:15px"
            ref="queryForm"
        >
            <el-form-item label="警报分类">
                <el-input v-model="queryForm.categoryCode" placeholder></el-input>
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

                <el-table-column prop="categoryCode" label="警报分类">
                    <template v-slot="scope">
                        <el-form-item
                            :prop="'tableData.' + scope.$index + '.warningCode'"
                            :rules="rules.categoryCode"
                            v-if="scope.row.isAdd"
                        >
                            <el-input v-model="scope.row.categoryCode"></el-input>
                        </el-form-item>
                        <span v-else>{{ scope.row.categoryCode }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="categoryName" label="警报分类名称">
                    <template v-slot="scope">
                        <el-form-item
                            :prop="'tableData.' + scope.$index + '.categoryName'"
                            :rules="rules.categoryName"
                            v-if="scope.row.seen||scope.row.isAdd"
                        >
                            <el-input v-model="scope.row.categoryName"></el-input>
                        </el-form-item>
                        <span v-else>{{ scope.row.categoryName }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="qtyLimit" label="警报配置数量限制">
                    <template v-slot="scope">
                        <el-form-item
                            :prop="'tableData.' + scope.$index + '.qtyLimit'"
                            :rules="rules.qtyLimit"
                            v-if="scope.row.seen||scope.row.isAdd"
                        >
                            <el-input v-model="scope.row.qtyLimit"></el-input>
                        </el-form-item>
                        <span v-else>{{ scope.row.qtyLimit }}</span>
                    </template>
                </el-table-column>


                <el-table-column align="center" label="操作" fixed="right" width="120">
                    <template v-slot="scope">
                        <el-button
                            type="text"
                            v-if="!scope.row.seen"
                            size="small"
                            @click="edit(scope.row)"
                        >更新
                        </el-button>
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
            <el-button type="primary" plain icon="el-icon-delete" @click="rowDel">删除</el-button>
        </el-row>
    </div>
</template>

<script>
    import {
        getData,
        insertWarningCategory,
        updateWarningCategory,
        deleteWarningCategory
    } from "@/api/sys/warningCategory";

    import warningInfo from "../warning/warningInfo";
    import Pagination from "@/components/Pagination";

    export default {
        components: {
            warningInfo,
            Pagination
        },
        data() {
            return {
                queryForm: {
                    warningName: ""
                },
                page: {
                    pageNum: 1,
                    pageSize: 10
                },
                total: 0,
                rules: {
                    warningCode: [
                        {required: true, message: "请输入编码", trigger: ["blur", "change"]}
                    ]
                }, //校验规则
                tableData: [],
                code: ""
            };
        },
        created() {
            this.init();
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
            },
            // 更新
            edit(row) {
                this.$set(row, "seen", true);
            },
            save(row) {
                if (row.id) {
                    updateWarningCategory(row)
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
                    insertWarningCategory(row)
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
                this.tableData.unshift({
                    isAdd: true,
                    seen: true,
                    id: "",
                    categoryCode: "",
                    categoryName: "",
                    qtyLimit: ""
                });
            },
            rowDel() {
                if (this.$refs.multipleTable.selection.length > 0) {
                    let arr = this.$refs.multipleTable.selection.map(
                        item => item.id
                    );
                    const param = {
                        id : arr.join(",")
                    };

                    this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                        .then(() => {deleteWarningCategory
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
            getDetail(row) {
                this.code = row.warningCode;
            }
        },
        computed: {
            ruleForm() {
                return {
                    tableData: this.tableData
                };
            },
            warningCategory() {
                return function (cat) {
                    if (cat === "1") {
                        return "设备警报";
                    } else if (cat === "2") {
                        return "中断警报";
                    } else if (cat === "3") {
                        return "超期警报";
                    }
                };
            }
        }
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
