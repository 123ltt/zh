import request from '@/router/axios'

/**
 *
 * @param {Number} current 当前页
 * @param {Number} size 每页最大记录数
 * @param {Object} params 查询条件
 */
export const getList = (current, size, params) => {
  return request.$ims({
    url: '/productProxySale/list',
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
export const getDetail = (current, size, params) => {
  return request.$ims({
    url: '/productProxySale/detail',
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
 * @param {sting} id 请求编辑详情时传入的id
 */
export const getQueryForEdit = (id) => {
  return request.$ims({
    url: '/productProxySale/queryForEdit',
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
 * @param 请求组织架构
 */
export const getProxyWareHouseIds = () => {
  return request.$ims({
    url: '/productProxySale/getProxyWareHouseIds',
    method: 'get'
  })
}

/**
 *
 * @param {String} productSku 输入产品编码请求到产品信息
 */
export const getAvailableCount = (row) => {
  return request.$ims({
    url: '/productProxySale/queryAvailableCount',
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
    url: '/productProxySale/save',
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
    url: '/productProxySale/saveForEdit',
    method: 'post',
    data: row
  })
}

/**
 *
 * @param {object} row 提交时传入的对象数据
 */
export const commit = (row) => {
  return request.$ims({
    url: '/productProxySale/commit',
    method: 'post',
    data: row
  })
}
/**
 *
 * @param {object} row 审核时传入的对象数据
 */
export const verify = (row) => {
  return request.$ims({
    url: '/productProxySale/verify',
    method: 'post',
    data: row
  })
}

/**
 *
 * @param {sting} id 请求汇总分页详情时传入的id
 */
export const getDistribution = (params) => {
  return request.$ims({
    url: '/productProxySale/distributionDetail',
    method: 'get',
    params: {
      ...params
    }
  })
}

/**
 *
 * @param {sting} ids 删除时传入的id
 */
export const remove = (id) => {
  return request.$ims({
    url: '/productProxySale/delete',
    method: 'post',
    params: {
      id
    }
  })
}
