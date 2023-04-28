// 检查域名是否是oss的域名

/**
 * 简易版的发布订阅
 */
class Emitter {
  cache = []

  /**
   * @param {string} name 事件名称
   * @param {function} cb 回调
   * @returns
   */
  once(name, cb) {
    if (typeof cb !== 'function') return
    const d = this.cache.find(item => item.name === name)
    d
      ? d.callbacks.push(cb)
      : this.cache.push({
        name,
        type: 'once',
        callbacks: [cb]
      })
  }

  emit(name, ...args) {
    const index = this.cache.findIndex(item => item.name === name)
    if (index > -1) {
      this.cache[index].callbacks.forEach(cb => cb.apply(undefined, args))
      if (this.cache[index].type === 'once') this.cache.splice(index, 1)
    }
  }
}

class CheckIsOssLink {
  emitter = new Emitter()
  /** 存储已检测过的域名 */
  cache = new Map()
  /** 事件队列 */
  quene = []
  /** 是否正在检测中 */
  isChecking = false

  /**
   * 检测链接是否属于oss
   * @param {string} url 传入链接
   * @return {Promise<boolean>}
   */
  isOss(url) {
    if (/^blob:/i.test(url)) return Promise.resolve(false)

    url = (url || '').toLowerCase()
    const uri = this.parseUrl(url)

    if (!uri) return Promise.resolve(false)
    if (this.cache.has(uri.host)) return Promise.resolve(this.cache.get(uri.host))

    if (!this.isChecking) {
      this.isChecking = true
      this.load(url)
    } else {
      this.quene.push(url)
    }

    return new Promise(resolve => {
      this.emitter.once(uri.host, resolve)
    })
  }

  parseUrl(url = '') {
    try {
      return new URL(url)
    } catch (err) {}
    return null
  }

  load(src) {
    const parser = this.parseUrl(src)
    if (!parser) return this.next()

    const host = parser.host
    if (this.cache.has(host)) {
      this.next()
      this.emitter.emit(host, this.cache.get(host))
      return
    }

    window.__OSS = false
    const script = document.createElement('script')
    script.src = '//' + host + '/ping.js' // 跟随页面的协议

    script.onload = () => {
      this.cache.set(host, window.__OSS)
      this.emitter.emit(host, window.__OSS)
      window.__OSS = false
      document.body.removeChild(script)
      this.next()
    }
    script.onerror = () => {
      this.cache.set(host, false)
      this.emitter.emit(host, false)
      document.body.removeChild(script)
      this.next()
    }
    document.body.appendChild(script)
  }

  next() {
    if (this.quene.length === 0) {
      this.isChecking = false
      return
    }

    this.load(this.quene.shift())
  }
}

/**
 * 检测链接是否属于oss
 */
export default new CheckIsOssLink()
