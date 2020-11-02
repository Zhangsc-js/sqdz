import request from '@/utils/request'
import qs from 'qs'

/****************************** 设备谱系树API开始 ***********************************************/

/**
 *
 * 获取设备树
 *
 * @param equipGenealogyPO
 */
export function getDevTree(equipGenealogyPO) {
    return request({
        method: 'GET',
        url: `/dev/devTree`,
        params: equipGenealogyPO
    })
}

/**
 * 下载设备树导入模板
 */
// export const FECTORY_MODEL_TEMPLATE = `/api/dev/template`
export function downlowdDevTpl(ids) {
    return request({
        method: 'POST',
        url: `/dev/template`,
        data: ids,
        paramsSerializer: ids => {
            return qs.stringify(ids, { indices: false })
        }
    })
}

/**
 * excel导入设备
 */
export const IMPORT_FECTORY = `/api/dev/importDevices`

/**
 * 下载word
 */
// export const DOWNLODE_WORD = `/api/dev/card/createWord`
export function downlowdDevQRs(ids) {
    return request({
        method: 'POST',
        url: `/dev/card/createWord`,
        data: ids,
        paramsSerializer: ids => {
            return qs.stringify(ids, { indices: false })
        }
    })
}

/**
 * 新增设备树节点
 * @param { equipGenealogyPO } equipGenealogyPO
 */
export function addDevTreeNode(equipGenealogyPO) {
    return request({
        method: 'POST',
        url: `/dev/devices`,
        data: equipGenealogyPO
    })
}

/**
 * 获取设备类型（从数据字典）
 */
export function getDeviceTypeMap() {
    return request({
        method: 'GET',
        url: `/dev/deviceTypeMap`
    })
}

/**
 * 删除设备树节点
 * @param {id} id
 */
