import request from '@/router/axios'

/**
 *
 * @param {Number} current 当前页
 * @param {Number} size 每页最大记录数
 * @param {Object} params 查询条件
 */
export const getList = (current, size, params) => {
  return request.$ims({
    url: '/virtualwarehouse/list',
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
    url: '/virtualwarehouse/save',
    method: 'post',
    data: row
  })
}

/**
 *
 * @param {object} row 编辑时出入的对象数据
 */
export const update = (row) => {
  return request.$ims({
    url: '/virtualwarehouse/update',
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
    url: '/virtualwarehouse/start',
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
    url: '/virtualwarehouse/stop',
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
    url: '/virtualwarehouse/remove',
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
    url: '/virtualwarehouse/detail',
    method: 'get',
    params: {
      id
    }
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
 * 请求虚拟仓库
 */
export const getVirtualWarehouse = () => {
  return request.$ims({
    url: '/virtualwarehouse/listAllVirtualWarehouse',
    method: 'get'
  })
}
