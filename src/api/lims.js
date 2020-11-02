import request from '@/utils/request'

/*******************************基础信息*******************************/
/*------------排班----------*/

/**
 * 班制分页信息
 */
export function getShiftGeneralPage(params) {
    return request({
        method: 'GET',
        url: `/lims/shift/shiftGeneral/page`,
        params: {
            ...params
        }
    })
}

/**
 * 班制保存
 */
export function saveShiftGeneral(params) {
    return request({
        method: 'POST',
        url: `/lims/shift/saveShiftGeneral`,
        data: params
    })
}

/**
 * 班制删除
 */
export function delShiftGeneral(params) {
    return request({
        method: 'DELETE',
        url: `/lims/shift/shiftGeneral/` + params
    })
}

/**
 * 班次分页信息
 */
export function getShiftDetailPage(params) {
    return request({
        method: 'GET',
        url: `/lims/shift/shiftDetail/page`,
        params: {
            ...params
        }
    })
}

/**
 * 班次保存
 */
export function saveShiftDetail(params) {
    return request({
        method: 'POST',
        url: `/lims/shift/saveShiftDetail/`,
        data: params
    })
}

/**
 * 班次删除
 */
export function delShiftDetail(params) {
    return request({
        method: 'DELETE',
        url: `/lims/shift/shiftDetail/` + params
    })
}

/**
 * 排班基础设置分页信息，按人员
 */
export function getShiftSchedulePersonPage(params) {
    return request({
        method: 'GET',
        url: `/lims/shift/shiftSchedule/personPage`,
        params: {
            ...params
        }
    })
}
/**
 * 排班基础设置分页信息,按班组
 */
export function getShiftScheduleTeamPage(params) {
    return request({
        method: 'GET',
        url: `/lims/shift/shiftSchedule/teamPage`,
        params: {
            ...params
        }
    })
}

/**
 * 排班基础设置保存
 */
export function saveShiftSchedule(params) {
    return request({
        method: 'POST',
        url: `/lims/shift/saveShiftSchedule/`,
        data: params
    })
}

/**
 * 排班基础设置删除
 */
export function delShiftSchedule(params) {
    return request({
        method: 'DELETE',
        url: `/lims/shift/shiftSchedule/` + params
    })
}

/**
 * 排班设定获取相关信息
 */
export function setShiftPlan(params) {
    return request({
        method: 'POST',
        url: `/lims/shift/shiftPlan/createPlan`,
        data: params
    })
}

/**
 * 保存排班设定信息
 */
export function saveShiftPlan(params) {
    return request({
        method: 'POST',
        url: `/lims/shift/shiftPlan/savePlan`,
        data: params
    })
}

/*------------化验物料-化验部门-分析项目----------*/

/**
 * 获取子级部门/化验小组
 */
export function getLabSubGroup(params) {
    return request({
        method: 'GET',
        url: `/lims/deptAssay/findSubLab`,
        params: {
            ...params
        }
    })
}

/**
* 化验班组详细信息
*/
export function getLabGroupInfoByLabId(params) {
    return request({
        method: 'GET',
        url: `/lims/deptAssay/findLabGroupInfo/` + params
    })
}

/**
 * 获取取样小组配置信息
 */
export function getSampleGroups() {
    return request({
        method: 'GET',
        url: `/lims/deptAssay/findSampleGroupInfo`
    })
}

/**
 * 获取送样地点
 */
export function getSendPlace() {
    return request({
        method: 'GET',
        url: `/lims/deptAssay/selectSendPlace`
    })
}

/**
 * 获取部门人员
 */
export function getGroupStaffs(params) {
    return request({
        method: 'GET',
        url: `/lims/deptAssay/findUsers`,
        params: params
    })
}

/**
 * 化验部门列表
 */
export function getLabDepartment() {
    return request({
        method: 'GET',
        url: `/lims/deptAssay/labDepartment`
    })
}

/**
 * 保存化验部门--分析项目项
 */
export function deptAssayEdit(params) {
    return request({
        method: 'POST',
        url: `/lims/deptAssay/`,
        data: params
    })
}

/**
 * deptId查询化验部门--分析项目项
 */
export function deptAssayByDeptId(param) {
    return request({
        method: 'GET',
        url: `/lims/deptAssay/deptIdQuery/` + param
    })
}

