import request from '@/utils/request'
import qs from 'qs'

/**
 *
 * 获取设备树
 *
 * @param equipGenealogyPO
 */
export function getDevTree(equipGenealogyPO) {
    return request({
        method: 'GET',
        url: `/sys/dev/devTree`,
        params: equipGenealogyPO
    })
}

/**
 * 下载设备树导入模板
 */
export function downlowdFactoryModelTemp() {
    return request({
        method: 'GET',
        url: `/sys/dev/template`,
        responseType: 'blob'
    })
}

/**
 * excel导入设备
 */
export const IMPORT_FECTORY = `/api/sys/dev/importDevices`

/**
 * 下载设备二维码word
 */
export function downlowdDevQRs(ids) {
    return request({
        method: 'POST',
        url: `/sys/dev/card/createWord`,
        responseType: 'blob',
        data: ids,
        paramsSerializer: ids => {
            return qs.stringify(ids, { indices: false })
        }
    })
}

/**
 * 更新设备树节点
 * @param {
 *  id,
 *  sbmc
 * } form
 */
export function updateDevTreeNode(form) {
    return request({
        method: 'PUT',
        url: `/sys/dev/devices/${form.id}`,
        data: { ...form }
    })
}

/**
 * 通过设备编码找设备详情
 * @param { procCode } procCode
 */
export function getDevTreeNode(procCode) {
    return request({
        method: 'GET',
        url: `/sys/dev/devices/procCode`,
        params: { procCode }
    })
}

/**
 * 新增设备树节点
 * @param { equipGenealogyPO } equipGenealogyPO
 */
export function addDevTreeNode(equipGenealogyPO) {
    return request({
        method: 'POST',
        url: `/sys/dev/devices`,
        data: equipGenealogyPO
    })
}

/**
 * 获取设备类型（从数据字典）
 */
export function getDeviceTypeMap() {
    return request({
        method: 'GET',
        url: `/sys/dev/deviceTypeMap`
    })
}

/**
 * 删除设备树节点
 * @param {id} id
 */
export function delTreeNode(params) {
    return request({
        method: 'DELETE',
        url: `/sys/dev/devices/${params.id}`,
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
        url: `/sys/dev/devices/copy`,
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
        url: `/sys/dev/devices/cut`,
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
        url: `/sys/dev/card/attrs`,
        params: {
            ...params
        }
    })
}

/**
 * 批量更新工厂映射树
 * @param {
 *  updateIds: [],
 *  deleteIds: [],
 *  field: String, 更新字段
 * } map
 */
export function batchUpdateFactoryMapping(map) {
    return request({
        method: 'PUT',
        url: `/sys/dev/devices/batch`,
        data: map,
        paramsSerializer: ids => {
            return qs.stringify(ids, { indices: false })
        }
    })
}

/**
 * 获取设备谱系树中符合条件的所有
 * @param { equipGenealogyPO } equipGenealogyPO
 */
export function getAllDevByCond(equipGenealogyPO) {
    return request({
        method: 'GET',
        url: `/sys/dev/all`,
        params: equipGenealogyPO
    })
}

/**
 * 上移
 * @param {
 *  id
 *  proccode,
 *  pprocode
 * } equipGenealogyPO
 */
export function moveUp(equipGenealogyPO) {
    return request({
        method: 'PUT',
        url: `/sys/dev/up`,
        data: equipGenealogyPO
    })
}

/**
 * 下移
 * @param {
  *  id
  *  proccode,
  *  pprocode
  * } equipGenealogyPO
  */
export function moveDown(equipGenealogyPO) {
    return request({
        method: 'PUT',
        url: `/sys/dev/down`,
        data: equipGenealogyPO
    })
}

/**
 * 通过设备代码直接获取设备详情
 * @param { sbdm } no
 */
export function getDevCardAttrByNo(no) {
    return request({
        method: 'GET',
        url: `/sys/dev/card/attrs/no`,
        params: { sbdm: no }
    })
}

/**
 * 删除设备卡片信息
 * @param {id} id
 */
export function deleteDevAttr(id) {
    return request({
        method: 'DELETE',
        url: `/sys/dev/card/attr/${id}`
    })
}

/**
 * 获取设备信息管理详情
 * @param {id} id
 */
export function getDevCardAttrDetail(id) {
    return request({
        method: 'GET',
        url: `/sys/dev/card/attr/${id}`
    })
}

/**
 * 新增设备详细信息
 * @param { EquipCardAttrsPO } form
 */
export function addDevCardAttr(form) {
    return request({
        method: 'POST',
        url: `/sys/dev/card/attr`,
        data: { ...form }
    })
}

/**
 * 更新设备信息
 * @param { EquipCardAttrsPO } form
 */
export function updateDevCardAttr(form) {
    return request({
        method: 'PUT',
        url: `/sys/dev/card/attr/${form.id}`,
        data: form
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
        url: `/sys/dev/files`,
        params: { ...params }
    })
}

export function getFileURL(id) {
    return request({
        method: 'GET',
        url: `/sys/dev/files/fileUrl/${id}`
    })
}

