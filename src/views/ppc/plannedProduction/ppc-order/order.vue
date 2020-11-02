<template>
    <div style="height: calc(100% - 25px)">
        <el-divider content-position="left">总订单</el-divider>
        <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
            <el-form-item label="订单号" prop="soNo">
                <el-input v-model="queryForm.soNo" placeholder="请输入订单号" clearable></el-input>
            </el-form-item>
            <!-- 折叠板中的内容 -->
            <span v-show="showMore">
        <el-form-item label="下单日期" prop="startData">
          <el-date-picker
              type="date"
              v-model="queryForm.startData"
              value-format="yyyy-MM-dd"
              :disabled="disabled"
              clearable
          />
        <span style="margin-left:5px">~</span>
        </el-form-item>
        <el-form-item prop="endData">
          <el-date-picker
              type="date"
              v-model="queryForm.endData"
              value-format="yyyy-MM-dd"
              :disabled="disabled"
              clearable
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="queryForm.status" clearable filterable placeholder="请选择">
            <el-option
                v-for="item in SALE_STATUS"
                :key="item.code"
                :label="item.label"
                :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务员" prop="salesPersonName">
          <el-input v-model="queryForm.salesPersonName" placeholder="请输入业务员" clearable></el-input>
        </el-form-item>
      </span>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="getData(1)">查询</el-button>
                <el-button type="primary" icon="el-icon-refresh-left" @click="resetForm('queryForm')">重置</el-button>
                <el-button type="text" @click="showMore=!showMore">
                    {{ showMore ? '收起' : '展开' }}
                    <i
                        :class="showMore ?'el-icon-arrow-up':'el-icon-arrow-down'"
                    />
                </el-button>
            </el-form-item>
        </el-form>
        <el-table
            highlight-current-row
            :data="mainTable"
            @selection-change="objSelection"
            @row-click="saledetail"
            style="width: 100%;"
            height="30%"
            border
        >
            <el-table-column type="selection" width="60" center></el-table-column>
            <el-table-column prop="soNo" label="订单号"></el-table-column>
            <el-table-column prop="receiveDate" label="下单日期" width="120px"></el-table-column>
            <el-table-column prop="departName" label="销售部门"></el-table-column>
            <el-table-column prop="salesPersonName" label="业务员" width="100px"></el-table-column>
            <el-table-column prop="deliveryDate" label="交货日期" width="120px"></el-table-column>
            <el-table-column prop="customerCode" label="采购商名称"></el-table-column>
            <el-table-column prop="customerLinkPerson" label="采购商收货人" width="80px"></el-table-column>
            <el-table-column prop="customerLinkPhone" label="采购商联系方式"></el-table-column>
            <el-table-column prop="status" label="状态" width="100px">
                <template v-slot="scope">
          <span v-if="scope.row.status == 10">
            <jt-badge status="warning" :textValue="scope.row.statusName"/>
          </span>
                    <span v-else-if="scope.row.status == 50">
            <jt-badge status="success" :textValue="scope.row.statusName"/>
          </span>
                    <span v-else>
            <jt-badge status="processing" :textValue="scope.row.statusName"/>
          </span>
                </template>
            </el-table-column>
            <div>
                <el-table-column
                    fixed="right"
                    align="center"
                    label="操作"
                    width="100px"
                    v-if="hasBtn('PPC-ORDER-UPT')"
                >
                    <template v-slot="scope">
                        <el-button
                            type="text"
                            size="small"
                            v-if="scope.row.status<50"
                            @click="updateSale(scope.row.id)"
                        >更新
                        </el-button>
                    </template>
                </el-table-column>
            </div>
        </el-table>
        <Pagination
            :total="total"
            :page.sync="page.current"
            :limit.sync="page.size"
            :pageSizes="pageSizes"
            @pagination="getData"
        />
        <el-button type="primary" v-has="'PPC-ORDER-ADD'" icon="el-icon-plus" @click="addSale">新增</el-button>
        <el-button
            type="danger "
            icon="el-icon-delete"
            @click="batchDelSale"
            v-has="'PPC-ORDER-BATDLT'"
        >批量删除
        </el-button>
        <el-divider content-position="left">订单明细</el-divider>
        <el-table
            highlight-current-row
            :data="detailData"
            @selection-change="DetailSelection"
            border
            style="width: 100%;"
            height='calc(35% - 32px)'
            align="center"
        >
            <el-table-column fixed type="selection" width="55" center></el-table-column>
            <el-table-column prop="sdNo" label="子订单号" width="160"></el-table-column>
            <el-table-column prop="materialCode" label="物料代码"></el-table-column>
            <el-table-column prop="processName" label="物料名称"></el-table-column>
            <el-table-column prop="specification" label="规格" width="120"></el-table-column>
            <el-table-column prop="qty" label="计划数量" width="80"></el-table-column>
            <el-table-column prop="sendedQty" label="已发货数量" width="100"></el-table-column>
            <el-table-column prop="unit" label="单位" width="60"></el-table-column>
            <el-table-column prop="produceStandard" label="生产标准" width="140"></el-table-column>
            <el-table-column prop="bomVer" label="bom版本" width="120"></el-table-column>
            <el-table-column prop="status" label="状态" width="110">
                <template v-slot="scope">
          <span v-if="scope.row.status == 10">
            <jt-badge status="warning" :textValue="scope.row.statusName"/>
          </span>
                    <span v-else-if="scope.row.status == 40 || scope.row.status == 50">
            <jt-badge status="success" :textValue="scope.row.statusName"/>
          </span>
                    <span v-else>
            <jt-badge status="processing" :textValue="scope.row.statusName"/>
          </span>
                </template>
            </el-table-column>
            <el-table-column prop="remarks" label="备注" width="120"></el-table-column>
            <el-table-column
                fixed="right"
                align="center"
                label="操作"
                width="260px"
                v-if="hasBtn(['PPC-ODINFO-UPT','PPC-ODINFO-ADPLAN','PPC-ODINFO-QUPLAN','PPC-ODINFO-SEND','PPC-ODINFO-FINISH'])"
            >
                <template v-slot="scope">
                    <el-button
                        type="text"
                        size="small"
                        v-if="scope.row.status<40"
                        @click="updateDetail(scope.row)"
                        v-has="'PPC-ODINFO-UPT'"
                    >更新
                    </el-button>
                    <el-button
                        type="text"
                        size="small"
                        v-if="scope.row.mpsStatus!=1 && scope.row.status<40"
                        @click="planPage(scope.row)"
                        v-has="'PPC-ODINFO-ADPLAN'"
                    >生成计划
                    </el-button>
                    <el-button
                        type="text"
                        size="small"
                        v-if="scope.row.mpsStatus==1"
                        @click="planPage(scope.row)"
                        v-has="'PPC-ODINFO-QUPLAN'"
                    >查看计划
                    </el-button>
                    <el-button
                        type="text"
                        size="small"
                        v-if="scope.row.status<40"
                        @click="sendDetail(scope.row)"
                        v-has="'PPC-ODINFO-SEND'"
                    >发货完成
                    </el-button>
                    <el-button
                        type="text"
                        size="small"
                        v-if="scope.row.status<40"
                        @click="completeDetail(scope.row.id)"
                        v-has="'PPC-ODINFO-FINISH'"
                    >订单结束
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <Pagination
            :total="btotal"
            :page.sync="bpage.current"
            :limit.sync="bpage.size"
            :pageSizes="bpageSizes"
            @pagination="saledetail"
        />
        <el-button
            type="primary"
            v-has="'PPC-ODINFO-ADD'"
            icon="el-icon-plus"
            @click="detaddSale"
            :disabled="id==''"
        >新增
        </el-button>
        <el-button
            v-has="'PPC-ODINFO-BATDLT'"
            type="danger "
            icon="el-icon-delete"
            @click="batchDelDetail"
        >批量删除
        </el-button>

        <el-dialog :title="title" :visible.sync="addDialogVisible" width="55%">
            <AddSale
                @save="hidenDialog"
                @cancel="hidenDialogCancel"
                :trigger="addDialogVisible"
                :type="type"
                :sId="id"
            />
        </el-dialog>

        <el-dialog :title="detailTitle" :visible.sync="detaddDialogVisible" width="55%">
            <addSaleDetail
                @save="dethidenDialog"
                @cancel="hidenDialogCancel"
                :trigger="detaddDialogVisible"
                :type="type"
                :sId="id"
                :dId="dId"
            />
        </el-dialog>
    </div>
