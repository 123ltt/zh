import request from '@/router/axios'

/**
 *
 * @param {Number} current 当前页
 * @param {Number} size 每页最大记录数
 * @param {Object} params 查询条件
 */
export const getList = (current, size, params) => {
  return request.$ims({
    url: '/activeSharing/page',
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
    url: '/activeSharing/info',
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
    url: '/activeSharing/save',
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
    url: '/activeSharing/update',
    method: 'post',
    data: row
  })
}

/**
 *
 * @param {object} row 启用时传入的数据
 */
export const enable = (id) => {
  return request.$ims({
    url: '/activeSharing/enable',
    method: 'post',
    params: {
      id
    }
  })
}

/**
 *
 * @param {object} row 停用时传入的数据
 */
export const unable = (id) => {
  return request.$ims({
    url: '/activeSharing/unable',
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
    url: '/activeSharing/remove',
    method: 'post',
    params: {
      ids
    }
  })
}

/**
 *
 * @param {sting} id 请求汇总分页详情时传入的id
 */
export const getPageSummary = (current, size, params) => {
  return request.$ims({
    url: '/activeDistribution/pageSummary',
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
 * @param {sting} id 请求汇总分页详情时传入的id
 */
export const getDistribution = (current, size, params) => {
  return request.$ims({
    url: '/activeDistribution/pageDetails',
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
 * @param 请求仓库名称
 */
export const getWarehouseDropdown = (code) => {
  return request.$ims({
    url: '/activeSharing/warehouseDropdown',
    method: 'get'
  })
}