/**
 * 根据设备代码获取设备实物图片
 * @param {sbdm, fileType: 3} params
 */
export function getDevImg(params) {
    return request({
        method: 'GET',
        url: `/sys/dev/files/dev`,
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
// export const FILE_DOWNLOAD_URL =  `/api/sys/dev/files/download/`

export function downloadDevFile(id) {
    return request({
        method: 'GET',
        url: `/sys/dev/files/download/${id}`,
        responseType: 'blob'
    })
}

/**
 * 附件删除
 * @param {id} id
 */
export function delAttachmentFile(id) {
    return request({
        method: 'DELETE',
        url: `/sys/dev/files/${id}`
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
        url: `/sys/dev/files/${record.id}`,
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
        url: `/sys/dev/param`,
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
        url: `/sys/dev/param`,
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
        url: `/sys/dev/param/${devParameter.id}`,
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
        url: `/sys/dev/param/${id}`,
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
        url: `/sys/dev/card/attrs`,
        params: params
    })
}

/**
 * 删除设备台帐记录
 * @param {id} id
 */
export function deleteDevAccount(id) {
    return request({
        method: 'DELETE',
        url: `/sys/dev/card/attr/${id}`
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
        url: `/sys/dev/card/attrs`,
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
        url: `/sys/dev/card/attr`,
        data: { ...form }
    })
}

/**
 * 设备台帐新增时获取设备代码选择框
 */
export function getDeviceSelectMap() {
    return request({
        method: 'GET',
        url: `/sys/dev/card/map`
    })
}

/**
 * 设备台帐更新
 * @param { EquipCardAttrsPO } form
 */
export function updateDevAccount(form) {
    return request({
        method: 'PUT',
        url: `/sys/dev/card/attr/${form.id}`,
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
        url: `/sys/dev/card/attr/${params}`
    })
}

/**
 * 获取点的历史数据
 * @param pointNames
 */
export function getPointHistoryData(pointNames) {
    return request({
        method: 'POST',
        url: `/sys/dev/param/historyData`,
        params: pointNames,
        paramsSerializer: pointNames => {
            return qs.stringify(pointNames, { indices: false })
        }
    })
}

export function getPointNames() {
    return request({
        method: 'GET',
        url: `/sys/dev/param/pointNames`
    })
}

/**
 * 获取下拉内容
 */
export function findAllNoCut(params) {
    return request({
        method: 'GET',
        url: `/sys/dev/param/findAllNoCut`,
        params
    })
}

/**
 * 下载设备参数导入模版
 */
export function downloadDevParams() {
    return request({
        method: 'GET',
        url: `/sys/dev/param/template`,
        responseType: 'blob'
    })
}

/**
 * 保存设备组态
 * @param params
 */
export function saveHmi(data) {
    return request({
        method: 'POST',
        url: `/sys/dev/hmi/saveHmi`,
        data: data
    })
}
/**
 * 查询设备组态
 * @param params
 */
export function queryHmi(params) {
    return request({
        method: 'GET',
        url: `/sys/dev/hmi/queryHmi`,
        params: params
    })
}

/**
 * 递归查询组态
 * @param {
 *
 * } params
 */
export function reQueryHmi(params) {
  return request({
      method: 'GET',
      url: `/sys/dev/hmi/reQueryHmi`,
      params: params
  })
}

/**
 * 删除设备组态
 * @param params
 */
export function delHmi(id) {
    return request({
        method: 'GET',
        url: `/sys/dev/hmi/delHmi`,
        params: { "id": id }
    })
}


export const IMPORT_DEV_PARAM = "/api/sys/dev/param/import"


export function initOnOffData() {
    return request({
        method: 'get',
        url: '/sys/devOnOffRecord/initOnOffData'
    })
}

export function getDevOnOffRecord(params) {
    return request({
        method: 'get',
        url: '/sys/devOnOffRecord/queryOnOffRecord',
        params: { ...params }
    })
}

export function updateOnOff(row) {
    return request({
        method: 'post',
        url: '/sys/devOnOffRecord/updateOnOff',
        data: row
    })
}
/**
 * 获取设备参数页面初始化数据
 */
export function initDevParamData() {
    return request({
        method: 'GET',
        url: `/sys/dev/param/initDevParamData`,
    })
}

/**
 * 获取 备品备件管理页面 初始化数据
 */
export function queryDevSpares(params) {
    return request({
        method: 'GET',
        url: `/sys/dev/devSpares/queryDevSpares`,
        params
    })
}

/**
 * 删除 备品备件
 */
export function delById(params) {
    return request({
        method: 'GET',
        url: `/sys/dev/devSpares/delById`,
        params
    })
}

/**
 * 查询 所有备品备件
 */
export function querySpares(params) {
    return request({
        method: 'GET',
        url: `/sys/dev/spares/querySpares`,
        params
    })
}

/**
 * 保存 已选择备品备件
 */
export function saveDevSpares(data) {
    return request({
        method: 'POST',
        url: `/sys/dev/devSpares/saveDevSpares`,
        data
    })
}


