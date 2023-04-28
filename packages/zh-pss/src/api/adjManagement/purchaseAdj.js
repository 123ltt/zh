import request from '@/router/axios'

export const getList = (current, size, params) => {
  return request.$pss({
    url: '/supplier/adjust/list',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}
// 详情
export const getDetail = (id) => {
  return request.$pss({
    url: '/supplier/adjust/detail',
    method: 'get',
    params: {
      id
    }
  })
}

// 处理
export const handle = (row) => {
  return request.$pss({
    url: '/supplier/adjust/handle',
    method: 'post',
    data: row
  })
}
