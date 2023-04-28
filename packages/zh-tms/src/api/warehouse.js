// 仓库分区接口
import request from '@/router/axios'

// 查询仓库分区
export const getList = (current, size, params) => {
  return request.$tms_provider({
    url: '/warehouse/page',
    method: 'post',
    params: {
      current,
      size,
      ...params
    }
  })
}
// 新增仓库分区
export const addWarehouse = (params) => {
  return request.$tms_provider({
    url: '/warehouse/save',
    method: 'post',
    data: params
  })
}

// 修改仓库分区
export const updateWarehouse = (params) => {
  return request.$tms_provider({
    url: '/warehouse/update',
    method: 'post',
    data: params
  })
}

// 删除仓库分区
export const removeWarehouse = (params) => {
  return request.$tms_provider({
    url: '/warehouse/remove',
    method: 'post',
    params
  })
}
