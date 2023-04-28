import request from '@/router/axios'

// 表格数据
export const getList = (current, size, params) => {
  return request.$fps({
    url: '/refund/list',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}
