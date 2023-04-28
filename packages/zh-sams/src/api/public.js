import request from '@/router/axios'
// 字典下拉值
/**
 * sams_company_nature 公司属性
    sams_company_type 公司类型
    sams_net_type 网络类型
    sams_payment_type 收款方式
    sams_yes_or_not 是与否
    sams_annual_audit_date 工商年审日期
 */
export const dictionary = (code) => {
  return request.$sams({
    url: '/store/dict/options',
    method: 'POST',
    data: code
  })
}
// 币种
export const currencyList = () => {
  return request.$sams({
    url: '/store/currency/list',
    method: 'get'
  })
}
// 获取公司列表 category = 2
export const compList = (category) => {
  return request.$ams({
    url: '/org/list?category=2',
    method: 'get',
    params: category
  })
}

/*
*根据销售id拿到对应销售主管和销售经理
*/
export const supervisorManagerList = (userId) => {
  return request.$ams({
    url: '/user/supervisor-manager-list',
    method: 'GET',
    params: userId
  })
}

/**
 * 查询所有层级的类目
 * @param {boolean} isCache 是否优先从缓存中读取数据，默认为`false`
 */
export const getCategorListLevel1 = () => {
  return request.$pms({
    url: '/category/getChildrenById',
    method: 'GET'
  })
}
