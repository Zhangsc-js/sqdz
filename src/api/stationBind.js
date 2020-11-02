import request from '@/utils/request'

/**
 *
 * @param {ip} params
 * 获取工位信息
 */
export function getBindStation(params) {
    return request({
        method: 'GET',
        url: `/sys/stationManage/getBindStation`,
        params
    })
}

/**
 *
 * @param {*} params
 * 绑定工位
 */
export function bindStation(data) {
    return request({
        method: 'POST',
        url: `/sys/stationManage/bindStation`,
        data
    })
}

/**
 *
 * @param {*} params
 * 登出
 */
export function StationLogOut(data) {
    return request({
        method: 'POST',
        url: `/sys/stationManage/StationLogOut`,
        data
    })
}
