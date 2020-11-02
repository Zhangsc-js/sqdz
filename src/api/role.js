import request from '@/utils/request'


export function list(data) {
    return request({
        method: 'GET',
        url: '/sys/role',
        params: {
            ...data
        }
    })
}

export function simple(data) {
    return request({
        method: 'GET',
        url: '/sys/role/simple',
        params: {
            ...data
        }
    })
}

export function add(data) {
    return request({
        method: 'POST',
        url: '/sys/role',
        params: {
            ...data
        }
    })
}

export function update(data) {
    return request({
        method: 'PUT',
        url: `/sys/role/${data.id}`,
        data: {
            ...data
        }
    })
}

export function remove(data) {
    return request({
        method: 'DELETE',
        url: `/sys/role/${data.id}`,
        params: {
            ...data
        }
    })
}

export function detail(data) {
    return request({
        method: 'GET',
        url: `/sys/role/${data.id}`,
        params: {
            ...data
        }
    })
}

export function assignPrem(data) {
    return request({
        method: 'PUT',
        url: `/sys/role/assignPrem`,
        /*params: {
            ...data
        }*/
        data: {
            ...data
        }
    })
}

export function findAll(data) {
    return request({
        method: 'GET',
        url: `/sys/role/list`,
        params: {
            ...data
        }
    })
}

/**
 * 获取角色列表
 */
export function getRole(userCode, params) {
    return request({
        method: 'get',
        url: '/sys/role/getRole/' + userCode,
        params: { ...params }
    })
}

/**
 * 删除角色
 */
export function dltRole(id) {
    return request({
        method: 'delete',
        url: '/sys/role/' + id
    })
}

export function save(userCode, row) {
    return request({
        method: 'put',
        url: '/sys/role/save/' + userCode,
        data: row
    })
}

export function userList(id) {
    return request({
        method: 'get',
        url: '/sys/role/userList/' + id
    })
}

export function savePru(roleId, userids) {
    return request({
        method: 'put',
        url: '/sys/role/savePru/' + roleId,
        params: {
            userids: userids + "",
        }
    })
}

export function dltPru(ids, roleId) {
    return request({
        method: 'delete',
        url: '/sys/role/dltPru/' + roleId,
        params: {
            ids: ids + "",
        }
    })
}

export function getByMenu(roleId, loginUserCode) {
    return request({
        method: 'get',
        url: '/sys/role/getByMenu/' + roleId + "/" + loginUserCode
    })
}

export function saveMenuRole(roleId, menuIds) {
    return request({
        method: 'post',
        url: '/sys/role/saveMenuRole/' + roleId,
        params: {
            menuIds: menuIds + "",
        }
    })
}

export function mobileGetByMenu(params) {
    return request({
        method: 'get',
        url: '/sys/role/mobile/getMenuList',
        params
    })
}

export function mobileSaveMenuRole(roleId, menuIds) {
    return request({
        method: 'post',
        url: '/sys/role/mobile/saveMenuRole/' + roleId,
        params: {
            menuCode: menuIds + "",
        }
    })
}
