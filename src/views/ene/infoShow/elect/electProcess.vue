<template>
    <!--    <div style="padding-top:50px; padding-left: 20px">
            车间用电报表
        </div>-->
    <div style="padding-top:60px; padding-left: 20px">

        <el-tabs v-model="activeName">
            <el-tab-pane label="日分析" name="first" lazy>
                <iframe
                        align="center"
                        class="show-iframe"
                        frameborder=0
                        name="showHere"
                        scrolling=no
                        :src="reportUrl+'=ene/elect/process/ene_electProcessDay.rpx'"
                />
            </el-tab-pane>
            <el-tab-pane label="月分析" name="second" lazy>
                <iframe
                        align="center"
                        class="show-iframe"
                        frameborder=0
                        name="showHere"
                        scrolling=no
                        :src="reportUrl+'=ene/elect/process/ene_electProcessMonth.rpx'"
                />
            </el-tab-pane>
            <el-tab-pane label="年分析" name="third" lazy>
                <iframe
                        align="center"
                        class="show-iframe"
                        frameborder=0
                        name="showHere"
                        scrolling=no
                        :src="reportUrl+'=ene/elect/process/ene_electProcessYear.rpx'"
                />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    export default {
        name: "electProcess",
        data(){
            return{
                reportUrl: process.env.VUE_APP_REPORT_URL,
                activeName:'first'
            }
        },
        mounted() {
            const oIframe = document.getElementsByClassName('show-iframe');
            const deviceWidth = document.documentElement.clientWidth;
            const deviceHeight = document.documentElement.clientHeight;
            for (var item of oIframe) {
                item.style.width = deviceWidth * 0.8 + 'px';
                item.style.height = deviceHeight * 0.876 + 'px';
            }
            // this.showIframe()
        },
        methods: {}

    }
</script>

<style scoped>

</style>