/*------------看板------------*/
/**
 * （当月）化验统计合格/不合格
 */
export function getPassOrNoMonth(param) {
    return request({
        method: 'GET',
        url: `/lims/board/findPassOrNo`,
        params: param
    })
}

/**
 * （当月）化验不合格率top车间
 */
export function getNoRateTop(param) {
    return request({
        method: 'GET',
        url: `/lims/board/noRate`,
        params: param
    })
}

/**
 * 车间化验样品量
 */
export function getWorkshopSpecimen(param) {
    return request({
        method: 'GET',
        url: `/lims/board/workshopSpecimen`,
        params: param
    })
}

/*------------车间------------*/
/**
 * 获取所有车间
 */
export function getWorkshopAll(param) {
    return request({
        method: 'GET',
        url: `/lims/plan/getWorkshop`,
        params: param
    })
}

/*------------缺样原因------------*/
/**
 * 获取缺样原因下拉
 */
export function getMissCause() {
    return request({
        method: 'GET',
        url: `/lims/plan/getSelectMissCause`,
    })
}

/*------------计量单位------------*/
/**
 * 获取所有单位
 */
export function getMeasureUnit() {
    return request({
        method: 'GET',
        url: `/lims/outIndex/unit`
    })
}

/*------------曲线模拟------------*/
/**
 * 获取函数表达式
 */
export function getCurve(params) {
    return request({
        method: 'POST',
        url: `/lims/curveSimulate/polynomial`,
        data: {
            ...params
        }
    })
}

/*------------化验项目------------*/

/**
 * 获取化验项目信息
 * @param {
 *  pageSize,
 *  pageNum
 * } params
 */
export function getProgramInfo(params) {
    return request({
        method: 'GET',
        url: `/lims/program/page`,
        params: {
            ...params
        }
    })
}

/**
 * 计划设定时获取化验项目信息(来料，定时，临时)
 * @param {
 *  type
 * } params
 */
export function getTypeProgram(params) {
    return request({
        method: 'GET',
        url: `/lims/program/plan/` + params,
    })
}

/**
 * 通过id获取单个化验项目信息
 * @param {
 *  proId
 * } param
 */
export function getProgram(param) {
    return request({
        method: 'GET',
        url: '/lims/program/' + param
    })
}

/**
 * 根据化验物料查询分析指标
 */
export function getProIndicator(params) {
    return request({
        method: 'GET',
        url: '/lims/program/findIndicator',
        params: params
    })
}

/**
 * 保存化验项目信息
 * @param { Program } params
 */
export function saveProgramInfo(params) {
    return request({
        method: 'POST',
        url: `/lims/program/`,
        data: {
            ...params
        }
    })
}

/**
 * 删除化验项目信息
 * @param { proId } params
 */
export function deleteProgramInfo(params) {
    return request({
        method: 'DELETE',
        url: `/lims/program/` + params
    })
}

/**
 * 批量删除化验项目信息
 * @param { proIds } params
 */
export function deleteProgramInBatch(params) {
    return request({
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        url: `/lims/program/deletes/`,
        data: params
    })
}

/**
 * 获取化验物料
 */
export function getLabMaterial(params) {
    return request({
        method: 'GET',
        url: `/lims/program/getProgram/`,
        params: params
    })
}

/*******************************指标维护*******************************/

/*------------输入指标------------*/

/**
 * 获取输入指标信息
 * @param {
 *  pageSize,
 *  pageNum
 * } params
 */
export function getInIndicators(params) {
    return request({
        method: 'GET',
        url: `/lims/inputIndex/`,
        params: {
            ...params
        }
    })
}

/**
 * 通过id获取单个输入指标信息
 * @param {
 *  inputId
 * } param
 */
export function getInIndicator(param) {
    return request({
        method: 'GET',
        url: '/lims/inputIndex/' + param
    })
}

/**
 * 增加输入指标信息
 * @param { InputIndex } params
 */
export function addInIndicator(params) {
    return request({
        method: 'POST',
        url: `/lims/inputIndex/`,
        data: {
            ...params
        }
    })
}

/**
 * 增加输入指标信息，并返回增加项
 * @param { InputIndex } params
 */
export function addReturnInput(params) {
    return request({
        method: 'POST',
        url: `/lims/inputIndex/returnAdd`,
        data: {
            ...params
        }
    })
}

