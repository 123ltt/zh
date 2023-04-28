import request from '@/router/axios'

export const paging = (current, size, params) => {
  return request.$pss({
    url: '/supplier/supply/list',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

export const detailApi = (id) => {
  return request.$pss({
    url: '/supplier/supply/detail',
    method: 'get',
    params: {
      id
    }
  })
}
