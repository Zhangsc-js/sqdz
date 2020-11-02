import request from '@/utils/request'
import qs from 'qs'

/**
 * 获得仓库号列表
 * @param params
 */
export function getData(params) {
    return request({
        method: 'GET',
        url: `/sys/wms/warehouse/list`,
        params: {
            ...params
        }
    })
}

/**
 * 新增仓库号
 * @param record
 */
export function insertWarehouse(record) {
    return request({
        method: 'POST',
        url: `/sys/wms/warehouse/saveOrUpdate`,
        data: record
    })
}

/**
 * 更新仓库号
 * @param record
 */
export function updateWarehouse(record) {
    return request({
        method: 'POST',
        url: `/sys/wms/warehouse/saveOrUpdate`,
        data: record
    })
}

/**
 * 删除仓库号
 * @param param
 */
export function deleteWarehouse(param) {
    return request({
        method: 'GET',
        url: `/sys/wms/warehouse/delete`,
        params: param
    })
}

/**
 * 获取详情
 * @param param
 */
export function getWarehouseDetail(param) {
    return request({
        method: 'GET',
        url: `/sys/wms/warehouse/getDetail`,
        params: param
    })
}

/**
 * 获取库存地点列表
 * @param params
 */
export function getLocationList(params) {
    return request({
        method: 'GET',
        url: `/sys/wms/warehouse/location/list`,
        params: {
            ...params
        }
    })
}
/**
 * 新增仓位新增
 */
export function saveSysWmsBin(params){
    return request({
        method:"post",
        url:"/sys/wms/freightSpace/saveSysWmsBin",
        data:{
            ...params
        }
    })
}
/**
 * 仓库下拉数据获取
 */
export function findSysWmsWarehousePullDownAll(){
    return request({
        method:"get",
        url:"/sys/wms/warehouse/findPullSysWhWarehouse",
    })
}
/**
 * 获取存储区下拉数据的获取
 */
export function findSysWmsAreaPullDownAll(param){
    return request({
        method:"get",
        url:'/sys/wms/freightSpace/findSysWmsAreaPullDownAll',
        params:{
            whCode:param
        }
    })
}
/**
 * 获取所有仓位数据
 */
export function findSysWmsBinAll(params){
    return request({
        method:"get",
        url:"/sys/wms/freightSpace/findSysWmsBinAll",
        params:{
            ...params
        }
    })
}
/**
 * 根据主键删除仓位数据
 */
export function deleteSysWmsBinById(params){
    return request({
        method:"get",
        url:'/sys/wms/freightSpace/deleteSysWmsBinById',
        params:{
            ...params
        }
    })
}
/**
 * 根据主键获取仓位数据
 */
export function findSysWmsBinById(params){
    return request({
        method:"get",
        url:'/sys/wms/freightSpace/findSysWmsBinById',
        params:{
            id:params
        }
    })
}
/**
 * 修改仓位数据
 */
export function updateSysWmsBin(params){
    return request({
        method:"post",
        url:"/sys/wms/freightSpace/updateSysWmsBin",
        data:{
            ...params
        }
    })
} 
/**
 * 根据主键批量删除仓位数据
 */
export function batchDeleteSysWmsBin(params){
    return request({
        method:"post",
        url:"/sys/wms/freightSpace/batchDeleteSysWmsBin",
        data: params,
        paramsSerializer: params => {
            return qs.stringify(params, { indices: false })
        }
    })
}
/**
 * 获取存储区全部数据
 */
export function findAreaAll(){
    return request({
        method:"get",
        url:"/sys/wms/freightSpace/findAreaAll"
    })
}
/**
 * 获取存储区列表数据
 */
export function findAreaList(params){
    return request({
        method:"get",
        url:"/sys/wms/area/list",
        params:{
            ...params
        }
    })
}
/**
 * 新增修改存储区数据
 */
export function saveOrUpdate(params){
    return request({
        method:"post",
        url:'/sys/wms/area/saveOrUpdate',
        data:params
    })
}
/**
 * 根据主键查询储存区数据
 */
export function findWmsAreaByKey(params){
    return request({
        method:"get",
        url:'/sys/wms/area/findWmsAreaByKey',
        params:{
            id:params
        }
    })
}
/**
 * 根据主键删除存储区数据
 */
export function deleteWmsAreaByKey(params){
    return request({
        method:"get",
        url:"/sys/wms/area/delete",
        params:{
            id:params
        }
    })
}
/**
 * 查询全部单位类型
 */
export function findDropUnit(){
    return request({
        method:"get",
        url:"/sys/wms/area/findDropUnit"
    })
}
/**
 * 批量删除存储区数据
 */
