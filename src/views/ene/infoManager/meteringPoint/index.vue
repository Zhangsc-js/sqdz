<template>
    <el-container style="padding-top:15px">
        <div class="tableshadow" style="width: 100%;">
            <el-form inline style="margin-left:20px">
                <el-form-item label="计量点编码" prop="paramValue">
                    <el-input
                        id="paramValue"
                        v-model="pointForm.paramValue"
                        :maxlength="15"
                        plain="true"
                        placeholder="请输入编码"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button
                        icon="el-icon-search"
                        href="javascript:void(0)"
                        type="primary"
                        class="btn-b"
                        @click="getData"
                    >查询</el-button>
                    <el-button href="javascript:void(0)" class="btn-w" @click="clearSearchBox">清空</el-button>
                    <el-button type="primary" @click="addMeteringPoint" icon="el-icon-plus">新增</el-button>

                </el-form-item>

            </el-form>

            <el-table stripe :data="tableData" style="width: 100%">
                <el-table-column fixed type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="paramValue" align="center" label="计量点编码"></el-table-column>
                <el-table-column prop="paramName" align="center" label="计量点名称"></el-table-column>
            </el-table>

            <Pagination
                :total="total"
                :page.sync="page.pageNum"
                :limit.sync="page.pageSize"
                @pagination="getData"
            />
        </div>
    </el-container>
</template>

<script>
    import { getPoint} from "@/api/energy";
    import Pagination from "@/components/Pagination";
    // import XLSX from "xlsx";
    export default {
        name: "metering_point",
        data() {
            return {
                editDialogVisible: false,
                addDialogVisible: false,
                title: "",
                page: {
                    pageNum: 1,
                    pageSize: 10
                },
                total: 0,
                tableData: [],
                data: {},
                importData: [],
                paramValue: "",
                pointForm: {
                    paramValue: ""
                }
            };
        },
        components: {
            Pagination,
            // pointAdd,
            // pointUp
        },
        mounted() {
            this.getData();
        },
        methods: {
            getData() {
                const params = {
                    ...this.page,
                    paramValue: this.pointForm.paramValue
                };
                getPoint(params)
                    .then(res => {
                        if (res.data.success) {
                            this.tableData = res.data.data.rows;
                            this.total = res.data.data.total;
                        } else {
                            this.$message.error(res.data.message);
                        }
                    })
                    .catch(e => {
                        this.$message.error(e.message);
                    });
            },
            clearSearchBox() {
                this.pointForm.paramValue = "";
            },
            // addMeteringPoint() {
            //   this.title = "新增计量点位";
            //   this.addDialogVisible = true;
            // },
            // addMPExcel() {},
            // updateMeteringPoint(data) {
            //   this.title = "更新计量点位";
            //   this.editDialogVisible = true;
            //   this.data = data;
            // },
            // deleteMeteringPoint(id) {
            //   this.$confirm("此操作将永久删除记录，是否继续？", "提示", {
            //     confirmButtonText: "确定",
            //     cancelButtonText: "取消",
            //     type: "warning"
            //   })
            //     .then(() => {
            //       deletePoint(id).then(() => {
            //         this.$message.success("删除成功！");
            //         this.getData();
            //       });
            //     })
            //     .catch(() => {
            //       this.$message.info("已取消删除");
            //     });
            // },
            // hidenDialog() {
            //   this.addDialogVisible = false;
            //   this.editDialogVisible = false;
            //   this.getData();
            // // },
            // hidenDialogCancel() {
            //   this.addDialogVisible = false;
            //   this.editDialogVisible = false;
            //   this.getData()
            // },

            // excel表上传
            // handleChange(file, fileList) {
            //   this.fileTemp = file.raw;
            //   // 判断上传文件格式
            //   if (this.fileTemp) {
            //     if (
            //       this.fileTemp.type ==
            //         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            //       this.fileTemp.type == "application/vnd.ms-excel"
            //     ) {
            //       this.importfxx(this.fileTemp);
            //     } else {
            //       this.$message({
            //         type: "warning",
            //         message: "附件格式错误，请删除后重新上传！"
            //       });
            //     }
            //   } else {
            //     this.$message({
            //       type: "warning",
            //       message: "请上传附件！"
            //     });
            //   }
            // },
            // 移除excel表
            // handleRemove(file, fileList) {
            //   this.fileTemp = null;
            // },
            // importfxx(obj) {
            //   let _this = this;
            //   // 通过DOM取文件数据
            //   this.file = obj;
            //   var rABS = false; //是否将文件读取为二进制字符串
            //   var f = this.file;
            //   var reader = new FileReader();
            //   FileReader.prototype.readAsBinaryString = function(f) {
            //     var binary = "";
            //     var rABS = false; //是否将文件读取为二进制字符串
            //     var pt = this;
            //     var wb; //读取完成的数据
            //     var outdata;
            //     var reader = new FileReader();
            //     reader.onload = function(e) {
            //       var bytes = new Uint8Array(reader.result);
            //       // console.log(reader.result)
            //       var length = bytes.byteLength;
            //       for (var i = 0; i < length; i++) {
            //         binary += String.fromCharCode(bytes[i]);
            //       }
            //       // var XLSX = require('xlsx');
            //       if (rABS) {
            //         wb = XLSX.read(btoa(fixdata(binary)), {
            //           //手动转化
            //           type: "base64"
            //         });
            //       } else {
            //         wb = XLSX.read(binary, {
            //           type: "binary"
            //         });
            //       }
            //       outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); //outdata就是读取excel内容之后输出的东西
            //       // console.log(outdata)
            //       this.da = [...outdata];
            //       let arr = [];
            //       this.da.map(v => {
            //         let obj = {};
            //         obj.paramValue = v["计量点编码"];
            //         obj.paramName = v["计量点名称"];
            //         // obj.addressId = v['采集ID']
            //         // obj.energyCode = v['能源类型编码']
            //         obj.devNo = v["所属设备"];
            //         arr.push(obj);
            //       });
            //       for (var t = 0; t < arr.length; t++) {
            //         _this.importData = arr[t];
            //         addPoint(_this.importData).then(res => {
            //           const result = res.data;
            //           if (result.success) {
            //             this.$message.success("导入成功");
            //           } else {
            //             this.$message.error(result.message);
            //           }
            //         });
            //       }
            //       // return arr;
            //
            //       // .catch(e =>{
            //       //     this.$message({type:'error', message:e.message})
            //       // })
            //       // 把读取的excel表格中的内容放进tableData2中(这里要改成自己的表的名字)
            //       _this.tableData = _this.tableData.concat(arr);
            //     };
            //     reader.readAsArrayBuffer(f);
            //   };
            //   if (rABS) {
            //     reader.readAsArrayBuffer(f);
            //   } else {
            //     reader.readAsBinaryString(f);
            //   }
            // }
            // addAll(){
            //     addAllPoint()
            // }
        }
    };
</script>

