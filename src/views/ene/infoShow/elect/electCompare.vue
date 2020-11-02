<template>
    <!--    <div style="padding-top:50px; padding-left: 20px">
            车间用电报表
        </div>-->
    <div style="padding-top:50px; padding-left: 20px">
        <iframe
                width='100%' height='100%'
                align="center"
                class="show-iframe"
                frameborder=0
                name="showHere"
                scrolling="no"
                :src="reportUrl+'=ene/elect/compare/compare.rpx'"
        />
    </div>
</template>

<script>
    export default {
        name: "electCompare",
        data(){
            return{
                reportUrl: process.env.VUE_APP_REPORT_URL
            }
        },
        mounted() {
            const oIframe = document.getElementsByClassName('show-iframe');
            console.log(oIframe);
            const deviceWidth = document.documentElement.clientWidth;
            const deviceHeight = document.documentElement.clientHeight;
            for (var item of oIframe) {
                item.style.width = deviceWidth * 0.8 + 'px';
                item.style.height = deviceHeight * 0.9 + 'px';
            }
            // this.showIframe()
        },
        methods: {}

    }
</script>

<style scoped>

</style>
