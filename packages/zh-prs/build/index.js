const routeTool = require('route-tool').default

routeTool({
  routesWritePath: './src/route.js',
  systemName: 'prs',
  watch: !process.env.npm_config_unwatch,
  apiPrefix: [['$prs', 'prs']]
})
