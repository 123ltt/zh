import request from '@/router/axios'

/**
 *
 * @param {Number} current 当前页
 * @param {Number} size 每页最大记录数
 * @param {Object} params 查询条件
 */
export const getList = (current, size, params) => {
  return request.$ims({
    url: '/warehouse/outputWarehouseOrder/page',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

/**
 *
 * @param {sting} id 请求详情时传入的id
 */
export const getDetail = (outputWarehouseOrderId) => {
  return request.$ims({
    url: '/warehouse/outputWarehouseOrder/detail',
    method: 'get',
    params: {
      outputWarehouseOrderId
    }
  })
}
