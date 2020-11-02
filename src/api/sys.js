import request from '@/utils/request'


/**********  菜单管理 ***********/
/**
 * 获取菜单树
 *
 *
 */
export function getMenu() {
    return request({
        method: 'GET',
        url: `/sys/permission/leftmenu`,
    })
}
/**
 * 新增菜单
 * {}
 */
export function addMenu(data) {
    return request({
        method: 'POST',
        url: `/sys/permission/leftmenu`,
        data: data
    })
}
/**
 * 新增菜单
 * {}
 */
export function updateMenu(id, data) {
    return request({
        method: 'PUT',
        url: `/sys/permission/leftmenu/` + id,
        data: data
    })
}
/**
 * 删除菜单
 * {ids}
 */
export function delMenu(data) {
    return request({
        method: 'POST',
        url: `/sys/permission/leftmenu/deletes`,
        data: { ids: data }
    })
}

/**
 * 获取单位管理
 * @param params
 */
export function getUnitData(params) {
    return request({
        method: 'GET',
        url: `/sys/unit`,
        params: params
    })
}

export function saveUnit(data) {
    return request({
        method: 'POST',
        url: `/sys/unit/saveUnit`,
        data: data
    })
}

/**
 *
 * @param params
 */
export function deleteUnit(id) {
    return request({
        method: 'DELETE',
        url: `/sys/unit/deleteUnit/` + id,
    })
}

export function queryUnitType() {
    return request({
        method: 'get',
        url: '/sys/unit/queryUnitType'
    })
}

/**
 * 查询员工
 * @param params
 */
export function getEmpyes(params) {
    return request({
        method: 'get',
        url: '/sys/empyes/getEmpyes',
        params: { ...params }
    })
}

/**
 * 保存员工
 * @param row
 * @param ids
 */
export function saveEmpyes(params) {
    return request({
        method: 'post',
        url: '/sys/empyes/saveEmpyes',
        params
    })
}

/**
 * 删除员工
 * @param arr
 */
export function dltempyes(arr) {
    return request({
        method: 'delete',
        url: '/sys/empyes/dltEmpyes',
        params: {
            ids: arr + "",
        }
    })
}

/**
 * 重置密码
 * @param arr
 */
export function reset(arr) {
    return request({
        method: 'get',
        url: '/sys/empyes/reset',
        params: {
            ids: arr + "",
        }
    })
}

/**
 * 分配/收回账号
 * @param id
 */
export function changeAccount(id) {
    return request({
        method: 'post',
        url: '/sys/empyes/changeAccount/' + id
    })
}


/**
 * 下载员工导入模板
 */
export function downlowdEmpyesModelTemp() {
    return request({
        method: 'GET',
        url: '/sys/empyes/template',
        responseType: 'blob'
    })
}


/**
 * 查询所有角色
 */
export function queryRole(loginUserCode) {
    return request({
        method: 'get',
        url: '/sys/role/queryAll/',
        params: { loginUserCode }
    })
}

export function saveRoleUser(userId, data) {
    return request({
        method: 'post',
        url: '/sys/empyes/saveRoleUser/' + userId,
        data: data
    })
}

/**
 * 判断右移用户是否有权限
 * @param loginUserCode
 * @param roleIds
 */
export function moveRole(loginUserCode, roleIds) {
    return request({
        method: 'get',
        url: '/sys/empyes/moveRole',
        params: {
            loginUserCode: loginUserCode,
            roleIds: roleIds + "",
        }
    })
}

/**
 * 用户修改密码
 */
export function uptPassword(userCode, params) {
    return request({
        method: 'put',
        url: '/sys/empyes/uptPassword/',
        params: {
            userCode: userCode,
            ...params
        }
    })
}

/**
 * 查询已有角色
 * @param userId
 */
export function getRole(userId) {
    return request({
        method: 'get',
        url: '/sys/empyes/getRole/' + userId,
    })
}


