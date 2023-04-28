import request from '@/router/axios'

/**
 *
 * @param {Number} current 当前页
 * @param {Number} size 每页最大记录数
 * @param {Object} params 查询条件
 */
export const getList = (current, size, params) => {
  return request.$ims({
    url: '/productAuthChange/list',
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
export const getDetail = (id) => {
  return request.$ims({
    url: '/productAuthChange/detail',
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

/**
 *
 * @param 请求人
 */
export const getTransferInfo = () => {
  return request.$ims({
    url: '/productAuthChange/getTransferInfo',
    method: 'get'
  })
}

/**
 *
 * @param {String} productSku 输入产品编码请求到产品信息
 */
export const getAvailableCount = (row) => {
  return request.$ims({
    url: '/productAuthChange/getProductInfo',
    method: 'post',
    data: row
  })
}

/**
 *
 * @param {object} row 新增的数据
 */
export const save = (row) => {
  return request.$ims({
    url: '/productAuthChange/save',
    method: 'post',
    data: row
  })
}

/**
 *
 * @param {object} row 编辑时传入的对象数据
 */
export const update = (row) => {
  return request.$ims({
    url: '/productAuthChange/update',
    method: 'post',
    data: row
  })
}

/**
 *
 * @param {object} row 提交时传入的对象数据
 */
export const commit = (id) => {
  return request.$ims({
    url: '/productAuthChange/submit',
    method: 'post',
    params: {
      id
    }
  })
}
/**
 *
 * @param {object} row 审核时传入的对象数据
 */
export const verify = (id) => {
  return request.$ims({
    url: '/productAuthChange/audit',
    method: 'post',
    params: {
      id
    }
  })
}

/**
 *
 * @param {sting} ids 删除时传入的id
 */
export const remove = (id) => {
  return request.$ims({
    url: '/productAuthChange/delete',
    method: 'post',
    params: {
      id
    }
  })
}

/**
 * 得到的用户列表 会根据当前登录用户的权限进行过滤
 */
export function getUserListWithAuth(organizationId, current = 1, size = -1) {
  return request.$ams({
    url: '/user/conciseInfo/page',
    params: {
      organizationId,
      size,
      current
    }
  })
}
