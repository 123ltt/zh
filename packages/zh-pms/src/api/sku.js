import request from '@/plugins/request/index'

export const getList = (current, size, params) => {
  return request.$pms({
    url: '/sku/page',
    method: 'POST',
    data: {
      query: { current, size },
      data: params
    }
  })
}

/**
 * @typedef {{id?:string;productCode?:string}} GetDetailParams
 * @param {GetDetailParams} data
 */
function _getDetail(data) {
  return request.$pms({
    url: '/sku/getSkuDetail',
    method: 'get',
    params: data
  })
}

// 获取SPU、SKU详情
export const getDetail = (id) => {
  return _getDetail({ id })
}

/**
 * 可以传 {id} 或 {productCode}
 * @param {GetDetailParams} data
 */
export const getDetailByIdOrCode = data => {
  return _getDetail(data)
}

export const remove = (ids) => {
  return request.$pms({
    url: '/sku/remove',
    method: 'post',
    params: {
      ids
    }
  })
}

export const add = (row) => {
  return request.$pms({
    url: '/sku/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request.$pms({
    url: '/sku/submit',
    method: 'post',
    data: row
  })
}

export const getLogisticsDetail = (id) => {
  return request.$pms({
    url: '/skulogistics/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const getWarehouseDetail = (id) => {
  return request.$pms({
    url: '/skuwarehouse/detail',
    method: 'get',
    params: {
      id
    }
  })
}

/**
 * 根据关联id查询属性和属性值
 */
export const getAttrAndValueByRelationId = (relationId) => {
  return request.$pms({
    url: '/attrRelation/getAttrByRelationId',
    method: 'get',
    params: { relationId }
  }).then(res => {
    res.data.forEach(item => {
      const arr = []
      const defaultArr = []
      item.valueItemList.forEach(el => {
        arr.push(...el.cutName.split(','))
        el.defaultValue && defaultArr.push(...el.defaultValue.split(','))
      })
      item.values = arr
      item.defaultValues = defaultArr
    })
    return res
  })
}

/**
 * 保存生成的sku
 */
export const saveGenerateSku = data => {
  return request.$pms({
    url: '/sku/generateSku',
    method: 'post',
    data
  })
}

/**
 * 一键生成sku
 * @param {string} productSpu spu编码
 */
export const autoGenerateSku = productSpu => {
  return request.$pms({
    url: '/sku/generateSingleItemSku',
    method: 'post',
    data: { productSpu }
  })
}

/**
 * 复制为新的SKU
 * @param {Strin} productSku SKU编码
 */
export const duplicateSku = productSku => {
  return request.$pms({
    url: '/sku/cpSku',
    method: 'post',
    data: { productSku }
  })
}

/**
 * SPU/SKU列表 查询接口
 * @param {object} conditions 查询条件
 * @param {number} conditions.type 产品类型1spu, 2sku
 * @param {number} [conditions.status] SKU/SPU状态:0-审核中,1-审核失败,2-有效，3-无效,后续可能还会有下架等状态 。
 * @param {string[]} [conditions.lstStatus] SKU/SPU状态。支持多个状态查询，与 status 一致
 * @param {string[]} [conditions.categoryIds] 类目id
 * @param {string[]} [conditions.productSpuList] SPU编码
 * @param {string[]} [conditions.productSkuList] SKU编码
 * @param {string[]} [conditions.nwSpuList] 牛蛙SPU编码
 * @param {string[]} [conditions.nwSkuList] 牛蛙SKU编码
 * @param {string} [conditions.productName] SKU或SPU名称
 * @param {object} page 分页
 * @param {number} page.current 当前页码
 * @param {number} page.size 每页数量
 */
export function getSXUList(conditions = {}, page = {}, componentInstance) {
  return request.$pms({
    url: '/sku/skuQuery',
    method: 'POST',
    data: {
      data: conditions,
      query: page
    }
  }, componentInstance)
}

/**
 * 根据SPU ID获取可用的配置属性
 * @param {string} spuProductId SPU ID
 */
export function getAvailableAttrs(spuProductId, componentInstance) {
  return request.$pms({
    url: '/sku/getCanGenerateSkuFields',
    params: {
      spuProductId
    }
  }, componentInstance).then(res => {
    return (res.data || []).map(item => {
      item.list = JSON.parse(item.cutName)
      return item
    })
  })
}

/**
 * 保存 复制SPU
 * @param {object} data
 * @param {string} data.productSpu spu的编码
 * @param {string[]} data.lstProductSku sku编码
 */
export function saveCopySpu(data) {
  return request.$pms({
    url: '/sku/cpSpu',
    method: 'post',
    data
  })
}

/**
 * 获取可复制的SPU以及包含的SKU列表
 * @param {object} data
 * @param {string} data.productSpu SPU编码
 */
export function getCanCopySpuAndSku(data) {
  return request.$pms({
    url: '/sku/queryCanCpSkuBySpu',
    method: 'post',
    data
  })
}

/**
 * 保存 新增属性值（生成sku列表用到）
 * @param {object} data
 * @param {string} data.id 取值id(fieldId)
 * @param {string} data.cutName json对象
 */
export function saveInsertProp(data) {
  return request.$pms({
    url: '/item/returnCutValueById',
    method: 'post',
    data
  })
}

/**
 * 同步牛蛙数据
 * @param {number} type 1为牛蛙spu 2为牛蛙sku
 * @param {string[]} codeList 牛蛙spu编码或者牛蛙sku编码
 */
export function syncNwData(type, codeList) {
  return request.$pms({
    url: '/sku/syncNwSkuOrNwSpu',
    method: 'post',
    data: { type, codeList }
  })
}

/**
 * 开启、关闭 同步NW编码(spu, sku列表)
 * @param {object} data
 * @param {number} data.type 产品类型 1spu, 2sku
 * @param {string} [data.productSpu] SPU编码
 * @param {string} [data.productSku] SKU编码
 * @param {number} [data.isSyncNw] 是否同步 0关闭 1开启
 */
export function updateNWSyncStatus(data) {
  return request.$pms({
    url: '/sku/isSyncNw',
    method: 'post',
    data
  })
}

/**
 * 获取租户的组织架构树
 */
export function getTenantOrganizationTree() {
  return request.$pms({
    method: 'post',
    url: '/tenant/getTenantOrganizationTree'
  })
}

/**
 * 保存 SKU归属配置
 * @param {{productSpus: string[], orgIds: string[]}} data
 */
export function saveSkuBelonging(data) {
  return request.$pms({
    method: 'post',
    url: '/skuAscriptionConfig/save',
    data
  })
}

/**
 * 获取专员列表
 * @param {0|1} type 专员类型，0精品，1精铺
 * @returns {ZHKJ.Response<{id:string;value:string}[]>}
 */
export function getDeverList(type) {
  return request.$pms({
    url: ['/common/developLeadUser/options', '/common/dockingUser/options'][type],
    useCache: true
  })
}
export function spuSync(params) {
  return request.$pms({
    url: '/sku/bullfrogSpuSynchronization',
    params
  })
}
