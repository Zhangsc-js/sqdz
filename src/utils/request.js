import axios from 'axios'
import { Message, Notification } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { showLoading, hideLoading, destoryLoading } from '@/utils/loading'
import { UNAUTHENTICATED } from '@/constants/NumberConstants.js'
import { resetRouter } from '@/router'

// create an axios instance
const service = axios.create({
    // baseURL: process.env.VUE_APP_URL, // api 的 base_url
    timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(config => {
    // start loading
    if (!config.noLoading) {
      //  showLoading()
    }
    config.url = '/api' + config.url
    // Do something before request is sent
    if (store.getters.token) {
        config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
},
    error => {
        // Do something with request error
        return Promise.reject(error)
    })

// response interceptor
service.interceptors.response.use(response => {
    const result = response.data
    // if (response == null || response === undefined) {
    //   return Promise.reject('系统内部异常，请稍后重试')
    // }
    // const res = response.data
    // if (res.code  == null || res.code === undefined) {
    //   return response
    // }
    // if (res.code !== 10000 || res.success != true) {
    //   Message({
    //     message: res.message,
    //     type: 'error',
    //     duration: 3 * 1000
    //   })

    // 未登录
    if (result.code === UNAUTHENTICATED) {
        store.dispatch('TimeoutLogOut').then(() => {
            destoryLoading()
            // location.reload() // 为了重新实例化vue-router对象 避免bug
            resetRouter()
        })
        return Promise.reject()
    }
    //   return Promise.reject('error')
    // } else {
    //   return res.data
    // }
    // stop loding
   // hideLoading()
   return response;
},
    error => {
        // break off loding
        //  destoryLoading()
        // Message({
        //     message: error.message,
        //     type: 'error',
        //     duration: 3 * 1000
        // })
        return Promise.reject(error)
    })

export default service
