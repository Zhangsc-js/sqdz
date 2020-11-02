import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

const whiteList = ['/login','/shangqi'] // 不重定向白名单
// router.beforeEach((to, from, next) => {
//     NProgress.start()
//     if (getToken()) {
//         if (to.path === '/login') {
//             next({ path: '/' })
//             NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
//         } else {
//             if (store.getters.roles.length === 0) {
//                 store.dispatch('GetUserInfo')
//                     .then(res => {
//                         // 拉取user_info
//                         const roles = res.data.data.roles // note: roles must be a array! such as: ['editor','develop']
//                         store.dispatch('GenerateRoutes', { roles }).then(() => {
//                             // 根据roles权限生成可访问的路由表
//                             router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
//                             next(to.path)
//                         })
//                     })
//                     .catch(() => {
//                         store.dispatch('FedLogOut').then(() => {
//                             Message.error('验证失败, 请重新登录')
//                             next({ path: '/login' })
//                         })
//                     })
//             } else {
//                 next()
//             }
//         }
//     } else {
//         if (whiteList.indexOf(to.path) !== -1) {
//             next()
//         }
//
//         else if ((to.path).search(/\/report\//) != -1) {
//             next()
//         } else {
//             next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
//             NProgress.done()
//         }
//     }
// })
//
// router.afterEach(() => {
//     setTimeout(function () {
//         NProgress.done() // 结束Progress
//     }, 500)
// })

