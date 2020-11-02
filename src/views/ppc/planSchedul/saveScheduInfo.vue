<!--<template>-->
<!--    <div>-->
<!--        <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">-->
<!--            <el-row>-->
<!--                <el-col :span="12">-->
<!--                    <el-form-item label="序号">-->
<!--                        <el-input v-model="queryForm.index" placeholder="请输入序号"></el-input>-->
<!--                    </el-form-item>-->
<!--                </el-col>-->
<!--                <el-col :span="12">-->
<!--                    <el-form-item label="排班名称">-->
<!--                        <el-input v-model="queryForm.planName" placeholder="请输入物理编码"></el-input>-->
<!--                    </el-form-item>-->
<!--                </el-col>-->
<!--            </el-row>-->
<!--            <el-row>-->
<!--                <el-col :span="12">-->
<!--                    <el-form-item label="车间">-->
<!--                        <el-select multiple v-model="queryForm.ids" filterable placeholder="请选择">-->
<!--                            <el-option-->
<!--                                    v-for="item in workshop"-->
<!--                                    :key="item.id"-->
<!--                                    :label="item.name"-->
<!--                                    :value="item.id">-->
<!--                            </el-option>-->
<!--                        </el-select>-->
<!--                    </el-form-item>-->
<!--                </el-col>-->
<!--                <el-col :span="12">-->
<!--                    <el-button type="primary" @click="saveSchedulPlan()">保存</el-button>-->
<!--                    <el-button @click="cancel()">取消</el-button>-->
<!--                </el-col>-->
<!--            </el-row>-->
<!--        </el-form>-->


<!--    </div>-->
<!--</template>-->

<!--<script>-->
<!--    import {queryWorkShop,addSchedulPlan } from "@/api/productionPlanning";-->

<!--    export default {-->
<!--        name: "saveScheduInfo",-->
<!--        components: {},-->
<!--        data() {-->
<!--            return {-->
<!--                queryForm: {-->
<!--                    id:'',-->
<!--                    index: '',-->
<!--                    planName: '',-->
<!--                    ids: [],-->
<!--                    shopMap:[],  //多选车间集合-->
<!--                },-->
<!--                workshop: [],   //车间初始下拉数据-->
<!--                shops:{          //车间对象-->
<!--                    id:'',-->
<!--                    name:''-->
<!--                }-->
<!--            }-->
<!--        },-->
<!--        methods: {-->
<!--            getData() {-->
<!--                queryWorkShop().then((response) => {-->
<!--                    let data = response.data;-->
<!--                    this.workshop = data.data;-->
<!--                })-->
<!--            },-->
<!--            saveSchedulPlan(){-->
<!--                this.queryForm.shopMap = [];-->
<!--                for(let j = 0; j < this.queryForm.ids.length; j++){-->
<!--                    for(let i = 0; i < this.workshop.length; i++){-->
<!--                        if(this.workshop[i].id == this.queryForm.ids[j]) {-->
<!--                            this.queryForm.shopMap.push({-->
<!--                                id:this.workshop[i].id,-->
<!--                                name:this.workshop[i].name-->
<!--                            });-->
<!--                        }-->
<!--                    }-->
<!--                }-->
<!--                addSchedulPlan(this.queryForm).then((response) =>{-->
<!--                    if(response.data.success) {-->
<!--                        this.$message.success("新增成功！！")-->
<!--                        this.$emit("save");-->
<!--                    } else {-->
<!--                        this.$message.error(response.data.message+":"+response.data.data)-->
<!--                    }-->
<!--                })-->
<!--            },-->
<!--            cancel() {-->
<!--                this.$emit("cancel")-->
<!--            }-->
<!--        },-->
<!--        mounted() {-->
<!--            this.getData()-->
<!--        },-->
<!--    }-->
<!--</script>-->