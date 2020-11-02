import request from '@/utils/request'

/**
 * 获取数据属性类型
 */
export function getEneDictType() {
    return request({
        method: 'GET',
        url: '/ene/eneDictType/findAll'
    })
}

/**
 * 数据字典_通过名字跟类型查询数据字典
 * @param params
 */
export function selectByNameAndCode(params) {
    return request({
        method: 'GET',
        url: '/ene/eneDictionary/selectByNameAndCode',
        params: {
            ...params
        }
    })
}




//====================================================================================

/**
 * 能源类型_查询能源类型
 * @param params
 */
export function getAllEneType() {
    return request({
        method: 'get',
        url: '/ene/eneType/getAllEneType',
    })
}


//=========================告警类型=========================================

/**
 * 告警类型_获取所有的告警类型
 * @param params
 */
export function selectWarningByNameAndCode(params) {
    return request({
        method: 'get',
        url: '/ene/eneWarning/selectWarningByNameAndCode',
        params: {
            ...params
        }
    })
}

/**
 * 告警类型_添加告警类型
 * @param params
 */
export function addWarning(params) {
    return request({
        method: 'post',
        url: '/ene/eneWarning/addWarning',
        params: {
            ...params
        }
    })
}

/**
 * 告警类型_修改告警类型
 * @param params
 */
export function upWarning(params) {
    return request({
        method: 'put',
        url: '/ene/eneWarning/upWarning',
        params: {
            ...params
        }
    })
}

/**
 * 告警类型_通过id查询告警类型
 * @param id
 */
export function selectWarningById(id) {
    return request({
        method: 'get',
        url: '/ene/eneWarning/selectWarningById/' + id,
    })
}

/**
 * 告警类型_通过id删除告警类型
 * @param id
 */
export function deleteEneWarningById(id) {
    return request({
        method: 'delete',
        url: '/ene/eneWarning/deleteEneWarningById/' + id,
    })
}

/**
 * 告警类型_批量id删除告警类型
 * @param ids
 */
export function deleteEneWarningByBatchId(ids) {
    return request({
        method: 'delete',
        url: '/ene/eneWarning/deleteEneWarningByBatchId',
        params: {
            ids: ids + "",
        }
    })
}

/****************************** 告警条件设置. ***********************************************/

/**
 * 查询告警条件
 * @param params
 */
export function selectWarningConditionByNameAndType(params) {
    return request({
        method: 'get',
        url: `/ene/eneWarningCondition/selectWarningConditionByNameAndType`,
        params: {...params}
    })
}

/**
 * 根据id删除查询告警条件
 * @param id
 */
export function deleteWarningConditionById(id) {
    return request({
        method: 'delete',
        url: `/ene/eneWarningCondition/deleteWarningConditionById/` + id,
    })
}

/**
 * 批量id删除查询告警条件
 * @param ids
 */
export function batchDelEneWarningCondition(ids) {
    return request({
        method: 'delete',
        url: `/ene/eneWarningCondition/batchDelEneWarningCondition`,
        params: {
            ids: ids + "",
        }
    })
}

/**
 * 修改告警条件
 * @param params
 */
export function upWarningCondition(params) {
    return request({
        method: 'put',
        url: `/ene/eneWarningCondition/upWarningCondition`,
        params: {
            ...params,
        }
    })
}

/**
 * 添加告警条件
 * @param params
 */
export function addWarningCondition(params) {
    return request({
        method: 'post',
        url: `/ene/eneWarningCondition/addWarningCondition`,
        params: {
            ...params,
        }
    })
}

/**
 * 添加告警条件
 * @param id
 */
export function getWarningConditionById(id) {
    return request({
        method: 'get',
        url: `/ene/eneWarningCondition/getWarningConditionById/` + id,
    })
}

/****************************** 能源设备树开始 ***********************************************/
/**
 * 设备树
 */
export function getEneDevTree(params) {
    return request({
        method: 'GET',
        url: `/ene/eneDevTree/treeList`,
        params:{
            ...params
        }
    })
}

/**
 * 查询计量设备
 * @param procCode
 */
