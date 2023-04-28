// 该文件通过route-tool脚本自动生成。📌请勿手动修改
export const routes = [
  {
    name: 'TrsCustomInfoList',
    path: '/trs/customInfo/list',
    component: () => import(/* webpackChunkName: "trs" */ '@/views/customInfo/_list.vue')
  },
  {
    name: 'TrsExportProductList',
    path: '/trs/exportProduct/list',
    component: () => import(/* webpackChunkName: "trs" */ '@/views/exportProduct/_list.vue')
  },
  {
    name: 'TrsHsCodeList',
    path: '/trs/hsCode/list',
    component: () => import(/* webpackChunkName: "trs" */ '@/views/hsCode/_list.vue')
  },
  {
    name: 'TrsPreCustomList',
    path: '/trs/preCustom/list',
    component: () => import(/* webpackChunkName: "trs" */ '@/views/preCustom/_list.vue')
  },
  {
    name: 'TrsSystemBusinessDict',
    path: '/trs/system/businessDict',
    component: () => import(/* webpackChunkName: "trs" */ '@/views/system/_businessDict.vue')
  },
  {
    name: 'TrsUndeclareWarnList',
    path: '/trs/undeclareWarn/list',
    component: () => import(/* webpackChunkName: "trs" */ '@/views/undeclareWarn/_list.vue')
  },
  {
    name: 'TrsUndeclareWarnRuleSetting',
    path: '/trs/undeclareWarn/ruleSetting',
    component: () => import(/* webpackChunkName: "trs" */ '@/views/undeclareWarn/_ruleSetting.vue')
  }
].map(item => {
  item.meta = Object.assign(item.meta || {}, { $keepAlive: true })
  return item
})

export const pageRoutes = [
  {
    path: '/_np/trs/components/define-template/updateTemp',
    component: () => import(/* webpackChunkName: "trs" */ '@/views/components/define-template/~updateTemp.vue')
  },
  {
    path: '/_np/trs/preCustom/preview',
    component: () => import(/* webpackChunkName: "trs" */ '@/views/preCustom/~preview.vue')
  }
].map(item => {
  item.meta = { $keepAlive: true }
  return item
})

export const apiPrefix = JSON.parse('[["$trs","ctrs"]]')
