<template>
    <div class="orderPick">
        <el-table highlight-current-row height="calc(100% - 32px)" :data="tableData" border style="width: 100%">
            <el-table-column  prop="pkNo" label="单据号" ></el-table-column>
            <el-table-column prop="materialCode" label="物料编码"></el-table-column>
            <el-table-column prop="materialName" label="物料名称"></el-table-column>
            <el-table-column prop="pickQty" label="数量"></el-table-column>
            <el-table-column prop="primaryUnit" label="单位"></el-table-column>
            <el-table-column prop="billType" label="单据类型" :formatter="typeFormat"></el-table-column>
            <el-table-column prop="createOn" label="生成时间"></el-table-column>
            <el-table-column prop="remarks" label="备注"></el-table-column>
            <el-table-column prop="specification" label="规格"></el-table-column>
            <el-table-column prop="quality" label="材质"></el-table-column>
        </el-table>
        <el-button type="primary" icon="el-icon-plus" :disabled="!woStatus || woStatus==20 || woStatus>=40" @click="other('2','超额领料')" v-has="'PPC-SPIPAD-EXCESS'">超额领料</el-button>
        <el-button type="primary" icon="el-icon-sort" :disabled="!woStatus || woStatus==20 || woStatus>=40" @click="other('3','换料')" v-has="'PPC-SPIPAD-REFUEL'">换料</el-button>
        <el-button type="primary" icon="el-icon-back" :disabled="!woStatus || woStatus==20 || woStatus>=40" @click="other('4','退料')" v-has="'PPC-SPIPAD-RETURN'">退料</el-button>
        <el-button type="primary" icon="el-icon-share" :disabled="!woStatus || woStatus==20 || woStatus>=40" @click="odd('5')" v-has="'PPC-SPIPAD-MISCEL'">零星领料</el-button>

        <el-dialog :title="title" :visible.sync="PickDialogVisible" width="65%">
            <other-pick @save="categoryDialog" @cancel="hidenDialogCancel" :status="status" :inx='PickDialogVisible' :workOrderId='workOrderId' :id="id" />
        </el-dialog>

        <el-dialog title="零星领料" :visible.sync="DialogVisible" width="65%" @close="close">
            <odd-pick @save="categoryDialog" :inx='DialogVisible' @cancel="hidenDialogCancel" :status="status" :workOrderId='workOrderId' />
        </el-dialog>

    </div>
</template>

<script>
    import {getWorkPick,billType} from "@/api/productionPlanning";
    import otherPick from "./otherPick";
    import oddPick from "./odd"
    export default {
        name: "order-pick",
        components: {
            otherPick,
            oddPick
        },
        data() {
            return {
                tableData: [],
                PickDialogVisible:false,
                DialogVisible:false,
                inx:0,
                status:'',
                title:'',
                billTypes:[]
            }
        },
        props: {
            workOrderId: {
                type: String,
                required: true
            },
            trigger: {
                type: Number,
                required: true
            },
            id:{
                type:String,
                required:true
            },
            woStatus:{
                type:String,
                required:true
            },
        },
        watch: {
            trigger() {
                if(this.workOrderId){
                    this.getData()
                }
            },
        },
        mounted() {
            if(this.workOrderId){
                this.getData()
            }
        },
        methods: {
            getData() {
                if(this.workOrderId === '') {
                    this.$message.warning("请选择派工行数据！！");
                    return;
                }
                getWorkPick(this.workOrderId).then((response) => {
                    if(response.data.success){
                        let data = response.data;
                        this.tableData = data.data;
                    }else{
                        this.$message.error(response.data.message+":"+response.data.data)
                    }
                }).catch(e => {
                    this.$message.error(e.message)
                })
                this.billType();
            },
            billType(){
              billType().then((response) =>{
                  let data = response.data
                  this.billTypes = data.data.MATERIAL_PICK_TYPE
              })
            },
            other(status,title){
              this.status = status;
              this.title = title;
              this.PickDialogVisible = true;
            },
            odd(status){
                this.status = status;
                this.DialogVisible = true;
            },
            categoryDialog(){
                this.PickDialogVisible = false;
                this.DialogVisible = false;
                this.getData();
            },
            hidenDialogCancel(){
              this.PickDialogVisible = false;
              this.DialogVisible = false;
            },
            close(){
            },
            typeFormat(row, column) {
                for(var i = 0; i < this.billTypes.length; i++){
                    if(row.billType == this.billTypes[i].code){
                        return this.billTypes[i].label
                    }
                }
            }
        }
    }
</script>

<style lang="css">
    .orderPick div[data-v-398c2748] div.el-table{
        margin-top:0;
    }
</style>
