import request from '@/utils/request'

/**
 *
 * */
export function list(data) {
    return request({
        method: 'GET',
        url: `/sys/user`,
        params: {
            ...data
        }
    })
}

export function simple(data) {
    return request({
        method: 'GET',
        url: `/sys/user/simple`,
        params: {
            ...data
        }
    })
}

export function add(data) {
    return request({
        method: 'POST',
        url: `/sys/user`,
        params: {
            ...data
        }
    })
}

export function update(data) {
    return request({
        method: 'PUT',
        url: `/sys/user/${data.id}`,
        params: {
            ...data
        }
    })
}

export function remove(data) {
    return request({
        method: 'delete',
        url: `/sys/user/${data.id}`,
        params: {
            ...data
        }
    })
}

export function detail(data) {
    return request({
        method: 'GET',
        url: `/sys/user/${data.id}`,
        params: {
            ...data
        }
    })
}

export function assignRoles(data) {
    return request({
        method: 'PUT',
        url: `/sys/user/assignRoles`,
       data:{
           ...data
       }
    })
}