export function deleteBatchSysArea(params){
    return request({
        method:"post",
        url:"/sys/wms/area/deleteBatchSysArea",
        data: params,
        paramsSerializer: params => {
            return qs.stringify(params, { indices: false })
        }
    })
}
/**
 * 查询全部存储单元
 */
export function findSysWmsCellAll(params){
    return request({
        method:'get',
        url:'/sys/wms/cell/findSysWmsCellAll',
        params:{
            ...params
        }
    })
}
/**
 * 新增存储单元
 */
export function saveSysWmsCell(params){
    return request({
        method:'post',
        url:'/sys/wms/cell/saveSysWmsCell',
        data:params
    })
}
/**
 * 修改存储单元
 */
export function updateSysWmsCell(params){
    return request({
        method:'post',
        url:'/sys/wms/cell/updateSysWmsCell',
        data:params
    })
}
/**
 * 删除存储单元
 */
export function deleteSysWmsCell(params){
    return request({
        method:'get',
        url:'/sys/wms/cell/deleteSysWmsCell',
        params:{
            map:params
        }
    })
}
/**
 * 根据主键查询存储单元
 */
export function findSysWmsCell(params){
    return request({
        method:'get',
        url:'/sys/wms/cell/findSysWmsCell',
        params:{
            map:params
        }
    })
}
/**
 * 获取出入库策略
 */
export function findInboundAndOutboundStrategy(){
    return request({
        method:'get',
        url:'/sys/wms/area/findInboundAndOutboundStrategy'
    })
}
/**
 * 获取存储区类型
 */
export function findStorageType(){
    return request({
        method:'get',
        url:'/sys/wms/area/findStorageType'
    })
}
/**
 * 获取采购入库列表数据
 */
export function findWmsStorageInBillAll(params){
    return request({
        method:'get',
        url:'/wms/storageInBill/findWmsStorageInBillAll',
        params:{
            ...params
        }
    })
}
/**
 * 根据id获取采购入库数据
 */
export function findWmsStorageInBillById(params){
    return request({
        method:'get',
        url:'/wms/storageInBill/findWmsStorageInBillById',
        params:{
            id:params
        }
    })
}
/**
 * 新增采购入库数据
 */
export function saveWmsStorageInBill(params){
    return request({
        method:'post',
        url:'/wms/storageInBill/saveWmsStorageInBill',
        data:params
    })
}
/**
 * 修改采购入库数据
 */
export function updateWmsStorageInBill(params){
    return request({
        method:'post',
        url:'/wms/storageInBill/updateWmsStorageInBill',
        data:params
    })
}
/**
 * 删除采购入库数据
 */
export function deleteWmsStorageInBill(params){
    return request({
        method:'get',
        url:'/wms/storageInBill/deleteWmsStorageInBill',
        params:{
            id:params
        }
    })
}
/**
 * 获取采购入库状态
 */
export function findIncomingOrdersStatus(){
    return request({
        method:'get',
        url:'/wms/storageInBill/findIncomingOrdersStatus'
    })
}
/**
 * 查询仓库列表数据
 */
export function findSysWhWarehouseAll(params){
    return request({
        method:'get',
        url:'/sys/wms/warehouse/findSysWhWarehouseAll',
        params:{
            ...params
        }
    })
}
/**
 * 根据id查询仓库数据
 */
export function findSysWhWarehouseById(params){
    return request({
        method:'get',
        url:'/sys/wms/warehouse/findSysWhWarehouseById',
        id:params
    })
}
/**
 * 新增仓库管理列表数据
 */
export function saveSysWhWarehouse(params){
    return request({
        method:'post',
        url:'/sys/wms/warehouse/saveSysWhWarehouse',
        data:params
    })
}
/**
 * 修改仓库管理列表数据
 */
export function updateSysWhWarehouse(params){
    return request({
        method:'post',
        url:'/sys/wms/warehouse/updateSysWhWarehouse',
        data:params
    })
}
/**
 * 删除仓库管理列表数据
 */
export function deleteSysWhWarehouse(params){
    return request({
        method:'get',
        url:'/sys/wms/warehouse/deleteSysWhWarehouse',
        params:{
            id:params
        }
    })
}
/**
 * 获取厂区下拉数据
 */
export function findFactory(){
    return request({
        method:'get',
        url:'/sys/wms/warehouse/findFactory'
    })
}
/**
 * 获取仓库下拉数据
 */
export function findWh(){
    return request({
        method:'get',
        url:'/sys/wms/warehouse/findWh'
    })
}
/**
 * 根据仓库号获取存储存储区数据
 */
