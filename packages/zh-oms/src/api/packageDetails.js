import request from '@/router/axios'

/**
 * 包裹详情接口
 * @param {string} packageCode 包裹编码
 */
export const getPackageDetails = packageCode => {
  return request.$oms({
    url: '/packageMain/detail',
    method: 'GET',
    params: { packageCode }
  })
}

/**
 * 修改地址接口
 * @param {object} data
 */
export const upadteAddress = data => {
  return request.$oms({
    url: '/packageAddress/update',
    method: 'POST',
    data
  })
}

/**
 * 产品列表接口
 * @param {object} params
 * @param {number} [params.current] 当前页
 * @param {number} [params.size] 每页几条
 * @param {string} params.packageCode 包裹编码
 */
export const getPackageProductList = params => {
  return request.$oms({
    url: '/packageGood/page',
    method: 'GET',
    params
  })
}

/**
 * 备注列表接口
 * @param {number} [current] 当前页
 * @param {number} [size] 每页几条
 * @param {string} packageCode 仓库编号
 */
export const getRemarkList = ({ current, size, packageCode }) => {
  return request.$oms({
    url: '/packageRemark/page',
    method: 'GET',
    params: {
      current, size, packageCode
    }
  })
}

/**
 * 包裹日志列表接口
 * @param {object} params 当前页
 * @param {number} [params.current] 当前页
 * @param {number} [params.size] 每页几条
 * @param {string} params.packageCode 仓库编号
 * @param {string} params.logger 操作类型
 */
export const getLogList = (params) => {
  return request.$oms({
    url: '/packageHis/page',
    params
  })
}

/**
 * 包裹详情 - 获取商品信息接口
 * @param {string} id 商品id
 */
export const getPackageGood = (id) => request.$oms({
  url: '/packageGood/get?id=' + id
})

/**
 * 详情- 更新商品接口
 * @param {object} data 添加商品信息参数
 * @param {boolean} [isAdd=true] 是否是新增接口，默认是
 */
export const updatePackageGood = (data, isAdd = true) => {
  const url = isAdd ? '/packageGood/save' : '/packageGood/update'
  return request.$oms({
    url, method: 'POST', data
  })
}

/**
 * 删除商品接口
 * @param {string} id
 * @param {string} packageCode
 */
export const deletePackageGood = (id, packageCode) => request.$oms({
  url: '/packageGood/remove',
  method: 'POST',
  meta: {
    isSerialize: true
  },
  data: { id, packageCode }
})

/**
 * 撤销包裹
 * @param {object} data
 * @param {string} data.packageCode 包裹号
 * @param {number} data.cancelType 撤销类型
 * @param {string} data.reason 撤销原因
 */
export const cancelPackage = (data) => {
  return request.$oms({
    url: '/packageMain/cancelPackage',
    method: 'POST',
    data: { data }
  })
}
/**
 * 修改渠道
 * @param {object} data
 * @param {string} data.packageCode 包裹号
 * @param {string} data.channelCode 手工优选渠道编码
 * @param {string} data.warehouseCode 仓库编码
 * @param {string} data.trialFreightCost 运费试算价格
 */
export const updateChannel = data => {
  return request.$oms({
    url: '/packageMain/updateChannel',
    method: 'POST',
    data
  })
}

/**
 * 修改渠道 获取sku信息 （列表页的修改渠道）
 * @param {options} data
 * @param {string} data.packageCode 包裹号
 * @param {string} data.warehouseCode 仓库编码
 */
export const getSkuAndInventory = data => {
  return request.$oms({
    url: '/packageMain/getSkuAndInventory',
    method: 'POST',
    data
  })
}
/**
 * @typedef list
 * @property {string} list.pmsSku sku
 * @property {string} list.productQuantity 发货数量
 * @property {string} list.platformProductId itimId
 * @property {string|number} list.goodId goodId
 */

/**
 * 修改渠道 获取sku信息  （详情页的修改渠道）
 * @param {object} data
 * @param {string} data.packageCode 包裹号
 * @param {string} data.warehouseCode 仓库编码
 * @param {list[]} data.goodInfoList 仓库编码
 */
export const getSkuAndInventoryDetail = data => {
  return request.$oms({
    url: '/packageMain/getSkuAndInventoryListByDetailPage',
    method: 'POST',
    data
  })
}

/**
 *获取渠道和运费（根据包裹号和冲货）
 * @param {object} data
 * @param {string} data.packageCode 包裹号
 * @param {boolean} data.allowRushFlag 是否允许冲货
 */
export const getChannelAndPriceByPkgCode = data => request.$oms({
  url: '/packageMain/getChannelAndPriceByPkgCode',
  method: 'POST',
  data
})

/**
 *获取渠道和运费（详情页专用）
 * @param {object} data
 * @param {object} data.packageDetailVO 包裹详情页的参数对象
 * @param {object} data.pages 包裹商品页的参数对象
 * @param {string} data.warehouseCode 仓库编码
 */
export const getChannelAndPriceByPkgDetail = data => request.$oms({
  url: '/packageMain/getChannelAndPriceByPkgDetail',
  method: 'POST',
  data
})

/**
 * 恢复包裹
 * @param {Object} data
 * @param {string} data.packageCode 包裹号
 * @param {string} data.reason 恢复原因
 */
export const recoveryPackage = data => {
  return request.$oms({
    url: '/packageMain/recoveryPackage',
    method: 'POST',
    data: {
      data
    }
  })
}

// 包裹详情一并提交接口 http://showdoc.zehui.local/web/#/91?page_id=1405
export const packageSubmit = data => {
  return request.$oms({
    url: '/packageMain/submit',
    method: 'POST',
    data
  })
}
