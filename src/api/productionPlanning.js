import request from '@/utils/request'
import id from "element-ui/src/locale/lang/id";
import qs from 'qs'


/***********************  生产计划  ***************************************/


/**
 * 物料信息_获取物料基本信息
 */
export function getMaterial(params) {
    return request({
        method: 'GET',
        url: '/sys/ppc/material/queryAll',
        params: {
            ...params
        }
    })
}


export function getMaterialByType(params) {
    return request({
        method: 'get',
        url: '/sys/ppc/material/findMaterialByType',
        params: {
            ...params
        }
    })
}

/**
 * 物料信息_批量删除物料
 * @param arr
 */
export function delectmaterialBatch(arr) {
    return request({
        method: 'delete',
        url: '/sys/ppc/material/delectmaterialBatch',
        params: {
            ids: arr + "",
        }
    })
}


/**
 * 物料信息_添加物料
 * @param params
 */
export function addMaterial(params) {
    return request({
        method: 'post',
        url: '/sys/ppc/material/addMaterial',
        data: {
            ...params
        }
    })
}


/**
 * 物料信息_根据id删除物料信息
 * @param id
 */
export function delectMaterialById(id) {
    return request({
        method: 'delete',
        url: '/sys/ppc/material/delectMaterialById/' + id,
    })
}

/**
 *
 */
export function initDataMaterial() {
    return request({
        method: 'get',
        url: '/sys/ppc/material/initDataMaterial',
    })
}
/**
 * 物料信息_根据物料id查询
 * @param id
 */
export function getMaterialById(id) {
    return request({
        method: 'get',
        url: '/sys/ppc/material/findMaterialById/' + id,
    })
}
/**
 * 物料信息_根据物料code查询
 * @param id
 */
export function findMaterialByCode(code) {
    return request({
        method: 'get',
        url: '/sys/ppc/material/findMaterialByCode/',
        params: { ...code }
    })
}

/**
 * 物料信息_修改物料
 * @param params
 */
export function upMaterial(params) {
    return request({
        method: 'put',
        url: '/sys/ppc/material/upMaterial',
        data: {
            ...params
        }
    })
}


/**
 * 物料信息_查询物料(下拉结构)
 * @param params
 */
export function queryToSelect() {
    return request({
        method: 'get',
        url: '/sys/ppc/material/findAllToSelect'
    })
}

/**
 * 获取物料类型下拉
 */
export function queryStatus() {
    return request({
        method: 'get',
        url: '/sys/ppc/material/queryStatus'
    })
}

/**
 * 下载物料导入模板
 */
export function downlowdMaterialModelTemp() {
    return request({
        method: 'GET',
        url: `/sys/ppc/material/template`,
        responseType: 'blob'
    })
}

/**
 * 下载BOM导入模板
 */
export function downlowdBomModelTemp() {
    return request({
        method: 'GET',
        url: '/sys/ppc/ProductionBom/template',
        responseType: 'blob'
    })
}

/**
 * bom状态数据
 */
export function bomStatus() {
    return request({
        method: 'get',
        url: '/sys/ppc/ProductionBom/initData'
    })
}

/**
 * bom页面初始化数据
 * @param params
 */
export function initBomData() {
    return request({
        method: 'GET',
        url: `/sys/ppc/ProductionBom/initData`,
    })
}

/**
 * 生产Bom_查询Bom树结构
 * @param params
 */
export function getTreeData(params) {
    return request({
        method: 'GET',
        url: '/sys/ppc/ProductionBom/treeData',
        params: {
            ...params
        }
    })
}

/**
 * 生产Bom_查询Bom子结构
 * @param id
 */
export function treeDataDetailAll(id) {
    return request({
        method: 'get',
        url: '/sys/ppc/ProductionBom/treeDataDetailAll/' + id
    })
}
/**
 * 生产Bom_查询Bom子结构
 * @param id
 */
export function getTreeDetailData(id) {
    return request({
        method: 'get',
        url: '/sys/ppc/ProductionBom/treeDataDetail/' + id
    })
}

/**
 * 根据物料查询Bom编码
 * @param materialCode
 */
export function getBomVerStatusList(materialCode) {
    return request({
        method: 'get',
        url: '/sys/ppc/ProductionBom/getBomVerList',
        params: { materialCode }
    })
}

export function getBomTree(bomCode) {
    return request({
        method: 'get',
        url: '/sys/ppc/ProductionBom/BomTree',
        params: { bomCode }
    })
}

export function getBomProdTree(planId, bomCode) {
    return request({
        method: 'get',
        url: '/ppc/bomProd/getBomProdTree/' + planId,
        params: { bomCode }
    })
}

/**
 * 生产Bom_根据Id查询Bom
 * @param id
 */
