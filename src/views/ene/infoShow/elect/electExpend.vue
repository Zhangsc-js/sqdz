<template>
    <!--    <div style="padding-top:50px; padding-left: 20px">
            车间用电报表
        </div>-->
    <div style="padding-top:60px; padding-left: 20px">
        <iframe
                align="center"
                class="show-iframe"
                frameborder=0
                name="showHere"
                scrolling=no
                :src="reportUrl+'=ene/elect/expend/electExpend.rpx'"
        />
    </div>
</template>

<script>
    export default {
        name: "electExpend",
        data(){
            return{
                reportUrl: process.env.VUE_APP_REPORT_URL
            }
        },
        mounted() {
            const oIframe = document.getElementsByClassName('show-iframe');
            const deviceWidth = document.documentElement.clientWidth;
            const deviceHeight = document.documentElement.clientHeight;
            for (var item of oIframe) {
                // item.height = (item.Document?item.Document.body.scrollHeight:item.Document.body.offsetHeight);
                item.style.width = deviceWidth * 0.8 + 'px';
                item.style.height = deviceHeight * 0.9 + 'px';
            }
            // this.showIframe()
        },
        methods: {

        }

    }
</script>

<style scoped>

</style>
