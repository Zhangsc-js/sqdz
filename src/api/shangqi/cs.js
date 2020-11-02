import request from '@/utils/request'


///overview/td/get_real_time_data
// 车身
export function getRealTimeData(data) {
    return request({
        method: 'POST',
        url: `/overview/td/get_real_time_data`,
        data:{
            ...data
        }
    })
}


/**
 * 安全生产天数
 * */
export function safeDays(data) {
    return request({
        method: 'POST',
        url: `/overview/safety/safe_production_days`,
        data:{
            ...data
        }
    })
}

// 近一周的OEE趋势 
export function listDayOee(data) {
    return request({
        method: 'POST',
        url: `/production/oee/list_day_oee`,
        data:{
            ...data
        }
    })
}

// 月度MTTR/MTBF
export function listMonthMttrMtbf(data) {
    return request({
        method: 'POST',
        url: `/production/mm/list_month_mttr_mtbf`,
        data:{
            ...data
        }
    })
}

// 设备故障分析
export function lisFaultAlarm(data) {
    return request({
        method: 'POST',
        url: `/device/fault_alarm/list_fault_alarm_analyze`,
        data:{
            ...data
        }
    })
}

//  忠诚度
export function loyalty(data) {
    return request({
        method: 'POST',
        url: `/production/loyalty/loyalty`,
        data:{
            ...data
        }
    })
}

// 占用趋势分析

export function listCache(data) {
    return request({
        method: 'POST',
        url: `/production/cache/list_cache`,
        data:{
            ...data
        }
    })
}

// /production/real_time_data/production_real_time_data
// 实时
export function productionRealTimeData(data) {
    return request({
        method: 'POST',
        url: `/production/real_time_data/production_real_time_data`,
        data:{
            ...data
        }
    })
}
// 测点预警

export function listWaringPoint(data) {
    return request({
        method: 'POST',
        url: `/quality/warning_point/list_waring_point`,
        data:{
            ...data
        }
    })
}
// 车型产量统计

export function carTypeOutput(data) {
    return request({
        method: 'POST',
        url: `/production/output/car_type_output`,
        data:{
            ...data
        }
    })
}



// 机器人数量/自动化率  
export function shopStaticValue(data) {
    return request({
        method: 'POST',
        url: `/production/output/shop_static_value`,
        data:{
            ...data
        }
    })
}


// 主线
export function lineInfoMain(data) {
    return request({
        method: 'GET',
        url: `/production/plan/lineInfo/main`,
        params:{
            ...data
        }
    })
}

// 分线
export function lineInfoSplit(data) {
    return request({
        method: 'GET',
        url: `/production/plan/lineInfo/split`,
        params:{
            ...data
        }
    })
}

// 输送线配置信息列表
export function lineInfoTrans(data) {
    return request({
        method: 'GET',
        url: `/production/plan/lineInfo/trans`,
        params:{
            ...data
        }
    })
}

// EMS配置详细信息
export function lineInfoEms(data) {
    return request({
        method: 'GET',
        url: `/production/plan/lineInfo/ems`,
        params:{
            ...data
        }
    })
}

//  卓越品质cs/fmk

export function listFmkCs(data) {
    return request({
        method: 'POST',
        url: '/quality/fmk_cs/list_fmk_cs',
        data,
    })
}

// 电池库的使用情况
export function get_use_storage(data) {
    return request({
        method: 'POST',
        url: `/logistics/warehouse/get_use_storage`,
        data:{
            ...data
        }
    })
}