import request from '@/utils/request'
import qs from 'qs'

/**
 * 批量删除
 * @param ids
 */
export function batchDelCheckProjects(ids) {
    return request({
        method:'DELETE',
        url:'dev/checkProject/batch',
        data:ids,
        paramsSerializer:ids=>{
            return qs.stringify(ids,{
                indices:false
            })
        }
    })
}
/****************************** 过磅单API开始 ***********************************************/

/**
 * 获取过磅单列表
 * @param params
 */
export function getAllLists(params){
    return request({
        method:'GET',
        url:'/wei/weighingList',
        params: { ...params }
    })
}

/**
 * 删除
 * @param param
 */
export function delWeighingList(param) {
    return request({
        method: 'DELETE',
        url:'/wei/weighingList/'+param
    })
}
/****************************** 过磅单API结束 ***********************************************/

/****************************** 车辆管理API开始 ***********************************************/

/**
 * 获取车辆列表
 * @param params
 */
export function getWeiCars(params) {
    return request({
        method:'GET',
        url:'/wei/carCon/cars',
        params:{...params}
    })
}

/**
 * 新增车辆信息
 * @param params
 */
export function addWeiCars(params){
    return request({
        method:'POST',
        url:'/wei/carCon/cars',
        params:{...params}
    })
}

/**
 * 更新
 * @param param
 */
export function updateWeiCars(param) {
    return request({
        method:'PUT',
        url:'/wei/carCon/cars/'+param.id,
        params: {...param }
    })
}

/**
 * 车辆详情
 * @param param
 */
export function getWeiCarsDetails(param) {
    return request({
        method:'GET',
        url:'/wei/carCon/cars/'+param
    })
}

/**
 * 删除车辆
 * @param param
 */
export function delWeiCars(param) {
    return request({
        method: 'DELETE',
        url:'/wei/carCon/cars/'+param
    })
}
/****************************** 车辆管理API结束 ***********************************************/


/****************************** 进厂计量管理API开始 ***********************************************/
/**
 * 新增检斤记录
 * @param params
 */
export function addInMeters(params) {
    return request({
        method:'POST',
        url:'/wei/inMeterCon/inMetering',
        data:{...params}
    })
}

/**
 * 条件查询
 * @param params
 */
export function getAllInMeter(params){
    return request({
        method:'GET',
        url:'/wei/inMeterCon/inMetering',
        params:{...params}
    })
}

/**
 * 空载
 * @param params
 */
export function getEmptyInMeters(params){
    return request({
        method:'GET',
        url:'/wei/inMeterCon/inMetering/empty',
        params:{...params}
    })
}

/**
 * 满载
 * @param params
 */
export function getFullInMeters(params){
    return request({
        method:'GET',
        url:'/wei/inMeterCon/inMetering/full',
        params:{...params}
    })
}

/**
 * 删除
 * @param params
 */
export function delInMeter(params){
    return request({
        method:'DELETE',
        url:'/wei/inMeterCon/inMetering/'+params,
    })
}

/**
 * 更新
 * @param param
 */
export function updateInMeter(param) {
    return request({
        method:'PUT',
        url:'/wei/inMeterCon/inMetering/'+param.id,
        params: {...param }
    })
}

/**
 * 入厂检斤详情
 * @param param
 */
export function getInMeterById(param) {
    return request({
        method:'GET',
        url:'/wei/inMeterCon/inMetering/'+param,
    })
}
/****************************** 进厂计量管理API结束 ***********************************************/

/****************************** 出厂计量管理API开始 ***********************************************/
/**
 * 新增检斤记录
 * @param params
 */
export function addOutMeters(params) {
    return request({
        method:'POST',
        url:'/wei/outMeterCon/outMetering',
        data:{...params}
    })
}

/**
 * 条件查询
 * @param params
 */
export function getAllOutMeter(params){
    return request({
        method:'GET',
        url:'/wei/outMeterCon/outMetering',
        params:{...params}
    })
}
/**
 * 空载
 * @param params
 */
export function getEmptyOutMeters(params){
    return request({
        method:'GET',
        url:'/wei/outMeterCon/outMetering/empty',
        params:{...params}
    })
}

/**
 * 满载
 * @param params
 */
export function getFullOutMeters(params){
    return request({
        method:'GET',
        url:'/wei/outMeterCon/outMetering/full',
        params:{...params}
    })
}
/**
 * 删除
 * @param params
 */
export function delOutMeter(params){
    return request({
        method:'DELETE',
        url:'/wei/outMeterCon/outMetering/'+params,
    })
}

/**
 * 更新
 * @param param
 */
export function updateOutMeter(param) {
    return request({
        method:'PUT',
        url:'/wei/outMeterCon/outMetering/'+param.id,
        params: {...param }
    })
}

