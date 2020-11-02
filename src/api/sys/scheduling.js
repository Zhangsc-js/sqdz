import request from '@/utils/request'

/**
 * 查询所有
 * @param {*} params
 */
export function schedulPlanAll(params) {
    return request({
        method: 'GET',
        url: `/sys/schedulPlan/queryAll`,
        params
    })
}

/**
 * 新增
 * @data {*} data
 */
export function saveSchedulPlan(data) {
    return request({
        method: 'POST',
        url: `/sys/schedulPlan/saveSchedulPlan`,
        data
    })
}

/**
 * 日历下拉
 */
export function sltCalendar() {
    return request({
        method: 'GET',
        url: `/sys/calendar/sltCalendar`,
    })
}


export function queryDetail(params) {
    return request({
        method: 'GET',
        url: `/sys/schedulPlan/queryDetail`,
        params
    })
}

/**
 *
 * @param {*} params
 * shift新增
 */
export function getShiftByPlanCode(params) {
    return request({
        method: 'GET',
        url: `/sys/schedulPlan/getShiftByPlanCode`,
        params
    })
}

/**
 *
 * @data {*} data
 * shift新增
 */
export function saveShift(data) {
    return request({
        method: 'POST',
        url: `/sys/schedulPlan/saveShift`,
        data
    })
}

/**
 *
 * @param {*} params
 * 班组排班
 */
export function getSchedulOrg(params) {
    return request({
        method: 'GET',
        url: `/sys/schedulPlan/getSchedulOrg`,
        params
    })
}

/**
 *
 * @param {*} params
 * 班组排班
 */
export function getSltData(params) {
    return request({
        method: 'GET',
        url: `/sys/schedulPlan/getSltData`,
        params
    })
}

/**
 *
 * @param {*} params
 * 班组新增保存
 */
export function saveSchedulOrg(data) {
    return request({
        method: 'POST',
        url: `/sys/schedulPlan/saveSchedulOrg`,
        data
    })
}

/**
 *
 * @param {*} params
 * 删除班制
 */
export function deleteSchedulPlan(id) {
    return request({
        method: 'DELETE',
        url: `/sys/schedulPlan/deleteSchedulPlan/${id}`,
    })
}


/**
 *
 * @param {*} params
 * 获取下拉
 */
export function getTeamList(params) {
    return request({
        method: 'get',
        url: `/sys/schedulPlan/getTeamList`,
        params
    })
}

/**
 *
 * @param {*} params
 * 班次删除
 */
export function deleteShift(id) {
    return request({
        method: 'DELETE',
        url: `/sys/schedulPlan/deleteShift/${id}`,
    })
}

/**
 *
 * @param {*} params
 * 班组删除
 */
export function deleteSchedulOrg(id) {
    return request({
        method: 'DELETE',
        url: `/sys/schedulPlan/deleteSchedulOrg/${id}`,
    })
}

/**
 *
 * @param {*} params
 * 查询成员
 */
export function getDepartmentById(id) {
    return request({
        method: 'GET',
        url: `/sys/department/getEmpyesByDepartCode/${id}`,
    })
}



/**
 *
 * @param {*} params
 * 获取班组排班
 */
export function teamDaily(params) {
    return request({
        method: 'get',
        url: `/sys/schedulPlan/teamDaily`,
        params
    })
}

/**
 *
 * @param {*} data
 */
export function saveTeamDaily(data) {
    return request({
        method: 'POST',
        url: `/sys/schedulPlan/saveTeamDaily`,
        data
    })
}

export function saveUserDaily(data) {
    return request({
        method: 'POST',
        url: `/sys/schedulPlan/saveUserDaily`,
        data
    })
}

export function getOrgSltByCategory(params) {
    return request({
        method: 'GET',
        url: `/sys/schedulPlan/getOrgSltByCategory`,
        params
    })
}

export function getShiftList(params) {
    return request({
        method: 'GET',
        url: `/sys/schedulPlan/getShiftList`,
        params
    })
}
export function updateTeamDaily(data) {
    return request({
        method: 'POST',
        url: `/sys/schedulPlan/updateTeamDaily`,
        data
    })
}

export function getTeamDailyList(params) {
    return request({
        method: 'GET',
        url: `/sys/schedulPlan/getTeamDailyList`,
        params
    })
}



export function getUserDaily(params) {
    return request({
        method: 'GET',
        url: `/sys/schedulPlan/getUserDaily`,
        params
    })
}

/**
 *
 * @param {保存} data
 */
export function updateUserDaily(data) {
    return request({
        method: 'POST',
        url: `/sys/schedulPlan/updateUserDaily`,
        data
    })
}

/**
 *
 * @param {我的排班} params
 */
export function getUserSchedule(params) {
    return request({
        method: 'GET',
        url: `/sys/schedulPlan/getUserSchedule`,
        params
    })
}

export function deleteTeamDaily(id) {
    return request({
        method: 'DELETE',
        url: `/sys/schedulPlan/deleteTeamDaily/${id}`,
    })
}

export function deleteUserDaily(params) {
    return request({
        method: 'DELETE',
        url: `/sys/schedulPlan/deleteUserDaily`,
        data: params
    })
}

export function batDeleteTeamDaily(ids) {
    return request({
        method: 'DELETE',
        url: `/sys/schedulPlan/batDeleteTeamDaily`,
        params: {
            ids: ids + ""
        }
    })
}
