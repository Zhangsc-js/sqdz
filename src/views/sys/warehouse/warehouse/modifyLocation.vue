<template>
    <div>

        <!-- 库存地点列表 -->
            <el-table
                highlight-current-row
                :data="tableData"
                stripe
                height="70vh"
                ref="multipleTable"
                align="center"
            >
                <el-table-column type="selection" width="55"></el-table-column>

                <el-table-column prop="ftyCode" label="工厂编码">
                    <template v-slot="scope">
                        <span>{{ scope.row.ftyCode }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="ftyCode" label="工厂描述">
                    <template v-slot="scope">
                        <span>{{ scope.row.ftyName }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="locationCode" label="库存地点编码">
                    <template v-slot="scope">
                        <span>{{ scope.row.locationCode }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="locationCode" label="库存地点描述">
                    <template v-slot="scope">
                        <span>{{ scope.row.locationName }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-row style="padding:20px">
                <el-button type="primary" plain icon="el-icon-delete" @click="confirm">确定</el-button>
            </el-row>

        <Pagination
            :total="total"
            :page.sync="page.pageNum"
            :limit.sync="page.pageSize"
            @pagination="init()"
        />

    </div>

    <!--<div slot="footer" class="dialog-footer" align="left">
        <el-button icon="el-icon-close" @click="">取消</el-button>
        <el-button icon="el-icon-check" type="primary" @click="">保存</el-button>
    </div>-->
</template>

<script>
    import {
        getLocationList
    } from "@/api/sys/wms/warehouse";
    import Pagination from "@/components/Pagination";

    export default {
        name: "modifyLocation",
        components: {
            Pagination
        },
        data() {
            return {
                tableData:[],
                rule: {},
                page: {
                    pageNum: 1,
                    pageSize: 10
                },
                total: 0

            }
        },
        props: {
            whCode: {
                type: String,
                required: true
            },
            count:{
                type:Number
            }
        },
        created() {
            this.init();
            console.log(this.whCode);
        },
        methods: {
            init() {
                getLocationList(this.page).then(res => {
                    this.tableData = res.data.data.rows;
                    this.total = res.data.data.total;
                });
            },
            confirm(){
                if (this.$refs.multipleTable.store.states.selection.length > 0) {
                    let param =this.$refs.multipleTable.store.states.selection;
                    param=param.map(item=>{
                        return {
                            ...item,
                            whCode:this.whCode
                        }
                    })
                    console.log(param)
                    this.$emit("confirm",param);
                   /* this.$refs.multipleTable.store.states.selection.forEach(item=>{
                        this.tableData=this.tableData.filter(i=>{
                            return !(i.ftyCode==item.ftyCode&&i.locationCode==item.locationCode)
                        })
                    })
                    console.log(this.tableData)*/
                }
            }


        },
        watch:{
            count(){
                this.init()
            }
        }
    }
</script>

<style scoped>

</style>