</template>


<script>
    import {resetQueryForm} from "@/utils/common";
    import {hasBtn} from "@/utils/index";
    import Pagination from "@/components/Pagination";
    import AddSale from "./addSale";
    import addSaleDetail from "./addSaleDetail";
    import updateSale from "./updateSale";
    import {
        getSaleAll,
        statusToSelect,
        getSaleDetail,
        delectSaleBatch,
        delectDetailBatch,
        addProductPlan,
        setSaleDetailStatus
    } from "@/api/productionPlanning";
    import JtBadge from "@/components/JtBadge";

    export default {
        name: "saleInfo",
        components: {
            // Addmaterial,
            Pagination,
            AddSale,
            addSaleDetail,
            JtBadge
        },
        data() {
            return {
                page: {
                    current: 1,
                    size: 10
                },
                bpage: {
                    current: 1,
                    size: 10
                },
                SALE_STATUS: [],
                SALE_DETAIL_STATUS: [],
                showMore: false,
                pageSizes: [10, 50, 100],
                bpageSizes: [10, 50, 100],
                total: 0,
                btotal: 0,
                queryForm: {
                    soNo: "",
                    startData: "",
                    endData: "",
                    status: "",
                    salesPersonName: ""
                },
                routeForm: {
                    routeCode: "",
                    routeName: ""
                },
                mainTable: [],
                detailData: [],
                bomCode: "",
                disabled: false,
                row: [], //销售单头行
                type: "", //1新增，2更新
                id: "", //订单ID
                dId: "", //子订单ID
                Mids: [],
                Dids: [],
                batchBtn: true,
                addDialogVisible: false,
                detaddDialogVisible: false,
                uptDialogVisible: false,
                uptInfoDialogVisible: false,
                title: "",
                detailTitle: ""
            };
        },
        methods: {
            hasBtn,
            planPage(row) {
                if (row.mpsStatus == 1) {
                    this.$router.push({
                        name: "productPlan-planOrder",
                        params: {detailNo: row.sdNo}
                    });
                } else {
                    addProductPlan(row.id).then(response => {
                        if (response.data.success) {
                            this.$message.success("生成成功!");
                            this.saledetail(this.row); //销售单头行
                        } else
                            this.$message.error(
                                response.data.message + ":" + response.data.data
                            );
                    });
                }
            },
            updateDetail(row) {
                this.dId = row.id;
                this.detaddDialogVisible = true;
                this.type = "2";
                this.detailTitle = "修改订单明细";
                // this.uptInfoDialogVisible = true;
            },
            sendDetail(row) {
                if (row.status != '30') {
                    this.$message.error("订单未完工,无法修改成发货状态！！")
                    return
                }
                this.$confirm("此操作将该订单完成发货, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    let param = {
                        id: row.id,
                        status: "40"
                    };
                    setSaleDetailStatus(param).then(response => {
                        if (response.data.success) {
                            this.$message.success("操作成功!");
                            this.getData();
                            this.saledetail();
                        } else {
                            this.$message.error(response.data.message + ":" + response.data.data);
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消"
                    });
                });
            },
            completeDetail(id) {
                this.$confirm("此操作将该订单结束, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    let param = {
                        id: id,
                        status: "50"
                    };
                    setSaleDetailStatus(param).then(response => {
                        if (response.data.success) {
                            this.$message.success("操作成功!");
                            this.getData();
                            this.saledetail();
                        } else {
                            this.$message.error(response.data.message + ":" + response.data.data);
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消"
                    });
                });
            },
            updateSale(id) {
                this.id = id;
                this.addDialogVisible = true;
                this.type = "2";
                this.title = "修改订单";
            },
            addSale() {
                this.addDialogVisible = true;
                this.type = "1";
                this.title = "新增订单";
            },
            detaddSale() {
                this.type = "1";
                this.detaddDialogVisible = true;
                this.detailTitle = "新增订单明细";
            },
            dethidenDialog() {
                this.detaddDialogVisible = false;
                this.uptInfoDialogVisible = false;
                const params = {
                    id: this.id,
                    ...this.bpage
                };
                getSaleDetail(params).then(response => {
                    let data = response.data;
                    for (let i = 0; i < data.rows.length; i++) {
                        for (let j = 0; j < this.SALE_DETAIL_STATUS.length; j++) {
                            if (data.rows[i].status == this.SALE_DETAIL_STATUS[j].code) {
                                data.rows[i].statusName = this.SALE_DETAIL_STATUS[j].label;
                            }
                        }
                    }
                    this.detailData = data.rows;
                    this.btotal = data.total;
                });
            },
            hidenDialog() {
                this.uptDialogVisible = false;
                this.addDialogVisible = false;
                this.getData();
            },
            hidenDialogCancel() {
                this.addDialogVisible = false;
                this.uptDialogVisible = false;
                this.uptInfoDialogVisible = false;
                this.detaddDialogVisible = false;
            },
            batchDelSale() {
                this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        delectSaleBatch(this.Mids).then(response => {
                            if (response.data.success) {
                                this.getData(1);
                                this.$message.success("删除成功!");
                                this.detailData = [];
                            } else
                                this.$message.error(
                                    response.data.message + ":" + response.data.data
                                );
                        });
                    })
                    .catch(() => {
                        this.$message({
                            type: "info",
                            message: "已取消删除"
                        });
                    });
            },
            batchDelDetail() {
                this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        delectDetailBatch(this.Dids).then(response => {
                            if (response.data.success) {
                                const params = {
                                    id: this.id,
                                    ...this.bpage
                                };
                                getSaleDetail(params).then(response => {
                                    let data = response.data;
                                    this.detailData = data.rows;
                                    this.btotal = data.total;
                                });
                                this.$message.success("删除成功!");
                            } else
                                this.$message.error(
                                    response.data.message + ":" + response.data.data
                                );
                        });
                    })
                    .catch(() => {
                        this.$message({
                            type: "info",
                            message: "已取消删除"
                        });
                    });
            },
            objSelection(objs) {
                this.Mids.length = 0;
                const _this = this;
                objs.forEach(element => {
                    _this.Mids.push(element.id);
                });
                this.batchBtn = this.Mids.length === 0;
            },
            DetailSelection(objs) {
                this.Dids.length = 0;
                const _this = this;
                objs.forEach(element => {
                    _this.Dids.push(element.id);
                });
                this.batchBtn = this.Dids.length === 0;
            },
            saledetail(row) {
                if (row && row.id != undefined) {
                    this.id = row.id;
                    this.row = row;
                }
                const params = {
                    id: this.id,
                    ...this.bpage
                };
                getSaleDetail(params).then(response => {
                    let data = response.data;
                    for (let i = 0; i < data.rows.length; i++) {
                        for (let j = 0; j < this.SALE_DETAIL_STATUS.length; j++) {
                            if (data.rows[i].status == this.SALE_DETAIL_STATUS[j].code) {
                                data.rows[i].statusName = this.SALE_DETAIL_STATUS[j].label;
                            }
                        }
                    }
                    this.detailData = data.rows;
                    // this.btotal = data.total;
                });
            },

            getData(current) {
                if (current === 1) {
                    this.page.current = current;
                }
                const params = {
                    ...this.page,
                    ...this.queryForm
                };
                getSaleAll(params)
                    .then(response => {
                        let data = response.data;
                        for (let i = 0; i < data.rows.length; i++) {
                            for (let j = 0; j < this.SALE_STATUS.length; j++) {
                                if (data.rows[i].status == this.SALE_STATUS[j].code) {
                                    data.rows[i].statusName = this.SALE_STATUS[j].label;
                                }
                            }
                        }
                        this.mainTable = data.rows;
                        this.total = data.total;
                    })
                    .catch(e => {
                        this.$message({
                            type: "error",
                            message: e.message,
                            duration: 3 * 1000
                        });
                    });
            },
            initData() {
                statusToSelect()
                    .then(response => {
                        const result = response.data;
                        if (result.success) {
                            this.SALE_STATUS = result.data.SALE_STATUS;
                            this.SALE_DETAIL_STATUS = result.data.SALE_DETAIL_STATUS;
                            this.getData();
                        }
                    })
                    .catch(e => {
                        this.$message.error(e.message);
                    });
            },
            resetForm() {
                resetQueryForm(this);
            }
        },
        mounted() {
            this.initData();
        }
    };
</script>

<style lang="css" scoped>
    body {
    }

    .el-divider--horizontal {
        margin: 24px 0px 0 0;
    }

    .cell {
        text-align: center;
    }

    table .el-button {
        margin-left: 5px;
        padding-left: 0px;
    }
</style>
