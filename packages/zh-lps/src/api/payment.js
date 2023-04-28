import request from '@/router/axios'

/**
 *获取物流付款单分页
 */
export const getPayPage = (current, size, params) => {
  return request.$lps({
    url: '/logistic-payment/page',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}
/**
 *生成付款单号接口
 */
export const getPayNum = (current, size, params) => {
  return request.$lps({
    url: '/logistic-payment/pay-num',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}
/**
 *新增付款单
 */
export const addPayMent = (data) => {
  return request.$lps({
    url: '/logistic-payment/generate-payment',
    method: 'post',
    data: {
      ...data
    }
  })
}
