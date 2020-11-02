import request from '@/utils/request'


/**
 * 吞吐量
 * @param {
 * type
 * } params
 * */
export function throughputinfo(data) {
    return request({
        method: 'POST',
        url: `/production/throughput/list_throughput`,
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
 * 根据id删除
 * */
export function delUnits(data) {
    return request({
        method: 'POST',
        url: `/zzsd/unit/delete`,
        data:data
    })
}

/**
 * 新增
 * */
export function addUnit(data) {
    return request({
        method: 'POST',
        url: `/zzsd/unit/save`,
        data: {
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

// 平均在库时间
export function avgLibraryList(data) {
    return request({
        method: 'POST',
        url: `/logistics/warehouse/list_avg_time_in_library`,
        data: {
            ...data
        }
    })
}
 
// 平均里程 

export function mileageList(data) {
    return request({
        method: 'POST',
        url: `/ee/stacker/list_asrs_stacker_avg_mileage`,
        data: {
            ...data
        }
    })
}

// /device/asrs_device/list_asrs_device_status?deviceType=3
// 堆垛车状态
export function deviceStatus(data) {
    return request({
        method: 'GET',
        url: `/device/asrs_device/list_asrs_device_status`,
       params:{
            ...data
        }
    })
}

// /device/device_info/get_asrs_device_num

export function asrsDeviceNum(data) {
    return request({
        method: 'GET',
        url: `/device/device_info/get_asrs_device_num`,
        params:{
            ...data
        }
    })
}

// 正在使用库位数/未使用库位数
export function storageLocation(data) {
    return request({
        method: 'GET',
        url: `/overview/storage_location/use_info`,
        params:{
            ...data
        }
    })
}


// 正在使用库位数/未使用库位数
export function realTimeThroughPut(data) {
    return request({
        method: 'GET',
        url: `/overview/throughput/get_real_time_throughput`,
        params:{
            ...data
        }
    })
}

// 3D总览

export function realTimeStaus(data) {
    return request({
        method: 'GET',
        url: `/overview/storage_location/list_real_time_staus`,
        params:{
            ...data
        }
    })
}

// 产能分析

export function listOutput(data) {
    return request({
        method: 'POST',
        url: `/production/output/list_output`,
        data:{
            ...data
        }
    })
}

// 平均在库时间

export function get_part_type_num(data) {
    return request({
        method: 'GET',
        url: `/production/part/get_part_type_num`,
        params:{
            ...data
        }
    })
}

// 高架库开动率趋势

export function gjq_avvw(data) {
    return request({
        method: 'POST',
        url: `/production/output/list_avvw`,
        data:{
            ...data
        }
    })
}


// 高架库 mttr / mtbf
export function gjq_list_month_mttr_mtbf(data) {
    return request({
        method: 'POST',
        url: `/production/mm/list_month_mttr_mtbf`,
        data:{
            ...data
        }
    })
}

// 高架库在库时间分析
export function gjq_list_avg_time_library(data) {
    return request({
        method: 'POST',
        url: `/logistics/warehouse/list_avg_time_in_library`,
        data:{
            ...data
        }
    })
}

// 高架库库位效率
export function gjq_list_warehouse_use_rate(data) {
    return request({
        method: 'POST',
        url: `/logistics/warehouse/list_warehouse_use_rate`,
        data:{
            ...data
        }
    })
}

// 吞吐量接口

export function listThroughputNew(data) {
    return request({
        method: 'POST',
        url: `/logistics/warehouse/list_throughput`,
        data:{
            ...data
        }
    })
}

