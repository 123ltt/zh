import request from '@/router/axios'

// 获取美工列表
export const queryArtTask = ({
  current,
  size,
  params
}) => {
  return request.$pms({
    url: '/artDesignerTask/page',
    method: 'POST',
    params: { // 地址栏
      current,
      size
    },
    data: params
  })
}

// 获取美工详情
export const getArtTaskDetails = id => {
  return request.$pms({
    url: '/artDesignerTask/detail',
    method: 'GET',
    params: id
  })
}
// 创建美工任务
export const createTask = (data) => {
  return request.$pms({
    url: '/artDesignerTask/create',
    method: 'POST',
    data
  })
}
// 修改美工任务
export const updateArtDesignerTask = (data) => {
  return request.$pms({
    url: '/artDesignerTask/update',
    method: 'POST',
    data
  })
}

// 提交流程
export const submitFlow = (data) => {
  return request.$pms({
    url: '/flow/submitFlow',
    method: 'POST',
    data
  })
}

// 美工任务状态下拉列表
export const artTaskStatus = () => {
  return request.$pms({
    url: '/artDesignerTask/optionForTaskStatus',
    method: 'GET'
  })
}

// 类型下拉列表
export const optionForTaskType = () => {
  return request.$pms({
    url: '/artDesignerTask/optionForTaskType',
    method: 'GET'
  })
}

// 价格等级下拉列表
export const optionForPriceLevel = (taskTypeId) => {
  return request.$pms({
    url: '/artDesignerTask/optionForPriceLevel',
    method: 'GET',
    params: taskTypeId
  })
}

// 数量下拉列表
export const optionForNumber = () => {
  return request.$pms({
    url: '/artDesignerTask/optionForNumber',
    method: 'GET'
  })
}

/**
 * 处理任务
 * 根据flowId获取流程事件编号,用于SPU流程详情页底部审核选项的初始化
 * @params {object} params
 */
export const getFlowProcess = flowId => {
  return request.$pms({
    url: '/flow/getFlowCurrentEvent',
    params: flowId
  })
}

/**
 * 根据美工和日期查询
 * current 分页
 * size 页数
 * handler 美工名称
 * date 日期
 */
export const getByArtDesignerAndDate = ({
  current,
  size,
  artDesignerId,
  date
}) => {
  return request.$pms({
    url: '/artDesignerTask/getByArtDesignerAndDate',
    params: {
      current,
      size,
      artDesignerId,
      date
    }
  })
}

/**
 * 查询美工排班计划
 */
export const getPlanList = () => {
  return request.$pms({
    url: '/artDesignerTask/getPlan'
  })
}
/**
 *
 * @param {keyword} param0  搜索的关键词
 * @param {current} 分页 1
 * @param {size} 页数 2000
 */
export const getOptionForHandler = ({ keyword, current, size }) => {
  return request.$pms({
    url: '/artDesignerTask/optionForHandler',
    params: {
      keyword, current, size
    }
  })
}

/**
 *  指派任务时处理人下拉列表
 */
export const optionForHandlerByDirectorId = () => {
  return request.$pms({
    url: '/artDesignerTask/optionForHandlerByDirectorId'
  })
}
