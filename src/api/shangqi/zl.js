// 3D总览
import request from '@/utils/request'


/**
 *  实时数据
 * */
export function dailyPeopleTotal(data) {
    return request({
        method: 'GET',
        url: `/primary/overview/dailyPeopleTotal`,
        params:{
            ...data
        }
    })
}

// params: 110

/**
 * 安全生产天数
 * */
export function safeDays(data) {
    return request({
        method: 'GET',
        url: `/primary/overview/safeDays`,
        params:{
            ...data
        }
    })
}
// 实时产量
export function realYiel(data) {
    return request({
        method: 'GET',
        url: `/data/primary/overview/realYield`,
        params:{
            ...data
        }
    })
}
// params: 110
// 四、网络安全
export function internetSafe(data) {
    return request({
        method: 'GET',
        url: `/primary/overview/internetSafe`,
        params:{
            ...data
        }
    })
}


// 制造运营大数据风险预警
export function warningInfo(data) {
    return request({
        method: 'GET',
        url: `/primary/warning/info`,
        params:{
            ...data
        }
    })
}

//  风险预警

export function getProWarnInfo(data) {
    return request({
        method: 'GET',
        url: `/wl/getProWarnInfo`,
        params:{
            ...data
        }
    })
}

// [
//     {
//         "WarningTime": "2020-09-09 10:54:36",
//         "id": 10,
//         "position": "总装车间",
//         "proposal": "检查维护",
//         "responsibleTeam": "PMIG-2",
//         "shopName": "ZZ",
//         "solutionTime": "2020-09-10 10:54:57",
//         "type": "设备故障预警",
//         "warningTime": "2020-09-09 10:54:36",
//         "workCode": "78"
//     },
//     {

//         "id": 11,
//         "position": "车身车间",
//         "proposal": "返工",
//         "responsibleTeam": "PMIG-3",
//         "shopName": "CS",
//         "solutionTime": "2020-09-10 10:58:09",
//         "type": "质量事故预警",
//         "warningTime": "2020-09-09 10:57:41",
//         "workCode": "78"
//     }
// ],

// AUDIT
export function qualityAudit(data) {
    return request({
        method: 'GET',
        url: `/primary/quality/audit`,
        params:{
            ...data
        }
    })
}


//产量分析 .五周不同车型产量
// 暂无域名
export function capacityList(data) {
    return request({
        method: 'GET',
        url: `/data/primary/production/capacity`,
        params:{
            ...data
        }
    })
}// [...new Set()]

///data/primary/production/capacity

// 2.五周jph值
// export function fiveWeekJPH(data) {
//     return request({
//         method: 'GET',
//         url: `/data/primary/production/realJPH`,
//         params:{
//             ...data
//         }
//     })
// }
// DLQ
export function qualityDlq(data) {
    return request({
        method: 'GET',
        url: `/data/primary/quality/DLQ`,
        params:{
            ...data
        }
    })
}

//关键供应商质量能力分布图
export function supplierGrade(data) {
    return request({
        method: 'GET',
        url: `/data/primary/quality/supplierGrade`,
        params:{
            ...data
        }
    })
}


// 精益物流
//供应商数量
export function supplierTotal(data) {
    return request({
        method: 'GET',
        url: `/data/primary/logistics/supplierTotal`,
        params:{
            ...data
        }
    })
}

// 国产化零件认可趋势

export function domesticTrend(data) {
    return request({
        method: 'GET',
        url: `/data/primary/quality/domestic/trend`,
        params:{
            ...data
        }
    })
}


// 零件种类数量
export function sparePartTotal1(data) {
    return request({
        method: 'GET',
        url: `/data/primary/logistics/sparePartTotal`,
        params:{
            ...data
        }
    })
}

// 零件发货数量
// data/primary/logistics/deliverCarTotal

export function deliverCarTotal(data) {
    return request({
        method: 'GET',
        url: `/data/primary/logistics/deliverCarTotal`,
        params:{
            ...data
        }
    })
}
// 零件国产化率
// 接口地址：:8023/api/data/primary/logistics/sparePartTotal

export function sparePartTotal(data) {
    return request({
        method: 'GET',
        url: `/data/primary/logistics/sparePartTotal`,
        params:{
            ...data
        }
    })
}

///data/primary/production/TSTAndPKG

