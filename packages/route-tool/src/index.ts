/**
 * 根据 src/views 目录下的文件命名规则来生成路由
 * 页面路由： 以 _ 开头 .vue 结尾的文件视为路由
 * newPage路由： 以 ~ 开头 .vue 结尾的文件视为路由
 * 注意：文件名必须符合 /^[_~]?\w+\.vue$/ 规则
 */
import { promises as Fs } from 'fs'
import * as Path from 'path'
import chokidar from 'chokidar'
import generateRequest from './generate/request'
import { isDirectory, prefixIntersection } from './util'

type RouteInfo = { route: string; file: string }

type apiPrefixArr = [string, string][]
type apiPrefixFn = (isSaas: boolean) => apiPrefixArr

export type APIPrefix = apiPrefixArr | apiPrefixFn

type Options = {
  /** 保存路由文件的路径（相对项目根目录） */
  routesWritePath: string;
  /** chunkName 取目录的深度。默认 `1` */
  chunkDepth?: number;
  /** 系统名称，用作 chunkName 的第一级 */
  systemName: string;
  /** 是否启用watch，默认`true` */
  watch?: boolean;
  /** api前缀映射关系 */
  apiPrefix: apiPrefixArr | apiPrefixFn;
  /** 额外导出的数据 */
  exports?: { [key: string]: string }
}

class ToolRoute {
  ready = false
  options: Options;

  /**
   * @param {string} routesWritePath 存储路由的文件路径（相对项目根目录）
   */
  constructor (options: Options) {
    this.options = Object.assign({
      chunkDepth: 1,
      systemName: require(Path.join(process.cwd(), 'package.json')).name,
      watch: true
    }, options)
  }

  start () {
    this.generate()
    if (this.options.watch) this.watch()
  }

  watch () {
    chokidar
      .watch('src/views/**/*.vue', {
        cwd: process.cwd()
      })
      .on('ready', () => {
        this.ready = true
      })
      .on('add', filepath => {
        if (this.ready && /\.vue$/i.test(filepath)) {
          this.generate()
        }
      })
  }

  async generate () {
    const { routes, pageRoutes } = await this.getRouteMapping()
    let fileContent = this.routeTemplate(
      routes.map(item => this.routeItemTemplate(item, 2)),
      pageRoutes.map(item => this.routeItemTemplate(item, 2, false))
    )

    let apiPrefixStr = ''
    if (Array.isArray(this.options.apiPrefix)) {
      apiPrefixStr = `JSON.parse('${JSON.stringify(this.options.apiPrefix)}')`
    } else {
      apiPrefixStr = this.options.apiPrefix.toString()
    }

    fileContent += `\nexport const apiPrefix = ${apiPrefixStr}\n`

    Object.entries(this.options.exports || {}).forEach(([key, value]) => {
      fileContent += `export const ${key} = ${value}\n`
    })

    await Fs.writeFile(Path.join(process.cwd(), this.options.routesWritePath), fileContent, 'utf8')
    console.log('\x1B[42;30m DONE \x1B[;m', 'Write routes file success.')
  }

  /**
   * 获取文件与路由的映射关系
   */
  async getRouteMapping () {
    const prepend = this.options.systemName || ''
    const viewsDir = Path.join(process.cwd(), 'src/views')

    // 从目录中过滤出路由（文件以 _ 开头 .vue 结尾 则视为路由对应的文件）
    const routes: RouteInfo[] = []
    // 从目录中过滤出路由（文件以 ~ 开头 .vue 结尾 则视为路由对应的文件）($newPage用到)
    const pageRoutes: RouteInfo[] = []
    const cacheAllRoutesKey: { [key: string]: boolean } = {}

    if (!await isDirectory(viewsDir)) return { routes, pageRoutes, cacheAllRoutesKey }

    const dirp = async (dirPath: string, dirs: string[] = []) => {
      const list = await Fs.readdir(dirPath)
      for (const item of list) {
        const p = Path.join(dirPath, item)
        const stat = await Fs.stat(p)
        if (stat.isFile()) {
          if (/^_\w+\.vue$/.test(item)) {
            routes.push({
              route: '/' + prepend + '/' + dirs.concat(item.slice(1, -4)).join('/'),
              file: '@/views/' + dirs.concat(item).join('/')
            })
            if (dirs.length > 0) {
              cacheAllRoutesKey[dirs[0]] = true
            }
          } else if (/^~\w+\.vue/.test(item)) {
            pageRoutes.push({
              route: '/_np/' + prepend + '/' + dirs.concat(item.slice(1, -4)).join('/'),
              file: '@/views/' + dirs.concat(item).join('/')
            })
          }
        } else {
          await dirp(p, dirs.concat(item))
        }
      }
    }
    await dirp(viewsDir)
    return { routes, pageRoutes, cacheAllRoutesKey: Object.keys(cacheAllRoutesKey) }
  }

  /* 将路径转换成大驼峰，如将 /home/index 转换成 HomeIndex */
  pathToUpperCamelCase (pathname: string) {
    return pathname.replace(/\?.+$/, '').split(/[/-]/).map(el => el.slice(0, 1).toUpperCase() + el.slice(1)).join('')
  }

  getChunkName (routePath = '', depth = 1) {
    routePath = routePath.replace(/^\/_np\//, '')
    const arr = routePath.split('/')
    if (depth === 0) {
      return arr[arr.length - 1]
    }
    const paths = arr.filter(Boolean)
    if (this.options.systemName) paths.unshift(this.options.systemName)
    return prefixIntersection(paths.slice(0, depth)).join('.')
  }

  /* 单个路由模板 */
  routeItemTemplate ({ route = '', file = '' }, spaceCount = 0, nameField = true) {
    const spaceStr = ' '.repeat(spaceCount)
    return [
      '{',
      nameField ? `  name: '${this.pathToUpperCamelCase(route)}',` : '',
      `  path: '${route}',`,
      `  component: () => import(/* webpackChunkName: "${this.getChunkName(route, this.options.chunkDepth)}" */ '${file}')`,
      '}'
    ].filter(Boolean).map(item => spaceStr + item).join('\n')
  }

  routeTemplate (routes: string[], pageRoutes: string[]) {
    return `// 该文件通过route-tool脚本自动生成。📌请勿手动修改
export const routes = [
${routes.join(',\n')}
].map(item => {
  item.meta = Object.assign(item.meta || {}, { $keepAlive: true })
  return item
})

export const pageRoutes = [
${pageRoutes.join(',\n')}
].map(item => {
  item.meta = { $keepAlive: true }
  return item
})
`
  }
}

/**
 * @param {Options} options
 */
export default (options: Options) => {
  generateRequest(options.apiPrefix)
  new ToolRoute(options).start()
}
