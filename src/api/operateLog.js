import request from '@/utils/request'
import qs from 'qs'
/**
 * 获取操作记录列表
 * */
export function list(data) {
    return request({
        method: 'post',
        url: `/file/queryFileOperate`,
        head:'application/json',
        /*params: {
            ...data
        }*/
        data:data
    })
}