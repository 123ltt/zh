import request from '@/router/axios'

/**
 *
 * @param {String} code 请求具体字典的参数
 */
export const getDictBiz = (code) => {
  return request.$ims({
    url: '/dict-biz/dictionary?code=' + code,
    method: 'get'
  })
}

/**
 *
 * @param 请求仓库名称
 */
export const getAllEnableWarehouse = (code) => {
  return request.$ims({
    url: '/warehouse/getAllEnableWarehouse',
    method: 'get'
  })
}

/**
 * @param  请求业务类型
 */
export const getType = (label) => {
  return request.$ims({
    url: '/businessType/list',
    method: 'get',
    params: {
      label
    }
  })
}

/**
 *
 * @param 请求组织架构
 */
export const getOrg = () => {
  return request.$ims({
    url: '/tenant/getTenantOrganizationTree',
    method: 'get'
  })
}

// 主要类目接口
export const getCateGoryChild = () => {
  return request.$ims({
    url: '/category/getCateGoryChild',
    method: 'get'
  })
}