export function getBom(id) {
    return request({
        method: 'GET',
        url: '/sys/ppc/ProductionBom/getBom/' + id
    })
}

/**
 * 通过物料代码找启用状态的bom
 * @param materialCode
 */
export function getBomEffect(materialCode) {
    return request({
        method: 'GET',
        url: '/sys/ppc/ProductionBom/getBomEffect/',
        params: { materialCode }
    })
}

/**
 * 生产Bom_根据BomId查询BomItem列表
 * @param id
 */
export function getBomItem(id) {
    return request({
        method: 'GET',
        url: '/sys/ppc/ProductionBom/getBomItem/' + id
    })
}

/**
 * 生产Bom_修改bom
 * @param params
 */
export function updateBom(params) {
    return request({
        method: 'put',
        url: '/sys/ppc/ProductionBom/updateBom',
        data: {
            ...params
        }
    })
}
/**
 * 生产Bom_删除bom
 * @param params
 */
export function deleteBom(id) {
    return request({
        method: 'get',
        url: '/sys/ppc/ProductionBom/deleteBom/' + id,
    })
}

/**
 * 生产Bom_新增Bom
 * @param params
 * @param id
 */
export function addBom(params) {
    return request({
        method: 'post',
        url: '/sys/ppc/ProductionBom/addBom',
        data: {
            ...params
        }
    })
}


/**
 * 生产Bom_批量删除BomItem
 * @param arr
 */
export function delectBomItemBatch(arr) {
    return request({
        method: 'delete',
        url: '/sys/ppc/ProductionBom/delectBomItemBatch',
        params: {
            ids: arr + "",
        }
    })
}

/**
 * 生产Bom_新增原料到bomItem
 */
export function saveylToBomItem(arr, id) {
    return request({
        method: 'post',
        url: '/sys/ppc/ProductionBom/saveylToBomItem/' + id,
        params: {
            ids: arr + "",
        }
    })
}
/**
 * 生产Bom_获取Bom基本信息
 */
export function getBomData(params) {
    return request({
        method: 'GET',
        url: '/sys/ppc/ProductionBom/queryAll',
        params: {
            ...params
        }
    })
}
/**
 * 获取group后bom信息
 */
export function getGroupBomData(params) {
    return request({
        method: 'GET',
        url: '/sys/ppc/ProductionBom/getGroupBomData',
        params: {
            ...params
        }
    })
}

export function copyBom(id) {
    return request({
        method: 'get',
        url: '/sys/ppc/ProductionBom/copyBom/' + id
    })
}

export function itemQty(params) {
    return request({
        method: 'get',
        url: '/sys/ppc/ProductionBom/itemQty',
        params: {
            ...params
        }
    })
}

export function delItem(id) {
    return request({
        method: 'delete',
        url: '/sys/ppc/ProductionBom/dltItem/' + id
    })
}

/**
 * 工艺路线_查询工艺路线
 * @param params
 */
export function getroute(params) {
    return request({
        method: 'get',
        url: '/sys/ppc/routeProcess/findRoute',
        params: {
            ...params
        }
    })
}

/**
 * 工艺路线_保存工艺路线
 * @param params
 * @param bomCode
 */
export function saveRoute(params, bomCode) {
    return request({
        method: 'post',
        url: '/sys/ppc/routeProcess/saveRoute/',
        params: {
            bomCode: bomCode,
            ...params
        }
    })
}

/**
 * 工序_新增工序
 * @param params
 * @param bomCode
 */
export function saveProcess(params) {
    return request({
        method: 'post',
        url: '/sys/ppc/routeProcess/saveProcess',
        data: params
    })
}

/**
 * 工序_获取工序下拉数据
 */
export function selectProcess() {
    return request({
        method: 'get',
        url: '/sys/ppc/routeProcess/selectProcess'
    })
}

export function dltProcess(id) {
    return request({
        method: 'delete',
        url: '/sys/ppc/routeProcess/dltProcess/' + id
    })
}

/**
 * 订单_查询All
 * @param params
 */
export function getSaleAll(params) {
    return request({
        method: 'get',
        url: '/ppc/sale/queryAll',
        params: {
            ...params
        }
    })
}

/**
 * 订单_状态下拉
 */
export function statusToSelect() {
    return request({
        method: 'get',
        url: '/ppc/sale/queryStatus'
    })
}

/**
 * 订单_查询详情
 */
export function getSaleDetail(params) {
    return request({
        method: 'get',
        url: '/ppc/sale/queryDetail',
        params: {
            ...params
        }
    })
}
/**
 * 订单_查询详情
 */
export function setSaleDetailStatus(params) {
    return request({
        method: 'get',
        url: '/ppc/sale/setSaleDetailStatus',
        params: {
            ...params
        }
    })
}

