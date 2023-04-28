import request from '@/router/axios'

// 列表信息分页接口
export const getList = (current, size, params) => {
  return request.$pss({
    url: '/evalRule/page',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

// 规则名称
export const getName = () => {
  return request.$ams({
    url: '/dict-biz/dictionary?code=pss_eval_rule_name',
    method: 'get'
  })
}

// 新增保存
export const save = (row) => {
  return request.$pss({
    url: '/evalRule/save',
    method: 'post',
    data: row
  })
}

// 修改
export const update = (row) => {
  return request.$pss({
    url: '/evalRule/update',
    method: 'post',
    data: row
  })
}

// 删除
export const remove = (ids) => {
  return request.$pss({
    url: '/evalRule/deleteDraft',
    method: 'post',
    params: {
      ids
    }
  })
}

// 详情
export const getDetail = (id) => {
  return request.$pss({
    url: '/evalRule/detail',
    method: 'get',
    params: {
      id
    }
  })
}
