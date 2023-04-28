import request from '@/router/axios'
/**
 *获取发货方式
 */
export const getShipmentType = (data) => {
  return request.$lps({
    url: '/logistic-bill/shipment-type',
    method: 'get'
  })
}
/**
 *获取物流商
 */
export const getLogisticProviders = (data) => {
  return request.$lps({
    url: '/common/getAllLogisticProviders',
    method: 'get'
  })
}
/**
 *结算单预付款下拉框接口
 */
export const getVerifyPayment = (params) => {
  return request.$lps({
    url: '/common/getVerifyPaymentPreByLpAbbreviation',
    method: 'get',
    params: {
      ...params
    }
  })
}

/**
 *查询物流商收款信息
 */
export const getLpReceipts = (params) => {
  return request.$lps({
    url: '/common/getLpReceipts',
    method: 'get',
    params: {
      ...params
    }
  })
}
