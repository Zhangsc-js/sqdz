import request from '@/utils/request'
import qs from 'qs'
/**
 * 获取采购订单列表数据
 */
export function findSysPurchaseOrderAll(params){
    return request({
        method: 'GET',
        url: '/sys/syspurchaseorder/findSysPurchaseOrderAll',
        params: {
            ...params
        }
    })
}
/**
 * 根据id获取采购订单数据
 */
export function findSysPurchaseOrderById(params){
    return request({
        method:'get',
        url:'/sys/syspurchaseorder/findSysPurchaseOrderById',
        id:params
    })
}
/**
 * 新增采购订单数据
 */
export function saveSysPurchaseOrder(params){
    return request({
        method:'post',
        url:'/sys/syspurchaseorder/saveSysPurchaseOrder',
        data:params
    })
}
/**
 * 修改采购订单数据
 */
export function updateSysPurchaseOrder(params){
    return request({
        method:'post',
        url:'/sys/syspurchaseorder/updateSysPurchaseOrder',
        data:params
    })
}
/**
 * 删除采购订单数据
 */
export function deleteSysPurchaseOrder(params){
    return request({
        method:'get',
        url:'/sys/syspurchaseorder/deleteSysPurchaseOrder',
        id:params
    })
}
/**
 * 根据采购主订单id获取采购子订单列表数据
 */
export function findSysPurchaseOrderDetailByMaiId(params){
    return request({
        method:'get',
        url:'/sys/syspurchaseorder/findSysPurchaseOrderDetailByMaiId',
        params:{
            ...params
        }
    })
}
/**
 * 根据采购子订单id获取数据
 */
export function findSysPurchaseOrderDetailById(params){
    return request({
        method:'get',
        url:'/sys/syspurchaseorder/findSysPurchaseOrderDetailById',
        id:params
    })
}
/**
 * 新增采购子订单数据
 */
export function saveSysPurchaseOrderDetail(params){
    return request({
        method:'post',
        url:'/sys/syspurchaseorder/saveSysPurchaseOrderDetail',
        data:params
    })
}
/**
 * 修改采购子订单数据
 */
export function updateSysPurchaseOrderDetail(params){
    return request({
        method:'post',
        url:'/sys/syspurchaseorder/updateSysPurchaseOrderDetail',
        data:params
    })
}
/**
 * 删除采购子订单数据
 */
export function deleteSysPurchaseOrderDetail(params){
    return request({
        method:'get',
        url:'/sys/syspurchaseorder/deleteSysPurchaseOrderDetail',
        id:params
    })
}
/**
 * 根据mainId获取采购子订单数据
 */
export function findSysPurchaseOrderDetailByMainNo(params){
    return request({
        method:'get',
        url:'/sys/syspurchaseorder/findSysPurchaseOrderDetailByMainNo',
        params:{
            mainId:params
        }
    })
}