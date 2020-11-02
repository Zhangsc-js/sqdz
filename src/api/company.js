import request from '@/utils/request'

/**
 * 获取企业列表
 * sky.wang
 * */
export function list(data) {
    return request({
        method: 'GET',
        url: `/company/comp/findAll`,
        params: {
            ...data
        }
    })
}

/**
 * 根据id查询企业详细信息
 * sky.wang
 * */
export function detail(data) {
    return request({
        method: 'GET',
        url: `/company/comp/${data.id}`,
        params: {
            ...data
        }
    })
}
/**
* 新增SaaS企业
 * sky.wang
* */
export function addCompany(params) {
    return request({
        method: 'POST',
        url: `/company/comp`,
        params: { ...params }
    })

}

export function dltCompany(ids) {
    return request({
        method:'delete',
        url:'/company/comp/dltCompany',
        params:{
            ids:ids + ""
        }
    })
}
