import request from '@/utils/request'
import { getMenu, menuInit } from "@/api/sys"
import commonApi from "@/utils/common";
import { asyncRouterMap, constantRouterMap } from "../router";
import Layout from "@/views/layout/Layout"
import store from '@/store'
import Vue from 'vue'




const api = "/sys/permission"

export function list(data) {
    return request({
        method: 'GET',
        url: `${api}`,
        params: {
            ...data
        }
    })
}

export function add(data) {
    return request({
        method: 'POST',
        url: `${api}`,
        data: {
            ...data
        }
    })
}

export function update(data) {
    return request({
        method: 'PUT',
        url: `${api}/${data.id}`,
        data: {
            ...data
        }
    })
}

export function remove(data) {
    return request({
        method: 'delete',
        url: `${api}/${data.id}`,
        params: {
            ...data
        }
    })
}

export function detail(data) {
    return request({
        method: 'GET',
        url: `${api}/${data.id}`,
        params: {
            ...data
        }
    })
}

export function saveOrUpdate(data) {
    return data.id ? update(data) : add(data)
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */

// function filterAsyncRouter(asyncRouterMap, roles) {
//     const accessedRouters = asyncRouterMap.filter(route => {
//         if (hasPermission(roles, route)) {
//             const children = route.children;
//             if (children && children.length) {
//                 route.children = filterAsyncRouter(children, roles)
//             }
//             return true
//         }
//         return false
//     })
//     return accessedRouters
// }

const router404 = [{
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
},
{
    path: '*',
    redirect: '/404',
    hidden: true
}
]
const permission = {
    state: {
        routers: asyncRouterMap,
        addRouters: []
    },
    mutations: {
        SET_ROUTERS: (state, routers) => {
            state.routers = constantRouterMap.concat(routers)
        },
        SET_ADD_ROUTERS: (state, addRouters) => {
            state.addRouters = addRouters
        }
    },
    actions: {
        GenerateRoutes({ commit }) {
            return new Promise(resolve => {
                // const {
                //     roles
                // } = data;
                //动态构造权限列表
                // let accessedRouters = filterAsyncRouter([], roles).concat(router404)
                // TODO 菜单配置完毕后去掉
                let arr = []
                let userCode = store.getters.userCode
                menuInit(userCode).then(response => {
                    let data = response.data
                    arr = data.data.menuList
                    // arr = data.data
                    sessionStorage.setItem('btnList', JSON.stringify(data.data.buttonList))
                    let newArr = formatRouter(arr)
                    sessionStorage.setItem('menuList', JSON.stringify(newArr))
                    let accessedRouters = newArr.concat(router404)
                    // accessedRouters = isHidden.concat(accessedRouters)
                    setRouter(accessedRouters);
                    commit('SET_ROUTERS', accessedRouters)
                    commit('SET_ADD_ROUTERS', routerArr)
                    resolve()
                })

            })
        }
    }
}

export default permission

// 检查是否有权限
export function hasPermission(roles, route) {
    if (roles.menus && route.childrenKey) {
        return roles.menus.some(role => {
            let index = route.childrenKey.toLowerCase().indexOf(role.toLowerCase());
            return index > -1
        })
    } else if (roles.menus && route.name) {
        return roles.menus.some(role => {
            return route.name.toLowerCase() === role.toLowerCase();
        })
    }
    else {
        return false
    }
}

// 检查是否有权限点
export function hasPermissionPoint(point) {
    let points = store.getters.roles.points
    if (points) {
        return points.some(it => it.toLowerCase() === point.toLowerCase())
    } else {
        return false
    }
}

// 格式化路由信息
let isHidden = [
    {
        path: '/ene/compared/template/1',
        name: 'waterReportCATemplate',
        component: () => import('@/views/ene/infoShow/report/reportCATemplate'),
        hidden: true,
        meta: { title: '对比分析模板', icon: 'dashboard', requiresArg: false, }
    },
    {
        path: '/ene/compared/template/2',
        name: 'waterReportYOYTemplate',
        component: () => import('@/views/ene/infoShow/report/reportYOYTemplate'),
        hidden: true,
        meta: { title: '同比分析模板', icon: 'dashboard', requiresArg: false, yoyTemplate: 'yoyTemplate' }
    },
    {
        path: '/ene/compared/template/3',
        name: 'waterReportChainTemplate',
        component: () => import('@/views/ene/infoShow/report/reportChainTemplate'),
        hidden: true,
        meta: { title: '环比分析模板', icon: 'dashboard', requiresArg: false, chainTemplate: 'chainTemplate' }
    },
]
function formatRouter(data) {
    if (!data) {
        data = []
    }
    data.map(item => {
        if (typeof (item.meta) == "string") {
            const meta = JSON.parse(item.meta);
            // if (item.children) {
            //     if (count == 0) {
            //         console.log(item.children)
            //         item.children.concat(isHidden)
            //         console.log(item.children)
            //         count++
            //     }
            // }
            item.meta = meta;
            if (!item.meta.icon || item.meta.icon.split('-')[0] == 'el') {
                // 随机去一个图标
                let arr = ['device', 'lims_qm', 'ene_typemanager', 'ene_manager', 'weighing']
                item.meta.icon = arr[Math.floor((Math.random() * arr.length))]
            }
            let com = item.component
            let params = item.component
            let link = item.component
            if (!com) {
                com = 'layout'

            }
            com = com.split('?')[0]
            if (com.toLowerCase() === "layout") {
                Vue.set(item, 'path', '/' + com + '/' + Math.random())
                item.component = Layout;
                Vue.set(item, 'name', '')
            } else {
                if (params.indexOf('?') > -1) {
                    params = params.split('?')[1]
                    Vue.set(item, 'path', '/' + com + '/' + params)
                } else {
                    Vue.set(item, 'path', '/' + com)
                }
                let arr = link.split('/')
                let a = arr[arr.length - 1]
                let b = arr[arr.length - 2]
                Vue.set(item, 'name', b + '-' + a)
                item.component = resolve => require([`@/views/${com}.vue`], resolve);
            }
            if (com.slice(0, 4).toLowerCase() === 'http') {
                Vue.set(item, 'path', link)
            }
            // if (item.meta.title == '对比分析') {
            //     Vue.set(item, 'path', '/ene/water/compared/1')
            //     Vue.set(item, 'name', 'compared-1')
            // }
            // if (item.meta.title == '同比分析') {
            //     Vue.set(item, 'path', '/ene/water/compared/2')
            //     Vue.set(item, 'name', 'compared-2')

            // }
            // if (item.meta.title == '环比分析') {
            //     Vue.set(item, 'path', '/ene/water/compared/3')
            //     Vue.set(item, 'name', 'compared-3')
            // }
            if (item.meta.title === '能源管理') {
                item.children = item.children.concat(...isHidden)
            }
        }
        // const childNames = [];
        // const getChildName = function (childData) {
        //     // 若无children字段 则为空数组
        //     if (!childData) {
        //         childData = []
        //     }
        //     childData.map(cItem => {
        //         childNames.push(cItem.name);
        //         if (cItem.children && cItem.children.length > 0) {
        //             getChildName(cItem.children);
        //         }
        //     });
        // };
        if (item.children && item.children.length > 0) {
            // getChildName(item.children);
            // item.childrenKey = childNames.join(',');
            formatRouter(item.children);
        }
    });
    return data
}


let routerArr = [];

/**
 * 多级嵌套路由降为二级，解决keep-alive在路由嵌套时造成的bug
 */
const getAllChildren = (data) => {
    let arr = [];
    let getChild = (parent) => {
        parent.children.map(child => {
            if (!!child.children && child.children.length > 0) {
                getChild(child)
            } else {
                arr.push(child)
            }
        })
    }
    getChild(data);
    return arr;
}

const setRouter = (routerData) => {
    routerArr = []
    routerData.map(item => {
        let itemI = {
            ...item
        };
        !!itemI.children && (itemI.children = getAllChildren(item));
        routerArr.push(itemI)
    })
}
