
// 导入axios
import request from '@/router/axios'
// 表格数据
export const getList = (current, size, params) => {
  return request.$fps({
    url: '/order/list',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}

// 去授权
export const accountAuth = (params) => {
  return request.$fps({
    url: '/account/alibaba/auth',
    method: 'get',
    params
  })
}

// 删除
export const deleteI = (id) => {
  return request.$fps({
    url: `/account/delete/${id}`,
    method: 'get'
  })
}

// 同步订单
export const syncOrder = (params) => {
  return request.$fps({
    url: '/account/sync-order',
    method: 'get',
    params
  })
}
