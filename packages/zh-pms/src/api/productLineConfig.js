import request from '@/router/axios'

// 新增或修改产品线属性
export const updateLine = data => {
  return request.$pms({
    url: '/line/saveLineList',
    method: 'POST',
    data
  })
}

// 类目列表三级分类树状图测试
export const testTree = () => {
  return request.$pms({
    url: '/line/tree',
    method: 'GET'
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

// 根据id查询信息接口
export const queryLineById = (id) => {
  return request.$pms({
    url: '/line/selectProductLineById',
    method: 'GET',
    params: {
      id
    }
  })
}
