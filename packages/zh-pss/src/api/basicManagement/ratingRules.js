import request from '@/router/axios'

// 列表信息分页接口
export const getList = (current, size, params) => {
  return request.$pss({
    url: '/gradeRule/list',
    method: 'get',
    params: {
      ...params,
      current,
      descs: 'id',
      size
    }
  })
}

// 供应商接口
export const getGrade = () => {
  return request.$pss({
    url: '/gradeRule/list/grade',
    method: 'get'
  })
}

// 新增保存
export const save = (row) => {
  return request.$pss({
    url: '/gradeRule/save',
    method: 'post',
    data: row
  })
}

// 修改
export const update = (row) => {
  return request.$pss({
    url: '/gradeRule/update',
    method: 'post',
    data: row
  })
}

// 删除
export const remove = (ids) => {
  return request.$pss({
    url: '/gradeRule/deleteDraft',
    method: 'post',
    params: {
      ids
    }
  })
}

// 详情
export const getDetail = (id) => {
  return request.$pss({
    url: '/gradeRule/detail',
    method: 'get',
    params: {
      id
    }
  })
}
