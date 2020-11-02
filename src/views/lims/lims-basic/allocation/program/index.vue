<template>
    <div>
        <el-form ref="queryForm" :inline="true" label-width="100px" class="margin20 mb0">
            <el-form-item label="化验物料" prop="labProgram">
                <el-input
                    v-model="queryForm.labProgram"
                    maxlength="20"
                    plain="true"
                    placeholder="请输入化验物料"
                />
            </el-form-item>
            <el-form-item>
                <el-button
                    icon="el-icon-search"
                    href="javascript:void(0)"
                    type="primary"
                    class="btn-b"
                    @click="getData(1)"
                >查询
                </el-button>
                <el-button href="javascript:void(0)" class="btn-w" @click="clearSearchBox">清空</el-button>
            </el-form-item>
            <div style="padding-left:30px;">
                <el-button style="margin:0px 0px 0px 2px;" type="primary" @click="addProgram(tableData)" icon="el-icon-plus" v-has="'LIMS-PROGRAM-ADD'">新增
                </el-button>
            </div>
        </el-form>
        <div class="tableshadow margin20" style="width:calc( 100% - 40px );">
            <el-table
                :data="tableData"
                v-loading="loading"
                @selection-change="selChange"
                border
                style="width: 100%"
            >
                <el-table-column class="selection" fixed type="selection"
                                 v-if="hasBtn(['LIMS-PROGRAM-BATCH'])"></el-table-column>
                <el-table-column label="#" align="center" width="50">
                    <template slot-scope="{row,$index}">
                        <span>{{$index + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="proName" align="center" label="化验物料">
                    <template slot-scope="scope">
            <span v-if="scope.row.edit">
              <el-select
                  v-model="scope.row.proName"
                  value-key="id"
                  filterable
                  remote
                  placeholder="请输入关键词"
                  :remote-method="remoteProgram"
              >
                <el-option
                    v-for="item in selectProgram"
                    :key="item.id"
                    :label="item.materialName"
                    :value="item"
                ></el-option>
                <Pagination
                    :total="total1"
                    :page.sync="page1.current"
                    :limit.sync="page1.size"
                    @pagination="getProgramList(scope.row)"
                />
              </el-select>
            </span>
                        <span v-else>{{scope.row.proName}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="proIndic" align="center" show-overflow-tooltip label="分析项目">
                    <template slot-scope="scope">
            <span v-if="scope.row.edit">
              <el-select
                  v-model="scope.row.proIndicatorEdit"
                  collapse-tags
                  multiple
                  placeholder="请选择"
                  filterable
              >
                <el-option
                    v-for="item in selectIndic"
                    :key="item.outId"
                    :label="item.outValue"
                    :value="item.outId"
                ></el-option>
              </el-select>
            </span>
                        <span v-else>{{scope.row.indicatorList}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作"  fixed="right" 
                                 v-if="hasBtn(['LIMS-PROGRAM-EDIT','LIMS-PROGRAM-DEL','LIMS-PROGRAM-BATCH'])">
                    <template slot-scope="scope">
            <span v-if="scope.row.edit">
              <el-button type="text" size="small" @click="confirmEdit(scope.row)">保存</el-button>
              <el-button
                  size="small"
                  type="text"
                  @click="cancelEdit(scope.row,scope.$index,tableData)"
              >取消</el-button>
            </span>
                        <span v-else>
              <el-button type="text" size="small" @click="editClick(scope.row)"
                         v-has="'LIMS-PROGRAM-EDIT'">编辑</el-button>
              <el-button
                  size="small"
                  type="text"
                  @click="deleteProgram(scope.row,scope.$index,tableData)"
                  v-has="'LIMS-PROGRAM-DEL'"
              >删除</el-button>
            </span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="fl batch-btn-padding">
                <el-row>
                    <el-col :span="24">
                        <el-button :disabled="batchBtn" style="margin:0px 0px 0px 2px;" type="danger" @click="batchDel" v-has="'LIMS-PROGRAM-BATCH'">
                            批量删除
                        </el-button>
                    </el-col>
                </el-row>
            </div>
            <Pagination
                :total="total"
                :page.sync="page.pageNum"
                :limit.sync="page.pageSize"
                @pagination="getData"
            />
        </div>

    </div>
</template>

<script>
    import Pagination from "@/components/Pagination";
    import {simpleDateFormat} from "@/utils/index";
    import {
        getOutListAll,
        getProgramInfo,
        saveProgramInfo,
        deleteProgramInfo,
        deleteProgramInBatch,
        getLabMaterial
    } from "@/api/lims";
    import {hasBtn} from "@/utils/index";

    export default {
        name: "program",
        components: {
            Pagination
        },
        data() {
            return {
                page: {
                    pageNum: 1,
                    pageSize: 10
                },
                page1: {
                    current: 1,
                    size: 10
                },
                queryForm: {
                    labProgram: ""
                },
                total1: 0,
                total: 0,
                loading: false,
                tableData: [],
                showMore: false,
                editRow: false,
                batchBtn: true,
                queryParam: "",
                sels: [], // 选择行数据
                selId: "", // 选中行ID
                selectIndic: {},
                selectProgram: [],
                selRow:{}
            };
        },
        activated() {
            this.getData();
            this.getOut();
            this.getProgramList();
        },
        methods: {
            hasBtn,
            editClick(row) {
                if (this.editRow) {
                    this.$message.error("有未保存的信息，请保存或取消");
                    return false;
                }
                this.setProgram(row);
                row.edit = !row.edit;
                this.editRow = true
            },
            remoteProgram(param){
              this.queryParam = param;
              this.getProgramList();
            },
            getData(pageNum) {
                if (pageNum === 1)
                    this.page.pageNum = 1;
                const params = {
                    ...this.page,
                    ...this.queryForm
                };
                this.editRow = false;
                getProgramInfo(params)
                    .then(res => {
                        const items = res.data.data.rows;
                        this.tableData = items.map(v => {
                            this.$set(v, "edit", false); // https://vuejs.org/v2/guide/reactivity.html
                            v.originalName = v.proName;
                            v.originalType = v.ifIncoming;
                            v.originalMat = v.matId;
                            v.originalIndic = v.indicatorList; //  will be used when user click the cancel botton
                            v.proIndicatorEdit = v.proIndic.split(",");
                            v.originalIndicId = v.proIndic;
                            return v;
                        });
                        this.total = res.data.data.total;
                    })
                    .catch(e => {
                        this.$message.error(e.message);
                    });
            },
            addProgram(tableData, event) {
                if (this.editRow) {
                    this.$message.error("有未保存的信息，请保存或取消");
                    return false;
                }
                tableData.unshift({
                    proId: null,
                    proName: "",
                    proIndic: "",
                    matId: "",
                    proIndicatorEdit: "",
                    edit: true,
                    ifIncoming: 0
                });
                this.editRow = true
            },
            deleteProgram(row, index, list) {
                if (row.proId != null) {
                    this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                        .then(() => {
                            deleteProgramInfo(row.proId).then((res) => {
                                if(res.data.success) {
                                    this.getData(1);
                                    this.$message.success("删除成功!");
                                }else{
                                    this.$message.warning(res.data.message);
                                }
                            }).catch((e) => {
                                this.$message.error(e.message);
                            });
                        })
                        .catch(() => {
                            this.$message.info("已取消删除");
                        });
                } else {
                    list.splice(index, 1);
                    this.$message.warning("已经取消添加");
                }
            },
            batchDel() {
                this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    deleteProgramInBatch(this.sels).then(response => {
                        const result = response.data;
                        if (result.success) {
                            this.$message.success("批量删除成功");
                            // 刷新页面
                            this.getData(1);
                        } else {
                            this.$message.warning(result.message);
                        }
                    }).catch((e) => {
                        this.$message.error(e.message);
                    });
                }).catch(() => {
                    this.$message.info("已取消删除");
                });
            },
            selChange: function (sels) {
                this.sels.length = 0;
                const _this = this;
                sels.forEach(element => {
                    if (!!element.proId) {
                        _this.sels.push(element.proId);
                    }
                });
                this.batchBtn = this.sels.length === 0;
            },
            getOut() {
                getOutListAll()
                    .then(res => {
                        this.selectIndic = res.data.data;
                    })
                    .catch(e => {
                        this.$message.error(e.message);
                    });
            },
            getProgramList(row) {
                let item = {
                    ...this.page1,
                    materialCode: "",
                    materialName: ""
                };
                if(this.queryParam !== null){
                    item.materialName = this.queryParam;
                }
                getLabMaterial(item)
                    .then(res => {
                        const result = res.data;
                        if(result.success) {
                            this.total1 = result.data.total;
                            this.selectProgram = result.data.result;
                            if (this.editRow && row !== undefined) {
                                this.setProgram(row);
                            }
                        }else{
                            this.$message.error(result.message);
                        }
                    })
                    .catch(e => {
                        this.$message.error(e.message);
                    });
            },
            setProgram(row){
                if(!!this.selectProgram) {
                    for (let i = 0; i < this.selectProgram.length; i++) {
                        if (row.matId === this.selectProgram[i].id) {
                            row.proName = this.selectProgram[i];
                            break;
                        }
                    }
                }
            },
            cancelEdit(row, index, list) {
                if (row.proId != null) {
                    row.proName = row.originalName;
                    row.ifIncoming = row.originalType;
                    row.matId = row.originalMat;
                    row.indicatorList = row.originalIndic;
                    row.proIndicatorEdit = row.originalIndicId.split(",");
                    row.edit = false;
                    this.$message.warning("已经取消编辑");
                } else {
                    list.splice(index, 1);
                    this.$message.warning("已经取消添加");
                }
                this.editRow = false;
                this.queryParam = "";
                this.getProgramList();
            },
            confirmEdit(row) {
                let flag = row.proName.toString() === row.originalName;
                if (row.proName == null || (!flag && !row.proName.materialName) || row.proIndicatorEdit.length === 0) {
                    this.$message.warning("不能为空");
                    return false;
                }
                if(row.proIndicatorEdit.length > 100){
                    this.$message.warning("最多勾选100个分析项");
                    return false;
                }
                if(!flag){
                    row.matId = row.proName.id;
                    row.ifIncoming = row.proName.category.toString() === "4"? 1 : 0;
                    row.proName = row.proName.materialName;
                }
                row.proIndic = row.proIndicatorEdit.toString();
                saveProgramInfo(row)
                    .then(response => {
                        const result = response.data;
                        if (result.success) {
                            this.$message.success("保存成功");
                            this.getData();
                            this.queryParam = "";
                            this.getProgramList();
                        } else {
                            this.$message.error(result.message);
                        }
                    })
                    .catch(e => {
                        this.$message.error(e.message);
                    });
            },
            clearSearchBox() {
                this.queryForm = {
                    labProgram: ''
                };
                this.getData(1);
            }
        }
    };
</script>

<style scoped>
    .edit-input {
        padding-right: 100px;
    }
</style>
<style>
    .program .el-checkbox {
        left: 12px;
    }
</style>
