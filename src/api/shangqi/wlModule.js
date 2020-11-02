



import request from '@/utils/request';

//月度交货完成率
export function list_warehouse_use_info(data) {
    return request({
        method: 'POST',
        url: `/logistics/warehouse/list_warehouse_use_info`,
       data:{
            ...data
        }
    })
}