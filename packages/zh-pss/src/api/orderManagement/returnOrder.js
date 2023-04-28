import request from '@/router/axios'

export const getList = (current, size, params) => {
  return request.$pss({
    url: '/supplier/return/list',
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
    url: '/supplier/return/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const save = (row) => {
  return request.$pss({
    url: '/supplier/return/deliveryConfirmation',
    method: 'post',
    data: row
  })
}

export const getDictBiz = (code) => {
  return request.$pss({
    url: '/dict-biz/dictionary?code=' + code
  })
}
