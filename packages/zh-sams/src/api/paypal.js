import request from '@/router/axios'

/**
 * Paypal账号列表
 */
export const paypalList = (data) => {
  return request.$sams({
    url: '/store/ebay-paypal/page',
    method: 'POST',
    data
  })
}
