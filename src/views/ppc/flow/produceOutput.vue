<template>
    <div style="height: 100%;" class="produceOutput">
        <el-form ref="inqu" :model="inqu" inline>
            <el-row>
                <el-form-item label="日期：" prop="reportDateStart">
                    <el-date-picker
                        v-model="inqu.reportDateStart"
                        type="date"
                        placeholder="开始日期"
                        style="width: 100%"
                        value-format="yyyy-MM-dd"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="~" prop="reportDateEnd" label-width="30px">
                    <el-date-picker
                        v-model="inqu.reportDateEnd"
                        type="date"
                        placeholder="截止日期"
                        style="width: 100%"
                        value-format="yyyy-MM-dd"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="车间名称：" prop="workshopCode">
                    <el-select
                        v-model="inqu.workshopCode"
                        placeholder="请选择"
                        filterable
                        style="width: 100%"
                        clearable
                    >
                        <el-option
                            v-for="item in WORKSHOP_ALL"
                            :key="item.proccode"
                            :label="item.name"
                            :value="item.proccode"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="物料编码：" prop="materialCodeLike">
                    <el-input v-model="inqu.materialCodeLike" clearable/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary " icon="el-icon-search" @click="getData">查询</el-button>
                    <el-button type="primary " icon="el-icon-refresh-left" @click="reset()">重置</el-button>
                </el-form-item>
            </el-row>
        </el-form>
        <el-table
            highlight-current-row
            :data="tableData"
            @selection-change="objSelection"
            style="width: 100%;"
            height="calc(100% - 52px - 12px - 62px - 33px)"
            border
        >
            <el-table-column type="selection" width="60" center></el-table-column>
            <el-table-column prop="reportDate" label="报工日期"></el-table-column>
            <el-table-column prop="workshopName" label="车间"></el-table-column>
            <el-table-column prop="materialCode" label="物料编码"></el-table-column>
            <el-table-column prop="materialName" label="物料名称"></el-table-column>
            <el-table-column prop="produceQty" label="产量"></el-table-column>
            <el-table-column prop="unitCode" label="单位"></el-table-column>
            <el-table-column fixed="right" align="center" label="操作" width="100px">
                <template v-slot="scope">
                    <el-button type="text" size="small" @click="updateOutput(scope.row.id)">更新</el-button>
                </template>
            </el-table-column>
        </el-table>
        <Pagination
            :total="total"
            :page.sync="page.pageNum"
            :limit.sync="page.pageSize"
            @pagination="getData"
        />
        <div class="btnClass">
            <el-button type="primary" icon="el-icon-plus" @click="addOutput" v-has="'PPC-OUTPUT-ADD'">新增</el-button>
            <el-button
                type="primary"
                icon="el-icon-delete"
                @click="deleteOutput"
                v-has="'PPC-OUTPUT-DELETE'"
            >删除
            </el-button>
            <el-upload
                action="/api/ppc/flow/produceOutput/importFlowOutput"
                :show-file-list="false"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :on-change="beforeUpload"
                :headers="token"
            >
                <el-button type="primary" slot="trigger" icon="el-icon-files" v-has="'PPC-OUTPUT-IMPORT'">导入</el-button>
            </el-upload>
            <el-button
                type="primary"
                icon="el-icon-printer"
                @click="exportData"
                v-has="'PPC-OUTPUT-EXPORT'"
            >导出
            </el-button>
            <el-button
                type="primary"
                icon="el-icon-download"
                @click="downloadTemplate"
                v-has="'PPC-OUTPUT-DOWNLOAD'"
            >模板下载
            </el-button>
        </div>
        <el-dialog :title="title" :visible.sync="dialogVisible" width="46%">
            <el-form ref="outputInfo" :model="outputInfo" label-width="100px" :rules="rule">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="报工日期：" prop="reportDate">
                            <el-date-picker
                                v-model="outputInfo.reportDate"
                                type="date"
                                style="width: 100%"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                            ></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="车间：" prop="workshopCode">
                            <el-select
                                v-model="outputInfo.workshopCode"
                                placeholder="请选择"
                                filterable
                                style="width: 100%"
                                clearable
                                @change="workshopChange"
                            >
                                <el-option
                                    v-for="item in WORKSHOP_ALL"
                                    :key="item.proccode"
                                    :label="item.name"
                                    :value="item.proccode"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="物料编码：" prop="materialCode">
                            <el-input v-model="outputInfo.materialCode"
                                      @focus="sltMaterialDialogVisible=true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="物料名称：" prop="materialName">
                            <el-input v-model="outputInfo.materialName" disabled="disabled"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="单位：" prop="primaryUnit">
                            <el-input v-model="outputInfo.unitCode" disabled="disabled"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="数量：" prop="produceQty">
                            <el-input v-model="outputInfo.produceQty" type="number" min="0"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button icon="el-icon-close" @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary " icon="el-icon-check" @click="dialogConfirm">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="选择物料" :visible.sync="sltMaterialDialogVisible" width="65%">
            <sltMaterial @save="confirmMaterial" @cancel="sltMaterialDialogVisible=false" :id="objId"/>
        </el-dialog>
    </div>
