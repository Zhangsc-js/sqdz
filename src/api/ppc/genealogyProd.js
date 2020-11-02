import request from '@/utils/request'

/**
 * 获取生产谱系过站信息列表
 * @param {
 *
 * } param
 */
export function getGenealogyProd(param) {
  return request({
    mehtod: 'GET',
    url: `/ppc/genProd`,
    params: param
  })
}

/**
 *  导出生产谱系过站信息列表
 * @param {
 *
 * } param
 */
export function exportGenealogyProd(param) {
  return request({
    mehtod: 'GET',
    url: `/ppc/genProd/export`,
    params: param,
    responseType: 'blob'
  })
}

/**
 * 获取车间下拉
 */
export function getAllWorkshop() {
  return request({
    mehtod: 'GET',
    url: `/ppc/genProd/workshop`
  })
}

/**
 * 获取质检状态
 */
export function getProdStatus() {
  return request({
    mehtod: 'GET',
    url: `/ppc/genProd/prodStatus`
  })
}

/** ========================== 质检 ========================== */

/**
 * 获取质检谱系过站信息列表
 * @param {
  *
  * } param
  */
 export function getGenealogyInsp(param) {
   return request({
     mehtod: 'GET',
     url: `/ppc/genInspection`,
     params: param
   })
 }

 /**
  *  导出质检谱系过站信息列表
  * @param {
  *
  * } param
  */
 export function exportGenealogyInsp(param) {
   return request({
     mehtod: 'GET',
     url: `/ppc/genInspection/export`,
     params: param,
     responseType: 'blob'
   })
 }

 /**
  * 获取质检状态
  */
 export function getInspStatus() {
   return request({
     mehtod: 'GET',
     url: `/ppc/genInspection/inspStatus`
   })
 }

