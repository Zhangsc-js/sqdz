<template>
    <div class="editTable">
        <edit-table
            :tableData="tableData"
            :opts="opts"
            :selectionChange="handleSelectionChange"
            :showSelectBtn="true"
            :page="page1"
            :total="total1"
            @savaData="save">
            <template v-slot:main={scope}>
                <el-button type="text" size="small" @click="edit(scope.row)">更新222</el-button>
            </template>
        </edit-table>
        <el-row>
            <el-button type="warning" :disabled="true" style="margin-left:10px">删除</el-button>
        </el-row>
        <!-- <div><h1>------华丽的分界线------</h1></div> -->
        <edit-table
            :tableData="tableData"
            :opts="opts"
            :page="page2"
            :total="total2"
            :selectionChange="handleSelectionChange"
            :showSelectBtn="true"
            @batchSave="batchSave"
            @savaData="save">
            <template v-slot:main={scope}>
                <el-button type="text" size="small" @click="edit(scope.row)">更新222</el-button>
            </template>
        </edit-table>
    </div>
</template>

<script>
import EditTable from './index'
export default {
    name: 'EditTableTest',
    components: {
        EditTable
    },
    data() {
        return {
            page1: {
                pageNum: 1,
                pageSize: 10
            },
            page2: {
                pageNum: 1,
                pageSize: 10
            },
            total1: 100,
            total2: 100,
            tableData: [{
                id: '1',
                date: '2016-05-02',
                name: '111',
                address: '上海市普陀区金沙江路 1518 弄',
                visibleOptBtn: false
            }, {
                id: '1',
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄'
            }, {
                id: '1',
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
            }, {
                id: '1',
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄'
            }],
            opts: [
                {
                    type: 'input',
                    prop: 'date'
                }, {
                    type: 'input',
                    prop: 'name'
                }, {
                    type: 'input',
                    prop: 'address'
                }
            ],
            selectDatas: []
        }
    },
    methods: {
        edit(row) {
            console.log(row)
        },
        save(row, done) {
            done()
        },
        handleSelectionChange(data) {
            this.selectDatas = data
            console.log(this.selectDatas)
        },
        rowClick() {
            alert(111)
        },
        batchSave(data) {
            console.log(data)
        }
    }
}
</script>
<style lang="scss">
    .editTable .el-table__body-wrapper{
        height: auto !important;
    }
</style>
