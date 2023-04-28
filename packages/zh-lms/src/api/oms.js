import request from '@/router/axios'
/**
 * @description 查询SKU前后缀对应的仓库和国家
 */
export function getSkuAffix(data) {
  return request.$oms({
    url: '/skuResolvingRule/resolveSkuAffix',
    method: 'post',
    data
  })
}