/**
 * 更新输入指标信息
 * @param { InputIndex } params
 */
export function updateInIndicator(params) {
    return request({
        method: 'PUT',
        url: `/lims/inputIndex/` + params.inputId,
        data: {
            ...params
        }
    })
}

/**
 * 删除输入指标信息
 * @param { inputId } params
 */
export function deleteInIndicator(params) {
    return request({
        method: 'DELETE',
        url: `/lims/inputIndex/` + params
    })
}

/**
 * 获取输入指标信息(id,指标编号-指标名)
 */
export function getInputList(param) {
    return request({
        method: 'GET',
        url: `/lims/inputIndex/list`,
        params: param
    })
}

/**
 * 批量删除输入指标信息
 * @param { inputIds } params
 */
export function deleteInIndicators(params) {
    return request({
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        url: `/lims/inputIndex/deletes/`,
        data: params
    })
}

/**
 * 指标编号是否存在
 * @param { String inputCode } params
 */
export function existInputCode(params) {
    return request({
        method: 'GET',
        url: `/lims/inputIndex/exist/` ,
        params:params
    })
}

/*------------输出指标------------*/

/**
 * 获取输出指标信息
 * @param {
 *  pageSize,
 *  pageNum
 * } params
 */
export function getOutIndicators(params) {
    return request({
        method: 'GET',
        url: `/lims/outIndex/`,
        params: {
            ...params
        }
    })
}

/**
 * 更新删除操作提示
 */
export function preOperateOut(params) {
    return request({
        method: 'GET',
        url: `/lims/outIndex/preOperate`,
        params: {
            ...params
        }
    })
}

/**
 * 获取未配置公式的有效输出指标信息(id,指标编号-指标名)
 */
export function getOutList() {
    return request({
        method: 'GET',
        url: `/lims/outIndex/list`,
    })
}

/**
 * 获取所有有效的输出指标信息(id,指标编号-指标名)
 */
export function getOutListAll() {
    return request({
        method: 'GET',
        url: `/lims/outIndex/listAll`,
    })
}

/**
 * 获取输出指标信息(id,指标编号-指标名)
 */
export function getOutPart(params) {
    return request({
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        url: `/lims/outIndex/part`,
        data: params
    })
}

/**
 * 通过id获取单个输出指标信息
 * @param {
 *  outId
 * } param
 */
export function getOutIndicator(param) {
    return request({
        method: 'GET',
        url: '/lims/outIndex/' + param
    })
}

/**
 * 增加输出指标信息
 * @param { OutIndex } params
 */
export function addOutIndicator(params) {
    return request({
        method: 'POST',
        url: `/lims/outIndex/`,
        data: {
            ...params
        }
    })
}

/**
 * 增加输出指标信息，并返回增加项
 * @param { OutIndex } params
 */
export function addReturnOut(params) {
    return request({
        method: 'POST',
        url: `/lims/outIndex/returnAdd`,
        data: {
            ...params
        }
    })
}

/**
 * 更新输出指标信息
 * @param { OutIndex } params
 */
export function updateOutIndicator(datas,params) {
    return request({
        method: 'PUT',
        url: `/lims/outIndex/` + params,
        data: {
            ...datas
        }
    })
}

/**
 * 删除输出指标信息
 * @param { outId } params
 */
export function deleteOutIndicator(params) {
    return request({
        method: 'DELETE',
        url: `/lims/outIndex/` + params
    })
}

/**
 * 批量删除输出指标信息
 * @param { outIds } params
 */
export function deleteOutIndicators(params) {
    return request({
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        url: `/lims/outIndex/deletes/`,
        data: params
    })
}

/**
 * 指标编号是否存在
 * @param { String outCode } params
 */
export function existOutCode(params) {
    return request({
        method: 'GET',
        url: `/lims/outIndex/exist/`,
        params:params
    })
}

/*******************************验证规则*******************************/

/*------------**名称------------*/

export let validName = (rule, value, callback) => {
    let reg = /^[^ ]+$/;
    if (!reg.test(value)) {
        callback(new Error('不能含空格'))
    } else {
        callback()
    }
};

/*------------**编号------------*/

