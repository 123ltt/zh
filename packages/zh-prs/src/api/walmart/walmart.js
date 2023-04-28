
import request from '@/router/axios'
/**
 * walmart 加拿大站点 详情
 * @param {*} code
 */
export const getWalmartDetailCa = (current, size, params) => {
  return request.$prs({
    url: '/walmart-bill-originalca/page',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}
/**
 * walmart 美国站点 详情
 * @param {*} code
 */
export const getWalmartDetaiUs = (current, size, params) => {
  return request.$prs({
    url: '/walmart-bill-originalus/page',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}
/**
 * walmart汇总
 * @param {*} code
 */
export const getWalmartTotal = (current, size, params) => {
  return request.$prs({
    url: '/walmart-bill-total/page',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}
