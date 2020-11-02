import request from '@/utils/request'
/**
 * 冲压3d视图
 * @param {
 * type
 * } params
 * */
export function threeDinfo(data) {
    return request({
        method: 'POST',
        url: `/overview/td/get_real_time_data`,
        data:{
            ...data
        }
    })
}
/**
 * 当月累计产量
 * @param {
 * */
export function productioninfo(data) {
    return request({
        method: 'POST',
        url: `/production/output/today_production_info`,
        data:{
            ...data
        }
    })
}

/**
 * 模具产量
 * @param {
 * */
export function switchinfo(data) {

    return request({
        method: 'POST',
        url: `/production/mold/switch_time_and_num`,
        data:{
            ...data
        }
    })
}

/**
 * MTTR/MTBF相关接口
 * */
export function Mttrinfo(data) {
    return request({
        method: 'POST',
        url: `/production/mm/list_month_mttr_mtbf`,
        data:{
            ...data
        }
    })
}

/**
 * OEE相关接口
 * */
export function Oeeinfo(data) {
    return request({
        method: 'POST',
        url: `/production/oee/list_day_oee`,
        data:{
            ...data
        }
    })
}

/**
 * 更新
 * */
export function updateUnit(data) {
    return request({
        method: 'POST',
        url: `/zzsd/unit/update`,
        data: {
            ...data
        }
    })
}


/**
 * 物料列表
 * @param {
 * page,
 * specId,
 * specCode,
 * specName
 * } params
 * */
export function specList(data) {
    return request({
        method: 'POST',
        url: `/zzsd/matspec/list`,
        data: {
            ...data
        }
    })
}

/**
 * 根据Id获取一条记录
 * */
export function specInfo(id) {
    return request({
        method: 'POST',
        url: `/zzsd/matspec/info/${id}`
    })
}

/**
 * 根据id删除
 * */
export function delSpec(data) {
    return request({
        method: 'POST',
        url: `/zzsd/matspec/delete`,
        data:data

    })
}

/**
 * 新增
 * */
export function addSpec(data) {
    return request({
        method: 'POST',
        url: `/zzsd/matspec/save`,
        data: {
            ...data
        }
    })
}

/**
 * 更新
 * */
export function updateSpec(data) {
    return request({
        method: 'POST',
        url: `/zzsd/matspec/update`,
        data: {
            ...data
        }
    })
}

/**
 * 物料分类列表
 * @param {
 * page
 * } params
 * */
export function goodsTypeList(data) {
    return request({
        method: 'POST',
        url: `/zzsd/goodstype/list`,
        data: {
            ...data
        }
    })
}

/**
 * 根据Id获取一条记录
 * */
export function goodsTypeInfo(id) {
    return request({
        method: 'POST',
        url: `/zzsd/goodstype/info/${id}`
    })
}

/**
 * 根据id删除
 * */
export function delGoodsType(data) {
    return request({
        method: 'POST',
        url: `/zzsd/goodstype/delete`,
        data:data

    })
}

/**
 * 新增
 * */
export function addGoodsType(data) {
    return request({
        method: 'POST',
        url: `/zzsd/goodstype/save`,
        data: {
            ...data
        }
    })
}

/**
 * 更新
 * */
export function updateGoOdsType(data) {
    return request({
        method: 'POST',
        url: `/zzsd/goodstype/update`,
        data: {
            ...data
        }
    })
}


/**
 * 库房管理列表
 * @param {
 * page
 * } params
 * */
export function bankroomList(data) {
    return request({
        method: 'POST',
        url: `/zzsd/bankroom/list`,
        data: {
            ...data
        }
    })
}

/**
 * 根据Id获取一条记录
 * */
export function bankroomInfo(id) {
    return request({
        method: 'POST',
        url: `/zzsd/bankroom/info/${id}`
    })
}

/**
 * 根据id删除
 * */
export function delBankroom(data) {
    return request({
        method: 'POST',
        url: `/zzsd/bankroom/delete`,
        data:data

    })
}

/**
 * 新增
 * */
export function addBankroom(data) {
    return request({
        method: 'POST',
        url: `/zzsd/bankroom/save`,
        data: {
            ...data
        }
    })
}

