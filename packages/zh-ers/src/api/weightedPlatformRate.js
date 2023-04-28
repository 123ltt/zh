import request from '@/router/axios'

export const getList = (current, size, params) => {
  return request.$ers({
    url: '/weightAvgRate/page',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}