/**
 * 订单_(批量)删除
 * @param params
 */
export function delectSaleBatch(arr) {
    return request({
        method: 'delete',
        url: '/ppc/sale/batchdltSale',
        params: {
            ids: arr + "",
        }
    })
}

/**
 * 订单明细_(批量)删除
 * @param params
 */
export function delectDetailBatch(arr) {
    return request({
        method: 'delete',
        url: '/ppc/sale/batchdltDetail',
        params: {
            ids: arr + "",
        }
    })
}

/**
 * 订单新增_部门下拉
 */
export function selectDepart() {
    return request({
        method: 'get',
        url: '/ppc/sale/selectDepart'
    })
}

/**
 * 订单_新增订单
 * @param param
 */
export function addSale(param) {
    return request({
        method: 'post',
        url: '/ppc/sale/saveSale',
        data: param
    })
}

/**
 * 订单_新增订单详情
 * @param param
 */
export function addSaleDetail(param) {
    return request({
        method: 'post',
        url: '/ppc/sale/saveSaleDateil',
        data: param
    })
}

/**
 * 订单_根据订单Id查询
 * @param id
 */
export function getSaleById(id) {
    return request({
        method: 'get',
        url: '/ppc/sale/getSaleById/' + id
    })
}

/**
 * 订单_修改订单
 * @param param
 */
export function updateSale(param) {
    return request({
        method: 'put',
        url: '/ppc/sale/updateSale',
        data: param
    })
}

/**
 * 订单详情_根据Id订单详情
 * @param id
 */
export function getSaleDetailById(id) {
    return request({
        method: 'get',
        url: '/ppc/sale/getSaleDetailById/' + id
    })
}

/**
 * 订单详情_修改订单详情
 * @param param
 */
export function updateSaleDetail(param) {
    return request({
        method: 'put',
        url: '/ppc/sale/updateSaleDetail',
        data: param
    })
}

export function getSaleCode() {
    return request({
        method: 'get',
        url: '/ppc/sale/getSaleCode'
    })
}

export function getdetailCode(id) {
    return request({
        method: 'get',
        url: '/ppc/sale/getDetailCode/' + id
    })
}

/**
 * 生产计划初始化
 */
export function initDataPlanOrder() {
    return request({
        method: 'get',
        url: '/ppc/plan/initDataPlanOrder',
    })
}

/**
 * 订单_生产工单数据(未新增)
 * @param id 子订单ID
 */
export function queryAllPlan(params) {
    return request({
        method: 'get',
        url: '/ppc/plan/queryAll',
        params: {
            ...params
        }
    })
}



/**
 * 订单_生产工单数据
 * @param id 子订单ID
 */
export function addProductPlan(id) {
    return request({
        method: 'get',
        url: '/ppc/sale/productPlan/' + id
    })
}

/**
 * 计划列表_批量提交
 * @param objs
 */
export function batchSavePlan(objs) {
    return request({
        method: 'post',
        url: '/ppc/plan/batchSavePlan',
        data: objs,

    })
}

export function dltProducePlan(id) {
    return request({
        method: 'delete',
        url: '/ppc/plan/dltProducePlan/' + id
    })
}
export function checkEnableChangeWorkshop(id) {
    return request({
        method: 'get',
        url: '/ppc/plan/checkEnableChangeWorkshop/' + id
    })
}

export function issuePp(id) {
    return request({
        method: 'put',
        url: '/ppc/plan/issuePp/' + id
    })
}
export function forceComplete(id) {
    return request({
        method: 'put',
        url: '/ppc/plan/forceComplete/' + id
    })
}
export function getProeucePlan(id) {
    return request({
        method: 'get',
        url: '/ppc/plan/getProeucePlan/' + id
    })
}
export function uptProducePlan(data) {
    return request({
        method: 'POST',
        url: '/ppc/plan/uptProducePlan',
        data: { ...data }
    })
}

/**
 * 计划列表_工单工序
 * @param id
 */
export function getPlanProcess(id) {
    return request({
        method: 'get',
        url: '/ppc/planProcess/getPlanProcess/' + id
    })
}
/**
 * 投料初始化
 */
export function initDataInput() {
    return request({
        method: 'get',
        url: '/ppc/planMaterial/initDataInput',
    })
}
/**
 * 计划列表_工单投料
 */
export function getPlanMaterial(id) {
    return request({
        method: 'get',
        url: '/ppc/planMaterial/getPlanMaterial/' + id
    })
}

/**
 * 计划列表_新增工单投料
 * @constructor
 */
export function SavePlanMaterial(materialCode, planId) {
    return request({
        method: 'post',
        url: '/ppc/planMaterial/SavePlanMaterial/' + planId,
        params: { materialCode }
    })
}

