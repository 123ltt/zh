const webpack = require('webpack')
const CopyDistLibPlugin = require('./build/plugins/copyDistLibPlugins')
const GetVersionInfos = require('./build/getVersionInfos')
const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  pages: {
    index: {
      entry: 'src/main.js',
      template: isDev ? 'public/index.dev.html' : 'public/index.html'
    }
  },
  // 路径前缀
  publicPath: '/',
  lintOnSave: true,
  productionSourceMap: false,
  css: {
    loaderOptions: {
      sass: {
        // 将element-ui的sass变量全局注入
        prependData: '@import "@/styles/element-var.scss";'
      }
    }
  },
  configureWebpack (config) {
    if (isDev) {
      config.devtool = 'inline-cheap-source-map'
    }
    config.plugins.push(
      new webpack.DefinePlugin({
        __VERSION_INFO__: JSON.stringify(GetVersionInfos())
      }),
      new CopyDistLibPlugin()
    )
  },
  chainWebpack: config => {
    if (!isDev) {
      // 正式环境忽略的打包文件
      config.externals({
        vue: 'Vue',
        'vue-router': 'VueRouter',
        vuex: 'Vuex',
        axios: 'axios',
        'element-ui': 'ELEMENT'
      })
    }
    const entry = config.entry('app')
    entry.add('babel-polyfill').end()
    entry.add('classlist-polyfill').end()
    // entry.add('@/mock').end()
  },
  /**
   * 开发模式反向代理配置（请移步至 dev.config.js 文件中修改！！！！）
   * 生产模式请使用Nginx部署并配置反向代理
   */
  devServer: isDev ? require('./dev.config') : undefined
}
