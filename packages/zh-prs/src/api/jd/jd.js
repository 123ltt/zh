import request from '@/router/axios'

/**
 * jd汇总原始表接口
 * @param {*} code
 */
export const getJdPage = (current, size, params) => {
  return request.$prs({
    url: '/jd-bill-total/page',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}
/**
 * jd销货接口
 * @param {*} code
 */
export const getJdSales = (current, size, params) => {
  return request.$prs({
    url: '/jd-bill-account-sales/page',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}
/**
 * jd差异调整分页接口
 * @param {*} code
 */
export const getJdDifferences = (current, size, params) => {
  return request.$prs({
    url: '/jd-bill-djust/page',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}
/**
 * jd非销售分页接口
 * @param {*} code
 */
export const getJdNoSales = (current, size, params) => {
  return request.$prs({
    url: '/jd-bill-nosales/page',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}
/**
 * jd拒收分页接口
 * @param {*} code
 */
export const getJdRejection = (current, size, params) => {
  return request.$prs({
    url: '/jd-bill-rejection/page',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}
/**
 * jd妥投结算表分页接口
 * @param {*} code
 */
export const getJdVote = (current, size, params) => {
  return request.$prs({
    url: '/jd-bill-delievered/page',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}
/**
 * jd退货结算分页接口
 * @param {*} code
 */
export const getJdReturn = (current, size, params) => {
  return request.$prs({
    url: '/jd-bill-return/page',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}