/**
 * 生产计划列表_修改投料
 */
export function updatePlanMaterial(row) {
    return request({
        method: 'put',
        url: '/ppc/planMaterial/updatePlanMaterial',
        data: row
    })
}

/**
 * 删除工单投料
 * @param id
 * @returns {*}
 */
export function dltPlanMaterial(id) {
    return request({
        method: 'delete',
        url: '/ppc/planMaterial/dltPlanMaterial/' + id
    })
}

/**'
 * IPAD_显示派工信息
 */
export function getWorkOrderList(arr, params) {
    return request({
        method: 'get',
        url: '/ppc/workshop/getWorkOrderList',
        params: {
            ids: arr + "",
            ...params
        }
    })
}
/**
 *
 */
export function initShiftWorkData() {
    return request({
        method: 'get',
        url: '/ppc/pick/initShiftWorkData',
    })
}
/**
 * 查询领料列表
 */
export function getpickByPlanId(id) {
    return request({
        method: 'get',
        url: '/ppc/workshop/getpickByPlanId/' + id
    })
}

/**
 * 修改状态为开工
 * @param row
 */
export function startWork(id) {
    return request({
        method: 'put',
        url: '/ppc/workshop/uptStatus/' + id,
    })
}

/**
 *新增领料信息
 * @param rows
 */
export function addPick(rows, status) {
    return request({
        method: 'post',
        url: '/ppc/pick/addpick/' + status,
        data: rows
    })
}

/**
 * 查询领料列表
 */
export function getWorkPick(id) {
    return request({
        method: "get",
        url: '/ppc/pick/getWorkPick/' + id
    })
}

/**
 * 查询报工数量
 * @param workId
 */
export function queryFinish(workId) {
    return request({
        method: 'get',
        url: '/ppc/pick/queryFinish/' + workId
    })
}

/**
 * 新增完工记录
 * @param tableData
 */
export function addFinish(tableData) {
    return request({
        method: 'post',
        url: '/ppc/pick/addFinish',
        data: tableData
    })
}

/**
 * 查询报工记录
 * @param id 派工id
 */
export function queryFinishByWorkOrderId(id) {
    return request({
        method: 'get',
        url: '/ppc/pick/queryFinishByWorkOrderId/' + id
    })
}

/**
 * 工单类型及状态
 */
export function statusAndType() {
    return request({
        method: 'get',
        url: '/ppc/pick/statusAndType'
    })
}

/**
 *领料类型
 */
export function billType() {
    return request({
        method: 'get',
        url: '/ppc/pick/billType'
    })
}

/**
 * 派工单状态
 */
export function woStatus() {
    return request({
        method: 'get',
        url: '/ppc/pick/woStatus'
    })
}


/**
 * 车间质检_获取需质检的报工列表
 */
export function getFinish(params) {
    return request({
        method: 'GET',
        url: '/ppc/inspection/getFinish',
        params: {
            ...params
        }
    })
}

/**
 * 获取可返修工序
 */
export function getprocessList(planId, woId) {
    return request({
        method: 'get',
        url: '/ppc/inspection/getprocessList/' + planId + "/" + woId,
    })
}

/**
 * 新增质检纪录
 * @param row
 * @param ids
 */
export function addInspection(row) {
    return request({
        method: 'post',
        url: '/ppc/inspection/addInspection',
        params: {
            ...row
        }
    })
}

/**
 * 排班方案列表
 */
export function getScheduInfo(params) {
    return request({
        method: 'get',
        url: '/sys/ppc/schedul/queryAll',
        params: {
            ...params
        }
    })
}

/**
 * 新增排班计划
 * @param param
 */
export function addSchedulPlan(param) {
    return request({
        method: 'post',
        url: '/sys/ppc/schedul/addSchedulPlan',
        data: param
    })
}

/**
 * 删除排班计划
 */
export function dltSchedulInfo(id) {
    return request({
        method: 'delete',
        url: '/sys/ppc/schedul/dltSchedulInfo/' + id
    })
}

/**
 * 查询排班下的班次配置
 */
export function queryByPlanCode(params) {
    return request({
        method: 'get',
        url: '/sys/ppc/schedul/queryByPlanCode',
        params: {
            ...params
        }
    })
}

/**
 * 根据车间查询班组，班次下拉数据
 * @param shopCode
 */
export function teamShiftSltToShopCode(workShopCode) {
    return request({
        noLoading: true,
        method: 'get',
        url: '/ppc/planDaily/teamShiftSltToShopCode',
        params: { workShopCode }
    })
}

/**
 * 根据id删除排班方案信息
 */
