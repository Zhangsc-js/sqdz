import request from '@/utils/request'
import qs from 'qs'

/**
 * 查询电表拓展信息
 * @param {
 *  devCode
 * } params
 */
export function findExtendElectric(params) {
  return request({
    method: 'GET',
    url: `/sys/dev/attr/electric`,
    params: params
  })
}

/**
 * 更新电表拓展信息
 * @param {
 *  DevAttrExtendElectric
 * } data
 */
export function updateExtendElectric(data) {
  return request({
    method: 'PUT',
    url: `/sys/dev/attr/electric`,
    data: data
  })
}

/**
 * 新增电表拓展信息
 * @param {
 *  DevAttrExtendElectric
 * } data
 */
export function saveExtendElectric(data) {
  return request({
    method: 'POST',
    url: `/sys/dev/attr/electric`,
    data: data
  })
}

/**
 * 查询气表拓展信息
 * @param {
 *  devCode
 * } params
 */
export function findExtendGas(params) {
  return request({
    method: 'GET',
    url: `/sys/dev/attr/gas`,
    params: params
  })
}

/**
 * 气表拓展信息更新
 * @param {
 *  DevAttrExtendGas
 * } data
*/
export function updateExtendGas(data) {
  return request({
    method: 'PUT',
    url: `/sys/dev/attr/gas`,
    data: data
  })
}

/**
 * 气表拓展信息保存
 * @param {
 *  DevAttrExtendGas
 * } data
 */
export function saveExtendGas(data) {
  return request({
    method: 'POST',
    url: `/sys/dev/attr/gas`,
    data: data
  })
}


/**
 * 查询检斤/计量表拓展信息
 * @param {
 *  devCode
 * } params
*/
export function findExtendMater(params) {
  return request({
    method: 'GET',
    url: `/sys/dev/attr/mate`,
    params: params
  })
}

/**
 * 检斤/计量拓展信息更新
 * @param {
 *  DevAttrExtendMaterage
 * } data
*/
export function updateExtendMater(data) {
  return request({
    method: 'PUT',
    url: `/sys/dev/attr/mate`,
    data: data
  })
}

/**
 * 检斤/计量拓展信息保存
 * @param {
 *  DevAttrExtendMaterage
 * } data
 */
export function saveExtendMater(data) {
  return request({
    method: 'POST',
    url: `/sys/dev/attr/mate`,
    data: data
  })
}

/**
 * 查询槽罐拓展信息
 * @param {
 *  devCode
 * } params
*/
export function findExtendPot(params) {
  return request({
    method: 'GET',
    url: `/sys/dev/attr/pot`,
    params: params
  })
}

/**
 * 槽罐拓展信息更新
 * @param {
 *  DevAttrExtendPot
 * } data
 */
export function updateExtendPot(data) {
  return request({
    method: 'PUT',
    url: `/sys/dev/attr/pot`,
    data: data
  })
}

/**
 * 槽罐拓展信息保存
 * @param {
 *  DevAttrExtendPot
 * } data
 */
export function saveExtendPot(data) {
  return request({
    method: 'POST',
    url: `/sys/dev/attr/pot`,
    data: data
  })
}

/**
 * 查询水表拓展信息
 * @param {
 *  devCode
 * } params
*/
export function findExtendWater(params) {
  return request({
    method: 'GET',
    url: `/sys/dev/attr/water`,
    params: params
  })
}

/**
 * 水表拓展信息更新
 * @param {
 *  DevAttrExtendWater
 * } data
 */
export function updateExtendWater(data) {
  return request({
    method: 'PUT',
    url: `/sys/dev/attr/water`,
    data: data
  })
}

/**
 * 水表拓展信息保存
 * @param {
 *  DevAttrExtendWater
 * } data
 */
export function saveExtendWater(data) {
  return request({
    method: 'POST',
    url: `/sys/dev/attr/water`,
    data: data
  })
}

/**
 * 获取水表下拉
 */
export function getWaterSelectMap() {
  return request({
    method: 'GEt',
    url: `/sys/dev/attr/water/map`
  })
}

/**
 * 获取电表下拉
 */
export function getElectSelectMap() {
  return request({
    method: 'GEt',
    url: `/sys/dev/attr/electric/map`
  })
}
