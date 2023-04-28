import request from '@/router/axios'

/**
 *获取预付款核销分页
 */
export const getPrePayPage = (current, size, params) => {
  return request.$lps({
    url: '/logisticPaymentPre/list',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

/**
 *获取预付款核销新增编辑
 */
export const addorEditPrePayPage = (current, size, params) => {
  return request.$lps({
    url: '/logisticPaymentPre/submit',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}
