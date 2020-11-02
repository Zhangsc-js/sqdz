<template>
    <div class="dashboard-container" style="padding-top:45px">
        <div class="app-container">
            <el-card shadow="never">

                <el-form ref="formSearch" :model="requestParameters" label-width="100px" >
                    <el-col :span="6">
                        <el-form-item label="文件名称" >
                            <el-input v-model="requestParameters.fileName" style="width:250px"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="文件类型" >
                            <el-select v-model="requestParameters.fileType" placeholder="请选择">
                                <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="上传时间">
                            <el-date-picker
                                    v-model="requestParameters.timeStart"
                                    type="datetime"
                                    placeholder="选择日期时间"
                                    align="right"
                                    :picker-options="pickerOptions" style="width: 150px" value-format="yyyy-MM-dd HH:mm:ss" >
                            </el-date-picker>
                            -
                            <el-date-picker
                                    v-model="requestParameters.timeEnd"
                                    type="datetime"
                                    placeholder="选择日期时间"
                                    align="right"
                                    :picker-options="pickerOptions" style="width: 150px" value-format="yyyy-MM-dd HH:mm:ss">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-button type="primary" style="margin-left:30px;" @click="search">查询</el-button>
                            <el-button @click="cleanInput">清空</el-button>
                        </el-form-item>
                    </el-col>
                </el-form>

                <el-table  :data="dataList"  border style="width: 100%" ref="multipleTable" @sort-change="changeTableSort">
                    <el-table-column  prop="id" label="编号"  width="150"></el-table-column>
                    <el-table-column  prop="fileName" label="文件名称"  width="200" sortable="custom"></el-table-column>
                    <el-table-column  prop="fileSaveLocation" label="文件位置"  width="200"></el-table-column>
                    <el-table-column  prop="fileType" label="文件类型"  width="150"></el-table-column>
                    <el-table-column  prop="uploadTime" label="上传时间"  width="150" :formatter="dateFormat" sortable="custom"></el-table-column>
                    <el-table-column  prop="keepingTime" label="保管时间"  width="150" :formatter="keepingTimeFormat"></el-table-column>
                    <el-table-column  prop="fileRealLocation" label="纸质文件位置"  width="150"></el-table-column>
                    <el-table-column  prop="remark" label="备注"  width="200" ></el-table-column>
                    <el-table-column fixed="right" label="操作" width="150">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="handleExpireFile(scope.row)">处理</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page=currentPage
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="10"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total=counts>
                </el-pagination>
            </el-card>
        </div>

    </div>

</template>

<script>
    import {list,handle} from '@/api/expireFile'
    // import moment from 'moment'
    export default {
        name: "operateLog",
        data () {
            return {
                dataList:[],
                requestParameters:{
                    fileName:null,
                    fileType:null,
                    timeStart:null,
                    timeEnd:null,
                    page: 1,
                    size: 10,
                    sort:[]
                },
                formData:{},
                counts:1,
                currentPage:1,
                options:[{
                    value: 'txt',
                    label: 'txt'
                }, {
                    value: 'doc',
                    label: 'doc'
                }, {
                    value: 'docx',
                    label: 'docx'
                }, {
                    value: 'xls',
                    label: 'xls'
                }, {
                    value: 'xlsx',
                    label: 'xlsx'
                }, {
                    value: 'ppt',
                    label: 'ppt'
                }, {
                    value: 'pptx',
                    label: 'pptx'
                }, {
                    value: 'pdf',
                    label: 'pdf'
                }],
                pickerOptions: {
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                },
                errorAlert:false,
            }
        },
        methods: {
            doQuery(params) {
                list(this.requestParameters)
                    .then(res => {
                        let data=res.data.data;
                        console.log(data)
                        if(res.data.success){
                            this.dataList = data.rows
                            this.counts = data.total
                        }else {
                            this.$message.error(res.data.message)
                        }
                    })
            },
            dateFormat(row, column){
                // var moment = require('moment');
                var date = row[column.property];
                // return moment(date).format("YYYY-MM-DD HH:mm:ss")
            },
            keepingTimeFormat(row, column){
                let keepingTime=row.keepingTime
                let str=""
                let year=Math.round(keepingTime/12)
                let month=keepingTime-year*12
                if(year!=0){
                    str+=year+"年"
                }
                if(month!=0){
                    str=+month+"月"
                }
                return str
            },
            handleSizeChange(val){//每页显示条数改变调用
                this.requestParameters.size = val
                if (this.requestParameters.page === 1) {
                    this.doQuery(this.requestParameters)
                }
            },
            handleCurrentChange(val){//当前页改变调用
                this.currentPage=val
                this.requestParameters.page=val
                this.doQuery()
            },
            search(){//点击查询
                this.requestParameters.page=1
                this.doQuery();
            },
            cleanInput(){//清空输入
                this.requestParameters.fileName=null
                this.requestParameters.fileType=null
                this.requestParameters.timeEnd=null
                this.requestParameters.timeStart=null
            },
            handleExpireFile(item){//处理过期文件
                handle({"id":item.id},)
                    .then(res => {
                        if(!res.data.success){
                            this.$message.error(res.data.message)
                        }else{
                            this.$message.success("处理成功")
                            this.doQuery()
                        }
                    })
            },
            changeTableSort(column){//监听表格排序
                let sort={}
                sort.property=column.prop
                let sortArray=this.requestParameters.sort
                if(column.order=="descending"){
                    sort.direction="DESC"
                }else if(column.order=="ascending"){
                    sort.direction="ASC"
                }
                let containFlag=false
                for(let i=0;i<sortArray.length;i++){
                    if(sortArray[i].property==column.prop){
                        if(column.order==null){
                            sortArray.splice(i,1)
                        }else {
                            sortArray[i].direction=sort.direction
                        }
                        containFlag=true
                        break
                    }
                }
                if(!containFlag){
                    this.requestParameters.sort.push(sort)
                }
                this.doQuery();
            }
        },
        // 创建完毕状态
        created() {//数据初始化
            this.doQuery(this.requestParameters)
        }
    }
</script>

<style scoped>

</style>