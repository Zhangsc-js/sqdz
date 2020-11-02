import request from '@/utils/request'

/**
 * 酒体品种列表
 * @param {
 *  pageNum,
 *  gradeName
 * } params
 */
export function liquorVariety(params) {
    return request({
        method: 'GET',
        url: `/snow/liquorVariety/findAll`,
        params: {
            ...params
        }
    })
}

/**
 * 酒体品种列表
 * @param {
 * } params
 */
export function liquorVarietyAll(params) {
    return request({
        method: 'GET',
        url: `/snow/liquorVariety/findOutAll`,
        params: {
            ...params
        }
    })
}

/**
 * 添加 与 更新 品种
 * @param {
 * } params
 */
export function addVariety(params) {
    return request({
        method: 'POST',
        url: `/snow/liquorVariety/addAndUpdate`,
        data: {
            ...params
        }
    })
}

/**
 * 添加 与 更新 酒体化验标准
 * @param {
 * } params
 */
export function addStandard(params) {
    return request({
        method: 'POST',
        url: `/snow/norm/addAndUpdate`,
        data: {
            ...params
        }
    })
}

/**
 * 删除 酒体化验标准
 * @param {
 * } params
 */
export function delStandard(params) {
    return request({
        method: 'POST',
        // headers: {
        //     'Content-Type': 'application/json'
        // },
        url: `/snow/norm/delete/`,
        data: params
    })
}

/**
 * 删除 品种
 * @param {
 * } params
 */
export function delVariety(params) {
    return request({
        method: 'GET',
        url: `/snow/liquorVariety/delete`,
        params: {
            ...params
        }
    })
}

/**
 * 查询列表 酒体化验标准
 * @param {
 * pageNum
 * pageSize
 * gradeName
 * } params
 */
export function standardDetail(params) {
    return request({
        method: 'GET',
        url: `/snow/norm/findAll`,
        params: {
            ...params
        }
    })
}

/**
 * 新增化验单
 * @param {
 * } params
 */
export function addLabData(params) {
    return request({
        method: 'POST',
        url: `/snow/labDataMain/add`,
        data: {
            ...params
        }
    })
}

/**
 * 查询列表 化验单列表
 * @param {
 * } params
 */
export function getLabDataList(params) {
    return request({
        method: 'GET',
        url: `/snow/labDataMain/findAll`,
        params: {
            ...params
        }
    })
}

/**
 * 根据主表ID查询化验原始数据（草稿使用）
 * @param {
 * } params
 */
export function getDraftOrigin(params) {
    return request({
        method: 'GET',
        url: `/snow/snowLabDataParam/findByLabDataMainId`,
        params: {
            ...params
        }
    })
}

/**
 * 查询产线班组
 * @param {
 * name
 * code
 * lineId
 * } params
 */
export function productionShiftList(params) {
    return request({
        method: 'GET',
        url: `/snow/team/all`,
        params: {
            ...params
        }
    })
}

/**
 * 查询产线
 * @param {
 * name
 * code
 * lineId
 * } params
 */
export function pdLineList(params) {
    return request({
        method: 'GET',
        url: `/snow/productionLine/all`,
        params: {
            ...params
        }
    })
}
/**
 * 查询班次
 * @param {
 * name
 * code
 * lineId
 * } params
 */
export function shiftList(params) {
    return request({
        method: 'GET',
        url: `/snow/shiftClass/all`,
        params: {
            ...params
        }
    })
}

/**
 * 查询化验指标个数匹配
 * @param {
 * code
 * } params
 */
export function getSnowLab(params) {
    return request({
        method: 'GET',
        url: `/sys/dict/getSnowLab`,
        params: {
            ...params
        }
    })
}

/**
 * 根据主表ID查询两个子表数据
 * @param {
 * labDataMainId
 * } params
 */
export function getDataByMainId(params) {
    return request({
        method: 'GET',
        url: `/snow/labDataMain/findByLabDataMainId`,
        params: {
            ...params
        }
    })
}

/**
 * 根据主表ID查询化验额外数据（草稿使用）
 * @param {
 * labDataMainId
 * } params
 */
export function getDraftExtra(params) {
    return request({
        method: 'GET',
        url: `/snow/snowLabExtraData/findByLabDataMainId`,
        params: {
            ...params
        }
    })
}

/**
 * 添加 化验原始数据参数
 * @param {
 * params
 * } params
 */
export function addLabOrigin(params) {
    return request({
        method: 'POST',
        url: `/snow/snowLabDataParam/add`,
        data: {
            ...params
        }
    })
}

/**
 * 添加 化验额外数据    
 * @param {
 * params
 * } params
 */
export function addLabExtra(params) {
    return request({
        method: 'POST',
        url: `/snow/snowLabExtraData/add`,
        data: {
            ...params
        }
    })
}

/**
 * 化验数据审核
 * @param {
 * params
 * } params
 */
export function snowAudit(params) {
    return request({
        method: 'GET',
        url: `/snow/labDataMain/audit`,
        params: {
            ...params
        }
    })
}

