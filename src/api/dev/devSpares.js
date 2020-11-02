import request from '@/utils/request'

export function initSparesData() {
    return request({
        method: 'GET',
        url: `/sys/dev/spares/initData`,
    })
}

export function queryList(params) {
    return request({
        method: 'GET',
        url: `/sys/dev/spares/querySpares`,
        params: { ...params }
    })
}

export function delSpares(id) {
    return request({
        method: 'GET',
        url: `/sys/dev/spares/delSpares`,
        params: { "id": id }
    })
}
export function delSparesMulti(ids) {
    return request({
        method: 'GET',
        url: `/sys/dev/spares/delSparesMulti`,
        params: { "ids": ids }

    })
}
export function getSparesById(id) {
    return request({
        method: 'GET',
        url: `/sys/dev/spares/querySpares`,
        params: { "id": id }

    })
}
export function saveSpares(data) {
    return request({
        method: 'POST',
        url: `/sys/dev/spares/saveSpares`,
        data: data
    })
}
