import request from '@/router/axios'
// 采购计划接口
/**
 * 分页接口
 * @param {*当前页数} current
 * @param {*页面条数} size
 * @param {*搜索条件} params
 */
export const getList = (current, size, params) => request.$purchase({
  url: '/plan/list',
  method: 'get',
  params: {
    current,
    size,
    ...params
  }
})

/** 确认采购接口
 * @param {*data}
 */
export const change = (data) => request.$purchase({
  url: '/plan/purchase',
  method: 'post',
  data: {
    ...data
  }
})

/**
 *
 * @param {*商品ID} id
 * @returns
 */
export const getGoodsDetail = (id) => {
  return request.$pss({
    url: '/supplierGoods/detail',
    method: 'get',
    params: {
      id
    }
  })
}
