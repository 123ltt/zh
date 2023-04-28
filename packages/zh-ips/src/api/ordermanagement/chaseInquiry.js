import request from '@/router/axios'
/**
 *分页接口
 * @param {*current}
 * @param {*size}
 * @param {*params}
 */
export const getList = (current, size, params) => request.$purchase({
  url: '/inquiry/list',
  method: 'get',
  params: {
    current,
    size,
    ...params
  }
})
/**
 * 详情接口
 * @param {*id}
 */
export const detail = (id) => request({
  url: '',
  method: 'get',
  params: {
    id
  }
})
/**
 *
 * @param {*id} 处理接口
 */
export const process = (id) => request.$purchase({
  url: '/inquiry/updateDetail2',
  method: 'get',
  params: {
    id
  }
})
/**
 *
 * @param {*productSku}  商品table
 */
export const getProductEdit = (params) => request.$purchase({
  url: '/inquiry/getGoodsInfo',
  method: 'get',
  params: {
    ...params
  }
})
/**
 *
 * @param {*id} 审核列表
 */
export const getCheck = id => request.$purchase({
  url: '/inquiry/verifyDetail',
  method: 'get',
  params: {
    id
  }
})
/**
 *
 * @param {*id}  审核
 * @param {*list}
 */
export const checkExamine = (data) => request.$purchase({
  url: '/inquiry/verify',
  method: 'post',
  data
})
/**
 *
 * @param {*data}  处理编辑接口
 */
export const edit = (data) => request.$purchase({
  url: '/inquiry/update',
  method: 'post',
  data: {
    ...data
  }
})
/**
 *
 * @param {*data}  处理新增接口
 */
export const processAdd = (data) => request.$purchase({
  url: '/inquiry/save',
  method: 'post',
  data: {
    ...data
  }
})
/**
 *
 * @param {*id} 详情接口
 */
export const purchaseDetail = (id) => request.$purchase({
  url: '/inquiry/verifyDetail',
  method: 'get',
  params: {
    id
  }
})
/**
 *
 * @param {*data}  询价确认接口
 */
export const confirm = (data) => request.$purchase({
  url: '/inquiry/confirm',
  method: 'post',
  data
})
