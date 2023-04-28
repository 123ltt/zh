import request from '@/router/axios'
/**
 * module: 违禁词库
 * 后端开发： 吴慧强
 * 文档地址： http://showdoc.zehui.local/web/#/68?page_id=447
 **/
// 分页获取违禁词列表接口
export function getFbwordsList(data) {
  return request.$scrs({
    url: '/fbwords/list',
    method: 'get',
    params: data
  })
}

// 违禁词新增接口
export function addFbwords(data) {
  return request.$scrs({
    url: '/fbwords/save',
    method: 'post',
    data
  })
}

// 违禁词修改接口
export function updateFbwords(data) {
  return request.$scrs({
    url: '/fbwords/update',
    method: 'post',
    data
  })
}

// 违禁词删除接口
export function removeFbwords(data) {
  return request.$scrs({
    url: '/fbwords/remove',
    method: 'post',
    params: data
  })
}

// 获取单个违禁词详情接口
export function getFbwordsDetail(data) {
  return request.$scrs({
    url: '/fbwords/detail',
    method: 'get',
    params: data
  })
}

// 获取字典配置的平台和站点列表
// export function getDictionary(code, appCode) {
//   return request.$cams({
//     url: '/dict-biz/dictionary',
//     method: 'get',
//     params: { code, appCode }
//   })
// }
