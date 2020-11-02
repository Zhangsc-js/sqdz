<template>
    <div>
        <el-carousel :interval="4000" type="card" height="300px">
            <el-carousel-item v-for="item in proImgList" :key="item.id">
                <img width="100%" :src="item.url" :alt="item.name">
            </el-carousel-item>
        </el-carousel>

        <el-form ref="data" :model="data" label-width="160px">
            <el-row :gutter="20">
                <el-col :span="12">
                    <div class="grid-content"><b>设备名称： </b>{{ data.sbmc }}</div>
                </el-col>
                <el-col :span="12">
                    <div class="grid-content"><b>设备信息： </b>{{ data.sbmcEn }}</div>
                </el-col>
                <el-col :span="12">
                    <div class="grid-content"><b>规格型号： </b>{{ data.standard}}</div>
                </el-col>
                <el-col :span="12">
                    <div class="grid-content"><b>测量范围： </b>{{ data.measureScope}}</div>
                </el-col>
                <el-col :span="12">
                    <div class="grid-content"><b>使用车间： </b>{{data.useWorkshop}}</div>
                </el-col>
                <el-col :span="12">
                    <div class="grid-content"><b>使用单位： </b>{{data.useDepartment}}</div>
                </el-col>
                <el-col :span="12">
                    <div class="grid-content"><b>使用工序： </b>{{data.useProcess}}</div>
                </el-col>
                <el-col :span="12">
                    <div class="grid-content"><b>上报周期： </b>{{data.cycleReport}}</div>
                </el-col>
                <el-col :span="12">
                    <div class="grid-content"><b>计量上限： </b>{{data.meteringUpper}}</div>
                </el-col>
                <el-col :span="12">
                    <div class="grid-content"><b>计量下限： </b>{{data.meteringLower}}</div>
                </el-col>
                <el-col :span="12">
                    <div class="grid-content"><b>ABC分类： </b>{{data.abcFl}}</div>
                </el-col>
                <el-col :span="12">
                    <div class="grid-content"><b>精度： </b>{{data.jd}}</div>
                </el-col>
                <el-col :span="12">
                    <div class="grid-content"><b>出厂时间： </b>{{data.ccTime}}</div>
                </el-col>
                <el-col :span="12">
                    <div class="grid-content"><b>出厂编号： </b>{{data.ccCode}}</div>
                </el-col>
                <el-col :span="12">
                    <div class="grid-content"><b>备注： </b>{{data.bz}}</div>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel()">取 消</el-button>
        </div>
    </div>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex'
    import {FILE_DOWNLOAD_URL, getDevImg} from '@/api/weighing'
    const { mapState, mapActions} = createNamespacedHelpers('weiDevice')
    export default {
        name: "WeiDevAttrDtl",
        data(){
            return {
                proImgList: [],
                // dataOne:{}
            }
        },
        props: ['data', 'equipId','flag'],
        computed: {
            ...mapState(['selectedRowId', 'weiDevAttr'])
        },
        mounted() {
            this.getDevImg();
            this.getWeiDevDetail(this.selectedRowId)
            // this.dataOne = this.getWeiDevDetail(this.selectedRowId)
            // console.log(this.dataOne)
        },
        watch: {
            selectedRowId() {
                this.getWeiDevDetail(this.selectedRowId)
            },
            equipId() {
                this.getDevImg();
            },
            flag(){
                this.getDevImg();
            }
        },
        methods: {
            ...mapActions(['getWeiDevDetail']),
            getDevImg() {
                const params = {
                    sbdm: this.data.sbdm,
                    // console.log()
                    fileType: 3,
                };
                // console.log(this.dataOne[0]);
                getDevImg(params).then(res => {
                    const result = res.data.data;
                    // 将原有数据置空
                    const images = [];
                    if (result) {
                        for (let item of result) {
                            images.push({
                                id: item.id,
                                name: item.fileName,
                                url: process.env.VUE_APP_DEV_IMAGE_URL + item.uploadName
                            })
                        }
                    }
                    this.proImgList = images;
                }).catch(e => {
                    this.$message.error(e.message);
                });
            },
            cancel() {
                this.$emit("dtlHidenDialog")//detailHidenDialog
            }
        }
    }
</script>

<style scoped>
    .el-col {
        margin-bottom: 20px;
    }

    .grid-content {
        padding: 0 12px;
        border-radius: 4px;
        min-height: 36px;
        line-height: 36px;
    }

    .span {
        display: inline-block;
        width: 120px;
    }
</style>

