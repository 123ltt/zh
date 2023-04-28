import request from '@/router/axios'

/**
 * 查询新品列表
 * categoryIds, flowNodeNo, flowStatus, createTimeFrom, createTimeTo, createDept, createUser
 */
export const queryAudit = ({
  categoryIds,
  flowNodeNo,
  flowStatus,
  createTimeFrom,
  createTimeTo,
  createDept,
  createUser,
  current,
  size
}) => {
  return request.$pms({
    url: '/newProductApproval/queryNewProductPage',
    method: 'post',
    params: {
      current,
      size
    },
    data: {
      categoryIds,
      flowNodeNo,
      flowStatus,
      createTimeFrom,
      createTimeTo,
      createDept,
      createUser
    }
  })
}

// 根据FlowNo获取流程的环节/业务状态层级数据
// flowNo = 'FLOW_NEW_PRODUCT' 产品开发审核
// flowNo = 'FLOW_SPU-SPU' 组合SKU审核
export const getFlowNo = (flowNo = 'FLOW_NEW_PRODUCT') => {
  return request.$pms({
    url: '/flow/node/getFlowNodeNoAndBizStatusTree',
    method: 'get',
    params: {
      flowNo
    }
  })
}

// 根据flowId获取流程
export const queryFlowById = flowId => {
  return request.$pms({
    url: `/flow/getFlowTimeline?flowId=${flowId}`,
    method: 'get'
  })
}

/**
 * 查询新品处理日志分页
 * @param {string} bizNo 业务数据编号
 * @param {string} entityCode 实体编号
 * @param {number} current 当前页码
 * @param {number} size 每页条数
 */
export const queryLog = (bizNo, entityCode, current, size) => {
  return request.$pms({
    url: '/bizlog/getBizBlogPage',
    method: 'get',
    params: {
      bizNo, entityCode, current, size
    }
  })
}

// 根据新品ID查询新品详情及图片列表
export const queryAuditById = id => request.$pms({
  url: '/newProductApproval/queryNewProductAndImg',
  method: 'get',
  params: { id }
})

// 修改新品详情
export const updateAudit = data => request.$pms({
  url: '/newProductApproval/updateNewProduct',
  method: 'post',
  data: data
})

// data: {ids: [],remark: ''}
// 批量备注 - 产品开发
export const batchRemark = data => request.$pms({
  url: '/newProductApproval/batchRemark',
  method: 'post',
  data: { data }
})

// 【通用审核】(除开发主管审核需采样时的审核)
export const generalAudit = ({ newProductId, flowId, eventNo, remark }) => request.$pms({
  url: `/newProductApproval/submitFlow/${newProductId}`,
  method: 'post',
  data: {
    flowId, eventNo, remark
  }
})

// 产品主管审核通过且需要采样时的审核
export const directorAudit = ({ flowId, eventNo, remark }) => request.$pms({
  url: '/newProductApproval/newProductAudit4DevSupervisorSamplingAudit',
  method: 'post',
  data: {
    flowId, eventNo, remark
  }
})

// 安全审核信息保存
export const saveSafeInfo = (newProductId, data) => request.$pms({
  url: '/newProductApproval/saveSafeInfo',
  method: 'post',
  params: { id: newProductId },
  data
})

/**
 * 重新提交审核
 * @param {string} flowId 流程ID
 * @param {string} newProductId 新品ID
 */
export const resubmitAudit = (flowId, newProductId) => request.$pms({
  url: '/newProductApproval/resubmitAudit',
  method: 'post',
  data: { flowId, newProductId }
})

/**
 * 修改新品图片列表信息
 * @param {string} newProductId 新品ID
 * @param {string} imageUrl 图片url
 * @param {boolean}} isPrime 是否主图
 */
export const updateImages = (newProductId, data) => request.$pms({
  url: '/newProductApproval/updateNewProductImage',
  method: 'post',
  params: { id: newProductId },
  data
})

/**
 * 获取SPU,SKU审核列表
 * @param {object} data 请求的body
 * @param {object} params 请求的url参数
 */
export function getSXUAuditList(data, params) {
  return request.$pms({
    url: '/sku/queryFlowToDoPage',
    method: 'post',
    params,
    data
  })
}

/**
 * 获取环节列表数据
 * @param {'FLOW_SPU' | 'FLOW_NEW_PRODUCT' | 'FLOW_ART_DESIGNER_TASK'} flowNo
 * @description
 *  `FLOW_SPU`: SPU/SKU/组合SKU 审核，
 *  `FLOW_SPU`: 产品开发 审核，
 *  `FLOW_SPU`: 美工任务 审核
 */
export function getFlowList(flowNo) {
  return request.$pms({
    url: '/flow/node/getFlowNodeNoAndBizStatusTree',
    params: {
      flowNo
    }
  })
}

/**
 * 根据flowId获取流程事件编号,用于SPU流程详情页底部审核选项的初始化
 * @param {string} flowId 流程ID
 */
export function getFlowEventById(flowId) {
  return request.$pms({
    url: '/flow/getFlowCurrentEvent',
    params: { flowId }
  })
}

/**
 * @param {object} data
 * @param {string} data.flowId 流程ID
 * @param {string} data.eventNo 事件编号
 * @param {string} [data.nextUserId] 下一环节处理人工号
 * @param {string} [data.remark] 备注信息
 * @param {object} [data.bizData] 要更新的业务信息
 */
export function submitFlow(data) {
  return request.$pms({
    url: '/flow/submitFlow',
    method: 'post',
    data
  })
}

/**
 * 批量备注信息
 * @param {object} data post数据
 * @param {array} data.ids 数据id
 * @param {string} data.remark 备注信息
 */
export function submitBatchRemark(data) {
  return request.$pms({
    url: '/sku/batchRemark',
    method: 'post',
    data: { data }
  })
}
