import request from '@/utils/request'

/**
 * 获取设备维修单
 * @param { DevRepairOder } order
 */
export function getDevRepairOrders(order) {
    return request({
        method: 'GET',
        url: `/dev/repair/order`,
        params: order
    })
}

/**
 * 新增维修单
 * @param {
 *  DevRepairOder
 *  recordIds: []
 * } order
 */
export function saveDevRepairOrders(order) {
    return request({
        method: 'POST',
        url: `/dev/repair/order`,
        data: order
    })
}

/**
 *
 * @param {
 *  DevRepairOder
 *  updateRecordIds: []
 *  deleteRecordIds: []
 * } order
 */
export function updateDevRepairOrders(order) {
    return request({
        method: 'PUT',
        url: `/dev/repair/order`,
        data: order
    })
}

/**
 * 删除维修单
 * @param { orderNo } no
 */
export function deleteDevRepairOrders(no) {
    return request({
        method: 'DELETE',
        url: `/dev/repair/order/${no}`,
    })
}
/** ============================= 维修记录 ======================================== */
/**
 * 获取设备维修记录
 * @param { DevRepairRecord } devName
 */
export function getDevRepairRecords(devName) {
    return request({
        method: 'GET',
        url: `/dev/repair/record`,
        params: devName
    })
}

/**
 *
 * @param {
 *  devName,
 *  orderNo
 * } order
 */
export function getRecordByOrderNo(order) {
    return request({
        method: 'GET',
        url: `/dev/repair/record/orderNo`,
        params: order
    })
}
/**
 *
 * @param {
 *  devName,
 *  orderNo
 * } order
 */
export function getRepairSparesData(order) {
    return request({
        method: 'GET',
        url: `/dev/repair/record/getRepairSparesData`,
        params: order
    })
}

/**
 * 获取所有待处理的设备维修记录
 * @param { devName } devName
 */
export function getPendingRecords(devName) {
    return request({
        method: 'GET',
        url: `/dev/repair/record/pending`,
        params: devName
    })
}

/**
 * 根据id获取record详情
 * @param { id } id
 */
export function getRecordById(id) {
    return request({
        method: 'GET',
        url: `/dev/repair/record/${id}`,
    })
}

/**
 * 获取紧急等级下拉
 */
export function getEmergencyGrade() {
    return request({
        method: 'GET',
        url: `/dev/repair/record/emgGrade`
    })
}

/**
 * 获取紧急状态和来源类型
 */
export function getEmgAndType() {
    return request({
        method: 'GET',
        url: `/dev/repair/record/getEmgAndType`
    })
}

/**
 * 新增维修记录
 * @param {
 *  DevRepairRecord
 * } record
 */
export function saveDevRepairRecord(record) {
    return request({
        method: 'POST',
        url: `/dev/repair/record`,
        data: record
    })
}

/**
 * 更新维修记录
 * @param {
 *  DevRepairRecord
 * } record
 */
export function updateDevRepairRecord(record) {
    return request({
        method: 'PUT',
        url: `/dev/repair/record`,
        data: record
    })
}

/**
 * 删除维修记录
 * @param {
 *  id
 * } id
 */
export function deleteDevRepairRecord(id) {
    return request({
        method: 'DELETE',
        url: `/dev/repair/record/${id}`
    })
}


/**
 * 维修单新增
 */
export function addOrder(data) {
    return request({
        method: 'POST',
        url: `/dev/repair/order`,
        data
    })
}

/**
 * 维修单新增信息
 */
export function addRepairRecord(orderNO, rows) {
    return request({
        method: 'POST',
        url: `/dev/repair/order/addRepairRecord/` + orderNO,
        data: rows
    })
}

/**
 * 删除维修单
 */
export function orderDel(orderNo) {
    return request({
        method: 'DELETE',
        url: `/dev/repair/order/`,
        params: { orderNo }
    })
}
/**
 * 生效维修单
 */
export function effectRepair(id) {
    return request({
        method: 'GET',
        url: `/dev/repair/order/effectRepair`,
        params: { "id":id }
    })
}

export function orderDetailDEl(id) {
    return request({
        method: 'DELETE',
        url: `/dev/repair/order/${id}`,
    })
}

export function groupByCode(params) {
  return request({
    method: 'GET',
    url: `/dev/repair/record`,
    params: params
})
}
