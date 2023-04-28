import request from '@/router/axios'

/**
 *
 * @param {Number} current 当前页
 * @param {Number} size 每页最大记录数
 * @param {Object} params 查询条件
 */
export const getList = (current, size, params) => {
  return request.$ims({
    url: '/unsalableRule/list',
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
export const getEditDetail = (id) => {
  return request.$ims({
    url: '/unsalableRule/editDetail',
    method: 'get',
    params: {
      id
    }
  })
}

/**
 *
 * @param {sting} id 请求详情时传入的id
 */
export const getDetail = (id) => {
  return request.$ims({
    url: '/unsalableRule/detail',
    method: 'get',
    params: {
      id
    }
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
 * @param {object} row 新增的数据
 */
export const save = (row) => {
  return request.$ims({
    url: '/unsalableRule/save',
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
    url: '/unsalableRule/update',
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
    url: '/unsalableRule/start',
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
    url: '/unsalableRule/remove',
    method: 'post',
    params: {
      ids
    }
  })
}

/**
 * 请求启用季节属性
 */
export const getEnableSeasonPeriodList = () => {
  return request.$ims({
    url: '/seasonPeriod/enableSeasonPeriodList',
    method: 'get'
  })
}
