import request from '@/utils/request'


/**
 * 吞吐量
 * @param {
 * type
 * } params
 * */
// 报警故障 ---
export function machineHaltLogs(data) {
    return request({
        method: 'POST',
        url: `/device/fault_alarm/list_fault_alarm`,
        data:{
            ...data
        }
    })
}

//   单独高架桥车间的的报警故障记录
export function GJQmachineHaltLogs(data) {
    return request({
        method: 'GET',
        url: `/device/fault_alarm/list_asrs_device_fault`,
        params:{
            ...data
        }
    })
}

// 高架库 故障类型分析
export function GJQlisFaultAlarm(data) {
    return request({
        method: 'GET',
        url: `/device/fault_alarm/list_asrs_fault_type`,
        params:{
            ...data
        }
    })
}

//POST /device/device_info/get_shop_device_num
// 设备总数
export function getShopDeviceNum(data) {
    return request({
        method: 'POST',
        url: `/device/device_info/get_shop_device_num`,
        data:{
            ...data
        }
    })
}
// 备件领用
export function receiveLog(data) {
    return request({
        method: 'POST',
        url: `/device/spare_part/receive_log`,
        data:{
            ...data
        }
    })
}
// 维修完成率
export function  maintainPercent(data) {
    return request({
        method: 'POST',
        url: `/device/plan/maintain`,
        data:{
            ...data
        }
    })
}
// 点检完成率
export function spotCheckPercent(data) {
    return request({
        method: 'POST',
        url: `/device/plan/spot_check`,
        data:{
            ...data
        }
    })
}

////device/machine_halt/list_logs
// /device/focus_on/fault_analysis
// 重点故障分析

// /device/check_maintain/get_check_maintain_complete_rate

/**
 *  点检、维修完成率  
 */
export function get_check_maintain_complete_rate(params) {
    return request({
        method: 'POST',
        url: `/device/check_maintain/get_check_maintain_complete_rate`,
        data:params
    })
}

