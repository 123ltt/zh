import request from '@/router/axios'

// 列表信息分页接口
export const getList = (current, size, params) => {
  return request.$purchase({
    url: '/stockoos/page',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

// 其他详情
export const getOtherInfo = (row) => {
  return request.$purchase({
    url: '/stockoos/otherInfo',
    method: 'post',
    data: row
  })
}

/**
 *
 * @param { object } row
 * @returns 新增
 */
export const save = (row) => {
  return request.$purchase({
    url: '/stockoos/saveOweOrderReq',
    method: 'post',
    data: row
  })
}

// 缺货详情
export const getDetail = (current, size, params) => {
  return request.$purchase({
    url: '/stockoos/details',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

// 采购中详情
export const getReqList = (stockOosId) => {
  return request.$purchase({
    url: '/stockoos/reqList',
    method: 'get',
    params: {
      stockOosId
    }
  })
}

// 主要类目接口
export const getCateGoryChild = () => {
  return request.$purchase({
    url: '/pss/category/getCateGoryChild',
    method: 'get'
  })
}

// 仓库接口
export const getEnableList = () => {
  return request.$purchase({
    url: '/ims/warehouse/enableList',
    method: 'get'
  })
}
