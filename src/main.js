

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css
import '@/permission' // permission control
import '@/assets/icons'


import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'   // ./store/index.js。当前组件对象多了一个$store属性 ，他是store对象

// import 'mockjs'
// import './mock'
import 'babel-polyfill'
import resetScreenSize from './utils/resize.js'
// swiper
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper)
import permission from './directive/premission'

import fullCalendar from 'vue-fullcalendar'
Vue.component('full-calendar', fullCalendar)

import '@/directive/dialogDrag'

Vue.config.productionTip = false

Vue.use(ElementUI, { locale })

import '@/utils/validForbid'
import VueCountUp from 'vue-countupjs'
import Print from '@/utils/test'
import VideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
//import  'vue-video-player/src/custom-theme.css'


Vue.use(VideoPlayer)

Vue.use(Print)
Vue.use(VueCountUp)


new Vue({
    router,
    store,
    mounted() {
        resetScreenSize(1920,1080)
        window.addEventListener('beforeunload', () => {
            // TODO
            // sessionStorage.setItem("userRoles", JSON.stringify(this.$store.state.roles));
            // sessionStorage.setItem("userMenu", JSON.stringify(this.$store.state.permission.routers));
            sessionStorage.setItem("userTagsView", JSON.stringify(this.$store.state.tagsView));
        })
    },
    render: h => h(App)
}).$mount('#app')
