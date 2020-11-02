import request from '@/utils/request'
import qs from 'qs'

export function getSupplerList(params) {
    return request({
        method: 'GET',
        url: '/sys/supplier/querySupplierList',
        params:{
            ...params
        }
    })
}
export function getSupplerDetails(params) {
    return request({
        method: 'GET',
        url: '/sys/supplier/initSupplierDetails',
        params:{
            code:params
        }
    })
}
export function deleteSuppler(code){
    return request({
        method:'delete',
        url:'/sys/supplier/deleteSupplier',
        params:{
            code:code
        }
    })
}
export function addSuppler(params){
    return request({
        method:'post',
        url:'/sys/supplier/addSupplier',
        data:{
            ...params
        }
    })
}
export function updateSuppler(params){
    return request({
        method:'post',
        url:'/sys/supplier/updateSupplier',
        data:{
            ...params
        }
    })
}
export function queryStatus(){
    return request({
        method:'Get',
        url:'/sys/supplier/queryStatus'
    })
}
/**
 * 获取供应商下拉数据
 */
export function findPullSupplier(){
    return request({
        method:'get',
        url:'/sys/supplier/findPullSupplier'
    })
}