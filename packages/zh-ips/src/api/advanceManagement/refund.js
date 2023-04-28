import request from '@/router/axios'
/**
 * 分页
 * @param {*} current
 * @param {*} size
 * @param {*} params
 */
export const getList = (current, size, params) => request.$purchase({
  url: '/orderPrepayReturnHis/page',
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
  url: '/orderPrepayReturnHis/detail/' + `${id}`,
  method: 'get',
  params: {
    // id
  }
})

export const Add = () => request.$purchase({
  url: '/orderPrepayReturnHis/save',
  method: 'post',
  data: {

  }
})
/**
 * 通过采购编码获取信息
 * @param {*} purCode
 */
export const getPurCode = (purCode) => request.$purchase({
  url: '/purchase/order/getDetailByPurCode',
  method: 'get',
  params: {
    purCode
  }
})
/**
 * 退款提交接口
 * @param {*} data
 */
export const submit = (data) => request.$purchase({
  url: '/orderPrepayReturnHis/save',
  method: 'post',
  data: {
    ...data
  }
})
/**
 * 删除接口
 * @param {*} ids
 */
export const remove = (ids) => request.$purchase({
  url: '/orderPrepayReturnHis/remove',
  method: 'post',
  params: {
    ids
  }
})
/**
 * 提交接口
 * @param {*} id
 * @param {*} returnMoney
 */
export const Request = (id, returnMoney) => request.$purchase({
  url: '/orderPrepayReturnHis/submit',
  method: 'post',
  data: {
    id,
    returnMoney
  }
})
