<template>
    <div>
        <el-form
            ref="queryForm"
            :model="queryForm"
            :inline="true"
            label-width="100px"
            class="margin20 mb0"
        >
            <el-form-item label="接收时间" prop>
                <el-date-picker
                    v-model="createTimeRange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    @change="
                        val => {
                            changeDate(val, 'createTime');
                        }
                    "
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="化验指标" prop="labIndicName">
                <el-input
                    v-model="queryForm.labIndicName"
                    plain="true"
                    placeholder="请输入化验指标"
                />
            </el-form-item>
            <el-form-item label="车间" prop="workShop">
                <el-input
                    v-model="queryForm.workShop"
                    plain="true"
                    placeholder="请输入车间"
                />
            </el-form-item>
            <el-form-item label="取样地点" prop="sampPlace">
                <el-input
                    v-model="queryForm.sampPlace"
                    plain="true"
                    placeholder="请输入取样地点"
                />
            </el-form-item>
            <el-form-item label="收样地点" prop="receivePlace">
                <el-input
                    v-model="queryForm.receivePlace"
                    plain="true"
                    placeholder="请输入收样地点"
                />
            </el-form-item>
            <el-form-item>
                <el-button
                    icon="el-icon-search"
                    href="javascript:void(0)"
                    type="primary"
                    class="btn-b"
                    @click="getData(1)"
                    >查询</el-button
                >
                <el-button
                    href="javascript:void(0)"
                    class="btn-w"
                    @click="clearSearchBox"
                    >清空</el-button
                >
            </el-form-item>
        </el-form>
        <div
            class="tableshadow margin20"
            style="width:calc(100% - 40px);padding:20px 0;"
        >
            <el-table :data="tableData">
                <el-table-column
                    prop="labMain.scheduleCode"
                    label="任务单号"
                    width="180"
                ></el-table-column>
                <el-table-column prop="labIndicCode" label="指标编码"></el-table-column>
                <el-table-column prop="labIndicName" label="化验指标">
                    <template v-slot="scope">
                        {{ scope.row.labIndicName }}
                        <span
                            v-if="scope.row.isReexamination == 1"
                            class="reinspect-stamp"
                            >复</span
                        >
                    </template>
                </el-table-column>
                <el-table-column
                    prop="labMain.proName"
                    label="化验物料"
                ></el-table-column>
                <el-table-column
                    prop="labMain.workShop"
                    label="车间"
                ></el-table-column>
                <el-table-column
                    prop="labMain.sampPlace"
                    label="取样地点"
                ></el-table-column>
                <el-table-column
                    prop="labMain.receivePlace"
                    label="收样地点"
                ></el-table-column>
                <!-- <el-table-column prop="labGroup" label="化验小组"></el-table-column> -->
                <!--<el-table-column label="是否暂存" align="center">
          <template v-slot="scope">{{scope.row.isTemporary?"是":"否"}}</template>
        </el-table-column>-->
                <el-table-column
                    prop="createTime"
                    label="接收时间"
                    width="180"
                    align="center"
                ></el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    width="100"
                    fixed="right"
                    v-if="hasBtn(['LIMS-LAB-INPUT'])"
                >
                    <template v-slot="scope">
                        <el-button
                            type="text"
                            size="small"
                            @click="preInput(scope.row)"
                            v-has="'LIMS-LAB-INPUT'"
                            >录入</el-button
                        >
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
            <el-dialog
                title="录入"
                :visible.sync="dialogVisible"
                width="800px"
                top="5vh"
                v-if="dialogVisible"
            >
                <input-cont @hidenDialog="hidenDialog" :selItem="selItem" />
            </el-dialog>
        </div>
    </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import InputCont from "../input";
import { getLabOff } from "@/api/lims";
import { hasBtn } from "@/utils/index";
import { simpleDateFormat, getDate } from "@/utils/index";
export default {
    name: "laboff",
    components: {
        Pagination,
        InputCont
    },
    data() {
        return {
            page: {
                pageNum: 1,
                pageSize: 10
            },
            total: 0,
            tableData: [],
            dialogVisible: false,
            selItem: {},
            queryForm: {
                workShop: "",
                sampPlace: "",
                receivePlace: "",
                // inputCode: "",
                createTimeStart: "",
                createTimeEnd: "",
                labIndicName:""
            },
            createTimeRange: []
        };
    },
    activated() {
        this.getData();
    },
    methods: {
        hasBtn,
        getData(page) {
            if (page === 1) this.page.pageNum = 1;
            getLabOff({ ...this.page, ...this.queryForm })
                .then(res => {
                    this.tableData = res.data.data.rows;
                    this.total = res.data.data.total;
                })
                .catch(e => {
                    this.$message.error(e.message);
                });
        },
        hidenDialog() {
            this.dialogVisible = false;
            this.getData();
        },
        preInput(item) {
            this.selItem = item;
            this.dialogVisible = true;
        },
        changeDate(val, type) {
            if(!!val){
            this.queryForm[type + "Start"] = val[0] + " 00:00:00";
            this.queryForm[type + "End"] = val[1] + " 23:59:59";
            }else{
                this.queryForm[type + "Start"] = "";
            this.queryForm[type + "End"] = "";
            }
        },
        clearSearchBox() {
            this.queryForm = {
                workShop: "",
                sampPlace: "",
                receivePlace: "",
                // inputCode: "",
                createTimeStart: "",
                createTimeEnd: "",
                labIndicName:""
            },
                this.createTimeRange = [];
            this.getData(1);
        }
    }
};
</script>

<style scoped></style>
