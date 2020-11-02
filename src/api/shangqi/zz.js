// 3D总览
import request from '@/utils/request'


/**
 *  实时数据
 * @param {
 * type
 * } params
 * */
export function getRealTimeData(data) {
    return request({
        method: 'POST',
        url: `/overview/td/get_real_time_data`,
        data: {
            ...data
        }
    })
}
// "onJobNum": 100,
// "todayOutput": 900,
// "planOutput": 1000,
// "completionRate": 90,
// "todayRealTimeBeat": "0",
// "todayAvgStartRate": null,
// "realTimeOee": "0",
// "avgDlz": 0,
// "partsNo": null,
// "shift": null
// 当月累计产量和当月生产完成率  //
export function getMonthProductionInfo(data) {
    return request({
        method: 'POST',
        url: `/overview/td/month_production_info`,
        data: {
            ...data
        }
    })
}


//   "data": {
//     "todayPlannedOutput": 1000,
//     "todayOutput": 900,
//     "monthCompletionRate": 90
//   }

//----------------------------------------------  当日计划产量、实际产量、完成率
export function getTodayProductionInfo(data) {
    return request({
        method: 'POST',
        url: `/production/output/today_production_info`,
        data: {
            ...data
        }
    })
}

//   "data": {
//     "planOutput": 1000,
//     "actualOutput": 900,
//     "completionRate": 90
// ----------------------------------------------
//  车型产量统计

// export function carTypeOutput(data) {
//     return request({
//         method: 'POST',
//         url: `/production/output/car_type_output`,
//         data:{
//             ...data
//         }
//     })
// }
// --------------------------------------------
// 接口地址：http://192.168.43.43:51000/api/production/output/car_type_output
// 请求方式：POST
// 请求参数：
// {
//   "shopName": "ZZ",
//   "workCode": "78"
// }
// 响应结果：
// {
//   "success": true,
//   "code": 10000,
//   "message": "操作成功！",
//   "data": [
//     {
//       "carType": "二车型",
//       "output": 80
//     },
//     {
//       "carType": "一车型",
//       "output": 131
//     }
//   ]
// }

// 平均通过时间

export function avgPassTime(data) {
    return request({
        method: 'POST',
        url: `/production/output/avg_pass_time`,
        data: {
            ...data
        }
    })
}
// 请求方式：POST
// 请求参数：
// {
//   "rowNum": 7,
//   "shopName": "ZZ",
//   "workCode": "78"
// }

//     {
//       "2020-09-02": [
//         {
//           "theDate": "2020-09-02",
//           "carType": null,
//           "avgPassTime": null
//         }
//       ]
//     },
//     {
//       "2020-09-03": [
//         {
//           "theDate": "2020-09-03",
//           "carType": null,
//           "avgPassTime": null
//         }
//       ]
//     },
//     {
//       "2020-09-04": [
//         {
//           "theDate": "2020-09-04",
//           "carType": null,
//           "avgPassTime": null
//         }
//       ]
//     },
//     {
//       "2020-09-05": [
//         {
//           "theDate": "2020-09-05",
//           "carType": null,
//           "avgPassTime": null
//         }
//       ]
//     },
//     {
//       "2020-09-06": [
//         {
//           "theDate": "2020-09-06",
//           "carType": null,
//           "avgPassTime": null
//         }
//       ]
//     },
//     {
//       "2020-09-07": [
//         {
//           "theDate": "2020-09-07",
//           "carType": "1号车型",
//           "avgPassTime": 70
//         }
//       ]
//     },
//     {
//       "2020-09-08": [
//         {
//           "theDate": "2020-09-08",
//           "carType": "1号车型",
//           "avgPassTime": 30
//         },
//         {
//           "theDate": "2020-09-08",
//           "carType": "2号车型",
//           "avgPassTime": 45
//         },
//         {
//           "theDate": "2020-09-08",
//           "carType": "3号车型",
//           "avgPassTime": 25
//         }
//       ]
//     }
//   ]
// }


// 卓越品质

// ----------------------------------------------  DLQ  --------------------------------------------
// 接口地址：http://192.168.43.43:53000/api/quality/dlq/list_dlq

export function listDlq(data) {
    return request({
        method: 'POST',
        url: `/quality/dlq/list_dlq`,
        data: {
            ...data
        }
    })
}

//   "data": [
//     {
//       "theDate": "2020-09-02",
//       "pecRate": null
//     },
//   ]
//AUDIT
export function listAudit(data) {
    return request({
        method: 'POST',
        url: `/quality/audit/list_audit`,
        data: {
            ...data
        }
    })
}
export function list_weeks_audit(data) {
    return request({
        method: 'POST',
        url: `/quality/audit/list_weeks_audit`,
        data: {
            ...data
        }
    })
}

//     {
//       "theDate": "2020-09-02",
//       "deduction": null
//     },
//  过审过程
export function listCoincidenceRate(data) {
    return request({
        method: 'POST',
        url: `/quality/process_audit/list_coincidence_rate`,
        data: {
            ...data
        }
    })
}

//     {
//       "theDate": "2020-09-02",
//       "pecRate": 0
//     },
// 过点质量
export function getTodayOk(data) {
    return request({
        method: 'POST',
        url: `/quality/process_audit/list_coincidence_rate`,
        data: {
            ...data
        }
    })
}
// 接口地址：http://192.168.43.43:53000/api/quality/point_mass_ratio/get_today_ok_nok
// 请求方式：POST
// 请求参数：
// {
//   "shopName": "ZZ",
//   "workCode": "78"
// }
// 响应结果：
// {
//   "success": true,
//   "code": 10000,
//   "message": "操作成功！",
//   "data": {
//     "okNum": 300,
//     "okRatio": 83,
//     "nokNum": 60,
//     "nokRatio": 17
//   }
// }

