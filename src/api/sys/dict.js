import request from '@/utils/request'


export function initDictData() {
    return request({
        method: 'GET',
        url: `/sys/dict/initDictData`,
    })
}
/**
 * 获取所有自动编码列表
 * @param {
 *   pageSize,
 *   pageNum
 * } params
 */
export function getDictMainList(params) {
    return request({
        method: 'GET',
        url: `/sys/dict/queryList`,
        params: { ...params }
    })
}


export function saveMain(data) {
    return request({
        method: 'POST',
        url: `/sys/dict/saveMain`,
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
        url: `/sys/dict/deleteMain/`+id,
    })
}
export function getDictDetailList(mainId) {
    return request({
        method: 'GET',
        url: `/sys/dict/getDictDetailList/`+mainId,

    })
}
export function saveDetail(data) {
    return request({
        method: 'POST',
        url: `/sys/dict/saveDetail`,
        data: data
    })
}
export function deleteDetail(id) {
    return request({
        method: 'POST',
        url: `/sys/dict/deleteDetail/`+id,
    })
}
