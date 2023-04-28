const routeTool = require('route-tool').default

routeTool({
  routesWritePath: './src/route.js',
  systemName: 'pms',
  watch: !process.env.npm_config_unwatch,
  apiPrefix: isSaas => isSaas ? [['$pms', 'pms']] : [['$pms', 'cpms']]
})
