import request from '@/plugins/request'

/**
 * @typedef records
 * @property {string} id
 * @property {string} imageUrl
 * @property {number} type 类型：spu 1 , sku 2
 * @property {string|null} productCode
 * @property {string} productName 中文名称
 * @property {string|null} nwCode 牛蛙编码
 * @property {number} status 状态
 *
 * @param {{current:number;size:number}} query
 * @param {{categoryIds:(string|number)[];productCodes:string[];nwProductCodes:string[];supplierName:string}} conditions
 * @returns {ZHKJ.Response<{records:records[];total:number;size:number}>}
 */
export function getSxuList(query, conditions, componentInstance) {
  return request.$pms({
    url: '/sku/pageSpuSku',
    method: 'post',
    data: {
      query,
      data: conditions
    }
  }, componentInstance)
}

/**
 * @typedef {object} productInfo
 * @property {string} id
 * @property {number} type
 * @property {string} productCode
 *
 * @param {object} data
 * @param {string} [data.attrName] 属性名称
 * @param {productInfo[]} data.productInfo
 */
export function getAttrs(query, data) {
  return request.$pms({
    url: '/sku/pageOptionalAttr',
    method: 'post',
    data: {
      query, data
    }
  })
}

/**
 * @typedef {object} ID
 * @property {string} attrId 属性id
 * @property {string} fieldId 字段id
 *
 * @typedef {object} Item
 * @property {string} id
 * @property {number} type 1SPU 2SKU
 * @property {string} productCode SPU/SKU编码
 * @property {ID[]} attrIdFieldIds
 *
 * @typedef {{attrValue: string}} AttrValue
 *
 * @typedef {object} ResItem
 * @property {string} id
 * @property {number} type 1SPU 2SKU
 * @property {string} productCode SPU/SKU编码
 * @property {number} packWeight 打包重量
 * @property {string} sizeLongPack 包装尺寸 长
 * @property {string} sizeWidthPack 包装尺寸 宽
 * @property {string} sizeHeightPack 包装尺寸 高
 * @property {(ID & AttrValue)[]} specAttrValueInfos
 *
 * @param {Item[]} data
 * @returns {Promise<ResItem[]>}
 */
export function getSxuAttrs(data) {
  return request.$pms({
    url: '/sku/listAttrValueByProductIds',
    method: 'post',
    data
  }).then(res => res.data)
}

/**
 * 保存修改的属性
 * @param {ResItem[]} data
 */
export function saveSxuAttrs(data) {
  return request.$pms({
    url: '/sku/updateBatchAttrValue',
    method: 'post',
    data
  })
}

export function saveSxuFields(data) {
  return request.$pms({
    url: '/sku/updateBatchBasicInfo',
    method: 'post',
    data
  })
}