export function deleteDaily(id) {
    return request({
        method: 'delete',
        url: '/ppc/planDaily/deleteDaily/' + id
    })
}

/*********************************班组配置***************************************/
/*****************************班组信息开始**************************************/
/**
 * 查询班组
 * @param params
 */
export function getTeamData(params) {
    return request({
        method: 'GET',
        url: `/sys/ppc/team`,
        params: params
    })
}

/**
 * 新增班组
 * @param data
 */
export function saveTeam(data) {
    return request({
        method: 'POST',
        url: `/sys/ppc/team/saveTeam`,
        data: data
    })
}

/**
 * 根据id删除班组
 * @param id
 */
export function deleteTeam(param) {
    return request({
        method: 'DELETE',
        url: `/sys/ppc/team/deleteTeam/${param.id}`,
        params: param
    })
}

/**
 * 班组下拉数据
 */
export function teamSelect() {
    return request({
        method: 'get',
        url: '/sys/ppc/team/teamSelect'
    })
}
/******************************班组信息结束************************************/
/******************************成员信息开始************************************/
/**
 * 查询成员信息
 * @param params
 */
export function getPersonData(params) {
    return request({
        method: 'GET',
        url: `/sys/ppc/workshopTeamStaff`,
        params: params
    })
}

/**
 * 批量删除成员
 * @param ids
 */
export function batchDelPerson(ids) {
    return request({
        method: 'DELETE',
        url: `/sys/ppc/workshopTeamStaff/batch`,
        data: ids,
        paramsSerializer: ids => {
            return qs.stringify(ids, { indices: false })
        }
    })
}

/**
 * 获取员工信息列表
 * @param params
 */
export function getStaffData(params) {
    return request({
        method: 'GET',
        url: `/sys/ppc/workshopTeamStaff/getStaff`,
        params: params
    })
}

export function getStaffById(id) {
    return request({
        method: 'GET',
        url: `/sys/ppc/workshopTeamStaff/${id}`
    })
}

export function updateStaff(person) {
    return request({
        method: 'PUT',
        url: `/sys/ppc/workshopTeamStaff/${person.id}`,
        data: person
    })
}

/**
 * 将员工信息添加到成员信息
 * @param params
 */
export function addStaffToPerson(params) {
    return request({
        method: 'GET',
        url: `/sys/ppc/workshopTeamStaff/addStaffToPerson`,
        params: { ...params }
    })
}

/**
 * 通过班组查询成员
 * @param id
 */
export function queryPersonByTeamId(params) {
    return request({
        method: 'GET',
        url: `/sys/ppc/workshopTeamStaff/queryPersonByTeamId/${params.teamCode}`,
        params: params
    })
}

export function queryLeader() {
    return request({
        method: 'get',
        url: '/sys/ppc/workshopTeamStaff/queryLeader'
    })
}

export function savePerson(data) {
    return request({
        method: 'POST',
        url: `/sys/ppc/workshopTeamStaff/savePerson`,
        data: data
    })
}

export function deletePerson(param) {
    return request({
        method: 'DELETE',
        url: `/sys/ppc/workshopTeamStaff/deletePerson/${param.id}`,
        params: param
    })
}
/******************************成员信息结束************************************/
/******************************班组配置结束************************************/

/**
 * 新增/修改日历
 * @param id
 * @param param
 */
export function saveCalendar(id, param) {
    return request({
        method: 'post',
        url: '/sys/ppc/schedul/saveCalendar/' + id,
        data: param
    })
}

/**
 * 新增例外日记录
 * @param row
 * @param id
 */
export function saveExcep(row, id) {
    return request({
        method: 'post',
        url: '/sys/ppc/calendar/saveExcep/' + id,
        data: row
    })
}

/**
 * 删除例外日
 * @param id
 */
export function dltExcep(id) {
    return request({
        method: 'delete',
        url: '/sys/ppc/calendar/dltExcep/' + id
    })
}

/**
 * 获取车间
 * @param params
 */
export function getSchedulWorkshop(params) {
    return request({
        method: 'get',
        url: '/sys/ppc/schedul/getSchedulWorkshop',
        params: {
            ...params
        }
    })
}
/**
 * 删除车间
 */
export function delWorkshopFromPlan(id) {
    return request({
        method: 'get',
        url: '/sys/ppc/schedul/delWorkshopFromPlan/' + id,
    })
}

/**
 * 日历查询
 * @param params
 */
export function queryCalendar(params) {
    return request({
        method: 'get',
        url: '/sys/ppc/calendar/getCalendar',
        params: {
            ...params
        }
    })
}

/**
 * 新增排班车间
 * @param params
 */
export function savePlanWorkShop(params) {
    return request({
        method: 'post',
        url: '/sys/ppc/schedul/savePlanWorkShop',
        data: params
    })
}

