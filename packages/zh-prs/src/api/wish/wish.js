import request from '@/router/axios'
/**
 * Wish账单原始表-接口汇总-分页
 * @param {*} code
 */
export const getWishBill = (current, size, params) => {
  return request.$prs({
    url: '/wishBill/totalPage',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}

/**
 * Wish账单原始表-接口订单-分页
 * @param {*} code
 * TBP
 */
export const getWishBillOrderPage = (current, size, params) => {
  return request.$prs({
    url: '/wishBill/orderPage',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}

/**
 * Wish账单原始表-接口 其他-分页
 * @param {*} code
 */
export const getWishBillOthersPage = (current, size, params) => {
  return request.$prs({
    url: '/wishBill/othersPage',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}

/**
 * Wish账单原始表-接口 退款-分页
 * @param {*} code
 * TBR
 */
export const getWishBillRefundedPage = (current, size, params) => {
  return request.$prs({
    url: '/wishBill/refundedPage',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}

/**
 * Wish账单原始表-接口 扣除数额-分页
 * @param {*} code
 * WP
 */
export const getWishBillWithheldPage = (current, size, params) => {
  return request.$prs({
    url: '/wishBill/withheldPage',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}

/**
 * Wish账单原始表-接口 释放扣除数额-分页
 * @param {*} code
 * WTR
 */
export const getWishBillWithheldReleasedPage = (current, size, params) => {
  return request.$prs({
    url: '/wishBill/withheldReleasedPage',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}
