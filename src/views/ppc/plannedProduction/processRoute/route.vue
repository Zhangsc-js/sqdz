<template>
    <div class="route">
        <div @keyup.esc="menuVisible = false" tabindex="0" class="method-1-wrap wrap"
             style="float: left;width: 47%;margin-left: 20px;height: 620px;">
            <span class="title">Bom信息</span>
            <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
                <el-form-item label="Bom代码">
                    <el-input v-model="queryForm.bomCode" placeholder="请输入BOM编码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getData()">查询</el-button>
                </el-form-item>
            </el-form>
            <template>
                <el-table highlight-current-row :data="bomTable" v-loading="loading" @row-click="findProcess" style="width: 100%">
                    <el-table-column prop="bomCode" label="Bom编码"></el-table-column>
                    <el-table-column prop="category" label="类型"></el-table-column>
                    <el-table-column prop="bomVer" label="启用版本"></el-table-column>
                </el-table>
            </template>
            <Pagination :total="total" :page.sync="page.current" :limit.sync="page.size" :pageSizes="pageSizes"
                        @pagination="getData"/>
        </div>
        <div @keyup.esc="menuVisible = false" class="method-1-wrap wrap" tabindex="0"
             style="float: left;width: 50%;margin-left: 5px;">
            <span class="title">路线信息</span>
            <el-form :inline="true" :model="routeForm" class="demo-form-inline" ref="queryForm">
                <el-form-item label="路线编号">
                    <el-input v-model="routeForm.routeCode" placeholder="请输入物料编码"></el-input>
                </el-form-item>
                <el-form-item label="路线名称">
                    <el-input v-model="routeForm.routeName" placeholder="请输入物料路线"></el-input>
                </el-form-item>
                <el-form-item style="margin-right: 5px">
                    <el-button type="primary" @click="saveRoute">保存</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div @keyup.esc="menuVisible = false" tabindex="0" class="method-1-wrap wrap"
             style="float: left;width: 50%;margin-left: 5px;height: 500px">
            <span class="title">工序配置</span>
            <template>
                <el-table highlight-current-row :data="processData" v-loading="loading"  style="width: 100%" @cell-dblclick="tableDbEdit">
                    <el-table-column type="selection" width="60" center></el-table-column>
                    <el-table-column prop="processNo" label="流程号"></el-table-column>
                    <el-table-column prop="processCode" label="工序编号"></el-table-column>
                    <el-table-column prop="processName" label="工序名称"></el-table-column>
                    <el-table-column prop="precessName" label="前置工序"></el-table-column>
                </el-table>
            </template>
            <Pagination :total="btotal" :page.sync="bpage.pageNum" :limit.sync="bpage.pageSize"
                        @pagination="findProcess"/>
            <el-button type="primary" @click="addRow"  >新增</el-button>
            <el-button  type="danger " @click="">批量删除</el-button>
            <el-button type="primary" @click="saveProcess">保存</el-button>
        </div>
    </div>
</template>


<script>

    import Pagination from '@/components/Pagination'
    // import Addmaterial from './Addmaterial'
    import {getBomData,getroute,saveRoute,saveProcess } from "@/api/productionPlanning";

    export default {
        name: "ppcroute",
        components: {
            // Addmaterial,
            Pagination
        },
        data() {
            return {
                page: {
                    current: 1,
                    size: 13,
                },
                pageSizes: [13, 10, 50, 100],
                bpage: {
                    pageNum: 1,
                    pageSize: 2,
                },
                total: 0,
                btotal:0,
                queryForm: {
                    bomCode: '',
                    bomName: ''

                },
                routeForm :{
                    routeCode:'',
                    routeName:''
                },
                bomTable: [],
                processData:[],
                loading: false,
                bomCode :''
            }
        },
        methods: {
            addRow () {
                const list = {
                    precessId: [],
                    precessName:'',
                    processCode:'',
                    processId:'',
                    processName:'',
                    processNo:'',
                    routeId:''
                }
                this.processData.unshift(list)
            },
            saveProcess(){
                saveProcess(this.processData,this.bomCode).then((response) => {
                    if(response.data.success) {
                        this.$message.success("保存成功!");
                        this.getData();
                    } else {
                        this.$message.success("保存失败!");
                    }

                })
            },
            tableDbEdit(row, column, cell, event) {
                console.log(row, column, cell, event);
                if (column.label != "顺序") {
                    event.target.innerHTML ="";
                    let cellInput = document.createElement("input");


                    switch (column.property) {
                        case "processNo":
                            if(row.processNo != null){
                                cellInput.value =row.processNo;
                            } else {
                                cellInput.value = "";
                            }
                            break;
                        case "processName":
                            if(row.processName != null){
                                cellInput.value =row.processName;
                            } else {
                                cellInput.value = "";
                            }
                            break;
                        case "processCode":
                            if(row.processCode != null){
                                cellInput.value =row.processCode;
                            } else {
                                cellInput.value = "";
                            }
                            break;
                        case "precessName":
                            if(row.precessName != null){
                                cellInput.value =row.precessName;
                            } else {
                                cellInput.value = "";
                            }
                            break;
                        default:
                            cellInput.value = "";
                    }
                    cellInput.setAttribute("type", "text");
                    cellInput.style.width = "80%";
                    cell.appendChild(cellInput);
                    cellInput.onblur = function () {
                        cell.removeChild(cellInput);
                        event.target.innerHTML = "<div class='cell'>" + cellInput.value + "</div>";
                    };
                }
            },
            saveRoute(){
                saveRoute(this.routeForm,this.bomCode).then((response) => {
                    if(response.data.success) {
                        this.$message.success("保存成功!");
                        this.getData();
                    } else {
                        this.$message.success("保存失败!");
                    }

                })
            },
            clearSearchBox() {
                this.queryForm = {
                    materialCode: '',
                    materialName: ''
                }
            },
            findProcess(row){
                this.bomCode = row.bomCode;
                const params = {
                    ...this.bpage,
                    bomCode:row.bomCode
                };
                getroute(params).then((response) => {
                    let result = response.data;
                    if(result.rows[0].route != null){
                        this.routeForm =  result.rows[0].route;
                        this.processData = result.rows[0].list;
                        this.btotal = result.rows[0].list.length;
                    } else {
                        this.routeForm ={
                            routeCode:'',
                            routeName:''
                        }
                        this.processData = [];
                    }
                }).catch(e => {
                    Message({
                        type: 'erroe',
                        message: e.message,
                        duration: 3 * 1000
                    })
                });
            },
            getData() {
                const params = {
                    ...this.page,
                    ...this.queryForm
                };
                this.loading = true;
                getBomData(params).then((response) => {
                    let data = response.data;
                    this.bomTable = data.rows;
                    this.total = data.total;
                }).catch(e => {
                    Message({
                        type: 'erroe',
                        message: e.message,
                        duration: 3 * 1000
                    })
                });
                this.loading = false;
            }
        }
    }

</script>

<style lang="css">

    .route .el-form-item__label {
        width: 70px;
    }

    .route .wrap {
        margin: 13px auto;
        width: 500px;
    }

    .route .method-1-wrap {
        position: relative;
        border: 1px solid #ccc;
        padding: 20px;
        box-sizing: border-box;
    }

    .route .method-1-wrap .title {
        position: absolute;
        top: -1em;
        left: 10%;
        line-height: 2em;
        padding: 0 1em;
        background-color: #fff;
    }
    .route .cell{
        text-align:center
    }
</style>