/**
 * 判断值是否符合标准
 * @param {
 * wineId
 * assayParam
 * type
 * value
 * } params
 */
export function getSnowStandard(params) {
    return request({
        method: 'GET',
        url: `/snow/norm/ifStandard`,
        params: {
            ...params
        }
    })
}

/**
 * 完成化验
 * @param {
 * id
 * } params
 */
export function labComplete(params) {
    return request({
        method: 'GET',
        url: `/snow/labDataMain/accomplishAssay`,
        params: {
            ...params
        }
    })
}

/**
 * 华润化验部（检验人员与取样人员）
 * @param {
 * id
 * } params
 */
export function getSampler(id) {
    return request({
        method: 'GET',
        url: `/sys/department/getEmpyesByDepartCode/`+id,
    })
}

/**
 * 查询产线分页
 * @param {
 * name
 * code
 * } params
 */
export function productionLinePage(params) {
    return request({
        method: 'GET',
        url: `/snow/productionLine/page`,
        params: {
            ...params
        }
    })
}

/**
 * 保存产线
 */
export function productionLineSave(params) {
    return request({
        method: 'POST',
        url: `/snow/productionLine/save`,
        data: params
    })
}

/**
 * 删除产线
 */
export function productionLineDel(params) {
    return request({
        method: 'DELETE',
        url: `/snow/productionLine/deleteById`,
        params: params
    })
}

/**
 * 查询产线班组分页
 * @param {
 * name
 * code
 * lineId
 * } params
 */
export function productionTeamPage(params) {
    return request({
        method: 'GET',
        url: `/snow/team/page`,
        params: {
            ...params
        }
    })
}

/**
 * 保存班组
 */
export function productionTeamSave(params) {
    return request({
        method: 'POST',
        url: `/snow/team/save`,
        data: params
    })
}

/**
 * 删除班组
 */
export function productionTeamDel(params) {
    return request({
        method: 'DELETE',
        url: `/snow/team/deleteById`,
        params: params
    })
}

/**
 * 通过id查询班组
 */
export function productionTeamById(params) {
    return request({
        method: 'GET',
        url: `/snow/team/selectById`,
        params: params
    })
}
/**
 * 批量更新班组
 */
export function productionTeamBatchDel(params) {
    return request({
        method: 'POST',
        url: `/snow/team/updBatch`,
        data: params
    })
}

/**
 * 查询班次分页
 * @param {
 * name
 * code
 * } params
 */
export function shiftPage(params) {
    return request({
        method: 'GET',
        url: `/snow/shiftClass/page`,
        params: {
            ...params
        }
    })
}

/**
 * 保存班次
 */
export function shiftSave(params) {
    return request({
        method: 'POST',
        url: `/snow/shiftClass/save`,
        data: params
    })
}

/**
 * 删除班次
 */
export function shiftDel(params) {
    return request({
        method: 'DELETE',
        url: `/snow/shiftClass/deleteById`,
        params: params
    })
}


/**
 * 提交化验数据
 * @param {
 * name
 * code
 * } params
 */
export function addInputData(params) {
    return request({
        method: 'POST',
        url: `/snow/labDataMain/addLabData`,
        data: params
    })
}

/**
 * 净含量标准列表
 */
export function netContentList() {
    return request({
        method: 'GET',
        url: `/snow/labDataMain/netContentList`,
    })
}

/**
 * 删除化验单
 */
export function deleteLabData(param) {
    return request({
        method: 'GET',
        url: `/snow/labDataMain/delete`,
        params: param
    })
}

/**
 * 查询DR60000数据
 */
export function getDR6(param) {
    return request({
        method: 'GET',
        url: `/snow/equipmentData/findAllSnowLabDR6000Dao`,
        params: param
    })
}
/**
 * 查询DMA数据
 */
export function getDMA(param) {
    return request({
        method: 'GET',
        url: `/snow/equipmentData/findAllSnowLabDMADao`,
        params: param
    })
}

/**
 * 查询Haffman数据
 */
export function getHaffman(param) {
    return request({
        method: 'GET',
        url: `/snow/equipmentData/findAllSnowLabHaffmanDao`,
        params: param
    })
}

/**
 * 导入数据时判断是否已使用且添加至数据
 * @param {
 * labDataParamId
 * labMainId
 * type
 * DRtype
 * deviceId
 * }
 */
export function canExportOrNo(param) {
    return request({
        method: 'GET',
        url: `/snow/equipmentData/canExportOrNo`,
        params: param
    })
}

/**
 * 导出excel
 * @param {
 * }
 */
export function exportExcel(param) {
    return request({
        method: 'GET',
        url: `/snow/labDataMain/exportExcel`,
        responseType: 'blob',
        params: param
    })
}

/**
 * 补充化验单产量 与 参数苦味质
 * @param {
 * }
 */
export function addBtvYield(param) {
    return request({
        method: 'GET',
        url: `/snow/labDataMain/addYieldAndBitterTasteValue`,
        params: param
    })
}

