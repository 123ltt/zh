import request from '@/router/axios'
/**
 * 虾皮非sip拨款流水
 */
export const getShopeeAllocateFunds = (current, size, params) => {
  return request.$prs({
    url: '/shopeeAllocateFunds/page',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}

/**
 * sip账单汇总
 */
export const getShopeeLoanSummary = (current, size, params) => {
  return request.$prs({
    url: '/shopeeLoanSummary/page',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}
/**
 * sip账单放款明细
 */
export const getShopeeLoanAdjustment = (current, size, params) => {
  return request.$prs({
    url: '/shopeeLoanAdjustment/page',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}

/**
 * 非sip拨款调整
 */
export const getShopeeAllocateAdjustment = (current, size, params) => {
  return request.$prs({
    url: '/shopeeAllocateAdjustment/page',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}

/**
 * 虾皮非SIP收入明细接口
 */
export const getShopeeAllocateOrderIncome = (current, size, params) => {
  return request.$prs({
    url: '/shopeeAllocateOrderIncome/page',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}
