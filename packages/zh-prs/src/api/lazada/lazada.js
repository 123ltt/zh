
import request from '@/router/axios'
/**
 * lazada详情
 * @param {*} code
 */
export const getLazadaDetail = (current, size, params) => {
  return request.$prs({
    url: '/lazadabilldetail/page',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}
/**
 * lazada汇总
 * @param {*} code
 */
export const getLazadaTotal = (current, size, params) => {
  return request.$prs({
    url: '/lazadaBillTotal/page',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}
/**
 * lazada汇总
 * @param {*} code
 */
export const getPaidStatus = () => {
  return request.$prs({
    url: '/lazadaBillTotal/paidStatus',
    method: 'get'

  })
}
