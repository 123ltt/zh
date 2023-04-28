import request from '@/router/axios'

/**
 *
 * @param {Number} current 当前页
 * @param {Number} size 每页最大记录数
 * @param {Object} params 查询条件
 */
export const getList = (current, size, params) => {
  return request.$ims({
    url: '/warehouse/list',
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
    url: '/warehouse/save',
    method: 'post',
    data: row
  })
}

/**
 *
 * @param {string} id 请求编辑数据传入的ID
 */
export const updateDetail = (id) => {
  return request.$ims({
    url: '/warehouse/updateDetail',
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
    url: '/warehouse/update',
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
    url: '/warehouse/start',
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
    url: '/warehouse/stop',
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
    url: '/warehouse/remove',
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
    url: '/warehouse/detail',
    method: 'get',
    params: {
      id
    }
  })
}

/**
 * 请求所有的仓库类型
 */
export const getAllWarehouse = () => {
  return request.$ims({
    url: '/warehouse/getAllWarehouse',
    method: 'get'
  })
}

/**
 * 请求所有的国家
 */
export const getCountry = () => {
  return request.$ims({
    url: '/country/list',
    method: 'get'
  })
}

/**
 * 请求所有的国家
 */
export const getUseList = () => {
  return request.$ims({
    url: '/warehouse/listWarehouseUses',
    method: 'get'
  })
}
