const routeTool = require('route-tool').default

routeTool({
  routesWritePath: './src/route.js',
  systemName: 'cfps',
  watch: !process.env.npm_config_unwatch,
  apiPrefix: [['$fps', 'cfps']]
})
