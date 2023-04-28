import request from '@/router/axios'

/**
 * lazada退款列表
 * @param {object} data
 */
export const getListPage = data => {
  return request.$oms({
    url: '/lzPlatOrderMain/fetchRefundList',
    method: 'POST',
    data
  })
}
