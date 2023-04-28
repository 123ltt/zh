import request from '@/router/axios'

// 信息接口
export const getDetail = () => {
  return request.$purchase({
    url: '/homePage/detail',
    method: 'get'
  })
}
