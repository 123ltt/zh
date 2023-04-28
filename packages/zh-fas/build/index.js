const routeTool = require('route-tool').default

routeTool({
  routesWritePath: './src/route.js',
  systemName: 'fas',
  watch: !process.env.npm_config_unwatch,
  apiPrefix: [['$fas', 'fas']]
})
