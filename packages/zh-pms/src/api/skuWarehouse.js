import request from '@/router/axios'

export const getDetail = (id) => {
  return request.$pms({
    url: '/skuwarehouse/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const update = (row) => {
  return request.$pms({
    url: '/skuwarehouse/submit',
    method: 'post',
    data: row
  })
}

export const getStock = spu => {
  return request.$pms({
    url: `/stock/selectStock?spu=${spu}`
  })
}
