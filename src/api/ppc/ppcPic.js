import request from '@/utils/request'

export function queryPics(params) {
    return request({
        method: 'GET',
        url: `/ppc/pic/queryPics`,
        params: { ...params }
    })
}
export function savePic(data) {
    return request({
        method: 'POST',
        url: `/ppc/pic/savePic`,
        data: data
    })
}
export function delPic(params) {
    return request({
        method: 'GET',
        url: `/ppc/pic/delPic`,
        params: { ...params }
    })
}
