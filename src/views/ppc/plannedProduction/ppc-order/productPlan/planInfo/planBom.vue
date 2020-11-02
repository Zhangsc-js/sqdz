<template>
    <div>
        <el-table
                :data="treeData"
                row-key="uuid"
                height="100%"
                style="width: 100%;"
                highlight-current-row
                border
                :default-expand-all="true"
                :expand-on-click-node="false"
                :tree-props="{children: 'children',hasChildren:false}">
            <el-table-column prop="materialCode" label="物料代码" >
            </el-table-column>
            <el-table-column prop="code" label="BOM编码"  >
            </el-table-column>
            <el-table-column prop="name" label="BOM名称"  >
            </el-table-column>
            <el-table-column prop="type" :formatter="statusFormat" label="物料类型"  >
            </el-table-column>
            <el-table-column prop="ver" label="版本"  >
            </el-table-column>
            <el-table-column prop="qty" label="用量"  >
            </el-table-column>
            <el-table-column prop="unit"  label="单位"  >
            </el-table-column>
        </el-table>
    </div>

</template>



<script>
    import {getBomProdTree,treeDataDetailAll,queryStatus} from "@/api/productionPlanning";

    export default {
        name: "planBom",
        components: {
        },
        data() {
            return {
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                treeData: [],
                DialogVisible: false,
                showMore: null,
                objId: '',
                expandedKeys: [],
                bomStatusList:[]
            }
        },
        props: {
            id: {
                type: String,
                required: true
            },
            bomCode: {
                type: String,
                required: true
            },
        },
        watch: {
            id () {
                this.getData();
            }
        },
        // mounted() {
        //     this.getData();
        // },
        methods: {
            getData() {
                if(this.bomCode){
                    getBomProdTree(this.id,this.bomCode).then((response) => {
                        this.treeData = response.data.data
                        this.queryStatus();
                    }).catch(e => {
                        this.$message({
                            type: 'error',
                            message: e.message,
                            duration: 3 * 1000
                        })
                    });
                }
            },
            queryStatus(){
                queryStatus().then((response) =>{
                    let result = response.data
                    if(result.success){
                        this.bomStatusList = result.data.MATERIAL_CATEGORY
                    }
                })
            },
            load(tree,treeNode, resolve){
                treeDataDetailAll(tree.id).then((response) => {
                    setTimeout(() => {
                        resolve(response.data.data)
                    })
                    // resolve =
                }).catch(e => {
                    this.$message({
                        type: 'error',
                        message: e.message,
                        duration: 3 * 1000
                    })
                });
            },
            renovate() {
                this.getdata();
            },
            handleNodeClick(data) {
                this.objId = data.id;
                // this.DialogVisible = true
            },
            statusFormat(row, column) {
                for (var i=0 ;i<this.bomStatusList.length ;i++) {
                    if(row.type==this.bomStatusList[i].code){
                        return this.bomStatusList[i].label
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .contextmenu {
        margin: 0;
        background: #fff;
        z-index: 3000;
        position: absolute;
        list-style-type: none;
        padding: 5px 0;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 400;
        color: #333;
        box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

        li {
            margin: 0;
            padding: 7px 16px;
            cursor: pointer;

            &:hover {
                background: #eee;
            }
        }
    }

</style>