</template>

<script>
    import {
        initData,
        queryOutput,
        saveOutput,
        queryById,
        deleteByIds,
        downloadTemplateOutput
    } from "@/api/ppc/flow/produceOutput.js";
    import Pagination from "@/components/Pagination";
    import {simpleDateFormat} from "@/utils/index";
    import sltMaterial from "@/views/ppc/plannedProduction/ppc-bom/materialInfo";
    import {exportExcel} from "@/utils/common";
    import {getToken} from "@/utils/auth";
    import {saveAs} from "file-saver";
    import {resetQueryForm} from "@/utils/common";

    export default {
        components: {
            Pagination,
            sltMaterial
        },
        data() {
            return {
                inqu: {
                    reportDateStart: simpleDateFormat(new Date(), "yyyy-MM-dd"),
                    reportDateEnd: simpleDateFormat(new Date(), "yyyy-MM-dd"),
                    materialCodeLike: "",
                    workshopCode: ""
                },
                page: {
                    pageNum: 1,
                    pageSize: 10
                },
                tableData: [],
                total: 0,
                WORKSHOP_ALL: [],
                outputInfo: {
                    reportDate: "",
                    materialCode: "",
                    workshopCode: "",
                    produceQty: 1,
                    workshopName: "",
                    unitCode: "",
                    materialName: ""
                },
                rule: {
                    reportDate: [
                        {required: true, message: "请选择日期", trigger: ["change", "blur"]}
                    ],
                    workshopCode: [
                        {required: true, message: "请选择车间", trigger: ["change", "blur"]}
                    ],
                    materialCode: [
                        {required: true, message: "请选择物料", trigger: ["change", "blur"]}
                    ],
                    produceQty: [
                        {required: true, message: "请输入数量", trigger: ["change", "blur"]}
                    ]
                },
                dialogVisible: false,
                type: "", //1新增，2更新
                sltMaterialDialogVisible: false,
                title: "",
                objId: "",
                selectIds: [],
                token: {
                    Authorization: `Bearer ${getToken()}`
                }
            };
        },
        mounted() {
            this.initData();
        },
        methods: {
            initData() {
                initData()
                    .then(response => {
                        if (response.data.success) {
                            this.WORKSHOP_ALL = response.data.data.WORKSHOP_ALL;
                            this.getData();
                        }
                    })
                    .catch(e => {
                        this.$message.error(e.message);
                    });
            },
            getData() {
                var params = {
                    ...this.page,
                    ...this.inqu
                };
                queryOutput(params)
                    .then(response => {
                        this.tableData = response.data.data.list;
                        this.total = response.data.data.total;
                    })
                    .catch(e => {
                        this.$message.error(e.message);
                    });
            },
            objSelection(data) {
                this.selectIds = [];
                for (let i = 0; i < data.length; i++) {
                    this.selectIds.push(data[i].id);
                }
            },
            addOutput() {
                this.outputInfo = {
                        reportDate: "",
                        materialCode: "",
                        workshopCode: "",
                        produceQty: 1,
                        workshopName: "",
                        unitCode: "",
                        materialName: ""
                }
                this.outputInfo.id = "";
                this.dialogVisible = true;
                this.type = "1";
                this.title = "新增";
                this.reportDateStart = simpleDateFormat(new Date(), "yyyy-MM-dd");
            },
            updateOutput(id) {
                this.dialogVisible = true;
                this.type = "2";
                this.title = "更新";
                queryById(id)
                    .then(response => {
                        if (response.data.success) {
                            this.outputInfo = response.data.data;
                        } else {
                            this.$message.error(
                                response.data.message + ":" + response.data.data
                            );
                        }
                    })
                    .catch(e => {
                        this.$message.error(e.message);
                    });
            },
            confirmMaterial(data) {
                this.outputInfo.materialCode = data.materialCode;
                this.outputInfo.materialName = data.materialName;
                this.outputInfo.unitCode = data.primaryUnit;
                this.sltMaterialDialogVisible = false;
            },
            deleteOutput() {
                this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    if (this.selectIds.length != 0) {
                        deleteByIds(this.selectIds.join(","))
                            .then(response => {
                                if (response.data.success) {
                                    this.$message.success("删除成功");
                                    this.getData();
                                } else {
                                    this.$message.error(
                                        response.data.message + ":" + response.data.data
                                    );
                                }
                            })
                            .catch(e => {
                                this.$message.error(e.message);
                            });
                    } else {
                        this.$message.warning("请先选择要删除的数据");
                    }
                }).catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
            },
            dialogConfirm() {
                saveOutput(this.outputInfo)
                    .then(response => {
                        if (response.data.success) {
                            this.$message.success("保存成功");
                            this.dialogVisible = false;
                            this.getData();
                        } else {
                            this.$message.error(
                                response.data.message + ":" + response.data.data
                            );
                        }
                    })
                    .catch(e => {
                        this.$message.error(e.message);
                    });
            },
            workshopCode2Name(code) {
                for (let i = 0; i < this.WORKSHOP_ALL.length; i++) {
                    if (this.WORKSHOP_ALL[i].proccode == code) {
                        return this.WORKSHOP_ALL[i].name;
                    }
                }
                return null;
            },
            workshopChange(value) {
                if (value) {
                    this.outputInfo.workshopName = this.workshopCode2Name(value);
                }
            },
            uploadSuccess(response) {
                if (response.success) {
                    this.$message.success("导入成功");
                    this.getData();
                } else {
                    this.$message.error(response.message + ":" + response.data);
                }
            },
            uploadError(err) {
                this.$message.error(err.message);
            },
            downloadTemplate() {
                downloadTemplateOutput()
                    .then(response => {
                        if (response.data) {
                            let data = new File([response.data], {
                                type: "application/octet-stream"
                            });
                            saveAs(data, "每日产量导入模板.xlsx");
                        } else {
                            this.$message.error(response.message);
                        }
                    })
                    .catch(e => {
                        this.$message.error(e.message);
                    });
            },
            exportData() {
                let exportData = [];
                const params = {
                    ...this.queryForm,
                    pageNum: 1,
                    pageSize: this.total
                };
                const fields = {
                    reportDate: "报工日期",
                    workshopCode: "车间编码",
                    workshopName: "车间名称",
                    materialCode: "物料编码",
                    materialName: "物料名称",
                    produceQty: "产量",
                    unitCode: "单位"
                };
                const fileName = "每日产出";
                queryOutput(params)
                    .then(response => {
                        exportData = response.data.data.list;
                        exportExcel(fileName, fields, exportData);
                    })
                    .catch(e => {
                        this.$message.error(e.message);
                    });
            },
            beforeUpload() {
                return true;
            },
            reset() {
                resetQueryForm(this, "inqu", "initData");
            }
        }
    };
</script>
<style scoped>
    .btnClass div {
        display: inline-block;
        margin: 0 10px;
    }
</style>
<style lang="scss">
    .produceOutput .el-input {
        width: auto !important;
    }
</style>
