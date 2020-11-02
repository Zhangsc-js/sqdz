import request from '@/utils/request'
import qs from 'qs'

/**
 * 获取保养信息项列表
 * @param {
 *   devName
 * } params
 */
export function getMaintainItemInfos(params) {
    return request({
        method: 'GET',
        url: `/dev/maintain/itemInfo`,
        params
    })
}

/**
 * 新增保养项信息
 * @param {
  *  MaintainItemInfo
  * } data
  */
export function addMaintainItemInfo(data) {
    return request({
        method: 'POST',
        url: `/dev/maintain/itemInfo`,
        data
    })
}


/**
 * 更新保养项信息
 * @param {
 *  MaintainItemInfo
 * } data
 */
export function updateMaintainItemInfo(data) {
    return request({
        method: 'PUT',
        url: `/dev/maintain/itemInfo/${data.id}`,
        data
    })
}

/**
 * 删除保养项
 * @param {
 *  id
 * } id
 */
export function deleteMaintainItemInfo(id) {
    return request({
        method: 'DELETE',
        url: `/dev/maintain/itemInfo/${id}`,
    })
}

/**
 * 批量删除保养项
 * @param {
 *  ids
 * } ids
 */
export function batchDelMaintainItemInfos(ids) {
    return request({
        method: 'DELETE',
        url: `/dev/maintain/itemInfo/batch`,
        data: ids,
        paramsSerializer: ids => {
            return qs.stringify(ids, { indices: false })
        }
    })
}
/**
 * 模版导入
 */
export const IMPORT_MAINTAIN_ITEMS = '/api/dev/maintain/itemInfo/import'

/**
 * 模版下载
 */
export function downloadMaintainItemTemp() {
    return request({
        method: 'GET',
        url: `/dev/maintain/itemInfo/template`,
        responseType: 'blob'
    })
}

/****************************** 点检计划API结束  ***********************************************/

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
        url: `/dev/maintain/plan`,
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
        url: `/dev/maintain/plan/${id}`
    })
}

/**
 * 新增点检计划
 * @param { checkingPlan } checkingPlan
 */
export function addCheckingPlan(data) {
    return request({
        method: 'POST',
        url: `/dev/maintain/plan`,
        data: data
    })
}

/**
 * 获取点检计划模板下拉选择数据
 */
export function getCheckingTempMap() {
    return request({
        method: 'GET',
        url: `/dev/maintain/temp/map`
    })
}

/**
 * 获取点检人姓名
 */
export function getCheckingUserMap() {
    return request({
        method: 'GET',
        url: `/dev/maintain/temp/userMap`
    })
}

/**
 * 获取巡检人列表
 */
export function getInspectionUserMap() {
    return request({
        method: 'GET',
        url: `/dev/maintain/plan/initInspectionData`
    })
}
/**
 * 获取润滑人列表
 */
export function getLubricationUserMap() {
    return request({
        method: 'GET',
        url: `/dev/maintain/recordItem/initLubricationData`
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
        url: `/dev/maintain/plan/cycle`
    })
}

/**
 * 根据ID删除计划
 * @param { id } id
 */
export function deleteCheckingPlan(id) {
    return request({
        method: 'DELETE',
        url: `/dev/maintain/plan/${id}`
    })
}

/**
 * 更新点检计划
 * @param { checkingPlan } checkingPlan
 */
export function updateCheckingPlan(checkingPlan) {
    return request({
        method: 'PUT',
        url: `/dev/maintain/plan/${checkingPlan.id}`,
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
        url: `/dev/maintain/plan/batch`,
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
        url: `/dev/maintain/temp`,
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
        url: `/dev/maintain/temp`,
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
        url: `/dev/maintain/temp/${id}`
    })
}

/**
 * 根据id批量删除点检计划模板
 * @param { ids } ids
 */
export function batchDelCheckingTemp(ids) {
    return request({
        method: 'DELETE',
        url: `/dev/maintain/temp/batch`,
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
        url: `/dev/maintain/temp/${id}`
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
        url: `/dev/maintain/temp/${record.id}`,
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
        url: `/dev/maintain/temp/item/plan`,
        params: params
    })
}

/**
 * 分组获取设备
 */
export function getTempGroupByDev(tempNo) {
    return request({
        method: 'GET',
        url: `/dev/maintain/temp/item/devGroup`,
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
        url: `/dev/maintain/temp/item/delByDevNo`,
        data: params
    })
}

/**
 * 获取点检模板项下拉选择项的内容
 */
export function getCheckingItemSelectMap() {
    return request({
        method: 'GET',
        url: `/dev/maintain/temp/item/item`
    })
}

/**
 * 新增点检模板项
 * @param { checkingTempItem } form
 */
export function addCheckingTempItem(checkingTempItem) {
    return request({
        method: 'POST',
        url: `/dev/maintain/temp/item`,
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
        url: `/dev/maintain/temp/item/${id}`
    })
}

/**
 * 批量删除点检模板项
 * @param { ids } ids
 */
export function batchDelCheckingTempItems(ids) {
    return request({
        method: 'DELETE',
        url: `/dev/maintain/temp/item/batch`,
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
        url: `/dev/maintain/temp/item/${id}`
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
        url: `/dev/maintain/record`,
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
        url: `/dev/maintain/record/${checkingRecord.id}`,
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
        url: `/dev/maintain/record/item`,
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
        url: `/dev/maintain/record/item/unusual`,
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
        url: `/dev/maintain/record/item/report`,
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
        url: `/dev/maintain/record/item/${id}`
    })
}

/**
 * 获取点检计划下拉选择
 */
export function getCheckingPlanMap() {
    return request({
        method: 'GET',
        url: `/dev/maintain/plan/planMap`
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
        url: `/dev/maintain/record/getDevByRecordNo`,
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
        url: `/dev/maintain/record/item/groupByCode`,
        params: params
    })
}

/****************************** 点检确认API结束 *************************************************/

export function getMaintainItemInfoByDevNo(params) {
    return request({
        method: 'GET',
        url: `/dev/maintain/itemInfo/devNo`,
        params: params,
        paramsSerializer: devNos => {
            return qs.stringify(devNos, { indices: false })
        }
    })
}
/**
 * 获取设备异常统计信息
 */
export function queryByOffTime(params) {
    return request(
        {
            method: "GET",
            url: '/sys/devOnOffRecord/queryByOffTime',
            params
        }
    )
}

export function selectMainRecordGroupByCode(params) {
    return request({
        method: 'GET',
        url: `/dev/maintain/record/item/groupByCode`,
        params: params
    })
}