export let validCode = (rule, value, callback) => {
    //let reg = /[0-9]+[a-zA-Z]+[0-9a-zA-Z]*|[a-zA-Z]+[0-9]+[0-9a-zA-Z]*/;
    let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]+$/;
    if (!reg.test(value)) {
        callback(new Error('编号必须是数字和字母组合'))
    } else {
        callback()
    }
};

export let validIndicator = (rule, value, callback) => {
    let reg = /.*(<:-:>)+.*$/;
    if(reg.test(value)) {
        callback(new Error('不能输入拼接符'));
    }else{
        callback()
    }
};

/*------------**数字（包含小数）------------*/

export let validNum = (rule, value, callback) => {
    let valStr = '';
    let preStr = '';
    let poStr = '1';
    if (value.substr(0, 1) === '-')
        valStr = value.substr(1, value.length - 1);
    else
        valStr = value;
    if (valStr.indexOf('.') != -1) {
        if ((valStr.split('.')).length != 2)
            callback(new Error('不合格的数，有效整数和小数数位为7'));
        else {
            preStr = valStr.split('.')[0];
            poStr = valStr.split('.')[1];
        }
    } else
        preStr = valStr;
    if (preStr.substr(0, 1).trim() == '0'.trim() && preStr.length != 1)
        callback(new Error('不合格的数，有效整数和小数数位为7'));
    let reg = /^[0-9]{1,7}$/;
    if (!reg.test(preStr) || !reg.test(poStr)) {
        callback(new Error('不合格的数，有效整数和小数数位为7'))
    } else {
        callback()
    }
    if (!reg.test(preStr) || !reg.test(poStr)) {
        callback(new Error('不合格的数，有效整数和小数数位为7'))
    } else {
        callback()
    }
};

/*------------**数字（包含小数,正负数，零，不限数位）------------*/

export let validNumber = (rule, num, callback) => {
    let regNum = /^(0|-?[1-9]\d*)\b/;
    /*let reg = /^(0*[1-9]\d*)\b/;*/
    let reg = /^([0-9]\d*)\b/;
    if (num.indexOf('.') === -1) {
        if (!regNum.test(num)) {
            callback(new Error('无效的数'));
        } else {
            callback()
        }
    } else {
        if (num.split(".").length !== 2 || !regNum.test(num.split(".")[0]) || !reg.test(num.split(".")[1])) {
            callback(new Error('无效的数'));
        } else {
            callback()
        }
    }
};

/*------------**数字（包含小数,正数，不限数位）------------*/

export let validPos = (rule, num, callback) => {
    let regNum = /^(0|[1-9]\d*)\b/;
    let reg = /^(0*[1-9]\d*)\b/;
    if (num.indexOf('.') === -1) {
        if (!regNum.test(num) || num.toString().trim() === '0') {
            callback(new Error('无效的正数'));
        } else {
            callback()
        }
    } else {
        if (num.split(".").length != 2 || !regNum.test(num.split(".")[0]) || !reg.test(num.split(".")[1])) {
            callback(new Error('无效的正数'));
        } else {
            callback()
        }
    }
};

/*------------**数字（正整数，不限数位）------------*/

export let validPosInt = (rule, num, callback) => {
    let regNum = /^([1-9]\d*)\b/;
    if (!regNum.test(num)) {
        callback(new Error('无效的正整数'));
    } else {
        callback()
    }
};

/*------------**括号匹配------------*/
export function validBraces(val) {
    let moduleChar = {
        ")": "(",
        "]": "[",
        "}": "{"
    };
    let braces = '';
    for (let i = 0; i < val.length; i++) { //如果存在括号字符，就加入数组
        for (let key in moduleChar) {
            if (val[i] === key || val[i] === moduleChar[key]) { //如果字符串中存在json中的key 和value字符，就加入数组
                braces = braces + val[i];
            }
        }
    }
    while (/\(\)|\[\]|\{\}/g.test(braces)) {
        braces = braces.replace(/\(\)|\[\]|\{\}/g, "")
    }
    return braces.length === 0 ? true : false
}

/*******************************样品信息*******************************/

/*------------样品分页信息------------*/

export function getSpecimenPage(param, datas) {
    return request({
        method: 'POST',
        url: `/lims/specimen/page/`,
        params: {
            ...param
        },
        data: {
            ...datas
        }
    })
}

