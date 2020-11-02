import request from '@/utils/request'
/**
 * 获取页面初始化数据
 */
export function initData() {
    return request({
        method: 'GET',
        url: `/sys/ppc/process/initData`,
    })
}
/**
 * 获取所有自动编码列表
 * @param {
 *   pageSize,
 *   pageNum
 * } params
 */
export function getProcessTree(params) {
    return request({
        method: 'GET',
        url: `/sys/ppc/process/queryProcessTree`,
        params: { ...params }
    })
}

/**
 * 工序id查询对象信息
 * @param id
 */
export function queryInfo(id) {
    return request({
        method: 'GET',
        url: `/sys/ppc/process/queryInfo/`+id,
    })
}

/**
 *
 * @param params
 */
export function saveProcess(data) {
    return request({
        method: 'POST',
        url: `/sys/ppc/process/saveProcess`,
        data: data
    })
}
/**
 *
 * @param params
 */
export function deleteProcess(id) {
    return request({
        method: 'POST',
        url: `/sys/ppc/process/deleteProcess/`+id,
    })
}


/**
 * 下载工序导入模板
 */
export function downlowdProcessModelTemp() {
    return request({
        method: 'GET',
        url: `/sys/ppc/process/template`,
        responseType: 'blob'
    })
}


/**
 *
 * @param params
 */
export function queryDevList(params) {
    return request({
        method: 'GET',
        url: `/sys/ppc/process/queryDevList`,
        params: { ...params }
    })
}

/**
 *
 * @param params
 */
export function addDevToProcess(params) {
    return request({
        method: 'GET',
        url: `/sys/ppc/process/addDevToProcess`,
        params: { ...params }
    })
}
/**
 *
 * @param params
 */
export function removeDevFromProcess(params) {
    return request({
        method: 'GET',
        url: `/sys/ppc/process/removeDevFromProcess`,
        params: { ...params }
    })
}
