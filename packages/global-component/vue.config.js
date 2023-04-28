module.exports = {
  // 路径前缀
  publicPath: '/',
  lintOnSave: true,
  productionSourceMap: false,
  configureWebpack(config) {
    config.devtool = 'inline-cheap-source-map'
  },
  css: {
    extract: false,
    loaderOptions: {
      sass: {
        // 将element-ui的sass变量全局注入
        prependData: '@import "@/styles/element-var.scss";'
      }
    }
  }
}
