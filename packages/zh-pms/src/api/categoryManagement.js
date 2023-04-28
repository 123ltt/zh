import request from '@/router/axios'

/**
 * 查询所有层级的类目
 * @param {boolean} isCache 是否优先从缓存中读取数据，默认为`false`
 */
export const getCategorAll = (isCache = false) => {
  return request.$pms({
    url: '/category/getAll',
    recache: !isCache

  })
}

// 根据类目id查询子类目
export const getChildren = id => {
  if (id === 'STATICID') return
  return request.$pms({
    url: '/category/getChildrenById',
    method: 'GET',
    params: {
      id
    }
  })
}

// 根据类目名称模糊查询
export const queryCategory = name => {
  return request.$pms({
    url: '/category/getByName',
    method: 'get',
    params: {
      name
    }
  })
}

// 新增类目 id：上级id
export const addCategory = (id, name, nameEn) => {
  return request.$pms({
    url: '/category/save',
    method: 'post',
    data: {
      id,
      name,
      nameEn
    }
  })
}
// 修改类目中英文名称 id：当前类目id
export const updateCategory = (id, name, nameEn) => {
  return request.$pms({
    url: '/category/update',
    method: 'post',
    data: {
      id,
      name,
      nameEn
    }
  })
}

// 删除类目
export const delCategory = id => {
  return request.$pms({
    url: '/category/remove',
    method: 'post',
    meta: {
      isSerialize: true
    },
    data: {
      id
    }
  })
}

// 保存类目配置的属性
export const saveAttrRelation = ({ type, relationId, attrIds }) => {
  return request.$pms({
    url: '/attrRelation/save',
    method: 'post',
    data: {
      type, relationId, attrIds
    }
  })
}

// 根据类目id查询属性
export const queryAttrRelation = (type, relationId, componentInstance) => {
  return request.$pms({
    url: '/attrRelation/getByRelationId',
    method: 'get',
    params: {
      type, relationId
    }
  }, componentInstance)
}

/**
 * 获取牛蛙的类目数据
 */
export function queryNWcategories() {
  return request.$pms({
    url: '/categoryBullfrogMapping/selectCategoryMapRelation'
  })
}

/**
 * 保存牛蛙类目映射到pms
 * @param {string} idCategoryBullfrog 牛蛙的类目id
 * @param {string} idCategory pms的类目id
 */
export function saveCategoryMapping(idCategoryBullfrog, idCategory) {
  return request.$pms({
    url: '/categoryBullfrogMapping/saveCategoryMapRelation',
    method: 'post',
    data: {
      idCategoryBullfrog,
      idCategory
    }
  })
}
