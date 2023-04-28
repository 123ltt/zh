const routeTool = require('route-tool').default

routeTool({
  routesWritePath: './src/route.js',
  systemName: 'oms',
  watch: !process.env.npm_config_unwatch,
  apiPrefix: [['$oms', 'oms']]
})
