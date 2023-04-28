import request from '@/router/axios'

/**
 *
 * @param {Number} current 当前页
 * @param {Number} size 每页最大记录数
 * @param {Object} params 查询条件
 */
export const getList = (current, size, params) => {
  return request.$ims({
    url: '/stockForewarn/list',
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
 * @param {object} row 新增的数据
 */
export const save = (row) => {
  return request.$ims({
    url: '/stockForewarn/save',
    method: 'post',
    data: row
  })
}

/**
 *
 * @param {String} productSku 输入产品编码请求到产品信息
 */
export const getProductInfo = (productSku) => {
  return request.$ims({
    url: '/stockForewarn/getProductInfo',
    method: 'get',
    params: {
      productSku
    }
  })
}

/**
 *
 * @param {string} id 请求编辑数据传入的ID
 */
export const updateDetail = (id) => {
  return request.$ims({
    url: '/stockForewarn/getUpdatedetail',
    method: 'get',
    params: {
      id
    }
  })
}

/**
 *
 * @param {object} row 编辑时出入的对象数据
 */
export const update = (row) => {
  return request.$ims({
    url: '/stockForewarn/update',
    method: 'post',
    data: row
  })
}

/**
 *
 * @param {object} row 启用时传入的数据
 */
export const start = (row) => {
  return request.$ims({
    url: '/stockForewarn/start',
    method: 'post',
    data: row
  })
}

/**
 *
 * @param {object} row 停用时传入的数据
 */
export const stop = (row) => {
  return request.$ims({
    url: '/stockForewarn/stop',
    method: 'post',
    data: row
  })
}

/**
 *
 * @param {sting} ids 删除时传入的id
 */
export const remove = (ids) => {
  return request.$ims({
    url: '/stockForewarn/remove',
    method: 'post',
    params: {
      ids
    }
  })
}

/**
 *
 * @param {sting} id 请求详情时传入的id
 */
export const getDetail = (id) => {
  return request.$ims({
    url: '/stockForewarn/detail',
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
