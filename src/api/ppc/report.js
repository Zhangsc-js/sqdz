import request from '@/utils/request'


export function unitOutput(params) {
    return request({
        method: 'GET',
        url: `/ppc/report/unitOutput`,
        params: params
    })
}


export function saleReport(params) {
    return request({
        method: 'GET',
        url: `/ppc/report/saleReport`,
        params
    })
}
