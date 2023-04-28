import request from '@/router/axios'
/**
 * 分页
 * @param {*} current
 * @param {*} size
 * @param {*} params
 */
export const getList = (current, size, params) => request.$purchase({
  url: '/purchase/arrival/list',
  method: 'get',
  params: {
    current,
    size,
    ...params
  }
})
/**
 * 详情
 * @param {*} id
 */
export const detail = (id) => request.$purchase({
  url: '/purchase/arrival/detail',
  method: 'get',
  params: {
    id
  }
})

// 角色接口
export const getUserList = () => {
  return request.$ams({
    url: '/user/conciseInfo/page?current=1&size=-1',
    method: 'get'
  })
}

// 物流商接口
export const logisticsProvider = () => {
  return request.$purchase({
    url: '/tms/logistics/provider/listAll',
    method: 'get'
  })
}