export function findByWhCode(params){
    return request({
        method:'get',
        url:'/sys/wms/area/findByWhCode',
        params:{
            ...params
        }
    })
}
/**
 * 根据仓库号获取存储单元
 */
export function findSysWmsCellByWhCode(params){
    return request({
        method:'get',
        url:'/sys/wms/cell/findSysWmsCellByWhCode',
        params:{
            ...params
        }
    })
}
/**
 * 根据仓库号删除存储区信息
 */
export function deleteAreaByWhCode(params){
    return request({
        method:'get',
        url:'/sys/wms/warehouse/deleteAreaByWhCode',
        params:{
            whCode:params
        }
    })
}
/**
 * 根据仓库号删除存储单元
 */
export function deleteSysWmsCellByWhCode(params){
    return request({
        method:'get',
        url:'/sys/wms/warehouse/deleteSysWmsCellByWhCode',
        params:{
            whCode:params
        }
    })
}
/**
 * 获取仓库下拉数据
 */
export function findPullSysWhWarehouse(){
    return request({
        method:'get',
        url:'/sys/wms/warehouse/findPullSysWhWarehouse'
    })
}
/**
 * 根据入库主编号获取子入库单列表
 */
export function findWmsStorageInBillItemByStorageInCode(params){
    return request({
        method:'get',
        url:'/wms/storageInBill/findWmsStorageInBillItemByStorageInCode',
        params:{
            ...params
        }
    })
}
/**
 * 根据id获取子入库单数据
 */
export function findWmsStorageInBillItemById(params){
    return request({
        method:'get',
        url:'/wms/storageInBill/findWmsStorageInBillItemById',
        params:{
            id:params
        }
    })
}
/**
 * 新增子入库单数据
 */
export function saveWmsStorageInBillItem(params){
    return request({
        method:'post',
        url:'/wms/storageInBill/saveWmsStorageInBillItem',
        data:params
    })
}
/**
 * 修改子入库单数据
 */
export function updateWmsStorageInBillItem(params){
    return request({
        method:'post',
        url:'/wms/storageInBill/updateWmsStorageInBillItem',
        data:params
    })
}
/**
 * 删除子入库单数据
 */
export function deleteWmsStorageInBillItem(params){
    return request({
        method:'get',
        url:'/wms/storageInBill/deleteWmsStorageInBillItem',
        params:{
            id:params
        }
    })
}
/**
 * 根据工厂获取仓库下拉数据
 */
export function findPullSysWhWarehouseByDepartCode(params){
    return request({
        method:'get',
        url:'/sys/wms/warehouse/findPullSysWhWarehouseByDepartCode',
        params:{
            ...params
        }
    })
}
/**
 * 根据主键获取仓位下拉数据
 */
export function findPullWmsBin(params){
    return request({
        method:'get',
        url:'/sys/wms/freightSpace/findPullWmsBin',
        params:{
            ...params
        }
    })
}
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
 * 获取全部仓位信息
 */
export function findBinAll(){
    return request({
        method:'get',
        url:'/sys/wms/freightSpace/findBinAll'
    })
}
/**
 * 获取物料库存信息列表
 */
export function findMaterials(params){
    return request({
        method:'get',
        url:'/wms/wmsStock/findMaterials',
        params:{
            ...params
        }
    })
}
/** 
 * 获取批次库存信息列表
*/
export function findByStockCode(params){
    return request({
        method:'get',
        url:'/wms/wmsStock/findByStockCode',
        params:{
            stockCode:params
        }
    })
}
/**
 * 获取出入库流水信息列表
 */
export function findWmsStockHistoryByBatch(params){
    return request({
        method:'get',
        url:'/wms/wmsStock/findWmsStockHistoryByBatch',
        params:{
            ...params
        }
    })
}
/**
 * 获取入库类型
 */
export function findStorageTypes(){
    return request({
        method:'get',
        url:'/wms/storageInBill/findStorageType'
    })
}
/**
 * 获取excel导出数据
 */
export function findWmsStorageInBillAndItemVo(params){
    return request({
        method:'get',
        url:'/wms/storageInBill/findWmsStorageInBillAndItemVo',
        params:{
            map:params
        },
        responseType: 'blob'
        
    })
}
/**
 * 获取库存预警数据列表
 */
export function findWmsSafetyMaterial(params){
    return request({
        method:'get',
        url:'/wms/wmsMaterial/findWmsSafetyMaterial',
        params:{
            ...params
        }
    })
}
/**
 * 获取物料类别数据
 */
export function getMaterialType(){
    return request({
        method:'get',
        url:'/wms/wmsMaterial/getMaterialType'
    })
}