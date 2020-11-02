import request from '@/utils/request'
import qs from 'qs' 
export function findSysCustomerAll(params){
    return request({
        method:"get",
        url:"/sys/sysCustomer/findSysCustomerAll",
        params:{
            ...params
        }
    })
}
export function queryStatus(){
    return request({
        method:"get",
        url:"/sys/sysCustomer/queryStatus"
    })
}
export function querySacles(){
    return request({
        method:"get",
        url:"/sys/sysCustomer/querySacles"
    })
}
export function saveSysCustomer(params){
    return request({
        method:"post",
        url:"/sys/sysCustomer/saveSysCustomer",
        data:{
            ...params
        }
    })
}
export function findSysCustomerById(id){
    return request({
        method:"get",
        url:"/sys/sysCustomer/findSysCustomerById",
        params:{
            id:id
        }
    })
}
export function updataSysCustomer(params){
    return request({
        method:"post",
        url:"/sys/sysCustomer/updataSysCustomer",
        data:{
            ...params
        }
    })
}
export function deleteSysCustomer(id){
    return request({
        method:"get",
        url:"/sys/sysCustomer/deleteSysCustomer",
        params:{
            id:id
        }
    })
}
export function findSysCustomerUserService(params){
    return request({
        method:"get",
        url:"/sys/SysCustomerUserController/findSysCustomerUserService",
        params:{
            ...params
        }
    })
}
export function saveSysCustomerUser(params){
    return request({
        method:"post",
        url:"/sys/SysCustomerUserController/saveSysCustomerUser",
        data:{
            ...params
        }
    })
}
export function updateSysCustomerUser(params){
    return request({
        method:"post",
        url:"/sys/SysCustomerUserController/updateSysCustomerUser",
        data:{
            ...params
        }
    })
}
export function deleteSysCustomerUser(id){
    return request({
        method:"get",
        url:"/sys/SysCustomerUserController/deleteSysCustomerUser",
        params:{
            id:id
        }
    })
}