/**
 * 入厂检斤详情
 * @param param
 */
export function getOutMeterById(param) {
    return request({
        method:'GET',
        url:'/wei/outMeterCon/outMetering/'+param,
    })
}
/****************************** 出厂计量管理API结束 ***********************************************/


/****************************** 检斤设备管理API开始 ***********************************************/
/**
 * 获取设备树
 */
export function getWeiDevTree(param){
    return request({
        method:'GET',
        url:'/wei/devTree/treeList',
        params:param
    })
}

/**
 * 检斤设备卡片信息
 * @param {sbdm} no
 */
export function getWeiDevAttrs(sbdm) {
    return request({
        method:'GET',
        url:`/wei/device/attrs`,
        params: sbdm
    })
}

/**
 * 删除设备卡片
 * @param id
 */
export function delWeiDevAttr(id){
    return request({
        method:'DELETE',
        url:`/wei/device/attr/${id}`
    })
}

/**
 * 获取设备信息详情
 * @param id
 */
export function getWeiDevAttrDetail(id) {
    return request({
        method: 'GET',
        url: `/wei/device/attr/${id}`
    })
}

/**
 * 新增设备详细信息
 * @param form
 */
export function addWeiDevAttr(form) {
    return request({
        method:'POST',
        url:'/wei/device/attr',
        data:{...form}
    })
}

/**
 * 更新设备详细信息
 * @param form
 */
export function updateWeiDevAttr(form){
    return request({
        method:'PUT',
        url:`/wei/device/attr/${form.id}`,
        data:{...form}
    })
}

/**
 * 更新设备树节点
 * @param {
 *  id,
 *  sbmc
 * } form
 */
export function udWeiDevTreeNode(form) {
    return request({
        method: 'PUT',
        url: `/wei/devTree/update/${form.id}`,
        data: { ...form }
    })
}
/**
 * 通过设备编码找设备详情
 * @param { procCode } procCode
 */
export function getWeiDevTreeByNode(procCode) {
    return request({
        method: 'GET',
        url: `/wei/devTree/dtl/${procCode}`
    })
}
/**
 * 新增设备树节点
 * @param { equipGenealogyPO } equipGenealogyPO
 */
export function addWeiDevTreeNode(equipGenealogyPO) {
    return request({
        method: 'POST',
        url: `/wei/devTree/add`,
        data: equipGenealogyPO
    })
}

/**
 * 删除设备树节点
 * @param {id} id
 */
export function delWeiDevTreeNode(params) {
    return request({
        method: 'DELETE',
        url: `/wei/devTree/del/${params.id}`,
        params: { ...params }
    })
}

/**
 * 设备树节点的拷贝
 * @param {
 *   sourceId: 源节点Id,
 *   sourceSbdm: 源节点编码,
 *   targetId：目标节点Id
 *   targetSbdm: 目标节点编码
 * } form
 */
export function copyWeiDeiTreeNode(form) {
    return request({
        method: 'POST',
        url: `/wei/devTree/copy`,
        params: form
    })
}

/**
 * 设备树节点的剪切
 * @param {
 *   sourceId: 源节点Id,
 *   sourceSbdm: 源节点编码,
 *   targetId：目标节点Id
 *   targetSbdm: 目标节点编码
 * } form
 */
export function cutWeiDevTreeNode(form) {
    return request({
        method: 'POST',
        url: `/wei/devTree/cut`,
        params: { ...form }
    })
}
//
// /**
//  * 通过设备代码获取左侧设备卡片
//  * @param {
//  *  pageSize
//  *  pageNum,
//  *  sbdm
//  * } params
//  */
// export function getDevCardAttrs(params) {
//     return request({
//         method: 'GET',
//         url: `/dev/card/attrs`,
//         params: {
//             ...params
//         }
//     })
// }






/**
 * 查询设备图片
 */
export function getDevImg(params) {
    return request({
        method: 'GET',
        url: `/wei/files/dev/${params.sbdm}`,
        params:{
            ...params
        }
    })
}
/**
 * 删除设备图片
 * @param fileId
 */
export function delDevFile(fileId) {
    return request({
        method: 'DELETE',
        url: `/wei/files/delById/${fileId}`
    })
}
/****************************** 检斤设备管理API结束 ***********************************************/


/****************************** 入厂检斤报表API结束 ***********************************************/
/**
 * 入厂称重净重历史趋势
 */
export function getInMeterNetHistory() {
    return request({
        method:'GET',
        url:`/wei/inMeterCon/history`
    })
}

/**
 * 历史趋势表格
 */
export function getInMeterNetHistoryTab() {
    return request({
        method:'GET',
        url:`/wei/inMeterCon/historyTab`
    })
}

