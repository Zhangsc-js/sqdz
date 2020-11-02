<template>
    <!--    对比分析-->
    <!--    对比分析-->
    <el-container>
        <div style="width: 100%;">
            <el-form ref="formData" :model="formData" :rules="rules" label-width="160px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <div class="grid-content bg-purple">
                            <el-row>
                                <el-form-item label="报表名称：" prop="name">
                                    <el-input v-model="formData.name" style="width:220px;"/>
                                </el-form-item>
                            </el-row>
                            <el-row>
                                <el-form-item label="能源类型：" prop="energyType">
                                    <el-select
                                        v-model="formData.energyType"
                                        placeholder="请选择能源类型"
                                        style="width:220px;"
                                        @change="changeEnergyType"
                                    >
                                        <el-option
                                            v-for="item in eneType"
                                            :key="item.code"
                                            :label="item.label"
                                            :value="item.code"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-row>
                            <el-row>
                                <el-form-item label="比较分析时间：">
                                    <el-radio-group
                                        size="medium"
                                        class="date-radio"
                                        v-model="dateType"
                                        @change="changeDateType"
                                    >
                                        <el-radio-button label="year">年</el-radio-button>
                                        <el-radio-button label="month">月</el-radio-button>
                                        <el-radio-button label="day">日</el-radio-button>
                                    </el-radio-group>
                                </el-form-item>
                            </el-row>
                            <el-row style="padding-left:90px">
                                <el-button style="position: relative;left:70px" @click="cancel">清 空</el-button>
                                <el-button
                                    style="position: relative;left:85px"
                                    type="primary"
                                    @click="save('formData')"
                                >保 存
                                </el-button>
                            </el-row>
                        </div>
                    </el-col>

                    <el-col :span="12">
                        <div>
                            <el-radio-group
                                v-model="radio"
                                @change="changRadio"
                                style="padding-left:40px;padding-bottom: 5px;padding-top: 6px"
                            >
                                <el-radio label="workshop">车间</el-radio>
                                <!-- <el-radio label="process">工序</el-radio> -->
                            </el-radio-group>
                            <el-scrollbar wrap-class="scrollbar-wrapper workshop-wrapper" style="height:250px;">
                                <el-form-item prop="condition" class="workshopList">
                                    <el-checkbox-group
                                        v-model="conditionList"
                                        v-show="showConfig"
                                        @change="handleCheckedConditionsChange"
                                    >
                                        <el-checkbox
                                            id="selectWhat"
                                            v-for="item in radioList"
                                            :key="item.proccode"
                                            :label="item.proccode"
                                        >{{item.name}}
                                        </el-checkbox>
                                    </el-checkbox-group>
                                    <el-tree
                                        :data="data"
                                        :props="defaultProps"
                                        node-key="proccode"
                                        @check-change="handleCheckChange"
                                        :default-checked-keys="treeCheckbox"
                                        ref="tree"
                                        v-show="!showConfig"
                                        show-checkbox
                                        check-strictly
                                        default-expand-all
                                    ></el-tree>
                                </el-form-item>
                            </el-scrollbar>
                        </div>
                    </el-col>

                </el-row>
            </el-form>
            <el-table :data="tableData" stripe @selection-change="objSelection" style="width: 100%">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="报名名称" min-width="180px" align="center"></el-table-column>
                <el-table-column prop="procName" label="比较车间" min-width="180px" align="center"></el-table-column>
                <el-table-column
                    prop="dateType"
                    label="时间比较类型"
                    :formatter="formatDateType"
                    min-width="180px"
                    align="center"
                ></el-table-column>
                <el-table-column prop="codeName" label="能源类型" min-width="180px" align="center"></el-table-column>
                <el-table-column align="center" label="操作" min-width="180px">
                    <template v-slot="scope">
                        <el-button type="text" size="small" @click="tackLook(scope.row)">查看</el-button>
                        <el-button type="text" size="small" @click="upShare(scope.row)">更新</el-button>
                        <el-button type="text" size="small" @click="delShare(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="fl batch-btn-padding">
                <el-row>
                    <el-col :span="24">
                        <el-button :disabled="batchBtn" type="danger " @click="batchDelReportSetData">批量删除</el-button>
                    </el-col>
                </el-row>
            </div>
            <Pagination
                :total="total"
                :page.sync="page.pageNum"
                :limit.sync="page.pageSize"
                @pagination="getAllShare"
            />
        </div>
    </el-container>
