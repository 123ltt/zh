import request from '@/router/axios'

// 公用 - 付款时间类型列表
export const getTimeType = () => request.$oms({
  url: '/orderMain/timeTypeOptions',
  method: 'GET'
})

/**
 * 公用 - 获取国家下拉列表
 * @param {string} keyword 搜索关键词
 * @param {boolean} [useCache=true] 是否使用缓存，可选
 */
export const getCountryList = (keyword, useCache = true) => {
  return request.$oms({
    url: '/baseCountry/list',
    method: 'get',
    useCache,
    params: { keyword }
  })
}

// 公用 - 订单来源下拉选
export const getOrderOrigin = () => request.$oms({
  url: '/orderMain/orderTypeOptions',
  method: 'GET'
})

/**
 * 公用 - 获取订单各状态数量
 * @param {object} data
 */
export const getOrderStatusCount = (data, isAll) => {
  let url = '/orderMain/exceptionStatistics'
  if (isAll) {
    url = '/orderMain/allStatistics'
  }
  return request.$oms({
    url,
    method: 'POST',
    data
  })
}

/**
 * 公用 - 订搜索类型选项
 */
export const getSearchTypeList = () => {
  return request.$oms({
    url: '/orderMain/searchTypeOptions',
    method: 'get'
  })
}

/**
 * 公用 - 表格列表分页查询
 * http://showdoc.zehui.local/web/#/91?page_id=792
 */
// export const getOrderList = data => {
//   return request.$oms({
//     url: '/orderMain/pageExceptionOrders',
//     method: 'post',
//     data
//   })
// }

/**
 * 公用 - 表格列表分页查询
 * http://showdoc.zehui.local/web/#/91?page_id=792
 * @param {object} data
 */
export const getPageList = data => {
  return request.$oms({
    url: '/orderMain/page',
    method: 'post',
    data
  })
}

/**
 * 详情 - 产品列表
 * @param {object} params 详情页产品列表的请求参数
 * @param {string} params.omOrderId OMS订单号的ID
 * @param {number} params.current 当前页
 * @param {number} params.size 每页的条数
 * @returns {promise} promise
 */
export const getProductList = params => {
  return request.$oms({
    url: '/orderGood/list',
    method: 'GET',
    params
  })
}

/**
 * 详情 - 包裹列表接口
 * @param {object} params 详情页产品列表的请求参数
 * @param {string} params.omOrderId OMS订单号的ID
 * @param {number} params.current 当前页
 * @param {number} params.size 每页的条数
 * @returns {promise} promise
 */
export const getPackageList = params => {
  return request.$oms({
    url: '/packageMain/orderPackages',
    method: 'GET',
    params
  })
}

/**
 * 详情 - 日志列表
 * @param {object} params 详情页日志列表的请求参数
 * @param {string} params.omOrderId OMS订单号的ID
 * @param {number} params.current 当前页
 * @param {number} params.size 每页的条数
 * @returns {promise} promise
 */
export const getLogList = params => {
  return request.$oms({
    url: '/orderHis/logs',
    method: 'GET',
    params
  })
}

/**
 * 订单管理详情接口
 * @param {string} omOrderId OMS订单号ID
 */
export const getDetail = omOrderId => request.$oms({
  url: '/orderMain/detail',
  method: 'GET',
  params: { omOrderId }
})

/**
 * 修改地址接口
 * @param {object} data
 */
export const modifyOrderAddres = data => request.$oms({
  url: '/orderAddress/update',
  method: 'POST',
  data
})

/**
 * 详情 - modal - 关联订单item下拉列表接口
 * @param {string} omOrderId OMS订单号ID
 */
export const getItemList = omOrderId => request.$oms({
  url: '/orderGood/itemList',
  method: 'GET',
  params: { omOrderId }
})

/**
 * 详情 - modal - 原因类型下拉列表接口
 */
export const getReasonTypeList = () => request.$oms({
  url: '/orderGood/reasonTypeList',
  method: 'GET'
})

// 发货仓库列表
export const getWasehoseList = () => {
  return request.$oms({
    url: '/warehouse/getWarehouseList',
    method: 'POST'
  })
}

/**
 * 详情- 更新商品接口
 * @param {object} data 添加商品信息参数
 * @param {boolean} [isModify=flase] 是否是新增接口，默认是
 */
export const updateOrderGood = (data, isAdd = true) => {
  const url = isAdd ? '/orderGood/add' : '/orderGood/update'
  return request.$oms({
    url, method: 'POST', data
  })
}

