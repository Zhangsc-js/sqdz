import request from '@/utils/request'
import qs from 'qs'
/**
 * 获取过期文件列表
 * */
export function list(data) {
    return request({
        method: 'post',
        url: `/file/queryExpireFileList`,
        head:'application/json',
        /*params: {
            ...data
        }*/
        data:data
    })
}

export function handle(data) {
    return request({
        method: 'get',
        url: `/file/handleExpireFile`,
        params: {
            ...data
        }
    })
}