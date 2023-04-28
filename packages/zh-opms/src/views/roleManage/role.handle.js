export const buttonAll = (data, value) => {
  for (const item of data) {
    if (item.buttons && item.buttons.length) {
      item.buttons.forEach(item => {
        item.buttonCheck = value
      })
    }
    if (item.children) {
      buttonAll(item.children, value)
    }
  }
}
export const checkAll = (data, checked) => {
  for (const x of data) {
    x.pageCheck = checked
    if (x.children) {
      checkAll(x.children, checked)
    }
  }
}
// 查找父级函数
export const getParent = (data2, nodeId2) => {
  var arrRes = []
  if (data2.length === 0) {
    if (nodeId2) {
      arrRes.push(data2)
    }
    return arrRes
  }
  const rev = (data, nodeId) => {
    for (var i = 0, length = data.length; i < length; i++) {
      const node = data[i]
      if (node.id === nodeId) {
        arrRes.push(node)
        rev(data2, node.parentId)
        break
      } else {
        if (node.children) {
          rev(node.children, nodeId)
        }
      }
    }
    return arrRes
  }
  arrRes = rev(data2, nodeId2)
  return arrRes
}
