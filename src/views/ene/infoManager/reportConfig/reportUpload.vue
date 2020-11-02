<template>
    <div class="file">
        <el-form ref="queryForm" label-width="80px">
            <el-row>
                <el-col :span="6">
                    <el-form-item label="文件名称" prop="fileName">
                        <el-input
                            id="fileName"
                            v-model="queryForm.fileName"
                            plain="true"
                            placeholder="请输入文件名称"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-button icon="el-icon-search" type="primary" @click="getData(1)">查询</el-button>
                    <el-button @click="clearSearchBox">清空</el-button>
                </el-col>
                <el-col :span="7">
                    <el-upload
                        :action="fileUploadUrl"
                        multiple
                        :limit="3"
                        :show-file-list="false"
                        :on-success="uploadSuccess"
                        :headers="token"
                        :on-error="uploadError"
                    >
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-col>
            </el-row>
        </el-form>
        <el-table stripe border :data="tableData" style="width: 100%">
            <el-table-column align="center" prop="fileName" label="报表名称"></el-table-column>
            <el-table-column align="center" prop="createdOn" label="上传时间"></el-table-column>
            <el-table-column align="center" prop="fileAddress" label="报表地址"></el-table-column>
            <el-table-column fixed="right" align="center" label="操作">
                <template v-slot="scope">
                    <el-button type="text" size="small" @click="delFile(scope.row.id)">删除</el-button>
                    <el-button type="text" size="small" @click="downloadFile(scope.row)">下载</el-button>
                </template>
            </el-table-column>
        </el-table>
        <Pagination
            :total="total"
            :page.sync="page.pageNum"
            :limit.sync="page.pageSize"
            @pagination="getData"
        />
    </div>
</template>

<script>
    import Pagination from "@/components/Pagination";
    import { getToken } from "@/utils/auth";
    import {getReportFiles,REPORT_UPLOAD_URL,delReportFile,downReportFile} from "@/api/energy"
    import {simpleDateFormat } from "@/utils/index";
    import { saveAs } from 'file-saver'
    export default {
        name: "reportUpload",
        components:{
            Pagination
        },
        data(){
            return{
                page:{
                    pageNum: 1,
                    pageSize: 10
                },
                // total:0,
                tableData: [],
                queryForm: {
                    fileName:"",
                },
                fileUploadUrl:REPORT_UPLOAD_URL,
                token: {
                    Authorization: `Bearer ${getToken()}`
                }
            }
        },
        mounted(){
            this.getData();
        },
        methods:{
            getData(pageNum){
                if(pageNum === 1){
                    this.page.pageNum =1;
                }
                this.queryForm.createdOn = simpleDateFormat(this.queryForm.createdOn,"yyyy-MM-dd");
                const params = {
                    ...this.page,
                    ...this.queryForm

                };
                getReportFiles(params).then(response =>{
                    const result = response.data;
                    if (result.success && result.data) {
                        this.tableData = result.data.rows;
                        this.total = result.data.total;
                    } else {
                        this.$message.error(result.message);
                    }
                }).catch(e =>{
                    this.$message.error(e.message);
                });
            },
            delFile(id){
                this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() =>{
                    delReportFile(id).then(() =>{
                        this.getData(1);
                        this.$message.success("删除成功!");
                    });
                }).catch(() =>{
                    this.$message.info("已取消删除！");
                })
            },
            downloadFile(row){
                downReportFile(row.id).then(response =>{
                    const result = response.data
                    if(result){
                        let data = new File([result],{ type: 'application/octet-stream' })
                        saveAs(data,row.fileName)
                        this.getData()
                    } else {
                        this.$message.error(result.message)
                    }
                }).catch(e =>{
                    this.$message.error(e.message)
                })
            },
            uploadSuccess(response) {
                if (response.success) {
                    this.$message.success("上传成功");
                } else {
                    this.$message.error(response.message);
                }
                this.getData();
            },
            uploadError(err) {
                this.$message.error("上传失败" + err.message);
            },
            clearSearchBox() {
                this.queryForm = {
                    fileName: "",
                };
            },
        }
    }
</script>

<style scoped>

</style>