/**
 * 排班班组
 * @param params
 */
export function teamInfo(params) {
    return request({
        method: 'get',
        url: '/sys/ppc/schedul/teamInfo',
        params: {
            ...params
        }
    })
}

/**
 * 查询排班
 * @param params
 */
export function queryDaily(params) {
    return request({
        method: 'get',
        url: '/ppc/planDaily/queryDaily',
        params: {
            ...params
        }
    })
}

/**
 * 生产排班数据
 * @param params
 */
export function planDaily(params) {
    return request({
        method: 'get',
        url: '/ppc/planDaily/planDaily',
        params: {
            ...params
        }
    })
}

/**
 * 保存排班数据
 * @param row
 */
export function saveDaily(row) {
    return request({
        method: 'post',
        url: '/ppc/planDaily/saveDaily',
        data: row
    })
}

export function batchSaveDaily(rows) {
    return request({
        method: 'post',
        url: '/ppc/planDaily/batchSaveDaily',
        data: rows
    })
}

/**
 * 新增班次
 * @param id
 * @param row
 */
export function saveshift(id, row) {
    return request({
        method: 'post',
        url: '/sys/ppc/schedul/saveshift/' + id,
        data: row
    })
}

/**
 * 删除班次
 * @param id
 */
export function dltShift(id) {
    return request({
        method: 'delete',
        url: '/sys/ppc/schedul/dltShift/' + id
    })
}

/**
 * 班次下拉
 */
export function shiftSelect() {
    return request({
        method: 'get',
        url: '/sys/ppc/schedul/shiftSelect'
    })
}

/**
 * 生产计划进度跟踪
 * @param params
 */
export function getPlanProgress(params) {
    return request({
        method: 'get',
        url: '/ppc/progress/getPlanProgress',
        params: {
            ...params
        }
    })
}

/**
 * 计划进度详情
 * @param id
 */
export function progressPlanInfo(id) {
    return request({
        method: 'get',
        url: '/ppc/progress/progressPlanInfo/' + id
    })
}

/**
 * 计划进度详情
 * @param id
 */
export function producePlanGanttQuery(id) {
    return request({
        method: 'get',
        url: '/ppc/progress/producePlanGanttQuery/' + id
    })
}

/**
 * 派工进度跟踪
 */
export function getorderProgress(params) {
    return request({
        method: 'get',
        url: '/ppc/progress/getorderProgress',
        params: {
            ...params
        }
    })
}

/**
 * 车间产量报表
 */
export function workShopOutput(params) {
    return request({
        method: 'get',
        url: '/ppc/report/workShopOutput',
        params: { ...params }
    })
}

/**
 * 查询物料日产量
 * @param params
 */
export function queryMaterilToDay(params) {
    return request({
        method: 'get',
        url: '/ppc/report/queryMaterilToDay',
        params: { ...params }
    })
}
export function stationOutPut(params) {
    return request({
        method: 'get',
        url: '/ppc/report/stationOutPut',
        params: { ...params }
    })
}

export function processOutPut(params) {
    return request({
        method: 'get',
        url: '/ppc/report/processOutPut',
        params: { ...params }
    })
}


/**
 * 计划完成率统计
 * @param params
 */
export function producePlanFinish(params) {
    return request({
        method: 'get',
        url: '/ppc/report/producePlanFinish',
        params: { ...params }
    })
}

/**
 * 物料拖期top5
 * @param params
 */
export function materialDelay(params) {
    return request({
        method: 'get',
        url: '/ppc/report/materialDelay',
        params: { ...params }
    })
}

/**
 * 工序合格率
 * @param params
 */
export function produceProcessRate(params) {
    return request({
        method: 'get',
        url: '/ppc/report/processReport',
        params: { ...params }
    })
}

/**
 * 物料合格率
 * @param params
 */
export function materialRate(params) {
    return request({
        method: 'get',
        url: '/ppc/report/materialRate',
        params: { ...params }
    })
}

/**
 * 车间合格率
 * @param params
 */
export function workShoRate(params) {
    return request({
        method: 'get',
        url: '/ppc/report/workShopRate',
        params: { ...params }
    })
}

/**
 * 物料废品率
 */
export function materialBadRate(params) {
    return request({
        method: 'get',
        url: '/ppc/report/materialBadRate',
        params: { ...params }
    })
}

/**
 * gantt_计划排产
 */
export function planGantt(params) {
    return request({
        method: 'get',
        url: '/ppc/gantt/planGantt',
        params: { ...params }
    })
}



/**
 * gantt_删除计划/工单
 * @param params
 * @constructor
 */
export function SavePlanGantt(params) {
    return request({
        method: 'post',
        url: '/ppc/gantt/savePlanGantt',
        params: { ...params }
    })
}

