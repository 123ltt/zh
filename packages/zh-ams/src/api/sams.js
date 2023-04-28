import request from '@/router/axios'

// 平台下拉列表
export const getPlatform = () => {
  return request.$sams({
    url: '/store/platform/options',
    method: 'post'
  })
}