// ===========================================================================================================
// 精益物流

// ----------------------------------------------  电池包下线数量  --------------------------------------------
// 接口地址：http://192.168.43.43:54000/api/logistics/offline/battery_pack_num
// 请求方式：POST
// 请求参数：
// {
//   "workCode": "78"
// }
// 响应结果：
// {
//   "success": true,
//   "code": 10000,
//   "message": "操作成功！",
//   "data": 10000
// }
//
// 近一周的OEE趋势
export function listDayOee(data) {
    return request({
        method: 'POST',
        url: `/production/oee/list_day_oee`,
        data: {
            ...data
        }
    })
}

// 月度MTTR/MTBF
export function listMonthMttrMtbf(data) {
    return request({
        method: 'POST',
        url: `/production/mm/list_month_mttr_mtbf`,
        data: {
            ...data
        }
    })
}
// "theMonth": "2019-10",
// "mttr": 0,
// "mtbf": 0


export function pilerStatus(data) {
    return request({
        method: 'POST',
        url: `/bdc/piler/piler_status`,
        data: {
            ...data
        }
    })
}

//     {
//       "pilerName": "DDJ_A_1",
//       "pilerStatus": "1"
//     },
//     {
//       "pilerName": "DDJ_B_1",
//       "pilerStatus": "0"
//     }


//  堆垛机故障状态分析
export function pilerFault(data) {
    return request({
        method: 'POST',
        url: `/bdc/piler/piler_fault`,
        data: {
            ...data
        }
    })
}

//     {
//       "typeName": "DDJ_A_1",
//       "num": 2,
//       "ratio": 66.67
//     },
//     {
//       "typeName": "DDJ_B_1",
//       "num": 1,
//       "ratio": 33.33
//     }
//   ]
// }

// 缓存预警/库位状态/利用率
export function pilerUsageRateFault(data) {
    return request({
        method: 'POST',
        url: `/bdc/garage/cache_alert_and_location_status_and_usage_rate`,
        data: {
            ...data
        }
    })
}
// 接口地址：http://localhost:59000/api/bdc/garage/cache_alert_and_location_status_and_usage_rate

//   "data": {
//     "isCacheWarning": false,
//     "freeNum": 240,
//     "useNum": 0,
//     "useRate": 0
//   }

// 车型产量统计
export function carTypeOutput(data) {
    return request({
        method: 'POST',
        url: `/production/output/car_type_output`,
        data: {
            ...data
        }
    })
}

// BDC 在库



// 车型产量统计

// export function carTypeOutput(data) {
//     return request({
//         method: 'POST',
//         url: `/production/output/car_type_output`,
//         data:{
//             ...data
//         }
//     })
// }

// 机器人数量/自动化率
export function shopStaticValue(data) {
    return request({
        method: 'POST',
        url: `/production/output/shop_static_value`,
        data: {
            ...data
        }
    })
}
///production/output/shop_static_value

// 平均时间


export function avg_on_garage_time(data) {
    return request({
        method: 'POST',
        url: `/bdc/garage/avg_on_garage_time`,
        data: {
            ...data
        }
    })
}


//  螺栓黏紧合格率

export function tightening_pass_rate(data) {
    return request({
        method: 'POST',
        url: `/quality/bolt/tightening_pass_rate`,
        data: {
            ...data
        }
    })
}


// 吞吐量，在库数量

export function houtBDCinOut(data) {

    return request({
        method: 'GET',
        url: `/wl/houtBDCinOut`,
        params: {
            ...data
        }
    })
}


// 在库时间分析

export function dayBDCAvgTime(data) {
    return request({
        method: 'GET',
        url: `/wl/dayBDCAvgTime`,
        params: {
            ...data
        }
    })
}

// 油漆baq 实时故障记录

export function getLineInfo_YQ(data) {
    return request({
        method: 'GET',
        url: `/opc/getLineInfo_YQ`,
        params: {
            ...data
        }
    })
}

// 实时节拍

export function get_yq_ba0_real_time_data(data) {

    return request({
        method: 'GET',
        url: `/overview/td/get_yq_ba0_real_time_data`,
        params: {
            ...data
        }
    })

}


// BA0的开动率

export function ba0_kaidong_rate(data) {
    return request({
        method: 'GET',
        url: `/overview/td/ba0/rate`,
        params: {
            ...data
        }
    })
}

// BA0 产量统计

export function ba0_realProduction(data) {
    return request({
        method: 'GET',
        url: `/overview/td/ba0/realProduction`,
        params: {
            ...data
        }
    })
}

// BA0 停线记录故障

export function ba0_downInfoList(data) {
    return request({
        method: 'GET',
        url: `/overview/td/ba0/downInfo`,
        params: {
            ...data
        }
    })
}

//  总装车间 ---- 过点合格占比

export function get_today_ok_nok(data) {
    return request({
        method: 'POST',
        url: `/quality/point_mass_ratio/get_today_ok_nok`,
        data: data
    })
}


export function list_test_data(data) {
    return request({
        method: 'POST',
        url: `/quality/test_data/list_test_data`,
        data: data
    })
}


