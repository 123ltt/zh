import request from '@/router/axios'
/**
 * lazada详情
 * @param {*} code
 */
export const getNewggTotalList = (current, size, params) => {
  return request.$prs({
    url: '/neweggBillTotal/list',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}
export const getNewggDetailList = (current, size, params) => {
  return request.$prs({
    url: '/neweggBillOrigin/list',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}
