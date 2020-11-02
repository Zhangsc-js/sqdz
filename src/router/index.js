import Vue from 'vue'
import Router from 'vue-router'
import device from './modules/device'
import weighing from './modules/weighing'
import energy from './modules/energy'
import lims from './modules/lims'
import sys from './modules/sys'
import productionPlanning from './modules/productionPlanning'
import Layout from "@/views/layout/Layout"
import company from './modules/company'
import operateLog from "./modules/operateLog.js";
import expireFile from "./modules/expireFile";
import employees from './modules/employees'

// import test from './modules/test'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)


// import userRouter from './modules/userRouter'
/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true
    },

    {
        path: '/shangqi',
        component: () => import('@/views/shangqi/shangqi'),
        hidden: true,
        meta: { title: '总装车间大数据运营中心',  requiresArg: false },
    },
    {
        path: '/',
        component: () => import('@/views/shangqi/shangqi1'),
        meta: { title: '上汽大众MEB大数据运营中心', requiresArg: false }
    },{
        path: '/shangqi2',
        component: () => import('@/views/shangqi/shangqi2'),
        meta: { title: '冲压车间大数据运营中心', requiresArg: false }
    },{
        path: '/shangqi3',
        component: () => import('@/views/shangqi/shangqi3'),
        meta: { title: '车身车间大数据运营中心', requiresArg: false }
    },{
        path: '/shangqi4',
        component: () => import('@/views/shangqi/shangqi4'),
        meta: { title: '电池车间大数据运营中心', requiresArg: false }
    },{
        path: '/shangqi5',
        component: () => import('@/views/shangqi/shangqi5'),
        meta: { title: '油漆车间大数据运营中心', requiresArg: false }
    },{
        path: '/shangqi6',
        component: () => import('@/views/shangqi/shangqi6'),
        meta: { title: '单车大数据运营中心', requiresArg: false }
    },{
        path: '/shangqi7',
        component: () => import('@/views/shangqi/shangqi7'),
        meta: { title: '设备大数据运营中心', requiresArg: false }
    },{
        path: '/shangqi8',
        component: () => import('@/views/shangqi/shangqi8'),
        meta: { title: 'ASRS大数据运营中心', requiresArg: false }
    },{
        path: '/shangqi9',
        component: () => import('@/views/shangqi/shangqi9'),
        meta: { title: '物流大数据运营中心', requiresArg: false }
    },
    {
        path: '/carousel',
        component: () => import('@/views/sys/Carousel'),
        hidden: true
    },
    // {
    //     path: '/',
    //     component: Layout,
    //     hidden: false,
    //     meta: { title: '首页', icon: 'home', requiresArg: false },
    //     children: [
    //         {
    //             path: '/',
    //             name: 'dashboard',
    //             component: () => import('@/views/dashboard/index'),
    //             meta: { title: '首页', icon: 'home', requiresArg: false }
    //         },
    //         {
    //             path: '/company',
    //             component: () => import('@/views/company/company-manage'),
    //             hidden: true,
    //             meta: { title: '租户公司管理', icon: 'home', requiresArg: false }
    //         },
    //         {
    //             path: '/carousel',
    //             component: () => import('@/views/sys/Carousel'),
    //             hidden: true
    //         },
    //     // {
    //     //     path: '/dev/report/runState/index',
    //     //     component: () => import('@/views/dev/report/runState'),
    //     //     hidden: true,
    //     //     meta: { title: '重点设备运行状态', icon: 'home', requiresArg: false }
    //     // },
    //     ]
    // },
    {
        path: '/403',
        component: () => import('@/views/403'),
        hidden: true
    },

]


/**
 * 导出 基础路由
 **/
// export default new Router({
//     //  mode: 'history', //后端支持可开
//     scrollBehavior: () => ({
//         y: 0
//     }),
//     routes: constantRouterMap
// })

/**
 * 导出 业务路由
 **/
export let asyncRouterMap = [
    ...device,
    ...weighing,
    ...energy,
    ...lims,
    ...sys,
    ...productionPlanning,
    ...company,
    ...operateLog,
    ...expireFile]

export const createRouter = () => new Router({
    // mode: 'history',
    scrollBehavior: () => ({
        y: 0
    }),
    routes: constantRouterMap
})

const router = createRouter()

export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // the relevant part
}

export default router
