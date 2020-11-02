<!--
<template>
    <div class="accept-container" style="padding-top:50px;width: 100%;height: 100%">
        <iframe
                align="center"
                id="show-iframe"
                frameborder=0
                name="showHere"
                scrolling=no
                src="http://localhost:1100/demo/Gantt.html"
        />
    </div>
</template>
<script>
    export default {
        name: "inOutAnalysis",
        // data(){
        //     return{
        //         reportUrl: process.env.VUE_APP_REPORT_URL
        //     }
        //
        // },
        mounted() {
            const oIframe = document.getElementById('show-iframe')
            const deviceWidth = document.documentElement.clientWidth;
            const deviceHeight = document.documentElement.clientHeight;
            // for ( var item of oIframe){
            oIframe.style.width = deviceWidth*0.82 + 'px';
            oIframe.style.height = deviceHeight*0.876 + 'px';
            // }
        },
    }
</script>

<style scoped>

</style>
-->
<template>
    <div>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: "plannedProduction"
    }
</script>

<style scoped>

</style>
