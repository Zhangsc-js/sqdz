import request from '@/utils/request'
import qs from 'qs'


/**
 * 根据部门id获取关联工序
 * @param id
 */
export function findByDepartId(id) {
  return request({
    method: 'get',
    url: '/sys/departMentProcess/findByDepartMentId/' + id
  })
}

/**
 * 新增时,展示工序tree
 */
export function findProcessTree() {
  return request({
    method: 'get',
    url: '/sys/departMentProcess/findProcessTree'
  })
}

/**
 * 删除部门工序关联
 * @param id
 */
export function dltDepartMentProcess(id) {
  return request({
    method: 'delete',
    url: '/sys/departMentProcess/dltDepartMentProcess/' + id
  })
}

/**
 * 批量删除
 * @param ids
 * @constructor
 */
export function BatchDltDepartMentProcess(ids) {
  return request({
    method: 'delete',
    url: '/sys/departMentProcess/BatchDltDepartMentProcess',
    params: {
      ids: ids + "",
    }
  })
}

/**
 * 新增部门工序公里
 * @param id 部门id
 * @param processIds 工序id集合
 */
export function saveDepartMentProcess(id, processIds) {
  return request({
    method: 'post',
    url: '/sys/departMentProcess/saveDepartMentProcess/' + id,
    params: {
      processIds: processIds + "",
    }
  })
}

/* ================================== 产线配置 ===================================== */

/**
 * 获取产线
 * @param {
 *  departCode
 * } param
 */
export function getDepartmentLine(param) {
  return request({
    method: 'GET',
    url: `/sys/dept/line`,
    params: param
  })
}

/**
 * 保存部门产线配置
 * @param {
 *  CoDepartmentLine
 * } record
 */
export function saveDepartmentLine(record) {
  return request({
    method: 'POST',
    url: `/sys/dept/line`,
    data: record
  })
}

/**
 * 更新部门产线配置
 * @param {
 *  CoDepartmentLine
 * } record
 */
export function updateDepartmentLine(record) {
  return request({
    method: 'PUT',
    url: `/sys/dept/line`,
    data: record
  })
}

/**
 * 删除部门产线
 * @param {
 *  id
 * } id
 */
export function delDepartmentLine(id) {
  return request({
    method: 'DELETE',
    url: `/sys/dept/line/${id}`
  })
}


/**
 * 获取产线工序
 * @param {
 *  lineCode
 * } param
 */
export function getLineProcess(param) {
  return request({
    method: 'GET',
    url: `/sys/dept/lineProcess`,
    params: param
  })
}

/**
* 保存产线工序
* @param {
*  SysPpcLineProcess
* } record
*/
export function saveLineProcess(record) {
  return request({
    method: 'POST',
    url: `/sys/dept/lineProcess`,
    data: record
  })
}

/**
* 更新产线工序
* @param {
*  SysPpcLineProcess
* } record
*/
export function updateLineProcess(record) {
  return request({
    method: 'PUT',
    url: `/sys/dept/lineProcess`,
    data: record
  })
}

/**
* 删除产线工序
* @param {
*  id
* } id
*/
export function delLineProcess(id) {
  return request({
    method: 'DELETE',
    url: `/sys/dept/lineProcess/${id}`
  })
}

/**
 * 根据部门编码查询工序集合
 * @param departCode
 */
export function getByDepartCode(departCode) {
    return request({
        method:'get',
        url:'/sys/dept/lineProcess/getByDepartCode',
        params:{departCode}
    })
}


/**
 * 获取工序工位
 * @param {
 *  lineCode,
 *  processCode
 * } param
*/
export function getProcessStation(param) {
  return request({
    method: 'GET',
    url: `/sys/dept/linProc/station`,
    params: param
  })
}

/**
* 保存工序工位
* @param {
*  SysPpcLineProcess
* } record
*/
export function saveProcessStation(record) {
  return request({
    method: 'POST',
    url: `/sys/dept/linProc/station`,
    data: record
  })
}

/**
* 更新工序工位
* @param {
*  SysPpcLineProcess
* } record
*/
export function updateProcessStation(record) {
  return request({
    method: 'PUT',
    url: `/sys/dept/linProc/station`,
    data: record
  })
}

/**
* 删除工序工位
* @param {
*  id
* } id
*/
export function delProcessStation(id) {
  return request({
    method: 'DELETE',
    url: `/sys/dept/linProc/station/${id}`
  })
}

/**
 * 获取工序工位
 * @param {
  *  lineCode,
  *  processCode
  * } param
 */
 export function getProcessDevice(param) {
   return request({
     method: 'GET',
     url: `/sys/dept/linProc/device`,
     params: param
   })
 }

 /**
 * 保存工序工位
 * @param {
 *  SysPpcLineProcess
 * } record
 */
 export function saveProcessDevice(record) {
   return request({
     method: 'POST',
     url: `/sys/dept/linProc/device`,
     data: record
   })
 }

 /**
 * 删除工序工位
 * @param {
 *  id
 * } id
 */
 export function delProcessDevice(id) {
   return request({
     method: 'DELETE',
     url: `/sys/dept/linProc/device/${id}`
   })
 }
