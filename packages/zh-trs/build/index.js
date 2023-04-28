const routeTool = require('route-tool').default

routeTool({
  routesWritePath: './src/route.js',
  systemName: 'trs',
  watch: !process.env.npm_config_unwatch,
  apiPrefix: [['$trs', 'ctrs']]
})
