
// 宽度超过此值 则认为是需要大图
const CRITICAL_POINT = 100

const rules = [
  // lazada
  {
    test: /slatic\.net$/i,
    fn(url, width, height) {
      return url.replace(/(\.[a-z\d]+)$/i, `$1_${width}x${height}$1`)
    }
  },
  // Walmart
  {
    test: /walmartimages\.com$/i,
    fn(url, width, height) {
      return url + `?odnHeight=${width}&odnWidth=${height}&odnBg=ffffff`
    }
  },
  // wish
  {
    test: /wish\.com$/i,
    fn(url, width, height) {
      return url.replace(/-(original|normal)(\.[a-z\d]{2,6})/i, `-${width > CRITICAL_POINT ? 'normal' : 'tiny'}$2`)
    }
  },
  // eBay
  {
    test: /ebayimg\.com$/i,
    fn(url, width, height) {
      const matched = url.match(/(https?:\/\/[^/]+).+\/([^/]+)\/[^/]+$/i)
      if (matched) {
        return `${matched[1]}/images/g/${matched[2]}/s-l${width}.jpg`
      }
      return url
    }
  },
  // shopee
  {
    test: /\.shopee\./i,
    fn(url, width, height) {
      return url + (width > CRITICAL_POINT ? '' : '_tn')
    }
  },
  // SMT
  {
    test: /alicdn\.com$/i,
    fn(url, width, height) {
      return url + `_${width}x${height}Q90.jpg`
    }
  }
]

/**
 * 解析平台图片链接，根据宽高转成小图或大图
 * @param {string} url 原图链接
 * @param {number} [width] 宽。默认`50`
 * @param {number} [height] 高。默认`50`
 * @returns
 */
export function platformLink(url, width = 50, height = 50) {
  try {
    const uri = new URL(url)
    const one = rules.find(item => item.test.test(uri.hostname.toLowerCase()))
    return one ? one.fn(url, width, height) : url
  } catch (err) {
    return url
  }
}

/**
 * 解析oss图片链接，根据宽高转成小图或大图
 * @param {string} url 原图链接
 * @param {number} [width] 宽。默认`50`
 * @param {number} [height] 高。默认`50`
 * @param {number} [quality] 图片显示质量。默认`90`
 * @returns
 */
export function ossLink(url, width = 50, height = 50, quality = 90) {
  try {
    const obj = new URL(url)
    const ossParams = `x-oss-process=image/resize,h_${height},w_${width}/quality,q_${quality}`
    const params = (obj.search ? (obj.search + '&') : '?') + ossParams
    return obj.origin + obj.pathname + params + obj.hash
  } catch (err) {
    return url
  }
}
