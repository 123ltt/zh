/**
 * 单位转换（b -> kb, kb -> mb, mb -> gb）
 * @param {number} size 大小
 */
export function exchangeSize(size) {
  if (isNaN(size)) {
    return ''
  }
  // 小于1KB
  if (size < 1024) {
    return size + 'B'
  }
  // 小于1MB
  if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) - 0 + 'KB'
  }
  // 小于1G
  if (size < 1024 * 1024 * 1024) {
    return (size / 1024 / 1024).toFixed(2) - 0 + 'MB'
  }
  return (size / 1024 / 1024 / 1024).toFixed(2) - 0 + 'GB'
}

/**
 * 根据文件获取blob url
 * @param {File} file 文件对象
 */
export function getBlobUrl(file) {
  const URL = window.URL || window.webkitURL
  return URL.createObjectURL(file)
}

/**
 * 根据图片的url获取图片的尺寸
 * @param {string|File} url 图片地址
 * @returns {Promise<{width: number, height: number}>}
 */
export function getImageDimension(url) {
  return new Promise((resolve, reject) => {
    if (typeof url === 'object') {
      url = getBlobUrl(url)
    }
    const img = new Image()

    img.onload = () => {
      const { width, height } = img
      resolve({ width, height })
    }

    img.onerror = () => {
      reject(new Error('图片加载失败，未能获取到图片尺寸'))
    }

    img.src = url
  })
}

/**
 * @param {string} componentName 组件名称
 * @param {string} fieldName images | files
 */
export function checkType(componentName, fieldName) {
  return v => {
    const msg = `${componentName}组件传入的${fieldName}的格式必须为 \`{ name: string; url: string }[]\``
    if (!Array.isArray(v)) {
      console.error(msg)
      return false
    }
    const status = v.every(({ name, url }) => typeof name === 'string' && typeof url === 'string')
    !status && console.error(msg)
    return status
  }
}

export function getFileNameFromUrl(url) {
  const m = url.match(/[a-z\d]+\.\w+$/i)
  return m ? m[0] : url.slice(-10)
}
