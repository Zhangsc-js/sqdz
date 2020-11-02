<template>
    <div style="">
        <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm" style="padding-top: 0px;">
            <el-form-item label="物料编码">
                <el-input v-model="queryForm.materialCode" placeholder="请输入物料编码"></el-input>
            </el-form-item>
            <el-form-item label="物料名称">
                <el-input v-model="queryForm.materialName" placeholder="请输入物料名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getMaterialData">查询</el-button>
<!--                <el-button type="primary" v-if="queryForm.opt == 2" @click="getBomData">查询</el-button>-->
            </el-form-item>
            <el-form-item>
                <el-button :disabled="batchBtn"  type="danger " @click="saveyl">批量新增</el-button>
<!--                <el-button :disabled="batchBtn" v-if="queryForm.opt == 2" type="danger " @click="savebm">批量新增</el-button>-->
            </el-form-item>
        </el-form>

        <template>
            <el-table highlight-current-row :data="tableData" stripe @selection-change="objSelection" style="width: 100%">
                <el-table-column type="selection" width="60" center></el-table-column>
                <el-table-column  prop="materialCode" label="编码" ></el-table-column>
                <el-table-column  prop="materialName" label="名称" ></el-table-column>
                <el-table-column  prop="specification" label="规格"></el-table-column>
                <el-table-column  prop="modelNumber" label="型号" ></el-table-column>
                <el-table-column  prop="category" label="类型" :formatter="formatCategory" ></el-table-column>
            </el-table>

        </template>
        <Pagination :total="total"  :page.sync="page.current" :limit.sync="page.size" :pageSizes="pageSizes" @pagination="getMaterialData"/>
<!--        <Pagination :total="total" v-if="queryForm.opt == 2" :page.sync="page.current" :limit.sync="page.size" @pagination="getBomData"/>-->
    </div>
</template>

<script>
    import Pagination from '@/components/Pagination'
    import {initDataMaterial,getMaterial,getBomData,saveylToBomItem} from "@/api/productionPlanning";

    export default {
        name: "ppcBomItem",
        components: {
            Pagination
        },
        data() {
            return {
                page: {
                    current: 1,
                    size: 8,
                },
                pageSizes: [8, 10, 50, 100],
                total: 0,
                queryForm: {
                    materialCode: '',
                    materialName: '',
                    opt: 1
                },
                tableData: [],
                objId:'',
                objIds: [],                 // 选择行数据
                batchBtn: true,
                category:[],
            }
        },
        props: {
            id: {
                type: String,
                required: true
            }
        },
        methods: {
            initData(){
                initDataMaterial().then((response) => {
                    if(response.data.success){
                        this.category=response.data.data.MATERIAL_CATEGORY;
                    }else{
                        this.$message.error(response.data.message+":"+response.data.data)
                    }
                }).catch(e => {
                    this.$message.error(e.message)
                })
            },
            formatCategory(row){
                for (let i = 0; i < this.category.length; i++) {
                    if(row.category==this.category[i].code){
                        return this.category[i].label;
                    }
                }
            },
            getMaterialData() {
                const params = {
                    ...this.page,
                    ...this.queryForm
                };
                getMaterial(params).then((response) => {
                    let data = response.data;
                    let dataFix=[];
                    for (let i = 0; i < data.rows.length; i++) {
                        // if(data.rows[i].category!='1'){
                            dataFix.push(data.rows[i]);
                        // }
                    }
                    this.tableData = dataFix;
                    this.total = data.total;
                }).catch(e => {
                    this.$message({
                        type: 'error',
                        message: e.message,
                        duration: 3 * 1000
                    })
                });
            },
            getBomData(){
                const params = {
                    ...this.page,
                    ...this.queryForm
                };
                getBomData(params).then((response) => {
                    let data = response.data;
                    this.tableData = data.rows;
                    this.total = data.total;
                }).catch(e => {
                    this.$message({
                        type: 'error',
                        message: e.message,
                        duration: 3 * 1000
                    })
                });
            },
            objSelection(objs){
                this.objIds.length = 0;
                const _this = this;
                objs.forEach(element => {
                    _this.objIds.push(element.materialCode)
                });
                this.batchBtn = this.objIds.length === 0
            },
            saveyl(){
                saveylToBomItem(this.objIds,this.id).then((response) => {
                    if(response.data.success) {
                        this.$message.success("新增成功!");
                    }  else{
                        this.$message.error(response.data.message+":"+response.data.data)
                    }

                })
            },
        },
        mounted() {
            this.initData();
            this.getMaterialData();
        },
    }
</script>

<style lang="scss" scoped>
    body{

    }

</style>
