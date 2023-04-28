import request from '@/router/axios'

// 搜索可刊登的产品
export function getCanPublishSkuByProduct(current, size, params) {
  return request.$pms({
    url: '/lms/sku/getCanPublishSku',
    method: 'post',
    data: {
      query: { current, size },
      data: { ...params, siteCode: params.siteCode || 'US' }
    }
  })
}

// 根据类目id查询子类目
export const getChildren = id => {
  if (id === 'STATICID') return
  return request.$pms({
    url: '/category/getChildrenById',
    method: 'GET',
    params: {
      id
    }
  })
}

/**
 * 刊登-获取SKU产品属性
*/
export function getSkuAttr(data) {
  return request.$pms({
    url: '/lms/sku/getSkuAttr',
    method: 'post',
    data
  })
}
// 刊登-获取SKU信息
export function getSkuDetailByProduct(data) {
  return request.$pms({
    url: '/lms/sku/getSkuDetail',
    method: 'post',
    data: { ...data, siteCode: data.siteCode || 'US' }
  })
}

// 刊登-获取SPU信息
export function getSpuDetailByProduct(data) {
  return request.$pms({
    url: '/lms/sku/getSpuDetail',
    method: 'post',
    data: { ...data, siteCode: data.siteCode || 'US' }
  })
}
// http://showdoc.zehui.local/web/#/39?page_id=1884
// 根据产品编码获取产品类型
export function getTypeByProductCodes(params) {
  return request.$pms({
    url: '/api/sku/getTypeByProductCodes',
    method: 'post',
    data: params
  })
}
