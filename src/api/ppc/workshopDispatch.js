import request from '@/utils/request'

/**
 * 获取页面初始化数据
 */
export function initData() {
    return request({
        method: 'GET',
        url: `/ppc/workshop/initData`,
    })
}

/**
 * 派工dialog初始化查询
 * @param params
 */
export function queryDispatchInit(params) {
    return request({
        method: 'GET',
        url: `/ppc/workshop/queryDispatchInit`,
        params: { ...params }
    })
}
export function queryPlanList(params) {
    return request({
        method: 'GET',
        url: `/ppc/workshop/queryPlanList`,
        params: { ...params }
    })
}

export function queryPlanProcessList(id) {
    return request({
        method: 'GET',
        url: `/ppc/workshop/queryPlanProcessList/` + id,
    })
}

export function saveDispatchByProducePlanId(id) {
    return request({
        method: 'POST',
        url: `/ppc/workshop/saveDispatchByProducePlanId/` + id,
    })
}
export function saveDispatchOne(data) {
    return request({
        method: 'POST',
        url: `/ppc/workshop/saveDispatchOne`,
        data: data
    })
}
export function saveDispatchBatch(data) {
    return request({
        method: 'POST',
        url: `/ppc/workshop/saveDispatchBatch`,
        params: { ...data }
    })
}
export function queryWorkOrderList(id) {
    return request({
        method: 'GET',
        url: `/ppc/workshop/queryWorkOrderList/` + id,
    })
}



export function queryWorkOrderByPIdAndShopCode(id, workshopCode) {
    return request({
        method: 'GET',
        url: '/ppc/workshop/queryWorkOrderByPIdAndShopCode/' + id,
        params: { workshopCode }
    })
}
export function deleteWo(id) {
    return request({
        method: 'GET',
        url: `/ppc/workshop/deleteWo/` + id,
    })
}
export function queryInputList(id) {
    return request({
        method: 'GET',
        url: `/ppc/workshop/getpickByPlanId/` + id,
    })
}

export function queryInputListByPlanId(id, workshopCode) {
    return request({
        method: 'GET',
        url: '/ppc/workshop/queryInputListByPlanId/' + id,
        params: { workshopCode }
    })
}
export function queryMember(teamCode) {
    return request({
        method: 'GET',
        url: `/ppc/workshop/queryMember/` + teamCode,
    })
}
export function issueWo(id) {
    return request({
        method: 'GET',
        url: `/ppc/workshop/issueWo/` + id,
    })
}
export function splitWo(id) {
    return request({
        method: 'GET',
        url: `/ppc/workshop/splitWo/` + id,
    })
}
export function findLineByWorkshopAndProcess(map) {
    return request({
        method: 'GET',
        url: `/ppc/workshop/findLineByWorkshopAndProcess`,
        params: map
    })
}
export function queryTeamByWorksho(map) {
    return request({
        method: 'GET',
        url: `/ppc/workshop/queryTeamByWorksho`,
        params: map
    })
}