export function PermissonTree() {
    return request({
        method: 'get',
        url: '/sys/pemission/queryAll'
    })
}


export function uptPermission(row) {
    return request({
        method: 'put',
        url: '/sys/pemission/uptPermission',
        data: row
    })
}

export function dltPermissionDecide(id) {
    return request({
        method: 'delete',
        url: '/sys/pemission/dltPermissionDecide/' + id
    })
}
export function mobileDltPermissionDecide(id) {
    return request({
        method: 'get',
        url: '/sys/pemission/mobile/dltPermissionDecide/' + id
    })
}

export function dltPermission(id) {
    return request({
        method: 'delete',
        url: '/sys/pemission/dltPermission/' + id
    })
}

export function addPermission(rows) {
    return request({
        method: 'post',
        url: '/sys/pemission/addPermission',
        data: rows
    })
}


export function moveUp(id) {
    return request({
        method: 'put',
        url: '/sys/pemission/moveUp/' + id
    })
}




export function moveDown(id) {
    return request({
        method: 'put',
        url: '/sys/pemission/moveDown/' + id
    })
}

export function move(type) {
    return request({
        method: 'get',
        url: '/sys/pemission/move/' + type
    })
}

export function saveParent(rowId, value) {
    return request({
        method: 'put',
        url: '/sys/pemission/saveParent/' + rowId,
        params: { value }
    })
}

export function buttonList(id) {
    return request({
        method: 'get',
        url: '/sys/pemission/buttonList/' + id
    })
}

export function addButton(row) {
    return request({
        method: 'put',
        url: '/sys/pemission/addButton',
        data: row
    })
}

export function dltButton(ids) {
    return request({
        method: 'delete',
        url: '/sys/pemission/dltButton',
        params: {
            ids: ids + "",
        }
    })
}

export function copyList() {
    return request({
        method: 'get',
        url: '/sys/pemission/copyList'
    })
}

export function copyButton(ids, pid) {
    return request({
        method: 'post',
        url: '/sys/pemission/copyButton/' + pid,
        params: {
            ids: ids + "",
        }
    })
}

export function menuInit(userCode) {
    return request({
        method: 'get',
        url: '/sys/permission/menuInit',
        params: { userCode }
    })
}


/**
 * 部门管理初始化
 */
export function departmentTree() {
    return request({
        method: 'get',
        url: '/sys/department/departmentTree'
    })
}

/**
 * 部门详情
 * @param id
 */
export function queryDepartById(id) {
    return request({
        method: 'get',
        url: '/sys/department/getDepartmentById/' + id
    })
}

/**
 * 上级部门名称部门详情
 * @param id
 */
export function getByDepartmentCode(params) {
    return request({
        method: 'get',
        url: '/sys/department/getByDepartmentCode',
        params
    })
}

/**
 * 根据部门编码查询员工列表
 * @param departCode
 */
export function getEmpyesByDepartCode(id) {
    return request({
        method: 'get',
        url: '/sys/department/getEmpyesByDepartCode/' + id
    })

}

export function sltUserByDepartId(id) {
    return request({
        method: 'get',
        url: '/sys/department/sltUserByDepartId/' + id
    })
}

/**
 * 保存部门
 * @param row
 */
export function addDepartment(row) {
    return request({
        method: "post",
        url: '/sys/department/addDepartment',
        data: row
    })
}

/**
 * 删除部门
 * @param id
 */
export function dltDepartment(id) {
    return request({
        method: 'delete',
        url: '/sys/department/dltDepartment/' + id
    })
}

/**
 * 新增部门员工
 * @param params
 */
export function addDepartUser(params) {
    return request({
        method: 'get',
        url: '/sys/department/addDepartUser',
        params: { ...params }
    })
}

/**
 * 修改部门员工
 * @param row
 */
export function uptDepartUser(row) {
    return request({
        method: 'put',
        url: '/sys/department/uptDepartUser',
        data: row
    })
}

