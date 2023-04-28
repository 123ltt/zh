const routeTool = require('route-tool').default

routeTool({
  routesWritePath: './src/route.js',
  systemName: 'ers',
  watch: !process.env.npm_config_unwatch,
  apiPrefix: [['$ers', 'platform-ers']]
})
