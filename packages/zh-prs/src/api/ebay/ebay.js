import request from '@/router/axios'

/**
 * eBay 光子易放款账单接口
 */
export const getEbayPhotonPayBill = (current, size, params) => {
  return request.$prs({
    url: '/ebay-photon-original/page',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}

/**
 * eBay 光子易放款账单汇总接口
 */
export const getEbayPhotonPayTotal = (current, size, params) => {
  return request.$prs({
    url: '/ebay-photon-total/page',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}

/**
 * eBay paypal放款账单明细接口
 */
export const getEbayOriginalBill = (current, size, params) => {
  return request.$prs({
    url: '/ebay-paypal-original/page',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}
/**
 * eBay paypal放款账单汇总接口
 */
export const getEbayBillTotal = (current, size, params) => {
  return request.$prs({
    url: '/ebay-paypal-total/page',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}
