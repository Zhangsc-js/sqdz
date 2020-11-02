
import request from '@/utils/request'

 /**
  * 获取日历
  *
  */
 export function sltCalendar() {
  return request({
      method: 'GET',
      url: `/dev/checkingPlan/sltCalendar`
  })
}