/**
 * 详情- 删除商品接口
 * @param {string} id 商品id
 * @param {string} omOrderId OMS订单号ID
 */
export const deleteOrderGood = (id, omOrderId) => request.$oms({
  url: '/orderGood/delete',
  method: 'POST',
  meta: {
    isSerialize: true
  },
  data: { id, omOrderId }
})

/**
 * 详情 - 获取商品信息接口
 * @param {string} id 商品id
 */
export const getOrderGood = (id) => request.$oms({
  url: '/orderGood/get?id=' + id,
  method: 'GET'
})

/**
 * 解析SKU接口
 * @param {string} pmsSku 商品sku
 */
export const analyzeSku = (pmsSku) => request.$oms({
  url: '/orderGood/analyzeSku',
  method: 'POST',
  meta: {
    isSerialize: true
  },
  data: { pmsSku }
})

/**
 * 批量备注接口
 * @param {object} [dtoList] {id, omOrderId, remark}
 * @param {array} [ids] 'id,omOrderId'
 * @param {string} [remark] 备注内容
 */
export const batchRemark = ({ dtoList, ids, remark, detailsType }) => {
  const data = []
  let url = '/orderMain/addBatchRemark'
  if (ids) {
    ids.forEach(item => {
      const idArr = item.split(',')
      const id = idArr[0]
      let obj = { omOrderId: idArr[1], remark }
      if (detailsType === 'package') {
        obj = { packageCode: idArr[1], remark }
        url = '/packageRemark/addBatch'
      }
      if (id !== '') obj.id = id
      data.push(obj)
    })
  } else data.push(dtoList)
  return request.$oms({
    url,
    method: 'POST',
    data
  })
}

/**
 * @typedef {object} obj
 * @property {String} omOrderId OMS订单号
 * @property {number} exceptionType 异常类型
 * @property {number} ifPass 审核通过:0-不通过,1-通过
 * @property {string} remarks 备注
 *
 *异常订单审核
 * @param {obj[]} data
 */
export const exceptionAudit = (type, data) => {
  const url = {
    order: '/orderMain/exceptionAudit',
    package: '/packageMain/exceptionAudit',
    out: '/packageMain/blockAudit',
    returnGoods: '/packageReturn/audit'
  }[type]
  return request.$oms({
    url,
    method: 'POST',
    data: { data }
  })
}

/**
 * 订单备注分页列表接口
 * @param {object} param0
 */
export const getRemarkList = ({ current, size, omOrderId }) => {
  return request.$oms({
    url: '/orderMain/pageRemark',
    method: 'GET',
    params: { current, size, omOrderId }
  })
}

/**
 * 订单商品详情（手工分仓页面）
 * @param {string} omOrderId OMS订单号
 */
export const getManualAssignList = omOrderId => {
  return request.$oms({
    url: '/orderMain/orderGoodDetail',
    method: 'GET',
    params: { omOrderId }
  })
}

/**
 * 订单商品详情 - 恢复订单
 * @param {Array} data OMS订单号列表
 */
export const recoveryOrder = data => {
  return request.$oms({
    url: '/orderMain/recoveryOrder',
    method: 'POST',
    data: {
      data
    }
  })
}

/**
 * 撤销订单
 * @param {object} data
 * @param {string} data.omOrderId 订单号
 * @param {number} data.cancelType 撤销类型
 * @param {string} data.reason 撤销原因
 */
export const cancelOrder = data => {
  return request.$oms({
    url: '/orderMain/cancelOrder',
    method: 'POST',
    data: { data }
  })
}

/**
 * 订单商品详情 - 保存手工分仓
 * @param {string} omOrderId OMS订单号
 * @param {string} omOrderId 手工分仓sku和库存等信息dto
 */
export const saveManualSep = (omOrderId, manualSepList) => {
  return request.$oms({
    url: '/packageMain/saveManualSep',
    method: 'POST',
    data: {
      omOrderId, manualSepList
    }
  })
}

/**
 * 订单商品详情 - 根据仓库编码获取库存数量
 * @param {string} pmsSku pmsSku
 * @param {string} wareHouseCode 仓库编码
 */
export const getSkuStock = params => {
  return request.$oms({
    url: '/orderGood/getSkuStock',
    params
  })
}

// 获取sku对应的仓库
export const getSkuWareHouse = omOrderId => {
  return request.$oms({
    url: '/orderMain/getSkuWareHouseCodeByOmOrderId',
    params: { omOrderId }
  })
}
