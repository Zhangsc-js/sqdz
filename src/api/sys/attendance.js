import request from '@/utils/request'

/**
 *  查询当天是否打卡
 * @param {
 *userWork
 * } params
 */
export function isClockin(params) {
    return request({
        method: 'GET',
        url: `/sys/clockIn/isClockin`,
        params: {
            ...params
        }
    })
}

/**
 * 打卡
 * @param {
 * userName
 * userWork
 * userId
 * isChangeShift
 * } params
 */
export function clockIn(params) {
    return request({
        method: 'POST',
        url: `/sys/clockIn/clockIn`,
        data: {
            ...params
        }
    })
}

/**
 *  查询当前用户需确认的打卡列表
 * @param {
 *userWork
 * } params
 */
export function getClockinList(params) {
    return request({
        method: 'GET',
        url: `/sys/clockIn/notarizeClockInList`,
        params: {
            ...params
        }
    })
}

/**
 *  打卡确认
 * @param {
 * id
 * agreeUserName
 * agreeUserWork
 * } params
 */
export function confirmClockin(params) {
    return request({
        method: 'POST',
        url: `/sys/clockIn/agreeClockIn`,
        data: {
            ...params
        }
    })
}

/**
 *  根据查询用户打卡记录
 * @param {
 * userWork,
 * lockInTimeStart
 * clockInTimeEnd
 * } params
 */
export function getClockinRecord(params) {
    return request({
        method: 'GET',
        url: `/sys/clockIn/findByUserWork`,
        params: {
            ...params
        }
    })
}
