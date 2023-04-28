import request from '@/router/axios'
/**
 * 分页
 * @param {*} current
 * @param {*} size
 * @param {*} params
 */
export const getList = (current, size, params) => request.$purchase({
  url: '/orderPrepay/page/prepayApply',
  method: 'get',
  params: {
    current,
    size,
    ...params
  }
})
/**
 * 详情
 * @param {*} id
 */
export const Detail = id => request.$purchase({
  url: '/orderPrepay/prepayApply/detail/' + `${id}`,
  method: 'get',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
  params: {

  }
})
/**
 * 采购审核模拟接口
 * @param {*} data
 */
export const MoniCheck = (data) => request.$purchase({
  url: '/orderPrepay/auditAdvanceOrderStatus',
  method: 'post',
  data: {
    ...data
  }
})
/**
 * 采购待支付模拟接口
 * @param {*} data
 */
export const MoniPay = (data) => request.$purchase({
  url: '/orderPrepay/payAdvanceOrderStatus',
  method: 'post',
  data: {
    ...data
  }
})

/**
 *
 * @param {Object} row 请款数据
 * @returns
 */
export const addFps = (row) => {
  return request.$purchase({
    url: '/fps/payment-apply/add',
    method: 'post',
    data: row
  })
}
