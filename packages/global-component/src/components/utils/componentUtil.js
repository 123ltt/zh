/**
 * 递归找组件
 * @typedef {import('vue').default} vue
 *
 * @param {vue} context
 * @param {string[]} names
 * @param {(ctx:vue, name:string) => boolean | void} cb 返回true则停止查找
 */
function find(context, names = [], cb) {
  if (!context) return
  if (names.includes(context.$options.name)) {
    if (cb(context, context.$options.name)) return true
  }

  if (Array.isArray(context.$children)) {
    for (let i = 0, len = context.$children.length; i < len; i++) {
      if (find(context.$children[i], names, cb)) break
    }
  }
}

/**
 * 在context中找出第一个 组件名为name 的子组件
 * @param {vue} context
 * @param {string} names
 * @return {vue}
 */
export function findComponent(context, name) {
  let c = null
  find(context, [name], (ctx) => {
    c = ctx
    return true
  })
  return c
}
