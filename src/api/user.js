import request from '@/utils/request'

export function getInfo(token) {
  return request({
    url: '/info',
    method: 'post',
    params: { token}
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}