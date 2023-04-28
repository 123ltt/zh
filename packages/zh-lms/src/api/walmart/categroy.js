import request from '@/router/axios'
/**
 * 获取类目列表
 * @param {*} data
 * @returns
 */
export const getCategoryList = (data) => request.$lmsWalmart({
  url: '/walmartCategory/list',
  method: 'post',
  data
})
/**
 *类目毛利编辑
 * @param {*} grossProfit
 * @param {*} id
 * @returns
 */
export const updateGrossProfit = ({ id, grossProfit }) => request.$lmsWalmart({
  url: '/walmartCategory/updateGrossProfit',
  method: 'POST',
  data: {
    id,
    grossProfit
  }
})
/**
 * 类目对照
 * @param {*} param0
 * @returns
 */
export const saveCategoryContrast = ({ id, productCategoryId }) => request.$lmsWalmart({
  url: '/walmartCategory/updateProductCategory',
  method: 'post',
  data: {
    id,
    productCategoryId
  }
})
/**
 * 根据产品类目获取平台类目
 * @param {*} param0
 * @returns
 */
export const checkCategory = ({ productCategoryId }) => request.$lmsWalmart({
  url: '/walmartCategory/getByProductCategoryId',
  method: 'get',
  params: {
    productCategoryId
  }
})
/**
 *类目日志-分页
 * @returns
 */
export const walmartLog = (params) => request.$lmsWalmart({
  url: '/walmartOpsLog/list',
  method: 'get',
  params
})