/*------------样品物料信息------------*/

/**
 * 获得供料信息
 */
export function getIncomingInfo(id) {
    return request({
        method: 'GET',
        url: `/lims/specimen/rawInfo/` + id,
    })
}

/*------------定点设定信息------------*/

/**
 * 获得定点设定信息
 * @param {
 * String speciId
 * }param
 */
export function getSpotMore(param) {
    return request({
        method: 'GET',
        url: `/lims/spot/speci/` + param
    })
}

/*******************************样品管理*******************************/

/*------------点样------------*/

/**
 * 样品点样详情
 * @param {
 *  pageSize,
 *  pageNum,
 *  spotId
 * }params
 */
export function getSpotDetail(params) {
    return request({
        method: 'GET',
        url: `/lims/specimen/spot/`,
        params: {
            ...params
        }
    })
}

/**
 * 获取样品留存详情
 * @param {
 *  speciId
 * } params
 */
export function getRestainInfo(params) {
    return request({
        method: 'GET',
        url: `/lims/schedule/restainInfo/` + params,
    })
}

/*------------样品分析项目详情------------*/

/**
 * 获取样品分析项
 * @param {
 *  speciId
 * } params
 */
export function getindicatorMore(params) {
    return request({
        method: 'GET',
        url: `/lims/schedule/getItem/` + params,
    })
}

/*******************************------*******************************/

/************公式维护***********/

/**
 * 获取公式列表，分页
 * @param {
 *  pageSize,
 *  pageNum
 * } params
 */
export function getFormula(params) {
    return request({
        method: 'GET',
        url: `/lims/formula`,
        params: {
            ...params
        }
    })
}

/**
 * 通过输入指标Id查询
 */
export function getFormulaByInputId(params) {
    return request({
        method: 'GET',
        url: `/lims/formula/getByInputId`,
        params: {
            ...params
        }
    })
}

/**
 * 新增公式
 * @param {formula}
 */
export function addFormula(data) {
    return request({
        method: 'POST',
        url: `/lims/formula`,
        data: {
            ...data
        }
    })
}

/**
 * 更新公式
 * @param {id } params
 */
export function updateFormula(data) {
    return request({
        method: 'PUT',
        url: `/lims/formula/` + data.formulaId,
        data: {
            ...data
        }
    })
}


/**
 * 删除公式
 * @param {formulaId} params
 */
export function deleteFormula(params) {
    return request({
        method: 'DELETE',
        url: `/lims/formula/` + params
    })
}

/**
 * 查询选取的指标是否已存在对应公式
 */
export function outExistFormula(params) {
    return request({
        method: 'GET',
        url: `/lims/formula/findOut/` + params
    })
}

/**
 * 公式列表
 */
export function getFormulaAll(param) {
    return request({
        method: 'GET',
        url: `/lims/formula/all`,
        params: param
    })
}

/*******************************化验报表*******************************/

/**
 * 获得已化验的化验项目
 */
export function getReportProgramAll() {
    return request({
        method: 'GET',
        url: `/lims/labInfo/queryProgram`
    })
}

/**
 * 获得已化验的车间
 */
export function getReportWorkshopAll() {
    return request({
        method: 'GET',
        url: `/lims/labInfo/queryWorkshop`
    })
}

/**
 * 获得导出项
 */
export function getReportExportAll(param, datas) {
    return request({
        method: 'POST',
        url: `/lims/labInfo/queryExport`,
        params: {
            ...param
        },
        data: {
            ...datas
        }
    })
}

/**
 * 送样检测情况
 */
export function getSendAlySituation(param, datas) {
    return request({
        method: 'POST',
        url: `/lims/schedule/sendSituation`,
        params: {
            ...param
        },
        data: {
            ...datas
        }
    })
}

/**
 * 化验平均
 */
export function getLabAvg(param, datas) {
    return request({
        method: 'POST',
        url: `/lims/labInfo/queryAvgResult`,
        params: {
            ...param
        },
        data: {
            ...datas
        }
    })
}

/**
 * 化验平均详细
 */
export function getLabAvgDetail(param, datas) {
    return request({
        method: 'POST',
        url: `/lims/labInfo/queryAvgResultDetail`,
        params: {
            ...param
        },
        data: {
            ...datas
        }
    })
}

