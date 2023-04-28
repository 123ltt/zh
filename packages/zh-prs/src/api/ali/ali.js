import request from '@/router/axios'

/**
 *ali  放款账单接口
 */
export const getAlibabaBill = (current, size, params) => {
  return request.$prs({
    url: '/alibaba/bill/page',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}

/**
 * 获取所有 ali店铺
 */
export const getStoreCodeList = (platformCode) => {
  return request.$prs({
    url: '/common/getStoreCodeList',
    method: 'get',
    params: {
      platformCode
    }
  })
}
