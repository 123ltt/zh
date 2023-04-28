import request from '@/router/axios'

/**
 *
 * @param {Number} current 当前页
 * @param {Number} size 每页最大记录数
 * @param {Object} params 查询条件
 */
export const getList = (current, size, params) => {
  return request.$ims({
    url: '/seasonPeriod/list',
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
    url: '/seasonPeriod/save',
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
    url: '/seasonPeriod/editDetail',
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
    url: '/seasonPeriod/update',
    method: 'post',
    data: row
  })
}

/**
 *
 * @param {object} row 启用时传入的数据
 */
export const start = (id) => {
  return request.$ims({
    url: '/seasonPeriod/start',
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
export const remove = (ids) => {
  return request.$ims({
    url: '/seasonPeriod/remove',
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
    url: '/seasonPeriod/detail',
    method: 'get',
    params: {
      id
    }
  })
}

/**
 * 请求启用季节属性
 */
export const getSeasonPeriodList = () => {
  return request.$ims({
    url: '/seasonPeriod/seasonPeriodList',
    method: 'get'
  })
}
