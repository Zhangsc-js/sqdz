import request from '@/utils/request'


export function initData() {
    return request({
        method: 'GET',
        url: `/ppc/flow/produceOutput/initData`,
    })
}
export function queryOutput(param) {
    return request({
        method: 'POST',
        url: `/ppc/flow/produceOutput/queryOutput`,
        params:{...param}
    })
}
export function queryById(id) {
    return request({
        method: 'GET',
        url: `/ppc/flow/produceOutput/queryById/`+id,
    })
}
export function deleteByIds(ids) {
    return request({
        method: 'GET',
        url: `/ppc/flow/produceOutput/deleteByIds/`+ids,
    })
}

export function saveOutput(data) {
    return request({
        method: 'POST',
        url: `/ppc/flow/produceOutput/saveOutput`,
        data: data
    })
}
export function downloadTemplateOutput() {
    return request({
        method: 'GET',
        url: `/ppc/flow/produceOutput/downloadTemplateOutput`,
        responseType:'blob'
    })
}
