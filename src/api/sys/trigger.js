import request from '@/utils/request'
import qs from 'qs'

export function getTriggerAll(params) {
    return request({
        method:'get',
        url:'/sys/quartz/TriggerRegular/getTriggerResular',
        params:{
            ...params
        }
    })
}


export function dltTriggerResular(id) {
    return request({
        method:'delete',
        url:'/sys/quartz/TriggerRegular/dltTriggerResular/'+id
    })
}

export function saveriggerResular(row) {
    return request({
        method:'post',
        url:'/sys/quartz/TriggerRegular/saveTriggerResular',
        data:row
    })
}

/**
 * tag点触发源管理 获取列表
 * @param params
 */
export function getTriggerTag(params) {
    return request({
        method:'get',
        url:'/sys/quartz/TriggerTag/getTriggerTag',
        params:{...params}
    })
}


/**
 * tag点触发源管理 保存tag点触发源
 */
export function saveTriggerTag(row) {
    return request({
        method:'post',
        url:'/sys/quartz/TriggerTag/saveTriggerTag',
        data:row
    })
}

/**
 * tag点触发源管理 删除tag点触发源
 * @param id
 */
export function dltTriggerTag(id) {
    return request({
        method:'delete',
        url:'/sys/quartz/TriggerTag/dltTriggerTag/' + id
    })
}

/**
 * 获取tag点触发源参数
 * @param triggerCode
 */
export function queryByTaggerCode(triggerCode) {
    return request({
        method:'get',
        url:'/sys/quartz/TriggerTagParam/queryByTaggerCode',
        params:{
            triggerCode:triggerCode
        }
    })

}

/**
 * 新增tag点触发源参数
 * @param row
 */
export function saveTagParam(row) {
    return request({
        method:'post',
        url:'/sys/quartz/TriggerTagParam/saveTagParam',
        data:row
    })
}

export function dltTagParam(id) {
    return request({
        method:'delete',
        url:'/sys/quartz/TriggerTagParam/dltTagParam/' + id
    })
}
