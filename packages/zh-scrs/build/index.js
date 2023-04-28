const routeTool = require('route-tool').default

routeTool({
  routesWritePath: './src/route.js',
  systemName: 'scrs',
  watch: !process.env.npm_config_unwatch,
  apiPrefix: [['$scrs', 'scrs-fbwords']]
})