/**
 * 更新
 * */
export function updateBankroom(data) {
    return request({
        method: 'POST',
        url: `/zzsd/bankroom/update`,
        data: {
            ...data
        }
    })
}



/**
 * 库位管理列表
 * @param {
 * page
 * } params
 * */
export function bankposList(data) {
    return request({
        method: 'POST',
        url: `/zzsd/bankpos/list`,
        data: {
            ...data
        }
    })
}

/**
 * 根据Id获取一条记录
 * */
export function bankposInfo(id) {
    return request({
        method: 'POST',
        url: `/zzsd/bankpos/info/${id}`
    })
}

/**
 * 根据id删除
 * */
export function delBankpos(data) {
    return request({
        method: 'POST',
        url: `/zzsd/bankpos/delete`,
        data:data

    })
}

/**
 * 新增
 * */
export function addBankpos(data) {
    return request({
        method: 'POST',
        url: `/zzsd/bankpos/save`,
        data: {
            ...data
        }
    })
}

/**
 * 更新
 * */
export function updateBankpos(data) {
    return request({
        method: 'POST',
        url: `/zzsd/bankpos/update`,
        data: {
            ...data
        }
    })
}






/**
 * 物料明细列表
 * @param {
 * page
 * } params
 * */
export function goodsList(data) {
    return request({
        method: 'POST',
        url: `/zzsd/goods/list`,
        data: {
            ...data
        }
    })
}

/**
 * 根据Id获取一条记录
 * */
export function goodsInfo(id) {
    return request({
        method: 'POST',
        url: `/zzsd/goods/info/${id}`
    })
}

/**
 * 根据id删除
 * */
export function delGoods(data) {
    return request({
        method: 'POST',
        url: `/zzsd/goods/delete`,
        data:data

    })
}

/**
 * 新增
 * */
export function addGoods(data) {
    return request({
        method: 'POST',
        url: `/zzsd/goods/save`,
        data: {
            ...data
        }
    })
}

/**
 * 更新
 * */
export function updateGoods(data) {
    return request({
        method: 'POST',
        url: `/zzsd/goods/update`,
        data: {
            ...data
        }
    })
}

/**
 * 供应商分类列表
 * @param {
 * page
 * } params
 * */
export function gystypeList(data) {
    return request({
        method: 'POST',
        url: `/zzsd/gystype/list`,
        data: {
            ...data
        }
    })
}

/**
 * 根据Id获取一条记录
 * */
export function gystypeInfo(id) {
    return request({
        method: 'POST',
        url: `/zzsd/gystype/info/${id}`
    })
}

/**
 * 根据id删除
 * */
export function delGystype(data) {
    return request({
        method: 'POST',
        url: `/zzsd/gystype/delete`,
        data:data

    })
}

/**
 * 新增
 * */
export function addGystype(data) {
    return request({
        method: 'POST',
        url: `/zzsd/gystype/save`,
        data: {
            ...data
        }
    })
}

/**
 * 更新
 * */
export function updateGystype(data) {
    return request({
        method: 'POST',
        url: `/zzsd/gystype/update`,
        data: {
            ...data
        }
    })
}

/**
 * 供应商级别列表
 * @param {
 * page
 * } params
 * */
export function gysgradesetList(data) {
    return request({
        method: 'POST',
        url: `/zzsd/gysgradeset/list`,
        data: {
            ...data
        }
    })
}

/**
 * 根据id获取一条记录
 * */
export function gysgradesetInfo(id) {
    return request({
        method: 'POST',
        url: `/zzsd/gysgradeset/info/${id}`
    })
}

/**
 * 根据id删除
 * */
export function delGysgradeset(data) {
    return request({
        method: 'POST',
        url: `/zzsd/gysgradeset/delete`,
        data:data

    })
}

/**
 * 新增
 * */
export function addGysgradeset(data) {
    return request({
        method: 'POST',
        url: `/zzsd/gysgradeset/save`,
        data: {
            ...data
        }
    })
}

/**
 * 更新
 * */
export function updateGysgradeset(data) {
    return request({
        method: 'POST',
        url: `/zzsd/gysgradeset/update`,
        data: {
            ...data
        }
    })
}


