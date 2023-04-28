// 该文件通过route-tool脚本自动生成。📌请勿手动修改
export const routes = [
  {
    name: 'LpsPaymentPay',
    path: '/lps/payment/pay',
    component: () => import(/* webpackChunkName: "lps" */ '@/views/payment/_pay.vue')
  },
  {
    name: 'LpsPrePaymentVerifyPrepay',
    path: '/lps/prePayment/verifyPrepay',
    component: () => import(/* webpackChunkName: "lps" */ '@/views/prePayment/_verifyPrepay.vue')
  },
  {
    name: 'LpsQueryFreightTotal',
    path: '/lps/query/freightTotal',
    component: () => import(/* webpackChunkName: "lps" */ '@/views/query/_freightTotal.vue')
  },
  {
    name: 'LpsQueryWishBalance',
    path: '/lps/query/wishBalance',
    component: () => import(/* webpackChunkName: "lps" */ '@/views/query/_wishBalance.vue')
  },
  {
    name: 'LpsSettingAutoFlat',
    path: '/lps/setting/autoFlat',
    component: () => import(/* webpackChunkName: "lps" */ '@/views/setting/_autoFlat.vue')
  },
  {
    name: 'LpsSettlementCheck',
    path: '/lps/settlement/check',
    component: () => import(/* webpackChunkName: "lps" */ '@/views/settlement/_check.vue')
  },
  {
    name: 'LpsSettlementEntry',
    path: '/lps/settlement/entry',
    component: () => import(/* webpackChunkName: "lps" */ '@/views/settlement/_entry.vue')
  },
  {
    name: 'LpsSettlementSettlement',
    path: '/lps/settlement/settlement',
    component: () => import(/* webpackChunkName: "lps" */ '@/views/settlement/_settlement.vue')
  },
  {
    name: 'LpsSystemBizDict',
    path: '/lps/system/bizDict',
    component: () => import(/* webpackChunkName: "lps" */ '@/views/system/_bizDict.vue')
  },
  {
    name: 'LpsImportOrExport',
    path: '/lps/importOrExport',
    component: () => import(/* webpackChunkName: "lps" */ '@/views/_importOrExport.vue')
  }
].map(item => {
  item.meta = Object.assign(item.meta || {}, { $keepAlive: true })
  return item
})

export const pageRoutes = [
  {
    path: '/_np/lps/newpage/paymentTicket',
    component: () => import(/* webpackChunkName: "lps" */ '@/views/newpage/~paymentTicket.vue')
  }
].map(item => {
  item.meta = { $keepAlive: true }
  return item
})

export const apiPrefix = JSON.parse('[["$lps","lps"]]')
