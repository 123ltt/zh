import request from '@/router/axios'

// Listing日志详情
export function getListingLog(params) {
  return request.$lmsWalmart({
    url: '/walmartlistinglog/list',
    method: 'get',
    params: {
      ...params
    }
  })
}
