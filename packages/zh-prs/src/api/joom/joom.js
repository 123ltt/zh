import request from '@/router/axios'
/**
 * joom物流账单接口
 * @param {*} code
 */
export const getJoomJld = (current, size, params) => {
  return request.$prs({
    url: '/joomLogisticsbBill/page',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}

/**
 * joom原始账单接口
 * @param {*} code
 */
export const getJoomDetailR = (current, size, params) => {
  return request.$prs({
    url: '/joomOriginalBill/page',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}

/**
 * joom广告账单接口
 * @param {*} code
 */
export const getJoomDetailAd = (current, size, params) => {
  return request.$prs({
    url: '/joomAdvertBill/page',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}

/**
 * joom退款账单接口
 * @param {*} code
 */
export const getJoomDetailCm = (current, size, params) => {
  return request.$prs({
    url: '/joomRefundBill/page',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}
/**
 * joom所有店铺
 * @param {*} code
 */
export const getJoomStore = () => {
  return request.$prs({
    url: '/joomOriginalBill/getStoreNameList',
    method: 'get'
  })
}
/**
 * joom所有店铺
 * @param {*} code
 */
export const getJoomBill = (current, size, params) => {
  return request.$prs({
    url: '/joomBill/page',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}
