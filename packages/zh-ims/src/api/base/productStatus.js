import request from '@/router/axios'

/**
 *
 * @param {Number} current 当前页
 * @param {Number} size 每页最大记录数
 * @param {Object} params 查询条件
 */
export const getList = (current, size, params) => {
  return request.$ims({
    url: '/productStatus/list',
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
 * @param {object} row 编辑的数据
 */
export const adjustStatus = (row) => {
  return request.$ims({
    url: '/productStatus/adjustStatus',
    method: 'post',
    data: row
  })
}

/**
 *
 * @param {object} row 审核时出入的对象数据
 */
export const auditStatus = (row) => {
  return request.$ims({
    url: '/productStatus/auditStatus',
    method: 'post',
    data: row
  })
}

/**
 *
 * @param {sting} id 请求详情时传入的id
 */
export const getDetail = (id) => {
  return request.$ims({
    url: '/productStatus/detail',
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
