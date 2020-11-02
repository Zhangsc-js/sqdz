import request from '@/utils/request'
export function login(userInfo) {
  return request({
    url: '/sys/empyes/login',
    method: 'POST',
    data: userInfo
  })
}

export function profile() {
  return request({
    url: '/sys/empyes/profile',
    method: 'POST',
    params: {}
  })
}

export function getInfo(token) {
  return request({
    url: '/info',
    method: 'POST',
    data: token
  })
}

export function logout() {
  return request({
    url: '/sys/empyes/logout',
    method: 'POST'
  })
}

export function getMenu(param){
  return request({
    url: '/sys/getMenu',
    method: 'POST',
    params: {
      ...param
    }
  })
}

export function updateMenu(param) {
  return request({
    url: '/sys/updateMenu',
    method: 'POST',
    params: {
      ...param
    }
  })
}
