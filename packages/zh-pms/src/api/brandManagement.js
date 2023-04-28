import request from '@/router/axios'

// 品牌信息查询接口
export const queryBrand = ({ status, brandName, deverId, current, size }) => {
  return request.$pms({
    url: '/brand/selectBrandPage',
    method: 'GET',
    params: {
      status, brandName, deverId, current, size
    }
  })
}

// 新增品牌接口
export const addBrand = ({ brandNumber, brandName, brandDescription, deverId, enterTime, status }) => {
  return request.$pms({
    url: '/brand/save',
    method: 'POST',
    data: {
      brandNumber, brandName, brandDescription, deverId, enterTime, status
    }
  })
}

// 修改品牌信息接口
export const modifyBrand = ({ id, brandNumber, brandName, brandDescription, deverId, enterTime, status }) => {
  return request.$pms({
    url: '/brand/update',
    method: 'POST',
    data: {
      id, brandNumber, brandName, brandDescription, deverId, enterTime, status
    }
  })
}

// 删除品牌信息接口
export const delBrand = ids => {
  return request.$pms({
    url: '/brand/remove',
    method: 'POST',
    meta: {
      isSerialize: true
    },
    data: {
      ids
    }
  })
}
