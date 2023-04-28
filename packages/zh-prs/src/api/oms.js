import request from '@/router/axios'/**
*
* oms订单分页
*/
export const getOmsList = (current, size, params) => {
  return request.$prs({
    url: '/omsOrder/list',
    method: 'get',
    params: {
      ...params, current, size
    }
  })
}
/**
*
* oms详情
*/
export const getOmsDetail = (params) => {
  return request.$prs({
    url: '/omsOrder/detail',
    method: 'get',
    params
  })
}