/**
 * 不合格样品
 */
export function getNoPassSpecimen(param, datas) {
    return request({
        method: 'POST',
        url: `/lims/labInfo/findNoSample`,
        params: {
            ...param
        },
        data: {
            ...datas
        }
    })
}

/**
 * 样品不合格化验项详情
 */
export function getNoSpecimenDetail(param) {
    return request({
        method: 'GET',
        url: `/lims/labInfo/noSpecimenDetail`,
        params: param
    })
}

/*******************************化验计划*******************************/

/**
 * 获取供应商
 */
export function getSelectSupplier() {
    return request({
        method: 'GET',
        url: `/lims/plan/getSupplier/`
    })
}

/**
* 任务单信息
*/
export function getScheduleByPlan(params,page) {
    return request({
        method: 'GET',
        url: `/lims/schedule/byPlanId/` + params,
        params:{...page}
    })
}

/**
 * 改变状态
 * @param {
 *  id
 * } params
 */
export function changeState(params) {
    return request({
        method: 'GET',
        url: `/lims/plan/changeStat/` + params,
    })
}

/*------------来料、临时化验------------*/

/**
 * 获取来料计划列表
 * @param {
 *  pageSize,
 *  pageNum
 * } params
 */
export function getRawPurchased(params) {
    return request({
        method: 'GET',
        url: `/lims/plan/raw`,
        params: {
            ...params
        }
    })
}

/**
 * 获取临时列表
 * @param {
 *  pageSize,
 *  pageNum
 * } params
 */
export function getTemp(params) {
    return request({
        method: 'GET',
        url: `/lims/plan/sudden`,
        params: {
            ...params
        }
    })
}

/**
 * 来料计划添加
 * @param {
 * data
 * } params
 */
export function addRaw(params) {
    return request({
        method: 'POST',
        url: `/lims/plan/add/raw`,
        data: {
            ...params
        }
    })
}

/**
 * 临时计划添加
 * @param {
 * data
 * } params
 */
export function addTemp(params) {
    return request({
        method: 'POST',
        url: `/lims/plan/add/sudden`,
        data: {
            ...params
        }
    })
}

/**
 * 来料，临时删除
 * @param {
 * planId
 * } id
 */
export function deletePlan(id) {
    return request({
        method: 'DELETE',
        url: `/lims/plan/` + id,
    })
}

/**
 * 来料计划更新
 * @param {
 * data
 * } params
 */
export function updateRaw(params) {
    return request({
        method: 'PUT',
        url: `/lims/plan/` + params.planId,
        data: {
            ...params
        }
    })
}

/*------------定点设定------------*/

/**
 * 获取定点设定列表
 * @param {
 *  pageSize,
 *  pageNum
 * } params
 */
export function getPlanSpot(params) {
    return request({
        method: 'GET',
        url: `/lims/plan/spot`,
        params: {
            ...params
        }
    })
}

/**
 * 添加
 * @param {
 * data
 * } params
 */
export function addPlanSpot(params) {
    return request({
        method: 'POST',
        url: `/lims/plan/add/spot`,
        data: {
            ...params
        }
    })
}

/**
 * 更新
 * @param {
 * data
 * } params
 */
export function updatePlanSpot(params) {
    return request({
        method: 'PUT',
        url: `/lims/plan/update/spot`,
        data: {
            ...params
        }
    })
}

/**
 * 删除
 * @param {
 * planId
 * } id
 */
export function deletePlanSpot(id) {
    return request({
        method: 'DELETE',
        url: `/lims/plan/delete/spot/` + id,
    })
}

/**
 * 获取计划定点设定信息
 * @param {
 * planId
 * } id
 */
export function getSpotSetting(id) {
    return request({
        method: 'GET',
        url: `/lims/spot/plan/` + id,
    })
}

/*******************************取样工*******************************/

/*------------待取样------------*/

/**
 * 获取待取样列表
 */

export function waitSample(params, query) {
    return request({
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        url: `/lims/schedule/waitSample/`,
        params: {
            ...params
        },
        data: query
    })
}

/*------------待送------------*/

/**
 * 获取待送列表
 */
export function waitSend(params, query) {
    return request({
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        url: `/lims/schedule/waitSend/`,
        params: {
            ...params
        },
        data: query
    })
}

