import request from '@/router/axios'
/**
 * 模板类目列表接口
*/
export function relationCategoryPage({ templateName, browseNodeId, browseNodeName, current, size }) {
  return request.$lmsAmazon({
    url: '/amazon/relation-category/page',
    method: 'get',
    params: { templateName, browseNodeId, browseNodeName, current, size }
  })
}

// 删除关联类目接口
export const remove = (id) => {
  return request.$lmsAmazon({
    url: '/amazon/relation-category/delete',
    method: 'post',
    params: {
      id
    }
  })
}
