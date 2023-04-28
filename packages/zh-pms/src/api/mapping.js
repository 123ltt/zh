import request from '@/plugins/request'
import { getChildren, queryCategory } from '@/api/categoryManagement'

function recursion(d, childrenKey, cb) {
  if (Array.isArray(d)) {
    d.forEach(item => recursion(item, childrenKey, cb))
  } else {
    cb(d)
    if (d[childrenKey]) recursion(d[childrenKey], childrenKey, cb)
  }
}

// 将映射关系的数据合并到类目数据中
function refactorPmsTree(res, params) {
  res.data = res.data || []
  return new Promise(resolve => {
    // 递归获取叶子结点的id
    const pmsIds = []
    recursion(res.data, 'children', item => {
      if (item.isLeaf) {
        pmsIds.push(item.id)
      }
    })

    if (pmsIds.length === 0) {
      recursion(res.data, 'children', item => {
        item.isMapped = false
        item.mappedPathIds = []
      })
      resolve(res)
    } else {
      // 如果接口返回的节点中含有叶子节点，则去获取叶子节点的映射关系
      getPlatformMapped({
        categoryIds: pmsIds,
        platformCode: params.platCode,
        siteCode: params.siteCode
      }).then(res2 => {
        // 递归将映射关系合并到叶子节点数据中
        recursion(res.data, 'children', item => {
          const d = res2.data.find(el => el.categoryId - item.id === 0)
          if (d) {
            item.isMapped = true
            item.mappedPathIds = (d.pcCategoryIdPath || '').split(',')
          } else {
            item.isMapped = false
            item.mappedPathIds = []
          }
        })
        resolve(res)
      }).catch(() => {
        resolve(res)
      })
    }
  })
}

/**
 * 获取pms类目树
 * @param {string} id
 */
export function getPmsTree(id, params) {
  return getChildren(id).then(res => refactorPmsTree(res, params))
}

/**
 * 搜索 pms类目树
 * @param {string} name
 */
export function searchPmsTree(name, params) {
  return queryCategory(name).then(res => refactorPmsTree(res, params))
}

/**
 * @typedef {object} options
 * @property {string} platform 平台code
 * @property {string} site 站点code
 *
 * @param {string | number} parentId 类目ID,为空时，返回一级类目 （amazon 使用父级 id 字段替代 categoryId）
 * @param {options} params
 * @returns
 */
export function getPlatformCategory(parentId, params) {
  return request.$pms({
    url: '/category/getPlatformCategoryList',
    method: 'post',
    data: {
      categoryId: parentId || null,
      ...params
    }
  })
}

/**
 * 按平台站点 搜索类目
 * @param {string} categoryName 搜索关键词
 * @param {options} params
 * @returns
 */
export function searchPlatformCategory(categoryName, params) {
  return request.$pms({
    url: '/category/getPlatformCategoryByName',
    method: 'post',
    data: {
      categoryName,
      ...params
    }
  })
}

/**
 * 保存 平台类目映射
 * @typedef {object} data
 * @property {string} categoryId pms类目ID
 * @property {string} pcCode 刊登类目ID
 * @property {string} pcName 类目名称树（目前确认是英文名）
 * @property {string} pcPath 刊登类目ID树 逗号分隔
 * @property {string} platformCode 平台CODE
 * @property {string} [siteCode] 站点CODE
 *
 * @param {data} data
 */
export function saveMapping(data) {
  return request.$pms({
    url: '/categoryPublish/save',
    method: 'post',
    data
  })
}

/**
 * 获取 根据pms的id获取与 平台类目 的映射关系
 * @typedef {object} mappedData
 * @property {string} platformCode 平台code
 * @property {string} [siteCode] 站点code
 * @property {string[]} categoryIds pms 类目ID 数组
 *
 * @param {mappedData} data
 */
export function getPlatformMapped(data) {
  return request.$pms({
    url: '/categoryPublish/getBindCategory',
    method: 'post',
    data
  })
}
