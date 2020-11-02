import request from '@/utils/request'


/***********************  出库  ***************************************/
// 出库页面相关功能
/**
 * 获取领料出库列表数据
 */
export function findOutList(params){
    return request({
        method:'get',
        url:'/wms/outStorage/findOutList',
        params:{
            ...params
        }
    })
}
/**
 * 根据id获取领料出库数据
 */
export function findOutById(params){
    return request({
        method:'get',
        url:'/wms/outStorage/findOutById',
        params:{
            id:params
        }
    })
}

/**
 * 删除领料出库数据
 */
export function deleteOutStorage(params){
    return request({
        method:'get',
        url:'/wms/outStorage/deleteOutStorage',
        params:{
            outId:params
        }
    })
}
/**
 * 获取领料出库状态
 */
export function findDictDetails(params){
    return request({
        method:'get',
        url:'/wms/outStorage/findDictDetails',
        params:{
            mainCode:params
        }
    })
}

/**
 * 获取领料单列表
 */
export function findPickList(params){
    return request({
        method:'get',
        url:'/wms/outStorage/findPickList',
        params:{
            ...params
        }
    })
}

/**
 * 跳转至新增出库单页面
 */
export function redirectPage(params){
    this.$router.push({name: '/order/page1', params});
}

/**
 * 保存出库单数据
 */
export function saveOutStorage(params){
    return request({
        method:'post',
        url:'/wms/outStorage/saveOutStorage',
        data:params
    })
}

/**
 * 提交出库单
 */
export function submitOutStorage(params){
    return request({
        method:'post',
        url:'/wms/outStorage/submitOutStorage',
        data:params
    })
}

/**
 * 根据id获取出库单数据
 */
export function findWmsOutStorageById(params){
    return request({
        method:'get',
        url:'/wms/outStorage/findOutById',
        params:{
            id:params
        }
    })
}

/**
 * 删除子出库单明细数据
 */
export function deleteOutStorageDetails(params){
    return request({
        method:'get',
        url:'/wms/outStorage/deleteOutDetails',
        params:{
            ...params
        }
    })
}

export function findStockBinList(params){
    return request({
        method:'get',
        url:'/wms/outStorage/findStockBinList',
        params:{
            ...params
        }
    })
}

/**
 * 更新库存
 */
export function saveStockBins(params){
    return request({
        method:'post',
        url:'/wms/outStorage/saveStockBins',
        data:params
    })
}

/**
 * 获取已有库存的物料列表
 */
 export function findMaterials(params){
    return request({
        method:'get',
        url:'/wms/outStorage/findMaterials',
        params:{
            ...params
        }
    })
}
/***********************  出库  ***************************************/



/**
 * 获取全部仓库信息
 */
export function findWhAll(){
    return request({
        method:'get',
        url:'/sys/wms/warehouse/findWhAll'
    })
}

/**
 * 获取出库单类型数组
 */
export function findOutBillType(){
    let billTypeArr = [];
    billTypeArr.push({"code":1,"name":"基于领料出库"});
    billTypeArr.push({"code":2,"name":"基于补料出库"});
    billTypeArr.push({"code":3,"name":"基于换料出库"});
    billTypeArr.push({"code":4,"name":"基于退料出库"});
    billTypeArr.push({"code":5,"name":"基于零星领料出库"});
    return billTypeArr;
}



