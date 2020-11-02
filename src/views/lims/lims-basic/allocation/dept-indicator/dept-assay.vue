<template>
    <div class="department" style="height: 100%;">
        <el-container style="height: 100%;width: 100%">
            <el-aside style="height: 100%;width: 20%">
                <el-tree
                    :data="treeData"
                    node-key="id"
                    highlight-current
                    :expand-on-click-node="false"
                    @node-click="handleNodeClick"
                    style="height: 100%;"
                    default-expand-all
                >
                    <template v-slot="{data}">
                        <span class="el-icon-folder" style="font-size:14px">{{data.name}}</span>
                    </template>
                </el-tree>
            </el-aside>
            <div class="indicator" style="height: 100%;width: 80%">
                <el-divider content-position="left">指标列表</el-divider>
                <el-transfer style="height: 90%;width: 100%"
                    :titles="['未选', '已选']"
                    :props="{key: 'outId',label: 'outValue'}"
                    filterable
                    :filter-method="filterMethod"
                    v-model="temp"
                    :data="selectIndicator"
                    class="indicator"
                >
                    <el-button
                        class="transfer-footer"
                        slot="right-footer"
                        size="small"
                        @click="confirmChange"
                        :disabled="confirmDisabled"
                        v-has="'LIMS-DEPT-INDICATOR-SAVE'"
                    >确定保存该项配置信息
                    </el-button>
                </el-transfer>
            </div>
        </el-container>
    </div>
</template>

<script>
    import {simpleDateFormat} from "@/utils/index";
    import {
        getOutListAll,
        deptAssayEdit,
        getLabDepartment,
        deptAssayByDeptId
    } from "@/api/lims";
    import { hasBtn } from "@/utils/index";
    export default {
        name: "deptAssay",
        data() {
            return {
                treeData: [],
                selectIndicator: [],
                clickedDept: {},
                clickedItem: {},
                temp: [],
                confirmDisabled: true
            }
        },
        activated() {
            this.getLab();
            this.getOut();
        },
        methods: {
            hasBtn,
            getLab() {
                getLabDepartment().then(res => {
                    if (res.data.success) {
                        this.treeData = res.data.data.treeData;
                    }
                }).catch(e => {
                    this.$message.error(e.message);
                });
            },
            getOut() {
                getOutListAll().then(res => {
                    if (res.data.success) {
                        this.selectIndicator = res.data.data;
                    }
                }).catch(e => {
                    this.$message.error(e.message);
                });
            },
            handleNodeClick(val) {
                let type = val.type.split(",");
                if(type.indexOf("009") === -1){
                    this.confirmDisabled = true;
                    this.$message.warning("只能配置部门分类为化验室的指标");
                    return false;
                }
                this.confirmDisabled = false;
                this.temp = [];
                this.clickedDept = val;
                this.getDeptConfiguration(val);
            },
            getDeptConfiguration(val){
                deptAssayByDeptId(val.id).then(response => {
                    const result = response.data;
                    if (result.success) {
                        if (result.data != null && result.data.indicatorId.trim() !== "")
                            this.temp = result.data.indicatorId.split(",");
                        this.clickedItem = result.data;
                    } else {
                        this.$message.error(result.message);
                    }
                }).catch(e => {
                    this.$message.error(e.message);
                });
            },
            filterMethod(query, item) {
                return item.outValue.indexOf(query) > -1;
            },
            confirmChange() {
                this.$confirm("确认保存？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    if (this.clickedDept.id === undefined || this.clickedDept.id.trim() === "") {
                        this.$message.warning("请选择需要配置的化验地点");
                        return false;
                    }
                    if(this.temp.length > 100){
                        this.$message.warning("最多勾选100个分析项");
                        return false;
                    }
                    const param = {
                        deptName: this.clickedDept.name,
                        indicatorId: this.temp.join(","),
                        deptId: this.clickedDept.id,
                        parentDeptCode: this.clickedDept.parentCode,
                        id: this.clickedItem && this.clickedItem.id? this.clickedItem.id : "",
                        createOn: this.clickedItem && this.clickedItem.createOn? this.clickedItem.createOn : "",
                        createBy: this.clickedItem && this.clickedItem.createBy? this.clickedItem.createBy : "",
                    };
                    deptAssayEdit(param).then(response => {
                        const result = response.data;
                        if (result.success) {
                            this.$message.success("保存成功");
                        } else {
                            this.$message.error(result.message);
                        }
                    }).catch(e => {
                        this.$message.error(e.message);
                    });
                })
            }
        }
    }
</script>

<style lang="scss">
    .indicator {
        .el-transfer-panel {
            margin-left: 12px !important;
            width: calc(50% - 60px)!important;
            height: 100% !important;
        }

        .el-transfer-panel__body {
            height: 100%!important;
        }

        .el-transfer-panel__list.is-filterable {
            height: 100% !important;
        }

        .el-transfer-panel__item.el-checkbox .el-checkbox__label {
            font-size: 14px !important;
        }

        .el-button--mini, .el-button--small {
            font-size: 14px !important;
        }
    }
</style>