/**
 * 获取缺樣列表
 */

export function miss(params, query) {
    return request({
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        url: `/lims/schedule/miss/`,
        params: {
            ...params
        },
        data: query
    })
}

/**
 * 打印标签
 */
export function labelSample(params) {
    return request({
        method: 'GET',
        url: `/lims/schedule/label/` + params,
    })
}

/**
 * 录入缺样原因
 * @param {
 *  planId
 *  reason
 * } params
 */
export function lostSample(params) {
    return request({
        method: 'POST',
        url: `/lims/schedule/lost/`,
        params: {
            ...params
        }
    })
}

/**
 * 完成取样
 * @param {
 *  planId
 *  workNo
 * } params
 */
export function completeSample(params) {
    return request({
        method: 'POST',
        url: `/lims/schedule/complete/`,
        params: {
            ...params
        }
    })
}

/**
 * 核对送样地点
 * @param {
 *  planId
 *  receivePlace
 * } params
 */
export function checkPlace(params) {
    return request({
        method: 'GET',
        url: `/lims/schedule/check`,
        params: {
            ...params
        }
    })
}

/*******************************化验分析*******************************/

/**
 * 获取待化验列表
 * @param {
 *  pageSize,
 *  pageNum,
 *  labProname
 * } params
 */
export function getPrelab(params) {
    return request({
        method: 'GET',
        url: `/lims/schedule/showAssayProject`,
        params: {
            ...params
        }
    })
}

/**
 * 确认接收
 * @param {
 *  id
 * } params
 */
export function labReceive(params) {
    return request({
        method: 'POST',
        url: `/lims/schedule/notarizeReceive`,
        data: {
            ...params
        }
    })
}

/**
 * 获取未化验列表
 * @param {
 *  pageSize,
 *  pageNum
 * } params
 */
export function getLabOff(params) {
    return request({
        method: 'GET',
        url: `/lims/labSub/showLabSubList`,
        params: {
            ...params
        }
    })
}

/**
 * 化验录入前，小组人员及计算公式信息获取
 * @param {
 *  labId,
 *  labSubId
 * } params
 */
export function getPreInput(params) {
    return request({
        method: 'GET',
        url: `/lims/labSub/findBypersonnel`,
        params: {
            ...params
        }
    })
}

/**
 * 计算
 * @param {
 * inputIndicName
 * nowInputIndic
 * theFormula
 * } params
 */
export function subCalc(params) {
    return request({
        method: 'POST',
        url: `/lims/labSub/calculate`,
        data: {
            ...params
        }
    })
}

/**
 * 化验录入
 * @param {
 * data
 * } params
 */
export function subInput(params) {
    return request({
        method: 'POST',
        url: `/lims/labSub/entering`,
        data: {
            ...params
        }
    })
}

/**
 * 审核：1通过 2拒绝
 * @param {
 *  ifPass,
 *  labSubId,
 * reviewOperatorWork,
 * reviewOperatorName
 * } params
 */
export function dataReview(params) {
    return request({
        method: 'POST',
        url: `/lims/labSub/ifPass`,
        data: {
            ...params
        }
    })
}

/**
 * activiti审核
 * @param {
 * result,
 * activitiId,
 * activitiProcessInstanceId,
 * reviewOperatorName,
 * refuseId  拒绝id
 * } params
 */
export function dataReviewAct(params) {
    return request({
        method: 'POST',
        url: `/lims/labSub/labCheck`,
        data: {
            ...params
        }
    })
}

/**
 * 获取退审重验列表
 * @param {
 *  pageSize,
 *  pageNum
 * } params
 */
export function getLabFail(params) {
    return request({
        method: 'GET',
        url: `/lims/labSub/reExaminationList`,
        params: {
            ...params
        }
    })
}

/**
 * 获取已化验列表
 * @param {
 *  pageSize,
 *  pageNum,
 * proName
 * } params
 */
export function getInspected(params) {
    return request({
        method: 'GET',
        url: `/lims/schedule/completedProject`,
        params: {
            ...params
        }
    })
}

/**
 *申请复验
 * @param {
 *   labSubId,
 *   labName,
 *   labId
 * } params
 */
export function applyRecheck(params) {
    return request({
        method: 'POST',
        url: `/lims/labSub/reExamination`,
        data: {
            ...params
        }
    })
}

