import request from '@/router/axios'

// 分页
export const getList = (current, size, params) => request.$purchase({
  url: '/orderabnormal/list',
  method: 'get',
  params: {
    current,
    size,
    ...params
  }
})

// 详情
export const detail = (id) => request.$purchase({
  url: '/orderabnormal/detail',
  method: 'get',
  params: {
    id
  }
})

// 保存数据
export const update = (data) => request.$purchase({
  url: '/orderabnormal/update',
  method: 'post',
  data: data
})
