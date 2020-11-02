<template>
    <el-container style="padding-top:24px" class="reportConfig">
        <div class="tableshadow" style="width: 100%;">
                <el-tabs v-model="activeName" type="border-card">
                    <el-tab-pane label="对比分析" name="first" lazy>
                        <reportCATConfig/>
                    </el-tab-pane>
                    <el-tab-pane label="同比分析" name="second" lazy>
                        <reportYOYConfig/>
                    </el-tab-pane>
                    <el-tab-pane label="环比分析" name="third" lazy>
                        <report-chain-config/>
                    </el-tab-pane>
                </el-tabs>
        </div>
    </el-container>
</template>

<script>

    import reportYOYConfig from '@/views/ene/infoManager/reportConfig/reportYOYConfig'
    import reportCATConfig from '@/views/ene/infoManager/reportConfig/reportCATConfig'
    import reportChainConfig from '@/views/ene/infoManager/reportConfig/reportChainConfig'

    export default {
        name: "reportConfig",
        components: {
            reportYOYConfig,
            reportCATConfig,
            reportChainConfig
        },
        data(){
            return{
                activeName:'first'
            }
        }
    }
</script>
<style>
    .reportConfig .workshop-wrapper.el-scrollbar__wrap {
        overflow-x: hidden !important;
    }
</style>
<style lang="scss" scoped>
    .date-radio {
        width: 200px;
    }

    .workshop-panel {
        padding: 15px 20px;

        .el-checkbox {
            display: block;
            margin-top: 10px;
        }
    }

    .form-panel {
        overflow-y: auto;
    }
</style>