/**
 * 获取化验项目明细列表
 * @param {
 * pageNum,
 * pageSize,
 * createTimeStart,
 * createTimeEnd,
 * typeTimeStart,
 * typeTimeEnd,
 * labOperatorName,
 * reviewTimeStart,
 * reviewTimeEnd,
 * reviewOperatorName
 * } params
 */
export function getProlist(params) {
    return request({
        method: 'GET',
        url: `/lims/labSub/assayProjectInfo`,
        params: {
            ...params
        }
    })
}

/**
 *  复验项目审核列表
 * @param {
 * pageNum
 * pageSize
 * assignee
 * } params
 */
export function getRecheckList(params) {
    return request({
        method: 'GET',
        url: `/lims/labSub/reExaminationCheckList`,
        params: {
            ...params
        }
    })
}


/**
 * activiti复验审核
 * @param {
 * result,
 * activitiId,
 * activitiProcessInstanceId,
 * reviewOperatorName,
 * labSubId
 * } params
 */
export function dataRecheckAct(params) {
    return request({
        method: 'POST',
        url: `/lims/labSub/reExaminationCheck`,
        data: {
            ...params
        }
    })
}

/**
 *  根据指标-车间-时间来获取历史的记录
 * @param {
 * labIndic
 * startTime
 * endTime
 * workShop
 * } params
 */
export function getIndicHistory(params) {
    return request({
        method: 'GET',
        url: `/lims/labSub/findByLabIndic`,
        params: {
            ...params
        }
    })
}

/**
 *  根据指标id查询审核不通过记录
 * @param {
 * labSubId
 * } params
 */
export function refuseRec(params) {
    return request({
        method: 'GET',
        url: `/lims/labErrorParamLog/findByLabSubId`,
        params: {
            ...params
        }
    })
}

/**
 *  获取排班信息
 * @param {
 * officeId
 * teamId
 * startDate
 * endDate
 * staffCode
 * staffName
 * } params
 */
export function shiftPlan(params) {
    return request({
        method: 'POST',
        url: `/lims/shift/shiftPlan/query`,
        data: {
            ...params
        }
    })
}

/**
 *  获取班组人员
 * @param {
 * } params
 */
export function getTeam(teamCode) {
    return request({
        method: 'GET',
        url: `/sys/ppc/workshopTeamStaff/queryStaffAllByTeamCode/` + teamCode,
    })
}

/**
 *  获取个人排班信息
 * @param {
    * startDate
    * endDate
    * staffCode
    * page
    * } params
    */
   export function myShiftPlan(params) {
       return request({
           method: 'GET',
           url: `/lims/shift/shiftPlan/personWork`,
           params: {
               ...params
           }
       })
   }
   
   
   /**
 *  获取他人排班信息
 * @param {
    * startDate
    * endDate
    * staffCode
    * page
    * } params
    */
   export function getOthShift(params) {
       return request({
           method: 'GET',
           url: `/lims/shift/shiftPlan/workChange`,
           params: {
               ...params
           }
       })
   }
   

      
   /**
 *  获取备注列表
 * @param {
    * } params
    */
   export function remarkList(params) {
       return request({
           method: 'GET',
           url: `/lims/labSub/findByLabRemark`,
           params: {
               ...params
           }
       })
   }
   

/**
 * 审核人员数据追踪列表
 * @param {
    *  assingnee
    * } params
    */
   export function getAssignList(params) {
       return request({
           method: 'GET',
           url: `/lims/schedule/scheduleList`,
           params: {
               ...params
           }
       })
   }
/**
 * 获取子表数据
 * @param {
    *  assingnee
    * } params
    */
   export function getScheduleDetailList(params) {
       return request({
           method: 'GET',
           url: `/lims/labSub/findByScheduleId`,
           params: {
               ...params
           }
       })
   }
/**
 * 缺样列表
 * @param {
    * } params
    */
   export function speciLackList(params) {
       return request({
           method: 'GET',
           url: `/lims/specimen/checkList`,
           params: {
               ...params
           }
       })
   }
/**
 * 缺样列表审核
 * @param {
    * } params
    */
   export function speciLackCheck(params) {
       return request({
           method: 'GET',
           url: `/lims/specimen/check`,
           params: {
               ...params
           }
       })
   }
