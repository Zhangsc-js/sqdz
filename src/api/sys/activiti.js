import request from '@/utils/request'

/**
 * activiti工作流部署管理列表查询
 * @param {
 * } params
 */
export function getDeployment(params) {
    return request({
        method: 'GET',
        url: `/sys/activiti/findActRepRocder`,
        params: {
            ...params
        }
    })
}

/**
 * 查询角色和用户数据
 * @param {
 * } params
 */
export function getActRoles(params) {
    return request({
        method: 'GET',
        url: `/sys/activiti/findGroupAndUser`,
        params: {
            ...params
        }
    })
}

/**
 * 增加角色
 * @param {
 *  groupName
 *  } params
 */
export function addActRole(params) {
    return request({
        method: 'POST',
        url: `/sys/activiti/addGroup`,
        data: {
            ...params
        }
    })
}

/**
 * 删除角色
 * @param {
 *  groupId
 *  } params
 */
export function delActRole(params) {
    return request({
        method: 'POST',
        url: `/sys/activiti/deleteGroup`,
        data: {
            ...params
        }
    })
}


/**
 * 增加用户
 * @param {
 *  id,
 *  username,
 *  userWork
 *  } params
 */
export function addActUser(params) {
    return request({
        method: 'POST',
        url: `/sys/activiti/addUser`,
        data: {
            ...params
        }
    })
}

/**
 * 删除用户
 * @param {
 *  id
 *  username
 *  } params
 */
export function delActUser(params) {
    return request({
        method: 'POST',
        url: `/sys/activiti/deleteUser`,
        data: {
            ...params
        }
    })
}

/**
 *  关联用户角色
 * @param {
 *  userId
 *  groupId
 *  } params
 */
export function addUserRole(params) {
    return request({
        method: 'POST',
        url: `/sys/activiti/addGroupAndUser`,
        data: {
            ...params
        }
    })
}

/**
 *  删除关联用户角色
 * @param {
 *  userId
 *  groupId
 *  } params
 */
export function delUserRole(params) {
    return request({
        method: 'POST',
        url: `/sys/activiti/deleteGroupAndUser`,
        data: {
            ...params
        }
    })
}

/**
 * 查询系统用户
 * @param {
 *  userName,
 *  workNumber
 * } params
 */
export function getMesUser(params) {
    return request({
        method: 'GET',
        url: `/sys/activiti/findByUser`,
        params: {
            ...params
        }
    })
}

/**
 * 查询activiti用户
 * @param {
 *  userWork
 * } params
 */
export function getActUserAll(params) {
    return request({
        method: 'GET',
        url: `/sys/activiti/findAllUser`,
        params: {
            ...params
        }
    })
}

/**
 * 查询activiti角色
 * @param {
 *  id
 * } params
 */
export function getActRolesAll(params) {
    return request({
        method: 'GET',
        url: `/sys/activiti/findAllGroup`,
        params: {
            ...params
        }
    })
}


/**
 * 查询任务历史列表
 * @param {
 * page
 * } params
 */
export function getTaskList(params) {
    return request({
        method: 'GET',
        url: `/sys/activiti/findTaskInst`,
        params: {
            ...params
        }
    })
}

/**
 * 根据PROCINSTID查询历史表
 * @param {
 * PROCINSTID
 * } params
 */
export function getTaskListByInst(params) {
    return request({
        method: 'GET',
        url: `/sys/activiti/findByPROCINSTID`,
        params: {
            ...params
        }
    })
}

/**
 *  流程图测试
 * @param {
 * labIndic
 * startTime
 * workShop
 * endTime
 * } params
 */
export function testPic(params) {
    return request({
        method: 'GET',
        url: `/sys/activiti/findByActivitiPicture`,
        params: {
            ...params
        },
        responseType: "arraybuffer"
    })
}

/**
 *  根据用户工号查询，角色与用户关联
 * @param {
 * workCode
 * } params
 */
export function getMember(params) {
    return request({
        method: 'GET',
        url: `/sys/activiti/findByWork`,
        params: {
            ...params
        }
    })
}

/**
 *  activiti公用列表
 * @param {
 * pageNum
 * pageSize
 * assignee
 * paramMap
 * createStart
 * createEnd
 * } params
 */
export function getActDataList(params) {
    return request({
        method: 'GET',
        url: `/sys/activiti/activitiDataList`,
        params: {
            ...params
        }
    })
}


/**
 *  消息提示
 * @param {
    * workCode
    * } params
    */
   export function getMsgCount(params) {
       return request({
           method: 'GET',
           url: `/sys/activiti/findByLoginAcquireCount`,
           params: {
               ...params
           }
       })
   }