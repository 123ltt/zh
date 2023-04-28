import request from '@/router/axios'

/**
 * sku前后缀分仓查询
 * @param {object} params
 * @param {number} params.skuAffixType - sku前后缀类型
 * @param {string} params.affixContent - 前后缀内容
 * @param {string} params.status - 状态
 * @param {string} params.deliveryWarehouse - 发货仓库
 * @param {string} params.deliveryChannel - 发货渠道
 */
export const getPageList = params => {
  return request.$oms({
    url: '/skuResolvingRule/pageSkuAffixResolvingRule',
    params
  })
}

/**
 * 更新sku前后缀分仓
 * @param {object} data
 * @param {number} [data.id] 可选，新增时不传
 * @param {string} data.status
 * @param {string} data.skuAffixType
 * @param {string} data.affixContent
 * @param {string} data.deliveryWarehouse
 * @param {string} data.deliveryChannel
 * @param {string} data.description
 */
export const updateRules = (data, type) => {
  return request.$oms({
    url: `/skuResolvingRule/${type === 'save' ? 'save' : 'update'}`,
    method: 'POST',
    data
  })
}

/**
 *修改状态接口
 * @param {string} id
 * @param {number} status 状态码， 1是，0否
 */
export const updateStatusById = (id, status) => {
  return request.$oms({
    url: '/skuResolvingRule/updateStatusById',
    method: 'POST',
    data: { id, status }
  })
}

// 仓库国家、仓库类型、发货仓库列表lists
export const getWarehouseList = () => {
  return request.$ims({
    url: '/warehouse/getWarehouseMapByCondition'
  })
}

// 发货仓库列表
export const getWarehouse = () => {
  return request.$oms({
    url: '/warehouse/getWarehouseList',
    useCache: true,
    method: 'POST'
  })
}

// sku前后缀详情
export const getDetails = params => {
  return request.$oms({
    url: '/skuResolvingRule/detail',
    params
  })
}
