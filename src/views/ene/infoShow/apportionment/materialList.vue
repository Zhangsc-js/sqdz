<template>
    <div style=" padding-left: 20px">
        <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
            <!--            <el-form-item>-->
            <!--                <el-select>-->
            <!--                    <option></option>-->
            <!--                </el-select>-->
            <!--            </el-form-item>-->
            <el-form-item label="物料编码">
                <el-input v-model="queryForm.materialCode" placeholder="请输入物料编码"></el-input>
            </el-form-item>
            <el-form-item label="物料名称">
                <el-input v-model="queryForm.materialName" placeholder="请输入物料名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getData(1)">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button href="javascript:void(0)" class="btn-w" @click="clearSearchBox">清空</el-button>
            </el-form-item>
        </el-form>
        <el-table highlight-current-row :data="tableData"  height="300px" @row-click="openDetails" border stripe style="width: 100%">
            <el-table-column prop="materialCode" label="编码" width="150"></el-table-column>
            <el-table-column prop="materialName" label="名称" width="180"></el-table-column>
            <el-table-column prop="specification" label="规格"></el-table-column>
            <el-table-column :formatter="statusFormat" prop="category" label="物料类别"></el-table-column>
            <el-table-column prop="primaryUnit" label="基本单位" width="90"> </el-table-column>
            <el-table-column prop="modelNumber" label="型号"></el-table-column>
        </el-table>
        <Pagination :total="total" :page.sync="page.current" :limit.sync="page.size" :pageSizes="pageSizes" @pagination="getData"/>
    </div>
</template>

<script>
    import Pagination from '@/components/Pagination'
    import {getMaterial} from '@/api/energy'
    import {queryStatus} from "@/api/productionPlanning";
    export default {
        name: "materialList",
        components: {
            Pagination
        },
        data(){
            return{
                page: {
                    current: 1,
                    size : 5,
                },
                pageSizes:[5,10,50,100],
                total: 0,
                queryForm: {
                    materialCode: '',
                    materialName: '',
                    category :'1,2,4'
                },
                tableData: [],
                batchBtn: true,
                materialStatus:[]
            }
        },
        methods:{

            openDetails(row){
                const param = Object.assign({materialId: row.id }, row);
                this.$emit("save",param);
            },
            getData(type){
                if(type === 1){
                    this.page.current = 1
                }
                const params = {
                    ...this.page,
                    ...this.queryForm
                }
                getMaterial(params).then((response) => {
                    let data = response.data;
                    this.tableData = data.data.result;
                    this.total = data.data.total;
                    this.queryStatus()
                }).catch(e => {
                    this.$message({
                        type: 'error',
                        message: e.message,
                        duration: 3 * 1000
                    })
                });
            },
            clearSearchBox() {
                this.queryForm = {
                    materialCode : '',
                    materialName: '',
                    category :'1,2,4'
                }
            },
            queryStatus(){
                queryStatus().then((response) => {
                    let result = response.data
                    if(result.success){
                        this.materialStatus = result.data.MATERIAL_CATEGORY
                    }
                })
            },
            objSelection(objs){
                this.objIds.length = 0;
                const _this = this;
                objs.forEach(element => {
                    _this.objIds.push(element.id)
                });
                this.batchBtn = this.objIds.length === 0
            },
            statusFormat(row, column) {
                for (var i=0 ;i<this.materialStatus.length ;i++) {
                    if(row.category==this.materialStatus[i].code){
                        return this.materialStatus[i].label
                    }
                }
            }
        },
        mounted() {
            this.getData();

        }
    }
</script>

<style scoped>

</style>
