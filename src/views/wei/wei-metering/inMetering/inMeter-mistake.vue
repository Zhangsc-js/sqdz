<template>
    <div class=" margin20 mr15">
            <el-form :inline="true" class="demo-form-inline" ref="inMeterMisForm" >
                    <el-form-item label="货物名称" prop="goodsName">
                        <el-input
                                id="goodsName"
                                v-model="inMeterMisForm.goodsName"
                                :maxlength="20"
                                plain="true"
                                placeholder="请输入货物名称"
                                style="width: 200px"
                        />
                    </el-form-item>
                    <el-form-item label="车号" prop="truckNo">
                        <el-select v-model="inMeterMisForm.truckNo" filterable placeholder="请选择" id="truckNo">
                            <el-option
                                    v-for="item in carsList"
                                    :key="item.value"
                                    :label="item.truckNo"
                                    :value="item.truckNo">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="供应商" prop="supplier">
                        <el-input
                                id="supplier"
                                v-model="inMeterMisForm.supplier"
                                :maxlength="20"
                                plain="true"
                                placeholder="供应商名称"
                                style="width: 200px"
                        />
                    </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="submitSearch(1)">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button href="javascript:void(0)" class="btn-w"  @click="clearSearchBox()">清空</el-button>
                </el-form-item>
            </el-form>
                <el-table :data="inMetersData" style="width: 100%">
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column prop="weighingNo" align="center" label="检斤序号" width="180"></el-table-column>
                    <el-table-column prop="truckNo" align="center" label="车号" ></el-table-column>
                    <el-table-column prop="supplier" align="center" label="供应商" width="180"></el-table-column>
                    <el-table-column prop="goodsName" align="center" label="货物名称" ></el-table-column>
                    <el-table-column prop="gross" align="center" label="毛重(KG)" ></el-table-column>
                    <el-table-column prop="tare" align="center" label="皮重(KG)" ></el-table-column>
                    <el-table-column prop="net" align="center" label="净重(KG)" ></el-table-column>
                    <el-table-column prop="createdBy" align="center" label="司磅员" ></el-table-column>
                    <el-table-column prop="createdOn" align="center" label="称重时间" width="180"></el-table-column>
                    <el-table-column fixed="right" align="center" label="操作" width="130">
                        <template v-slot="scope">
                            <el-button type="text" size="small" @click="updateInMeter(scope.row.id)">更新</el-button>
                            <el-button type="text" size="small" @click="delInMeter(scope.row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div style="height: 60px;">
                    <pagination :total="total" :page.sync="page.pageNum" :limit.sync="page.pageSize"
                                @pagination="getData"/>
                </div>
            <el-dialog :title="title" :visible.sync="dialogVisible" width="65%">
                <InMeterMisUd @hidenDialog="hidenDialog"/>
            </el-dialog>
    </div>
</template>

<script>
    import {createNamespacedHelpers} from 'vuex'
    import Pagination from '@/components/Pagination/index'
    import InMeterMisUd from './inMeter-mistake-ud'

    const {mapState, mapActions, mapMutations} = createNamespacedHelpers('inMeter')
    export default {
        name: "InMeterMistake",
        components: {Pagination, InMeterMisUd},
        data() {
            return {
                dialogVisible: false,
                page: {
                    pageNum: 1,
                    pageSize: 10
                },
                inMeterMisForm: {
                    goodsName: '',
                    truckNo: '',
                    supplier: ''
                },
                title: ''
            };
        },
        computed: {
            ...mapState(['inMetersData', 'total']),
            carsList() {
                return this.$store.state.weiCars.weiCarData
            }
        },
        mounted() {
            this.getData()
            this.selectCars()
        },
        methods: {
            ...mapActions(['getAllInMeters', 'delInMeterById']),
            ...mapMutations(['SET_SELECTED_ROW_ID', 'SET_DISABLED']),
            selectCars() {
                this.$store.dispatch('weiCars/getAllWeiCars')
            },
            getData(pageNum) {
              if(pageNum ===1){
                this.page.pageNum = pageNum;
              }
                this.getAllInMeters({
                    ...this.page,
                    ...this.inMeterMisForm
                })
            },
            submitSearch(pageNum) {
                this.getData(pageNum)
            },
            clearSearchBox() {
                this.inMeterMisForm = {
                    goodsName: '',
                    truckNo: '',
                    supplier: ''
                }
            },
            delInMeter(id) {
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delInMeterById(id).then(() => {
                        this.$message({
                            type: 'success',
                            message: '删除成功！',
                        })
                        this.getData(1)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            updateInMeter(id) {
                this.SET_SELECTED_ROW_ID(id)
                this.SET_DISABLED(false)
                this.title = '更新'
                this.dialogVisible = true
            },
            hidenDialog() {
                this.dialogVisible = false
                this.addDialogVisible = false
                this.getData()
            },
        }
    }
</script>

<style scoped>

</style>
