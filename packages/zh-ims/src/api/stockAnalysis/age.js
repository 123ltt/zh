import request from '@/router/axios'

/**
 *
 * @param {Number} current 当前页
 * @param {Number} size 每页最大记录数
 * @param {Object} params 查询条件
 */
export const getList = (current, size, params) => {
  return request.$ims({
    url: '/stockage/page',
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
 * @param {Number} current 当前页数
 * @param {Number} size 每页最大记录数
 * @param {Object} params 查询条件（包含固定的产品编码Sku）
 * @returns 列表数据
 */
export const getDetail = (id) => {
  return request.$ims({
    url: '/stockage/detail',
    method: 'get',
    params: {
      id
    }
  })
}

/**
 *
 * @param 请求组织架构
 */
export const getOrg = () => {
  return request.$ims({
    url: '/tenant/getTenantOrganizationTree',
    method: 'get'
  })
}
