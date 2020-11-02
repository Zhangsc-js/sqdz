// GET /wl/deliveryRate
// //月度交货完成率
// GET /wl/deyOkRate交货准时率
// GET /wl/localizationRate国产化率
// GET /wl/marketForecasting销售预测
// GET /wl/onPassage在途车辆
// GET /wl/pullRisk拉动风险,到货日期在当前时间倒推三个月
// GET /wl/repertoryCoverDays库存覆盖天数
// GET /wl/repertoryRate库存周转率
// GET /wl/singleOrder单车-订单数据
// GET /wl/singleParts单车-关键零部件
// GET /wl/singleShopInfo单车-车间信息
// GET /wl/suppBehindNum供应商欠交次数
// GET /wl/supplierAreaRatetheArea=各省、区域，theNum=供货量
// GET /wl/supplierInOuttotNum=当月供货量，inNum=国内供货量，用于计算海外供货/国内比例
// GET /wl/transshipmentRate

import request from '@/utils/request';

//月度交货完成率
export function deliveryRate(data) {
    return request({
        method: 'GET',
        url: `/wl/deliveryRate`,
        params:{
            ...data
        }
    })
}
//交货准时率
export function deyOkRate(data) {
    return request({
        method: 'GET',
        url: `/wl/deyOkRate`,
        params:{
            ...data
        }
    })
}

// 国产化率
export function localizationRate(data) {
    return request({
        method: 'GET',
        url: `/wl/localizationRate`,
        params:{
            ...data
        }
    })
}

// 销售预测
export function marketForecasting(data) {
    return request({
        method: 'GET',
        url: `/wl/marketForecasting`,
        params:{
            ...data
        }
    })
}

// 在途车辆
export function onPassage(data) {
    return request({
        method: 'GET',
        url: `/wl/onPassage`,
        params:{
            ...data
        }
    })
}

// 拉动风险,到货日期在当前时间倒推三个月
export function pullRisk(data) {
    return request({
        method: 'GET',
        url: `/wl/pullRisk`,
        params:{
            ...data
        }
    })
}





// 库存周转率
export function repertoryRate(data) {
    return request({
        method: 'GET',
        url: `/wl/repertoryRate`,
        params:{
            ...data
        }
    })
}


// theArea=各省、区域，theNum=供货量
export function supplierAreaRate(data) {
    return request({
        method: 'GET',
        url: `/wl/supplierAreaRate`,
        params:{
            ...data
        }
    })
}

// totNum=当月供货量，inNum=国内供货量，用于计算海外供货/国内比例
export function supplierInOut(data) {
    return request({
        method: 'GET',
        url: `/wl/supplierInOut`,
        params:{
            ...data
        }
    })
}

// 货车转载率
export function transshipmentRate(data) {
    return request({
        method: 'GET',
        url: `/wl/transshipmentRate`,
        params:{
            ...data
        }
    })
}



export function repertoryCoverDays(data) {
    return request({
        method: 'GET',
        url: `/wl/repertoryCoverDays`,
        params:{
            ...data
        }
    })
}

// /wl/JHWC_rateMonth交货完成率月度曲线
export function JHWC_rateMonth(data) {
    return request({
        method: 'GET',
        url: `/wl/JHWC_rateMonth`,
        params:{
            ...data
        }
    })
}
// GET /wl/KCZZ_rateMonth库存周转率月度曲线

export function KCZZ_rateMonth(data) {
    return request({
        method: 'GET',
        url: `/wl/KCZZ_rateMonth`,
        params:{
            ...data
        }
    })
}
// GET /wl/coverDaysMonth覆盖天数月度曲线
export function coverDaysMonth(data) {
    return request({
        method: 'GET',
        url: `/wl/coverDaysMonth`,
        params:{
            ...data
        }
    })
}
// GET /wl/deliRateMonth库存装载率月度曲线

export function deliRateMonth(data) {
    return request({
        method: 'GET',
        url: `/wl/deliRateMonth`,
        params:{
            ...data
        }
    })
}


//GET /wl/locRateMonth国产化率月度曲线

export function locRateMonth(data) {
    return request({
        method: 'GET',
        url: `/wl/locRateMonth`,
        params:{
            ...data
        }
    })
}



export function repertoryRateMonth(data) {
    return request({
        method: 'GET',
        url: `/wl/repertoryRateMonth`,
        params:{
            ...data
        }
    })
}

// 库位liyonglv趋势
export function KWLY_rateDate(data) {
    return request({
        method: 'GET',
        url: `/wl/KWLY_rateDate`,
        params:{
            ...data
        }
    })
}
//  获取 国产化率的接口

export function get_analysis_of_delivery(data){
    return request({
        method: 'GET',
        url: `/wl/get_analysis_of_delivery`,
        params:{
            ...data
        }
    })
}

// 实际产量和 计划产量

export function planAndActualFinishWeek(data){
    return request({
        method: 'GET',
        url: `/wl/planAndActualFinishWeek`,
        params:{
            ...data
        }
    })
}


// 收货体积 和收货箱数 总 。

export function list_day_total_warehouse_use_info(data){
    return request({
        method: 'POST',
        url: `/logistics/warehouse/list_day_total_warehouse_use_info`,
        data:{
            ...data
        }
    })
}
export function list_weeks_total_warehouse_use_info(data){
    return request({
        method: 'POST',
        url: `/logistics/warehouse/list_weeks_total_warehouse_use_info`,
        data:{
            ...data
        }
    })
}




