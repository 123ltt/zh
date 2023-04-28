import request from '@/router/axios'

/**
 * 获取 组合sku 列表
 */
export const getCombSkuList = (params = {}) => {
  return request.$pms({
    url: '/sku/pageCombineSku',
    method: 'get',
    params: Object.assign({ current: 1, size: 20 }, params)
  })
}

/**
 * 新增或修改 组合sku
 */
export const saveCombSku = (params = {}) => {
  return request.$pms({
    url: '/sku/saveCombineSku',
    method: 'post',
    data: params
  })
}

/**
 * 删除 组合sku
 */
export const delCombSku = id => {
  if (!id) return Promise.reject(new Error('id不能为空'))
  return request.$pms({
    url: '/sku/deleteCombineSku',
    method: 'post',
    params: { id }
  })
}
