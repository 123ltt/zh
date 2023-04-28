import request from '@/router/axios'
/**
 * 分页
 * @param {*} current
 * @param {*} size
 * @param {*} params
 */
export const getList = (current, size, params) => request.$purchase({
  url: '/purchase/return/list',
  method: 'get',
  params: {
    current,
    size,
    ...params
  }
})
/**
 * 详情
 * @param {*} id
 */
export const detail = (id) => request.$purchase({
  url: '/purchase/return/detail',
  methods: 'get',
  params: {
    id
  }
})

/**
 * 供应商请求
 */
export const getSupplier = () => {
  return request.$pss({
    url: '/supplierInfo/listImportedSupplierInfos',
    method: 'get'
  })
}
// 物流商接口
export const logisticsProvider = () => {
  return request.$purchase({
    url: '/tms/logistics/provider/listAll',
    method: 'get'
  })
}
