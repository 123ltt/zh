import request from '@/router/axios'
/**
 * vova平台汇总list
 */
export const getVovaTotal = (current, size, params) => {
  return request.$prs({
    url: '/vova-bill-summary/page',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}
/**
 * vova平台明细fine 列表
 */
export const getVovabillFine = (current, size, params) => {
  return request.$prs({
    url: '/vova-bill-fine/page',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}
/**
 * vova平台明细total 列表
 */
export const getVovabillTotal = (current, size, params) => {
  return request.$prs({
    url: '/vova-bill-total/page',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}
