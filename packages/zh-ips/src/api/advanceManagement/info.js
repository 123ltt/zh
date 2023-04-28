import request from '@/router/axios'
/**
 * 分页接口
 * @param {*} current
 * @param {*} size
 * @param {*} params
 */
export const getList = (current, size, params) => request.$purchase({
  url: '/orderPrepay/page/prepayInfo',
  method: 'get',
  params: {
    current,
    size,
    ...params
  }
})
/**
 * 详情接口
 * @param {*} id
 */
export const detail = (id) => request.$purchase({
  url: '/orderPrepay/prepayInfo/detail/' + `${id}`,
  method: 'get'
})