export function dltPlanGantt(id) {
    return request({
        method: 'delete',
        url: '/ppc/gantt/dltPlanGantt/' + id
    })
}

/**
 * 资源gantt
 * @constructor
 */
export function ResourcesGantt(params) {
    return request({
        method: 'get',
        url: '/ppc/gantt/ResourcesGantt',
        params: { ...params }
    })
}
/**
 * gantt_修改计划/工单
 */
export function uptPlanGantt(params) {
    return request({
        method: 'put',
        url: '/ppc/gantt/uptPlanGantt',
        data: { ...params }
    })
}
/**
 * 修改资源gantt
 * @param params
 */
export function uptResourceGantt(params) {
    return request({
        method: 'put',
        url: '/ppc/gantt/uptResourceGantt',
        params: { ...params }
    })
}

/**
 * 修改workOrder
 * @param params
 */
export function queryWorkOrder(woNo) {
    return request({
        method: 'get',
        url: '/ppc/gantt/workOrder',
        params: { woNo }
    })
}

export function uptworkOrder(params) {
    return request({
        method: 'put',
        url: '/ppc/gantt/uptworkOrder',
        data: params
    })
}


export function produceKanban(KanbanCode) {
    return request({
        method: 'get',
        url: '/ppc/kanban/produceKanban',
        params: { KanbanCode }
    })
}

export function queryWorkShop() {
    return request({
        method: 'get',
        url: '/sys/ppc/workshopTeam/initData'
    })
}

/**
 * 物料日产出汇总
 */
export function dayOutPutOfMaterial(params) {
    return request({
        method: 'get',
        url: '/ppc/output/dayOutPutOfMaterial',
        params: { ...params }
    })
}

/**
 * 员工月统计汇总
 * @param params
 */
export function monthPriceOfEmployess(params) {
    return request({
        method: 'get',
        url: '/ppc/output/MonthlyPieceCountOfEmployees',
        params: { ...params }
    })
}
/**
 * 销售订单总表获取
 * @param  params
 */
export function getSaleMainAll(params) {
    return request({
        method: 'get',
        url: '/ppc/ppcSale/findSaleMainAll',
        params: {
            ...params
        }
    })
}
/**
 * 获取销售订单状态列表
 */
export function getSaleStatus() {
    return request({
        method: 'get',
        url: '/ppc/ppcSale/findStatus'
    })
}
/**
 * 新增主销售订单
 * @param  params
 */
export function addSaleMain(params) {
    return request({
        method: "put",
        url: "/ppc/ppcSale/savePpcSaleMain",
        data: {
            ...params
        }
    })
}
/**
 * 根据id查询主销售订单信息
 * @param  param
 */
export function getPpcSalebyId(param) {
    return request({
        method: "get",
        url: "/ppc/ppcSale/findPpcSaleMainById",
        params: {
            id: param
        }
    })
}
/**
 * 修改主销售订单信息
 * @param  params
 */
export function updatePpcSaleById(params) {
    return request({
        method: "post",
        url: "/ppc/ppcSale/updateByPrimaryKeySelective",
        data: {
            ...params
        }
    })
}
/**
 * 根据MainId查询子销售订单信息
 * @param  params
 */
export function findPpcSaleDetailByMainId(params) {
    return request({
        method: "get",
        url: "/ppc/ppcSale/findPpcSaleDetailByMainId",
        params: {
            ...params
        }
    })
}
/**
 * 新增子销售订单信息
 * @param  params
 */
export function addPpcSaleDetail(params) {
    return request({
        method: "post",
        url: "/ppc/ppcSale/savePpcSaleDetaile",
        data: {
            ...params
        }
    })
}
/**
 * 修改子销售订单信息
 * @param  params
 */
export function updatePpcSaleDetail(params) {
    return request({
        method: "post",
        url: "/ppc/ppcSale/updatePpcSaleDetail",
        data: {
            ...params
        }
    })
}
/**
 * 删除子销售订单
 * @param  param
 */
export function deletePpcSaleDetail(param) {
    return request({
        method: "get",
        url: "/ppc/ppcSale/deletePpcSaleDetail",
        params: {
            id: param
        }
    })
}
/**
 * 根据查询子订单id查询
 * @param  param
 */
export function findPpcSaleDetailById(param) {
    return request({
        method: "get",
        url: "/ppc/ppcSale/findPpcSaleDetailById",
        params: {
            id: param
        }
    })
}
/**
 * 删除主销售订单
 * @param  param
 */
export function deleteById(param) {
    return request({
        method: "get",
        url: "/ppc/ppcSale/deleteById",
        params: {
            id: param
        }
    })
}
/**
 * 新增生产计划
 */
