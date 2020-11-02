import request from '@/utils/request'
import qs from 'qs'

/**
 * 获取警报主表信息
 * @param {
 *  warningName
 * } params
 */
export function getData(params) {
    return request({
        method: 'GET',
        url: `/sys/warning/main`,
        params: {
            ...params
        }
    })
}

/**
 * 新增警报主表
 * @param {
 *  SysWarningMain
 * } record
 */
export function insertWarningMain(record) {
    return request({
        method: 'POST',
        url: `/sys/warning/main`,
        data: record
    })
}

/**
 * 更新警报主表
 * @param {
  *  SysWarningMain
  * } record
  */
export function updateWarningMain(record) {
    return request({
        method: 'PUT',
        url: `/sys/warning/main`,
        data: record
    })
}
/**
 * 删除警报主表
 * @param {
 *  codes: Array
 * } codes
*/
export function delWarningMainByCodes(codes) {
    return request({
        method: 'DELETE',
        url: `/sys/warning/main/codes`,
        data: codes,
        paramsSerializer: codes => {
            return qs.stringify(codes, { indices: false })
        },
    })
}

/**
 * 获取从表信息
 * @param {
 *  warningCode,
 *  warningType,
 *  responseType,
 *  intervalTime
 * } params
 */
export function detail(params) {
    return request({
        method: 'GET',
        url: `/sys/warning/detail`,
        params: params
    })
}

/**
 * 新增警报详情
 * @param {
 *  SysWarningDetail
 * } record
 */
export function insertDetail(record) {
    return request({
        method: 'POST',
        url: `/sys/warning/detail`,
        data: record
    })
}

/**
 * 更新警报详情
 * @param {
  *  SysWarningDetail
  * } record
  */
export function updateDetail(record) {
    return request({
        method: 'PUT',
        url: `/sys/warning/detail`,
        data: record
    })
}

/**
 * 获取警报接收人
 * @param {
 *  warningCode
 * } param
 */
export function getWarningPerson(param) {
    return request({
        method: 'GET',
        url: `/sys/warning/person`,
        params: param
    })
}

/**
 * 新增警报接收人
 * @param {
 *  SysWarningPerson
 * } record
*/
export function insertWarningPerson(record) {
    return request({
        method: 'POST',
        url: `/sys/warning/person`,
        data: record
    })
}

/**
 * 新增警报接收人
 * @param {
 *  SysWarningPerson
 * } record
*/
export function updateWarningPerson(record) {
    return request({
        method: 'PUT',
        url: `/sys/warning/person`,
        data: record
    })
}


/**
 * 删除警报主表
 * @param {
 *  codes: Array
 * } codes
*/
export function delWarningPersonById(ids) {
    return request({
        method: 'DELETE',
        url: `/sys/warning/person/ids`,
        data: ids,
        paramsSerializer: ids => {
            return qs.stringify(ids, { indices: false })
        },
    })
}


/**
 * 获取警报分类列表
 */
export function initCategoryData() {
    return request({
        method: 'GET',
        url: `/sys/warning/category/list`
    })
}

/**
 * 获取设备运行参数异常统计
 */
export function selectByException(params) {
    return request({
        method: 'GET',
        url: '/sys/warning/info/selectByException',
        params
    })
}
