import request from '@/router/axios'

// Listing日志列表
export function wishLogList(params) {
  return request.$lmsWish({
    url: '/wishListingLog/list',
    method: 'get',
    params: {
      ...params
    }
  })
}
