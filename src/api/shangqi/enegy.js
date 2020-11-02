

// /ee/energy_consumption/list_energy_consumption

import request from '@/utils/request'

// 设备谱系树
export function list_energy_consumption (data) {
    return request({
        method: 'POST',
        url: `/ee/energy_consumption/list_energy_consumption`,
        data:{
            ...data
        }
    })
}

/// 吨标煤


export function listTce(data) {
    return request({
        method: 'POST',
        url: `/ee/energy_consumption/list_tce`,
        data:{
            ...data
        }
    })
}

export function list_sankey_diagram(data) {
    return request({
        method: 'POST',
        url: `/ee/energy_consumption/list_sankey_diagram`,
        data:{
            ...data
        }
    })
}