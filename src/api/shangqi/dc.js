

//GET /wl/singleOrder  //订单

// GET /wl/singleParts //零部件
// chj
// GET /wl/singleShopInfo
//kindType

import request from '@/utils/request'


/**
 *  订单 
 * @param {
 * type
 * } params
 * */
export function singleOrder(data) {
    return request({
        method: 'GET',
        url: `/wl/singleOrder`,
        params:{
            ...data
        }
    })
}

// 零部件
export function singleParts(data) {
    return request({
        method: 'GET',
        url: `/wl/singleParts`,
        params:{
            ...data
        }
    })
}

// 
// ID LOUNGE 车型
export function singleShopInfo(data) {
    return request({
        method: 'GET',
        url: `/wl/singleShopInfo`,
        params:{
            ...data
        }
    })
}

// 测试



export function list_test_data(data) {
    return request({
        method: 'POST',
        url: `/quality/test_data/list_test_data`,
        data:{
            ...data
        }
    })
}

export function list_avg_working_hours_analysis(data) {
    return request({
        method: 'POST',
        url: `/logistics/agv/list_avg_working_hours_analysis`,
        data:{
            ...data
        }
    })
}

// 轨迹

export function list_agv_realtime_trajectory(data) {
    return request({
        method: 'POST',
        url: `/logistics/agv/list_agv_realtime_trajectory`,
        data:{
            ...data
        }
    })
}

// 吞吐量

export function get_throughput(data) {
    return request({
        method: 'POST',
        url: `/logistics/warehouse/get_throughput`,
        data:{
            ...data
        }
    })
}

// 吞吐量出入分析

export function list_throughput(data) {
    return request({
        method: 'POST',
        url: `/logistics/warehouse/list_throughput`,
        data:{
            ...data
        }
    })
}

// 在库
// 电池连廊
// /logistics/agv/list_avg_working_hours_analysis

// top5
export function list_in_storage_time(data) {
    return request({
        method: 'POST',
        url: `/logistics/warehouse/list_in_storage_time`,
        data:{
            ...data
        }
    })
}

// 设备状态
export function list_battery_stereo_library(data) {
    return request({
        method: 'GET',
        url: `/device/device_info/list_battery_stereo_library`,
        params:{
            ...data
        }
    })
}

// 时长分析

export function list_avg_in_storage_time(data) {
    return request({
        method: 'POST',
        url: `/logistics/warehouse/list_avg_in_storage_time`,
        data:{
            ...data
        }
    })
}


// 车身车间进入离开时间

export function carBodyInOutTime(data) {
    return request({
        method: 'GET',
        url: `/data/singleCar/carBody/inOutTime`,
        params:{
            ...data
        }
    })
}




//油漆车间进入离开时间

export function paintInOutTime(data) {
    return request({
        method: 'GET',
        url: `/data/singleCar/paint/inOutTime`,
        params:{
            ...data
        }
    })
}

// 总装车间进入离开时间

export function assemblyInOutTime(data) {
    return request({
        method: 'GET',
        url: `/data/singleCar/assembly/inOutTime`,
        params:{
            ...data
        }
    })
}



// 出厂时间

export function factoryOutTime(data) {
    return request({
        method: 'GET',
        url: `/data/singleCar/factory/outTime`,
        params:{
            ...data
        }
    })
}

// 订单信息
export function vehicleTracking(data){
    return request({
        method:'GET',
        url:"/data/primary/production/vehicleTracking",
        params:{
            ...data
        }
    })
}

// 获取agv 状态
export function get_agv_status_num(data){
    return request({
        method:'POST',
        url:"/logistics/agv/get_agv_status_num",
        data:{
            ...data
        }
    })
}



