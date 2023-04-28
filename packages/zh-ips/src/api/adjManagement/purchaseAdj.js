import request from '@/router/axios'

// 分页
export const getList = (current, size, params) => request.$purchase({
  url: '/demandadjust/page',
  method: 'get',
  params: {
    current,
    size,
    ...params
  }
})

// 详情
export const detail = (id) => request.$purchase({
  url: '/demandadjust/detail',
  method: 'get',
  params: {
    id
  }
})
