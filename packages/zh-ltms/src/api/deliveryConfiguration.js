
import request from '@/router/axios'
/**
 * 分页接口
 */
export const getList = (current, size, params) => {
  return request.$ltms_provider({
    url: '/base/shipmentMark/list',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}
/**
 * 启/停用接口
 * @param {*} id
 * @param {*} status
 */
export const EnableOrDisable = (id, status) => {
  return request.$ltms_provider({
    url: '/base/shipmentMark/changeStatus',
    method: 'get',
    params: {
      id,
      status
    }
  })
}
/**
 * 新增接口
 * @param {*} params
 */
export const AddData = (data) => {
  return request.$ltms_provider({
    url: '/base/shipmentMark/save',
    method: 'post',
    data
  })
}
/**
 * 编辑接口
 * @param {*} params
 */
export const SaveData = (id, params) => {
  return request.$ltms_provider({
    url: '/base/shipmentMark/update',
    method: 'post',
    data: {
      id,
      ...params
    }
  })
}
/**
 * 标记简称接口
 * @param {*} dictKey
 */
export const MarkSimple = (dictKey) => {
  return request.$ltms_provider({
    url: '/base/shipmentMark/getDictChild',
    method: 'get',
    params: {
      dictKey
    }
  })
}
/**
 * 编辑-获取table详情
 * @param {*} id
 */
export const TableDetail = (id) => {
  return request.$ltms_provider({
    url: '/base/shipmentMark/detail',
    method: 'get',
    params: {
      id
    }
  })
}
/**
 * 标记值
 */
export const shipmentMark = (dictKey) =>
  request.$ltms_provider({
    url: '/base/shipmentMark/getDictListNew',
    method: 'get',
    params: {
      dictKey
    }
  })
