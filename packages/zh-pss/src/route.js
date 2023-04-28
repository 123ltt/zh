// 该文件通过route-tool脚本自动生成。📌请勿手动修改
export const routes = [
  {
    name: 'SupplierAddressManagementReturnAddress',
    path: '/supplier/addressManagement/returnAddress',
    component: () => import(/* webpackChunkName: "supplier" */ '@/views/addressManagement/_returnAddress.vue')
  },
  {
    name: 'SupplierAdjManagementPurchaseAdj',
    path: '/supplier/adjManagement/purchaseAdj',
    component: () => import(/* webpackChunkName: "supplier" */ '@/views/adjManagement/_purchaseAdj.vue')
  },
  {
    name: 'SupplierBasicManagementAssessmentRules',
    path: '/supplier/basicManagement/assessmentRules',
    component: () => import(/* webpackChunkName: "supplier" */ '@/views/basicManagement/_assessmentRules.vue')
  },
  {
    name: 'SupplierBasicManagementFactoryVisitAssessment',
    path: '/supplier/basicManagement/factoryVisitAssessment',
    component: () => import(/* webpackChunkName: "supplier" */ '@/views/basicManagement/_factoryVisitAssessment.vue')
  },
  {
    name: 'SupplierBasicManagementRatingRules',
    path: '/supplier/basicManagement/ratingRules',
    component: () => import(/* webpackChunkName: "supplier" */ '@/views/basicManagement/_ratingRules.vue')
  },
  {
    name: 'SupplierBlacklistManagementBlacklistOfSuppliers',
    path: '/supplier/blacklistManagement/blacklistOfSuppliers',
    component: () => import(/* webpackChunkName: "supplier" */ '@/views/blacklistManagement/_blacklistOfSuppliers.vue')
  },
  {
    name: 'SupplierExceptionManagementCheckUnqualified',
    path: '/supplier/exceptionManagement/checkUnqualified',
    component: () => import(/* webpackChunkName: "supplier" */ '@/views/exceptionManagement/_checkUnqualified.vue')
  },
  {
    name: 'SupplierFactoryVisitManagementApply',
    path: '/supplier/factoryVisitManagement/apply',
    component: () => import(/* webpackChunkName: "supplier" */ '@/views/factoryVisitManagement/_apply.vue')
  },
  {
    name: 'SupplierFactoryVisitManagementFactoryVisitRecord',
    path: '/supplier/factoryVisitManagement/factoryVisitRecord',
    component: () => import(/* webpackChunkName: "supplier" */ '@/views/factoryVisitManagement/_factoryVisitRecord.vue')
  },
  {
    name: 'SupplierFactoryVisitManagementRecord',
    path: '/supplier/factoryVisitManagement/record',
    component: () => import(/* webpackChunkName: "supplier" */ '@/views/factoryVisitManagement/_record.vue')
  },
  {
    name: 'SupplierGoodsManagementGoodsAuotation',
    path: '/supplier/goodsManagement/goodsAuotation',
    component: () => import(/* webpackChunkName: "supplier" */ '@/views/goodsManagement/_goodsAuotation.vue')
  },
  {
    name: 'SupplierGoodsManagementGoodsBrand',
    path: '/supplier/goodsManagement/goodsBrand',
    component: () => import(/* webpackChunkName: "supplier" */ '@/views/goodsManagement/_goodsBrand.vue')
  },
  {
    name: 'SupplierGoodsManagementGoodsInfo',
    path: '/supplier/goodsManagement/goodsInfo',
    component: () => import(/* webpackChunkName: "supplier" */ '@/views/goodsManagement/_goodsInfo.vue')
  },
  {
    name: 'SupplierOrderManagementDeliveryOrder',
    path: '/supplier/orderManagement/deliveryOrder',
    component: () => import(/* webpackChunkName: "supplier" */ '@/views/orderManagement/_deliveryOrder.vue')
  },
  {
    name: 'SupplierOrderManagementPurchasingOrder',
    path: '/supplier/orderManagement/purchasingOrder',
    component: () => import(/* webpackChunkName: "supplier" */ '@/views/orderManagement/_purchasingOrder.vue')
  },
  {
    name: 'SupplierOrderManagementReturnOrder',
    path: '/supplier/orderManagement/returnOrder',
    component: () => import(/* webpackChunkName: "supplier" */ '@/views/orderManagement/_returnOrder.vue')
  },
  {
    name: 'SupplierRatingManagementPerformance',
    path: '/supplier/ratingManagement/performance',
    component: () => import(/* webpackChunkName: "supplier" */ '@/views/ratingManagement/_performance.vue')
  },
  {
    name: 'SupplierRatingManagementSupplierRating',
    path: '/supplier/ratingManagement/supplierRating',
    component: () => import(/* webpackChunkName: "supplier" */ '@/views/ratingManagement/_supplierRating.vue')
  },
  {
    name: 'SupplierSettlementManagementOrderSettlement',
    path: '/supplier/settlementManagement/orderSettlement',
    component: () => import(/* webpackChunkName: "supplier" */ '@/views/settlementManagement/_orderSettlement.vue')
  },
  {
    name: 'SupplierSettlementManagementSettlementAccountNo',
    path: '/supplier/settlementManagement/settlementAccountNo',
    component: () => import(/* webpackChunkName: "supplier" */ '@/views/settlementManagement/_settlementAccountNo.vue')
  },
  {
    name: 'SupplierSettlementManagementSettlementPeriod',
    path: '/supplier/settlementManagement/settlementPeriod',
    component: () => import(/* webpackChunkName: "supplier" */ '@/views/settlementManagement/_settlementPeriod.vue')
  },
  {
    name: 'SupplierSupplierManagementSupplierAllocation',
    path: '/supplier/supplierManagement/supplierAllocation',
    component: () => import(/* webpackChunkName: "supplier" */ '@/views/supplierManagement/_supplierAllocation.vue')
  },
  {
    name: 'SupplierSupplierManagementSupplierIntroduction',
    path: '/supplier/supplierManagement/supplierIntroduction',
    component: () => import(/* webpackChunkName: "supplier" */ '@/views/supplierManagement/_supplierIntroduction.vue')
  },
  {
    name: 'SupplierSystemBizDict',
    path: '/supplier/system/bizDict',
    component: () => import(/* webpackChunkName: "supplier" */ '@/views/system/_bizDict.vue')
  },
  {
    name: 'SupplierIndex',
    path: '/supplier/index',
    component: () => import(/* webpackChunkName: "supplier" */ '@/views/_index.vue')
  }
].map(item => {
  item.meta = Object.assign(item.meta || {}, { $keepAlive: true })
  return item
})

export const pageRoutes = [

].map(item => {
  item.meta = { $keepAlive: true }
  return item
})

export const apiPrefix = (isSaas) => isSaas ? [['$pss', 'pss']] : [['$pss', 'platform-pss']]
