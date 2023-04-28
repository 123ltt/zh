const routeTool = require('route-tool').default

routeTool({
  routesWritePath: './src/route.js',
  systemName: 'pps',
  watch: !process.env.npm_config_unwatch,
  apiPrefix: [['$pps', 'pps']]
})
