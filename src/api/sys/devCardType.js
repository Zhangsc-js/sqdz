import request from '@/utils/request'

/**
 * 获取模块和卡片之间的关系
 */
export function getEquipCardType(equipCardType) {
  return request({
    method: 'GET',
    url: `/sys/dev/card/type`,
    params: equipCardType
  })
}

/**
 * 新增模块和卡片之间的关系
 * @param { EquipCardType } equipCardType
 */
export function saveEquipCardType(equipCardType) {
  return request({
    method: 'POST',
    url: `/sys/dev/card/type`,
    data: equipCardType
  })
}

/**
 * 删除模块和卡片之间的关系
 * @param { cardNo, moduleNo } cond
 */
export function deleteEquipCardType(cond) {
  return request({
    method: 'DELETE',
    url: `/sys/dev/card/type`,
    data: cond
  })
}

/**
 * 从数据字典中获取模块信息和设备卡片信息
 */
export function getInitData() {
  return request({
    method: 'GET',
    url: `/sys/dev/card/type/dic`
  })
}
