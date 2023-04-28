import request from '@/router/axios'

// 列表信息分页接口
export const getList = (current, size, params) => {
  return request.$ltms_provider({
    url: '/base/freightLp/list',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}
// 保存
export const save = (params) => {
  return request.$ltms_provider({
    url: '/base/freightLp/save',
    method: 'post',
    data: params
  })
}

// 修改
export const update = (params) => {
  return request.$ltms_provider({
    url: '/base/freightLp/update',
    method: 'post',
    data: params
  })
}

// 提交
export const submit = (params) => {
  return request.$ltms_provider({
    url: '/base/freightLp/submit',
    method: 'post',
    data: params
  })
}

// 删除
export const remove = (ids) => {
  return request.$ltms_provider({
    url: '/base/freightLp/remove',
    method: 'post',
    params: {
      ids
    }
  })
}
// 驳回
export const reject = (obj) => {
  return request.$ltms_provider({
    url: '/base/freightLp/reject',
    method: 'post',
    data: obj
  })
}

// 通过
export const audit = (obj) => {
  return request.$ltms_provider({
    url: '/base/freightLp/audit',
    method: 'post',
    data: obj
  })
}
