import request from '@/router/axios'

/**
 * cd汇总表接口
 * @param {*} code
 */
export const getCdPage = (current, size, params) => {
  return request.$prs({
    url: '/cdicountBill/list',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}