export function findMeteringInfo(procCode) {
    return request({
        method: 'GET',
        url: `/ene/eneDevTree/findMeteringInfo/` + procCode,
    })
}

/**
 * 查询计量设备
 * @param id
 */
export function findDevById(id) {
    return request({
        method: 'GET',
        url: `/ene/eneDevTree/findDevById/` + id,
    })
}

/**
 * 更新计量设备
 * @param id
 * @param data
 */
export function upDev(id, data) {
    return request({
        method: 'put',
        url: `/ene/eneDevTree/upDev/` + id,
        data: {
            ...data
        }
    })
}

/**
 * 添加计量设备
 * @param data
 */
export function addDev(data) {
    return request({
        method: 'POST',
        url: `/ene/eneDevTree/addDev`,
        data: {
            ...data
        }
    })
}

/**
 * 删除设备
 * @param id
 */
export function delDev(id) {
    return request({
        method: 'delete',
        url: `/ene/eneDevTree/delDev/` + id,
    })
}

/**
 * 查询设备图片
 * @param params
 */
export function getDevImg(params) {
    return request({
        method: 'GET',
        url: `/ene/files/dev/${params.sbdm}`,
        params: {
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
        url: `/ene/files/delById/${fileId}`
    })
}


//=======================数据字典====================================

/**
 * 得到所有工序
 */
export function getAllUseProcess(energyType) {
    return request({
        method: 'GET',
        url: `/ene/eneDevTree/getAllProcess`,
        params:{
            energyType
        }
    })
}

/**
 * 得到所有部门
 */
export function getAllUseDepartment() {
    return request({
        method: 'GET',
        url: `/ene/eneDictionary/getAllUseDepartment`,
    })
}

/**
 * 得到所有车间
 */
export function getAllUseWorkshop(energyType) {
    return request({
        method: 'GET',
        url: `/ene/eneDevTree/getAllWorkshop`,
        params:{
            energyType
        }
    })
}

export function getEneEquipTree(energyType) {
    return request({
        method: 'GET',
        url: `/ene/apportionment/getEneEquipTree`,
        params:{
            energyType
        }
    })
}

/**
 * 得到所有价格单位
 */
export function getPriceUnit(type) {
    return request({
        method: 'GET',
        url: `/ene/enePrice/getPriceUnit`,
        params:{
            type:type
        }
    })
}

/**
 * 得到所有价格code
 */
export function getAllCode() {
    return request({
        method: 'GET',
        url: `/ene/enePrice/getAllCode`,
    })
}



// =============================================================
/**
 * 设备相关资料上传附件Url
 */
export const FILE_UPLOAD_URL = `/api/ene/files/upload`;

/**
 * 设备相关资料下载附件Url
 */
export const FILE_DOWNLOAD_URL = `/api/ene/files/download/`;

//========================================================

/**
 * 得到所有能源类型价格
 * @param params
 */
export function getAllEnePrice(params) {
    return request({
        method: 'GET',
        url: `/ene/enePrice/getAllEnePrice`,
        params: {
            ...params
        }
    })
}

/**
 * 添加addEnePrice能源类型价格
 * @param params
 */
export function addEnePrice(params) {
    return request({
        method: 'post',
        url: `/ene/enePrice/addEnePrice`,
        data: {
            ...params
        }
    })
}

/**
 * 修改能源类型价格
 * @param params
 */
export function upEnePrice(params) {
    return request({
        method: 'put',
        url: `/ene/enePrice/updateEnePrice`,
        data: {
            ...params
        }
    })
}

/**
 * 删除能源类型价格
 * @param id
 */
export function deleteEnePrice(id) {
    return request({
        method: 'delete',
        url: `/ene/enePrice/delEnePrice/${id}`,
    })
}

/**
 * 批量删除能源类型价格
 * @param ids
 */
export function batchDelEnePrices(ids) {
    return request({
        method: 'delete',
        url: `/ene/enePrice/batchDeleteEnergyPrice`,
        params: {
            ids: ids + ""
        }
    })
}

// =====================配置信息========share==========================
/**
 * 添加配置信息
 * @param params
 */
export function addShare(params) {
    return request({
        method: 'post',
        url: `/ene/report/addReportSet`,
        data: {
            ...params
        }
    })
}

/**
 * 修改配置信息
 * @param params
 */
export function updShare(params) {
    return request({
        method: 'put',
        url: `/ene/report/updReportSet`,
        data: {
            ...params
        }
    })
}

/**
 * 查询配置信息
 * @param params
 */
export function getAllShare(params) {
    return request({
        method: 'get',
        url: `/ene/report/getAllShare/${params.isCompareType}`,
        params: {
            ...params
        }
    })
}

/**
 * 删除配置信息
 * @param id
 */
export function delShare(id) {
    return request({
        method: `delete`,
        url:`/ene/report/delShare/${id}`,
    })
}

/**
 * 批量删除配置信息
 * @param ids
 */
export function batchDelReportSetData(ids) {
    return request({
        method: `delete`,
        url:`/ene/report/batchDelReportSetData`,
        params:{
            ids:ids+''
        }
    })
}

// =====================图表数据api==========consume=========================

/**
 * 查询所有年
 */
export function getAllConsumeYear() {
    return request({
        method: 'get',
        url: `/ene/consume/getAllConsumeYear`,
    })
}

/**
 * 获取图表数据
 */
export function getByHourInfoInProcCode(params) {
    return request({
        method:`GET`,
        url: `/ene/consume/getByHourInfoProcCode`,
        params:{
            ...params
        }
    })
}

/**
 * 获取月份图表数据
 */
export function getYOYConsumeYearData(params) {
    return request({
        method:`GET`,
        url: `/ene/consume/getYOYConsumeYearData`,
        params:{
            ...params
        }
    })
}


/**
 * 获取月份图表数据
 */
export function getChainConsumeData(params) {
    return request({
        method:`GET`,
        url: `/ene/consume/getChainConsumeData`,
        params:{
            ...params
        }
    })
}

/**
 * getDbData
 * 在线统计计量在线数
 * [{value: 335},{}]    年
 */
export function getMeteringData(params) {
    return request({
        method:`GET`,
        url: `/ene/metering/getMeteringData`,
        params:{
            energyType:params
        }
    })
}

/**
 * getConsumerData
 * 获取单个设备的 年月日  总数据
 * [value: 0 , value: 1]    年月日
 */
export function getConsumerData(params) {
    return request({
        method:`GET`,
        url: `/ene/consume/getConsumerData`,
        params:{
            energyType:params
        }
    })
}

/**
 * getWorkShopConsume
 * 获取所有设备的 年月日  总数据
 * List: { value: 335, name: "北京" },   年月日
 */
export function getWorkShopConsume(params) {
    return request({
        method:`GET`,
        url: `/ene/consume/getWorkShopConsume`,
        params:{
            energyType:params
        }
    })
}

/**
 * getYearConsumeWorkshopOrder
 * 获取所有设备的 年月日  总数据  从大到小排序好。
 * List: { value: 335, name: "北京" },   年月日
 */
export function getYearConsumeWorkshopOrder(params) {
    return request({
        method:`GET`,
        url: `/ene/consume/getYearConsumeWorkshopOrder`,
        params:{
            energyType:params
        }
    })
}

/**
 * getMonthConsumeWorkshopOrder
 * 获取前五个设备的 各个月  的数据
 * [{proccode:'' , name:''  , value: [1,2,34,] } , {}]
 */
export function getFifthMonthConsumeWorkshopOrder(params) {
    return request({
        method:`GET`,
        url: `/ene/consume/getFifthMonthConsumeWorkshopOrder`,
        params:{
            energyType:params
        }
    })
}
// =====================分摊比例=====================
export function getEneAppList(params){
    return request({
        method: `GET`,
        url:`/ene/apportionment/eneAppList`,
        params:{
            ...params
        }
    })
}
export function getEneAppById(params){
    return request({
        method: `GET`,
        url:`/ene/apportionment/getAllById/${params.id}`,
    })
}

export function updateEenAppIsUse(params){
    return request({
        method:`PUT`,
        url:`/ene/apportionment/eneAppUdUse`,
        params:{
            ...params
        }
    })
}

export function updateEneAppById(id,data) {
    return request({
        method:`PUT`,
        url:`/ene/apportionment/updateEne/${id}`,
        data:{
            ...data
        }
    })
}

/**
 * 能源分摊比新增
 */
export function addEneApp(data) {
    return request({
        method: 'POST',
        url: `/ene/apportionment/addEneApp`,
        data: {
            ...data
        }
    })
}

/**
 * 根据code查询 子报表-年数据
 * @param params
 */
export function getReportByPproccodeInYear(params) {
    return request({
        method: 'get',
        url: `/ene/apportionment/report/getReportByPproccodeInYear`,
        params: {
            ...params
        }
    })
}

/**
 * 根据code查询 子报表-月份数据
 * @param params
 */
export function getReportByPproccodeInMonth(params) {
    return request({
        method: 'get',
        url: `/ene/apportionment/report/getReportByPproccodeInMonth`,
        params: {
            ...params
        }
    })
}

/**
 * 根据code查询 子报表-日份数据
 * @param params
 */
export function getReportByPproccodeInDay(params) {
    return request({
        method: 'get',
        url: `/ene/apportionment/report/getReportByPproccodeInDay`,
        params: {
            ...params
        }
    })
}

/**
 * 根据code查询 子报表-班数据
 * @param params
 */
export function getReportByPproccodeInClass(params) {
    return request({
        method: 'get',
        url: `/ene/apportionment/report/getReportByPproccodeInClass`,
        params: {
            ...params
        }
    })
}


/**************************能源设备管理树*********************/
/**
 * 新增子节点
 * @param equipGenealogyPO
 */
export function addEneDevTreeNode(equipGenealogyPO) {
    return request({
        method: 'POST',
        url: `/ene/eneDevTree/add`,
        data: equipGenealogyPO
    })
}

/**
 * 删除节点
 * @param params
 */
export function delEneTreeNode(params) {
    return request({
        method: 'DELETE',
        url: `/ene/eneDevTree/del/${params.id}`,
        params: { ...params }
    })
}

/**
 * 更新节点
 * @param form
 */
export function udEneTreeNode(form) {
    return request({
        method: 'PUT',
        url: `/ene/eneDevTree/update/${form.id}`,
        data: { ...form }
    })
}

/**
 * 通过设备编码找设备详情
 * @param { procCode } procCode
 */
export function getEneTreeByNode(procCode) {
    return request({
        method: 'GET',
        url: `/ene/eneDevTree/dtl/${procCode}`
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
export function copyEneDevTreeNode(form) {
    return request({
        method: 'POST',
        url: `/ene/eneDevTree/copy`,
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
export function cutEneDevTreeNode(form) {
    return request({
        method: 'POST',
        url: `/ene/eneDevTree/cut`,
        params: { ...form }
    })
}

/**
 * 用电费用明细报表
 * @param params
 */

export function getDayCostSumReport(params) {
    return request({
        method: 'get',
        url: `/ene/costReport/costDayReportList`,
        params: {
            ...params
        }
    })
}

export function getMonthCostSumReport(params) {
    return request({
        method: 'get',
        url: `/ene/costReport/costMonthReportList`,
        params: {
            ...params
        }
    })
}

export function getSchedulCostSumReport(params) {
    return request({
        method:'get',
        url:`/ene/costReport/costSchedulReportList`,
        params:{
            ...params
        }
    })
}

export function getSchedulList(params) {
    return request({
        method:'get',
        url:`/ene/costReport/schedulShifts`,
        params:{
            ...params
        }
    })
}

export function getMaterial(params) {
    return request({
        method: `get`,
        url: `/ene/costReport/material`,
        params:{
            ...params
        }
    })
}

export function getYearCostSumReport(params) {
    return request({
        method: 'get',
        url: `/ene/costReport/costYearReportList`,
        params: {
            ...params
        }
    })
}

export function getCostChildrenReport(params) {
    return request({
        method: 'get',
        url: `/ene/costReport/costChildren`,
        params: {
            ...params
        }
    })
}

export function getCostChildrenYearReport(params) {
    return request({
        method: 'get',
        url: `/ene/costReport/costChildrenYear`,
        params: {
            ...params
        }
    })
}

export function test() {
    return request({
        method: 'get',
        url: `/ene/apportionment/test`,
    })
}

/**
 * 月单耗
 * @param params
 */
export function getUnitConsumptionMonth(params) {
    return request({
        method:`get`,
        url: `/ene/unit/consumption/month`,
        params:{
            ...params
        }
    })
}

// --------------------------------------------------计量点

/**
 * 查询计量点
 * @param params
 */
export function getPoint(params) {
    return request({
        method:`get`,
        url: `/ene/meteringPoint/getPoint`,
        params:{
            ...params
        }
    })
}

/**
 * 删除计量点
 * @param id
 */
export function deletePoint(id) {
    return request({
        method: 'delete',
        url: '/ene/meteringPoint/deletePoint/' + id,
    })
}

/**
 * 查询计量点ById
 * @param id
 */
export function getPointDetails(id) {
    return request({
        method: 'get',
        url: '/ene/meteringPoint/getPointDetails/' + id,
    })
}

/**
 * 新增计量点
 * @param params
 */
export function addPoint(params) {
    return request({
        method: 'post',
        url: '/ene/meteringPoint/addPoint',
        params: {
            ...params
        }
    })
}

/**
 * 实时库测试
 * @param params
 */
export function valueTest() {
    return request({
        method:`get`,
        url: `/ene/meteringPoint/test`,
    })
}

/**
 * 更新计量点
 * @param params
 */
export function updatePoint(params) {
    return request({
        method: 'put',
        url: '/ene/meteringPoint/updatePoint/'+params.id,
        params: {
            ...params
        }
    })
}

export const REPORT_UPLOAD_URL= `/api/ene/reportFiles/upload`

/**
 * 报表文件列表
 * @param params
 */
export function getReportFiles(params) {
    return request({
        method: `get`,
        url: `/ene/reportFiles`,
        params: {
            ...params
        }
    })
}

/**
 * 删除报表文件
 * @param id
 */
export function delReportFile(id) {
    return request({
        method: `DELETE`,
        url: `/ene/reportFiles/${id}`
    })
}

/**
 * 下载报表文件
 * @param id
 */
export function downReportFile(id) {
    return request({
        method: `GET`,
        url: `/ene/reportFiles/download/${id}`
    })
}

/**
 *设备台账列表（弹出框）
 */

export function getDevAttrs(params) {
    return request({
        method: `GET`,
        url: `/ene/meteringPoint/attrs`,
        params:{
            ...params
        }
    })
}

export function getWaterCash(params) {
    return request({
        method: `GET`,
        url: `/ene/consume/getWaterCash`,
        params:{
            ...params
        }
    })
}

export function getElectCash(params) {
    return request({
        method: `GET`,
        url: `/ene/consume/getElectCash`,
        params:{
            ...params
        }
    })
}

export function getGasCash(params) {
    return request({
        method: `GET`,
        url: `/ene/consume/getGasCash`,
        params:{
            ...params
        }
    })
}

export function getDayAllEnergy(params){
    return request({
        method: `GET`,
        url: `/ene/consume/getDayAllEnergy`,
        params: {
            ...params
        }
    })
}

export function getMonthAllEnergy(params){
    return request({
        method: `GET`,
        url: `/ene/consume/getMonthEnergy`,
        params: {
            ...params
        }
    })
}

export function getYearAllEnergy(params){
    return request({
        method: `GET`,
        url: `/ene/consume/getYearEnergy`,
        params: {
            ...params
        }
    })
}

export function getWaterShare(params) {
    return request({
        method: `GET`,
        url: `/ene/consume/getWaterShare`,
        params: {
          ...params
        }
    })
}

export function getElectShare() {
    return request({
        method: `GET`,
        url: `/ene/consume/getElectShare`,
    })
}

export function getGasShare() {
    return request({
        method: `GET`,
        url: `/ene/consume/getGasShare`,
    })
}


