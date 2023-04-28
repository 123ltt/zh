const routeTool = require('route-tool').default

routeTool({
  routesWritePath: './src/route.js',
  systemName: 'platform',
  watch: !process.env.npm_config_unwatch,
  apiPrefix: [['$opms', 'opms']]
})
