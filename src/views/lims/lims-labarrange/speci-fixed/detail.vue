<template>
    <el-container style="padding-top:24px">
        <div class="tableshadow margin20 mr15" style="width: 100%;padding:20px;">
            <div class="block">
                <el-col :span="5" align="center" class="demonstration" v-html="itemName"></el-col>
                <!-- <el-col :span="5" align="center" class="demonstration" v-html="itemPlace"></el-col> -->
            </div>
            <el-form ref="queryForm" label-width="100px" class="margin20 mb0">
                <el-col :span="8">
                    <el-form-item label="取样日期" prop="speciDate">
                        <el-date-picker
                                v-model="dateValue"
                                type="date"
                                value-format="yyyy-MM-dd"
                                @change="timeChange"
                                placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="取样班次" prop="speciShift">
                        <el-select id="speciId"
                                   v-model="queryForm.speciShift"
                                   placeholder="请选择取样班次">
                            <el-option v-for="item in shiftType" :key="item.shiftId" :label="item.shiftId" :value="item.shift"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6" class="pt12">
                    <el-button icon="el-icon-search" href="javascript:void(0)" type="primary" class="btn-b" @click="getData">搜索</el-button>
                    <el-button href="javascript:void(0)" class="btn-w" @click="clearSearchBox">清空</el-button>
                </el-col>
                <el-col >
                    <el-form-item label="是否缺样" prop="missSpeci">
                        <el-switch v-model="queryForm.missSpeci" active-text="是" inactive-text="否" active-value="1" inactive-value="0">
                        </el-switch>
                    </el-form-item>
                </el-col>
            </el-form>
            <el-table :data="tableData" v-loading="loading" @selection-change="selsChange" style="width: 100%">
                <!-- <el-table-column fixed type="selection" width="55"></el-table-column> -->
                <el-table-column prop="speciTimetype" align="center" label="样品类型" width="180"></el-table-column>
                <el-table-column prop="speciProcetype" align="center" label="样品类型" width="180"></el-table-column>
                <el-table-column prop="speciDate" :formatter="formatDate" align="center" label="取样日期" width="180"></el-table-column>
                <el-table-column prop="speciShift" align="center" label="取样班次" width="180"></el-table-column>
                <el-table-column prop="speciTime" align="center" label="取样时间" width="180"></el-table-column>
                <!-- <el-table-column prop="sampGroup" align="center" label="取样小组" width="180"></el-table-column> -->
                <el-table-column prop="speciOperator" align="center" label="取样人" width="180">
                    <template slot-scope="scope">
            <el-tooltip placement="bottom">
              <div slot="content">
               <span v-for='(item,i) in scope.row.speciOperator.split(",")' :key='i'>{{item}}<br></span>
              </div>
              <button type="button" class="el-button el-button--text">
                <span>{{scope.row.sampGroup}}</span>
              </button>
            </el-tooltip>

            <!-- <span>{{scope.row.sample.serial}}</span> -->
          </template>
                </el-table-column>
                <el-table-column prop="speciSize" align="center" label="取样规格" width="180"></el-table-column>
                <el-table-column prop="speciUnit" align="center" label="计量单位" width="180"></el-table-column>
                <el-table-column prop="ifRestain" align="center" label="是否留存" width="180"></el-table-column>
                <el-table-column prop="missSpeci" align="center" label="是否缺样" width="180"></el-table-column>
                <el-table-column prop="remark" align="center" label="备注" width="180"></el-table-column>
            </el-table>
            <Pagination :total="total" :page.sync="page.pageNum" :limit.sync="page.pageSize" @pagination="getData"/>
        </div>
    </el-container>
</template>

<script>
    import Pagination from '@/components/Pagination'
    import { getSpotDetail } from '@/api/lims'
    import {simpleDateFormat } from "@/utils/index"
    export default {
        name: "speciMore",
        components: {
            Pagination,
        },
        data() {
            return {
                page: {
                    pageNum: 1,
                    pageSize: 10,
                },
                total: 0,
                loading: false,
                tableData: [],
                queryForm: {              // 查询表单
                    speciDate:'',
                    speciShift: '',
                    missSpeci: 0,
                },
                showMore: false,
                batchBtn: true,
                sels: [],                 // 选择行数据
                selId: '',
                dateValue: '',
                shiftType: [{
                    shiftId: '1',
                    shift: '白'
                }, {
                    shiftId: '2',
                    shift: '中'
                }, {
                    shiftId: '3',
                    shift: '夜'
                }],
                basicQuery:{
                    spotId: this.spot
                },
                itemName:"  样品名称： "+this.selSpot.speciName
            }
        },
        props: {
           selSpot:{
               type: Object,
               required: true
           }
        },
        watch:{
            basic(){
                this.basicQuery.spotId = this.selSpot.spotId;
                this.itemName = "  样品名称： "+this.selSpot.speciName;
                this.getData();
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            timeChange(time){
                let _this = this;
                _this.dateValue = time;
            },
            formatDate: function(row, column) {
                let date = new Date(row.speciDate);
                return simpleDateFormat(date, 'yyyy-MM-dd');
            },
            getData() {
                this.queryForm.speciDate=this.dateValue;
                const params = {
                    ...this.page,
                    ...this.basicQuery,
                    ...this.queryForm
                };
                getSpotDetail(params).then((res) => {
                    this.tableData = res.data.data.rows;
                    this.total = res.data.data.total;
                }).catch(e => {
                    Message({
                        type: 'error',
                        message: e.message,
                        duration: 3 * 1000
                    })
                }).finally(() => {
                    this.$emit("hidenDialog")
                });
            },
            selsChange: function(sels) {
                this.sels.length = 0;
                const _this = this;
                sels.forEach(element => {
                    _this.sels.push(element.speciId)
                });
                this.batchBtn = this.sels.length === 0
            },
            clearSearchBox() {
                this.dateValue = '';
                this.queryForm.speciDate ='';
                this.queryForm.speciShift = ''
            }
        }
    }
</script>

<style scoped>

</style>
