import request from '@/utils/request'
export function list_downtime_production_line(data) {
    return request({
        method: 'POST',
        url: `/overview/td/list_downtime_production_line`,
        data
    })
}

export function list_real_time_staus(x) {
    return request({
        method: 'GET',
        url: `/overview/storage_location/list_real_time_staus?xCoordinate=${x}`,
    })
}

export function month_un_safety_production_day(data) {
    return request({
        method: 'POST',
        url: `/overview/safety/month_un_safety_production_day`,
        data
    })
}

export function asrsImages(lr) {
    return request({
        method: 'GET',
        url: `/primary/overview/asrs/images?lr=${lr}`,
    })
}

// export function overviewMonthSafeDays(month) {
//     return request({
//         method: 'GET',
//         url: `/primary/overview/monthSafeDays?workCode=78&month=${month}`,
//     })
// }

export function safe_production_days(data) {
    return request({
        method: 'POST',
        url: `/overview/safety/safe_production_days`,
        data
    })
}

export function orderPIN(PIN) {
    return request({
        method: 'GET',
        url: `/data/singleCar/order/state?PIN=${PIN}`,
    })
}


export function list_not_outbound_in_storage_time(data) {
    return request({
        method: 'POST',
        url: `/logistics/warehouse/list_not_outbound_in_storage_time`,
        data
    })
}

export function carParameter(PIN) {
    return request({
        method: 'GET',
        url: `/data/singleCar/car/parameter?PIN=${PIN}`,
    })
}

export function list_agv_percentage_free_time(data) {
    return request({
        method: 'POST',
        url: `/logistics/agv/list_agv_percentage_free_time`,
        data
    })
}

export function capacityDaily() {
    return request({
        method: 'GET',
        url: `/data/primary/production/capacity/daily`,
    })
}

export function get_today_test_data(data) {
    return request({
        method: 'POST',
        url: `/quality/test_data/get_today_test_data`,
        data
    })
}

export function list_downtime_record(data) {
    return request({
        method: 'POST',
        url: `/device/downtime/list_downtime_record`,
        data
    })
}

export function list_month_tce(data) {
    return request({
        method: 'POST',
        url: `/ee/energy_consumption/list_month_tce`,
        data
    })
}

export function list_day_tce(data) {
    return request({
        method: 'POST',
        url: `/ee/energy_consumption/list_day_tce`,
        data
    })
}


export function list_day_total_single_tce(data) {
    return request({
        method: 'POST',
        url: `/ee/energy_consumption/list_day_total_single_tce`,
        data
    })
}

export function list_energy_consumption(data) {
    return request({
        method: 'POST',
        url: `/ee/energy_consumption/list_energy_consumption`,
        data
    })
}

