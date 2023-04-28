import request from '@/router/axios'

/**
 * 运费试算分页
 */
export const getFreightTryCalculation = (current, size, params) => {
  return request.$ltms_optimize({
    url: '/freightTryCalculation/list',
    method: 'post',
    params: {
      current,
      size
    },
    data: {
      ...params
    }
  })
}
