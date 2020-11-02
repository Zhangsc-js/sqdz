<template>
    <div>
        <el-form
            ref="queryForm"
            :model="queryForm"
            :inline="true"
            label-width="100px"
            class="margin20 mb0"
        >
        
            <el-form-item label="计划单号" prop="planCode">
                <el-input
                    plain="true"
                    v-model="queryForm.planCode"
                    placeholder="请输入计划单号"
                />
            </el-form-item>
            <el-form-item label="任务单号" prop="scheduleCode">
                <el-input
                    plain="true"
                    v-model="queryForm.scheduleCode"
                    placeholder="请输入任务单号"
                />
            </el-form-item>
            <el-form-item label="化验物料" prop="labProname">
                <el-input
                    :maxlength="12"
                    v-model="queryForm.labProname"
                    plain="true"
                    placeholder="请输入化验物料"
                />
            </el-form-item>
            <el-form-item label="车间" prop="workShop">
                <el-input
                    :maxlength="12"
                    v-model="queryForm.workShop"
                    plain="true"
                    placeholder="请输入车间"
                />
            </el-form-item>
            <el-form-item label="取样地点" prop="sampPlace">
                <el-input
                    :maxlength="12"
                    v-model="queryForm.sampPlace"
                    plain="true"
                    placeholder="请输入取样地点"
                />
            </el-form-item>
            <el-form-item label="收样地点" prop="receivePlace">
                <el-input
                    :maxlength="12"
                    v-model="queryForm.receivePlace"
                    plain="true"
                    placeholder="请输入收样地点"
                />
            </el-form-item>
            <el-form-item label="任务类型" prop="planType">
                <el-select
                    v-model="queryForm.planType"
                    maxlength="20"
                    @change="getData(1)"
                    placeholder="请选择任务类型"
                >
                    <el-option label="来料" value="0"></el-option>
                    <el-option label="定点" value="1"></el-option>
                    <el-option label="临时" value="2"></el-option>
                    <el-option label="复验" value="3"></el-option>
                </el-select>
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
                    prop="planCode"
                    label="计划单号"
                    width="180"
                ></el-table-column>
                <el-table-column
                    prop="scheduleCode"
                    label="任务单号"
                    width="180"
                ></el-table-column>
                <el-table-column
                    prop="planType"
                    :formatter="typeFormat"
                    label="任务类型"
                ></el-table-column>
                <el-table-column
                    prop="labProname"
                    show-overflow-tooltip
                    label="化验物料"
                ></el-table-column>
                <el-table-column
                    prop="labIndicName"
                    show-overflow-tooltip
                    label="化验指标"
                ></el-table-column>
                <el-table-column prop="workShop" label="车间"></el-table-column>
                <el-table-column
                    prop="receivePlace"
                    label="收样地点"
                ></el-table-column>

                <el-table-column
                    prop="sampPlace"
                    label="取样地点"
                ></el-table-column>

                <!-- <el-table-column label="是否复样">
          <template v-slot="scope">
            <el-tooltip placement="right" v-if="!scope.row.planType == 3">
              <div slot="content">
                申请人：<br />
                申请时间： <br />
                审核人： <br />
                审核时间：
              </div>
              <el-buttom type="text">否</el-buttom>
            </el-tooltip>
            <span v-else>是</span>
          </template>
        </el-table-column>-->
                <!-- <el-table-column prop label="发布人"></el-table-column> -->
                <!-- <el-table-column
          prop
          label="发布时间"
          min-width="120"
        ></el-table-column>
        <el-table-column prop label="备注"></el-table-column>-->
                <el-table-column
                    prop="createTime"
                    label="时间"
                    width="180"
                    align="center"
                ></el-table-column>
                <el-table-column label="是否到样" align="center">
                    <template v-slot="scope">
                        <el-tooltip placement="right" v-if="scope.row.ifSend">
                            <div slot="content">
                                取样小组：{{ scope.row.sampGroup }}
                                <br />
                                取样人员：{{ scope.row.sendPer }}
                                <br />
                            </div>
                            <el-button class="color-green" type="text"
                                >是</el-button
                            >
                        </el-tooltip>
                        <span class="color-red" v-else>否</span>
                    </template>
                </el-table-column>
                <el-table-column label="是否留存" align="center">
                    <template v-slot="scope">{{
                        scope.row.ifRestain == 1 ? "是" : "否"
                    }}</template>
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    align="center"
                    v-if="hasBtn(['LIMS-LAB-RECEIVE'])"
                >
                    <template slot-scope="scope">
                        <el-button
                            @click="receive(scope.row)"
                            type="text"
                            size="small"
                            v-has="'LIMS-LAB-RECEIVE'"
                            >接收</el-button
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
        </div>
    </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { getPrelab, labReceive } from "@/api/lims";
import { hasBtn } from "@/utils/index";
export default {
    name: "prelab",
    components: {
        Pagination
    },
    data() {
        return {
            page: {
                pageNum: 1,
                pageSize: 10
            },
            total: 0,
            loading: false,
            tableData: [],
            queryForm: {
                labProname: "",
                planType: "",
                workShop: "",
                receivePlace: "",
                sampPlace: "",
                planCode: "",
                scheduleCode: ""
            }
        };
    },
    activated() {
        this.getData();
    },
    methods: {
        hasBtn,
        getData(page) {
            if (page === 1) this.page.pageNum = 1;
            const params = {
                ...this.page,
                ...this.queryForm
            };
            getPrelab(params)
                .then(res => {
                    this.tableData = res.data.data.rows;
                    this.total = res.data.data.total;
                })
                .catch(e => {
                    this.$message.error(e.message);
                });
        },
        clearSearchBox() {
            this.$refs.queryForm.resetFields();
            this.getData(1);
        },
        receive(item) {
            if (!item.ifSend) {
                this.$message.warning("未到样，无法接收");
                return false;
            }
            this.$confirm("确认接收本条化验信息?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    labReceive({
                        id: item.scheduleId,
                        receiveUserName: this.$store.state.user.userName
                    })
                        .then(res => {
                            if (res.data.code !== 10000) {
                                this.$message.error(res.data.message);
                            } else {
                                this.$message(res.data.message);
                                this.getData();
                            }
                        })
                        .catch(e => {
                            this.$message.error(e.message);
                        });
                })
                .catch(res => {
                    this.$message.info("已取消");
                });
        },
        typeFormat(row, column, cellValue, index) {
            let typeList = ["来料", "定点", "临时", "复验"];
            return typeList[cellValue];
        }
    }
};
</script>

<style scoped>
.color-red {
    color: #f56c6c;
}
.color-green {
    color: #67c23a;
}
</style>
