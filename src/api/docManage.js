import request from '@/utils/request'
import qs from 'qs'
/*************************************************存档文件**************************************************/

/**
 * 查询分类下正式文档
 * @param {
 * fileName
 * fileType
 * timeStart
 * timeEnd
 * page
 * size
 * categoryId
 * } params
 * */
export function historyFile(data) {
    return request({
        method: 'POST',
        url: `/file/formal/queryFormalFileList`,
        head: 'application/json',
        data: {
            ...data
        }
    })
}

export function queryConditionFile(data) {
  return request({
    method: 'POST',
    url: `/file/formal/queryConditionFile`,
    head: 'application/json',
    data: {
      ...data
    }
  })
}
/**
 * 预览正式文件
 * @param {
 * id
 * } params
 * */
export function previewFormalFile(data) {
    return request({
        method: 'GET',
        url: `/file/formal/previewFormalFile`,
        head: 'application/json',
        params: {
            ...data
        }
    })
}

/**
 * 下载正式文件
 * @param {
 * id
 * } params
 * */
export function downloadFormalFile(data) {
    return request({
        method: 'GET',
        url: `/file/formal/downloadFormalFile`,
        head: 'application/json',
        params: {
            ...data
        }
    })
}
/**
 * 下载正式文件
 * @param {
 * id
 * } params
 * */
export function deleteFormalFile(data) {
    return request({
        method: 'GET',
        url: `/file/formal/deleteFormalFile`,
        head: 'application/json',
        params: {
            ...data
        }
    })
}

/**
 * 编辑
 * @param data
 */
export  function editRealLocation(data){
  return request({
    method: 'GET',
    url: `/file/formal/editRealLocation`,
    params: data
  })
}
/**************************************************操作记录****************************************************/
/**
 * 获取操作记录列表
 * */
export function operateList(data) {
    return request({
        method: 'POST',
        url: `/file/operate/queryFileOperate`,
        head: 'application/json',
        data: data
    })
}

/**
 * 操作记录导出Excel
 * @param {
 * id
 * } params
 * */
export function exportOperate(data) {
  return request({
    method: 'POST',
    url: `/file/operate/exportOperate`,
    data: data
  })
}

/***********************************************************过期文件**************************************************/
/**
 * 获取过期文件列表
 * */
export function overdueList(data) {
    return request({
        method: 'POST',
        url: `/file/expire/queryExpireFileList`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    })
}

export function handleExpired(data) {
    return request({
        method: 'GET',
        url: `/file/expire/handleExpireFile`,
        params: {
            ...data
        }
    })
}


/*******************************************************************审核*******************************************************/

/**
 * 查询文件审核列表
 * @param {
 * fileName
 * fileType
 * timeStart
 * timeEnd
 * auditFlag (0未审核，1审核通过，2审核拒绝)
 * page
 * size
 * } params
 * */
export function auditList(data) {
    return request({
        method: 'POST',
        url: `/file/audit/queryFileAuditList`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    })
}

/**
 * 审核预览上传的文件
 * @param {
 * id
 * } params
 * */
export function auditPreviewFile(data) {
  return request({
    method: 'GET',
    url: `/file/audit/auditPreviewFile`,
    params: data
  })
}

/**
 * 审核下载文件
 * @param {
 * id
 * } params
 * */
export function auditDownloadFile(data) {
  return request({
    method: 'GET',
    url: `/file/audit/auditDownloadFile`,
    params: data
  })
}


/**
 * 上传审核
 * @param {
 * id
 * } params
 * */
export function fileAudit(data) {
  return request({
    method: 'POST',
    url: `/file/audit/fileAudit`,
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  })
}

/*************************************************类目**********************************************/
/**
 * 分类树，根据父ID查询分类
 * @param {
 * parentId
 * } params
 * */
export function construction(data) {
  return request({
    method: 'GET',
    url: `/file/category/queryCategoryByParentId`,
    params: {
      ...data
    }
  })
}

/**
 * 添加类目
 * @param {
 * name
 * parentId
 * keepingTime
 * level
 * archivesNumber
 * } params
 * */
export function addCategory(data) {
    return request({
        method: 'POST',
        url: `/file/category/addCategory`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    })
}

/**
 * 编辑类目
 * @param {
 * id
 * name
 * parentId
 * keepingTime
 * level
 * archivesNumber
 * } params
 * */
export function editCategory(data) {
    return request({
        method: 'POST',
        url: `/file/category/editCategory`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    })
}

/**
 * 删除类目
 * @param {
 * id
 * } params
 * */
export function delCategory(data) {
    return request({
        method: 'GET',
        url: `/file/category/deleteCategory`,
        params: data
    })
}


/**
 * 查看归档文件
 * @param {
 * id
 * type 1归档2脊背
 * } params
 * */
export function queryCategoryFile(data) {
    return request({
        method: 'GET',
        url: `/file/category/queryCategoryFile`,
        params: data
    })
}

/**
 * 下载导入模板
 * @param {
 * } params
 * */
export function downloadTemplate(data) {
    return request({
        method: 'GET',
        url: `/file/category/queryCategoryFileTemplate`,
        params: data
    })
}

/**
 * 查询文件版本列表API
 * @param {
 * id
 * } params
 * */
export function queryFileVersion(data) {
    return request({
        method: 'GET',
        url: `/file/formal/queryFileVersion`,
        params: data
    })
}

/*************************************************************上传文件**********************************************/


/**
 * 查询上传列表
 * @param {
 * fileName
 * fileType
 * timeStart
 * timeEnd
 * page
 * size
 * } params
 * */

export function uploadList(data) {
  return request({
    method: 'POST',
    url: `/file/upload/queryUploadList`,
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  })
}


/**
 * 上传列表预览
 * @param data
 */
export function uploadPreview(data) {
    return request({
        method: 'GET',
        url: `/file/upload/uploadPreview`,
        params: data
    })
}

/**
 * 上传文件下载
 * @param data
 */
export function uploadDownload(data) {
    return request({
        method: 'GET',
        url: `/file/upload/uploadDownload`,
        params: data
    })
}

/**
 * 删除上传文件
 * @param data
 */
export function deleteUpload(data) {
    return request({
        method: 'GET',
        url: `/file/upload/deleteUploadFile`,
        params: data
    })
}


