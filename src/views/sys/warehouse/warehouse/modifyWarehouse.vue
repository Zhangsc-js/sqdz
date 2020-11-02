<template>
    <div>
        <el-form :model="queryForm" label-width="110px" ref="tableData" :rules="rule">
            <el-row>
                <el-col :span="10">
                    <el-form-item label="仓库号" prop="whCode">
                        <span>{{ queryForm.whCode }}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="仓库号描述" prop="whName">
                        <el-input v-model="queryForm.whName" autocomplete="off" style="width: 100%"
                        ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="国家" prop="country">
                        <el-input v-model="queryForm.country" autocomplete="off" style="width: 100%"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="城市" prop="city">
                        <el-input v-model="queryForm.city" autocomplete="off" style="width: 100%"
                        ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="详细地址" prop="address">
                        <el-input v-model="queryForm.whAddress" autocomplete="off" style="width: 100%"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="是否启用存储单元" prop="cellEnabled">

                        <el-select v-model="queryForm.cellEnabled" style="width: 100%">
                            <el-option v-for="item in enable" :key="item.code" :label="item.label"
                                       :value="item.code"></el-option>
                        </el-select>

                    </el-form-item>
                </el-col>


            </el-row>

        </el-form>
        <div class="location_list">
            <div>
                <el-button type="primary" @click="modifyLocation()" icon="el-icon-search">修改库存地点信息</el-button>
            </div>
            <!-- 库存地点列表 -->
            <el-form :model="locationForm" ref="locationForm">
                <el-table
                    highlight-current-row
                    :data="queryForm.locationList"
                    stripe
                    height="70vh"
                    ref="multipleTable"
                    align="center"
                >
                    <el-table-column prop="whCode" label="仓库号">
                        <span>{{ queryForm.whCode }}</span>
                    </el-table-column>
                    <el-table-column prop="ftyCode" label="工厂编码">
                        <template v-slot="scope">
                            <span>{{ scope.row.ftyCode }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="locationCode" label="库存地点编码">
                        <template v-slot="scope">
                            <span>{{ scope.row.locationCode }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" fixed="right" width="120">
                        <template v-slot="scope">
                            <el-button type="text" @click="rowDel(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>

        </div>

        <div slot="footer" class="dialog-footer" align="left">
            <el-button icon="el-icon-close" @click="cancel()">取消</el-button>
            <el-button icon="el-icon-check" type="primary" @click="save()">保存</el-button>
        </div>
        <el-dialog title="选择库存地点信息" :visible.sync="localtionDialogVisible" width="55%" append-to-body>
            <ModifyLocation :count="count" @confirm="addLocation" @cancel="" :whCode="whCode"/>
        </el-dialog>
    </div>

</template>


<script>
    import ModifyLocation from "./modifyLocation"
    import {
        getWarehouseDetail,
        updateWarehouse
    } from "@/api/sys/wms/warehouse";

    export default {
        name: "modifyWarehouse",
        components: {
            ModifyLocation
        },
        data() {
            return {
                tableData: {},
                locationForm: {},
                queryForm: {
                    "whCode": "",
                    "whName": "",
                    "whAddress": "",
                    "country": "",
                    "city": "",
                    "cellEnabled": "",
                    "locationList": [],
                    "createOn": "",
                    "createBy": "",
                    "updateOn": "",
                    "updateBy": "",
                    "deleteStatus": ""
                },
                rule: {},
                localtionDialogVisible: false,
                enable: [{
                    code: 0,
                    label: "未启用"
                }, {
                    code: 1,
                    label: "启用"
                }],
                count: 0
            }
        },
        props: {
            whCode: {
                type: String,
                required: true
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                const param = {
                    whCode: this.whCode
                };
                getWarehouseDetail(param).then(res => {
                    this.queryForm = res.data.data;
                })
            },
            modifyLocation() {
                this.localtionDialogVisible = true;
                this.count++
            },
            addLocation(data) {
                this.queryForm.locationList = this.queryForm.locationList.concat(data);
                this.localtionDialogVisible = false;

            },
            rowDel(row) {
                console.log
                this.queryForm.locationList = this.queryForm.locationList.filter(i => {
                    return !(i.ftyCode == row.ftyCode && i.locationCode == row.locationCode)
                })

            },
            save() {
                const param = {
                    sysWmsWarehouse: this.queryForm,
                    locationList: this.queryForm.locationList
                }
                updateWarehouse(param).then(response => {
                    const result = response.data;
                    if (result.success) {
                        this.$message.success("修改成功")
                    } else {
                        this.$message.error(response.data.message + ":" + response.data.data)
                    }
                }).catch(e => {
                    this.$message({
                        type: 'error',
                        message: e.message
                    })
                }).finally(() => {
                    this.$refs['tableData'].resetFields();
                    this.$emit("save")
                })
            }
        },
        cancel() {
            this.$emit("cancel")
        },
        watch: {
            whCode() {
                this.init()
            }
        }
    }
</script>

<style lang="css" scoped>

    .el-select {
        width: 265.1px;
    }
</style>
