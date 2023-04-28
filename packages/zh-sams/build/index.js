const routeTool = require('route-tool').default

routeTool({
  routesWritePath: './src/route.js',
  systemName: 'sams',
  watch: !process.env.npm_config_unwatch,
  apiPrefix: [['$sams', 'sams']]
})