</template>

<script>
    import {
        getAllEneType,
        getAllUseProcess,
        getAllUseWorkshop,
        addShare,
        updShare,
        getAllShare,
        delShare,
        batchDelReportSetData
    } from "@/api/energy";
    import Pagination from "@/components/Pagination";
    import commonApi from "@/utils/common";

    export default {
        name: "reportYoYConfig",
        data() {
            return {
                activeName: "first",
                radio: "workshop",
                formData: {
                    //提交给后台数据
                    id: "",
                    name: "",
                    energyType: "elect",
                    selType: "workshop",
                    day: new Date().getFullYear(),
                    dateType: "1",
                    condition: [],
                    isCompareType: 1
                },
                conditionList: [],
                radioList: [],
                eneType: [],
                energyCode: "",
                tableData: [],
                dateType: "year",
                page: {pageNum: 1, pageSize: 10},
                total: 0,
                options: [],
                flag: false,
                batchBtn: true,
                objIds: [],
                rules: {
                    condition: [
                        {
                            required: true,
                            type: "array",
                            message: "请至少选择两个选项",
                            trigger: "change",
                            min: 2
                        }],
                    energyType: [
                        {required: true, message: "请选择能源类型", trigger: "change"}],
                    name: [
                        {required: true, message: "请填写报表名称", trigger: "change"}
                    ]
                },
                showConfig: true,
                data: [],
                defaultProps: {
                    children: "children",
                    label: "name"
                },
                treeCheckbox: [],
                treeFirstLoad: false,
                selectType: "workshop"
            };
        },
        methods: {
            //车间工序 标签页选择
            changRadio(value) {
                this.selectType = value;
                if (value === "workshop") {
                    this.showConfig = true;
                    this.formData.condition = [];
                    this.conditionList = [];
                    this.formData.selType = "workshop";
                    this.getUseWorkshop(this.formData.energyType);
                } else if (value === "process") {
                    this.showConfig = false;
                    this.formData.condition = [];
                    this.conditionList = [];
                    this.formData.selType = "process";
                    this.getUseProcess(this.formData.energyType);
                }
                this.getAllShare();
            },
            //年月日选择
            changeDateType(val) {
                let date = new Date();
                if (val === "day") {
                    this.dateType = "day";
                    this.formData.dateType = 3;
                    this.day =
                        date.getFullYear() +
                        "-" +
                        (date.getMonth() + 1) +
                        "-" +
                        date.getDay();
                } else if (val === "month") {
                    this.dateType = "month";
                    this.day = date.getFullYear() + "-" + (date.getMonth() + 1);
                    this.formData.dateType = 2;
                } else if (val === "year") {
                    this.dateType = "year";
                    this.day = date.getFullYear();
                    this.formData.dateType = 1;
                }
            },
            //取消
            cancel() {
                this.clearFormData();
                this.conditionList = [];
                this.clearTreeCheckKeys();
                this.flag = false; //修改后为保存操作
            },
            //保存
            save(formdata) {
                this.validateCondition();
                this.$refs[formdata].validate(valid => {
                    if (valid) {
                        if (this.flag) {
                            updShare(this.formData)
                                .then(res => {
                                    if (res.data.success) {
                                        this.$message.success("操作成功");
                                        this.clearFormData();
                                        this.clearTreeCheckKeys();
                                        this.conditionList = [];
                                        this.getAllShare();
                                        this.flag = false; //修改后为保存操作
                                    } else this.$message.error(res.data.message);
                                })
                                .catch(e => {
                                    this.$message.error(e.message);
                                });
                        } else {
                            addShare(this.formData)
                                .then(res => {
                                    if (res.data.success) {
                                        this.$message.success("操作成功");
                                        this.clearFormData();
                                        this.clearTreeCheckKeys();
                                        this.conditionList = [];
                                        this.getAllShare();
                                        this.flag = false; //修改后为保存操作
                                    } else this.$message.error(res.data.message);
                                })
                                .catch(e => {
                                    this.$message.error(e.message);
                                });
                        }
                    } else {
                        return false;
                    }
                });
            },
            //加载表数据
            getAllShare() {
                const params = {
                    isCompareType: this.formData.isCompareType,
                    selType: this.formData.selType,
                    ...this.page
                };
                getAllShare(params)
                    .then(res => {
                        if (res.data.success) {
                            this.tableData = res.data.data.rows;
                            this.total = res.data.data.total;
                        }
                    })
                    .catch(e => {
                        this.$message.error(e.message);
                    });
            },
            //修改报表配置
            upShare(data) {
                this.flag = true; //修改还是保存
                this.treeFirstLoad = false;
                this.formData.id = data.id;
                this.formData.name = data.name;
                this.formData.energyType = data.energyType;
                this.formData.dateType = data.dateType;
                this.formData.day = "";
                this.formData.condition = [];
                this.conditionList = [];
                this.clearTreeCheckKeys();

                let proccodes = data.proccode.split(",");
                let procNames = data.procName.split(",");
                for (let i = 0; i < proccodes.length; i++) {
                    //默认勾选节点
                    this.treeCheckbox.push(proccodes[i]);
                    const radioList = {
                        name: procNames[i],
                        proccode: proccodes[i]
                    };
                    this.formData.condition.push(radioList);
                    this.conditionList.push(proccodes[i]);
                }
                this.formData.day = data.day;
                /* let day = data.day.split(",");
                          for (let i = 0; i < day.length; i++) {
                              this.formData.day.push(day[i])
                          }*/
                this.verifyDate();
                // this.treeFirstLoad = true;   //tree修改初次加载
            },
            //删除配置信息
            delShare(id) {
                this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        delShare(id).then(() => {
                            this.$message.success("删除成功!");
                            this.getAllShare();
                        });
                    })
                    .catch(() => {
                        this.$message.info("已取消删除！");
                    });
            },
            //检验用什么日期选择
            verifyDate() {
                if (this.formData.dateType === 3) {
                    this.dateType = "day";
                } else if (this.formData.dateType === 2) {
                    this.dateType = "month";
                } else if (this.formData.dateType === 1) {
                    this.dateType = "year";
                }
            },
            //多选删除
            batchDelReportSetData() {
                this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        batchDelReportSetData(this.objIds).then(res => {
                            if (res.data.success) {
                                this.$message.success("删除成功");
                                this.getAllShare();
                            } else {
                                this.$message.error("删除失败");
                            }
                        });
                    })
                    .catch(e => {
                        this.$message.info(e.message());
                    });
            },
            //多选id
            objSelection(objs) {
                this.objIds.length = 0;
                const _this = this;
                objs.forEach(element => {
                    _this.objIds.push(element.id);
                });
                this.batchBtn = this.objIds.length === 0;
            },
            //得到初始数据
            getData() {
                //得到所有车间
                this.getUseWorkshop();
                //得到所有能源类型
                getAllEneType()
                    .then(response => {
                        if (response.data.success) {
                            this.eneType = response.data.data;
                        } else this.$message.error(response.data.message);
                    })
                    .catch(e => {
                        this.$message.error(e.message);
                    });
                //表数据
                this.getAllShare();
            },
            //格式化时间
            formatDateType(row) {
                if (row.dateType === 1) {
                    return "年";
                } else if (row.dateType === 2) {
                    return "月";
                } else if (row.dateType === 3) {
                    return "日";
                }
            },
            //form选项符合规则
            validateCondition() {
                if (this.formData.condition.length < 2) {
                    this.$message("请至少选择两个选项");
                }
            },
            //点击多选框
            handleCheckedConditionsChange(value) {
                this.formData.condition = [];
                for (let i = 0; i < value.length; i++) {
                    for (let j = 0; j < this.radioList.length; j++) {
                        if (value[i] == this.radioList[j].proccode) {
                            this.formData.condition.push(this.radioList[j]);
                        }
                    }
                }
            },
            //点击树, 将tree重新渲染
            handleCheckChange(data, checked) {
                //有几个勾选就会运行几次,
                //点击修改会默认多一次调用这个方法，需要进行判断。
                if (this.treeFirstLoad) {
                    if (checked) {
                        //选中状态
                        const item = {
                            name: data.name,
                            proccode: data.proccode
                        };
                        let flag = false;
                        for (let i = 1; i < this.formData.condition.length; i++) {
                            if (
                                JSON.stringify(item) == JSON.stringify(this.formData.condition[i])
                            ) {
                                flag = true;
                            }
                        }
                        if (!flag) {
                            this.formData.condition.push(item);
                        }
                    } else {
                        //取消选中状态
                        for (let i = 0; i < this.formData.condition.length; i++) {
                            const item = {
                                name: data.name,
                                proccode: data.proccode
                            };
                            if (
                                JSON.stringify(item) == JSON.stringify(this.formData.condition[i])
                            ) {
                                this.formData.condition.splice(i, 1);
                            }
                        }
                    }
                }
                this.treeFirstLoad = true;
                // console.log(this.formData.condition);
            },
            //清空formData数据
            clearFormData() {
                this.$refs["formData"].resetFields();
                this.formData.condition = [];
                this.formData.id = "";
                this.formData.day = "";
                this.formData.dateType = "1";
                this.verifyDate();
            },
            //清空tree数据
            clearTreeCheckKeys() {
                this.$refs.tree.setCheckedKeys([]);
                this.treeCheckbox = [];
            },
            changeEnergyType(data) {
                if (this.selectType === "workshop") {
                    this.getUseWorkshop(data);
                } else if (this.selectType === "process") {
                    this.getUseProcess(data);
                }
            },
            //得到车间
            getUseWorkshop(energyType) {
                getAllUseWorkshop(energyType)
                    .then(res => {
                        if (res.data.success) {
                            this.radioList = res.data.data;
                        } else this.$message.error(res.data.message);
                    })
                    .catch(e => {
                        this.$message.error(e.message);
                    });
            },
            //得到工序
            getUseProcess(energyType) {
                getAllUseProcess(energyType)
                    .then(res => {
                        if (res.data.success) {
                            this.data = res.data.data;
                            this.data = commonApi.devTransformTozTreeFormat(this.data);
                        } else this.$message.error(res.data.message);
                    })
                    .catch(e => {
                        this.$message.error(e.message);
                    });
            },
            tackLook(row){
                this.$router.push({
                    path: "/ene/compared/template/1",
                    query: {
                        titleName: row.name,
                        proccode: row.proccode,
                        years: row.day,
                        procName: row.procName,
                        dateType: row.dateType,
                        energyType: row.energyType
                    }
                })
            }

        },
        mounted() {
            this.getData();
        },
        components: {
            Pagination
        }
    };
</script>

<style lang="scss" scoped>
    #selectWhat {
        display: block;
    }

    .date-radio {
        width: 200px;
    }

    .workshop-panel {
        padding: 15px 20px;

        .el-checkbox {
            display: block;
            margin-top: 10px;
        }
    }

    .year {
        position: relative;

        .el-select {
            position: absolute;
            top: 0px;
            left: 50px;
        }
    }

    .grid-content {
        float: right;
        padding-right: 40px;
    }

    .workshopList {
        position: relative;
        left: -120px;
    }
</style>
