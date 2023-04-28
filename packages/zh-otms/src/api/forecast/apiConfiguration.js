import request from '@/router/axios'
/**
 *分页查询接口
 */
export const getList = (current, size, params) =>
  request.$otms_provider({
    url: '/base/channelApi/list',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
/**
 * 新增数据接口
 * @param {*} data
 */
export const addData = (data) =>
  request.$otms_provider({
    url: '/base/channelApi/add',
    method: 'post',
    data
  })
/**
 * 修改数据接口
 * @param {*} data
 */
export const upData = (data) =>
  request.$otms_provider({
    url: '/base/channelApi/update',
    method: 'post',
    data
  })
/**
 * 删除数据接口
 * @param {*} id
 */
export const deleData = (id) =>
  request.$otms_provider({
    url: `/base/channelApi/deleted?id=${id}`,
    method: 'get',
    params: {

    }
  })
/**
 * 启停用状态接口
 * @param {*} id
 * @param {*} status
 */

export const OoCStatus = (id, status) =>
  request.$otms_provider({
    url: '/base/channelApi/changeStatus',
    method: 'get',
    params: {
      id,
      status
    }
  })
/**
 * 获取渠道API策略list
 */
export const getApiList = () =>
  request.$otms_provider({
    url: '/base/channelApi/getApiList',
    method: 'get'
  })
