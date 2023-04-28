import request from '@/router/axios'
/**
 * 分页接口
 * @param {*} current
 * @param {*} size
 * @param {*} params
 */
export const getList = (current, size, params) => request.$purchase({
  url: '/orderPrepayVerifyHis/page',
  method: 'get',
  params: {
    current,
    size,
    ...params
  }
})