/**
 * 删除员工部门关系
 * @param ids
 */
export function dltDepartUser(ids) {
    return request({
        method: 'delete',
        url: '/sys/department/dltDepartUser',
        params: {
            ids: ids + "",
        }
    })
}

/**
 * 获取部门下拉
 */
export function selectPartment() {
    return request({
        method: 'get',
        url: '/sys/department/selectPartment'
    })
}


/**
 * 事件管理init
 */
export function eventMainInit() {
    return request({
        method: 'get',
        url: '/sys/quartz/eventMain/init'
    })
}


/**
 * 事件管理列表
 */
export function findMainList(params) {
    return request({
        method: 'get',
        url: '/sys/quartz/eventMain/queryMainList',
        params: { ...params }
    })
}

/**
 * 新增事件
 */
export function saveEventMain(row) {
    return request({
        method: 'post',
        url: '/sys/quartz/eventMain/saveEventMain',
        data: row
    })
}

/**
 * 删除事件
 */
export function dltEventMain(id) {
    return request({
        method: 'delete',
        url: '/sys/quartz/eventMain/dltEventMain/' + id
    })
}

/**
 * 查询触发源
 * @param mainId
 * @param params
 */
export function findTriggerByMainId(mainId, params) {
    return request({
        method: 'get',
        url: '/sys/quartz/eventMain/findTriggerByMainId/' + mainId,
        params: { ...params }
    })
}
/**
 * 手动触发事件
 * @param mainId
 * @param params
 */
export function manualTrigger(params) {
    return request({
        method: 'get',
        url: '/sys/quartz/eventMain/manualTrigger',
        params: { ...params }
    })
}

/**
 * 新增事件触发源
 * @param mainId
 * @param triggerId
 */
export function addEventMainTrigger(mainId, triggerId) {
    return request({
        method: 'post',
        url: '/sys/quartz/eventMain/addEventMainTrigger/' + mainId + "/" + triggerId
    })
}

/**
 * 查询tag触发源
 * @param mainId
 */
export function findTriggerToTag(mainId) {
    return request({
        method: 'get',
        url: '/sys/quartz/eventMain/findTriggerToTag/' + mainId
    })

}

/**
 * 新增tag触发源
 * @param mainId
 * @param rows
 */
export function addEventMainTagTrigger(mainId, rows) {
    return request({
        method: 'post',
        url: '/sys/quartz/eventMain/addMainTagTrigger/' + mainId,
        data: rows
    })
}

/**
 * 删除tag触发源
 * @param mainId
 * @param rows
 */
export function dltEventMainTagTrigger(mainId, rows) {
    return request({
        method: 'post',
        url: '/sys/quartz/eventMain/dltEventMainTagTrigger/' + mainId,
        data: rows
    })
}


/**
 * 移动端获取列表
 */
export function mobileQueryAll() {
    return request({
        method: 'get',
        url: '/sys/permission/mobile/queryAll',
    })
}

/**
 * 新增或者修改
 */
export function saveOrUpdate(data) {
    return request({
        method: 'post',
        url: '/sys/permission/mobile/saveOrUpdate',
        data
    })
}



/**
 * 动态获取菜单
 */
export function queryMenu(params) {
    return request({
        method: 'get',
        url: `/sys/permission/mobile/query?userCode=${params}`,
    })
}

/**
 * 删除
 */
export function mobileDel(id) {
    return request({
        method: 'get',
        url: `/sys/permission/mobile/delete?id=${id}`,
    })
}

/**
 *
 * 上移
 */
export function mobileMoveUp(id) {
    return request({
        method: 'get',
        url: `/sys/permission/mobile/up?id=${id}`
    })
}

/**
 *
 * 下移
 */
export function mobileMoveDown(id) {
    return request({
        method: 'get',
        url: `/sys/permission/mobile/down?id=${id}`
    })
}