/**
 * 供应商资料列表
 * @param {
 * page
 * } params
 * */
export function gysinfoList(data) {
    return request({
        method: 'POST',
        url: `/zzsd/gysinfo/list`,
        data: {
            ...data
        }
    })
}

/**
 * 根据id获取一条记录
 * */
export function gysinfoInfo(id) {
    return request({
        method: 'POST',
        url: `/zzsd/gysinfo/info/${id}`
    })
}

/**
 * 根据id删除
 * */
export function delGysinfo(data) {
    return request({
        method: 'POST',
        url: `/zzsd/gysinfo/delete`,
        data:data

    })
}

/**
 * 新增
 * */
export function addGysinfo(data) {
    return request({
        method: 'POST',
        url: `/zzsd/gysinfo/save`,
        data:data
    })
}

/**
 * 更新
 * */
export function updateGysinfo(data) {
    return request({
        method: 'POST',
        url: `/zzsd/gysinfo/update`,
        data: {
            ...data
        }
    })
}


/**
 * 客户资料列表
 * @param {
 * page
 * } params
 * */
export function customerList(data) {
    return request({
        method: 'POST',
        url: `/zzsd/customerinfo/list`,
        data: {
            ...data
        }
    })
}

/**
 * 根据id获取一条记录
 * */
export function customerInfo(id) {
    return request({
        method: 'POST',
        url: `/zzsd/customerinfo/info/${id}`
    })
}

/**
 * 根据id删除
 * */
export function delCustomerinfo(data) {
    return request({
        method: 'POST',
        url: `/zzsd/customerinfo/delete`,
        data:data

    })
}

/**
 * 新增
 * */
export function addCustomerinfo(data) {
    return request({
        method: 'POST',
        url: `/zzsd/customerinfo/save`,
        data: {
            ...data
        }
    })
}

/**
 * 更新
 * */
export function updateCustomerinfo(data) {
    return request({
        method: 'POST',
        url: `/zzsd/customerinfo/update`,
        data: {
            ...data
        }
    })
}

/**
 * 人员列表
 * */
export function userList(data) {
    return request({
        method: 'POST',
        url: `/zzsd/user/list`,
        data: {
            ...data
        }
    })
}


// 模具切换次数/模具切换时间  --------------------------------------------

// export function switchTimeAndNum(data) {
//     return request({
//         method: 'GET',
//         url: `/production/mold/switch_time_and_num`,
//         data: {
//             ...data
//         }
//     })
// }

// 当月累计产量/当月生产完成率  --------

export function monthProduction(data) {
    return request({
        method: 'POST',
        url: `/production/output/get_month_production`,
        data: {
            ...data
        }
    })
}

//返工数/返工率/报废数/报废率/合格数/合格率
///production/part/get_scrap_rework_qualified
export function getScrapReworkQualified(data) {
    return request({
        method: 'POST',
        url: `/production/part/get_scrap_rework_qualified`,
        data: {
            ...data
        }
    })
}


export function safeProductionDays(data) {
    return request({
        method: 'POST',
        url: `/overview/safety/safe_production_days`,
        data: {
            ...data
        }
    })
}
 
// 实时多线数据

export function listLineBodyRealTimeData(data) {
    return request({
        method: 'POST',
        url: `/overview/td/list_line_body_real_time_data`,
        data: {
            ...data
        }
    })
}
// 当月累计产量/当月生产完成率  
// /production/output/get_month_production
export function getMonthProduction(data) {
    return request({
        method: 'POST',
        url: `/production/output/get_month_production`,
        data: {
            ...data
        }
    })
}

// 获取设备故障分析  存在内外环饼图 

//内环
export function cy_downtime_analyze(data) {
    return request({
        method: 'POST',
        url: `/device/downtime/downtime_analyze`,
        data: {
            ...data
        }
    })
}

//外环
export function cy_status_analyze(data) {
    return request({
        method: 'POST',
        url: `/device/status/status_analyze`,
        data: {
            ...data
        }
    })
}



 //  获取停线记录的接口


export function downtime_record(data) {
    return request({
        method: 'POST',
        url: `/device/downtime/downtime_record`,
        data: {
            ...data
        }
    })
}


