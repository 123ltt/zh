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

// 产品线查询接口-分页查询
export const queryLine = ({ lineName, categoryIdList, lineStatus, current, size }) => {
  return request.$pms({
    url: '/line/selectProductLine',
    method: 'GET',
    params: {
      lineName, categoryIdList, lineStatus, current, size
    }
  })
}
