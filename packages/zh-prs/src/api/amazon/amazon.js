import request from '@/router/axios'

/**
 * 亚马逊账单汇总表 接口
 * @param {*} code
 */
export const getAmazonList = (current, size, params) => {
  return request.$prs({
    url: '/amazonBillTotal/list',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}

/**
 * 亚马逊账单明细列表 接口
 * @param {*} code
 */
export const getAmazonBillOriginList = (current, size, params) => {
  return request.$prs({
    url: '/amazonBillOrigin/list',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}