/**
 *
 * 移动
 */
export function mobileMove(id) {
    return request({
        method: 'get',
        url: `/sys/permission/mobile/move`
    })
}

/**
 *
 * 保存
 */
export function mobileSaveParent(id, parentCode) {
    return request({
        method: 'get',
        url: `/sys/permission/mobile/changeParent?id=${id}&parentCode=${parentCode}`
    })
}

/**
 * 查询日历列表
 */
export function queryAll(params) {
    return request({
        method: 'get',
        url: '/sys/calendar/getCalendar',
        params: { ...params }
    })
}

/**
 * 新增or修改日历
 * @param row
 */
export function saveCalendar(row) {
    return request({
        method: 'post',
        url: '/sys/calendar/saveCalenDar',
        data: row
    })
}

/**
 * 复制日历
 * @param id
 * @param param
 */
export function copyCalendar(id, param) {
    return request({
        method: "post",
        url: '/sys/calendar/copyCalendar/' + id,
        params: { ...param }
    })
}

/**
 * 批量删除日历
 * @param ids
 */
export function batchDeleteCalendar(ids) {
    return request({
        method: 'delete',
        url: '/sys/calendar/batchDeleteCalendar',
        params: {
            ids: ids + ""
        }
    })
}

/**
 * 查询例外日
 * @param params
 */
export function getExceptByCalendarCode(params) {
    return request({
        method: 'get',
        url: '/sys/calendar/getExceptByCalendarCode',
        params: { ...params }
    })
}

/**
 * 新增or修改例外日
 * @param row
 */
export function saveExcept(row) {
    return request({
        method: 'post',
        url: '/sys/calendar/saveExcept',
        data: row
    })
}

/**
 * 删除例外日
 * @param id
 */
export function deleteExcept(id) {
    return request({
        method: 'delete',
        url: '/sys/calendar/deleteExcept/' + id
    })
}

/**
 * 批量删除例外日
 * @param ids
 */
export function batchDeleteExcept(ids) {
    return request({
        method: 'delete',
        url: '/sys/calendar/batchDeleteExcept/',
        params: {
            ids: ids + "",
        }
    })
}

/**
 * 例外日同步
 * @param calendarIds
 * @param exceptIds
 */
export function exceptSyc(calendarIds, exceptIds) {
    return request({
        method: 'get',
        url: '/sys/calendar/exceptSyc',
        params: {
            calendarIds: calendarIds + "",
            exceptIds: exceptIds + ""
        }
    })
}

// 重启
export function resetTriggerEventConfig() {
    return request({
        method: 'get',
        url: '/sys/quartz/TriggerTag/resetTriggerEventConfig',
    })
}
// 重启
export function resetRegularEventConfig() {
    return request({
        method: 'get',
        url: '/sys/quartz/eventMain/resetEvent',
    })
}

/**
 * 查询用户为班组长所在的班组
 * @param userCode
 */
export function workShopByLeaderUser(param) {
    return request({
        method: 'get',
        url: '/sys/department/getWorkShopByLeaderUser',
        params: { ...param }
    })
}


/**
 * 外部接口注册
 * @param params
 */
export function ioManageSlt(params) {
    return request({
        method: 'get',
        url: '/sys/ioManage/ioManageSlt',
        params
    })
}

/**
 * 外部接口注册
 * @param params
 */
export function ioManageQueryAll(params) {
    return request({
        method: 'get',
        url: '/sys/ioManage/queryAll',
        params
    })
}

/**
 * 外部接口 新增保存
 * @param params
 */
export function saveIoManage(data) {
    return request({
        method: 'POST',
        url: '/sys/ioManage/saveIoManage',
        data
    })
}



/**
 * 外部接口 删除
 * @param params
 */
export function deleteIoManege(id) {
    return request({
        method: 'DELETE',
        url: `/sys/ioManage/deleteIoManege/${id}`,
    })
}
