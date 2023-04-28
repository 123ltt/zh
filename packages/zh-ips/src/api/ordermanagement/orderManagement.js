import request from '@/router/axios'

// 分页
export const getList = (current, size, params) => request.$purchase({
  url: '/purchase/order/list',
  method: 'get',
  params: {
    current,
    size,
    ...params
  }
})

// 详情
export const detail = (id) => request.$purchase({
  url: '/purchase/order/detail',
  method: 'get',
  params: {
    id
  }
})
/**
 * table详情接口
 * @param {*} id
 */
export const addDetail = (id) => request.$purchase({
  url: '/plan/detail',
  method: 'get',
  params: {
    id
  }
})
/**
 * 调整接口
 * @param {*} data
 */
export const Adjustment = (data) => {
  return request.$purchase({
    url: '/purchase/order/adjust',
    method: 'post',
    data: data
  })
}

// 目的仓库接口
export const getWarehouse = () => {
  return request.$purchase({
    url: '/warehouse/list',
    method: 'get'
  })
}
