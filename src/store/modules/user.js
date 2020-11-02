import { login, logout, profile, getMenu, updateMenu } from "@/api/login"
import { getToken, setToken, removeToken } from "@/utils/auth"
import { Message, Notification } from "element-ui"
import { getMember } from "@/api/sys/activiti"
import router from '@/router'

const userRoles = sessionStorage.getItem("userRoles")
const user = {
    state: {
        token: getToken(),
        workCode: "",
        avatar: "",
        roles: userRoles ? JSON.parse(userRoles) : [],
        menu: [],
        userMember: [],
        permission: [],
        companyName: '',
        userCode: '',
        userName: ''
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_WORKCODE: (state, workCode) => {
            state.workCode = workCode
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_MEMBER: (state, member) => {
            state.userMember = member
        },
        SET_PERMISSION: (state, permission) => {
            state.permission = permission
        },
        SET_COMPANY: (state, companyName) => {
            state.companyName = companyName
        },
        SET_USERCODE: (state, userCode) => {
            state.userCode = userCode
        },
        SET_USERNAME: (state, userName) => {
            state.userName = userName

        }
    },

    actions: {
        // 登录
        Login({ commit }, userInfo) {
            const username = userInfo.username.trim()
            return new Promise((resolve, reject) => {
                login(userInfo).then(res => {
                    if (res.data.code !== 10000) {
                        Message.error(res.data.message)
                        reject(res.data.message)
                    } else {
                        const data = res.data.data;
                        commit("SET_TOKEN", data)
                        setToken(data)
                        resolve()
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 获取用户信息
        GetUserInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                profile().then(response => {
                    const data = response.data.data
                    commit("SET_ROLES", data.roles ? data.roles : { menus: [], points: [] })
                    commit("SET_WORKCODE", data.userCode)
                    commit("SET_COMPANY", data.companyName)
                    commit('SET_USERCODE', data.userCode)
                    commit('SET_USERNAME', data.userName)
                    resolve(response)
                    getMember({ work: data.userCode }).then(res => {
                        let data = res.data;
                        if (data.success) {
                            let members = data.data.map(item => {
                                return item.GROUP_ID;
                            })
                            commit("SET_MEMBER", members)
                        }
                    })
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 登出
        LogOut({ commit, state }) {
            return new Promise((resolve, reject) => {
                logout(state.token).then(() => {
                    commit("SET_TOKEN", "")
                    commit("SET_ROLES", [])
                    commit('SET_ROUTERS', [])
                    removeToken()
                    router.replace(`/login`)
                    sessionStorage.removeItem('btnList')
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 前端超时登出
        TimeoutLogOut({ commit }) {
            return new Promise(resolve => {
                if (getToken()) {
                    Notification.warning("登陆已过期！请重新登陆")
                    setTimeout(() => {
                        commit("SET_TOKEN", "")
                        commit("SET_ROLES", [])
                        commit('SET_ROUTERS', [])
                        removeToken()
                        router.replace(`/login`)
                        sessionStorage.removeItem('btnList')
                        resolve()
                    }, 1000)
                }
            })
        },

        // 登出(无接口)
        FedLogOut({ commit }) {
            return new Promise(resolve => {
                commit("SET_TOKEN", "")
                commit('SET_ROUTERS', [])
                commit("SET_ROLES", [])
                removeToken()
                sessionStorage.removeItem('btnList')
                resolve()
            })
        },

        // 获取菜单 zhe这是获取菜单接口，i看再哪里请求渲染
        GetMenu({ param }) {
            return new Promise((resolve, reject) => {
                getMenu(param).then(response => {
                    const menu = response.data
                    if (menu && menu.length > 0) {
                        window.sessionStorage.setItem("menu", JSON.stringify(menu))
                    } else {
                        reject("getMenu: menu must be a non-null array !")
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        UpdateMenu({ param }) {
            return new Promise((resolve, reject) => {
                updateMenu(param).then(response => {
                    const menu = response.data
                    if (menu && menu.length > 0) {
                        window.sessionStorage.setItem("menu", JSON.stringify(menu))
                    } else {
                        reject("updateMenu: menu must be a non-null array !")
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        }
    }
}

export default user
