import request from '@/router/axios'

// 查询属性表接口
export const queryAttr = ({
  attrType,
  showType,
  configType,
  attrName,
  status,
  type,
  cutType,
  current,
  size
}, componentInstance) => {
  return request.$pms({
    url: '/attr/selectAttributePage',
    method: 'GET',
    params: {
      attrType,
      showType,
      configType,
      attrName,
      status,
      type,
      cutType,
      current,
      size
    }
  }, componentInstance)
}

/**
 * 获取要修改的属性信息
 * @param {string | string[]} attrId
 */
export const querryModifyAttr = attrId => {
  return request.$pms({
    url: '/attr/selectAttributeAndItem',
    method: 'post',
    data: {
      attrId: typeof attrId === 'string' ? [attrId] : attrId
    }
  })
}

// 修改属性接口
export const modifyAttr = ({ id, attrName, attrNameEn, requiredNo, status, productCutItemList }) => {
  return request.$pms({
    url: '/attr/update',
    method: 'post',
    data: {
      id, attrName, attrNameEn, requiredNo, status, productCutItemList
    }
  })
}

// 删除属性接口
export const delAttr = attrId => {
  return request.$pms({
    url: '/attr/deleteDecide',
    method: 'post',
    meta: {
      isSerialize: true
    },
    data: {
      attrId
    }
  })
}

// 新增属性接口
// {"attrType":1,"showType":2,"configType":2,"attrName":"颜色3","fieldName":"颜色3","cutType":1}
export const addAttr = data => {
  return request.$pms({
    url: '/attr/save',
    method: 'post',
    data
  })
}

// 新增取值接口
// {"cutName":"红色","attributeId":1302792293761277954,"cutTypePerson":1,"defaultValue":"是"}
export const addCut = ({ cutName, attributeId, cutTypePerson, defaultValue }) => {
  return request.$pms({
    url: '/item/save',
    method: 'post',
    data: {
      cutName, attributeId, cutTypePerson, defaultValue
    }
  })
}

// 删除取值接口
export const delCut = ids => {
  return request.$pms({
    url: '/item/remove',
    method: 'post',
    data: {
      ids
    }
  })
}

// 批量插入取值接口
export const batchAddCut = data => {
  return request.$pms({
    url: '/item/insertCutItemList',
    method: 'post',
    data
  })
}

// 根据属性名称查询id接口
export const getAttrId = attrName => {
  return request.$pms({
    url: '/attr/getAttrIdByAttrName',
    method: 'get',
    params: {
      attrName
    }
  })
}

// 根据属性名称查询id接口
export const updateStatus = (id, status) => {
  return request.$pms({
    url: '/attr/updateAttributeById',
    method: 'post',
    data: {
      id, status
    }
  })
}

/**
 * 判断属性取值是否已经跟sku挂钩
 * @param {string} fieldId 字段的取值id
 */
export const ifCanDeleteField = fieldId => request.$pms({
  url: `/attr/flagCutValue?fieldId=${fieldId}`
})
