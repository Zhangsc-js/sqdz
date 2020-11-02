import request from '@/utils/request'

// 设备谱系树
export function devTree (data) {
    return request({
        method: 'GET',
        url: `/sys/dev/devTree`,
        params:{
            ...data
        }
    })
}
// 设备总数
export function devCount(data) {
    return request({
        method: 'GET',
        // url: `/sys/dev/card/attrs/no`,
        url: `/sys/devoverview/devCount`,
        params:{
            ...data
        }
    })
}
// 设备基础信息
export function noList(data) {
    return request({
        method: 'GET',
        url:`/sys/dev/card/attrs/no`,
        params:{
            ...data
        }
    })
}
// 设备附件
export function files(data) {
    return request({
        method: 'GET',
        url: `/sys/dev/files`,
        params:{
            ...data
        }
    })
}

//

export function filesManage (data) {
    return request({
        method: 'GET',
        url: `/primary/dev/file/list`,
        params:{
            ...data
        }
    })
}

// 设备备件
export function queryDevSpares(data) {
    return request({
        method: 'GET',
        url: `/sys/dev/devSpares/queryDevSpares`,
        params:{
            ...data
        }
    })
}

// 设备运行
export function groupByCode(data) {
    return request({
        method: 'GET',
        url: `/sys/dev/run/info`,
        params:{
            ...data
        }
    })
}


// 温度曲线

export function getCurYWH(data){
    // //opc/getCurYWH
    return request({
        method: 'GET',
        url: `/opc/getCurYWH`,
        params:{
            ...data
        }
    })
}
export function getEquipTempCurve(data) {
    return request({
        method: 'GET',
        url: `/opc/getEquipTempCurve`,
        params:{
            ...data
        }
    })
}