import request from '@/router/axios'

// 获取产品单位接口
export function getProductUnit(params) {
  return request.$lmsAliExpress({
    url: '/aliexpresslisting/get/product/unit',
    method: 'get',
    params: params
  })
}
// 获取在售Listing详情
export function getAliexpressListingDetail(data) {
  return request.$lmsAliExpress({
    url: '/aliexpresslisting/detail',
    method: 'post',
    params: { ...data }
  })
}

// 创建Listing接口
export function aliexpressListingSave(data) {
  return request.$lmsAliExpress({
    url: '/aliexpresslisting/save',
    method: 'post',
    data,
    reportError: false
  })
}

// 修改Listing接口
export function aliexpressListingUpdate(data) {
  return request.$lmsAliExpress({
    url: '/aliexpresslisting/update',
    method: 'post',
    data,
    reportError: false
  })
}

/**
 * @description 查询SKU前后缀对应的仓库和国家
 */
export function getSkuAffix(data) {
  return request.$oms({
    url: '/skuResolvingRule/resolveSkuAffix',
    method: 'post',
    data
  })
  // return new Promise((resolve, reject) => {
  //   resolve({ code: 200, success: true, data: [{ countryCode: 'AU', affixList: [{ id: '1381868841594335234', affixContent: 'test', description: 'test', channelCode: '["F17-01","F17-02"]', isVirtual: 0, warehouseList: [{ deliveryWarehouse: 'THIRD,WINIT,HWC203303', warehouseName: '/第三方仓/万邑通仓/万邑通澳洲海外仓HWC203', virtualWarehouse: null, type: 'THIRD' }, { deliveryWarehouse: 'THIRD,WINIT,HWC224324', warehouseName: '/第三方仓/万邑通仓/万邑通英国海外仓HWC224', virtualWarehouse: null, type: 'THIRD' }, { deliveryWarehouse: 'THIRD,WINIT,HWC472572', warehouseName: '/第三方仓/万邑通仓/万邑通德国海外仓HWC472', virtualWarehouse: null, type: 'THIRD' }, { deliveryWarehouse: 'THIRD,WINIT,LG02', warehouseName: '/第三方仓/万邑通仓/龙岗B仓', virtualWarehouse: null, type: 'THIRD' }, { deliveryWarehouse: 'THIRD,GU_CANG,HWC317417', warehouseName: '/第三方仓/谷仓/英国谷仓HWC317', virtualWarehouse: null, type: 'THIRD' }, { deliveryWarehouse: 'THIRD,GU_CANG,HWC548648', warehouseName: '/第三方仓/谷仓/法国谷仓HWC548', virtualWarehouse: null, type: 'THIRD' }, { deliveryWarehouse: 'THIRD,ZHHW,YSYFXC987', warehouseName: '/第三方仓/泽汇自建海外仓/优速易分销仓', virtualWarehouse: null, type: 'THIRD' }] }] }, { countryCode: 'DE', affixList: [{ id: '1381868841594335234', affixContent: 'test', description: 'test', channelCode: '["F17-01","F17-02"]', isVirtual: 0, warehouseList: [{ deliveryWarehouse: 'THIRD,WINIT,HWC203303', warehouseName: '/第三方仓/万邑通仓/万邑通澳洲海外仓HWC203', virtualWarehouse: null, type: 'THIRD' }, { deliveryWarehouse: 'THIRD,WINIT,HWC224324', warehouseName: '/第三方仓/万邑通仓/万邑通英国海外仓HWC224', virtualWarehouse: null, type: 'THIRD' }, { deliveryWarehouse: 'THIRD,WINIT,HWC472572', warehouseName: '/第三方仓/万邑通仓/万邑通德国海外仓HWC472', virtualWarehouse: null, type: 'THIRD' }, { deliveryWarehouse: 'THIRD,WINIT,LG02', warehouseName: '/第三方仓/万邑通仓/龙岗B仓', virtualWarehouse: null, type: 'THIRD' }, { deliveryWarehouse: 'THIRD,GU_CANG,HWC317417', warehouseName: '/第三方仓/谷仓/英国谷仓HWC317', virtualWarehouse: null, type: 'THIRD' }, { deliveryWarehouse: 'THIRD,GU_CANG,HWC548648', warehouseName: '/第三方仓/谷仓/法国谷仓HWC548', virtualWarehouse: null, type: 'THIRD' }, { deliveryWarehouse: 'THIRD,ZHHW,YSYFXC987', warehouseName: '/第三方仓/泽汇自建海外仓/优速易分销仓', virtualWarehouse: null, type: 'THIRD' }] }] }, { countryCode: 'CN', affixList: [{ id: '1382253428815106049', affixContent: '88', description: '123', channelCode: '[]', isVirtual: 1, warehouseList: [{ deliveryWarehouse: 'SELF_BUILT,SZC,Z20', warehouseName: '/自建仓/深圳仓/清溪Z仓', virtualWarehouse: null, type: 'SELF_BUILT' }] }, { id: '1381873559409963009', affixContent: '120', description: 'dddddxxxx', channelCode: '[]', isVirtual: 0, warehouseList: [{ deliveryWarehouse: 'SELF_BUILT,SZC,H11', warehouseName: '/自建仓/深圳仓/石岩H仓', virtualWarehouse: null, type: 'SELF_BUILT' }, { deliveryWarehouse: 'SELF_BUILT,SZC,Z20', warehouseName: '/自建仓/深圳仓/清溪Z仓', virtualWarehouse: null, type: 'SELF_BUILT' }, { deliveryWarehouse: 'SELF_BUILT,SZC,T453', warehouseName: '/自建仓/深圳仓/龙岗T仓', virtualWarehouse: null, type: 'SELF_BUILT' }] }] }, { countryCode: 'US', affixList: [{ id: '1381928114744123393', affixContent: '888', description: '3333', channelCode: '["F17-02","XN001"]', isVirtual: 1, warehouseList: [{ deliveryWarehouse: 'VIRTUAL,XU_NI_US,FBA2102', warehouseName: '/虚拟仓/XU_NI_US', virtualWarehouse: 'XU_NI_US', type: 'VIRTUAL' }] }, { id: '1382257453958758402', affixContent: '144', description: '虚仓测试测试', channelCode: '["F17-12","F17-13","F17-01","F17-02","LW-01","XN001"]', isVirtual: 0, warehouseList: [{ deliveryWarehouse: 'VIRTUAL,XU_NI_US,FBA2102', warehouseName: '/虚拟仓/XU_NI_US', virtualWarehouse: 'XU_NI_US', type: 'VIRTUAL' }] }, { id: '1384678900138037249', affixContent: 'asa', description: 'hn', channelCode: '["F17-12","F17-13","F17-01","F17-02","F17-14","F17-03","F17-10","F17-03"]', isVirtual: 1, warehouseList: [{ deliveryWarehouse: 'VIRTUAL,XU_NI_US,FBA2102', warehouseName: '/虚拟仓/XU_NI_US', virtualWarehouse: 'XU_NI_US', type: 'VIRTUAL' }, { deliveryWarehouse: 'SELF_BUILT,ZH,USWEST1227', warehouseName: '/自建仓/泽汇/泽汇美国西部', virtualWarehouse: null, type: 'SELF_BUILT' }, { deliveryWarehouse: 'SELF_BUILT,ZH,USEAST1228', warehouseName: '/自建仓/泽汇/泽汇美国东部', virtualWarehouse: null, type: 'SELF_BUILT' }] }] }], msg: '操作成功' })
  // })
}

/**
 * @description 计算价格接口
 */
export function calculatePrice(data) {
  return request.$lmsAliExpress({
    url: '/aliexpresslisting/calculatePrice',
    method: 'post',
    data,
    reportError: false
  })
}

/**
 * 查询成本价抵扣项
*/
export function getPrice(data) {
  return request.$lmsAliExpress({
    url: '/common/getPrice',
    method: 'post',
    data
  })
}

// 物流渠道接口
export function getOptimize(data) {
  return request.$lmsAliExpress({
    url: '/common/getOptimizeBySku',
    method: 'post',
    data
  })
}