export function saveProducePlan(params) {
    return request({
        method: "post",
        url: "/ppc/ppcProduocePlanSimple/savePpcProduocePlanSimple",
        data: {
            ...params
        }
    })
}
/**
 * 删除生产计划
 */
export function deletePpcProducePlanById(param) {
    return request({
        method: "get",
        url: "/ppc/ppcProduocePlanSimple/deletePpcProduocePlanSimple",
        params: {
            id: param
        }
    })
}
/**
 *  修改生产计划状态
 */
export function updateStatus(params) {
    return request({
        method: "post",
        url: "/ppc/ppcProduocePlanSimple/updataPpcProduocePlanSimpleByStatus",
        params: {
            ...params
        }
    })
}
/**
 * 根据Id查询生产计划
 */
export function getPpcProducePlanById(params) {
    return request({
        method: "get",
        url: "/ppc/ppcProduocePlanSimple/findPpcProduocePlanSimpleById",
        params: {
            id: params
        }
    })
}
/**
 * 修改生产计划
 */
export function updateProducePlan(params) {
    return request({
        method: "post",
        url: "/ppc/ppcProduocePlanSimple/updataPpcProduocePlanSimple",
        data: {
            ...params
        }
    })
}
/**
 * 查询所有生产计划详情
 */
export function findPpcProduocePlanSimpleAll(params) {
    return request({
        method: "get",
        url: "/ppc/ppcProduocePlanSimple/findPpcProduocePlanSimpleAll",
        params: {
            ...params
        }
    })
}
/**
 * 查询销售订单详情
 */
export function findPpcSaleDetail(params) {
    return request({
        method: "get",
        url: "/ppc/ppcProduocePlanSimple/findPpcSaleDetail",
        params: {
            ...params
        }
    })
}
export function findWorkShoptoWork(params) {
    return request({
        method: "get",
        url: "/ppc/ppcProduocePlanSimple/findWorkShoptoWork",
        params: {
            ...params
        }
    })
}
export function savePpcProducePlanFinish(params) {
    return request({
        method: "post",
        url: "/ppc/ppcProducePlanFinish/savePpcProducePlanFinish",
        data: {
            ...params
        }
    })
}

/**
 * 班组长任务管理查询
 * @param params
 */
export function queryWorkOrderByUser(params) {
    return request({
        method: 'get',
        url: '/ppc/taskManege/queryWorkOrder',
        params: { ...params }
    })
}

/**
 * 班组长更改工位状态(开工,交班,完工,暂停)
 * @param param
 */
export function uptOrderStatus(param) {
    return request({
        method: 'post',
        url: '/ppc/taskManege/uptOrderStatus',
        params: { ...param }
    })
}
/**
 * 获取客户公司下拉列表
 */
export function findPullDownSysCustomer() {
    return request({
        method: "get",
        url: '/sys/sysCustomer/findPullDownSysCustomer'
    })
}
/**
 * 获取客户公司对应的联系人
 */
export function findPullDownSysCustomerUser(code) {
    return request({
        method: "get",
        url: "/sys/SysCustomerUserController/findPullDownSysCustomerUser",
        params: {
            code: code
        }
    })
}
/**
 * 获取产品销售Top10
 */
export function findSaleReport(params) {
    return request({
        method: "get",
        url: "/ppc/report/findSaleReport",
        params: {
            ...params
        }
    })
}

/**
 * 获取客户采购-Top5产品
 */
export function findCustomerReport(params) {
    return request({
        method: "get",
        url: "/ppc/report/findCustomerReport",
        params: {
            ...params
        }
    })
}


export function queryDetailByMap(params) {
    return request({
        method: "get",
        url: "/ppc/sale/queryDetailByMap",
        params
    })
}


export function addProductPlan1(id, params) {
    return request({
        method: "get",
        url: `/ppc/sale/addProductPlan/${id}`,
        params
    })
}

/**
 *
 * @param {*} ids
 * 领取订单
 */
export function receiveDetail(ids) {
    return request({
        method: "POST",
        url: `/ppc/sale/receiveDetail`,
        data: ids
    })
}

/**
 *
 * @param {*} ids
 * 取消领取订单
 */
export function cancelReceive(ids) {
    return request({
        method: "POST",
        url: `/ppc/sale/cancelReceive`,
        data: ids
    })
}
/**
 *
 * @param {*} ids
 * 取消计划
 */
export function dltPlanById(id) {
    return request({
        method: "DELETE",
        url: `/ppc/sale/dltPlanById/${id}`,
    })
}

export function release(id, status) {
    return request({
        method: 'post',
        url: '/ppc/ppcSale/updateDetailById/' + id,
        params: { status }
    })

}
