// 平台类目属性映射
import request from '@/plugins/request'

/**
 * 查询平台映射类目和属性
 * @typedef {object} params1
 * @property {string} platformCode 平台code
 * @property {string} [siteCode] 站点code
 * @property {string} [categoryId] pms 类目ID 数组
 * @property {boolean} [needAttributeValue] 是否需要取值列表。默认`false`
 *
 * @param {params1} params
 * 后端接收的参数格式：`{categoryId?:string[]; platformCode:string; siteCode:string}[]`
 */
export function getPlatformAttrs(params) {
  // 为了和其他接口参数一致，所以直接在此处转换最终需要的格式
  const data = {
    categoryIds: params.categoryId ? [params.categoryId] : null,
    platformCode: params.platformCode,
    siteCode: params.siteCode,
    needAttributeValue: params.needAttributeValue || false
  }

  return request.$pms({
    url: '/categoryPublish/getBindCategoryAttr',
    method: 'POST',
    data
  }).then(res => res.data)
}

/**
 * 保存属性映射（含类目属性 和 属性）
 * @typedef {object} params2
 * @property {{id?:string;attrId:string;publishAttrCode:string}[]} attrBindList
 * @property {string} [categoryId] pms类目id
 * @property {string[]} deleteIdList 删除关联属性的主键id
 * @property {string} platformCode 平台code
 * @property {string} siteCode 站点code
 *
 * @param {params2} data
 */
export function savePlatformAttrsMapping(data) {
  return request.$pms({
    url: '/categoryPublishAttr/addAndUpdate',
    method: 'POST',
    data
  }).then(res => res.data)
}

/**
 * 获取映射关系（含类目属性 和 属性）
 * @param {{categoryId?:string; platformCode:string; siteCode:string}} params
 * 后端接收的参数格式：`{categoryId?:string; scope:{platformCode:string;siteCode:string[]}[]`
 */
export function getPlatformAttrsMapping(params) {
  const data = {
    categoryId: params.categoryId,
    scope: [{
      platformCode: params.platformCode,
      siteCode: params.siteCode ? [params.siteCode] : null
    }]
  }

  return request.$pms({
    url: '/categoryPublishAttr/list',
    method: 'POST',
    data
  }).then(res => res.data)
}

/**
 * @typedef {object} params4
 * @property {string} relationId sku的主键id
 * @property {string} type 属性类型 0类目 1spu 2sku 3组合sku
 * @property {number[]} attTypes 属性类型1基础属性,2物流属性,3仓储库存属性,4销售属性,5侵权属性,6规格属性,7价格属性,8扩展属性,9类目属性 （不填查全部）
 *
 * @param {string} id
 */
export function getPmsAttrsBySku(id) {
  return request.$pms({
    url: '/attrRelation/getAttrByRelationIdOrType',
    method: 'post',
    data: {
      relationId: id,
      type: 2,
      attTypes: [6, 9]
    }
  })
}

/**
 * 根据sku、pms类目id等信息获取 与平台类目属性的关联关系
 * @typedef {object} param3
 * @property {string} [attrId] PMS属性ID
 * @property {string[]} [attrIds] PMS属性ID集合
 * @property {string} [categoryId] PMS类目ID
 * @property {string} [pcCode] 刊登类目CODE
 * @property {string} [platformCode] 平台CODE
 * @property {string[]} [platformCodes] 平台CODE集合
 * @property {string} [siteCode] 站点CODE
 * @property {string[]} [siteCodes] 站点CODE集合
 * @property {string} [productSku] SKU编码
 * @property {string} [productSkus] SKU编码集合
 * @property {string} [productSpu] SPU编码
 * @property {string} [publishAttrCode] 刊登属性CODE
 * @property {string[]} [publishAttrCodes] 刊登属性CODE集合
 * @property {string} [publishAttrValue] 刊登属性值
 *
 * @param {param3} params
 */
export function getPlatformAttrsMappedBySku(params) {
  return request.$pms({
    url: '/publishAttr/list',
    method: 'post',
    data: params
  })
}

/**
 * 根据平台、站点、pms类目id 获取平台类目属性
 * @typedef {object} params5
 * @property {string} [id] 主键id（编辑时需要）
 * @property {string} attrId PMS属性ID
 * @property {string} categoryId PMS类目ID
 * @property {string} pcCode 刊登类目CODE
 * @property {string} platformCode 平台CODE
 * @property {string} siteCode 站点CODE
 * @property {string} productSku SKU编码
 * @property {string} productSpu SPU编码
 * @property {string} publishAttrCode 刊登属性CODE
 * @property {string} publishAttrValue 刊登属性值
 *
 * @param {params5} data
 */
export function savePlatformAttrsBySku(data) {
  return request.$pms({
    url: '/publishAttr/save',
    method: 'post',
    data
  })
}
