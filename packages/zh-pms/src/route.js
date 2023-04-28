// 该文件通过route-tool脚本自动生成。📌请勿手动修改
export const routes = [
  {
    name: 'PmsBatchModify',
    path: '/pms/batchModify',
    component: () => import(/* webpackChunkName: "pms" */ '@/views/_batchModify.vue')
  },
  {
    name: 'PmsBrandManagement',
    path: '/pms/brandManagement',
    component: () => import(/* webpackChunkName: "pms" */ '@/views/_brandManagement.vue')
  },
  {
    name: 'PmsCategoryManagement',
    path: '/pms/categoryManagement',
    component: () => import(/* webpackChunkName: "pms" */ '@/views/_categoryManagement.vue')
  },
  {
    name: 'PmsCombinationSKU',
    path: '/pms/combinationSKU',
    component: () => import(/* webpackChunkName: "pms" */ '@/views/_combinationSKU.vue')
  },
  {
    name: 'PmsDownloadCenter',
    path: '/pms/downloadCenter',
    component: () => import(/* webpackChunkName: "pms" */ '@/views/_downloadCenter.vue')
  },
  {
    name: 'PmsMyAudit',
    path: '/pms/myAudit',
    component: () => import(/* webpackChunkName: "pms" */ '@/views/_myAudit.vue')
  },
  {
    name: 'PmsNewProductEntry',
    path: '/pms/newProductEntry',
    component: () => import(/* webpackChunkName: "pms" */ '@/views/_newProductEntry.vue')
  },
  {
    name: 'PmsPlatformLimitPrice',
    path: '/pms/platformLimitPrice',
    component: () => import(/* webpackChunkName: "pms" */ '@/views/_platformLimitPrice.vue')
  },
  {
    name: 'PmsProductLineConfig',
    path: '/pms/productLineConfig',
    component: () => import(/* webpackChunkName: "pms" */ '@/views/_productLineConfig.vue')
  },
  {
    name: 'PmsPropertyManagement',
    path: '/pms/propertyManagement',
    component: () => import(/* webpackChunkName: "pms" */ '@/views/_propertyManagement.vue')
  },
  {
    name: 'PmsPublishedConstraints',
    path: '/pms/publishedConstraints',
    component: () => import(/* webpackChunkName: "pms" */ '@/views/_publishedConstraints.vue')
  },
  {
    name: 'PmsPurchasingIssues',
    path: '/pms/purchasingIssues',
    component: () => import(/* webpackChunkName: "pms" */ '@/views/_purchasingIssues.vue')
  },
  {
    name: 'PmsSecurityRulesConfig',
    path: '/pms/securityRulesConfig',
    component: () => import(/* webpackChunkName: "pms" */ '@/views/_securityRulesConfig.vue')
  },
  {
    name: 'PmsSku',
    path: '/pms/sku',
    component: () => import(/* webpackChunkName: "pms" */ '@/views/_sku.vue')
  },
  {
    name: 'PmsSkuBelonging',
    path: '/pms/skuBelonging',
    component: () => import(/* webpackChunkName: "pms" */ '@/views/_skuBelonging.vue')
  },
  {
    name: 'PmsSpu',
    path: '/pms/spu',
    component: () => import(/* webpackChunkName: "pms" */ '@/views/_spu.vue')
  },
  {
    name: 'PmsSpuSkuList',
    path: '/pms/spuSkuList',
    component: () => import(/* webpackChunkName: "pms" */ '@/views/_spuSkuList.vue')
  },
  {
    name: 'PmsArtTaskDemander',
    path: '/pms/artTask/demander',
    component: () => import(/* webpackChunkName: "pms" */ '@/views/artTask/_demander.vue')
  },
  {
    name: 'PmsArtTaskDesigner',
    path: '/pms/artTask/designer',
    component: () => import(/* webpackChunkName: "pms" */ '@/views/artTask/_designer.vue')
  },
  {
    name: 'PmsArtTaskTeam',
    path: '/pms/artTask/team',
    component: () => import(/* webpackChunkName: "pms" */ '@/views/artTask/_team.vue')
  },
  {
    name: 'PmsMappingCategoryAttrs',
    path: '/pms/mapping/categoryAttrs',
    component: () => import(/* webpackChunkName: "pms" */ '@/views/mapping/_categoryAttrs.vue')
  },
  {
    name: 'PmsMappingNiuwa',
    path: '/pms/mapping/niuwa',
    component: () => import(/* webpackChunkName: "pms" */ '@/views/mapping/_niuwa.vue')
  },
  {
    name: 'PmsMappingPlatform',
    path: '/pms/mapping/platform',
    component: () => import(/* webpackChunkName: "pms" */ '@/views/mapping/_platform.vue')
  }
].map(item => {
  item.meta = Object.assign(item.meta || {}, { $keepAlive: true })
  return item
})

export const pageRoutes = [
  {
    path: '/_np/pms/product/add',
    component: () => import(/* webpackChunkName: "pms" */ '@/views/product/~add.vue')
  },
  {
    path: '/_np/pms/product/audit',
    component: () => import(/* webpackChunkName: "pms" */ '@/views/product/~audit.vue')
  },
  {
    path: '/_np/pms/product/auditDev',
    component: () => import(/* webpackChunkName: "pms" */ '@/views/product/~auditDev.vue')
  },
  {
    path: '/_np/pms/product/detail',
    component: () => import(/* webpackChunkName: "pms" */ '@/views/product/~detail.vue')
  },
  {
    path: '/_np/pms/product/detailDev',
    component: () => import(/* webpackChunkName: "pms" */ '@/views/product/~detailDev.vue')
  },
  {
    path: '/_np/pms/product/edit',
    component: () => import(/* webpackChunkName: "pms" */ '@/views/product/~edit.vue')
  }
].map(item => {
  item.meta = { $keepAlive: true }
  return item
})

export const apiPrefix = isSaas => isSaas ? [['$pms', 'pms']] : [['$pms', 'cpms']]
