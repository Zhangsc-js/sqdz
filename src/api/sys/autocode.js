import request from '@/utils/request'
/**
 * 获取所有自动编码列表
 * @param {
 *   pageSize,
 *   pageNum
 * } params
 */
export function getAutocodeList(params) {
    return request({
        method: 'GET',
        url: `/sys/autocode/queryList`,
        params: { ...params }
    })
}


export function saveMain(data) {
    return request({
        method: 'POST',
        url: `/sys/autocode/saveMain`,
        data: data
    })
}

/**
 *
 * @param params
 */
export function deleteMain(id) {
    return request({
        method: 'POST',
        url: `/sys/autocode/deleteMain/`+id,
    })
}
export function getPartList(mainId) {
    return request({
        method: 'GET',
        url: `/sys/autocode/getPartList/`+mainId,

    })
}
export function savePart(data) {
    return request({
        method: 'POST',
        url: `/sys/autocode/savePart`,
        data: data
    })
}
export function deletePart(id) {
    return request({
        method: 'POST',
        url: `/sys/autocode/deletePart/`+id,
    })
}