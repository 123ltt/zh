import request from '@/router/axios'

// 列表信息分页接口
export const getList = (current, size, params) => {
  return request.$pss({
    url: '/factoryEvalContent/page',
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
    url: '/dict-biz/dictionary?code=pss_factory_eval_type',
    method: 'get'
  })
}

// 1,2级新增保存
export const save = (row) => {
  return request.$pss({
    url: '/factoryEvalContent/save',
    method: 'post',
    data: row
  })
}

// 3级新增保存
export const confirm = (row) => {
  return request.$pss({
    url: '/factoryEvalStandard/saveBatch',
    method: 'post',
    data: row
  })
}

// 三级列表信息分页接口
export const getreviewList = (contentId) => {
  return request.$pss({
    url: '/factoryEvalStandard/list',
    method: 'get',
    params: {
      contentId
    }
  })
}

// 删除
export const remove = (ids) => {
  return request.$pss({
    url: '/factoryEvalContent/deleteDraft',
    method: 'post',
    params: {
      ids
    }
  })
}

// 修改
export const update = (row) => {
  return request.$pss({
    url: '/factoryEvalContent/update',
    method: 'post',
    data: row
  })
}

// 详情
export const getDetail = (id) => {
  return request.$pss({
    url: '/factoryEvalContent/detail',
    method: 'get',
    params: {
      id
    }
  })
}
