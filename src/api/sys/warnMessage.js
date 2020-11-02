
import request from '@/utils/request'
import qs from 'qs'

export function getData(params) {
    return request({
        method: 'GET',
        url: `/sys/warning/info`,
        params: params
    })
}
export function getPerson(params) {
    return request({
        method: 'GET',
        url: `/sys/warning/info/person`,
        params: params
    })
}
export function getWarnName() {
    return request({
        method: 'GET',
        url: `/sys/warning/main/map`,
    })
}

export function getDevParamWarnName() {
  return request({
      method: 'GET',
      url: `/sys/warning/main/devParamMap`,
  })
}

/**
 * 获取警报分类
 */
export function getWarningCategory() {
  return request({
    method: 'GET',
    url: `/sys/warning/info/warningCategories`,
  })
}
