import request from '@/utils/request'
export function initData() {
    return request({
        method: 'GET',
        url: `/sys/ppc/workshopTeam/initData`,
    })
}
export function getTree(params) {
    return request({
        method: 'GET',
        url: `/sys/ppc/workshopTeam/getTree`,
        params: { ...params }
    })
}


export function queryTeamList(id) {
    return request({
        method: 'GET',
        url: `/sys/ppc/workshopTeam/queryTeamList/`+id + "/1",
    })
}

export function saveTeam(data) {
    return request({
        method: 'POST',
        url: `/sys/ppc/workshopTeam/saveTeam`,
        data: data
    })
}
export function deleteTeam(id) {
    return request({
        method: 'POST',
        url: `/sys/ppc/workshopTeam/deleteTeam/`+id,
    })
}

export function queryWorkshopPersonList(params) {
    return request({
        method: 'GET',
        url: `/sys/ppc/workshopTeam/queryWorkshopPersonList`,
        params: { ...params }
    })
}
export function queryWorkshopProcessList(params) {
    return request({
        method: 'GET',
        url: `/sys/ppc/workshopTeam/queryWorkshopProcessList`,
        params: { ...params }
    })
}
export function queryDialogListTeam(params) {
    return request({
        method: 'GET',
        url: `/sys/ppc/workshopTeam/queryDialogListTeam`,
        params: { ...params }
    })
}
export function queryDialogListProcess(params) {
    return request({
        method: 'GET',
        url: `/sys/ppc/workshopTeam/queryDialogListProcess`,
        params: { ...params }
    })
}
export function addTeamToWorkshop(params) {
    return request({
        method: 'GET',
        url: `/sys/ppc/workshopTeam/addTeamToWorkshop`,
        params: { ...params }
    })
}
export function addStaffToTeam(params) {
    return request({
        method: 'GET',
        url: `/sys/ppc/workshopTeam/addStaffToTeam`,
        params: { ...params }
    })
}
export function saveStaff(data) {
    return request({
        method: 'POST',
        url: `/sys/ppc/workshopTeam/saveStaff`,
        data: data
    })
}
export function removeStaffFromTeam(id) {
    return request({
        method: 'GET',
        url: `/sys/ppc/workshopTeam/removeStaffFromTeam/`+id,
    })
}
export function addProcessToTeam(params) {
    return request({
        method: 'GET',
        url: `/sys/ppc/workshopTeam/addProcessToTeam`,
        params: { ...params }
    })
}
export function deleteTeams(ids) {
    return request({
        method: 'GET',
        url: `/sys/ppc/workshopTeam/deleteTeams/`+ids,
    })
}
export function deleteProcess(ids) {
    return request({
        method: 'GET',
        url: `/sys/ppc/workshopTeam/deleteProcess/`+ids,
    })
}
