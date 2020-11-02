import { constantRouterMap } from '@/router/index'

const userMap = {
  admin: {
    roles: ['admin'],
    token: 'admin',
    introduction: '我是超级管理员',
    avatar: '/src/assets/images/wangye.jpg',
    name: 'Super Admin',
    adminId: 9527
  }
}

export default {
  loginByUsername: config => {
    const { username } = JSON.parse(config.body)
    // const username = 'admin'
    return userMap[username]
  },
  getUserInfo: () => {
    if (userMap['admin']) {
      return userMap['admin']
    } else {
      return false
    }
  },
  logout: () => 'success',
  getMenu: () => {
    return constantRouterMap
  },
  updateMenu: () => {
    return [
      { path: '/login', component: () => import('@/views/login/index'), hidden: true },
      { path: '/404', component: () => import('@/views/404'), hidden: true },
      { path: '*', redirect: '/404', hidden: true }
    ]
  }
}
