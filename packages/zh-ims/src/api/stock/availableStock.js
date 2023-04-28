import request from '@/router/axios'

/**
 *
 * @param {Number} current 当前页
 * @param {Number} size 每页最大记录数
 * @param {Object} params 查询条件
 */
export const getList = (current, size, params) => {
  return request.$ims({
    url: '/stockAvailableDetail/page',
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
export const getDetail = (params) => {
  return request.$ims({
    url: '/stockAvailableDetail/detail',
    method: 'get',
    params: {
      ...params
    }
  })
}

/**
 *
 * @param {Number} current 当前页
 * @param {Number} size 每页最大记录数
 * @param {Object} params 查询条件
 */
export const getListDetail = (current, size, params) => {
  return request.$ims({
    url: '/stockAvailableOrderDetail/page',
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
 * @param {Number} current 当前页
 * @param {Number} size 每页最大记录数
 * @param {Object} params 查询条件
 */
export const getDetailList = (current, size, params) => {
  return request.$ims({
    url: '/stockcheck/detailList',
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
 * @param 请求组织架构
 */
export const getOrg = () => {
  return request.$ims({
    url: '/tenant/getTenantOrganizationTree',
    method: 'get'
  })
}

/**
 * @param  请求业务类型
 */
export const getType = (label) => {
  return request.$ims({
    url: '/businessType/list',
    method: 'get',
    params: {
      label
    }
  })
}

/**
 *
 * @param 请求操作逻辑
 */
export const getOperationType = () => {
  return request.$ims({
    url: '/stockAvailableOrderDetail/operationTypeEnumList',
    method: 'get'
  })
}
