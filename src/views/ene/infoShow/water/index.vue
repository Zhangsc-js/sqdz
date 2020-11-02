<template>
    <div >
        <router-view :key="key"/>
    </div>
</template>

<script>
    export default {
        name: "water",
        computed:{
            key(){
                return this.$route.name ? this.$route.name + +new Date():this.$route + + new Date();
            }
        }
    }
</script>

<style scoped>

</style>
