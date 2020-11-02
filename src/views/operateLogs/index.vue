
<template>
    <div class="dashboard-container" style="padding-top:45px">
        <div class="app-container">
            <el-card shadow="never">

                <el-form ref="formSearch" :model="requestParameters" label-width="100px" >
                    <el-col :span="6">
                        <el-form-item label="操作人" >
                            <el-input v-model="requestParameters.username" style="width:250px"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="操作类型" >
                            <el-select v-model="requestParameters.type" placeholder="请选择">
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
                        <el-form-item label="操作时间">
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
            </el-card>
            <el-card shadow="never">
                <!--elementui的table组件
                  data：数据模型
                 -->
                <el-table  :data="dataList"  border style="width: 100%" ref="multipleTable" @sort-change="changeTableSort">
                    <!--el-table-column : 构造表格中的每一列
                      prop： 数组中每个元素对象的属性名
                    -->
                    <el-table-column  prop="id" label="编号"  ></el-table-column>
                    <el-table-column  prop="fileName" label="文件名称"  ></el-table-column>
                    <el-table-column  prop="gmtCreate" label="操作时间"  :formatter="dateFormat" sortable="custom"></el-table-column>
                    <el-table-column  prop="operateUsername" label="操作人"  ></el-table-column>
                    <el-table-column  prop="type" label="类型"  :formatter="formatStatus"></el-table-column>
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
    import {list} from '@/api/operateLog'
    // import moment from 'moment'
    export default {
        name: "operateLog",
        data () {
            return {
                dataList:[],
                requestParameters:{
                    username:null,
                    type:null,
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
                    value: '1',
                    label: '上传'
                }, {
                    value: '2',
                    label: '下载'
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
            formatStatus: function (row, column) {
                let status=row.type
                if (status === 1){
                    return '上传';
                }
                return '下载';
            },
            dateFormat(row, column){
                // var moment = require('moment');
                var date = row[column.property];
                // return moment(date).format("YYYY-MM-DD HH:mm:ss")
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
                this.requestParameters.userId=null
                this.requestParameters.username=null
                this.requestParameters.type=null
                this.requestParameters.timeEnd=null
                this.requestParameters.timeStart=null
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