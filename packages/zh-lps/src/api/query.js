import request from '@/router/axios'

/**
 *获取物流运费汇总
 */
export const getTotalPage = (current, size, params) => {
  return request.$lps({
    url: '/blade-logistic_shipment/logisticshipment/page-coll',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

/**
 *获取wish油余额
 */

export const getWishYouPage = (current, size, params) => {
  return request.$lps({
    url: '/logistic-shipmentcoll/page',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}