/**
 * 供应商饼图
 */
export function getInMeterGroupPie() {
    return request({
        method:'GET',
        url:`/wei/inMeterCon/supplierPie`
    })
}

/**
 * 原料饼图
 */
export function getInMeterGoodsNamePie() {
    return request({
        method:'GET',
        url:`/wei/inMeterCon/goodsNamePie`
    })
}

/**
 * 车号分类
 */
export function getInMeterGroupByTruckNo(params) {
    return request({
        method:`GET`,
        url:`/wei/inMeterCon/truckNoFl`,
        params: {...params }
    })
}

/**
 * 原料分类
 */
export function getInMeterGroupByGoodsName(params) {
    return request({
        method:`GET`,
        url:`/wei/inMeterCon/goodsNameFl`,
        params: {...params }
    })
}

/**
 * 供应商分类
 */
export function getInMeterGroupBySupplier(params) {
    return request({
        method:`GET`,
        url:`/wei/inMeterCon/supplierFl`,
        params: {...params }
    })
}

/**
 * 导出Excel
 * @param params
 */
export function toExcel(params) {
    return request({
        method:`GET`,
        url:`/wei/inMeterCon/toExcel`,
        params: {...params }
    })
}

/**
 * 原料 汇总
 * @param params
 */
export function getSumByGoods(params) {
    return request({
        method:`GET`,
        url:`/wei/inMeterCon/goodsNameSum`,
        params:{...params}
    })
}

/**
 * 发货单位汇总
 * @param params
 */
export function getSumBySupplier(params) {
    return request({
        method:`GET`,
        url:`/wei/inMeterCon/supplierSum`,
        params:{...params}
    })
}

/**
 * 车号汇总
 * @param params
 */
export function getSumByTruckNo(params) {
    return request({
        method:`GET`,
        url:`/wei/inMeterCon/truckNoSum`,
        params:{...params}
    })
}
/****************************** 入厂检斤报表API结束 ***********************************************/


/****************************** 出厂检斤报表API结束 ***********************************************/
/**
 * 出厂称重历史趋势
 */
export function getOutMeterNetHistory() {
    return request({
        method:'GET',
        url:`/wei/outMeterCon/history`
    })
}

/**
 * 历史趋势对应表格
 */
export function getOutMeterNetHistoryTab() {
    return request({
        method:'GET',
        url:`/wei/outMeterCon/historyTab`
    })
}

/**
 * 收货单位饼图
 */
export function getOutMeterClientelePie() {
    return request({
        method:'GET',
        url:`/wei/outMeterCon/clientelePie`
    })
}

/**
 * 产品饼图
 */
export function getOutMeterGoodsNamePie() {
    return request({
        method:'GET',
        url:`/wei/outMeterCon/goodsNamePie`
    })
}

/**
 * 车号分类
 */
export function getOutMeterGroupByTruckNo(params) {
    return request({
        method:`GET`,
        url:`/wei/outMeterCon/truckNoFl`,
        params: {...params }
    })
}

/**
 * 产品分类
 */
export function getOutMeterGroupByGoodsName(params) {
    return request({
        method:`GET`,
        url:`/wei/outMeterCon/goodsNameFl`,
        params: {...params }
    })
}

/**
 * 收货单位分类
 */
export function getOutMeterGroupByClientele(params) {
    return request({
        method:`GET`,
        url:`/wei/outMeterCon/clienteleFl`,
        params: {...params }
    })
}

/**
 * 导出Excel
 * @param params
 */
// export function toExcel(params) {
//     return request({
//         method:`GET`,
//         url:`/wei/inMeterCon/toExcel`,
//         params: {...params }
//     })
// }

/**
 * 产品 汇总
 * @param params
 */
export function getOutSumByGoods(params) {
    return request({
        method:`GET`,
        url:`/wei/outMeterCon/goodsNameSum`,
        params:{...params}
    })
}

/**
 * 收货单位汇总
 * @param params
 */
export function getOutSumByClientele(params) {
    return request({
        method:`GET`,
        url:`/wei/outMeterCon/clienteleSum`,
        params:{...params}
    })
}

/**
 * 车号汇总
 * @param params
 */
export function getOutSumByTruckNo(params) {
    return request({
        method:`GET`,
        url:`/wei/outMeterCon/truckNoSum`,
        params:{...params}
    })
}
/****************************** 出厂检斤报表API结束 ***********************************************/

/**
 * 设备相关资料上传附件Url
 */
export const FILE_UPLOAD_URL = `/api/wei/files/upload`;

/**
 * 设备相关资料下载附件Url
 */
export const FILE_DOWNLOAD_URL =  `/api/wei/files/download/`;