export function TSTAndPKG(data) {
    return request({
        method: 'GET',
        url: `/data/primary/production/TSTAndPKG`,
        params:{
            ...data
        }
    })
}
//零件国产化率
export function localizationParts(data) {
    return request({
        method: 'GET',
        url: `/data/primary/logistics/localizationParts`,
        params:{
            ...data
        }
    })
}
// 产能分析
export function fiveWeekJPH(data) {
    return request({
        method: 'GET',
        url: `/data/primary/production/dailyJPH`,
        params:{
            ...data
        }
    })
}

export function fiveHourJPH(data) {
    return request({
        method: 'GET',
        url: `/data/primary/production/hourJPH`,
        params:{
            ...data
        }
    })
}
///fiveWeekJPH

export function realJPH(data) {
    return request({
        method: 'GET',
        url: `/data/primary/production/realJPH`,
        params:{
            ...data
        }
    })
}

export function flow(data) {
    return request({
        method: 'GET',
        url: `/primary/logistics/flow`,
        params:{
            ...data
        }
    })
}

// 计划产量
export function planNums(data) {
    return request({
        method: 'GET',
        url: `/primary/overview/planNums`,
        params:{
            ...data
        }
    })
}

// 完成率
// 接口地址：:8023/api/data/primary/overview/completeRate
export function completeRate(data) {
    return request({
        method: 'GET',
        url: `/data/primary/overview/completeRate`,
        params:{
            ...data
        }
    })
}

///data/primary/production/vehicleTracking
export function vehicleTracking(data) {
    return request({
        method: 'GET',
        url: `/data/primary/production/vehicleTracking`,
        params:{
            ...data
        }
    })
}

// /库位利用率

export function rate_dey(data) {
    return request({
        method: 'GET',
        url: `/primary/logistics/rate/pos`,
        params:{
            ...data
        }
    })
}
//库存周转率
///primary/logistics/rate
export function rate(data) {
    return request({
        method: 'GET',
        url: `/primary/logistics/rate/rep`,
        params:{
            ...data
        }
    })
}
// 完成率
export function jhwc(data) {
    return request({
        method: 'GET',
        url: `/primary/logistics/rate/jhwc`,
        params:{
            ...data
        }
    })
}

//废水红绿灯

export function getEP_FSSJ(data) {
    return request({
        method: 'GET',
        url: `/wl/getEP_FSSJ`,
        params:{
            ...data
        }
    })
}

//废气红绿灯

export function getEP_ZTPF(data) {
    return request({
        method: 'GET',
        url: `/wl/getEP_ZTPF`,
        params:{
            ...data
        }
    })
}
// 总能耗趋势
export function energyTotal(data) {
    return request({
        method: 'GET',
        url: `/primary/energy/total`,
        params:{
            ...data
        }
    })
}

// 总能耗桑吉图

export function sankeyDiagram(data) {
    return request({
        method: 'GET',
        url: `/primary/energy/sankeyDiagram`,
        params:{
            ...data
        }
    })
}

//废气红绿灯

export function dlz(data) {
    return request({
        method: 'GET',
        url: `/data/primary/overview/dlz`,
        params:{
            ...data
        }
    })
}



// 单车信息
export function oneCar(data) {
    return request({
        method: 'GET',
        url: `/primary/energy/oneCar`,
        params:{
            ...data
        }
    })
}


export function library(data) {
    return request({
        method: 'GET',
        url: `/primary/factory/library`,
        params:{
            ...data
        }
    })
}

// 单耗目标
export function yearTceOneCar(data) {
    return request({
        method: 'GET',
        url: `/primary/energy/yearTceOneCar`,
        params:{
            ...data
        }
    })
}

// 总耗目标
export function yearTotal(data) {
    return request({
        method: 'GET',
        url: '/primary/energy/yearTotal',
        params: data,
    })
}


///primary/factory/library
// 获取油漆摄像头

export function YQ_image(data) {
    return request({
        method: 'GET',
        url: '/opc/YQ_image',
        params: data,
    })
}


// 获取 总览界面的 5个pin

export function overview_pin(data) {
    return request({
        method: 'GET',
        url: '/data/primary/overview/pin',
        params: data,
    })
}


// 获取  库存覆盖天数
export function rate_day(data) {
    return request({
        method: 'GET',
        url: '/primary/logistics/rate/days',
        params: data,
    })
}