export function delTreeNode(params) {
    return request({
        method: 'DELETE',
        url: `/dev/devices/${params.id}`,
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
export function copyTreeNode(form) {
    return request({
        method: 'POST',
        url: `/dev/devices/copy`,
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
export function cutTreeNode(form) {
    return request({
        method: 'POST',
        url: `/dev/devices/cut`,
        params: { ...form }
    })
}

/**
 * 通过设备代码获取左侧设备卡片
 * @param {
 *  pageSize
 *  pageNum,
 *  sbdm
 * } params
 */
export function getDevCardAttrs(params) {
    return request({
        method: 'GET',
        url: `/dev/card/attrs`,
        params: {
            ...params
        }
    })
}

/**
 * 删除设备卡片信息
 * @param {id} id
 */
export function deleteDevAttr(id) {
    return request({
        method: 'DELETE',
        url: `/dev/card/attr/${id}`
    })
}

/**
 * 获取设备信息管理详情
 * @param {id} id
 */
export function getDevCardAttrDetail(id) {
    return request({
        method: 'GET',
        url: `/dev/card/attr/${id}`
    })
}

/**
 * 新增设备详细信息
 * @param { EquipCardAttrsPO } form
 */
export function addDevCardAttr(form) {
    return request({
        method: 'POST',
        url: `/dev/card/attr`,
        data: { ...form }
    })
}

/**
 * 新增备件计划
 * @param {
 *  sbdm,
 *  wlbm,
 *  spNum: 备件数量，
 *  remark: 备注
 * } form
 */
export function addSparePartsPlan(form) {
    return request({
        method: 'POST',
        url: `/dev/card/parts/plan`,
        data: { ...form }
    })
}

/**
 * 获取设备附件列表
 * @param {
 *  pageNum,
 *  pageSize
 * } params
 */
export function getDevAttachmentFiles(params) {
    return request({
        method: 'GET',
        url: `/dev/files`,
        params: { ...params }
    })
}

/**
 * 获取点检APP端上传的图片
 * @param { ids } ids
 */
export function getFileList(ids) {
    return request({
        method: 'GET',
        url: `/sys/dev/files/ops`,
        params: ids
    })
}

/**
 * 设备相关资料上传附件Url
 */
export const FILE_UPLOAD_URL = `/api/sys/dev/files/upload`

/**
 * 设备相关资料下载附件Url
 */
export const FILE_DOWNLOAD_URL = `/api/sys/dev/files/download/`

/**
 * 附件删除
 * @param {id} id
 */
export function delAttachmentFile(id) {
    return request({
        method: 'DELETE',
        url: `/dev/files/${id}`
    })
}

/**
 * 更新设备工艺绘图URL
 * @param {
 *   id,
 *   processImgUrl
 * } record
 */
export function updateFile(record) {
    return request({
        method: 'PUT',
        url: `/dev/files/${record.id}`,
        data: { ...record }
    })
}
/**
 * 查询设备参数列表
 * @param {
 * devNo: String, 设备编码
 *  pageSize: Number,
 *  pageSize: Number
 * } parameter
 */
export function getDevParameters(parameter) {
    return request({
        method: 'GET',
        url: `/dev/param`,
        params: parameter
    })
}

/**
 * 新增设备参数
 * @param {*} devParameter
 */
export function saveDevParameter(devParameter) {
    return request({
        method: 'POST',
        url: `/dev/param`,
        data: devParameter
    })
}

/**
 * 更新设备参数
 * @param {*} devParameter
 */
export function updateDevParameter(devParameter) {
    return request({
        method: 'PUT',
        url: `/dev/param/${devParameter.id}`,
        data: devParameter
    })
}

/**
 * 删除设备参数
 * @param { * } id
 */
export function deleteDevParameter(id) {
    return request({
        method: 'DELETE',
        url: `/dev/param/${id}`,
    })
}

/****************************** 设备谱系树API结束 ***********************************************/

/****************************** 设备台帐维护API开始 ***********************************************/

/**
 * 获取设备台帐列表
 * @param {
 *   pageSize,
 *   pageNum
 * } params
 */
export function getDevAccounts(params) {
    return request({
        method: 'GET',
        url: `/dev/card/attrs`,
        params: { ...params }
    })
}

/**
 * 删除设备台帐记录
 * @param {id} id
 */
export function deleteDevAccount(id) {
    return request({
        method: 'DELETE',
        url: `/dev/card/attr/${id}`
    })
}

/**
 * 批量删除设备台帐
 * @param {
 *  ids: []
 * } form
 */
export function batchDelDevAccounts(ids) {
    return request({
        method: 'DELETE',
        url: `/dev/card/attrs`,
        data: ids,
        paramsSerializer: ids => {
            return qs.stringify(ids, { indices: false })
        }
    })
}

/**
 * 设备台帐新增
 * @param { EquipCardAttrsPO } form
 */
export function addDevAccount(form) {
    return request({
        method: 'POST',
        url: `/dev/card/attr`,
        data: { ...form }
    })
}

/**
 * 设备台帐新增时获取设备代码选择框
 */
export function getDeviceSelectMap() {
    return request({
        method: 'GET',
        url: `/dev/card/map`
    })
}

/**
 * 设备台帐更新
 * @param { EquipCardAttrsPO } form
 */
export function updateDevAccount(form) {
    return request({
        method: 'PUT',
        url: `/dev/card/attr/${form.id}`,
        data: { ...form }
    })
}

/**
 * 设备台帐获取选中更新信息
 * @param { id } params
 */
export function getDevAccount(params) {
    return request({
        method: 'GET',
        url: `/dev/card/attr/${params}`
    })
}

/****************************** 设备台帐维护API借书 ***********************************************/

/****************************** 设备运维管理API开始 **********************************************/

/****************************** 点检计划API开始 *************************************************/

/**
 * 获取点检计划列表
 * @param {
 *  pageSize,
 *  pageNum,
 *  CheckingPlan
 * } params
*/
export function getCheckingPlan(params) {
    return request({
        method: 'GET',
        url: `/dev/checkingPlan`,
        params: params
    })
}

/**
 * 获取点检计划详情
 * @param { id } id
 */
export function getCheckingPlanById(id) {
    return request({
        method: 'GET',
        url: `/dev/checkingPlan/${id}`
    })
}

/**
 * 新增点检计划
 * @param { checkingPlan } checkingPlan
 */
export function addCheckingPlan(parms) {
    return request({
        method: 'POST',
        url: `/dev/checkingPlan`,
        //data: checkingPlan
        data: { ...parms }
    })
}

/**
 * 获取点检计划模板下拉选择数据
 */
export function getCheckingTempMap() {
    return request({
        method: 'GET',
        url: `/dev/temp/map`
    })
}

/**
 * 获取点检人姓名
 */
export function getCheckingUserMap() {
    return request({
        method: 'GET',
        url: `/dev/temp/userMap`
    })
}
/**
 * 获取巡检人列表
 */
export function getInspectionUserMap() {
    return request({
        method: 'GET',
        url: `/dev/inspection/plan/initInspectionData`
    })
}
/**
 * 获取润滑人列表
 */
export function getLubricationUserMap() {
    return request({
        method: 'GET',
        url: `/dev/lubrication/recordItem/initLubricationData`
    })
}
/**
 * 获取润滑人列表
 */
export function getRepairUserMap() {
    return request({
        method: 'GET',
        url: `/dev/repair/order/initRepairData`
    })
}

/**
 * 获取点检计划执行周期下拉选择项的内容
 */
export function getCheckingPlanSelectMap() {
    return request({
        method: 'GET',
        url: `/dev/checkingPlan/cycle`
    })
}

/**
 * 根据ID删除计划
 * @param { id } id
 */
export function deleteCheckingPlan(id) {
    return request({
        method: 'DELETE',
        url: `/dev/checkingPlan/${id}`
    })
}

/**
 * 更新点检计划
 * @param { checkingPlan } checkingPlan
 */
export function updateCheckingPlan(checkingPlan) {
    return request({
        method: 'PUT',
        url: `/dev/checkingPlan/${checkingPlan.id}`,
        data: checkingPlan
    })
}

/**
 * 批量删除点检计划
 * @param { ids } ids
 */
export function batchDelCheckingPlan(ids) {
    return request({
        method: 'DELETE',
        url: `/dev/checkingPlan/batch`,
        data: ids,
        paramsSerializer: ids => {
            return qs.stringify(ids, { indices: false })
        }
    })
}

/**
 * 获取点检计划模板列表
 * @param {
 *  pageSize,
 *  pageNum,
 *  CheckingTemp
 * } params
 */
export function getCheckingTemp(params) {
    return request({
        method: 'GET',
        url: `/dev/temp`,
        params: params
    })
}

/**
 * 新增点检计划模板
 * @param { CheckingTemp } record
 */
export function addCheckingTemp(record) {
    return request({
        method: 'POST',
        url: `/dev/temp`,
        data: record
    })
}

/**
 * 根据Id删除点检计划模板
 * @param {id} id
 */
export function deleteCheckingTemp(id) {
    return request({
        method: 'DELETE',
        url: `/dev/temp/${id}`
    })
}

/**
 * 根据id批量删除点检计划模板
 * @param { ids } ids
 */
export function batchDelCheckingTemp(ids) {
    return request({
        method: 'DELETE',
        url: `/dev/temp/batch`,
        data: ids,
        paramsSerializer: ids => {
            return qs.stringify(ids, { indices: false })
        }
    })
}

/**
 * 获取点检计划模板详情
 * @param {id} id
 */
export function getCheckingTempById(id) {
    return request({
        method: 'GET',
        url: `/dev/temp/${id}`
    })
}

/**
 * 更新点检计划模板
 * @param {
 *  CheckingTemp
 * } record
 */
export function updateCheckingTemp(record) {
    return request({
        method: 'PUT',
        url: `/dev/temp/${record.id}`,
        data: record
    })
}

/**
 * 通过点检计划模板ID查找点检模板项
 * @param { tempId } tempId
 */
export function getCheckingTempItems(params) {
    return request({
        method: 'GET',
        url: `/dev/temp/item/plan`,
        params: params
    })
}

/**
 * 分组获取设备
 */
export function getTempGroupByDev(tempNo) {
    return request({
        method: 'GET',
        url: `/dev/temp/item/devGroup`,
        params: tempNo
    })
}

/**
 * 通过点检模版编码和设备编码批量删除
 * @param {
 *  devNo,
 *  tempNo
 * } params
 */
export function deleteBydevNo(params) {
    return request({
        method: 'DELETE',
        url: `/dev/temp/item/delByDevNo`,
        data: params
    })
}

/**
 * 获取点检模板项下拉选择项的内容
 */
export function getCheckingItemSelectMap() {
    return request({
        method: 'GET',
        url: `/dev/temp/item/item`
    })
}

/**
 * 新增点检模板项
 * @param { checkingTempItem } form
 */
export function addCheckingTempItem(checkingTempItem) {
    return request({
        method: 'POST',
        url: `/dev/temp/item`,
        data: checkingTempItem,
        paramsSerializer: checkingTempItem => {
            return qs.stringify(checkingTempItem, { indices: false })
        }
    })
}

/**
 * 删除点检模板项
 * @param { id } id
 */
export function deleteCheckingTempItem(id) {
    return request({
        method: 'DELETE',
        url: `/dev/temp/item/${id}`
    })
}

/**
 * 批量删除点检模板项
 * @param { ids } ids
 */
export function batchDelCheckingTempItems(ids) {
    return request({
        method: 'DELETE',
        url: `/dev/temp/item/batch`,
        data: ids,
        paramsSerializer: ids => {
            return qs.stringify(ids, { indices: false })
        }
    })
}

/**
 * 获取点检模板项详情
 * @param { id } id
 */
export function getCheckingTempItemById(id) {
    return request({
        method: 'GET',
        url: `/dev/temp/item/${id}`
    })
}

/****************************** 点检计划API结束  ***********************************************/


/****************************** 点检确认API开始 *************************************************/

/**
 * 获取点检记录列表
 * @param {
 *  pageSize,
 *  pageNum,
 *  planName
 * } params
 */
export function getCheckingRecords(params) {
    return request({
        method: 'GET',
        url: `/dev/checking/record`,
        params: params
    })
}


/**
 * 点检确认
 * @param {
 *   id
 * } checkingRecord
 */
export function updateCheckingRecord(checkingRecord) {
    return request({
        method: 'PUT',
        url: `/dev/checking/record/${checkingRecord.id}`,
        data: checkingRecord
    })
}

/**
 * 获取点检项详情
 * @param {
 *  recordId,
 *  planItemName,
 *  pageNum,
 *  pageSize
 * } params
 */
export function getCheckingRecordItems(params) {
    return request({
        method: 'GET',
        url: `/dev/checking/record/item`,
        params: params
    })
}

/**
 * 获取异常点检记录列表
 * @param {
  *  pageSize,
  *  pageNum,
  *  planName
  * } params
  */
export function getExceptionRecordItems(params) {
    return request({
        method: 'GET',
        url: `/dev/checking/record/item/unusual`,
        params: params
    })
}

/**
 * 向维修部报修
 * @param { List<CheckingRecordItemVO> } records
 */
export function reportExceptionRecord(records) {
    return request({
        method: 'POST',
        url: `/dev/checking/record/item/report`,
        data: records
    })
}


/**
 * 获取点检记录项
 * @param { id } id
 */
export function getCheckingRecordItemById(id) {
    return request({
        method: 'GET',
        url: `/dev/checking/record/item/${id}`
    })
}

/**
 * 获取点检计划下拉选择
 */
export function getCheckingPlanMap() {
    return request({
        method: 'GET',
        url: `/dev/checkingPlan/planMap`
    })
}

/**
 * 通过点检记录编码分组获取点检记录设备
 * @param {
 *  checkingRecordNo
 * } params
 */
export function getDevByRecordNo(params) {
    return request({
        method: 'GET',
        url: `/dev/checking/record/getDevByRecordNo`,
        params: params
    })
}

/**
 * 获取设备对应的点检记录
 * @param {
 *  devCode
 * } params
 */
export function selectRecordGroupByCode(params) {
    return request({
        method: 'GET',
        url: `/dev/checking/record/item/groupByCode`,
        params: params
    })
}

/****************************** 点检确认API结束 *************************************************/

/****************************** 点检项信息API结束 *************************************************/

/**
 * 获取点检项信息列表
 * @param {
 *  pageNum,
 *  pageSize,
 *  devName: 设备名称
 * } params
 */
export function getCheckingItemInfos(params) {
    return request({
        method: 'GET',
        url: `/dev/item/info`,
        params: params
    })
}

/**
 * 根据设备编码查询设备点检项信息
 * @param {
 *  pageNum: Number,
 *  pageSize: Number,
 *  devNos: Array, 设备编码
 *  devName: String, 设备名称
 * } params
 */
export function getCheckingItemInfoByDevNo(params) {
    return request({
        method: 'GET',
        url: `/dev/item/info/devNo`,
        params: params,
        paramsSerializer: devNos => {
            return qs.stringify(devNos, { indices: false })
        }
    })
}

/**
 * 更新点检项信息
 * @param { 点检项信息 } checkingTempItem
 */
export function updateCheckingItemInfo(checkingTempItem) {
    return request({
        method: 'PUT',
        url: `/dev/item/info/${checkingTempItem.id}`,
        data: checkingTempItem
    })
}

/**
 * 新增点检项信息
 * @param { * } checkingTempItem
 */
export function addCheckingItemInfo(checkingTempItem) {
    return request({
        method: 'POST',
        url: `/dev/item/info`,
        data: checkingTempItem
    })
}

/**
 * 删除点检项信息
 * @param { id } id
 */
export function deleteCheckingItemInfo(id) {
    return request({
        method: 'DELETE',
        url: `/dev/item/info/${id}`,
    })
}

/**
 * 批量删除点检项信息
 * @param { ids } ids
 */
export function batchDelCheckingItemInfos(ids) {
    return request({
        method: 'DELETE',
        url: `/dev/item/info/batch`,
        data: ids,
        paramsSerializer: ids => {
            return qs.stringify(ids, { indices: false })
        }
    })
}

/**
 * 下载点检信息项导入模板
 */
export function downloadCheckingItemTemp() {
    return request({
        method: 'GET',
        url: `/dev/item/info/template`,
        responseType: 'blob'
    })
}

/**
 * 导入点检项信息
 */
export const IMPORT_CHECKING_ITEMS = `/api/dev/item/info/import`

/****************************** 点检项信息API结束 *************************************************/


/****************************** 巡检项信息API开始 *************************************************/

/**
 * 导入巡检项信息
 */
export const IMPORT_INSPECTION_ITEMS = `/api/dev/inspectionItem/info/import`

/**
 * 下载巡检项信息导入模板
 */
export function downloadInspectionItemTemp() {
    return request({
        method: 'GET',
        url: `/dev/inspectionItem/info/template`,
        responseType: 'blob'
    })
}

/**
 * 获取巡检信息列表
 * @param params
 */
export function getInspectionItemInfos(params) {
    return request({
        method: 'get',
        url: '/dev/inspectionItem/info',
        params: params
    })
}

/**
 * 新增巡检信息
 * @param params
 */
export function addInspectionItemInfo(params) {
    return request({
        method: 'post',
        url: '/dev/inspectionItem/info/save',
        data: params
    })
}

/**
 * 修改巡检信息
 * @param params
 */
export function updateInspectionItemInfo(params) {
    return request({
        method: 'put',
        url: `/dev/inspectionItem/info/${params.id}`,
        data: params
    })
}

/**
 * 删除巡检信息
 * @param id
 */
export function deleteInspectionItemInfo(id) {
    return request({
        method: 'delete',
        url: '/dev/inspectionItem/info/' + id
    })
}

/**
 * 批量删除
 */
export function batchDelInspectionItemInfos(ids) {
    return request({
        method: 'delete',
        url: '/dev/inspectionItem/info/batchDlt',
        data: ids
    })
}

/****************************** 巡检项信息API结束 *************************************************/

/****************************** 巡检计划API开始 *************************************************/

/**
 * 获取模板信息
 */
export function getInspectionTemp(params) {
    return request({
        method: 'get',
        url: '/dev/inspection/temp',
        params: params
    })
}

/**
 * 获取巡检项信息
 * @param params
 */
export function getInspectionTempItems(params) {
    return request({
        method: 'GET',
        url: `/dev/inspection/temp/item/plan`,
        params: params
    })
}

/**
 * 新增模板
 */
export function addInspectionTemp(params) {
    return request({
        method: 'post',
        url: '/dev/inspection/temp',
        data: params
    })
}


export function getInspectionItemInfoByDevNo(params) {
    return request({
        method: 'GET',
        url: `/dev/inspectionItem/info/devNo`,
        params: params,
        paramsSerializer: devNos => {
            return qs.stringify(devNos, { indices: false })
        }
    })
}


/**
 * 获取巡检计划模板详情
 * @param {id} id
 */
export function getInspectionTempById(id) {
    return request({
        method: 'GET',
        url: `/dev/inspection/temp/${id}`
    })
}

/**
 * 更新巡检计划模板
 * @param {
 *
 * } record
 */
export function updateInspectionTemp(record) {
    return request({
        method: 'PUT',
        url: `/dev/inspection/temp/${record.id}`,
        data: record
    })
}

/**
 * 删除巡检模板项
 * @param { id } id
 */
export function deleteInspectionTempItem(id) {
    return request({
        method: 'DELETE',
        url: `/dev/inspection/temp/item/${id}`
    })
}

/**
 * 批量删除巡检模板项
 * @param { ids } ids
 */
export function batchDelInspectionTempItems(ids) {
    return request({
        method: 'DELETE',
        url: `/dev/inspection/temp/item/batch`,
        data: ids,
        paramsSerializer: ids => {
            return qs.stringify(ids, { indices: false })
        }
    })
}

/**
 * 根据Id删除点检计划模板
 * @param {id} id
 */
export function deleteInspectionTemp(id) {
    return request({
        method: 'DELETE',
        url: `/dev/inspection/temp/${id}`
    })
}

/**
 * 根据id批量删除点检计划模板
 * @param { ids } ids
 */
export function batchDelInspcetionTemp(ids) {
    return request({
        method: 'DELETE',
        url: `/dev/inspection/temp/batch`,
        data: ids,
        paramsSerializer: ids => {
            return qs.stringify(ids, { indices: false })
        }
    })
}


/**
 * 新增点检模板项
 * @param { } form
 */
export function addInspectionTempItem(inspectionTempItem) {
    return request({
        method: 'POST',
        url: `/dev/inspection/temp/item`,
        data: inspectionTempItem,
        paramsSerializer: inspectionTempItem => {
            return qs.stringify(inspectionTempItem, { indices: false })
        }
    })
}

/**
 * 获取计划列表
 * @param params
 */
export function getInspectionPlan(params) {
    return request({
        method: 'get',
        url: '/dev/inspection/plan',
        params: params
    })
}

/**
 * 获取点检计划模板下拉选择数据
 */
export function getInspectionTempMap() {
    return request({
        method: 'GET',
        url: `/dev/inspection/temp/map`
    })
}

/**
 * 新增巡检计划
 * @param {  }
 */
export function addInspectionPlan(parms) {
    return request({
        method: 'POST',
        url: `/dev/inspection/plan`,
        data: { ...parms }
    })
}

/**
 * 根据id查询巡检计划
 */
export function getInspectionPlanById(id) {
    return request({
        method: 'get',
        url: '/dev/inspection/plan/' + id
    })
}

/**
 * 修改巡检计划
 */
export function updateInspectionPlan(params) {
    return request({
        method: 'put',
        url: '/dev/inspection/plan',
        data: params
    })
}

export function deleteInspectionPlan(id) {
    return request({
        method: 'DELETE',
        url: `/dev/inspection/plan/${id}`
    })
}

export function batchInspectionPlan(ids) {
    return request({
        method: 'DELETE',
        url: `/dev/inspection/plan/batch`,
        data: ids,
        paramsSerializer: ids => {
            return qs.stringify(ids, { indices: false })
        }
    })
}

/**
 * 分组获取设备
 */
export function getInsTempGroupByDev(tempNo) {
    return request({
        method: 'GET',
        url: `/dev/inspection/temp/item/devGroup`,
        params: tempNo
    })
}

/**
 * 通过点检模版编码和设备编码批量删除
 * @param {
 *  devNo,
 *  tempNo
 * } params
 */
export function deleteByInsDevNo(params) {
    return request({
        method: 'DELETE',
        url: `/dev/inspection/temp/item/delByDevNo`,
        data: params
    })
}

/**
 * 巡检项排序
 * @param {
 *  List<InspectionTempItem>
 * } record
 */
export function sortTempItem(record) {
    return request({
        method: 'POST',
        url: `/dev/inspection/temp/item/move`,
        data: record
    })
}

/**
 *
 * @param {
 *  targetDevNO
 *  sourceDevNo
 * } data
 */
export function devSortTempItem(data) {
    return request({
        method: 'POST',
        url: `/dev/inspection/temp/item/devMove`,
        data: data
    })
}

/****************************** 巡检计划API结束 *************************************************/

/****************************** 巡检确认API开始 *************************************************/
/**
 * 获取巡检信息
 * @param params
 */
export function getInspectionRecords(params) {
    return request({
        method: 'get',
        url: '/dev/inspection/record',
        params: params
    })
}

/**
 * 获取巡检详情
 */
export function getInspectionRecordItems(params) {
    return request({
        method: 'get',
        url: '/dev/inspection/recordItem',
        params: params
    })
}

/**
 * 修改确认状态
 * @param params
 */
export function updateInspectionRecord(params) {
    return request({
        method: 'put',
        url: '/dev/inspection/record',
        data: params
    })
}

/**
 * 获取巡检计划下拉选择
 */
export function getInspectionPlanMap() {
    return request({
        method: 'GET',
        url: `/dev/inspection/plan/planMap`
    })
}

/**
 * 通过巡检记录编码分组获取巡检记录设备
 * @param {
  *  inspectionRecordNo
  * } params
  */
export function getInsDevByRecordNo(params) {
    return request({
        method: 'GET',
        url: `/dev/inspection/record/getDevByRecordNo`,
        params: params
    })
}

/**
* 获取设备对应的巡检记录
* @param {
 *  devCode
 * } params
 */
export function selectInsRecordGroupByCode(params) {
    return request({
        method: 'GET',
        url: `/dev/inspection/recordItem/groupByCode`,
        params: params
    })
}

/**
 * 获取异常巡检记录
 * @param {
 * inspectionRecordNo
 * } params
 */
export function getInsExceptionRecordItems(params) {
    return request({
        method: 'GET',
        url: `/dev/inspection/recordItem/unusual`,
        params: params
    })
}

/**
 * 巡检报修
 * @param {
 *  InspectionRecordItem
 * } records
 */
export function reportInsExceptionRecord(records) {
    return request({
        method: 'POST',
        url: `/dev/inspection/recordItem/report`,
        data: records
    })
}

/****************************** 巡检确认API结束 *************************************************/

/****************************** 设备润滑项API开始 *************************************************/

/**
 * 导入润滑项信息
 */
export const IMPORT_LUBRICATION_ITEMS = `/api/dev/lubrication/info/import`


/**
 * 下载润滑导入模板
 */
export function downloadLubricationItemTemp() {
    return request({
        method: 'GET',
        url: `/dev/lubrication/info/template`,
        responseType: 'blob'
    })
}

/**
 * 获取润滑项列表
 * @param params
 */
export function getLubricationItemInfos(params) {
    return request({
        method: 'get',
        url: '/dev/lubrication/info',
        params: params
    })
}

/**
 * 新增润滑项
 * @param params
 */
export function addLubricationItemInfo(params) {
    return request({
        method: 'post',
        url: '/dev/lubrication/info',
        data: params
    })
}

/**
 * 修改润滑项
 * @param params
 */
export function updateLubricationItemInfo(params) {
    return request({
        method: 'put',
        url: '/dev/lubrication/info',
        data: params
    })
}


/**
 * 删除润滑项
 */
export function deleteLubricationItemInfo(id) {
    return request({
        method: 'delete',
        url: '/dev/lubrication/info/' + id
    })
}

/**
 * 批量删除
 * @param ids
 */
export function batchDelLubricationItemInfos(ids) {
    return request({
        method: 'delete',
        url: '/dev/lubrication/info',
        params: { ids: ids + "" }
    })
}

/**
 * 根据设备编号查询
 */
export function getLubricationItemInfoByDevNo(params) {
    return request({
        method: 'get',
        url: '/dev/lubrication/info/devNo',
        params: params,
        paramsSerializer: devNos => {
            return qs.stringify(devNos, { indices: false })
        }
    })
}

/****************************** 设备润滑项API结束 *************************************************/

/****************************** 设备润滑计划模板API开始 *************************************************/

/**
 * 获取模板列表
 * @param params
 */
export function getLubricationTemp(params) {
    return request({
        method: 'get',
        url: '/dev/lubrication/temp',
        params: params
    })
}

/**
 * 新增计划模板
 */
export function addLubricationTemp(params) {
    return request({
        method: 'post',
        url: '/dev/lubrication/temp',
        data: params
    })
}

/**
 * 根据id查询计划模板
 * @param id
 */
export function getLubricationTempById(id) {
    return request({
        method: 'get',
        url: '/dev/lubrication/temp/' + id
    })
}

/**
 * 获取润滑项信息
 */
export function getLubricationTempItems(params) {
    return request({
        method: 'get',
        url: '/dev/lubrication/temp/item/plan',
        params: params
    })
}

/**
 * 新增润滑模板项
 * @param lubricationTempItem
 */
export function addLubricationTempItem(lubricationTempItem) {
    return request({
        method: 'POST',
        url: `/dev/lubrication/temp/item`,
        data: lubricationTempItem,
        paramsSerializer: lubricationTempItem => {
            return qs.stringify(lubricationTempItem, { indices: false })
        }
    })
}

/**
 * 删除润滑模板项
 */
export function deleteLubricationPlanTempItem(id) {
    return request({
        method: 'delete',
        url: '/dev/lubrication/temp/item/' + id
    })
}

/**
 * 批量删除润滑模板项
 */
export function batchDelLubricationTempItems(ids) {
    return request({
        method: 'delete',
        url: '/dev/lubrication/temp/item',
        params: { ids: ids + "" }
    })
}

/**
 * 更新润滑计划模板
 */
export function updateLubricationTemp(params) {
    return request({
        method: 'put',
        url: '/dev/lubrication/temp',
        data: params
    })
}

/**
 * 删除润滑计划模板
 */
export function deleteLubricationTemp(id) {
    return request({
        method: 'delete',
        url: '/dev/lubrication/temp/' + id
    })
}

/**
 * 批量删除计划模板
 * @param params
 */
export function batchDelLubricationTemp(ids) {
    return request({
        method: 'delete',
        url: '/dev/lubrication/temp/batch',
        params: { ids: ids + "" }
    })
}

/**
 * 获取模板下拉数据
 */
export function getLubricationTempMap() {
    return request({
        method: 'get',
        url: '/dev/lubrication/temp/map'
    })
}

/**
 * 分组获取设备
 */
export function getLubTempGroupByDev(tempNo) {
    return request({
        method: 'GET',
        url: `/dev/lubrication/temp/item/devGroup`,
        params: tempNo
    })
}

/**
 * 通过点检模版编码和设备编码批量删除
 * @param {
 *  devNo,
 *  tempNo
 * } params
 */
export function deleteByLubDevNo(params) {
    return request({
        method: 'DELETE',
        url: `/dev/lubrication/temp/item/delByDevNo`,
        data: params
    })
}

/****************************** 设备润滑计划模板API结束 *************************************************/

/****************************** 设备润滑计划API开始 *************************************************/

/**
 * 获取润滑计划列表
 * @param params
 */
export function getLubricationPlan(params) {
    return request({
        method: 'get',
        url: '/dev/lubrication/plan',
        params: params
    })
}

/**
 * 新增润滑计划
 */
export function addLubricationPlan(params) {
    return request({
        method: 'post',
        url: '/dev/lubrication/plan',
        data: params
    })
}

/**
 * 根据id获取计划
 * @param id
 */
export function getLubricationPlanById(id) {
    return request({
        method: 'get',
        url: '/dev/lubrication/plan/' + id
    })
}

/**
 * 修改润滑计划
 */
export function updateLubricationPlan(params) {
    return request({
        method: 'put',
        url: '/dev/lubrication/plan',
        data: params
    })
}

/**
 * 删除润滑计划
 * @param id
 */
export function deleteLubricationPlan(id) {
    return request({
        method: 'delete',
        url: '/dev/lubrication/plan/' + id
    })
}

/**
 * 批量删除
 * @param ids
 */
export function batchDelLubricationPlan(ids) {
    return request({
        method: 'delete',
        url: '/dev/lubrication/plan/batch',
        params: { ids: ids + "" }
    })
}


/****************************** 设备润滑计划API结束 *************************************************/

/****************************** 设备润滑确认API开始 *************************************************/

/**
 * 润滑确认列表
 * @param params
 */
export function getLubricationRecords(params) {
    return request({
        method: 'get',
        url: '/dev/lubrication/record',
        params: params
    })
}

/**
 * 润滑确认
 * @param id
 */
export function updateLubricationRecord(id) {
    return request({
        method: 'put',
        url: '/dev/lubrication/record/' + id
    })
}

/**
 * 更改润滑计划执行人
 * @param {  } record
 */
export function updateRecord(record) {
    return request({
        method: 'put',
        url: '/dev/lubrication/record/update',
        data: record
    })
}

/**
 * 润滑详情
 */
export function getLubricationRecordItems(params) {
    return request({
        method: 'get',
        url: '/dev/lubrication/recordItem',
        params: params
    })
}

/**
 * 获取点检计划下拉选择
 */
export function getLubricationPlanMap() {
    return request({
        method: 'GET',
        url: `/dev/lubrication/plan/planMap`
    })
}

/**
 * 通过润滑记录编码分组获取润滑记录设备
 * @param {
  *  lubricationRecordNo
  * } params
  */
export function getLubDevByRecordNo(params) {
    return request({
        method: 'GET',
        url: `/dev/lubrication/record/getDevByRecordNo`,
        params: params
    })
}

/**
 * 获取设备对应的润滑记录
 * @param {
 *  devCode
 * } params
*/
export function selectLubRecordGroupByCode(params) {
    return request({
        method: 'GET',
        url: `/dev/lubrication/recordItem/groupByCode`,
        params: params
    })
}

/**
* 获取异常巡检记录
* @param {
 * inspectionRecordNo
 * } params
 */
export function getLubExceptionRecordItems(params) {
    return request({
        method: 'GET',
        url: `/dev/lubrication/recordItem/unusual`,
        params: params
    })
}

/**
 * 巡检报修
 * @param {
 *  InspectionRecordItem
 * } records
 */
export function reportLubExceptionRecord(records) {
    return request({
        method: 'POST',
        url: `/dev/lubrication/recordItem/report`,
        data: records
    })
}

/****************************** 设备润滑计划API结束 *************************************************/


/****************************** 设备运维管理API结束 ***********************************************/


/****************************** 设备台帐维护API结束 ***********************************************/

export function getQRCode(parms) {
    return request({
        method: 'GET',
        url: `/dev/devices/QRcode`,
        params: { parms }
    })
}
export function createWord(parms) {
    return request({
        method: 'GET',
        url: `/dev/devices/createWord`,
        params: { parms }
    })
}

export function getFileURL(id) {
    return request({
        method: 'GET',
        url: `/dev/files/fileUrl/${id}`
    })
}

/**
 * 获取重点设备运行状态
 */
export function onOffReport(params) {
    return request({
        method: 'GET',
        url: `/dev/report/onOffReport`,
        params
    })
}


