import request from '@/utils/request'
import qs from 'qs'

/**
 * 获取警报主表信息
 * @param {
 *  categoryName
 * } params
 */
export function getData(params) {
    return request({
        method: 'GET',
        url: `/sys/warning/category`,
        params: {
            ...params
        }
    })
}

/**
 * 新增警报分类
 * @param {
 *  insertWarningCategory
 * } record
 */
export function insertWarningCategory(record) {
    return request({
        method: 'POST',
        url: `/sys/warning/category/save`,
        data: record
    })
}

/**
 * 更新报警分类
 * @param {
 *     updateWarningCategory
 * } record
 */
export function updateWarningCategory(record) {
    return request({
        method: 'POST',
        url: `/sys/warning/category/update`,
        data: record
    })
}
/**
 * 删除警报主表
 * @param {
 *  param
 * } param
 */
export function deleteWarningCategory(param) {
    return request({
        method: 'GET',
        url: `/sys/warning/category/delete`,
        params:param
    })
}
