import request from '@/router/axios'
/**
 * 速卖通明细账单list
 */
export const getSmtBillDetail = (current, size, params) => {
  return request.$prs({
    url: '/smtBillDetail/page',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}
/**
 * 速卖通账单汇总list
 */
export const getSmtBillSummary = (current, size, params) => {
  return request.$prs({
    url: '/smtBillSummary/page',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}
